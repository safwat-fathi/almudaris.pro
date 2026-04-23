# Tasks: Homework Feature

**Input**: Design documents from `/specs/003-homework-feature/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The tasks below do NOT include test tasks as they were not explicitly requested for TDD in the specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`
- Paths shown below assume the `backend/` and `frontend/` structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create backend homework and submissions modules in `backend/src/homework/` and `backend/src/submissions/`
- [ ] T002 [P] Register modules in `backend/src/app.module.ts`
- [ ] T003 Create frontend homework and actions directories in `frontend/app/(student)/homework/` and `frontend/app/actions/`
- [ ] T004 [P] Configure RTL support and tailwind for new components in `frontend/app/globals.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 [P] Create `Homework` entity in `backend/src/homework/entities/homework.entity.ts` (SERIAL PK, jsonb)
- [ ] T006 [P] Create `Submission` entity in `backend/src/submissions/entities/submission.entity.ts` (SERIAL PK, Unique (homework_id, student_id))
- [ ] T007 [P] Create `SubmissionAttachment` entity in `backend/src/submissions/entities/attachment.entity.ts`
- [ ] T008 [P] Create `SubmissionAuditLog` entity in `backend/src/submissions/entities/audit-log.entity.ts` (jsonb metadata)
- [ ] T009 Generate and run database migrations using `pnpm run migration:run` in `backend/`
- [ ] T010 Setup Swagger decorators for Homework and Submission controllers in `backend/src/homework/homework.controller.ts` and `backend/src/submissions/submissions.controller.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Teacher Adds Homework (Priority: P1) 🎯 MVP

**Goal**: Teachers can assign homework linked to a group/session with title, description, and due date.

**Independent Test**: Create a homework assignment as a teacher and verify it appears in the database and UI.

### Implementation for User Story 1

- [ ] T011 [P] [US1] Implement `CreateHomeworkDto` in `backend/src/homework/dto/create-homework.dto.ts` (Zod validation)
- [ ] T012 [US1] Implement `HomeworkService.create()` in `backend/src/homework/homework.service.ts`
- [ ] T013 [US1] Implement `POST /homework` endpoint in `backend/src/homework/homework.controller.ts`
- [ ] T014 [US1] Create Zod schema for homework form in `frontend/schemas/homework.schema.ts`
- [ ] T015 [US1] Implement `createHomework` Server Action in `frontend/app/actions/homework.actions.ts`
- [ ] T016 [US1] Build "Add Homework" Bottom Sheet component in `frontend/components/homework/AddHomeworkSheet.tsx` (Mobile-first, Arabic UI)
- [ ] T017 [US1] Integrate "Add Homework" trigger in `frontend/app/(teacher)/sessions/[id]/page.tsx`

**Checkpoint**: User Story 1 is fully functional. Teachers can now create homework assignments.

---

## Phase 4: User Story 2 - Student Submits Homework On Time (Priority: P1)

**Goal**: Students can view assigned homework and submit answers (text and attachments) before the due date.

**Independent Test**: Submit a homework response as a student and verify the submission and attachments are stored correctly.

### Implementation for User Story 2

- [ ] T018 [P] [US2] Implement `CreateSubmissionDto` in `backend/src/submissions/dto/create-submission.dto.ts`
- [ ] T019 [US2] Implement `SubmissionsService.submit()` in `backend/src/submissions/submissions.service.ts` (Handles versioning and replaces attachments)
- [ ] T020 [US2] Implement `POST /homework/:id/submissions` endpoint in `backend/src/submissions/submissions.controller.ts`
- [ ] T021 [US2] Implement `submitHomework` Server Action in `frontend/app/actions/submissions.actions.ts`
- [ ] T022 [US2] Build Homework List and Submission Bottom Sheet in `frontend/app/(student)/homework/page.tsx` and `frontend/components/submissions/SubmissionSheet.tsx`
- [ ] T023 [US2] Create Status Badge component in `frontend/components/ui/StatusBadge.tsx` (Supports RTL and action-driven colors)

**Checkpoint**: User Story 2 is functional. Students can submit their assignments.

---

## Phase 5: User Story 3 & 4 - Status Logic & Review (Priority: P2)

**Goal**: Implement dynamic status logic (Late/Missing) and allow teachers to review all student submissions.

**Independent Test**: Verify "Late" status appears after the due date and teachers can see the list of all students for a homework.

