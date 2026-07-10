# Leak-fix progress

Script: `node scripts/check-leaks.js` — ground truth for current state.

## Completed

### HIGH severity (all done)
- **B1** `pythonAdvOopQuestions.ts` — exc-2, exc-4, copy-2
- **B2** `pythonGapFillQuestions.ts` — typehints-2
- **B3** `pythonEssentialsQuestions.ts` — m4-4, m4-8, closure-2, idioms-3
- **B4** `pythonAdvancedQuestions.ts` — comp-1/2, iter-1/2, ctx-1/2
- **B5** `pythonAdvancedQuestions.ts` — coll-1/2, regex-1, magic-1/2, types-1
- **B6** `djangoGapDj4eQuestions.ts` — fk-6, cbv-6, m2m-2, session-4, owned-2
- **B7** `certificationQuestions.ts` — dlt-10, cdc-8, platform-sql-3, cdc-7, dlt-3
- **Stripper fix** — added `--` (SQL) and `/* */` handling to `scripts/check-leaks.js`
- **B8** `djangoGapFillQuestions.ts` dj-setup-gap-2 · `webdevQuestions.ts` + `webdevOrderedQuestions.ts` js-arr-4 · `questions.ts` ps-basic-3 · `masteryQuestions.ts` cast-1

Additional fixes during session: `pcpp-inherit-2`, `pcpp-oop-2`, `pcpp-meta-4`, `pcpp-magic-2`, `pcpp-magic-3`, `pcpp-prop-2`, `pcpp-shelve-2`, `pcpp-dec-2`.

### MEDIUM severity
- **M1** (8) `pythonEssentialsQuestions.ts` — m3-4, m3-7, m3-22, m4-12, builtins-3, builtins-5, modules-3, idioms-4
- **M2** (5) `pythonAdvancedQuestions.ts` — async-1, async-3, types-2, dc-2, test-1
- **M3** (5) `pythonAdvOopQuestions.ts` args-2, pickle-2, meta-2 · `pythonGapFillQuestions.ts` regex-2, itertools-2
- **M4** (8) `djangoGapDj4eQuestions.ts` — fk-4, m2m-4, owned-3, cbv-2, cbv-3, cbv-4, cbv-8, forms-2
- **M5+M6** (9) `backendQuestions.ts` py-ds-2/3 · `backendAdvancedQuestions.ts` auth-2, test-2, dj-signals-1 · `djangoGapFillQuestions.ts` dj-rest-gap-2 · `securityQuestions.ts` auth-5, attack-2, attack-5

### MEDIUM (all done)
- **M7** (12) `expandedQuestions.ts` — datetime/collection/string/math first batch
- **M8** (11) `expandedQuestions.ts` — remaining datetime/string/math/window/collection
- **M9** (6) `questions.ts` (ps-basic-2, ps-df-4, ps-df-11, ps-advanced-2/4) + `certificationQuestions.ts` perf-2
- **M10** (5) `masteryQuestions.ts` — schema-1, casewhen-1/3, udf-4, cast-3
- **M11** (9 unique × ~2 dupes = 17 fixes) `webdevOrderedQuestions.ts` + `webdevQuestions.ts` + `webdevGapQuestions.ts` + `webdevAdvancedQuestions.ts` + `htmlCssQuestions.ts` + `a11yShadcnQuestions.ts` — js-var-3/5, js-obj-2, js-es6-1/2, js-arr-5, react-router-2, css-resp-1, shadcn-cn-utility-1

### LOW (all done)
- **L1** (15) `expandedQuestions.ts` — datetime/string/math/window/grouping/null helpers
- **L2** (~24 fixes across dupes) webdev files — css-anim-2, css-layout-2, js-obj-3/4, react-cond-1, react-state-1, react-hooks-1, react-perf-1/2, react-ref-1, react-router-1, test-3
- **L3** (7) `backendQuestions.ts` — py-oop-3, py-err-1, dj-view-1, dj-url-1, dj-rest-1/2, dj-project-1
- **L4+L5** — masteryQuestions.ts (schema-2, udf-1, winfn-2/6, stream-adv-3); backendAdvancedQuestions.ts (be-auth-3, be-test-1, be-dj-cbv-1, be-project-api); pythonAdvOopQuestions.ts (pcpp-meta-6); pythonEssentials (pe1-m2-16, pe1-m4-11, pe1-fileio-3); pythonGapFill (py-gap-collections-2, py-gap-testing-2/3); pythonAdvanced (py-adv-dc-1, py-adv-async-2)
- **L6** backendGapQuestions.ts (py-err-6, dj-form-2, dj-rest-5, dj-orm-4, dj-url-3); backendInfraQuestions.ts (3); designPatternQuestions.ts (dp-struct-2); advancedNextQuestions.ts (next-url-state-1, next-error-handling-2); djangoGapDj4eQuestions.ts (dj4e-session-3); securityQuestions.ts (sec-comm-2); djangoAdvancedQuestions.ts (dj-admin-1/2, dj-cache-2, dj-tx-1); projectQuestions.ts (proj-js-1, proj-ts-2); certificationQuestions.ts (streaming-7, dlt-4); formsTestingQuestions.ts (next-forms-6, next-testing-9); prismaQuestions.ts (tanstack-2)

## Final state
HIGH=0, MEDIUM=0, LOW=0. Script output: "No leaks detected."

## Rules followed when fixing a leak

1. Strip starter to comment-only scaffolding.
2. Move every identifier, signature, exact return string, and driver shape into the `question` text (or very abstract starter comments).
3. If tests expect printed output, tell the user to `print()`.
4. Preserve trailing comma on `starterCode: \`...\`,` (easy to drop by accident).
5. Re-run `check-leaks.js` after each batch; run `npx tsc --noEmit` occasionally.
