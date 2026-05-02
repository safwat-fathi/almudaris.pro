# 📄 BRD — Business Requirements Document

## Product: **Al-Mudaris Pro (المدرس برو)**

## Version: **MVP v4.0 (Post-Refactor & Alignment)**

## Owner: Product / Tech Lead

---

# 1. 🧭 Product Vision

Al-Mudaris Pro is a **teacher-first SaaS platform** designed specifically for **private tutors in Egypt** to:

* Manage students, sessions, attendance, homework, and payments
* Provide **structured visibility for parents**
* Enable **students to follow their academic progress**

👉 The system replaces:

* WhatsApp chaos
* Paper-based tracking
* Manual attendance & payments

With a **simple, mobile-first, structured system**

---

# 2. 🎯 Objectives

## Primary Goals

* Simplify **daily teacher operations**
* Provide **clear tracking for parents**
* Improve **student performance visibility**

## Secondary Goals

* Increase teacher income efficiency
* Reduce operational errors
* Enable scaling (more students, more groups)

---

# 3. 👥 Actors (Unified User Model)

## ✅ Core Decision

> **User is a unified entity** with roles:

* Teacher
* Parent
* Student

---

## 👨‍🏫 Teacher

Main system driver.

### Capabilities:

* Manage students
* Create groups
* Schedule sessions
* Track attendance
* Assign homework
* Review submissions
* Manage payments (basic MVP tracking)

---

## 👨‍👩‍👧 Parent

Observer & decision maker.

### Capabilities:

* View children
* Track progress
* View attendance & homework
* Communicate trust (indirectly)

---

## 👨‍🎓 Student

Execution role.

### Capabilities:

* View homework
* Submit answers
* Track progress

---

# 4. 🧱 Core Domain Model

---

## 4.1 User

* id
* name
* phone
* password
* role (TEACHER, PARENT, STUDENT)
* is_active

---

## 4.2 Parent ↔ Student Relationship

* Parent can have **multiple children**
* Student belongs to **one parent**

---

## 4.3 Teacher ↔ Student Relationship

### 🔴 Critical Change (Important)

> Relationship is **NOT deleted** → it is **deactivated**

* Stored in `enrollments`
* Uses:

  * `deactivated_at`
  * `deactivated_by`

👉 This preserves history and avoids data loss 

---

## 4.4 Student Academic Level

### ✅ Standardized System

* `stage` (PRIMARY, PREPARATORY, SECONDARY)
* `grade` (number)

Displayed as:

> الصف + {year} + {stage}

Example:

* الصف الثالث الثانوي

👉 This is a **core identity field** 

---

## 4.5 Groups

Represents a teaching batch.

* id
* teacher_id
* name
* stage
* grade
* is_active

---

## 4.6 Sessions

Represents a class instance.

* id
* group_id
* title
* start_time
* (optional) end_time
* location / online
* status (SCHEDULED, STARTED, COMPLETED)

---

## 4.7 Attendance

Per session per student:

* present
* absent
* late

---

## 4.8 Homework

* id
* session_id
* group_id
* title
* description
* attachment
* due_date

---

## 4.9 Submission

* homework_id
* student_id
* answer
* attachment
* submitted_at
* status (ON_TIME / LATE)

---

# 5. 🔁 Key Business Flows

---

## 5.1 Student Lifecycle

### Flow:

1. Teacher invites parent
2. Parent creates account
3. Parent creates child (student)
4. Parent links child to teacher
5. Teacher assigns student to group

---

## 5.2 Removing Student (Important Behavior)

❌ NOT delete
✅ Deactivate enrollment

* Keeps history
* Prevents re-adding duplicates incorrectly

---

## 5.3 Session Flow

### Teacher:

1. Create session
2. Start session
3. Take attendance
4. Assign homework (optional)

---

## 5.4 Homework Flow

### Teacher:

* Create homework (text or file)

### Student:

* Submit answer

### Teacher:

* Review submissions

---

## 5.5 Parent Flow

* View:

  * Attendance
  * Homework
  * Progress

---

# 6. 🎨 UX Principles (MVP Critical)

---

## 6.1 Mobile-First

* Teachers use phones primarily
* All actions must be:

  * ≤ 2 taps where possible
  * Large buttons
  * Clear Arabic labels

