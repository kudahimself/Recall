# Databricks & Data Engineering Code Validator Keyword Audit Tracker

This document tracks the authoring and backfill status of explicit keyword enforcement (`requires`: `string[]` or `RegExp[]`) for Databricks and Data Engineering **CODING** questions.

## 🤖 Agent Operating Instructions (SOP for Any Agent / Subagent)

**Total Coding Questions Audited:** `181` | **Targeted Keyword Questions:** `43` | **Completed Backfills:** `1` | **Pending Backfills:** `42`

When spawned to backfill or audit `requires` on Databricks CODING questions, follow these instructions strictly:

### 1. Workflow Sequence
1. **Locate Pending Questions:** Pick a topic/file containing 🔴 `Pending` questions in this tracker.
2. **Set In Progress:** Mark the selected question rows as 🟡 `In Progress` in this tracker.
3. **Configure `requires` in Source Code:** Open the corresponding `app/src/data/*.ts` file and add the `requires` property to the target `CodingQuestion` object:
   ```typescript
   requires: ['DESCRIBE EXTENDED', 'DESCRIBE DETAIL'],
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

## 1. Databricks Platform & Certification (`certificationQuestions.ts`)

| ID | Difficulty | Topic | Required Keyword(s) | Source File | Status | Notes |
|---|---|---|---|---|---|---|
| `platform-sql-1` | INTERMEDIATE | `DATABRICKS_PLATFORM` | `['DESCRIBE EXTENDED', 'DESCRIBE DETAIL']` | `certificationQuestions.ts` | 🟢 Completed | Requires metadata describe keywords |
| `streaming-10` | ADVANCED | `STRUCTURED_STREAMING` | `['withWatermark']` | `certificationQuestions.ts` | 🟢 Completed | Requires watermark keyword |
| `cdc-3` | INTERMEDIATE | `CHANGE_DATA_CAPTURE` | `['ALTER TABLE']` | `certificationQuestions.ts` | 🟢 Completed | Requires DDL keyword |
| `cdc-7` | ADVANCED | `CHANGE_DATA_CAPTURE` | `['MERGE INTO']` | `certificationQuestions.ts` | 🟢 Completed | Requires MERGE DML |
| `governance-3` | INTERMEDIATE | `DATA_GOVERNANCE` | `['GRANT']` | `certificationQuestions.ts` | 🟢 Completed | Requires GRANT security DDL |
| `governance-4` | INTERMEDIATE | `DATA_GOVERNANCE` | `['GRANT']` | `certificationQuestions.ts` | 🟢 Completed | Requires GRANT security DDL |
| `governance-5` | INTERMEDIATE | `DATA_GOVERNANCE` | `['REVOKE']` | `certificationQuestions.ts` | 🟢 Completed | Requires REVOKE security DDL |
| `governance-6` | INTERMEDIATE | `DATA_GOVERNANCE` | `['SHOW GRANTS']` | `certificationQuestions.ts` | 🟢 Completed | Requires SHOW GRANTS |
| `governance-7` | INTERMEDIATE | `DATA_GOVERNANCE` | `['CREATE CATALOG']` | `certificationQuestions.ts` | 🟢 Completed | Requires UC catalog DDL |
| `governance-8` | INTERMEDIATE | `DATA_GOVERNANCE` | `['CREATE SCHEMA']` | `certificationQuestions.ts` | 🟢 Completed | Requires UC schema DDL |
| `governance-11` | INTERMEDIATE | `DATA_GOVERNANCE` | `['GRANT']` | `certificationQuestions.ts` | 🟢 Completed | Requires GRANT permissions |

---

## 2. Mastery & Time Travel (`masteryQuestions.ts`)

| ID | Difficulty | Topic | Required Keyword(s) | Source File | Status | Notes |
|---|---|---|---|---|---|---|
| `io-5` | INTERMEDIATE | `PYSPARK_BASICS` | `['saveAsTable']` | `masteryQuestions.ts` | 🟢 Completed | Pre-existing `requires` field |
| `restore-1` | INTERMEDIATE | `DELTA_TIME_TRAVEL` | `['RESTORE']` | `masteryQuestions.ts` | 🟢 Completed | Added explicit RESTORE keyword requirement |
| `restore-2` | INTERMEDIATE | `DELTA_TIME_TRAVEL` | `['RESTORE']` | `masteryQuestions.ts` | 🟢 Completed | Added explicit RESTORE keyword requirement |
| `restore-3` | BEGINNER | `DELTA_TIME_TRAVEL` | `['DESCRIBE HISTORY']` | `masteryQuestions.ts` | 🟢 Completed | Added explicit DESCRIBE HISTORY keyword requirement |
| `constraint-1` | INTERMEDIATE | `DELTA_OPERATIONS` | `['ALTER TABLE']` | `masteryQuestions.ts` | 🟢 Completed | Added explicit ALTER TABLE keyword requirement |
| `constraint-2` | INTERMEDIATE | `DELTA_OPERATIONS` | `['ALTER TABLE']` | `masteryQuestions.ts` | 🟢 Completed | Added explicit ALTER TABLE keyword requirement |
| `constraint-3` | INTERMEDIATE | `DELTA_OPERATIONS` | `['ALTER TABLE']` | `masteryQuestions.ts` | 🟢 Completed | Added explicit ALTER TABLE keyword requirement |
| `stream-adv-3` | ADVANCED | `STRUCTURED_STREAMING` | `['withWatermark']` | `masteryQuestions.ts` | 🟢 Completed | Added explicit withWatermark keyword requirement |
| `stream-adv-4` | ADVANCED | `STRUCTURED_STREAMING` | `['withWatermark']` | `masteryQuestions.ts` | 🟢 Completed | Added explicit withWatermark keyword requirement |
| `stream-adv-7` | ADVANCED | `STRUCTURED_STREAMING` | `['withWatermark']` | `masteryQuestions.ts` | 🟢 Completed | Added explicit withWatermark keyword requirement |

---

## 3. Delta Operations & Optimization (`expandedQuestions.ts`)

| ID | Difficulty | Topic | Required Keyword(s) | Source File | Status | Notes |
|---|---|---|---|---|---|---|
| `delta-5` | ADVANCED | `DELTA_OPERATIONS` | `['MERGE INTO']` | `expandedQuestions.ts` | 🟢 Completed | Requires MERGE INTO keyword |
| `delta-8` | INTERMEDIATE | `DELTA_OPTIMIZATION` | `['OPTIMIZE']` | `expandedQuestions.ts` | 🟢 Completed | Requires OPTIMIZE keyword |
| `delta-9` | ADVANCED | `DELTA_OPTIMIZATION` | `['ZORDER BY']` | `expandedQuestions.ts` | 🟢 Completed | Requires ZORDER BY keyword |
| `catalog-3` | INTERMEDIATE | `DATABRICKS_PLATFORM` | `['CREATE CATALOG']` | `expandedQuestions.ts` | 🟢 Completed | Requires CREATE CATALOG keyword |
| `catalog-4` | INTERMEDIATE | `DATABRICKS_PLATFORM` | `['CREATE SCHEMA']` | `expandedQuestions.ts` | 🟢 Completed | Requires CREATE SCHEMA keyword |
| `catalog-6` | ADVANCED | `DATABRICKS_PLATFORM` | `['GRANT']` | `expandedQuestions.ts` | 🟢 Completed | Requires GRANT keyword |
| `delta-clone-2` | INTERMEDIATE | `DELTA_OPERATIONS` | `['DEEP CLONE']` | `expandedQuestions.ts` | 🟢 Completed | Requires DEEP CLONE keyword |
| `delta-clone-3` | INTERMEDIATE | `DELTA_OPERATIONS` | `['SHALLOW CLONE']` | `expandedQuestions.ts` | 🟢 Completed | Requires SHALLOW CLONE keyword |
| `delta-merge-2` | ADVANCED | `DELTA_OPERATIONS` | `['MERGE INTO']` | `expandedQuestions.ts` | 🟢 Completed | Requires MERGE INTO keyword |
| `delta-optimize-2` | INTERMEDIATE | `DELTA_OPTIMIZATION` | `['OPTIMIZE']` | `expandedQuestions.ts` | 🟢 Completed | Requires OPTIMIZE keyword |
| `delta-optimize-3` | ADVANCED | `DELTA_OPTIMIZATION` | `['ZORDER BY']` | `expandedQuestions.ts` | 🟢 Completed | Requires ZORDER BY keyword |
| `delta-vacuum-2` | INTERMEDIATE | `DELTA_OPERATIONS` | `['VACUUM']` | `expandedQuestions.ts` | 🟢 Completed | Requires VACUUM keyword |
| `delta-vacuum-3` | ADVANCED | `DELTA_OPERATIONS` | `['VACUUM']` | `expandedQuestions.ts` | 🟢 Completed | Requires VACUUM keyword |

---

## 4. Unity Catalog DDL & Governance (`unityCatalogQuestions.ts`)

| ID | Difficulty | Topic | Required Keyword(s) | Source File | Status | Notes |
|---|---|---|---|---|---|---|
| `uc-basics-2` | BEGINNER | `UNITY_CATALOG_BASICS` | `['CREATE CATALOG']` | `unityCatalogQuestions.ts` | 🟢 Completed | Added explicit CREATE CATALOG keyword requirement |
| `uc-basics-4` | INTERMEDIATE | `UNITY_CATALOG_BASICS` | `['CREATE VOLUME']` | `unityCatalogQuestions.ts` | 🟢 Completed | Added explicit CREATE VOLUME keyword requirement |
| `uc-gov-2` | BEGINNER | `UNITY_CATALOG_GOVERNANCE` | `['GRANT']` | `unityCatalogQuestions.ts` | 🟢 Completed | Added explicit GRANT keyword requirement |
| `uc-gov-3` | INTERMEDIATE | `UNITY_CATALOG_GOVERNANCE` | `['GRANT']` | `unityCatalogQuestions.ts` | 🟢 Completed | Added explicit GRANT keyword requirement |
| `uc-gov-4` | INTERMEDIATE | `UNITY_CATALOG_GOVERNANCE` | `['GRANT']` | `unityCatalogQuestions.ts` | 🟢 Completed | Added explicit GRANT keyword requirement |
| `uc-gov-6` | ADVANCED | `UNITY_CATALOG_GOVERNANCE` | `['GRANT']` | `unityCatalogQuestions.ts` | 🟢 Completed | Added explicit GRANT keyword requirement |

---

## 5. Data Modeling & Architecture (`dataModelingQuestions.ts`)

| ID | Difficulty | Topic | Required Keyword(s) | Source File | Status | Notes |
|---|---|---|---|---|---|---|
| `scd-coding-1` | INTERMEDIATE | `SCD_PATTERNS` | `['MERGE INTO']` | `dataModelingQuestions.ts` | 🟢 Completed | SCD Type 1 upsert |
| `scd-coding-2` | ADVANCED | `SCD_PATTERNS` | `['MERGE INTO']` | `dataModelingQuestions.ts` | 🟢 Completed | SCD Type 2 merge & insert |
| `pd-coding-1` | INTERMEDIATE | `PIPELINE_DESIGN` | `['MERGE INTO']` | `dataModelingQuestions.ts` | 🟢 Completed | Idempotent merge statement |
