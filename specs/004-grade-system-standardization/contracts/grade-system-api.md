# API Contract: Grade System Standardization

## Shared Types

```ts
type EducationStage = 'PRIMARY' | 'PREPARATORY' | 'SECONDARY' | 'UNASSIGNED';

type GradeTarget = {
  education_stage: EducationStage;
  education_year: number;
  grade_label: string;
};
```

Valid payload combinations:

- `PRIMARY`: `education_year` 1 through 6
- `PREPARATORY`: `education_year` 1 through 3
- `SECONDARY`: `education_year` 1 through 3
- `UNASSIGNED`: `education_year` 0, migration/manual-review records only

Invalid combinations return `400 Bad Request` with a descriptive validation error.

## Students / Children

### Create Student

`POST /children`

Request additions:

```json
{
  "name": "Ahmed Ali",
  "email": "ahmed@child.com",
  "education_stage": "SECONDARY",
  "education_year": 3
}
```

Response additions:

```json
{
  "id": 12,
  "name": "Ahmed Ali",
  "education_stage": "SECONDARY",
  "education_year": 3,
  "grade_label": "الصف الثالث الثانوي",
  "grade_needs_review": false
}
```

### Update Student Grade

`PATCH /children/:id`

Request additions:

```json
{
  "education_stage": "PRIMARY",
  "education_year": 4
}
```

Response additions:

```json
{
  "id": 12,
  "education_stage": "PRIMARY",
  "education_year": 4,
  "grade_label": "الصف الرابع الابتدائي",
  "grade_needs_review": false
}
```

### List Students With Filters

`GET /children?education_stage=SECONDARY&education_year=3`

Behavior:

- Returns only students matching both filters.
- If `education_year` is invalid for `education_stage`, returns 400.
- If only `education_stage` is provided, returns all valid years for that stage.

## Groups / Sessions

### Create Group/Session

`POST /groups`

Request additions:

```json
{
  "title": "ثالثة ثانوي - مراجعة",
  "date": "2026-05-01",
  "start_time": "16:00",
  "duration_minutes": 90,
  "location_type": "Online",
  "education_stage": "SECONDARY",
  "education_year": 3
}
```

Response additions:

```json
{
  "id": 44,
  "education_stage": "SECONDARY",
  "education_year": 3,
  "grade_label": "الصف الثالث الثانوي"
}
```

### List Groups/Sessions With Filters

`GET /groups?education_stage=PRIMARY&education_year=6`

Behavior:

- Returns only groups/sessions targeting the selected stage/year.
- Rejects impossible stage/year combinations with 400.

## Homework

### Create Homework

`POST /homework`

Request additions:

```json
{
  "title": "واجب الدرس الأول",
  "education_stage": "PREPARATORY",
  "education_year": 2
}
```

Response additions:

```json
{
  "id": 27,
  "title": "واجب الدرس الأول",
  "education_stage": "PREPARATORY",
  "education_year": 2,
  "grade_label": "الصف الثاني الإعدادي"
}
```

### List Homework With Filters

`GET /homework?education_stage=PREPARATORY&education_year=2`

Behavior:

- Returns homework matching the selected target grade.
- Rejects invalid filter combinations with 400.

## Validation Error Shape

Use the repository's existing validation exception format. The response must clearly identify the invalid pair.

Example:

```json
{
  "statusCode": 400,
  "message": "Invalid education_stage/education_year combination: PRIMARY only supports years 1 through 6.",
  "error": "Bad Request"
}
```
