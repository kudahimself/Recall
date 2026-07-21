---
name: audit-questions
description: Quality review across topic/course - runs all leak checks, validates structure, finds gaps
---

# Audit Questions

Quality review tool for existing questions. Run on a topic, course, or entire codebase.

## Usage

```bash
/audit-questions <topic>              # single topic (e.g., PY_BASICS)
/audit-questions --course <course>    # entire course (webdev, backend, databricks, data_eng)
/audit-questions --all                # full codebase audit
```

## Checks performed

### 1. Leak detection (all scripts)

From `app/`:
- `node scripts/check-leaks.js` - starter leaks, all courses. Auto-routes per question:
  - **Lane A** (comment-only starter, e.g. the SQL course): uncomments and flags starters that reproduce the solution verbatim (`verbatim-solution`) or reveal its distinctive tokens (`recall=`). This replaces the retired `check-commented-solution.js`.
  - **Lane B** (real-code scaffolding, e.g. Web Dev / Next.js / Python): stripped-char ratio of non-comment code.
- `node scripts/check-prompt-leaks.js` - prompt leaks solution
- `node scripts/check-starter-leaks-webdev.js` - webdev-specific patterns

**Action threshold:** HIGH tier (Lane A `verbatim-solution` or recall ≥0.80; Lane B ratio ≥0.70)
**Review threshold:** MED tier (often false positives on intent-prose/config-artifact starters)

### 2. Reserved-word identifiers

Scan for: `date`, `name`, `status`, `type` in variable names, field names, function names.

**Exception:** When these are domain-appropriate (e.g., datetime operations legitimately use "date")

### 3. MCQ distractor length parity

All options in MCQ should have similar character counts.
"Longest option = correct" is common authoring failure.
Detection: `node scripts/check-mcq-distractor-length.js` (also reports per-file positional bias).
Fixing flags is its own workflow - invoke `/audit-mcq` (strengthen distractors into real misconceptions; never pad).

### 4. Prompt quality

- **Context:** does prompt provide necessary background (file names, data structure, expected output)?
- **No repetition:** avoid restating what code already shows
- **Output expectations:** if asserting on printed output, prompt must say "print the result"

### 5. Ordered bank completeness (Web Dev / Backend)

For Web Dev / Backend courses:
- Every question in topic file should appear in ordered bank
- Every ID in ordered bank should exist in topic file
- Run `scripts/check-ordered-strays.js` to find mismatches

**Gotcha:** topic-file spreads in `questions.ts` resurrect questions dropped from ordered banks.
Drops must be physical deletions.

### 6. Difficulty ramp validation

Per topic:
- Beginner questions introduce ONE primitive each
- Intermediate combine TWO already-introduced primitives
- Advanced use 3+ primitives in realistic scenarios

Flag violations where:
- Beginner introduces multiple new concepts
- Intermediate introduces (not combines)
- Advanced uses scaffolded prompts with code comments naming functions

## Output format (AXI-compliant, TOON-style)

```
Topic: PY_BASICS (43 questions)
─────────────────────────────

Leak violations: 2 HIGH, 5 MED
  HIGH:
    • py_basics_027 - starter 89% of solution (check-leaks.js lane B)
    • py_basics_031 - verbatim-solution comment starter (check-leaks.js lane A)
  
  MED: (approved intent-prose starters, likely false positives)
    • py_basics_012 - recall=0.65 (check-leaks.js lane A)
    • [3 more...]

Reserved words: 1 violation
  • py_basics_019 - uses `status` as variable name (line 23)

MCQ length parity: 3 violations
  • py_basics_008 - correct answer 2.3x longer than distractors
  • py_basics_014 - correct answer 3.1x longer
  • py_basics_029 - correct answer 2.7x longer

Difficulty ramp: 2 violations
  • py_basics_005 (beginner) - introduces TWO primitives (loops + conditionals)
  • py_basics_037 (advanced) - scaffolded with comment "# define calculate_sum function"

Ordered bank: ✓ clean (all 43 questions present)

─────────────────────────────
Summary: 8 violations requiring fix
Next: Fix HIGH leak violations first
```

**Empty state (all clean):**
```
Topic: PY_ADVANCED (38 questions)
─────────────────────────────

✓ Leak checks clean
✓ No reserved-word identifiers
✓ MCQ length parity clean
✓ Difficulty ramp valid
✓ Ordered bank complete

─────────────────────────────
All checks passed
```

## Batch mode

When auditing or rewriting a full course/codebase:
- Always process work in focused batches of **1–2 topics at a time**.
- Group violations by topic.
- Show topic-level summary first (counts only).
- Detail on request: `/audit-questions PY_BASICS --detail`.
- Token-efficient: show counts, not full violation lists.

Example batch output:
```
Course: BACKEND (187 questions, 12 topics)
─────────────────────────────

Topics with violations:
  • PY_BASICS: 8 violations (2 HIGH leak, 3 MCQ parity, 2 ramp, 1 reserved)
  • PY_ADVANCED: 3 violations (1 HIGH leak, 2 ramp)
  • DJ_MODELS: 5 violations (1 HIGH leak, 4 MCQ parity)
  • [9 more topics clean]

─────────────────────────────
Total: 16 violations across 3 topics
Next: /audit-questions PY_BASICS --detail
```

## Integration with memory

Cross-reference violations with:
- `feedback_questions.md` - known quality patterns
- `feedback_mcq_distractor_length.md` - length parity rules
- `feedback_prompt_background_vs_answer.md` - prompt clarity guidelines

## Exit codes

- `0` - all checks passed
- `1` - violations found (count in summary)
