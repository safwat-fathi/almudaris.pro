import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  Index,
} from 'typeorm';

@Entity('submissions')
@Unique(['homework_id', 'student_id'])
@Index(['homework_id'])
@Index(['student_id'])
export class Submission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  homework_id: number;

  @Column()
  student_id: number;

  @Column({ type: 'text', nullable: true })
  answer_text: string;

  @Column({ default: 1 })
  submission_version: number;

  @CreateDateColumn()
  submitted_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
