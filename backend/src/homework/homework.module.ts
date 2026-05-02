import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeworkController } from './homework.controller';
import { HomeworkService } from './homework.service';
import { Homework } from './entities/homework.entity';
import { Submission } from '../submissions/entities/submission.entity';
import { SubmissionAttachment } from '../submissions/entities/attachment.entity';
import { Group } from 'src/groups/entities/group.entity';
import { PermissionsGuard } from '../auth/permissions.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Homework,
      Submission,
      SubmissionAttachment,
      Group,
    ]),
  ],
  controllers: [HomeworkController],
  providers: [HomeworkService, PermissionsGuard],
  exports: [HomeworkService],
})
export class HomeworkModule {}
