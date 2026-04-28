# Tasks: Grade System Standardization

**Input**: Design documents from `/specs/004-grade-system-standardization/`
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/grade-system-api.md`, `quickstart.md`

**Tests**: No new spec files are included because repository rules prohibit writing spec files. Verification uses existing lint commands and manual/contract checks from `quickstart.md`.

**Organization**: Tasks are grouped by user story to enable independent implementation and validation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files or has no dependency on another task in the same phase
- **[Story]**: User story mapping from `spec.md`
- All tasks include exact repository paths

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm existing project structure and prepare shared implementation locations.

- [ ] T001 Confirm backend and frontend package scripts for verification in `backend/package.json` and `frontend/package.json`
- [ ] T002 [P] Confirm existing migration naming and table conventions in `backend/src/migrations/`
- [ ] T003 [P] Confirm current student, group, and homework API shapes in `backend/src/children/`, `backend/src/groups/`, `backend/src/homework/`, `frontend/services/`, and `frontend/app/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core shared grade model, validation, formatting, and database migration that must exist before user stories are implemented.

**CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T004 Create shared backend grade constants, `EducationStage`, allowed-year rules, validation helper, and Arabic label formatter in `backend/src/common/grades/grade-system.ts`
- [ ] T005 Add TypeDoc comments for exported grade helpers in `backend/src/common/grades/grade-system.ts`
- [ ] T006 Create a TypeORM migration in `backend/src/migrations/` that adds `education_stage`, `education_year`, `legacy_grade`, and `grade_needs_review` to the student storage table and preserves existing raw grade values where present
- [ ] T007 Extend the same migration in `backend/src/migrations/` to add `education_stage` and `education_year` to `groups` and `homework`
- [ ] T008 Add PostgreSQL CHECK constraints for every table with `education_stage` and `education_year` in the migration from T006
- [ ] T009 Add indexes for stage/year filtering on student storage, `groups`, and `homework` in the migration from T006
- [ ] T010 Add reversible `down()` behavior in the migration from T006 that drops added indexes, constraints, and columns without dropping preserved legacy values before rollback requires it

**Checkpoint**: Foundation ready. Backend code can now validate and format canonical grade data, and persistence can enforce valid stage/year combinations.

---

## Phase 3: User Story 1 - Student Profile Creation (Priority: P1) MVP

**Goal**: Creating or editing a student profile records a canonical education stage/year and prevents invalid combinations.

**Independent Test**: Create or update a student through `POST /children` or `PATCH /children/:id`; Primary only accepts years 1-6, Preparatory/Secondary only accept years 1-3, and invalid pairs return 400.

### Implementation for User Story 1

- [ ] T011 [US1] Add `education_stage` and `education_year` validation fields with Swagger decorators to `backend/src/children/dto/create-child.dto.ts`
- [ ] T012 [US1] Add update-grade payload validation with Swagger decorators in the existing child update DTO location under `backend/src/children/dto/`
- [ ] T013 [US1] Apply shared stage/year validation in child create/update flows in `backend/src/children/children.service.ts`
- [ ] T014 [US1] Add or update child create/update controller Swagger docs and 400 responses in `backend/src/children/children.controller.ts`
- [ ] T015 [US1] Ensure child responses include `education_stage`, `education_year`, `grade_label`, and `grade_needs_review` from `backend/src/children/children.service.ts`
- [ ] T016 [US1] Add frontend grade target types in `frontend/types/grade/index.ts`
- [ ] T017 [US1] Update parent child creation Server Action validation using **Zod** to submit `education_stage` and `education_year` in `frontend/app/(student)/dashboard/new-child/actions.ts`
- [ ] T018 [US1] Update the new-child page form to use stage-aware year options and preview backend-compatible Arabic labels in `frontend/app/(student)/dashboard/new-child/page.tsx`
- [ ] T018b [US1] Update parent child edit Server Action validation using **Zod** to submit `education_stage` and `education_year` in `frontend/app/(student)/dashboard/edit-child/actions.ts` (or equivalent location)
- [ ] T018c [US1] Update the edit-child page form to use stage-aware year options in `frontend/app/(student)/dashboard/edit-child/page.tsx` (or equivalent location)

