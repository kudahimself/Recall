# Tiered Hints Authoring & Audit Tracker

This document tracks the authoring and audit status of 2-tier hint scaffolds (`tieredHints`: `apiSignature` & `skeleton`) for every **CODING** question across all subjects.

## 🤖 Agent Operating Instructions (SOP for Any Agent / Subagent)

**Total Coding Questions:** `1000` | **Completed Hints:** `1000` | **Pending Hints:** `0`

When spawned to author or audit `tieredHints` on CODING questions, follow these instructions strictly:

### 1. Workflow Sequence
1. **Locate Pending Questions:** Pick a topic/file containing 🔴 `Pending` questions.
2. **Set In Progress:** Mark the selected question rows as 🟡 `In Progress` in this tracker.
3. **Author tieredHints in Source Code:** Open the corresponding `src/data/*.ts` file and add/update `tieredHints` using the reference `solution` as truth:
   - **Tier 1 (`apiSignature`):** ONE bare line showing parameter names and defaults. No prose, no argument values.
   - **Tier 2 (`skeleton`):** Deletion from solution with `>= 3` `____` markers blanking substance while keeping control flow/wiring.
4. **Run Leak & Type Verification:** Run from `app/` directory:
   ```powershell
   npx tsc --noEmit; node scripts/check-hint-leaks.js
   ```
5. **Mark Completed:** Update the status to 🟢 `Completed` in this tracker with notes.

