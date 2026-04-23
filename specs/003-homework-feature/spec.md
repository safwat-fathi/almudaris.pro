# Feature Specification: Homework Feature

**Feature Branch**: `003-homework-feature`  
**Created**: April 23, 2026  
**Status**: Draft  
**Input**: User description: "Homework feature for assigning and submitting homework"

## Clarifications
### Session 2026-04-23
- Q: How is the submission status stored? → A: Remove status from Submission model; it will be computed dynamically.
- Q: How do we track resubmissions? → A: Use `updated_at` and add a `submission_version` (integer) to track the number of attempts.
- Q: How do we handle multiple/extensible attachments? → A: Evolve into a separate `SubmissionAttachment` entity (id, submission_id, file_url, file_type).
- Q: How can a teacher control visibility/submissions manually? → A: Add an `is_open` boolean to the Homework model to allow teachers to close it and disable submissions.
- Q: What are the performance indexes for submissions? → A: Add INDEX on `submissions(homework_id)`, INDEX on `submissions(student_id)`, and a UNIQUE constraint on `(homework_id, student_id)`.
- Q: What are the file constraints for attachments? → A: Restricted to PDF, PNG, and JPG with a 10MB limit.
- Q: What happens to previous attachments on resubmission? → A: Replace all previous attachments (clean slate).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Teacher Adds Homework (Priority: P1)

Teachers must be able to assign homework to a group connected to an active or upcoming session, allowing students to have a clear place to submit their work.

**Why this priority**: Without the ability to assign homework, the rest of the feature cannot function. It is the fundamental starting point of the homework process.

**Independent Test**: Can be fully tested by creating a new homework entry linked to an active session, ensuring it requires a title and accepts an optional description and due date.

**Acceptance Scenarios**:

1. **Given** an active session, **When** the teacher adds homework with a valid title, description, and due date, **Then** the system creates the homework and shows a success confirmation.
2. **Given** an upcoming session, **When** the teacher attempts to add homework, **Then** the system displays a warning banner before allowing the creation.
3. **Given** a cancelled session or a session with no students, **When** the teacher attempts to add homework, **Then** the system blocks the action and displays an appropriate error message.
4. **Given** an incomplete homework form, **When** the teacher attempts to submit without a title, **Then** the system displays an inline validation error and prevents submission.

---

### User Story 2 - Student Submits Homework On Time (Priority: P1)

Students must be able to view their assigned, open homework and submit answers or attachments before the due date.

**Why this priority**: Completing homework is the core value proposition for students.

**Independent Test**: Can be fully tested by a student viewing a newly assigned homework and successfully attaching a file and text response.

**Acceptance Scenarios**:

1. **Given** a student with an assigned, open homework that is not yet due, **When** they submit a text answer and an attachment, **Then** the submission is saved, a success confirmation is shown, and the computed status becomes "Submitted".
2. **Given** a student views their homework list, **When** they have an assigned homework with no submission before the due date, **Then** the computed status badge displays "Not Submitted".

---

### User Story 3 - Student Submits Homework Late (Priority: P2)

Students must be able to submit their homework even after the due date has passed, provided the homework is still marked as `is_open` by the teacher, but the system must compute it as late.

**Why this priority**: Real-world scenarios often involve late submissions. Blocking submissions after a due date reduces flexibility for teachers and students.

**Independent Test**: Can be fully tested by simulating a past due date and ensuring the student is warned before submitting and flagged as "Late" afterward.

**Acceptance Scenarios**:

1. **Given** a student views an assigned, open homework past its due date with no prior submission, **When** they open the details, **Then** a warning banner displays "Late" or "Missing".
2. **Given** a student submits an answer after the due date, **When** they complete the submission form, **Then** the system warns them about the late status, accepts the submission, and computes the status as "Late".

---

### User Story 4 - Teacher Reviews Submissions (Priority: P2)

Teachers need a consolidated view to track the status of all student submissions for a specific homework assignment and review the content of those submissions.

**Why this priority**: Teachers need to verify student work and track completion rates to ensure educational goals are met.

