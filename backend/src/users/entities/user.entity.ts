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
} from 'typeorm';
import { genSalt, hash } from 'bcrypt';
import { Exclude } from 'class-transformer';

export enum UserRole {
  TEACHER = 'teacher',
  PARENT = 'parent',
  STUDENT = 'student',
}

@Entity('users')
@Check(`"invite_code" IS NULL OR "role" = 'teacher'`)
@Check(`"parent_id" IS NULL OR "role" = 'student'`)
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
}
