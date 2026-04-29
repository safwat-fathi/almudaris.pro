# Data Model: Grade System Standardization

## EducationStage

Canonical stage enum used across students, teachers, groups, sessions, and homework.

### Values

- `PRIMARY`: Egyptian primary stage, years 1 through 6.
- `PREPARATORY`: Egyptian preparatory stage, years 1 through 3.
- `SECONDARY`: Egyptian secondary stage, years 1 through 3.
- `UNASSIGNED`: Migration/manual-review state, year 0 only.

### Validation Rules

- `PRIMARY` permits `education_year` 1-6.
- `PREPARATORY` permits `education_year` 1-3.
- `SECONDARY` permits `education_year` 1-3.
- `UNASSIGNED` permits `education_year` 0 only.
- User-facing creation flows should not expose `UNASSIGNED` as a normal selectable grade.

## Student

Represents a learner.

### Fields

- `education_stage`: One `EducationStage` value.
- `education_year`: Integer year within the selected stage.
- `grade_label`: Canonical Arabic label returned by backend responses.
- `legacy_grade`: Preserved historical raw grade value, when one existed.
- `grade_needs_review`: Boolean marker for un-mappable or manually reviewed legacy data.

### Relationships

- Students can be filtered by `education_stage` and `education_year`.
- Students can be assigned to groups matching their stage/year according to existing business rules.

## Teacher

Represents an instructor and their allowed education stages.

### Fields

- `assigned_stages`: One or more `EducationStage` values excluding `UNASSIGNED` for normal active teachers.

### Validation Rules

- A teacher must have at least one assigned education stage before creating or managing groups.
- A teacher may be assigned multiple stages, such as `SECONDARY` and `PREPARATORY`.
- Group creation/update must reject any stage not included in the teacher's `assigned_stages`.

## Group

Represents a class cohort.

### Fields

- `teacher_id`: Teacher responsible for the group.
- `education_stage`: Exactly one `EducationStage` value.
- `education_year`: Exactly one valid year for the selected stage.
- `grade_label`: Canonical Arabic label returned by backend responses.

### Validation Rules

- A group must have both stage and year before save.
- A group cannot span multiple stages or years.
- A group stage must be included in the selected teacher's `assigned_stages`.
- `UNASSIGNED` is allowed only for migration/manual-review records, not normal group creation.

## Session

Represents a scheduled class.

### Fields

- `group_id`: Owning group.
- `education_stage`: Derived from the owning group unless existing implementation requires explicit persistence.
- `education_year`: Derived from the owning group unless existing implementation requires explicit persistence.
- `grade_label`: Canonical Arabic label from the derived or persisted stage/year.

### Validation Rules

- A session is strictly targeted to one stage/year.
- If a session derives stage/year from Group, it must not independently diverge from the Group.

## Homework

Represents assignments targeted to a specific stage/year.

### Fields

- `education_stage`: Exactly one `EducationStage` value.
- `education_year`: Exactly one valid year for the selected stage.
- `grade_label`: Canonical Arabic label returned by backend responses.

### Validation Rules

- Homework can be filtered by stage/year.
- Homework must reject invalid stage/year combinations.
- Existing unmappable homework records use `UNASSIGNED` and year 0 during migration.

## Stage/Year Constraint

Database-level rule enforcing the canonical stage/year matrix.

### Rules

- `(PRIMARY, 1-6)` is valid.
- `(PREPARATORY, 1-3)` is valid.
- `(SECONDARY, 1-3)` is valid.
- `(UNASSIGNED, 0)` is valid only for migration/manual-review data.
- All other pairs are invalid.

## State Transitions

- Legacy raw grade → mapped canonical stage/year when confidently recognized.
- Legacy raw grade → `UNASSIGNED`, year 0, review flag true when not confidently recognized.
- Teacher without assigned stages → setup required → active for group creation once at least one stage is assigned.
- Group without stage/year during migration → `UNASSIGNED`, year 0 → manually reviewed into a canonical stage/year.
