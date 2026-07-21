# Development Guide

Comprehensive architecture, implementation details, and development patterns for Recall.

## Table of Contents

- [Repository Layout](#repository-layout)
- [Architecture](#architecture)
  - [Course → Topic → Question Hierarchy](#course--topic--question-hierarchy)
  - [Spaced Repetition System](#spaced-repetition-system)
  - [Code Validation](#code-validation)
  - [Components](#components)
  - [Persistence](#persistence)
- [Question Types](#question-types)
- [Adding Questions](#adding-questions)
- [Known Gotchas](#known-gotchas)

## Repository Layout

Project root is `Recall/`.
The React app lives in `Recall/app/` - all `npm` commands run from there.

Top-level mastery/planning docs sit at `Recall/` root and drive what gets added next:
- `DATABRICKS_LAKEHOUSE_DESIGN_ANALYSIS.md` - active Databricks lakehouse design plan
- `DATABRICKS_QUESTION_AUDIT_TRACKER.md` - persistent Databricks question audit/rewrite tracker
- `HOW_TO_CONSTRUCT_SUBJECT.md` - subject/course construction workflow
- `SQL_FOR_DE_COURSE_SPEC.md` - SQL for Data Engineering course spec
- `SQL_FOR_DE_COURSE_GAPS.md` - SQL for DE course coverage gap tracker
- `TIERED_HINTS_AUDIT_TRACKER.md` - tieredHints authoring/audit tracker

Question construction workflow and question writing quality standards live in the `/construct-topic` and `/write-questions` skills, not standalone docs.

## Architecture

### Course → Topic → Question Hierarchy

**Core types:**
- `Course` enum (4 values) in `src/types/index.ts`:
  - `DATABRICKS` - Databricks & PySpark
  - `WEBDEV` - Web Development
  - `BACKEND` - Backend Engineering
  - `DATA_ENG` - Data Engineering
- `Topic` enum (~140 values) in `src/types/index.ts`

**Source of truth: `src/utils/courseConfig.ts`**

This file maps every `Topic` to its `Course` and defines:
- Per-course section structure:
  - `DATABRICKS_SECTIONS`
  - `WEBDEV_SECTIONS`
  - `BACKEND_SECTIONS`
  - `DATA_ENG_SECTIONS`
- Path-order arrays (canonical topic sequence):
  - `WEBDEV_PATH_ORDER`
  - `BACKEND_PATH_ORDER`
  - `DATABRICKS_PATH_ORDER`
  - `DATA_ENG_PATH_ORDER`

**Adding a 5th course requires:**
1. Add new `Course` enum value in `src/types/index.ts`
2. Update `getCourseForTopic` in `courseConfig.ts`
3. Update `getTopicOrder` in `courseConfig.ts`
4. Update switches in `App.tsx` / `ProgressTracker.tsx` / `spacedRepetition.getUnlockedSections`

**Question organization:**
- Questions grouped into per-topic files in `src/data/`
- Aggregated through `src/data/questions.ts`
- **Ordered banks** define within-topic learning sequence:
  - `webdevOrderedQuestions.ts`
  - `advancedWebdevOrderedQuestions.ts`
  - `backendOrderedQuestions.ts`
  
  New questions for these courses get appended in the right slot in the ordered bank, not just dropped into topic file.

- **Data Engineering course** skips the ordered-bank pattern (MCQ-only, no within-topic ramp) and ships per-section files:
  - `dataEngineeringFoundationsQuestions.ts`
  - `dataEngineeringArchitectureQuestions.ts`
  - `dataEngineeringModelingQuestions.ts`
  - `dataEngineeringStreamingQuestions.ts`
  - `dataEngineeringDistributedQuestions.ts`
  - `dataEngineeringOpsQuestions.ts`

### Spaced Repetition System

**Location:** `src/utils/spacedRepetition.ts`

Single source of truth for learning-system tuning constants:
- Section unlock thresholds: `UNLOCK_COVERAGE_PCT=100`, `UNLOCK_ACCURACY_PCT=80`
- Rolling windows: `RECENT_WINDOW`, `TOPIC_RECENT_WINDOW`
- Priority weights: `UNLOCK_BLOCKER_BOOST`, `TOPIC_REVIEW_BOOST`, `INCORRECT_PRIORITY_WEIGHT`
- Selection knobs

**Course-aware:** section unlocks gate which topics are eligible for review.

#### Review States

Two distinct review states a topic can be in:

**1. In Review** (`isTopicInReview`)
- Full coverage, latest-correct < 95%
- Boosted via `TOPIC_REVIEW_BOOST` so user keeps cycling through it

**2. Mastered** (`isTopicMastered`)
- Full coverage, latest-correct ≥ 95%
- Kept in rotation by **due-driven mastered-resurface** path (Anki-style, no artificial caps)
- Runs in `selectNextQuestion` BEFORE concept-aware bucketing so concept-aware DUE/IDLE buckets can't starve it
- Without this, high-stability advanced cards sit in concept-aware's IDLE bucket for ~30 days and effectively retire

#### Mastered Resurface Mechanics

**Due condition:**
- A mastered card is **due** when `daysSinceLastReview ≥ getTargetInterval(streak)`
- Spacing curve: 1, 3, 7, 14, 30, 60, 120 days
- `hasDueMastered` checks this via `progress.lastAttempt` for O(1) timestamps

**Selection when due:**
- `pickMasteredResurface` picks one - **most-overdue first**
- Scored by `daysSinceLastReview / targetInterval`
- Least-recently-reviewed as fallback
- **Difficulty-weighted:**
  - `MASTERED_ADV_WEIGHT=6`
  - `MASTERED_INT_WEIGHT=1`
  - `MASTERED_BEGINNER_WEIGHT=0.5`
  
  Advanced cards lead among comparably-due ones.
- **Never random across topics**

**Rate:**
- Rate is 1 (every review slot drains due queue) once learner is caught up
- Drops to `ONBOARDING_DUE_RESURFACE_PROB = 0.25` while new topic is still being onboarded
- Exception: a due DRAIN card (coding/advanced) overrides onboarding and hard-gates new content (see Reviews-First Hard Drain)
- When nothing is strictly due, light `MASTERED_RESURFACE_FLOOR_FRACTION = 0.20` interleave keeps not-yet-due advanced cards warm (only outside onboarding)

**Deferral safeguard:**
- Resurface skipped on fresh failure (`lastAttemptWrong`)
- Defers to blockers only when learner genuinely STUCK:
  - A covered topic is in review (`isTopicInReview` - covered but < 95%, captures unlock blockers)
  - AND no servable new content (`!inOnboarding`)
- While new content still flowing, blockers get priority path's review share and due-mastered still resurfaces at reduced onboarding rate
- A topic mastered earlier (e.g. threading) keeps resurfacing for retention rather than being frozen out for rest of course
- Without `!inOnboarding` clause guard was too aggressive - single in-review topic suppressed ALL mastered review even mid-progress

#### New-Topic Onboarding Gate

Replaces old post-mastery cool-off.

`inOnboarding = firstUnlockedNew !== null`
- I.e., lead topic still has servable unseen, gate-passing question (first exposure)
- While onboarding:
  - New content keeps normal share
  - Due-resurface is *reduced, not off* (`ONBOARDING_DUE_RESURFACE_PROB`)
  - Fresh material gets blocked practice before interleaving resumes
  - Applies to NON-drain due cards only - a due drain card hard-gates new content regardless
- Gate self-terminates once every question in topic has been seen once (or difficulty gate walls off all new → learner must consolidate → full SR)
- Matches learning-science split: blocked practice on first exposure, interleaving afterward

#### Reviews-First Hard Drain

Function: `drainDueReviews`

**Trigger:**
Fires whenever ANY drain card is pending (`hasPendingDrain`) - mid-topic included, not just at a topic boundary.
Recall on already-learned topics outranks new material (Anki-style reviews-first).
(Previously gated on the frontier topic being 100% seen; that boundary-only trigger let due reviews languish for days on a long topic.)

**Behavior:**
- New content **hard-gated** (`newProb = 0`)
- Due **drain queue** cleared at full rate before new content resumes

**Two deliberate scoping choices:**

1. **Drain queue = "drain cards" only**
   - `SpacedRepetitionSystem.isDrainCard = type === CODING || difficulty === ADVANCED`
   - Passed as optional `filter` to `hasDueMastered`/`pickMasteredResurface`
   - Beginner/intermediate faded + MCQ recur inside later topics and via concept-aware
   - Gate clears high-value subset (~250 of 960 for reference user, 197 coding) rather than every type
   - Lighter onboarding-trickle and caught-up floor stay all-types

2. **Non-drain due cards never trip the gate**
   - Due beginner/intermediate MCQs keep the reduced onboarding-rate resurface (rate 1 when caught up) but never block new content
   - Keeps the forced-review burst short after a few days away

**Drain queue definition:**
`countPendingDrain` - single source of truth behind both the `hasPendingDrain` gate and the `getReviewStatus.drainQueueCount` pill, so gate and pill can't disagree.

A covered-topic drain card is in queue iff:
- **(Its topic `isTopicMastered` AND it is due)** - the servable backlog
- **OR it is your most-recent attempt and that attempt was wrong** - the one card you're retrying

Mastery for queue membership treats the one retried card as correct (`isTopicMastered(..., treatCorrectId)`).
A single fresh miss therefore can't demote its own topic and knock the topic's OTHER due cards out of the queue - the count HOLDS on a miss.

Get one right → it leaves → **count - 1**
Get one wrong → it's held (retry until right, via latest-wrong priority path)

Reaches **0** as backlog clears.

Due cards in *in-review* topics and *old* failed cards (not the latest attempt) are consolidation blockers the drain never serves - **excluded**, so count has no unreachable floor.
(This was the "count won't go down" bug: counting un-servable cards stalled it ~24 above zero.)

**Drain supersession retirement:**
Some mastered topics become redundant once a later section re-exercises their primitives.
`DRAIN_SUPERSEDED_SECTIONS` in `courseConfig.ts` maps superseded section → superseding section.
Once every question in the superseding section has been attempted (the section is finished), the superseded section's topics retire from the drain hard gate - they're no longer counted in `countPendingDrain` or served by the drain-gate picker.

Retired topics remain eligible for normal (non-gating) due resurface via the caught-up review mode.
The primitives aren't forgotten - they're re-exercised by the superseding section's own coding/advanced cards, so drilling the old fundamentals becomes redundant.

Example: `'Python Fundamentals': 'Python Advanced'` - once every question in py_type_hints through py_packaging has been attempted, py_basics/py_data_structures/py_functions/etc. no longer hard-block new content, though they still resurface when due.

**Gate precedence:**
`newProb = 0` takes precedence over fresh failure during drain.
Otherwise `REVIEW_AFTER_FAIL_PROB` (0.15) would leak *new* question through hard gate on miss.
Relief-trickle likewise suppressed while draining.

Drain is time-bounded (cards leave pending set as answered correctly).
`consolidationPending` still defers to blockers when genuinely stuck.

#### Difficulty-Scaled Intervals

Auto-graded Anki easy/hard.

**Formula:**
`getEffectiveInterval = getTargetInterval(streak) * easeFactor(cardDifficulty[id])`

Used by all 5 drain due-checks:
- `hasDueMastered`
- `countPendingDrain` (behind `hasPendingDrain`)
- `pickMasteredResurface`
- `getReviewStatus`
- `drainPred`

**Ease factor:**
- Constants: `EASE_MID_DIFFICULTY=5.5`, `EASE_MAX_FACTOR=2.5`, `EASE_MIN_FACTOR=0.4`
- Symmetric in log-space: **easy card → later, hard card → sooner**
- Difficulty `0/undefined → 1.0` (legacy/untagged/DE unaffected)

**Card difficulty:**
- Per-card FSRS D 1..10, persisted to `recall-card-difficulty`
- Updated for **every** answered card in `handleAnswer` (one unconditional writer; concept block no longer writes it)
- Graded by `gradeFromResponseTime(type, time, isCorrect)`:
  - Fast + correct = easy
  - Slow + correct = hard
  - Wrong = again
- Struggled topic re-enters drain sooner
- Threads as trailing optional param (default `{}`) into `selectNextQuestion`/`getReviewStatus`
- **Pass it to BOTH gate and count or pill desyncs from gate**

**Topic difficulty:**
`getTopicDifficulty(topicQuestions, cardDifficulty)` rolls topic's drain-card difficulties up to `easy`/`medium`/`hard` label shown as breadcrumb pill (`.topic-diff-pill`)

**Coding response-time envelopes widened:**
`conceptSRS.ts`: coding `easy 240k / hard 600k` so long coding answers aren't auto-graded "hard" for length.

### Code Validation

**Location:** `src/utils/codeValidator.ts`

NOT in `CodingQuestion.tsx`.

**Process:**

1. **Split alternatives:** `solution` split on `# OR` (Python) or `-- OR` (SQL) into independent alternative solutions
2. **Normalize:** User code AND each alternative normalized same way:
   - Strip comments/whitespace/imports
   - Normalize quotes
   - Lowercase for SQL
3. **Equivalence rewrites:** `filter`↔`where`, `sort`↔`orderBy`, `col("x")`↔`"x"`, `df["x"]`↔`"x"`, `F.func`→`func`, `INNER JOIN`↔`JOIN`, etc.
4. **Token-set match:** Every essential token in alternative must appear somewhere in user code (order-independent). Pass if ANY alternative matches.
5. **Return verdict:**
   - `pass` - confident
   - `fail` - confident wrong (common mistake matched, or similarity well below threshold)
   - `uncertain` - similarity ≥ `UNCERTAIN_SIMILARITY_THRESHOLD` but below pass thresholds (could be valid alternative validator can't recognize)

On `uncertain`, `CodingQuestion` shows reference solution and asks user to self-grade rather than falsely accepting/rejecting.

**Asymmetry by design:** `false_negative < false_positive < honest_abstain`

**When adding coding question with multiple acceptable forms:** prefer `# OR` blocks in `solution` over weakening the validator.

### Components

**Location:** `src/components/`

**Question renderers:**
- `MultipleChoiceQuestion.tsx`
- `CodingQuestion.tsx`

**Progress/filters:**
- `ProgressTracker.tsx` - hierarchical course → section → topic progress view
- `QuestionFilter.tsx` - topic / difficulty / type filters, persisted to `localStorage`

**Shared UI primitives:**
- `StyledButton.tsx` - variants: primary/secondary/warning/danger. Use for all buttons.
- `StyledBadge.tsx` - pills/badges

**UI theme:**
Dark-purple themed with radial-gradient mouse-tracked card effects.
Layouts target desktop viewport without scrolling.

**Monaco Editor config:**
- Theme: `vs-dark`
- No minimap
- Line numbers on
- Read-only after correct answer

### Persistence

**localStorage keys** (defined in `App.tsx`):
- `databricks-progress` - `UserProgress` (Set→Array serialized)
- `databricks-profile` - streaks, sessions, time spent
- `databricks-filters` - topic/difficulty/type filter state
- `databricks-active-course` - currently selected `Course`

Legacy `databricks-*` naming persists for backwards compatibility.
Newer `recall-*` keys auto-migrate on first load and left in place as rollback safety net.

## Question Types

Five formats live side-by-side.
Spaced repetition treats them all as equal-weight questions.

### 1. Multiple Choice (`QuestionType.MULTIPLE_CHOICE`)

Recall / distinction.

**Misconception tagging:**
Distractors can carry optional `misconceptionTag` (string from registry in `src/data/misconceptions.ts`) identifying specific named student error.

Examples: `py-off-by-one-range`, `py-list-aliasing`

When user picks tagged distractor:
- Platform records event to localStorage (`databricks-misconceptions`)
- Surfaces top hits in ProgressTracker

**Authoring rule:** Only tag distractor when wrong answer corresponds to SPECIFIC named misconception in registry.
Generic "obviously wrong" options stay untagged.
**CORRECT option is never tagged.**

**Reference file:** `src/data/pyBasicsMisconceptionMCQs.ts`

### 2. Coding (`QuestionType.CODING`)

Write code from scratch.
Validated by `codeValidator.ts` token-set matching against `solution`.

Use `# OR` / `-- OR` for genuine syntax alternates.

**Fields:**
- `prompt: string` - what to build
- `solution: string` - reference implementation (can contain `# OR` / `-- OR` alternatives)
- `starterCode: string` - comment-only or minimal scaffolding
- `language: 'python' | 'sql'`

### 3. Parsons (`QuestionType.PARSONS`)

Drag-the-line.
User reassembles known-correct solution from shuffled lines, sometimes with distractor lines.
Lower cognitive load than cold writing; ideal for first exposure to primitive.

**Schema:**
- `correctOrder: string[]` - canonical sequence of lines user must reproduce
- `distractorLines?: string[]` - optional plausible-but-wrong lines
- `solution: string` - assembled answer, shown on incorrect submission

**Authoring rules:**
- One statement per line
- One primitive per question at beginner
- Distractors should each map to documented student error

Encode misconceptions in distractors: `=` vs `==`, escaped braces, mutated-vs-reassigned, etc.

**Reference file:** `src/data/pyBasicsParsonsQuestions.ts`

### 4. Predict Output (`QuestionType.PREDICT_OUTPUT`)

Code-tracing.
Show short snippet; user types exact output `print()` would produce.
Forces mental-model use before writing.

**Schema:**
- `code: string` - snippet to read (3-8 lines is sweet spot)
- `expectedOutput: string` - canonical output; matched after:
  - Trimming trailing whitespace per line
  - Dropping leading/trailing blank lines
  - Collapsing multi-line gaps to single blank lines
- `acceptableOutputs?: string[]` - optional alternates for genuine ambiguity (rare in modern Python)

**Authoring rules:**
- One misconception per question: off-by-one, slice exclusivity, mutation aliasing, immutability of strings, default-arg semantics, etc.
- Keep snippets short - long snippets shift cognitive load away from primitive being tested

**Reference file:** `src/data/pyBasicsPredictOutputQuestions.ts`

### 5. Cloze Code (`QuestionType.CLOZE_CODE`)

Faded worked example.
Show mostly-correct code with `___` markers replaced by inline inputs.
User fills in most pedagogically meaningful tokens (operator, keyword, method name) - boilerplate preserved.

Lower cognitive load than cold writing; ideal as middle step of "worked → faded → cold" progression.

**Schema:**
- `template: string` - code with `___` (3 underscores) marking each blank's position
- `blanks: string[]` - expected token for each blank, in order
- `blankAlternates?: string[][]` - optional acceptable alternates per blank (e.g. equivalent operators)
- `solution: string` - fully-assembled correct code, shown on incorrect submission

**Authoring rules:**
- 1-3 blanks per question
- Blank the *interesting* token (operator, keyword, method) not boilerplate (variable names, literals)
- Surrounding code must be unambiguously correct so user can focus on missing primitive

**Reference file:** `src/data/pyBasicsClozeQuestions.ts`

## Adding Questions

**Per-question rules:** see the `/construct-topic` skill.
- Introduce → combine → apply ramp
- Primitive inventory
- Advanced prompts must be prose, not scaffolded with code comments naming functions

### Quick Checklist

1. **Pick right `Topic` and `Difficulty`:**
   - Beginner introduces ONE primitive
   - Intermediate combines TWO already-introduced
   - Advanced is 3+-primitive realistic scenario

2. **Drop question into matching `src/data/<topic>Questions.ts` file** (or create one)

3. **For Web Dev / Backend:** also append question id to correct slot in relevant ordered bank:
   - `webdevOrderedQuestions.ts`
   - `backendOrderedQuestions.ts`
   - etc.

4. **Coding questions:**
   - Write `solution` first
   - Then `starterCode` as comment-only / minimal scaffolding
   - Use `# OR` / `-- OR` for genuine alternates

5. **Run leak-check scripts** and fix any HIGH/MEDIUM hits before considering it done:
   - `node scripts/check-leaks.js` (all courses; lane A = comment-only starters, lane B = code scaffolding)
   - `node scripts/check-prompt-leaks.js`
   - `node scripts/check-starter-leaks-webdev.js`

6. **Avoid reserved-word identifiers:** `date`, `name`, `status`, `type`

7. **If test asserts on printed output, prompt must say "print the result"**

## Known Gotchas

### Monaco Editor Disposal

Requires explicit disposal to avoid "Canceled" promise errors when navigating away mid-edit.

**Pattern in `CodingQuestion.tsx` (lines 143-147):**

```typescript
useEffect(() => () => {
  try { editorRef.current?.dispose?.(); } catch {}
  editorRef.current = null;
}, []);
```

### Leak-Check: two auto-routed lanes

`check-leaks.js` scans every coding question in `src/data/*.ts` across all courses and picks a lane per question based on whether the starter is comment-only:

- **Lane A - comment-only starter** (the SQL course pattern, `-- SELECT ... full query`). Strip comments and the starter looks empty, so a naive char-ratio is blind to it (the old "just uncomment it" blind spot). Lane A instead *uncomments* the starter and flags it when:
  - it reproduces the solution (or a `-- OR`/`# OR` alternative) nearly verbatim → `verbatim-solution` (HIGH), or
  - it reveals the solution's distinctive tokens, scored over only the tokens the prompt did NOT already give (so restating the schema, or a "rewrite this anti-pattern" starter, is not a false positive) → `recall=` (HIGH ≥0.80, MED ≥0.55).
- **Lane B - real-code starter** (Web Dev / Next.js / Python: imports, signatures, JSX shells with `// your code here`). Stripped-char ratio of the non-comment code vs the solution → HIGH ≥0.70, MED ≥0.40, LOW ≥0.20. Uncommenting here would false-positive on legit guidance comments, which is why routing matters.

This unified detector replaces the retired `check-commented-solution.js` (which only scanned `topic_dj_*` and was blind to the SQL course).

MED lane-A hits are usually *approved* intent-prose starters and config-artifact questions (CICD YAML, gunicorn/Docker/settings blocks) where config IS the deliverable.

**All comment/line handling splits on `\r?\n`** so CRLF checkouts do not misreport.

### Question Order Resurrection

**GOTCHA:** `questions.ts` topic-file spreads resurrect questions dropped from `backendOrderedQuestions.ts`.

Drops must be physical deletions from topic files, not just removal from ordered banks.

**Tool:** `scripts/check-ordered-strays.js` finds questions in ordered banks missing from topic files (inverse of the usual ordering check).
