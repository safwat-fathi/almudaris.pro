import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChildrenController } from './children.controller';
import { ChildrenService } from './children.service';
import { User } from '../users/entities/user.entity';
import { ChildTeacherEnrollment } from './entities/child-teacher-enrollment.entity';
import { ParentTeacherLink } from '../parents/entities/parent-teacher-link.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ChildTeacherEnrollment, ParentTeacherLink]),
  ],
  controllers: [ChildrenController],
  providers: [ChildrenService],
})
export class ChildrenModule {}
