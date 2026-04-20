# Research & Technical Decisions: Groups Management

## Decision 1: Group Status Management
- **Decision**: Group status (Scheduled, Completed, Cancelled) is stored as an enum column. Automatic transition from "Scheduled" to "Completed" uses the stored `end_time` column (`WHERE end_time < NOW() AND status = 'Scheduled'`). Teachers can also manually mark a group as "Completed" before `end_time`.
- **Rationale**: Using the stored `end_time` column enables index-friendly queries without runtime computation. Meets FR-005 and FR-021. Adheres to "Zero-Learning Curve" principle.
- **Alternatives considered**: Strictly manual state updates (rejected: UX burden); runtime derivation from `start_time + duration_minutes` (rejected: less query-efficient); background cron job (rejected: overly complex for MVP).

## Decision 2: Recurring Groups Limits
- **Decision**: Configurable maximum of 24 instances per series (MVP default). The limit is stored as a system configuration constant, not hardcoded across the codebase.
- **Rationale**: Prevents database abuse and ensures instant creation without system timeouts (SC-004), while providing approximately 6 months of weekly planning. Configurable design allows scaling later.
- **Alternatives considered**: 52 instances or unlimited (rejected per clarification); hardcoded everywhere (rejected: poor maintainability).

## Decision 3: Overlapping Groups Warning
- **Decision**: Non-blocking overlap warning on **both** frontend and backend. Backend validates overlaps using `end_time`/`start_time` range queries, logs overlap events, and returns a `warnings` field in the API response. Frontend displays the warning. Creation always proceeds.
- **Rationale**: Frontend-only validation can be bypassed, leading to unnoticed double-bookings. Backend validation ensures data consistency while remaining non-blocking (FR-004).
- **Alternatives considered**: Frontend-only warning (rejected: bypassable); hard block (rejected per business logic requirements).

## Decision 4: Testing Strategy
- **Decision**: Only manual testing and automated linting (`pnpm run lint`) will be performed.
- **Rationale**: Adheres strictly to the project's `AGENTS.md` mandate: "Do not write spec files at all."
- **Alternatives considered**: Automated unit/E2E testing (rejected per explicit repository rules).

## Decision 5: Time Storage & end_time
- **Decision**: `end_time` is stored alongside `duration_minutes` (both persisted). `end_time` is auto-recalculated by the backend (via DB trigger or application hook) whenever `start_time` or `duration_minutes` changes. The frontend never sends `end_time`.
- **Rationale**: Enables efficient queries for status transitions and overlap detection using the stored column, while `duration_minutes` remains useful for display and form input. Redundancy tradeoff explicitly accepted for query performance.
- **Alternatives considered**: Replace `duration_minutes` with `end_time` only (rejected: duration is useful for UX); compute-only virtual column (rejected: not index-friendly in all cases).

## Decision 6: Timezone Strategy
- **Decision**: All times (`start_time`, `end_time`) stored in UTC in the database. Teacher's timezone stored on their user profile. Frontend converts UTC to local timezone for display.
- **Rationale**: Standard approach for web applications. Avoids ambiguity for online sessions where participants may be in different timezones. Simplest correct approach for MVP.
- **Alternatives considered**: Store in teacher's local timezone (rejected: complicates cross-timezone queries); per-group timezone offset (rejected: over-engineered for MVP).

## Decision 7: Student Name Snapshot & Soft Delete
- **Decision**: `GroupStudent.student_name` is a snapshot captured at group creation time only (immutable). `student_id` retains a hard FK. Students are soft-deleted (never physically removed) via `BaseEntity.deleted_at`.
- **Rationale**: Ensures historical records display correctly even if a student's profile name changes or they are deactivated. Hard FK ensures referential integrity while soft delete prevents orphaned references. Aligns with existing `BaseEntity` pattern.
- **Alternatives considered**: Nullable FK with SET NULL (rejected: loses referential integrity); snapshot on completion (rejected: user chose creation-time snapshot).

## Decision 8: Per-Student Notes
- **Decision**: `GroupStudent` has `note` (nullable text) and `note_updated_at` (timestamp, auto-set by DB trigger). Notes are editable regardless of group status — same as attendance and group-level notes.
- **Rationale**: Teachers need to record per-student observations. Making notes always-editable aligns with FR-009/FR-020 and avoids blocking teachers from recording important information.
- **Alternatives considered**: Notes on Group entity only (rejected: too coarse-grained for per-student tracking).

## Decision 9: Edit Scope "Future" Definition
- **Decision**: "Future groups" in recurring series edit scope is explicitly defined as groups with `date > the edited group's date` within the same `recurring_series_id`.
- **Rationale**: Removes ambiguity in the business logic. Clear, deterministic definition prevents edge cases around same-day groups.
- **Alternatives considered**: `date >= current date` (rejected: could affect same-day groups unintentionally).

## Decision 10: Audit Fields
- **Decision**: `Group` gets `created_at`, `updated_at`, `created_by` (FK to User). `GroupStudent` gets `created_at`, `updated_at`. `RecurringSeries` gets `created_at`, `created_by`. `Group` and `GroupStudent` extend `BaseEntity` (which provides `created_at`, `updated_at`, `deleted_at`). `created_by` is separate from `teacher_id` for future admin/audit scenarios.
- **Rationale**: Standard audit trail pattern. `created_by` future-proofs for admin actions without current overhead.
- **Alternatives considered**: Omit `created_by` (rejected: loses audit trail for future scenarios).
