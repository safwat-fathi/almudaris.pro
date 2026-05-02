import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { Permissions } from '../auth/permissions.decorator';
import { Permission } from '../auth/permissions.enum';
import { GroupStatus } from './entities/group.entity';
import { EducationStage } from '../common/grades/grade-system';
import CONSTANTS from 'src/common/constants';

@ApiTags('groups')
@Controller('groups')
@ApiBearerAuth(CONSTANTS.ACCESS_TOKEN)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  // ==================== US1: Create Group ====================

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.GROUP_CREATE)
  @ApiOperation({ summary: 'Create a new group or recurring series' })
  @ApiBody({ type: CreateGroupDto })
  @ApiResponse({
    status: 201,
    description: 'Group(s) created successfully. May include overlap warnings.',
  })
  @ApiResponse({
    status: 403,
    description: 'Student does not belong to teacher.',
  })
  async createGroup(@Req() req, @Body() dto: CreateGroupDto) {
    const teacherId = (req as { user: { userId: number } }).user.userId;
    return this.groupsService.createGroup(dto, teacherId);
  }

  // ==================== US1: List & Get Groups ====================

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.GROUP_READ)
  @ApiOperation({ summary: 'List groups for the authenticated teacher' })
  @ApiQuery({
    name: 'from',
    required: false,
    description: 'Start date filter (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    description: 'End date filter (YYYY-MM-DD)',
  })
  @ApiQuery({ name: 'status', required: false, enum: GroupStatus })
  @ApiQuery({ name: 'student_id', required: false, type: Number })
  @ApiQuery({
    name: 'education_stage',
    required: false,
    enum: ['PRIMARY', 'PREPARATORY', 'SECONDARY', 'UNASSIGNED'],
  })
  @ApiQuery({ name: 'education_year', required: false, type: Number })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of groups returned successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid education_stage/education_year combination.',
  })
  async findAll(
    @Req() req,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('status') status?: GroupStatus,
    @Query('student_id') student_id?: string,
    @Query('education_stage') education_stage?: string,
    @Query('education_year') education_year?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const teacherId = (req as { user: { userId: number } }).user.userId;
    return this.groupsService.findAll(
      teacherId,
      {
        from,
        to,
        status,
        student_id: student_id ? parseInt(student_id, 10) : undefined,
        education_stage: education_stage as EducationStage | undefined,
        education_year: education_year
          ? parseInt(education_year, 10)
          : undefined,
      },
      {
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? parseInt(limit, 10) : 10,
      },
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.GROUP_READ)
  @ApiOperation({ summary: 'Get a single group with full details' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Group details returned successfully.',
  })
  @ApiResponse({ status: 404, description: 'Group not found.' })
  async findOne(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const teacherId = (req as { user: { userId: number } }).user.userId;
    return this.groupsService.findOne(id, teacherId);
  }

  // ==================== US2: Update Group ====================

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.GROUP_UPDATE)
  @ApiOperation({ summary: 'Update an upcoming group with edit scope support' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateGroupDto })
  @ApiResponse({
    status: 200,
    description: 'Group updated successfully. May include overlap warnings.',
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot edit completed/cancelled groups.',
  })
  async updateGroup(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGroupDto,
  ) {
    const teacherId = (req as { user: { userId: number } }).user.userId;
    return this.groupsService.updateGroup(id, dto, teacherId);
  }

  // ==================== US3: Attendance & Status ====================

  @Patch(':id/attendance')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.GROUP_ATTENDANCE_UPDATE)
  @ApiOperation({
    summary: 'Update attendance, per-student notes, and group notes',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateAttendanceDto })
  @ApiResponse({ status: 200, description: 'Attendance updated successfully.' })
  async updateAttendance(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAttendanceDto,
  ) {
    const teacherId = (req as { user: { userId: number } }).user.userId;
    return this.groupsService.updateAttendance(id, dto, teacherId);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.GROUP_STATUS_UPDATE)
  @ApiOperation({ summary: 'Manually mark a group as Completed' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateStatusDto })
  @ApiResponse({ status: 200, description: 'Status updated to Completed.' })
  @ApiResponse({
    status: 400,
    description: 'Only scheduled groups can be completed.',
  })
  async updateStatus(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const teacherId = (req as { user: { userId: number } }).user.userId;
    return this.groupsService.updateStatus(id, teacherId);
  }

  // ==================== US5: Cancel Group ====================

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.GROUP_CANCEL)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Cancel a group (soft-delete via Cancelled status)',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Group cancelled successfully.' })
  @ApiResponse({ status: 404, description: 'Group not found.' })
  async cancelGroup(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const teacherId = (req as { user: { userId: number } }).user.userId;
    return this.groupsService.cancelGroup(id, teacherId);
  }
}
