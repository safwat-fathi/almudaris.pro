import { IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EducationStage } from '../../common/grades/grade-system';

export class CreateChildDto {
  @ApiProperty({ description: 'The name of the child', example: 'Ahmed Ali' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'The email of the child',
    example: 'ahmed@child.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description:
      'A unique code if the teacher required one upon linking (business logic)',
    example: 'abcde',
  })
  @IsString()
  @IsOptional()
  inviteCode?: string;

  @ApiProperty({
    description: 'The education stage of the child',
    enum: EducationStage,
    example: EducationStage.SECONDARY,
  })
  @IsEnum(EducationStage)
  @IsNotEmpty()
  education_stage: EducationStage;

  @ApiProperty({
    description: 'The education year within the stage',
    example: 3,
  })
  @IsInt()
  @IsNotEmpty()
  education_year: number;
}
