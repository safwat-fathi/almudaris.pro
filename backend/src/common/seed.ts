import { Logger } from '@nestjs/common';
import dataSource from 'src/config/orm.config';
import { seedUsers } from './seeders/user.seeder';
import { seedGroups } from './seeders/group.seeder';
import { seedHomework } from './seeders/homework.seeder';

async function bootstrap() {
  const logger = new Logger('Seed');
  logger.log('Seeding...');

  await dataSource.initialize();

  try {
    await seedUsers(dataSource);
    await seedGroups(dataSource);
    await seedHomework(dataSource);
    logger.log('Seeding completed successfully.');
  } catch (error) {
    logger.error('Seeding error:', error);
  } finally {
    await dataSource.destroy();
  }
}

void bootstrap();
