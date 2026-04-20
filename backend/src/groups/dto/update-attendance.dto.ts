import {
  IsString,
  IsInt,
  IsEnum,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AttendanceStatus } from '../entities/group-student.entity';

export class StudentAttendanceDto {
  @ApiProperty({ example: 1, description: 'Student ID' })
  @IsInt()
  id: number;

  @ApiProperty({ enum: AttendanceStatus, example: AttendanceStatus.PRESENT })
  @IsEnum(AttendanceStatus)
  attendance_status: AttendanceStatus;

  @ApiPropertyOptional({
    example: 'Did very well today',
    description: 'Per-student note',
  })
  @IsString()
  @IsOptional()
  note?: string;
}

export class UpdateAttendanceDto {
  @ApiPropertyOptional({
    example: 'Group went well overall.',
    description: 'Group-level notes',
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    type: [StudentAttendanceDto],
    description: 'Array of student attendance updates',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentAttendanceDto)
  students: StudentAttendanceDto[];
}
