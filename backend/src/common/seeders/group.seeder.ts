import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { EducationStage } from '../grades/grade-system';
import { User, UserRole } from '../../users/entities/user.entity';
import { Group, GroupStatus, LocationType } from '../../groups/entities/group.entity';

/**
 * Seed groups linked to the seeded teacher account.
 */
export async function seedGroups(dataSource: DataSource) {
  const logger = new Logger('GroupSeeder');
  const userRepository = dataSource.getRepository(User);
  const groupRepository = dataSource.getRepository(Group);

  try {
    const teacherPhone = '01000000000';
    const teacher = await userRepository.findOne({
      where: {
        phone: teacherPhone,
        role: UserRole.TEACHER,
      },
    });

    if (!teacher) {
      logger.warn(
        `Teacher with phone ${teacherPhone} was not found. Skipping groups seeding.`,
      );
      return;
    }

    const groupsToSeed: Array<{
      title: string;
      date: string;
      start_time: string;
      duration_minutes: number;
      location_type: LocationType;
      location_link?: string;
      location_place?: string;
      education_stage: EducationStage;
      education_year: number;
      status: GroupStatus;
      notes?: string;
    }> = [
      {
        title: 'ثالثة ثانوي - جبر',
        date: '2026-05-05',
        start_time: '16:00',
        duration_minutes: 90,
        location_type: LocationType.ONLINE,
        location_link: 'https://meet.example.com/sec3-algebra',
        education_stage: EducationStage.SECONDARY,
        education_year: 3,
        status: GroupStatus.SCHEDULED,
        notes: 'مراجعة على المتتابعات',
      },
      {
        title: 'تانية إعدادي - هندسة',
        date: '2026-05-06',
        start_time: '15:30',
        duration_minutes: 75,
        location_type: LocationType.PHYSICAL,
        location_place: 'مركز المدينة - قاعة 2',
        education_stage: EducationStage.PREPARATORY,
        education_year: 2,
        status: GroupStatus.SCHEDULED,
        notes: 'حل واجب الأسبوع',
      },
      {
        title: 'خامسة ابتدائي - أساسيات',
        date: '2026-05-07',
        start_time: '14:00',
        duration_minutes: 60,
        location_type: LocationType.ONLINE,
        location_link: 'https://meet.example.com/primary5-basics',
        education_stage: EducationStage.PRIMARY,
        education_year: 5,
        status: GroupStatus.SCHEDULED,
        notes: 'تدريب على المسائل اللفظية',
      },
    ];

    for (const groupSeed of groupsToSeed) {
      const existingGroup = await groupRepository.findOne({
        where: {
          teacher_id: teacher.id,
          date: groupSeed.date,
          start_time: groupSeed.start_time,
          title: groupSeed.title,
        },
      });

      if (existingGroup) {
        logger.log(
          `Group ${groupSeed.title} on ${groupSeed.date} at ${groupSeed.start_time} already exists. Skipping.`,
        );
        continue;
      }

      const group = groupRepository.create({
        teacher_id: teacher.id,
        teacher,
        title: groupSeed.title,
        date: groupSeed.date,
        start_time: groupSeed.start_time,
        duration_minutes: groupSeed.duration_minutes,
        status: groupSeed.status,
        location_type: groupSeed.location_type,
        location_link: groupSeed.location_link,
        location_place: groupSeed.location_place,
        education_stage: groupSeed.education_stage,
        education_year: groupSeed.education_year,
        notes: groupSeed.notes,
        created_by_id: teacher.id,
        created_by: teacher,
      });

      await groupRepository.save(group);
      logger.log(
        `Group ${groupSeed.title} on ${groupSeed.date} at ${groupSeed.start_time} created successfully.`,
      );
    }
  } catch (error) {
    logger.error('Error while seeding groups:', error);
    throw error;
  }
}
