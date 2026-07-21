# How to Construct a Subject

Guidance for building (or substantially extending) a whole **course/subject** — e.g. Backend
Engineering, Web Development, or a new "SQL for Data Engineering" course. This is the subject-level
companion to the `/construct-topic` skill: that skill governs a single topic (`py_async`,
`sql_windows`); **this** doc governs the level above — the set of sections/pillars that make up a
course, the order they're taught in, and the work of wiring a brand-new course into the app.

If a topic is the unit of *one skill*, a subject is the unit of *one career-relevant competency*. The
Backend course is the reference implementation; this doc captures the method we converged on building
it and the Django mastery rollout.

## Core principle: primitives → specific

A topic ramps `introduce → combine → apply`. A subject ramps the same shape one level up:

**foundational pillars (primitives everything reuses) → applied pillars → specialized / engine-specific pillars → (optional) mastery spiral.**

- **Foundations come first because later pillars *reuse* them.** You cannot teach dimensional
  modelling before `JOIN` and `CREATE TABLE`; you cannot teach Celery before functions and decorators.
  The first pillars are the primitives the whole rest of the course composes from.
- **Specific/applied pillars come next**, each combining foundation primitives into a real
  competency (modelling, ELT patterns, performance tuning).
- **Engine/tool-specific pillars come last** (Snowflake, BigQuery, dbt; Next.js, Prisma) — they
  assume the portable core and layer vendor reality on top.
- **A mastery spiral is optional** (see "Two-layer mastery" below) — return to a foundation pillar at
  full depth once the learner has used it across later pillars.

The ordering rule is the same invariant as the topic ramp: **never depend on a primitive a learner
hasn't met yet.** At the subject scale the "primitive" is a whole pillar.

## The subject pipeline (do these in order)

`scope the subject → list the pillars → order pillars primitive-first → write the SUBJECT coverage spec → review → author section by section (each via the TOPIC pipeline) → course-level gates`

1. **Scope the subject.** One sentence: who is this for, what competency does finishing it prove,
   what's explicitly out of scope (so it doesn't sprawl into a sibling course). Decide the
   cross-cutting conventions up front: question-type policy (coding course = all five types; concept
   course = MCQ-only like Data Engineering), and any tooling/dialect/version target (e.g. "Python
   3.12", "T-SQL", "React 19").
2. **List the pillars (sections).** The 6–10 sections that make up the course. Each pillar is a
   coherent competency, not a single skill. (For SQL: Querying, DDL, Analytical SQL, Modelling, ELT,
   Performance, Cloud Warehouse.)
3. **Order pillars primitive-first** per the core principle. Write down *why* each pillar precedes the
   next — that rationale is what the reviewer checks.
4. **Write the subject coverage spec** (see next section) and **present it for review BEFORE
   authoring.** This is the checkpoint — confirm the pillar set, ordering, dialect, and size before
   writing 80+ questions.
5. **Author section by section.** Each pillar is built with the full `/construct-topic`
   pipeline (primitive inventory → type×tier matrix → per-topic ramp → faded on-ramp → leak gate).
   Do **one section at a time** — don't batch the whole course into one edit.
6. **Run the course-level gates** (see "Verification" below).

## The subject coverage/analysis document

The subject-scale analogue of the per-topic `*_MASTERY_ANALYSIS.md` docs. Put it at the repo root.
It is the spec the whole course is authored against and the artifact that proves the pillar ramp is
sound. It must contain:

1. **Scope & conventions** — the one-sentence scope, out-of-scope list, question-type policy, and the
   dialect/tooling/version target.
2. **Pillar list, in path order** — each section with a one-line competency statement and the
   ordering rationale ("Modelling requires DDL + JOINs from the two prior pillars").
3. **Per-pillar primitive inventory** — the topics inside each pillar and the concrete primitives
   each topic introduces. This is the bridge to the topic pipeline: every topic listed here gets its
   own type×tier matrix when it's authored.
4. **Type × tier summary per pillar** — at minimum, which question types the pillar uses and roughly
   how the difficulty centre-of-gravity sits (foundations skew beginner; specialized pillars skew
   intermediate/advanced). Full per-primitive matrices live in the topic-authoring step, but the
   summary here proves no pillar is accidentally cold-CODING-only or MCQ-only by neglect.
5. **Wiring checklist** — the new-course wiring steps below, as a literal checklist for this course.
6. **Verification checklist** — the course-level gate (every section reachable/unlockable, tsc,
   leak/order audits, smoke test).

## Two-layer mastery (optional, from the Django rollout)

When a foundation pillar needs genuine mastery depth, split the deep material by reach — the same
split the `/construct-topic` skill describes, applied across the course:

- **Single-skill depth → in place.** Harder applications using only that pillar's own primitives go
  at the pillar's advanced ceiling, served while the skill is fresh.
- **Cross-cutting mastery → a spiral revisit section.** Material that only makes sense once the
  learner has seen the *whole course* (concurrency tradeoffs, N+1 forensics, query-plan intuition)
  becomes a `*_mastery` section placed in an Advanced step. This is the second turn of the spiral:
  teach a skill at working depth early, let the learner use it across later pillars, then return to it
  at mastery depth with full context.

A revisit section is not a capstone exception — it still gets a proper internal
introduce→combine→apply ramp and a faded on-ramp for every primitive a learner must cold-write. The
difference is the tier centre of gravity shifts up and advanced MCQs carry more of the load (mastery
is often a *mental model*, not a new keyword).

## Question types at the subject scale

All five types (`MULTIPLE_CHOICE / PREDICT_OUTPUT / PARSONS / CLOZE_CODE / CODING`) are available.
Two course archetypes:

- **Coding subject** (Backend, Web Dev, SQL) — uses all five. Every cold-write primitive gets a faded
  on-ramp (`MCQ → PREDICT → PARSONS → CLOZE → CODING`) *within its topic*. `PREDICT_OUTPUT` fits any
  language with deterministic small outputs — for SQL, show a tiny input table + query and ask for the
  result rows (works cleanly for `ORDER BY`+`LIMIT`, window functions, NULL handling, set ops).
- **Concept subject** (Data Engineering concepts) — MCQ-only by design: tool-agnostic
  decision-making and tradeoffs, no validatable code. Don't bolt coding onto a concept course; if a
  competency needs code, it's a *different course* (this is exactly why SQL-for-DE is its own subject
  rather than a section inside the DE concepts course).