**Checkpoint**: User Story 1 is functional and independently testable.

---

## Phase 4: User Story 2 - Standardized Grade Display (Priority: P1)

**Goal**: Student, group/session, and homework UI displays use the backend-provided `grade_label` instead of raw legacy grade strings or frontend-generated labels.

**Independent Test**: View student profiles, class rosters, parent dashboards, session pages, and homework pages; grade text is canonical Arabic from API responses.

### Implementation for User Story 2

- [ ] T019 [US2] Update backend child serialization/mapping to consistently expose `grade_label` in `backend/src/children/children.service.ts`
- [ ] T020 [P] [US2] Update group response mapping to expose `grade_label` in `backend/src/groups/groups.service.ts`
- [ ] T021 [P] [US2] Update homework response mapping to expose `grade_label` in `backend/src/homework/homework.service.ts`
- [ ] T022 [US2] Update child frontend response models to replace `grade_level` display usage with `grade_label` in `frontend/components/children/AssignTeacherBottomSheet.tsx`
- [ ] T023 [US2] Render child `grade_label` in the parent children list in `frontend/components/children/ChildrenListClient.tsx`
- [ ] T024 [US2] Update parent dashboard children page data typing to include `education_stage`, `education_year`, and `grade_label` in `frontend/app/(student)/dashboard/children/page.tsx`
- [ ] T025 [P] [US2] Update teacher student list/detail rendering to use backend `grade_label` in `frontend/app/(teacher)/students/page.tsx` and `frontend/app/(teacher)/students/[id]/page.tsx`
- [ ] T026 [P] [US2] Update group/session UI rendering to use backend `grade_label` in `frontend/app/(teacher)/sessions/page.tsx` and `frontend/app/(teacher)/sessions/[id]/page.tsx`
- [ ] T027 [P] [US2] Update homework UI rendering to use backend `grade_label` in `frontend/app/(teacher)/homework/new/page.tsx`, `frontend/app/(teacher)/sessions/[id]/homework/[homeworkId]/page.tsx`, and `frontend/app/(student)/dashboard/homework/page.tsx`

**Checkpoint**: User Stories 1 and 2 work independently with canonical Arabic labels rendered from backend responses.

---

## Phase 5: User Story 3 - Filtering and Organization (Priority: P2)

**Goal**: Teachers can filter students, groups/sessions, and homework by education stage and year using backend-validated query params.

**Independent Test**: Apply `education_stage=SECONDARY&education_year=3` to student, group/session, and homework lists; only matching records appear, and impossible pairs return 400.

### Implementation for User Story 3