### Implementation for User Stories 3 & 4

- [ ] T024 [P] [US3] Implement dynamic status computation logic in `backend/src/common/status.util.ts`
- [ ] T025 [US4] Implement `HomeworkService.getSubmissionsByHomework()` in `backend/src/homework/homework.service.ts` (Joins students and computes status)
- [ ] T026 [US4] Implement `GET /homework/:id/submissions` endpoint in `backend/src/homework/homework.controller.ts`
- [ ] T027 [US4] Build Teacher Submission Review screen in `frontend/app/(teacher)/sessions/[id]/homework/[homeworkId]/page.tsx`
- [ ] T028 [US4] Build Submission Details view in `frontend/components/submissions/SubmissionDetails.tsx` (Shows answer text and attachment links)
- [ ] T029 [US3] Add "Late" warning banner in `frontend/components/submissions/SubmissionSheet.tsx`

**Checkpoint**: Teachers can now track and review all student submissions with accurate statuses.

---

## Phase 6: User Story - Visibility Control (Priority: P2)

**Goal**: Allow teachers to manually close a homework assignment to block further submissions.

**Independent Test**: Close a homework assignment and verify students cannot submit anymore.

### Implementation

- [ ] T030 [US1] Implement `PATCH /homework/:id` for visibility toggle in `backend/src/homework/homework.controller.ts`
- [ ] T031 [US1] Implement `toggleHomeworkStatus` Server Action in `frontend/app/actions/homework.actions.ts`
- [ ] T032 [US1] Add visibility toggle UI in `frontend/app/(teacher)/sessions/[id]/page.tsx`

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T033 [P] Implement `SubmissionAuditLog` creation in `backend/src/submissions/submissions.service.ts` (Log on every submission attempt)
- [ ] T034 [P] Implement file type and size validation for attachments in `backend/src/submissions/submissions.service.ts` (10MB limit, PDF/PNG/JPG)
- [ ] T035 [P] Final RTL audit and Arabic text verification across all new screens
- [ ] T036 Run `npm run lint` and `npm test` in both `backend/` and `frontend/` directories
- [ ] T037 [P] Update API documentation in `backend/src/main.ts` (Swagger refresh)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup. Blocks all implementation.
- **User Stories (Phase 3-6)**: Depend on Foundational (Phase 2).
  - US1 and US2 are priority P1 and should be completed first.
  - US3, US4, and Visibility Control are P2 and follow.
- **Polish (Phase 7)**: Depends on core implementation.

### User Story Dependencies

- **User Story 1 (P1)**: Independent after Phase 2.
- **User Story 2 (P1)**: Depends on User Story 1 (need homework to submit).
- **User Story 3 & 4 (P2)**: Depend on User Stories 1 and 2.

### Within Each User Story

- DTOs and Services before Controllers.
- Endpoints before Frontend Actions.
- Components before page integration.

### Parallel Opportunities

- T005-T008 (Backend Entities) can be worked on in parallel.
- T011 and T014 (Backend DTO and Frontend Schema) can be worked on in parallel.
- T024 (Status Logic) can be started as soon as entities are ready.
- All Polish tasks (T033-T037) can be assigned to different developers.

---

## Parallel Example: Foundational Phase

```bash
# Launch all entity creations together:
Task: "Create Homework entity in backend/src/homework/entities/homework.entity.ts"
Task: "Create Submission entity in backend/src/submissions/entities/submission.entity.ts"
Task: "Create SubmissionAttachment entity in backend/src/submissions/entities/attachment.entity.ts"
Task: "Create SubmissionAuditLog entity in backend/src/submissions/entities/audit-log.entity.ts"
```

---

## Implementation Strategy

### MVP First (Teacher Assign + Student Submit)

1. Complete Setup and Foundational phases.
2. Complete Teacher Assign (US1).
3. Complete Student Submit (US2).
4. **STOP and VALIDATE**: Test basic end-to-end flow.

### Incremental Delivery

1. Add status logic and review screens (US3, US4).
2. Add manual visibility toggle (is_open).
3. Add internal audit logging and file validation.
4. Final RTL and performance polish.

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] labels: US1 (Assign), US2 (Submit), US3 (Status), US4 (Review).
- RTL Arabic flow is mandatory for all frontend components.
- Version history is stored internally via AuditLog but only latest is shown in UI.
