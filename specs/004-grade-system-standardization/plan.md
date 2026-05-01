# Implementation Plan: Grade System Standardization

**Branch**: `006-teacher-grade-assignment` | **Date**: April 29, 2026 | **Spec**: [/specs/004-grade-system-standardization/spec.md](/specs/004-grade-system-standardization/spec.md)
**Input**: Feature specification from `/specs/004-grade-system-standardization/spec.md`

## Summary

Standardize education stage/year handling across students, teachers, groups, sessions, and homework. The backend remains the source of truth for valid stage/year rules, canonical Arabic grade labels, migration handling, teacher stage permissions, and validation errors. The frontend renders server-provided labels, uses stage-aware selectors, and restricts group creation to stages assigned to the selected teacher.

## Technical Context

**Language/Version**: TypeScript 5.7 backend, TypeScript 5 with Next.js 16.2 frontend  
**Primary Dependencies**: NestJS 11, TypeORM 0.3, PostgreSQL, class-validator, Swagger, Next.js 16 App Router, React 19, Zod, TailwindCSS  
**Storage**: PostgreSQL with `SERIAL` primary keys, TypeORM migrations, enum/text stage columns, integer year columns, `jsonb` for JSON-compatible arrays such as teacher `assigned_stages` when not normalized, and CHECK constraints  
**Testing**: `pnpm run lint:ci` in `backend`, `pnpm run lint` in `frontend`; no new spec files per repository rules  
**Target Platform**: Full-stack web application for Arabic-first Egyptian education workflows  
**Project Type**: Web application with NestJS API and Next.js App Router frontend  
**Performance Goals**: Stage/year filtering and teacher group-stage validation should remain index-backed where persisted fields are queried and avoid visible list latency for normal teacher cohorts  
**Constraints**: Backend formats `grade_label`; invalid stage/year payloads synchronously return 400; groups/sessions/homework target exactly one stage and one year; teachers must have at least one assigned stage; teacher `assigned_stages` must use `jsonb` if stored as a JSON-compatible array; groups may only use stages assigned to their teacher; un-mappable legacy grades use explicit `UNASSIGNED` values and manual-review flags  
**Scale/Scope**: Existing student creation/editing, teacher assignment, group/session, homework flows, dashboards, filters, migrations, and API contracts that display or query grade data

## Constitution Check

*GATE: Pass*

- **I. Simplicity & Zero-Learning Curve**: Stage/year selectors replace free-form grade entry and teacher permissions are assigned using familiar broad stages such as Secondary or Preparatory.
- **II. Action-Driven & Emotional UX**: Arabic labels remain canonical and human-readable; invalid combinations and teacher-stage mismatches surface as clear validation errors.
- **III. Modern & Accessible Design System**: Frontend work must preserve mobile-first RTL layouts, large touch targets, Manrope typography, and existing Tailwind patterns.
- **IV. Robust & Typed API Architecture**: Backend owns validation, Swagger-documented DTOs, TypeORM schema constraints, and TypeDoc for exported helpers/classes. Any JSON-compatible storage for teacher `assigned_stages` must use PostgreSQL `jsonb`; normalized relational storage remains acceptable if it matches existing schema patterns.
- **V. Server-Driven & Secure Frontend**: Next.js pages remain server-driven, forms use Server Actions with Zod validation and CSRF protection, and UI consumes backend-provided `grade_label`.

No constitution violations are required. Re-check after Phase 1 design: pass, because contracts and data model keep formatting and validation centralized on the backend, preserve server-driven frontend access patterns, and avoid adding dependencies.

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
│   ├── teachers/        # Teacher assigned education stages and setup validation
│   ├── groups/          # Group/session stage-year targeting, teacher-stage validation, filters
│   ├── homework/        # Homework target stage/year filters and responses
│   ├── common/          # Shared grade constants, validation, and Arabic label formatting
│   └── migrations/      # Schema/data migration for structured grade fields and constraints

frontend/
├── app/
│   ├── (student)/       # Parent/student dashboard grade displays
│   ├── (teacher)/       # Student, group/session, homework filters/displays
│   └── actions/         # Server Actions for stage/year forms
├── components/          # Shared grade selector/filter/display components if reused
├── services/
│   ├── api/             # Typed backend API clients
│   └── bff/             # Server-side composition for list filters and dashboards
└── types/               # Shared frontend models for stage/year API responses
```

**Structure Decision**: Use the existing full-stack application layout with backend changes under `backend/src` and frontend changes under `frontend/app`, `frontend/components`, `frontend/services`, and `frontend/types`.

## Complexity Tracking

> **Constitution check passed with no violations.**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
