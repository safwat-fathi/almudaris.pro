import { DataSource } from 'typeorm';
import { User, UserRole } from '../../users/entities/user.entity';
import { Logger } from '@nestjs/common';
import { EducationStage } from '../grades/grade-system';
import { Teacher } from '../../teachers/entities/teacher.entity';
import { Student } from '../../students/entities/student.entity';

export async function seedUsers(dataSource: DataSource) {
  const logger = new Logger('UserSeeder');
  const userRepository = dataSource.getRepository(User);
  const teacherRepository = dataSource.getRepository(Teacher);
  const studentRepository = dataSource.getRepository(Student);

  const teacherPhone = '01000000000';
  let teacherUser = await userRepository.findOne({
    where: { phone: teacherPhone },
  });

  if (teacherUser) {
    logger.log(
      `User with phone ${teacherPhone} already exists -> skip create.`,
    );
  } else {
    teacherUser = await userRepository.save(
      userRepository.create({
        name: 'علي أحمد',
        phone: teacherPhone,
        password: 'password123',
        email: 'teacher@test.com',
        role: UserRole.TEACHER,
        is_active: true,
      }),
    );
    logger.log(`Teacher user with phone ${teacherPhone} created successfully.`);
  }

  if (teacherUser) {
    const existingTeacherProfile = await teacherRepository.findOne({
      where: { user_id: teacherUser.id },
    });

    if (!existingTeacherProfile) {
      await teacherRepository.save(
        teacherRepository.create({
          user_id: teacherUser.id,
          education_stage: EducationStage.SECONDARY,
          education_year: 3,
          invite_code: 'teacher#123',
        }),
      );
      logger.log(`Teacher profile for user ${teacherPhone} created.`);
    } else {
      logger.log(
        `Teacher profile for user ${teacherPhone} already exists -> skip create.`,
      );
    }
  }

  const parentPhone = '01111111111';
  const existingParent = await userRepository.findOne({
    where: { phone: parentPhone },
  });
  let parentUser = existingParent;

  if (parentUser) {
    logger.log(
      `User with phone ${parentPhone} already exists -> skip create.`,
    );
  } else {
    parentUser = await userRepository.save(
      userRepository.create({
        name: 'خالد سيد فاروق',
        phone: parentPhone,
        password: 'password123',
        email: 'parent@test.com',
        role: UserRole.PARENT,
        is_active: true,
      }),
    );
    logger.log(`Parent user with phone ${parentPhone} created successfully.`);
  }

  if (!parentUser) {
    logger.warn('Parent user is unavailable. Skipping children seeding.');
    return;
  }

  const childrenToSeed: Array<{
    name: string;
    email: string;
    education_stage: EducationStage;
    education_year: number;
  }> = [
    {
      name: 'محمود خالد',
      email: 'child1@test.com',
      education_stage: EducationStage.PRIMARY,
      education_year: 5,
    },
    {
      name: 'سارة خالد',
      email: 'child2@test.com',
      education_stage: EducationStage.PREPARATORY,
      education_year: 2,
    },
  ];

  for (const childSeed of childrenToSeed) {
    let childUser = await userRepository.findOne({
      where: {
        email: childSeed.email,
        role: UserRole.STUDENT,
      },
    });

    if (!childUser) {
      childUser = await userRepository.save(
        userRepository.create({
          name: childSeed.name,
          email: childSeed.email,
          role: UserRole.STUDENT,
          password: 'no-password',
					is_active: true
        }),
      );
      logger.log(`Child user ${childSeed.name} (${childSeed.email}) created.`);
    }

    const existingStudentProfile = await studentRepository.findOne({
      where: { user_id: childUser.id },
    });

    if (existingStudentProfile) {
      logger.log(
        `Child profile ${childSeed.name} (${childSeed.email}) already exists -> skip create.`,
      );
      continue;
    }

    await studentRepository.save(
      studentRepository.create({
        user_id: childUser.id,
        parent_id: parentUser.id,
        education_stage: childSeed.education_stage,
        education_year: childSeed.education_year,
        grade_needs_review: false,
      }),
    );

    logger.log(
      `Child profile ${childSeed.name} (${childSeed.email}) created successfully for parent ${parentPhone}.`,
    );
  }
}
