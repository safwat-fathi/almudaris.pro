# Quickstart: Parent Invitations

## Testing the Flow

1. **Login as Teacher**:
   - Navigate to `/` and login as a Teacher.
   - Go to the "Invitations" tab (or equivalent routing).
   - Generate and copy the unique invitation link (e.g., `http://localhost:3000/invite/TCH-12345`).

2. **Accept Invitation (New Parent)**:
   - Open an incognito window and navigate to the copied invitation link.
   - Verify that the explicit "Accept Invitation" confirmation screen is shown (with the teacher's details).
   - Click "Register". The URL should carry the intent: `?inviteCode=TCH-12345`.
   - Register as a Parent.
   - After successful registration, you should be redirected back to the invitation endpoint or directly linked and redirected to the unified dashboard (`/dashboard`).

3. **Accept Invitation (Existing Linked Parent)**:
   - While still logged in as the new Parent, revisit the invitation link.
   - Verify that an explicit "هذا المعلم مسجل بحسابك بالفعل" message is displayed, with a button to continue to the dashboard.

4. **Add Student to Teacher**:
   - From the parent's dashboard, navigate to the "Students" section.
   - Add a new Student profile.
   - Assign the new student to the Teacher you linked with earlier (the teacher should appear in the searchable list of linked teachers).

## Key Components

- `/invite/[code]`: The main entry point for invitations.
- `ParentTeacherLink`: The backend entity storing the connection.
- `StudentTeacherEnrollment`: The backend entity storing the student's assignment to the teacher.
