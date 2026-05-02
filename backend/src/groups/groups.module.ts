import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { Group } from './entities/group.entity';
import { GroupStudent } from './entities/group-student.entity';
import { RecurringSeries } from './entities/recurring-series.entity';
import { User } from '../users/entities/user.entity';
import { ChildTeacherEnrollment } from '../children/entities/child-teacher-enrollment.entity';
import { PermissionsGuard } from '../auth/permissions.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Group,
      GroupStudent,
      RecurringSeries,
      User,
      ChildTeacherEnrollment,
    ]),
  ],
  controllers: [GroupsController],
  providers: [GroupsService, PermissionsGuard],
  exports: [GroupsService],
})
export class GroupsModule {}
