# Data Model: Grade System Standardization

## Shared Grade Concepts

### EducationStage

Represents the canonical stage bucket for Egyptian education levels.

| Value | Arabic Display | Allowed Years |
|-------|----------------|---------------|
| `PRIMARY` | الابتدائي | 1-6 |
| `PREPARATORY` | الإعدادي | 1-3 |
| `SECONDARY` | الثانوي | 1-3 |
| `UNASSIGNED` | غير محدد | unassigned sentinel only |

### EducationYear

Integer year within the selected stage.

| Value | Arabic Ordinal |
|-------|----------------|
| `1` | الأول |
| `2` | الثاني |
| `3` | الثالث |
| `4` | الرابع |
| `5` | الخامس |
| `6` | السادس |
| `0` | غير محدد |

### Grade Label

`grade_label` is a derived API field formatted by the backend.

Examples:

- `PRIMARY` + `4` => `الصف الرابع الابتدائي`
- `PREPARATORY` + `2` => `الصف الثاني الإعدادي`
- `SECONDARY` + `3` => `الصف الثالث الثانوي`
- `UNASSIGNED` + `0` => `غير محدد - يحتاج مراجعة`

## Entity Updates

### Student / Child

Existing learner record managed under `backend/src/children`.

Fields to add or standardize:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `education_stage` | EducationStage | Yes | Defaults to `UNASSIGNED` only during legacy migration or explicit manual-review flows |
| `education_year` | integer | Yes | 1-6 for Primary, 1-3 for Preparatory/Secondary, 0 for Unassigned |
| `grade_label` | string | API response only | Derived by backend formatter, not stored unless an existing response pattern requires it |
| `legacy_grade` | text nullable | No | Preserves old raw grade value during migration |
| `grade_needs_review` | boolean | Yes | True for un-mappable or empty legacy values |

Validation rules:

- New create/update payloads must reject invalid combinations with 400.
- New create/update payloads should not use `UNASSIGNED` unless an explicit administrative/manual-review path exists.
- Legacy empty/null/un-mappable grade values migrate to `UNASSIGNED`, `education_year = 0`, `grade_needs_review = true`.

### Group / Session

Existing teaching cohort/session record under `backend/src/groups`.

Fields to add or standardize:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `education_stage` | EducationStage | Yes | Exactly one stage per group/session |
| `education_year` | integer | Yes | Exactly one year per group/session |
| `grade_label` | string | API response only | Derived by backend formatter |

Validation rules:

- A group/session cannot span multiple stages or years.
- Filters may include `education_stage`, `education_year`, or both.
- Invalid filter combinations return 400 instead of silently ignoring invalid criteria.

### Homework

Existing assignment record under `backend/src/homework`.

Fields to add or standardize:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `education_stage` | EducationStage | Yes | Target stage for assignment |
| `education_year` | integer | Yes | Target year for assignment |
| `grade_label` | string | API response only | Derived by backend formatter |

Validation rules:

- Homework must target exactly one stage/year.
- Homework list filters must use the same backend validation as students and groups.

## Database Constraints

Apply a CHECK constraint to every table that stores `education_stage` and `education_year`:

```sql
(
  (education_stage = 'PRIMARY' AND education_year BETWEEN 1 AND 6)
  OR (education_stage IN ('PREPARATORY', 'SECONDARY') AND education_year BETWEEN 1 AND 3)
  OR (education_stage = 'UNASSIGNED' AND education_year = 0)
)
```

Recommended indexes:

- `(education_stage, education_year)` on students/children for roster filtering.
- `(teacher_id, education_stage, education_year)` where teacher-scoped lists are common.
- `(education_stage, education_year)` on groups/sessions and homework for assignment/session filtering.

## Migration Behavior

- Map known legacy values to the nearest canonical `education_stage` and `education_year` only when the mapping is exact.
- Preserve the raw legacy grade text in `legacy_grade` when available.
- Assign `UNASSIGNED` and `education_year = 0` for empty, null, or un-mappable values.
- Set `grade_needs_review = true` for every unassigned migrated record.
- Migration must be reversible enough to avoid data loss by retaining raw legacy values.
