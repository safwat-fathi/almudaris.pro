# Implementation Plan: Groups Management

**Branch**: `002-parent-invitations` | **Date**: 2026-04-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-group-management/spec.md`

## Summary

The platform requires a core "Groups" feature where teachers can schedule teaching events (individual or group, online or physical). Teachers can create, edit (upcoming groups), cancel, and manage recurring groups, as well as record attendance and notes for completed groups. The system strictly preserves the historical accuracy of completed groups by preventing structural changes.

## Technical Context

**Language/Version**: TypeScript (Node.js)  
**Primary Dependencies**: NestJS (Backend), Next.js v16 (Frontend, App Router), TailwindCSS, Zustand, Zod, TypeORM/pg  
**Storage**: PostgreSQL (using SERIAL for PKs and jsonb)  
**Testing**: Linting only (`pnpm run lint`). No automated spec/test files allowed.  
**Target Platform**: Web browsers (Mobile-first, Arabic RTL)  
**Project Type**: Web application (Frontend + Backend)  
**Performance Goals**: Fast UI response; attendance marking < 3 seconds.  
**Constraints**: Server-Driven frontend (no client-side pages), strict separation of API and BFF, cookies for auth.  
**Scale/Scope**: MVP for private tutors in Egypt. Limit of 24 instances per recurring series.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Simplicity & Zero-Learning Curve**: Passes. UI uses predictive defaults and familiar models.
- **Action-Driven & Emotional UX**: Passes. Uses specific color coding (Primary Blue, Success Green, Alert Red) and RTL Arabic flow.
- **Modern & Accessible Design System**: Passes. Uses Manrope font, ROUND_FULL shapes, and mobile-first grids.
- **Robust & Typed API Architecture**: Passes. Uses NestJS, Swagger decorators, TypeDoc, and SERIAL keys.
- **Server-Driven & Secure Frontend**: Passes. Uses Next.js App Router, Server Actions, and CSRF tokens. No client-side pages.

## Project Structure

### Documentation (this feature)

```text
specs/001-group-management/
├── plan.md              
├── research.md          
├── data-model.md        
├── quickstart.md        
├── contracts/           
└── tasks.md             
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── groups/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── controllers/
│   │   └── services/

frontend/
├── app/
│   ├── (teacher)/
│   │   └── groups/
├── components/
│   └── groups/
└── services/
    ├── api/
    └── bff/
```

**Structure Decision**: Web application (backend/frontend split) following the required NestJS module structure on the backend and Next.js App Router strictly server-driven structure on the frontend.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
