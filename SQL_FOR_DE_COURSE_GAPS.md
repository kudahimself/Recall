# SQL for Data Engineering — Coverage Gaps

## Goal: map everything missing from the shipped course against both the original spec (`SQL_FOR_DE_COURSE_SPEC.md`) and general T-SQL/dimensional-modeling completeness.

## Current coverage: 38 topics (37 shipped Pillars 1-8 + `tsql_dml`), ~430 questions

Verified by grep against `src/data/topic_tsql_*.ts` on 2026-07-14 — every MISSING row below was confirmed absent, not assumed.

---

## 1. PILLAR 9 (ADVANCED & SEMI-STRUCTURED SQL) — spec'd, never built

The spec (`SQL_FOR_DE_COURSE_SPEC.md` section 3) planned an optional ninth pillar. None of its three topics exist as topics; one primitive slipped in elsewhere as a side effect of an unrelated fix.

| Topic key (planned) | Primitives | Status | Notes |
|---|---|---|---|
| `tsql_json` | `OPENJSON`, `JSON_VALUE`/`JSON_QUERY`, `FOR JSON`, shredding JSON into rows | MISSING | Only mentioned in `tsql_other_warehouses` as a *contrast* point (T-SQL's JSON handling vs Snowflake `VARIANT`/BigQuery `ARRAY`) — never taught as its own T-SQL primitive |
| `tsql_apply` | `CROSS APPLY`/`OUTER APPLY` (T-SQL lateral join), table-valued functions | MISSING | Zero coverage. Table-valued functions themselves got one cloze (`tsql-flow-tvf-cloze-1`, added while fixing `tsql_control_flow`) but nothing ever *consumes* one with `APPLY` — the natural pairing is absent |
| `tsql_recursive` | recursive CTEs for hierarchies/graphs, cycle guarding | PARTIAL | Recursive CTE basics (MCQ + cloze) were added to `tsql_subqueries_cte` while fixing that topic's own header gap. Cycle guarding (`MAXRECURSION`, an explicit depth/loop guard) is not covered |

**Sizing if built:** ~5-7 questions each for `tsql_json` and `tsql_apply` (MCQ-led, since JSON/APPLY are narrower primitives than a full pillar); `tsql_recursive` could stay folded into `tsql_subqueries_cte` rather than becoming its own topic, just add a cycle-guarding question there.

---

## 2. CORE T-SQL PRIMITIVES — never planned, discovered missing

These aren't in the original spec at all — not a build gap, a design gap. All are fundamental, daily-use SQL with zero coverage anywhere in the course.

| Primitive | Status | Notes |
|---|---|---|
| **String functions** (`CONCAT`, `SUBSTRING`, `TRIM`/`LTRIM`/`RTRIM`, `REPLACE`, `LEN`) | MISSING | Not in the spec, not taught, not used cold anywhere. The single largest hole — string manipulation is used in nearly every real ELT script |
| **Date/time functions beyond `DATEADD`** (`DATEDIFF`, `DATEPART`, `EOMONTH`, `FORMAT`) | MISSING | Only `DATEADD` exists, taught in `tsql_incremental` for lookback windows. `YEAR()` appears exactly once, as the *anti-pattern* example in `tsql_antipatterns` (non-SARGable). `DATEDIFF` in particular is used constantly for "days since" / age calculations in real DE work |
| **`CAST`/`CONVERT`** | USED COLD, NEVER TAUGHT | `CAST(GETDATE() AS DATE)` appears in `tsql_scd` and `tsql_etl_proc` solutions with no prior introduction anywhere — the same "named in passing, never drilled" pattern found and fixed repeatedly during the topic-by-topic audit, just missed because it isn't named in any topic's own header comment |
| **Dynamic SQL** (`sp_executesql`, `EXEC(@sql)`) | MISSING | Real-world common (building a query string at runtime, e.g. for a configurable ETL filter) but security-sensitive (SQL injection framing needed if added) |
| **`CREATE SCHEMA`** | MISSING | The *concept* of schema-qualified names (`dbo.Table`) is taught in `tsql_ddl_tables`'s very first MCQ, but the `CREATE SCHEMA` statement itself never appears — minor completeness gap |

---

## 3. DIMENSIONAL MODELING DEPTH (Pillar 5) — solid core, missing standard Kimball concepts

`tsql_facts_dims`, `tsql_surrogate_keys`, `tsql_star_schema`, `tsql_scd`, `tsql_normalization` cover the fundamentals well (grain, additive/semi-additive measures, degenerate dims, surrogate vs natural keys, star/snowflake, conformed dims, SCD Type 1/2, normalization tradeoffs). Four standard concepts from the same body of knowledge are entirely absent:

| Concept | Status | Notes |
|---|---|---|
| **Accumulating snapshot fact tables** | MISSING | The third of the three canonical Kimball fact-table types (a row per process instance with several milestone dates — e.g. order placed/shipped/delivered — updated in place as milestones occur). Only transaction-grain facts are taught; periodic-snapshot semantics are touched on once (the semi-additive balance MCQ) but never named or built as a table pattern |
| **Factless fact tables** | MISSING | Facts with no measures, just keys (e.g. attendance, eligibility, coverage). Conceptually tricky enough (no `SUM` to look at) to deserve its own MCQ |
| **Role-playing dimensions** | MISSING | One dimension (`DimDate`) referenced multiple times with different meanings in the same fact (`OrderDateKey`, `ShipDateKey`, `DueDateKey`), typically via views/aliases — a very common real pattern once a date dimension exists (which `tsql_surrogate_keys` already covers) |
| **Junk dimensions** | MISSING | Bundling several small low-cardinality flags/indicators into one dimension instead of leaving them as loose columns on the fact — a standard denormalization pattern for "the leftover stuff" |

**Sizing if built:** these fit as 1-2 MCQs each, most naturally added to `tsql_facts_dims` (accumulating snapshot, factless) and `tsql_star_schema` (role-playing, junk dimension) rather than new topics — none of the four need their own topic file.

---

## Priority recommendation

1. **String & date/time functions** — highest impact, most consequential gap, not in the original spec at all. Fundamental enough that other topics could start leaning on them once they exist (e.g. `DATEDIFF` in incremental-load reasoning, `TRIM`/`SUBSTRING` in data-quality checks). Worth a new topic (or one combined "String & Date Functions" topic) in Pillar 1 or 2.
2. **`CAST`/`CONVERT`** — small, cheap fix; same shape as the `IIF`/`DROP TABLE`/`UNIQUE` gaps already fixed elsewhere. Could piggyback onto the string/date functions topic or `tsql_types`.
3. **Dimensional modeling depth** (accumulating snapshot, factless fact, role-playing dim, junk dimension) — directly extends existing topics, no new wiring needed.
4. **Pillar 9** (`tsql_json`, `tsql_apply`) — lowest priority: genuinely advanced/optional per the original spec, and the course already ships a complete Pillar 1-8 arc without them.
