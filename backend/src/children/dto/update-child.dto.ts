import { IsString, IsOptional, IsEmail, IsEnum, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EducationStage } from '../../common/grades/grade-system';

export class UpdateChildDto {
  @ApiPropertyOptional({ description: 'The name of the child', example: 'Ahmed Ali' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'The email of the child',
    example: 'ahmed@child.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'The education stage of the child',
    enum: EducationStage,
    example: EducationStage.SECONDARY,
  })
  @IsEnum(EducationStage)
  @IsOptional()
  education_stage?: EducationStage;

  @ApiPropertyOptional({
    description: 'The education year within the stage',
    example: 3,
  })
  @IsInt()
  @IsOptional()
  education_year?: number;
}
