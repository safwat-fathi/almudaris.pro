# Feature Specification: Sessions Management

**Feature Branch**: `[01-sessions-management]`  
**Created**: 2026-04-10  
**Status**: Draft  
**Input**: User description: "I want to build sessions feature # 🧠 Sessions — Business Logic..."

## Clarifications

### Session 2026-04-10
- Q: How should a session transition from "Scheduled" to "Completed"? → A: Automatic when time passes + manual override allowed.
- Q: Should the system provide a warning to the teacher when an overlap is detected? → A: Yes, show a non-blocking warning.
- Q: What is the strict maximum number of recurring sessions that can be generated in a single series creation? → A: Limit to 24 instances (approx. 6 months of weekly sessions).
- Q: When applying changes to "This and future sessions", what exactly defines the "future sessions"? → A: Future sessions within the exact same recurring series only.
- Q: Can a teacher cancel an entire recurring series (or future sessions in a series) in a single action? → A: No, cancellations must be done one by one for safety.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create a Session (Priority: P1)

As a teacher, I want to create a single teaching session for one or multiple of my students with a specific location (online or physical), so that I can schedule my teaching events.

**Why this priority**: Sessions are the core unit of value in the product; without them, the application cannot function.

**Independent Test**: Can be fully tested by creating an individual and a group session, verifying that the session appears in the schedule with the correct students, time, and location details.

**Acceptance Scenarios**:

1. **Given** a teacher is creating an online session, **When** they provide a valid time, student(s), and meeting link, **Then** the session is created successfully with state "Scheduled" and student attendance "Not set".
2. **Given** a teacher is creating a physical session, **When** they provide a valid time, student(s), and place name, **Then** the session is created successfully with state "Scheduled" and student attendance "Not set".
3. **Given** a teacher attempts to create a session ending before it starts, **When** they submit, **Then** the system rejects the input and shows an error.
4. **Given** a teacher attempts to add a student belonging to another teacher, **When** they submit, **Then** the system restricts access and rejects the input.

---

### User Story 2 - Edit Upcoming Sessions (Priority: P1)

As a teacher, I want to fully edit the details of an upcoming session (date, time, duration, students, location), so that I can adjust to scheduling changes.

**Why this priority**: Schedules change frequently; teachers need flexibility to adjust plans before they happen.

**Independent Test**: Can be tested by modifying an existing upcoming session's time, location, and student list, and verifying the changes apply without affecting other sessions.

**Acceptance Scenarios**:

1. **Given** an upcoming session, **When** the teacher changes the time and adds a student, **Then** the session is updated successfully.
2. **Given** an upcoming session, **When** the teacher switches the location type from Online to Physical and provides a place name, **Then** the location is updated successfully.

---

### User Story 3 - Record Attendance and Notes for Completed Sessions (Priority: P2)

As a teacher, I want to record attendance and notes for a session that has already happened, while preserving its historical details (time, students, location type), so that I have an accurate record of past events.

**Why this priority**: Tracking who attended and taking notes is essential for the teaching business, but maintaining historical accuracy is critical for trust and billing.

**Independent Test**: Can be tested by completing a session and attempting to modify attendance/notes (allowed) vs modifying the time/students (prevented).

**Acceptance Scenarios**:

1. **Given** a completed session, **When** the teacher marks a student as "Present" and adds notes, **Then** the information is saved successfully.
2. **Given** a completed session, **When** the teacher attempts to change the session time or remove a student, **Then** the system prevents the edit to preserve historical accuracy.

---

### User Story 4 - Create and Manage Recurring Sessions (Priority: P2)

As a teacher, I want to create a recurring session series and edit them either individually or together, so that I can easily plan my regular weekly classes without manual repetition.

**Why this priority**: Reduces manual data entry significantly, which aligns with the "Zero-Learning Curve" and simplicity principles.

**Independent Test**: Can be tested by creating a weekly recurring session, then modifying only one specific future occurrence, verifying the others remain unchanged.

**Acceptance Scenarios**:

1. **Given** a teacher creates a recurring session, **When** submitted, **Then** the system generates multiple independent future session records grouped as a series.
2. **Given** a teacher edits a session in a recurring series, **When** they choose "This and future sessions", **Then** the changes apply to the selected session and all upcoming sessions in the series, but NOT past sessions.

---

### User Story 5 - Cancel a Session (Priority: P3)

As a teacher, I want to cancel a session without permanently deleting it, so that it is removed from my active schedule but remains in my history.

