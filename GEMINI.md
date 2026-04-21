# al-mudaris-pro Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-04-20

## Active Technologies
- TypeScript Node.js, Next.js v16 (Frontend), NestJS (Backend) + React Server Components, Zustand, TailwindCSS, Zod, TypeORM/pg, Swagger (001-groups-invitations-management)
- PostgreSQL (using `SERIAL` for PKs, `jsonb` for JSON) (001-groups-invitations-management)

- TypeScript (Node.js) + NestJS (Backend), Next.js v16 (Frontend, App Router), TailwindCSS, Zustand, Zod, TypeORM/pg (001-groups-management)
- Nextjs current version (v16.0.3) uses proxy.ts as middleware not middleware.ts

## Project Structure

```text
backend/
frontend/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript (Node.js): Follow standard conventions

## Recent Changes
- 001-groups-invitations-management: Added TypeScript Node.js, Next.js v16 (Frontend), NestJS (Backend) + React Server Components, Zustand, TailwindCSS, Zod, TypeORM/pg, Swagger

- 001-groups-management: Added TypeScript (Node.js) + NestJS (Backend), Next.js v16 (Frontend, App Router), TailwindCSS, Zustand, Zod, TypeORM/pg

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->

## Plans
- Always plan before implementing any feature.
- store plan in .md format in .docs/plans/ folder
- plan name should be in format: YYYY-MM-DD-feature-name.md
- plan should include: objective, key files, implementation steps in phases, verification & testing, cleanup