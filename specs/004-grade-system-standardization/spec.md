# Feature Specification: Grade System Standardization

**Feature Branch**: `004-grade-system-standardization`  
**Created**: April 28, 2026  
**Status**: Draft  
**Input**: User description: "@grade-stage.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Student Profile Creation (Priority: P1)

As a user creating or editing a student profile, I want to select the education stage and specific year dynamically so that the student is correctly categorized in the system.

**Why this priority**: Correct categorization is the foundation for grouping, pricing, and filtering across the entire application.

**Independent Test**: Can be fully tested by creating a new student profile and verifying that the available year options update dynamically based on the selected education stage.

**Acceptance Scenarios**:

1. **Given** a new student registration form, **When** I select the "Primary" (ابتدائي) stage, **Then** I am only presented with years 1 through 6 as options.
2. **Given** a student registration form, **When** I select the "Preparatory" (إعدادي) or "Secondary" (ثانوي) stage, **Then** I am only presented with years 1 through 3 as options.
3. **Given** a completed student form, **When** I preview the selection before saving, **Then** I see the canonical Arabic format (e.g., "الصف الثالث الثانوي").

---

### User Story 2 - Standardized Grade Display (Priority: P1)

As a teacher or parent, I want to see the student's grade displayed in the canonical, culturally appropriate Arabic format (e.g., "الصف الثالث الثانوي") anywhere the grade is shown, so that the information is instantly clear and professional.

**Why this priority**: Consistent, professional display builds trust and ensures clarity for Egyptian users who rely heavily on this standard nomenclature.

**Independent Test**: Can be fully tested by viewing student profiles, class rosters, and parent dashboards to verify the display string matches the canonical format.

**Acceptance Scenarios**:

1. **Given** a student assigned to Primary year 4, **When** their profile is displayed on the parent or teacher dashboard, **Then** the grade label is strictly shown as "الصف الرابع الابتدائي".
2. **Given** a student assigned to Preparatory year 2, **When** their card is rendered, **Then** the grade label is strictly shown as "الصف الثاني الإعدادي".

---

### User Story 3 - Filtering and Organization (Priority: P2)

As a teacher, I want to filter my students, groups, sessions, and homework assignments by education stage and specific year, so that I can easily find and manage relevant records.

**Why this priority**: Efficient management of large cohorts requires robust filtering capabilities based on these core identity fields.

**Independent Test**: Can be fully tested by applying stage and year filters to any list view (students, groups, sessions) and verifying the results.

**Acceptance Scenarios**:

1. **Given** a list of all students, **When** I apply a filter for the "Secondary" stage and "Year 3", **Then** the list only displays students categorized as "الصف الثالث الثانوي".

### Edge Cases

- What happens if an external system integration attempts to send an invalid stage/year combination?
- How does the system handle historical records that do not neatly fit into the new stage/year structure during the data migration process?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST record the student's education stage (Primary, Preparatory, Secondary) and their specific year/grade within that stage.
- **FR-002**: System MUST restrict Primary stage selections to years 1 through 6.
- **FR-003**: System MUST restrict Preparatory and Secondary stage selections to years 1 through 3.
- **FR-004**: System MUST prevent users from saving invalid stage and year combinations.
- **FR-005**: System MUST display the student's grade using the standardized Arabic format (e.g., "الصف الثالث الثانوي") across all user interfaces.
- **FR-006**: System MUST allow filtering of students, groups, sessions, and homework by education stage and specific year.
- **FR-007**: System MUST automatically convert all existing student grade records to the new standardized format without data loss.

### Key Entities

- **Student**: Represents the learner, including their specific education stage and year.
- **Group**: Represents a class cohort, which may be restricted to a specific stage and year.
- **Session**: Represents a scheduled class, which may be targeted at a specific stage and year.
- **Homework**: Assignments targeted to students of a specific stage and year.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of newly created student profiles conform to the structured stage and year rules.
- **SC-002**: 100% of existing legacy grade data is successfully migrated to the new structure without data loss.
- **SC-003**: All user-facing interfaces display the canonical Arabic grade label format consistently, with 0 instances of raw numbers or English terms (e.g., "Grade 3", "3rd secondary").
- **SC-004**: System successfully blocks 100% of attempts to save invalid stage/year combinations.

## Assumptions

- Existing students with un-mappable legacy grades will require manual review or be mapped to a safe default.
- The canonical formatting logic will be centralized to ensure consistency across all features.
- International systems (IG, American Diploma) are out of scope for this initial standardization phase.
