# 📘 Homework Feature — Full Product & UI/UX Guide

---

# 1. 🎯 Feature Overview

The Homework feature allows:

* Teachers to assign homework linked to a **group**
* Students (or parents) to submit responses
* The system to track:

  * Submission status
  * Late submissions
  * Missing work

---

# 2. 🧩 Core Entities (Conceptual)

Keep this mental model simple:

* **Homework**

  * Linked to → Group
  * Assigned to → Students

* **Submission**

  * Linked to → Homework + Student
  * Contains → answer, file, timestamp

---

# 3. 👩‍🏫 Teacher Flow

---

## 3.1 Entry Point

### From Session Card / Session Details

CTA:

* **"Add Homework"**

---

## 3.2 Add Homework Bottom Sheet (Mobile First)

### 📱 Layout

**Header**

* Title: "إضافة واجب"
* Close button

---

**Form (vertical, scrollable)**

1. **Title (Required)**

   * Input
   * Placeholder: "عنوان الواجب"

2. **Description (Optional)**

   * Multiline textarea
   * Placeholder: "وصف الواجب"

3. **Due Date (Optional but recommended)**

   * Date picker
   * Inline or bottom sheet

---

**Primary CTA**

* Button: **"إضافة واجب"**

---

## 3.3 UX Behavior

### Validation

* Title required
* Show inline error

---

### Session-based Messaging

* If session = upcoming:

  * Show banner:

    > "أنت تقوم بإضافة واجب قبل الحصة"

---

## 3.4 After Submission

* Toast: "تم إضافة الواجب بنجاح"
* Redirect:

  * Back to Session Details

---

## 3.5 Session Details Update

Add a section:

### 📚 Homework Section

Each homework card shows:

* Title
* Due date
* Submission stats:

  * Submitted / Late / Missing

CTA:

* "عرض الواجب"

---

# 4. 👨‍🎓 Student (or Parent) Flow

---

## 4.1 Entry Points

* Dashboard → **"واجباتي"**
* Session Details

---

## 4.2 Homework List (Mobile First)

### 📱 Layout

Each card:

* Title
* Due date
* Status badge:

  * 🔴 لم يتم التقديم
  * 🟡 تم التقديم
  * 🟠 متأخر
  * ⚫ مفقود

CTA:

* "فتح الواجب"

---

## 4.3 Homework Details Bottom Sheet

---

### 📱 Layout

**Header**

* Title
* Back

---

**Content**

* Title
* Description
* Due date

---

### Status Banner

* If not submitted:

  > "لم يتم التقديم"

* If late:

  > "متأخر"

---

### CTA

* Button:

  * **"تقديم الواجب"**
  * OR "تعديل التقديم" (if already submitted)

---

## 4.4 Submission Bottom Sheet

---

### 📱 Layout

**Fields**

1. **Answer (Optional)**

   * Multiline input

2. **Attachment (Optional)**

   * Upload:

     * Image
     * PDF

---

### Late Warning

If overdue:

> "سيتم تسجيل هذا الواجب كمتأخر"

---

### CTA

* **"تقديم الواجب"**

---

## 4.5 After Submission

* Toast: "تم تقديم الواجب بنجاح"

---

### Status Update

* On Homework:

  * 🟡 تم التقديم
  * 🟠 متأخر

---

# 5. 👩‍🏫 Teacher — Review Submissions

---

## 5.1 Submissions List Screen

From:

* Homework → "عرض التقديمات"

---

### 📱 Layout

List of students:

Each row:

* Student name
* Status badge:

  * ✅ تم التقديم
  * 🟠 متأخر
  * ❌ مفقود

CTA:

* "عرض التقديم"

---

## 5.2 Submission Details Bottom Sheet

* Student name
* Submission time
* Answer text
* Attachment preview/download

---

*(Grading can come later)*

---

# 6. ⏰ Status Logic (Core Business Rules)

---

## Submission Status

For each student:

### 1. Not Submitted

* No submission
* Before due date

---

### 2. Missing

* No submission
* After due date

---

### 3. Submitted

* Submission before due date

---

### 4. Late

* Submission after due date

---

---

## System Logic

```
IF submission exists:
    IF submitted_at > due_date → Late
    ELSE → Submitted
ELSE:
    IF now > due_date → Missing
    ELSE → Not Submitted
```

---

# 7. 🚫 Restrictions & Edge Cases

---

## Allowed

* Add homework:

  * Completed session ✅
  * In-progress session ✅
  * Upcoming session ⚠️ (with warning)

---

## Blocked

* Cancelled session ❌
* No students ❌

---

---

## Submission Rules

* One active submission per student
* Resubmission:

  * Allowed (overwrite for MVP)

---

# 8. 🔔 Notifications (Optional but Powerful)

---

## Student / Parent

* When homework assigned
* Reminder before due date
* Late warning

---

## Teacher

* When students submit (optional for MVP)

---

# 9. 🎯 Mobile UX Principles Applied

---

## 1. Thumb-Friendly Actions

* Primary CTA always bottom-aligned

---

## 2. Minimal Inputs

* Only:

  * Title
  * Optional fields

---

## 3. Clear Status Colors

* Red → Not submitted
* Orange → Late
* Green → Submitted
* Gray → Missing

---

## 4. No Dead Ends

Every screen has:

* Clear CTA
* Clear status

---

# 10. 🚀 Future Enhancements (Phase 2+)

---

* Grading system
* Comments/feedback
* File-only or text-only enforcement
* Multiple submissions history
* Homework templates
* Recurring homework for recurring sessions

---

# ⚖️ Final Product Decision Summary

* Keep it **flexible**
* Avoid strict blocking
* Focus on:

  * Visibility (status)
  * Simplicity (submission)
  * Speed (mobile UX)

