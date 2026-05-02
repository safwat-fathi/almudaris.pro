import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { ChildTeacherEnrollment } from '../children/entities/child-teacher-enrollment.entity';
import * as crypto from 'crypto';
import {
  EducationStage,
  formatGradeLabel,
  isValidGrade,
} from '../common/grades/grade-system';
import { Teacher } from './entities/teacher.entity';
import { Student } from '../students/entities/student.entity';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Teacher)
    private teachersRepository: Repository<Teacher>,
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
    @InjectRepository(ChildTeacherEnrollment)
    private enrollmentRepository: Repository<ChildTeacherEnrollment>,
  ) {}

  private async generateUniqueInviteCode(): Promise<string> {
    for (let i = 0; i < 10; i += 1) {
      const inviteCode = crypto.randomBytes(4).toString('hex');
      const existing = await this.teachersRepository.findOne({
        where: { invite_code: inviteCode },
      });
      if (!existing) {
        return inviteCode;
      }
    }

    throw new BadRequestException('Failed to generate a unique invite code');
  }

  async getInviteCode(teacherId: number): Promise<string> {
    const teacherUser = await this.usersRepository.findOne({
      where: { id: teacherId, role: UserRole.TEACHER },
    });

    if (!teacherUser) {
      throw new UnauthorizedException(
        'المعلمون فقط هم المسموح لهم بتوليد دعاوى',
      );
    }

    let teacherProfile = await this.teachersRepository.findOne({
      where: { user_id: teacherId },
    });

    if (!teacherProfile) {
      teacherProfile = this.teachersRepository.create({ user_id: teacherId });
      teacherProfile = await this.teachersRepository.save(teacherProfile);
    }

    if (teacherProfile.invite_code) {
      return teacherProfile.invite_code;
    }

    teacherProfile.invite_code = await this.generateUniqueInviteCode();
    await this.teachersRepository.save(teacherProfile);

    return teacherProfile.invite_code;
  }

  async findByInviteCode(inviteCode: string): Promise<Partial<User>> {
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
      throw new NotFoundException('Invalid or expired invitation link');
    }

    return {
      id: teacherProfile.user.id,
      name: teacherProfile.user.name,
      phone: teacherProfile.user.phone,
      email: teacherProfile.user.email,
    };
  }

  async getStudents(
    teacherId: number,
    filters?: {
      education_stage?: EducationStage;
      education_year?: number;
    },
  ): Promise<
    {
      id: number;
      name: string;
      education_stage: EducationStage;
      education_year: number;
      grade_label: string;
    }[]
  > {
    if (
      filters?.education_stage !== undefined &&
      filters?.education_year !== undefined &&
      !isValidGrade(filters.education_stage, filters.education_year)
    ) {
      throw new BadRequestException('مرحلة تعليمية أو عام دراسي غير صحيح');
    }

    const teacher = await this.usersRepository.findOne({
      where: { id: teacherId, role: UserRole.TEACHER },
    });

    if (!teacher) {
      throw new UnauthorizedException('غير مصرح لك بذلك');
    }

    const enrollments = await this.enrollmentRepository.find({
      where: {
        teacher_id: teacherId,
        deactivated_at: IsNull(),
      },
    });

    if (enrollments.length === 0) {
      return [];
    }

    const studentIds = enrollments.map((e) => e.student_id);

    const qb = this.studentsRepository
      .createQueryBuilder('student')
      .innerJoinAndSelect('student.user', 'user')
      .where('student.user_id IN (:...studentIds)', { studentIds })
      .andWhere('user.role = :role', { role: UserRole.STUDENT });

    if (filters?.education_stage !== undefined) {
      qb.andWhere('student.education_stage = :stage', {
        stage: filters.education_stage,
      });
    }

    if (filters?.education_year !== undefined) {
      qb.andWhere('student.education_year = :year', {
        year: filters.education_year,
      });
    }

    const students = await qb.getMany();

    return students.map((student) => ({
      id: student.user_id,
      name: student.user.name,
      education_stage: student.education_stage,
      education_year: student.education_year,
      grade_label: formatGradeLabel(
        student.education_stage,
        student.education_year,
      ),
    }));
  }

  async getActiveEnrollmentOrFail(
    teacherId: number,
    studentId: number,
  ): Promise<{
    id: number;
    name: string;
    email?: string;
    phone: string;
    parent?: {
      id: number;
      name: string;
      phone: string;
    };
  }> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: {
        teacher_id: teacherId,
        student_id: studentId,
        deactivated_at: IsNull(),
      },
    });

    if (!enrollment) {
      throw new NotFoundException('هذا الطالب غير مسجل لديك');
    }

    const student = await this.studentsRepository
      .createQueryBuilder('student')
      .innerJoinAndSelect('student.user', 'user')
      .leftJoinAndSelect('student.parent', 'parent')
      .where('student.user_id = :studentId', { studentId })
      .andWhere('user.role = :role', { role: UserRole.STUDENT })
      .getOne();

    if (!student) {
      throw new NotFoundException('لم يتم العثور على الطالب');
    }

    return {
      id: student.user.id,
      name: student.user.name,
      email: student.user.email,
      phone: student.user.phone,
      parent: student.parent
        ? ({
            id: student.parent.id,
            name: student.parent.name,
            phone: student.parent.phone,
          } as User)
        : undefined,
    };
  }

  async removeStudent(
    teacherId: number,
    studentId: number,
  ): Promise<{ success: boolean; message: string }> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: {
        teacher_id: teacherId,
        student_id: studentId,
        deactivated_at: IsNull(),
      },
    });

    if (!enrollment) {
      throw new NotFoundException('الطالب غير مسجل لديك');
    }

    enrollment.deactivated_at = new Date();
    enrollment.deactivated_by = teacherId;
    await this.enrollmentRepository.save(enrollment);

    return { success: true, message: 'تم إلغاء تسجيل الطالب بنجاح.' };
  }
}
