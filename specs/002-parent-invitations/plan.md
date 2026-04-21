# Implementation Plan: Parent Invitations

**Branch**: `002-parent-invitations` | **Date**: 2026-04-20 | **Spec**: [specs/002-parent-invitations/spec.md](spec.md)
**Input**: Feature specification from `/specs/002-parent-invitations/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implement a parent invitation system where teachers can share a unique link/QR code. Parents use this link to register/login and automatically establish a linked connection with the teacher. Parents can then create student profiles and assign them to any of their linked teachers. The system uses a unified navigation space for parents and students, with stateful intent preserved across authentication boundaries.

## Technical Context

**Language/Version**: TypeScript Node.js, Next.js v16 (Frontend), NestJS (Backend)  
**Primary Dependencies**: React Server Components, Zustand, TailwindCSS, Zod, TypeORM/pg, Swagger  
**Storage**: PostgreSQL (using `SERIAL` for PKs, `jsonb` for JSON)  
**Testing**: `pnpm run lint`  
**Target Platform**: Web (Mobile-first grid, Full Roundness, Arabic-First RTL)  
**Project Type**: web-service  
**Performance Goals**: N/A  
**Constraints**: Strict root path (`/`) semantics for Teacher; Unified `/dashboard` for Parents/Students; Secure server-side session cookies; State intent carried via URL params (`?inviteCode=...`).  
**Scale/Scope**: N/A

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Simplicity & Zero-Learning Curve**: Avoid fragmentation; use a unified routing space for parents/students.
- **Action-Driven & Emotional UX**: High-contrast, action-driven colors. Human-centric Arabic language. Arabic-First (RTL) flow.
- **Modern & Accessible Design System**: Follow "Silent Mentor" (Manrope, `ROUND_FULL`, soft elevation). Native Arabic localization.
- **Robust & Typed API Architecture (Backend)**: NestJS, Swagger decorators, TypeDoc, `SERIAL` primary keys.
- **Server-Driven & Secure Frontend**: Next.js App Router, Server Components, Server Actions for forms (Zod + CSRF). Strict separation of `services/api` and `services/bff`. No client-side pages.

## Project Structure

### Documentation (this feature)

```text
specs/002-parent-invitations/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── auth/
│   ├── common/
│   ├── config/
│   ├── parents/
│   ├── students/
│   ├── teachers/
│   ├── invitations/
│   ├── types/
│   └── users/
└── tests/

frontend/
├── app/
│   ├── (auth)/
│   ├── dashboard/
│   ├── invite/
│   ├── landing/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/
│   ├── invite/
│   ├── layout/
│   ├── students/
│   └── ui/
├── lib/
│   ├── constants.ts
│   └── format.ts
├── services/
│   ├── api/
│   └── base/
└── types/
```

**Structure Decision**: Option 2: Web application (Frontend + Backend). The project already uses this split structure. New modules (`invitations`, `dashboard`) will be added to the existing structure.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
