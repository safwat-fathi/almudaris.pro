# Implementation Plan: Grade System Standardization

**Branch**: `004-grade-system-standardization` | **Date**: April 28, 2026 | **Spec**: [/specs/004-grade-system-standardization/spec.md](/specs/004-grade-system-standardization/spec.md)
**Input**: Feature specification from `/specs/004-grade-system-standardization/spec.md`

## Summary

Standardize education-stage and year handling across students, groups, sessions, and homework by introducing canonical structured fields, backend-owned Arabic labels, API validation, database CHECK constraints, and a safe migration path for legacy grade values. The implementation keeps the backend as the source of truth for validation and display labels while the frontend renders server-provided labels and offers stage-aware year selection.

## Technical Context

**Language/Version**: TypeScript 5.7 backend, TypeScript 5 with Next.js 16.2 frontend  
**Primary Dependencies**: NestJS 11, TypeORM 0.3, PostgreSQL, class-validator, Swagger, Next.js 16 App Router, React 19, Zod, TailwindCSS  
**Storage**: PostgreSQL with `SERIAL` primary keys, TypeORM migrations, enum/text stage columns, integer year columns, and CHECK constraints  
**Testing**: `pnpm run lint:ci` in `backend`, `pnpm run lint` in `frontend`; no new spec files per repository rules  
**Target Platform**: Full-stack web application for Arabic-first Egyptian education workflows  
**Project Type**: Web application with NestJS API and Next.js App Router frontend  
**Performance Goals**: Filtering by stage/year should remain index-backed and avoid visible list latency for normal teacher cohorts  
**Constraints**: Backend must format `grade_label`; invalid external payloads must synchronously return 400; groups/sessions/homework target exactly one stage and one year; un-mappable legacy grades use explicit `UNASSIGNED` values and manual-review flags  
**Scale/Scope**: Existing student, group/session, and homework flows plus dashboards and filters that display or query grade data

## Analysis Notes

- **MEDIUM**: The constitution explicitly mandates using Zod validation for frontend forms, but Task T017 describes updating Server Action validation without referencing Zod. Ensure frontend implementation uses Zod for the stage/year fields.

## Constitution Check

*GATE: Pass*

- **I. Simplicity & Zero-Learning Curve**: Stage/year selectors replace free-form grade entry and mirror familiar Egyptian school-stage terminology.
- **II. Action-Driven & Emotional UX**: Arabic labels are human-readable and consistent; manual-review states are explicit instead of silently coercing data.
- **III. Modern & Accessible Design System**: Frontend work must preserve mobile-first RTL layouts, large touch targets, Manrope typography, and existing Tailwind patterns.
- **IV. Robust & Typed API Architecture**: Backend owns validation, Swagger-documented DTOs, TypeORM schema constraints, and TypeDoc for new helpers/classes.
- **V. Server-Driven & Secure Frontend**: Next.js pages remain server-driven, forms use Server Actions/Zod/CSRF where applicable, and UI consumes backend-provided `grade_label`.

No constitution violations are required. Re-check after Phase 1 design: pass, because contracts and data model keep formatting and validation centralized on the backend and preserve server-driven frontend access patterns.

## Project Structure

### Documentation (this feature)

```text
specs/004-grade-system-standardization/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── grade-system-api.md
└── tasks.md             # Phase 2 output, generated separately by /speckit.tasks
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── children/        # Student/child DTOs, entities, service responses, filters
│   ├── groups/          # Group/session stage-year targeting and filters
│   ├── homework/        # Homework target stage/year filters and responses
│   ├── common/          # Shared grade constants, validation, and Arabic label formatting
│   └── migrations/      # Schema/data migration for structured grade fields and constraints
└── test/                # Existing e2e/security tests only if future task requires updates

frontend/
├── app/
│   ├── (student)/       # Parent/student dashboard grade displays
│   ├── (teacher)/       # Student, group/session, and homework filters/displays
│   └── actions/         # Server Actions for stage/year forms
├── components/          # Shared grade selector/filter/display components if reused
├── services/
│   ├── api/             # Typed backend API clients
│   └── bff/             # Server-side composition for list filters and dashboards
└── types/               # Shared frontend models for stage/year API responses
```

**Structure Decision**: Use the existing full-stack web application structure with backend changes under `backend/src` and frontend changes under `frontend/app`, `frontend/components`, `frontend/services`, and `frontend/types`.

## Complexity Tracking

> **Constitution check passed with no violations.**
