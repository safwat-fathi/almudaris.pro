import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HomeworkService } from './homework.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { Homework } from './entities/homework.entity';

@ApiTags('homework')
@Controller('homework')
export class HomeworkController {
  constructor(private readonly homeworkService: HomeworkService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new homework assignment' })
  @ApiResponse({
    status: 201,
    description: 'The homework has been successfully created.',
    type: Homework,
  })
  create(@Body() createHomeworkDto: CreateHomeworkDto) {
    return this.homeworkService.create(createHomeworkDto);
  }

  @Get('group/:groupId')
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
  @ApiOperation({ summary: 'Get all submissions for a specific homework' })
  @ApiResponse({
    status: 200,
    description: 'List of student submissions with statuses.',
  })
  getSubmissions(@Param('id', ParseIntPipe) id: number) {
    return this.homeworkService.getSubmissionsByHomework(id);
  }
}
