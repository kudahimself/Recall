---
name: audit-mcq
description: MCQ distractor quality pass - finds length-parity/positional-bias flags and fixes them by strengthening distractors into real misconceptions, not by padding
---

# Audit MCQ Distractors

Quality pass for multiple-choice questions.
The mechanical symptom is length skew ("longest option = correct") and positional bias ("correct answer is always `a`").
The underlying disease is weak distractors: throwaway options nobody would pick, which force the correct answer to carry all the substance.
Fix the disease, not the symptom - never pad a distractor just to hit a character count.

## Usage

```bash
/audit-mcq                    # full codebase scan
/audit-mcq <course>           # scope triage to one course's data files
```

## Step 1: Scan

From `app/`:

```bash
node scripts/check-mcq-distractor-length.js
```

Output has two parts:

- **Length parity** - per-question `correct/longest-distractor` ratio, tiered HIGH/MEDIUM/LOW.
  Act on HIGH and MEDIUM; LOW is worth fixing when already touching the file.
- **Positional bias** - per-file distribution of the correct letter.
  Files flagged `skewed` (one letter >40%) need correct-answer positions varied when next touched.
  Small-n files (under ~10 MCQs) skew easily; use judgment.

Scope to a course by filtering on its data files (e.g. Web Dev: `webdevOrderedQuestions`, `advancedWebdevOrderedQuestions`, `nextjsQuestions`, `advancedNextQuestions`, `prismaQuestions`, `formsTestingQuestions`, `a11yShadcnQuestions`, `jsMisconceptionMCQs`, `designPatternQuestions`, `securityQuestions`).

## Step 2: Diagnose each flag

Read the full question before editing.
The length skew almost always has one of three root causes, each with a different fix:

### Cause A: throwaway distractors

Options so implausible no learner would consider them (`'NaN'`, `'undefined'`, "TanStack stores data in IndexedDB").
A bare value with no reasoning attached is a giveaway - real students hold wrong *reasoning*, not just wrong values.

**Fix**: rewrite each distractor as a real misconception with its (wrong) reasoning spelled out.
Ask: "what would a learner who half-understands this actually believe?"
Good sources: adjacent-API confusion (redirect vs rewrite), mutation vs copy, auto-magic beliefs ("the framework batches/polyfills/strips this automatically"), scope confusion ("X only works in Y files").
Where the schema supports it, attach `misconceptionTag` to distractors that encode a named misconception.

### Cause B: padded correct answer

The correct option carries content unrelated to what the question asked (a bonus fact, a caveat, a preview of the next question's topic).

**Fix**: trim the correct answer to just what answers the question; move the extra content into `explanation`.

### Cause C: compare-N-things questions

"What is the difference between X, Y, and Z?" - the correct answer legitimately needs a clause per item, so it is naturally long.

**Fix**: give every distractor the same parallel structure - address all N items, wrongly.
A distractor that dismisses the comparison in one short clause gives the answer away by shape alone.

## Step 3: Guardrails while editing

- Exactly one `isCorrect: true` per question - verify after every edit.
- Do not change WHICH option is correct unless also fixing positional bias, and then update any nearby comment that documents the correct position.
- No two distractors may make the same claim in different words - each must encode a distinct misconception.
- Distractor plausibility ranking: every option should be pickable by someone at the question's difficulty tier.
- Keep the correct answer's technical content intact - trim padding, never precision.
- Repo prose rules apply inside option text: no em dashes (use "-"), avoid reserved-word identifiers in embedded code.

## Step 4: Verify

From `app/`:

```bash
node scripts/check-mcq-distractor-length.js   # fixed ids must no longer appear
npx tsc --noEmit
CI=true npm test -- --watchAll=false
```

Also confirm one-correct-answer per edited question (grep the option block for `isCorrect: true`; remember options can be multi-line objects, so widen the grep window).

## Quality bar (see `/write-questions` section 5 for full rubric + examples)

A finished MCQ passes all of:

1. Every distractor is a real misconception someone at this tier could hold.
2. All options are within ~1.4x of each other's length.
3. Options share grammatical/structural shape (all sentences, or all values, or all N-part comparisons).
4. The correct answer contains nothing beyond what the question asked.
5. Correct-answer position varies across the file.
