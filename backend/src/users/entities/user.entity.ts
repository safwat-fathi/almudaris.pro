import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { genSalt, hash } from 'bcrypt';
import { Exclude } from 'class-transformer';

export enum UserRole {
  TEACHER = 'teacher',
  PARENT = 'parent',
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
