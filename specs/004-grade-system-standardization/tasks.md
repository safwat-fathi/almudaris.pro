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

**Purpose**: Confirm existing project structure and implementation entry points.

- [ ] T001 Confirm backend and frontend package verification scripts in `backend/package.json` and `frontend/package.json`
- [ ] T002 [P] Confirm current migration naming and table conventions in `backend/src/migrations/`
- [ ] T003 [P] Confirm current student, teacher, group, session, and homework API shapes in `backend/src/children/`, `backend/src/teachers/`, `backend/src/groups/`, `backend/src/homework/`, `frontend/services/`, and `frontend/app/`
- [ ] T004 [P] Confirm existing frontend form validation and Server Action patterns in `frontend/app/`, `frontend/services/bff/`, and `frontend/types/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared grade model, validation, formatting, migration, and frontend type foundation required before user stories.

**CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T005 Create shared backend grade constants, `EducationStage`, allowed-year rules including `UNASSIGNED` year 0, validation helper, and Arabic label formatter in `backend/src/common/grades/grade-system.ts`
- [ ] T006 Add TypeDoc comments for exported grade helpers in `backend/src/common/grades/grade-system.ts`
- [ ] T007 Create a TypeORM migration in `backend/src/migrations/` that adds structured grade fields to student storage and preserves existing raw grade values in `legacy_grade`
- [ ] T008 Extend the migration in `backend/src/migrations/` to add `education_stage` and `education_year` to `groups` and `homework`
- [ ] T009 Extend the migration in `backend/src/migrations/` to add teacher assigned-stage storage to the existing teacher storage table using the current project schema pattern
- [ ] T010 Add explicit legacy grade mapping logic in the migration in `backend/src/migrations/` for recognized Egyptian stage/year labels and numeric legacy values
- [ ] T011 Add fallback migration behavior in `backend/src/migrations/` that maps unrecognized, empty, or null student grades and unmappable group/homework records to `UNASSIGNED`, `education_year = 0`, and review flags where supported
- [ ] T012 Add PostgreSQL CHECK constraints for every persisted `education_stage` and `education_year` pair in `backend/src/migrations/`, allowing only Primary 1-6, Preparatory 1-3, Secondary 1-3, and Unassigned 0
- [ ] T013 Add indexes for stage/year filtering on student storage, `groups`, and `homework` in `backend/src/migrations/`
- [ ] T014 Add reversible `down()` behavior in the migration in `backend/src/migrations/` that drops added indexes, constraints, and columns safely
- [ ] T015 Create shared frontend grade types and stage/year option helpers in `frontend/types/grade/index.ts`
- [ ] T016 Create shared frontend Zod schema helpers for stage/year and teacher stage assignment validation in `frontend/types/grade/schema.ts`

**Checkpoint**: Foundation ready. Backend can validate and format canonical grade data, persistence can enforce valid pairs, and frontend has shared types/schemas.

---

## Phase 3: User Story 1 - Student Profile Creation (Priority: P1) MVP

**Goal**: Creating or editing a student profile records a canonical education stage/year and prevents invalid combinations.

**Independent Test**: Create or update a student through `POST /children` or `PATCH /children/:id`; Primary only accepts years 1-6, Preparatory/Secondary only accept years 1-3, and invalid pairs return 400.

### Implementation for User Story 1

- [ ] T017 [US1] Add `education_stage` and `education_year` validation fields with Swagger decorators to `backend/src/children/dto/create-child.dto.ts`
- [ ] T018 [US1] Add stage/year update validation with Swagger decorators in the existing child update DTO under `backend/src/children/dto/`
- [ ] T019 [US1] Apply shared stage/year validation in child create/update flows in `backend/src/children/children.service.ts`
- [ ] T020 [US1] Add or update child create/update controller Swagger docs and 400 responses in `backend/src/children/children.controller.ts`
- [ ] T021 [US1] Ensure child responses include `education_stage`, `education_year`, `grade_label`, and `grade_needs_review` from `backend/src/children/children.service.ts`
- [ ] T022 [US1] Update parent child creation Server Action Zod validation to submit `education_stage` and `education_year` in `frontend/app/(student)/dashboard/new-child/actions.ts`
- [ ] T023 [US1] Update the new-child page form to use stage-aware year options and preview backend-compatible Arabic labels in `frontend/app/(student)/dashboard/new-child/page.tsx`

**Checkpoint**: User Story 1 is functional and independently testable.

---

## Phase 4: User Story 4 - Teacher Stage Assignment and Group Targeting (Priority: P1)

**Goal**: Teachers have at least one assigned education stage, and groups can only be created for a selected teacher's assigned stages with exactly one valid stage/year.

**Independent Test**: Assign a teacher to Secondary only, create a Secondary Year 3 group successfully, verify Preparatory group creation for the same teacher is blocked, and verify a group cannot save without both stage and year.

### Implementation for User Story 4

- [ ] T024 [US4] Add `assigned_stages` validation with Swagger decorators to the existing teacher create/update DTOs in `backend/src/teachers/dto/`
- [ ] T025 [US4] Add teacher assigned-stage persistence mapping to the teacher entity or model in `backend/src/teachers/`
- [ ] T026 [US4] Apply teacher assigned-stage validation requiring at least one non-`UNASSIGNED` stage in `backend/src/teachers/teachers.service.ts`
- [ ] T027 [US4] Ensure teacher responses include normalized `assigned_stages` in `backend/src/teachers/teachers.service.ts`
- [ ] T028 [US4] Add Swagger docs and 400 responses for teacher assigned-stage validation in `backend/src/teachers/teachers.controller.ts`
- [ ] T029 [US4] Add `education_stage` and `education_year` validation to group create/update DTOs in `backend/src/groups/dto/create-group.dto.ts` and `backend/src/groups/dto/update-group.dto.ts`
- [ ] T030 [US4] Persist group `education_stage` and `education_year` fields in `backend/src/groups/entities/group.entity.ts`
- [ ] T031 [US4] Validate group stage/year pairs and reject stages outside the selected teacher's `assigned_stages` in `backend/src/groups/groups.service.ts`
- [ ] T032 [US4] Ensure group responses include `education_stage`, `education_year`, and `grade_label` in `backend/src/groups/groups.service.ts`
- [ ] T033 [US4] Add Swagger docs and 400 responses for missing group stage/year and teacher-stage mismatch in `backend/src/groups/groups.controller.ts`
- [ ] T034 [US4] Update teacher API service models for `assigned_stages` in `frontend/services/api/teachers.ts`
- [ ] T035 [US4] Update teacher BFF/service composition for assigned-stage reads and writes in `frontend/services/bff/teachers.ts`
- [ ] T036 [US4] Add or update teacher stage selection UI using shared grade types in `frontend/app/(teacher)/settings/page.tsx`
- [ ] T037 [US4] Update group API and BFF models for `education_stage`, `education_year`, and `grade_label` in `frontend/services/api/groups.ts` and `frontend/services/bff/groups.ts`
- [ ] T038 [US4] Update group creation/editing Server Action Zod validation for required stage/year and teacher-stage eligibility in `frontend/app/(teacher)/sessions/actions.ts`
- [ ] T039 [US4] Update group creation/editing UI to filter stage options by selected teacher and year options by selected stage in `frontend/app/(teacher)/sessions/page.tsx`

**Checkpoint**: User Story 4 is functional and independently testable.

---

## Phase 5: User Story 2 - Standardized Grade Display (Priority: P1)

**Goal**: Student, group/session, and homework UI displays use backend-provided `grade_label` instead of raw legacy grade strings or frontend-generated labels.

**Independent Test**: View student profiles, class rosters, parent dashboards, session pages, and homework pages; grade text is canonical Arabic from API responses.

### Implementation for User Story 2

- [ ] T040 [US2] Update backend child serialization/mapping to consistently expose `grade_label` in `backend/src/children/children.service.ts`
- [ ] T041 [P] [US2] Update group response mapping to expose `grade_label` in `backend/src/groups/groups.service.ts`
- [ ] T042 [P] [US2] Update homework response mapping to expose `grade_label` in `backend/src/homework/homework.service.ts`
- [ ] T043 [US2] Update child frontend response models to replace `grade_level` display usage with `grade_label` in `frontend/components/children/AssignTeacherBottomSheet.tsx`
- [ ] T044 [US2] Render child `grade_label` in the parent children list in `frontend/components/children/ChildrenListClient.tsx`
- [ ] T045 [US2] Update parent dashboard children page data typing to include `education_stage`, `education_year`, and `grade_label` in `frontend/app/(student)/dashboard/children/page.tsx`
- [ ] T046 [P] [US2] Update teacher student list/detail rendering to use backend `grade_label` in `frontend/app/(teacher)/students/page.tsx` and `frontend/app/(teacher)/students/[id]/page.tsx`
- [ ] T047 [P] [US2] Update group/session UI rendering to use backend `grade_label` in `frontend/app/(teacher)/sessions/page.tsx` and `frontend/app/(teacher)/sessions/[id]/page.tsx`
- [ ] T048 [P] [US2] Update homework UI rendering to use backend `grade_label` in `frontend/app/(teacher)/homework/new/page.tsx`, `frontend/app/(teacher)/sessions/[id]/homework/[homeworkId]/page.tsx`, `frontend/app/(student)/dashboard/homework/page.tsx`, and `frontend/components/homework/AddHomeWorkSheet.tsx`

**Checkpoint**: User Story 2 works independently with canonical Arabic labels rendered from backend responses.

---

## Phase 6: User Story 3 - Filtering and Organization (Priority: P2)

**Goal**: Teachers can filter students, groups/sessions, and homework by education stage and year using backend-validated query params.

**Independent Test**: Apply `education_stage=SECONDARY&education_year=3` to student, group/session, and homework lists; only matching records appear, and impossible pairs return 400.

### Implementation for User Story 3

- [ ] T049 [US3] Add validated child list query fields for `education_stage` and `education_year` in `backend/src/children/dto/`
- [ ] T050 [US3] Apply stage/year filters to child list queries in `backend/src/children/children.service.ts`
- [ ] T051 [US3] Document child list filter query params and invalid-pair 400 response in `backend/src/children/children.controller.ts`
- [ ] T052 [US3] Add validated group list query fields for `education_stage` and `education_year` in `backend/src/groups/dto/`
- [ ] T053 [US3] Apply stage/year filters to group/session list queries in `backend/src/groups/groups.service.ts`
- [ ] T054 [US3] Document group/session stage/year filter query params in `backend/src/groups/groups.controller.ts`
- [ ] T055 [US3] Add `education_stage` and `education_year` validation to homework creation and list query handling in `backend/src/homework/dto/create-homework.dto.ts`
- [ ] T056 [US3] Persist and filter homework stage/year values in `backend/src/homework/entities/homework.entity.ts` and `backend/src/homework/homework.service.ts`
- [ ] T057 [US3] Document homework stage/year payload and filter query params in `backend/src/homework/homework.controller.ts`
- [ ] T058 [US3] Update frontend API service query params and response models for students in `frontend/services/api/children.ts`
- [ ] T059 [US3] Update frontend API service query params and response models for groups in `frontend/services/api/groups.ts` and `frontend/services/bff/groups.ts`
- [ ] T060 [P] [US3] Update frontend API service query params and response models for homework in `frontend/services/api/homework.ts`
- [ ] T061 [US3] Add teacher-facing stage/year filters to students list in `frontend/app/(teacher)/students/page.tsx`
- [ ] T062 [P] [US3] Add teacher-facing stage/year filters to sessions list in `frontend/app/(teacher)/sessions/page.tsx`
- [ ] T063 [P] [US3] Add teacher-facing stage/year filters and homework creation grade-context handling to homework views in `frontend/app/(teacher)/homework/new/page.tsx`, `frontend/app/(student)/dashboard/homework/page.tsx`, and `frontend/components/homework/AddHomeWorkSheet.tsx`

**Checkpoint**: User Story 3 is functional and independently testable.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency checks, verification, and rollout readiness.

- [ ] T064 [P] Search frontend code for remaining `grade_level` display usage and replace only user-facing grade display with `grade_label` in `frontend/`
- [ ] T065 [P] Search backend code for duplicated grade validation/formatting and route it through `backend/src/common/grades/grade-system.ts`
- [ ] T066 Verify invalid API payloads return 400 with descriptive errors for students, teachers, groups/sessions, and homework using `specs/004-grade-system-standardization/quickstart.md`
- [ ] T067 Verify migrated empty, null, and un-mappable legacy values become `UNASSIGNED`, `education_year = 0`, and review-required state using `specs/004-grade-system-standardization/quickstart.md`
- [ ] T068 Verify teacher stage assignment and group teacher-stage mismatch behavior using `specs/004-grade-system-standardization/quickstart.md`
- [ ] T069 Verify `frontend/components/homework/AddHomeWorkSheet.tsx` blocks homework creation without group grade context and submits valid group stage/year targeting using `specs/004-grade-system-standardization/quickstart.md`
- [ ] T070 Run backend verification with `pnpm run lint:ci` from `backend/`
- [ ] T071 Run frontend verification with `pnpm run lint` from `frontend/`
- [ ] T072 Update `specs/004-grade-system-standardization/quickstart.md` only if implementation commands or manual checks changed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1**: No dependencies
- **Phase 2**: Depends on Phase 1 and blocks all user stories
- **Phase 3 (US1)**: Depends on Phase 2
- **Phase 4 (US4)**: Depends on Phase 2; can proceed in parallel with US1 after shared grade helpers and migration fields exist
- **Phase 5 (US2)**: Depends on Phase 2; benefits from US1/US4 response fields but display work remains independently testable once mappings exist
- **Phase 6 (US3)**: Depends on Phase 2; can proceed in parallel after DTO/query models are settled
- **Phase 7**: Depends on selected user stories being complete

### User Story Dependencies

- **US1 (P1)**: Requires foundational grade utilities and migration; no dependency on US2, US3, or US4
- **US4 (P1)**: Requires foundational grade utilities, teacher stage persistence, and group stage/year persistence; no dependency on US1 display work
- **US2 (P1)**: Requires backend `grade_label` formatter; can be delivered after relevant response mappings exist
- **US3 (P2)**: Requires structured stage/year fields and validation; independent from display-only UI updates in US2

### Parallel Opportunities

- T002, T003, and T004 can run in parallel
- T041 and T042 can run in parallel after T005
- T046, T047, and T048 can run in parallel after backend response fields are available
- T060, T062, and T063 can run in parallel with other US3 frontend tasks when API query models are settled
- T064 and T065 can run in parallel during polish

---

## Parallel Example: User Story 4

```text
Task: "Add assigned_stages validation with Swagger decorators to backend/src/teachers/dto/"
Task: "Add education_stage and education_year validation to group DTOs in backend/src/groups/dto/create-group.dto.ts and backend/src/groups/dto/update-group.dto.ts"
Task: "Update teacher API service models for assigned_stages in frontend/services/api/teachers.ts"
```

---

## Implementation Strategy

### MVP First

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 for structured student creation/editing.
3. Complete Phase 4 for teacher assigned stages and group targeting.
4. Validate `POST /children`, `PATCH /children/:id`, teacher stage updates, and group creation with valid and invalid stage/year pairs.

### Incremental Delivery

1. Deliver US1 to make new student data canonical.
2. Deliver US4 to ensure teachers and groups use the same grade model.
3. Deliver US2 to remove inconsistent grade display across dashboards and lists.
4. Deliver US3 to enable teacher filtering for students, groups/sessions, and homework.
5. Run Phase 7 verification before rollout.

### Notes

- Backend remains the source of truth for Arabic `grade_label` formatting and stage/year validation.
- Teacher assignments are stage-level permissions, while groups select exact stage/year targets.
- Frontend may use local labels only for selector option text and preview, not persisted or authoritative API display.
- `UNASSIGNED` is for migration/manual-review records only unless an explicit admin flow is later added.
- Do not add dependencies unless an implementation blocker proves one is necessary.
