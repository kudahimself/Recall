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
`Recall/exercises/` holds the coding exercises learners do in their own editor (Python and pytest, plus Django for the Django ones and local PySpark with Delta Lake for the Databricks ones, pinned in `exercises/requirements.txt`; see `exercises/README.md`).

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
4. Update switches in `App.tsx` / `spacedRepetition.getUnlockedSections`

**Question organization:**
- Questions grouped into per-topic files in `src/data/`
- Aggregated through `src/data/questions.ts`
- **Ordered banks** define within-topic learning sequence:
  - `webdevOrderedQuestions.ts`
  - `advancedWebdevOrderedQuestions.ts`
  - `backendOrderedQuestions.ts`
  
  New questions for these courses get appended in the right slot in the ordered bank, not just dropped into topic file.

- **Data Engineering course** skips the ordered-bank pattern and ships per-section files.
  It is being rewritten section by section as decisions and designs (a lesson per topic, then predict the outcome, choose and justify, Parsons, spot the flaw, and explain cards in review); the older sections are MCQ-only.
  - `dataEngineeringFoundationsQuestions.ts`
  - `dataEngineeringStorageFilesQuestions.ts` (a rewritten section, Step 2; its predict-the-outcome checks are in `dataEngineeringStorageFilesChecks.ts`)
  - `dataEngineeringWarehousesLakesQuestions.ts` (a rewritten section, Step 3; its predict-the-outcome checks are in `dataEngineeringWarehousesLakesChecks.ts`)
  - `dataEngineeringMovingDataQuestions.ts` (the first rewritten section; its predict-the-outcome checks are in `dataEngineeringMovingDataChecks.ts`)
  - `dataEngineeringModelingAnalyticsQuestions.ts` (a rewritten section, Step 5; its predict-the-outcome checks are in `dataEngineeringModelingAnalyticsChecks.ts`)
  - `dataEngineeringStreamingQuestions.ts` (a rewritten section, Step 6; its predict-the-outcome checks are in `dataEngineeringStreamingChecks.ts`)
  - `dataEngineeringDistributedQuestions.ts` (a rewritten section, Step 7; its predict-the-outcome checks are in `dataEngineeringDistributedChecks.ts`)
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
Size and review share are on the Settings screen (`recall-today-size`, `recall-today-review-share`); every course uses them, and a session not started yet takes a change at once.
When the session starts one fixed review list is built: due card families in unlocked topics, most overdue (lowest FSRS retrievability) first, each mapped to the one card it serves, capped at `TODAY_REVIEW_SHARE` of the session (12 of 20).
Inside the list the old pickers' rules are ordering rules (`reviewListRank`): relearn families (missed last time) first, then drain cards (coding or advanced in a mastered topic), then the card's concept bucket in `REVIEW_LIST_BUCKET_ORDER`, each most overdue first.
The rest of the session is fresh slots: the next unanswered card of the current topic's ramp, with a drill of a family already met after every `NEW_PER_DRILL` new cards.
When the ramp is held by its difficulty gate, or finished but below the unlock bar, drills go to that topic (missed cards first) so the bar can be reached.
The session serves the list first, and the Today card on Home shows its length (the quiz header's status badge says it on hover), so the number drops by exactly one per answered review.
A first miss anywhere in the session comes back `REASK_SPACING` cards later (the banner says "It comes back once more, a few cards later."), at most `MAX_REASKS_PER_SESSION` times per session.
Families due beyond the cap stay due and lead the next days' lists; "Keep going" lifts the bound and serves them, then fresh slots, for as long as the learner wants.
Under topic, difficulty or type filters the plan serves what it can inside them, and the session still ends at its size with "Done for today".
When the filters have nothing left of the plan while cards outside them are still waiting, the quiz says "Nothing left today for these filters" and offers Reset filters.
Only after "Keep going" does "Practice" come from the same list and families (due families beyond the cap, then a drill of a family already met, then an unseen card), without using a slot.
"Drill" (D) on Progress → Topics and Review schedule, and "Drill all" on Progress → Overview, start that practice on their topics straight away; the drill mode is held in the App only, never on the session, so today's bound is unchanged, and Reset filters, Start and a course switch end it.
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
A section or unit the learner has already reached (one of its questions answered or a topic mastered, `reachedTopics` / `lastReachedIndex`) stays open with everything before it, so a section inserted early in a course never re-locks later ones; the inserted section shows as open, not passed.

**Lessons (`utils/lessons.ts`, `data/lessons/`):**
A lesson teaches one topic before its ramp: a rule card (the idea, the form, the one pitfall, and a worked example whose output is shown) and 3-5 of the topic's existing questions as exercises, in ramp order.
Lessons are `TopicLesson` data beside the bank, one per topic for now, written one section per PR from each course's first topic, in course order (SQL for Data Engineering, then Backend, then Databricks, then Web Dev; Data Engineering lessons arrive with each rewritten section); `/write-lesson` drafts one.
A lesson is met when it was completed, or when any of its exercises was already attempted, so existing progress is credited and never forced through a lesson.
The gate lives in the App, not the selector: when the session serves an unseen card whose topic's lesson is not met (`lessonGateFor`), the App shows the rule card instead; "Try the exercises" (or Enter) then serves the exercises in order as new cards through the normal `handleAnswer`, so they count for coverage, the session's slots and the schedule exactly as other cards do, and a miss is asked again like any other.
After the lesson the session goes on with the rest of the topic's ramp.
Answering the last exercise records the lesson under `recall-lessons`; new filters end a lesson in progress.
In a course with rule cards, on a wide screen, one column stays beside every card: the topic's rule card, or for a topic without one the topic and how it stands, so the question keeps one width and place; `R` reopens the rule card in full (Esc closes it).
Above every card one header row (`components/QuizBar.tsx`) shows Back, the section and topic by their courseConfig names, one session-status badge (the card's kind and today's count), Rule card (`R`) and Filters (`F`); a lesson adds its exercise steps under it.
The learning path (`components/PathList.tsx`) shows each topic's lesson, ramp and review steps with "Start lesson" or the rule card: Home shows the section holding the next lesson (else the current section); Progress -> Topics lists every section's topics, and the selected topic has its "Rule card" (R), "Drill" (D) and the review dates of its card families; Progress -> Review schedule lists every card family met, by the day it comes due.
`scripts/check-lessons.js`, run by `npm test` (`data/lessons/checkLessons.test.ts`), checks every lesson: exercise ids exist, belong to the topic and are in ramp order with an MCQ and a predict and no cold write first; the worked example runs (SQL on sql.js through a small T-SQL layer, procedural T-SQL through `scripts/tsql-batch.js`, Python on python3, JavaScript on node, TypeScript type-checked in strict mode and then run on node) and prints its `output`, except an example that cannot run here (one of `NON_RUNNABLE_KINDS` in `utils/workedKinds.ts`) marked `worked.runs: false`, whose output is checked by hand; it does not repeat an exercise's solution (check-leaks.js token recall); and the prose keeps one sentence per line with no em dashes.

**Exercises (`utils/exercises.ts`, `data/exercises/`, repo `exercises/`):**
After a topic's lesson and ramp comes one small coding exercise the learner does in their own editor, sized for 10-30 minutes and answerable from that topic and earlier ones.
Nothing runs in the browser: the files live in `exercises/<course>/<topic>/` (a `README.md` with the task and examples, a starter module with signatures and `TODO`s, and `test_*.py` pytest tests), and the reference solution sits apart in `exercises/solutions/<course>/<topic>/`, laid over the starter files.
`TopicExercise` data in `data/exercises/index.ts` is what the app shows: Progress -> Topics renders the selected topic's exercise card (the task in brief, the folder path with a Copy button, the files and how to run `pytest`) with a done tick the learner sets, and the learning path adds an Exercise step after Review.
Exercises are written one section per PR, like lessons: Backend Python Fundamentals, Python Advanced, Django, Django Advanced & Deployment, DRF Production Patterns, Celery & Background Tasks, Testing & CI/CD, Production Infrastructure, Python Mastery & Advanced and Real-time & Monitoring, which is every Backend section, then Databricks: Lakehouse Platform, ELT with Spark SQL & Python, Incremental Data Processing, Production Pipelines, Optimization & Advanced, Data Governance, Data Modeling & Warehousing Design and Lakehouse Architecture & Engineering Practice, which is every Databricks section.
Each Django exercise folder holds one app (a package with an `apps.py`) and a `conftest.py` that loads the shared settings, `exercises/backend/exercise_settings.py`: SQLite in memory, so the tests need no server, database service or network.
`dj_cicd` and `dj_nginx` are the exceptions, with no app and no `conftest.py`: `dj_cicd` holds a GitHub Actions workflow (`.github/workflows/ci.yml`, which GitHub ignores outside the repository root) that its tests parse with PyYAML, and `dj_nginx` an Nginx site config (`bookshop.conf`) that its tests parse as text, never running Nginx.
`dj_settings` keeps a `conftest.py` but has no app: it is a settings package its tests import afresh under environment variables they set.
Those settings install only the app of the exercise folder pytest runs from, or every exercise's app when run from anywhere else, so app labels and model table names must be unique across exercises as well.
The Django exercises need Django, pytest-django, Django REST Framework, drf-spectacular, Celery, redis-py, fakeredis, factory_boy, Faker and Channels (with Daphne, which its testing module imports), pinned in `exercises/requirements.txt`, installed in the `python3` that `npm test` runs.
The Databricks exercises (`exercises/databricks/<topic>/`) run on a local PySpark 4.0 session with Delta Lake 4.0, with no Databricks workspace: each folder's `conftest.py` imports the shared `spark` fixture from `exercises/databricks/spark_setup.py` (local mode, Delta as the default table format, a temporary warehouse).
They need Java 17+ and the `pyspark` and `delta-spark` pins in `exercises/requirements.txt` (plus `pandas` and `pyarrow`, pyspark's sql extra, for the pandas UDFs of `advanced_topics`, whose `conftest.py` also points `PYSPARK_PYTHON` at the test Python so the UDF workers match it); the first run downloads the Delta jars once from Maven Central, then it works offline.
A Databricks-only topic (compute policies, Unity Catalog and its grants, row filters and masks, dbutils, Auto Loader, Lakeflow pipelines and jobs) practises the same decision on something that runs locally, and its README says what the platform does instead; nothing fakes a Databricks API.
Starting Spark takes 10 to 20 seconds, so `check_exercises.py` checks a course in `BATCHED` (databricks) in two pytest runs, all starters then all solutions, instead of two per exercise; set `EXERCISES_PYTHON` to run `npm test` with a Python other than `python3` (one that has Java and pyspark available).
`exercises/check_exercises.py`, run by `npm test` (`data/exercises/exercises.test.ts`, which also keeps the list in step with the folders and checks that test files and modules have names unique across exercises, so pytest can collect every exercise at once from the repo root), runs each exercise's tests on a copy of its starter, where every test must fail, and on a copy with the reference solution laid over it, where every test must pass; it skips the starter check for a starter the learner has edited, copies the course folder's shared modules (the Django settings) next to each copy, and lets a solution add Django migrations the starter lacks.

**Drain queue definition:**
`countPendingDrain` - single source of truth behind both the `hasPendingDrain` gate and `getReviewStatus.drainQueueCount`, so gate and count can't disagree.
It is not the number the learner sees: Home and the quiz header's status badge show "reviews left today" (above).

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
`getTopicDifficulty(topicQuestions, cardDifficulty)` rolls topic's drain-card difficulties up to `easy`/`medium`/`hard` label shown in the topic column beside the question

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
   - HTML: `<!-- -->` comments stripped, class lists and attributes compared as sets (reordered `class` values or attributes still match), `/>` read as `>`
   - JS/TS/JSX: function parameters and loop variables renamed to positional placeholders within their own scope, `x =>` read as `(x) =>`, and an arrow's `{ return expr; }` read as `expr` (`canonicalizeJsParams`; tests in `codeValidator.jsParams.test.ts`)
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
- `ParsonsQuestion.tsx`, `PredictOutputQuestion.tsx`, `ClozeCodeQuestion.tsx`
- `PredictOutcomeQuestion.tsx`, `ChooseJustifyQuestion.tsx`, `SpotFlawQuestion.tsx`, `ExplainQuestion.tsx` (the decision and design types, see Question Types 6-9)

**Progress/filters:**
- `progress/ProgressView.tsx` - the Progress screen: ARIA tabs for Overview (the course's numbers, every section, activity, what is worth another look), Topics (every section's topics beside the selected one: lesson, ramp, review, its `ExerciseCard` and card families) and Review schedule (every card family met, by the day it comes due); built on `utils/coursePath.ts` and `utils/progressStats.ts`
- `PathList.tsx` - a section's learning path (lesson, ramp, review steps) on Home; its step badges (`UnitSteps`) and status icons are shared with Progress → Topics
- `FilterDialog.tsx` - the topic / difficulty / type filters as a dialog (`F`), persisted to `localStorage`

**Shared UI components** (`src/components/ui/`, each styled by its own CSS Module on the design tokens):
- `Button`, `Kbd` / `KeyCombo` / `KeyHints` (the key hint row under every screen), `Badge`, `Card` / `Panel` / `Eyebrow`, `Dialog`, `MenuButton`
- `StatTile`, `ProgressBar`, `SegmentedControl`, `Checkbox`, `StepList`, `EmptyState` - the one stat tile, bar, choice row, checkbox (with a mixed state), numbered step row and empty list
- `Screen` - the frame and title row of Home, Progress and Settings; `MessageCard` - a screen-sized message in the quiz (the session summary, a filter with nothing left, a question that failed to render); `Notice` - the storage notices under the top bar
- `InlineText` / `Prose` - the one prose renderer, in every course: `code`, **bold** and fenced code blocks
- `CodeBlock` - read-only code with line numbers and comments, and with `slots` the fields of a cloze; `TextAnswer` / `AnswerCompare` / `Blank` - typed answers, before and after grading
- `QuestionShell` - the frame of a question: prompt, answer area, hints (`H`, one at a time), the banner (`FeedbackBanner`, with `ResultList` for a coding question's checks) in a live region, and one footer whose action becomes Next. It owns the question's keys and focus. `QuestionRegion` and `AnswerColumns` lay out the answer area: a region gives up height and scrolls inside itself before the card would, and `fill` lets the code editor take the height left.
- `OptionList` - options (multiple choice, choose and justify), code lines (spot the flaw) or checkboxes (explain's key points), with 1-9 keys and word-and-icon marks after grading
- Every question type renders on `QuestionShell`: cloze is a `CodeBlock` with a `Blank` in each slot; Parsons is two listboxes (the lines and your solution) over dnd-kit pointer drag; coding puts Monaco in a `fill` shell, with spent hints, the solution or the live preview beside it.
- `Logo` - the top bar's elephant tile (`public/icon.svg`) and "Recall" wordmark
- `Tabs` / `TabPanel` - ARIA tabs (Left/Right, Home/End); `ListBox` - a grouped single-choice list, one Tab stop, Up/Down/Home/End/Page keys
- `Heatmap` - answers per day, weekday rows and month labels, ending today; it draws as many weeks as fit its width
- `visual/LivePreview.tsx` - the live preview of HTML and CSS answers (cloze, Parsons, coding), with preview widths, `@media` rules and a layout overlay
- `DataTables.tsx` - read-only sample-data grids for a question's `tables`

**App shell and screens:** `shell/AppShell.tsx` (the frame: top bar, notices, navigation, the screen scrolling inside `<main>`), `shell/TopBar.tsx` (logo, `CourseSwitcher` on `C`), `shell/NavRail.tsx` (Home, Learn, Progress, Settings; a tab bar under the screen below 768px), `QuizLayout.tsx` (the quiz bar, lesson steps, the question and the column beside it), `home/HomeView.tsx` (the one-screen dashboard) and `settings/SettingsView.tsx` (session size, review share, Export, Import, Reset).

**Keyboard:** `src/keyboard/shortcuts.ts` is the one shortcut registry; `useShortcut` binds a key from it, and the `?` overlay (`ShortcutHelp.tsx`) is generated from it.
Single keys never fire while typing; Shift+Enter and Ctrl/Cmd+Enter check from inside a text box, a blank or the code editor; an open `Dialog` takes the keys.
In a cloze, Enter goes to the next blank and checks on the last; in Parsons, up and down walk a list, Space adds or takes back a line, Alt+up and Alt+down move it, left and right switch lists; in Monaco, Tab indents and Esc leaves the editor unless a suggestion, find or snippet widget is open.

**UI theme:**
Direction A "Night": dark purple, one brand fill for primary buttons in every course (a course's hue is only a marker).
Design tokens (colour, type scale on a 16px root, spacing, radii, motion) live in `src/styles/tokens.css` and the few element rules in `src/styles/base.css`; every other stylesheet is a CSS Module beside its component, on tokens only (`app/scripts/check-css-tokens.js` checks every stylesheet).
Fonts are IBM Plex Sans and Mono, self-hosted through `@fontsource`.
The logo is the yellow elephant tile (`--brand` / `--on-brand` in `tokens.css`, never a button or text colour); `src/brand/recall-mark.svg` is its one source and `npm run build:icons` (`scripts/build-icons.js`) regenerates every icon in `public/` and the desktop shortcut's `launcher/recall-elephant.ico` from it.
Layouts target a desktop or laptop viewport without page scrolling; below 768px a screen is one column that scrolls, the question card grows with its content, and key hints give way (a phone has no keyboard).

**Monaco Editor config:**
- Theme: `recall-night`, `vs-dark` with its colours read from the design tokens
- No minimap; the code font and size of every code block (`--font-mono`, `--fs-code`)
- Line numbers on
- Read-only after correct answer
- No Ctrl/Cmd+R binding (it reloads the page everywhere else); Reset is a button under the editor

### Persistence

**localStorage keys** (defined in `App.tsx`):
- `recall-progress` - `UserProgress` (Set→Array serialized)
- `recall-profile` - streaks, sessions, time spent
- `recall-filters` - topic/difficulty/type filter state, restored on load (`parseFilters` in `utils/questionFilters.ts`); a course switch resets only the topic list
- `recall-active-course` - currently selected `Course`
- `recall-misconceptions`, `recall-concept-progress`, `recall-card-difficulty`, `recall-concept-migration-version`
- `recall-fsrs` - the card-family FSRS schedule (`familySchedule.ts`), derived data: it is rebuilt by replaying `attemptHistory` when missing, unreadable, an older `FSRS_STORE_VERSION`, built from a different history (its `basis`), or built against a different card-to-family mapping, as after a concept re-tag (its `bank`), and replayed from the remaining history when a course is reset; `recall-progress`, `recall-card-difficulty` and `recall-concept-progress` are kept and still updated, so the change can be rolled back
- `recall-today-size`, `recall-today-review-share` - Today's session settings, read straight from storage
- `recall-today-session` - today's session per course, dropped at the day boundary
- `recall-lessons` - completed lessons, `{ [lessonId]: completedAt }` (`utils/lessons.ts`); written only when a lesson is completed, cleared for a course when its progress is reset
- `recall-exercises` - exercises the learner ticked done, `{ [exerciseId]: doneAt }` (`utils/exercises.ts`); written only when a tick changes, cleared for a course when its progress is reset
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
- Export and Import on the Settings screen round-trip every `recall-*` key in `EXPORT_KEYS` and every unreadable-progress backup as one JSON file with a format version and export date.
  This is also how progress moves to another origin (a different port or browser), since localStorage belongs to one origin.
  Import validates the whole file first and writes all keys or none; keys missing from the file (an older export) are left as they are.
  When this browser already holds answers, Import says what it would replace and asks first, then copies every key it overwrites to the single `recall-progress-pre-import-backup` key, itself an export file, replacing the copy any earlier import left there; if that copy cannot be written the import is refused.
  Export leaves the pre-import backup out.
  A browser with no answers yet takes the file without asking.
  The page reloads after an import so the app shows the imported progress.

## Question Types

Nine formats live side-by-side: the five below, then four decision and design types (6-9) for courses that test judgment rather than code.
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
In every course, backticks in question text, options and explanations render as inline code, `**bold**` as bold and a fenced block as code (`components/ui/InlineText.tsx`); `InlineText.test.tsx` scans the bank so no prose uses a backtick or `**` as a literal character.

### 1. Multiple Choice (`QuestionType.MULTIPLE_CHOICE`)

Recall / distinction.

**Misconception tagging:**
Distractors can carry optional `misconceptionTag` (string from registry in `src/data/misconceptions.ts`) identifying specific named student error.

Examples: `py-off-by-one-range`, `py-list-aliasing`

When user picks tagged distractor:
- Platform records event to localStorage (`recall-misconceptions`)
- Surfaces top hits under "Worth another look" on Home and on Progress → Overview

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
  - HTML/CSS: nothing is printed, so the on-screen instruction asks about the rendered page; the prompt must name the value and the form to type it in
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

### Decision and design types (6-9)

Four types where the learner produces an answer instead of picking a sentence: a value, a decision with its reason, a line, or an explanation.
They were added for the Data Engineering rewrite but are tool-agnostic: tables, SQL or a few lines of pseudo-config are the notation.
Grading lives in `src/utils/answerCredit.ts` (unit-tested in `answerCredit.test.ts`); the components are `PredictOutcomeQuestion.tsx`, `ChooseJustifyQuestion.tsx`, `SpotFlawQuestion.tsx` and `ExplainQuestion.tsx`, built on the shared `QuestionShell` and `OptionList` (`components/ui/`), with their layout in `ReasoningQuestion.module.css`.
`shapeErrors` is run over the whole bank by `questionBankIntegrity.test.ts`.
One sample of each lives in `src/dev/sampleQuestions.ts`: the tests use them as fixtures, and the dev server shows one in the real quiz view at `http://localhost:3000/?sample=<id>` (`dev-sample-predict-outcome`, `dev-sample-choose-justify`, `dev-sample-spot-flaw`, `dev-sample-explain`), recording nothing.
They are not in the bank.

**Ramp place** (`RAMP_TYPE_ORDER` in `spacedRepetition.ts`): multiple choice, predict output, predict the outcome, choose and justify, Parsons, spot the flaw, cloze, coding.
Explain is review-only and never in a ramp.

**Partial credit.**
Choose and justify and explain pass their own `credit` to the recorder (`AnswerMeta.credit`), stored on the attempt like a hinted coding pass.
The constants are in `spacedRepetition.ts`:
- credit at or above `CREDIT_CORRECT_THRESHOLD` (0.75) is a full pass;
- for choose and justify only, credit from `PARTIAL_PASS_CREDIT` (0.5) up to the threshold is a pass under the bar, like a hinted pass: the card leaves today's list, its correct streak resets and its FSRS grade is capped at Hard (`PARTIAL_CREDIT_GRADE_CAP`, `capGradeForCredit`), so the family comes back sooner;
- for choose and justify, credit below 0.5 is a miss (re-asked in the session, graded Again);
- explain has no partial band: it passes only at 0.75, and anything below is a miss.
In every case the fraction counts toward the topic's unlock bar, as hinted credit does.

#### 6. Predict the Outcome (`QuestionType.PREDICT_OUTCOME`)

Small input tables and a job or situation; the learner types one value (a count, a date, a total).
Nothing to eliminate.

**Schema:**
- `tables?: SqlTable[]` - the input tables (the shared `BaseQuestion` field, rendered by `DataTables.tsx`)
- `code?: string`, `language?: CodeLanguage` - the job, query or config that runs; prose-only situations omit both
- `answer: string` - the one right value, e.g. `'8'` or `'2026-11-19'`
- `acceptableAnswers?: string[]` - other spellings of the same value
- `unit?: string` - shown after the input and the answer, e.g. `'rows'`; typing it is optional
- `tempting?: { answer, why }[]` - wrong answers worth naming; all are shown after grading, and the one the learner typed is highlighted
- `resultTables?: SqlTable[]` - tables shown with the explanation, e.g. the target after both runs

**Grading:** exact after trimming, case-folding, collapsing spaces, dropping a final full stop and the unit (`outcomeMatches`); `8` is not `8.0`.

**Checked by running it:** every predict-the-outcome card needs an entry in a checks registry (`dataEngineeringMovingDataChecks.ts`, `dataEngineeringStorageFilesChecks.ts`, `dataEngineeringWarehousesLakesChecks.ts`, `dataEngineeringModelingAnalyticsChecks.ts`, `dataEngineeringStreamingChecks.ts`, `dataEngineeringDistributedChecks.ts`): SQLite run on the card's `tables` (each named by the first word of its title), or Python.
`scripts/check-outcomes.js`, run by `npm test` (`data/outcomeChecks.test.ts`), fails a card with no check or whose check gives something other than its `answer`.

#### 7. Choose and Justify (`QuestionType.CHOOSE_JUSTIFY`)

Pick the decision, lock it in, then pick the reason it is right.
Options are shown in a stable shuffle per question.

**Schema:**
- `decisions: ChoiceOption[]` and `reasons: ChoiceOption[]` - `{ id, text, isCorrect }`, exactly one correct in each

**Credit** (`chooseJustifyCredit`): 1 for both right, `CHOOSE_JUSTIFY_DECISION_CREDIT` (0.5) for the right decision with the wrong reason, 0 for a wrong decision whatever the reason.

**Authoring rule:** each wrong reason is a real misconception about why the decision works (speed, a guarantee it does not give), not a false sentence.

#### 8. Spot the Flaw (`QuestionType.SPOT_FLAW`)

A job, DAG or table design as numbered lines; the learner clicks the line that causes a stated symptom and checks it.

**Schema:**
- `lines: string[]` - one entry per clickable line
- `flawLines: number[]` - 1-based numbers of the lines that are the cause; any of them is right (a flaw can span two lines)
- `language?: CodeLanguage` - for the header; prose or pseudo-config omits it
- `note?: string` - context beside the lines; input tables use `tables`
- `resultTables?: SqlTable[]` - shown with the explanation

**Authoring rule:** the lines on screen are the whole design; nothing outside them should be needed to find the flaw.

#### 9. Explain in Your Own Words (`QuestionType.EXPLAIN`)

Review-only.
The learner types two or three sentences, then sees the model answer and ticks the key points their answer made.
Recall does not grade prose.

**Schema:**
- `keyPoints: string[]` - 2-5 points a full answer makes, one sentence each
- `modelAnswer: string` - two or three sentences, shown after the learner submits

**Credit** (`explainCredit`): ticked key points / all key points, recorded when the learner confirms the ticks (3 of 4 meets the 0.75 bar).
Explain passes only at the 0.75 bar: anything below, such as 2 of 4 or 2 of 3, counts as a miss (the 0.5 partial band is for choose and justify only).
The fraction is still stored as the attempt's credit.

**Review-only** (`REVIEW_ONLY_TYPES`, `isReviewOnly`): an explain card is never a new card, a ramp card, an unseen drill or practice card, and `check-lessons.js` rejects it as a lesson exercise.
It joins its family's review rotation once every ramp card of its topic is answered (`pickFamilyCard`): unseen, it counts as the card seen longest ago, so the next review whose type rotation allows it serves it.

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

**Pattern in `CodingQuestion.tsx` (the unmount-cleanup `useEffect`, simplified):**

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
