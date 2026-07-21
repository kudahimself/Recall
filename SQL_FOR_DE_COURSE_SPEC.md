# SQL for Data Engineering — Course Coverage Spec

The subject-level build spec for a new **5th course**, authored against
`HOW_TO_CONSTRUCT_SUBJECT.md`. This is the review checkpoint **before** authoring questions or wiring
the course. Pillars run primitive-first (Querying, DDL) → applied (Analytical, Transactions/Procedural,
Modelling, ELT, Performance) → engine-specific (Cloud Warehouse) → optional mastery.

---

## 1. Scope & conventions

- **Who it's for / what it proves:** a data engineer who can write production warehouse SQL — define
  schemas, model a warehouse, transform data with set-based logic and stored procedures, and reason
  about query performance.
- **Dialect: T-SQL** (Microsoft SQL Server / Azure Synapse / Microsoft Fabric). Chosen 2026-06-27
  because the course centres on **warehouse ELT**, where the T-SQL stored-procedure + `MERGE` +
  staging-table pattern is canonical. Engine-specific warehouse idioms (Synapse/Fabric distributions,
  Snowflake/BigQuery) live in the **Cloud Warehouse** pillar. Genuine dialect alternates use `-- OR`
  in the solution.
- **Out of scope (lives elsewhere):** Spark SQL / Delta operations → **Databricks** course;
  tool-agnostic DE *concepts* (CAP, watermarks, file formats, orchestration) → **Data Engineering**
  concepts course; Django ORM / application SQL → **Backend** course. This course is **T-SQL the
  language**, applied to DE/warehouse work — warehouse ETL SQL is a distinct competency from
  application SQL.
- **Question-type policy:** coding subject — all five types. Every cold-write primitive gets a faded
  on-ramp (`MCQ → PREDICT → PARSONS → CLOZE → CODING`) inside its topic. `PREDICT_OUTPUT` shows a tiny
  input table + query and asks for the result rows (great for `TOP`/`ORDER BY`, window functions, NULL
  semantics, set ops, `IF`/loop flow, commit/rollback visibility).
- **Validation:** the validator is client-side token-matching (`src/utils/codeValidator.ts`); T-SQL
  syntax (`MERGE`, `BEGIN TRAN`, `CREATE PROCEDURE`, `#staging` temp tables, `@vars`) validates fine.
  Use `-- OR` for genuinely equivalent forms; for engine-only syntax with no portable form, prefer MCQ.
- **Wiring:** new `Course.SQL` (`'sql'`), `SQL_PATH_ORDER`, `SQL_SECTIONS`, `SQL_TOPICS`, and an
  **ordered bank** `sqlOrderedQuestions.ts` (coding course with a within-topic ramp). `useConceptSRS:
  false` initially (concept tags can be added in a later pass).

---

## 2. Pillars, in path order

| # | Pillar (section) | Competency | Why it's here |
|---|---|---|---|
| 1 | **Querying Foundations** | Read data: filter, join, aggregate, compose with CTEs | Primitive layer — every later pillar reuses SELECT/JOIN/GROUP BY |
| 2 | **DDL & Constraints** | Define data: tables, types, keys, constraints, views | Primitive layer — modelling/ELT need CREATE TABLE + constraints |
| 3 | **Analytical & Window SQL** | Per-row analytics over groups without collapsing rows | Combines querying primitives; core DE reporting skill |
| 4 | **Transactions & Procedural T-SQL** | Control: transactions, isolation, IF/loops, procedures, TRY…CATCH | Primitive layer — ELT/SCD reuse atomic transactions + stored procs |
| 5 | **Data Modeling in SQL** | Build facts/dimensions, surrogate keys, star schema, SCD | Applies DDL + JOINs + windows to a warehouse schema |
| 6 | **ELT & Transformation Patterns** | Load/transform: MERGE, staging→target procs, dedup, incremental | Applies DDL + transactions + procedures to moving data |
| 7 | **Performance & Optimization** | Make it fast: indexes, plans, partitioning, columnstore | Reasoning layer — assumes you can already write the query |
| 8 | **Cloud Warehouse SQL** | Synapse / Fabric / Snowflake reality on top of core T-SQL | Engine-specific — assumes everything above |
| 9 | *(optional)* **Advanced & Semi-structured SQL** | JSON (OPENJSON), APPLY, recursive CTEs | Mastery spiral — returns to querying at full depth |

Ordering invariant holds: no pillar depends on a primitive introduced in a later pillar.

---

## 3. Per-pillar primitive inventory + topics

