import { IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EnrollStudentDto {
  @ApiProperty({
    description: 'The ID of the teacher to enroll the student with',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  teacherId: number;
}