---

## 6.2 Speed Over Complexity

Focus on:

* Fast attendance marking
* Quick homework creation
* Easy student lookup

---

## 6.3 Clarity

Use:

* Arabic labels (not English terms)
* Full grade display (not abbreviations)

---

# 7. ⚙️ Core Features (MVP Scope)

---

## ✅ Must Have

### Teacher

* Student management
* Groups
* Sessions
* Attendance
* Homework + submissions

---

### Parent

* Children list
* Attendance view
* Homework tracking

---

### Student

* Homework view
* Submission

---

## ❌ Out of Scope (Post-MVP)

* Payments automation
* Chat system
* AI recommendations
* Advanced analytics

---

# 8. 🔐 Permissions & Data Isolation

---

## Core Rule:

> Teacher can ONLY access his students

---

## Implementation Direction:

* Row-Level Security (RLS)
* Backend validation

---

# 9. ⚠️ Constraints & Rules

---

## Student Duplication

* Prevent same child duplicated under same parent
* Use:

  * name + phone (or identifier)

---

## Group Assignment

* Student must belong to:

  * Teacher
  * Then group

---

## Session Integrity

* Cannot mark attendance before session starts
* Cannot submit after deadline (optional logic)

---

# 10. 📊 Metrics for Success

---

## Teacher Metrics

* Sessions created/week
* Attendance usage
* Homework usage

---

## Engagement Metrics

* Parent logins
* Student submissions

---

# 11. 🚀 Future Roadmap (Post-MVP)

---

## Phase 2

* Payments tracking
* Notifications (WhatsApp/SMS)
* Advanced filtering

---

## Phase 3

* AI assistant for teachers
* Performance analytics
* Smart recommendations

---

# 12. 🧩 Key Product Decisions Summary

| Area              | Decision                             |
| ----------------- | ------------------------------------ |
| User Model        | Unified (Teacher / Parent / Student) |
| Student Ownership | Parent-based                         |
| Teacher Access    | Enrollment-based                     |
| Deletion          | Soft (deactivation)                  |
| Grade System      | Structured (stage + grade)           |
| UX                | Mobile-first                         |
| Core Flow         | Teacher-driven                       |

---

# 13. ⚠️ Critical Takeaways

---

## 1. This is NOT just a CRUD app

It is a **workflow system for teachers**

---

## 2. Simplicity wins

If teacher needs training → UX failed

---

## 3. Data integrity is critical

Especially:

* enrollments
* grade system
* session tracking

---

## 4. Teacher trust = product success

If teacher trusts:

* attendance
* homework tracking

👉 He will pay

---

## Updated BRD — Users & Profile Tables Decision

### 3. 👥 Actors & Identity Model

Al-Mudaris Pro uses a **single `users` table as the authentication and identity source**.

The `users` table represents the login account, not the full business profile.

#### User Roles

A user can have one role:

* Teacher
* Parent
* Student

The system keeps authentication simple by ensuring that:

> JWT `sub` always refers to `users.id`.

This means login, authorization, and ownership checks remain stable even after introducing profile tables.

---

## 4. 🧱 Updated Core Domain Model

## 4.1 Users Table

The `users` table should only contain shared account fields.

#### Keep in `users`

* id
* role
* is_active
* name
* phone
* email
* timezone
* password
* created_at
* updated_at
* deleted_at

#### Remove from `users`

These fields should no longer live directly on the user:

* education_stage
* education_year
* legacy_grade
* grade_needs_review
* invite_code
* parent

---

## 4.2 Teacher Profile

A teacher has a dedicated profile table.

#### Table: `teachers`

* id
* user_id — unique FK to `users.id`
* education_stage
* education_year
* invite_code
* legacy_grade — optional, only for migration/history
* grade_needs_review — probably not needed for teachers
* created_at
* updated_at
* deleted_at

#### Business Meaning

The teacher profile stores teacher-only information.

Examples:

* Invite code
* Teaching stage/year focus
* Teacher-specific academic metadata

The `invite_code` must be read from the teacher profile, not from the user.

---

## 4.3 Student Profile

A student also has a dedicated profile table.

#### Table: `students`

