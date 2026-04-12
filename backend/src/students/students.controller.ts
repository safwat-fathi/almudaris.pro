import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { EnrollStudentDto } from './dto/enroll-student.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import CONSTANTS from 'src/common/constants';

@ApiTags('students')
@Controller('parents/students')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth(CONSTANTS.ACCESS_TOKEN)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all students managed by the authenticated parent',
  })
  @ApiResponse({
    status: 200,
    description: 'List of students returned successfully.',
  })
  async getStudents(@Req() req): Promise<User[]> {
    const parentId = req.user.userId;
    return this.studentsService.getStudentsByParent(parentId);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new student profile under the authenticated parent',
  })
  @ApiBody({ type: CreateStudentDto })
  @ApiResponse({ status: 201, description: 'Student created successfully.' })
  async createStudent(@Req() req, @Body() createStudentDto: CreateStudentDto) {
    const parentId = req.user.userId;
    const student = await this.studentsService.createStudent(
      parentId,
      createStudentDto,
    );
    return {
      message: 'Student created successfully.',
      student: { id: student.id, name: student.name },
    };
  }

  @Post(':studentId/enroll')
  @ApiOperation({ summary: 'Enroll a student with a specific linked teacher' })
  @ApiParam({ name: 'studentId', type: 'number' })
  @ApiBody({ type: EnrollStudentDto })
  @ApiResponse({ status: 201, description: 'Student enrolled successfully.' })
  @ApiResponse({
    status: 401,
    description: 'Not authorized or parent not linked to the teacher.',
  })
  @ApiResponse({ status: 404, description: 'Student or Teacher not found.' })
  @ApiResponse({
    status: 409,
    description: 'Student already enrolled with this teacher.',
  })
  async enrollStudent(
    @Req() req,
    @Param('studentId', ParseIntPipe) studentId: number,
    @Body() enrollDto: EnrollStudentDto,
  ) {
    const parentId = req.user.userId;
    return this.studentsService.enrollStudent(parentId, studentId, enrollDto);
  }
}
