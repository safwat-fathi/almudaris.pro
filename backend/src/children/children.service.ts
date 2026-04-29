import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { ChildTeacherEnrollment } from './entities/child-teacher-enrollment.entity';
import { ParentTeacherLink } from '../parents/entities/parent-teacher-link.entity';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { ListChildrenQueryDto } from './dto/list-children-query.dto';
import { EnrollChildDto } from './dto/enroll-child.dto';
import {
  isValidGrade,
  formatGradeLabel,
  EDUCATION_STAGE_YEARS,
} from '../common/grades/grade-system';

export interface ChildResponse {
  id: number;
  name: string;
  email?: string;
  education_stage: string;
  education_year: number;
  grade_label: string;
  grade_needs_review: boolean;
}

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

  private mapChildResponse(child: User): ChildResponse {
    return {
      id: child.id,
      name: child.name,
      email: child.email,
      education_stage: child.education_stage,
      education_year: child.education_year,
      grade_label: formatGradeLabel(
        child.education_stage,
        child.education_year,
      ),
      grade_needs_review: child.grade_needs_review,
    };
  }

  async getChildrenByParent(
    parentId: number,
    filters?: ListChildrenQueryDto,
  ): Promise<ChildResponse[]> {
    if (
      filters?.education_stage !== undefined &&
      filters?.education_year !== undefined &&
      !isValidGrade(filters.education_stage, filters.education_year)
    ) {
      throw new BadRequestException(
        `Invalid education_stage/education_year combination.`,
      );
    }

    const children = await this.usersRepository.find({
      where: {
        parent: { id: parentId },
        role: UserRole.STUDENT,
        ...(filters?.education_stage !== undefined
          ? { education_stage: filters.education_stage }
          : {}),
        ...(filters?.education_year !== undefined
          ? { education_year: filters.education_year }
          : {}),
      },
      relations: ['parent'],
    });

    return children.map((c) => this.mapChildResponse(c));
  }

  async createChild(
    parentId: number,
    createChildDto: CreateChildDto,
  ): Promise<ChildResponse> {
    const parent = await this.usersRepository.findOne({
      where: { id: parentId, role: UserRole.PARENT },
    });
    if (!parent) {
      throw new UnauthorizedException('Valid parent account required.');
    }

    if (
      !isValidGrade(
        createChildDto.education_stage,
        createChildDto.education_year,
      )
    ) {
      throw new BadRequestException(
        `Invalid education_stage/education_year combination: ${createChildDto.education_stage} only supports years ${EDUCATION_STAGE_YEARS[createChildDto.education_stage]?.join(', ') || '0'}.`,
      );
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
        // 'A child with the same name and identifier already exists.',
        'هذا الطالب موجود بالفعل',
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
      education_stage: createChildDto.education_stage,
      education_year: createChildDto.education_year,
      grade_needs_review: false,
    });

    const saved = await this.usersRepository.save(newChild);
    return this.mapChildResponse(saved);
  }

  async updateChild(
    parentId: number,
    childId: number,
    updateDto: UpdateChildDto,
  ): Promise<ChildResponse> {
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

    const stage = updateDto.education_stage ?? child.education_stage;
    const year = updateDto.education_year ?? child.education_year;

    if (
      updateDto.education_stage !== undefined ||
      updateDto.education_year !== undefined
    ) {
      if (!isValidGrade(stage, year)) {
        throw new BadRequestException(
          `Invalid education_stage/education_year combination.`,
        );
      }
      child.education_stage = stage;
      child.education_year = year;
      child.grade_needs_review = false;
    }

    if (updateDto.name !== undefined) {
      child.name = updateDto.name;
    }
    if (updateDto.email !== undefined) {
      child.email = updateDto.email;
    }

    const saved = await this.usersRepository.save(child);
    return this.mapChildResponse(saved);
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
