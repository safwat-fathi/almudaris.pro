import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GroupStatus } from '../entities/group.entity';

export class UpdateStatusDto {
  @ApiProperty({
    enum: [GroupStatus.COMPLETED],
    example: GroupStatus.COMPLETED,
    description: 'Only "Completed" is allowed for manual status transition',
  })
  @IsEnum([GroupStatus.COMPLETED], {
    message: 'Only "Completed" status is allowed',
  })
  status: GroupStatus.COMPLETED;
}
