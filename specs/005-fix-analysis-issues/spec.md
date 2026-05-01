# Feature Specification: Resolve Grade System Analysis Issues

**Feature Branch**: `005-fix-analysis-issues`  
**Created**: April 28, 2026  
**Status**: Draft  
**Input**: User description: "introduce a solution for the found issues in feature Analysis"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Graceful Legacy Data Migration (Priority: P1)

As a system administrator or developer running the database migration, I want the system to safely map all existing un-mappable student, group, and homework records to an "Unassigned" state with valid database constraints, so that the migration completes successfully without data loss or constraint violations.

**Why this priority**: Without this, the database migration will fail due to check constraint violations, blocking the deployment of the grade standardization feature.

**Independent Test**: Can be fully tested by inserting legacy un-mappable grade strings into a test database, running the migration, and verifying that the records are assigned the "Unassigned" enum with year 0, and no check constraint errors are thrown.

**Acceptance Scenarios**:

1. **Given** a student record with an un-mappable legacy grade string, **When** the database migration runs, **Then** the student's stage is set to "UNASSIGNED", year to 0, and needs review flag is true.
2. **Given** existing group and homework records with no stage/year defined, **When** the migration runs, **Then** they are updated to "UNASSIGNED" and year 0 to satisfy the new constraints.
3. **Given** the new CHECK constraints are applied, **When** a record with stage "UNASSIGNED" and year 0 is inserted, **Then** the database accepts the record.

---

### User Story 2 - Complete Data Validation (Priority: P2)

As a user interacting with the frontend forms, I want my input to be rigorously validated using Zod schemas on both the client and server, so that I receive immediate, helpful feedback on invalid stage/year combinations.

**Why this priority**: Constitution mandates Zod validation for forms, and missing this creates a security and UX gap.

**Independent Test**: Can be fully tested by attempting to submit an invalid stage/year combination via the frontend form and observing the Zod validation error.

**Acceptance Scenarios**:

1. **Given** a frontend form for student creation, **When** I bypass client-side UI restrictions and submit an invalid stage/year pair, **Then** the Server Action rejects the payload using a Zod schema validation error.

---

### User Story 3 - Entity and Workflow Clarification (Priority: P3)

As a developer maintaining the system, I want clear definitions for how Sessions relate to Groups regarding stage/year data, and a compliant documentation workflow, so that future development is consistent.

**Why this priority**: Resolves ambiguity in the current architecture and aligns the project with its Constitution.

**Independent Test**: Verified through code review ensuring Session entities properly inherit or define their stage/year, and documentation is placed in compliant directories.

**Acceptance Scenarios**:

1. **Given** a Session linked to a Group, **When** stage/year queries are made, **Then** the system correctly identifies the Session's target audience based on the defined relationship.

### Edge Cases

- What happens if a legacy record has a valid grade string but is malformed? (Should be caught by mapping logic or default to UNASSIGNED).
- How do we handle existing Zod schemas that might need to be extended with the new fields without breaking other integrations?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow "UNASSIGNED" as a valid `education_stage` with `education_year = 0` in the database CHECK constraints for students, groups, and homework.
- **FR-002**: System MUST include explicit data mapping logic in the migration script to convert recognized legacy grade strings to their proper enum/year combinations.
- **FR-003**: System MUST update existing group and homework records during migration to default to `education_stage = UNASSIGNED` and `education_year = 0` if no clear mapping is possible.
- **FR-004**: System MUST use Zod schemas in all frontend Server Actions handling `education_stage` and `education_year` to validate the inputs.
- **FR-005**: The Session entity MUST [NEEDS CLARIFICATION: Session Entity Design - Does the Session entity need its own database columns for stage/year, or does it derive them exclusively via relation from its parent Group?]
- **FR-006**: The documentation workflow MUST [NEEDS CLARIFICATION: Documentation Location - Should we update the Constitution to allow specs in `specs/`, or configure SpecKit/tooling to output plans to `.docs/plans/`?]

### Key Entities

- **Legacy Data Mapper**: Logic responsible for evaluating legacy grade text and outputting a structured stage/year tuple.
- **Group/Homework**: Existing entities that must receive default migration values.
- **Session**: Entity whose relationship to stage/year needs clarification.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Database migration completes successfully on production-equivalent data with 0 constraint violations.
- **SC-002**: 100% of frontend forms updating stage/year utilize Zod validation.
- **SC-003**: 0 ambiguity remains regarding the Session entity's database schema.
- **SC-004**: All project documentation and workflows are 100% compliant with the agreed-upon directory structure.

## Assumptions

- We assume legacy grade text that exactly matches new labels can be cleanly migrated, while anything ambiguous defaults to UNASSIGNED.
- We assume Zod schemas can be easily integrated into the existing Next.js Server Actions without major refactoring.