- [ ] T028 [US3] Add validated child list query fields for `education_stage` and `education_year` in `backend/src/children/dto/`
- [ ] T029 [US3] Apply stage/year filters to child list queries in `backend/src/children/children.service.ts`
- [ ] T030 [US3] Document child list filter query params and invalid-pair 400 response in `backend/src/children/children.controller.ts`
- [ ] T031 [US3] Add `education_stage` and `education_year` to group create/update DTOs and list query validation in `backend/src/groups/dto/create-group.dto.ts` and `backend/src/groups/dto/update-group.dto.ts`
- [ ] T032 [US3] Persist and filter group/session stage/year values in `backend/src/groups/entities/group.entity.ts` and `backend/src/groups/groups.service.ts`
- [ ] T033 [US3] Document group/session stage/year payload and filter query params in `backend/src/groups/groups.controller.ts`
- [ ] T034 [US3] Add `education_stage` and `education_year` validation to homework creation and list query handling in `backend/src/homework/dto/create-homework.dto.ts`
- [ ] T035 [US3] Persist and filter homework stage/year values in `backend/src/homework/entities/homework.entity.ts` and `backend/src/homework/homework.service.ts`
- [ ] T036 [US3] Document homework stage/year payload and filter query params in `backend/src/homework/homework.controller.ts`
- [ ] T037 [US3] Update frontend API service query params and response models for groups in `frontend/services/api/groups.ts` and `frontend/services/bff/groups.ts`
- [ ] T038 [P] [US3] Update frontend API service query params and response models for homework in `frontend/services/api/homework.ts`
- [ ] T039 [US3] Add teacher-facing stage/year filters to students list in `frontend/app/(teacher)/students/page.tsx`
- [ ] T040 [P] [US3] Add teacher-facing stage/year filters to groups and sessions lists in `frontend/app/(teacher)/sessions/page.tsx` (and dedicated groups view if separate)
- [ ] T041 [P] [US3] Add teacher-facing stage/year filters to homework views in `frontend/app/(teacher)/homework/new/page.tsx` and `frontend/app/(student)/dashboard/homework/page.tsx`

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency checks, verification, and rollout readiness.

- [ ] T042 [P] Search frontend code for remaining `grade_level` display usage and replace only user-facing grade display with `grade_label`
- [ ] T043 [P] Search backend code for duplicated grade validation/formatting and route it through `backend/src/common/grades/grade-system.ts`
- [ ] T044 Verify invalid API payloads return 400 with descriptive errors for students, groups/sessions, and homework
- [ ] T045 Verify migrated empty, null, and un-mappable legacy grade values become `UNASSIGNED`, `education_year = 0`, and `grade_needs_review = true`
- [ ] T046 Run backend verification with `pnpm run lint:ci` from `backend/`
- [ ] T047 Run frontend verification with `pnpm run lint` from `frontend/`
- [ ] T048 Update `specs/004-grade-system-standardization/quickstart.md` only if implementation commands or manual checks changed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1**: No dependencies
- **Phase 2**: Depends on Phase 1 and blocks all user stories
- **Phase 3 (US1)**: Depends on Phase 2
- **Phase 4 (US2)**: Depends on Phase 2; can proceed in parallel with US1 after shared response fields exist, but final UI validation benefits from US1
- **Phase 5 (US3)**: Depends on Phase 2; can proceed in parallel with US1/US2 for backend filters, but frontend filters depend on API model updates
- **Phase 6**: Depends on selected user stories being complete

### User Story Dependencies

- **US1 (P1)**: Requires foundational grade utilities and migration; no dependency on US2 or US3
- **US2 (P1)**: Requires backend `grade_label` formatter; no dependency on frontend selectors from US1
- **US3 (P2)**: Requires structured stage/year fields and validation; independent from display-only UI updates in US2

### Parallel Opportunities

- T002 and T003 can run in parallel
- T020 and T021 can run in parallel after T004
- T025, T026, and T027 can run in parallel after backend response fields are available
- T038, T040, and T041 can run in parallel with other US3 frontend tasks when API query models are settled
- T042 and T043 can run in parallel during polish

---

## Implementation Strategy

### MVP First

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 for structured student creation/editing.
3. Validate `POST /children` and `PATCH /children/:id` with valid and invalid stage/year pairs.

### Incremental Delivery

1. Deliver US1 to make new student data canonical.
2. Deliver US2 to remove inconsistent grade display across dashboards and lists.
3. Deliver US3 to enable teacher filtering for students, groups/sessions, and homework.
4. Run Phase 6 verification before rollout.

### Notes

- Backend remains the source of truth for Arabic `grade_label` formatting.
- Frontend may use local labels only for selector option text and preview, not persisted or authoritative API display.
- `UNASSIGNED` is for migration/manual-review records only unless an explicit admin flow is later added.
- Do not add dependencies unless an implementation blocker proves one is necessary.
