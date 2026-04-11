# Data Model: Groups Management

## Entities

### `Group`
Represents the core teaching event.
- `id`: SERIAL (Primary Key)
- `teacher_id`: Relation to `User` (The owner of the group)
- `title`: String (Optional)
- `date`: Date (The day the group occurs)
- `start_time`: Time
- `duration_minutes`: Integer (Length of the group)
- `status`: Enum ('Scheduled', 'Completed', 'Cancelled')
- `location_type`: Enum ('Online', 'Physical')
- `location_link`: String (Nullable, required if `location_type` is 'Online')
- `location_place`: String (Nullable, required if `location_type` is 'Physical')
- `recurring_series_id`: Integer (Nullable, links groups created together)
- `notes`: String (Nullable, editable after completion)

### `GroupStudent`
Represents the many-to-many attendance relationship between a Group and a Student.
- `group_id`: Relation to `Group`
- `student_id`: Relation to `User` (Role = student)
- `attendance_status`: Enum ('Present', 'Absent', 'Not set') - Defaults to 'Not set'

### `RecurringSeries`
A logical grouping entity that links multiple groups created from a recurring schedule.
- `id`: SERIAL (Primary Key)
- `teacher_id`: Relation to `User`
- `created_at`: Timestamp
