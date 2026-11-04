---
name: write-lesson
description: Draft a topic's lesson (rule card, worked example, 3-5 exercises in ramp order) from its existing questions, then check it with check-lessons.js
---

# Write Lesson

A lesson teaches one topic before its ramp, the way the poker trainer teaches a concept: a rule card (the idea, the form, the one pitfall, a worked example), then 3-5 of the topic's existing questions as exercises, then the ramp and review go on as usual.
Lessons are data beside the bank (`TopicLesson` in `app/src/types/index.ts`), in `app/src/data/lessons/<course>Lessons.ts`, listed in `app/src/data/lessons/index.ts`.
No question and no ordered bank changes.

## Usage

```bash
/write-lesson <topic>             # draft the lesson of one topic
/write-lesson section <section>   # every topic of a section, in path order
```

## Order of work

- One lesson per topic for now; large topics are split into steps (`step` 2..n) later.
- Courses in this order, each from its first topic: SQL for Data Engineering, then Backend (Python), then Databricks.
- One section per PR: the owner reviews a section at a time.
  Finish the section in path order before the next.

## Pipeline

`gather -> pick exercises -> write the rule card -> write and run the worked example -> check -> look at it in the app`

### 1. Gather what the topic already says

All from `app/`:

```bash
node scripts/lesson-material.js <topic>          # questions in ramp order, explanations, hints, signatures
node scripts/lesson-material.js <topic> --brief  # one line per question
```

Also read the topic's primitive inventory (`/construct-topic <topic>`, or its coverage doc when one exists).
The explanations already hold most of the ideas; writing a lesson is mostly selection and compression, not new teaching.

### 2. Pick 3-5 exercises

- Take them top to bottom from `lesson-material.js`: ramp order is `rampRank` (beginner -> intermediate -> advanced, then MCQ -> predict -> parsons -> cloze -> coding), ties in bank order.
- At least one multiple choice and one predict output.
- Never a cold write (`coding`) first; one cold write last is good when the topic has a beginner or intermediate one.
- Prefer cards marked `RAMP`, and beginner cards; the rest of the ramp follows in the sessions.
- Cover the primitives the rule card names, one exercise per primitive where possible.
- When the topic has no predict-output question, add one first with `/add-question` (its own PR step), rather than weakening the rule.

### 3. Write the rule card

| Field | What goes in it |
|---|---|
| `title` | The courseConfig unit's display name, unchanged |
| `idea` | 2-4 short paragraphs: what the construct does, its parts, how it behaves at the edges |
| `form` | The shape of the construct as code with `--` / `#` comments, generic names (`t`, `col`, `name(args)`), never an exercise's answer |
| `pitfall` | The one mistake the topic's misses and distractors show most, and what to do instead |

House rules (check-lessons.js enforces the first two):
- One sentence per source line: build each paragraph with `lines("First.", "Second.")`.
- No em dashes; use a plain hyphen or rephrase.
- Inline code in backticks; plain words a learner of this topic already knows.
- About 150-250 words for the whole card.

### 4. Write the worked example

- 6-15 lines of code that use the topic's main primitives together, with 3-5 `steps`, each naming the line it explains ("Line 3: ...").
- A different domain from the exercises (the bank uses DimProduct, DimCustomer, FactOrders; lessons use small library and bookshop tables), so it never repeats an exercise's solution.
- SQL: give the input in `tables` (shown above the code), unqualified table names, and an `ORDER BY` on every statement that returns more than one row.
  It runs on sql.js through a T-SQL layer: TOP, OFFSET/FETCH, ISNULL, LEN, CHARINDEX, LEFT, RIGHT, YEAR, MONTH, DAY, DATEPART, DATEADD, DATEDIFF, EOMONTH, DATEFROMPARTS, and a line holding only `GO` separates batches (CREATE VIEW needs one before and after it).
  GETDATE, CAST to date types, FORMAT, CONVERT, `+` on strings, #temp tables, MERGE and UPDATE ... FROM are refused; name them in the idea or the form instead.
  Keep numbers integers (SQLite prints `12.5` where SQL Server prints `12.50`).
- Python: plain `print` output; it runs on `python3 -I`.
- Set `output` to exactly what the code prints (SQL: `col | col` header and rows, a blank line between result sets).
  Run the checker to get it, then read it and confirm every value by hand against the steps.

### 5. Check

```bash
node scripts/check-lessons.js <topic>   # this topic
node scripts/check-lessons.js           # all lessons (also part of npm test)
```

It fails on: exercise ids unknown, of another topic, out of ramp order, missing an MCQ or a predict, or a cold write first; a worked example that does not run or prints something else; a worked example holding an exercise's solution (verbatim, or 80%+ of its tokens); two sentences on one line; an em dash.
A `MED` token warning (55-80%) usually means shared keywords only; check the exercise and rename the example's tables or columns if it is closer than that.

### 6. Look at it

Run the app (`/run`), open the course as a new learner, and read the rule card, one exercise with the side panel, and Progress -> Topics.
Then `/verify` and `/ship`.

## Wiring

- New course file: export `<course>Lessons` and spread it into `LESSONS` in `app/src/data/lessons/index.ts`, in course order.
- Nothing else: the App gate, the path steps and Progress read `LESSONS`.
- A lesson counts as met once completed or once any of its exercises was answered, so existing learners are credited, not forced.
