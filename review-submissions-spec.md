# 📘 1. TECHNICAL SPEC — Reviewing Submissions

## 🎯 Objective

Enable teachers to:

* View all submissions for a homework
* Quickly identify pending work
* Perform fast actions:

  * Grade
  * Mark as reviewed
  * Add feedback

---

## 🧩 Core Entities

### Submission (Central Entity)

```ts
Submission {
  id: number
  homework_id: number
  student_id: number

  // Review state
  review_status: 'pending' | 'reviewed'

  // Evaluation
  grade?: number
  feedback_text?: string

  created_at: Date
  updated_at: Date
}
```

---

## 🧠 State Logic

### Submission Status

| Condition            | Status          |
| -------------------- | --------------- |
| No submission        | `not_submitted` |
| Submitted before due | `submitted`     |
| Submitted after due  | `late`          |

---

### Review Status

| Condition                  | Status     |
| -------------------------- | ---------- |
| No teacher action          | `pending`  |
| Teacher reviewed or graded | `reviewed` |

---

### Derived Flags (Computed in BE)

```ts
is_graded = grade !== null
needs_review = submission_status !== 'not_submitted' && review_status === 'pending'
```

---

## 🔌 API Design

---

## 1. Get Submissions List (Main Screen)

### Endpoint

```
GET /homeworks/:id/submissions
```

### Query Params

* `status` → `all | submitted | not_submitted | graded | pending`
* `page`
* `limit`

---

### Response

```json
{
  "data": [
    {
      // ...
      "grade": null,
      "feedback_text": null
    }
  ],
  "meta": {
    "total": 30,
    "submitted": 20,
    "graded": 10,
    "pending": 10
  }
}
```

---

## 2. Get Single Submission (Details)

```
GET /submissions/:id
```

Returns full content (not just preview).

---

## 3. Grade Submission

```
PATCH /submissions/:id/grade
```

```json
{
  "grade": 8
}
```

### Rules:

* Automatically sets:

  * `review_status = reviewed`

---

## 4. Mark as Reviewed

```
PATCH /submissions/:id/review
```

```json
{
  "review_status": "reviewed"
}
```

---

## 5. Add Feedback

```
PATCH /submissions/:id/feedback
```

```json
{
  "feedback_text": "Good job"
}
```

---

## 6. Bulk Actions (Optional MVP+)

```
PATCH /submissions/bulk
```

```json
{
  "submission_ids": [1,2,3],
  "action": "mark_reviewed"
}
```

---

## ⚙️ Backend Responsibilities

### 1. Preview Generation

* Enable Image & PDF preview
* Extract first lines for text

---

### 2. State Enforcement

* Prevent invalid transitions

  * e.g. grading non-submitted

---

### 3. Performance

* Indexed by:

  * `homework_id`
  * `submission_status`
  * `review_status`

---

### 4. Pagination

* Required for scalability
* Default limit: 10–20


