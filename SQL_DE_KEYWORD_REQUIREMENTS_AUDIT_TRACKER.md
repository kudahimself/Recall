# SQL for Data Engineering Code Validator Keyword Audit Tracker

This document tracks the authoring and backfill status of explicit keyword enforcement (`requires`: `string[]` or `RegExp[]`) for SQL for Data Engineering (T-SQL) **CODING** questions.

## 🤖 Agent Operating Instructions (SOP for Any Agent / Subagent)

**Total Coding Questions Audited:** `55` | **Targeted Keyword Questions:** `55` | **Completed Backfills:** `55` | **Pending Backfills:** `0`

When spawned to backfill or audit `requires` on SQL for Data Engineering CODING questions, follow these instructions strictly:

### 1. Workflow Sequence
1. **Locate Pending Questions:** Pick a topic/file containing 🔴 `Pending` questions in this tracker.
2. **Set In Progress:** Mark the selected question rows as 🟡 `In Progress` in this tracker.
3. **Configure `requires` in Source Code:** Open the corresponding `app/src/data/topic_tsql_*.ts` file and add the `requires` property to the target `CodingQuestion` object:
   ```typescript
   requires: ['OFFSET', 'FETCH'],
   ```
4. **Run Leak & Type Verification:** Run from `app/` directory:
   ```powershell
   npx tsc --noEmit; npm test -- --testPathPattern=codeValidator
   ```
5. **Mark Completed:** Update the status to 🟢 `Completed` in this tracker with notes.

