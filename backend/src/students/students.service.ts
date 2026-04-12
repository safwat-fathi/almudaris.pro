import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { StudentTeacherEnrollment } from './entities/student-teacher-enrollment.entity';
import { ParentTeacherLink } from '../parents/entities/parent-teacher-link.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { EnrollStudentDto } from './dto/enroll-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(StudentTeacherEnrollment)
    private readonly studentTeacherEnrollmentRepository: Repository<StudentTeacherEnrollment>,
    @InjectRepository(ParentTeacherLink)
    private readonly parentTeacherLinkRepository: Repository<ParentTeacherLink>,
  ) {}

  async getStudentsByParent(parentId: number): Promise<User[]> {
    // Return all users whose parent relation points to this parentId
    return this.usersRepository.find({
      where: { parent: { id: parentId }, role: UserRole.STUDENT },
      relations: ['parent'],
    });
  }

  async createStudent(
    parentId: number,
    createStudentDto: CreateStudentDto,
  ): Promise<User> {
    const parent = await this.usersRepository.findOne({
      where: { id: parentId, role: UserRole.PARENT },
    });
    if (!parent) {
      throw new UnauthorizedException('Valid parent account required.');
    }

    // A student is simply a user with role STUDENT and a parent relation
    // We skip password generation for now, real app may require an onboarding step
    const newStudent = this.usersRepository.create({
      name: createStudentDto.name,
      email: createStudentDto.email,
      role: UserRole.STUDENT,
      parent: parent,
      password: 'no-password', // Placeholder for DB constraint
    });

    return this.usersRepository.save(newStudent);
  }

  async enrollStudent(
    parentId: number,
    studentId: number,
    enrollDto: EnrollStudentDto,
  ): Promise<{ success: boolean; message: string }> {
    // 1. Verify student belongs to parent
    const student = await this.usersRepository.findOne({
      where: {
        id: studentId,
        parent: { id: parentId },
        role: UserRole.STUDENT,
      },
    });

    if (!student) {
      throw new NotFoundException(
        'Student not found or does not belong to you.',
      );
    }

    // 2. Verify parent is linked to this teacher
    const isLinkedToTeacher = await this.parentTeacherLinkRepository.findOne({
      where: { parent_id: parentId, teacher_id: enrollDto.teacherId },
    });

    if (!isLinkedToTeacher) {
      throw new UnauthorizedException(
        'You must be linked to the teacher to enroll a student in their classes.',
      );
    }

    // 3. Verify teacher exists
    const teacher = await this.usersRepository.findOne({
      where: { id: enrollDto.teacherId, role: UserRole.TEACHER },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found.');
    }

    // 4. Enroll student
    const existingEnrollment =
      await this.studentTeacherEnrollmentRepository.findOne({
        where: { student_id: studentId, teacher_id: teacher.id },
      });

    if (existingEnrollment) {
      throw new ConflictException(
        'Student is already enrolled with this teacher.',
      );
    }

    const enrollment = this.studentTeacherEnrollmentRepository.create({
      student_id: student.id,
      teacher_id: teacher.id,
    });

    await this.studentTeacherEnrollmentRepository.save(enrollment);

    return {
      success: true,
      message: 'Student successfully enrolled with teacher.',
    };
  }
}
