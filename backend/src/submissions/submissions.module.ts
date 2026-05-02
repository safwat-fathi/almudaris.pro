import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmissionsController } from './submissions.controller';
import { SubmissionsService } from './submissions.service';
import { Submission } from './entities/submission.entity';
import { SubmissionAttachment } from './entities/attachment.entity';
import { SubmissionAuditLog } from './entities/audit-log.entity';
import { PermissionsGuard } from '../auth/permissions.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Submission,
      SubmissionAttachment,
      SubmissionAuditLog,
    ]),
  ],
  controllers: [SubmissionsController],
  providers: [SubmissionsService, PermissionsGuard],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}
