# Research: Grade System Standardization

## Decision: Backend-Owned Canonical Grade Model

- **Decision**: Represent grade identity with `education_stage` and `education_year`, and expose a derived `grade_label` from the backend.
- **Rationale**: The spec requires one canonical Arabic label everywhere and explicitly says formatting belongs in API responses. Centralizing this avoids duplicated translation/ordinal logic across Next.js pages, server actions, and external integrations.
- **Alternatives considered**: Frontend label formatting was rejected because it risks inconsistent labels; storing only the final Arabic label was rejected because filtering and validation need structured fields.

## Decision: Explicit Unassigned State For Migration Failures

- **Decision**: Use explicit unassigned values for legacy records that cannot map cleanly, plus a boolean/manual-review marker and optional raw legacy grade preservation.
- **Rationale**: This satisfies the clarified migration behavior while preventing invalid or guessed data from polluting filters and reports.
- **Alternatives considered**: Rejecting migration rows was rejected because the requirement says no data loss; guessing nearest grade was rejected because it can misclassify students.

## Decision: Database CHECK Constraint For Valid Stage/Year Ranges

- **Decision**: Enforce valid combinations in PostgreSQL with a CHECK constraint: Primary years 1-6, Preparatory/Secondary years 1-3, and Unassigned paired only with an unassigned year/sentinel value.
- **Rationale**: Application validation alone cannot protect direct database writes, migrations, or future integrations. A CHECK constraint directly satisfies FR-008.
- **Alternatives considered**: Lookup table normalization was rejected for the initial phase because the valid set is tiny and static; frontend-only validation was rejected because external API payloads must be blocked synchronously by the backend.

## Decision: Shared Backend Grade Utility

- **Decision**: Add a small shared backend utility/constant module for stage values, valid years, validation, and Arabic label formatting.
- **Rationale**: Students, groups/sessions, and homework all need identical rules. A small utility keeps behavior centralized without introducing a new dependency.
- **Alternatives considered**: Per-module duplicated validators were rejected due to drift risk; a new package/library was rejected because repository guidelines discourage unnecessary dependencies.

## Decision: Server-Driven Frontend Selectors And Filters

- **Decision**: Frontend forms should submit structured stage/year values through Server Actions or server-rendered query params, then render backend-provided `grade_label` in cards, tables, and dashboards.
- **Rationale**: This matches the constitution's server-driven frontend rule and keeps external-visible behavior tied to API responses.
- **Alternatives considered**: Client-side page state as the source of truth was rejected because client-side pages are prohibited; client-only filters were rejected because backend list endpoints need authoritative filtering.

## Decision: No New Dependencies

- **Decision**: Use existing NestJS, TypeORM, class-validator, Swagger, Next.js, Zod, and Tailwind tooling.
- **Rationale**: The problem is domain validation and schema evolution; existing stack covers it fully.
- **Alternatives considered**: Adding i18n or validation libraries was rejected as unnecessary for a fixed Egyptian Arabic grade vocabulary.
