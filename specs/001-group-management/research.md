# Research & Technical Decisions: Groups Management

## Decision 1: Group Status Management
- **Decision**: Group status (Scheduled, Completed, Cancelled) will be checked dynamically based on the group's end time relative to the current time, but teachers can explicitly manually mark a group as "Completed" early.
- **Rationale**: Meets FR-005 requirements without placing a mandatory manual burden on the teacher, adhering to the "Zero-Learning Curve" principle.
- **Alternatives considered**: Strictly manual state updates (rejected due to UX burden); strict background cron job state updates (overly complex for MVP).

## Decision 2: Recurring Groups Limits
- **Decision**: Hard limit of 24 instances per series creation.
- **Rationale**: Prevents database abuse and ensures instant creation without system timeouts (SC-004), while providing approximately 6 months of weekly planning.
- **Alternatives considered**: 52 instances or unlimited (rejected per clarification).

## Decision 3: Overlapping Groups Warning
- **Decision**: Soft warning implemented on the frontend during scheduling by querying existing groups before final submission or during form input.
- **Rationale**: Allows flexibility (FR-004) while preventing accidental double-booking, protecting data integrity.
- **Alternatives considered**: Hard block (rejected per business logic requirements).

## Decision 4: Testing Strategy
- **Decision**: Only manual testing and automated linting (`pnpm run lint`) will be performed.
- **Rationale**: Adheres strictly to the project's `AGENTS.md` mandate: "Do not write spec files at all."
- **Alternatives considered**: Automated unit/E2E testing (rejected per explicit repository rules).
