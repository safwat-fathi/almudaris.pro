import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('submission_attachments')
export class SubmissionAttachment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  submission_id: number;

  @Column()
  file_url: string;

  @Column()
  file_type: string;

  @CreateDateColumn()
  created_at: Date;
}
