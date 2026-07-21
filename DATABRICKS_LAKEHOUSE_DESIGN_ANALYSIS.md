# Databricks Lakehouse Design — Coverage & Construction Plan

Three new Databricks-course topics filling the confirmed "design judgment" gap: the course
teaches Databricks/PySpark/Delta *mechanics* well, and (via `data_modeling` / `scd_patterns` /
`pipeline_design`) already teaches generic dimensional-modeling and idempotency judgment — but
nothing teaches the Databricks-specific *architecture decisions* a production data engineer
makes: how to shape a gold table, how to design ingestion/partitioning up front, how to design
orchestration and quality gates. Research sourced from Databricks docs + Netflix/Uber/DoorDash/
Airbnb engineering blogs (see `databricks_de_research_results.md` conversation context) drives
the anti-pattern scenarios below.

## Non-overlap check (verified against current repo content)

- **SQL-for-DE course (`tsql_*`)** owns generic Kimball dimensional modeling (facts/dims, star
  schema, SCD, MERGE-based ELT). Not touched here.
- **`data_modeling` / `scd_patterns` / `pipeline_design`** (`dataModelingQuestions.ts`, Databricks
  course) already own: star-vs-snowflake, grain, surrogate keys, additivity, conformed
  dimensions, SCD1/2 MERGE patterns, idempotency, at-least/exactly-once semantics, late-arriving
  data + watermarks, **backfill via `replaceWhere`/`INSERT OVERWRITE PARTITION`**, data contracts.
  New content below references these as prerequisites but does not re-teach them — it applies
  them through Databricks-specific tooling (Workflows, DLT, Liquid Clustering) the existing
  topics don't touch.
- **`databricks_workflows`** owns Job/task syntax, `depends_on` DAG basics, task types,
  `dbutils.jobs.taskValues`, repair runs, cluster types. Does NOT cover `run_if` trigger rules,
  `for_each_task` dynamic loops, or table-update triggers — verified absent via grep.
- **`auto_loader` / `change_data_capture`** own `cloudFiles` options, schema evolution,
  `_metadata` columns, CDF (`table_changes()`, `_change_type`, merging CDC into a target). Do
  NOT cover the *decision* of streaming-vs-batch, directory-listing-vs-notification-mode as a
  cost tradeoff, or CDC-vs-batch-diff-vs-full-reload as a choice — verified absent.
- **`delta_optimization`** owns `OPTIMIZE` / `ZORDER BY` (the after-the-fact fix). Grepped the
  entire `src/data/` tree for `Liquid Cluster`, `CLUSTER BY`, `PARTITIONED BY` — **zero matches**.
  Upfront partitioning strategy and Liquid Clustering are a genuine, unclaimed gap.
- **`medallion_architecture`** covers what each layer *is* and builds one silver-dedup +
  one gold-aggregate table. Does NOT cover the *placement decision* (why a given transform goes
  in silver vs gold) or gold-shape choice (OBT vs star) — verified by reading its questions.
- **DE Concepts course (`de_*`)** covers tool-agnostic vocabulary (batch vs streaming, lakehouse
  vs warehouse, star schema, SCD, data mesh) at a plain-English level with zero Databricks
  tooling. New content stays Databricks-tool-specific (DLT expectations, `run_if`, Liquid
  Clustering, `for_each_task`) so it doesn't re-tread `de_*` ground.

## Style precedent

`data_modeling` / `scd_patterns` / `pipeline_design` establish the house style for this kind of
content: **MCQ-led** (scenario/tradeoff framing, not trivia), a **light CODING layer** for the
genuinely implementable patterns, occasional **PARSONS** for multi-step patterns. No
PREDICT_OUTPUT/CLOZE_CODE — architecture judgment isn't a deterministic-output or single-token-
fill skill, so those types don't fit (this mirrors the "MCQ-only/breadth topic" exception already
established in `/construct-topic`). The three new topics follow the same shape.

## Proposed section

New `DATABRICKS_SECTIONS` entry, placed after "Data Modeling & Warehousing Design" in
`DATABRICKS_PATH_ORDER`:

```
'Lakehouse Architecture & Engineering Practice': {
  weight: 'Beyond cert',
  topics: {
    'Gold Layer & Multi-Hop Pipeline Design': ['gold_layer_design'],
    'Ingestion & Partitioning Architecture': ['ingestion_architecture'],
    'Orchestration & Data-Quality Design': ['orchestration_design'],
  },
},
```

---

## Topic 1 — `gold_layer_design` (Topic.GOLD_LAYER_DESIGN)

### Primitive inventory
1. OBT (one-big-table) vs star/dimensional gold — query-pattern & cost tradeoff
2. Gold granularity choice — match table grain to the business question
3. Single shared gold vs domain marts (data-mesh split) — ownership/governance tradeoff
4. Bronze→silver vs silver→gold placement rule (silver = conformed/cleaned, gold =
   business-tailored/aggregated)
