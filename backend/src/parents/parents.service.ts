import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParentTeacherLink } from './entities/parent-teacher-link.entity';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class ParentsService {
  constructor(
    @InjectRepository(ParentTeacherLink)
    private readonly parentTeacherLinkRepository: Repository<ParentTeacherLink>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async linkTeacher(
    parentId: number,
    inviteCode: string,
  ): Promise<{ success: boolean; message: string }> {
    // Validate parent
    const parent = await this.usersRepository.findOne({
      where: { id: parentId, role: UserRole.PARENT },
    });
    if (!parent) {
      throw new UnauthorizedException(
        'Valid parent account required to link teachers.',
      );
    }

    // Find teacher by invite code
    const teacher = await this.usersRepository.findOne({
      where: { invite_code: inviteCode, role: UserRole.TEACHER },
    });
    if (!teacher || !teacher.is_active) {
      throw new NotFoundException('Invalid or expired invitation link.');
    }

    // Check if link already exists
    const existingLink = await this.parentTeacherLinkRepository.findOne({
      where: { parent_id: parentId, teacher_id: teacher.id },
    });

    if (existingLink) {
      throw new ConflictException('You are already linked to this teacher.');
    }

    // Create link
    const newLink = this.parentTeacherLinkRepository.create({
      parent_id: parentId,
      teacher_id: teacher.id,
    });

    await this.parentTeacherLinkRepository.save(newLink);

    return {
      success: true,
      message: 'Successfully linked to teacher.',
    };
  }

  async getLinkedTeachers(parentId: number) {
    const links = await this.parentTeacherLinkRepository.find({
      where: { parent_id: parentId },
      relations: ['teacher'],
    });

    return links.map((link) => {
      // Exclude sensitive information
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...teacherData } = link.teacher;
      return teacherData;
    });
  }
}
