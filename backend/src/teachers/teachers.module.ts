import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeachersController } from './teachers.controller';
import { TeachersService } from './teachers.service';
import { User } from '../users/entities/user.entity';
import { ChildTeacherEnrollment } from '../children/entities/child-teacher-enrollment.entity';
import { Teacher } from './entities/teacher.entity';
import { Student } from '../students/entities/student.entity';
import { PermissionsGuard } from '../auth/permissions.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Teacher, Student, ChildTeacherEnrollment]),
  ],
  controllers: [TeachersController],
  providers: [TeachersService, PermissionsGuard],
  exports: [TeachersService],
})
export class TeachersModule {}
