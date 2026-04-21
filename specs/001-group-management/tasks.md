# Tasks: Groups Management

**Input**: Design documents from `/specs/001-group-management/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api-contract.md

**Tests**: Not included (per project rules: linting only, no spec files).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Groups module scaffolding and configuration

- [x] T001 Generate NestJS groups module scaffold using `pnpm -C backend run generate:module groups` (creates `backend/src/groups/groups.module.ts`, `groups.controller.ts`, `groups.service.ts`)
- [x] T002 [P] Create groups configuration constant file with `MAX_RECURRING_INSTANCES = 24` in `backend/src/config/groups.config.ts`
- [x] T003 [P] Add `timezone` column (string, nullable, default 'Africa/Cairo') to User entity in `backend/src/users/entities/user.entity.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core entities that ALL user stories depend on. MUST complete before any user story work.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 [P] Create `RecurringSeries` entity in `backend/src/groups/entities/recurring-series.entity.ts` — Fields: `id` (SERIAL PK), `teacher_id` (FK to User), `created_at` (Timestamp), `created_by` (FK to User, equals `teacher_id` for now). Extend `BaseEntity`.
- [x] T005 [P] Create `Group` entity in `backend/src/groups/entities/group.entity.ts` — Fields: `id` (SERIAL PK), `teacher_id` (FK to User), `title` (string, nullable), `date` (Date), `start_time` (Time, stored UTC), `end_time` (Time, stored UTC, auto-computed from `start_time + duration_minutes`), `duration_minutes` (int), `status` (enum: Scheduled/Completed/Cancelled, default Scheduled), `location_type` (enum: Online/Physical), `location_link` (string, nullable), `location_place` (string, nullable), `recurring_series_id` (FK to RecurringSeries, nullable), `notes` (text, nullable), `created_by` (FK to User). Extend `BaseEntity`. Add `@BeforeInsert`/`@BeforeUpdate` hook to compute `end_time`.
- [x] T006 [P] Create `GroupStudent` entity in `backend/src/groups/entities/group-student.entity.ts` — Fields: composite PK (`group_id` FK to Group, `student_id` FK to User), `student_name` (string, immutable snapshot), `attendance_status` (enum: Present/Absent/NotSet, default NotSet), `note` (text, nullable), `note_updated_at` (timestamp, nullable). Extend `BaseEntity`.
- [x] T007 Create DTOs with Zod/class-validator: `CreateGroupDto` in `backend/src/groups/dto/create-group.dto.ts` — Validate: `date` (required), `start_time` (required, UTC), `duration_minutes` (required, > 0), `student_ids` (required, non-empty array of numbers), `location_type` (required enum), `location_link` (required if Online), `location_place` (required if Physical), `title` (optional), `is_recurring` (optional bool), `recurrence_pattern` (optional, 'WEEKLY'), `recurrence_count` (optional, max from config). Must NOT accept `end_time`.
- [x] T008 [P] Create `UpdateGroupDto` in `backend/src/groups/dto/update-group.dto.ts` — Extends CreateGroupDto fields (all optional) + `edit_scope` (enum: THIS/THIS_AND_FUTURE/ALL, default THIS).
- [x] T009 [P] Create `UpdateAttendanceDto` in `backend/src/groups/dto/update-attendance.dto.ts` — Validate: `notes` (optional string), `students` (array of `{ id: number, attendance_status: enum, note?: string }`).
- [x] T010 [P] Create `UpdateStatusDto` in `backend/src/groups/dto/update-status.dto.ts` — Validate: `status` (only 'Completed' allowed).
- [x] T011 Register all three entities in `backend/src/groups/groups.module.ts` using `TypeOrmModule.forFeature([Group, GroupStudent, RecurringSeries])`. Import and export the module.

**Checkpoint**: Foundation ready — all entities, DTOs, and module registration complete. User story implementation can now begin.

---

## Phase 3: User Story 1 — Create a Group (Priority: P1) 🎯 MVP

**Goal**: Teachers can create single groups (individual or group, online or physical) with overlap warnings.

