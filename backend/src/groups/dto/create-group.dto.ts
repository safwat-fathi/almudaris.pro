import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsArray,
  IsEnum,
  IsOptional,
  IsBoolean,
  Min,
  Max,
  ArrayMinSize,
  IsUrl,
  ValidateIf,
  IsMilitaryTime,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LocationType } from '../entities/group.entity';
import { GROUPS_CONFIG } from '../../config/groups.config';

export class CreateGroupDto {
  @ApiProperty({
    example: '2026-05-01',
    description: 'Group date (YYYY-MM-DD)',
  })
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: '14:00', description: 'Start time in UTC (HH:MM)' })
  @IsString()
  @IsNotEmpty()
  @IsMilitaryTime()
  start_time: string;

  @ApiProperty({ example: 60, description: 'Duration in minutes' })
  @IsInt()
  @Min(1)
  duration_minutes: number;

  @ApiProperty({ example: [1, 2], description: 'Array of student IDs' })
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  student_ids: number[];

  @ApiProperty({ enum: LocationType, example: LocationType.ONLINE })
  @IsEnum(LocationType)
  location_type: LocationType;

  @ApiPropertyOptional({
    example: 'https://zoom.us/j/123456',
    description: 'Required if location_type is Online',
  })
  @ValidateIf((o: CreateGroupDto) => o.location_type === LocationType.ONLINE)
  @IsUrl()
  @IsNotEmpty()
  location_link?: string;

  @ApiPropertyOptional({
    example: 'مركز تعليمي',
    description: 'Required if location_type is Physical',
  })
  @ValidateIf((o: CreateGroupDto) => o.location_type === LocationType.PHYSICAL)
  @IsString()
  @IsNotEmpty()
  location_place?: string;

  @ApiPropertyOptional({
    example: 'Math Lesson',
    description: 'Optional title',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether this is a recurring group',
  })
  @IsBoolean()
  @IsOptional()
  is_recurring?: boolean;

  @ApiPropertyOptional({ example: 'WEEKLY', description: 'Recurrence pattern' })
  @IsString()
  @IsOptional()
  recurrence_pattern?: string;

  @ApiPropertyOptional({
    example: 10,
    description: `Number of recurring instances (max ${GROUPS_CONFIG.MAX_RECURRING_INSTANCES})`,
  })
  @IsInt()
  @Min(2)
  @Max(GROUPS_CONFIG.MAX_RECURRING_INSTANCES)
  @IsOptional()
  recurrence_count?: number;
}