5. Anti-pattern: **Fan-Out Bug / Fan Trap** (1-to-many join without pre-aggregating inflates sums)
6. Anti-pattern: **Non-Additive Aggregation Trap** (summing semi-additive measures like daily
   balance across time)
7. Anti-pattern: **Grain Shift Catastrophe** (pre-aggregating gold to weekly loses drill-down,
   forces rebuild)
8. Reprocessing/replay strategy across hops — full rebuild vs time-travel + selective
   `MERGE`/`REPLACE WHERE` vs versioned gold (blue/green view swap)

### Type × tier matrix

| # | Primitive | Tier | MCQ | CODING | PARSONS |
|---|---|---|---|---|---|
| 1 | OBT vs star gold | Beginner | ✅ define+tradeoff | — | — |
| 2 | Gold granularity | Beginner | ✅ define | — | — |
| 3 | Single gold vs domain marts | Beginner | ✅ define | — | — |
| 4a | Placement: business rule → silver or gold? | Intermediate | ✅ scenario | — | — |
| 4b | Placement: dedup → silver or gold? | Intermediate | ✅ scenario (contrast w/ 4a) | — | — |
| 1b | OBT vs star, DirectQuery vs Import-mode BI scenario | Intermediate | ✅ scenario | — | — |
| 5 | Fan-Out Bug | Advanced | ✅ scenario | ✅ fix via pre-aggregated join | — |
| 6 | Non-Additive Aggregation Trap | Advanced | ✅ scenario | — | — |
| 7 | Grain Shift Catastrophe | Advanced | ✅ scenario | — | — |
| 8 | Reprocessing/replay strategy | Intermediate | — | — | ✅ selective replay (`VERSION AS OF` → `REPLACE WHERE`) |

**9 MCQ + 1 CODING + 1 PARSONS = 11 questions.**

---

## Topic 2 — `ingestion_architecture` (Topic.INGESTION_ARCHITECTURE)

### Primitive inventory
1. Batch vs streaming ingestion decision (SLA, push/pull source capability, cost —
   `Trigger.AvailableNow` vs continuous)
2. Landing file-format choice (Parquet/Avro typed+schema-evolving vs raw JSON/CSV — when NOT
   converting before landing is fine)
3. Landing/raw zone conventions (source/entity/date structure, WORM immutability)
4. Delta partitioning strategy upfront (`PARTITIONED BY` on coarse low-cardinality date columns,
   >1TB rule of thumb, target partition size)
5. Liquid Clustering (`CLUSTER BY`) as the modern default over `PARTITIONED BY` + `ZORDER`
6. CDC vs batch-diff vs full-reload decision tree
7. Anti-pattern: **Hive Time-Machine** (over-partitioning a small table → tiny files → metastore
   RPC crashes)
8. Anti-pattern: **Naked Overwrites** (daily full `OVERWRITE` on a large table — write
   amplification, cache invalidation, breaks time-travel retention)
9. Anti-pattern: **Directory Listing Ingestion** (Auto Loader directory-listing mode on
   >1M-file buckets — use `cloudFiles.useNotifications=true`)
10. Anti-pattern: **Blind Schema Blindspot** (no `_rescued_data` column — silent field drop on
    schema drift)

### Type × tier matrix

| # | Primitive | Tier | MCQ | CODING |
|---|---|---|---|---|
| 1 | Batch vs streaming decision | Beginner | ✅ define + source examples | — |
| 2 | Landing format choice | Beginner | ✅ define | — |
| 3 | Landing zone conventions | Beginner | ✅ define | — |
| 4 | Partitioning strategy upfront | Beginner | ✅ define | — |
| 5 | Liquid Clustering vs Partition+ZORDER | Beginner | ✅ define | ✅ `CREATE TABLE ... CLUSTER BY` |
| 6 | CDC vs batch-diff vs full-reload | Intermediate | ✅ scenario/decision-tree | — |
| 7 | Hive Time-Machine | Intermediate | ✅ scenario | — |
| 8 | Naked Overwrites | Intermediate | ✅ scenario | — |
| 9 | Directory Listing Ingestion | Advanced | ✅ scenario | — |
| 10 | Blind Schema Blindspot | Advanced | ✅ scenario | — |

**10 MCQ + 1 CODING = 11 questions.**

No PARSONS here — every primitive is a single decision/definition rather than a multi-step
sequence, so MCQ is the right primary vehicle (matches `data_modeling`'s shape, which is
almost entirely MCQ-led with one coding capstone).

---

## Topic 3 — `orchestration_design` (Topic.ORCHESTRATION_DESIGN)

