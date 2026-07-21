---
name: verify
description: Pre-commit quality gate - runs tests, type-check, lint, and all leak-check scripts
---

# Verify

Pre-commit quality checks for Recall. Run before committing question changes.

## What this does

1. **Test suite** - `npm test` (all tests must pass)
2. **Type check** - `npx tsc --noEmit` (zero type errors)
3. **Lint** - `npm run lint` (clean linting)
4. **Leak detection** - all question quality scripts:
   - `check-leaks.js` - starter code leaks, all courses. Lane A (comment-only starters) catches the commented-solution anti-pattern; Lane B (code scaffolding) catches heavy starters. Supersedes the retired `check-commented-solution.js`.
   - `check-prompt-leaks.js` - prompt leaks
   - `check-starter-leaks-webdev.js` - webdev-specific
   - `check-hint-leaks.js` - tieredHints skeletons that leak the solution

## Execution

All commands run from `app/` directory (NOT repo root).

Run checks in parallel where possible:
- Type-check and lint can run concurrently with tests
- All leak-check scripts can run concurrently

## Output format (AXI-compliant)

**On success:**
```
✓ Tests passed (127 suites)
✓ Type check clean
✓ Lint clean
✓ Leak checks: 0 HIGH, 0 MED
─────────────────────────────
Ready to commit
```

**On failure:**
```
✗ Tests failed (2 failures)
✓ Type check clean
✓ Lint clean
✗ Leak checks: 2 HIGH, 3 MED

HIGH violations:
  • be_drf_1234 - starter contains 89% of solution (check-leaks.js lane B)
  • py_async_5678 - verbatim-solution comment starter (check-leaks.js lane A)

MED violations:
  • [list MED findings]

─────────────────────────────
Fix violations before committing
Run: node scripts/check-leaks.js --detail
```

## Interpretation

**Act on:**
- All test failures (always fix)
- All type errors (always fix)
- All lint errors (always fix)
- HIGH tier from leak checks (≥0.8 similarity)

**Review but may skip:**
- MED tier from `check-leaks.js` lane A (often approved intent-prose/config-artifact starters where config IS the deliverable)

## Exit codes

- `0` - all checks passed, ready to commit
- `1` - at least one check failed, do not commit
