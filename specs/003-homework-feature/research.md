# Research: Homework Feature

## Decision: Attachment Signed URLs
- **Decision**: Use a cloud-agnostic approach for attachment storage (initially simulated with simple file system / local URLs, but designed for signed URLs).
- **Rationale**: Students upload files up to 10MB. To ensure high availability and security, signed URLs for a storage bucket (S3, GCS, Supabase) are the standard. The backend will issue a signed URL for upload and a signed URL for reading.
- **Alternatives considered**: Storing raw base64 in database (rejected: inefficient storage and query overhead); direct file system storage on the server (rejected: poor scalability across multiple instances).

## Decision: Dynamic Status Computation
- **Decision**: Submission status (Not Submitted, Submitted, Late, Missing) will be computed dynamically on each query.
- **Rationale**: This avoids state synchronization issues. The status is a function of the current time, the homework due date, and the submission's `submitted_at` timestamp.
- **Status Logic**:
  ```
  IF submission exists:
    IF submitted_at > due_date AND due_date is set -> LATE
    ELSE -> SUBMITTED
  ELSE:
    IF now > due_date AND due_date is set -> MISSING
    ELSE -> NOT_SUBMITTED
  ```
- **Alternatives considered**: Storing status in the database (rejected: requires background jobs to move status from `NOT_SUBMITTED` to `MISSING` at the due date).

## Decision: Audit Logging Strategy
- **Decision**: Every submission attempt is logged in a `SubmissionAuditLog` table using `jsonb` for the snapshot of metadata.
- **Rationale**: Critical for disputes and educational integrity. `jsonb` allows for flexibility if metadata structure changes.
- **Alternatives considered**: Storing only the `submission_version` (rejected: doesn't allow tracking what the actual content was in previous versions).
