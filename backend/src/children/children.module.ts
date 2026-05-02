import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChildrenController } from './children.controller';
import { ChildrenService } from './children.service';
import { User } from '../users/entities/user.entity';
import { ChildTeacherEnrollment } from './entities/child-teacher-enrollment.entity';
import { ParentTeacherLink } from '../parents/entities/parent-teacher-link.entity';
import { Student } from '../students/entities/student.entity';
import { PermissionsGuard } from '../auth/permissions.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Student,
      ChildTeacherEnrollment,
      ParentTeacherLink,
    ]),
  ],
  controllers: [ChildrenController],
  providers: [ChildrenService, PermissionsGuard],
})
export class ChildrenModule {}
