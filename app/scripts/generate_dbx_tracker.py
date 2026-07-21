import json

with open('dbx_parsed.json', 'r') as f:
    questions = json.load(f)

# Sections mapping (topic enum string -> section name)
sections = {
  'Lakehouse Platform': {
    'Compute & Cluster Administration': ['DATABRICKS_COMPUTE_ADMIN', 'DATABRICKS_PLATFORM', 'DATABRICKS_BASICS'],
    'Storage Architecture, DBFS & Git Repos': ['DATABRICKS_STORAGE_REPOS'],
    'Unity Catalog Foundations & Volumes': ['UNITY_CATALOG_BASICS'],
    'Notebook Mechanics, Secrets & Security': ['DATABRICKS_NOTEBOOKS_SECURITY', 'DATABRICKS_UTILITIES'],
    'Delta Lake Fundamentals': ['DELTA_LAKE_BASICS'],
    'Delta Operations': ['DELTA_OPERATIONS'],
    'Delta Time Travel': ['DELTA_TIME_TRAVEL'],
    'Delta Optimization': ['DELTA_OPTIMIZATION'],
  },
  'ELT with Spark SQL & Python': {
    'DataFrame Basics': ['PYSPARK_BASICS', 'PYSPARK_DATAFRAMES'],
    'Transformations': ['PYSPARK_TRANSFORMATIONS', 'PYSPARK_ACTIONS'],
    'String Functions': ['STRING_FUNCTIONS'],
    'Date & Time Functions': ['DATETIME_FUNCTIONS'],
    'Collection Functions': ['COLLECTION_FUNCTIONS'],
    'Math & Aggregate Functions': ['MATH_FUNCTIONS'],
    'Null Handling': ['NULL_HANDLING'],
    'SQL Joins': ['SQL_JOINS'],
    'SQL Aggregations & GROUP BY': ['SQL_AGGREGATIONS', 'SQL_SUBQUERIES'],
    'Window Functions': ['WINDOW_FUNCTIONS', 'SQL_WINDOW_FUNCTIONS'],
    'Spark SQL & Set Operations': ['SPARK_SQL', 'SQL_SET_OPERATIONS'],
  },
  'Incremental Data Processing': {
    'Structured Streaming': ['STRUCTURED_STREAMING'],
    'Auto Loader': ['AUTO_LOADER'],
    'Medallion Architecture': ['MEDALLION_ARCHITECTURE'],
    'Change Data Capture': ['CHANGE_DATA_CAPTURE'],
  },
  'Production Pipelines': {
    'Delta Live Tables': ['DELTA_LIVE_TABLES'],
    'Workflows & Job Orchestration': ['DATABRICKS_WORKFLOWS'],
  },
  'Optimization & Advanced': {
    'Spark Optimization': ['SPARK_OPTIMIZATION'],
    'Advanced Concepts': ['ADVANCED_TOPICS'],
  },
  'Data Governance': {
    'Access Controls & Privileges': ['DATA_GOVERNANCE'],
    'Unity Catalog Governance': ['UNITY_CATALOG_GOVERNANCE'],
  },
  'Data Modeling & Warehousing Design': {
    'Dimensional Modeling': ['DATA_MODELING'],
    'Slowly Changing Dimensions': ['SCD_PATTERNS'],
    'Pipeline Design': ['PIPELINE_DESIGN'],
  },
  'Lakehouse Architecture & Engineering Practice': {
    'Gold Layer & Multi-Hop Pipeline Design': ['GOLD_LAYER_DESIGN'],
    'Ingestion & Partitioning Architecture': ['INGESTION_ARCHITECTURE'],
    'Orchestration & Data-Quality Design': ['ORCHESTRATION_DESIGN'],
  },
}

# Index questions by topic
qs_by_topic = {}
for q in questions:
    t = q['topic'].upper()
    if t not in qs_by_topic:
        qs_by_topic[t] = []
    qs_by_topic[t].append(q)

out = []
out.append("# Databricks Course Question Audit & Rewrite Tracker\n")
out.append("This document tracks the audit and rewrite status for every question in the **Databricks & PySpark Course**.\n")

out.append("## 🤖 Agent Operating Instructions (SOP for Any Agent / Subagent)\n")
out.append("When spawned to audit or rewrite Databricks questions, follow these instructions strictly:\n")

out.append("### 1. Workflow Sequence")
out.append("1. **Locate Pending Questions:** Pick a batch or topic containing 🔴 `Pending` questions.")
out.append("2. **Set In Progress:** Mark the selected question rows as 🟡 `In Progress` in this tracker.")
out.append("3. **Audit & Rewrite Source Code:** Open the corresponding `src/data/*.ts` file and review/rewrite each question against the Quality Rubric below.")
out.append("4. **Run Verification & Leak Gate:** Run the quality checks from the `app/` directory:")
out.append("   ```powershell")
out.append("   npx tsc --noEmit; node scripts/check-leaks.js; node scripts/check-commented-solution.js; node scripts/check-mcq-distractor-length.js databricks")
out.append("   ```")
out.append("5. **Mark Completed:** Update the question status to 🟢 `Completed` in this tracker and add brief notes on what was improved.\n")

