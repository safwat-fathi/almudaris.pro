# API Contract: Sessions Management

## Endpoints (Backend NestJS)

### `POST /sessions`
- Creates a new session or a recurring series of up to 24 instances.
- **Request Body**: 
  ```json
  { 
    "date": "YYYY-MM-DD", 
    "start_time": "HH:MM", 
    "duration_minutes": 60, 
    "student_ids": [1, 2], 
    "location_type": "Online" | "Physical", 
    "location_link": "https://zoom.us/...", 
    "location_place": "Center Name", 
    "is_recurring": boolean, 
    "recurrence_pattern": "WEEKLY"
  }
  ```
- **Response**: `201 Created` with Session(s) array.

### `PUT /sessions/:id`
- Updates an upcoming session. Structural changes are blocked if the session is "Completed".
- **Request Body**: 
  ```json
  { 
    "date": "YYYY-MM-DD", 
    "start_time": "HH:MM", 
    "duration_minutes": 60, 
    "student_ids": [1, 2, 3], 
    "location_type": "Physical",
    "location_place": "New Center",
    "edit_scope": "THIS" | "THIS_AND_FUTURE" | "ALL"
  }
  ```
- **Response**: `200 OK`

### `PATCH /sessions/:id/attendance`
- Updates attendance and notes for a completed session.
- **Request Body**: 
  ```json
  { 
    "notes": "Student did well.", 
    "students": [
      { "id": 1, "attendance_status": "Present" },
      { "id": 2, "attendance_status": "Absent" }
    ] 
  }
  ```
- **Response**: `200 OK`

### `DELETE /sessions/:id`
- Cancels a session (updates status to 'Cancelled'). Applies to the single session only.
- **Response**: `204 No Content`
