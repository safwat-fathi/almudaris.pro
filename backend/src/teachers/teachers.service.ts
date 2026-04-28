import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { ChildTeacherEnrollment } from '../children/entities/child-teacher-enrollment.entity';
import * as crypto from 'crypto';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(ChildTeacherEnrollment)
    private enrollmentRepository: Repository<ChildTeacherEnrollment>,
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

  /**
   * Retrieves all students enrolled with a specific teacher.
   * Returns an array of student objects with id and name.
   */
  async getStudents(
    teacherId: number,
  ): Promise<{ id: number; name: string }[]> {
    const enrollments = await this.enrollmentRepository.find({
      where: { teacher_id: teacherId },
    });

    if (enrollments.length === 0) {
      return [];
    }

    const studentIds = enrollments.map((e) => e.student_id);
    const students = await this.usersRepository.find({
      where: { id: In(studentIds), role: UserRole.STUDENT },
      select: ['id', 'name'],
    });

    return students.map((s) => ({ id: s.id, name: s.name }));
  }

  /**
   * Retrieves details of a specific student enrolled with a teacher.
   */
  async getActiveEnrollmentOrFail(
    teacherId: number,
    studentId: number,
  ): Promise<Partial<User>> {
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

    const student = await this.usersRepository.findOne({
      where: { id: studentId, role: UserRole.STUDENT },
      relations: ['parent'],
    });

    if (!student) {
      throw new NotFoundException('لم يتم العثور على الطالب');
    }

    return {
      id: student.id,
      name: student.name,
      email: student.email,
      phone: student.phone,
      parent: student.parent
        ? ({
            id: student.parent.id,
            name: student.parent.name,
            phone: student.parent.phone,
          } as User)
        : undefined,
    };
  }

  /**
   * Removes a student from a teacher's class (deletes the enrollment).
   */
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
