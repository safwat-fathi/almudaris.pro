import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/entities/user.entity';
import { SignupDto } from './dto/signup.dto';
import { compare } from 'bcrypt';
import twilio from 'twilio';
import { Teacher } from '../teachers/entities/teacher.entity';

@Injectable()
export class AuthService {
  private twilioClient: twilio.Twilio;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) {
    const accountSid = process.env.ACCOUNT_SID || '';
    const authToken = process.env.AUTH_TOKEN || '';
    this.twilioClient = twilio(accountSid, authToken);
  }

  async validateUser(phone: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findForAuth(phone);
    if (user && user.password && (await compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  login(user: User) {
    const payload = { sub: user.id, role: user.role };

    // TODO: fetch user info (teacher, parent) from respected entity

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '30m' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        phone: user.phone,
        email: user.email,
      },
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify<{ sub: number; role: UserRole }>(
        token,
        {
          secret: process.env.JWT_SECRET || 'super-secret-key-change-me',
        },
      );
      const user = await this.usersService.findById(payload.sub);
      if (!user || !user.is_active) {
        throw new UnauthorizedException('User not found or inactive');
      }
      return this.login(user);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async signup(data: SignupDto) {
    const name = data.name;
    const phone = data.phone;
    const email = data.email;
    const password = data.password;
    const role = data.role;

    const userRole = role || UserRole.TEACHER;

    if (!phone) {
      throw new BadRequestException('Phone is required');
    }

    const existingUser = await this.usersService.findByPhone(phone);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const createdUser = await this.usersService.create({
      name,
      phone,
      email,
      password,
      role: userRole,
      is_active: false,
    });

    if (userRole === UserRole.TEACHER) {
      const teacherProfile = this.teacherRepository.create({
        user_id: createdUser.id,
      });
      await this.teacherRepository.save(teacherProfile);
    }

    await this.requestOtp(phone);

    return { message: 'User registered successfully. OTP sent.', phone };
  }

  async requestOtp(phone: string): Promise<void> {
    if (!phone) {
      throw new BadRequestException('Phone is required');
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log(
        `[DEV] Skipping OTP send for ${phone}. Any code will be accepted.`,
      );
      return;
    }

    const serviceSid = process.env.VERIFY_SERVICE_SID;
    if (!serviceSid) {
      throw new BadRequestException('VERIFY_SERVICE_SID is not configured');
    }

    const formattedPhone = phone.startsWith('+') ? phone : `+2${phone}`;

    try {
      await this.twilioClient.verify.v2
        .services(serviceSid)
        .verifications.create({ to: formattedPhone, channel: 'sms' });
    } catch (error) {
      console.error('Twilio verify error', error);
      throw new BadRequestException('Failed to send OTP');
    }
  }

  async verifyOtp(phone: string, otpCode: string): Promise<any> {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEV] Accepting any OTP code for ${phone}`);
    } else {
      const serviceSid = process.env.VERIFY_SERVICE_SID;
      if (!serviceSid) {
        throw new BadRequestException('VERIFY_SERVICE_SID is not configured');
      }

      const formattedPhone = phone.startsWith('+') ? phone : `+2${phone}`;

      try {
        const verificationCheck = await this.twilioClient.verify.v2
          .services(serviceSid)
          .verificationChecks.create({ to: formattedPhone, code: otpCode });

        if (verificationCheck.status !== 'approved') {
          throw new UnauthorizedException('Invalid or expired OTP');
        }
      } catch (error: any) {
        if (error instanceof UnauthorizedException) throw error;
        throw new UnauthorizedException('Invalid or expired OTP');
      }
    }

    let user = await this.usersService.findByPhone(phone);
    if (!user) {
      user = await this.usersService.create({
        phone,
        name: 'New User',
        role: UserRole.PARENT,
        is_active: true,
      });
    } else if (!user.is_active) {
      user =
        (await this.usersService.update(user.id, { is_active: true })) || user;
    }

    return this.login(user);
  }
}
