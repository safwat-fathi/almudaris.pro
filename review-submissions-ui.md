# 📱 2. UI/UX GUIDE — Reviewing Submissions (Mobile First)

## 🎯 UX Goal

> “Grade all students in the fastest possible time with minimal thinking.”

---

## 🧱 Screen Layout

### 1. Sticky Header

**Content:**

* Homework title
* Stats:

  * `12 / 20 تم التسليم`
  * `5 تحت المراجعة`
  * `3 متأخر`
  * `0 لم يتم التسليم`

---

### 2. Filter Tabs (Critical)

Horizontal scroll:

* الكل
* تحت المراجعة (افتراضي)
* تم التسليم
* لم يتم التسليم
* تم التقييم

---

## 🧑‍🎓 3. Submission List (Core UX)

Each item = **Student Card**

---

## 📦 Student Card Design

### Top Row

* Student name
* Status badge:

  * 🟢 تم التسليم
  * 🟡 متأخر
  * ⚪ لم يتم التسليم
  * 🔵 تم التقييم

---

### Middle

* Time of submission
* Preview:

  * Preview image or pdf
  * Text snippet

---

### Bottom (Actions)

Primary button:

* ⭐ تقييم

Secondary:

* 👁 عرض

👉 Buttons must be:

* Large
* Thumb-friendly
* One-tap actions

---

## ⚡ Interaction Flow

---

## 1. Tap Card → Bottom Sheet

NOT a new page.

---

## Bottom Sheet Structure

### Section 1: Content

* Full preview (image/pdf/text)

---

### Section 2: Actions (Sticky Bottom)

* Grade selector
* Feedback input
* Mark as reviewed

---

## ⭐ Grade UX (MOST IMPORTANT)

Avoid typing.

### Option 1: Presets

* ممتاز
* جيد
* يحتاج مراجعة

### Option 2: Numeric Chips

* 10 / 10
* 8 / 10
* 5 / 10

👉 One tap = done

---

## 💬 Feedback UX

* Quick templates
* Optional short input

👉 No long typing

---

## 🔁 After Action Behavior

After grading:

* Auto close sheet

---

## 🧠 Key UX Principles

---

### 1. Default = “Pending Review”

Teacher should not search.

---

### 2. Preview First

Teacher decides without opening.

---

### 3. No Dead Ends

Every tap:

* either acts
* or opens actionable sheet

---

### 4. Minimize Typing

Prefer:

* taps
* presets
* chips

---

### 5. Stay in Context

* Use bottom sheets
* Avoid navigation

---

## ⚠️ Edge States

---

### No submissions

* “No one submitted yet”
* CTA: “تذكير الطلاب”

---

### All done

* “تم مراجعة جميع التقييمات 🎉”

---

### Late submission

* Highlight badge
* Show delay

---

## ❌ UX Anti-Patterns to Avoid

* Deep navigation
* Full-page forms
* Tiny buttons
* Requiring typing for grading
* Hidden actions

---

# 🧱 Final Alignment (Product + Tech)

This system works because:

### Backend:

* Prepares everything
* Reduces frontend logic

### Frontend:

* Focuses on speed + actions

---

# 🔥 Final Product Insight

If implemented correctly, the experience becomes:

> **Scroll → Tap → Grade → Next → Done**

That’s your north star.

