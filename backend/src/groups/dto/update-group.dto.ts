import {
  IsString,
  IsInt,
  IsArray,
  IsEnum,
  IsOptional,
  Min,
  ArrayMinSize,
  IsUrl,
  ValidateIf,
	IsMilitaryTime,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { LocationType } from '../entities/group.entity';

/** Edit scope for recurring groups */
export enum EditScope {
  THIS = 'THIS',
  THIS_AND_FUTURE = 'THIS_AND_FUTURE',
  ALL = 'ALL',
}

export class UpdateGroupDto {
  @ApiPropertyOptional({ example: '2026-05-01' })
  @IsString()
  @IsOptional()
  date?: string;

  @ApiPropertyOptional({ example: '14:00' })
  @IsString()
  @IsOptional()
	@IsMilitaryTime()
  start_time?: string;

  @ApiPropertyOptional({ example: 60 })
  @IsInt()
  @Min(1)
  @IsOptional()
  duration_minutes?: number;

  @ApiPropertyOptional({ example: [1, 2, 3] })
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @IsOptional()
  student_ids?: number[];

  @ApiPropertyOptional({ enum: LocationType })
  @IsEnum(LocationType)
  @IsOptional()
  location_type?: LocationType;

  @ApiPropertyOptional({ example: 'https://zoom.us/j/123456' })
  @ValidateIf((o) => o.location_type === LocationType.ONLINE)
  @IsUrl()
  @IsOptional()
  location_link?: string;

  @ApiPropertyOptional({ example: 'مركز تعليمي' })
  @ValidateIf((o) => o.location_type === LocationType.PHYSICAL)
  @IsString()
  @IsOptional()
  location_place?: string;

  @ApiPropertyOptional({ example: 'Updated Math Lesson' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    enum: EditScope,
    default: EditScope.THIS,
    description: 'Edit scope for recurring groups',
  })
  @IsEnum(EditScope)
  @IsOptional()
  edit_scope?: EditScope = EditScope.THIS;
}
