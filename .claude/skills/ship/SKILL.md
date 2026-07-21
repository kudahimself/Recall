---
name: ship
description: Commit mechanics - runs verify, creates commit, handles push workflow
---

# Ship

Commit and push workflow for Recall. Ensures quality gates pass before code leaves your machine.

## Pre-commit sequence

1. **Run /verify** - all quality gates must pass:
   - Tests (npm test)
   - Type check (tsc --noEmit)
   - Lint (npm run lint)
   - Leak checks (all scripts, act on HIGH tier)

2. **Stage files** - prefer specific files over `git add -A`:
   ```bash
   git add src/data/<topic>Questions.ts
   git add src/data/webdevOrderedQuestions.ts  # if updated
   ```
   
   Avoid accidentally staging sensitive files (.env, credentials)

3. **Draft commit message:**
   - First line: concise summary (≤72 chars) of WHAT changed
   - Body: WHY (motivation, context, constraints)
   - Reference question IDs added/modified
   - Follow repo's commit style (check `git log` for recent examples)

Example:
```
Add 8 beginner Parsons questions to PY_BASICS

Covers list slicing, string methods, and basic iteration.
One primitive per question, distractor lines encode common
misconceptions (off-by-one, inclusive/exclusive confusion).

Questions: py_basics_044 through py_basics_051
```

4. **Create commit:**
   ```bash
   git commit -m "$(cat <<'EOF'
   <message here>
   EOF
   )"
   ```
   
   Use heredoc for multi-line messages.
   **Never add `Co-Authored-By` line** (agent conduct rule).

5. **Verify commit succeeded:**
   ```bash
   git status
   git log -1 --stat
   ```

## Push workflow

**IMPORTANT: Never push without fresh approval.**

Even if user approved push once, always confirm before each push:
- Show what will be pushed: `git log origin/main..HEAD --oneline`
- Show changed files: `git diff --stat origin/main..HEAD`
- Ask: "Push N commits to origin/main?"

On approval:
```bash
git push origin main
```

**Never force-push to main.**

## Handling pre-commit hook failures

If pre-commit hook fails (lint, tests, custom hooks):
- Hook failure means commit did NOT happen
- **Create NEW commit after fixing** (not --amend)
- `--amend` would modify PREVIOUS commit, potentially destroying work

**Never skip hooks** (`--no-verify`) unless user explicitly requests it.

## Output format (AXI-compliant)

**On success:**
```
✓ /verify passed - all quality gates clean
✓ Staged 3 files
✓ Commit created: a7f3c21 "Add 8 beginner Parsons to PY_BASICS"

Ready to push:
  1 commit ahead of origin/main
  Files changed: +127 lines across 3 files

─────────────────────────────
Push to origin/main?
```

**On quality gate failure:**
```
✗ /verify failed - 2 HIGH leak violations

Fix violations before committing:
  • py_basics_044 - starter 87% of solution
  • py_basics_046 - commented solution overlap 0.91

─────────────────────────────
Next: Fix leak violations, then retry /ship
```

## Commit separation

When changes span multiple concerns, create separate commits:

**Good separation:**
- Commit 1: Add 8 PY_BASICS questions
- Commit 2: Fix leak violation in existing question
- Commit 3: Update difficulty ramp for PY_ADVANCED topic

**Poor separation:**
- One commit mixing new questions + fixes + refactoring

Ask user before creating multiple commits:
```
Changes span 3 concerns:
  1. Add 8 new PY_BASICS questions
  2. Fix leak in py_advanced_019
  3. Refactor codeValidator equivalence rules

Create separate commits? (recommended)
```

## Integration with hooks

User may configure hooks in `.claude/settings.json`:
- `pre-commit-hook` - runs before commit creation
- `post-commit-hook` - runs after successful commit

If blocked by hook, determine if you can adjust actions.
If not, ask user to check hook configuration.

## Exit codes

- `0` - committed (and pushed if approved)
- `1` - quality gates failed, not committed
- `2` - commit succeeded but push was declined
