# API Contract: Group Management

## Endpoints (Backend NestJS)

### `POST /groups`
- Creates a new group or a recurring series of up to 24 instances.
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
- **Response**: `201 Created` with Group(s) array.

### `PUT /groups/:id`
- Updates an upcoming group. Structural changes are blocked if the group is "Completed".
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

### `PATCH /groups/:id/attendance`
- Updates attendance and notes for a completed group.
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

### `DELETE /groups/:id`
- Cancels a group (updates status to 'Cancelled'). Applies to the single group only.
- **Response**: `204 No Content`
