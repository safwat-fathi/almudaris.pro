import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { HomeworkService } from './homework.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { Homework } from './entities/homework.entity';
import { EducationStage } from '../common/grades/grade-system';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { Permissions } from '../auth/permissions.decorator';
import { Permission } from '../auth/permissions.enum';
import CONSTANTS from 'src/common/constants';

@ApiTags('homework')
@Controller('homework')
@ApiBearerAuth(CONSTANTS.ACCESS_TOKEN)
export class HomeworkController {
  constructor(private readonly homeworkService: HomeworkService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.HOMEWORK_CREATE)
  @ApiOperation({ summary: 'Create a new homework assignment' })
  @ApiBody({ type: CreateHomeworkDto })
  @ApiResponse({
    status: 201,
    description: 'The homework has been successfully created.',
    type: Homework,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid education_stage/education_year combination.',
  })
  create(@Body() createHomeworkDto: CreateHomeworkDto) {
    return this.homeworkService.create(createHomeworkDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.HOMEWORK_READ)
  @ApiOperation({
    summary: 'Get all homework assignments with optional stage/year filters',
  })
  @ApiQuery({ name: 'education_stage', required: false, enum: EducationStage })
  @ApiQuery({ name: 'education_year', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of homework assignments.',
    type: [Homework],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid education_stage/education_year combination.',
  })
  findAll(
    @Query('education_stage') educationStage?: EducationStage,
    @Query('education_year') educationYear?: string,
  ) {
    return this.homeworkService.findAll({
      education_stage: educationStage,
      education_year:
        educationYear !== undefined ? parseInt(educationYear, 10) : undefined,
    });
  }

  @Get('group/:groupId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.HOMEWORK_READ)
  @ApiOperation({
    summary: 'Get all homework assignments for a specific group',
  })
  @ApiResponse({
    status: 200,
    description: 'List of homework assignments for the group.',
    type: [Homework],
  })
  findByGroupId(@Param('groupId', ParseIntPipe) groupId: number) {
    return this.homeworkService.findByGroupId(groupId);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.HOMEWORK_STATUS_UPDATE)
  @ApiOperation({ summary: 'Toggle homework open/closed status' })
  @ApiResponse({
    status: 200,
    description: 'The homework status has been successfully updated.',
    type: Homework,
  })
  toggleStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('is_open') isOpen: boolean,
  ) {
    return this.homeworkService.toggleStatus(id, isOpen);
  }

  @Get(':id/submissions')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.HOMEWORK_SUBMISSIONS_READ)
  @ApiOperation({ summary: 'Get all submissions for a specific homework' })
  @ApiResponse({
    status: 200,
    description: 'List of student submissions with statuses.',
  })
  getSubmissions(@Param('id', ParseIntPipe) id: number) {
    return this.homeworkService.getSubmissionsByHomework(id);
  }
}
