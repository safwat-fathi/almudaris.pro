import { DataSource } from 'typeorm';
import { User, UserRole } from '../../users/entities/user.entity';
import { Logger } from '@nestjs/common';
import { EducationStage } from '../grades/grade-system';

export async function seedUsers(dataSource: DataSource) {
  const logger = new Logger('UserSeeder');
  const userRepository = dataSource.getRepository(User);

  // Seed Teacher
  const teacherPhone = '01000000000';
  const existingTeacher = await userRepository.findOne({
    where: { phone: teacherPhone },
  });

  if (existingTeacher) {
    logger.log(`User with phone ${teacherPhone} already exists. Skipping.`);
  } else {
    const teacher = userRepository.create({
      name: 'علي أحمد',
      phone: teacherPhone,
      password: 'password123',
      email: 'teacher@test.com',
      role: UserRole.TEACHER,
      education_stage: EducationStage.SECONDARY,
      education_year: 3,
      is_active: true,
      invite_code: 'teacher#123',
    });

    await userRepository.save(teacher);
    logger.log(`Teacher user with phone ${teacherPhone} created successfully.`);
  }

  // Seed Parent
  const parentPhone = '01111111111';
  const existingParent = await userRepository.findOne({
    where: { phone: parentPhone },
  });
  let parentUser = existingParent;

  if (parentUser) {
    logger.log(`User with phone ${parentPhone} already exists. Skipping.`);
  } else {
    const parent = userRepository.create({
      name: 'خالد سيد فاروق',
      phone: parentPhone,
      password: 'password123',
      email: 'parent@test.com',
      role: UserRole.PARENT,

      is_active: true,
    });

    parentUser = await userRepository.save(parent);
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
    const existingChild = await userRepository.findOne({
      where: {
        email: childSeed.email,
        role: UserRole.STUDENT,
        parent: { id: parentUser.id },
      },
      relations: ['parent'],
    });

    if (existingChild) {
      logger.log(
        `Child ${childSeed.name} (${childSeed.email}) already exists for parent ${parentPhone}. Skipping.`,
      );
      continue;
    }

    const child = userRepository.create({
      name: childSeed.name,
      email: childSeed.email,
      role: UserRole.STUDENT,
      parent: parentUser,
      password: 'no-password',
      education_stage: childSeed.education_stage,
      education_year: childSeed.education_year,
      grade_needs_review: false,
    });

    await userRepository.save(child);
    logger.log(
      `Child ${childSeed.name} (${childSeed.email}) created successfully for parent ${parentPhone}.`,
    );
  }
}
