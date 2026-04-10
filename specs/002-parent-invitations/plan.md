# Implementation Plan: Parent Invitations

**Branch**: `002-parent-invitations` | **Date**: 2026-04-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-parent-invitations/spec.md`

## Summary

Implement a parent invitation system where teachers can share a unique link (or QR code) to parents. Upon registering or authenticating, the parent is linked to the teacher. The parent can then enroll existing internal student accounts or create new child profiles directly attached to the linking teacher.

## Technical Context

**Language/Version**: TypeScript (Node.js and Next.js)
**Primary Dependencies**: Next.js v16 (App Router), NestJS-style backend, TypeORM (PostgreSQL), Zustand, TailwindCSS, Zod
**Storage**: PostgreSQL (`SERIAL` primary keys)
**Testing**: Standard project testing framework
**Target Platform**: Web Browsers
**Project Type**: Web Application
**Performance Goals**: N/A (Standard load)
**Constraints**: Secure, strictly server-side rendered pages for data, Server Actions for forms.
**Scale/Scope**: 3 core flows (Teacher Share, Parent Accept Link, Parent Add/Enroll Student)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*
- **Simplicity & UX**: Minimal form fields, action-driven positive flow.
- **Accessible Design System**: Manrope typography, ROUND_FULL corners, soft elevations.
- **Backend Architecture**: Swagger documented API endpoints, Typed functions, TypeORM models using `SERIAL`.
- **Frontend Architecture**: Server Components (no "use client" pages), Zod validation, Server Actions, strict BFF separation.

Status: **PASS**. Implementation aligns perfectly with platform guidelines.

## Project Structure

### Documentation (this feature)

```text
specs/002-parent-invitations/
├── plan.md              
├── research.md          
├── data-model.md        
├── quickstart.md        
└── contracts/           
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── modules/
│   │   ├── teachers/     # Expose invite code generation/retrieval
│   │   ├── parents/      # Handle parent-teacher linking 
│   │   └── students/     # Handle student creation and enrollment
│   └── api/
└── tests/

frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/invite/[code]/page.tsx      # Invitation landing page (RSC)
│   │   └── parent/students/new/page.tsx       # Student assignment forms (RSC)
│   ├── components/
│   │   └── invite/
│   └── services/
└── tests/
```

**Structure Decision**: Option 2 (Web application). The feature touches both backend endpoints for associations/codes and frontend pages for handling the flows.

## Complexity Tracking

*No violations detected.*
