import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
  OneToMany,
  Check,
  JoinColumn,
  Index,
  AfterLoad,
} from 'typeorm';
import { genSalt, hash } from 'bcrypt';
import { Exclude } from 'class-transformer';
import { EducationStage, formatGradeLabel } from '../../common/grades/grade-system';

export enum UserRole {
  TEACHER = 'teacher',
  PARENT = 'parent',
  STUDENT = 'student',
}

@Entity('users')
@Check(`"invite_code" IS NULL OR "role" = 'teacher'`)
@Check(`"parent_id" IS NULL OR "role" = 'student'`)
@Check(`(
  ("education_stage" = 'PRIMARY' AND "education_year" BETWEEN 1 AND 6)
  OR ("education_stage" IN ('PREPARATORY', 'SECONDARY') AND "education_year" BETWEEN 1 AND 3)
  OR ("education_stage" = 'UNASSIGNED' AND "education_year" = 0)
)`)
@Index(['education_stage', 'education_year'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PARENT,
  })
  role: UserRole;

  @Column({ default: false })
  is_active: boolean;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', unique: true, nullable: true })
  phone: string;

  @Column({ type: 'text', unique: true, nullable: true })
  email?: string;

  @Column({ type: 'text', unique: true, nullable: true })
  invite_code?: string;

  @Column({ type: 'text', nullable: true, default: 'Africa/Cairo' })
  timezone?: string;

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

  @ManyToOne(() => User, (user) => user.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent?: User;

  @OneToMany(() => User, (user) => user.parent)
  children?: User[];

  @Exclude()
  @Column({ type: 'text', select: false })
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  // ==================== Hooks ====================

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2')) {
      // Only hash if not already hashed (bcrypt hashes start with $2)
      const salt = await genSalt();
      this.password = await hash(this.password, salt);
    }
  }

  grade_label?: string;

  @AfterLoad()
  @BeforeInsert()
  @BeforeUpdate()
  computeGradeLabel() {
    if (this.role === UserRole.STUDENT && this.education_stage !== undefined && this.education_year !== undefined) {
      this.grade_label = formatGradeLabel(this.education_stage, this.education_year);
    }
  }
}
