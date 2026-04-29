import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Check,
  Index,
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { EducationStage, formatGradeLabel } from '../../common/grades/grade-system';

@Entity('homework')
@Check(`(
  ("education_stage" = 'PRIMARY' AND "education_year" BETWEEN 1 AND 6)
  OR ("education_stage" IN ('PREPARATORY', 'SECONDARY') AND "education_year" BETWEEN 1 AND 3)
  OR ("education_stage" = 'UNASSIGNED' AND "education_year" = 0)
)`)
@Index(['education_stage', 'education_year'])
export class Homework {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  group_id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'timestamp', nullable: true })
  due_date?: Date | null;

  @Column({ default: true })
  is_open: boolean;

  @Column({
    type: 'enum',
    enum: EducationStage,
    default: EducationStage.UNASSIGNED,
  })
  education_stage: EducationStage;

  @Column({ type: 'int', default: 0 })
  education_year: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  grade_label?: string;

  @AfterLoad()
  @BeforeInsert()
  @BeforeUpdate()
  computeGradeLabel() {
    if (this.education_stage !== undefined && this.education_year !== undefined) {
      this.grade_label = formatGradeLabel(this.education_stage, this.education_year);
    }
  }
}
