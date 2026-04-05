import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/entities/user.entity';
import { SignupDto } from './dto/signup.dto';
import { Otp } from './entities/otp.entity';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(Otp)
    private otpRepository: Repository<Otp>,
    private whatsappService: WhatsappService,
  ) {}

  async validateUser(phone: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findByPhone(phone);
    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  login(user: User) {
    const payload = { sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        phone: user.phone,
      },
    };
  }

  async signup(data: SignupDto) {
    const name = data.name;
    const phone = data.phone;
    const password = data.password;
    const role = data.role;

    // Default to teacher if signing up via email/password in MVP
    const userRole = role || UserRole.TEACHER;

    if (!phone) {
      throw new BadRequestException('Phone is required');
    }

    const existingUser = await this.usersService.findByPhone(phone);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    const newUser = await this.usersService.create({
      name,
      phone,
      password: hashedPassword,
      role: userRole,
    });

    return this.login(newUser);
  }

  async requestOtp(phone: string): Promise<void> {
    // Check if phone format is somewhat valid (you might want better validation here)
    if (!phone) {
      throw new BadRequestException('Phone is required');
    }

    // Generate a 6 digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otpCode, 10);

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    const otpEntity = this.otpRepository.create({
      phone,
      hashedOtp,
      expiresAt,
    });

    await this.otpRepository.save(otpEntity);

    try {
      await this.whatsappService.sendTemplatedMessage({
        key: 'otp_verification',
        to: phone,
        payload: { otp: otpCode },
      });
    } catch (e) {
      // Basic retry
      try {
        await this.whatsappService.sendTemplatedMessage({
          key: 'otp_verification',
          to: phone,
          payload: { otp: otpCode },
        });
      } catch (retryError) {
        console.error('Failed to send OTP after retry', retryError);
      }
    }
  }

  async verifyOtp(phone: string, otpCode: string): Promise<any> {
    const otpRecord = await this.otpRepository.findOne({
      where: { phone },
      order: { createdAt: 'DESC' },
    });

    if (!otpRecord) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    if (otpRecord.isUsed) {
      throw new UnauthorizedException('OTP already used');
    }

    if (otpRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('OTP expired');
    }

    if (otpRecord.attempts >= 5) {
      throw new UnauthorizedException('Too many failed attempts. Try requesting a new OTP.');
    }

    const isValid = await bcrypt.compare(otpCode, otpRecord.hashedOtp);

    if (!isValid) {
      otpRecord.attempts += 1;
      await this.otpRepository.save(otpRecord);
      throw new UnauthorizedException('Invalid OTP');
    }

    otpRecord.isUsed = true;
    await this.otpRepository.save(otpRecord);

    let user = await this.usersService.findByPhone(phone);
    if (!user) {
      // Auto-create user on first OTP login
      user = await this.usersService.create({
        phone,
        name: 'New User', // Placeholder, can be updated later
        role: UserRole.PARENT, // Default role for auto-created
      });
    }

    return this.login(user);
  }
}
