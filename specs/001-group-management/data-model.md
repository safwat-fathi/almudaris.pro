# Data Model: Groups Management

## Entities

### `Group`
Represents the core teaching event.
- `id`: SERIAL (Primary Key)
- `teacher_id`: Relation to `User` (The owner of the group)
- `title`: String (Optional)
- `date`: Date (The day the group occurs)
- `start_time`: Time
- `end_time`: Time (Computed from start_time + duration_minutes on creation and updates by DB trigger, but stored for query efficiency)
- `duration_minutes`: Integer (Length of the group)
- `status`: Enum ('Scheduled', 'Completed', 'Cancelled')
- `location_type`: Enum ('Online', 'Physical')
- `location_link`: String (Nullable, required if `location_type` is 'Online')
- `location_place`: String (Nullable, required if `location_type` is 'Physical')
- `recurring_series_id`: Integer (Nullable, links groups created together)
- `notes`: String (Nullable, editable after completion)
- `created_at`: Timestamp (Auto-set on creation)
- `updated_at`: Timestamp (Auto-set on creation and updates)
- `created_by`: Relation to `User` (The authenticated user who created the group; currently always equals `teacher_id`, kept separate for future admin/audit scenarios)

### `GroupStudent`
Represents the many-to-many attendance relationship between a Group and a Student.
- `group_id`: Relation to `Group`
- `student_id`: Relation to `User` (Role = student)
- `student_name`: String (Snapshot of student's name at group creation time, immutable)
- `attendance_status`: Enum ('Present', 'Absent', 'Not set') - Defaults to 'Not set'
- `note`: Text (Nullable, per-student note editable regardless of group status)
- `note_updated_at`: Timestamp (Nullable, auto-set when note is created or updated by DB trigger)
- `created_at`: Timestamp (Auto-set on creation)
- `updated_at`: Timestamp (Auto-set on creation and updates)

### `RecurringSeries`
A logical grouping entity that links multiple groups created from a recurring schedule.
- `id`: SERIAL (Primary Key)
- `teacher_id`: Relation to `User`
- `created_at`: Timestamp
- `created_by`: Relation to `User` (Currently always equals `teacher_id`)
