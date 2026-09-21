# CLAUDE.md

Guidance for Claude Code in this repo.
Full architecture, question schemas, and spaced-repetition mechanics: **`docs/DEVELOPMENT.md`**.
Question construction workflow and question writing quality standards live in skills - invoke them:
- `/verify` - pre-commit quality gate (tests/type-check/lint/leak-checks)
- `/add-question` - guided question authoring workflow
- `/construct-topic` - build/audit a topic's full ramp (primitive inventory, type matrix, wiring)
- `/write-questions` - pedagogical quality rubric per question type (predict/cloze/parsons/coding)
- `/write-hints` - author the two-tier hint scaffold (apiSignature + skeleton) for coding questions
- `/preview-questions` - live preview + computed-style grading rules for Web Dev HTML/CSS/Tailwind questions (previewHtml/previewChecks)
- `/audit-questions` - quality review across topic/course (mechanical: leaks, parity, reserved words)
- `/audit-mcq` - MCQ distractor quality pass (length parity, positional bias, misconception-grade distractors)
- `/topic-stats` - coverage analysis, identifies gaps
- `/ship` - commit mechanics, runs verify, handles push workflow

## Load-bearing rules (break these and the app breaks)

- **All npm commands run from `app/` directory**, not repo root.
  Dev server, tests, builds, leak-check scripts - all execute from `Recall/app/`.
- **Question additions require TWO updates** - drop the question into `src/data/<topic>Questions.ts`
  AND append its id to the ordered bank (`webdevOrderedQuestions.ts`, `backendOrderedQuestions.ts`)
  for Web Dev / Backend courses.
  Data Engineering and Databricks skip the ordered-bank step (section files only).
  Forgetting the ordered-bank append means the question never appears in the app.
- **`courseConfig.ts` is the single source of truth** for Topic→Course mapping, section structure,
  and path order.
  Adding a 5th course requires touching `getCourseForTopic`, `getTopicOrder`, and the switches in
  `App.tsx` / `ProgressTracker.tsx` / `spacedRepetition.getUnlockedSections`.
- **Spaced-repetition tuning constants live ONLY in `spacedRepetition.ts`** - unlock thresholds,
  rolling windows, priority weights, selection knobs.
  Never duplicate these constants at callsites.
- **Code validation alternatives via `# OR` / `-- OR` syntax** - split solution into acceptable
  forms in the solution field itself (`# OR` for Python, `-- OR` for SQL), don't weaken the
  validator.
  The validator normalizes and token-matches; order-independent.
- **Monaco editor disposal pattern required** - without explicit disposal, navigating away
  mid-edit throws "Canceled" promise errors.
  Pattern in `CodingQuestion.tsx` lines 143-147.
- **localStorage keys use the `recall-*` prefix** - `recall-progress`, `recall-profile`, and the rest of
  `STORAGE_KEYS` in `App.tsx`; legacy `databricks-*` keys are copied over once and left in place.
- **Never write progress except through `safeSetItem` / `serializeProgress`** (`src/utils/progressStorage.ts`).
  They keep unreadable stores, unknown-id history and other tabs' answers from being overwritten.
  Adding a new persisted key means adding it to `EXPORT_KEYS` so Export/Import still round-trips everything.

## Conventions

- **Question construction follows the introduce → combine → apply ramp** - beginner introduces
  ONE primitive, intermediate combines TWO already-introduced, advanced is 3+ realistic scenario.
  See `/construct-topic`.
- **Write `solution` first, then `starterCode`** - solution is the reference implementation,
  starter is comment-only or minimal scaffolding.
  Heavy scaffolding leaks the answer.
- **UI targets desktop viewport without scrolling** - dark-purple theme with radial-gradient
  mouse-tracked card effects.
  Monaco Editor: `vs-dark`, no minimap, line numbers on, read-only after correct answer.

## Agent conduct

- **Run leak-check scripts after adding/editing coding questions** - `check-leaks.js`,
  `check-prompt-leaks.js`, `check-starter-leaks-webdev.js`,
  `check-hint-leaks.js` (when the question carries `tieredHints`).
  `check-leaks.js` covers all courses and auto-routes: lane A flags comment-only starters that
  uncomment to the solution (the commented-solution anti-pattern, `verbatim-solution` or high recall),
  lane B flags heavy code scaffolding.
  Act on HIGH tier; MED lane-A flags are usually approved intent-prose/config-artifact starters.
  Scripts are part of the authoring workflow, not optional.
- **Avoid reserved-word identifiers** - `date`, `name`, `status`, `type` cause subtle bugs.
- **If the test asserts on printed output, the prompt must say "print the result"** - implicit
  output expectations fail validation.
- **Long Markdown: one sentence per physical line** - keep normal structure, just don't wrap
  multiple sentences onto one line.
- **No em dashes** - use plain hyphen "-" in prose, commit messages, code comments.
- **No co-author line on commits** - never add `Co-Authored-By` or agent attribution.

## Everyday commands

All run from `Recall/app/`:

```bash
npm test -- --testPathPattern=spacedRep     # run single test file (CRA syntax)
node scripts/check-leaks.js                  # flag coding question starter leaks (all courses; lane A = comment-only starters, lane B = code scaffolding)
node scripts/check-prompt-leaks.js           # flag prompts that leak the solution
node scripts/check-starter-leaks-webdev.js   # webdev-specific starter leak check
node scripts/check-hint-leaks.js             # flag tieredHints skeletons that leak the solution
```

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
