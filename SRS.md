# ⚙️ SRS — Software Requirements Specification

## Version: MVP v3.0

---

# 1. 🏗️ System Architecture

---

## 1.1 Architecture Style

* Monolithic backend (NestJS)
* PostgreSQL database
* REST API

---

## 1.2 System Type

* Shared database system
* NOT tenant-based
* Access controlled via relationships

---

# 2. 🗄️ Core Data Model

---

## 2.1 User

* id (UUID)
* role (teacher | parent | student)
* name
* phone (unique)

---

## 2.2 Student (CORE ENTITY)

* id
* name
* phone (nullable)
* parent_id (nullable)
* created_by (teacher | parent)

---

## 2.3 Group

* id
* teacher_id
* name
* price

---

## 2.4 Enrollment

* id
* student_id
* group_id

### Constraints:

* UNIQUE(student_id, group_id)

---

## 2.5 Attendance

* id
* student_id
* group_id
* date
* status

---

## 2.6 Payment

* id
* student_id
* group_id
* month (YYYY-MM)
* status

---

## 2.7 Homework

* id
* group_id
* title
* description
* pdf_url
* due_date
* created_at

---

## 2.8 Invite

* token
* group_id
* expires_at

---

# 3. 🔐 Authorization Model

---

## 3.1 Teacher Access Rule

Teacher can access only data where:

```sql
group.teacher_id = current_user_id
```

---

## 3.2 Student Access Rule

```sql
EXISTS (
  SELECT 1 FROM enrollments
  JOIN groups ON groups.id = enrollments.group_id
  WHERE enrollments.student_id = students.id
  AND groups.teacher_id = current_user_id
)
```

---

## 3.3 Parent Access Rule

```sql
students.parent_id = current_user_id
```

---

# 4. 🔐 Row Level Security (RLS)

---

## 4.1 Enabled Tables

* students
* groups
* enrollments
* attendance
* payments

---

## 4.2 Context Injection

```sql
SET app.current_user_id = '<user_id>';
SET app.current_user_role = '<role>';
```

---

## 4.3 Policy Strategy

* Use `EXISTS` with joins
* Never rely on direct ownership columns

---

# 5. 🔁 Student Matching & Linking Logic

---

## 5.1 Matching Priority

1. Phone number match
2. Manual confirmation
3. Create new student

---

## 5.2 Linking Flow

* If match found:

  * Prompt user
  * Link parent to student

---

## 5.3 Duplication Prevention

* Prefer phone uniqueness when available
* Allow manual merge in future

---

# 6. 📡 API Design (High-Level)

---

## Auth

* POST /auth/signup
* POST /auth/login

---

## Groups

* POST /groups
* GET /groups
* GET /groups/:id

---

## Students

* POST /students (teacher adds)
* GET /students (scoped)

---

## Attendance

* POST /attendance
* GET /attendance

---

## Payments

* POST /payments
* GET /payments

---

## Homework

* POST /homework
* GET /homework
* PATCH /homework/:id
* DELETE /homework/:id

---

## Invites

* POST /invites
* POST /invites/accept

---

# 7. ⚙️ Non-Functional Requirements

---

## Performance

* Attendance marking < 3 seconds
* Optimized queries with indexes

---

## Security

* RLS enforced
* Token-based invites
* Secure file upload (PDF only)

---

## Scalability

* Supports many-to-many relationships
* No student duplication

---

## Usability

* Mobile-first
* Minimal clicks for teacher actions

---

# 8. 🧪 Edge Cases

---

* Duplicate students
* Incorrect parent linking
* Student without parent
* Student with multiple teachers

---

# 9. 🧱 Indexing Strategy

---

* groups.teacher_id
* enrollments.student_id
* enrollments.group_id
* students.parent_id
* students.phone

---

# 🔥 Final System Insight

This system is:

> ❌ NOT tenant-based
> ✅ A **relationship-driven platform**

Where:

* Student = core identity
* Teacher = owns groups
* Parent = owns children
* Access = derived through relationships