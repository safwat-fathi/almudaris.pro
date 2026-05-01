# 📄 Grade System Standardization (Egypt)

## Al-Mudaris Pro — Product & Technical Spec

---

# 1. 🎯 Objective

Standardize how **student academic level (grade/year)** is:

* Stored in DB
* Displayed in UI
* Used across features (groups, sessions, homework, filtering)

👉 This is a **core identity field** in the Egyptian education context.

---

# 2. 🧠 Product Decision (Final)

## ✅ Canonical Naming (User-Facing)

### Use:

> **الصف الدراسي**

### Display Format:

> الصف + {year} + {stage}

#### Examples:

* الصف الأول الابتدائي
* الصف الثاني الإعدادي
* الصف الثالث الثانوي

---

## ❌ Avoid:

* “Class”
* “Level”
* “Grade” (in UI)
* Raw numbers (e.g., “Grade 3”)

---

# 3. 🏗 Data Model (Backend)

## ✅ Structure

```ts
enum EducationStage {
  PRIMARY = 'PRIMARY',     // ابتدائي
  PREPARATORY = 'PREPARATORY', // إعدادي
  SECONDARY = 'SECONDARY', // ثانوي
}

@Entity('students')
class Student {
  id: number;

  @Column({
    type: 'enum',
    enum: EducationStage,
  })
  stage: EducationStage;

  @Column({ type: 'int' })
  grade: number; // 1 | 2 | 3 | 4 | 5 | 6 (depending on stage)
}
```

---

## ✅ Valid Combinations

| Stage       | Grade Range |
| ----------- | ----------- |
| PRIMARY     | 1 → 6       |
| PREPARATORY | 1 → 3       |
| SECONDARY   | 1 → 3       |

---

## ❗ Validation Rule (IMPORTANT)

```ts
if (stage === 'PRIMARY' && grade > 6) throw Error
if (stage !== 'PRIMARY' && grade > 3) throw Error
```

---

## ❌ Do NOT do this:

```ts
grade: "third"
grade: "3rd secondary"
grade: "الصف الثالث الثانوي"
```

👉 Keep DB **structured, not localized strings**

---

# 4. 🔁 Mapping Layer (Critical)

## Backend Helper

```ts
function formatGrade(stage: EducationStage, grade: number): string {
  const gradeMap = {
    1: 'الأول',
    2: 'الثاني',
    3: 'الثالث',
    4: 'الرابع',
    5: 'الخامس',
    6: 'السادس',
  };

  const stageMap = {
    PRIMARY: 'الابتدائي',
    PREPARATORY: 'الإعدادي',
    SECONDARY: 'الثانوي',
  };

  return `الصف ${gradeMap[grade]} ${stageMap[stage]}`;
}
```

---

## Output Examples

```ts
formatGrade(SECONDARY, 3)
// الصف الثالث الثانوي

formatGrade(PREPARATORY, 2)
// الصف الثاني الإعدادي
```

---

# 5. 🎨 UI/UX Guidelines

## 5.1 Student Creation Flow (Mobile First)

### Step 1 — Select Stage:

* ابتدائي
* إعدادي
* ثانوي

---

### Step 2 — Select Grade:

Dynamic based on stage:

#### If PRIMARY:

* الصف الأول → السادس

#### If PREPARATORY / SECONDARY:

* الصف الأول → الثالث

---

### Step 3 — Preview (Important UX)

Show:

> 📘 الصف الثالث الثانوي

👉 Confirms selection visually

---

## 5.2 Display Rules

Always show **full formatted string**, never partial.

### ✅ Correct:

* الصف الثاني الإعدادي

### ❌ Wrong:

* الصف الثاني
* تانية بس
* 2 Prep

---

# 6. 📦 Where It Must Be Used

## Required in:

### 👨‍🏫 Teacher Side

* Student list
* Groups
* Sessions
* Homework assignment
* Filtering

---

### 👨‍👩‍👧 Parent Side

* Child card
* Progress tracking
* Homework view

---

### 📊 Filters (Critical for usability)

Allow filtering by:

* Stage
* Grade
* Combined (recommended)

---

# 7. 🧱 Impact on Existing System

## Required Changes

### 1. DB Migration

If currently:

```ts
grade: string
```

👉 Migrate to:

```ts
stage: enum
grade: number
```

---

### 2. Data Migration Script

Example:

| Old قيمة            | stage       | grade |
| ------------------- | ----------- | ----- |
| الصف الثالث الثانوي | SECONDARY   | 3     |
| تانية اعدادي        | PREPARATORY | 2     |

---

### 3. API Changes

#### Request:

```json
{
  "stage": "SECONDARY",
  "grade": 3
}
```

#### Response:

```json
{
  "stage": "SECONDARY",
  "grade": 3,
  "grade_label": "الصف الثالث الثانوي"
}
```

---

# 8. 🚀 Future-Proofing

This model allows:

* Adding international systems later
* Supporting IG / American Diploma
* Analytics (students per stage)
* Pricing per grade

---

# 9. 🧩 Product Decisions Summary

| Decision                      | Status  |
| ----------------------------- | ------- |
| Use “الصف الدراسي”            | ✅ Final |
| Structured DB (stage + grade) | ✅ Final |
| UI shows full Arabic label    | ✅ Final |
| Grade is required             | ✅ Final |
| Dynamic selection UI          | ✅ Final |

---

# 10. ⚠️ Key Takeaways

* This is **not just a field** → it drives grouping, pricing, UX
* Egyptian users rely heavily on it
* Must be **simple in UI, structured in DB**

