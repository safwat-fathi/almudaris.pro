import { IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EnrollChildDto {
  @ApiProperty({
    description: 'The ID of the teacher to enroll the child with',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  teacherId: number;
}
