import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParentsController } from './parents.controller';
import { ParentsService } from './parents.service';
import { ParentTeacherLink } from './entities/parent-teacher-link.entity';
import { User } from '../users/entities/user.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { PermissionsGuard } from '../auth/permissions.guard';

@Module({
  imports: [TypeOrmModule.forFeature([ParentTeacherLink, User, Teacher])],
  controllers: [ParentsController],
  providers: [ParentsService, PermissionsGuard],
})
export class ParentsModule {}
