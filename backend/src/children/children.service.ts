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
  EducationStage,
  isValidGrade,
  formatGradeLabel,
  EDUCATION_STAGE_YEARS,
} from '../common/grades/grade-system';
import { Student } from '../students/entities/student.entity';

export interface ChildResponse {
  id: number;
  name: string;
  email?: string;
  education_stage: EducationStage;
  education_year: number;
  grade_label: string;
  grade_needs_review: boolean;
}

@Injectable()
export class ChildrenService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    @InjectRepository(ChildTeacherEnrollment)
    private readonly childTeacherEnrollmentRepository: Repository<ChildTeacherEnrollment>,
    @InjectRepository(ParentTeacherLink)
    private readonly parentTeacherLinkRepository: Repository<ParentTeacherLink>,
  ) {}

  private mapChildResponse(student: Student): ChildResponse {
    return {
      id: student.user_id,
      name: student.user.name,
      email: student.user.email,
      education_stage: student.education_stage,
      education_year: student.education_year,
      grade_label: formatGradeLabel(
        student.education_stage,
        student.education_year,
      ),
      grade_needs_review: student.grade_needs_review,
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
        'Invalid education_stage/education_year combination.',
      );
    }

    const children = await this.studentsRepository.find({
      where: {
        parent_id: parentId,
        ...(filters?.education_stage !== undefined
          ? { education_stage: filters.education_stage }
          : {}),
        ...(filters?.education_year !== undefined
          ? { education_year: filters.education_year }
          : {}),
      },
      relations: ['user'],
    });

    return children.map((child) => this.mapChildResponse(child));
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

    const existingChildren = await this.studentsRepository.find({
      where: { parent_id: parentId },
      relations: ['user'],
    });

    const duplicate = existingChildren.find((student) => {
      const childName = student.user.name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ');
      const childEmail = student.user.email
        ? student.user.email.trim().toLowerCase()
        : null;
      return childName === normalizedName && childEmail === normalizedEmail;
    });

    if (duplicate) {
      throw new ConflictException('هذا الطالب موجود بالفعل');
    }

    const savedStudent = await this.usersRepository.manager.transaction(
      async (manager) => {
        const userRepo = manager.getRepository(User);
        const studentRepo = manager.getRepository(Student);

        const childUser = userRepo.create({
          name: createChildDto.name,
          email: createChildDto.email,
          role: UserRole.STUDENT,
          password: 'no-password',
        });

        const savedUser = await userRepo.save(childUser);

        const studentProfile = studentRepo.create({
          user_id: savedUser.id,
          parent_id: parentId,
          education_stage: createChildDto.education_stage,
          education_year: createChildDto.education_year,
          grade_needs_review: false,
        });

        await studentRepo.save(studentProfile);

        return studentRepo.findOneOrFail({
          where: { user_id: savedUser.id },
          relations: ['user'],
        });
      },
    );

    return this.mapChildResponse(savedStudent);
  }

  async updateChild(
    parentId: number,
    childId: number,
    updateDto: UpdateChildDto,
  ): Promise<ChildResponse> {
    const student = await this.studentsRepository.findOne({
      where: {
        user_id: childId,
        parent_id: parentId,
      },
      relations: ['user'],
    });

    if (!student) {
      throw new NotFoundException('Child not found or does not belong to you.');
    }

    const stage = updateDto.education_stage ?? student.education_stage;
    const year = updateDto.education_year ?? student.education_year;

    if (
      updateDto.education_stage !== undefined ||
      updateDto.education_year !== undefined
    ) {
      if (!isValidGrade(stage, year)) {
        throw new BadRequestException(
          'Invalid education_stage/education_year combination.',
        );
      }

      student.education_stage = stage;
      student.education_year = year;
      student.grade_needs_review = false;
    }

    if (updateDto.name !== undefined) {
      student.user.name = updateDto.name;
    }

    if (updateDto.email !== undefined) {
      student.user.email = updateDto.email;
    }

    await this.usersRepository.save(student.user);
    const saved = await this.studentsRepository.save(student);

    return this.mapChildResponse(saved);
  }

  async enrollChild(
    parentId: number,
    childId: number,
    enrollDto: EnrollChildDto,
  ): Promise<boolean> {
    const child = await this.studentsRepository.findOne({
      where: {
        user_id: childId,
        parent_id: parentId,
      },
    });

    if (!child) {
      throw new NotFoundException('Child not found or does not belong to you.');
    }

    const isLinkedToTeacher = await this.parentTeacherLinkRepository.findOne({
      where: { parent_id: parentId, teacher_id: enrollDto.teacherId },
    });

    if (!isLinkedToTeacher) {
      throw new UnauthorizedException(
        'You must be linked to the teacher to enroll a child in their classes.',
      );
    }

    const teacher = await this.usersRepository.findOne({
      where: { id: enrollDto.teacherId, role: UserRole.TEACHER },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found.');
    }

    const existingEnrollment =
      await this.childTeacherEnrollmentRepository.findOne({
        where: { student_id: childId, teacher_id: teacher.id },
      });

    if (existingEnrollment) {
      throw new ConflictException('هذا الابن تم تسجيله بالفعل لدي هذا المعلم.');
    }

    const enrollment = this.childTeacherEnrollmentRepository.create({
      student_id: child.user_id,
      teacher_id: teacher.id,
    });

    await this.childTeacherEnrollmentRepository.save(enrollment);

    return true;
  }
}