**Independent Test**: Create an online group and a physical group. Verify both appear with correct students, time, location, `end_time` auto-computed, and `student_name` snapshotted. Verify overlap warning returned when creating a conflicting group.

### Implementation for User Story 1

- [x] T012 [US1] Implement `createGroup()` in `backend/src/groups/groups.service.ts` — Accept `CreateGroupDto` + authenticated teacher user. Logic: validate `student_ids` belong to teacher (FR-002), compute `end_time` from `start_time + duration_minutes` (FR-016), snapshot `student_name` from User.name for each student (FR-017), check for overlapping groups using `start_time`/`end_time` range query and build `warnings` array (FR-004), create Group + GroupStudent records with status='Scheduled' and attendance='NotSet' (FR-005). If `is_recurring`: create RecurringSeries + up to config limit group instances (FR-006). Set `created_by = teacher.id`. Return `{ data, warnings }`.
- [x] T013 [US1] Implement `POST /groups` endpoint in `backend/src/groups/groups.controller.ts` — Use `@Post()`, `@Body() CreateGroupDto`, extract authenticated user from request. Call `groupsService.createGroup()`. Return `201 Created` with `{ data, warnings }`. Add Swagger decorators.
- [x] T014 [US1] Implement `GET /groups` endpoint in `backend/src/groups/groups.controller.ts` — Use `@Get()`, accept query params: `from`, `to` (date range), `status`, `student_id`. Filter by `teacher_id = authenticated user`. Return groups with nested `students` array (student_name, attendance_status, note). All times in UTC. Add Swagger decorators.
- [x] T015 [US1] Implement `GET /groups/:id` endpoint in `backend/src/groups/groups.controller.ts` — Use `@Get(':id')`, validate group belongs to teacher. Return single group with full student details. Add Swagger decorators.
- [x] T016 [P] [US1] Create API client functions in `frontend/services/api/groups.ts` — Functions: `fetchGroups(params)`, `fetchGroup(id)`, `createGroup(data)`. All calls go through the BFF layer.
- [x] T017 [P] [US1] Create Server Actions in `frontend/actions/groups.actions.ts` — Server Actions: `createGroupAction(formData)` with Zod validation and CSRF token. Calls backend API. Returns `{ data, warnings }`.
- [x] T018 [US1] Create group form component in `frontend/components/groups/group-form.tsx` — Client component with fields: date, start_time, duration_minutes, student selector (multi-select from teacher's students), location_type toggle (Online/Physical), conditional location_link/location_place, title, recurring toggle + pattern + count. Convert UTC display using teacher's timezone from profile. Submit via Server Action.
- [x] T019 [P] [US1] Create overlap warning component in `frontend/components/groups/overlap-warning.tsx` — Display non-blocking warning toast/banner when `warnings` array is non-empty in API response.
- [x] T020 [US1] Create group list page in `frontend/app/(teacher)/groups/page.tsx` — Server Component. Fetch groups via BFF. Display as cards/list with date, time (converted from UTC), students, status, location. Filter by upcoming/completed/cancelled.
- [x] T021 [P] [US1] Create group card component in `frontend/components/groups/group-card.tsx` — Display group summary: title, date, time (UTC→local), duration, student count, status badge, location icon.
- [x] T022 [US1] Create new group page in `frontend/app/(teacher)/groups/new/page.tsx` — Server Component wrapping `group-form.tsx`. Pass teacher's students list from server.

**Checkpoint**: User Story 1 complete. Teachers can create single and recurring groups, see overlap warnings, and view their group list. All times display in teacher's timezone.

---

## Phase 4: User Story 2 — Edit Upcoming Groups (Priority: P1)

**Goal**: Teachers can fully edit upcoming (Scheduled) groups, including recurring series with scope options.

**Independent Test**: Modify an upcoming group's time, location, and student list. Verify changes apply. For recurring groups, verify "This and future" applies to `date > edited group date` in same series only.

### Implementation for User Story 2

- [x] T023 [US2] Implement `updateGroup()` in `backend/src/groups/groups.service.ts` — Accept group ID, `UpdateGroupDto`, authenticated teacher. Logic: verify group is 'Scheduled' (reject if Completed/Cancelled per FR-008/FR-021), validate ownership, recompute `end_time` if `start_time`/`duration_minutes` changed (FR-016), check overlaps and build warnings, snapshot new `student_name` for any newly added students (FR-017). Handle `edit_scope`: THIS (single group), THIS_AND_FUTURE (groups with `date > this group's date` in same `recurring_series_id`, skip completed ones), ALL (all in series, skip completed). Return `{ data, warnings }`.
- [x] T024 [US2] Implement `PUT /groups/:id` endpoint in `backend/src/groups/groups.controller.ts` — Use `@Put(':id')`, `@Body() UpdateGroupDto`. Call `groupsService.updateGroup()`. Return `200 OK` with `{ data, warnings }`. Add Swagger decorators.
- [x] T025 [P] [US2] Add `updateGroupAction(id, formData)` Server Action in `frontend/actions/groups.actions.ts` — Zod validation + CSRF. Calls backend PUT endpoint.
- [x] T026 [P] [US2] Create recurring edit options component in `frontend/components/groups/recurring-options.tsx` — Modal/dialog presenting "This group only", "This and future groups", "All groups" scope selection. Only shown when editing a group with `recurring_series_id`.
- [x] T027 [US2] Create group detail/edit page in `frontend/app/(teacher)/groups/[id]/page.tsx` — Server Component. Fetch group details. Show editable form if status='Scheduled' (pre-fill `group-form.tsx`), read-only view if Completed/Cancelled. Include recurring scope options if applicable.

**Checkpoint**: User Stories 1 & 2 complete. Teachers can create and edit groups with full recurring series support.

---

## Phase 5: User Story 3 — Record Attendance and Notes (Priority: P2)

**Goal**: Teachers can record attendance and per-student notes for completed groups while structural details remain locked.

**Independent Test**: Complete a group (manually or wait for `end_time`). Verify attendance and notes can be updated. Verify time/students/location edits are blocked.

### Implementation for User Story 3

- [x] T028 [US3] Implement `updateAttendance()` in `backend/src/groups/groups.service.ts` — Accept group ID, `UpdateAttendanceDto`, authenticated teacher. Logic: verify ownership, update `Group.notes` if provided, update each `GroupStudent.attendance_status` and `GroupStudent.note` (set `note_updated_at` to now if note changed). Allowed regardless of status (FR-009/FR-020). Return updated group.
- [x] T029 [US3] Implement `updateStatus()` in `backend/src/groups/groups.service.ts` — Accept group ID, `UpdateStatusDto`, authenticated teacher. Logic: verify ownership, verify current status is 'Scheduled', transition to 'Completed' (FR-005). Return updated group.
- [x] T030 [US3] Implement `PATCH /groups/:id/attendance` and `PATCH /groups/:id/status` endpoints in `backend/src/groups/groups.controller.ts` — Add both PATCH routes with appropriate DTOs. Add Swagger decorators.
- [x] T031 [P] [US3] Add `updateAttendanceAction(id, formData)` and `markCompleteAction(id)` Server Actions in `frontend/actions/groups.actions.ts`.
- [x] T032 [US3] Create attendance form component in `frontend/components/groups/attendance-form.tsx` — Client component listing all students in the group with: student_name display, attendance status toggle (Present/Absent/Not set), per-student note textarea, group-level notes textarea. Submit via Server Action.
- [x] T033 [US3] Integrate attendance form into group detail page `frontend/app/(teacher)/groups/[id]/page.tsx` — Show attendance form for Completed groups (or Scheduled groups for early marking). Show "Mark Complete" button for Scheduled groups. Enforce read-only structural fields for Completed groups.

**Checkpoint**: User Stories 1, 2 & 3 complete. Full create → edit → complete → record attendance workflow functional.

---

## Phase 6: User Story 5 — Cancel a Group (Priority: P3)

**Goal**: Teachers can cancel groups (soft-delete) one at a time. Cancelled groups remain visible in history.

**Independent Test**: Cancel a group. Verify status changes to 'Cancelled', it disappears from active views, but is visible in history (read-only).

### Implementation for User Story 5

- [x] T034 [US5] Implement `cancelGroup()` in `backend/src/groups/groups.service.ts` — Accept group ID, authenticated teacher. Logic: verify ownership, set status='Cancelled' (FR-010). Individual only — no bulk cancellation. Return `204 No Content`.
- [x] T035 [US5] Implement `DELETE /groups/:id` endpoint in `backend/src/groups/groups.controller.ts` — Use `@Delete(':id')`. Call `groupsService.cancelGroup()`. Return `204 No Content`. Add Swagger decorators.
- [x] T036 [P] [US5] Add `cancelGroupAction(id)` Server Action in `frontend/actions/groups.actions.ts`.
- [x] T037 [US5] Add cancel button and confirmation dialog to group detail page `frontend/app/(teacher)/groups/[id]/page.tsx` — Show cancel button for Scheduled groups only. Confirmation dialog warns action cannot be undone. On confirm, call Server Action and redirect to group list.

**Checkpoint**: All user stories complete. Full CRUD lifecycle functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T038 Run `pnpm -C backend run lint` and fix any linting errors across all groups module files
- [x] T039 [P] Run `pnpm -C frontend run lint` and fix any linting errors across all groups frontend files
- [x] T040 [P] Add Swagger API documentation review — verify all 7 endpoints have complete request/response schemas with examples
- [x] T041 Validate quickstart.md workflows manually — create group, edit, mark complete, record attendance, cancel. Verify all flows work end-to-end with correct timezone conversion.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3–6)**: All depend on Foundational phase completion
  - US1 (Create) → US2 (Edit) → US3 (Attendance) → US5 (Cancel) — sequential recommended
  - US2 depends on US1 service/entity foundation
  - US3 and US5 can proceed in parallel after US2
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — No dependencies on other stories
- **User Story 2 (P1)**: Depends on US1 (needs existing groups to edit) — shares service file
- **User Story 3 (P2)**: Depends on US1 (needs existing groups) — can parallelize with US5
- **User Story 5 (P3)**: Depends on US1 (needs existing groups) — can parallelize with US3