Topic enum keys use the `tsql_*` namespace. Each topic gets a full type×tier matrix at authoring time
(topic pipeline); the centre-of-gravity column shows where the difficulty sits.

### Pillar 1 — Querying Foundations  `(skews BEGINNER)`
| Topic key | Primitives |
|---|---|
| `tsql_select` | `SELECT`/`FROM`/`WHERE`/`ORDER BY`, `TOP (n)`, `OFFSET … FETCH`, `DISTINCT`, aliases, expressions |
| `tsql_filtering` | comparison/`BETWEEN`/`IN`/`LIKE`, `IS NULL`, `AND`/`OR`/`NOT`, `CASE`, `IIF`, `ISNULL`/`COALESCE`/`NULLIF` |
| `tsql_joins` | `INNER`/`LEFT`/`RIGHT`/`FULL`/`CROSS`/self joins, multi-table joins, NULL behavior in outer joins |
| `tsql_aggregation` | `GROUP BY`, `COUNT`/`SUM`/`AVG`/`MIN`/`MAX`, `HAVING`, `COUNT(DISTINCT)` |
| `tsql_subqueries_cte` | scalar/`IN`/`EXISTS` subqueries, correlated subqueries, `WITH` CTEs, recursive CTEs |
| `tsql_set_ops` | `UNION`/`UNION ALL`/`INTERSECT`/`EXCEPT`, column/type alignment |

### Pillar 2 — DDL & Constraints  `(skews BEGINNER→INTERMEDIATE)`
| Topic key | Primitives |
|---|---|
| `tsql_ddl_tables` | `CREATE`/`ALTER`/`DROP TABLE`, `SELECT … INTO`, schemas, temp tables (`#t`, `##g`), table variables (`@t`) |
| `tsql_types` | `INT`/`BIGINT`, `DECIMAL`/`NUMERIC`, `VARCHAR`/`NVARCHAR`, `DATE`/`DATETIME2`, `BIT`, `UNIQUEIDENTIFIER` |
| `tsql_constraints` | `PRIMARY KEY`, `FOREIGN KEY` + `ON DELETE`, `UNIQUE`, `CHECK`, `NOT NULL`, `DEFAULT` |
| `tsql_views` | `CREATE VIEW`, indexed/schemabound views, computed (persisted) columns |

### Pillar 3 — Analytical & Window SQL  `(skews INTERMEDIATE)`
| Topic key | Primitives |
|---|---|
| `tsql_windows` | `OVER`/`PARTITION BY`/`ORDER BY`, `ROW_NUMBER`/`RANK`/`DENSE_RANK`/`NTILE` |
| `tsql_window_frames` | aggregate windows (`SUM`/`AVG OVER`), `ROWS`/`RANGE BETWEEN`, running totals, moving averages |
| `tsql_lag_lead` | `LAG`/`LEAD`, `FIRST_VALUE`/`LAST_VALUE`, period-over-period deltas |
| `tsql_grouping_sets` | `GROUPING SETS`/`ROLLUP`/`CUBE`, `GROUPING()`, subtotals |
| `tsql_pivot` | native `PIVOT`/`UNPIVOT` operators, conditional-aggregation pivot (`CASE`+`SUM`) |

