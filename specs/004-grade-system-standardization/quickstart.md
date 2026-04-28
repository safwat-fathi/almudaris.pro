# Quickstart: Grade System Standardization

## Prerequisites

- Work from branch `004-grade-system-standardization`.
- Use existing `pnpm` workflows in `backend` and `frontend`.
- Do not add dependencies unless a later implementation task identifies a necessary gap.

## Implementation Order

1. Add shared backend grade constants/utilities for valid stages, valid years, validation, and Arabic label formatting.
2. Update child/student DTOs, entities, services, and controllers to accept structured grade fields and return `grade_label`.
3. Add schema/data migration for student legacy grade conversion, unassigned records, manual-review flag, and database CHECK constraint.
4. Update group/session and homework entities, DTOs, services, filters, and Swagger docs to target exactly one stage/year.
5. Update frontend API models/services and BFF functions to carry `education_stage`, `education_year`, and `grade_label`.
6. Update student forms, teacher filters, dashboard cards, group/session pages, and homework pages to render backend labels and stage-aware year options.
7. Verify invalid stage/year payloads return 400 at the API boundary and cannot persist through the database constraint.

## Verification

Backend:

```bash
cd backend
pnpm run lint:ci
```

Frontend:

```bash
cd frontend
pnpm run lint
```

Manual checks:

- Creating a Primary student only offers/saves years 1-6.
- Creating a Preparatory or Secondary student only offers/saves years 1-3.
- Student, group/session, and homework responses include canonical Arabic `grade_label`.
- Student/group/session/homework lists filter correctly by stage and year.
- Invalid external/API payloads return 400 synchronously.
- Empty, null, or un-mappable legacy grades migrate to `UNASSIGNED`, `education_year = 0`, and `grade_needs_review = true`.

## Rollout Notes

- Preserve raw legacy grade values during migration for auditability and manual correction.
- Keep frontend display dependent on backend `grade_label`; do not duplicate Arabic formatting in components.
- Avoid client-side pages; keep data fetching in server components, Server Actions, API services, and BFF services.
