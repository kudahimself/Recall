# Starter-Code Leak Audit & Fix Tracker

This document tracks every **CODING** question flagged by `app/scripts/check-leaks.js` for handing the learner too much of the solution in its `starterCode`.
It is a fix backlog: clean questions are not listed. A row leaves the tracker (marked 🟢 Fixed) once the starter no longer leaks and the detector agrees.

## 🤖 Agent Operating Instructions (SOP for Any Agent / Subagent)

**Flagged Coding Questions:** `141` | **Fixed:** `27` | **Accepted:** `118` | **Pending:** `0`
(HIGH `2` · MEDIUM `34` · LOW `85` — regenerate counts by re-running the detector.)

The single source of truth is the detector. This tracker is a snapshot; always re-run it, do not trust stale rows:

```powershell
# from app/
node scripts/check-leaks.js
```

### 1. Workflow Sequence
1. **Pick a file with 🔴 `Pending` rows**, worst severity first (HIGH → MEDIUM → LOW).
2. **Set rows to 🟡 `In Progress`** in this tracker.
3. **Open `src/data/<file>` and fix the leaky `starterCode`.** The fix is almost always the same: replace the leaked answer with a **schema/intent-only comment** that names the table/columns/model and the target output, but NOT the functions, operators, or query shape that constitute the answer. Progressive help belongs in `tieredHints` (`apiSignature` + `skeleton`), not the starter.
   - Example (SQL): `-- SELECT Email, LEN(TRIM(Email)) AS EmailLength FROM stg.Customer;` → `-- stg.Customer(Email); return Email and EmailLength`
   - Never weaken the starter to the point of removing legitimate context (a "rewrite this" question may show the anti-pattern; a config-artifact question may show the config — those are the deliverable).
4. **Re-run the detector** and confirm the row is gone (or dropped to an accepted tier):
   ```powershell
   node scripts/check-leaks.js
   npx tsc --noEmit
   ```
5. **Mark 🟢 `Fixed`** (or ⚪ `Accepted`) in this tracker with a one-line note.

### 2. How the detector routes (read before triaging)
`check-leaks.js` picks a lane per question:

- **Lane A — comment-only starter** (SQL-course pattern: the whole query is a `--` comment). Uncomments the starter, then flags:
  - `verbatim-solution` — the starter reproduces the solution (or a `-- OR`/`# OR` alternative) nearly verbatim. Always a real leak.
  - `recall=X` — the starter reveals X of the solution's *distinctive* tokens, scoring only tokens the **prompt did not already give** (so schema restatement and "rewrite this" starters are not false-positived). HIGH ≥0.80, MED ≥0.55.
- **Lane B — real-code starter** (Web Dev / Next.js / Python: imports, signatures, JSX shells). Stripped-char ratio of non-comment code vs solution. HIGH ≥0.70, MED ≥0.40, LOW ≥0.20.

### 3. Triage guidance by tier
- **🔴 HIGH** — fix. These are genuine "the answer is in the starter" leaks.
- **🟠 MEDIUM** — review. Lane A MED is often approved intent-prose; Lane B MED is real but sometimes intentional scaffolding (config-artifact, signature-only). Fix or mark ⚪ Accepted with a reason.
- **🟡 LOW** — usually acceptable scaffolding (imports, a function signature, a JSX shell). Fix only if the non-comment code actually reveals the answer body; otherwise ⚪ Accepted.

