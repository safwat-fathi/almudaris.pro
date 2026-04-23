# Implementation Plan: Homework Feature

**Branch**: `003-homework-feature` | **Date**: April 23, 2026 | **Spec**: [/specs/003-homework-feature/spec.md](/specs/003-homework-feature/spec.md)
**Input**: Feature specification from `/specs/003-homework-feature/spec.md`

## Summary

Implement a comprehensive homework management system allowing teachers to assign homework linked to sessions/groups and students to submit responses with attachments. The system features dynamic status computation (Submitted, Late, Missing), resubmission with versioning, and internal audit logging.

## Technical Context

**Language/Version**: TypeScript / Node.js (Latest stable)  
**Primary Dependencies**: NestJS (Backend), Next.js v16 App Router (Frontend), TypeORM, Zod, TailwindCSS, Zustand, Swagger  
**Storage**: PostgreSQL (using `SERIAL` for PKs, `jsonb` for attachment metadata and audit logs)  
**Testing**: `npm test` && `npm run lint`  
**Target Platform**: Web (Mobile-First, RTL Arabic support)
**Project Type**: Full-stack Web Application (Next.js + NestJS)  
**Performance Goals**: < 200ms API response time for submission lists  
**Constraints**: No client-side pages; Server-Driven UI only. Max 10MB per attachment (PDF, PNG, JPG).  
**Scale/Scope**: Support for thousands of students and assignments.

## Constitution Check

*GATE: Pass*

- **I. Simplicity**: Using bottom sheets and simple forms as mandated.
- **II. Action-Driven UX**: Status badges (🔴 لم يتم التقديم, 🟡 تم التقديم, 🟠 متأخر, ⚫ مفقود) follow the action-driven color palette.
- **III. Modern Design**: Using `ROUND_FULL` and Manrope typography.
- **IV. Robust API**: NestJS with Swagger and `SERIAL` PKs.
- **V. Server-Driven Frontend**: Next.js v16 with Server Actions and RSCs.

## Project Structure

### Documentation (this feature)

```text
specs/003-homework-feature/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── homework-api.md
└── tasks.md             # Phase 2 output (generated separately)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── homework/        # Homework module, controller, service
│   ├── submissions/     # Submissions module, controller, service
│   └── common/          # Shared types and status logic
└── tests/

frontend/
├── app/
│   ├── (student)/homework/ # Student homework views
│   ├── (teacher)/sessions/[id]/homework/ # Teacher management views
│   └── actions/         # Server Actions for submission
├── components/
│   ├── homework/        # Shared homework components
│   └── ui/              # Status badges and cards
└── services/
    ├── api/             # Backend API clients
    └── bff/             # Frontend-specific logic
```

**Structure Decision**: Option 2 (Web application) is used as the project already contains `backend/` and `frontend/` directories.

## Complexity Tracking

> **Constitution check passed with no violations.**
