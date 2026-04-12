# Tasks: Parent Invitations

**Input**: Design documents from `/specs/002-parent-invitations/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Verify project structure per implementation plan

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Generate database migration script for adding `inviteCode` to `Teacher`
- [x] T003 Generate database migration script for `ParentTeacherLink` join table
- [x] T004 Generate database migration script for `StudentTeacherEnrollment` join table
- [x] T005 Run database migrations locally

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Teacher Shares Invitation Link (Priority: P1) 🎯 MVP

**Goal**: Teachers can get a link or QR code to share with parents so that parents can link themselves to the teacher easily.

**Independent Test**: Can be fully tested by verifying the teacher can view, copy, and download a QR code for their invitation link.

### Implementation for User Story 1

- [x] T006 [P] [US1] Update `Teacher` model in `backend/src/modules/teachers/entities/teacher.entity.ts` to include `inviteCode`
- [x] T007 [US1] Implement `inviteCode` generation/retrieval in `backend/src/modules/teachers/teachers.service.ts`
- [x] T008 [US1] Expose GET endpoint for teacher profile to include `inviteCode` in `backend/src/modules/teachers/teachers.controller.ts`
- [x] T009 [P] [US1] Create frontend UI component `frontend/src/components/invite/InviteQRCode.tsx` for displaying/downloading link and QR
- [x] T010 [US1] Integrate `InviteQRCode` component into teacher dashboard/profile

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Parent Accepts Invitation (Priority: P1)

**Goal**: Parents click the teacher's invitation link, log in or register, and automatically establish a "linked" connection with that specific teacher.

**Independent Test**: Can be tested by navigating to an invitation link as a parent and verifying that the parent-teacher link is created after sign-in.

### Implementation for User Story 2

- [x] T011 [P] [US2] Create `ParentTeacherLink` model -> `backend/src/modules/parents/entities/parent-teacher-link.entity.ts`
- [x] T012 [P] [US2] Expose GET `/api/teachers/invite/:inviteCode` endpoint in `teachers.controller.ts`
- [x] T013 [US2] Implement POST `/api/parents/link-teacher` endpoint and service logic in `parents.controller.ts`
- [x] T014 [US2] Create RSC landing page `frontend/src/app/(auth)/invite/[code]/page.tsx`
- [x] T015 [US2] Implement Server Action to submit the link request in `frontend/src/app/(auth)/invite/[code]/actions.ts`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Parent Adds Students to Teacher (Priority: P2)

**Goal**: Parents can create student accounts for their children and assign them directly to the teachers they are linked with.

**Independent Test**: Can be tested by logging in as a linked parent, creating a student, and verifying the student is associated with the selected teacher.

### Implementation for User Story 3

- [x] T016 [P] [US3] Ensure `Student` and `StudentTeacherEnrollment` models exist in `backend/src/modules/students/entities/`
- [x] T017 [US3] Implement `POST /api/students` endpoint handling creation and multi-enrollment in `backend/src/modules/students/students.controller.ts`
- [x] T018 [P] [US3] Create student form component `frontend/src/components/students/StudentForm.tsx` supporting teacher selection
- [x] T019 [US3] Create page `frontend/src/app/parent/students/new/page.tsx` with RSC data-fetching of linked teachers
- [x] T020 [US3] Implement Server Action for student creation and linking in `frontend/src/app/parent/students/new/actions.ts`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T021 [P] Extract hardcoded UI strings to support localization if applicable
- [x] T022 Code cleanup, formatting, and `pnpm run lint` validation
- [x] T023 Run quickstart.md validation to ensure end-to-end flow is completely smooth

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - US1 and US2 are both P1 and parallelizable in backend
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P1)**: Relies on `inviteCode` structures from US1 or Foundational.
- **User Story 3 (P2)**: Best executed after Parent-Teacher link (US2) is established to allow full end-to-end testing.

### Within Each User Story

- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All migration scripts in Foundational phase can be generated and applied simultaneously.
- `GET` endpoints for invite fetch and `POST` endpoint for parent link can be built in parallel.
- Frontend views can be bootstrapped alongside backend API build.

---

## Implementation Strategy

### MVP First (User Stories 1 & 2)

1. Complete Phase 1 & 2
2. Complete Phase 3 (US1) & Phase 4 (US2) since they form the core of the invitation loop.
3. Test independent link generation and joining.
4. Complete Phase 5 (US3).
5. Deploy/demo.