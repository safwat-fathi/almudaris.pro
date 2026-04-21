# Research & Technical Decisions: Parent Invitations

## Technical Context Unknowns Resolved

1. **Unified Navigation Space**:
   - **Decision**: Use a single `/dashboard` route for both Parents and Students.
   - **Rationale**: Fragmenting routes (`/(parent)` vs `/(student)`) creates navigation bugs. A unified space simplifies routing and avoids confusing redirects.
   - **Alternatives considered**: Separate route groups. Rejected due to complexity in sharing UI components and handling multi-role users.

2. **Stateful Invitation Links**:
   - **Decision**: Store `inviteCode` in URL parameters (`?inviteCode=...`) throughout the authentication and registration flow.
   - **Rationale**: Ensures the user's intent is carried forward across authentication boundaries (login, OTP, registration) so they can be seamlessly redirected back to the invitation endpoint (`/invite/[code]`).
   - **Alternatives considered**: Storing in local storage or session cookies. Rejected because URL parameters are more transparent, shareable, and less prone to state mismatch issues if the user opens multiple tabs.

3. **Dynamic Role Registration**:
   - **Decision**: Extract the user role from query parameters to allow a single `RegistrationForm` component.
   - **Rationale**: Avoids duplicating the registration form for independent teacher signups vs parent signups originating from an invitation link.
   - **Alternatives considered**: Hardcoding roles in separate components. Rejected due to code duplication and maintenance overhead.

4. **Already Linked Scenarios**:
   - **Decision**: Treat as a recognized state, not a hard error. Display an explicit "You are already linked to this teacher" message with a CTA to proceed to the dashboard.
   - **Rationale**: Provides a better user experience than a generic error message, acknowledging the existing relationship.
   - **Alternatives considered**: Redirecting silently or showing a standard error page. Rejected because it causes confusion.
