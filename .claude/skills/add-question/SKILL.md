---
name: add-question
description: Question authoring workflow - validates structure, updates ordered banks, runs leak checks
---

# Add Question

Guided workflow for adding a question to Recall. Follows the ramp principles in `/construct-topic`.

## Pre-flight checks

Before authoring:

1. **Validate topic/difficulty pairing** - topic must exist in `src/types/index.ts` Topic enum
2. **Check difficulty ramp** - beginner introduces ONE primitive, intermediate combines TWO, advanced is 3+ realistic scenario
3. **Verify course** - determine course via `getCourseForTopic` in `src/utils/courseConfig.ts`

## Authoring steps

### Step 1: Write the question

**Coding questions:**
1. Write `solution` first (the reference implementation)
2. Use `# OR` (Python) or `-- OR` (SQL) for genuine syntax alternates
3. Then write `starterCode` as comment-only or minimal scaffolding
4. Language must be `'python'` or `'sql'`

**MCQ questions:**
1. Distractors must match correct answer's length (no "longest = correct" tells) - write the correct answer's substance first, but before finalizing, trim it to only what the question asked (move justification/fix-guidance into `explanation`) and flesh each distractor into a real misconception with its own reasoning, not a one-line dismissal
2. Vary the correct-answer position AS YOU WRITE, not just at final review - don't let the correct option default to the same letter (commonly `b`) across a batch; pick a different target letter for each question's correct answer before drafting its text
3. Only tag distractors with `misconceptionTag` when it maps to SPECIFIC named error in `src/data/misconceptions.ts`
4. Never tag the correct option

**Parsons questions:**
1. One statement per line in `correctOrder`
2. `distractorLines` should encode specific misconceptions (`=` vs `==`, etc.)
3. If field order is ambiguous, prompt must dictate the order

**Predict Output questions:**
1. Keep `code` snippet short (3-8 lines)
2. One misconception per question
3. `expectedOutput` is exact match after whitespace normalization

**Cloze questions:**
1. 1-3 blanks per question
2. Blank the *interesting* token (operator, keyword, method) not boilerplate
3. Use `___` (3 underscores) as blank marker in `template`

### Step 2: Place the question

1. **Drop into topic file:** `src/data/<topic>Questions.ts` (create if needed)
2. **Update ordered bank (Web Dev / Backend only):**
   - `webdevOrderedQuestions.ts`
   - `advancedWebdevOrderedQuestions.ts`
   - `backendOrderedQuestions.ts`
   
   Append question ID to correct position in topic's array
   
   **Skip this step for:** Data Engineering and Databricks courses (section files only)

### Step 3: Quality checks

Run from `app/`:

```bash
node scripts/check-leaks.js                  # all courses; auto-routes Lane A (comment-only starters) + Lane B (code scaffolding)
node scripts/check-prompt-leaks.js
node scripts/check-starter-leaks-webdev.js   # webdev only
node scripts/check-mcq-distractor-length.js  # if the question is MULTIPLE_CHOICE, or the batch has any
```

**Fix HIGH tier violations (≥0.8 similarity) before completing.**
MED tier: review but often approved for intent-prose/config-artifact starters.
For `check-mcq-distractor-length.js`: fix HIGH and MEDIUM length-ratio flags, and check the file-level positional summary it prints - if one letter is skewed (>40%) across the file, don't leave it for a later audit pass. This check is easy to skip because it wasn't part of the original leak-gate list; it is now mandatory whenever a MULTIPLE_CHOICE question is added.

### Step 4: Reserved-word check

Ensure question doesn't use reserved identifiers: `date`, `name`, `status`, `type`

### Step 5: Output validation

If test asserts on printed output, prompt MUST say "print the result"

## Output format (AXI-compliant)

**On success:**
```
✓ Question <id> added to <topic>
✓ Ordered bank updated: <bank>.ts line <N>
✓ Leak checks clean
─────────────────────────────
Ready for testing
Next: npm test -- --testPathPattern=<topic>
```

**On validation failure:**
```
✗ Missing ordered bank update
  Course: BACKEND
  Expected: backendOrderedQuestions.ts

✗ Leak check violations (1 HIGH, 2 MED)
  HIGH: starter contains 87% of solution

─────────────────────────────
Fix violations before completing
```

## Common mistakes

- **Forgotten ordered bank update** - question never appears in app (Web Dev / Backend)
- **Commented-solution anti-pattern** - a comment-only starter that uncomments to the solution; `check-leaks.js` Lane A catches it (reports `verbatim-solution` / high recall)
- **Reserved-word identifiers** - cause subtle bugs
- **Heavy scaffolding** - leaks the answer, defeats learning objective
- **Vague prompts without context** - add file/var/output names (background) not syntactic detail (answer)

## Difficulty guidelines

From `/construct-topic`:

- **Beginner:** introduce ONE new primitive, minimal context
- **Intermediate:** combine TWO already-introduced primitives
- **Advanced:** 3+ primitives, realistic scenario, prose prompt (no scaffolding comments)
