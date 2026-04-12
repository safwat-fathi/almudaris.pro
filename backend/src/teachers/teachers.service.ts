import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import * as crypto from 'crypto';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getInviteCode(teacherId: number): Promise<string> {
    const teacher = await this.usersRepository.findOne({
      where: { id: teacherId, role: UserRole.TEACHER },
    });

    if (!teacher) {
      throw new UnauthorizedException(
        'Only teachers can generate invitation codes',
      );
    }

    if (teacher.invite_code) {
      return teacher.invite_code;
    }

    // Generate a unique 8-character hex code
    const inviteCode = crypto.randomBytes(4).toString('hex');
    teacher.invite_code = inviteCode;
    await this.usersRepository.save(teacher);

    return inviteCode;
  }

  async findByInviteCode(inviteCode: string): Promise<Partial<User>> {
    const teacher = await this.usersRepository.findOne({
      where: { invite_code: inviteCode, role: UserRole.TEACHER },
    });

    if (!teacher || !teacher.is_active) {
      throw new NotFoundException('Invalid or expired invitation link');
    }

    return {
      id: teacher.id,
      name: teacher.name,
      phone: teacher.phone,
      email: teacher.email,
    };
  }
}
