# API Contracts: Parent Invitations

## `GET /api/teachers/invite/:inviteCode`
Retrieves minimal public teacher profile to display on the invitation landing page.
- **Param**: `inviteCode`
- **Response (200)**:
  ```json
  {
    "id": 1,
    "name": "Teacher Name",
    "subject": "Mathematics"
  }
  ```
- **Response (404/410)**: Invalid or expired link.

## `POST /api/parents/link-teacher`
Links the authenticated parent to the teacher using the invite code.
- **Body**: `{ "inviteCode": "string" }`
- **Response (201)**: Successfully linked.
- **Response (400)**: Already linked.
- **Response (401/403)**: Unauthorized/Forbidden (e.g. user is not a parent).

## `POST /api/students` (Extension)
Creates a new student and optionally enrolls them with a linked teacher simultaneously.
- **Body**: 
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "enrollTeacherId": 1 // Optional: Teacher ID to auto-enroll
  }
  ```