> Note: T-SQL has **no `QUALIFY`** (that's Snowflake/BigQuery). Top-per-group / dedup is done with a
> CTE + `ROW_NUMBER()` + `WHERE rn = 1` — taught in `tsql_dedup` (Pillar 6).

### Pillar 4 — Transactions & Procedural T-SQL  `(skews INTERMEDIATE→ADVANCED)`
| Topic key | Primitives |
|---|---|
| `tsql_transactions` | `BEGIN TRAN`/`COMMIT`/`ROLLBACK`, `SAVE TRAN`, `@@TRANCOUNT`, `SET XACT_ABORT ON`, explicit vs autocommit |
| `tsql_isolation` | `SET TRANSACTION ISOLATION LEVEL` (READ COMMITTED/REPEATABLE READ/SERIALIZABLE/SNAPSHOT), lock hints (`NOLOCK`/`UPDLOCK`/`READPAST`), dirty/non-repeatable/phantom reads |
| `tsql_procedures` | `CREATE PROCEDURE`/`EXEC`, input/output params, `DECLARE @v`, `SET`/`SELECT @v`, `RETURN` |
| `tsql_control_flow` | `IF … BEGIN … END`/`ELSE`, `WHILE`, scalar & table-valued `CREATE FUNCTION`, batch `GO` |
| `tsql_error_handling` | `TRY … CATCH`, `THROW`/`RAISERROR`, `ERROR_MESSAGE()`, rollback-in-CATCH pattern |

### Pillar 5 — Data Modeling in SQL  `(skews INTERMEDIATE→ADVANCED)`
| Topic key | Primitives |
|---|---|
| `tsql_facts_dims` | fact vs dimension DDL, grain, additive/semi-additive measures, degenerate dims |
| `tsql_surrogate_keys` | `IDENTITY`, `SEQUENCE`, natural vs surrogate keys, date/calendar dimension |
| `tsql_star_schema` | star vs snowflake joins, conformed dims, fact-to-dim join patterns |
| `tsql_scd` | SCD Type 1 (overwrite) & Type 2 (versioned rows: effective dates, `IsCurrent`) via `MERGE` |
| `tsql_normalization` | normalization vs denormalization tradeoffs for analytics (MCQ-led) |

### Pillar 6 — ELT & Transformation Patterns  `(skews INTERMEDIATE→ADVANCED)`
| Topic key | Primitives |
|---|---|
| `tsql_insert` | `INSERT`, `INSERT … SELECT`, `SELECT … INTO`, the `OUTPUT` clause |
| `tsql_merge` | `MERGE` with `WHEN MATCHED` / `WHEN NOT MATCHED BY TARGET` / `BY SOURCE`, upsert, `OUTPUT` |
| `tsql_dedup` | dedup via CTE + `ROW_NUMBER()` + `WHERE rn = 1`, `DELETE` from a CTE |
| `tsql_etl_proc` | **FIRST-CLASS** — stored proc loading **staging → target via `MERGE`**, wrapped in `BEGIN TRAN` + `TRY…CATCH`. Advanced scenarios: incremental high-watermark load proc, **SCD2 merge proc**, batch run-logging + error capture, idempotent re-run, `TRUNCATE`+reload vs `MERGE` decision |
| `tsql_incremental` | high-watermark loads, staging→core flow, late-arriving data, idempotency |
| `tsql_quality` | in-SQL data-quality assertions (null/uniqueness/referential), `EXCEPT`-based diffs |

### Pillar 7 — Performance & Optimization  `(skews ADVANCED, MCQ-heavy)`
| Topic key | Primitives |
|---|---|
| `tsql_indexes` | clustered vs nonclustered, composite (key order), `INCLUDE` (covering), filtered indexes; write cost |
| `tsql_execution_plans` | estimated vs actual plan, `SET STATISTICS IO/TIME`, scan vs seek, key lookups, row estimates |
| `tsql_partitioning` | partition functions/schemes, partition elimination, **partition switching** (fast load/delete) |
| `tsql_columnstore` | clustered columnstore for the warehouse (batch mode, segment/rowgroup elimination) |
| `tsql_antipatterns` | non-SARGable predicates (functions on indexed cols, implicit conversion), `SELECT *`, row-by-row vs set-based |

### Pillar 8 — Cloud Warehouse SQL (Synapse / Fabric / Snowflake)  `(engine-specific; MCQ + targeted coding)`
| Topic key | Primitives |
|---|---|
| `tsql_mpp_model` | MPP/columnar mental model, data distribution, separation of storage & compute, cost models |
| `tsql_synapse_fabric` | Synapse Dedicated SQL Pool / Fabric Warehouse — `DISTRIBUTION = HASH/ROUND_ROBIN/REPLICATE`, `CTAS`, columnstore, statistics (T-SQL surface) |
| `tsql_other_warehouses` | Snowflake (micro-partitions, clustering, `QUALIFY`, time travel, `VARIANT`/`FLATTEN`) & BigQuery (partition+cluster, `ARRAY`/`STRUCT`, bytes-scanned cost) — contrast/breadth, MCQ-led |

### Pillar 9 — Advanced & Semi-structured SQL *(optional mastery)*  `(ADVANCED)`
| Topic key | Primitives |
|---|---|
| `tsql_json` | `OPENJSON`, `JSON_VALUE`/`JSON_QUERY`, `FOR JSON`, shredding JSON into rows |
| `tsql_apply` | `CROSS APPLY` / `OUTER APPLY` (T-SQL lateral), table-valued functions |
| `tsql_recursive` | recursive CTEs for hierarchies/graphs; cycle guarding |

---

## 4. Type × tier summary (proves no pillar is mis-typed)

| Pillar | MCQ | PREDICT | PARSONS | CLOZE | CODING | Notes |
|---|---|---|---|---|---|---|
| 1 Querying | ✅ | ✅ | ✅ | ✅ | ✅ | full ramp; PREDICT shines for joins/NULLs/set-ops |
| 2 DDL | ✅ | – | ✅ | ✅ | ✅ | PREDICT rarely applies to DDL; CODING is the destination |
| 3 Analytical | ✅ | ✅ | ✅ | ✅ | ✅ | PREDICT excellent for window frames; native PIVOT/UNPIVOT |
| 4 Transactions & Procedural | ✅ | ✅ | ✅ | ✅ | ✅ | PREDICT for commit/rollback visibility & IF/loop flow; CODING for procs/functions |
| 5 Modelling | ✅ | ✅ | ✅ | ✅ | ✅ | MCQ carries design tradeoffs; CODING for DDL + SCD MERGE |
| 6 ELT | ✅ | ✅ | ✅ | ✅ | ✅ | CODING for MERGE/dedup/**staging→target proc**; advanced proc scenarios |
| 7 Performance | ✅ | ✅ | – | ✅ | ✅ | MCQ-heavy (plans/strategy); CODING for index/partition/columnstore DDL |
| 8 Warehouse | ✅ | – | – | ✅ | ✅ | MCQ-led; CODING for Synapse CTAS/DISTRIBUTION |
| 9 Advanced | ✅ | ✅ | ✅ | ✅ | ✅ | full ramp |

No pillar is cold-CODING-only and no coding pillar is MCQ-only — the faded on-ramp rule is satisfiable
in every row. Per-primitive matrices are produced when each topic is authored.

---

## 5. Sizing

- **Full course:** ~8 pillars × ~4–5 topics × a small ramp each ≈ **115–145 questions** at first ship
  (foundations carry more beginner volume; specialized pillars fewer but harder). Pillar 9 optional.
  The `tsql_etl_proc` topic alone carries extra weight (first-class topic + advanced scenarios).
- **Recommended build order (vertical slices):** wire `Course.SQL` skeleton + **Pillar 2 (DDL &
  Constraints)** first as the pilot — most self-contained coding surface, exercises the SQL validator +
  new-course wiring end to end. Then Pillar 1, then 3→8 in path order. (Matches "start with DDL".)

---

## 6. Wiring checklist (this course)

- [ ] `src/types/index.ts` — `Course.SQL = 'sql'`; all `tsql_*` `Topic` values.
- [ ] `src/utils/courseConfig.ts` — `SQL_TOPICS` Set; `getCourseForTopic` branch; `SQL_SECTIONS`;
      `SQL_PATH_ORDER`; `getTopicOrder` pathOrder+sections branches; `getSelectionPolicy`
      (`useConceptSRS: false`).
- [ ] `src/utils/spacedRepetition.ts` — `getUnlockedSections` pathOrder branch.
- [ ] `src/App.tsx` — course meta (label "SQL for Data Engineering" + theme); stat-init objects;
      pathOrder/sections ternaries; `theme-*` switch.
- [ ] `src/components/NavigationRail.tsx` — rail entry (icon, label, color).
- [ ] `src/components/QuestionFilter.tsx` — sections ternary.
- [ ] `src/components/ProgressTracker.tsx` — resolves SQL sections/path.
- [ ] `src/App.css` — `--sql-solid` token + `theme-sql` (no hardcoded px font-sizes).
- [ ] `src/data/topic_tsql_*.ts` files; aggregate into `src/data/questions.ts`.
- [ ] `src/data/sqlOrderedQuestions.ts` — ordered bank (`q(id)` lookups in ramp order).

---

## 7. Verification checklist (gate before "done")

- [ ] Every cold CODING primitive has a faded on-ramp in the same topic.
- [ ] Pillar + within-topic ramp order respected (no primitive used before introduced).
- [ ] Dialect: canonical T-SQL; cross-engine syntax confined to Pillar 8 / MCQ or `-- OR` alternates.
- [ ] New-course wiring complete (section 6); grep `Course.DATA_ENGINEERING` left no missing sibling.
- [ ] MCQ distractors match the correct answer's length; reserved words avoided as identifiers.
- [ ] Prompts state the requirement/behavior, never the literal answer.
- [ ] Gates: `check-leaks.js` (lane A catches SQL comment-only-solution starters), `audit-coverage.js sql`,
      `check-ordered-strays.js`, `tsc --noEmit`, `spacedRep` smoke test.
- [ ] Browser smoke test: switch to SQL course, Pillar serves, theme renders, next section unlocks.

---

## 8. Open decisions for review

1. **Pillar 9 (Advanced & Semi-structured)** — include in the first build, or defer until 1–8 ship?
2. **Course name** — "SQL for Data Engineering" (proposed) vs shorter "SQL".
3. **Pilot section** — confirm DDL & Constraints as the first vertical slice (recommended), or start
   at Pillar 1 (Querying) for strict path order.
