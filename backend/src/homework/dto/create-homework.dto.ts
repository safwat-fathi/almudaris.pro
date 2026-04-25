import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsDateString,
} from 'class-validator';

export class CreateHomeworkDto {
  @ApiProperty({
    description: 'The ID of the group the homework is assigned to',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  group_id: number;

  @ApiProperty({
    description: 'Title of the homework',
    example: 'Math Assignment 1',
    minLength: 3,
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the homework',
    example: 'Complete exercises 1 to 5 on page 10.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Due date of the homework (ISO 8601)',
    example: '2026-05-01T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  due_date?: string | null;
}