### 2. Mandatory Skill Reference
- **Authoring Rubric & Keyword Rules:** [`write-questions`](file:///C:/Users/kudam/Documents/Github/Recall/.claude/skills/write-questions/SKILL.md) — Section 4, Rule #6.

---

> **Status Key:**
> - 🔴 `Pending` — Needs `requires` array added in source file
> - 🟡 `In Progress` — Currently being updated/verified
> - 🟢 `Completed` — Validated with `tsc --noEmit` and `codeValidator` unit tests

---

## 1. Querying Foundations & Functions

| ID | Difficulty | Topic | Required Keyword(s) | Source File | Status | Notes |
|---|---|---|---|---|---|---|
| `tsql-select-1` | BEGINNER | `TSQL_SELECT` | `['TOP', 'ORDER BY']` | `topic_tsql_select.ts` | 🟢 Completed | Requires TOP and ORDER BY clause added |
| `tsql-select-2` | INTERMEDIATE | `TSQL_SELECT` | `['OFFSET', 'FETCH']` | `topic_tsql_select.ts` | 🟢 Completed | Requires OFFSET/FETCH paging added |
| `tsql-filter-1` | INTERMEDIATE | `TSQL_FILTERING` | `['WHERE']` | `topic_tsql_filtering.ts` | 🟢 Completed | Requires predicate filtering added |
| `tsql-str-1` | INTERMEDIATE | `TSQL_STRING_FUNCTIONS` | `['UPPER', 'LEN']` | `topic_tsql_string_functions.ts` | 🟢 Completed | Requires string manipulation functions added |
| `tsql-str-2` | INTERMEDIATE | `TSQL_STRING_FUNCTIONS` | `['SUBSTRING', 'CHARINDEX']` | `topic_tsql_string_functions.ts` | 🟢 Completed | Requires substring index functions added |
| `tsql-str-3` | ADVANCED | `TSQL_STRING_FUNCTIONS` | `['TRANSLATE']` | `topic_tsql_string_functions.ts` | 🟢 Completed | Requires TRANSLATE function added |
| `tsql-dt-1` | INTERMEDIATE | `TSQL_DATE_FUNCTIONS` | `['DATEDIFF']` | `topic_tsql_date_functions.ts` | 🟢 Completed | Requires date difference calculation added |
| `tsql-dt-2` | INTERMEDIATE | `TSQL_DATE_FUNCTIONS` | `['DATEADD']` | `topic_tsql_date_functions.ts` | 🟢 Completed | Requires date addition added |
| `tsql-dt-3` | ADVANCED | `TSQL_DATE_FUNCTIONS` | `['EOMONTH']` | `topic_tsql_date_functions.ts` | 🟢 Completed | Requires end-of-month function added |
| `tsql-joins-1` | INTERMEDIATE | `TSQL_JOINS` | `['INNER JOIN']` | `topic_tsql_joins.ts` | 🟢 Completed | Requires inner join syntax added |
| `tsql-joins-2` | ADVANCED | `TSQL_JOINS` | `['LEFT JOIN']` | `topic_tsql_joins.ts` | 🟢 Completed | Requires outer left join added |
| `tsql-joins-3` | ADVANCED | `TSQL_JOINS` | `['FULL OUTER JOIN']` | `topic_tsql_joins.ts` | 🟢 Completed | Requires full outer join added |
| `tsql-agg-1` | INTERMEDIATE | `TSQL_AGGREGATION` | `['GROUP BY', 'HAVING']` | `topic_tsql_aggregation.ts` | 🟢 Completed | Requires aggregation filtering added |
| `tsql-subq-1` | INTERMEDIATE | `TSQL_SUBQUERIES_CTE` | `['WHERE', 'IN']` | `topic_tsql_subqueries_cte.ts` | 🟢 Completed | Requires subquery predicate added |
| `tsql-subq-2` | ADVANCED | `TSQL_SUBQUERIES_CTE` | `['WITH']` | `topic_tsql_subqueries_cte.ts` | 🟢 Completed | Requires Common Table Expression added |
| `tsql-setops-1` | INTERMEDIATE | `TSQL_SET_OPS` | `['UNION ALL']` | `topic_tsql_set_ops.ts` | 🟢 Completed | Requires set operations added |

---

## 2. DDL, DML & Schema Objects

| ID | Difficulty | Topic | Required Keyword(s) | Source File | Status | Notes |
|---|---|---|---|---|---|---|
| `tsql-dml-1` | INTERMEDIATE | `TSQL_DML` | `['UPDATE']` | `topic_tsql_dml.ts` | 🟢 Completed | Validated `requires: ['UPDATE']` present in CodingQuestion object |
| `tsql-dml-2` | INTERMEDIATE | `TSQL_DML` | `['DELETE']` | `topic_tsql_dml.ts` | 🟢 Completed | Validated `requires: ['DELETE']` present in CodingQuestion object |
| `tsql-dml-3` | ADVANCED | `TSQL_DML` | `['UPDATE', 'FROM', 'JOIN']` | `topic_tsql_dml.ts` | 🟢 Completed | Validated `requires: ['UPDATE', 'FROM', 'JOIN']` present in CodingQuestion object |
| `tsql-dml-4` | ADVANCED | `TSQL_DML` | `['DELETE', 'FROM', 'JOIN']` | `topic_tsql_dml.ts` | 🟢 Completed | Validated `requires: ['DELETE', 'FROM', 'JOIN']` present in CodingQuestion object |
| `tsql-ddl-create-1` | BEGINNER | `TSQL_DDL_TABLES` | `['CREATE TABLE']` | `topic_tsql_ddl_tables.ts` | 🟢 Completed | Validated `requires: ['CREATE TABLE']` present in CodingQuestion object |
| `tsql-ddl-selectinto-1` | INTERMEDIATE | `TSQL_DDL_TABLES` | `['SELECT', 'INTO']` | `topic_tsql_ddl_tables.ts` | 🟢 Completed | Validated `requires: ['SELECT', 'INTO']` present in CodingQuestion object |
| `tsql-constraints-1` | ADVANCED | `TSQL_CONSTRAINTS` | `['ALTER TABLE', 'ADD CONSTRAINT']` | `topic_tsql_constraints.ts` | 🟢 Completed | Validated `requires: ['ALTER TABLE', 'ADD CONSTRAINT']` present in CodingQuestion object |
| `tsql-views-1` | INTERMEDIATE | `TSQL_VIEWS` | `['CREATE VIEW']` | `topic_tsql_views.ts` | 🟢 Completed | Validated `requires: ['CREATE VIEW']` present in CodingQuestion object |

---

## 3. Analytical & Window SQL

| ID | Difficulty | Topic | Required Keyword(s) | Source File | Status | Notes |
|---|---|---|---|---|---|---|
| `tsql-windows-1` | INTERMEDIATE | `TSQL_WINDOWS` | `['OVER', 'ROW_NUMBER']` | `topic_tsql_windows.ts` | 🟢 Completed | Configured `requires: ['OVER', 'ROW_NUMBER']` |
| `tsql-frames-1` | INTERMEDIATE | `TSQL_WINDOW_FRAMES` | `['ROWS BETWEEN']` | `topic_tsql_window_frames.ts` | 🟢 Completed | Configured `requires: ['ROWS BETWEEN']` |
| `tsql-frames-2` | ADVANCED | `TSQL_WINDOW_FRAMES` | `['RANGE BETWEEN']` | `topic_tsql_window_frames.ts` | 🟢 Completed | Configured `requires: ['RANGE BETWEEN']` |
| `tsql-laglead-1` | ADVANCED | `TSQL_LAG_LEAD` | `['LAG', 'LEAD']` | `topic_tsql_lag_lead.ts` | 🟢 Completed | Configured `requires: ['LAG', 'LEAD']` |
| `tsql-gs-1` | INTERMEDIATE | `TSQL_GROUPING_SETS` | `['GROUPING SETS']` | `topic_tsql_grouping_sets.ts` | 🟢 Completed | Configured `requires: ['GROUPING SETS']` |
| `tsql-gs-2` | ADVANCED | `TSQL_GROUPING_SETS` | `['CUBE']` | `topic_tsql_grouping_sets.ts` | 🟢 Completed | Configured `requires: ['CUBE']` |
| `tsql-pivot-1` | INTERMEDIATE | `TSQL_PIVOT` | `['PIVOT']` | `topic_tsql_pivot.ts` | 🟢 Completed | Configured `requires: ['PIVOT']` |

---

## 4. Transactions, Procedural & Error Handling

| ID | Difficulty | Topic | Required Keyword(s) | Source File | Status | Notes |
|---|---|---|---|---|---|---|
| `tsql-tran-1` | INTERMEDIATE | `TSQL_TRANSACTIONS` | `['BEGIN TRANSACTION', 'COMMIT TRANSACTION']` | `topic_tsql_transactions.ts` | 🟢 Completed | Verified `requires` array with explicit transaction scope |
| `tsql-proc-1` | INTERMEDIATE | `TSQL_PROCEDURES` | `['CREATE PROCEDURE']` | `topic_tsql_procedures.ts` | 🟢 Completed | Verified `requires` array with stored procedure DDL |
| `tsql-proc-2` | ADVANCED | `TSQL_PROCEDURES` | `['OUTPUT']` | `topic_tsql_procedures.ts` | 🟢 Completed | Verified `requires` array with procedure OUTPUT parameters |
| `tsql-flow-1` | INTERMEDIATE | `TSQL_CONTROL_FLOW` | `['IF', 'ELSE']` | `topic_tsql_control_flow.ts` | 🟢 Completed | Verified `requires` array with conditional control flow |
| `tsql-err-1` | ADVANCED | `TSQL_ERROR_HANDLING` | `['TRY', 'CATCH']` | `topic_tsql_error_handling.ts` | 🟢 Completed | Verified `requires` array with TRY/CATCH error block |

---

## 5. ELT, Modeling & Cloud Architecture

| ID | Difficulty | Topic | Required Keyword(s) | Source File | Status | Notes |
|---|---|---|---|---|---|---|
| `tsql-facts-1` | INTERMEDIATE | `TSQL_FACTS_DIMS` | `['CREATE TABLE']` | `topic_tsql_facts_dims.ts` | 🟢 Completed | Configured `requires: ['CREATE TABLE']` |
| `tsql-surr-1` | INTERMEDIATE | `TSQL_SURROGATE_KEYS` | `['IDENTITY']` | `topic_tsql_surrogate_keys.ts` | 🟢 Completed | Configured `requires: ['IDENTITY']` |
| `tsql-star-1` | INTERMEDIATE | `TSQL_STAR_SCHEMA` | `['CREATE TABLE']` | `topic_tsql_star_schema.ts` | 🟢 Completed | Configured `requires: ['CREATE TABLE']` |
| `tsql-scd-1` | ADVANCED | `TSQL_SCD` | `['MERGE INTO']` | `topic_tsql_scd.ts` | 🟢 Completed | Configured `requires: ['MERGE INTO']` |
| `tsql-scd-2` | ADVANCED | `TSQL_SCD` | `['MERGE INTO']` | `topic_tsql_scd.ts` | 🟢 Completed | Configured `requires: ['MERGE INTO']` |
| `tsql-insert-1` | INTERMEDIATE | `TSQL_INSERT` | `['INSERT INTO']` | `topic_tsql_insert.ts` | 🟢 Completed | Configured `requires: ['INSERT INTO']` |
| `tsql-merge-1` | ADVANCED | `TSQL_MERGE` | `['MERGE INTO']` | `topic_tsql_merge.ts` | 🟢 Completed | Configured `requires: ['MERGE INTO']` |
| `tsql-dedup-1` | ADVANCED | `TSQL_DEDUP` | `['WITH', 'ROW_NUMBER']` | `topic_tsql_dedup.ts` | 🟢 Completed | Configured `requires: ['WITH', 'ROW_NUMBER']` |
| `tsql-etlproc-1` | ADVANCED | `TSQL_ETL_PROC` | `['CREATE PROCEDURE']` | `topic_tsql_etl_proc.ts` | 🟢 Completed | Configured `requires: ['CREATE PROCEDURE']` |
| `tsql-etlproc-2` | ADVANCED | `TSQL_ETL_PROC` | `['TRY', 'CATCH']` | `topic_tsql_etl_proc.ts` | 🟢 Completed | Configured `requires: ['TRY', 'CATCH']` |
| `tsql-etlproc-3` | ADVANCED | `TSQL_ETL_PROC` | `['MERGE INTO']` | `topic_tsql_etl_proc.ts` | 🟢 Completed | Configured `requires: ['MERGE INTO']` |
| `tsql-incr-1` | INTERMEDIATE | `TSQL_INCREMENTAL` | `['WHERE']` | `topic_tsql_incremental.ts` | 🟢 Completed | Configured `requires: ['WHERE']` |
| `tsql-quality-1` | INTERMEDIATE | `TSQL_QUALITY` | `['CASE', 'WHEN']` | `topic_tsql_quality.ts` | 🟢 Completed | Configured `requires: ['CASE', 'WHEN']` |
| `tsql-quality-2` | INTERMEDIATE | `TSQL_QUALITY` | `['CASE', 'WHEN']` | `topic_tsql_quality.ts` | 🟢 Completed | Configured `requires: ['CASE', 'WHEN']` |
| `tsql-idx-1` | INTERMEDIATE | `TSQL_INDEXES` | `['CREATE INDEX']` | `topic_tsql_indexes.ts` | 🟢 Completed | Configured `requires: ['CREATE INDEX']` |
| `tsql-part-1` | ADVANCED | `TSQL_PARTITIONING` | `['CREATE PARTITION FUNCTION']` | `topic_tsql_partitioning.ts` | 🟢 Completed | Configured `requires: ['CREATE PARTITION FUNCTION']` |
| `tsql-col-1` | INTERMEDIATE | `TSQL_COLUMNSTORE` | `['CREATE CLUSTERED COLUMNSTORE INDEX']` | `topic_tsql_columnstore.ts` | 🟢 Completed | Configured `requires: ['CREATE CLUSTERED COLUMNSTORE INDEX']` |
| `tsql-anti-1` | INTERMEDIATE | `TSQL_ANTIPATTERNS` | `['NOT EXISTS']` | `topic_tsql_antipatterns.ts` | 🟢 Completed | Configured `requires: ['NOT EXISTS']` |
| `tsql-syn-1` | ADVANCED | `TSQL_SYNAPSE_FABRIC` | `['DISTRIBUTION']` | `topic_tsql_synapse_fabric.ts` | 🟢 Completed | Configured `requires: ['DISTRIBUTION']` |