**Why this priority**: Cancellations happen, but preserving the record is important for data integrity over convenience.

**Independent Test**: Can be tested by canceling a session and verifying it disappears from upcoming views but is still retrievable in historical views.

**Acceptance Scenarios**:

1. **Given** any session, **When** the teacher cancels it, **Then** the session state changes to "Cancelled" and it is removed from the active schedule.
2. **Given** a cancelled session, **When** the teacher views their history, **Then** the session is still visible but read-only.

---

### Edge Cases

- What happens when a student is later removed from a teacher's roster? Past sessions containing that student MUST remain unchanged.
- What happens if a teacher attempts to change the location type of a completed session? The system MUST prevent changing the location type (e.g., Online to Physical) to avoid confusion in historical records, though minor text edits (fixing typos in place names) are allowed.
- What happens if a teacher creates overlapping sessions? The system MUST allow this to support real-life flexibility, but MUST provide a non-blocking warning (e.g., "You already have a session at this time") to prevent accidental double-booking.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow teachers to create a session specifying date, time, duration, and student(s).
- **FR-002**: System MUST restrict a teacher to only assign their own students to a session.
- **FR-003**: System MUST require individual sessions to have exactly one student, and group sessions to have at least one student.
- **FR-004**: System MUST allow teachers to create overlapping sessions (no hard restrictions), but MUST present a non-blocking warning when an overlap is detected.
- **FR-005**: System MUST initialize new sessions with a "Scheduled" state and all student attendances set to "Not set", and automatically transition them to "Completed" when their end time passes. The teacher MUST also be able to manually mark a session as "Completed" before its end time.
- **FR-006**: System MUST generate separate, independent session records when a recurring session is created, up to a strict maximum of 24 instances per series.
- **FR-007**: System MUST allow full editing (time, duration, students, location) of "Upcoming" (Scheduled) sessions.
- **FR-008**: System MUST PREVENT editing the time, core structure, and removing students from "Completed" sessions (whether automatically marked by time passing or manually marked early by the teacher).
- **FR-009**: System MUST allow updating attendance and notes for "Completed" sessions.
- **FR-010**: System MUST NOT permanently delete sessions; deleted sessions MUST be marked as "Cancelled" and retained in history. Cancellations MUST be performed individually, one session at a time, even for recurring series, to prevent accidental bulk deletions.
- **FR-011**: System MUST track attendance per student per session, with states: Present, Absent, Not set.
- **FR-012**: System MUST require a location type (Online or Physical) for every session.
- **FR-013**: System MUST require a valid session link if the location type is "Online".
- **FR-014**: System MUST require a place name if the location type is "Physical".
- **FR-015**: System MUST provide scope options ("This session only", "This and future sessions", "All sessions") when editing a recurring session, restricting "future" and "all" strictly to sessions within the exact same recurring series, and MUST protect past sessions from structural edits even if "All sessions" is selected.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Teachers can successfully schedule a new individual or group session in under 30 seconds.
- **SC-002**: 100% of canceled sessions are retained in the historical record (zero hard deletes).
- **SC-003**: 100% of completed sessions successfully block structural edits (time, location type, student removal), preserving historical accuracy.
- **SC-004**: Creating a recurring session series (e.g., 10 occurrences) generates the correct independent session instances instantly without system timeout.

## Assumptions

- We assume teachers have stable internet connectivity to create and sync sessions.
- A "Completed" session is determined automatically based on the session's end time passing, but the teacher can also manually mark it complete early.
- Recurring sessions have a reasonable upper limit (e.g., up to 1 year in advance) to prevent infinite record generation.
- Default location (saved places) is deferred to a future iteration, as specified in the feature description.

## Key Entities

- **Session**: The core teaching event. Contains date, time, duration, title, notes, status (Scheduled, Completed, Cancelled), location_type (Online/Physical), location_link (for online), and location_place (for physical).
- **SessionStudent**: The relationship between a Session and a Student. Contains the specific attendance state (Present, Absent, Not set) for that student in that session.
- **RecurringSeries**: A logical grouping entity that links multiple Sessions created from a recurring schedule.
nce state (Present, Absent, Not set) for that student in that session.
- **RecurringSeries**: A logical grouping entity that links multiple Sessions created from a recurring schedule.
n that session.
- **RecurringSeries**: A logical grouping entity that links multiple Sessions created from a recurring schedule.
