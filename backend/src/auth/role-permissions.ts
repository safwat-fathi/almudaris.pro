import { UserRole } from '../users/entities/user.entity';
import { Permission } from './permissions.enum';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.TEACHER]: [
    Permission.AUTH_LOGOUT,
    Permission.TEACHER_INVITE_CODE_READ,
    Permission.TEACHER_STUDENTS_READ,
    Permission.TEACHER_STUDENT_DETAIL_READ,
    Permission.TEACHER_STUDENT_REMOVE,
    Permission.GROUP_CREATE,
    Permission.GROUP_READ,
    Permission.GROUP_UPDATE,
    Permission.GROUP_ATTENDANCE_UPDATE,
    Permission.GROUP_STATUS_UPDATE,
    Permission.GROUP_CANCEL,
    Permission.HOMEWORK_CREATE,
    Permission.HOMEWORK_READ,
    Permission.HOMEWORK_STATUS_UPDATE,
    Permission.HOMEWORK_SUBMISSIONS_READ,
  ],
  [UserRole.PARENT]: [
    Permission.AUTH_LOGOUT,
    Permission.PARENT_TEACHER_LINK,
    Permission.PARENT_TEACHERS_READ,
    Permission.PARENT_CHILDREN_READ,
    Permission.PARENT_CHILDREN_CREATE,
    Permission.PARENT_CHILDREN_UPDATE,
    Permission.PARENT_CHILDREN_ENROLL,
		Permission.HOMEWORK_READ,
		Permission.HOMEWORK_SUBMIT,
  ],
  [UserRole.STUDENT]: [
    Permission.AUTH_LOGOUT,
  ],
};

const USER_ROLE_VALUES = Object.values(UserRole) as string[];

export function isUserRole(role: string): role is UserRole {
  return USER_ROLE_VALUES.includes(role);
}