### Primitive inventory
1. Fan-out/fan-in DAG shape (`dbutils.jobs.taskValues` passing params across branches)
2. `run_if` trigger rules — `ALL_SUCCESS` / `NONE_FAILED` / `AT_LEAST_ONE_SUCCESS`
3. Cross-team dependency management — table-update triggers vs fixed-time cron
4. Orchestrator-level backfill — `for_each_task` dynamic loop + `concurrency` cap
5. Data-quality gate placement across hops (bronze = reject on schema, silver = quarantine to
   DLQ on integrity, gold = alert + block refresh on KPI sanity)
6. DLT expectations as the gate's implementation — `expect` / `expect_or_drop` / `expect_or_fail`
7. Anti-pattern: **Ghost Sink Failure** (`ALL_SUCCESS` failing when an upstream branch skips
   by design → fix with `NONE_FAILED`)
8. Anti-pattern: **Cron Surgery** (one logical DAG split across separately-scheduled jobs, no
   cross-job error propagation)
9. Anti-pattern: **Time-Gap Roulette** (downstream job on a fixed time buffer → silent staleness)
10. Anti-pattern: **Partition Blast Radius** (blanket `.mode("overwrite")` during a single-day
    backfill purges years of data)
11. Anti-pattern: **Silent Drop Sinking** (overusing `expect_or_drop` with no quarantine stream
    → unexplained volume loss)

### Type × tier matrix

| # | Primitive | Tier | MCQ | CODING | PARSONS |
|---|---|---|---|---|---|
| 1 | Fan-out/fan-in shape | Beginner | ✅ define | — | — |
| 2 | `run_if` rules | Beginner | ✅ define all three | — | — |
| 3 | Cross-team dependency mgmt | Beginner | ✅ define | — | — |
| 4 | Orchestrator backfill (`for_each_task`+concurrency) | Beginner | ✅ define | — | ✅ assemble loop config |
| 5 | Quality-gate placement (3-gate framework) | Beginner | ✅ define | — | — |
| 6 | DLT expectations as gate impl | Intermediate | ✅ which expectation for which gate | ✅ write expectations for a silver table | — |
| 7 | Ghost Sink Failure | Intermediate | ✅ scenario (fixes via #2) | — | — |
| 8 | Cron Surgery | Intermediate | ✅ scenario | — | — |
| 9 | Time-Gap Roulette | Intermediate | ✅ scenario (fixes via #3) | — | — |
| 10 | Partition Blast Radius | Advanced | ✅ scenario | — | — |
| 11 | Silent Drop Sinking | Advanced | ✅ scenario (fixes via #6) | — | — |

**11 MCQ + 1 CODING + 1 PARSONS = 13 questions.**

---

## Total new content

**~35 questions** across 3 topics (11 + 11 + 13), same MCQ-led/light-coding shape as the
existing `data_modeling`/`scd_patterns`/`pipeline_design` trio. All anti-pattern questions use
named, sourced failure modes (Fan-Out Bug, Grain Shift Catastrophe, Hive Time-Machine, Naked
Overwrites, Directory Listing Ingestion, Blind Schema Blindspot, Ghost Sink Failure, Cron
Surgery, Time-Gap Roulette, Partition Blast Radius, Silent Drop Sinking) as realistic scenarios
rather than generic definitions, per the research brief.

## Wiring (8-edit pattern, Databricks skips the ordered-bank step)

1. Add 3 `Topic` enum values to `src/types/index.ts`
2. Add 3 keys to Databricks `*_TOPICS` Set in `src/utils/courseConfig.ts`
3. Add new section to `DATABRICKS_SECTIONS` + append to `DATABRICKS_PATH_ORDER`
4. Create `src/data/lakehouseDesignQuestions.ts` (mirrors `dataModelingQuestions.ts` structure)
5. Import + spread in `src/data/questions.ts`
6. (No ordered-bank edit — Databricks course reads section files directly, confirmed in CLAUDE.md)

## Verification checklist

- [ ] Ramp order: beginner (definitions) → intermediate (scenario tradeoffs) → advanced
      (anti-pattern mental models), matching sibling topics' center of gravity
- [ ] No primitive introduced fresh above beginner
- [ ] MCQ-led shape justified (design judgment, not deterministic output — same exception class
      as `data_modeling`/`scd_patterns`/`pipeline_design`)
- [ ] Zero content overlap with `data_modeling`/`scd_patterns`/`pipeline_design`,
      `databricks_workflows`, `auto_loader`, `change_data_capture`, `delta_optimization`,
      `medallion_architecture`, and `de_*` — verified above via grep + question reads
- [ ] Leak gate: `check-leaks.js`, `check-commented-solution.js`, `audit-coverage.js databricks`
      (expect MCQ-breadth false-positives, eyeball), `check-ordered-strays.js`, `tsc --noEmit`
- [ ] No reserved-word identifiers in CODING solutions
- [ ] Every anti-pattern question names the failure mode AND states the fix, not just "this is
      bad" — matches `/write-questions` standard for misconception-grade distractors

---

**Next step: confirm this plan, then author all ~35 questions in one file, then run the full
leak gate.**
