# Quickstart: Parent Invitations Overview

## Overview
This feature allows a Teacher to retrieve a unique, persistent link/QR code. Using this link, a Parent is redirected to a landing page where they can register or authenticate, instantly linking their account to the Teacher. Once linked, the parent can add students and immediately assign them to the Teacher.

## Key Steps
1. **Teacher Invitation Retrieval**: The Teacher logs in and accesses their profile/settings to copy their `inviteCode` URL.
2. **Parent Landing Page**: A Parent clicks the URL (`/invite/XYZ`). If unauthenticated, they are redirected to login/register. 
3. **Accepting Invitation**: Authenticated parents arrive at `/invite/XYZ`. The page checks if they are a parent. If so, it calls `POST /api/parents/link-teacher`. 
4. **Student Assignment**: The parent is navigated to their dashboard with a prompt/wizard to "Add your child to start learning with [Teacher Name]" where they manage student creation and enrollment via server actions.
