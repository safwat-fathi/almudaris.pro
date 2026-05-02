# 📄 SRS — System Requirements Specification

## Product: Al-Mudaris Pro (المدرس برو)

## Version: MVP v4.0

## Based on: Updated BRD & Profile Architecture

---

# 1. 🧭 System Overview

Al-Mudaris Pro is a **teacher-first system** that enables:

* Teacher → operational management
* Parent → monitoring
* Student → execution

The system is:

* Mobile-first
* Role-based
* Enrollment-driven (not ownership-based)

---

# 2. 🏗 System Architecture (High-Level)

## 2.1 Identity Model

The system uses:

* `users` → authentication & identity
* `teachers` → teacher profile
* `students` → student profile

👉 As defined in the updated BRD 

---

## 2.2 Core Principle

> All business relations still reference `users.id`

This avoids breaking:

* groups
* enrollments
* parent-teacher links

---

# 3. 👥 Actors & Permissions

---

## 3.1 Teacher

### Permissions:

* Full CRUD on:

  * Groups
  * Sessions
  * Homework
* Manage:

  * Students (via enrollment)
  * Attendance
  * Submissions

---

## 3.2 Parent

### Permissions:

* View children
* Link teachers
* Monitor:

  * Attendance
  * Homework

---

## 3.3 Student

### Permissions:

* View homework
* Submit homework

---

# 4. 🧱 Data Model Requirements

---

## 4.1 Users

### Functional Requirements

* User must:

  * Have a unique phone number
  * Have one role only
  * Be active or inactive

---

## 4.2 Teacher Profile

### Requirements

* Each teacher must have:

  * One profile linked to user
* Invite code must be:

  * Unique
  * Indexed
  * Used for parent linking

---

## 4.3 Student Profile

### Requirements

* Each student must:

  * Belong to one parent
* Must store:

  * education_stage
  * education_year

---

## 4.4 Grade System (Critical)

### Requirements

* System must store:

  * `stage` (enum)
  * `grade` (int)

* System must validate:

  * PRIMARY → 1 to 6
  * PREPARATORY / SECONDARY → 1 to 3

👉 As defined in grade system spec 

---

## 4.5 Enrollment (Teacher ↔ Student)

### Requirements

* Must support:

  * Active relationship
  * Deactivated relationship

* Must NOT delete records

* Must include:

  * deactivated_at
  * deactivated_by

👉 Deactivation logic is mandatory, not optional 

---

# 5. 🔁 Functional Requirements

---

# 5.1 Authentication Module

---

## FR-001: User Login

* User logs in using:

  * Phone + password OR OTP

---

## FR-002: Role-Based Access

* System must:

  * Restrict endpoints based on role

---

# 5.2 Teacher Module

---

## FR-010: Teacher Registration

* System must:

  * Create User
  * Create Teacher profile

---

## FR-011: Invite Code

* System must:

  * Generate unique invite_code
  * Allow lookup by invite_code

---

## FR-012: View Students

* Teacher can:

  * View only enrolled students
  * Exclude deactivated enrollments

---

## FR-013: Remove Student

* System must:

  * Deactivate enrollment
  * Not delete student

---

## FR-014: Create Group

* Teacher can:

  * Create group with stage + grade

---

## FR-015: Create Session

* Teacher can:

  * Create session under group

---

## FR-016: Start Session

* Teacher must manually start session

---

## FR-017: Attendance

* Teacher can:

  * Mark present / absent / late

---

## FR-018: Homework Creation

* Teacher can:

  * Add text or file

---

## FR-019: Review Submissions

* Teacher can:

  * View submissions per homework

---

# 5.3 Parent Module

---

## FR-020: Parent Account Creation

* System must:

  * Create User only

---

## FR-021: Add Child

* System must:

  * Create User (student)
  * Create Student profile

---

## FR-022: Link Teacher

* Parent enters invite code
* System links teacher ↔ parent

---

## FR-023: View Child Data

Parent can view:

* Attendance
* Homework
* Progress

---

# 5.4 Student Module

---

## FR-030: View Homework

* Student sees:

  * Assigned homework

---

## FR-031: Submit Homework

* Student can:

  * Submit text or file

---

# 6. 📊 Non-Functional Requirements

---

## 6.1 Performance

* API response < 300ms (avg)
* Attendance marking must be instant

---

## 6.2 Scalability

* Must support:

  * Thousands of students per teacher

---

## 6.3 Security

* JWT-based authentication
* Role validation on every request
* Data isolation per teacher

---

## 6.4 Data Integrity

* No hard deletes for:

  * enrollments
  * critical relations

---

# 7. 🔐 Authorization Rules

---

## Rule 1:

Teacher can only access:

* His students
* His groups
* His sessions

---

## Rule 2:

Parent can only access:

* His children

---

## Rule 3:

Student can only access:

* His own data

---

# 8. ⚙️ API Requirements (High-Level)

---

## Example: Create Child

POST `/children`

```json
{
  "name": "Ahmed",
  "stage": "SECONDARY",
  "grade": 3
}
```

---

## Example: Response

```json
{
  "id": 10,
  "name": "Ahmed",
  "education_stage": "SECONDARY",
  "education_year": 3,
  "grade_label": "الصف الثالث الثانوي"
}
```

---

# 9. 🧪 Validation Rules

---

## Student

* Must have:

  * parent_id
  * stage
  * grade

---

## Enrollment

* Cannot deactivate twice

---

## Session

* Cannot mark attendance before start

---

# 10. 🚨 Edge Cases

---

## Case 1: Student already deactivated

→ Throw error

---

## Case 2: Invalid grade

→ Reject request

---

## Case 3: Duplicate child

→ Prevent creation

---

# 11. 📦 Deployment Requirements

---

## Backend

* NestJS
* TypeORM
* PostgreSQL

---

## Frontend

* Next.js
* Mobile-first UI

---

# 12. 🔁 Migration Requirements

---

## Must include:

* Create:

  * teachers table
  * students table

* Migrate:

  * existing data from users

* Remove:

  * moved fields from users

---

# 13. ✅ Acceptance Criteria

---

## Teacher Flow

* Can create session ✔
* Can take attendance ✔
* Can assign homework ✔

---

## Parent Flow

* Can add child ✔
* Can link teacher ✔
* Can view progress ✔

---

## Student Flow

* Can view homework ✔
* Can submit ✔

---

# 14. ⚠️ Critical System Guarantees

---

## 1. No Data Loss

All deletions are soft (deactivation)

---

## 2. Clean Separation

* Auth → users
* Domain → profiles

---

## 3. Simple UX

If teacher struggles → system failed

