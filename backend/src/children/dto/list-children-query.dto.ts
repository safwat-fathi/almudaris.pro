import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { EducationStage } from '../../common/grades/grade-system';

export class ListChildrenQueryDto {
  @ApiPropertyOptional({
    description: 'Optional stage filter for child list',
    enum: EducationStage,
    example: EducationStage.SECONDARY,
  })
  @IsEnum(EducationStage)
  @IsOptional()
  education_stage?: EducationStage;

  @ApiPropertyOptional({
    description: 'Optional year filter for child list',
    example: 3,
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  education_year?: number;
}
