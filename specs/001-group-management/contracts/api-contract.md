# API Contract: Group Management

## Endpoints (Backend NestJS)

### `POST /groups`
- Creates a new group or a recurring series of up to 24 instances (configurable).
- Backend auto-calculates `end_time` from `start_time + duration_minutes`.
- Backend validates overlaps and returns `warnings` in response (non-blocking).
- **Request Body**: 
  ```json
  { 
    "date": "YYYY-MM-DD", 
    "start_time": "HH:MM (UTC)", 
    "duration_minutes": 60, 
    "student_ids": [1, 2], 
    "location_type": "Online" | "Physical", 
    "location_link": "https://zoom.us/...", 
    "location_place": "Center Name", 
    "title": "Optional title",
    "is_recurring": true, 
    "recurrence_pattern": "WEEKLY",
    "recurrence_count": 10
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "data": [{ "id": 1, "date": "...", "start_time": "...", "end_time": "...", "duration_minutes": 60, "status": "Scheduled", ... }],
    "warnings": ["You already have a group at this time on 2026-04-15"]
  }
  ```

### `PUT /groups/:id`
- Updates an upcoming group. Structural changes are blocked if the group is "Completed".
- Backend auto-recalculates `end_time` if `start_time` or `duration_minutes` changes.
- Backend validates overlaps and returns `warnings` in response (non-blocking).
- For recurring groups, `edit_scope` determines which groups are affected:
  - `THIS`: Only the specified group.
  - `THIS_AND_FUTURE`: The specified group + groups with `date > this group's date` in the same `recurring_series_id`.
  - `ALL`: All groups in the series, but past/completed groups are protected from structural edits.
- **Request Body**: 
  ```json
  { 
    "date": "YYYY-MM-DD", 
    "start_time": "HH:MM (UTC)", 
    "duration_minutes": 60, 
    "student_ids": [1, 2, 3], 
    "location_type": "Physical",
    "location_place": "New Center",
    "title": "Updated title",
    "edit_scope": "THIS" | "THIS_AND_FUTURE" | "ALL"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "data": { "id": 1, ... },
    "warnings": []
  }
  ```

### `PATCH /groups/:id/status`
- Manually marks a group as "Completed" (before `end_time` passes).
- **Request Body**: 
  ```json
  { 
    "status": "Completed"
  }
  ```
- **Response**: `200 OK`

### `PATCH /groups/:id/attendance`
- Updates attendance, per-student notes, and group-level notes for a group.
- Allowed regardless of whether group is "Scheduled" or "Completed".
- **Request Body**: 
  ```json
  { 
    "notes": "Group went well overall.", 
    "students": [
      { "id": 1, "attendance_status": "Present", "note": "Did very well today" },
      { "id": 2, "attendance_status": "Absent", "note": null }
    ] 
  }
  ```
- **Response**: `200 OK`

### `DELETE /groups/:id`
- Cancels a group (updates status to 'Cancelled'). Applies to the single group only.
- No bulk cancellations for recurring series (one at a time for safety).
- **Response**: `204 No Content`

### `GET /groups`
- Lists groups for the authenticated teacher, with filtering by date range, status, and student.
- All times returned in UTC; frontend converts using teacher's profile timezone.
- **Query Parameters**: `?from=YYYY-MM-DD&to=YYYY-MM-DD&status=Scheduled|Completed|Cancelled&student_id=1`
- **Response**: `200 OK`
  ```json
  {
    "data": [
      {
        "id": 1,
        "date": "2026-04-15",
        "start_time": "14:00:00",
        "end_time": "15:00:00",
        "duration_minutes": 60,
        "title": "Math Group",
        "status": "Scheduled",
        "location_type": "Online",
        "location_link": "https://zoom.us/...",
        "location_place": null,
        "recurring_series_id": 1,
        "notes": null,
        "students": [
          { "id": 1, "student_name": "أحمد محمد", "attendance_status": "Not set", "note": null }
        ],
        "created_at": "...",
        "updated_at": "..."
      }
    ]
  }
  ```

### `GET /groups/:id`
- Gets a single group with full details including students and their attendance/notes.
- **Response**: `200 OK` (same shape as list item above)