**Independent Test**: Can be fully tested by assigning a homework to multiple students, simulating different submission states, and verifying the list and details accurately reflect each student's work.

**Acceptance Scenarios**:

1. **Given** a homework assignment with multiple students, **When** the teacher opens the submission review list, **Then** they see each student alongside an accurate computed status badge (Submitted, Late, Missing).
2. **Given** a student who has submitted an answer, **When** the teacher clicks on that student's row, **Then** they can read the submitted text and download or preview any attached files.

---

### Edge Cases

- What happens when a student submits multiple times? (Resubmission updates the existing submission row, increments `submission_version`, and updates `updated_at`).
- What happens when a teacher toggles `is_open` to false? (Students can no longer submit or resubmit answers to that homework).
- What happens when a teacher attempts to add homework to a cancelled session? (The action is completely blocked).
- How does the system handle sessions with zero students? (Assigning homework is blocked).
- What happens if a student attempts to submit an unsupported file type or an excessively large file? (The system rejects the upload with a clear, user-friendly error message).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow teachers to assign homework to a group linked to an active or upcoming session, capturing a mandatory title, an optional description, and an optional due date.
- **FR-002**: System MUST display a clear warning message when a teacher assigns homework to an upcoming session.
- **FR-003**: System MUST prevent teachers from assigning homework to cancelled sessions or sessions containing no students.
- **FR-004**: System MUST allow students to view a list of all their assigned homework, displaying accurate status badges (Not Submitted, Submitted, Late, Missing) dynamically computed based on the current time, due date, and submission timestamps.
- **FR-005**: System MUST allow students to submit answers via a text field and/or multiple file attachments (images, PDFs) for assigned homework, storing attachments in a dedicated `SubmissionAttachment` entity. Files are restricted to PDF, PNG, and JPG formats with a maximum size of 10MB each.
- **FR-006**: System MUST explicitly warn students prior to and during submission if they are submitting past the designated due date.
- **FR-007**: System MUST allow students to resubmit their homework if it is open, which updates their single submission record, increments the `submission_version`, updates the `updated_at` timestamp, and replaces all previous file attachments with the new submission's files.
- **FR-008**: System MUST allow teachers to manually close a homework assignment (`is_open` = false) to block any further submissions or resubmissions.
- **FR-009**: System MUST allow teachers to view a comprehensive list of all students for a specific homework assignment along with their current computed submission statuses.
- **FR-010**: System MUST allow teachers to view the detailed content (text and all attachments) of any individual student's submission.

### Key Entities

- **Homework**: Represents an educational assignment given by a teacher. Contains `is_open` (boolean) to control visibility/submissions.
- **Submission**: Represents a student's completed response to a Homework assignment. Contains answer text, `submission_version`, and timestamps. Status is dynamically computed, not stored. Unique by (homework_id, student_id).
- **SubmissionAttachment**: Represents individual files attached to a submission, enabling multiple attachments per submission. Contains `file_url` and `file_type`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Teachers can successfully create and assign a new homework entry in under 30 seconds.
- **SC-002**: Students can successfully submit text or file-based homework on the first attempt without encountering system errors.
- **SC-003**: The system accurately categorizes and displays 100% of homework statuses (Not Submitted, Submitted, Late, Missing) based on due dates and submission times.
- **SC-004**: Teachers can access the submission review list for any homework assignment and view the status of all students with zero missing data.

## Assumptions

- Push or email notifications for new assignments, reminders, or submissions are optional for this initial release and considered out of scope unless explicitly requested later.
- Grading functionality and teacher feedback features are deferred to a future phase.
- A single submission per student is active at any time; resubmitting completely replaces the prior submission text and increments the version.
- Standard web and mobile app expectations apply for performance, accessibility, and error handling.
- Users are assumed to have stable internet connections; offline mode or local synchronization is not required.
- Historical submission attempts are stored for auditing but are not exposed in the primary student/teacher UI (which only shows the current version).
onization is not required.ation is not required.