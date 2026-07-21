---
name: construct-topic
description: Build or audit a topic's full ramp - primitive inventory, type matrix, coverage doc, wiring, leak gate
---

# Construct Topic

Workflow for building a new topic or auditing/deepening an existing one.

## Usage

```bash
/construct-topic <topic>              # audit an existing topic's ramp
/construct-topic new <topic>          # design a new topic from scratch
/construct-topic deepen <topic>       # add mastery depth to an existing topic
```

## Core principle: introduce → combine → apply

Every topic has a fixed inventory of primitives. Map each to exactly one tier - never introduce a primitive fresh above beginner.

- **BEGINNER** - one primitive per question, minimal form. Every tool the topic will ever use appears here first. Code-hint scaffolding OK.
- **INTERMEDIATE** - deliberate pairing of two already-seen primitives. Lean toward prose over scaffolding.
- **ADVANCED** - 3+ primitives, realistic scenario. Prose-only prompts, no code comments naming functions. `starterCode` is minimal (imports/signature only).

## Second axis: faded on-ramp (worked → faded → cold)

Independent of difficulty: every primitive a learner must cold-write (`CODING`) must first appear in a lower-load form **in the same topic**.

Type ramp, easiest → hardest: `MULTIPLE_CHOICE → PREDICT_OUTPUT → PARSONS → CLOZE_CODE → CODING`

A primitive that appears ONLY as a cold `CODING` question - no parsons/cloze/predict sharing its concept - is a gap. `node scripts/audit-coverage.js [courseSubstring]` finds these heuristically (via tags); eyeball results, it over-reports the legitimate exceptions below.

**Legitimate coding-only exceptions:** capstone/project topics (`*_PROJECT`), MCQ-breadth topics (Data Engineering course, `PY_PACKAGING`, DRF/Django ops topics by design), genuinely advanced-only primitives.

## Building a new topic (pipeline)

`list skills → map type matrix → write coverage doc → review → write questions → leak gate`

1. **List every primitive.** Write them down first (~15 for a big topic). Worked example - `py_async`: `async def`, `asyncio.run`, `await`, `gather`, `create_task`, `async generator`, `async for`, `async with`/`__aenter__`/`__aexit__`, `wait_for`, `Queue`, `Semaphore`, `TaskGroup`, `to_thread`, `return_exceptions=True`, `cancel`/`CancelledError`.
2. **Assign each to beginner tier.** One coding question per primitive + its faded on-ramp (parsons/cloze, predict if deterministic). If a primitive is meaningless in isolation (e.g. `asyncio.Queue` needs a producer AND consumer), pair with one already-known primitive but still treat it as beginner - the new primitive is the point, not the combination.
3. **Design 5-8 intermediate pairings.** Natural combinations of two beginner primitives.
4. **Design 2-4 advanced scenarios.** Realistic, prose-only.
5. **Add 2-4 MCQs spread across tiers.** Beginner = definitions, intermediate = "X vs Y", advanced = mental models.
6. **Add to `backendOrderedQuestions.ts`** (or `webdevOrderedQuestions.ts`) in order: beginners, intermediates, advanced, MCQs.

## The coverage/analysis document

Before authoring a new topic or a substantial deepening, write a doc at repo root (alongside `*_MASTERY_DEEP_ANALYSIS.md`) and present it for review BEFORE writing questions:

1. **Current coverage** - every existing question under the topic prefix, what it teaches.
2. **Primitive inventory + gap list** - full skill list, tier, covered vs missing.
3. **Type × tier matrix** - primitives as rows, question types as columns, each cell `exists`/`TODO`/`n-a`. No primitive may be cold-CODING-only.
4. **(Spiral topics only) in-place vs revisit routing** - see below.
5. **Verification checklist** - ramp order, faded on-ramp, leak-clean, ordered-bank slot, no reserved words.

## Spiral "mastery revisit" topics

When a topic needs mastery depth, split by reach:

- **Single-skill depth → add in place** as the topic's advanced ceiling (e.g. ORM: `Case/When`, `Subquery/OuterRef`). Don't bolt onto a generic end-of-course topic.
- **Cross-cutting mastery → a new `*_mastery` revisit topic** for material that only makes sense after seeing the whole stack (e.g. `select_for_update` + `atomic` concurrency, N+1 forensics across views/serializers/templates).

A revisit topic still needs its own introduce→combine→apply ramp and faded on-ramp - it is not a capstone exception. Tier center of gravity shifts up; advanced MCQs carry more load (mental models, not new keywords).

