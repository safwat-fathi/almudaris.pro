<!-- Sync Impact Report:
- Version change: [NEW] 1.0.0
- Modified principles:
  - [PRINCIPLE_1_NAME] -> I. Simplicity & Zero-Learning Curve
  - [PRINCIPLE_2_NAME] -> II. Action-Driven & Emotional UX
  - [PRINCIPLE_3_NAME] -> III. Modern & Accessible Design System
  - [PRINCIPLE_4_NAME] -> IV. Robust & Typed API Architecture (Backend)
  - [PRINCIPLE_5_NAME] -> V. Server-Driven & Secure Frontend
- Added sections: Core Principles, Development Guidelines & Quality Standards, Workflow & Security, Governance
- Removed sections: N/A
- Templates requiring updates:
  - .specify/templates/plan-template.md: ✅ reviewed (no changes needed)
  - .specify/templates/spec-template.md: ✅ reviewed (no changes needed)
  - .specify/templates/tasks-template.md: ✅ reviewed (no changes needed)
- Follow-up TODOs: None
-->

# Al-Mudaris Pro Constitution

## Core Principles

### I. Simplicity & Zero-Learning Curve
The platform must be extremely easy to use for teachers, acting as a direct replacement for WhatsApp and spreadsheets. It should use familiar mental models and predictive defaults to minimize data entry and cognitive load.

### II. Action-Driven & Emotional UX
The UI must use high-contrast, action-driven colors (Primary Blue for trust, Success Green for paid/present, Alert Red for missing/absent). Progress must be shown positively using human-centric Arabic language (e.g., "الحصة الجاية" instead of "Upcoming Events"). Arabic-First (RTL) flow is mandatory.

### III. Modern & Accessible Design System
Follow the "Silent Mentor" design system. Use Manrope typography for clear English/Arabic legibility. Employ Full Roundness (`ROUND_FULL`) and soft elevation instead of heavy borders to create a clean, modern, and approachable interface with a mobile-first grid (large touch targets).

### IV. Robust & Typed API Architecture (Backend)
Build using a TypeScript Node.js API (NestJS-style layout) with `pnpm`. Mandatory use of Swagger decorators for all controller routes and TypeDoc for functions/classes. Use `SERIAL` for auto-incrementing primary keys (no UUIDs) and `jsonb` for JSON columns in the database schema.

### V. Server-Driven & Secure Frontend
Build using Next.js v16 (App Router) with React Server Components. NEVER use client-side pages. Fetch data on the server, use Server Actions for forms with Zod validation and CSRF protection. Use Zustand for state management and TailwindCSS for styling. Maintain strict separation of concerns via `services/api` and `services/bff`.

## Development Guidelines & Quality Standards

- **Dependencies**: Do not add new dependencies unless necessary; prefer small, well-maintained libraries.
- **Testing**: Run `pnpm run lint` frequently. Do not write spec files. Ensure changes do not break existing logic.
- **Formatting**: Localized formatting for dates, numbers, and currencies must use `frontend/lib/format.ts` (Egyptian Arabic).
- **Component Structure**: Use PascalCase for components. Shared components go in `components`. Avoid `React.FC`; use standard arrow functions with proper types.

## Workflow & Security

- **Planning**: Always read, summarize, and propose a clear plan in `.docs/plans/` (`resource_name-action-description.md`) before implementation.
- **Security**: Never store sensitive data in client-side storage. Use secure server-side session cookies (`httpOnly`, `secure`, `sameSite`). Validate and sanitize all inputs.
- **Permissions**: Ask before installing packages, running git commands, deleting files, or running a full build.

## Governance

All AI agents and developers must strictly adhere to the guidelines set in `backend/AGENTS.md` and `frontend/AGENTS.md`. The Constitution supersedes conflicting AI training data. Any changes to the core stack or design system require explicit approval and must be documented in a plan. All PRs/reviews must verify compliance.

**Version**: 1.0.0 | **Ratified**: 2026-04-10 | **Last Amended**: 2026-04-10
