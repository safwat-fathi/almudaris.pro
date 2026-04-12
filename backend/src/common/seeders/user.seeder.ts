import { DataSource } from 'typeorm';
import { User, UserRole } from '../../users/entities/user.entity';
import { Logger } from '@nestjs/common';

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
      email: 'teacher@example.com',
      role: UserRole.TEACHER,
      is_active: true,
      invite_code: 'teacher123',
    });

    await userRepository.save(teacher);
    logger.log(`Teacher user with phone ${teacherPhone} created successfully.`);
  }

  // Seed Parent
  const parentPhone = '01111111111';
  const existingParent = await userRepository.findOne({
    where: { phone: parentPhone },
  });

  if (existingParent) {
    logger.log(`User with phone ${parentPhone} already exists. Skipping.`);
  } else {
    const parent = userRepository.create({
      name: 'ولي أمر الطالب',
      phone: parentPhone,
      password: 'password123',
      email: 'parent@example.com',
      role: UserRole.PARENT,
      is_active: true,
    });

    await userRepository.save(parent);
    logger.log(`Parent user with phone ${parentPhone} created successfully.`);
  }
}
