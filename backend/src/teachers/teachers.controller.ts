import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { TeachersService } from './teachers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import CONSTANTS from 'src/common/constants';

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
  @UseGuards(JwtAuthGuard)
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
  async getMyInviteCode(@Req() req) {
    const teacherId = req.user.userId; // Matches the payload from JwtStrategy
    const inviteCode = await this.teachersService.getInviteCode(teacherId);
    return { inviteCode };
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