* id
* user_id — unique FK to `users.id`
* parent_id — FK to `users.id`, where role = Parent
* education_stage
* education_year
* legacy_grade
* grade_needs_review
* created_at
* updated_at
* deleted_at

#### Business Meaning

The student profile stores student-only information.

Examples:

* Parent ownership
* Academic stage/year
* Legacy grade migration fields
* Whether grade needs review

This keeps the student identity clean while preserving the parent-child relationship.

---

## 4.4 Parent Profile

Do **not** create a separate `parents` table yet.

Reason:

> Parent currently has no role-specific fields.

A parent is fully represented by the `users` table for MVP.

If parent-specific fields appear later, such as occupation, address, preferred communication method, or payment ownership metadata, a `parents` profile table can be introduced later.

---

# 5. 🧠 Important Product & Technical Decision

## Profile Tables Are Added, But Business Tables Still Reference `users.id`

For MVP, existing business tables should continue referencing `users.id`.

Examples:

* `groups.teacher_id → users.id`
* `groups.created_by_id → users.id`
* `parent_teacher_links.teacher_id → users.id`
* `student_teacher_enrollments.student_id → users.id`
* `teachers.user_id → users.id`
* `students.user_id → users.id`

This avoids a large risky migration and keeps existing ownership logic stable.

The platform already treats teacher-student removal as relationship deactivation, not physical deletion, to preserve history and avoid data loss .

---

# 6. 🎓 Academic Grade Ownership Update

Academic fields now belong to profile tables, not the shared user identity.

## Teacher

Teacher profile may contain:

* education_stage
* education_year

This represents the teacher’s teaching focus.

## Student

Student profile must contain:

* education_stage
* education_year
* legacy_grade
* grade_needs_review

This aligns with the Egyptian grade model where academic level is a core student field and should be stored structurally, not as localized strings .

---

# 7. 🔁 Updated Business Flows

## Teacher Signup

1. Create `User`
2. Create `Teacher` profile
3. Generate/store `invite_code` in `teachers.invite_code`

---

## Parent Signup / OTP Auto-Create

1. Create `User` only
2. No parent profile is created

---

## Child Creation by Parent

1. Parent creates child account
2. System creates `User` with role = Student
3. System creates `Student` profile
4. `students.parent_id` points to parent’s `users.id`

---

## Parent Links Teacher by Invite Code

1. Parent enters teacher invite code
2. System searches `teachers.invite_code`
3. System resolves linked `User`
4. Parent-teacher link still references `users.id`

---

## Teacher Views / Filters Students

Student grade data must be loaded from `students`, not directly from `users`.

---

# 8. 📦 API Response Compatibility Rule

Even though storage changes, API responses should preserve the frontend shape as much as possible.

For example, child responses may still return:

```json
{
  "id": 12,
  "name": "Ahmed",
  "role": "STUDENT",
  "education_stage": "SECONDARY",
  "education_year": 3,
  "grade_label": "الصف الثالث الثانوي"
}
```

But internally:

* `name` comes from `users`
* `education_stage` comes from `students`
* `education_year` comes from `students`
* `grade_label` is generated by mapping logic

The BRD already defines the product as a teacher-first platform with parent and student visibility, and this profile-table approach keeps that model clean without breaking auth or existing ownership flows .

---

# 9. ✅ Updated Product Decision Summary

| Area                    | Updated Decision                        |
| ----------------------- | --------------------------------------- |
| Authentication          | `users` remains the identity/auth table |
| Teacher-specific data   | Move to `teachers` profile table        |
| Student-specific data   | Move to `students` profile table        |
| Parent-specific data    | No parent table yet                     |
| JWT subject             | Still `users.id`                        |
| Existing FKs            | Keep referencing `users.id` for now     |
| Invite code             | Stored in `teachers.invite_code`        |
| Student parent relation | Stored in `students.parent_id`          |
| Grade fields            | Stored in profile tables                |
| API responses           | Preserve frontend shape where possible  |

---

# 10. Updated Recommendation

Use a **profile-table migration**, not a full identity split.

This gives the system:

* Cleaner domain modeling
* Stable authentication
* Lower migration risk
* Better long-term maintainability
* Less disruption to existing groups, enrollments, links, and session flows
