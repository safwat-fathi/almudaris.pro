# 📄 BRD — Business Requirements Document

## Product: Al-Mudaris Pro (المدرس برو)

## Version: MVP v3.0 (Finalized Scope)

---

# 1. 🧭 Product Vision

Al-Mudaris Pro is a **teacher-first platform** designed for private tutors in Egypt to manage their daily operations efficiently while providing **structured visibility for parents across multiple children**.

---

# 2. 🎯 Objectives

* Simplify teacher workflows (attendance, payments, homework)
* Increase parent engagement and transparency
* Eliminate manual tracking (paper, WhatsApp chaos)
* Enable daily usage with minimal friction

---

# 3. 👥 Target Users

---

## 👨‍🏫 Teacher (Primary)

* Manages groups, students, attendance, payments, homework

---

## 👨‍👩‍👦 Parent (Secondary)

* Has **multiple students (children)**
* Tracks each child independently

---

## 👨‍🎓 Student (Secondary)

* Linked to a parent (optional)
* Can view personal academic data

---

# 4. 🧠 Core Product Principles

---

## 4.1 Unified Student Entity (CRITICAL)

* Student exists **once in the system**
* Can be:

  * Created by teacher
  * Created via parent invite
* Later **linked (NOT duplicated)**

---

## 4.2 Relationship-Based Access

* Teachers do NOT own students
* Access is derived via:

  * Groups
  * Enrollments

---

## 4.3 Parent Multi-Student Model

* Parent account contains multiple students
* Data is always scoped per student

---

## 4.4 Simplicity First

* Fast actions (attendance < 3 seconds)
* Minimal input required
* Mobile-first experience

---

# 5. 🧱 MVP Features

---

## 5.1 Authentication

### Teacher

* Signup / Login (phone/email)

### Parent / Student

* Join via **invite link only**

---

## 5.2 Groups Management

Teacher can:

* Create group
* Define monthly price
* Manage students

---

## 5.3 Student Management (UPDATED)

---

### Teacher Can:

* Add student manually:

  * Name (required)
  * Phone (optional but recommended)

---

### Parent Can:

* Create student via invite

---

### System Must:

* Avoid duplication
* Support linking:

👉 If student exists:

* Ask parent to confirm
* Link instead of creating new

---

## 5.4 Invitations System

* Unique link per group
* Handles:

  * Parent creation
  * Student creation
  * Student linking

---

## 5.5 Attendance

* Mark per student per date:

  * حاضر / غائب

---

## 5.6 Payments

* Monthly tracking:

  * Paid / Unpaid

---

## 5.7 📚 Homework (MVP)

### Teacher:

* Create homework:

  * Title
  * Description
  * PDF upload (optional)
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
* Students
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

---

### 👨‍🎓 Student Dashboard

* Personal view only

---

# 6. 🔁 User Flows

---

## Teacher Flow

1. Signup
2. Create group
3. Add or invite students
4. Manage:

   * Attendance
   * Payments
   * Homework

---

## Parent Flow

### First Child

* Open invite
* Create account
* Student created

---

### Additional Child

* Open invite
* System detects parent
* Add student to same account

---

### Linking Existing Student

* System detects match
* Parent confirms
* Student linked

---

## Student Flow

* Join via invite
* View data

---

# 7. 📊 Success Metrics

* Teacher activation rate
* Daily attendance usage
* Homework creation rate
* Parent engagement (multi-student usage)

---

# 8. 🚧 Out of Scope

* Online payments
* Homework submissions
* AI assistant
* Advanced notifications

---

# 9. 🚀 Future Vision

* Multi-teacher parent view
* AI assistant
* Payment integrations
* Smart attendance