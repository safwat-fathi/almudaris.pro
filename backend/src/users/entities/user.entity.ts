import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { genSalt, hash } from 'bcrypt';
import { Exclude } from 'class-transformer';
import { Teacher } from '../../teachers/entities/teacher.entity';
import { Student } from '../../students/entities/student.entity';

export enum UserRole {
  TEACHER = 'teacher',
  PARENT = 'parent',
  STUDENT = 'student',
}

@Entity('users')
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

  @Column({ type: 'text', nullable: true, default: 'Africa/Cairo' })
  timezone?: string;

  @OneToOne(() => Teacher, (teacher) => teacher.user)
  teacherProfile?: Teacher;

  @OneToOne(() => Student, (student) => student.user)
  studentProfile?: Student;

  @OneToMany(() => Student, (student) => student.parent)
  children?: Student[];

  @Exclude()
  @Column({ type: 'text', select: false })
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2')) {
      const salt = await genSalt();
      this.password = await hash(this.password, salt);
    }
  }
}
