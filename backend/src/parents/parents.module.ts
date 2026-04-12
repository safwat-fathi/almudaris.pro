import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParentsController } from './parents.controller';
import { ParentsService } from './parents.service';
import { ParentTeacherLink } from './entities/parent-teacher-link.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ParentTeacherLink, User])],
  controllers: [ParentsController],
  providers: [ParentsService],
})
export class ParentsModule {}
