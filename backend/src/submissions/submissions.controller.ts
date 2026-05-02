import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { Submission } from './entities/submission.entity';
import { fileFilter } from 'src/common/utils/file-filters';
import { UploadFiles } from 'src/common/decorators/upload-files.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { Permissions } from '../auth/permissions.decorator';
import { Permission } from '../auth/permissions.enum';
import CONSTANTS from 'src/common/constants';

@ApiTags('submissions')
@Controller('homework/:id/submissions')
@ApiBearerAuth(CONSTANTS.ACCESS_TOKEN)
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.HOMEWORK_SUBMIT)
  @ApiOperation({ summary: 'Submit or update a homework response' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          maxItems: 3,
        },
        student_id: { type: 'number' },
        answer_text: { type: 'string' },
      },
    },
  })
  @UploadFiles('files', 3, {
    fileFilter,
    limits: {
      fileSize: 1024 * 1024 * 10, // 10MB
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The submission has been successfully created/updated.',
    type: Submission,
  })
  submit(
    @Param('id', ParseIntPipe) homeworkId: number,
    @Body() createSubmissionDto: CreateSubmissionDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    if (files?.length) {
      createSubmissionDto.attachments = files.map((file) => ({
        file_url: file.filename,
        file_type: file.mimetype,
      }));
    }

    return this.submissionsService.submit(homeworkId, createSubmissionDto);
  }
}
