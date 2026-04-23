# API Contracts: Homework Feature

## Homework Endpoints

### `POST /homework`
Create a new homework assignment.
- **Request Body**:
  ```json
  {
    "session_id": 123,
    "group_id": 456,
    "title": "Math Assignment 1",
    "description": "Complete exercises 1-10",
    "due_date": "2026-04-30T23:59:59Z"
  }
  ```
- **Response**: `201 Created` with Homework object.

### `GET /sessions/:session_id/homework`
List homework for a specific session.
- **Response**: `200 OK` Array of Homework objects.

## Submission Endpoints

### `POST /homework/:homework_id/submissions`
Submit or resubmit a homework answer.
- **Request Body**:
  ```json
  {
    "answer_text": "Here are my answers...",
    "attachment_url": "https://storage.example.com/file.pdf"
  }
  ```
- **Response**: `201 Created` or `200 OK` (if overwritten) with Submission object.

### `GET /homework/:homework_id/submissions`
Teacher views all submissions for a specific homework assignment.
- **Response**: `200 OK` Array of Submission objects joined with Student details.