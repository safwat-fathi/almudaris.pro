# Feature Specification: Parent Invitations

**Feature Branch**: `002-parent-invitations`  
**Created**: 2026-04-10  
**Status**: Draft  
**Input**: User description: "I want to build a new feature for invitations. Teacher can invite parent by sharing his invitation link (a unique link or QR code). Parent should be registered already to complete the process and he can create accounts for his children (Students) and add them to the Teacher already linked to parent account. meaning teachers linked to parent account are listed and can be searched."

## Clarifications

### Session 2026-04-10

- Q: What is the user experience immediately after a parent logs in via an invitation link? → A: Show an explicit "Accept Invitation" confirmation screen with teacher details
- Q: Handling "Already Linked" Scenarios → A: Display an explicit "You are already linked to this teacher" message with a button to continue.
- Q: Wrong Role Access → A: Display an access denied message specifying that the link is for parent accounts.
- Q: Suspended/Deleted Teacher Accounts → A: Display an error stating "This invitation link is invalid or has expired."

## Post-Implementation Learnings & Experience (UX & Architecture)

- **Unified Navigation Space**: Parents and Students share the exact same UI structure, layout, and core routing space. Fragmenting their routes (e.g., `/(parent)` vs `/(student)`) creates navigation bugs and confusing redirects. They should map to a single unified dashboard route.
- **Intent-Based Login Validation**: Providing a visual role selector ("Teacher" vs "Student / Parent") on the login page creates a strong user expectation. The system must explicitly validate that the user's actual database role matches their UI selection, and provide clear, localized error messaging if they log in via the wrong portal.
- **Root Path Semantics**: The root path (`/`) is exclusively the Teacher's domain. Parents and Students must seamlessly be redirected away from it to their respective unified dashboard space to ensure they don't accidentally encounter the Teacher interface.
- **Native Localization**: Components shared by users (like the Teacher's QR code invitation card) must inherently use the platform's native language (Arabic), right-to-left formatting (`rtl`), and specific design system tokens. Generic or unlocalized placeholder UI immediately damages the user experience.
- **Stateful Invitation Links**: Invitation processes that cross authentication boundaries (login, OTP, registration) must carry the intent (e.g., the `inviteCode`) forward through the entire process. Storing this via URL parameters (`?inviteCode=...`) ensures the user is seamlessly redirected back to the invitation endpoint (`/invite/[code]`) once authenticated.
- **Dynamic Role Registration**: Registration components meant to be shared across user types (e.g., `RegistrationForm`) should avoid hardcoding user roles. Extracting the role from query parameters allows a single form to serve both independent teacher signups and parent signups originating from an invitation link.
- **Context-Aware Error Handling**: When a user attempts to accept an invitation they are already linked to, the UI should not treat this as a hard failure. Instead, it should explicitly acknowledge the existing link ("You are already linked to this teacher") and provide a clear call-to-action to proceed to their dashboard.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Teacher Shares Invitation Link (Priority: P1)

Teachers can get a link or QR code to share with parents so that parents can link themselves to the teacher easily.

**Why this priority**: Without an invitation system, parents and teachers cannot establish a connection on the platform, which blocks student onboarding.

**Independent Test**: Can be fully tested by verifying the teacher can view, copy, and download a QR code for their invitation link.

**Acceptance Scenarios**:

1. **Given** I am logged in as a Teacher, **When** I navigate to the invitation page, **Then** I see my unique invitation link.
2. **Given** I am on the invitation page, **When** I click "Share QR Code", **Then** I can see and download the associated QR code.

---

### User Story 2 - Parent Accepts Invitation (Priority: P1)

Parents click the teacher's invitation link, log in or register, and automatically establish a "linked" connection with that specific teacher.

**Why this priority**: This is the core mechanism by which parents join a teacher's specific network.

**Independent Test**: Can be tested by navigating to an invitation link as a parent and verifying that the parent-teacher link is created after sign-in.

**Acceptance Scenarios**:

1. **Given** I am an unregistered user, **When** I open the teacher's invitation link, **Then** I am prompted to register or log in.
2. **Given** I am a logged-in Parent, **When** I open the teacher's invitation link, **Then** I am successfully linked to that Teacher and redirected to my dashboard.

---

### User Story 3 - Parent Adds Students to Teacher (Priority: P2)

Parents can create student accounts for their children and assign them directly to the teachers they are linked with.

**Why this priority**: The ultimate goal is for students to study with the teacher, so adding the students to the teacher's roster is necessary.

**Independent Test**: Can be tested by logging in as a linked parent, creating a student, and verifying the student is associated with the selected teacher.

**Acceptance Scenarios**:

1. **Given** I am a Parent linked to at least one Teacher, **When** I add a new Student profile, **Then** I can select a Teacher from my linked list to assign to the student.
2. **Given** I am assigning a student, **When** I search my list of linked teachers, **Then** I can easily find the desired teacher to add the student to.

## Edge Cases

- If a parent clicks an invitation link for a teacher they are already linked to, the system MUST display an explicit "You are already linked to this teacher" message with a button to continue.
- If the invitation link is accessed by a user who is logged in as a Teacher or Student rather than a Parent, the system MUST display an access denied message prompting them to log in with a parent account.
- If the teacher's account is suspended or deleted after the link is shared, the system MUST display an error message stating "This invitation link is invalid or has expired" to protect the teacher's privacy.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide teachers with a unique, persistent URL and corresponding QR code for parent invitations.
- **FR-002**: System MUST intercept invitation link access to ensure the user is authenticated as a Parent before completing the link process.
- **FR-003**: System MUST display an explicit "Accept Invitation" confirmation screen showing the teacher's details before finalizing the connection.
- **FR-004**: System MUST automatically create a link/association between the Parent and Teacher upon successful completion of the invitation flow.
- **FR-005**: System MUST allow parents to create new Student accounts (children) under their parent profile.
- **FR-006**: System MUST allow parents to assign their children (Students) to any Teacher they are currently linked with.
- **FR-007**: System MUST provide a searchable list of linked teachers for the parent during the student assignment process.
- **FR-008**: System MUST allow parents to either enroll a previously created student account with the new teacher, or create a brand new student account and enroll them with the teacher during the invitation flow.
- **FR-009**: System MUST provide a unified dashboard routing namespace (e.g. `/dashboard`) shared by both Parents and Students to prevent navigation fragmentation.
- **FR-010**: System MUST validate that a user's selected role on the login UI matches their actual database role, displaying an explicit localized error upon mismatch.
- **FR-011**: System MUST enforce strict root path (`/`) semantics for the Teacher role, automatically redirecting logged-in Parents and Students to their unified dashboard.
- **FR-012**: System MUST ensure all shared user interface components are natively localized in Arabic with right-to-left (`rtl`) text direction and consistent design system tokens.
- **FR-013**: System MUST persist invitation intent (e.g., `inviteCode`) across authentication boundaries (login, registration, OTP) via URL parameters to ensure seamless redirection back to the invitation acceptance flow upon successful authentication.
- **FR-014**: System MUST support dynamic role assignment during registration via query parameters to allow shared authentication components to serve both independent teacher signups and parent signups originating from invitations.
- **FR-015**: System MUST handle "Already Linked" scenarios as a recognized state rather than a generic error, displaying an explicit acknowledgment to the user along with a clear call-to-action to proceed to their dashboard.

### Key Entities

- **Invitation Link**: A unique identifier associated with a specific Teacher.
- **Parent-Teacher Link**: A relational record confirming that a specific Parent is connected to a specific Teacher.
- **Student Profile**: Child accounts created and managed by the Parent.
- **Student-Teacher Enrollment**: A relation defining which teacher is tutoring which student.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Teachers can retrieve and share their invitation link/QR code in under 1 minute.
- **SC-002**: Parents can complete the invitation process and create a child account assigned to a teacher in under 3 minutes.
- **SC-003**: 95% of parents opening an invitation link successfully complete the process to link with the teacher.

## Assumptions

- Users accessing the link without an account will be redirected to the standard registration flow and then returned to the invitation process.
- The link is a permanent or semi-permanent URL for each teacher, rather than a one-time-use token.
- A single Parent can be linked to multiple Teachers, and a single Teacher can be linked to multiple Parents.
