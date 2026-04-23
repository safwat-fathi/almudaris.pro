# Quickstart: Homework Feature

## Development Setup

### Backend (NestJS)
1. **Migrations**: Create and run the new entities.
   ```bash
   cd backend
   pnpm run migration:generate -- HomeworkTables
   pnpm run migration:run
   ```
2. **Controllers**: Navigate to `/homework` and `/submissions` to verify Swagger documentation.
3. **Environment**: Ensure a storage bucket interface is available (local file simulation allowed).

### Frontend (Next.js)
1. **Server Actions**: Implementation in `frontend/app/actions/homework.actions.ts`.
2. **Components**: Use `components/ui/Badge.tsx` for status colors:
   - `SUBMITTED`: Success (Green)
   - `LATE`: Warning (Orange)
   - `MISSING`: Error (Red)
   - `NOT_SUBMITTED`: Neutral (Gray)
3. **Dashboards**:
   - Teacher: Session Details page needs a "Homework" section.
   - Student: Dashboard needs a "My Homework" section.

## Verification
- Run `npm test` and `npm run lint`.
- Verify mobile touch targets for submission bottom sheets.