### 2. Mandatory Skill Reference (`.claude/skills/`)
- **Authoring Rubric & Leak Rules:** [`write-hints`](file:///C:/Users/kudam/Documents/Github/Recall/.claude/skills/write-hints/SKILL.md) — Tier 1 `apiSignature` & Tier 2 `skeleton` rules and leak floors.

### 3. Quick Authoring Rubric (`write-hints`)
- **Tier 1 - `apiSignature` (The Call Surface):**
  - Bare line: parameter names + defaults (`re.sub(pattern, repl, string, count=0) -> str`).
  - Zero prose, zero sentences. Never include argument values from the solution.
  - If prompt names the API, show the NEXT most load-bearing call in the solution.
- **Tier 2 - `skeleton` (Blanked Solution Structure):**
  - At least 3 `____` blanks replacing load-bearing substance (methods, operators, key args).
  - Keep control flow, indentation, and variable wiring visible.
  - Must pass retention floor in `node scripts/check-hint-leaks.js`.

---

> **Status Key:**
> - 🔴 `Pending` — Needs `tieredHints` authoring or audit against `/write-hints` rubric
> - 🟡 `In Progress` — Currently being authored/rewritten
> - 🟢 `Completed` — Validated with `check-hint-leaks.js` and type-checked

## Core Engineering Mastery & System Design

### certificationQuestions (`certificationQuestions.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `streaming-3` | INTERMEDIATE | `STRUCTURED_STREAMING` | `certificationQuestions.ts` | 🟢 Completed | |
| `streaming-4` | INTERMEDIATE | `STRUCTURED_STREAMING` | `certificationQuestions.ts` | 🟢 Completed | |
| `streaming-7` | INTERMEDIATE | `STRUCTURED_STREAMING` | `certificationQuestions.ts` | 🟢 Completed | |
| `streaming-8` | ADVANCED | `STRUCTURED_STREAMING` | `certificationQuestions.ts` | 🟢 Completed | |
| `streaming-10` | ADVANCED | `STRUCTURED_STREAMING` | `certificationQuestions.ts` | 🟢 Completed | |
| `streaming-12` | INTERMEDIATE | `STRUCTURED_STREAMING` | `certificationQuestions.ts` | 🟢 Completed | |
| `autoloader-2` | INTERMEDIATE | `AUTO_LOADER` | `certificationQuestions.ts` | 🟢 Completed | |
| `autoloader-5` | ADVANCED | `AUTO_LOADER` | `certificationQuestions.ts` | 🟢 Completed | |
| `autoloader-7` | INTERMEDIATE | `AUTO_LOADER` | `certificationQuestions.ts` | 🟢 Completed | |
| `medallion-5` | INTERMEDIATE | `MEDALLION_ARCHITECTURE` | `certificationQuestions.ts` | 🟢 Completed | |
| `medallion-6` | INTERMEDIATE | `MEDALLION_ARCHITECTURE` | `certificationQuestions.ts` | 🟢 Completed | |
| `medallion-9` | INTERMEDIATE | `MEDALLION_ARCHITECTURE` | `certificationQuestions.ts` | 🟢 Completed | |
| `medallion-10` | ADVANCED | `MEDALLION_ARCHITECTURE` | `certificationQuestions.ts` | 🟢 Completed | |
| `cdc-3` | INTERMEDIATE | `CHANGE_DATA_CAPTURE` | `certificationQuestions.ts` | 🟢 Completed | |
| `cdc-4` | INTERMEDIATE | `CHANGE_DATA_CAPTURE` | `certificationQuestions.ts` | 🟢 Completed | |
| `cdc-5` | INTERMEDIATE | `CHANGE_DATA_CAPTURE` | `certificationQuestions.ts` | 🟢 Completed | |
| `cdc-7` | ADVANCED | `CHANGE_DATA_CAPTURE` | `certificationQuestions.ts` | 🟢 Completed | |
| `cdc-8` | INTERMEDIATE | `CHANGE_DATA_CAPTURE` | `certificationQuestions.ts` | 🟢 Completed | |
| `dlt-3` | INTERMEDIATE | `DELTA_LIVE_TABLES` | `certificationQuestions.ts` | 🟢 Completed | |
| `dlt-4` | INTERMEDIATE | `DELTA_LIVE_TABLES` | `certificationQuestions.ts` | 🟢 Completed | |
| `dlt-5` | INTERMEDIATE | `DELTA_LIVE_TABLES` | `certificationQuestions.ts` | 🟢 Completed | |
| `dlt-6` | INTERMEDIATE | `DELTA_LIVE_TABLES` | `certificationQuestions.ts` | 🟢 Completed | |
| `dlt-8` | ADVANCED | `DELTA_LIVE_TABLES` | `certificationQuestions.ts` | 🟢 Completed | |
| `dlt-10` | INTERMEDIATE | `DELTA_LIVE_TABLES` | `certificationQuestions.ts` | 🟢 Completed | |
| `workflow-7` | INTERMEDIATE | `DATABRICKS_WORKFLOWS` | `certificationQuestions.ts` | 🟢 Completed | |
| `workflow-8` | INTERMEDIATE | `DATABRICKS_WORKFLOWS` | `certificationQuestions.ts` | 🟢 Completed | |
| `workflow-10` | ADVANCED | `DATABRICKS_WORKFLOWS` | `certificationQuestions.ts` | 🟢 Completed | |
| `governance-3` | INTERMEDIATE | `DATA_GOVERNANCE` | `certificationQuestions.ts` | 🟢 Completed | |
| `governance-4` | INTERMEDIATE | `DATA_GOVERNANCE` | `certificationQuestions.ts` | 🟢 Completed | |
| `governance-5` | INTERMEDIATE | `DATA_GOVERNANCE` | `certificationQuestions.ts` | 🟢 Completed | |
| `governance-6` | INTERMEDIATE | `DATA_GOVERNANCE` | `certificationQuestions.ts` | 🟢 Completed | |
| `governance-7` | INTERMEDIATE | `DATA_GOVERNANCE` | `certificationQuestions.ts` | 🟢 Completed | |
| `governance-8` | INTERMEDIATE | `DATA_GOVERNANCE` | `certificationQuestions.ts` | 🟢 Completed | |
| `governance-11` | INTERMEDIATE | `DATA_GOVERNANCE` | `certificationQuestions.ts` | 🟢 Completed | |
| `platform-sql-1` | INTERMEDIATE | `DATABRICKS_PLATFORM` | `certificationQuestions.ts` | 🟢 Completed | |
| `platform-sql-2` | BEGINNER | `DATABRICKS_PLATFORM` | `certificationQuestions.ts` | 🟢 Completed | |
| `platform-sql-3` | INTERMEDIATE | `DATABRICKS_PLATFORM` | `certificationQuestions.ts` | 🟢 Completed | |
| `perf-2` | INTERMEDIATE | `SPARK_OPTIMIZATION` | `certificationQuestions.ts` | 🟢 Completed | |
| `perf-4` | INTERMEDIATE | `SPARK_OPTIMIZATION` | `certificationQuestions.ts` | 🟢 Completed | |
| `perf-5` | INTERMEDIATE | `SPARK_OPTIMIZATION` | `certificationQuestions.ts` | 🟢 Completed | |
| `perf-9` | INTERMEDIATE | `SPARK_OPTIMIZATION` | `certificationQuestions.ts` | 🟢 Completed | |
| `perf-10` | INTERMEDIATE | `SPARK_OPTIMIZATION` | `certificationQuestions.ts` | 🟢 Completed | |
| `perf-12` | INTERMEDIATE | `SPARK_OPTIMIZATION` | `certificationQuestions.ts` | 🟢 Completed | |
| `perf-15` | INTERMEDIATE | `SPARK_OPTIMIZATION` | `certificationQuestions.ts` | 🟢 Completed | |
| `perf-18` | INTERMEDIATE | `SPARK_OPTIMIZATION` | `certificationQuestions.ts` | 🟢 Completed | |


### designPatternQuestions (`designPatternQuestions.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `dp-create-2` | BEGINNER | `PATTERNS_CREATIONAL` | `designPatternQuestions.ts` | 🟢 Completed | |
| `dp-struct-2` | BEGINNER | `PATTERNS_STRUCTURAL` | `designPatternQuestions.ts` | 🟢 Completed | |
| `dp-behav-1` | BEGINNER | `PATTERNS_BEHAVIORAL` | `designPatternQuestions.ts` | 🟢 Completed | |
| `dp-arch-5` | BEGINNER | `PATTERNS_ARCHITECTURAL` | `designPatternQuestions.ts` | 🟢 Completed | |
| `dp-api-4` | BEGINNER | `API_DESIGN` | `designPatternQuestions.ts` | 🟢 Completed | |
| `dp-db-4` | BEGINNER | `DB_DESIGN` | `designPatternQuestions.ts` | 🟢 Completed | |


### expandedQuestions (`expandedQuestions.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `string-1` | BEGINNER | `STRING_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `string-2` | BEGINNER | `STRING_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `string-3` | BEGINNER | `STRING_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `string-4` | INTERMEDIATE | `STRING_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `string-5` | INTERMEDIATE | `STRING_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `string-6` | BEGINNER | `STRING_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `string-7` | INTERMEDIATE | `STRING_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `string-8` | INTERMEDIATE | `STRING_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `string-9` | INTERMEDIATE | `STRING_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `string-10` | ADVANCED | `STRING_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `string-11` | BEGINNER | `STRING_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `datetime-1` | BEGINNER | `DATETIME_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `datetime-2` | BEGINNER | `DATETIME_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `datetime-3` | INTERMEDIATE | `DATETIME_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `datetime-4` | INTERMEDIATE | `DATETIME_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `datetime-5` | INTERMEDIATE | `DATETIME_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `datetime-6` | INTERMEDIATE | `DATETIME_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `datetime-7` | INTERMEDIATE | `DATETIME_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `datetime-8` | BEGINNER | `DATETIME_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `datetime-9` | BEGINNER | `DATETIME_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `datetime-10` | BEGINNER | `DATETIME_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `datetime-11` | INTERMEDIATE | `DATETIME_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `collection-1` | INTERMEDIATE | `COLLECTION_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `collection-2` | INTERMEDIATE | `COLLECTION_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `collection-3` | INTERMEDIATE | `COLLECTION_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `math-1` | BEGINNER | `MATH_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `math-2` | BEGINNER | `MATH_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `math-3` | BEGINNER | `MATH_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `math-4` | INTERMEDIATE | `MATH_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `math-5` | INTERMEDIATE | `MATH_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `math-6` | INTERMEDIATE | `MATH_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `window-1` | ADVANCED | `WINDOW_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `window-2` | ADVANCED | `WINDOW_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `window-3` | ADVANCED | `WINDOW_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `delta-1` | INTERMEDIATE | `DELTA_LAKE_BASICS` | `expandedQuestions.ts` | 🟢 Completed | |
| `delta-2` | INTERMEDIATE | `DELTA_LAKE_BASICS` | `expandedQuestions.ts` | 🟢 Completed | |
| `delta-3` | INTERMEDIATE | `DELTA_OPERATIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `delta-4` | INTERMEDIATE | `DELTA_OPERATIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `delta-5` | ADVANCED | `DELTA_OPERATIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `delta-6` | INTERMEDIATE | `DELTA_TIME_TRAVEL` | `expandedQuestions.ts` | 🟢 Completed | |
| `delta-7` | INTERMEDIATE | `DELTA_TIME_TRAVEL` | `expandedQuestions.ts` | 🟢 Completed | |
| `delta-8` | INTERMEDIATE | `DELTA_OPTIMIZATION` | `expandedQuestions.ts` | 🟢 Completed | |
| `delta-9` | ADVANCED | `DELTA_OPTIMIZATION` | `expandedQuestions.ts` | 🟢 Completed | |
| `sql-join-1` | INTERMEDIATE | `SQL_JOINS` | `expandedQuestions.ts` | 🟢 Completed | |
| `sql-join-2` | INTERMEDIATE | `SQL_JOINS` | `expandedQuestions.ts` | 🟢 Completed | |
| `sql-join-3` | INTERMEDIATE | `SQL_JOINS` | `expandedQuestions.ts` | 🟢 Completed | |
| `sql-join-4` | INTERMEDIATE | `SQL_JOINS` | `expandedQuestions.ts` | 🟢 Completed | |
| `sql-join-5` | ADVANCED | `SQL_JOINS` | `expandedQuestions.ts` | 🟢 Completed | |
| `sql-join-6` | INTERMEDIATE | `SQL_JOINS` | `expandedQuestions.ts` | 🟢 Completed | |
| `grouping-1` | ADVANCED | `SQL_AGGREGATIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `grouping-2` | ADVANCED | `SQL_AGGREGATIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `grouping-3` | ADVANCED | `SQL_AGGREGATIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `grouping-4` | INTERMEDIATE | `SQL_AGGREGATIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `grouping-5` | INTERMEDIATE | `PYSPARK_TRANSFORMATIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `grouping-6` | ADVANCED | `PYSPARK_TRANSFORMATIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `grouping-7` | ADVANCED | `PYSPARK_TRANSFORMATIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `window-adv-1` | ADVANCED | `SQL_WINDOW_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `window-adv-2` | ADVANCED | `SQL_WINDOW_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `window-adv-3` | ADVANCED | `SQL_WINDOW_FUNCTIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `catalog-3` | INTERMEDIATE | `DATABRICKS_PLATFORM` | `expandedQuestions.ts` | 🟢 Completed | |
| `catalog-4` | INTERMEDIATE | `DATABRICKS_PLATFORM` | `expandedQuestions.ts` | 🟢 Completed | |
| `catalog-5` | INTERMEDIATE | `DATABRICKS_PLATFORM` | `expandedQuestions.ts` | 🟢 Completed | |
| `catalog-6` | ADVANCED | `DATABRICKS_PLATFORM` | `expandedQuestions.ts` | 🟢 Completed | |
| `catalog-7` | INTERMEDIATE | `DATABRICKS_PLATFORM` | `expandedQuestions.ts` | 🟢 Completed | |
| `null-1` | INTERMEDIATE | `NULL_HANDLING` | `expandedQuestions.ts` | 🟢 Completed | |
| `null-2` | BEGINNER | `NULL_HANDLING` | `expandedQuestions.ts` | 🟢 Completed | |
| `null-3` | BEGINNER | `NULL_HANDLING` | `expandedQuestions.ts` | 🟢 Completed | |
| `null-4` | INTERMEDIATE | `NULL_HANDLING` | `expandedQuestions.ts` | 🟢 Completed | |
| `null-5` | INTERMEDIATE | `NULL_HANDLING` | `expandedQuestions.ts` | 🟢 Completed | |
| `dbutils-2` | BEGINNER | `DATABRICKS_UTILITIES` | `expandedQuestions.ts` | 🟢 Completed | |
| `dbutils-3` | INTERMEDIATE | `DATABRICKS_UTILITIES` | `expandedQuestions.ts` | 🟢 Completed | |
| `dbutils-4` | INTERMEDIATE | `DATABRICKS_UTILITIES` | `expandedQuestions.ts` | 🟢 Completed | |
| `dbutils-5` | BEGINNER | `DATABRICKS_UTILITIES` | `expandedQuestions.ts` | 🟢 Completed | |
| `dbutils-6` | INTERMEDIATE | `DATABRICKS_UTILITIES` | `expandedQuestions.ts` | 🟢 Completed | |
| `dbutils-7` | INTERMEDIATE | `DATABRICKS_UTILITIES` | `expandedQuestions.ts` | 🟢 Completed | |
| `dbutils-8` | INTERMEDIATE | `DATABRICKS_UTILITIES` | `expandedQuestions.ts` | 🟢 Completed | |
| `dbutils-9` | ADVANCED | `DATABRICKS_UTILITIES` | `expandedQuestions.ts` | 🟢 Completed | |
| `dbutils-10` | BEGINNER | `DATABRICKS_UTILITIES` | `expandedQuestions.ts` | 🟢 Completed | |
| `dbutils-11` | INTERMEDIATE | `DATABRICKS_UTILITIES` | `expandedQuestions.ts` | 🟢 Completed | |
| `dbutils-12` | BEGINNER | `DATABRICKS_UTILITIES` | `expandedQuestions.ts` | 🟢 Completed | |
| `dbutils-13` | INTERMEDIATE | `DATABRICKS_UTILITIES` | `expandedQuestions.ts` | 🟢 Completed | |
| `dbutils-14` | INTERMEDIATE | `DATABRICKS_UTILITIES` | `expandedQuestions.ts` | 🟢 Completed | |
| `dbutils-15` | BEGINNER | `DATABRICKS_UTILITIES` | `expandedQuestions.ts` | 🟢 Completed | |
| `dbutils-16` | BEGINNER | `DATABRICKS_UTILITIES` | `expandedQuestions.ts` | 🟢 Completed | |
| `dbutils-17` | INTERMEDIATE | `DATABRICKS_UTILITIES` | `expandedQuestions.ts` | 🟢 Completed | |
| `dbutils-19` | INTERMEDIATE | `DATABRICKS_UTILITIES` | `expandedQuestions.ts` | 🟢 Completed | |
| `dbutils-20` | INTERMEDIATE | `DATABRICKS_UTILITIES` | `expandedQuestions.ts` | 🟢 Completed | |
| `delta-clone-2` | INTERMEDIATE | `DELTA_OPERATIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `delta-clone-3` | INTERMEDIATE | `DELTA_OPERATIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `delta-merge-2` | ADVANCED | `DELTA_OPERATIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `delta-optimize-2` | INTERMEDIATE | `DELTA_OPTIMIZATION` | `expandedQuestions.ts` | 🟢 Completed | |
| `delta-optimize-3` | ADVANCED | `DELTA_OPTIMIZATION` | `expandedQuestions.ts` | 🟢 Completed | |
| `delta-vacuum-2` | INTERMEDIATE | `DELTA_OPERATIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `delta-vacuum-3` | ADVANCED | `DELTA_OPERATIONS` | `expandedQuestions.ts` | 🟢 Completed | |
| `dbutils-mount-2` | INTERMEDIATE | `DATABRICKS_UTILITIES` | `expandedQuestions.ts` | 🟢 Completed | |
| `dbutils-mount-3` | INTERMEDIATE | `DATABRICKS_UTILITIES` | `expandedQuestions.ts` | 🟢 Completed | |


### masteryQuestions (`masteryQuestions.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `io-1` | BEGINNER | `PYSPARK_BASICS` | `masteryQuestions.ts` | 🟢 Completed | |
| `io-2` | BEGINNER | `PYSPARK_BASICS` | `masteryQuestions.ts` | 🟢 Completed | |
| `io-3` | BEGINNER | `PYSPARK_BASICS` | `masteryQuestions.ts` | 🟢 Completed | |
| `io-4` | INTERMEDIATE | `PYSPARK_BASICS` | `masteryQuestions.ts` | 🟢 Completed | |
| `io-5` | INTERMEDIATE | `PYSPARK_BASICS` | `masteryQuestions.ts` | 🟢 Completed | |
| `io-8` | INTERMEDIATE | `PYSPARK_BASICS` | `masteryQuestions.ts` | 🟢 Completed | |
| `io-9` | INTERMEDIATE | `PYSPARK_BASICS` | `masteryQuestions.ts` | 🟢 Completed | |
| `schema-1` | INTERMEDIATE | `PYSPARK_BASICS` | `masteryQuestions.ts` | 🟢 Completed | |
| `schema-2` | INTERMEDIATE | `PYSPARK_BASICS` | `masteryQuestions.ts` | 🟢 Completed | |
| `schema-3` | INTERMEDIATE | `PYSPARK_BASICS` | `masteryQuestions.ts` | 🟢 Completed | |
| `schema-4` | BEGINNER | `PYSPARK_BASICS` | `masteryQuestions.ts` | 🟢 Completed | |
| `casewhen-1` | INTERMEDIATE | `PYSPARK_DATAFRAMES` | `masteryQuestions.ts` | 🟢 Completed | |
| `casewhen-2` | INTERMEDIATE | `SPARK_SQL` | `masteryQuestions.ts` | 🟢 Completed | |
| `casewhen-3` | INTERMEDIATE | `PYSPARK_DATAFRAMES` | `masteryQuestions.ts` | 🟢 Completed | |
| `casewhen-4` | ADVANCED | `SPARK_SQL` | `masteryQuestions.ts` | 🟢 Completed | |
| `cte-1` | INTERMEDIATE | `SPARK_SQL` | `masteryQuestions.ts` | 🟢 Completed | |
| `cte-2` | ADVANCED | `SPARK_SQL` | `masteryQuestions.ts` | 🟢 Completed | |
| `udf-1` | INTERMEDIATE | `ADVANCED_TOPICS` | `masteryQuestions.ts` | 🟢 Completed | |
| `udf-2` | ADVANCED | `ADVANCED_TOPICS` | `masteryQuestions.ts` | 🟢 Completed | |
| `udf-4` | ADVANCED | `ADVANCED_TOPICS` | `masteryQuestions.ts` | 🟢 Completed | |
| `setop-1` | INTERMEDIATE | `SQL_SET_OPERATIONS` | `masteryQuestions.ts` | 🟢 Completed | |
| `setop-2` | INTERMEDIATE | `SQL_SET_OPERATIONS` | `masteryQuestions.ts` | 🟢 Completed | |
| `setop-3` | INTERMEDIATE | `SQL_SET_OPERATIONS` | `masteryQuestions.ts` | 🟢 Completed | |
| `setop-4` | INTERMEDIATE | `SQL_SET_OPERATIONS` | `masteryQuestions.ts` | 🟢 Completed | |
| `setop-5` | INTERMEDIATE | `SQL_SET_OPERATIONS` | `masteryQuestions.ts` | 🟢 Completed | |
| `semijoin-2` | INTERMEDIATE | `SQL_JOINS` | `masteryQuestions.ts` | 🟢 Completed | |
| `semijoin-3` | INTERMEDIATE | `SQL_JOINS` | `masteryQuestions.ts` | 🟢 Completed | |
| `semijoin-4` | INTERMEDIATE | `SQL_JOINS` | `masteryQuestions.ts` | 🟢 Completed | |
| `pivot-1` | ADVANCED | `PYSPARK_DATAFRAMES` | `masteryQuestions.ts` | 🟢 Completed | |
| `pivot-2` | ADVANCED | `SPARK_SQL` | `masteryQuestions.ts` | 🟢 Completed | |
| `pivot-3` | ADVANCED | `SPARK_SQL` | `masteryQuestions.ts` | 🟢 Completed | |
| `pivot-4` | ADVANCED | `PYSPARK_DATAFRAMES` | `masteryQuestions.ts` | 🟢 Completed | |
| `pivot-5` | ADVANCED | `SPARK_SQL` | `masteryQuestions.ts` | 🟢 Completed | |
| `pivot-6` | ADVANCED | `SPARK_SQL` | `masteryQuestions.ts` | 🟢 Completed | |
| `cast-1` | BEGINNER | `PYSPARK_DATAFRAMES` | `masteryQuestions.ts` | 🟢 Completed | |
| `cast-2` | INTERMEDIATE | `SPARK_SQL` | `masteryQuestions.ts` | 🟢 Completed | |
| `cast-3` | INTERMEDIATE | `PYSPARK_DATAFRAMES` | `masteryQuestions.ts` | 🟢 Completed | |
| `action-4` | BEGINNER | `PYSPARK_ACTIONS` | `masteryQuestions.ts` | 🟢 Completed | |
| `action-5` | INTERMEDIATE | `PYSPARK_ACTIONS` | `masteryQuestions.ts` | 🟢 Completed | |
| `restore-1` | INTERMEDIATE | `DELTA_TIME_TRAVEL` | `masteryQuestions.ts` | 🟢 Completed | |
| `restore-2` | INTERMEDIATE | `DELTA_TIME_TRAVEL` | `masteryQuestions.ts` | 🟢 Completed | |
| `restore-3` | BEGINNER | `DELTA_TIME_TRAVEL` | `masteryQuestions.ts` | 🟢 Completed | |
| `constraint-1` | INTERMEDIATE | `DELTA_OPERATIONS` | `masteryQuestions.ts` | 🟢 Completed | |
| `constraint-2` | INTERMEDIATE | `DELTA_OPERATIONS` | `masteryQuestions.ts` | 🟢 Completed | |
| `constraint-3` | INTERMEDIATE | `DELTA_OPERATIONS` | `masteryQuestions.ts` | 🟢 Completed | |
| `subq-1` | INTERMEDIATE | `SQL_SUBQUERIES` | `masteryQuestions.ts` | 🟢 Completed | |
| `subq-2` | ADVANCED | `SQL_SUBQUERIES` | `masteryQuestions.ts` | 🟢 Completed | |
| `subq-3` | INTERMEDIATE | `SQL_SUBQUERIES` | `masteryQuestions.ts` | 🟢 Completed | |
| `subq-4` | INTERMEDIATE | `SQL_SUBQUERIES` | `masteryQuestions.ts` | 🟢 Completed | |
| `subq-5` | ADVANCED | `SQL_SUBQUERIES` | `masteryQuestions.ts` | 🟢 Completed | |
| `subq-6` | ADVANCED | `SQL_SUBQUERIES` | `masteryQuestions.ts` | 🟢 Completed | |
| `crossjoin-1` | INTERMEDIATE | `PYSPARK_TRANSFORMATIONS` | `masteryQuestions.ts` | 🟢 Completed | |
| `crossjoin-2` | INTERMEDIATE | `SPARK_SQL` | `masteryQuestions.ts` | 🟢 Completed | |
| `repart-2` | INTERMEDIATE | `PYSPARK_TRANSFORMATIONS` | `masteryQuestions.ts` | 🟢 Completed | |
| `winfn-2` | ADVANCED | `WINDOW_FUNCTIONS` | `masteryQuestions.ts` | 🟢 Completed | |
| `winfn-3` | ADVANCED | `SQL_WINDOW_FUNCTIONS` | `masteryQuestions.ts` | 🟢 Completed | |
| `winfn-4` | ADVANCED | `SQL_WINDOW_FUNCTIONS` | `masteryQuestions.ts` | 🟢 Completed | |
| `winfn-6` | ADVANCED | `WINDOW_FUNCTIONS` | `masteryQuestions.ts` | 🟢 Completed | |
| `stream-adv-3` | ADVANCED | `STRUCTURED_STREAMING` | `masteryQuestions.ts` | 🟢 Completed | |
| `stream-adv-4` | ADVANCED | `STRUCTURED_STREAMING` | `masteryQuestions.ts` | 🟢 Completed | |
| `stream-adv-7` | ADVANCED | `STRUCTURED_STREAMING` | `masteryQuestions.ts` | 🟢 Completed | |


### questions (`questions.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `ps-basic-2` | BEGINNER | `PYSPARK_BASICS` | `questions.ts` | 🟢 Completed | |
| `ps-basic-3` | BEGINNER | `PYSPARK_BASICS` | `questions.ts` | 🟢 Completed | |
| `ps-df-2` | BEGINNER | `PYSPARK_DATAFRAMES` | `questions.ts` | 🟢 Completed | |
| `ps-df-3` | BEGINNER | `PYSPARK_DATAFRAMES` | `questions.ts` | 🟢 Completed | |
| `ps-df-4` | INTERMEDIATE | `PYSPARK_DATAFRAMES` | `questions.ts` | 🟢 Completed | |
| `ps-df-5` | INTERMEDIATE | `PYSPARK_DATAFRAMES` | `questions.ts` | 🟢 Completed | |
| `ps-transform-2` | INTERMEDIATE | `SQL_JOINS` | `questions.ts` | 🟢 Completed | |
| `ps-transform-3` | INTERMEDIATE | `PYSPARK_TRANSFORMATIONS` | `questions.ts` | 🟢 Completed | |
| `ps-transform-4` | INTERMEDIATE | `PYSPARK_TRANSFORMATIONS` | `questions.ts` | 🟢 Completed | |
| `sql-1` | BEGINNER | `SPARK_SQL` | `questions.ts` | 🟢 Completed | |
| `sql-2` | BEGINNER | `SPARK_SQL` | `questions.ts` | 🟢 Completed | |
| `sql-3` | INTERMEDIATE | `SPARK_SQL` | `questions.ts` | 🟢 Completed | |
| `sql-4` | INTERMEDIATE | `SPARK_SQL` | `questions.ts` | 🟢 Completed | |
| `ps-advanced-2` | ADVANCED | `ADVANCED_TOPICS` | `questions.ts` | 🟢 Completed | |
| `ps-advanced-3` | ADVANCED | `SPARK_OPTIMIZATION` | `questions.ts` | 🟢 Completed | |
| `ps-advanced-4` | ADVANCED | `ADVANCED_TOPICS` | `questions.ts` | 🟢 Completed | |
| `ps-basic-4` | BEGINNER | `PYSPARK_BASICS` | `questions.ts` | 🟢 Completed | |
| `ps-df-6` | BEGINNER | `PYSPARK_DATAFRAMES` | `questions.ts` | 🟢 Completed | |
| `ps-df-7` | BEGINNER | `PYSPARK_DATAFRAMES` | `questions.ts` | 🟢 Completed | |
| `ps-df-8` | INTERMEDIATE | `PYSPARK_DATAFRAMES` | `questions.ts` | 🟢 Completed | |
| `ps-df-9` | INTERMEDIATE | `PYSPARK_DATAFRAMES` | `questions.ts` | 🟢 Completed | |
| `ps-df-10` | INTERMEDIATE | `PYSPARK_DATAFRAMES` | `questions.ts` | 🟢 Completed | |
| `sql-5` | INTERMEDIATE | `SPARK_SQL` | `questions.ts` | 🟢 Completed | |
| `sql-6` | INTERMEDIATE | `SPARK_SQL` | `questions.ts` | 🟢 Completed | |
| `sql-7` | ADVANCED | `SPARK_SQL` | `questions.ts` | 🟢 Completed | |
| `ps-transform-5` | INTERMEDIATE | `SQL_JOINS` | `questions.ts` | 🟢 Completed | |
| `ps-df-11` | INTERMEDIATE | `PYSPARK_DATAFRAMES` | `questions.ts` | 🟢 Completed | |
| `ps-df-12` | INTERMEDIATE | `PYSPARK_DATAFRAMES` | `questions.ts` | 🟢 Completed | |


### securityQuestions (`securityQuestions.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `sec-auth-5` | ADVANCED | `NEXT_AUTH` | `securityQuestions.ts` | 🟢 Completed | |
| `next-auth-session-cookie-1` | INTERMEDIATE | `NEXT_AUTH` | `securityQuestions.ts` | 🟢 Completed | |
| `sec-attack-2` | BEGINNER | `API_DESIGN` | `securityQuestions.ts` | 🟢 Completed | |
| `sec-attack-5` | INTERMEDIATE | `API_DESIGN` | `securityQuestions.ts` | 🟢 Completed | |
| `sec-comm-2` | BEGINNER | `PATTERNS_ARCHITECTURAL` | `securityQuestions.ts` | 🟢 Completed | |
| `sec-arch-2` | BEGINNER | `PATTERNS_ARCHITECTURAL` | `securityQuestions.ts` | 🟢 Completed | |


## Data Engineering Architecture & Systems

### dataModelingQuestions (`dataModelingQuestions.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `dm-coding-1` | INTERMEDIATE | `DATA_MODELING` | `dataModelingQuestions.ts` | 🟢 Completed | |
| `scd-coding-1` | INTERMEDIATE | `SCD_PATTERNS` | `dataModelingQuestions.ts` | 🟢 Completed | |
| `scd-coding-2` | ADVANCED | `SCD_PATTERNS` | `dataModelingQuestions.ts` | 🟢 Completed | |
| `pd-coding-1` | INTERMEDIATE | `PIPELINE_DESIGN` | `dataModelingQuestions.ts` | 🟢 Completed | |


### projectQuestions (`projectQuestions.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `proj-js-1` | INTERMEDIATE | `JS_PROJECT` | `projectQuestions.ts` | 🟢 Completed | |
| `proj-js-2` | INTERMEDIATE | `JS_PROJECT` | `projectQuestions.ts` | 🟢 Completed | |
| `proj-ts-1` | ADVANCED | `TS_PROJECT` | `projectQuestions.ts` | 🟢 Completed | |
| `proj-ts-2` | ADVANCED | `TS_PROJECT` | `projectQuestions.ts` | 🟢 Completed | |
| `proj-next-1` | INTERMEDIATE | `NEXT_DEPLOYMENT` | `projectQuestions.ts` | 🟢 Completed | |
| `proj-next-2` | INTERMEDIATE | `NEXT_DEPLOYMENT` | `projectQuestions.ts` | 🟢 Completed | |
| `proj-forms-1` | ADVANCED | `NEXT_FORMS_VALIDATION` | `projectQuestions.ts` | 🟢 Completed | |
| `proj-forms-2` | ADVANCED | `NEXT_FORMS_VALIDATION` | `projectQuestions.ts` | 🟢 Completed | |
| `proj-url-1` | ADVANCED | `NEXT_URL_STATE` | `projectQuestions.ts` | 🟢 Completed | |
| `proj-url-2` | ADVANCED | `NEXT_URL_STATE` | `projectQuestions.ts` | 🟢 Completed | |
| `proj-capstone-1` | ADVANCED | `PATTERNS_ARCHITECTURAL` | `projectQuestions.ts` | 🟢 Completed | |
| `proj-capstone-2` | ADVANCED | `PATTERNS_ARCHITECTURAL` | `projectQuestions.ts` | 🟢 Completed | |


## Databricks & Lakehouse Architecture

### databricksPlatformQuestions (`databricksPlatformQuestions.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `dbx-storage-repos-2` | INTERMEDIATE | `DATABRICKS_STORAGE_REPOS` | `databricksPlatformQuestions.ts` | 🟢 Completed | |
| `dbx-storage-repos-3` | INTERMEDIATE | `DATABRICKS_STORAGE_REPOS` | `databricksPlatformQuestions.ts` | 🟢 Completed | |
| `dbx-storage-repos-5` | BEGINNER | `DATABRICKS_STORAGE_REPOS` | `databricksPlatformQuestions.ts` | 🟢 Completed | |
| `dbx-storage-repos-9` | INTERMEDIATE | `DATABRICKS_STORAGE_REPOS` | `databricksPlatformQuestions.ts` | 🟢 Completed | |
| `dbx-storage-repos-19` | INTERMEDIATE | `DATABRICKS_STORAGE_REPOS` | `databricksPlatformQuestions.ts` | 🟢 Completed | |
| `dbx-storage-repos-20` | ADVANCED | `DATABRICKS_STORAGE_REPOS` | `databricksPlatformQuestions.ts` | 🟢 Completed | |
| `dbx-notebooks-sec-3` | INTERMEDIATE | `DATABRICKS_NOTEBOOKS_SECURITY` | `databricksPlatformQuestions.ts` | 🟢 Completed | |
| `dbx-notebooks-sec-4` | BEGINNER | `DATABRICKS_NOTEBOOKS_SECURITY` | `databricksPlatformQuestions.ts` | 🟢 Completed | |
| `dbx-notebooks-sec-5` | INTERMEDIATE | `DATABRICKS_NOTEBOOKS_SECURITY` | `databricksPlatformQuestions.ts` | 🟢 Completed | |
| `dbx-notebooks-sec-10` | BEGINNER | `DATABRICKS_NOTEBOOKS_SECURITY` | `databricksPlatformQuestions.ts` | 🟢 Completed | |


### goldLayerDesignQuestions (`goldLayerDesignQuestions.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `gld-coding-1` | ADVANCED | `GOLD_LAYER_DESIGN` | `goldLayerDesignQuestions.ts` | 🟢 Completed | |
| `gld-coding-2` | ADVANCED | `GOLD_LAYER_DESIGN` | `goldLayerDesignQuestions.ts` | 🟢 Completed | |


### ingestionArchitectureQuestions (`ingestionArchitectureQuestions.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `ing-coding-1` | ADVANCED | `INGESTION_ARCHITECTURE` | `ingestionArchitectureQuestions.ts` | 🟢 Completed | |
| `ing-coding-2` | ADVANCED | `INGESTION_ARCHITECTURE` | `ingestionArchitectureQuestions.ts` | 🟢 Completed | |


### orchestrationDesignQuestions (`orchestrationDesignQuestions.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `orc-coding-1` | INTERMEDIATE | `ORCHESTRATION_DESIGN` | `orchestrationDesignQuestions.ts` | 🟢 Completed | |
| `orc-coding-2` | ADVANCED | `ORCHESTRATION_DESIGN` | `orchestrationDesignQuestions.ts` | 🟢 Completed | |


### unityCatalogQuestions (`unityCatalogQuestions.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `uc-basics-2` | BEGINNER | `UNITY_CATALOG_BASICS` | `unityCatalogQuestions.ts` | 🟢 Completed | |
| `uc-basics-4` | INTERMEDIATE | `UNITY_CATALOG_BASICS` | `unityCatalogQuestions.ts` | 🟢 Completed | |
| `uc-basics-6` | INTERMEDIATE | `UNITY_CATALOG_BASICS` | `unityCatalogQuestions.ts` | 🟢 Completed | |
| `uc-basics-7` | BEGINNER | `UNITY_CATALOG_BASICS` | `unityCatalogQuestions.ts` | 🟢 Completed | |
| `uc-gov-2` | BEGINNER | `UNITY_CATALOG_GOVERNANCE` | `unityCatalogQuestions.ts` | 🟢 Completed | |
| `uc-gov-3` | INTERMEDIATE | `UNITY_CATALOG_GOVERNANCE` | `unityCatalogQuestions.ts` | 🟢 Completed | |
| `uc-gov-4` | INTERMEDIATE | `UNITY_CATALOG_GOVERNANCE` | `unityCatalogQuestions.ts` | 🟢 Completed | |
| `uc-gov-6` | ADVANCED | `UNITY_CATALOG_GOVERNANCE` | `unityCatalogQuestions.ts` | 🟢 Completed | |


## Django & Web Backend

### ADMIN (`topic_dj_admin.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `dj-admin-adv-1` | ADVANCED | `DJ_ADMIN` | `topic_dj_admin.ts` | 🟢 Completed | |
| `py-dj-admin-register` | BEGINNER | `DJ_ADMIN` | `topic_dj_admin.ts` | 🟢 Completed | |
| `py-dj-admin-list-display` | BEGINNER | `DJ_ADMIN` | `topic_dj_admin.ts` | 🟢 Completed | |
| `py-dj-admin-inline` | BEGINNER | `DJ_ADMIN` | `topic_dj_admin.ts` | 🟢 Completed | |
| `py-dj-admin-action` | BEGINNER | `DJ_ADMIN` | `topic_dj_admin.ts` | 🟢 Completed | |
| `py-dj-admin-readonly-fieldsets` | BEGINNER | `DJ_ADMIN` | `topic_dj_admin.ts` | 🟢 Completed | |


### API_DOCS (`topic_dj_api_docs.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `celery-drf-18` | BEGINNER | `DJ_API_DOCS` | `topic_dj_api_docs.ts` | 🟢 Completed | |
| `celery-drf-20` | BEGINNER | `DJ_API_DOCS` | `topic_dj_api_docs.ts` | 🟢 Completed | |


### AUTH (`topic_dj_auth.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `be-auth-2` | BEGINNER | `DJ_AUTH` | `topic_dj_auth.ts` | 🟢 Completed | |
| `be-auth-3` | INTERMEDIATE | `DJ_AUTH` | `topic_dj_auth.ts` | 🟢 Completed | |
| `dj-auth-adv-1` | ADVANCED | `DJ_AUTH` | `topic_dj_auth.ts` | 🟢 Completed | |
| `dj-auth-adv-2` | ADVANCED | `DJ_AUTH` | `topic_dj_auth.ts` | 🟢 Completed | |
| `dj-auth-adv-3` | ADVANCED | `DJ_AUTH` | `topic_dj_auth.ts` | 🟢 Completed | |
| `py-dj-auth-register-view` | INTERMEDIATE | `DJ_AUTH` | `topic_dj_auth.ts` | 🟢 Completed | |
| `py-dj-auth-password-hashing` | BEGINNER | `DJ_AUTH` | `topic_dj_auth.ts` | 🟢 Completed | |
| `py-dj-auth-authenticate-login` | BEGINNER | `DJ_AUTH` | `topic_dj_auth.ts` | 🟢 Completed | |
| `py-dj-auth-permission-required` | INTERMEDIATE | `DJ_AUTH` | `topic_dj_auth.ts` | 🟢 Completed | |
| `py-dj-auth-custom-user` | BEGINNER | `DJ_AUTH` | `topic_dj_auth.ts` | 🟢 Completed | |
| `dj4e-owned-2` | INTERMEDIATE | `DJ_AUTH` | `topic_dj_auth.ts` | 🟢 Completed | |
| `dj4e-owned-3` | INTERMEDIATE | `DJ_AUTH` | `topic_dj_auth.ts` | 🟢 Completed | |
| `dj-auth-groups-1` | INTERMEDIATE | `DJ_AUTH` | `topic_dj_auth.ts` | 🟢 Completed | |
| `dj-auth-userpasses-1` | ADVANCED | `DJ_AUTH` | `topic_dj_auth.ts` | 🟢 Completed | |


### AUTH_MASTERY (`topic_dj_auth_mastery.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `dj-auth-mastery-backend-1` | ADVANCED | `DJ_AUTH_MASTERY` | `topic_dj_auth_mastery.ts` | 🟢 Completed | |


### CACHING (`topic_dj_caching.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `dj-cache-2` | ADVANCED | `DJ_CACHING` | `topic_dj_caching.ts` | 🟢 Completed | |
| `py-dj-cache-get-set` | BEGINNER | `DJ_CACHING` | `topic_dj_caching.ts` | 🟢 Completed | |
| `py-dj-cache-page` | BEGINNER | `DJ_CACHING` | `topic_dj_caching.ts` | 🟢 Completed | |
| `py-dj-cache-getorset` | BEGINNER | `DJ_CACHING` | `topic_dj_caching.ts` | 🟢 Completed | |
| `py-dj-cache-invalidate` | INTERMEDIATE | `DJ_CACHING` | `topic_dj_caching.ts` | 🟢 Completed | |


### CBV (`topic_dj_cbv.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `be-dj-cbv-1` | INTERMEDIATE | `DJ_CBV` | `topic_dj_cbv.ts` | 🟢 Completed | |
| `dj4e-cbv-2` | INTERMEDIATE | `DJ_CBV` | `topic_dj_cbv.ts` | 🟢 Completed | |
| `dj4e-cbv-3` | INTERMEDIATE | `DJ_CBV` | `topic_dj_cbv.ts` | 🟢 Completed | |
| `dj4e-cbv-4` | INTERMEDIATE | `DJ_CBV` | `topic_dj_cbv.ts` | 🟢 Completed | |
| `dj4e-cbv-6` | INTERMEDIATE | `DJ_CBV` | `topic_dj_cbv.ts` | 🟢 Completed | |
| `dj4e-cbv-8` | INTERMEDIATE | `DJ_CBV` | `topic_dj_cbv.ts` | 🟢 Completed | |
| `dj-cbv-adv-1` | ADVANCED | `DJ_CBV` | `topic_dj_cbv.ts` | 🟢 Completed | |
| `dj-cbv-adv-2` | ADVANCED | `DJ_CBV` | `topic_dj_cbv.ts` | 🟢 Completed | |
| `dj-cbv-context-1` | INTERMEDIATE | `DJ_CBV` | `topic_dj_cbv.ts` | 🟢 Completed | |
| `dj-cbv-formview-1` | ADVANCED | `DJ_CBV` | `topic_dj_cbv.ts` | 🟢 Completed | |


### CELERY (`topic_dj_celery.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `celery-drf-1` | BEGINNER | `DJ_CELERY` | `topic_dj_celery.ts` | 🟢 Completed | |
| `celery-drf-2` | BEGINNER | `DJ_CELERY` | `topic_dj_celery.ts` | 🟢 Completed | |
| `celery-drf-5` | INTERMEDIATE | `DJ_CELERY` | `topic_dj_celery.ts` | 🟢 Completed | |
| `celery-drf-8` | INTERMEDIATE | `DJ_CELERY` | `topic_dj_celery.ts` | 🟢 Completed | |
| `dj-celery-adv-1` | ADVANCED | `DJ_CELERY` | `topic_dj_celery.ts` | 🟢 Completed | |


### CHANNELS (`topic_dj_channels.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `be-infra-channels-2` | ADVANCED | `DJ_CHANNELS` | `topic_dj_channels.ts` | 🟢 Completed | |


### CUSTOM_MANAGERS (`topic_dj_custom_managers.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `celery-drf-22` | BEGINNER | `DJ_CUSTOM_MANAGERS` | `topic_dj_custom_managers.ts` | 🟢 Completed | |
| `celery-drf-23` | ADVANCED | `DJ_CUSTOM_MANAGERS` | `topic_dj_custom_managers.ts` | 🟢 Completed | |


### DEPLOYMENT (`topic_dj_deployment.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `be-docker-2` | BEGINNER | `DJ_DEPLOYMENT` | `topic_dj_deployment.ts` | 🟢 Completed | |
| `be-docker-3` | INTERMEDIATE | `DJ_DEPLOYMENT` | `topic_dj_deployment.ts` | 🟢 Completed | |
| `dj-deploy-2` | ADVANCED | `DJ_DEPLOYMENT` | `topic_dj_deployment.ts` | 🟢 Completed | |
| `py-dj-deploy-allowed-hosts` | BEGINNER | `DJ_DEPLOYMENT` | `topic_dj_deployment.ts` | 🟢 Completed | |
| `py-dj-deploy-collectstatic` | BEGINNER | `DJ_DEPLOYMENT` | `topic_dj_deployment.ts` | 🟢 Completed | |
| `py-dj-deploy-whitenoise` | BEGINNER | `DJ_DEPLOYMENT` | `topic_dj_deployment.ts` | 🟢 Completed | |


### FACTORY_BOY (`topic_dj_factory_boy.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `py-dj-factory-userfactory` | BEGINNER | `DJ_FACTORY_BOY` | `topic_dj_factory_boy.ts` | 🟢 Completed | |
| `py-dj-factory-subfactory` | BEGINNER | `DJ_FACTORY_BOY` | `topic_dj_factory_boy.ts` | 🟢 Completed | |
| `py-dj-factory-traits` | BEGINNER | `DJ_FACTORY_BOY` | `topic_dj_factory_boy.ts` | 🟢 Completed | |
| `py-dj-factory-usage-test` | BEGINNER | `DJ_FACTORY_BOY` | `topic_dj_factory_boy.ts` | 🟢 Completed | |


### FILE_UPLOADS (`topic_dj_file_uploads.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `be-infra-uploads-1` | BEGINNER | `DJ_FILE_UPLOADS` | `topic_dj_file_uploads.ts` | 🟢 Completed | |


### FORMS (`topic_dj_forms.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `dj-form-3` | BEGINNER | `DJ_FORMS` | `topic_dj_forms.ts` | 🟢 Completed | |
| `dj-forms-adv-1` | ADVANCED | `DJ_FORMS` | `topic_dj_forms.ts` | 🟢 Completed | |
| `py-dj-form-modelform` | BEGINNER | `DJ_FORMS` | `topic_dj_forms.ts` | 🟢 Completed | |
| `py-dj-form-clean-field` | BEGINNER | `DJ_FORMS` | `topic_dj_forms.ts` | 🟢 Completed | |
| `py-dj-form-clean-cross-field` | BEGINNER | `DJ_FORMS` | `topic_dj_forms.ts` | 🟢 Completed | |
| `py-dj-form-widgets` | BEGINNER | `DJ_FORMS` | `topic_dj_forms.ts` | 🟢 Completed | |
| `py-dj-form-cleaneddata` | INTERMEDIATE | `DJ_FORMS` | `topic_dj_forms.ts` | 🟢 Completed | |
| `dj4e-forms-2` | INTERMEDIATE | `DJ_FORMS` | `topic_dj_forms.ts` | 🟢 Completed | |
| `dj-forms-gap-2` | BEGINNER | `DJ_FORMS` | `topic_dj_forms.ts` | 🟢 Completed | |
| `dj-forms-modelchoice-1` | INTERMEDIATE | `DJ_FORMS` | `topic_dj_forms.ts` | 🟢 Completed | |
| `dj-forms-commit-1` | INTERMEDIATE | `DJ_FORMS` | `topic_dj_forms.ts` | 🟢 Completed | |
| `dj-forms-dynamic-1` | ADVANCED | `DJ_FORMS` | `topic_dj_forms.ts` | 🟢 Completed | |


### FORMS_MASTERY (`topic_dj_forms_mastery.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `dj-forms-mastery-savem2m-1` | ADVANCED | `DJ_FORMS_MASTERY` | `topic_dj_forms_mastery.ts` | 🟢 Completed | |


### MANAGEMENT (`topic_dj_management.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `dj-mgmt-1` | BEGINNER | `DJ_MANAGEMENT` | `topic_dj_management.ts` | 🟢 Completed | |


### MODELS (`topic_dj_models.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `dj-model-1` | BEGINNER | `DJ_MODELS` | `topic_dj_models.ts` | 🟢 Completed | |
| `dj-model-2` | BEGINNER | `DJ_MODELS` | `topic_dj_models.ts` | 🟢 Completed | |
| `dj-model-str` | BEGINNER | `DJ_MODELS` | `topic_dj_models.ts` | 🟢 Completed | |
| `dj-model-meta` | BEGINNER | `DJ_MODELS` | `topic_dj_models.ts` | 🟢 Completed | |
| `dj4e-fk-4` | INTERMEDIATE | `DJ_MODELS` | `topic_dj_models.ts` | 🟢 Completed | |
| `dj4e-m2m-2` | INTERMEDIATE | `DJ_MODELS` | `topic_dj_models.ts` | 🟢 Completed | |
| `dj4e-m2m-4` | INTERMEDIATE | `DJ_MODELS` | `topic_dj_models.ts` | 🟢 Completed | |
| `dj-models-constraint-adv-1` | ADVANCED | `DJ_MODELS` | `topic_dj_models.ts` | 🟢 Completed | |
| `dj-models-o2o-1` | INTERMEDIATE | `DJ_MODELS` | `topic_dj_models.ts` | 🟢 Completed | |
| `dj-models-abstract-adv-1` | ADVANCED | `DJ_MODELS` | `topic_dj_models.ts` | 🟢 Completed | |
| `dj-models-save-1` | INTERMEDIATE | `DJ_MODELS` | `topic_dj_models.ts` | 🟢 Completed | |
| `dj-models-uuid-1` | INTERMEDIATE | `DJ_MODELS` | `topic_dj_models.ts` | 🟢 Completed | |


### MODELS_MASTERY (`topic_dj_models_mastery.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `dj-models-mastery-proxy-1` | ADVANCED | `DJ_MODELS_MASTERY` | `topic_dj_models_mastery.ts` | 🟢 Completed | |
| `dj-models-mastery-clean-1` | ADVANCED | `DJ_MODELS_MASTERY` | `topic_dj_models_mastery.ts` | 🟢 Completed | |


### MONITORING (`topic_dj_monitoring.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `be-infra-monitoring-2` | BEGINNER | `DJ_MONITORING` | `topic_dj_monitoring.ts` | 🟢 Completed | |


### NGINX (`topic_dj_nginx.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `be-infra-nginx-1` | BEGINNER | `DJ_NGINX` | `topic_dj_nginx.ts` | 🟢 Completed | |


### ORM (`topic_dj_orm.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `dj-orm-3` | ADVANCED | `DJ_ORM` | `topic_dj_orm.ts` | 🟢 Completed | |
| `dj-orm-1` | BEGINNER | `DJ_ORM` | `topic_dj_orm.ts` | 🟢 Completed | |
| `dj-orm-2` | BEGINNER | `DJ_ORM` | `topic_dj_orm.ts` | 🟢 Completed | |
| `dj-orm-adv-1` | ADVANCED | `DJ_ORM` | `topic_dj_orm.ts` | 🟢 Completed | |
| `dj-orm-adv-2` | ADVANCED | `DJ_ORM` | `topic_dj_orm.ts` | 🟢 Completed | |
| `dj-orm-adv-3` | ADVANCED | `DJ_ORM` | `topic_dj_orm.ts` | 🟢 Completed | |
| `py-dj-orm-select-related` | INTERMEDIATE | `DJ_ORM` | `topic_dj_orm.ts` | 🟢 Completed | |
| `py-dj-orm-prefetch` | INTERMEDIATE | `DJ_ORM` | `topic_dj_orm.ts` | 🟢 Completed | |
| `py-dj-orm-f` | INTERMEDIATE | `DJ_ORM` | `topic_dj_orm.ts` | 🟢 Completed | |
| `py-dj-orm-q` | INTERMEDIATE | `DJ_ORM` | `topic_dj_orm.ts` | 🟢 Completed | |
| `py-dj-orm-aggregate-annotate` | INTERMEDIATE | `DJ_ORM` | `topic_dj_orm.ts` | 🟢 Completed | |
| `dj-orm-gap-2` | BEGINNER | `DJ_ORM` | `topic_dj_orm.ts` | 🟢 Completed | |
| `dj-orm-case-adv-1` | ADVANCED | `DJ_ORM` | `topic_dj_orm.ts` | 🟢 Completed | |
| `dj-orm-subquery-adv-1` | ADVANCED | `DJ_ORM` | `topic_dj_orm.ts` | 🟢 Completed | |
| `dj-orm-exists-1` | INTERMEDIATE | `DJ_ORM` | `topic_dj_orm.ts` | 🟢 Completed | |
| `dj-orm-bulk-1` | INTERMEDIATE | `DJ_ORM` | `topic_dj_orm.ts` | 🟢 Completed | |
| `dj-orm-prefetch-obj-adv-1` | ADVANCED | `DJ_ORM` | `topic_dj_orm.ts` | 🟢 Completed | |


### ORM_MASTERY (`topic_dj_orm_mastery.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `dj-orm-mastery-window-1` | ADVANCED | `DJ_ORM_MASTERY` | `topic_dj_orm_mastery.ts` | 🟢 Completed | |
| `dj-orm-mastery-lock-1` | ADVANCED | `DJ_ORM_MASTERY` | `topic_dj_orm_mastery.ts` | 🟢 Completed | |
| `dj-orm-mastery-nplus1-1` | ADVANCED | `DJ_ORM_MASTERY` | `topic_dj_orm_mastery.ts` | 🟢 Completed | |


### PAGINATION_GENERICS (`topic_dj_pagination_generics.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `celery-drf-13` | BEGINNER | `DJ_PAGINATION_GENERICS` | `topic_dj_pagination_generics.ts` | 🟢 Completed | |
| `celery-drf-16` | INTERMEDIATE | `DJ_PAGINATION_GENERICS` | `topic_dj_pagination_generics.ts` | 🟢 Completed | |


### POSTGRES (`topic_dj_postgres.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `be-infra-postgres-1` | BEGINNER | `DJ_POSTGRES` | `topic_dj_postgres.ts` | 🟢 Completed | |
| `be-infra-postgres-3` | INTERMEDIATE | `DJ_POSTGRES` | `topic_dj_postgres.ts` | 🟢 Completed | |
| `be-infra-dbperf-1` | INTERMEDIATE | `DJ_POSTGRES` | `topic_dj_postgres.ts` | 🟢 Completed | |
| `be-infra-dbperf-2` | INTERMEDIATE | `DJ_POSTGRES` | `topic_dj_postgres.ts` | 🟢 Completed | |
| `dj-postgres-adv-1` | ADVANCED | `DJ_POSTGRES` | `topic_dj_postgres.ts` | 🟢 Completed | |
| `dj-postgres-adv-2` | ADVANCED | `DJ_POSTGRES` | `topic_dj_postgres.ts` | 🟢 Completed | |


### REST (`topic_dj_rest.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `dj-rest-4` | ADVANCED | `DJ_REST` | `topic_dj_rest.ts` | 🟢 Completed | |
| `dj-rest-5` | BEGINNER | `DJ_REST` | `topic_dj_rest.ts` | 🟢 Completed | |
| `dj-rest-1` | BEGINNER | `DJ_REST` | `topic_dj_rest.ts` | 🟢 Completed | |
| `dj-rest-2` | BEGINNER | `DJ_REST` | `topic_dj_rest.ts` | 🟢 Completed | |
| `dj-drf-adv-1` | ADVANCED | `DJ_REST` | `topic_dj_rest.ts` | 🟢 Completed | |
| `dj-drf-adv-2` | ADVANCED | `DJ_REST` | `topic_dj_rest.ts` | 🟢 Completed | |
| `py-drf-modelviewset` | BEGINNER | `DJ_REST` | `topic_dj_rest.ts` | 🟢 Completed | |
| `py-drf-router` | BEGINNER | `DJ_REST` | `topic_dj_rest.ts` | 🟢 Completed | |
| `py-drf-serializer-validator` | BEGINNER | `DJ_REST` | `topic_dj_rest.ts` | 🟢 Completed | |
| `py-drf-method-field` | BEGINNER | `DJ_REST` | `topic_dj_rest.ts` | 🟢 Completed | |
| `py-drf-permission-class` | BEGINNER | `DJ_REST` | `topic_dj_rest.ts` | 🟢 Completed | |
| `py-drf-pagination` | BEGINNER | `DJ_REST` | `topic_dj_rest.ts` | 🟢 Completed | |
| `py-drf-nested-serializer` | BEGINNER | `DJ_REST` | `topic_dj_rest.ts` | 🟢 Completed | |
| `dj-rest-gap-2` | BEGINNER | `DJ_REST` | `topic_dj_rest.ts` | 🟢 Completed | |
| `dj-drf-apiview-fbv-1` | BEGINNER | `DJ_REST` | `topic_dj_rest.ts` | 🟢 Completed | |
| `dj-drf-writeonly-1` | INTERMEDIATE | `DJ_REST` | `topic_dj_rest.ts` | 🟢 Completed | |
| `dj-drf-validate-1` | INTERMEDIATE | `DJ_REST` | `topic_dj_rest.ts` | 🟢 Completed | |
| `dj-drf-getserializer-1` | ADVANCED | `DJ_REST` | `topic_dj_rest.ts` | 🟢 Completed | |


### REST_MASTERY (`topic_dj_rest_mastery.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `dj-rest-mastery-exception-1` | ADVANCED | `DJ_REST_MASTERY` | `topic_dj_rest_mastery.ts` | 🟢 Completed | |


### SERVICE_LAYER (`topic_dj_service_layer.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `be-infra-service-1` | BEGINNER | `DJ_SERVICE_LAYER` | `topic_dj_service_layer.ts` | 🟢 Completed | |


### SETTINGS (`topic_dj_settings.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `be-infra-settings-1` | BEGINNER | `DJ_SETTINGS` | `topic_dj_settings.ts` | 🟢 Completed | |


### SETUP (`topic_dj_setup.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `py-dj-setup-installed-apps` | BEGINNER | `DJ_SETUP` | `topic_dj_setup.ts` | 🟢 Completed | |
| `dj-setup-gap-2` | INTERMEDIATE | `DJ_SETUP` | `topic_dj_setup.ts` | 🟢 Completed | |


### SIGNALS_MW (`topic_dj_signals_mw.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `dj-signals-mw-adv-1` | ADVANCED | `DJ_SIGNALS_MW` | `topic_dj_signals_mw.ts` | 🟢 Completed | |
| `dj-models-adv-2` | ADVANCED | `DJ_SIGNALS_MW` | `topic_dj_signals_mw.ts` | 🟢 Completed | |
| `py-dj-signal-post-save-profile` | BEGINNER | `DJ_SIGNALS_MW` | `topic_dj_signals_mw.ts` | 🟢 Completed | |
| `py-dj-signal-register-ready` | BEGINNER | `DJ_SIGNALS_MW` | `topic_dj_signals_mw.ts` | 🟢 Completed | |
| `py-dj-mw-custom` | BEGINNER | `DJ_SIGNALS_MW` | `topic_dj_signals_mw.ts` | 🟢 Completed | |


### TEMPLATES (`topic_dj_templates.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `dj-tmpl-1` | BEGINNER | `DJ_TEMPLATES` | `topic_dj_templates.ts` | 🟢 Completed | |
| `dj-tmpl-3` | BEGINNER | `DJ_TEMPLATES` | `topic_dj_templates.ts` | 🟢 Completed | |
| `dj-tmpl-4` | BEGINNER | `DJ_TEMPLATES` | `topic_dj_templates.ts` | 🟢 Completed | |
| `py-dj-tpl-url-tag` | BEGINNER | `DJ_TEMPLATES` | `topic_dj_templates.ts` | 🟢 Completed | |
| `py-dj-tpl-inheritance` | BEGINNER | `DJ_TEMPLATES` | `topic_dj_templates.ts` | 🟢 Completed | |
| `py-dj-tpl-include` | BEGINNER | `DJ_TEMPLATES` | `topic_dj_templates.ts` | 🟢 Completed | |
| `py-dj-tpl-custom-filter` | INTERMEDIATE | `DJ_TEMPLATES` | `topic_dj_templates.ts` | 🟢 Completed | |


### TRANSACTIONS (`topic_dj_transactions.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `dj-tx-1` | ADVANCED | `DJ_TRANSACTIONS` | `topic_dj_transactions.ts` | 🟢 Completed | |
| `py-dj-tx-atomic-decorator` | BEGINNER | `DJ_TRANSACTIONS` | `topic_dj_transactions.ts` | 🟢 Completed | |
| `py-dj-tx-atomic-block` | BEGINNER | `DJ_TRANSACTIONS` | `topic_dj_transactions.ts` | 🟢 Completed | |
| `py-dj-tx-select-for-update` | BEGINNER | `DJ_TRANSACTIONS` | `topic_dj_transactions.ts` | 🟢 Completed | |
| `py-dj-tx-savepoint` | BEGINNER | `DJ_TRANSACTIONS` | `topic_dj_transactions.ts` | 🟢 Completed | |


### URLS (`topic_dj_urls.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `py-dj-urls-path-basic` | BEGINNER | `DJ_URLS` | `topic_dj_urls.ts` | 🟢 Completed | |
| `py-dj-urls-converters` | BEGINNER | `DJ_URLS` | `topic_dj_urls.ts` | 🟢 Completed | |
| `py-dj-urls-include` | BEGINNER | `DJ_URLS` | `topic_dj_urls.ts` | 🟢 Completed | |
| `py-dj-urls-namespace` | BEGINNER | `DJ_URLS` | `topic_dj_urls.ts` | 🟢 Completed | |
| `py-dj-urls-re-path` | BEGINNER | `DJ_URLS` | `topic_dj_urls.ts` | 🟢 Completed | |


### VIEWS (`topic_dj_views.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `dj-view-httpresponse` | BEGINNER | `DJ_VIEWS` | `topic_dj_views.ts` | 🟢 Completed | |
| `dj-view-render` | BEGINNER | `DJ_VIEWS` | `topic_dj_views.ts` | 🟢 Completed | |
| `dj-view-param` | BEGINNER | `DJ_VIEWS` | `topic_dj_views.ts` | 🟢 Completed | |
| `dj-view-404` | BEGINNER | `DJ_VIEWS` | `topic_dj_views.ts` | 🟢 Completed | |
| `dj-view-post` | BEGINNER | `DJ_VIEWS` | `topic_dj_views.ts` | 🟢 Completed | |
| `dj-view-1` | INTERMEDIATE | `DJ_VIEWS` | `topic_dj_views.ts` | 🟢 Completed | |
| `dj4e-session-3` | INTERMEDIATE | `DJ_VIEWS` | `topic_dj_views.ts` | 🟢 Completed | |
| `dj4e-session-4` | INTERMEDIATE | `DJ_VIEWS` | `topic_dj_views.ts` | 🟢 Completed | |
| `dj-views-adv-6` | ADVANCED | `DJ_VIEWS` | `topic_dj_views.ts` | 🟢 Completed | |
| `dj-views-redirect-1` | INTERMEDIATE | `DJ_VIEWS` | `topic_dj_views.ts` | 🟢 Completed | |
| `dj-views-upload-1` | ADVANCED | `DJ_VIEWS` | `topic_dj_views.ts` | 🟢 Completed | |


### VIEWS_MASTERY (`topic_dj_views_mastery.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `dj-views-mastery-decorator-1` | ADVANCED | `DJ_VIEWS_MASTERY` | `topic_dj_views_mastery.ts` | 🟢 Completed | |
| `dj-views-mastery-streaming-1` | ADVANCED | `DJ_VIEWS_MASTERY` | `topic_dj_views_mastery.ts` | 🟢 Completed | |


## Python Core & Advanced

### ASYNC (`topic_py_async.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `py-adv-async-bridge-1` | INTERMEDIATE | `PY_ASYNC` | `topic_py_async.ts` | 🟢 Completed | |
| `py-adv-async-bridge-2` | INTERMEDIATE | `PY_ASYNC` | `topic_py_async.ts` | 🟢 Completed | |
| `py-adv-async-bridge-3` | INTERMEDIATE | `PY_ASYNC` | `topic_py_async.ts` | 🟢 Completed | |
| `py-adv-async-1` | ADVANCED | `PY_ASYNC` | `topic_py_async.ts` | 🟢 Completed | |
| `py-adv-async-2` | ADVANCED | `PY_ASYNC` | `topic_py_async.ts` | 🟢 Completed | |
| `py-adv-async-3` | INTERMEDIATE | `PY_ASYNC` | `topic_py_async.ts` | 🟢 Completed | |
| `py-async-beg-1` | BEGINNER | `PY_ASYNC` | `topic_py_async.ts` | 🟢 Completed | |
| `py-async-beg-2` | BEGINNER | `PY_ASYNC` | `topic_py_async.ts` | 🟢 Completed | |
| `py-async-int-gen-1` | INTERMEDIATE | `PY_ASYNC` | `topic_py_async.ts` | 🟢 Completed | |
| `py-async-int-queue-1` | INTERMEDIATE | `PY_ASYNC` | `topic_py_async.ts` | 🟢 Completed | |
| `py-async-int-gather-errors` | INTERMEDIATE | `PY_ASYNC` | `topic_py_async.ts` | 🟢 Completed | |
| `py-async-int-semaphore` | INTERMEDIATE | `PY_ASYNC` | `topic_py_async.ts` | 🟢 Completed | |
| `py-async-int-asyncwith` | INTERMEDIATE | `PY_ASYNC` | `topic_py_async.ts` | 🟢 Completed | |
| `py-async-int-waitfor` | INTERMEDIATE | `PY_ASYNC` | `topic_py_async.ts` | 🟢 Completed | |
| `py-async-adv-taskgroup` | ADVANCED | `PY_ASYNC` | `topic_py_async.ts` | 🟢 Completed | |
| `py-async-adv-tothread` | ADVANCED | `PY_ASYNC` | `topic_py_async.ts` | 🟢 Completed | |
| `py-async-int-waitfor-gather` | INTERMEDIATE | `PY_ASYNC` | `topic_py_async.ts` | 🟢 Completed | |
| `py-async-int-asyncgen-queue` | INTERMEDIATE | `PY_ASYNC` | `topic_py_async.ts` | 🟢 Completed | |
| `py-async-adv-rate-limited-fetcher` | ADVANCED | `PY_ASYNC` | `topic_py_async.ts` | 🟢 Completed | |
| `py-gap-async-3` | INTERMEDIATE | `PY_ASYNC` | `topic_py_async.ts` | 🟢 Completed | |
| `py-async-httpx-1` | BEGINNER | `PY_ASYNC` | `topic_py_async.ts` | 🟢 Completed | |


### BASICS (`topic_py_basics.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `be-sql-1` | BEGINNER | `PY_BASICS` | `topic_py_basics.ts` | 🟢 Completed | |
| `be-sql-2` | INTERMEDIATE | `PY_BASICS` | `topic_py_basics.ts` | 🟢 Completed | |
| `be-sql-3` | BEGINNER | `PY_BASICS` | `topic_py_basics.ts` | 🟢 Completed | |
| `py-basic-2` | BEGINNER | `PY_BASICS` | `topic_py_basics.ts` | 🟢 Completed | |
| `py-basic-3` | BEGINNER | `PY_BASICS` | `topic_py_basics.ts` | 🟢 Completed | |
| `py-basic-4` | BEGINNER | `PY_BASICS` | `topic_py_basics.ts` | 🟢 Completed | |
| `pe1-m1-4` | BEGINNER | `PY_BASICS` | `topic_py_basics.ts` | 🟢 Completed | |
| `pe1-m2-6` | BEGINNER | `PY_BASICS` | `topic_py_basics.ts` | 🟢 Completed | |
| `pe1-m2-7` | BEGINNER | `PY_BASICS` | `topic_py_basics.ts` | 🟢 Completed | |
| `pe1-m2-11` | BEGINNER | `PY_BASICS` | `topic_py_basics.ts` | 🟢 Completed | |
| `pe1-m2-16` | BEGINNER | `PY_BASICS` | `topic_py_basics.ts` | 🟢 Completed | |
| `pe1-m3-4` | BEGINNER | `PY_BASICS` | `topic_py_basics.ts` | 🟢 Completed | |
| `pe1-m3-7` | BEGINNER | `PY_BASICS` | `topic_py_basics.ts` | 🟢 Completed | |
| `pe1-m3-9` | BEGINNER | `PY_BASICS` | `topic_py_basics.ts` | 🟢 Completed | |
| `pe1-m3-13` | BEGINNER | `PY_BASICS` | `topic_py_basics.ts` | 🟢 Completed | |
| `pe1-m3-14` | BEGINNER | `PY_BASICS` | `topic_py_basics.ts` | 🟢 Completed | |
| `pe1-builtins-3` | BEGINNER | `PY_BASICS` | `topic_py_basics.ts` | 🟢 Completed | |
| `pe1-builtins-5` | BEGINNER | `PY_BASICS` | `topic_py_basics.ts` | 🟢 Completed | |
| `pe1-format-2` | BEGINNER | `PY_BASICS` | `topic_py_basics.ts` | 🟢 Completed | |
| `pe1-idioms-3` | BEGINNER | `PY_BASICS` | `topic_py_basics.ts` | 🟢 Completed | |
| `pe1-idioms-4` | BEGINNER | `PY_BASICS` | `topic_py_basics.ts` | 🟢 Completed | |


### CLI (`topic_py_cli.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `py-cli-2` | BEGINNER | `PY_CLI` | `topic_py_cli.ts` | 🟢 Completed | |
| `py-cli-3` | BEGINNER | `PY_CLI` | `topic_py_cli.ts` | 🟢 Completed | |
| `py-cli-5` | BEGINNER | `PY_CLI` | `topic_py_cli.ts` | 🟢 Completed | |
| `py-cli-int-1` | INTERMEDIATE | `PY_CLI` | `topic_py_cli.ts` | 🟢 Completed | |
| `py-cli-adv-1` | ADVANCED | `PY_CLI` | `topic_py_cli.ts` | 🟢 Completed | |


### COLLECTIONS (`topic_py_collections.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `py-adv-coll-1` | ADVANCED | `PY_COLLECTIONS` | `topic_py_collections.ts` | 🟢 Completed | |
| `py-adv-coll-2` | INTERMEDIATE | `PY_COLLECTIONS` | `topic_py_collections.ts` | 🟢 Completed | |
| `py-coll-defaultdict-group` | BEGINNER | `PY_COLLECTIONS` | `topic_py_collections.ts` | 🟢 Completed | |
| `py-coll-deque-queue` | BEGINNER | `PY_COLLECTIONS` | `topic_py_collections.ts` | 🟢 Completed | |
| `py-coll-deque-maxlen` | BEGINNER | `PY_COLLECTIONS` | `topic_py_collections.ts` | 🟢 Completed | |
| `py-coll-namedtuple` | BEGINNER | `PY_COLLECTIONS` | `topic_py_collections.ts` | 🟢 Completed | |
| `py-coll-chainmap` | BEGINNER | `PY_COLLECTIONS` | `topic_py_collections.ts` | 🟢 Completed | |
| `py-coll-counter-arithmetic` | BEGINNER | `PY_COLLECTIONS` | `topic_py_collections.ts` | 🟢 Completed | |
| `py-coll-deque-rotate` | BEGINNER | `PY_COLLECTIONS` | `topic_py_collections.ts` | 🟢 Completed | |
| `py-coll-int-deque-counter` | INTERMEDIATE | `PY_COLLECTIONS` | `topic_py_collections.ts` | 🟢 Completed | |


### COMPREHENSIONS (`topic_py_comprehensions.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `py-adv-comp-1` | ADVANCED | `PY_COMPREHENSIONS` | `topic_py_comprehensions.ts` | 🟢 Completed | |
| `py-adv-comp-2` | ADVANCED | `PY_COMPREHENSIONS` | `topic_py_comprehensions.ts` | 🟢 Completed | |
| `py-comp-squared-evens` | BEGINNER | `PY_COMPREHENSIONS` | `topic_py_comprehensions.ts` | 🟢 Completed | |
| `py-comp-dict-doubled` | BEGINNER | `PY_COMPREHENSIONS` | `topic_py_comprehensions.ts` | 🟢 Completed | |
| `py-comp-set-unique-words` | BEGINNER | `PY_COMPREHENSIONS` | `topic_py_comprehensions.ts` | 🟢 Completed | |
| `py-comp-nested-matrix` | BEGINNER | `PY_COMPREHENSIONS` | `topic_py_comprehensions.ts` | 🟢 Completed | |
| `py-comp-genexp-sum` | BEGINNER | `PY_COMPREHENSIONS` | `topic_py_comprehensions.ts` | 🟢 Completed | |
| `py-comp-flatten` | BEGINNER | `PY_COMPREHENSIONS` | `topic_py_comprehensions.ts` | 🟢 Completed | |
| `py-comp-ternary` | BEGINNER | `PY_COMPREHENSIONS` | `topic_py_comprehensions.ts` | 🟢 Completed | |
| `py-comp-invert-dict` | BEGINNER | `PY_COMPREHENSIONS` | `topic_py_comprehensions.ts` | 🟢 Completed | |
| `py-comp-int-dict-filter` | INTERMEDIATE | `PY_COMPREHENSIONS` | `topic_py_comprehensions.ts` | 🟢 Completed | |
| `py-gap-comprehensions-2` | BEGINNER | `PY_COMPREHENSIONS` | `topic_py_comprehensions.ts` | 🟢 Completed | |


### CONTEXT_MANAGERS (`topic_py_context_managers.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `py-adv-ctx-1` | ADVANCED | `PY_CONTEXT_MANAGERS` | `topic_py_context_managers.ts` | 🟢 Completed | |
| `py-ctx-file` | BEGINNER | `PY_CONTEXT_MANAGERS` | `topic_py_context_managers.ts` | 🟢 Completed | |
| `py-ctx-custom-class` | BEGINNER | `PY_CONTEXT_MANAGERS` | `topic_py_context_managers.ts` | 🟢 Completed | |
| `py-ctx-contextmanager-decorator` | BEGINNER | `PY_CONTEXT_MANAGERS` | `topic_py_context_managers.ts` | 🟢 Completed | |
| `py-ctx-multiple` | BEGINNER | `PY_CONTEXT_MANAGERS` | `topic_py_context_managers.ts` | 🟢 Completed | |
| `py-ctx-suppress` | BEGINNER | `PY_CONTEXT_MANAGERS` | `topic_py_context_managers.ts` | 🟢 Completed | |
| `py-ctx-exitstack` | BEGINNER | `PY_CONTEXT_MANAGERS` | `topic_py_context_managers.ts` | 🟢 Completed | |
| `py-ctx-exit-suppress-exc` | BEGINNER | `PY_CONTEXT_MANAGERS` | `topic_py_context_managers.ts` | 🟢 Completed | |
| `py-ctx-reentrant` | INTERMEDIATE | `PY_CONTEXT_MANAGERS` | `topic_py_context_managers.ts` | 🟢 Completed | |
| `py-gap-contextmgr-2` | BEGINNER | `PY_CONTEXT_MANAGERS` | `topic_py_context_managers.ts` | 🟢 Completed | |


### DAILY_PATTERNS (`topic_py_daily_patterns.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `be-infra-patterns-1` | BEGINNER | `PY_DAILY_PATTERNS` | `topic_py_daily_patterns.ts` | 🟢 Completed | |
| `be-infra-patterns-2` | BEGINNER | `PY_DAILY_PATTERNS` | `topic_py_daily_patterns.ts` | 🟢 Completed | |
| `be-infra-patterns-5` | INTERMEDIATE | `PY_DAILY_PATTERNS` | `topic_py_daily_patterns.ts` | 🟢 Completed | |


### DATACLASSES (`topic_py_dataclasses.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `py-dc-simple` | BEGINNER | `PY_DATACLASSES` | `topic_py_dataclasses.ts` | 🟢 Completed | |
| `py-dc-field-factory` | BEGINNER | `PY_DATACLASSES` | `topic_py_dataclasses.ts` | 🟢 Completed | |
| `py-dc-init-false` | INTERMEDIATE | `PY_DATACLASSES` | `topic_py_dataclasses.ts` | 🟢 Completed | |
| `py-dc-repr-false` | BEGINNER | `PY_DATACLASSES` | `topic_py_dataclasses.ts` | 🟢 Completed | |
| `py-dc-order-sortable` | BEGINNER | `PY_DATACLASSES` | `topic_py_dataclasses.ts` | 🟢 Completed | |
| `py-dc-slots` | BEGINNER | `PY_DATACLASSES` | `topic_py_dataclasses.ts` | 🟢 Completed | |
| `py-dc-asdict` | BEGINNER | `PY_DATACLASSES` | `topic_py_dataclasses.ts` | 🟢 Completed | |
| `py-dc-inheritance` | BEGINNER | `PY_DATACLASSES` | `topic_py_dataclasses.ts` | 🟢 Completed | |
| `py-dc-frozen-basic` | BEGINNER | `PY_DATACLASSES` | `topic_py_dataclasses.ts` | 🟢 Completed | |
| `py-dc-post-init-basic` | BEGINNER | `PY_DATACLASSES` | `topic_py_dataclasses.ts` | 🟢 Completed | |
| `py-dc-frozen-order` | INTERMEDIATE | `PY_DATACLASSES` | `topic_py_dataclasses.ts` | 🟢 Completed | |
| `py-gap-dataclasses-2` | BEGINNER | `PY_DATACLASSES` | `topic_py_dataclasses.ts` | 🟢 Completed | |


### DATA_STRUCTURES (`topic_py_data_structures.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `py-ds-1` | BEGINNER | `PY_DATA_STRUCTURES` | `topic_py_data_structures.ts` | 🟢 Completed | |
| `py-ds-2` | INTERMEDIATE | `PY_DATA_STRUCTURES` | `topic_py_data_structures.ts` | 🟢 Completed | |
| `py-ds-3` | INTERMEDIATE | `PY_DATA_STRUCTURES` | `topic_py_data_structures.ts` | 🟢 Completed | |
| `py-ds-4` | INTERMEDIATE | `PY_DATA_STRUCTURES` | `topic_py_data_structures.ts` | 🟢 Completed | |
| `pe1-m3-18` | BEGINNER | `PY_DATA_STRUCTURES` | `topic_py_data_structures.ts` | 🟢 Completed | |
| `pe1-m3-20` | BEGINNER | `PY_DATA_STRUCTURES` | `topic_py_data_structures.ts` | 🟢 Completed | |
| `pe1-m3-22` | BEGINNER | `PY_DATA_STRUCTURES` | `topic_py_data_structures.ts` | 🟢 Completed | |
| `pe1-m3-24` | BEGINNER | `PY_DATA_STRUCTURES` | `topic_py_data_structures.ts` | 🟢 Completed | |
| `pe1-m4-8` | BEGINNER | `PY_DATA_STRUCTURES` | `topic_py_data_structures.ts` | 🟢 Completed | |
| `pe1-m4-11` | BEGINNER | `PY_DATA_STRUCTURES` | `topic_py_data_structures.ts` | 🟢 Completed | |
| `pe1-m4-12` | BEGINNER | `PY_DATA_STRUCTURES` | `topic_py_data_structures.ts` | 🟢 Completed | |


### DATETIME_PATHS (`topic_py_datetime_paths.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `py-datetime-2` | BEGINNER | `PY_DATETIME_PATHS` | `topic_py_datetime_paths.ts` | 🟢 Completed | |
| `py-datetime-3` | INTERMEDIATE | `PY_DATETIME_PATHS` | `topic_py_datetime_paths.ts` | 🟢 Completed | |
| `py-datetime-4` | BEGINNER | `PY_DATETIME_PATHS` | `topic_py_datetime_paths.ts` | 🟢 Completed | |
| `py-datetime-strftime` | BEGINNER | `PY_DATETIME_PATHS` | `topic_py_datetime_paths.ts` | 🟢 Completed | |
| `py-paths-1` | BEGINNER | `PY_DATETIME_PATHS` | `topic_py_datetime_paths.ts` | 🟢 Completed | |
| `py-paths-2` | BEGINNER | `PY_DATETIME_PATHS` | `topic_py_datetime_paths.ts` | 🟢 Completed | |


### DECORATORS (`topic_py_decorators.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `py-dec-3` | ADVANCED | `PY_DECORATORS` | `topic_py_decorators.ts` | 🟢 Completed | |
| `py-dec-4` | ADVANCED | `PY_DECORATORS` | `topic_py_decorators.ts` | 🟢 Completed | |
| `py-dec-1` | ADVANCED | `PY_DECORATORS` | `topic_py_decorators.ts` | 🟢 Completed | |
| `pcpp-dec-2` | INTERMEDIATE | `PY_DECORATORS` | `topic_py_decorators.ts` | 🟢 Completed | |
| `pcpp-dec-3` | INTERMEDIATE | `PY_DECORATORS` | `topic_py_decorators.ts` | 🟢 Completed | |
| `py-gap-decorators-2` | BEGINNER | `PY_DECORATORS` | `topic_py_decorators.ts` | 🟢 Completed | |


### ERROR_HANDLING (`topic_py_error_handling.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `py-err-3` | INTERMEDIATE | `PY_ERROR_HANDLING` | `topic_py_error_handling.ts` | 🟢 Completed | |
| `py-err-4` | INTERMEDIATE | `PY_ERROR_HANDLING` | `topic_py_error_handling.ts` | 🟢 Completed | |
| `py-err-6` | INTERMEDIATE | `PY_ERROR_HANDLING` | `topic_py_error_handling.ts` | 🟢 Completed | |
| `py-err-1` | INTERMEDIATE | `PY_ERROR_HANDLING` | `topic_py_error_handling.ts` | 🟢 Completed | |
| `py-err-2` | INTERMEDIATE | `PY_ERROR_HANDLING` | `topic_py_error_handling.ts` | 🟢 Completed | |
| `py-err-beg-5` | BEGINNER | `PY_ERROR_HANDLING` | `topic_py_error_handling.ts` | 🟢 Completed | |
| `pcpp-exc-2` | INTERMEDIATE | `PY_ERROR_HANDLING` | `topic_py_error_handling.ts` | 🟢 Completed | |
| `pcpp-exc-4` | INTERMEDIATE | `PY_ERROR_HANDLING` | `topic_py_error_handling.ts` | 🟢 Completed | |


### FILE_IO (`topic_py_file_io.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `py-io-1` | BEGINNER | `PY_FILE_IO` | `topic_py_file_io.ts` | 🟢 Completed | |
| `py-io-2` | BEGINNER | `PY_FILE_IO` | `topic_py_file_io.ts` | 🟢 Completed | |
| `py-io-3` | INTERMEDIATE | `PY_FILE_IO` | `topic_py_file_io.ts` | 🟢 Completed | |
| `py-io-4` | INTERMEDIATE | `PY_FILE_IO` | `topic_py_file_io.ts` | 🟢 Completed | |
| `py-io-5` | INTERMEDIATE | `PY_FILE_IO` | `topic_py_file_io.ts` | 🟢 Completed | |
| `py-io-6` | BEGINNER | `PY_FILE_IO` | `topic_py_file_io.ts` | 🟢 Completed | |
| `pe1-fileio-3` | BEGINNER | `PY_FILE_IO` | `topic_py_file_io.ts` | 🟢 Completed | |


### FIXTURES (`topic_py_fixtures.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `py-fix-simple-1` | BEGINNER | `PY_FIXTURES` | `topic_py_fixtures.ts` | 🟢 Completed | |
| `py-test-fixture-scope` | INTERMEDIATE | `PY_FIXTURES` | `topic_py_fixtures.ts` | 🟢 Completed | |
| `py-test-autouse` | INTERMEDIATE | `PY_FIXTURES` | `topic_py_fixtures.ts` | 🟢 Completed | |
| `py-fix-tmppath-1` | INTERMEDIATE | `PY_FIXTURES` | `topic_py_fixtures.ts` | 🟢 Completed | |
| `py-fix-capsys-1` | INTERMEDIATE | `PY_FIXTURES` | `topic_py_fixtures.ts` | 🟢 Completed | |
| `py-test-int-fixture-parametrize` | INTERMEDIATE | `PY_FIXTURES` | `topic_py_fixtures.ts` | 🟢 Completed | |
| `py-fix-param-fixture-1` | ADVANCED | `PY_FIXTURES` | `topic_py_fixtures.ts` | 🟢 Completed | |
| `py-adv-test-1` | ADVANCED | `PY_FIXTURES` | `topic_py_fixtures.ts` | 🟢 Completed | |


### FUNCTIONS (`topic_py_functions.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `py-fn-1` | INTERMEDIATE | `PY_FUNCTIONS` | `topic_py_functions.ts` | 🟢 Completed | |
| `py-fn-2` | INTERMEDIATE | `PY_FUNCTIONS` | `topic_py_functions.ts` | 🟢 Completed | |
| `py-fn-3` | INTERMEDIATE | `PY_FUNCTIONS` | `topic_py_functions.ts` | 🟢 Completed | |
| `pcpp-args-2` | INTERMEDIATE | `PY_FUNCTIONS` | `topic_py_functions.ts` | 🟢 Completed | |
| `pe1-m4-4` | BEGINNER | `PY_FUNCTIONS` | `topic_py_functions.ts` | 🟢 Completed | |
| `pe1-closure-2` | BEGINNER | `PY_FUNCTIONS` | `topic_py_functions.ts` | 🟢 Completed | |
| `py-gap-functions-2` | BEGINNER | `PY_FUNCTIONS` | `topic_py_functions.ts` | 🟢 Completed | |


### FUNCTOOLS (`topic_py_functools.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `py-functools-2` | BEGINNER | `PY_FUNCTOOLS` | `topic_py_functools.ts` | 🟢 Completed | |
| `py-functools-3` | BEGINNER | `PY_FUNCTOOLS` | `topic_py_functools.ts` | 🟢 Completed | |
| `py-functools-4` | BEGINNER | `PY_FUNCTOOLS` | `topic_py_functools.ts` | 🟢 Completed | |
| `py-functools-5` | BEGINNER | `PY_FUNCTOOLS` | `topic_py_functools.ts` | 🟢 Completed | |
| `py-functools-6` | BEGINNER | `PY_FUNCTOOLS` | `topic_py_functools.ts` | 🟢 Completed | |


### FUTURES (`topic_py_futures.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `py-concurrency-2` | INTERMEDIATE | `PY_FUTURES` | `topic_py_futures.ts` | 🟢 Completed | |
| `py-concurrency-3` | ADVANCED | `PY_FUTURES` | `topic_py_futures.ts` | 🟢 Completed | |


### GENERATORS (`topic_py_generators.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `pe1-gen-2` | BEGINNER | `PY_GENERATORS` | `topic_py_generators.ts` | 🟢 Completed | |
| `py-gen-pipeline` | INTERMEDIATE | `PY_GENERATORS` | `topic_py_generators.ts` | 🟢 Completed | |
| `py-gen-infinite-islice` | INTERMEDIATE | `PY_GENERATORS` | `topic_py_generators.ts` | 🟢 Completed | |
| `py-gen-yield-from` | ADVANCED | `PY_GENERATORS` | `topic_py_generators.ts` | 🟢 Completed | |
| `py-gen-send-coroutine` | ADVANCED | `PY_GENERATORS` | `topic_py_generators.ts` | 🟢 Completed | |


### HTTP (`topic_py_http.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `py-http-2` | BEGINNER | `PY_HTTP` | `topic_py_http.ts` | 🟢 Completed | |
| `py-http-3` | BEGINNER | `PY_HTTP` | `topic_py_http.ts` | 🟢 Completed | |
| `py-http-4` | BEGINNER | `PY_HTTP` | `topic_py_http.ts` | 🟢 Completed | |
| `py-http-5` | INTERMEDIATE | `PY_HTTP` | `topic_py_http.ts` | 🟢 Completed | |
| `py-http-7` | BEGINNER | `PY_HTTP` | `topic_py_http.ts` | 🟢 Completed | |
| `py-http-8` | BEGINNER | `PY_HTTP` | `topic_py_http.ts` | 🟢 Completed | |
| `py-http-9` | BEGINNER | `PY_HTTP` | `topic_py_http.ts` | 🟢 Completed | |
| `py-http-10` | BEGINNER | `PY_HTTP` | `topic_py_http.ts` | 🟢 Completed | |
| `py-http-12` | BEGINNER | `PY_HTTP` | `topic_py_http.ts` | 🟢 Completed | |
| `py-http-13` | INTERMEDIATE | `PY_HTTP` | `topic_py_http.ts` | 🟢 Completed | |
| `py-http-16` | ADVANCED | `PY_HTTP` | `topic_py_http.ts` | 🟢 Completed | |


### ITERTOOLS (`topic_py_itertools.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `py-adv-iter-1` | ADVANCED | `PY_ITERTOOLS` | `topic_py_itertools.ts` | 🟢 Completed | |
| `py-adv-iter-2` | INTERMEDIATE | `PY_ITERTOOLS` | `topic_py_itertools.ts` | 🟢 Completed | |
| `py-iter-groupby` | BEGINNER | `PY_ITERTOOLS` | `topic_py_itertools.ts` | 🟢 Completed | |
| `py-iter-takewhile-dropwhile` | BEGINNER | `PY_ITERTOOLS` | `topic_py_itertools.ts` | 🟢 Completed | |
| `py-iter-starmap` | BEGINNER | `PY_ITERTOOLS` | `topic_py_itertools.ts` | 🟢 Completed | |
| `py-iter-pairwise` | BEGINNER | `PY_ITERTOOLS` | `topic_py_itertools.ts` | 🟢 Completed | |
| `py-iter-int-product-islice` | INTERMEDIATE | `PY_ITERTOOLS` | `topic_py_itertools.ts` | 🟢 Completed | |


### LOGGING (`topic_py_logging.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `py-logging-2` | BEGINNER | `PY_LOGGING` | `topic_py_logging.ts` | 🟢 Completed | |
| `py-logging-3` | BEGINNER | `PY_LOGGING` | `topic_py_logging.ts` | 🟢 Completed | |
| `py-logging-4` | BEGINNER | `PY_LOGGING` | `topic_py_logging.ts` | 🟢 Completed | |
| `py-logging-5` | BEGINNER | `PY_LOGGING` | `topic_py_logging.ts` | 🟢 Completed | |


### MAGIC_METHODS (`topic_py_magic_methods.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `pcpp-magic-2` | INTERMEDIATE | `PY_MAGIC_METHODS` | `topic_py_magic_methods.ts` | 🟢 Completed | |
| `pcpp-magic-3a` | INTERMEDIATE | `PY_MAGIC_METHODS` | `topic_py_magic_methods.ts` | 🟢 Completed | |
| `pcpp-magic-3b` | INTERMEDIATE | `PY_MAGIC_METHODS` | `topic_py_magic_methods.ts` | 🟢 Completed | |
| `py-adv-magic-1` | ADVANCED | `PY_MAGIC_METHODS` | `topic_py_magic_methods.ts` | 🟢 Completed | |
| `py-adv-money-add` | ADVANCED | `PY_MAGIC_METHODS` | `topic_py_magic_methods.ts` | 🟢 Completed | |
| `py-adv-magic-2` | ADVANCED | `PY_MAGIC_METHODS` | `topic_py_magic_methods.ts` | 🟢 Completed | |
| `py-magic-str-vs-repr` | BEGINNER | `PY_MAGIC_METHODS` | `topic_py_magic_methods.ts` | 🟢 Completed | |
| `py-magic-eq-hash` | BEGINNER | `PY_MAGIC_METHODS` | `topic_py_magic_methods.ts` | 🟢 Completed | |
| `py-magic-container-protocol` | BEGINNER | `PY_MAGIC_METHODS` | `topic_py_magic_methods.ts` | 🟢 Completed | |
| `py-magic-add-iadd` | BEGINNER | `PY_MAGIC_METHODS` | `topic_py_magic_methods.ts` | 🟢 Completed | |
| `py-magic-call` | BEGINNER | `PY_MAGIC_METHODS` | `topic_py_magic_methods.ts` | 🟢 Completed | |
| `py-magic-iter` | BEGINNER | `PY_MAGIC_METHODS` | `topic_py_magic_methods.ts` | 🟢 Completed | |
| `py-gap-magic-2` | BEGINNER | `PY_MAGIC_METHODS` | `topic_py_magic_methods.ts` | 🟢 Completed | |


### METACLASSES (`topic_py_metaclasses.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `pcpp-meta-2` | ADVANCED | `PY_METACLASSES` | `topic_py_metaclasses.ts` | 🟢 Completed | |
| `pcpp-meta-4` | ADVANCED | `PY_METACLASSES` | `topic_py_metaclasses.ts` | 🟢 Completed | |
| `pcpp-meta-6` | INTERMEDIATE | `PY_METACLASSES` | `topic_py_metaclasses.ts` | 🟢 Completed | |


### MOCKING (`topic_py_mocking.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `py-mock-3` | BEGINNER | `PY_MOCKING` | `topic_py_mocking.ts` | 🟢 Completed | |
| `py-mock-6` | BEGINNER | `PY_MOCKING` | `topic_py_mocking.ts` | 🟢 Completed | |
| `py-mock-2` | INTERMEDIATE | `PY_MOCKING` | `topic_py_mocking.ts` | 🟢 Completed | |
| `py-mock-7` | INTERMEDIATE | `PY_MOCKING` | `topic_py_mocking.ts` | 🟢 Completed | |
| `py-mock-5` | INTERMEDIATE | `PY_MOCKING` | `topic_py_mocking.ts` | 🟢 Completed | |
| `py-mock-8` | INTERMEDIATE | `PY_MOCKING` | `topic_py_mocking.ts` | 🟢 Completed | |
| `py-mock-4` | ADVANCED | `PY_MOCKING` | `topic_py_mocking.ts` | 🟢 Completed | |
| `py-mock-9` | ADVANCED | `PY_MOCKING` | `topic_py_mocking.ts` | 🟢 Completed | |


### MODERN (`topic_py_modern.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `be-infra-modern-2` | INTERMEDIATE | `PY_MODERN` | `topic_py_modern.ts` | 🟢 Completed | |


### MODULES (`topic_py_modules.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `pcpp-pickle-2` | INTERMEDIATE | `PY_MODULES` | `topic_py_modules.ts` | 🟢 Completed | |
| `pcpp-shelve-2` | INTERMEDIATE | `PY_MODULES` | `topic_py_modules.ts` | 🟢 Completed | |
| `pe1-modules-2` | BEGINNER | `PY_MODULES` | `topic_py_modules.ts` | 🟢 Completed | |
| `pe1-modules-3` | BEGINNER | `PY_MODULES` | `topic_py_modules.ts` | 🟢 Completed | |


### OOP (`topic_py_oop.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `py-oop-beg-3` | BEGINNER | `PY_OOP` | `topic_py_oop.ts` | 🟢 Completed | |
| `pcpp-oop-2` | BEGINNER | `PY_OOP` | `topic_py_oop.ts` | 🟢 Completed | |
| `py-gap-oop-2` | BEGINNER | `PY_OOP` | `topic_py_oop.ts` | 🟢 Completed | |
| `py-oop-1` | INTERMEDIATE | `PY_OOP` | `topic_py_oop.ts` | 🟢 Completed | |
| `py-oop-2` | INTERMEDIATE | `PY_OOP` | `topic_py_oop.ts` | 🟢 Completed | |
| `pcpp-inherit-2` | INTERMEDIATE | `PY_OOP` | `topic_py_oop.ts` | 🟢 Completed | |
| `pcpp-inherit-4` | INTERMEDIATE | `PY_OOP` | `topic_py_oop.ts` | 🟢 Completed | |
| `pcpp-methods-2` | INTERMEDIATE | `PY_OOP` | `topic_py_oop.ts` | 🟢 Completed | |


### OOP_ADVANCED (`topic_py_oop_advanced.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `pcpp-encap-2` | INTERMEDIATE | `PY_OOP_ADVANCED` | `topic_py_oop_advanced.ts` | 🟢 Completed | |
| `pcpp-compose-2` | INTERMEDIATE | `PY_OOP_ADVANCED` | `topic_py_oop_advanced.ts` | 🟢 Completed | |
| `pcpp-builtin-2` | INTERMEDIATE | `PY_OOP_ADVANCED` | `topic_py_oop_advanced.ts` | 🟢 Completed | |
| `pcpp-abc-2` | INTERMEDIATE | `PY_OOP_ADVANCED` | `topic_py_oop_advanced.ts` | 🟢 Completed | |
| `pcpp-copy-2` | INTERMEDIATE | `PY_OOP_ADVANCED` | `topic_py_oop_advanced.ts` | 🟢 Completed | |
| `pcpp-prop-2` | INTERMEDIATE | `PY_OOP_ADVANCED` | `topic_py_oop_advanced.ts` | 🟢 Completed | |
| `py-oop-3` | ADVANCED | `PY_OOP_ADVANCED` | `topic_py_oop_advanced.ts` | 🟢 Completed | |
| `py-dec-5` | INTERMEDIATE | `PY_OOP_ADVANCED` | `topic_py_oop_advanced.ts` | 🟢 Completed | |


### PYDANTIC (`topic_py_pydantic.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `py-pydantic-2` | BEGINNER | `PY_PYDANTIC` | `topic_py_pydantic.ts` | 🟢 Completed | |
| `py-pydantic-3` | BEGINNER | `PY_PYDANTIC` | `topic_py_pydantic.ts` | 🟢 Completed | |
| `py-pydantic-4` | INTERMEDIATE | `PY_PYDANTIC` | `topic_py_pydantic.ts` | 🟢 Completed | |
| `py-pydantic-5` | INTERMEDIATE | `PY_PYDANTIC` | `topic_py_pydantic.ts` | 🟢 Completed | |
| `py-pydantic-6` | BEGINNER | `PY_PYDANTIC` | `topic_py_pydantic.ts` | 🟢 Completed | |


### REGEX (`topic_py_regex.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `py-adv-regex-1` | ADVANCED | `PY_REGEX` | `topic_py_regex.ts` | 🟢 Completed | |
| `py-regex-fullmatch-email` | BEGINNER | `PY_REGEX` | `topic_py_regex.ts` | 🟢 Completed | |
| `py-regex-named-groups` | BEGINNER | `PY_REGEX` | `topic_py_regex.ts` | 🟢 Completed | |
| `py-regex-sub-redact` | BEGINNER | `PY_REGEX` | `topic_py_regex.ts` | 🟢 Completed | |
| `py-regex-split` | BEGINNER | `PY_REGEX` | `topic_py_regex.ts` | 🟢 Completed | |
| `py-regex-compile-flags` | BEGINNER | `PY_REGEX` | `topic_py_regex.ts` | 🟢 Completed | |
| `py-regex-finditer` | BEGINNER | `PY_REGEX` | `topic_py_regex.ts` | 🟢 Completed | |
| `py-regex-backreference` | BEGINNER | `PY_REGEX` | `topic_py_regex.ts` | 🟢 Completed | |
| `py-regex-parse-keyvalue` | INTERMEDIATE | `PY_REGEX` | `topic_py_regex.ts` | 🟢 Completed | |
| `py-gap-regex-2` | BEGINNER | `PY_REGEX` | `topic_py_regex.ts` | 🟢 Completed | |


### SECURITY (`topic_py_security.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `py-security-2` | BEGINNER | `PY_SECURITY` | `topic_py_security.ts` | 🟢 Completed | |
| `py-security-3` | BEGINNER | `PY_SECURITY` | `topic_py_security.ts` | 🟢 Completed | |
| `py-security-4` | INTERMEDIATE | `PY_SECURITY` | `topic_py_security.ts` | 🟢 Completed | |
| `py-security-5` | BEGINNER | `PY_SECURITY` | `topic_py_security.ts` | 🟢 Completed | |
| `py-security-6` | BEGINNER | `PY_SECURITY` | `topic_py_security.ts` | 🟢 Completed | |


### SERIALIZATION (`topic_py_serialization.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `py-ser-json-dump-file` | BEGINNER | `PY_SERIALIZATION` | `topic_py_serialization.ts` | 🟢 Completed | |
| `py-ser-object-hook` | BEGINNER | `PY_SERIALIZATION` | `topic_py_serialization.ts` | 🟢 Completed | |
| `py-ser-pickle` | BEGINNER | `PY_SERIALIZATION` | `topic_py_serialization.ts` | 🟢 Completed | |
| `py-ser-dataclass-json` | INTERMEDIATE | `PY_SERIALIZATION` | `topic_py_serialization.ts` | 🟢 Completed | |
| `py-json-2` | BEGINNER | `PY_SERIALIZATION` | `topic_py_serialization.ts` | 🟢 Completed | |
| `py-json-3` | BEGINNER | `PY_SERIALIZATION` | `topic_py_serialization.ts` | 🟢 Completed | |
| `py-json-4` | INTERMEDIATE | `PY_SERIALIZATION` | `topic_py_serialization.ts` | 🟢 Completed | |


### SHELL_OS (`topic_py_shell_os.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `py-shell-2` | BEGINNER | `PY_SHELL_OS` | `topic_py_shell_os.ts` | 🟢 Completed | |
| `py-shell-3` | INTERMEDIATE | `PY_SHELL_OS` | `topic_py_shell_os.ts` | 🟢 Completed | |
| `py-shell-4` | BEGINNER | `PY_SHELL_OS` | `topic_py_shell_os.ts` | 🟢 Completed | |
| `py-shell-5` | INTERMEDIATE | `PY_SHELL_OS` | `topic_py_shell_os.ts` | 🟢 Completed | |
| `py-shell-6` | BEGINNER | `PY_SHELL_OS` | `topic_py_shell_os.ts` | 🟢 Completed | |


### TESTING_BASICS (`topic_py_testing_basics.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `py-gap-testing-2` | BEGINNER | `PY_TESTING_BASICS` | `topic_py_testing_basics.ts` | 🟢 Completed | |
| `be-test-1` | INTERMEDIATE | `PY_TESTING_BASICS` | `topic_py_testing_basics.ts` | 🟢 Completed | |
| `py-gap-testing-3` | INTERMEDIATE | `PY_TESTING_BASICS` | `topic_py_testing_basics.ts` | 🟢 Completed | |
| `py-test-parametrize-ids` | INTERMEDIATE | `PY_TESTING_BASICS` | `topic_py_testing_basics.ts` | 🟢 Completed | |
| `py-ptest-markers-1` | INTERMEDIATE | `PY_TESTING_BASICS` | `topic_py_testing_basics.ts` | 🟢 Completed | |
| `py-ptest-xfail-1` | ADVANCED | `PY_TESTING_BASICS` | `topic_py_testing_basics.ts` | 🟢 Completed | |


### THREADING (`topic_py_threading.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `py-concurrency-4` | BEGINNER | `PY_THREADING` | `topic_py_threading.ts` | 🟢 Completed | |
| `py-concurrency-5` | BEGINNER | `PY_THREADING` | `topic_py_threading.ts` | 🟢 Completed | |


### TYPE_HINTS (`topic_py_type_hints.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `py-gap-typehints-2` | BEGINNER | `PY_TYPE_HINTS` | `topic_py_type_hints.ts` | 🟢 Completed | |


## SQL & T-SQL Data Engineering

### AGGREGATION (`topic_tsql_aggregation.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tsql-agg-1` | INTERMEDIATE | `TSQL_AGGREGATION` | `topic_tsql_aggregation.ts` | 🟢 Completed | fixed legacy array-shape tieredHints -> correct object shape |


### ANTIPATTERNS (`topic_tsql_antipatterns.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tsql-anti-1` | INTERMEDIATE | `TSQL_ANTIPATTERNS` | `topic_tsql_antipatterns.ts` | 🟢 Completed | fixed legacy array-shape + strengthened skeleton (was HIGH 0.92, now clean) |


### COLUMNSTORE (`topic_tsql_columnstore.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tsql-col-1` | INTERMEDIATE | `TSQL_COLUMNSTORE` | `topic_tsql_columnstore.ts` | 🟢 Completed | fixed legacy array-shape tieredHints -> correct object shape |


### CONSTRAINTS (`topic_tsql_constraints.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tsql-constraints-1` | ADVANCED | `TSQL_CONSTRAINTS` | `topic_tsql_constraints.ts` | 🟢 Completed | fixed legacy array-shape tieredHints -> correct object shape (MEDIUM retention 0.75) |


### CONTROL_FLOW (`topic_tsql_control_flow.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tsql-flow-1` | INTERMEDIATE | `TSQL_CONTROL_FLOW` | `topic_tsql_control_flow.ts` | 🟢 Completed | fixed legacy array-shape + reworked skeleton (was HIGH 0.85, now 0.56) |


### DATE_FUNCTIONS (`topic_tsql_date_functions.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tsql-dt-1` | INTERMEDIATE | `TSQL_DATE_FUNCTIONS` | `topic_tsql_date_functions.ts` | 🟢 Completed | fixed legacy array-shape (MEDIUM 0.68) |
| `tsql-dt-2` | INTERMEDIATE | `TSQL_DATE_FUNCTIONS` | `topic_tsql_date_functions.ts` | 🟢 Completed | fixed legacy array-shape (MEDIUM 0.80) |
| `tsql-dt-3` | ADVANCED | `TSQL_DATE_FUNCTIONS` | `topic_tsql_date_functions.ts` | 🟢 Completed | fixed legacy array-shape (MEDIUM 0.71) |


### DDL_TABLES (`topic_tsql_ddl_tables.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tsql-ddl-create-1` | BEGINNER | `TSQL_DDL_TABLES` | `topic_tsql_ddl_tables.ts` | 🟢 Completed | fixed legacy array-shape (MEDIUM 0.73) |
| `tsql-ddl-selectinto-1` | INTERMEDIATE | `TSQL_DDL_TABLES` | `topic_tsql_ddl_tables.ts` | 🟢 Completed | fixed legacy array-shape + strengthened (was HIGH 0.89, now clean) |


### DEDUP (`topic_tsql_dedup.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tsql-dedup-1` | ADVANCED | `TSQL_DEDUP` | `topic_tsql_dedup.ts` | 🟢 Completed | fixed legacy array-shape (MEDIUM 0.75) |


### DML (`topic_tsql_dml.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tsql-dml-1` | INTERMEDIATE | `TSQL_DML` | `topic_tsql_dml.ts` | 🟢 Completed | fixed legacy array-shape (MEDIUM 0.72) |
| `tsql-dml-2` | INTERMEDIATE | `TSQL_DML` | `topic_tsql_dml.ts` | 🟢 Completed | fixed legacy array-shape (MEDIUM 0.74) |
| `tsql-dml-3` | ADVANCED | `TSQL_DML` | `topic_tsql_dml.ts` | 🟢 Completed | fixed legacy array-shape (was HIGH 0.90, now MEDIUM 0.72) |
| `tsql-dml-4` | ADVANCED | `TSQL_DML` | `topic_tsql_dml.ts` | 🟢 Completed | fixed legacy array-shape (was HIGH 0.89, now clean) |


### ERROR_HANDLING (`topic_tsql_error_handling.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tsql-err-1` | ADVANCED | `TSQL_ERROR_HANDLING` | `topic_tsql_error_handling.ts` | 🟢 Completed | fixed legacy array-shape (MEDIUM 0.78) |


### ETL_PROC (`topic_tsql_etl_proc.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tsql-etlproc-1` | ADVANCED | `TSQL_ETL_PROC` | `topic_tsql_etl_proc.ts` | 🟢 Completed | fixed legacy array-shape (MEDIUM 0.80) |
| `tsql-etlproc-2` | ADVANCED | `TSQL_ETL_PROC` | `topic_tsql_etl_proc.ts` | 🟢 Completed | fixed legacy array-shape (clean) |
| `tsql-etlproc-3` | ADVANCED | `TSQL_ETL_PROC` | `topic_tsql_etl_proc.ts` | 🟢 Completed | fixed legacy array-shape (MEDIUM 0.74) |


### FACTS_DIMS (`topic_tsql_facts_dims.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tsql-facts-1` | INTERMEDIATE | `TSQL_FACTS_DIMS` | `topic_tsql_facts_dims.ts` | 🟢 Completed | fixed legacy array-shape (MEDIUM 0.74) |


### FILTERING (`topic_tsql_filtering.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tsql-filter-1` | INTERMEDIATE | `TSQL_FILTERING` | `topic_tsql_filtering.ts` | 🟢 Completed | fixed legacy array-shape + strengthened (was HIGH 0.81, now clean) |


### GROUPING_SETS (`topic_tsql_grouping_sets.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tsql-gs-1` | INTERMEDIATE | `TSQL_GROUPING_SETS` | `topic_tsql_grouping_sets.ts` | 🟢 Completed | fixed legacy array-shape (was HIGH 0.86, now MEDIUM 0.61) |
| `tsql-gs-2` | ADVANCED | `TSQL_GROUPING_SETS` | `topic_tsql_grouping_sets.ts` | 🟢 Completed | fixed legacy array-shape (was HIGH 0.83, now MEDIUM 0.56) |


### INCREMENTAL (`topic_tsql_incremental.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tsql-incr-1` | INTERMEDIATE | `TSQL_INCREMENTAL` | `topic_tsql_incremental.ts` | 🟢 Completed | fixed legacy array-shape (clean) |


### INDEXES (`topic_tsql_indexes.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tsql-idx-1` | INTERMEDIATE | `TSQL_INDEXES` | `topic_tsql_indexes.ts` | 🟢 Completed | fixed legacy array-shape (clean) |


### INSERT (`topic_tsql_insert.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tsql-insert-1` | INTERMEDIATE | `TSQL_INSERT` | `topic_tsql_insert.ts` | 🟢 Completed | fixed legacy array-shape (clean) |


### JOINS (`topic_tsql_joins.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tsql-joins-1` | INTERMEDIATE | `TSQL_JOINS` | `topic_tsql_joins.ts` | 🟢 Completed | fixed legacy array-shape (clean) |
| `tsql-joins-2` | ADVANCED | `TSQL_JOINS` | `topic_tsql_joins.ts` | 🟢 Completed | fixed legacy array-shape (clean) |
| `tsql-joins-3` | ADVANCED | `TSQL_JOINS` | `topic_tsql_joins.ts` | 🟢 Completed | fixed legacy array-shape (clean) |


### LAG_LEAD (`topic_tsql_lag_lead.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tsql-laglead-1` | ADVANCED | `TSQL_LAG_LEAD` | `topic_tsql_lag_lead.ts` | 🟢 Completed | fixed legacy array-shape (MEDIUM 0.74) |


### MERGE (`topic_tsql_merge.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tsql-merge-1` | ADVANCED | `TSQL_MERGE` | `topic_tsql_merge.ts` | 🟢 Completed | fixed legacy array-shape (clean) |


### PARTITIONING (`topic_tsql_partitioning.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tsql-part-1` | ADVANCED | `TSQL_PARTITIONING` | `topic_tsql_partitioning.ts` | 🟢 Completed | fixed legacy array-shape (clean) |


### PIVOT (`topic_tsql_pivot.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tsql-pivot-1` | INTERMEDIATE | `TSQL_PIVOT` | `topic_tsql_pivot.ts` | 🟢 Completed | fixed legacy array-shape (clean) |


### PROCEDURES (`topic_tsql_procedures.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tsql-proc-1` | INTERMEDIATE | `TSQL_PROCEDURES` | `topic_tsql_procedures.ts` | 🟢 Completed | fixed legacy array-shape (MEDIUM 0.78) |
| `tsql-proc-2` | ADVANCED | `TSQL_PROCEDURES` | `topic_tsql_procedures.ts` | 🟢 Completed | fixed legacy array-shape (was HIGH 0.80, now MEDIUM 0.73) |


### QUALITY (`topic_tsql_quality.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tsql-quality-1` | INTERMEDIATE | `TSQL_QUALITY` | `topic_tsql_quality.ts` | 🟢 Completed | fixed legacy array-shape (MEDIUM 0.79) |
| `tsql-quality-2` | INTERMEDIATE | `TSQL_QUALITY` | `topic_tsql_quality.ts` | 🟢 Completed | fixed legacy array-shape (MEDIUM 0.68) |


### SCD (`topic_tsql_scd.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tsql-scd-1` | ADVANCED | `TSQL_SCD` | `topic_tsql_scd.ts` | 🟢 Completed | fixed legacy array-shape (MEDIUM 0.78) |
| `tsql-scd-2` | ADVANCED | `TSQL_SCD` | `topic_tsql_scd.ts` | 🟢 Completed | fixed legacy array-shape (was HIGH 0.89, now MEDIUM 0.80) |


### SELECT (`topic_tsql_select.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tsql-select-1` | BEGINNER | `TSQL_SELECT` | `topic_tsql_select.ts` | 🟢 Completed | fixed legacy array-shape (was HIGH 0.81, now MEDIUM 0.72) |
| `tsql-select-2` | INTERMEDIATE | `TSQL_SELECT` | `topic_tsql_select.ts` | 🟢 Completed | fixed legacy array-shape (MEDIUM 0.66) |


### SET_OPS (`topic_tsql_set_ops.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tsql-setops-1` | INTERMEDIATE | `TSQL_SET_OPS` | `topic_tsql_set_ops.ts` | 🟢 Completed | fixed legacy array-shape (MEDIUM 0.72) |


### STAR_SCHEMA (`topic_tsql_star_schema.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tsql-star-1` | INTERMEDIATE | `TSQL_STAR_SCHEMA` | `topic_tsql_star_schema.ts` | 🟢 Completed | fixed legacy array-shape (MEDIUM 0.77); NOTE: solution doesn't match prompt (FactSales/DimCustomer vs FactResellerSales/DimDate) - needs separate content fix |


### STRING_FUNCTIONS (`topic_tsql_string_functions.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tsql-str-1` | INTERMEDIATE | `TSQL_STRING_FUNCTIONS` | `topic_tsql_string_functions.ts` | 🟢 Completed | fixed legacy array-shape (clean) |
| `tsql-str-2` | INTERMEDIATE | `TSQL_STRING_FUNCTIONS` | `topic_tsql_string_functions.ts` | 🟢 Completed | fixed legacy array-shape (MEDIUM 0.69) |
| `tsql-str-3` | ADVANCED | `TSQL_STRING_FUNCTIONS` | `topic_tsql_string_functions.ts` | 🟢 Completed | fixed legacy array-shape (was HIGH 0.81, now MEDIUM 0.70) |


### SUBQUERIES_CTE (`topic_tsql_subqueries_cte.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tsql-subq-1` | INTERMEDIATE | `TSQL_SUBQUERIES_CTE` | `topic_tsql_subqueries_cte.ts` | 🟢 Completed | fixed legacy array-shape (clean) |
| `tsql-subq-2` | ADVANCED | `TSQL_SUBQUERIES_CTE` | `topic_tsql_subqueries_cte.ts` | 🟢 Completed | fixed legacy array-shape (MEDIUM 0.66) |


### SURROGATE_KEYS (`topic_tsql_surrogate_keys.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tsql-surr-1` | INTERMEDIATE | `TSQL_SURROGATE_KEYS` | `topic_tsql_surrogate_keys.ts` | 🟢 Completed | added hints (was HIGH 0.84, now MEDIUM 0.78) |


### SYNAPSE_FABRIC (`topic_tsql_synapse_fabric.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tsql-syn-1` | ADVANCED | `TSQL_SYNAPSE_FABRIC` | `topic_tsql_synapse_fabric.ts` | 🟢 Completed | added hints (MEDIUM 0.76) |


### TRANSACTIONS (`topic_tsql_transactions.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tsql-tran-1` | INTERMEDIATE | `TSQL_TRANSACTIONS` | `topic_tsql_transactions.ts` | 🟢 Completed | added hints (MEDIUM 0.79) |


### VIEWS (`topic_tsql_views.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tsql-views-1` | INTERMEDIATE | `TSQL_VIEWS` | `topic_tsql_views.ts` | 🟢 Completed | added hints (MEDIUM 0.74) |


### WINDOWS (`topic_tsql_windows.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tsql-windows-1` | INTERMEDIATE | `TSQL_WINDOWS` | `topic_tsql_windows.ts` | 🟢 Completed | added hints (was HIGH 0.80, now clean) |


### WINDOW_FRAMES (`topic_tsql_window_frames.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tsql-frames-1` | INTERMEDIATE | `TSQL_WINDOW_FRAMES` | `topic_tsql_window_frames.ts` | 🟢 Completed | added hints (clean) |
| `tsql-frames-2` | ADVANCED | `TSQL_WINDOW_FRAMES` | `topic_tsql_window_frames.ts` | 🟢 Completed | added hints (clean) |


## Web Development, React & Next.js

### a11yShadcnQuestions (`a11yShadcnQuestions.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `a11y-modal-1` | ADVANCED | `ACCESSIBILITY` | `a11yShadcnQuestions.ts` | 🟢 Completed | already correct, clean |
| `a11y-skip-nav-1` | BEGINNER | `ACCESSIBILITY` | `a11yShadcnQuestions.ts` | 🟢 Completed | fixed skeleton/solution structural mismatch (was HIGH 2.68, now MEDIUM 0.70) |
| `a11y-dropdown-1` | ADVANCED | `ACCESSIBILITY` | `a11yShadcnQuestions.ts` | 🟢 Completed | already correct, clean |
| `a11y-aria-live-coding-1` | INTERMEDIATE | `ACCESSIBILITY` | `a11yShadcnQuestions.ts` | 🟢 Completed | added blank (was HIGH 1.00, now MEDIUM 0.71) |
| `a11y-tabindex-coding-1` | INTERMEDIATE | `ACCESSIBILITY` | `a11yShadcnQuestions.ts` | 🟢 Completed | tightened (was HIGH 0.98, now MEDIUM 0.77) |
| `shadcn-cn-utility-1` | BEGINNER | `NEXT_SHADCN` | `a11yShadcnQuestions.ts` | 🟢 Completed | added blank (was HIGH 0.91, now clean) |
| `shadcn-dark-mode-1` | INTERMEDIATE | `NEXT_SHADCN` | `a11yShadcnQuestions.ts` | 🟢 Completed | condensed skeleton (was HIGH 1.04, now clean) |
| `shadcn-cva-coding-1` | INTERMEDIATE | `NEXT_SHADCN` | `a11yShadcnQuestions.ts` | 🟢 Completed | fixed (was HIGH 0.80, now MEDIUM 0.79) |
| `shadcn-aschild-coding-1` | INTERMEDIATE | `NEXT_SHADCN` | `a11yShadcnQuestions.ts` | 🟢 Completed | already correct (MEDIUM 0.70) |
| `shadcn-theming-coding-1` | INTERMEDIATE | `NEXT_SHADCN` | `a11yShadcnQuestions.ts` | 🟢 Completed | restructured (was HIGH 1.62 due to checker quirk on `--` CSS vars, now clean 0.54) |
| `shadcn-variantprops-coding-1` | ADVANCED | `NEXT_SHADCN` | `a11yShadcnQuestions.ts` | 🟢 Completed | added blank, clean |


### advancedNextQuestions (`advancedNextQuestions.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `next-url-state-1` | INTERMEDIATE | `NEXT_URL_STATE` | `advancedNextQuestions.ts` | 🟢 Completed | added blanks (was HIGH 0.80, now MEDIUM 0.77) |
| `next-url-state-2` | ADVANCED | `NEXT_URL_STATE` | `advancedNextQuestions.ts` | 🟢 Completed | already correct, clean |
| `next-url-state-6` | INTERMEDIATE | `NEXT_URL_STATE` | `advancedNextQuestions.ts` | 🟢 Completed | added blanks, MEDIUM 0.73 |
| `next-error-handling-1` | BEGINNER | `NEXT_ERROR_HANDLING` | `advancedNextQuestions.ts` | 🟢 Completed | already correct, clean |
| `next-error-handling-2` | ADVANCED | `NEXT_ERROR_HANDLING` | `advancedNextQuestions.ts` | 🟢 Completed | already correct, clean |
| `next-error-handling-6` | INTERMEDIATE | `NEXT_ERROR_HANDLING` | `advancedNextQuestions.ts` | 🟢 Completed | added 3rd blank, clean |
| `next-auth-deep-1` | ADVANCED | `NEXT_AUTH_DEEP` | `advancedNextQuestions.ts` | 🟢 Completed | added blanks, clean |
| `next-auth-deep-2` | BEGINNER | `NEXT_AUTH_DEEP` | `advancedNextQuestions.ts` | 🟢 Completed | already correct, clean |
| `next-auth-deep-6` | INTERMEDIATE | `NEXT_AUTH_DEEP` | `advancedNextQuestions.ts` | 🟢 Completed | replaced duplicate blanks with distinct ones, clean |


### formsTestingQuestions (`formsTestingQuestions.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `next-forms-1` | BEGINNER | `NEXT_FORMS_VALIDATION` | `formsTestingQuestions.ts` | 🟢 Completed | already correct, clean |
| `next-forms-2` | BEGINNER | `NEXT_FORMS_VALIDATION` | `formsTestingQuestions.ts` | 🟢 Completed | already correct, clean |
| `next-forms-3` | INTERMEDIATE | `NEXT_FORMS_VALIDATION` | `formsTestingQuestions.ts` | 🟢 Completed | already correct, clean |
| `next-forms-6` | ADVANCED | `NEXT_FORMS_VALIDATION` | `formsTestingQuestions.ts` | 🟢 Completed | added blank, MEDIUM 0.65 |
| `next-forms-10` | INTERMEDIATE | `NEXT_FORMS_VALIDATION` | `formsTestingQuestions.ts` | 🟢 Completed | expanded blanks 1->5, MEDIUM 0.78 |
| `next-testing-1` | BEGINNER | `NEXT_TESTING` | `formsTestingQuestions.ts` | 🟢 Completed | rewrote skeleton to cover real assertions, clean |
| `next-testing-2` | ADVANCED | `NEXT_TESTING` | `formsTestingQuestions.ts` | 🟢 Completed | added mock-factory blank, clean |
| `next-testing-5` | BEGINNER | `NEXT_TESTING` | `formsTestingQuestions.ts` | 🟢 Completed | fixed hint/solution mismatch (hints referenced wrong component), MEDIUM 0.68 |
| `next-testing-7` | ADVANCED | `NEXT_TESTING` | `formsTestingQuestions.ts` | 🟢 Completed | added blanks, clean |
| `next-testing-9` | BEGINNER | `NEXT_TESTING` | `formsTestingQuestions.ts` | 🟢 Completed | added coverage for both sub-tests, clean |
| `next-testing-11` | ADVANCED | `NEXT_TESTING` | `formsTestingQuestions.ts` | 🟢 Completed | already correct, clean |
| `next-testing-15` | ADVANCED | `NEXT_TESTING` | `formsTestingQuestions.ts` | 🟢 Completed | already correct, clean |


### nextjsQuestions (`nextjsQuestions.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `next-route-1` | BEGINNER | `NEXT_ROUTING` | `nextjsQuestions.ts` | 🟢 Completed | |
| `next-route-2` | BEGINNER | `NEXT_ROUTING` | `nextjsQuestions.ts` | 🟢 Completed | |
| `next-route-notfound-1` | BEGINNER | `NEXT_ROUTING` | `nextjsQuestions.ts` | 🟢 Completed | |
| `next-route-useroute-1` | BEGINNER | `NEXT_ROUTING` | `nextjsQuestions.ts` | 🟢 Completed | |
| `next-sc-1` | BEGINNER | `NEXT_SERVER_COMPONENTS` | `nextjsQuestions.ts` | 🟢 Completed | |
| `next-sc-2` | INTERMEDIATE | `NEXT_SERVER_COMPONENTS` | `nextjsQuestions.ts` | 🟢 Completed | |
| `next-fetch-1` | BEGINNER | `NEXT_DATA_FETCHING` | `nextjsQuestions.ts` | 🟢 Completed | |
| `next-fetch-2` | BEGINNER | `NEXT_DATA_FETCHING` | `nextjsQuestions.ts` | 🟢 Completed | |
| `next-ssg-1` | BEGINNER | `NEXT_DATA_FETCHING` | `nextjsQuestions.ts` | 🟢 Completed | |
| `next-parallel-1` | INTERMEDIATE | `NEXT_DATA_FETCHING` | `nextjsQuestions.ts` | 🟢 Completed | |
| `next-suspense-1` | INTERMEDIATE | `NEXT_DATA_FETCHING` | `nextjsQuestions.ts` | 🟢 Completed | |
| `next-sc-context-1` | ADVANCED | `NEXT_SERVER_COMPONENTS` | `nextjsQuestions.ts` | 🟢 Completed | |
| `next-api-1` | BEGINNER | `NEXT_API_ROUTES` | `nextjsQuestions.ts` | 🟢 Completed | |
| `next-api-2` | INTERMEDIATE | `NEXT_API_ROUTES` | `nextjsQuestions.ts` | 🟢 Completed | |
| `next-api-dynamic-1` | BEGINNER | `NEXT_API_ROUTES` | `nextjsQuestions.ts` | 🟢 Completed | |
| `next-api-error-1` | INTERMEDIATE | `NEXT_API_ROUTES` | `nextjsQuestions.ts` | 🟢 Completed | |
| `next-mw-1` | BEGINNER | `NEXT_MIDDLEWARE` | `nextjsQuestions.ts` | 🟢 Completed | |
| `next-mw-setcookie-1` | INTERMEDIATE | `NEXT_MIDDLEWARE` | `nextjsQuestions.ts` | 🟢 Completed | |
| `next-opt-1` | BEGINNER | `NEXT_OPTIMIZATION` | `nextjsQuestions.ts` | 🟢 Completed | |
| `next-opt-3` | BEGINNER | `NEXT_OPTIMIZATION` | `nextjsQuestions.ts` | 🟢 Completed | |


### prismaQuestions (`prismaQuestions.ts`)

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `prisma-1` | BEGINNER | `NEXT_PRISMA` | `prismaQuestions.ts` | 🟢 Completed | |
| `prisma-2` | BEGINNER | `NEXT_PRISMA` | `prismaQuestions.ts` | 🟢 Completed | |
| `prisma-5` | BEGINNER | `NEXT_PRISMA` | `prismaQuestions.ts` | 🟢 Completed | |
| `prisma-7` | BEGINNER | `NEXT_PRISMA` | `prismaQuestions.ts` | 🟢 Completed | |
| `prisma-9` | BEGINNER | `NEXT_PRISMA` | `prismaQuestions.ts` | 🟢 Completed | |
| `prisma-11` | BEGINNER | `NEXT_PRISMA` | `prismaQuestions.ts` | 🟢 Completed | |
| `prisma-13` | BEGINNER | `NEXT_PRISMA` | `prismaQuestions.ts` | 🟢 Completed | |
| `prisma-14` | INTERMEDIATE | `NEXT_PRISMA` | `prismaQuestions.ts` | 🟢 Completed | |
| `tanstack-1` | BEGINNER | `NEXT_TANSTACK` | `prismaQuestions.ts` | 🟢 Completed | |
| `tanstack-2` | BEGINNER | `NEXT_TANSTACK` | `prismaQuestions.ts` | 🟢 Completed | |
| `tanstack-6` | ADVANCED | `NEXT_TANSTACK` | `prismaQuestions.ts` | 🟢 Completed | |
| `tanstack-7` | BEGINNER | `NEXT_TANSTACK` | `prismaQuestions.ts` | 🟢 Completed | |


### webdevOrderedQuestions (`webdevOrderedQuestions.ts`)

> NOTE: all sub-topics below live in the SAME source file (`webdevOrderedQuestions.ts`). Split by topic for assignment purposes, but agents editing this file concurrently must target non-overlapping question ids/line ranges — do not run more than one agent on this file at the same time unless ranges are verified disjoint.

#### HTML_BASICS

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `html-2` | BEGINNER | `HTML_BASICS` | `webdevOrderedQuestions.ts` | 🟢 Completed | fixed apiSignature (removed "en" leak) & deepened skeleton |
| `html-3` | BEGINNER | `HTML_BASICS` | `webdevOrderedQuestions.ts` | 🟢 Completed | deepened skeleton by blanking target/rel attributes & link text |
| `html-4` | BEGINNER | `HTML_BASICS` | `webdevOrderedQuestions.ts` | 🟢 Completed | audited & verified clean bare apiSignature & cloze skeleton |
| `html-list-1` | BEGINNER | `HTML_BASICS` | `webdevOrderedQuestions.ts` | 🟢 Completed | audited & verified clean bare apiSignature & cloze skeleton |
| `html-table-1` | BEGINNER | `HTML_BASICS` | `webdevOrderedQuestions.ts` | 🟢 Completed | audited & verified clean bare apiSignature & cloze skeleton |
| `html-paths-2` | INTERMEDIATE | `HTML_BASICS` | `webdevOrderedQuestions.ts` | 🟢 Completed | audited & verified clean bare apiSignature & cloze skeleton |

#### HTML_FORMS

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `html-form-1` | BEGINNER | `HTML_FORMS` | `webdevOrderedQuestions.ts` | 🟢 Completed | added minlength parameter to apiSignature & verified skeleton |
| `html-form-2` | BEGINNER | `HTML_FORMS` | `webdevOrderedQuestions.ts` | 🟢 Completed | fixed skeleton blank formatting & verified apiSignature |
| `html-radio-1` | BEGINNER | `HTML_FORMS` | `webdevOrderedQuestions.ts` | 🟢 Completed | audited & verified bare apiSignature & cloze skeleton |
| `html-checkbox-1` | BEGINNER | `HTML_FORMS` | `webdevOrderedQuestions.ts` | 🟢 Completed | audited & verified bare apiSignature & cloze skeleton |
| `html-textarea-1` | BEGINNER | `HTML_FORMS` | `webdevOrderedQuestions.ts` | 🟢 Completed | audited & verified bare apiSignature & cloze skeleton |
| `html-fieldset-1` | BEGINNER | `HTML_FORMS` | `webdevOrderedQuestions.ts` | 🟢 Completed | audited & verified bare apiSignature & cloze skeleton |
| `html-input-restrict-1` | INTERMEDIATE | `HTML_FORMS` | `webdevOrderedQuestions.ts` | 🟢 Completed | added label/input parameters to apiSignature & verified skeleton |
| `html-signup-1` | INTERMEDIATE | `HTML_FORMS` | `webdevOrderedQuestions.ts` | 🟢 Completed | removed solution argument leaks from apiSignature & verified skeleton |

#### HTML_SEMANTIC

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `html-sem-2` | BEGINNER | `HTML_SEMANTIC` | `webdevOrderedQuestions.ts` | 🟢 Completed | already correct, clean |
| `html-sem-aside-1` | BEGINNER | `HTML_SEMANTIC` | `webdevOrderedQuestions.ts` | 🟢 Completed | already correct, clean |
| `html-figure-1` | BEGINNER | `HTML_SEMANTIC` | `webdevOrderedQuestions.ts` | 🟢 Completed | already correct, clean |
| `html-details-1` | BEGINNER | `HTML_SEMANTIC` | `webdevOrderedQuestions.ts` | 🟢 Completed | already correct, clean |
| `html-media-1` | BEGINNER | `HTML_SEMANTIC` | `webdevOrderedQuestions.ts` | 🟢 Completed | already correct, clean |
| `html-iframe-1` | BEGINNER | `HTML_SEMANTIC` | `webdevOrderedQuestions.ts` | 🟢 Completed | already correct, clean |
| `html-article-media-1` | INTERMEDIATE | `HTML_SEMANTIC` | `webdevOrderedQuestions.ts` | 🟢 Completed | already correct, clean |

#### CSS_BASICS

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `css-selector-1` | BEGINNER | `CSS_BASICS` | `webdevOrderedQuestions.ts` | 🟢 Completed | added # to hex/id skeleton lines, clean |
| `css-var-1` | BEGINNER | `CSS_BASICS` | `webdevOrderedQuestions.ts` | 🟢 Completed | added -- and # to skeleton lines for comment-stripping parity, clean |
| `css-typography-1` | BEGINNER | `CSS_BASICS` | `webdevOrderedQuestions.ts` | 🟢 Completed | single bare signature, clean |
| `css-basic-2` | BEGINNER | `CSS_BASICS` | `webdevOrderedQuestions.ts` | 🟢 Completed | single bare signature, clean |
| `css-anim-1` | BEGINNER | `CSS_BASICS` | `webdevOrderedQuestions.ts` | 🟢 Completed | blanked base properties, clean |
| `css-pseudo-1` | INTERMEDIATE | `CSS_BASICS` | `webdevOrderedQuestions.ts` | 🟢 Completed | added # to skeleton background line for comment-stripping parity, clean |
| `css-bg-1` | INTERMEDIATE | `CSS_BASICS` | `webdevOrderedQuestions.ts` | 🟢 Completed | added # to gradient placeholders in skeleton, clean |
| `css-anim-3` | INTERMEDIATE | `CSS_BASICS` | `webdevOrderedQuestions.ts` | 🟢 Completed | blanked property names & values, clean |

#### CSS_LAYOUT

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `css-layout-1` | BEGINNER | `CSS_LAYOUT` | `webdevOrderedQuestions.ts` | 🟢 Completed | verified hints, clean |
| `css-layout-2` | BEGINNER | `CSS_LAYOUT` | `webdevOrderedQuestions.ts` | 🟢 Completed | blanked solution args in skeleton |
| `css-layout-3` | BEGINNER | `CSS_LAYOUT` | `webdevOrderedQuestions.ts` | 🟢 Completed | removed solution args from apiSignature and blanked skeleton |
| `css-position-1` | BEGINNER | `CSS_LAYOUT` | `webdevOrderedQuestions.ts` | 🟢 Completed | removed solution args from apiSignature and skeleton |
| `css-badge-1` | INTERMEDIATE | `CSS_LAYOUT` | `webdevOrderedQuestions.ts` | 🟢 Completed | removed solution args from apiSignature and skeleton |
| `css-sticky-header-1` | ADVANCED | `CSS_LAYOUT` | `webdevOrderedQuestions.ts` | 🟢 Completed | blanked solution args in skeleton |

#### CSS_RESPONSIVE

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `css-resp-1` | BEGINNER | `CSS_RESPONSIVE` | `webdevOrderedQuestions.ts` | 🟢 Completed | updated apiSignature and blanked skeleton |
| `css-resp-3` | BEGINNER | `CSS_RESPONSIVE` | `webdevOrderedQuestions.ts` | 🟢 Completed | updated apiSignature and blanked skeleton |
| `css-resp-5` | INTERMEDIATE | `CSS_RESPONSIVE` | `webdevOrderedQuestions.ts` | 🟢 Completed | updated apiSignature and blanked skeleton |
| `css-resp-clamp-1` | INTERMEDIATE | `CSS_RESPONSIVE` | `webdevOrderedQuestions.ts` | 🟢 Completed | verified apiSignature & skeleton |
| `css-resp-units-1` | INTERMEDIATE | `CSS_RESPONSIVE` | `webdevOrderedQuestions.ts` | 🟢 Completed | updated apiSignature and verified skeleton |
| `css-resp-autofit-1` | INTERMEDIATE | `CSS_RESPONSIVE` | `webdevOrderedQuestions.ts` | 🟢 Completed | updated apiSignature and blanked skeleton |

#### TAILWIND

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `tw-2` | BEGINNER | `TAILWIND` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored generic HTML utility signature & 5-blank skeleton |
| `tw-3` | BEGINNER | `TAILWIND` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored generic HTML utility signature & 7-blank skeleton |
| `tw-4` | BEGINNER | `TAILWIND` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored generic HTML utility signature & 4-blank skeleton |
| `tw-5` | BEGINNER | `TAILWIND` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored generic HTML utility signature & 5-blank skeleton |
| `tw-variant-1` | INTERMEDIATE | `TAILWIND` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored generic HTML utility signature & 4-blank skeleton |
| `tw-transition-1` | INTERMEDIATE | `TAILWIND` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored generic HTML utility signature & 4-blank skeleton |
| `tw-space-divide-1` | INTERMEDIATE | `TAILWIND` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored generic HTML utility signature & 3-blank skeleton |
| `tw-accessible-btn-1` | INTERMEDIATE | `TAILWIND` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored generic HTML utility signature & 5-blank skeleton |

#### HTML_CSS_PROJECT

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `htmlcss-project-1` | ADVANCED | `HTML_CSS_PROJECT` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored generic HTML hero signature & 15-blank skeleton |
| `htmlcss-project-2` | ADVANCED | `HTML_CSS_PROJECT` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored generic HTML pricing signature & 25-blank skeleton |
| `htmlcss-project-3` | ADVANCED | `HTML_CSS_PROJECT` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored generic HTML nav signature & 14-blank skeleton |

#### JS_VARIABLES_TYPES

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `js-var-2` | BEGINNER | `JS_VARIABLES_TYPES` | `webdevOrderedQuestions.ts` | 🟢 Completed | bare object destructuring signature & 5-blank skeleton |
| `js-var-3` | BEGINNER | `JS_VARIABLES_TYPES` | `webdevOrderedQuestions.ts` | 🟢 Completed | bare array destructuring signature & 6-blank skeleton |
| `js-var-5` | BEGINNER | `JS_VARIABLES_TYPES` | `webdevOrderedQuestions.ts` | 🟢 Completed | bare object spread signature & 7-blank skeleton |
| `js-var-loop-1` | BEGINNER | `JS_VARIABLES_TYPES` | `webdevOrderedQuestions.ts` | 🟢 Completed | bare for-loop signature & 6-blank skeleton |
| `js-var-string-1` | BEGINNER | `JS_VARIABLES_TYPES` | `webdevOrderedQuestions.ts` | 🟢 Completed | bare string method chaining signature & 5-blank skeleton |

#### JS_FUNCTIONS

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `js-fn-1` | BEGINNER | `JS_FUNCTIONS` | `webdevOrderedQuestions.ts` | 🟢 Completed | bare arrow signature & 3-blank skeleton |
| `js-fn-2` | BEGINNER | `JS_FUNCTIONS` | `webdevOrderedQuestions.ts` | 🟢 Completed | bare factory & returned object signature & 5-blank skeleton |
| `js-fn-3` | BEGINNER | `JS_FUNCTIONS` | `webdevOrderedQuestions.ts` | 🟢 Completed | bare wrapped call signature & 6-blank skeleton |
| `js-fn-callback-1` | BEGINNER | `JS_FUNCTIONS` | `webdevOrderedQuestions.ts` | 🟢 Completed | bare callback signature & 4-blank skeleton |
| `js-fn-recursion-1` | INTERMEDIATE | `JS_FUNCTIONS` | `webdevOrderedQuestions.ts` | 🟢 Completed | bare recursive call signature & 5-blank skeleton |

#### JS_ARRAYS

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `js-arr-1` | BEGINNER | `JS_ARRAYS` | `webdevOrderedQuestions.ts` | 🟢 Completed | bare map signature & 5-blank skeleton |
| `js-arr-2` | BEGINNER | `JS_ARRAYS` | `webdevOrderedQuestions.ts` | 🟢 Completed | bare filter signature & 6-blank skeleton |
| `js-arr-3` | BEGINNER | `JS_ARRAYS` | `webdevOrderedQuestions.ts` | 🟢 Completed | bare reduce signature & 7-blank skeleton |
| `js-arr-4` | BEGINNER | `JS_ARRAYS` | `webdevOrderedQuestions.ts` | 🟢 Completed | bare find signature & 7-blank skeleton |
| `js-arr-5` | INTERMEDIATE | `JS_ARRAYS` | `webdevOrderedQuestions.ts` | 🟢 Completed | bare filter.map signature & 10-blank skeleton |
| `js-arr-slice-splice-1` | BEGINNER | `JS_ARRAYS` | `webdevOrderedQuestions.ts` | 🟢 Completed | bare splice signature & 5-blank skeleton |
| `js-arr-sort-comparator-1` | INTERMEDIATE | `JS_ARRAYS` | `webdevOrderedQuestions.ts` | 🟢 Completed | bare sort signature & 8-blank skeleton |
| `js-arr-immutable-1` | INTERMEDIATE | `JS_ARRAYS` | `webdevOrderedQuestions.ts` | 🟢 Completed | bare array spread signature & 4-blank skeleton |
| `js-arr-6` | INTERMEDIATE | `JS_ARRAYS` | `webdevOrderedQuestions.ts` | 🟢 Completed | bare filter.map.reduce signature & 17-blank skeleton |

#### JS_OBJECTS

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `js-obj-1` | BEGINNER | `JS_OBJECTS` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored tieredHints with method shorthand & template literal skeleton |
| `js-obj-2` | BEGINNER | `JS_OBJECTS` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored tieredHints for nested destructuring |
| `js-obj-3` | INTERMEDIATE | `JS_OBJECTS` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored tieredHints for Object.fromEntries & filter/map |
| `js-obj-4` | BEGINNER | `JS_OBJECTS` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored tieredHints for Object.keys/values/entries |
| `js-obj-5` | BEGINNER | `JS_OBJECTS` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored tieredHints for JSON deep clone |
| `js-obj-6` | BEGINNER | `JS_OBJECTS` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored tieredHints for computed property names |
| `js-obj-8` | ADVANCED | `JS_OBJECTS` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored tieredHints for reduce groupBy pattern |
| `js-obj-class-1` | BEGINNER | `JS_OBJECTS` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored tieredHints for ES6 class declaration |
| `js-obj-extends-1` | INTERMEDIATE | `JS_OBJECTS` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored tieredHints for class inheritance & super |
| `js-obj-map-1` | INTERMEDIATE | `JS_OBJECTS` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored tieredHints for Map frequency counter |
| `js-obj-set-1` | BEGINNER | `JS_OBJECTS` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored tieredHints for Set deduplication |

#### JS_ASYNC

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `js-async-2` | BEGINNER | `JS_ASYNC` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored bare fetch/json signature & 6-blank try/catch skeleton |
| `js-async-3` | ADVANCED | `JS_ASYNC` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored bare Promise.all signature & 6-blank concurrent fetch skeleton |
| `js-async-sequential-concurrent-1` | INTERMEDIATE | `JS_ASYNC` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored bare Promise.all signature & 10-blank concurrent fetch skeleton |

#### JS_ES6_PLUS

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `js-es6-1` | BEGINNER | `JS_ES6_PLUS` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored template literal signature & 6-blank skeleton |
| `js-es6-2` | BEGINNER | `JS_ES6_PLUS` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored optional chaining/nullish signature & 6-blank skeleton |
| `js-es6-3` | BEGINNER | `JS_ES6_PLUS` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored array rest destructuring signature & 4-blank skeleton |
| `js-es6-modules-1` | BEGINNER | `JS_ES6_PLUS` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored ES module exports signature & 7-blank skeleton |
| `js-es6-regex-1` | BEGINNER | `JS_ES6_PLUS` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored RegExp.test signature & 4-blank skeleton |
| `js-es6-regex-2` | BEGINNER | `JS_ES6_PLUS` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored String.match signature & 7-blank skeleton |
| `js-es6-regex-groups-1` | INTERMEDIATE | `JS_ES6_PLUS` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored String.replace capture groups signature & 4-blank skeleton |

#### JS_DOM

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `js-dom-1` | BEGINNER | `JS_DOM` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored getElementById/querySelectorAll signature & 4-blank skeleton (MEDIUM 0.67) |
| `js-dom-2` | BEGINNER | `JS_DOM` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored createElement/classList/appendChild signature & 4-blank skeleton (MEDIUM 0.69) |
| `js-dom-3` | BEGINNER | `JS_DOM` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored addEventListener/classList.toggle signature & 4-blank skeleton (MEDIUM 0.76) |
| `js-dom-4` | INTERMEDIATE | `JS_DOM` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored event delegation signature & 4-blank skeleton (MEDIUM 0.72) |
| `js-dom-5` | BEGINNER | `JS_DOM` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored preventDefault/form elements signature & 4-blank skeleton (MEDIUM 0.71) |
| `js-dom-6` | ADVANCED | `JS_DOM` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored debounce signature & 7-blank skeleton (MEDIUM 0.71) |
| `js-dom-8` | ADVANCED | `JS_DOM` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored dynamic list CRUD signature & 6-blank skeleton (MEDIUM 0.73) |
| `js-dom-traversal-1` | BEGINNER | `JS_DOM` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored closest/remove signature & 4-blank skeleton (MEDIUM 0.70) |
| `js-dom-localstorage-1` | BEGINNER | `JS_DOM` | `webdevOrderedQuestions.ts` | 🟢 Completed | Authored localStorage setItem/getItem signature & 5-blank skeleton (clean) |

#### JS_PROJECT

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `test-2` | BEGINNER | `JS_PROJECT` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `js-project-1` | ADVANCED | `JS_PROJECT` | `webdevOrderedQuestions.ts` | 🟢 Completed | |

#### TS_BASIC_TYPES

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `ts-type-1` | BEGINNER | `TS_BASIC_TYPES` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `ts-basic-2` | BEGINNER | `TS_BASIC_TYPES` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `ts-basic-4` | BEGINNER | `TS_BASIC_TYPES` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `ts-union-1` | BEGINNER | `TS_BASIC_TYPES` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `ts-callback-1` | INTERMEDIATE | `TS_BASIC_TYPES` | `webdevOrderedQuestions.ts` | 🟢 Completed | |

#### TS_INTERFACES

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `ts-type-2` | BEGINNER | `TS_INTERFACES` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `ts-iface-2` | BEGINNER | `TS_INTERFACES` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `ts-iface-3` | BEGINNER | `TS_INTERFACES` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `ts-iface-index-1` | INTERMEDIATE | `TS_INTERFACES` | `webdevOrderedQuestions.ts` | 🟢 Completed | |

#### TS_GENERICS

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `ts-type-3` | BEGINNER | `TS_GENERICS` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `ts-gen-2` | BEGINNER | `TS_GENERICS` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `ts-gen-3` | INTERMEDIATE | `TS_GENERICS` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `ts-gen-constraint-1` | BEGINNER | `TS_GENERICS` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `ts-gen-keyof-1` | INTERMEDIATE | `TS_GENERICS` | `webdevOrderedQuestions.ts` | 🟢 Completed | |

#### TS_ADVANCED_TYPES

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `ts-type-4` | BEGINNER | `TS_ADVANCED_TYPES` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `ts-adv-2` | BEGINNER | `TS_ADVANCED_TYPES` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `ts-adv-3` | INTERMEDIATE | `TS_ADVANCED_TYPES` | `webdevOrderedQuestions.ts` | 🟢 Completed | |

#### TS_UTILITY_TYPES

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `ts-type-5` | BEGINNER | `TS_UTILITY_TYPES` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `ts-util-2` | BEGINNER | `TS_UTILITY_TYPES` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `ts-util-3` | BEGINNER | `TS_UTILITY_TYPES` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `ts-util-record-1` | BEGINNER | `TS_UTILITY_TYPES` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `ts-util-combine-1` | INTERMEDIATE | `TS_UTILITY_TYPES` | `webdevOrderedQuestions.ts` | 🟢 Completed | |

#### TS_PROJECT

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `ts-project-1` | ADVANCED | `TS_PROJECT` | `webdevOrderedQuestions.ts` | 🟢 Completed | |

#### REACT_COMPONENTS

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `react-comp-1` | BEGINNER | `REACT_COMPONENTS` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `react-cond-1` | BEGINNER | `REACT_COMPONENTS` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `react-list-1` | BEGINNER | `REACT_COMPONENTS` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `react-children-1` | BEGINNER | `REACT_COMPONENTS` | `webdevOrderedQuestions.ts` | 🟢 Completed | |

#### REACT_STATE

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `react-state-1` | BEGINNER | `REACT_STATE` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `react-state-2` | BEGINNER | `REACT_STATE` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `react-state-3` | BEGINNER | `REACT_STATE` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `react-state-object-1` | BEGINNER | `REACT_STATE` | `webdevOrderedQuestions.ts` | 🟢 Completed | |

#### REACT_EFFECTS

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `react-effect-1` | BEGINNER | `REACT_EFFECTS` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `react-fetch-1` | INTERMEDIATE | `REACT_EFFECTS` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `react-effect-race-1` | ADVANCED | `REACT_EFFECTS` | `webdevOrderedQuestions.ts` | 🟢 Completed | |

#### REACT_HOOKS

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `react-hooks-1` | INTERMEDIATE | `REACT_HOOKS` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `react-reducer-1` | BEGINNER | `REACT_HOOKS` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `react-perf-1` | BEGINNER | `REACT_HOOKS` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `react-ref-1` | BEGINNER | `REACT_HOOKS` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `react-perf-2` | BEGINNER | `REACT_HOOKS` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `react-reducer-payload-1` | INTERMEDIATE | `REACT_HOOKS` | `webdevOrderedQuestions.ts` | 🟢 Completed | |

#### REACT_CONTEXT

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `react-context-1` | BEGINNER | `REACT_CONTEXT` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `react-ctx-2` | INTERMEDIATE | `REACT_CONTEXT` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `react-context-memoize-1` | ADVANCED | `REACT_CONTEXT` | `webdevOrderedQuestions.ts` | 🟢 Completed | |

#### REACT_FORMS

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `react-forms-1` | BEGINNER | `REACT_FORMS` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `react-form-2` | INTERMEDIATE | `REACT_FORMS` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `react-form-3` | BEGINNER | `REACT_FORMS` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `react-forms-radio-1` | INTERMEDIATE | `REACT_FORMS` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `react-forms-computed-handler-1` | INTERMEDIATE | `REACT_FORMS` | `webdevOrderedQuestions.ts` | 🟢 Completed | |

#### REACT_PATTERNS

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `react-router-1` | BEGINNER | `REACT_PATTERNS` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `react-router-2` | BEGINNER | `REACT_PATTERNS` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `react-lazy-1` | BEGINNER | `REACT_PATTERNS` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `react-navigate-1` | BEGINNER | `REACT_PATTERNS` | `webdevOrderedQuestions.ts` | 🟢 Completed | |

#### REACT_PROJECT

| ID | Difficulty | Topic | Source File | Status | Notes |
|---|---|---|---|---|---|
| `react-project-1` | ADVANCED | `REACT_PROJECT` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `react-project-todo` | ADVANCED | `REACT_PROJECT` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `react-project-theme` | ADVANCED | `REACT_PROJECT` | `webdevOrderedQuestions.ts` | 🟢 Completed | |
| `test-3` | ADVANCED | `REACT_PROJECT` | `webdevOrderedQuestions.ts` | 🟢 Completed | |

