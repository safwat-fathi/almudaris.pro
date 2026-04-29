import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
  AfterLoad,
  Check,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { RecurringSeries } from './recurring-series.entity';
import { GroupStudent } from './group-student.entity';
import { EducationStage, formatGradeLabel } from '../../common/grades/grade-system';

/** Group status enum */
export enum GroupStatus {
  SCHEDULED = 'Scheduled',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

/** Location type enum */
export enum LocationType {
  ONLINE = 'Online',
  PHYSICAL = 'Physical',
}

/**
 * Core teaching event entity.
 * Times are stored in UTC. `end_time` is auto-computed from `start_time + duration_minutes`.
 */
@Entity('groups')
@Check(`(
  ("education_stage" = 'PRIMARY' AND "education_year" BETWEEN 1 AND 6)
  OR ("education_stage" IN ('PREPARATORY', 'SECONDARY') AND "education_year" BETWEEN 1 AND 3)
  OR ("education_stage" = 'UNASSIGNED' AND "education_year" = 0)
)`)
@Index(['education_stage', 'education_year'])
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  teacher_id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @Column({ type: 'text', nullable: true })
  title?: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time with time zone' })
  start_time: string;

  @Column({ type: 'time with time zone' })
  end_time: string;

  @Column({ type: 'int' })
  duration_minutes: number;

  @Column({
    type: 'enum',
    enum: GroupStatus,
    default: GroupStatus.SCHEDULED,
  })
  status: GroupStatus;

  @Column({
    type: 'enum',
    enum: LocationType,
  })
  location_type: LocationType;

  @Column({ type: 'text', nullable: true })
  location_link?: string;

  @Column({ type: 'text', nullable: true })
  location_place?: string;

  @Column({
    type: 'enum',
    enum: EducationStage,
    default: EducationStage.UNASSIGNED,
  })
  education_stage: EducationStage;

  @Column({ type: 'int', default: 0 })
  education_year: number;

  @Column({ nullable: true })
  recurring_series_id?: number;

  @ManyToOne(() => RecurringSeries, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'recurring_series_id' })
  recurring_series?: RecurringSeries;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column()
  created_by_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  created_by: User;

  @OneToMany(() => GroupStudent, (gs) => gs.group, { cascade: true })
  students: GroupStudent[];

  // ==================== Hooks ====================

  /**
   * Auto-compute end_time from start_time + duration_minutes.
   * Backend is the single source of truth for this derived-but-stored value (FR-016).
   */
  @BeforeInsert()
  @BeforeUpdate()
  computeEndTime() {
    if (this.start_time && this.duration_minutes) {
      const [hours, minutes] = this.start_time.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes + this.duration_minutes;
      const endHours = Math.floor(totalMinutes / 60) % 24;
      const endMinutes = totalMinutes % 60;
      this.end_time = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
    }
  }

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
