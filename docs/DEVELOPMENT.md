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
- Unlock thresholds: `UNLOCK_ACCURACY_PCT=80`, `RAMP_CARDS_PER_STEP` (topic ramp), `UNLOCK_COVERAGE_PCT=100` (unit and section aggregates)
- Today's session: `TODAY_SESSION_SIZE`, `TODAY_REVIEW_SHARE`, `NEW_PER_DRILL`, `REASK_SPACING`, `MAX_REASKS_PER_SESSION`
- Card-family FSRS: `FSRS_REQUEST_RETENTION`, `FSRS_MAX_INTERVAL_DAYS`, `FAMILY_EASE_EXPONENT`, `LOAD_BALANCE_MIN_DAYS`, `LOAD_BALANCE_SPREAD`, `FSRS_STORE_VERSION`
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
- The due branch passes a due-only filter to `hasDueMastered`/`pickMasteredResurface` (the drain filter while draining, otherwise `isIntervalDue`), so it draws from due cards only.
  Without the filter one due card among hundreds of recently reviewed ones lost the draw to not-yet-due cards, and well-known cards came back at about 2 percent of their interval.
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
- When nothing is strictly due, light `MASTERED_RESURFACE_FLOOR_FRACTION = 0.20` interleave keeps not-yet-due advanced cards warm (only outside onboarding), leaving out resting well-known cards (below)

**Well-known cards rest until due:**
A card on a correct streak of `WELL_KNOWN_STREAK` (5) or more is resting until its own interval (`getEffectiveInterval`) has passed (`restingWellKnown`).
The floor interleave, the concept-aware picker and the legacy priority scorer all choose among the review pool minus resting cards, so a concept that needs practice is practised through its other cards.
Before this, the concept-aware picker brought streak >= 5 cards back at a median of about 50 percent of their interval on the reference learner's real state, because it chooses by concept retrievability rather than card intervals.
Cards below the bar are still consolidating and stay eligible for the early interleave; due, missed and drain cards are never resting.
When every review card outside the cooldown is resting, the selector serves the next unlocked new card instead (unless the drain is forcing reviews).
Only when no new content is left does `pickNearestDue` serve the resting card closest to due.
`wellKnownReturn.sim.test.ts` and `drainReplay.sim.test.ts` assert that no streak >= 5 card is served before its interval, with no tolerance (the closest-to-due fallback aside).

**Relearn step:**
- `pickDueRelearn` runs first in the review slot (whenever the latest attempt was not a miss), before the `consolidationPending` deferral and before the drain.
- It serves a card whose latest answer was wrong once its relearn interval (`getEffectiveInterval` at streak 0, about a day scaled by card difficulty) has passed - any topic, any type, the one missed longest ago first.
- Without it a missed MCQ / parsons / cloze / predict card in a mastered topic had no branch that owned it: the drain serves only coding/advanced cards and the concept-aware picker ignores the miss, so 39 such cards in the reference history went 50-91 days unseen.
- It only fills review slots; the new-question draw has already run, so it does not reopen new content during a drain.

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

**Today's session (`utils/reviewSession.ts`):**
Each course has one bounded session a day, `TODAY_SESSION_SIZE` (20) questions by default, with an end and a summary.
Size and review share are settings on the Today card on Home (`recall-today-size`, `recall-today-review-share`).
When the session starts one fixed review list is built: due card families in unlocked topics, most overdue (lowest FSRS retrievability) first, each mapped to the one card it serves, capped at `TODAY_REVIEW_SHARE` of the session (12 of 20).
Inside the list the old pickers' rules are ordering rules (`reviewListRank`): relearn families (missed last time) first, then drain cards (coding or advanced in a mastered topic), then the card's concept bucket in `REVIEW_LIST_BUCKET_ORDER`, each most overdue first.
The rest of the session is fresh slots: the next unanswered card of the current topic's ramp, with a drill of a family already met after every `NEW_PER_DRILL` new cards.
When the ramp is held by its difficulty gate, or finished but below the unlock bar, drills go to that topic (missed cards first) so the bar can be reached.
The session serves the list first, and the "Reviews left N" pill and the Today card show its length, so the number drops by exactly one per answered review.
A first miss anywhere in the session comes back `REASK_SPACING` cards later ("+1 again"), at most `MAX_REASKS_PER_SESSION` times per session.
Families due beyond the cap stay due and lead the next days' lists; "Keep going" lifts the bound and serves them, then fresh slots, for as long as the learner wants.
Under topic, difficulty or type filters the plan serves what it can inside them; past the plan, and also after "Done for today", "Practice" comes from the same list and families (due families beyond the cap, then a drill of a family already met, then an unseen card) without using a slot.
The older selector below is not used by the session.
The session is stored under `recall-today-session`, so a reload the same day resumes it (count, slots left, cards served, and "Done for today"); a new day starts a new one.