out.append("### 2. Mandatory Skill References (`.claude/skills/`)")
out.append("Agents must refer to the following skill instruction files when working on questions:")
out.append("- **Writing Quality:** [`write-questions`](file:///C:/Users/kudam/Documents/Github/Recall/.claude/skills/write-questions/SKILL.md) — Pedagogical quality rubric per question type (bad-vs-good patterns)")
out.append("- **Topic Structure & Ramping:** [`construct-topic`](file:///C:/Users/kudam/Documents/Github/Recall/.claude/skills/construct-topic/SKILL.md) — Primitive inventory, 3-tier difficulty ramp, faded on-ramps")
out.append("- **Authoring Workflow:** [`add-question`](file:///C:/Users/kudam/Documents/Github/Recall/.claude/skills/add-question/SKILL.md) — Question creation steps, solution-first rule, starter code constraints")
out.append("- **Pre-Commit Verification:** [`verify`](file:///C:/Users/kudam/Documents/Github/Recall/.claude/skills/verify/SKILL.md) — Pre-commit quality gate, test suite, type-check, and leak scripts")
out.append("- **MCQ Distractor Audit:** [`audit-mcq`](file:///C:/Users/kudam/Documents/Github/Recall/.claude/skills/audit-mcq/SKILL.md) — MCQ distractor length parity & letter-position rotation")
out.append("- **Question Audits:** [`audit-questions`](file:///C:/Users/kudam/Documents/Github/Recall/.claude/skills/audit-questions/SKILL.md) — Mechanical leak and reserved-word scans\n")

out.append("### 3. Quality & Pedagogical Rubric (`write-questions` & `construct-topic`)")
out.append("- **Difficulty & Cognitive Load:**")
out.append("  - **BEGINNER:** Introduces **1 primitive**, minimal scaffolding.")
out.append("  - **INTERMEDIATE:** Deliberate pairing of **2 already-seen primitives**.")
out.append("  - **ADVANCED:** **3+ primitives**, realistic scenario, **prose-only prompt** (no code-comment walkthroughs naming functions).")
out.append("- **MULTIPLE_CHOICE (MCQ):**")
out.append("  - **Length Parity:** Distractors must match the correct answer's length (no 'longest = correct' bias).")
out.append("  - **Option Rotation:** Rotate the correct answer position across `a, b, c, d` (do not default to `b`).")
out.append("  - **Distractor Quality:** Distractors must represent plausible, documented misconceptions, not one-line dismissals.")
out.append("- **CODING:**")
out.append("  - **Solution First:** Write the reference `solution` first, including `# OR` (Python) or `-- OR` (SQL) syntax alternates.")
out.append("  - **No Keyword Leaks:** Prompt and starter code must state behavioral requirements without leaking the exact function/method name.")
out.append("  - **Syntax Guard:** Never use SQL/JS reserved words as variable/column names (`date`, `name`, `status`, `type`).")
out.append("- **PREDICT_OUTPUT:** 3-8 lines, strict determinism, no engine-dependent printed types.")
out.append("- **PARSONS:** 3-6 lines, 1 statement per line, distractors encode specific misconceptions.\n")

out.append("---")
out.append("> **Status Key:**")
out.append("> - 🔴 `Pending` — Needs review/rewrite against `/write-questions` rubric & leak gates")
out.append("> - 🟡 `In Progress` — Currently under review/rewrite")
out.append("> - 🟢 `Completed` — Rewritten, audited, and verified leak-clean\n")

total_count = 0

for sec_name, sub_topics in sections.items():
    out.append(f"## {sec_name}\n")
    for unit_name, topic_keys in sub_topics.items():
        out.append(f"### {unit_name} (`{', '.join(topic_keys)}`)\n")
        unit_qs = []
        for tk in topic_keys:
            unit_qs.extend(qs_by_topic.get(tk, []))
        
        # Deduplicate by ID
        seen = set()
        dedup_qs = []
        for q in unit_qs:
            if q['id'] not in seen:
                seen.add(q['id'])
                dedup_qs.append(q)
        
        if not dedup_qs:
            out.append("_No questions found for this topic._\n")
            continue

        total_count += len(dedup_qs)
        
        out.append("| ID | Type | Difficulty | Source File | Status | Notes |")
        out.append("|---|---|---|---|---|---|")
        for q in dedup_qs:
            status = "🔴 Pending"
            # Mark newly written topics (lakehouse design + unity catalog) as completed or audited
            if q['file'] in ['goldLayerDesignQuestions.ts', 'ingestionArchitectureQuestions.ts', 'orchestrationDesignQuestions.ts', 'unityCatalogQuestions.ts']:
                status = "🟢 Completed"
            out.append(f"| `{q['id']}` | {q['type']} | {q['difficulty']} | `{q['file']}` | {status} | |")
        out.append("\n")

out.insert(3, f"**Total Databricks Questions:** `{total_count}` | **Audit Status:** Persistent state across sessions\n")

with open('../DATABRICKS_QUESTION_AUDIT_TRACKER.md', 'w', encoding='utf-8') as f:
    f.write('\n'.join(out))

print(f"Tracker generated successfully with {total_count} Databricks questions.")
