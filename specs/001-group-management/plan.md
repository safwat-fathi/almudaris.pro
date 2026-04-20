# Implementation Plan: Groups Management

**Branch**: `001-groups-invitations-management` | **Date**: 2026-04-10 (Updated: 2026-04-20) | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-group-management/spec.md`

## Summary

The platform requires a core "Groups" feature where teachers can schedule teaching events (individual or group, online or physical). Teachers can create, edit (upcoming groups), cancel, and manage recurring groups, as well as record attendance and per-student notes for completed groups. The system strictly preserves the historical accuracy of completed groups by preventing structural changes. All times are stored in UTC with frontend timezone conversion. Backend validates overlaps and returns non-blocking warnings.

## Technical Context

**Language/Version**: TypeScript (Node.js)  
**Primary Dependencies**: NestJS (Backend), Next.js v16 (Frontend, App Router), TailwindCSS, Zustand, Zod, TypeORM/pg  
**Storage**: PostgreSQL (using SERIAL for PKs and jsonb)  
**Testing**: Linting only (`pnpm run lint`). No automated spec/test files allowed.  
**Target Platform**: Web browsers (Mobile-first, Arabic RTL)  
**Project Type**: Web application (Frontend + Backend)  
**Performance Goals**: Fast UI response; attendance marking < 3 seconds.  
**Constraints**: Server-Driven frontend (no client-side pages), strict separation of API and BFF, cookies for auth.  
**Scale/Scope**: MVP for private tutors in Egypt. Configurable limit of 24 instances per recurring series (MVP default).  
**Timezone Strategy**: All times stored in UTC. Teacher's timezone on user profile. Frontend converts for display.  
**Base Entity Pattern**: Existing `BaseEntity` provides `created_at`, `updated_at`, `deleted_at` (soft delete via TypeORM `@DeleteDateColumn`).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Simplicity & Zero-Learning Curve**: ✅ Passes. UI uses predictive defaults and familiar models. `end_time` is auto-computed (no teacher input needed). Per-student notes accessible inline.
- **Action-Driven & Emotional UX**: ✅ Passes. Uses specific color coding (Primary Blue, Success Green, Alert Red) and RTL Arabic flow. Non-blocking overlap warnings guide without blocking.
- **Modern & Accessible Design System**: ✅ Passes. Uses Manrope font, ROUND_FULL shapes, and mobile-first grids.
- **Robust & Typed API Architecture**: ✅ Passes. Uses NestJS, Swagger decorators, TypeDoc, and SERIAL keys. Backend validates overlaps, logs events, and returns `warnings` in API responses. `end_time` computed by backend/DB trigger.
- **Server-Driven & Secure Frontend**: ✅ Passes. Uses Next.js App Router, Server Actions, and CSRF tokens. No client-side pages. Frontend converts UTC times to teacher‚Äôs local timezone.

## Project Structure

### Documentation (this feature)

```text
specs/001-group-management/
├── plan.md              ← This file (updated)
├── research.md          ← 10 technical decisions
├── data-model.md        ← 3 entities with all audit/snapshot fields
├── quickstart.md        ← Updated overview
├── contracts/
│   └── api-contract.md  ← 7 endpoints
└── tasks.md             ← (to be generated)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── common/
│   │   └── entities/
│   │       └── base.entity.ts     ← Existing (created_at, updated_at, deleted_at)
│   ├── groups/
│   │   ├── dto/
│   │   │   ├── create-group.dto.ts
│   │   │   ├── update-group.dto.ts
│   │   │   ├── update-attendance.dto.ts
│   │   │   └── update-status.dto.ts
│   │   ├── entities/
│   │   │   ├── group.entity.ts
│   │   │   ├── group-student.entity.ts
│   │   │   └── recurring-series.entity.ts
│   │   ├── groups.controller.ts
│   │   ├── groups.service.ts
│   │   └── groups.module.ts
│   ├── config/
│   │   └── groups.config.ts       ← Configurable constants (MAX_RECURRING = 24)
│   └── users/
│       └── entities/
│           └── user.entity.ts     ← Existing (has timezone field on profile)

frontend/
├── app/
│   ├── (teacher)/
│   │   └── groups/
│   │       ├── page.tsx           ← Server Component: list groups
│   │       ├── [id]/
│   │       │   └── page.tsx       ← Server Component: group detail
│   │       └── new/
│   │           └── page.tsx       ← Server Component: create group form
├── components/
│   └── groups/
│       ├── group-card.tsx
│       ├── group-form.tsx
│       ├── attendance-form.tsx
│       ├── overlap-warning.tsx
│       └── recurring-options.tsx
└── services/
    ├── api/
    │   └── groups.ts              ← API client calls
    └── bff/
        └── groups.ts              ← Server Actions (create, edit, cancel, attendance)
```

**Structure Decision**: Web application (backend/frontend split) following the required NestJS module structure on the backend and Next.js App Router strictly server-driven structure on the frontend.

## Key Design Decisions (from research.md)

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Status transition via stored `end_time` column query | Index-friendly, no runtime computation |
| 2 | Recurring limit = 24, configurable constant | MVP safe, scalable later |
| 3 | Overlap validation: frontend + backend (non-blocking `warnings` response) | Prevents bypass, maintains data consistency |
| 4 | Linting only, no spec files | Per repository rules |
| 5 | `end_time` stored alongside `duration_minutes` | Query performance, both useful |
| 6 | All times UTC, teacher timezone on profile | Standard web pattern |
| 7 | `student_name` snapshot at creation, hard FK, soft-delete students | Historical preservation + referential integrity |
| 8 | Per-student `note` + `note_updated_at` on GroupStudent | Fine-grained teacher observations |
| 9 | "Future" = `date > edited group's date` in same series | Explicit, deterministic |
| 10 | `created_by` separate from `teacher_id` | Future-proofing for admin scenarios |

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| `end_time` stored alongside `duration_minutes` (redundancy) | Index-friendly status transition and overlap queries | Runtime derivation is not indexable |
| Backend overlap validation (duplicates frontend check) | Frontend-only can be bypassed | Leads to unnoticed double-bookings |
| `created_by` separate from `teacher_id` | Future admin/audit scenarios | Losing audit trail later is harder to retrofit |
