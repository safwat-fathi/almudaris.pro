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
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import {
  EducationStage,
  formatGradeLabel,
} from '../../common/grades/grade-system';

@Entity('teachers')
@Check(`(
  ("education_stage" = 'PRIMARY' AND "education_year" BETWEEN 1 AND 6)
  OR ("education_stage" IN ('PREPARATORY', 'SECONDARY') AND "education_year" BETWEEN 1 AND 3)
  OR ("education_stage" = 'UNASSIGNED' AND "education_year" = 0)
)`)
@Index(['education_stage', 'education_year'])
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', unique: true })
  user_id: number;

  @OneToOne(() => User, (user) => user.teacherProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: EducationStage,
    default: EducationStage.UNASSIGNED,
  })
  education_stage: EducationStage;

  @Column({ type: 'int', default: 0 })
  education_year: number;

  @Column({ type: 'text', unique: true, nullable: true })
  invite_code?: string;

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
