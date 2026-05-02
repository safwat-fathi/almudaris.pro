## Objective

Move role-specific fields from `users` into dedicated `teachers` and `students` tables while keeping `users` as the single auth/identity table.

## Key Files

- `backend/src/users/entities/user.entity.ts`
- `backend/src/teachers/entities/teacher.entity.ts` (new)
- `backend/src/students/entities/student.entity.ts` (new)
- `backend/src/migrations/*` (new migration)
- `backend/src/teachers/teachers.service.ts`
- `backend/src/children/children.service.ts`
- `backend/src/parents/parents.service.ts`
- `backend/src/auth/auth.service.ts`
- `backend/src/common/seeders/user.seeder.ts`
- `backend/src/common/seeders/group.seeder.ts`

## Implementation Steps

### Phase 1: Schema and Entities

1. Add `Teacher` entity with `user_id`, grade fields, invite code, and constraints/indexes.
2. Add `Student` entity with `user_id`, `parent_id`, grade fields, review flags, and constraints/indexes.
3. Update `User` entity to remove moved columns and replace with profile relations.

### Phase 2: Data Migration

1. Create a migration to create `teachers` and `students` tables.
2. Backfill profile rows from existing `users` role-based data.
3. Drop moved columns and old constraints/indexes from `users`.

### Phase 3: Service Refactor

1. Update teachers flows to read/write invite and grade data from `teachers`/`students`.
2. Update children flows to create and manage `students` profile records.
3. Update parents invite linking to query teachers via `teachers.invite_code`.
4. Update auth signup flow to create teacher profile for teacher role.

### Phase 4: Seeders and Wiring

1. Update user seeder to create parent/teacher/student profiles correctly.
2. Ensure group seeder still links groups to teacher `users.id`.

## Verification & Testing

1. Run TypeScript build or typecheck to ensure compile validity.
2. Execute seed flow and verify teacher/student profile records.
3. Validate key API paths: teacher invite, parent link, child create/update/list, enrollment.

## Cleanup

1. Remove stale user-field references in services and selectors.
2. Ensure response DTO mapping remains backward-compatible where expected.
