import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { ChildTeacherEnrollment } from './entities/child-teacher-enrollment.entity';
import { ParentTeacherLink } from '../parents/entities/parent-teacher-link.entity';
import { CreateChildDto } from './dto/create-child.dto';
import { EnrollChildDto } from './dto/enroll-child.dto';

@Injectable()
export class ChildrenService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(ChildTeacherEnrollment)
    private readonly childTeacherEnrollmentRepository: Repository<ChildTeacherEnrollment>,
    @InjectRepository(ParentTeacherLink)
    private readonly parentTeacherLinkRepository: Repository<ParentTeacherLink>,
  ) {}

  async getChildrenByParent(parentId: number): Promise<User[]> {
    // Return all users whose parent relation points to this parentId
    return this.usersRepository.find({
      where: { parent: { id: parentId }, role: UserRole.STUDENT },
      relations: ['parent'],
    });
  }

  async createChild(
    parentId: number,
    createChildDto: CreateChildDto,
  ): Promise<User> {
    const parent = await this.usersRepository.findOne({
      where: { id: parentId, role: UserRole.PARENT },
    });
    if (!parent) {
      throw new UnauthorizedException('Valid parent account required.');
    }

    const normalizedName = createChildDto.name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');
    const normalizedEmail = createChildDto.email
      ? createChildDto.email.trim().toLowerCase()
      : null;

    const existingChildren = await this.usersRepository.find({
      where: {
        parent: { id: parentId },
        role: UserRole.STUDENT,
      },
    });

    const duplicate = existingChildren.find((child) => {
      const childName = child.name.trim().toLowerCase().replace(/\s+/g, ' ');
      const childEmail = child.email ? child.email.trim().toLowerCase() : null;
      return childName === normalizedName && childEmail === normalizedEmail;
    });

    if (duplicate) {
      throw new ConflictException(
        'A child with the same name and identifier already exists.',
      );
    }

    // A child is simply a user with role STUDENT and a parent relation
    // We skip password generation for now, real app may require an onboarding step
    const newChild = this.usersRepository.create({
      name: createChildDto.name,
      email: createChildDto.email,
      role: UserRole.STUDENT,
      parent: parent,
      password: 'no-password', // Placeholder for DB constraint
    });

    return this.usersRepository.save(newChild);
  }

  async enrollChild(
    parentId: number,
    childId: number,
    enrollDto: EnrollChildDto,
  ): Promise<{ success: boolean; message: string }> {
    // 1. Verify child belongs to parent
    const child = await this.usersRepository.findOne({
      where: {
        id: childId,
        parent: { id: parentId },
        role: UserRole.STUDENT,
      },
    });

    if (!child) {
      throw new NotFoundException('Child not found or does not belong to you.');
    }

    // 2. Verify parent is linked to this teacher
    const isLinkedToTeacher = await this.parentTeacherLinkRepository.findOne({
      where: { parent_id: parentId, teacher_id: enrollDto.teacherId },
    });

    if (!isLinkedToTeacher) {
      throw new UnauthorizedException(
        'You must be linked to the teacher to enroll a child in their classes.',
      );
    }

    // 3. Verify teacher exists
    const teacher = await this.usersRepository.findOne({
      where: { id: enrollDto.teacherId, role: UserRole.TEACHER },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found.');
    }

    // 4. Enroll child
    const existingEnrollment =
      await this.childTeacherEnrollmentRepository.findOne({
        where: { student_id: childId, teacher_id: teacher.id },
      });

    if (existingEnrollment) {
      throw new ConflictException(
        'Child is already enrolled with this teacher.',
      );
    }

    const enrollment = this.childTeacherEnrollmentRepository.create({
      student_id: child.id,
      teacher_id: teacher.id,
    });

    await this.childTeacherEnrollmentRepository.save(enrollment);

    return {
      success: true,
      message: 'Child successfully enrolled with teacher.',
    };
  }
}
