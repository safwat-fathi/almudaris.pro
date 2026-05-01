# Quickstart: Grade System Standardization

## Prerequisites

- Backend dependencies installed.
- Frontend dependencies installed.
- Database available for migration checks.
- No new spec files should be added for this feature.

## Manual Verification Flow

### 1. Verify Stage/Year Rules

1. Create a student with Primary Year 6.
2. Confirm save succeeds and response includes `grade_label = الصف السادس الابتدائي`.
3. Try Primary Year 7.
4. Confirm save fails with a descriptive validation error.
5. Try Secondary Year 3.
6. Confirm save succeeds and response includes `grade_label = الصف الثالث الثانوي`.

### 2. Verify Legacy Migration Behavior

1. Prepare legacy student records with recognized and unrecognized grade values.
2. Run the migration in a safe environment.
3. Confirm recognized values map to canonical stage/year pairs.
4. Confirm unrecognized, empty, and null values map to `UNASSIGNED`, year `0`, and review flag true.
5. Confirm database constraints accept only valid stage/year pairs, including `(UNASSIGNED, 0)`.

### 3. Verify Teacher Stage Assignment

1. Try saving a teacher with no assigned stages.
2. Confirm save is blocked.
3. Assign Secondary only.
4. Confirm save succeeds.
5. Assign Secondary and Preparatory.
6. Confirm save succeeds and both stages display correctly.

### 4. Verify Group Targeting

1. Select a teacher assigned to Secondary only.
2. Create a group with Secondary Year 3.
3. Confirm save succeeds.
4. Attempt to create a Preparatory group for the same teacher.
5. Confirm save is blocked with a teacher-stage mismatch error.
6. Attempt to save a group without stage or year.
7. Confirm save is blocked and missing fields are identified.

### 5. Verify Display Consistency

1. View student profiles, parent dashboards, teacher student lists, group/session pages, and homework pages.
2. Confirm all user-facing grade text uses canonical Arabic labels from responses.
3. Confirm there are 0 visible raw grade strings such as `Grade 3` or `3rd secondary`.

### 6. Verify Filtering

1. Filter students by Secondary Year 3.
2. Confirm only Secondary Year 3 records appear.
3. Filter groups/sessions by Secondary Year 3.
4. Confirm only matching groups/sessions appear.
5. Filter homework by Secondary Year 3.
6. Confirm only matching homework appears.

## Verification Commands

Run backend lint:

```bash
pnpm run lint:ci
```

Run frontend lint:

```bash
pnpm run lint
```

## Expected Outcome

- Students, teachers, groups, sessions, and homework all use canonical stage/year semantics.
- Teacher stage assignments constrain group creation.
- Backend responses provide canonical Arabic labels.
- Frontend forms validate stage/year and teacher stage data before submission.
