# Contract: Grade System API

## Shared Concepts

### EducationStage

Allowed values:

- `PRIMARY`
- `PREPARATORY`
- `SECONDARY`
- `UNASSIGNED`

### Stage/Year Matrix

| Stage | Allowed Years |
|-------|---------------|
| `PRIMARY` | 1, 2, 3, 4, 5, 6 |
| `PREPARATORY` | 1, 2, 3 |
| `SECONDARY` | 1, 2, 3 |
| `UNASSIGNED` | 0 |

Normal user-facing create/update flows must not allow `UNASSIGNED` unless an explicit review/admin flow is implemented.

## Student Contracts

### Create or Update Student Payload

```json
{
  "education_stage": "SECONDARY",
  "education_year": 3
}
```

### Student Response Fields

```json
{
  "education_stage": "SECONDARY",
  "education_year": 3,
  "grade_label": "الصف الثالث الثانوي",
  "grade_needs_review": false
}
```

### Invalid Student Payload Response

- Status: `400 Bad Request`
- Message includes the invalid field and allowed stage/year rule.

## Teacher Contracts

### Teacher Assigned Stages Payload

```json
{
  "assigned_stages": ["SECONDARY", "PREPARATORY"]
}
```

### Teacher Validation Rules

- `assigned_stages` must contain at least one stage.
- `UNASSIGNED` is not valid for an active teacher assignment.
- Duplicate stages are rejected or normalized into a unique list.

### Teacher Response Fields

```json
{
  "assigned_stages": ["SECONDARY", "PREPARATORY"]
}
```

## Group Contracts

### Create or Update Group Payload

```json
{
  "teacher_id": 12,
  "education_stage": "SECONDARY",
  "education_year": 3
}
```

### Group Response Fields

```json
{
  "teacher_id": 12,
  "education_stage": "SECONDARY",
  "education_year": 3,
  "grade_label": "الصف الثالث الثانوي"
}
```

### Group Validation Rules

- `education_stage` is required.
- `education_year` is required.
- The stage/year pair must be valid.
- The group stage must be included in the selected teacher's assigned stages.

### Teacher Stage Mismatch Response

- Status: `400 Bad Request`
- Message explains that the selected teacher is not assigned to the requested education stage.

## List Filter Contracts

### Query Parameters

```text
education_stage=SECONDARY&education_year=3
```

### Filter Validation Rules

- `education_stage` and `education_year` can be provided together to filter lists.
- Invalid stage/year pairs return `400 Bad Request`.
- Student, Group/Session, and Homework list responses include only matching records.

## Frontend Form Contract

### Student Form

- Stage selector controls available year options.
- Submitted payload includes `education_stage` and `education_year`.
- Zod validation rejects impossible pairs before submission proceeds.

### Teacher Form

- Teacher stage selector requires at least one stage.
- Stage options exclude `UNASSIGNED`.
- Multiple stage selections are allowed.

### Group Form

- Teacher selection determines allowed group stages.
- Group stage is required.
- Group year is required.
- Year options update based on selected group stage.
- Saving is blocked when stage is not assigned to the selected teacher.

### Add Homework Sheet

- `frontend/components/homework/AddHomeWorkSheet.tsx` must create homework using the selected group's grade context.
- Submitted homework payload includes `group_id` and must preserve or submit the group's `education_stage` and `education_year` according to backend contract requirements.
- The sheet blocks submission when group grade context is unavailable.
- The sheet displays canonical Arabic grade context with backend-provided `grade_label` when grade context is shown.
- Zod validation rejects missing or impossible homework stage/year targeting before submission proceeds.
