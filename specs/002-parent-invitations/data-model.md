# Data Model: Parent Invitations

## Entities

### 1. User (Existing, Updated)
- `id`: SERIAL, Primary Key
- `role`: Enum ('TEACHER', 'PARENT', 'STUDENT')
- `name`: VARCHAR
- `email`: VARCHAR (Nullable)
- `phone`: VARCHAR (Nullable)
- `password_hash`: VARCHAR

### 2. TeacherProfile (Existing)
- `id`: SERIAL, Primary Key
- `user_id`: INTEGER, Foreign Key to User
- `invite_code`: VARCHAR, Unique (Used for generation of invitation links/QRs)

### 3. ParentTeacherLink (New)
- `id`: SERIAL, Primary Key
- `parent_id`: INTEGER, Foreign Key to User (Role = PARENT)
- `teacher_id`: INTEGER, Foreign Key to User (Role = TEACHER)
- `created_at`: TIMESTAMP
- **Constraints**: Unique constraint on `(parent_id, teacher_id)`.

### 4. Student (Child) Profile (Updated/Clarified)
- `id`: SERIAL, Primary Key
- `parent_id`: INTEGER, Foreign Key to User (Role = PARENT). Defines the parent-child relationship.
- `user_id`: INTEGER, Foreign Key to User (Role = STUDENT). The actual login account for the student, if applicable.
- `name`: VARCHAR

### 5. StudentTeacherEnrollment (Existing/Updated)
- `id`: SERIAL, Primary Key
- `student_id`: INTEGER, Foreign Key to Student Profile
- `teacher_id`: INTEGER, Foreign Key to User (Role = TEACHER)
- `created_at`: TIMESTAMP
- **Constraints**: Unique constraint on `(student_id, teacher_id)`.

## State Transitions

- **Invitation Acceptance**:
  - `Parent` accesses `/invite/[inviteCode]`
  - System looks up `TeacherProfile` using `inviteCode`.
  - If Parent is not logged in -> redirect to login/register with `?inviteCode=...`
  - Upon successful login/registration -> redirect back to `/invite/[inviteCode]`
  - Parent confirms acceptance.
  - System creates `ParentTeacherLink` record.
  - If `ParentTeacherLink` already exists, show "Already Linked" message.

- **Student Assignment**:
  - `Parent` adds a new student via the dashboard.
  - Parent selects a `Teacher` from the list of teachers associated via `ParentTeacherLink`.
  - System creates a new `Student` record linked to the `Parent`.
  - System creates a `StudentTeacherEnrollment` record linking the new `Student` to the selected `Teacher`.
