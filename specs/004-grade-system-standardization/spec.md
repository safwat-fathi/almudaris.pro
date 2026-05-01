# Feature Specification: Grade System Standardization

**Feature Branch**: `004-grade-system-standardization`  
**Created**: April 28, 2026  
**Status**: Draft  
**Input**: User description: "@grade-stage.md"

## Clarifications

### Session 2026-04-28
- Q: How exactly should the system handle un-mappable historical records during the automated data migration? → A: Use an explicit "Unassigned" enum for stage/grade and flag for manual review.
- Q: How should the system respond to invalid stage/year payloads from external integrations? → A: Reject the payload synchronously with a 400 Bad Request and descriptive validation error.
- Q: Where should the string formatting into the canonical Arabic label occur? → A: Backend formats the string and returns it in the API response (e.g., `grade_label`).
- Q: Can a group or session span multiple grades or stages simultaneously? → A: Strictly one stage and one year per Group/Session.
- Q: How should the migration script handle existing student records where the grade field is completely empty or null? → A: Treat as un-mappable: assign the "Unassigned" enum state and flag for review.
- Q: How should the database enforce valid grade-year ranges for each education stage? → A: Use a database CHECK constraint tying stage to allowed year ranges.
- Q: Should teachers be assigned full stage/year combinations or broader education stages? → A: Teachers are assigned one or more education stages only, such as Secondary or Secondary + Preparatory.
- Q: Should `frontend/components/homework/AddHomeWorkSheet.tsx` be included in the grade standardization work? → A: Yes; the add-homework sheet must submit and validate homework stage/year data consistently with the selected group and render canonical grade context where shown.

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

---

### User Story 4 - Teacher Stage Assignment and Group Targeting (Priority: P1)

As an administrator or teacher configuring teaching responsibilities, I want each teacher to be assigned at least one education stage and every group to have one specific stage and year, so that groups can only be created for grades the teacher is allowed to teach.

**Why this priority**: Teacher grade ownership controls which groups can be created and prevents scheduling or student assignment under the wrong education stage.

**Independent Test**: Can be fully tested by assigning a teacher to Secondary only, creating a Secondary Year 3 group successfully, and verifying that creating a Preparatory group for the same teacher is blocked.

**Acceptance Scenarios**:

1. **Given** a teacher profile with no assigned education stages, **When** the profile is saved, **Then** the system prevents saving and requires at least one stage.
2. **Given** a teacher assigned to Secondary only, **When** a group is created for that teacher, **Then** the group stage selector only allows Secondary and the year selector allows years 1 through 3.
3. **Given** a teacher assigned to Secondary and Preparatory, **When** a group is created for that teacher, **Then** the group stage selector allows both Secondary and Preparatory and each selected stage shows only valid years.
4. **Given** a group creation form, **When** the user attempts to save without selecting both stage and year, **Then** the system blocks saving and clearly identifies the missing fields.

### Edge Cases

- **Invalid External Integrations:** If an external system integration or API request attempts to send an invalid stage/year combination, the system will reject the payload synchronously with a 400 Bad Request and a descriptive validation error.
- **Data Migration Error Handling:** Historical records that do not neatly fit into the new stage/year structure will be assigned an explicit "Unassigned" enum for stage and grade, and flagged for manual review to prevent data pollution.
- **Teacher Stage Mismatch:** If a request attempts to create or update a group with a stage that is not assigned to the selected teacher, the system rejects the request with a clear validation error.
- **Teacher Without Stages:** If an existing teacher has no assigned stages during rollout, the teacher must be flagged for setup before they can create or manage groups.
- **Homework Sheet Missing Grade Context:** If the add-homework sheet is opened without enough group stage/year context, the system must prevent homework creation and show a clear error instead of creating homework with missing or mismatched targeting.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST record the student's education stage (Primary, Preparatory, Secondary) and their specific year/grade within that stage.
- **FR-002**: System MUST restrict Primary stage selections to years 1 through 6.
- **FR-003**: System MUST restrict Preparatory and Secondary stage selections to years 1 through 3.
- **FR-004**: System MUST prevent users from saving invalid stage and year combinations.
- **FR-005**: System MUST display the student's grade using the standardized Arabic format (e.g., "الصف الثالث الثانوي") across all user interfaces, by utilizing a formatted label provided by the backend API.
- **FR-006**: System MUST allow filtering of students, groups, sessions, and homework by education stage and specific year.
- **FR-007**: System MUST automatically convert all existing student grade records to the new standardized format without data loss.
- **FR-008**: System MUST enforce valid stage/year combinations at the database layer using a CHECK constraint: Primary permits years 1 through 6, while Preparatory and Secondary permit years 1 through 3.
- **FR-009**: System MUST require every teacher to be assigned at least one education stage.
- **FR-010**: System MUST allow every teacher to be assigned one or more education stages, such as Secondary only or Secondary and Preparatory.
- **FR-011**: System MUST require every group to have exactly one education stage and exactly one valid year before it can be saved.
- **FR-012**: System MUST prevent assigning a group to a stage that is not included in the selected teacher's assigned education stages.
- **FR-013**: System MUST limit group year selections to the valid range for the selected group stage.
- **FR-014**: System MUST ensure the add-homework sheet submits homework with the selected group's education stage and year, or blocks submission when that group grade context is unavailable.
- **FR-015**: System MUST ensure the add-homework sheet displays canonical Arabic grade context using backend-provided group/homework grade labels where grade context is shown.

### Key Entities

- **Student**: Represents the learner, including their specific education stage and year.
- **Teacher**: Represents the instructor, including one or more assigned education stages they are allowed to teach.
- **Group**: Represents a class cohort, which MUST be strictly restricted to a single specific stage and year.
- **Session**: Represents a scheduled class, which MUST be strictly targeted at a single specific stage and year.
- **Homework**: Assignments targeted to students of a specific stage and year.
- **Stage/Year Constraint**: Database constraint that rejects any stored stage/year combination outside the canonical Egyptian education ranges.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of newly created student profiles conform to the structured stage and year rules.
- **SC-002**: 100% of existing legacy grade data is successfully migrated to the new structure without data loss.
- **SC-003**: All user-facing interfaces display the canonical Arabic grade label format consistently, with 0 instances of raw numbers or English terms (e.g., "Grade 3", "3rd secondary").
- **SC-004**: System successfully blocks 100% of attempts to save invalid stage/year combinations.
- **SC-005**: 100% of teacher profiles have at least one assigned education stage before they can create or manage groups.
- **SC-006**: 100% of newly created groups include exactly one valid stage/year pair that belongs to the selected teacher's assigned stages.
- **SC-007**: 100% of homework created from the add-homework sheet is associated with a valid stage/year pair matching the selected group.

## Assumptions

- Existing students with un-mappable legacy grades will require manual review or be mapped to a safe default.
- The canonical formatting logic will be centralized to ensure consistency across all features.
- International systems (IG, American Diploma) are out of scope for this initial standardization phase.
- Teacher assignments are stage-level permissions, not exact stage/year permissions.
