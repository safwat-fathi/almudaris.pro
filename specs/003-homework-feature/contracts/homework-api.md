# API Contracts: Homework Feature

## Homework Endpoints

### `POST /homework`
Create a new assignment.
- **Request Body**:
  ```json
  {
    "group_id": 1,
    "title": "Math Homework 1",
    "description": "Solve exercises 1 to 5",
    "due_date": "2026-05-01T23:59:59Z"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "id": 101,
    "group_id": 1,
    "title": "Math Homework 1",
    "description": "Solve exercises 1 to 5",
    "due_date": "2026-05-01T23:59:59Z",
    "is_open": true
  }
  ```

### `PATCH /homework/:id`
Update assignment or toggle status.
- **Request Body**:
  ```json
  {
    "is_open": false
  }
  ```

### `GET /homework/:id/submissions` (Teacher View)
List all student submissions with dynamic status.
- **Response (200 OK)**:
  ```json
  [
    {
      "student_id": 1,
      "student_name": "Ahmed",
      "status": "SUBMITTED",
      "submission": {
        "id": 501,
        "answer_text": "Answers here",
        "submitted_at": "2026-04-28T10:00:00Z",
        "attachments": [
          { "file_url": "...", "file_type": "PDF" }
        ]
      }
    },
    {
      "student_id": 2,
      "student_name": "Sarah",
      "status": "MISSING",
      "submission": null
    }
  ]
  ```

## Submission Endpoints

### `POST /homework/:id/submissions`
Submit or update response.
- **Request Body**:
  ```json
  {
    "answer_text": "Updated answer",
    "attachments": [
      { "file_url": "...", "file_type": "PNG" }
    ]
  }
  ```
- **Behavior**:
  - Increments `submission_version`.
  - Replaces all previous `SubmissionAttachment` records.
  - Logs snapshot in `SubmissionAuditLog`.