The validator (`src/utils/codeValidator.ts`) handles Python and SQL: it splits alternates on
`-- OR` (SQL) / `# OR` (Python), lowercases SQL, and applies equivalence rewrites (`INNER JOIN`↔`JOIN`,
`filter`↔`where`, etc.). For genuinely engine-specific syntax that has no portable form, prefer an
MCQ or an explicit `-- OR` alternate over weakening the validator.

## Wiring a new subject (course)

Adding a topic is 8 data-driven edits (see the `/construct-topic` skill). Adding a whole **course** is
more, because a course is referenced by the enum, the config, the selector, and the UI. The complete
touch-list (verified against the Data Engineering course):

**Types & config**
1. `src/types/index.ts` — add the `Course` enum value; add every `Topic` enum value for the course.
2. `src/utils/courseConfig.ts`:
   - a `<COURSE>_TOPICS` Set of the topic keys;
   - `getCourseForTopic` — add `if (<COURSE>_TOPICS.has(topic)) return Course.<X>;`;
   - a `<COURSE>_SECTIONS` object (`section → unit-name → topic-keys[]`, with a `weight`/`Step` label);
   - a `<COURSE>_PATH_ORDER` array (section names in teaching order);
   - `getTopicOrder` — add the course to BOTH the pathOrder and the sections ternaries;
   - `getSelectionPolicy` — set `useConceptSRS` (false until the course is concept-tagged; concept-aware would no-op otherwise).

**Selector**
3. `src/utils/spacedRepetition.ts` — `getUnlockedSections`: add the course to the pathOrder ternary.
   (Topic/section lookups go through `getTopicKeysForSection`/`getSectionUnits`, which already merge
   all sections, so the pathOrder branch is the main edit.)

**UI**
4. `src/App.tsx` — course meta map (label + theme class); the per-course stat-accumulator init
   objects; the pathOrder + sections ternaries; the `theme-*` class switch.
5. `src/components/NavigationRail.tsx` — add the course to the rail list (icon, label, color).
6. `src/components/QuestionFilter.tsx` — add the course to its sections ternary.
7. `src/components/ProgressTracker.tsx` — confirm it resolves the new course's sections/path.
8. `src/App.css` — add the course's design tokens (`--<course>-solid`, gradient) and `theme-<course>`
   class, following the existing per-course theming. No hardcoded px font-sizes (see the design-token
   convention).

**Data**
9. Per-topic question files in `src/data/` (one per topic, `topic_*.ts` or the course's naming
   convention), aggregated into `src/data/questions.ts` (import + spread).
10. **Ordered bank decision** — coding courses with a within-topic learning ramp use an ordered bank
    (`<course>OrderedQuestions.ts`, like `backendOrderedQuestions.ts`) that defines canonical order
    via `q(id)` lookups (it throws on an unknown id, catching typos). MCQ-only/no-ramp courses skip
    the ordered bank and ship per-section files (like Data Engineering). Choose per the archetype.

Grep `Course.DATA_ENGINEERING` across `src/` before starting — every hit is a place the new course
likely needs a sibling branch. That grep is the cheapest way to keep the touch-list honest as the
codebase evolves.

## Verification (course-level gate)

After each section (and again when the course is complete), from `app/`:

- `npx tsc --noEmit` — types clean (the ordered bank's `q()` also fails the build on a bad id).
- `node scripts/check-leaks.js` — act on HIGH. Lane A (comment-only starters) catches the commented-solution anti-pattern; lane B (code scaffolding) catches heavy starters (ratio ≥0.70).
- `node scripts/audit-coverage.js <courseSubstring>` — cold-CODING primitives with no faded on-ramp
  (eyeball; over-reports legitimate exceptions).
- `node scripts/check-ordered-strays.js` — a question whose ordered-bank slot disagrees with its topic.
- `npm test -- --testPathPattern=spacedRep` — the selector smoke tests still pass with the new
  course/sections (no unlock regression).
- **Manual smoke test in the browser** — switch to the new course, confirm section 1 serves
  questions, the theme renders, progress tracks, and the next section unlocks at the coverage
  threshold. Pedagogy intuitions are sometimes wrong; a 10-minute click-through catches "this ramp is
  backwards" before it's 80 questions deep.

## Go one section at a time

A new course is a large, multi-file change with real pedagogy stakes. Wire the course skeleton +ONE
section first (a vertical slice), smoke-test it end to end, then author the remaining sections one at
a time. Present the subject spec for approval before authoring, and don't let a problem in one pillar
cascade into the others. When the user asks to cut or reorder pillars in a way that breaks the
primitive-first invariant, surface the conflict and propose an alternative rather than silently
accepting it.