**Card families (`utils/familySchedule.ts`):**
A family is one primitive of one topic: the topic plus the card's first concept tag (`familyOf`), about 625 across the courses.
Each family has one FSRS state from `ts-fsrs` (no short-term steps, intervals in days), instead of every card having its own streak interval.
A family review serves one card (`pickFamilyCard`): the card it missed last time, otherwise a seen card of a type not used last time, a missed one first, then the one seen longest ago.
Resting well-known cards (`WELL_KNOWN_STREAK`) are never served early; a family with only resting cards waits for them.
The FSRS grade is the same auto-grade card difficulty uses (correctness, response time, hint cap), and the answered card's difficulty scales the interval by `easeFactor ** FAMILY_EASE_EXPONENT`.
Intervals of `LOAD_BALANCE_MIN_DAYS` or more move within `LOAD_BALANCE_SPREAD` to the day with the fewest families due.
The first failed submit of a tiered coding card is recorded as a miss (`CodingQuestion` `onFirstMiss`) while retry stays open; the terminal pass or give-up is then a `retry` attempt that counts for accuracy but is not a second family review.

**Topic unlock:**
A topic's ramp (`topicRamp`) is the first card of each of its families plus up to `RAMP_CARDS_PER_STEP` cards of each difficulty x type step, in ramp order.
The next topic opens when the topic's lesson is met (below), every ramp card is answered and the topic's answered cards are above `UNLOCK_ACCURACY_PCT` at their latest answer (`isRampDoneAtBar`, granted by `updateMasteredTopics` with the App's `isTopicLessonMet`), instead of at 100% coverage.
A topic without a lesson yet needs only its ramp.
Inside the ramp, intermediate opens when the beginner ramp cards are answered at `IN_TOPIC_DIFFICULTY_GATE_PCT` (`isRampDifficultyOpen`), and advanced likewise.

**Lessons (`utils/lessons.ts`, `data/lessons/`):**
A lesson teaches one topic before its ramp: a rule card (the idea, the form, the one pitfall, and a worked example whose output is shown) and 3-5 of the topic's existing questions as exercises, in ramp order.
Lessons are `TopicLesson` data beside the bank, one per topic for now, written one section per PR from each course's first topic, in course order (SQL for Data Engineering, then Backend, then Databricks); `/write-lesson` drafts one.
A lesson is met when it was completed, or when any of its exercises was already attempted, so existing progress is credited and never forced through a lesson.
The gate lives in the App, not the selector: when the session serves an unseen card whose topic's lesson is not met (`lessonGateFor`), the App shows the rule card instead; "Try the exercises" (or Enter) then serves the exercises in order as new cards through the normal `handleAnswer`, so they count for coverage, the session's slots and the schedule exactly as other cards do, and a miss is asked again like any other.
After the lesson the session goes on with the rest of the topic's ramp.
Answering the last exercise records the lesson under `recall-lessons`; new filters end a lesson in progress.
Beside every card of a topic with a lesson, the rule card stays in a side panel, and `R` reopens it in full (Esc closes it).
The learning path on Home shows each topic's lesson, ramp and review steps with "Start lesson" or "Rule card", and Progress -> Topics lists every topic with "Rule card" and "Drill" and the review schedule of its card families.
`scripts/check-lessons.js`, run by `npm test` (`data/lessons/checkLessons.test.ts`), checks every lesson: exercise ids exist, belong to the topic and are in ramp order with an MCQ and a predict and no cold write first; the worked example runs (SQL on sql.js through a small T-SQL layer, procedural T-SQL through `scripts/tsql-batch.js`, Python on python3) and prints its `output`, except a Django / DRF example marked `worked.runs: false`, whose output is checked by hand; it does not repeat an exercise's solution (check-leaks.js token recall); and the prose keeps one sentence per line with no em dashes.

**Drain queue definition:**
`countPendingDrain` - single source of truth behind both the `hasPendingDrain` gate and `getReviewStatus.drainQueueCount`, so gate and count can't disagree.
It is not the number the learner sees: the breadcrumb and Home show "reviews left today" (above).

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

Used by every due-check:
- `hasDueMastered`
- `countPendingDrain` (behind `hasPendingDrain`)
- `pickMasteredResurface`
- `getReviewStatus`
- `isIntervalDue` (the due branch's filter, also behind `drainPred`)
- `pickDueRelearn` (at streak 0, the relearn interval)
- `restingWellKnown` and `pickNearestDue`

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
- **Pass it to BOTH gate and count or they desync**

**Topic difficulty:**
`getTopicDifficulty(topicQuestions, cardDifficulty)` rolls topic's drain-card difficulties up to `easy`/`medium`/`hard` label shown as breadcrumb pill (`.topic-diff-pill`)

**Coding response-time envelopes widened:**
`conceptSRS.ts`: coding `easy 240k / hard 600k` so long coding answers aren't auto-graded "hard" for length.

### Code Validation

**Location:** `src/utils/codeValidator.ts`

NOT in `CodingQuestion.tsx`.
`CodingQuestion` calls `gradeCodingSubmission(question, code)`, which validates once per test case.
A question with an empty `testCases` list is still checked once against `solution`, so it never accepts arbitrary code.
The bank itself must not ship empty `testCases`; `src/data/questionBankIntegrity.test.ts` enforces this along with one correct option per MCQ and cloze keys that fill to their solution.
Regression suite: `codeValidator.mutants.test.ts` (every reference passes; flipped, truncated and unfinished mutants do not).

**Process:**

1. **Split alternatives:** `solution` split on `# OR` (Python) or `-- OR` (SQL) into independent alternative solutions
2. **Normalize:** User code AND each alternative normalized same way:
   - Strip comments/whitespace/imports
   - Normalize quotes
   - Lowercase for SQL
3. **Equivalence rewrites:** `filter`↔`where`, `sort`↔`orderBy`, `col("x")`↔`"x"`, `df["x"]`↔`"x"`, `F.func`→`func`, `INNER JOIN`↔`JOIN`, SQL `a.x = b.y` / `a.x <> b.y` (and `!=`) predicates after `ON`/`WHERE`/`AND`/`OR`/`WHEN`/`HAVING` put in a fixed side order (never `SET` assignments), etc.
4. **Bracket check:** user code with an unclosed or mismatched `(`, `[` or `{` is a `fail` when the reference itself is balanced (catches truncated answers).
5. **Match each alternative:** pass if ANY alternative matches, either by:
   - Containment - the whole normalized alternative appears in user code on token boundaries (full solution plus extras). A user fragment of the solution is never a pass.
   - Token match - EVERY solution token (single-character operators and digits included) appears in user code, counted per occurrence and order-independent, with precision ≥ 40%. Partial recall never passes; it can only reach `uncertain`.
6. **Return verdict:**
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
- `DataTables.tsx` - read-only sample-data grids for a question's `tables`
- `InlineCode.tsx` - `renderInlineCode` for backticked prose (SQL course only)

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
- `recall-progress` - `UserProgress` (Set→Array serialized)
- `recall-profile` - streaks, sessions, time spent
- `recall-filters` - topic/difficulty/type filter state
- `recall-active-course` - currently selected `Course`
- `recall-misconceptions`, `recall-concept-progress`, `recall-card-difficulty`, `recall-concept-migration-version`
- `recall-fsrs` - the card-family FSRS schedule (`familySchedule.ts`), derived data: it is rebuilt by replaying `attemptHistory` when missing, unreadable, an older `FSRS_STORE_VERSION`, built from a different history (its `basis`), or built against a different card-to-family mapping, as after a concept re-tag (its `bank`), and replayed from the remaining history when a course is reset; `recall-progress`, `recall-card-difficulty` and `recall-concept-progress` are kept and still updated, so the change can be rolled back
- `recall-today-size`, `recall-today-review-share` - Today's session settings, read straight from storage
- `recall-today-session` - today's session per course, dropped at the day boundary
- `recall-lessons` - completed lessons, `{ [lessonId]: completedAt }` (`utils/lessons.ts`); written only when a lesson is completed, cleared for a course when its progress is reset
- `recall-concept-srs-enabled` (feature flag, `featureFlags.ts`) - a setting read straight from storage
- `recall-dev-unlock-all` - developer unlock switch, not exported

Older `databricks-*` keys are copied to their `recall-*` names on first load and left in place as a rollback safety net.

**Keeping progress safe** (`src/utils/progressStorage.ts`):
- An unreadable `recall-progress` is never overwritten until a copy of it is safe.
  The text is copied to its own `recall-progress-unreadable-backup-<ISO timestamp>` key (reused if a backup already holds the same text), a banner explains and offers the text as a download, and saving resumes from empty.
  If that copy could not be written, the session runs from empty in memory with study-record writes switched off, and the banner says whether earlier backups exist.
  Backups are never deleted automatically; while any exists a dismissible notice offers each as a download, Export carries them, and Import restores them as opaque text.
- History for question ids missing from the build is set aside on read and written back unchanged, so a renamed or removed question gets its history back if the id returns.
- Every write goes through `safeSetItem`; a failure (for example a full quota) shows a "not being saved" banner instead of crashing the app.
- A tab that sees another tab save answers (`storage` event) stops writing and asks for a reload, so two tabs never overwrite each other.
- Export and Import in the header round-trip every `recall-*` key in `EXPORT_KEYS` and every unreadable-progress backup as one JSON file with a format version and export date.
  This is also how progress moves to another origin (a different port or browser), since localStorage belongs to one origin.
  Import validates the whole file first and writes all keys or none; keys missing from the file (an older export) are left as they are.
  When this browser already holds answers, Import says what it would replace and asks first, then copies every key it overwrites to the single `recall-progress-pre-import-backup` key, itself an export file, replacing the copy any earlier import left there; if that copy cannot be written the import is refused.
  Export leaves the pre-import backup out.
  A browser with no answers yet takes the file without asking.
  The page reloads after an import so the app shows the imported progress.

## Question Types

Five formats live side-by-side.
Spaced repetition treats them all as equal-weight questions.

Any question can carry `tables?: SqlTable[]` (`{ name, columns, rows }`, `null` cells render as NULL).
SQL questions use it to show the data a query reads as small read-only grids above the code (`DataTables.tsx`), so the query says `FROM dbo.Payment` instead of building rows inline with `WITH`/`VALUES`.
Predict questions write their own small tables, since the rows decide the answer.
In Querying Foundations every other question gets the canonical sample tables from `src/data/tsqlSampleTables.ts` through `attachSampleTables`, trimmed to the columns the question mentions.
In DDL & Constraints most questions create their own tables, so the few that read or alter an existing one set `tables` themselves, using `sampleTable(name, columns)` for a canonical table.
Analytical & Window SQL questions set `tables` the same way.
Transactions & Procedural T-SQL questions do too, for the tables they write (an INSERT or UPDATE target) as well as the ones they read; their predicts read a shown table instead of filling a temp table.
Data Modeling in SQL questions do too, including the dimension tables a new fact table REFERENCES and the target and source of a MERGE; the Slowly Changing Dimensions questions carry their own versioned `dbo.DimProduct` rows (EffectiveDate, EndDate, IsCurrent).
ELT & Transformation Patterns questions do too, for every staging source and load target (MERGE, USING, INSERT, DELETE); none fills a temp table, and every variable a cloze or predict assigns is declared in it.
Performance & Optimization questions do too, including the table a `CREATE INDEX ... ON` builds on and the target of a partition `SWITCH TO`.
Cloud Warehouse SQL questions do too, including the source of a Synapse CTAS; a question that creates its own table (the distribution cloze) shows nothing for it, and only the QUALIFY predict keeps a CTE, because the CTE is what it contrasts with QUALIFY.
`tsqlSampleTables.test.ts` fails if a question in any of these sections queries an existing table it does not show, or builds data inline.
In SQL-course questions, backticks in the text, multiple-choice options and explanation render as inline code (`InlineCode.tsx`); other courses show backticks as written.

### 1. Multiple Choice (`QuestionType.MULTIPLE_CHOICE`)

Recall / distinction.

**Misconception tagging:**
Distractors can carry optional `misconceptionTag` (string from registry in `src/data/misconceptions.ts`) identifying specific named student error.

Examples: `py-off-by-one-range`, `py-list-aliasing`

When user picks tagged distractor:
- Platform records event to localStorage (`recall-misconceptions`)
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
Show short snippet; user types the output it would produce.
Forces mental-model use before writing.

**Schema:**
- `code: string` - snippet to read (3-8 lines is sweet spot)
- `expectedOutput: string` - canonical output, compared by `outputMatches` in `src/utils/predictOutput.ts` (owner of the matching rules and the on-screen answer instructions; tests in `predictOutput.test.ts`):
  - Non-SQL: exact output after whitespace normalization (trailing whitespace, outer blank lines, blank-line runs, spaces inside list/dict reprs)
  - SQL query results: one row per line, columns in SELECT order separated by a comma, no headers, `NULL` for nulls, `(no rows)` for an empty result; quotes, spacing and tab separators are tolerated, values stay exact (`20` is not `20.0`)
  - SQL with `PRINT`: each printed line in order; when the batch also has a `SELECT`, only the `PRINT` output is the answer, so the prompt should say so
- `acceptableOutputs?: string[]` - optional alternates for genuine ambiguity, each a correct answer in a reasonable format (rare)

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
