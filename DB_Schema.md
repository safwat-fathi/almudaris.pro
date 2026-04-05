# 🧱 1. Core Tables (Final Schema)

---

## 👤 users

```sql
users (
  id UUID PK,
  role TEXT CHECK (role IN ('teacher', 'parent', 'student')),
  name TEXT NOT NULL,
  phone TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT now()
)
```

👉 Notes:

* Phone is **critical for matching**
* Student login is optional → `role = 'student'` rarely used in MVP

---

## 👦 students (CORE ENTITY)

```sql
students (
  id UUID PK,
  name TEXT NOT NULL,
  phone TEXT, -- optional but used for matching
  parent_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
  created_by TEXT CHECK (created_by IN ('teacher', 'parent')),
  created_at TIMESTAMP DEFAULT now()
)
```

👉 This is your **single source of truth**

---

## 👨‍🏫 groups

```sql
groups (
  id UUID PK,
  teacher_id UUID NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  created_at TIMESTAMP DEFAULT now()
)
```

---

## 🔗 enrollments

```sql
enrollments (
  id UUID PK,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE (student_id, group_id)
)
```

👉 Enables:

* Student in multiple groups
* Student across multiple teachers

---

## 📅 attendance

```sql
attendance (
  id UUID PK,
  student_id UUID NOT NULL REFERENCES students(id),
  group_id UUID NOT NULL REFERENCES groups(id),
  date DATE NOT NULL,
  status TEXT CHECK (status IN ('present', 'absent')),
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE (student_id, group_id, date)
)
```

---

## 💰 payments

```sql
payments (
  id UUID PK,
  student_id UUID NOT NULL REFERENCES students(id),
  group_id UUID NOT NULL REFERENCES groups(id),
  month TEXT NOT NULL, -- format: YYYY-MM
  status TEXT CHECK (status IN ('paid', 'unpaid')),
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE (student_id, group_id, month)
)
```

---

## 📚 homework

```sql
homework (
  id UUID PK,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  pdf_url TEXT,
  due_date DATE,
  created_at TIMESTAMP DEFAULT now()
)
```

---

## 🔗 invites

```sql
invites (
  token TEXT PK,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now(),
  expires_at TIMESTAMP
)
```

---

# 🔗 2. Relationships (Mental Model)

---

## Core Graph:

```text
User (Teacher)
   ↓
 Group
   ↓
 Enrollment
   ↓
 Student
   ↑
 Parent (User)
```

---

## Key Points:

* Teacher → owns groups
* Group → contains students
* Student → shared entity
* Parent → owns students

---

# 🔐 3. Critical Constraints & Indexes

---

## 🔑 Unique Constraints

```sql
UNIQUE (student_id, group_id)
UNIQUE (student_id, group_id, date)
UNIQUE (student_id, group_id, month)
```

---

## ⚡ Indexes (VERY IMPORTANT for RLS)

```sql
CREATE INDEX idx_groups_teacher ON groups(teacher_id);

CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_group ON enrollments(group_id);

CREATE INDEX idx_students_parent ON students(parent_id);
CREATE INDEX idx_students_phone ON students(phone);

CREATE INDEX idx_attendance_group ON attendance(group_id);
CREATE INDEX idx_payments_group ON payments(group_id);
```

---

# 🔐 4. RLS-Ready Design

---

## Why This Schema Works Perfectly with RLS

Because ALL access can be derived via:

```text
teacher → groups → enrollments → students
```

---

## Example Policy Logic

### Teacher access:

```sql
groups.teacher_id = current_user_id
```

---

### Student access:

```sql
EXISTS (
  SELECT 1 FROM enrollments
  JOIN groups ON groups.id = enrollments.group_id
  WHERE enrollments.student_id = students.id
  AND groups.teacher_id = current_user_id
)
```

---

### Parent access:

```sql
students.parent_id = current_user_id
```

---

# 💡 5. Critical Design Decisions (Why This Is Correct)

---

## ✅ No tenant_id anywhere

Because:

* Students are shared
* Parents span multiple teachers
* You avoid duplication

---

## ✅ Student is independent entity

* Not owned by teacher
* Not owned by parent
* Only linked

---

## ✅ Enrollment is the core connector

Everything depends on it:

* Access
* Queries
* Relationships

---

## ✅ Minimal but extensible

You can later add:

* homework_submissions
* notifications
* analytics

Without breaking schema

---

# ⚠️ 6. Edge Cases Covered

---

## Duplicate Students

* Handled via:

  * phone matching
  * future merge support

---

## Student without parent

* `parent_id = NULL` ✅

---

## Student in multiple teachers

* Supported via enrollments ✅

---

## Parent with multiple students

* Supported ✅

