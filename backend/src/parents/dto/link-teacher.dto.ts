import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LinkTeacherDto {
  @ApiProperty({
    description: 'The unique invitation code belonging to the teacher.',
    example: '8f7b2a',
  })
  @IsString()
  @IsNotEmpty()
  inviteCode: string;
}
