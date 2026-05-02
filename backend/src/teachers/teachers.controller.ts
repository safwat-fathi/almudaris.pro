import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { TeachersService } from './teachers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { Permissions } from '../auth/permissions.decorator';
import { Permission } from '../auth/permissions.enum';
import CONSTANTS from 'src/common/constants';
import { EducationStage } from 'src/common/grades/grade-system';

/**
 * Controller for handling Teacher-specific operations such as invitation generation and retrieval.
 */
@ApiTags('teachers')
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  /**
   * Retrieves or generates a unique invitation code for the currently authenticated teacher.
   * Only accessible by users with the Teacher role.
   */
  @Get('invite-code')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.TEACHER_INVITE_CODE_READ)
  @ApiBearerAuth(CONSTANTS.ACCESS_TOKEN)
  @ApiOperation({
    summary: 'Get or generate the invite code for the authenticated teacher',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the unique invite code for the teacher.',
    schema: { example: { inviteCode: '8f7b2a' } },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized if not authenticated or not a teacher.',
  })
  async getMyInviteCode(@Req() req: { user: { userId: number } }) {
    const teacherId = req.user.userId; // Matches the payload from JwtStrategy
    const inviteCode = await this.teachersService.getInviteCode(teacherId);
    return { inviteCode };
  }

  /**
   * Retrieves all students enrolled with the currently authenticated teacher.
   */
  @Get('students')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.TEACHER_STUDENTS_READ)
  @ApiBearerAuth(CONSTANTS.ACCESS_TOKEN)
  @ApiOperation({
    summary: 'Get all students enrolled with the authenticated teacher',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of students with their IDs and names.',
    schema: { example: [{ id: 1, name: 'Student Name' }] },
  })
  @ApiQuery({
    name: 'education_stage',
    required: false,
    enum: ['PRIMARY', 'PREPARATORY', 'SECONDARY', 'UNASSIGNED'],
  })
  @ApiQuery({ name: 'education_year', required: false, type: Number })
  @ApiResponse({
    status: 400,
    description: 'Invalid education_stage/education_year combination.',
  })
  async getMyStudents(
    @Req() req: { user: { userId: number } },
    @Query('education_stage')
    educationStage?: EducationStage,
    @Query('education_year') educationYear?: string,
  ) {
    const teacherId = req.user.userId;
    return this.teachersService.getStudents(teacherId, {
      education_stage: educationStage,
      education_year:
        educationYear !== undefined ? parseInt(educationYear, 10) : undefined,
    });
  }

  /**
   * Retrieves details of a specific student enrolled with the currently authenticated teacher.
   */
  @Get('students/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.TEACHER_STUDENT_DETAIL_READ)
  @ApiBearerAuth(CONSTANTS.ACCESS_TOKEN)
  @ApiOperation({
    summary:
      'Get details of a specific student enrolled with the authenticated teacher',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the student details.',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found or not enrolled with this teacher.',
  })
  async getStudentDetails(
    @Req() req: { user: { userId: number } },
    @Param('id', ParseIntPipe) studentId: number,
  ) {
    const teacherId = req.user.userId;
    return this.teachersService.getActiveEnrollmentOrFail(teacherId, studentId);
  }

  /**
   * Removes a student from the authenticated teacher's class.
   */
  @Delete('students/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.TEACHER_STUDENT_REMOVE)
  @ApiBearerAuth(CONSTANTS.ACCESS_TOKEN)
  @ApiOperation({
    summary: "Remove a student from the authenticated teacher's class",
  })
  @ApiResponse({
    status: 200,
    description: 'Student removed successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found or not enrolled with this teacher.',
  })
  async removeStudent(
    @Req() req: { user: { userId: number } },
    @Param('id', ParseIntPipe) studentId: number,
  ) {
    const teacherId = req.user.userId;
    return this.teachersService.removeStudent(teacherId, studentId);
  }

  /**
   * Retrieves the public profile of a teacher using their unique invite code.
   * This is used by parents when they click the invitation link to verify the teacher's identity.
   */
  @Get('invite/:code')
  @ApiOperation({ summary: 'Get public teacher profile by invite code' })
  @ApiParam({
    name: 'code',
    description: 'The unique invitation code of the teacher',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the public profile of the teacher.',
    schema: { example: { id: 1, name: 'Teacher Name' } },
  })
  @ApiResponse({
    status: 404,
    description: 'Teacher not found or link is inactive.',
  })
  async getTeacherByInviteCode(@Param('code') code: string) {
    const teacher = await this.teachersService.findByInviteCode(code);
    return teacher;
  }
}
