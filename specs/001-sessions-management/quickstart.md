# Quickstart: Groups Management

## Overview
The Groups Management feature is the core unit of value for Al-Mudaris Pro. It allows teachers to schedule, edit, and cancel teaching groups (both individual and group, online and physical). It manages attendance tracking and strictly preserves historical data for completed groups.

## Key Workflows
1. **Create Group**: Teachers create a group for their students. Overlaps show non-blocking warnings but are allowed.
2. **Recurring Groups**: Generates up to a strict maximum of 24 separate, independent group instances linked by a `recurring_series_id`. Edits can apply to "This group only" or "This and future groups" strictly within the exact same series.
3. **Completed Groups**: Once a group's end time passes or it is manually marked complete, core structural details (time, location type, student list) are locked. Only attendance and notes can be edited to preserve historical accuracy.
4. **Cancellations**: Soft-delete via "Cancelled" status. Cancellations must be performed individually, one session at a time. No hard deletes.

## Architecture
- **Backend (NestJS)**: Strict REST API endpoints with Swagger decorators and Zod/Class Validator validation. Entities use `SERIAL` keys and `jsonb` where necessary.
- **Frontend (Next.js v16)**: Strictly Server-Driven UI using React Server Components. Server Actions handle all form submissions with CSRF tokens. Zustand is used for minimal client state. Styling strictly uses TailwindCSS and follows the "Silent Mentor" design system (Manrope font, ROUND_FULL). No spec files are used.