**Wiring a new topic (8 data-driven edits, no switch statements):**
1. `Topic` enum value in `src/types/index.ts`
2. `*_TOPICS` Set in `src/utils/courseConfig.ts`
3. Section's `topics` map in `courseConfig.ts`
4. Import + spread in `src/data/questions.ts`
5. Import + spread in `src/data/backendOrderedQuestions.ts` (or webdev equivalent)
6. Create `topic_*.ts` file

`getCourseForTopic`, `getTopicOrder`, `*_PATH_ORDER`, and the UI all read `courseConfig` and pick it up automatically.

## Auditing an existing topic

1. Find every question under the topic's ID prefix.
2. For each: record ID, difficulty, type, and the primitive(s) it introduces/combines.
3. Check ordering in the ordered bank - beginners before intermediates before advanced.
4. Flag any primitive introduced fresh at intermediate/advanced with no prior beginner exposure.
5. Flag any primitive that exists ONLY as cold `CODING` with no faded on-ramp - run `node scripts/audit-coverage.js`.
6. Flag any intermediate stacking 3+ primitives (misplaced advanced) and any advanced teaching only one primitive (misplaced beginner/intermediate).
7. Flag any advanced prompt with code-comment scaffolding naming specific functions - rewrite as prose.
8. Propose a restructure: demotions, promotions, new beginners, reorder in the ordered bank.

For question-level wording/leak quality within each question (not the ramp shape), defer to `/write-questions`.

## The leak gate

After authoring or any edit batch, run from `app/` in order and fix what's flagged:

```bash
node scripts/check-leaks.js              # act on HIGH; lane A = comment-only starters (verbatim-solution / recall>=0.80), lane B = code scaffolding (ratio>=0.70). MED lane A often approved intent-prose
node scripts/audit-coverage.js [courseSubstring]   # eyeball - over-reports legit exceptions
node scripts/check-ordered-strays.js
node scripts/check-mcq-distractor-length.js [courseSubstring]  # if the batch has ANY MCQs - see below
npx tsc --noEmit
```

A leak the scripts miss is still a leak: a prompt that *names* the answer (exact field type, literal kwargs, literal config dict) is a transcription task even with empty starter code. State the requirement/behavior, not the answer.

**If the batch includes MULTIPLE_CHOICE questions, run `check-mcq-distractor-length.js` every time, not just when asked to audit MCQs separately.** A whole new topic authored in one pass is exactly the scenario that produces uniform bias: writing the correct answer first (with full reasoning) and the distractors as an afterthought reliably yields "correct is always the longest option" and "correct is always position b" - this has happened in practice on a from-scratch topic (all 28 MCQs landed at position b, most HIGH on length ratio) even with the rule documented, because the check was never invoked mid-authoring. Treat it as mandatory in the gate, not optional follow-up. See `/write-questions` and `/audit-mcq` for the fix once flagged: trim the correct answer to just what was asked (move justification/fix-guidance into `explanation`), flesh distractors into real misconceptions of matching length, and rotate the correct-answer letter deliberately as you write each question rather than defaulting to the same slot.

## When to push back

- Don't cut a beginner that introduces a primitive the topic later depends on.
- Don't add an advanced question that introduces a brand-new primitive.
- Don't add "just one more intermediate" if it's the 8th variation of the same pairing.

Surface the ramp conflict and propose an alternative instead of silently accepting the request.

## Go carefully, one topic at a time

Topic audits and restructures are large mechanical edits with real pedagogy stakes. **Present findings first, confirm the plan, THEN edit.** Don't batch multiple topics into a single PR - each stands alone so a problem in one doesn't cascade.

## Output format (AXI-compliant)

**Audit mode:**
```
Topic: DJ_ORM (28 questions)
─────────────────────────────
Primitive inventory: 14 primitives, 14/14 introduced at beginner

Ramp violations: 1
  • dj_orm_019 (intermediate) - introduces `Prefetch` fresh, no beginner exposure

Faded on-ramp gaps: 2
  • `select_related` - CODING only (dj_orm_008), no parsons/cloze/predict
  • `annotate` - CODING only (dj_orm_014)

Ordering: ✓ backendOrderedQuestions.ts matches ramp order

─────────────────────────────
Proposed restructure:
  1. Demote dj_orm_019 to advanced OR add a beginner Prefetch intro first
  2. Add PARSONS for select_related, CLOZE_CODE for annotate
Next: confirm before editing
```

## Exit codes

- `0` - ramp valid / new topic wired cleanly
- `1` - ramp violations or faded-on-ramp gaps found
