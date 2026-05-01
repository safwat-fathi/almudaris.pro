import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
  Column,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('student_teacher_enrollments')
export class ChildTeacherEnrollment {
  @PrimaryColumn()
  student_id: number;

  @PrimaryColumn()
  teacher_id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  child: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  deactivated_at: Date;

  @Column({
    type: 'int',
    nullable: true,
  })
  deactivated_by: number;
}
