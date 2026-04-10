# 📄 BRD — Business Requirements Document

## Product: Al-Mudaris Pro (المدرس برو)

## Version: MVP v3.1 (Invitation & Student Model Finalized)

---

# 1. 🧭 Product Vision

Al-Mudaris Pro is a **teacher-first platform** designed for private tutors in Egypt to manage their daily operations efficiently while providing **structured visibility for parents across multiple children and multiple teachers**.

---

# 2. 🎯 Objectives

* Simplify teacher workflows (attendance, payments, homework)
* Increase parent engagement and transparency
* Eliminate manual tracking (paper, WhatsApp chaos)
* Enable daily usage with minimal friction
* Ensure **clean student identity across multiple teachers**

---

# 3. 👥 Target Users

---

## 👨‍🏫 Teacher (Primary)

* Manages groups, students, attendance, payments, homework

---

## 👨‍👩‍👦 Parent (Primary Relationship Owner)

* Has **multiple students (children)**
* Manages and confirms student identity
* Can connect children to multiple teachers

---

## 👨‍🎓 Student (Core Entity)

* Linked to a parent
* Can be linked to **multiple teachers**
* Has a single unified identity in the system

---

# 4. 🧠 Core Product Principles

---

## 4.1 Unified Student Entity (CRITICAL)

* Student exists **once in the system**
* Created via:

  * Parent (primary source of truth)
  * Teacher (as *pending only*)
* Must NEVER be duplicated
* Can be linked to multiple teachers

---

## 4.2 Relationship-Based Access

* Teachers do NOT own students
* Students are linked to teachers via relationships
* A student can have **multiple teachers simultaneously**

---

## 4.3 Parent Ownership Model (CRITICAL)

* Parent is the **owner of student identity**
* Only parent can:

  * Confirm student data
  * Resolve duplicates
  * Finalize student-teacher relationships

---

## 4.4 Pending → Active Lifecycle

* Students created by teachers are:

  * 🟡 **Pending (unverified)**
* Students confirmed by parent become:

  * 🟢 **Active (verified)**

---

## 4.5 Simplicity First

* Fast actions (attendance < 3 seconds)
* Minimal required inputs
* Mobile-first experience

---

# 5. 🧱 MVP Features

---

## 5.1 Authentication

### Teacher

* Signup / Login (phone)

### Parent

* Signup / Login (phone)

### Student

* Signup / Login (optional, secondary)

---

## 5.2 Groups Management

Teacher can:

* Create / Edit / Delete group
* Define monthly price
* Add / manage students

---

## 5.3 Student Management (FINAL MODEL)

---

## 👨‍🏫 Teacher Capabilities

### 1. Quick Add Student (NEW - CRITICAL)

Teacher can **quickly add a student** for immediate usage:

Required:

* Student Name
* Parent Phone

Optional:

* Student Phone

---

### ⚠️ Result:

* System creates:

  * 🟡 **Pending Student**
* Student is:

  * Temporarily linked to teacher
  * Not fully verified

---

### 2. Invite Parent

* Teacher has a unique invitation link
* Parent completes setup and confirms student

---

## 👨‍👩‍👦 Parent Capabilities

### Parent Can:

* Create student manually
* Add multiple students
* Link students to multiple teachers

---

## 🔁 System Responsibilities

### During Parent Flow:

System must:

* Detect existing parent account
* Detect existing students
* Prevent duplication

---

### Parent Decision Required:

When parent opens invite:

* Select existing student OR
* Create new student OR
* Merge duplicate student

---

### Final Outcome:

* Student becomes:

  * 🟢 Active
* Relationships established:

  * Parent ↔ Student
  * Student ↔ Teacher

---

## 5.4 Invitations System (UPDATED)

---

### Invitation Types:

#### 1. Parent Invitation via QR Code or Link (Primary) **(Parent must be already registered)**

* Sent by teacher
* Used to:

  * Link parent account to teacher 
  * Confirm relationship

---

## 5.5 Attendance

* Mark per student per session:

  * حاضر / غائب

* Works for:

  * Pending students
  * Active students

---

## 5.6 Payments

* Monthly tracking:

  * Paid / Unpaid

* (Optional constraint):

  * Full payment tracking enabled after student becomes Active

---

## 5.7 📚 Homework (MVP)

### Teacher:

* Create homework:

  * Title
  * Description
  * PDF/Image upload (optional)
  * Due date

* Edit / Delete

---

### Parent / Student:

* View homework

---

## 5.8 Dashboards

---

### 👨‍🏫 Teacher Dashboard

* Groups
* Students:

  * Show status:

    * 🟡 Pending
    * 🟢 Active
* Attendance
* Payments
* Homework

---

### 👨‍👩‍👦 Parent Dashboard

* Student switcher
* Per student:

  * Attendance
  * Payments
  * Homework
  * Teachers list (multi-teacher support)

---

### 👨‍🎓 Student Dashboard

* Personal academic data only

---

# 6. 🔁 User Flows (UPDATED)

---

## 👨‍🏫 Teacher Flow

1. Signup

2. Create group

3. Add students via:

   * Quick Add (Pending)
   * Invite Parent (QR Code or Link) then parent can link existing student to teacher
4. Manage:

   * Attendance
   * Payments
   * Homework

---

## 👨‍👩‍👦 Parent Flow

---

### Case 1: New Parent

1. Register

2. System shows:

   * Pending student OR empty state

3. Parent:

   * Confirms student OR
   * Creates new student

4. Student becomes Active

---

### Case 2: Existing Parent

1. Open invite

2. Login

3. System shows:

   * Existing students
   * Pending student (if exists)

4. Parent chooses:

   * Link existing student OR
   * Create new student OR
   * Merge duplicate

5. Link existing student to teacher

---

## 👨‍🎓 Student Flow

* (Optional in MVP)
* Created by parent only
* Login
* View academic data

---

# 7. 📊 Success Metrics

* Teacher activation rate
* Quick Add usage rate
* Parent claim rate (VERY IMPORTANT)
* Duplicate resolution success rate
* Daily attendance usage
* Parent engagement (multi-student + multi-teacher)

---

# 8. 🚧 Out of Scope

* Online payments
* Homework submissions
* AI assistant
* Advanced notifications
* Full student self-registration flow

---

# 9. 🚀 Future Vision

* Multi-teacher unified parent dashboard
* Student self-managed accounts
* AI assistant for teachers
* Payment integrations
* Smart attendance insights
* Automated duplicate detection & merging