### Within Each User Story

- Backend service → Backend controller → Frontend API/Actions → Frontend components → Frontend pages
- [P] marked tasks can run in parallel within that phase

### Parallel Opportunities

- Phase 1: T002 and T003 can run in parallel
- Phase 2: T004, T005, T006 (entities) can run in parallel; T007, T008, T009, T010 (DTOs) can run in parallel
- Phase 3 (US1): T016+T017 (frontend API/Actions) can run in parallel; T019+T021 (components) can run in parallel
- Phase 4 (US2): T025+T026 can run in parallel
- Phase 6 (US5): T036 can run in parallel with T037
- Phase 7: T038, T039, T040 can all run in parallel

---

## Parallel Example: User Story 1

```bash
# After T012-T015 (backend) complete:

# Launch frontend API + BFF in parallel:
Task T016: "Create API client functions in frontend/services/api/groups.ts"
Task T017: "Create Server Actions in frontend/actions/groups.actions.ts"

# Launch independent components in parallel:
Task T019: "Create overlap warning component in frontend/components/groups/overlap-warning.tsx"
Task T021: "Create group card component in frontend/components/groups/group-card.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T003)
2. Complete Phase 2: Foundational (T004–T011)
3. Complete Phase 3: User Story 1 (T012–T022)
4. **STOP and VALIDATE**: Create online + physical groups, verify overlap warnings, check UTC→local conversion
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (Edit support)
4. Add User Story 3 → Test independently → Deploy/Demo (Attendance + notes)
5. Add User Story 5 → Test independently → Deploy/Demo (Cancellation)
6. Polish → Final validation → Release

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No test spec files per repository rules — manual testing + linting only
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- User Story 4 (Recurring Groups) is integrated into US1 (creation) and US2 (editing) rather than a separate phase, since recurring logic is embedded in create/edit flows
