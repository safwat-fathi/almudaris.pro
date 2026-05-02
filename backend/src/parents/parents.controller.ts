import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { ParentsService } from './parents.service';
import { LinkTeacherDto } from './dto/link-teacher.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { Permissions } from '../auth/permissions.decorator';
import { Permission } from '../auth/permissions.enum';
import CONSTANTS from 'src/common/constants';

@ApiTags('parents')
@Controller('parents')
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @Post('link-teacher')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.PARENT_TEACHER_LINK)
  @ApiBearerAuth(CONSTANTS.ACCESS_TOKEN)
  @ApiOperation({
    summary:
      'Link the authenticated parent to a teacher using their invite code',
  })
  @ApiBody({ type: LinkTeacherDto })
  @ApiResponse({ status: 201, description: 'Successfully linked to teacher.' })
  @ApiResponse({ status: 401, description: 'Unauthorized or not a parent.' })
  @ApiResponse({
    status: 404,
    description: 'Invalid or expired invitation link.',
  })
  @ApiResponse({ status: 409, description: 'Already linked to this teacher.' })
  async linkTeacher(
    @Req() req: { user: { userId: number } },
    @Body() linkTeacherDto: LinkTeacherDto,
  ) {
    const parentId = req.user.userId; // Provided by JwtStrategy
    return this.parentsService.linkTeacher(parentId, linkTeacherDto.inviteCode);
  }

  @Get('teachers')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.PARENT_TEACHERS_READ)
  @ApiBearerAuth(CONSTANTS.ACCESS_TOKEN)
  @ApiOperation({
    summary: 'List all teachers linked to the authenticated parent',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of linked teachers.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getLinkedTeachers(@Req() req: { user: { userId: number } }) {
    const parentId = req.user.userId;
    return this.parentsService.getLinkedTeachers(parentId);
  }
}
