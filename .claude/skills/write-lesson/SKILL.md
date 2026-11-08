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
- Courses in this order, each from its first topic: SQL for Data Engineering, then Backend (Python), then Databricks, then Web Dev.
  Data Engineering lessons arrive with each section of its rewrite (Moving Data first).
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
  It runs on sql.js through a T-SQL layer: TOP, OFFSET/FETCH, ISNULL, LEN, CHARINDEX, LEFT, RIGHT, YEAR, MONTH, DAY, DATEPART, DATEADD, DATEDIFF, EOMONTH, DATEFROMPARTS, GROUP BY ROLLUP / CUBE / GROUPING SETS (run as the UNION ALL of the grouping sets: bare grouping columns and aliased `GROUPING(col)` in the select list, only `ORDER BY` after, and order by the alias rather than `GROUPING()`), and a line holding only `GO` separates batches (CREATE VIEW needs one before and after it).
  Procedural T-SQL runs too (`scripts/tsql-batch.js`): DECLARE / SET / PRINT, IF / ELSE, WHILE, BEGIN TRAN / COMMIT / ROLLBACK / SAVE TRAN, @@TRANCOUNT, SET XACT_ABORT, XACT_STATE(), TRY ... CATCH with THROW and ERROR_NUMBER() / ERROR_MESSAGE(), CREATE PROCEDURE with OUTPUT parameters and RETURN codes, EXEC, and scalar CREATE FUNCTION (a procedure or function alone in its batch, between `GO` lines).
  PRINT lines appear in `output` in order with the result sets, consecutive PRINT lines as one block.
  Variables are INT, BIT, VARCHAR or DATE; catch every error you raise, since an uncaught one is refused, and print `ERROR_NUMBER()` rather than `ERROR_MESSAGE()` for an engine error such as a CHECK violation.
  Isolation levels and table hints are accepted but change nothing in one session, so describe the second session in the steps.
  Window functions run natively; avoid `AVG` over integers, which SQLite returns as a decimal where SQL Server truncates.
  GETDATE, CAST to date types, FORMAT, CONVERT, `+` on strings, #temp tables, MERGE, PIVOT and UPDATE ... FROM are refused; name them in the idea or the form instead.
  An `UPDATE` with any `FROM` in it, a subquery's included, counts as UPDATE ... FROM.
  `IDENTITY` is not emulated and leaves the column NULL, so give keys already assigned in `tables` and leave generated keys out of the printed columns.
  Keep numbers integers (SQLite prints `12.5` where SQL Server prints `12.50`).
- Python: plain `print` output; it runs on `python3 -I`.
  A Django / DRF example cannot run without a project: set `runs: false` (allowed only when the code imports `django` or `rest_framework`), say in a first-line comment what project and model it assumes, and verify `output` by hand.
  A GitHub Actions workflow cannot run without a runner either: keep `language: CodeLanguage.PYTHON` as the bank's CI/CD questions do, set `runs: false` (allowed only when the code has top-level `on:` and `jobs:` and a job's `runs-on:`), and make `output` the lines its `run` steps print, verified by hand.
  An Nginx config cannot run without a server: keep `language: CodeLanguage.PYTHON` as the bank's Nginx questions do, set `runs: false` (allowed only when the code has a top-level `server {` block with a `listen` directive and a `location ... {` block), and make `output` what Nginx does with requests the first-line comment lists, verified by hand.
  A Databricks notebook cell cannot run without a workspace: keep `language: CodeLanguage.PYTHON`, put SQL in `spark.sql(...)`, set `runs: false` (allowed only when the code calls the notebook's own `spark` or `dbutils` without creating them, or imports `databricks.sdk`), say in a first-line comment what catalog, schema or secret scope it assumes, and make `output` what the cell prints on current Databricks (Unity Catalog, Delta Lake 3+), verified by hand.
- JavaScript: plain `console.log` output; it runs as a CommonJS script on node (`node -e`, an empty environment apart from `PATH`, 10 s timeout), and node waits for its promises and timers, so what they log is checked too, in the order the event loop prints it.
  An uncaught error or an unhandled rejection fails the run, so catch what the example throws.
  Keep it to the language and node's globals: code that needs the DOM (`document`, `window`, `localStorage`) belongs in an HTML example with a `<script>`, below.
- TypeScript: the same `console.log` output, and it runs the same way once it compiles: the checker type-checks it with the app's installed `typescript` in strict mode (ES2022 library and node's types, no DOM), fails on any type error, then transpiles it and runs it as JavaScript.
  So an example cannot show a line that does not compile: name the error a wrong line would give in a step or in the pitfall instead.
  Keep to what the installed version checks; a newer feature (a const type parameter, standard decorators) goes in the idea, not the example.
- HTML / CSS (Tailwind included) cannot run without a browser: use `CodeLanguage.HTML` or `CodeLanguage.CSS`, set `runs: false` (allowed only for those languages, when the code holds a paired element or a CSS rule), make `output` what the rendered page shows (the text, or the values the steps name), and confirm it by rendering the example in headless Chromium against current versions (Tailwind 4).
- React cannot run without a project (the React packages and a JSX compiler): use `CodeLanguage.JSX`, import what the example uses from `react` (or `react-dom` / `react-router`), set `runs: false` (allowed only for JSX that imports React and holds a JSX element), make `output` what the rendered component shows and logs after the interactions the steps name, and confirm it by rendering the example with current React (19) and Testing Library in jsdom, or in headless Chromium.
  Teach function components and hooks; class components appear only as what learners will still meet (an error boundary is the one place a class is still required).
  These kinds live in one list, `NON_RUNNABLE_KINDS` in `app/src/utils/workedKinds.ts`; a new kind is added there, kept as narrow, with a case in `checkLessons.test.ts`.
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