### 4. Related skills (`.claude/skills/`)
- [`audit-questions`](file:///C:/Users/kudam/Documents/Github/Recall/.claude/skills/audit-questions/SKILL.md) — full quality sweep (this is the leak portion).
- [`write-hints`](file:///C:/Users/kudam/Documents/Github/Recall/.claude/skills/write-hints/SKILL.md) — where progressive help belongs instead of the starter.
- [`verify`](file:///C:/Users/kudam/Documents/Github/Recall/.claude/skills/verify/SKILL.md) — pre-commit gate that runs this detector.

---

> **Status Key:**
> - 🔴 `Pending` — Flagged by the detector, not yet triaged
> - 🟡 `In Progress` — Currently being fixed
> - 🟢 `Fixed` — Starter rewritten; detector no longer flags (or dropped below action tier)
> - ⚪ `Accepted` — Reviewed and left as-is (intentional scaffolding / config-artifact / approved intent-prose); note the reason

> **Severity:** 🔴 HIGH (fix) · 🟠 MEDIUM (review) · 🟡 LOW (usually acceptable)
> **Lane:** A = comment-only starter · B = real-code scaffolding
> Files are ordered by their worst finding.

## Flagged Questions

### `topic_dj_rest.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `dj-rest-1` | 🔴 HIGH | A | `recall=0.80` | 🟢 Fixed | Rewritten starter comment to intent-only prose |
| `dj-drf-getserializer-1` | 🟠 MEDIUM | B | `ratio=0.40 (123/304)` | ⚪ Accepted | Acceptable scaffolding (imports only) |
| `dj-rest-2` | 🟠 MEDIUM | A | `recall=0.63` | 🟢 Fixed | Rewritten starter comment to intent-only prose |
| `py-drf-router` | 🟠 MEDIUM | A | `recall=0.67` | 🟢 Fixed | Rewritten starter comment to intent-only prose |
| `dj-drf-adv-1` | 🟡 LOW | B | `ratio=0.23 (196/843)` | ⚪ Accepted | Acceptable scaffolding (imports only) |
| `dj-drf-apiview-fbv-1` | 🟡 LOW | B | `ratio=0.32 (177/557)` | ⚪ Accepted | Acceptable scaffolding (imports only) |

### `topic_py_data_structures.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `pe1-m4-11` | 🔴 HIGH | A | `recall=1.00` | 🟢 Fixed | Replaced exact method calls in comments with intent description |
| `pe1-m4-12` | 🔴 HIGH | A | `recall=0.80` | 🟢 Fixed | Removed solution details (dict.get increment logic) from starter comments |

### `topic_py_file_io.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `pe1-fileio-3` | 🔴 HIGH | A | `recall=1.00` | 🟢 Fixed | Replaced solution methods f.writelines and f.read in starterCode with intent-only comments |

### `topic_py_metaclasses.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `pcpp-meta-6` | 🔴 HIGH | A | `recall=1.00` | 🟢 Fixed | Replaced solution dunder tokens in starterCode comments with intent-only description |

### `topic_py_modules.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `pcpp-pickle-2` | 🔴 HIGH | A | `recall=0.90` | 🟢 Fixed | Replaced solution method names in starterCode comments with intent-only description |

### `topic_tsql_aggregation.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `tsql-agg-1` | 🔴 HIGH | A | `recall=0.83` | 🟢 Fixed | Replaced solution query structure with schema and intent-only comments |

### `topic_tsql_date_functions.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `tsql-dt-1` | 🔴 HIGH | A | `verbatim-solution` | 🟢 Fixed | Replaced solution query in starterCode with schema and intent-only comments |
| `tsql-dt-2` | 🔴 HIGH | A | `verbatim-solution` | 🟢 Fixed | Replaced solution query in starterCode with schema and intent-only comments |

### `topic_tsql_dml.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `tsql-dml-3` | 🔴 HIGH | A | `recall=1.00` | 🟢 Fixed | Replaced solution UPDATE...FROM...JOIN query in starterCode with intent-only comments |

### `topic_tsql_error_handling.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `tsql-err-1` | 🔴 HIGH | A | `recall=0.80` | 🟢 Fixed | Replaced solution transaction block in starterCode with intent-only comments |

### `topic_tsql_window_frames.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `tsql-frames-1` | 🔴 HIGH | A | `recall=0.80` | 🟢 Fixed | Replaced solution window aggregate query in starterCode with schema and intent comment |

### `topic_tsql_windows.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `tsql-windows-1` | 🔴 HIGH | A | `recall=0.80` | 🟢 Fixed | Replaced revealing window function comment with intent-only description |

### `a11yShadcnQuestions.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `a11y-aria-live-coding-1` | 🟠 MEDIUM | B | `ratio=0.63 (132/209)` | ⚪ Accepted | Standard component signature and JSX scaffolding shell |
| `shadcn-aschild-coding-1` | 🟠 MEDIUM | B | `ratio=0.54 (170/312)` | ⚪ Accepted | Component shell and imports without leaking Slot composition |
| `shadcn-cva-coding-1` | 🟡 LOW | B | `ratio=0.20 (78/387)` | ⚪ Accepted | Minimal cva import and function declaration scaffolding |

### `ingestionArchitectureQuestions.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `ing-coding-1` | 🟠 MEDIUM | B | `ratio=0.58 (108/187)` | ⚪ Accepted | Shows flawed initial code to be refactored; no solution leaked |
| `ing-coding-2` | 🟠 MEDIUM | B | `ratio=0.65 (91/139)` | ⚪ Accepted | Shows flawed baseline overwrite code; replaceWhere option not leaked |

### `masteryQuestions.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `io-2` | 🟠 MEDIUM | A | `recall=0.67` | ⚪ Accepted | Standard comment prompt |
| `schema-1` | 🟠 MEDIUM | A | `recall=0.60` | ⚪ Accepted | Standard comment prompt |
| `stream-adv-7` | 🟠 MEDIUM | B | `ratio=0.61 (190/312)` | 🟢 Fixed | Rewrote starterCode to intent comment, removing watermark call & partial join leak |
| `udf-4` | 🟠 MEDIUM | B | `ratio=0.40 (102/253)` | ⚪ Accepted | Standard imports & comment prompt |

### `nextjsQuestions.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `next-route-useroute-1` | 🟠 MEDIUM | B | `ratio=0.47 (104/221)` | ⚪ Accepted | Standard component signature & imports scaffolding |

### `prismaQuestions.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `prisma-11` | 🟠 MEDIUM | B | `ratio=0.41 (96/233)` | ⚪ Accepted | Standard imports & function stub |
| `prisma-13` | 🟠 MEDIUM | B | `ratio=0.46 (103/225)` | ⚪ Accepted | Standard imports & function stub |
| `tanstack-7` | 🟠 MEDIUM | B | `ratio=0.49 (139/283)` | ⚪ Accepted | Standard imports & component stub |

### `projectQuestions.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `proj-ts-2` | 🟠 MEDIUM | A | `recall=0.57` | ⚪ Accepted | Intent-only comment guidance step-by-step |

### `securityQuestions.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `sec-attack-2` | 🟠 MEDIUM | A | `recall=0.64` | 🟢 Fixed | Replaced detailed pseudo-code comments with high-level intent comments |
| `sec-attack-5` | 🟠 MEDIUM | A | `recall=0.74` | 🟢 Fixed | Replaced detailed pseudo-code comments with high-level intent comments |
| `sec-auth-5` | 🟠 MEDIUM | A | `recall=0.79` | 🟢 Fixed | Replaced detailed pseudo-code comments with high-level intent comments |

### `topic_dj_deployment.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `py-dj-deploy-collectstatic` | 🟠 MEDIUM | B | `ratio=0.55 (68/123)` | ⚪ Accepted | Scaffolding only (Path/BASE_DIR setup) |

### `topic_dj_forms.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `dj-forms-gap-2` | 🟠 MEDIUM | A | `recall=0.67` | ⚪ Accepted | Intent-only comments in starterCode |
| `dj4e-forms-2` | 🟠 MEDIUM | A | `recall=0.55` | ⚪ Accepted | Intent-only comments in starterCode |
| `dj-forms-modelchoice-1` | 🟡 LOW | B | `ratio=0.22 (50/229)` | ⚪ Accepted | Minimal imports in starterCode |

### `topic_dj_models_mastery.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `dj-models-mastery-clean-1` | 🟠 MEDIUM | B | `ratio=0.43 (100/235)` | ⚪ Accepted | Minimal class signature scaffolding |

### `topic_dj_views_mastery.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `dj-views-mastery-decorator-1` | 🟠 MEDIUM | B | `ratio=0.57 (140/247)` | ⚪ Accepted | Minimal imports in starterCode |
| `dj-views-mastery-streaming-1` | 🟡 LOW | B | `ratio=0.26 (63/238)` | ⚪ Accepted | Minimal imports in starterCode |

### `topic_py_error_handling.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `py-err-6` | 🟠 MEDIUM | A | `recall=0.57` | 🟢 Fixed | Replaced solution logic in comments with clean function signature and intent comment |

### `topic_py_functions.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `pcpp-args-2` | 🟠 MEDIUM | A | `recall=0.79` | 🟢 Fixed | Replaced solution formatting and iteration comments with clean signature and intent comment |

### `topic_py_oop_advanced.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `pcpp-compose-2` | 🟠 MEDIUM | A | `recall=0.73` | ⚪ Accepted | Clean intent-only comments outlining class contracts without code |
| `py-oop-3` | 🟠 MEDIUM | A | `recall=0.67` | ⚪ Accepted | Concise intent prose for __init__, __str__, and __repr__ without code |

### `topic_py_oop.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `pcpp-methods-2` | 🟠 MEDIUM | A | `recall=0.67` | ⚪ Accepted | Outlines method signatures and specs in comments without python code |

### `topic_tsql_grouping_sets.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `tsql-gs-1` | 🟠 MEDIUM | A | `recall=0.67` | 🟢 Fixed | Replaced ROLLUP query comment with intent-only description |

### `topic_tsql_insert.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `tsql-insert-1` | 🟠 MEDIUM | A | `recall=0.67` | 🟢 Fixed | Replaced INSERT...SELECT query comment with intent-only description |

### `topic_tsql_joins.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `tsql-joins-1` | 🟠 MEDIUM | A | `recall=0.60` | 🟢 Fixed | Replaced INNER JOIN query comment with intent-only description |

### `topic_tsql_lag_lead.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `tsql-laglead-1` | 🟠 MEDIUM | A | `recall=0.75` | 🟢 Fixed | Replaced LAG function comment with intent-only description |

### `topic_tsql_subqueries_cte.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `tsql-subq-2` | 🟠 MEDIUM | A | `recall=0.67` | 🟢 Fixed | Replaced correlated subquery comment with intent-only description |

### `topic_tsql_synapse_fabric.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `tsql-syn-1` | 🟠 MEDIUM | A | `recall=0.67` | 🟢 Fixed | Replaced CTAS query comment with intent-only description |

### `webdevOrderedQuestions.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `html-sem-aside-1` | 🟠 MEDIUM | B | `ratio=0.45 (61/137)` | ⚪ Accepted | Base HTML article provided without solution aside element |
| `js-arr-4` | 🟠 MEDIUM | B | `ratio=0.70 (83/119)` | ⚪ Accepted | Base users array provided with intent comment |
| `js-arr-5` | 🟠 MEDIUM | B | `ratio=0.43 (40/92)` | ⚪ Accepted | Base numbers array provided with intent comment |
| `js-arr-6` | 🟠 MEDIUM | B | `ratio=0.53 (113/213)` | ⚪ Accepted | Base orders array provided with intent comment |
| `js-dom-localstorage-1` | 🟠 MEDIUM | B | `ratio=0.44 (61/140)` | ⚪ Accepted | Clean empty function shells provided |
| `js-dom-traversal-1` | 🟠 MEDIUM | B | `ratio=0.41 (34/82)` | ⚪ Accepted | Clean empty function shell provided |
| `js-es6-1` | 🟠 MEDIUM | A | `recall=0.67` | ⚪ Accepted | Intent-only comments for variables and template literal provided |
| `js-es6-2` | 🟠 MEDIUM | B | `ratio=0.51 (42/83)` | ⚪ Accepted | Base user object provided with intent comment |
| `js-fn-callback-1` | 🟠 MEDIUM | B | `ratio=0.53 (44/83)` | ⚪ Accepted | Clean empty function shell provided |
| `js-var-5` | 🟠 MEDIUM | B | `ratio=0.68 (84/123)` | ⚪ Accepted | Base defaults/userPrefs objects provided with intent comment |
| `react-router-2` | 🟠 MEDIUM | A | `recall=0.75` | ⚪ Accepted | Intent-only comments for imports and component definition provided |
| `tw-variant-1` | 🟠 MEDIUM | B | `ratio=0.43 (49/114)` | ⚪ Accepted | Base container div provided without solution child span element |
| `css-resp-autofit-1` | 🟡 LOW | B | `ratio=0.27 (26/97)` | ⚪ Accepted | CSS grid shell without leaking grid-template-columns or minmax/auto-fit |
| `js-async-sequential-concurrent-1` | 🟡 LOW | B | `ratio=0.25 (50/201)` | ⚪ Accepted | Async function shell with comment; no implementation leaked |
| `js-es6-regex-2` | 🟡 LOW | B | `ratio=0.27 (27/99)` | ⚪ Accepted | Function shell with comment; no regex or match logic leaked |
| `js-es6-regex-groups-1` | 🟡 LOW | B | `ratio=0.30 (28/94)` | ⚪ Accepted | Function shell with comment; no capture groups or replace logic leaked |
| `js-obj-3` | 🟡 LOW | B | `ratio=0.24 (24/100)` | ⚪ Accepted | Function shell with comment; no implementation leaked |
| `js-obj-4` | 🟡 LOW | B | `ratio=0.29 (44/154)` | ⚪ Accepted | Object declaration setup without leaking Object methods |
| `js-obj-extends-1` | 🟡 LOW | B | `ratio=0.31 (59/192)` | ⚪ Accepted | Base class context without leaking Dog subclass implementation |
| `js-obj-map-1` | 🟡 LOW | B | `ratio=0.20 (28/137)` | ⚪ Accepted | Function shell with comment; no Map logic leaked |
| `js-var-string-1` | 🟡 LOW | B | `ratio=0.34 (28/82)` | ⚪ Accepted | Function signature with intent comment; no string chaining leaked |
| `react-cond-1` | 🟡 LOW | B | `ratio=0.25 (47/189)` | ⚪ Accepted | Component signature with props shell; no conditional rendering leaked |
| `react-hooks-1` | 🟡 LOW | B | `ratio=0.24 (81/334)` | ⚪ Accepted | Custom hook imports & signature shell; no state/effect logic leaked |
| `react-list-1` | 🟡 LOW | B | `ratio=0.24 (28/115)` | ⚪ Accepted | Component signature with props shell; no map or key logic leaked |
| `react-ref-1` | 🟡 LOW | B | `ratio=0.23 (48/210)` | ⚪ Accepted | Component signature & import shell; no useRef/focus logic leaked |
| `react-state-1` | 🟡 LOW | B | `ratio=0.23 (47/200)` | ⚪ Accepted | Component signature & import shell; no state/event logic leaked |
| `ts-util-record-1` | 🟡 LOW | B | `ratio=0.24 (39/165)` | ⚪ Accepted | Role type alias context without leaking Record type annotation |

### `advancedNextQuestions.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `next-auth-deep-6` | 🟡 LOW | B | `ratio=0.30 (68/224)` | ⚪ Accepted | NextAuth config shell indicating callbacks placement without leaking callback code |
| `next-url-state-1` | 🟡 LOW | B | `ratio=0.22 (151/689)` | ⚪ Accepted | Client component imports & signature shell without leaking URL sync logic |
| `next-url-state-6` | 🟡 LOW | B | `ratio=0.28 (149/538)` | ⚪ Accepted | Client component imports & signature shell without leaking pagination logic |

### `certificationQuestions.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `streaming-12` | 🟡 LOW | B | `ratio=0.29 (26/90)` | ⚪ Accepted | Minimal stream_df variable assignment shell without load path or schema leak |

### `orchestrationDesignQuestions.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `orc-coding-1` | 🟡 LOW | B | `ratio=0.22 (91/408)` | ⚪ Accepted | DLT table shell without leaking expectation decorators |
| `orc-coding-2` | 🟡 LOW | B | `ratio=0.32 (86/268)` | ⚪ Accepted | Problem statement showing buggy PySpark Delta write chain to be fixed with replaceWhere |

### `topic_dj_auth_mastery.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `dj-auth-mastery-backend-1` | 🟡 LOW | B | `ratio=0.21 (91/426)` | ⚪ Accepted | Minimal imports & model binding |

### `topic_dj_auth.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `dj-auth-adv-2` | 🟡 LOW | B | `ratio=0.30 (146/490)` | ⚪ Accepted | Minimal imports in starterCode |
| `dj-auth-adv-3` | 🟡 LOW | B | `ratio=0.30 (200/658)` | ⚪ Accepted | Minimal imports in starterCode |
| `dj-auth-groups-1` | 🟡 LOW | B | `ratio=0.22 (52/238)` | ⚪ Accepted | Minimal imports in starterCode |
| `dj-auth-userpasses-1` | 🟡 LOW | B | `ratio=0.39 (116/299)` | ⚪ Accepted | Minimal imports in starterCode |

### `topic_dj_cbv.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `dj-cbv-adv-1` | 🟡 LOW | B | `ratio=0.30 (116/384)` | ⚪ Accepted | Minimal imports in starterCode |
| `dj-cbv-adv-2` | 🟡 LOW | B | `ratio=0.37 (178/479)` | ⚪ Accepted | Minimal imports in starterCode |
| `dj-cbv-context-1` | 🟡 LOW | B | `ratio=0.25 (64/255)` | ⚪ Accepted | Minimal imports in starterCode |
| `dj-cbv-formview-1` | 🟡 LOW | B | `ratio=0.35 (103/292)` | ⚪ Accepted | Minimal imports in starterCode |

### `topic_dj_celery.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `dj-celery-adv-1` | 🟡 LOW | B | `ratio=0.40 (104/262)` | ⚪ Accepted | Minimal imports in starterCode |

### `topic_dj_models.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `dj-model-1` | 🟡 LOW | B | `ratio=0.22 (58/267)` | ⚪ Accepted | Minimal class header scaffolding without field definitions |
| `dj-model-2` | 🟡 LOW | B | `ratio=0.24 (58/237)` | ⚪ Accepted | Minimal class header scaffolding without field logic |
| `dj-models-o2o-1` | 🟡 LOW | B | `ratio=0.40 (95/238)` | ⚪ Accepted | Minimal imports and class header stub without OneToOneField leak |
| `dj-models-save-1` | 🟡 LOW | B | `ratio=0.34 (89/258)` | ⚪ Accepted | Minimal imports and class stub without save() override leak |
| `dj-models-uuid-1` | 🟡 LOW | B | `ratio=0.34 (63/188)` | ⚪ Accepted | Minimal imports and class stub without UUIDField leak |

### `topic_dj_orm.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `dj-orm-adv-1` | 🟡 LOW | B | `ratio=0.32 (99/306)` | ⚪ Accepted | Minimal import statements and model binding without solution logic |
| `dj-orm-adv-2` | 🟡 LOW | B | `ratio=0.21 (59/286)` | ⚪ Accepted | Minimal import statements without solution logic |

### `topic_dj_postgres.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `dj-postgres-adv-1` | 🟡 LOW | B | `ratio=0.30 (99/333)` | ⚪ Accepted | Minimal import statements without solution logic |

### `topic_dj_signals_mw.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `dj-models-adv-2` | 🟡 LOW | B | `ratio=0.30 (173/582)` | ⚪ Accepted | Minimal import statements without signal receiver solution logic |

### `topic_dj_views.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `dj-view-404` | 🟡 LOW | B | `ratio=0.36 (74/207)` | ⚪ Accepted | Minimal import statements without view logic |
| `dj-view-httpresponse` | 🟡 LOW | B | `ratio=0.40 (33/83)` | ⚪ Accepted | Minimal import statement without response logic |
| `dj-view-param` | 🟡 LOW | B | `ratio=0.37 (33/89)` | ⚪ Accepted | Minimal import statement without parameter logic |
| `dj-view-render` | 🟡 LOW | B | `ratio=0.29 (32/111)` | ⚪ Accepted | Minimal render import statement without view logic |
| `dj-views-adv-6` | 🟡 LOW | B | `ratio=0.21 (120/582)` | ⚪ Accepted | Minimal paginator imports without view implementation |
| `dj-views-redirect-1` | 🟡 LOW | B | `ratio=0.36 (73/203)` | ⚪ Accepted | Minimal redirect imports without view implementation |

### `topic_py_collections.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `py-coll-defaultdict-group` | 🟡 LOW | B | `ratio=0.21 (32/156)` | ⚪ Accepted | Minimal import statement (defaultdict) without logic |
| `py-coll-deque-maxlen` | 🟡 LOW | B | `ratio=0.28 (26/94)` | ⚪ Accepted | Minimal import statement (deque) without logic |
| `py-coll-deque-queue` | 🟡 LOW | B | `ratio=0.21 (26/124)` | ⚪ Accepted | Minimal import statement (deque) without logic |
| `py-coll-deque-rotate` | 🟡 LOW | B | `ratio=0.27 (26/97)` | ⚪ Accepted | Minimal import statement (deque) without logic |
| `py-coll-namedtuple` | 🟡 LOW | B | `ratio=0.29 (31/106)` | ⚪ Accepted | Minimal import statement (namedtuple) without logic |

### `topic_py_context_managers.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `py-ctx-contextmanager-decorator` | 🟡 LOW | B | `ratio=0.29 (34/117)` | ⚪ Accepted | Minimal import statement (contextmanager) without logic |
| `py-ctx-suppress` | 🟡 LOW | B | `ratio=0.27 (28/104)` | ⚪ Accepted | Minimal import statement (suppress) without logic |

### `topic_py_dataclasses.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `py-dc-asdict` | 🟡 LOW | B | `ratio=0.34 (45/131)` | ⚪ Accepted | Minimal module imports (dataclass, asdict, astuple) |
| `py-dc-field-factory` | 🟡 LOW | B | `ratio=0.22 (36/166)` | ⚪ Accepted | Minimal module imports (dataclass, field) |
| `py-dc-frozen-basic` | 🟡 LOW | B | `ratio=0.26 (30/115)` | ⚪ Accepted | Minimal module import (dataclass) |
| `py-dc-inheritance` | 🟡 LOW | B | `ratio=0.22 (30/138)` | ⚪ Accepted | Minimal module import (dataclass) |
| `py-dc-order-sortable` | 🟡 LOW | B | `ratio=0.22 (30/138)` | ⚪ Accepted | Minimal module import (dataclass) |
| `py-dc-repr-false` | 🟡 LOW | B | `ratio=0.21 (36/171)` | ⚪ Accepted | Minimal module imports (dataclass, field) |
| `py-dc-simple` | 🟡 LOW | B | `ratio=0.32 (30/95)` | ⚪ Accepted | Minimal module import (dataclass) |
| `py-dc-slots` | 🟡 LOW | B | `ratio=0.26 (30/115)` | ⚪ Accepted | Minimal module import (dataclass) |

### `topic_py_datetime_paths.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `py-paths-2` | 🟡 LOW | B | `ratio=0.24 (21/89)` | ⚪ Accepted | Minimal import statement (Path) without logic |

### `topic_py_functools.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `py-functools-5` | 🟡 LOW | B | `ratio=0.26 (39/148)` | ⚪ Accepted | Minimal import statements (reduce, operator) without logic |

### `topic_py_futures.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `py-concurrency-2` | 🟡 LOW | B | `ratio=0.24 (56/233)` | ⚪ Accepted | Minimal scaffolding imports (time, ThreadPoolExecutor) |
| `py-concurrency-3` | 🟡 LOW | B | `ratio=0.28 (69/247)` | ⚪ Accepted | Minimal scaffolding imports (time, ThreadPoolExecutor, as_completed) |

### `topic_py_generators.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `py-gen-infinite-islice` | 🟡 LOW | B | `ratio=0.26 (25/95)` | ⚪ Accepted | Minimal import statement (islice) and intent-only comments |

### `topic_py_itertools.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `py-iter-groupby` | 🟡 LOW | B | `ratio=0.26 (26/99)` | ⚪ Accepted | Minimal import statement (groupby) without logic |
| `py-iter-int-product-islice` | 🟡 LOW | B | `ratio=0.32 (33/104)` | ⚪ Accepted | Minimal import statements (product, islice) without logic |
| `py-iter-pairwise` | 🟡 LOW | B | `ratio=0.26 (27/103)` | ⚪ Accepted | Minimal import statement (pairwise) without logic |
| `py-iter-starmap` | 🟡 LOW | B | `ratio=0.28 (26/92)` | ⚪ Accepted | Minimal import statement (starmap) without logic |
| `py-iter-takewhile-dropwhile` | 🟡 LOW | B | `ratio=0.28 (38/137)` | ⚪ Accepted | Minimal import statements (takewhile, dropwhile) without logic |

### `topic_py_mocking.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `py-mock-4` | 🟡 LOW | B | `ratio=0.29 (57/194)` | ⚪ Accepted | Minimal import scaffolding and context comments |
| `py-mock-7` | 🟡 LOW | B | `ratio=0.30 (38/126)` | ⚪ Accepted | Minimal import scaffolding (time, patch) |
| `py-mock-8` | 🟡 LOW | B | `ratio=0.22 (32/148)` | ⚪ Accepted | Minimal import scaffolding (MagicMock) |
| `py-mock-9` | 🟡 LOW | B | `ratio=0.21 (37/173)` | ⚪ Accepted | Minimal import scaffolding (MagicMock, call) |

### `topic_py_pydantic.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `py-pydantic-3` | 🟡 LOW | B | `ratio=0.26 (43/165)` | ⚪ Accepted | Minimal import scaffolding (BaseModel, ValidationError) |
| `py-pydantic-4` | 🟡 LOW | B | `ratio=0.21 (59/283)` | ⚪ Accepted | Minimal import scaffolding (BaseModel, field_validator, ValidationError) |

### `topic_py_serialization.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `py-ser-dataclass-json` | 🟡 LOW | B | `ratio=0.28 (47/166)` | ⚪ Accepted | Minimal import scaffolding (dataclass, asdict, json) |

### `topic_py_shell_os.ts`

| ID | Severity | Lane | Signal | Status | Notes |
|---|---|---|---|---|---|
| `py-shell-4` | 🟡 LOW | B | `ratio=0.25 (35/140)` | ⚪ Accepted | Minimal import scaffolding (tempfile, Path) |
| `py-shell-5` | 🟡 LOW | B | `ratio=0.20 (47/230)` | ⚪ Accepted | Minimal import scaffolding (shutil, tempfile, Path) |

