export enum Permission {
  AUTH_LOGOUT = 'auth:logout',

  TEACHER_INVITE_CODE_READ = 'teacher:invite-code:read',
  TEACHER_STUDENTS_READ = 'teacher:students:read',
  TEACHER_STUDENT_DETAIL_READ = 'teacher:student-detail:read',
  TEACHER_STUDENT_REMOVE = 'teacher:student:remove',

  PARENT_TEACHER_LINK = 'parent:teacher:link',
  PARENT_TEACHERS_READ = 'parent:teachers:read',
  PARENT_CHILDREN_READ = 'parent:children:read',
  PARENT_CHILDREN_CREATE = 'parent:children:create',
  PARENT_CHILDREN_UPDATE = 'parent:children:update',
  PARENT_CHILDREN_ENROLL = 'parent:children:enroll',

  GROUP_CREATE = 'group:create',
  GROUP_READ = 'group:read',
  GROUP_UPDATE = 'group:update',
  GROUP_ATTENDANCE_UPDATE = 'group:attendance:update',
  GROUP_STATUS_UPDATE = 'group:status:update',
  GROUP_CANCEL = 'group:cancel',

  HOMEWORK_CREATE = 'homework:create',
  HOMEWORK_READ = 'homework:read',
  HOMEWORK_STATUS_UPDATE = 'homework:status:update',
  HOMEWORK_SUBMISSIONS_READ = 'homework:submissions:read',
  HOMEWORK_SUBMIT = 'homework:submit',
}
