import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
}
