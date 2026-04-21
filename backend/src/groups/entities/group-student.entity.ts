import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Group } from './group.entity';

/** Attendance status enum */
export enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent',
  NOT_SET = 'Not set',
}

/**
 * Many-to-many attendance relationship between a Group and a Student.
 * Contains immutable student_name snapshot and per-student notes.
 */
@Entity('group_students')
export class GroupStudent extends BaseEntity {
  @PrimaryColumn()
  group_id: number;

  @PrimaryColumn()
  student_id: number;

  @ManyToOne(() => Group, (group) => group.students, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: User;

  /** Immutable snapshot of student's name at group creation time (FR-017) */
  @Column({ type: 'text' })
  student_name: string;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.NOT_SET,
  })
  attendance_status: AttendanceStatus;

  /** Per-student note, editable regardless of group status (FR-020) */
  @Column({ type: 'text', nullable: true })
  note?: string;

  /** Auto-set when note is created or updated */
  @Column({ type: 'timestamptz', nullable: true })
  note_updated_at?: Date;
}
