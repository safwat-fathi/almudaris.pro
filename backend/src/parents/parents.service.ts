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
import { Teacher } from '../teachers/entities/teacher.entity';
import {
  EducationStage,
  formatGradeLabel,
} from '../common/grades/grade-system';

export interface LinkedTeacherResponse {
  id: number;
  name: string;
  phone: string;
  email?: string;
  education_stage: EducationStage;
  education_year: number;
  grade_label: string;
}

@Injectable()
export class ParentsService {
  constructor(
    @InjectRepository(ParentTeacherLink)
    private readonly parentTeacherLinkRepository: Repository<ParentTeacherLink>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,
  ) {}

  async linkTeacher(parentId: number, inviteCode: string): Promise<boolean> {
    const parent = await this.usersRepository.findOne({
      where: { id: parentId, role: UserRole.PARENT },
    });
    if (!parent) {
      throw new UnauthorizedException(
        'Valid parent account required to link teachers.',
      );
    }

    const teacherProfile = await this.teachersRepository.findOne({
      where: { invite_code: inviteCode },
      relations: ['user'],
    });

    if (
      !teacherProfile ||
      !teacherProfile.user ||
      teacherProfile.user.role !== UserRole.TEACHER ||
      !teacherProfile.user.is_active
    ) {
      throw new NotFoundException('Invalid or expired invitation link.');
    }

    const existingLink = await this.parentTeacherLinkRepository.findOne({
      where: { parent_id: parentId, teacher_id: teacherProfile.user_id },
    });

    if (existingLink) {
      throw new ConflictException('هذا المعلم مسجل بحسابك بالفعل.');
    }

    const newLink = this.parentTeacherLinkRepository.create({
      parent_id: parentId,
      teacher_id: teacherProfile.user_id,
    });

    await this.parentTeacherLinkRepository.save(newLink);

    return true;
  }

  async getLinkedTeachers(parentId: number): Promise<LinkedTeacherResponse[]> {
    const links = await this.parentTeacherLinkRepository.find({
      where: { parent_id: parentId },
      relations: ['teacher.teacherProfile'],
    });

    return links.map((link) => {
      const teacherProfile = link.teacher.teacherProfile;
      const educationStage =
        teacherProfile?.education_stage ?? EducationStage.UNASSIGNED;
      const educationYear = teacherProfile?.education_year ?? 0;

      return {
        id: link.teacher.id,
        name: link.teacher.name,
        phone: link.teacher.phone,
        email: link.teacher.email,
        education_stage: educationStage,
        education_year: educationYear,
        grade_label: formatGradeLabel(educationStage, educationYear),
      };
    });
  }
}
