# Research: Parent Invitations

## Invitation Link Uniqueness & Generation
- **Decision**: Use an `inviteCode` (e.g., a short alphanumeric string or UUID) directly on the `Teacher` entity, generating a persistent URL (e.g. `/invite/{inviteCode}`).
- **Rationale**: A persistent QR code or link is easiest for the teacher to print, screenshot, or send repeatedly. The specification implies the link uniquely identifies the teacher, not necessarily the specific invocation.
- **Alternatives considered**: Generating one-time-use tokens per invitation. Rejected because it would require the teacher to explicitly generate a new link for every individual parent interactively, breaking the "share his invitation link (QR code)" requirement which is heavily biased towards a reusable credential.

## Parent to Teacher Relationship
- **Decision**: Introduce a `ParentTeacherLink` join table.
- **Rationale**: A parent can have multiple students across multiple teachers. Establishing a concrete relationship between Parent and Teacher restricts search and enforces authorization boundaries (e.g., parents can only see/message linked teachers, and assign students to linked teachers).
- **Alternatives considered**: Inferring relationship dynamically through student enrollment. Rejected because the parent needs to link to the teacher *before* creating a student, as per the explicit workflow in the specification.

## Registration/Authentication Handshake
- **Decision**: Use Next.js Middleware or an RSC wrapper at `/invite/[code]` that validates authentication. If unauthenticated, redirect to `/login?callbackUrl=/invite/[code]`.
- **Rationale**: Follows standard modern auth paradigms. The user logs in and gets seamlessly returned to complete the link process.
- **Alternatives considered**: Having a customized registration page specifically for invitations. Rejected to maintain DRY auth flows and simplicity matching the constitution.
