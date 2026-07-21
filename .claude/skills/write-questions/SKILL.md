---
name: write-questions
description: Pedagogical quality rubric per question type - bad-vs-good patterns for writing or reviewing predict/cloze/parsons/coding/MCQ questions
---

# Write Questions

Style and quality rubric for the five question types. Use this for wording-level quality (is THIS question well-made), as distinct from `/construct-topic` (is the topic's ramp/shape correct) and `/audit-questions` (mechanical leak/parity/reserved-word scans).

## Usage

```bash
/write-questions <id>                 # review one question against the rubric
/write-questions <topic>              # review every question in a topic, one at a time
/write-questions draft <type>         # author a new question of the given type
```

## Pedagogical grounding (why these rules exist)

- **Cognitive Load Theory** (Sweller) - minimize extraneous load (confusing format, syntax hunting) to protect germane load (schema building). Worked-Example Effect: studying full solutions beats unguided problem-solving for beginners.
- **Guidance Fading** (Renkl) - `CLOZE_CODE`/`PARSONS` systematically remove scaffolding to transfer synthesis responsibility without overload, avoiding the Expertise Reversal Effect on advanced learners.
- **Code tracing as precursor to writing** - `PREDICT_OUTPUT` builds the "notional machine" (accurate mental model of execution/state) that debugging and writing both depend on.
- **Parsons puzzles** (Parsons & Haden) - equivalent learning gains to writing from scratch, less time, less frustration. Distractors should target *documented misconceptions*, not arbitrary syntax errors - and only for intermediate+; minimal/no distractors for early beginners.

The ramp: `Worked Example → Faded (Predict/Cloze/Parsons) → Cold (Coding)`. A question that's frustrating, ambiguous, or checks formatting instead of logic breaks this chain.

## 1. Predict Output (`PREDICT_OUTPUT`)

**Fails when it forces a guess:**
- String/data-structure formatting ambiguity (`[1, 2, 3]` vs `[1,2,3]`, quote style in dict keys)
- Engine/runtime-dependent representations (Promise string reprs, function refs, memory addresses, class instance reprs) - these vary across Node/browser/Python versions
- Noisy long snippets where 90% of effort is trivial arithmetic tracing, 10% is the actual target misconception

**Rules:**
1. Target primitives - prefer output that's a string, number, or boolean.
2. If output is an array/object/multi-line, specify the format in the prompt.
3. Use `acceptableOutputs` liberally for alternate valid formatting.
4. Strict determinism - no unsynchronized async, no timestamps/random.
5. Never ask to predict an engine-dependent printed type (Promise, generator, function ref). Print a primitive derived from it instead (`typeof promise`, `await promise`).
6. **3-8 lines**, one cognitive pivot point per question.

❌ `console.log(getValue())` where getValue returns a Promise → expects `Promise { 42 }` (breaks across Node/browser versions)
✔ `console.log(result instanceof Promise); result.then(v => console.log(v))` → `true\n42`

## 2. Cloze Code (`CLOZE_CODE`)

**Fails when:**
- Blanking generic boilerplate (`const`, `function`, `def`) - tests typing, not concept
- A blank has multiple valid syntactic forms but the validator expects one string
- 4+ blanks - loses context, becomes an input-focus struggle

**Rules:**
1. Blank the operative token only (the method, the operator, the keyword being taught).
2. 1-3 blanks, 1-2 is optimal.
3. Surrounding code stays simple/standard - no tricky names, no unusual formatting.
4. Supply `blankAlternates` when multiple tokens are genuinely valid (quote style, `==`/`===` if both pass, alternate method names).

❌ Blanking `const`, both `{`/`}` pairs across two lines - 5 blanks of pure syntax
✔ One template contrasting `{ }` (object destructure) vs `[ ]` (array destructure) - 4 blanks, one concept

## 3. Parsons (`PARSONS`)

**Fails when:**
- Distractors are trivial (obvious syntax errors, typos) instead of targeting a misconception
- A single statement is split across arbitrary lines - confuses indentation/ordering
- 8+ shuffled lines - becomes a sorting puzzle, not a code-structure check

**Rules:**
1. 3-6 shuffled lines (5 is the sweet spot). Longer → convert to `CODING`.
2. One statement per line (a short declare+assign is fine as one line).
3. Distractors must be plausible mistakes: `forEach` vs `map`, `=` vs `==` in a condition, wrong-language indentation. Minimal/no distractors for early beginners (per Parsons & Haden - distractors add real difficulty).
4. Prompt states exactly what the code does, including variable names and I/O expectations.

❌ `for (let i = 0;` / `i < 5;` / `i++) {` split across 3 lines (unreadable); distractor is just a stray Python line
✔ Single-line `for` header; distractors are `i <= 5` (off-by-one) and `"i"` string literal (variable-vs-string misconception)

## 4. Cold Coding (`CODING`)

**Fails when:**
- `starterCode` comments or prompt text name the exact function/method to call - reduces it to transcription
- Solution wasn't written first, so `# OR`/`-- OR` alternate syntaxes were never captured → rigid validation false-fails correct answers
- Prompt omits parameters, exact return type/casing, or empty/edge-case behavior → validation failure that isn't the learner's fault

**Rules:**
1. Write the reference `solution` FIRST, then the prompt, then `starterCode`.
2. Advanced tier = prose-only prompt, no code-comment scaffolding, no pseudocode walkthrough. Choosing the primitives IS the test.
3. Prompt specifies variable names, function/class signatures, expected output shape.
4. Use `# OR` (Python) / `-- OR` (SQL) in `solution` for genuine alternate implementations.
5. Run `node scripts/check-leaks.js` before calling it done (its Lane A catches comment-only starters that uncomment to the solution; Lane B catches heavy code scaffolding).

❌ `prompt: 'Use asyncio.gather.'` + starter comment `# Use asyncio.gather here` - names the answer twice
✔ Prose prompt describing behavior/constraints only; starter is a bare signature; solution captures both `asyncio.gather` and `TaskGroup` forms via `# OR`

## 5. Multiple Choice (`MULTIPLE_CHOICE`)

Carries the breadth layer of a course: API recall, conceptual contrasts, and misconception probes that would be awkward as code-writing tasks.

**Fails when the options leak the answer by shape, not content:**
- Throwaway distractors no learner would pick (`'NaN'`, `'undefined'`, an absurd claim) - a bare wrong value with no reasoning attached signals "filler"; real students hold wrong *reasoning*, not just wrong values.
- Longest-option-wins - correct answer written carefully at length, distractors are one-line dismissals; pattern-matchers pick the longest option and are usually right.
- Padded correct answer - bonus facts/caveats unrelated to the question inflate it further.
- Positional bias - correct answer sits at the same letter across a whole file, so position itself becomes a tell.
- Overlapping distractors - two options making the same claim in different words, collapsing a 4-way choice into a 2-way one.

**Rules:**
1. Every distractor is a real misconception - name the learner who'd pick it (adjacent-API confusion, mutation-vs-copy, auto-magic beliefs, scope confusion). Attach `misconceptionTag` where the schema supports it.
2. Length parity - keep all options within ~1.4x of each other's length. Reach parity by strengthening distractors with their (wrong) reasoning, never by padding with filler.
3. Parallel structure for comparisons - a "difference between X, Y, Z" question needs every option (correct and distractor) to address all N items; a distractor that waves the comparison away in one clause gives itself away by shape.
4. Correct answer answers only the question - move bonus facts/caveats into `explanation`, trim padding (never technical precision).
5. Vary the correct position across a/b/c/d within each file. Run `node scripts/check-mcq-distractor-length.js` (from `app/`) for per-file positional bias and per-question length ratios.

**Apply while drafting, not as a post-hoc audit.** Writing a whole topic's MCQs in one pass - reasoning out the correct answer first, dashing off distractors after - reliably produces both failure modes at once. This happened for real: a 28-question topic authored end-to-end landed every correct answer at position `b`, most flagged HIGH on length ratio, because the length-check script wasn't run until a human noticed. Pick a target letter that differs from recent questions, and write distractor reasoning before or alongside the correct answer's - not after. `check-mcq-distractor-length.js` is mandatory in `/construct-topic` and `/add-question`'s leak gate whenever a batch has any MCQs, precisely because "run it later" doesn't reliably happen.

❌ Correct option has a full clause of reasoning; three distractors are bare values (`1`, `undefined`, `TypeError`) with no reasoning attached
✔ Every option (correct + 3 distractors) states a value AND the (right or wrong) reasoning behind it, comparable length, correct answer rotated off the default letter

The audit-and-fix workflow for existing MCQs (triage script output, diagnose root cause, fix without padding) lives in `/audit-mcq`.

## Review workflow (per question)

For each question, walk the type-specific rule list above and classify:
- **Clean** - passes all rules for its type
- **Weak** - passes but could be tightened (e.g. missing an obvious `acceptableOutputs` variant)
- **Bad** - violates a rule that would frustrate or mislead the learner (formatting guess, leaked answer, trivial distractor, engine-dependent output)

Cite the question ID and the specific rule violated - not a vague "could be better." When proposing a fix, show the corrected field, not just the diagnosis.

## Summary checklist (apply to every question before shipping)

| Check | Rule |
| :--- | :--- |
| Ramp | Primitive introduced at BEGINNER before combined/applied later (see `/construct-topic`) |
| Faded on-ramp | Every cold-CODING primitive first appears as PREDICT/PARSONS/CLOZE in the same topic |
| Formatting safety | PREDICT_OUTPUT never prints engine-dependent/dynamic values |
| Alternate formats | `acceptableOutputs` for predicts; `# OR`/`-- OR` for coding |
| Leak-clean | No keyword/commented-solution leaks - run the leak scripts |
| Syntax guard | No reserved-word identifiers (`date`, `name`, `status`, `type`) |
| Output instruction | If asserting printed output, prompt says "print the result" |
| MCQ distractors | Every distractor is a real misconception, option lengths within ~1.4x, correct position varies across the file (see `/audit-mcq`) |

## Output format (AXI-compliant)

```
Question: dj_orm_014 (CODING, advanced)
─────────────────────────────
✗ BAD - prompt names `annotate` and `Count` explicitly; starter has
  `# use annotate() with Count()` - transcription, not synthesis
  Rule: Coding #2 (prose-only prompt, no scaffolding)

Proposed fix:
  prompt: "Return each author with their book count, annotated as `book_count`."
  starterCode: bare queryset variable + function signature only

─────────────────────────────
1 BAD, 0 WEAK, 0 CLEAN
Next: confirm fix before editing
```

## Exit codes

- `0` - no BAD findings
- `1` - at least one BAD finding
