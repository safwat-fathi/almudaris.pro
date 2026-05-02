import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User, UserRole } from '../../users/entities/user.entity';
import { Group } from '../../groups/entities/group.entity';
import { Homework } from '../../homework/entities/homework.entity';

/**
 * Seed homework entries linked to already seeded groups.
 */
export async function seedHomework(dataSource: DataSource) {
  const logger = new Logger('HomeworkSeeder');
  const userRepository = dataSource.getRepository(User);
  const groupRepository = dataSource.getRepository(Group);
  const homeworkRepository = dataSource.getRepository(Homework);

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
        `Teacher with phone ${teacherPhone} was not found. Skipping homework seeding.`,
      );
      return;
    }

    const homeworkToSeed: Array<{
      groupIdentity: {
        title: string;
        date: string;
        start_time: string;
      };
      title: string;
      description?: string;
      due_date?: string;
      is_open?: boolean;
    }> = [
      {
        groupIdentity: {
          title: 'ثالثة ثانوي - جبر',
          date: '2026-05-05',
          start_time: '16:00',
        },
        title: 'واجب الجبر 1',
        description: 'حل المسائل من 1 إلى 8 في درس المتتابعات.',
        due_date: '2026-05-09T20:00:00Z',
        is_open: true,
      },
      {
        groupIdentity: {
          title: 'تانية إعدادي - هندسة',
          date: '2026-05-06',
          start_time: '15:30',
        },
        title: 'واجب الهندسة 1',
        description: 'أجب عن أسئلة الزوايا المتبادلة والمتناظرة.',
        due_date: '2026-05-10T18:30:00Z',
        is_open: true,
      },
      {
        groupIdentity: {
          title: 'خامسة ابتدائي - أساسيات',
          date: '2026-05-07',
          start_time: '14:00',
        },
        title: 'واجب الأساسيات 1',
        description: 'تدريبات على المسائل اللفظية الأساسية.',
        due_date: '2026-05-11T17:00:00Z',
        is_open: true,
      },
    ];

    for (const homeworkSeed of homeworkToSeed) {
      const group = await groupRepository.findOne({
        where: {
          teacher_id: teacher.id,
          title: homeworkSeed.groupIdentity.title,
          date: homeworkSeed.groupIdentity.date,
          start_time: homeworkSeed.groupIdentity.start_time,
        },
      });

      if (!group) {
        logger.warn(
          `Group ${homeworkSeed.groupIdentity.title} on ${homeworkSeed.groupIdentity.date} at ${homeworkSeed.groupIdentity.start_time} was not found. Skipping homework "${homeworkSeed.title}".`,
        );
        continue;
      }

      const existingHomework = await homeworkRepository.findOne({
        where: {
          group_id: group.id,
          title: homeworkSeed.title,
        },
      });

      if (existingHomework) {
        logger.log(
          `Homework "${homeworkSeed.title}" for group ${group.title} already exists. Skipping.`,
        );
        continue;
      }

      const homework = homeworkRepository.create({
        group_id: group.id,
        title: homeworkSeed.title,
        description: homeworkSeed.description,
        due_date: homeworkSeed.due_date
          ? new Date(homeworkSeed.due_date)
          : null,
        is_open: homeworkSeed.is_open ?? true,
        education_stage: group.education_stage,
        education_year: group.education_year,
      });

      await homeworkRepository.save(homework);
      logger.log(
        `Homework "${homeworkSeed.title}" created successfully for group ${group.title}.`,
      );
    }
  } catch (error) {
    logger.error('Error while seeding homework:', error);
    throw error;
  }
}
