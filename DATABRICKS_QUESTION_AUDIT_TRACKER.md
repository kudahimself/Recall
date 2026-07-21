# Databricks Course Question Audit & Rewrite Tracker

This document tracks the audit and rewrite status for every question in the **Databricks & PySpark Course**.

## 🤖 Agent Operating Instructions (SOP for Any Agent / Subagent)

**Total Databricks Questions:** `522` | **Audit Status:** Persistent state across sessions

When spawned to audit or rewrite Databricks questions, follow these instructions strictly:

### 1. Workflow Sequence
1. **Locate Pending Questions:** Pick a batch or topic containing 🔴 `Pending` questions.
2. **Set In Progress:** Mark the selected question rows as 🟡 `In Progress` in this tracker.
3. **Audit & Rewrite Source Code:** Open the corresponding `src/data/*.ts` file and review/rewrite each question against the Quality Rubric below.
4. **Run Verification & Leak Gate:** Run the quality checks from the `app/` directory:
   ```powershell
   npx tsc --noEmit; node scripts/check-leaks.js; node scripts/check-commented-solution.js; node scripts/check-mcq-distractor-length.js databricks
   ```
5. **Mark Completed:** Update the question status to 🟢 `Completed` in this tracker and add brief notes on what was improved.

### 2. Mandatory Skill References (`.claude/skills/`)
Agents must refer to the following skill instruction files when working on questions:
- **Writing Quality:** [`write-questions`](file:///C:/Users/kudam/Documents/Github/Recall/.claude/skills/write-questions/SKILL.md) — Pedagogical quality rubric per question type (bad-vs-good patterns)
- **Topic Structure & Ramping:** [`construct-topic`](file:///C:/Users/kudam/Documents/Github/Recall/.claude/skills/construct-topic/SKILL.md) — Primitive inventory, 3-tier difficulty ramp, faded on-ramps
- **Authoring Workflow:** [`add-question`](file:///C:/Users/kudam/Documents/Github/Recall/.claude/skills/add-question/SKILL.md) — Question creation steps, solution-first rule, starter code constraints
- **Pre-Commit Verification:** [`verify`](file:///C:/Users/kudam/Documents/Github/Recall/.claude/skills/verify/SKILL.md) — Pre-commit quality gate, test suite, type-check, and leak scripts
- **MCQ Distractor Audit:** [`audit-mcq`](file:///C:/Users/kudam/Documents/Github/Recall/.claude/skills/audit-mcq/SKILL.md) — MCQ distractor length parity & letter-position rotation
- **Question Audits:** [`audit-questions`](file:///C:/Users/kudam/Documents/Github/Recall/.claude/skills/audit-questions/SKILL.md) — Mechanical leak and reserved-word scans

### 3. Quality & Pedagogical Rubric (`write-questions` & `construct-topic`)
- **Difficulty & Cognitive Load:**
  - **BEGINNER:** Introduces **1 primitive**, minimal scaffolding.
  - **INTERMEDIATE:** Deliberate pairing of **2 already-seen primitives**.
  - **ADVANCED:** **3+ primitives**, realistic scenario, **prose-only prompt** (no code-comment walkthroughs naming functions).
- **MULTIPLE_CHOICE (MCQ):**
  - **Length Parity:** Distractors must match the correct answer's length (no 'longest = correct' bias).
  - **Option Rotation:** Rotate the correct answer position across `a, b, c, d` (do not default to `b`).
  - **Distractor Quality:** Distractors must represent plausible, documented misconceptions, not one-line dismissals.
- **CODING:**
  - **Solution First:** Write the reference `solution` first, including `# OR` (Python) or `-- OR` (SQL) syntax alternates.
  - **No Keyword Leaks:** Prompt and starter code must state behavioral requirements without leaking the exact function/method name.
  - **Syntax Guard:** Never use SQL/JS reserved words as variable/column names (`date`, `name`, `status`, `type`).
- **PREDICT_OUTPUT:** 3-8 lines, strict determinism, no engine-dependent printed types.
- **PARSONS:** 3-6 lines, 1 statement per line, distractors encode specific misconceptions.

---
> **Status Key:**
> - 🔴 `Pending` — Needs review/rewrite against `/write-questions` rubric & leak gates
> - 🟡 `In Progress` — Currently under review/rewrite
> - 🟢 `Completed` — Rewritten, audited, and verified leak-clean

## Lakehouse Platform

### Compute & Cluster Administration (`DATABRICKS_COMPUTE_ADMIN, DATABRICKS_PLATFORM, DATABRICKS_BASICS`)

| ID | Type | Difficulty | Source File | Status | Notes |
|---|---|---|---|---|---|
| `dbx-compute-admin-1` | MULTIPLE_CHOICE | BEGINNER | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | On-Demand vs Spot Driver node resilience |
| `dbx-compute-admin-2` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Shared access mode for Unity Catalog multi-tenancy |
| `dbx-compute-admin-3` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Cluster Policy JSON max_value enforcement |
| `dbx-compute-admin-4` | MULTIPLE_CHOICE | ADVANCED | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Init script non-zero exit code aborting startup |
| `dbx-compute-admin-5` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Driver OutOfMemory from df.collect() |
| `dbx-compute-admin-6` | CLOZE_CODE | BEGINNER | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | dbutils.notebook.getContext() utility call |
| `dbx-compute-admin-7` | MULTIPLE_CHOICE | BEGINNER | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Init script definition & node startup execution timing |
| `dbx-compute-admin-8` | MULTIPLE_CHOICE | BEGINNER | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | All-Purpose interactive vs Job ephemeral clusters |
| `dbx-compute-admin-9` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | `🟢 Completed` | DBR ML pre-installed GPU drivers & ML frameworks |
| `dbx-compute-admin-10` | MULTIPLE_CHOICE | ADVANCED | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Databricks Photon C++ vectorized engine |
| `dbx-compute-admin-11` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | DBR LTS 3-year support lifecycle stability |
| `dbx-compute-admin-12` | MULTIPLE_CHOICE | BEGINNER | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Single Node cluster workloads (pandas/R) |
| `dbx-compute-admin-13` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Init script security (Workspace files / UC volumes vs DBFS) |
| `dbx-compute-admin-14` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Databricks Container Services (DCS) custom Docker images |
| `dbx-compute-admin-15` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Scala restrictions under Shared access mode |
| `dbx-compute-admin-16` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Notebook-scoped %pip vs cluster-wide libraries |
| `dbx-compute-admin-17` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Serverless vs Classic SQL Warehouses startup latency |
| `dbx-compute-admin-18` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | SQL Warehouses multi-cluster auto-scaling concurrency |
| `dbx-compute-admin-19` | MULTIPLE_CHOICE | ADVANCED | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Cluster Policy JSON fixed and max_workers schema |
| `dbx-compute-admin-20` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Auto-scaling shuffle partition local disk retention |
| `dbx-compute-admin-21` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Global init scripts workspace admin management & scope |
| `dbx-compute-admin-22` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Photon execution fallback to JVM for Python UDFs & RDDs |
| `dbx-compute-admin-23` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Cluster UI Advanced Options for Spark Config and env vars |
| `dbx-compute-admin-24` | MULTIPLE_CHOICE | ADVANCED | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Worker Spot eviction warning & graceful decommissioning |
| `dbx-compute-admin-25` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Instance Pools warm compute pre-allocation |
| `dbx-compute-admin-26` | MULTIPLE_CHOICE | ADVANCED | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Cluster Log Delivery path for init script stdout/stderr |
| `dbx-compute-admin-27` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Heterogeneous driver (memory-opt) vs worker (compute-opt) sizing |
| `dbx-compute-admin-28` | MULTIPLE_CHOICE | ADVANCED | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Security risks of No Isolation Shared access mode |
| `dbx-compute-admin-29` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Custom cluster tags for cloud cost center attribution |
| `dbx-compute-admin-30` | MULTIPLE_CHOICE | ADVANCED | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Inactivity activity triggers resetting auto-termination |
| `dbx-compute-admin-31` | PREDICT_OUTPUT | BEGINNER | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Cluster policy max_value validation trace |
| `dbx-compute-admin-32` | PREDICT_OUTPUT | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Execution context tags user and clusterId extraction |
| `dbx-compute-admin-33` | PARSONS | BEGINNER | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Cluster policy JSON structure (fixed vs max) |
| `dbx-compute-admin-34` | PARSONS | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Init script setup to UC Volume via dbutils.fs.put |
| `dbx-compute-admin-35` | CLOZE_CODE | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | dbutils.fs.put for Volume init script placement |
| `dbx-compute-admin-36` | CLOZE_CODE | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | dbutils context tag extraction (getContext / tags) |
| `dbx-compute-admin-37` | PARSONS | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | dbutils.fs.put statement line ordering for volume init script |
| `dbx-compute-admin-38` | CLOZE_CODE | ADVANCED | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Cluster policy JSON dict fixed and max worker bounds |
| `platform-repos-1` | MULTIPLE_CHOICE | BEGINNER | `src/data/certificationQuestions.ts` | 🟢 Completed | Rewrote distractors to fix length ratio |
| `platform-repos-2` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Rewrote distractors to fix length ratio |
| `platform-repos-3` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Rewrote distractors to fix length ratio (was 3.07x) |
| `platform-cluster-1` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Rewrote distractors to fix length ratio (was 3.36x) |
| `platform-cluster-2` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Rewrote distractors to fix length ratio (was 2.34x) |
| `platform-cluster-3` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Rewrote distractors to fix length ratio |
| `platform-cluster-4` | MULTIPLE_CHOICE | ADVANCED | `src/data/certificationQuestions.ts` | 🟢 Completed | Rewrote distractors to fix length ratio (was 4.0x) |
| `platform-sql-1` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Removed prompt keyword leaks, added DESCRIBE DETAIL |
| `platform-sql-2` | CODING | BEGINNER | `src/data/certificationQuestions.ts` | 🟢 Completed | Standardized prompt & starter code |
| `platform-sql-3` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Removed prompt keyword leaks, added CREATE TEMP VIEW alternate |
| `catalog-1` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Equalized option length parity across all options |
| `catalog-2` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rotated correct option to `b` & added descriptions |
| `catalog-3` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Added IF NOT EXISTS solution alternate |
| `catalog-4` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Added IF NOT EXISTS solution alternate |
| `catalog-5` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Refined 3-level namespace prompt |
| `catalog-6` | CODING | ADVANCED | `src/data/expandedQuestions.ts` | 🟢 Completed | Refined prompt & added catalog.schema alternate |
| `catalog-7` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Refined catalog context prompt |
| `db-basic-1` | MULTIPLE_CHOICE | BEGINNER | `src/data/questions.ts` | 🟢 Completed | Equalized distractor length parity & rotated correct option |
| `db-basic-2` | MULTIPLE_CHOICE | BEGINNER | `src/data/questions.ts` | 🟢 Completed | Equalized distractor length parity & rotated correct option |
| `db-basic-3` | MULTIPLE_CHOICE | BEGINNER | `src/data/questions.ts` | 🟢 Completed | Equalized distractor length parity & rotated correct option |
| `db-basic-4` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/questions.ts` | 🟢 Completed | Equalized distractor length parity & rotated correct option |
| `db-basic-5` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/questions.ts` | 🟢 Completed | Equalized distractor length parity & rotated correct option |


### Storage Architecture, DBFS & Git Repos (`DATABRICKS_STORAGE_REPOS`)

| ID | Type | Difficulty | Source File | Status | Notes |
|---|---|---|---|---|---|
| `dbx-storage-repos-1` | MULTIPLE_CHOICE | BEGINNER | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Balanced option length ratio & rotated option to `b` |
| `dbx-storage-repos-2` | CODING | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Solved-first, removed keyword leak, added kwargs alternate |
| `dbx-storage-repos-3` | CODING | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Solved-first, removed keyword leak, standardized prompt |
| `dbx-storage-repos-4` | MULTIPLE_CHOICE | ADVANCED | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Equalized distractor length parity & rotated option to `a` |
| `dbx-storage-repos-5` | CODING | BEGINNER | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Solved-first, removed prompt leak, added dir= alternate |
| `dbx-storage-repos-6` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Equalized distractor length parity & rotated option to `c` |
| `dbx-storage-repos-7` | PARSONS | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Rephrased prompt to prevent keyword leak |
| `dbx-storage-repos-8` | MULTIPLE_CHOICE | BEGINNER | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Equalized distractor length parity & rotated option to `d` |
| `dbx-storage-repos-9` | CODING | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Solved-first, removed prompt leak, added maxBytes= alternate |
| `dbx-storage-repos-10` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `dbx-storage-repos-11` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Azure ADLS Gen2 abfss:// URI scheme direct storage access |
| `dbx-storage-repos-12` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Unity Catalog Azure Access Connector & User-Assigned Managed Identity |
| `dbx-storage-repos-13` | MULTIPLE_CHOICE | BEGINNER | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Azure Storage Account in managed resource group underpinning DBFS root |
| `dbx-storage-repos-14` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | FUSE local driver disk bottleneck vs native Spark parallel reading |
| `dbx-storage-repos-15` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Azure DevOps PAT and Azure AD User Token authentication for Repos |
| `dbx-storage-repos-16` | PREDICT_OUTPUT | BEGINNER | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | ADLS Gen2 URI scheme extraction trace (abfss) |
| `dbx-storage-repos-17` | PARSONS | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Relative module sys.path append & import in Git Repos |
| `dbx-storage-repos-18` | CLOZE_CODE | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | PySpark abfss:// Delta table read cloze template |
| `dbx-storage-repos-19` | CODING | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | PySpark abfss:// Parquet dataset read statement |
| `dbx-storage-repos-20` | CODING | ADVANCED | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Function to configure ADLS Gen2 Azure Service Principal OAuth Spark configs |


### Unity Catalog Foundations & Volumes (`UNITY_CATALOG_BASICS`)

| ID | Type | Difficulty | Source File | Status | Notes |
|---|---|---|---|---|---|
| `uc-basics-1` | MULTIPLE_CHOICE | BEGINNER | `src/data/unityCatalogQuestions.ts` | 🟢 Completed | Pedagogical prompt rephrase, equalized distractor length parity, rotated option to `c` |
| `uc-basics-2` | CODING | BEGINNER | `src/data/unityCatalogQuestions.ts` | 🟢 Completed | Solved-first, added catalog alternate solution, cleaned prompt wording |
| `uc-basics-3` | MULTIPLE_CHOICE | BEGINNER | `src/data/unityCatalogQuestions.ts` | 🟢 Completed | Balanced option length ratio (1.21x), rotated option to `d`, refined distractor quality |
| `uc-basics-4` | CODING | INTERMEDIATE | `src/data/unityCatalogQuestions.ts` | 🟢 Completed | Solved-first, removed prompt keywords, standardized starter comment |
| `uc-basics-5` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/unityCatalogQuestions.ts` | 🟢 Completed | Perfect option length parity across all 4 options, rotated option to `b` |
| `uc-basics-6` | CODING | INTERMEDIATE | `src/data/unityCatalogQuestions.ts` | 🟢 Completed | Refined 3-tier namespace prompt, standardized DDL starter code |
| `uc-basics-7` | CODING | BEGINNER | `src/data/unityCatalogQuestions.ts` | 🟢 Completed | Solved-first, removed prompt keyword leaks, added spark.table alternate |
| `uc-basics-8` | PARSONS | INTERMEDIATE | `src/data/unityCatalogQuestions.ts` | 🟢 Completed | Standardized 4-line shuffle & /Volumes/ distractor quality |
| `uc-basics-9` | PARSONS | INTERMEDIATE | `src/data/unityCatalogQuestions.ts` | 🟢 Completed | Audited 3-statement catalog context switching logic |
| `uc-basics-10` | MULTIPLE_CHOICE | ADVANCED | `src/data/unityCatalogQuestions.ts` | 🟢 Completed | Equalized distractor length parity (1.03x ratio) & rotated option to `a` |


### Notebook Mechanics, Secrets & Security (`DATABRICKS_NOTEBOOKS_SECURITY, DATABRICKS_UTILITIES`)

| ID | Type | Difficulty | Source File | Status | Notes |
|---|---|---|---|---|---|
| `dbx-notebooks-sec-1` | CLOZE_CODE | BEGINNER | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Audited %sql and %sh magic command blanks |
| `dbx-notebooks-sec-2` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Equalized distractor length parity (was 1.89x) & rotated option to `c` |
| `dbx-notebooks-sec-3` | CODING | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Solved-first, removed prompt leak, added kwargs solution alternate |
| `dbx-notebooks-sec-4` | CODING | BEGINNER | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Solved-first, removed prompt leak, added kwargs solution alternate |
| `dbx-notebooks-sec-5` | CODING | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Solved-first, removed prompt leak, added positional alternate |
| `dbx-notebooks-sec-6` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Equalized distractor length parity & rotated option to `a` |
| `dbx-notebooks-sec-7` | MULTIPLE_CHOICE | ADVANCED | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `d` |
| `dbx-notebooks-sec-8` | PARSONS | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Standardized prompt phrasing & 4-step sequence |
| `dbx-notebooks-sec-9` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Equalized distractor length parity (was 1.82x) & rotated option to `b` |
| `dbx-notebooks-sec-10` | CODING | BEGINNER | `src/data/databricksPlatformQuestions.ts` | 🟢 Completed | Solved-first, removed prompt leak, added kwargs solution alternate |
| `dbutils-1` | MULTIPLE_CHOICE | BEGINNER | `src/data/expandedQuestions.ts` | 🟢 Completed | Equalized distractor length parity (was 1.92x) & refined distractors |
| `dbutils-2` | CODING | BEGINNER | `src/data/expandedQuestions.ts` | 🟢 Completed | Solved-first, removed method leak from prompt/starter, added dir= alternate |
| `dbutils-3` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Solved-first, removed method leak from prompt/starter, added kwargs alternate |
| `dbutils-4` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Solved-first, removed method leak from prompt/starter, added kwargs alternate |
| `dbutils-5` | CODING | BEGINNER | `src/data/expandedQuestions.ts` | 🟢 Completed | Solved-first, removed method leak from prompt/starter, added recurse= alternate |
| `dbutils-6` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Solved-first, removed method leak from prompt/starter, standardized prompt |
| `dbutils-7` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Solved-first, removed method leak from prompt/starter, added maxBytes= alternate |
| `dbutils-8` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Solved-first, removed method leak from prompt/starter, added overwrite= alternate |
| `dbutils-9` | CODING | ADVANCED | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt to state behavioral credentials requirement cleanly |
| `dbutils-10` | CODING | BEGINNER | `src/data/expandedQuestions.ts` | 🟢 Completed | Solved-first, removed method leak from prompt/starter, added timeout_seconds= alternate |
| `dbutils-11` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Solved-first, removed method leak from prompt/starter, standardized params dict |
| `dbutils-12` | CODING | BEGINNER | `src/data/expandedQuestions.ts` | 🟢 Completed | Solved-first, removed method leak from prompt/starter, cleaned prompt |
| `dbutils-13` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Solved-first, removed method leak from prompt/starter, added defaultValue= alternate |
| `dbutils-14` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Solved-first, removed method leak from prompt/starter, standardized choices |
| `dbutils-15` | CODING | BEGINNER | `src/data/expandedQuestions.ts` | 🟢 Completed | Solved-first, removed method leak from prompt/starter, added name= alternate |
| `dbutils-16` | CODING | BEGINNER | `src/data/expandedQuestions.ts` | 🟢 Completed | Solved-first, removed method leak from prompt/starter, added name= alternate |
| `dbutils-17` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Solved-first, removed method leak from prompt/starter, added positional alternate |
| `dbutils-18` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Equalized distractor length parity across all options & rotated option to `c` |
| `dbutils-19` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Solved-first, removed method leak from prompt/starter, standardized prompt |
| `dbutils-20` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Solved-first, removed method leak from prompt/starter, added positional alternate |
| `dbutils-mount-2` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Solved-first, removed method leak from prompt/starter, standardized prompt |
| `dbutils-mount-3` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Solved-first, removed method leak from prompt/starter, added mount_point= alternate |


### Delta Lake Fundamentals (`DELTA_LAKE_BASICS`)

| ID | Type | Difficulty | Source File | Status | Notes |
|---|---|---|---|---|---|
| `delta-1` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Added visual schema preview table, rephrased prompt, added load(path, format=) alternate |
| `delta-2` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt to state overwrite requirement cleanly, added mode().format() alternate |


### Delta Operations (`DELTA_OPERATIONS`)

| ID | Type | Difficulty | Source File | Status | Notes |
|---|---|---|---|---|---|
| `delta-3` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt, cleaned starter code, added double-quote string alternate |
| `delta-4` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt to state stock=0 condition, updated explanation with tombstoning |
| `delta-5` | CODING | ADVANCED | `src/data/expandedQuestions.ts` | 🟢 Completed | Added visual source/target table schema & match flow, added table alias alternate |
| `delta-clone-1` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Equalized distractor length parity across options & rotated option to `b` |
| `delta-clone-2` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Standardized deep clone prompt, added CREATE OR REPLACE alternate |
| `delta-clone-3` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Standardized shallow clone prompt, added CREATE OR REPLACE alternate |
| `delta-clone-4` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Equalized distractor length parity across options & rotated option to `b` |
| `delta-merge-1` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Equalized distractor length parity across options & rotated option to `b` |
| `delta-merge-2` | CODING | ADVANCED | `src/data/expandedQuestions.ts` | 🟢 Completed | Added visual schema & match flow box, added single-line clause alternate |
| `delta-vacuum-1` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Equalized distractor length parity across options & rotated option to `a` |
| `delta-vacuum-2` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt, updated retention explanation with spark config details |
| `delta-vacuum-3` | CODING | ADVANCED | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt, updated explanation with 168 hours / 7 days details |
| `constraint-1` | CODING | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Rephrased prompt to state CHECK constraint requirement, updated explanation |
| `constraint-2` | CODING | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Rephrased prompt to state NOT NULL requirement, updated explanation |
| `constraint-3` | CODING | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Rephrased prompt to state DROP CONSTRAINT requirement, updated explanation |
| `constraint-4` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Equalized distractor length parity across options & rotated option to `a` |


### Delta Time Travel (`DELTA_TIME_TRAVEL`)

| ID | Type | Difficulty | Source File | Status | Notes |
|---|---|---|---|---|---|
| `delta-6` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt, added option().format() alternate |
| `delta-7` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt, added table@v10 shorthand syntax alternate |
| `restore-1` | CODING | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Rephrased prompt, added RESTORE orders syntax alternate |
| `restore-2` | CODING | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Rephrased prompt, added single-quoted timestamp alternate |
| `restore-3` | CODING | BEGINNER | `src/data/masteryQuestions.ts` | 🟢 Completed | Added visual command output preview table for DESCRIBE HISTORY |


### Delta Optimization (`DELTA_OPTIMIZATION`)

| ID | Type | Difficulty | Source File | Status | Notes |
|---|---|---|---|---|---|
| `delta-8` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt, updated explanation with ~1GB bin-packing compaction details |
| `delta-9` | CODING | ADVANCED | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt, added unparenthesized ZORDER BY alternate |
| `delta-optimize-1` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Equalized distractor length parity across options & rotated option to `c` |
| `delta-optimize-2` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt to state bin-packing compaction requirement |
| `delta-optimize-3` | CODING | ADVANCED | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt, added unparenthesized ZORDER BY alternate |
| `delta-optimize-4` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Equalized distractor length parity across options & rotated option to `c` |


## ELT with Spark SQL & Python

### DataFrame Basics (`PYSPARK_BASICS, PYSPARK_DATAFRAMES`)

| ID | Type | Difficulty | Source File | Status | Notes |
|---|---|---|---|---|---|
| `io-1` | CODING | BEGINNER | `src/data/masteryQuestions.ts` | 🟢 Completed | Rephrased prompt to state header/inferSchema requirement cleanly, added shorthand .csv() alternate |
| `io-2` | CODING | BEGINNER | `src/data/masteryQuestions.ts` | 🟢 Completed | Rephrased prompt to state overwrite requirement, added shorthand .parquet() alternate |
| `io-3` | CODING | BEGINNER | `src/data/masteryQuestions.ts` | 🟢 Completed | Rephrased prompt to state JSON load requirement, added format("json").load() alternate |
| `io-4` | CODING | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Rephrased prompt to state catalog table requirement, added spark.table() alternate |
| `io-5` | CODING | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Rephrased prompt to state append mode requirement, added saveAsTable() alternate |
| `io-6` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Equalized distractor length parity across all options & rotated option to `a` |
| `io-7` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Equalized option length parity across all choices & rotated option to `b` |
| `io-8` | CODING | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Rephrased prompt for pipe delimiter, added shorthand .csv(sep="|") alternate |
| `io-9` | CODING | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Rephrased prompt for SQL CSV table creation, added IF NOT EXISTS alternate |
| `schema-1` | CODING | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Added visual target schema table display to prompt, cleaned StructType solution |
| `schema-2` | CODING | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Added visual target input schema table display to prompt, added option order alternate |
| `schema-3` | CODING | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Added visual DDL format display to prompt, added single-quote alternate |
| `schema-4` | CODING | BEGINNER | `src/data/masteryQuestions.ts` | 🟢 Completed | Added visual console tree output preview display to prompt, updated explanation |
| `ps-basic-1` | MULTIPLE_CHOICE | BEGINNER | `src/data/questions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `d` |
| `ps-basic-2` | CODING | BEGINNER | `src/data/questions.ts` | 🟢 Completed | Rephrased prompt to state SparkSession creation requirement cleanly |
| `ps-basic-3` | CODING | BEGINNER | `src/data/questions.ts` | 🟢 Completed | Rephrased prompt for tuple list creation, added inline createDataFrame alternate |
| `ps-basic-4` | CODING | BEGINNER | `src/data/questions.ts` | 🟢 Completed | Rephrased prompt for CSV loading with header, added format("csv").load() alternate |
| `casewhen-1` | CODING | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Rephrased prompt for salary band logic, added df.salary attribute notation alternate |
| `casewhen-3` | CODING | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Rephrased prompt for age categorization, added df.age attribute notation alternate |
| `pivot-1` | CODING | ADVANCED | `src/data/masteryQuestions.ts` | 🟢 Completed | Rephrased prompt for quarterly revenue pivoting, added .agg({"revenue": "sum"}) alternate |
| `pivot-4` | CODING | ADVANCED | `src/data/masteryQuestions.ts` | 🟢 Completed | Rephrased prompt for explicit value pivot performance, added .agg() alternate |
| `cast-1` | CODING | BEGINNER | `src/data/masteryQuestions.ts` | 🟢 Completed | Rephrased prompt for price column double casting, added DoubleType() object alternate |
| `cast-3` | CODING | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Rephrased prompt for ISO date casting, added DateType() object alternate |
| `ps-df-1` | MULTIPLE_CHOICE | BEGINNER | `src/data/questions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `a` |
| `ps-df-2` | CODING | BEGINNER | `src/data/questions.ts` | 🟢 Completed | Rephrased prompt for column selection, added df.name/df.age column object alternate |
| `ps-df-3` | CODING | BEGINNER | `src/data/questions.ts` | 🟢 Completed | Rephrased prompt for row filtering, added .where() and string predicate alternates |
| `ps-df-4` | CODING | INTERMEDIATE | `src/data/questions.ts` | 🟢 Completed | Rephrased prompt for conditional column creation, added col("age") alternate |
| `ps-df-5` | CODING | INTERMEDIATE | `src/data/questions.ts` | 🟢 Completed | Rephrased prompt for department grouping count |
| `ps-df-6` | CODING | BEGINNER | `src/data/questions.ts` | 🟢 Completed | Added visual console tree schema output preview display to prompt |
| `ps-df-7` | CODING | BEGINNER | `src/data/questions.ts` | 🟢 Completed | Rephrased prompt for row count calculation |
| `ps-df-8` | CODING | INTERMEDIATE | `src/data/questions.ts` | 🟢 Completed | Rephrased prompt for column renaming |
| `ps-df-9` | CODING | INTERMEDIATE | `src/data/questions.ts` | 🟢 Completed | Rephrased prompt for dropping column |
| `ps-df-10` | CODING | INTERMEDIATE | `src/data/questions.ts` | 🟢 Completed | Rephrased prompt for distinct country value selection |
| `ps-df-11` | CODING | INTERMEDIATE | `src/data/questions.ts` | 🟢 Completed | Rephrased prompt for column sum calculation, added select(sum()) alternate |
| `ps-df-12` | CODING | INTERMEDIATE | `src/data/questions.ts` | 🟢 Completed | Rephrased prompt for null filling, added .na.fill() and dict map alternates |


### Transformations (`PYSPARK_TRANSFORMATIONS, PYSPARK_ACTIONS`)

| ID | Type | Difficulty | Source File | Status | Notes |
|---|---|---|---|---|---|
| `grouping-5` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for multi-aggregation grouping, added col() wrapper alternate |
| `grouping-6` | CODING | ADVANCED | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for collect_list array aggregation, added col() wrapper alternate |
| `grouping-7` | CODING | ADVANCED | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for collect_set unique array aggregation, added col() wrapper alternate |
| `crossjoin-1` | CODING | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Rephrased prompt for Cartesian product cross join, added .join(how="cross") alternate |
| `repart-1` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `b` |
| `repart-2` | CODING | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Rephrased prompt for partition scaling via repartition() |
| `ps-transform-1` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/questions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `b` |
| `ps-transform-3` | CODING | INTERMEDIATE | `src/data/questions.ts` | 🟢 Completed | Rephrased prompt for deduplication, added dropDuplicates() alternate |
| `ps-transform-4` | CODING | INTERMEDIATE | `src/data/questions.ts` | 🟢 Completed | Rephrased prompt for descending sort, added .sort() and df.salary.desc() alternates |
| `action-1` | MULTIPLE_CHOICE | BEGINNER | `src/data/masteryQuestions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `b` |
| `action-2` | MULTIPLE_CHOICE | BEGINNER | `src/data/masteryQuestions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `c` |
| `action-3` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `d` |
| `action-4` | CODING | BEGINNER | `src/data/masteryQuestions.ts` | 🟢 Completed | Rephrased prompt for show/count execution actions |
| `action-5` | CODING | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Rephrased prompt for driver row extraction, added head(n) alternate |


### String Functions (`STRING_FUNCTIONS`)

| ID | Type | Difficulty | Source File | Status | Notes |
|---|---|---|---|---|---|
| `string-1` | CODING | BEGINNER | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for lower() transformation, added col() wrapper alternate |
| `string-2` | CODING | BEGINNER | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for upper() transformation, added col() wrapper alternate |
| `string-3` | CODING | BEGINNER | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for string concatenation with space, added col() wrapper alternate |
| `string-4` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for concat_ws delimiter concatenation, added col() wrapper alternate |
| `string-5` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for substring extraction, added col() wrapper alternate |
| `string-6` | CODING | BEGINNER | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for whitespace trimming, added col() wrapper alternate |
| `string-7` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for string splitting to array, added col() wrapper alternate |
| `string-8` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for digit regex replacement, added \\d pattern alternate |
| `string-9` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for non-alphanumeric regex stripping, added col() wrapper alternate |
| `string-10` | CODING | ADVANCED | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for email domain regex extraction, added col() wrapper alternate |
| `string-11` | CODING | BEGINNER | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for string character length calculation, added col() wrapper alternate |


### Date & Time Functions (`DATETIME_FUNCTIONS`)

| ID | Type | Difficulty | Source File | Status | Notes |
|---|---|---|---|---|---|
| `datetime-1` | CODING | BEGINNER | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for current_date(), added select() projection alternate |
| `datetime-2` | CODING | BEGINNER | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for current_timestamp(), added select() projection alternate |
| `datetime-3` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for ISO date string parsing via to_date, added col() wrapper alternate |
| `datetime-4` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for timestamp string parsing via to_timestamp, added col() wrapper alternate |
| `datetime-5` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for date_add day offset, added col() wrapper alternate |
| `datetime-6` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for date_sub day subtraction, added col() wrapper alternate |
| `datetime-7` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for datediff interval calculation, added col() wrapper alternate |
| `datetime-8` | CODING | BEGINNER | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for year extraction, added col() wrapper alternate |
| `datetime-9` | CODING | BEGINNER | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for month extraction, added col() wrapper alternate |
| `datetime-10` | CODING | BEGINNER | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for dayofmonth extraction, added col() wrapper alternate |
| `datetime-11` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for date_format string formatting, added col() wrapper alternate |


### Collection Functions (`COLLECTION_FUNCTIONS`)

| ID | Type | Difficulty | Source File | Status | Notes |
|---|---|---|---|---|---|
| `collection-1` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for explode() array unnesting, added col() wrapper alternate |
| `collection-2` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for explode_outer() null preservation, added col() wrapper alternate |
| `collection-3` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for array_contains() membership filter, added col() wrapper alternate |
| `collection-4` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for array() creation, equalized option length parity |
| `collection-5` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for array_sort() ascending ordering, equalized option length parity |
| `collection-6` | MULTIPLE_CHOICE | BEGINNER | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for size() collection length, equalized option length parity |
| `collection-7` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for concat() array merging, equalized option length parity |
| `collection-8` | MULTIPLE_CHOICE | ADVANCED | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for flatten() 1D array unnesting, equalized option length parity |
| `collection-9` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for array vs struct distinction, equalized option length parity |


### Math & Aggregate Functions (`MATH_FUNCTIONS`)

| ID | Type | Difficulty | Source File | Status | Notes |
|---|---|---|---|---|---|
| `math-1` | CODING | BEGINNER | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for round() decimal scaling, added col() wrapper alternate |
| `math-2` | CODING | BEGINNER | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for ceil() upper integer rounding, added col() wrapper alternate |
| `math-3` | CODING | BEGINNER | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for abs() magnitude calculation, added col() wrapper alternate |
| `math-4` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for sqrt() root evaluation, added col() wrapper alternate |
| `math-5` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for pow() exponentiation with lit(), added col() wrapper alternate |
| `math-6` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for greatest() row-wise maximum, added col() wrapper alternate |


### Null Handling (`NULL_HANDLING`)

| ID | Type | Difficulty | Source File | Status | Notes |
|---|---|---|---|---|---|
| `null-1` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for coalesce() multi-column fallback, added col() wrapper alternate |
| `null-2` | CODING | BEGINNER | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for isNull() filtering, added col() and isnull() alternates |
| `null-3` | CODING | BEGINNER | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for isNotNull() filtering, added col() and isnotnull() alternates |
| `null-4` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for na.drop() / dropna() null stripping, added dropna() alternate |
| `null-5` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for na.drop(how="all") row stripping, added dropna(how="all") alternate |


### SQL Joins (`SQL_JOINS`)

| ID | Type | Difficulty | Source File | Status | Notes |
|---|---|---|---|---|---|
| `sql-join-1` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for inner join matching, added unaliased `-- OR` solution alternate |
| `sql-join-2` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for left join matching, added unaliased `-- OR` solution alternate |
| `sql-join-3` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for right join matching, added unaliased `-- OR` solution alternate |
| `sql-join-4` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for full outer join matching, added unaliased `-- OR` solution alternate |
| `sql-join-5` | CODING | ADVANCED | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased self-join prompt with concise table column specifications |
| `sql-join-6` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased PySpark left join prompt, added dictionary column syntax `# OR` alternate |
| `subq-3` | CODING | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Validated IN subquery semi-join equivalent prompt and solution |
| `subq-4` | CODING | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Validated NOT IN subquery anti-join logic and NULL filtering note |
| `subq-5` | CODING | ADVANCED | `src/data/masteryQuestions.ts` | 🟢 Completed | Validated NOT EXISTS anti-join subquery syntax and explanation |
| `subq-6` | CODING | ADVANCED | `src/data/masteryQuestions.ts` | 🟢 Completed | Validated derived table subquery ranking logic with ROW_NUMBER() |
| `ps-transform-2` | CODING | INTERMEDIATE | `src/data/questions.ts` | 🟢 Completed | Rephrased PySpark inner join prompt, added positional and implicit inner `# OR` alternates |
| `sql-predict-3` | PREDICT_OUTPUT | BEGINNER | `src/data/sparkSqlPredictOutputQuestions.ts` | 🟢 Completed | Verified inline CTE INNER JOIN row count prediction and explanation |
| `sql-predict-4` | PREDICT_OUTPUT | BEGINNER | `src/data/sparkSqlPredictOutputQuestions.ts` | 🟢 Completed | Verified inline CTE LEFT JOIN row count prediction and explanation |
| `sql-misc-mcq-5` | MULTIPLE_CHOICE | BEGINNER | `src/data/sqlMisconceptionMCQs.ts` | 🟢 Completed | Equalized MCQ distractor option lengths (< 1.4x ratio) and verified misconception tags |


### SQL Aggregations & GROUP BY (`SQL_AGGREGATIONS, SQL_SUBQUERIES`)

| ID | Type | Difficulty | Source File | Status | Notes |
|---|---|---|---|---|---|
| `grouping-1` | CODING | ADVANCED | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for ROLLUP subtotals, added unaliased `-- OR` solution alternate |
| `grouping-2` | CODING | ADVANCED | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for CUBE subtotal combinations, added unaliased `-- OR` solution alternate |
| `grouping-3` | CODING | ADVANCED | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for GROUPING SETS combinations, added unaliased `-- OR` solution alternate |
| `grouping-4` | CODING | INTERMEDIATE | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt for multi-column GROUP BY, added unaliased `-- OR` solution alternate |
| `sql-predict-2` | PREDICT_OUTPUT | BEGINNER | `src/data/sparkSqlPredictOutputQuestions.ts` | 🟢 Completed | Verified COUNT(*) vs COUNT(col) NULL handling output prediction and explanation |
| `sql-predict-5` | PREDICT_OUTPUT | INTERMEDIATE | `src/data/sparkSqlPredictOutputQuestions.ts` | 🟢 Completed | Verified GROUP BY with HAVING output prediction and explanation |
| `sql-predict-8` | PREDICT_OUTPUT | BEGINNER | `src/data/sparkSqlPredictOutputQuestions.ts` | 🟢 Completed | Verified aggregate without GROUP BY single-row output prediction |
| `sql-misc-mcq-2` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/sqlMisconceptionMCQs.ts` | 🟢 Completed | Equalized MCQ option lengths (< 1.4x ratio) for COUNT(col) NULL skipping misconception |
| `sql-misc-mcq-3` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/sqlMisconceptionMCQs.ts` | 🟢 Completed | Equalized MCQ option lengths (< 1.4x ratio) for WHERE vs HAVING misconception |
| `sql-misc-mcq-4` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/sqlMisconceptionMCQs.ts` | 🟢 Completed | Equalized MCQ option lengths (< 1.4x ratio) for ANSI SQL non-aggregated SELECT rule |


### Window Functions (`WINDOW_FUNCTIONS, SQL_WINDOW_FUNCTIONS`)

| ID | Type | Difficulty | Source File | Status | Notes |
|---|---|---|---|---|---|
| `window-1` | CODING | ADVANCED | `src/data/expandedQuestions.ts` | 🟢 Completed | Removed prompt method leaks, updated schema to emp_name, added desc() alternate |
| `window-2` | CODING | ADVANCED | `src/data/expandedQuestions.ts` | 🟢 Completed | Rephrased prompt to avoid method leaks, updated schema to emp_name, added col() desc alternate |
| `window-3` | CODING | ADVANCED | `src/data/expandedQuestions.ts` | 🟢 Completed | Fixed reserved word `date` to `sale_date`, rephrased prompt, added col() alternate |
| `window-4` | MULTIPLE_CHOICE | ADVANCED | `src/data/expandedQuestions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `b` |
| `window-5` | MULTIPLE_CHOICE | ADVANCED | `src/data/expandedQuestions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `a` |
| `window-6` | MULTIPLE_CHOICE | ADVANCED | `src/data/expandedQuestions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `d` |
| `window-adv-4` | MULTIPLE_CHOICE | ADVANCED | `src/data/expandedQuestions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `b` |
| `window-adv-5` | MULTIPLE_CHOICE | ADVANCED | `src/data/expandedQuestions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `a` |
| `winfn-1` | MULTIPLE_CHOICE | ADVANCED | `src/data/masteryQuestions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `c` |
| `winfn-2` | CODING | ADVANCED | `src/data/masteryQuestions.ts` | 🟢 Completed | Rephrased prompt to avoid method leaks, added col() orderBy solution alternate |
| `winfn-5` | MULTIPLE_CHOICE | ADVANCED | `src/data/masteryQuestions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `a` |
| `winfn-6` | CODING | ADVANCED | `src/data/masteryQuestions.ts` | 🟢 Completed | Rephrased prompt to state behavioral output requirement cleanly, added col() alternate |
| `window-adv-1` | CODING | ADVANCED | `src/data/expandedQuestions.ts` | 🟢 Completed | Fixed reserved word `name` to `emp_name`, added explicit select SQL `-- OR` alternate |
| `window-adv-2` | CODING | ADVANCED | `src/data/expandedQuestions.ts` | 🟢 Completed | Cleaned starter code hints, added default window frame SQL `-- OR` alternate |
| `window-adv-3` | CODING | ADVANCED | `src/data/expandedQuestions.ts` | 🟢 Completed | Cleaned starter code hints, added explicit column select SQL `-- OR` alternate |
| `winfn-3` | CODING | ADVANCED | `src/data/masteryQuestions.ts` | 🟢 Completed | Cleaned starter code hints, added single-line clause SQL `-- OR` alternate |
| `winfn-4` | CODING | ADVANCED | `src/data/masteryQuestions.ts` | 🟢 Completed | Cleaned starter code hints, changed SQL `# OR` to `-- OR` alternate |


### Spark SQL & Set Operations (`SPARK_SQL, SQL_SET_OPERATIONS`)

| ID | Type | Difficulty | Source File | Status | Notes |
|---|---|---|---|---|---|
| `casewhen-2` | CODING | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Fixed reserved word status to order_status, cleaned starter code, added single-line -- OR alternate |
| `casewhen-4` | CODING | ADVANCED | `src/data/masteryQuestions.ts` | 🟢 Completed | Cleaned starter code, added explicit decimal percentage -- OR alternate |
| `cte-1` | CODING | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Fixed reserved word name to emp_name, cleaned starter code, added explicit column select -- OR alternate |
| `cte-2` | CODING | ADVANCED | `src/data/masteryQuestions.ts` | 🟢 Completed | Cleaned starter code, added explicit column select -- OR alternate |
| `cte-3` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `b` |
| `pivot-2` | CODING | ADVANCED | `src/data/masteryQuestions.ts` | 🟢 Completed | Rephrased prompt to state behavioral requirements cleanly, cleaned starter code, added single-line PIVOT -- OR alternate |
| `pivot-3` | CODING | ADVANCED | `src/data/masteryQuestions.ts` | 🟢 Completed | Cleaned starter code, added single-quote label -- OR alternate |
| `pivot-5` | CODING | ADVANCED | `src/data/masteryQuestions.ts` | 🟢 Completed | Rephrased prompt to state unpivot requirement cleanly, cleaned starter code, added single-quote label -- OR alternate |
| `pivot-6` | CODING | ADVANCED | `src/data/masteryQuestions.ts` | 🟢 Completed | Rephrased prompt to state pivot requirements cleanly, cleaned starter code, added single-line PIVOT -- OR alternate |
| `cast-2` | CODING | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Cleaned starter code, added lowercase double -- OR alternate |
| `crossjoin-2` | CODING | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Cleaned starter code, added unaliased column -- OR alternate |
| `sql-1` | CODING | BEGINNER | `src/data/questions.ts` | 🟢 Completed | Fixed reserved word name to emp_name, added double-quote string -- OR alternate |
| `sql-2` | CODING | BEGINNER | `src/data/questions.ts` | 🟢 Completed | Removed method leak from starter code, added createTempView # OR alternate |
| `sql-3` | CODING | INTERMEDIATE | `src/data/questions.ts` | 🟢 Completed | Rephrased prompt for avg_salary column alias, added uppercase AS -- OR alternate |
| `sql-4` | CODING | INTERMEDIATE | `src/data/questions.ts` | 🟢 Completed | Rephrased prompt to state subquery filtering requirement cleanly, cleaned starter code, added explicit select -- OR alternate |
| `sql-5` | CODING | INTERMEDIATE | `src/data/questions.ts` | 🟢 Completed | Fixed reserved word name to emp_name, added explicit column select -- OR alternate |
| `sql-6` | CODING | INTERMEDIATE | `src/data/questions.ts` | 🟢 Completed | Fixed reserved word name to emp_name, added employee_count alias in HAVING -- OR alternate |
| `sql-7` | CODING | ADVANCED | `src/data/questions.ts` | 🟢 Completed | Rephrased prompt for running_total column alias, added explicit window frame -- OR alternate |
| `sql-predict-1` | PREDICT_OUTPUT | BEGINNER | `src/data/sparkSqlPredictOutputQuestions.ts` | 🟢 Completed | Fixed reserved word name to username |
| `sql-predict-6` | PREDICT_OUTPUT | BEGINNER | `src/data/sparkSqlPredictOutputQuestions.ts` | 🟢 Completed | Verified inline CTE arithmetic with NULL output prediction and explanation |
| `sql-predict-7` | PREDICT_OUTPUT | INTERMEDIATE | `src/data/sparkSqlPredictOutputQuestions.ts` | 🟢 Completed | Fixed reserved word name to product_name |
| `sql-predict-9` | PREDICT_OUTPUT | INTERMEDIATE | `src/data/sparkSqlPredictOutputQuestions.ts` | 🟢 Completed | Fixed reserved words user/day to user_id/visit_date |
| `sql-predict-10` | PREDICT_OUTPUT | INTERMEDIATE | `src/data/sparkSqlPredictOutputQuestions.ts` | 🟢 Completed | Verified LIMIT cardinality output prediction and explanation |
| `sql-misc-mcq-1` | MULTIPLE_CHOICE | BEGINNER | `src/data/sqlMisconceptionMCQs.ts` | 🟢 Completed | Equalized MCQ option lengths (< 1.4x ratio) and verified IS NULL vs = NULL misconception tags |
| `sql-misc-mcq-6` | MULTIPLE_CHOICE | BEGINNER | `src/data/sqlMisconceptionMCQs.ts` | 🟢 Completed | Fixed reserved word status to account_status, equalized option length parity, rotated option to `b` |
| `sql-misc-mcq-7` | MULTIPLE_CHOICE | BEGINNER | `src/data/sqlMisconceptionMCQs.ts` | 🟢 Completed | Fixed reserved word name to emp_name, equalized option length parity, rotated option to `c` |
| `setop-1` | CODING | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Rephrased prompt, cleaned starter code, added explicit column select -- OR alternate |
| `setop-2` | CODING | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Rephrased prompt, cleaned starter code, added explicit column select -- OR alternate |
| `setop-3` | CODING | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Rephrased prompt, cleaned starter code, added explicit column select -- OR alternate |
| `setop-4` | CODING | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Rephrased prompt, cleaned starter code, added explicit column select -- OR alternate |
| `setop-5` | CODING | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Fixed reserved word name to user_name, removed method leak from starter code |


## Incremental Data Processing

### Structured Streaming (`STRUCTURED_STREAMING`)

| ID | Type | Difficulty | Source File | Status | Notes |
|---|---|---|---|---|---|
| `streaming-1` | MULTIPLE_CHOICE | BEGINNER | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `c` |
| `streaming-2` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Standardized option lengths & rotated option to `d` |
| `streaming-3` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Removed prompt keyword leaks, added shorthand .table() `# OR` alternate |
| `streaming-4` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Removed method leak from starter code, added unformatted `.writeStream` `# OR` alternate |
| `streaming-5` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `a` |
| `streaming-6` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `b` |
| `streaming-7` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Added clean starter code, stateful prompt phrasing, added `# OR` alternate |
| `streaming-8` | CODING | ADVANCED | `src/data/certificationQuestions.ts` | 🟢 Completed | Made prompt prose-only, cleaned starter code, added `# OR` alternate |
| `streaming-9` | MULTIPLE_CHOICE | ADVANCED | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `c` |
| `streaming-10` | CODING | ADVANCED | `src/data/certificationQuestions.ts` | 🟢 Completed | Rephrased prompt to avoid method leaks, added single-quote `# OR` alternate |
| `streaming-11` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `d` |
| `streaming-12` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Removed solution code block leak from prompt, added shorthand .json() `# OR` alternate |
| `streaming-13` | MULTIPLE_CHOICE | ADVANCED | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `b` |
| `stream-adv-1` | MULTIPLE_CHOICE | ADVANCED | `src/data/masteryQuestions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `b` |
| `stream-adv-2` | MULTIPLE_CHOICE | ADVANCED | `src/data/masteryQuestions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `d` |
| `stream-adv-3` | CODING | ADVANCED | `src/data/masteryQuestions.ts` | 🟢 Completed | Cleaned starter code, added string window column `# OR` alternate |
| `stream-adv-4` | CODING | ADVANCED | `src/data/masteryQuestions.ts` | 🟢 Completed | Rephrased prompt to avoid method leaks, added un-arrayed dropDuplicates `# OR` alternate |
| `stream-adv-5` | MULTIPLE_CHOICE | ADVANCED | `src/data/masteryQuestions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `a` |
| `stream-adv-6` | MULTIPLE_CHOICE | ADVANCED | `src/data/masteryQuestions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `c` |
| `stream-adv-7` | CODING | ADVANCED | `src/data/masteryQuestions.ts` | 🟢 Completed | Fixed variable reference bug (`impressions.ad_id`), added uppercase `INTERVAL` `# OR` alternate |
| `stream-adv-8` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `b` |


### Auto Loader (`AUTO_LOADER`)

| ID | Type | Difficulty | Source File | Status | Notes |
|---|---|---|---|---|---|
| `autoloader-1` | MULTIPLE_CHOICE | BEGINNER | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `b` |
| `autoloader-2` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Removed prompt hints, cleaned starter code, added option ordering `# OR` alternate |
| `autoloader-3` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `c` |
| `autoloader-4` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `d` |
| `autoloader-5` | CODING | ADVANCED | `src/data/certificationQuestions.ts` | 🟢 Completed | Rephrased prompt to prose-only, cleaned starter code, added `# OR` alternate |
| `autoloader-6` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `a` |
| `autoloader-7` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Removed prompt code leak, cleaned starter code, added boolean `True` `# OR` alternate |


### Medallion Architecture (`MEDALLION_ARCHITECTURE`)

| ID | Type | Difficulty | Source File | Status | Notes |
|---|---|---|---|---|---|
| `medallion-1` | MULTIPLE_CHOICE | BEGINNER | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `a` |
| `medallion-2` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `c` |
| `medallion-3` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `d` |
| `medallion-4` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `b` |
| `medallion-5` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Rephrased prompt to prose-only, added QUALIFY `-- OR` alternate |
| `medallion-6` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Rephrased prompt, added `-- OR` alternate |
| `medallion-7` | MULTIPLE_CHOICE | ADVANCED | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `a` |
| `medallion-8` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `c` |
| `medallion-9` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Removed prompt code leak, cleaned starter code, added `# OR` alternate |
| `medallion-10` | CODING | ADVANCED | `src/data/certificationQuestions.ts` | 🟢 Completed | Rephrased prompt to prose-only, cleaned starter code, added `# OR` alternate |


### Change Data Capture (`CHANGE_DATA_CAPTURE`)

| ID | Type | Difficulty | Source File | Status | Notes |
|---|---|---|---|---|---|
| `cdc-1` | MULTIPLE_CHOICE | BEGINNER | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `c` |
| `cdc-2` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `a` |
| `cdc-3` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Removed prompt hints, cleaned starter code, added `-- OR` alternate |
| `cdc-4` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Removed prompt column leaks, cleaned starter code, added `-- OR` alternate |
| `cdc-5` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Removed prompt option leaks, cleaned starter code, added `# OR` alternate |
| `cdc-6` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity across choices & rotated option to `b` |
| `cdc-7` | CODING | ADVANCED | `src/data/certificationQuestions.ts` | 🟢 Completed | Rephrased prompt to prose-only, cleaned starter code, added `-- OR` alternate |
| `cdc-8` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Rephrased prompt, cleaned starter code, added `-- OR` alternate |


## Production Pipelines

### Delta Live Tables (`DELTA_LIVE_TABLES`)

| ID | Type | Difficulty | Source File | Status | Notes |
|---|---|---|---|---|---|
| `dlt-1` | MULTIPLE_CHOICE | BEGINNER | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized distractor length parity & rotated option to `b` |
| `dlt-2` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized distractor length parity & rotated option to `c` |
| `dlt-3` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Removed prompt keyword leaks, added syntax alternates |
| `dlt-4` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Made prompt prose-only, cleaned starter code, added `# OR` alternate |
| `dlt-5` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Removed prompt keyword leaks, added `-- OR` solution alternates |
| `dlt-6` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Rephrased prompt to state constraint behavior, added `-- OR` solution alternates |
| `dlt-7` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized distractor length parity & rotated option to `a` |
| `dlt-8` | CODING | ADVANCED | `src/data/certificationQuestions.ts` | 🟢 Completed | Made prompt prose-only for ADVANCED difficulty, cleaned starter code, added `# OR` alternate |
| `dlt-9` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `d` |
| `dlt-10` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Removed prompt syntax dump, added `-- OR` solution alternates |
| `dlt-11` | MULTIPLE_CHOICE | ADVANCED | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `c` |
| `dlt-12` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |


### Workflows & Job Orchestration (`DATABRICKS_WORKFLOWS`)

| ID | Type | Difficulty | Source File | Status | Notes |
|---|---|---|---|---|---|
| `workflow-1` | MULTIPLE_CHOICE | BEGINNER | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized distractor length parity & rotated option to `c` |
| `workflow-2` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized distractor length parity & rotated option to `a` |
| `workflow-3` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized distractor length parity & rotated option to `b` |
| `workflow-4` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized distractor length parity & rotated option to `c` |
| `workflow-5` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized distractor length parity & rotated option to `a` |
| `workflow-6` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized distractor length parity & rotated option to `a` |
| `workflow-7` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Rephrased prompt to remove widget method leaks, added single-quote solution alternate |
| `workflow-8` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Rephrased prompt to state string exit requirements cleanly, added f-string solution alternate |
| `workflow-9` | MULTIPLE_CHOICE | ADVANCED | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized distractor length parity & rotated option to `c` |
| `workflow-10` | CODING | ADVANCED | `src/data/certificationQuestions.ts` | 🟢 Completed | Rephrased prompt to prose-only for ADVANCED difficulty, added positional kwarg solution alternate |
| `workflow-11` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized distractor length parity & rotated option to `b` |


## Optimization & Advanced

### Spark Optimization (`SPARK_OPTIMIZATION`)

| ID | Type | Difficulty | Source File | Status | Notes |
|---|---|---|---|---|---|
| `perf-1` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `b` |
| `perf-2` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Cleaned starter code, added keyword argument solution alternate |
| `perf-3` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `perf-4` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Cleaned starter code, added `numPartitions=` solution alternate |
| `perf-5` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Cleaned starter code, added `col()` solution alternates |
| `perf-6` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `b` |
| `perf-7` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `c` |
| `perf-8` | MULTIPLE_CHOICE | ADVANCED | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `b` |
| `perf-9` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Rephrased prompt to state aggregation requirements cleanly, added unassigned `df.cache()` solution alternate |
| `perf-10` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Rephrased prompt, added `blocking=True` solution alternate |
| `perf-11` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `b` |
| `perf-12` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Removed prompt method leak comments, added method chain order solution alternate |
| `perf-13` | MULTIPLE_CHOICE | ADVANCED | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `b` |
| `perf-14` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `perf-15` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Rephrased prompt, added string value solution alternate |
| `perf-16` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `c` |
| `perf-17` | MULTIPLE_CHOICE | ADVANCED | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `b` |
| `perf-18` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Rephrased prompt, added `on=` and multi-statement solution alternates |
| `perf-19` | MULTIPLE_CHOICE | ADVANCED | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `perf-20` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `b` |
| `ps-advanced-3` | CODING | ADVANCED | `src/data/questions.ts` | 🟢 Completed | Rephrased prompt, cleaned starter code, added `persist()` and unassigned solution alternates |


### Advanced Concepts (`ADVANCED_TOPICS`)

| ID | Type | Difficulty | Source File | Status | Notes |
|---|---|---|---|---|---|
| `udf-1` | CODING | INTERMEDIATE | `src/data/masteryQuestions.ts` | 🟢 Completed | Cleaned starter code, added `@udf` decorator solution alternate |
| `udf-2` | CODING | ADVANCED | `src/data/masteryQuestions.ts` | 🟢 Completed | Rephrased prompt to state columns cleanly, added lambda UDF solution alternate |
| `udf-3` | MULTIPLE_CHOICE | ADVANCED | `src/data/masteryQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `d` |
| `udf-4` | CODING | ADVANCED | `src/data/masteryQuestions.ts` | 🟢 Completed | Cleaned starter code, added `col()` solution alternate |
| `ps-advanced-1` | MULTIPLE_CHOICE | ADVANCED | `src/data/questions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `c` |
| `ps-advanced-2` | CODING | ADVANCED | `src/data/questions.ts` | 🟢 Completed | Cleaned starter code, added `col().desc()` solution alternate |
| `ps-advanced-4` | CODING | ADVANCED | `src/data/questions.ts` | 🟢 Completed | Cleaned starter code, added single-line `expr()` solution alternate |


## Data Governance

### Access Controls & Privileges (`DATA_GOVERNANCE`)

| ID | Type | Difficulty | Source File | Status | Notes |
|---|---|---|---|---|---|
| `governance-1` | MULTIPLE_CHOICE | BEGINNER | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `c` |
| `governance-2` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `d` |
| `governance-3` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Cleaned starter code, added un-prefixed `sales.orders` solution alternate |
| `governance-4` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Cleaned starter code, added `GRANT ALL` solution alternate |
| `governance-5` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Cleaned starter code, added un-prefixed `production.customers` solution alternate |
| `governance-6` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Rephrased prompt to state schema query cleanly |
| `governance-7` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Cleaned starter code, added `IF NOT EXISTS` solution alternate |
| `governance-8` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Cleaned starter code, added `IF NOT EXISTS` solution alternate |
| `governance-9` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `governance-10` | MULTIPLE_CHOICE | ADVANCED | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `b` |
| `governance-11` | CODING | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Cleaned starter code, added permission order solution alternate |
| `governance-12` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/certificationQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `c` |


### Unity Catalog Governance (`UNITY_CATALOG_GOVERNANCE`)

| ID | Type | Difficulty | Source File | Status | Notes |
|---|---|---|---|---|---|
| `uc-gov-1` | MULTIPLE_CHOICE | BEGINNER | `src/data/unityCatalogQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `uc-gov-2` | CODING | BEGINNER | `src/data/unityCatalogQuestions.ts` | 🟢 Completed | Cleaned starter code, added un-prefixed `main.gold.metrics` solution alternate |
| `uc-gov-3` | CODING | INTERMEDIATE | `src/data/unityCatalogQuestions.ts` | 🟢 Completed | Cleaned starter code, added un-prefixed `main.gold` solution alternate |
| `uc-gov-4` | CODING | INTERMEDIATE | `src/data/unityCatalogQuestions.ts` | 🟢 Completed | Cleaned starter code, added un-prefixed `main.raw.landing` solution alternate |
| `uc-gov-5` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/unityCatalogQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `uc-gov-6` | CODING | ADVANCED | `src/data/unityCatalogQuestions.ts` | 🟢 Completed | Cleaned starter code, verified syntax |
| `uc-gov-7` | MULTIPLE_CHOICE | ADVANCED | `src/data/unityCatalogQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `b` |
| `uc-gov-8` | PARSONS | ADVANCED | `src/data/unityCatalogQuestions.ts` | 🟢 Completed | Cleaned Parsons distractors & order |
| `uc-gov-9` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/unityCatalogQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `uc-gov-10` | MULTIPLE_CHOICE | ADVANCED | `src/data/unityCatalogQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |


## Data Modeling & Warehousing Design

### Dimensional Modeling (`DATA_MODELING`)

| ID | Type | Difficulty | Source File | Status | Notes |
|---|---|---|---|---|---|
| `dm-mcq-1` | MULTIPLE_CHOICE | BEGINNER | `src/data/dataModelingQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `dm-mcq-2` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/dataModelingQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `dm-mcq-3` | MULTIPLE_CHOICE | BEGINNER | `src/data/dataModelingQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `b` |
| `dm-mcq-4` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/dataModelingQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `dm-mcq-5` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/dataModelingQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `dm-mcq-6` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/dataModelingQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `dm-mcq-7` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/dataModelingQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `dm-coding-1` | CODING | INTERMEDIATE | `src/data/dataModelingQuestions.ts` | 🟢 Completed | Cleaned starter code, added `IF NOT EXISTS` solution alternate |


### Slowly Changing Dimensions (`SCD_PATTERNS`)

| ID | Type | Difficulty | Source File | Status | Notes |
|---|---|---|---|---|---|
| `scd-mcq-1` | MULTIPLE_CHOICE | BEGINNER | `src/data/dataModelingQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `scd-mcq-2` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/dataModelingQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `scd-coding-1` | CODING | INTERMEDIATE | `src/data/dataModelingQuestions.ts` | 🟢 Completed | Cleaned starter code, added `INSERT *` solution alternate |
| `scd-coding-2` | CODING | ADVANCED | `src/data/dataModelingQuestions.ts` | 🟢 Completed | Cleaned prompt and starter code |
| `scd-mcq-3` | MULTIPLE_CHOICE | ADVANCED | `src/data/dataModelingQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `scd-parsons-1` | PARSONS | INTERMEDIATE | `src/data/dataModelingQuestions.ts` | 🟢 Completed | Cleaned Parsons distractors |


### Pipeline Design (`PIPELINE_DESIGN`)

| ID | Type | Difficulty | Source File | Status | Notes |
|---|---|---|---|---|---|
| `pd-mcq-1` | MULTIPLE_CHOICE | BEGINNER | `src/data/dataModelingQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `pd-mcq-2` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/dataModelingQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `pd-mcq-3` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/dataModelingQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `pd-mcq-4` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/dataModelingQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `pd-coding-1` | CODING | INTERMEDIATE | `src/data/dataModelingQuestions.ts` | 🟢 Completed | Cleaned starter code, added un-aliased MERGE solution alternate |
| `pd-mcq-5` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/dataModelingQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |


## Lakehouse Architecture & Engineering Practice

### Gold Layer & Multi-Hop Pipeline Design (`GOLD_LAYER_DESIGN`)

| ID | Type | Difficulty | Source File | Status | Notes |
|---|---|---|---|---|---|
| `gld-mcq-b1` | MULTIPLE_CHOICE | BEGINNER | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `gld-mcq-b2` | MULTIPLE_CHOICE | BEGINNER | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `b` |
| `gld-mcq-b3` | MULTIPLE_CHOICE | BEGINNER | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `c` |
| `gld-mcq-b4` | MULTIPLE_CHOICE | BEGINNER | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `d` |
| `gld-mcq-b5` | MULTIPLE_CHOICE | BEGINNER | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `gld-predict-1` | PREDICT_OUTPUT | INTERMEDIATE | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Audited deterministic Python predict output trace |
| `gld-predict-2` | PREDICT_OUTPUT | INTERMEDIATE | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Audited deterministic Python predict output trace |
| `gld-predict-3` | PREDICT_OUTPUT | INTERMEDIATE | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Audited deterministic Python predict output trace |
| `gld-predict-4` | PREDICT_OUTPUT | INTERMEDIATE | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Audited deterministic Python predict output trace |
| `gld-predict-5` | PREDICT_OUTPUT | INTERMEDIATE | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Audited deterministic Python predict output trace |
| `gld-predict-6` | PREDICT_OUTPUT | INTERMEDIATE | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Audited deterministic Python predict output trace |
| `gld-mcq-i1` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `gld-mcq-i2` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `gld-mcq-i3` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `gld-mcq-i4` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `gld-mcq-i5` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `gld-mcq-i6` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `gld-mcq-a1` | MULTIPLE_CHOICE | ADVANCED | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `gld-mcq-a2` | MULTIPLE_CHOICE | ADVANCED | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `b` |
| `gld-mcq-a3` | MULTIPLE_CHOICE | ADVANCED | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `c` |
| `gld-mcq-a4` | MULTIPLE_CHOICE | ADVANCED | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `gld-mcq-a5` | MULTIPLE_CHOICE | ADVANCED | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `b` |
| `gld-mcq-a6` | MULTIPLE_CHOICE | ADVANCED | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `d` |
| `gld-mcq-a7` | MULTIPLE_CHOICE | ADVANCED | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `gld-mcq-a8` | MULTIPLE_CHOICE | ADVANCED | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `d` |
| `gld-mcq-a9` | MULTIPLE_CHOICE | ADVANCED | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `gld-mcq-a10` | MULTIPLE_CHOICE | ADVANCED | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `gld-mcq-a11` | MULTIPLE_CHOICE | ADVANCED | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `b` |
| `gld-mcq-a12` | MULTIPLE_CHOICE | ADVANCED | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `gld-mcq-a13` | MULTIPLE_CHOICE | ADVANCED | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `gld-mcq-a14` | MULTIPLE_CHOICE | ADVANCED | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `gld-mcq-a15` | MULTIPLE_CHOICE | ADVANCED | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `gld-mcq-a16` | MULTIPLE_CHOICE | ADVANCED | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `gld-mcq-a17` | MULTIPLE_CHOICE | ADVANCED | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `gld-mcq-a18` | MULTIPLE_CHOICE | ADVANCED | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `gld-mcq-disc1` | MULTIPLE_CHOICE | ADVANCED | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `gld-coding-1` | CODING | ADVANCED | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Cleaned prompt and starter code, added solution alternate |
| `gld-coding-2` | CODING | ADVANCED | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Cleaned prompt and starter code, added solution alternate |
| `gld-parsons-1` | PARSONS | INTERMEDIATE | `src/data/goldLayerDesignQuestions.ts` | 🟢 Completed | Cleaned Parsons distractors and syntax |


### Ingestion & Partitioning Architecture (`INGESTION_ARCHITECTURE`)

| ID | Type | Difficulty | Source File | Status | Notes |
|---|---|---|---|---|---|
| `ing-mcq-b1` | MULTIPLE_CHOICE | BEGINNER | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `ing-mcq-b2` | MULTIPLE_CHOICE | BEGINNER | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `ing-mcq-b3` | MULTIPLE_CHOICE | BEGINNER | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `ing-mcq-b4` | MULTIPLE_CHOICE | BEGINNER | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `ing-mcq-b5` | MULTIPLE_CHOICE | BEGINNER | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `ing-predict-1` | PREDICT_OUTPUT | INTERMEDIATE | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Audited deterministic Python predict output trace |
| `ing-predict-2` | PREDICT_OUTPUT | INTERMEDIATE | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Audited deterministic Python predict output trace |
| `ing-predict-3` | PREDICT_OUTPUT | INTERMEDIATE | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Audited deterministic Python predict output trace |
| `ing-predict-4` | PREDICT_OUTPUT | INTERMEDIATE | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Audited deterministic Python predict output trace |
| `ing-predict-5` | PREDICT_OUTPUT | INTERMEDIATE | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Audited deterministic Python predict output trace |
| `ing-predict-6` | PREDICT_OUTPUT | INTERMEDIATE | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Audited deterministic Python predict output trace |
| `ing-mcq-i1` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `ing-mcq-i2` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `ing-mcq-i3` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `ing-mcq-i4` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `ing-mcq-i5` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `ing-mcq-i6` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `ing-mcq-a1` | MULTIPLE_CHOICE | ADVANCED | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `ing-mcq-a2` | MULTIPLE_CHOICE | ADVANCED | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `ing-mcq-a3` | MULTIPLE_CHOICE | ADVANCED | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `ing-mcq-a4` | MULTIPLE_CHOICE | ADVANCED | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `ing-mcq-a5` | MULTIPLE_CHOICE | ADVANCED | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `ing-mcq-a6` | MULTIPLE_CHOICE | ADVANCED | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `ing-mcq-a7` | MULTIPLE_CHOICE | ADVANCED | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `ing-mcq-a8` | MULTIPLE_CHOICE | ADVANCED | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `ing-mcq-a9` | MULTIPLE_CHOICE | ADVANCED | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `ing-mcq-a10` | MULTIPLE_CHOICE | ADVANCED | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `ing-mcq-a11` | MULTIPLE_CHOICE | ADVANCED | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `ing-mcq-a12` | MULTIPLE_CHOICE | ADVANCED | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `ing-mcq-a13` | MULTIPLE_CHOICE | ADVANCED | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `ing-mcq-a14` | MULTIPLE_CHOICE | ADVANCED | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `ing-mcq-a15` | MULTIPLE_CHOICE | ADVANCED | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `ing-mcq-a16` | MULTIPLE_CHOICE | ADVANCED | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `ing-mcq-a17` | MULTIPLE_CHOICE | ADVANCED | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `ing-mcq-a18` | MULTIPLE_CHOICE | ADVANCED | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `ing-mcq-disc1` | MULTIPLE_CHOICE | ADVANCED | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `ing-coding-1` | CODING | ADVANCED | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Cleaned prompt and starter code, added solution alternate |
| `ing-coding-2` | CODING | ADVANCED | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Cleaned prompt and starter code, added solution alternate |
| `ing-parsons-1` | PARSONS | INTERMEDIATE | `src/data/ingestionArchitectureQuestions.ts` | 🟢 Completed | Cleaned Parsons distractors and syntax |


### Orchestration & Data-Quality Design (`ORCHESTRATION_DESIGN`)

| ID | Type | Difficulty | Source File | Status | Notes |
|---|---|---|---|---|---|
| `orc-mcq-b1` | MULTIPLE_CHOICE | BEGINNER | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `orc-mcq-b2` | MULTIPLE_CHOICE | BEGINNER | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `orc-mcq-b3` | MULTIPLE_CHOICE | BEGINNER | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `orc-mcq-b4` | MULTIPLE_CHOICE | BEGINNER | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `orc-mcq-b5` | MULTIPLE_CHOICE | BEGINNER | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Equalized option length parity |
| `orc-mcq-b6` | MULTIPLE_CHOICE | BEGINNER | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `orc-predict-1` | PREDICT_OUTPUT | INTERMEDIATE | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Verified code, output, and explanation |
| `orc-predict-2` | PREDICT_OUTPUT | INTERMEDIATE | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Verified code, output, and explanation |
| `orc-predict-3` | PREDICT_OUTPUT | INTERMEDIATE | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Verified code, output, and explanation |
| `orc-predict-4` | PREDICT_OUTPUT | INTERMEDIATE | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Verified code, output, and explanation |
| `orc-predict-5` | PREDICT_OUTPUT | INTERMEDIATE | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Verified code, output, and explanation |
| `orc-predict-6` | PREDICT_OUTPUT | INTERMEDIATE | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Verified code, output, and explanation |
| `orc-mcq-i1` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `orc-mcq-i2` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `orc-mcq-i3` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Equalized option length parity |
| `orc-mcq-i4` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `orc-mcq-i5` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `orc-mcq-i6` | MULTIPLE_CHOICE | INTERMEDIATE | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `orc-mcq-a1` | MULTIPLE_CHOICE | ADVANCED | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Equalized option length parity |
| `orc-mcq-a2` | MULTIPLE_CHOICE | ADVANCED | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `orc-mcq-a3` | MULTIPLE_CHOICE | ADVANCED | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `orc-mcq-a4` | MULTIPLE_CHOICE | ADVANCED | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `orc-mcq-a5` | MULTIPLE_CHOICE | ADVANCED | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Equalized option length parity |
| `orc-mcq-a6` | MULTIPLE_CHOICE | ADVANCED | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `orc-mcq-a7` | MULTIPLE_CHOICE | ADVANCED | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `orc-mcq-a8` | MULTIPLE_CHOICE | ADVANCED | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `a` |
| `orc-mcq-a9` | MULTIPLE_CHOICE | ADVANCED | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Equalized option length parity |
| `orc-mcq-a10` | MULTIPLE_CHOICE | ADVANCED | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `b` |
| `orc-mcq-a11` | MULTIPLE_CHOICE | ADVANCED | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `c` |
| `orc-mcq-a12` | MULTIPLE_CHOICE | ADVANCED | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `d` |
| `orc-mcq-a13` | MULTIPLE_CHOICE | ADVANCED | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Equalized option length parity |
| `orc-mcq-a14` | MULTIPLE_CHOICE | ADVANCED | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `b` |
| `orc-mcq-a15` | MULTIPLE_CHOICE | ADVANCED | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `c` |
| `orc-mcq-a16` | MULTIPLE_CHOICE | ADVANCED | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Equalized option length parity & rotated option to `d` |
| `orc-coding-1` | CODING | INTERMEDIATE | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Cleaned prompt and starter code, added solution alternate |
| `orc-coding-2` | CODING | ADVANCED | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Cleaned prompt and starter code, added solution alternate |
| `orc-parsons-1` | PARSONS | INTERMEDIATE | `src/data/orchestrationDesignQuestions.ts` | 🟢 Completed | Cleaned Parsons distractors and syntax |

