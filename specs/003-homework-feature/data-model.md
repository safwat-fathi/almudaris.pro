# Data Model: Homework Feature

## Entities

### `Homework`
Represents an assignment given by a teacher.
- `id` (SERIAL, PK)
- `group_id` (Integer, FK)
- `title` (String, Required)
- `description` (Text, Optional)
- `due_date` (Timestamp, Optional)
- `is_open` (Boolean, Default: true) - Teacher manual toggle to block submissions.
- `created_at` (Timestamp, Default: now())
- `updated_at` (Timestamp, Default: now())

### `Submission`
Represents a student's response to an assignment.
- `id` (SERIAL, PK)
- `homework_id` (Integer, FK, Unique constraint on `homework_id` + `student_id`)
- `student_id` (Integer, FK)
- `answer_text` (Text, Optional)
- `submission_version` (Integer, Default: 1)
- `submitted_at` (Timestamp, Default: now())
- `updated_at` (Timestamp, Default: now())

### `SubmissionAttachment`
Stores metadata for file attachments.
- `id` (SERIAL, PK)
- `submission_id` (Integer, FK)
- `file_url` (String, Required)
- `file_type` (String, Required, e.g., 'PDF', 'PNG', 'JPG')
- `created_at` (Timestamp, Default: now())

### `SubmissionAuditLog`
Internal auditing for educational integrity.
- `id` (SERIAL, PK)
- `submission_id` (Integer, FK)
- `homework_id` (Integer, FK)
- `student_id` (Integer, FK)
- `answer_text` (Text, Optional)
- `attachment_metadata` (jsonb) - Snapshot of the file URLs and types.
- `attempt_number` (Integer)
- `created_at` (Timestamp, Default: now())

## Relationships
- `Homework` has many `Submission`s.
- `Submission` has many `SubmissionAttachment`s.
- `Submission` has many `SubmissionAuditLog`s.
- `Submission` has a unique constraint on `(homework_id, student_id)`.

## Validation Rules
- `Homework.title` length between 3 and 100 characters.
- `SubmissionAttachment` file type restricted to 'application/pdf', 'image/png', 'image/jpeg'.
- `SubmissionAttachment` file size must be less than 10MB (enforced via application logic).
