# Recall

A spaced-repetition practice app for coding interview and certification prep.
It drills you on multiple-choice, predict-output, cloze, Parsons, and live-coding questions across several courses (Web Dev, Django/Backend, Data Engineering with T-SQL, and Databricks), scheduling reviews with an Anki-style algorithm so due material resurfaces before you forget it.

Built with React + TypeScript (Create React App) and Monaco Editor. All state is stored locally in the browser (`localStorage`); there is no backend to run.

## Prerequisites

- **Node.js 18+** and npm
- A modern browser

## Getting started

All commands run from the **`app/`** directory, not the repo root.

```bash
cd app
npm install      # install dependencies (first time only)
npm start        # start the dev server at http://localhost:3000
```

The dev server hot-reloads on save.

## Common commands

Run these from `app/`:

```bash
npm start                                  # dev server (http://localhost:3000)
npm run build                              # production build into app/build/
npm test                                   # run the test suite (watch mode)
npm test -- --testPathPattern=spacedRep    # run a single test file
npx tsc --noEmit                           # type-check without emitting
```

### Authoring / quality scripts

Questions live in `app/src/data/`. After adding or editing coding questions, run the leak-check scripts from `app/`:

```bash
node scripts/check-leaks.js                  # flag starter code that reveals the solution
node scripts/check-prompt-leaks.js           # flag prompts that leak the solution
node scripts/check-starter-leaks-webdev.js   # web-dev-specific starter checks
node scripts/check-hint-leaks.js             # flag tieredHints skeletons that leak the solution
```

## Project layout

```
Recall/
├── app/                  # the React app (run npm from here)
│   ├── src/
│   │   ├── components/    # question renderers, editor, UI
│   │   ├── data/          # question banks (one file per topic/course)
│   │   └── utils/         # spaced-repetition + answer validation logic
│   └── scripts/          # authoring/quality/audit scripts
├── docs/DEVELOPMENT.md   # architecture, question schemas, SRS mechanics
└── CLAUDE.md             # repo conventions and load-bearing rules
```

## Learn more

- **Architecture, question schemas, and spaced-repetition mechanics:** `docs/DEVELOPMENT.md`
- **Repo conventions and authoring workflow:** `CLAUDE.md`
