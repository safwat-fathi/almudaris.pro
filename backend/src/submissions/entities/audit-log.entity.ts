import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('submission_audit_logs')
export class SubmissionAuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  submission_id: number;

  @Column()
  homework_id: number;

  @Column()
  student_id: number;

  @Column({ type: 'text', nullable: true })
  answer_text: string;

  @Column({ type: 'jsonb', nullable: true })
  attachment_metadata: any;

  @Column()
  attempt_number: number;

  @CreateDateColumn()
  created_at: Date;
}
