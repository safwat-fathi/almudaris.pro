import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import {
  EducationStage,
  formatGradeLabel,
} from '../../common/grades/grade-system';

@Entity('students')
@Check(`(
  ("education_stage" = 'PRIMARY' AND "education_year" BETWEEN 1 AND 6)
  OR ("education_stage" IN ('PREPARATORY', 'SECONDARY') AND "education_year" BETWEEN 1 AND 3)
  OR ("education_stage" = 'UNASSIGNED' AND "education_year" = 0)
)`)
@Index(['education_stage', 'education_year'])
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', unique: true })
  user_id: number;

  @OneToOne(() => User, (user) => user.studentProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int', nullable: true })
  parent_id?: number;

  @ManyToOne(() => User, (user) => user.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent?: User;

  @Column({
    type: 'enum',
    enum: EducationStage,
    default: EducationStage.UNASSIGNED,
  })
  education_stage: EducationStage;

  @Column({ type: 'int', default: 0 })
  education_year: number;

  @Column({ type: 'text', nullable: true })
  legacy_grade?: string;

  @Column({ type: 'boolean', default: true })
  grade_needs_review: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  grade_label?: string;

  @AfterLoad()
  @BeforeInsert()
  @BeforeUpdate()
  computeGradeLabel() {
    if (
      this.education_stage !== undefined &&
      this.education_year !== undefined
    ) {
      this.grade_label = formatGradeLabel(
        this.education_stage,
        this.education_year,
      );
    }
  }
}
