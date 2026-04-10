# Data Model: Parent Invitations

## Entities

### `Teacher` (Existing, Extended)
- **Modifications**: Add `inviteCode` field.
- **Fields**:
  - `id` (SERIAL, PK)
  - `userId` (FK to User)
  - `inviteCode` (varchar, Unique) - A short alphanumeric hash (e.g., `8f7b2a`) auto-generated on Teacher creation.

### `Parent` (Existing)
- **Fields**:
  - `id` (SERIAL, PK)
  - `userId` (FK to User)

### `Student` (Existing, Extended)
- **Fields**:
  - `id` (SERIAL, PK)
  - `parentId` (FK to Parent, Not Null) - Represents the parent who created and manages this student.
  - `firstName` (varchar)
  - `lastName` (varchar)

### `ParentTeacherLink` (New)
- **Description**: Join table representing a parent successfully accepting a teacher's invitation connection.
- **Fields**:
  - `parentId` (Integer, FK to Parent)
  - `teacherId` (Integer, FK to Teacher)
  - `createdAt` (Timestamp)
- **Constraints**: 
  - Composite Primary Key (`parentId`, `teacherId`) or Unique Constraint on both.

### `StudentTeacherEnrollment` (Existing or New)
- **Description**: Connects a specific student to a specific teacher for learning sessions.
- **Fields**:
  - `studentId` (Integer, FK to Student)
  - `teacherId` (Integer, FK to Teacher)
  - `createdAt` (Timestamp)
- **Constraints**:
  - Composite Primary Key on (`studentId`, `teacherId`).

## State Transitions & Validation Rules

- **Linking Validation**: An `inviteCode` provided in the path parameter must resolve to an active Teacher. If the Teacher is inactive or deleted, return a standard "Invalid or Expired Link" error.
- **Role Validation**: Only a `Parent` role user can insert into `ParentTeacherLink`.
- **Enrollment Validation**: A Parent attempting to create a `StudentTeacherEnrollment` must already have a valid `ParentTeacherLink` with that specific `teacherId`.
