import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AttachmentDto {
  @ApiProperty({ description: 'URL of the uploaded file' })
  @IsNotEmpty()
  @IsString()
  file_url: string;

  @ApiProperty({
    description: 'Type of the uploaded file (e.g., PDF, PNG, JPG)',
  })
  @IsNotEmpty()
  @IsString()
  file_type: string;
}

export class CreateSubmissionDto {
  @ApiProperty({
    description: 'ID of the student submitting the homework',
    example: 2,
    type: Number,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  student_id: number;

  @ApiPropertyOptional({
    description: 'Text answer to the homework',
    example: 'Here are my answers...',
  })
  @IsOptional()
  @IsString()
  answer_text?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Homework file attachment',
  })
  @IsOptional()
  file?: any;

  @ApiPropertyOptional({
    type: [AttachmentDto],
    description: 'List of file attachments',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];
}
