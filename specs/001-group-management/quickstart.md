# Quickstart: Groups Management

## Overview
The Groups Management feature is the core unit of value for Al-Mudaris Pro. It allows teachers to schedule, edit, and cancel teaching groups (both individual and group, online and physical). It manages attendance tracking with per-student notes and strictly preserves historical data for completed groups. All times are stored in UTC with frontend timezone conversion.

## Key Workflows
1. **Create Group**: Teachers create a group for their students. Backend auto-calculates `end_time` from `start_time + duration_minutes`. Overlaps are validated on both frontend and backend — backend returns `warnings` in the API response (non-blocking).
2. **Recurring Groups**: Generates up to a configurable maximum of 24 (MVP) separate, independent group instances linked by a `recurring_series_id`. Edits can apply to "This group only", "This and future groups" (date > edited group's date in same series), or "All groups" (protects past/completed from structural edits).
3. **Completed Groups**: Once a group's stored `end_time` passes or it is manually marked complete, core structural details (time, duration, location type, student list) are locked (FR-021). Only attendance, group-level notes, and per-student notes remain editable.
4. **Cancellations**: Soft-delete via "Cancelled" status. Cancellations must be performed individually, one group at a time. No hard deletes.
5. **Per-Student Notes**: Teachers can add notes per student on each group via `GroupStudent.note`. Notes are editable regardless of group status.
6. **Historical Preservation**: `GroupStudent.student_name` is snapshotted at creation time (immutable). Students are soft-deleted (never physically removed) to preserve hard FK integrity.

## Architecture
- **Backend (NestJS)**: Strict REST API endpoints with Swagger decorators and Zod/Class Validator validation. Entities use `SERIAL` keys and extend `BaseEntity` (which provides `created_at`, `updated_at`, `deleted_at` for soft delete). `end_time` is computed by backend/DB trigger. All times stored in UTC. Overlap validation logs events and returns `warnings` in API response.
- **Frontend (Next.js v16)**: Strictly Server-Driven UI using React Server Components. Server Actions handle all form submissions with CSRF tokens. Zustand is used for minimal client state. Frontend converts UTC times to teacher's profile timezone for display. Styling strictly uses TailwindCSS and follows the "Silent Mentor" design system (Manrope font, ROUND_FULL). No spec files are used.

## Data Model Summary
- **Group**: Core entity with `start_time`, `end_time` (stored, auto-computed), `duration_minutes`, `status`, `location_type`, `notes`, `created_by` (audit, equals `teacher_id` for now).
- **GroupStudent**: Junction table with `student_name` (immutable snapshot), `attendance_status`, `note`, `note_updated_at`.
- **RecurringSeries**: Links groups in a series with `created_by` audit field.
