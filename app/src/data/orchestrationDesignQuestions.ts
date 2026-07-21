import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

// ORCHESTRATION_DESIGN — Databricks course, "Lakehouse Architecture &
// Engineering Practice" section. First of three new design-judgment topics
// (siblings: gold_layer_design, ingestion_architecture, still to come).
//
// This is NOT re-teaching databricks_workflows (Job/task syntax, depends_on,
// dbutils.jobs.taskValues, cluster types) or pipeline_design (idempotency,
// backfill via replaceWhere, data contracts, late-arriving data) — both
// already exist and are assumed as prerequisites. This topic is the
// Databricks-specific ORCHESTRATION mechanism layer on top: run_if trigger
// rules, table-update triggers, for_each_task backfill loops, and the
// bronze/silver/gold quality-gate framework implemented via DLT
// expectations — plus the production failure modes that show up when these
// are misused.
//
// Sources: Databricks Lakeflow Jobs docs, Netflix Maestro orchestration
// engine writeups, Uber's Unified Data Quality blog, Airbnb's Midas DQ
// framework (see databricks_de_research_results.md).
//
// Coverage (37 questions):
//   Beginner (6 MCQ): define each of the 6 core primitives.
//   Intermediate (12): 6 PREDICT_OUTPUT tracing run_if / DLT-expectation
//     logic as small deterministic Python functions (genuinely
//     deterministic, unlike most of this topic — a real faded layer) + 6
//     scenario MCQs (cross-team triggers x2, backfill x2, gate-choice x2).
//   Advanced (16): 5 anti-patterns x 3 domain-transfer scenarios each
//     (Ghost Sink Failure, Cron Surgery, Time-Gap Roulette, Partition Blast
//     Radius, Silent Drop Sinking) + 1 discrimination question distinguishing
//     two anti-patterns with a similar symptom.
//   Coding/Parsons (3): DLT expectations implementing the gate framework,
//     diagnose-and-fix a Partition Blast Radius snippet, Parsons assembly
//     of a for_each_task backfill loop.

export const orchestrationDesignQuestions: Question[] = [
  // ────────────────────────────────────────────────────────────────────
  // BEGINNER (6) — define each core primitive
  // ────────────────────────────────────────────────────────────────────
  {
    id: 'orc-mcq-b1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    question:
      "In a Databricks Workflow, what does it mean for a job DAG to \"fan out\" and then \"fan in\"?",
    options: [
      { id: 'a', text: 'Fan-out is one task triggering several independent parallel downstream tasks — for example, one ingestion task branching into a separate processing task per region. Fan-in is those parallel branches converging back into a single downstream task that depends on all of them.', isCorrect: true },
      { id: 'b', text: 'Fan-out attaches automatic retry policies to every DAG task to retry transient errors without human intervention; fan-in removes those policies after a job completes successfully several consecutive times.', isCorrect: false },
      { id: 'c', text: 'Fan-out executes the entire job twice in parallel as redundant safety copies; fan-in discards whichever copy finishes second and retains only the output of the first completed pipeline run.', isCorrect: false },
      { id: 'd', text: "Fan-out increases job cron frequency automatically as upstream data volume grows to manage load; fan-in returns the schedule to normal cadence once volume drops, regardless of task graph structure.", isCorrect: false },
    ],
    explanation:
      'Fan-out/fan-in is the standard shape for "split work, then combine results": a root task (e.g. discover regions) spawns N parallel branches, each processes its own slice, and a final sink task depends on all N branches before building the combined gold table. `dbutils.jobs.taskValues` is the usual way to pass a dynamic parameter (like the list of regions) into the fan-out.',
    tags: ['fan-out', 'fan-in', 'dag', 'workflows'],
    concepts: ['orch-fan-out-in'],
  },
  {
    id: 'orc-mcq-b2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    question:
      'In Databricks Workflows, what do the task-level run_if trigger rules ALL_SUCCESS, NONE_FAILED, and AT_LEAST_ONE_SUCCESS each control for a downstream task with multiple upstream dependencies?',
    options: [
      { id: 'a', text: 'ALL_SUCCESS runs the task only if every upstream dependency succeeded. NONE_FAILED runs it if every upstream succeeded or was skipped, but still blocks on an actual failure. AT_LEAST_ONE_SUCCESS runs it as long as any one upstream succeeded, no matter how many others failed.', isCorrect: true },
      { id: 'b', text: 'ALL_SUCCESS retries a failed upstream task up to 3 times before giving up; NONE_FAILED retries up to 5 times; AT_LEAST_ONE_SUCCESS retries indefinitely until at least one attempt succeeds — the three names describe retry budgets.', isCorrect: false },
      { id: 'c', text: 'ALL_SUCCESS schedules tasks on whichever cluster has most idle workers; NONE_FAILED schedules on clusters that finished autoscaling most recently; AT_LEAST_ONE_SUCCESS pins tasks to single-node clusters.', isCorrect: false },
      { id: 'd', text: 'ALL_SUCCESS starts downstream tasks when upstream tasks begin running; NONE_FAILED starts downstream tasks when the first upstream starts; AT_LEAST_ONE_SUCCESS starts downstream tasks in random order.', isCorrect: false },
    ],
    explanation:
      'These rules decide whether a downstream task runs, given the mix of success/failure/skip states of its dependencies. The default is ALL_SUCCESS, which is often too strict once a DAG has conditional branches (If/Else tasks) that deliberately skip — that mismatch is the root of the Ghost Sink Failure anti-pattern covered later in this topic.',
    tags: ['run_if', 'trigger-rules', 'workflows'],
    concepts: ['orch-run-if'],
  },
  {
    id: 'orc-mcq-b3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    question:
      "What's the problem with scheduling a downstream job on a fixed cron time chosen to run \"a bit after\" an upstream team's job usually finishes, and what's the Lakeflow-native alternative?",
    options: [
      { id: 'a', text: "A fixed offset is a guess at how long the upstream will take — the day it runs longer than usual, the downstream starts against stale or partial data with no error raised. Lakeflow's native table-update triggers start the downstream only once the upstream table has actually finished changing.", isCorrect: true },
      { id: 'b', text: 'A fixed offset schedule is always a completely safe way to sequence two independent jobs, because Databricks automatically pads every cron schedule with a hidden buffer large enough to absorb normal run-time variance.', isCorrect: false },
      { id: 'c', text: 'The only real problem with a fixed offset is that it wastes compute by leaving the downstream cluster idle while it waits; the Lakeflow-native fix is simply to make the downstream cluster auto-terminate faster between runs.', isCorrect: false },
      { id: 'd', text: 'The Lakeflow-native alternative is to remove scheduling entirely and run every downstream job continuously, all the time, so there is never a gap between the upstream finishing and the downstream starting.', isCorrect: false },
    ],
    explanation:
      'This failure mode has a name in practice: "Time-Gap Roulette." Every extra minute the upstream job runs past its usual time is a minute the downstream silently processes incomplete or day-old data. Table-update triggers replace the guess with an actual signal.',
    tags: ['cross-team', 'triggers', 'cron'],
    concepts: ['orch-table-triggers'],
  },
  {
    id: 'orc-mcq-b4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    question:
      "When backfilling a pipeline across a range of historical dates, what does a for_each_task loop with a concurrency cap give you that simply firing off every date's run at once doesn't?",
    options: [
      { id: 'a', text: 'It parameterizes one task template over an array of dates, one instance per date, while the concurrency cap bounds how many run at once — preventing cluster quota exhaustion and Delta transaction-log lock contention that an unbounded parallel blast would cause.', isCorrect: true },
      { id: 'b', text: "It automatically retries the same failing date over and over, with no cap, until that date's run eventually succeeds — regardless of whether the underlying error is even something a retry could fix.", isCorrect: false },
      { id: 'c', text: 'It silently converts every batch task in the backfill into a continuously running streaming task, so historical dates are processed as if they were live, real-time events arriving one at a time.', isCorrect: false },
      { id: 'd', text: "It guarantees the backfilled dates are inserted into the target table in strict chronological order, one date fully committed before the next date's task is even allowed to start.", isCorrect: false },
    ],
    explanation:
      "Concurrency caps (e.g. 4) exist because Delta's transaction log serializes commits on a table — too many concurrent writers to the same table fight over the log and slow each other down, on top of just running out of cluster capacity. The loop still needs an idempotent write underneath (replaceWhere or MERGE) so a single date can be safely re-run if it fails.",
    tags: ['backfill', 'for_each_task', 'concurrency'],
    concepts: ['orch-for-each-task'],
  },
  {
    id: 'orc-mcq-b5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    question:
      'In a bronze/silver/gold pipeline, what is the general framework for deciding WHERE a given data-quality check belongs and WHAT it should do when it fails?',
    options: [
      { id: 'a', text: 'Bronze gates enforce structural validity, rejecting or flagging records that fail to parse. Silver gates enforce domain integrity, like primary-key uniqueness, typically quarantining bad rows to a dead-letter table. Gold gates enforce business/KPI sanity, alerting a human and blocking a dashboard refresh.', isCorrect: true },
      { id: 'b', text: "Bronze gates check that file sizes stay under a configured limit. Silver gates check that column names match a fixed naming convention. Gold gates check that the BI tool's refresh completed within its time budget — none of the three actually inspect the data's values.", isCorrect: false },
      { id: 'c', text: 'Bronze gates enforce business/KPI sanity before any transformation happens. Silver gates enforce structural validity on the already-cleaned data. Gold gates enforce domain integrity as a final pass right before a BI tool reads the table — the checks run in the reverse of their natural order.', isCorrect: false },
      { id: 'd', text: "Bronze gates are optional and usually skipped. Silver gates are the only hop that matters, since gold is assumed to inherit silver's correctness automatically. Gold gates are redundant with silver gates and can be removed without any change in risk.", isCorrect: false },
    ],
    explanation:
      "Each hop is checking a different KIND of correctness — bronze cares if the record parses at all, silver cares if it obeys the table's own invariants, gold cares if the resulting business number makes sense. Putting all validation at one hop either misses structural garbage early or wastes compute cleaning data that should never have made it past bronze.",
    tags: ['data-quality', 'gates', 'medallion'],
    concepts: ['orch-quality-gates'],
  },
  {
    id: 'orc-mcq-b6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    question:
      'In Delta Live Tables, what is the actual difference in behavior between the expect, expect_or_drop, and expect_or_fail expectation decorators?',
    options: [
      { id: 'a', text: 'expect validates the rule and records violating rows in pipeline metrics, but keeps those rows in the output. expect_or_drop does the same validation but removes violating rows from the output entirely. expect_or_fail stops the whole pipeline run the moment a row violates the rule.', isCorrect: true },
      { id: 'b', text: 'expect only validates numeric columns; expect_or_drop only validates string columns; expect_or_fail only validates columns involved in a join — each decorator is restricted to a different column data type.', isCorrect: false },
      { id: 'c', text: 'expect applies only to streaming tables; expect_or_drop applies only to batch tables; expect_or_fail has been deprecated and silently falls back to behaving like plain expect in current DLT releases.', isCorrect: false },
      { id: 'd', text: 'expect logs a warning but still lets the row through; expect_or_drop also lets the row through but flags it as low-confidence for downstream consumers; expect_or_fail behaves identically to expect_or_drop.', isCorrect: false },
    ],
    explanation:
      'This is the concrete implementation of the bronze/silver/gold gate framework: pick expect for a soft/informational rule you just want visibility into, expect_or_drop when a violating row should be quarantined out of the good data, and expect_or_fail for a hard invariant where continuing would mean publishing something actively wrong.',
    tags: ['dlt', 'expectations'],
    concepts: ['orch-dlt-expectations'],
  },

  // ────────────────────────────────────────────────────────────────────
  // INTERMEDIATE (12) — 6 PREDICT_OUTPUT (deterministic trace of run_if /
  // DLT-expectation logic) + 6 scenario MCQs
  // ────────────────────────────────────────────────────────────────────
  {
    id: 'orc-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    language: CodeLanguage.PYTHON,
    question:
      'This function models the ALL_SUCCESS run_if rule against a dict of upstream task outcomes. Trace it and print the result.',
    code: `def should_run(rule, outcomes):
    if rule == "ALL_SUCCESS":
        return all(v == "success" for v in outcomes.values())
    if rule == "NONE_FAILED":
        return all(v != "failed" for v in outcomes.values())
    if rule == "AT_LEAST_ONE_SUCCESS":
        return any(v == "success" for v in outcomes.values())

outcomes = {"regional_task_a": "success", "regional_task_b": "failed", "regional_task_c": "success"}
print(should_run("ALL_SUCCESS", outcomes))`,
    expectedOutput: 'False',
    explanation:
      'ALL_SUCCESS requires every single upstream outcome to be "success". regional_task_b failed, so the whole check short-circuits to False regardless of how many others succeeded — this is the strict default rule.',
    tags: ['run_if', 'trigger-rules', 'predict-output'],
    concepts: ['orch-run-if'],
  },
  {
    id: 'orc-predict-2',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    language: CodeLanguage.PYTHON,
    question:
      'Same should_run function as before, now checked against the NONE_FAILED rule where one upstream branch was deliberately skipped (not failed). Trace it and print the result.',
    code: `def should_run(rule, outcomes):
    if rule == "ALL_SUCCESS":
        return all(v == "success" for v in outcomes.values())
    if rule == "NONE_FAILED":
        return all(v != "failed" for v in outcomes.values())
    if rule == "AT_LEAST_ONE_SUCCESS":
        return any(v == "success" for v in outcomes.values())

outcomes = {"branch_a": "success", "branch_b": "skipped", "branch_c": "success"}
print(should_run("NONE_FAILED", outcomes))`,
    expectedOutput: 'True',
    explanation:
      'NONE_FAILED only checks for the literal value "failed" — a "skipped" branch passes the check just fine. This is exactly why NONE_FAILED is the fix for a fan-in task that must still run when an upstream If/Else branch was skipped on purpose, which ALL_SUCCESS would incorrectly block.',
    tags: ['run_if', 'trigger-rules', 'predict-output'],
    concepts: ['orch-run-if'],
  },
  {
    id: 'orc-predict-3',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    language: CodeLanguage.PYTHON,
    question:
      'Same should_run function, now checked against AT_LEAST_ONE_SUCCESS where two of three upstream branches failed. Trace it and print the result.',
    code: `def should_run(rule, outcomes):
    if rule == "ALL_SUCCESS":
        return all(v == "success" for v in outcomes.values())
    if rule == "NONE_FAILED":
        return all(v != "failed" for v in outcomes.values())
    if rule == "AT_LEAST_ONE_SUCCESS":
        return any(v == "success" for v in outcomes.values())

outcomes = {"replica_a": "failed", "replica_b": "success", "replica_c": "failed"}
print(should_run("AT_LEAST_ONE_SUCCESS", outcomes))`,
    expectedOutput: 'True',
    explanation:
      'AT_LEAST_ONE_SUCCESS only needs a single success anywhere in the outcomes to pass — it is the most permissive rule, useful for degraded-but-still-useful processing (e.g. "publish gold from whichever regional replicas actually came back").',
    tags: ['run_if', 'trigger-rules', 'predict-output'],
    concepts: ['orch-run-if'],
  },
  {
    id: 'orc-predict-4',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    language: CodeLanguage.PYTHON,
    question:
      'This function models what happens to a single row under each DLT expectation kind. Trace it for the "expect" kind against an invalid row and print the result.',
    code: `def apply_expectation(kind, row_is_valid):
    if kind == "expect":
        return "kept"
    if kind == "expect_or_drop":
        return "kept" if row_is_valid else "dropped"
    if kind == "expect_or_fail":
        return "kept" if row_is_valid else "pipeline_failed"

print(apply_expectation("expect", False))`,
    expectedOutput: 'kept',
    explanation:
      'Plain expect never removes a row from the output — it only records the violation in pipeline metrics for visibility. The row is invalid but still lands in the table, which is exactly why expect is the wrong choice for a rule that must never let bad data through.',
    tags: ['dlt', 'expectations', 'predict-output'],
    concepts: ['orch-dlt-expectations'],
  },
  {
    id: 'orc-predict-5',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    language: CodeLanguage.PYTHON,
    question:
      'Same apply_expectation function, now traced for the "expect_or_drop" kind against an invalid row. Print the result.',
    code: `def apply_expectation(kind, row_is_valid):
    if kind == "expect":
        return "kept"
    if kind == "expect_or_drop":
        return "kept" if row_is_valid else "dropped"
    if kind == "expect_or_fail":
        return "kept" if row_is_valid else "pipeline_failed"

print(apply_expectation("expect_or_drop", False))`,
    expectedOutput: 'dropped',
    explanation:
      'expect_or_drop removes an invalid row from the output while letting the rest of the pipeline keep running — the right choice for a rule where a bad row should be silently excluded, PROVIDED you also route it to a quarantine table (otherwise you get the Silent Drop Sinking anti-pattern later in this topic).',
    tags: ['dlt', 'expectations', 'predict-output'],
    concepts: ['orch-dlt-expectations'],
  },
  {
    id: 'orc-predict-6',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    language: CodeLanguage.PYTHON,
    question:
      'Same apply_expectation function, now traced for the "expect_or_fail" kind against an invalid row. Print the result.',
    code: `def apply_expectation(kind, row_is_valid):
    if kind == "expect":
        return "kept"
    if kind == "expect_or_drop":
        return "kept" if row_is_valid else "dropped"
    if kind == "expect_or_fail":
        return "kept" if row_is_valid else "pipeline_failed"

print(apply_expectation("expect_or_fail", False))`,
    expectedOutput: 'pipeline_failed',
    explanation:
      'expect_or_fail treats any violation as fatal — the whole pipeline run stops. Reserve this for hard invariants (a total that can never legitimately be negative), not for rules where a few bad rows are an expected, tolerable part of real-world data.',
    tags: ['dlt', 'expectations', 'predict-output'],
    concepts: ['orch-dlt-expectations'],
  },
  {
    id: 'orc-mcq-i1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    question:
      "A downstream job reads from a table another team owns and is scheduled at a fixed 6am cron time, chosen because the upstream \"usually\" finishes by 5:45am. One morning the upstream runs until 6:10am. What actually happens, and what's the fix?",
    options: [
      { id: 'a', text: "The downstream job runs at 6am regardless, against a table that's still mid-write — no error is raised, the gold output is simply built from stale or incomplete data. The fix is a Lakeflow table-update trigger on the upstream table, so the downstream only starts once it actually finished changing.", isCorrect: true },
      { id: 'b', text: "Databricks automatically detects that the upstream job is still running and transparently delays the downstream job's start time until the upstream table's last write commits, with zero configuration required.", isCorrect: false },
      { id: 'c', text: "The downstream job fails immediately with a clear 'upstream table not ready' error the moment it starts, which pages the on-call engineer and prevents the incomplete data from ever being read.", isCorrect: false },
      { id: 'd', text: "Nothing changes about the risk, but the impact is small — Databricks automatically retries the downstream job every 5 minutes until the upstream table's row count stops changing, catching the issue within about 15 minutes.", isCorrect: false },
    ],
    explanation:
      'This is Time-Gap Roulette in its most common form. The dangerous part is exactly that nothing errors — the pipeline "succeeds" while quietly serving wrong data, which is much harder to catch than an outright failure.',
    tags: ['cross-team', 'triggers', 'time-gap-roulette'],
    concepts: ['orch-table-triggers'],
  },
  {
    id: 'orc-mcq-i2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    question:
      "A compliance team requires that a downstream reporting pipeline NEVER read an upstream regulatory table while it's only partially written for the day. A fixed-time trigger isn't good enough, even a very conservative one. What actually solves this?",
    options: [
      { id: 'a', text: "Pair a data contract defining 'complete for the day' — a sentinel row, a completion-marker table, or the upstream job's own success signal — with a trigger that fires on that specific signal, not a wall-clock guess. The downstream only starts once the upstream has explicitly declared itself done.", isCorrect: true },
      { id: 'b', text: 'Scheduling the downstream job as late in the day as reasonably possible and hoping the upstream always finishes by then is the standard, accepted way compliance teams solve this in practice.', isCorrect: false },
      { id: 'c', text: "Increasing the downstream cluster's size so it reads and processes the table fast enough that any partially-written rows are never actually visible to the read, regardless of timing.", isCorrect: false },
      { id: 'd', text: "Having the downstream job poll the upstream table's row count every minute and start as soon as the count stops changing for two consecutive checks, treating a stable count as proof of completion.", isCorrect: false },
    ],
    explanation:
      'Polling row-count stability is fragile (a pause mid-write looks identical to "done"). An explicit completion signal — part of the data contract between the two teams — is the reliable version of "wait for upstream," and it\'s what a table-update trigger or completion-marker table is actually implementing under the hood.',
    tags: ['cross-team', 'triggers', 'data-contracts'],
    concepts: ['orch-table-triggers', 'dim-data-contracts'],
  },
  {
    id: 'orc-mcq-i3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    question:
      'You need to backfill 90 days of a silver table after fixing a transformation bug. Firing off all 90 days as independent job runs simultaneously causes cluster quota errors and Delta commit conflicts. What\'s the fix?',
    options: [
      { id: 'a', text: 'Use a for_each_task loop parameterized over the 90 dates with a concurrency cap, such as 4-8 running at once — enough parallelism to finish in reasonable time without exceeding cluster capacity or overwhelming the transaction log with concurrent commits.', isCorrect: true },
      { id: 'b', text: 'Run all 90 dates in a single job with no loop at all, passing the entire date range as one parameter to one task, and let the notebook itself iterate through the dates sequentially inside one long-running cluster session.', isCorrect: false },
      { id: 'c', text: 'Truncate the entire silver table first and reload every date from bronze from scratch in one large non-parallel job, since backfilling on top of existing data is inherently riskier than starting from an empty table.', isCorrect: false },
      { id: 'd', text: "Temporarily disable Delta's transaction log during the backfill window so concurrent writers stop competing for commits, then re-enable logging once all 90 dates have finished writing to the table.", isCorrect: false },
    ],
    explanation:
      'Full sequential (option a) is safe but slow — 90 days one at a time could take days. A concurrency cap is the middle ground: enough parallel throughput to finish quickly, bounded low enough that the cluster and the Delta log can actually handle it.',
    tags: ['backfill', 'for_each_task', 'concurrency'],
    concepts: ['orch-for-each-task'],
  },
  {
    id: 'orc-mcq-i4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    question:
      'Your 90-date for_each_task backfill fails partway through, after successfully processing 60 of the 90 dates. What property does the underlying per-date write need to have so you can simply re-run the whole loop rather than figuring out exactly which dates already succeeded?',
    options: [
      { id: 'a', text: 'The per-date write must be idempotent, typically an atomic partition replace via replaceWhere scoped to that single date. Re-running the loop then safely no-ops on the 60 already-correct dates and only meaningfully reprocesses the 30 that never completed.', isCorrect: true },
      { id: 'b', text: 'The write needs to be as fast as possible so that re-running the entire 90-date loop from scratch is cheap enough to just accept as the normal recovery procedure, even though it reprocesses 60 already-correct dates.', isCorrect: false },
      { id: 'c', text: 'The write needs to be strictly append-only, so that re-running the loop never touches previously written data at all — any date that already ran successfully simply accumulates a second, duplicate copy of its rows.', isCorrect: false },
      { id: 'd', text: "The for_each_task loop keeps its own internal record of which dates already succeeded, so the underlying per-date write's behavior on a re-run doesn't matter — the loop skips already-completed dates automatically.", isCorrect: false },
    ],
    explanation:
      'This connects directly to idempotency (covered in pipeline_design) as the property that makes orchestrator-level retries safe: for_each_task provides the looping/concurrency mechanism, but it\'s the replaceWhere-per-date write underneath that makes "just re-run it" a correct recovery strategy instead of a data-corrupting one.',
    tags: ['backfill', 'for_each_task', 'idempotency'],
    concepts: ['orch-for-each-task', 'dim-idempotency'],
  },
  {
    id: 'orc-mcq-i5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A silver order_total column must never be negative — if it ever is, something upstream is fundamentally broken and every downstream gold number built on it would be wrong. Which DLT expectation kind fits this rule, and why?',
    options: [
      { id: 'a', text: 'expect_or_fail — this is a hard invariant; continuing to build downstream tables on top of a violation would actively propagate wrong numbers, so the safest response is to stop the pipeline immediately and force investigation.', isCorrect: true },
      { id: 'b', text: 'expect — log the violation for visibility but let the pipeline keep running, since order_total going negative is normal variance in real-world transactional data and does not indicate anything is actually broken upstream.', isCorrect: false },
      { id: 'c', text: 'expect_or_drop — quietly remove any row where order_total is negative and let everything else proceed as normal, since a small number of malformed rows are an expected part of any large, real-world orders table.', isCorrect: false },
      { id: 'd', text: "None of the three — a business-logic rule like 'order_total can never be negative' is expressed at the application layer before data reaches Delta Live Tables, not as a DLT expectation on the silver table itself.", isCorrect: false },
    ],
    explanation:
      'The test for choosing expect_or_fail: would continuing to run be worse than stopping? A negative order total usually means an upstream extraction or currency bug — publishing gold numbers built on that data is worse than a delayed pipeline.',
    tags: ['dlt', 'expectations', 'quality-gates'],
    concepts: ['orch-dlt-expectations', 'orch-quality-gates'],
  },
  {
    id: 'orc-mcq-i6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A small, known fraction of incoming rows are missing an optional promo_code field — expected and harmless, not a sign anything is broken. Which DLT expectation kind fits, and why not expect_or_fail?',
    options: [
      { id: 'a', text: "expect, or expect_or_drop if downstream logic genuinely can't tolerate the null — this is a soft, expected condition, not evidence of a broken upstream. Using expect_or_fail here would mean routine, harmless variation halts the whole pipeline, training the team to treat failures as noise.", isCorrect: true },
      { id: 'b', text: 'expect_or_fail, because any row missing a declared field, optional or not, should always stop the pipeline immediately — tolerating any incompleteness at all sets a bad precedent for every other rule in the pipeline.', isCorrect: false },
      { id: 'c', text: "expect_or_drop, because a null promo_code is meaningless to downstream consumers anyway, so quietly removing every row that's missing it keeps the silver table's schema strictly complete for every declared field.", isCorrect: false },
      { id: 'd', text: "expect_or_fail, because Delta Live Tables requires every expectation declared on the same table to share the same severity kind, so mixing expect and expect_or_fail on one table isn't a supported configuration.", isCorrect: false },
    ],
    explanation:
      "Over-using expect_or_fail for tolerable conditions is its own anti-pattern: it turns routine variation into pages, and once a pipeline pages too often for non-issues, people stop trusting (and responding to) the alerts — including the ones that matter.",
    tags: ['dlt', 'expectations', 'quality-gates'],
    concepts: ['orch-dlt-expectations', 'orch-quality-gates'],
  },

  // ────────────────────────────────────────────────────────────────────
  // ADVANCED (16) — 5 anti-patterns x 3 domain-transfer scenarios each,
  // plus 1 discrimination question
  // ────────────────────────────────────────────────────────────────────

  // Ghost Sink Failure (x3)
  {
    id: 'orc-mcq-a1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A DAG has an If/Else task that, for most regions, skips the "apply local tax rules" branch entirely (only a few regions need it). The final gold-build task depends on both branches and uses the default run_if of ALL_SUCCESS. What happens for a region where the tax-rules branch was skipped, and why is this the "Ghost Sink Failure" anti-pattern?',
    options: [
      { id: 'a', text: "The gold-build task never runs for that region — ALL_SUCCESS requires every dependency to have the literal outcome 'success,' and a skip doesn't count, even though skipping was the correct, intended behavior. The sink silently fails to run with no error pointing at the real cause.", isCorrect: true },
      { id: 'b', text: 'Nothing unusual happens — ALL_SUCCESS treats a deliberately skipped upstream task exactly the same as a successful one, since Databricks Workflows was specifically designed to make conditional branches transparent to downstream run_if rules.', isCorrect: false },
      { id: 'c', text: "Databricks automatically detects the conditional branch in the DAG and silently rewrites the sink's run_if rule from ALL_SUCCESS to NONE_FAILED behind the scenes, so the gold-build task runs correctly without any manual change.", isCorrect: false },
      { id: 'd', text: 'The gold-build task runs twice for that region — once immediately after the skip is recorded, and again after the success path completes — producing two separate, duplicate writes to the gold table.', isCorrect: false },
    ],
    explanation:
      'The fix is switching the sink\'s run_if to NONE_FAILED, which treats "succeeded" and "skipped" as equally fine and only blocks on an actual failure — matching what the If/Else branch was designed to do in the first place.',
    tags: ['ghost-sink-failure', 'run_if', 'dag'],
    concepts: ['orch-ghost-sink-failure', 'orch-run-if'],
  },
  {
    id: 'orc-mcq-a2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A pipeline has a feature-flag branch that only runs the "enrich with beta-program data" task for accounts opted into a beta; every other account skips it by design. The final report-build task depends on that branch with ALL_SUCCESS. What breaks, for whom?',
    options: [
      { id: 'a', text: 'For every account NOT in the beta, the enrichment task is skipped rather than succeeded, so ALL_SUCCESS blocks the report-build task from running for them at all — the majority silently stop getting reports, looking like an unrelated failure rather than a run_if misconfiguration.', isCorrect: true },
      { id: 'b', text: 'Nothing breaks for anyone — Databricks Workflows treats a deliberately skipped branch as equivalent to a successful one specifically when the skip was caused by a feature flag rather than a data-driven If/Else condition.', isCorrect: false },
      { id: 'c', text: "The feature-flag system automatically forces the beta-enrichment task to report 'success' instead of 'skipped' whenever it's bypassed, specifically so that downstream ALL_SUCCESS checks are never affected by the flag.", isCorrect: false },
      { id: 'd', text: "Only the beta accounts are affected, since they're the only ones whose report-build task actually depends on the enrichment branch at all — non-beta accounts get their reports built through a separate, unrelated DAG path.", isCorrect: false },
    ],
    explanation:
      'Same underlying mechanism as before (ALL_SUCCESS treating skip as a blocker), but note how the impact inverts here — it hits the majority (non-beta) path, not the minority. The lesson is the same: NONE_FAILED for a sink downstream of any deliberately-skippable branch.',
    tags: ['ghost-sink-failure', 'run_if', 'dag'],
    concepts: ['orch-ghost-sink-failure', 'orch-run-if'],
  },
  {
    id: 'orc-mcq-a3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    question:
      'An experimentation pipeline has separate tasks for "variant A processing" and "variant B processing" per user, where each user only goes through the branch matching the variant they were assigned (the other branch is skipped for them). A downstream metrics-aggregation task depends on both branches with ALL_SUCCESS. What\'s the actual effect on the aggregated metrics?',
    options: [
      { id: 'a', text: 'The metrics-aggregation task never runs for any user — every user has exactly one of the two branches skipped, and ALL_SUCCESS requires both to have succeeded, so the entire experiment silently produces no aggregated metrics at all.', isCorrect: true },
      { id: 'b', text: 'Metrics are aggregated correctly for every user, since Databricks Workflows recognizes mutually exclusive branches and automatically treats a skip on one branch as a pass-through success for run_if purposes on that branch alone.', isCorrect: false },
      { id: 'c', text: 'Only users assigned to variant A ever see their metrics aggregated, because the ALL_SUCCESS rule evaluates upstream branches in the order they are defined in the DAG and stops checking once it finds the first success.', isCorrect: false },
      { id: 'd', text: "The DAG detects that the two branches can never both succeed for the same user and automatically switches the downstream task's run_if rule from ALL_SUCCESS to AT_LEAST_ONE_SUCCESS the first time this pattern is deployed.", isCorrect: false },
    ],
    explanation:
      'This is the most severe version of the pattern — a mutually-exclusive-branch design means ALL_SUCCESS can never actually be satisfied, so the sink never runs for anyone, not even intermittently. The complete, consistent failure can paradoxically make it easier to catch than the partial versions in the other two scenarios.',
    tags: ['ghost-sink-failure', 'run_if', 'dag'],
    concepts: ['orch-ghost-sink-failure', 'orch-run-if'],
  },

  // Cron Surgery (x3)
  {
    id: 'orc-mcq-a4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A retail team\'s logical pipeline is "ingest orders → build silver → build gold," but it\'s implemented as three SEPARATE Databricks Jobs, each on its own cron schedule staggered 20 minutes apart, instead of one Job with task dependencies. What goes wrong, and what\'s this anti-pattern called?',
    options: [
      { id: 'a', text: "'Cron Surgery' — splitting one logical DAG across separately-scheduled jobs replaces a real dependency with a timing assumption. If ingest runs long, silver starts on incomplete data anyway, and a failure in ingest doesn't stop silver from attempting to run — there's zero cross-job error propagation.", isCorrect: true },
      { id: 'b', text: 'Nothing goes wrong — three separately-scheduled jobs staggered by a fixed offset behave identically to one Workflow with three dependent tasks, since Databricks internally treats consistent cron timing as an implicit dependency.', isCorrect: false },
      { id: 'c', text: 'The three jobs will automatically be merged into a single Workflow the next time any one of them is opened and saved in the Databricks UI, since the platform detects the shared table lineage between them.', isCorrect: false },
      { id: 'd', text: 'This is purely a cost-optimization technique with no correctness downside at all, since giving each job its own dedicated cluster means a slowdown in one job can never have any effect on the other two jobs.', isCorrect: false },
    ],
    explanation:
      'The fix is straightforward: collapse the three jobs into one Workflow with real task dependencies (depends_on), so a failure genuinely blocks downstream tasks and there\'s no timing assumption to get wrong.',
    tags: ['cron-surgery', 'dag', 'workflows'],
    concepts: ['orch-cron-surgery'],
  },
  {
    id: 'orc-mcq-a5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A marketing-attribution pipeline is split across four separately-scheduled jobs (one per data source: ads, email, web, CRM) that must all complete before a fifth job builds the combined attribution model. There are no explicit dependencies between them — each just runs on its own fixed schedule. One week, the CRM job fails outright. What happens to the attribution model that week?',
    options: [
      { id: 'a', text: 'The attribution-model job runs on its own fixed schedule regardless, builds a model from only 3 of the 4 sources, and nothing marks the output as degraded — the CRM failure never propagates anywhere near the model\'s final consumer.', isCorrect: true },
      { id: 'b', text: 'The attribution-model job automatically detects that the CRM source job failed and pauses itself, retrying once per hour until the CRM job eventually succeeds, before resuming the model build with all four sources present.', isCorrect: false },
      { id: 'c', text: 'All four source jobs, including the three that already succeeded, are automatically re-triggered and re-run from scratch as soon as the CRM job fails, so the model build always waits for a complete, consistent set.', isCorrect: false },
      { id: 'd', text: "The attribution-model job fails outright with a clear 'missing CRM source' error message, which immediately notifies the on-call engineer that one of the four required upstream sources didn't complete that week.", isCorrect: false },
    ],
    explanation:
      'This is the real cost of Cron Surgery: it isn\'t just timing risk, it\'s the complete absence of failure propagation. A single Workflow with proper depends_on and run_if would have blocked the final job (or explicitly routed it to a degraded-but-flagged path) instead of silently producing an incomplete model.',
    tags: ['cron-surgery', 'dag', 'workflows'],
    concepts: ['orch-cron-surgery'],
  },
  {
    id: 'orc-mcq-a6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A finance month-end close pipeline is split into six separately-scheduled jobs across two teams (ledger team owns three, reporting team owns three), coordinated only by a shared spreadsheet of "expected finish times." One month, a ledger-team job silently produces a partial result due to an upstream data delay — it doesn\'t fail, it just finishes early with less data than usual. What is the biggest structural risk this setup creates?',
    options: [
      { id: 'a', text: 'A job that finishes "successfully" but with silently incomplete data gives the downstream reporting jobs no signal to react to — there\'s no shared DAG, no run_if, no dependency check, just a schedule and a spreadsheet. Published financial numbers can be wrong while every individual job reports success.', isCorrect: true },
      { id: 'b', text: 'None — as long as each of the six jobs individually finishes without throwing an error, the spreadsheet-coordinated chain is exactly as safe as one integrated Workflow with explicit task dependencies between all six steps.', isCorrect: false },
      { id: 'c', text: "The shared spreadsheet automatically updates its own cells whenever a job's output row count changes meaningfully, so in practice the coordination gap the two teams worry about doesn't actually exist day to day.", isCorrect: false },
      { id: 'd', text: 'This six-job, two-team setup is strictly safer than one shared Workflow, because splitting ownership across teams contains the blast radius of any single bug to just that team\'s three jobs, never spreading further.', isCorrect: false },
    ],
    explanation:
      'The finance domain raises the stakes but the mechanism is identical: Cron Surgery replaces real dependency-tracking with a human coordination process (a spreadsheet, a Slack thread, tribal knowledge of "usual" finish times), which has no way to catch a job that fails silently rather than loudly.',
    tags: ['cron-surgery', 'dag', 'workflows'],
    concepts: ['orch-cron-surgery'],
  },

  // Time-Gap Roulette (x3)
  {
    id: 'orc-mcq-a7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A gold sales-summary table is rebuilt by a job scheduled 90 minutes after the upstream silver job "usually" finishes. On a day the silver job runs 2 hours instead of the usual 45 minutes, what does the gold table end up containing, and what\'s the underlying failure called?',
    options: [
      { id: 'a', text: "'Time-Gap Roulette' — the gold job starts on schedule regardless, reading a silver table that's still mid-update, so the gold summary reflects an incomplete day and understates that day's sales, with no error anywhere in the pipeline.", isCorrect: true },
      { id: 'b', text: "The gold job automatically detects that the silver job is still running and postpones its own start time accordingly, with no manual configuration required, as a built-in behavior of every scheduled Databricks Job.", isCorrect: false },
      { id: 'c', text: 'The gold job fails loudly with a clear locking error, because Delta Lake blocks any read against a table that is currently in the middle of an active write transaction, preventing the incomplete read from happening at all.', isCorrect: false },
      { id: 'd', text: 'The gold table simply ends up built one full day behind schedule, and the pipeline automatically catches up and corrects the missing day\'s data the very next time the gold job runs, with no manual intervention needed.', isCorrect: false },
    ],
    explanation:
      'Delta does provide snapshot isolation for reads (you never see a torn/inconsistent write), but that doesn\'t help here — the gold job reads a perfectly consistent, just INCOMPLETE, snapshot of silver, because silver hadn\'t finished writing that day\'s data yet.',
    tags: ['time-gap-roulette', 'cross-team', 'triggers'],
    concepts: ['orch-time-gap-roulette'],
  },
  {
    id: 'orc-mcq-a8',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    question:
      "A customer-support metrics dashboard refreshes every morning at 7am, reading from a silver ticket-events table an entirely different team owns and updates \"sometime overnight.\" Support leadership starts noticing the dashboard occasionally looks a day stale, with no pattern they can identify. What's actually happening?",
    options: [
      { id: 'a', text: "The upstream team's overnight job doesn't run at a perfectly fixed time, and on nights it finishes after 7am, the dashboard's fixed-schedule refresh reads yesterday's silver snapshot — stale with no error, and no obvious pattern because it depends on that specific night's runtime.", isCorrect: true },
      { id: 'b', text: 'The dashboard tool itself has an internal caching bug that is entirely unrelated to the underlying data pipeline, and clearing the dashboard\'s browser cache each morning would reliably fix the staleness support keeps seeing.', isCorrect: false },
      { id: 'c', text: "The dashboard is actually working correctly every single morning, and support leadership is simply misreading the displayed timestamps, mistaking the silver table's last-modified time for the dashboard's own refresh time.", isCorrect: false },
      { id: 'd', text: 'Silver tables built on Delta Lake are only physically updated once per calendar week regardless of how frequently the upstream ingestion job is scheduled to run, which explains the apparent staleness support sees.', isCorrect: false },
    ],
    explanation:
      '"No pattern they can identify" is the tell — it\'s not deterministic because it depends on the upstream job\'s variable runtime each night, which is exactly the randomness a fixed-time trigger can\'t account for. A table-update trigger removes the randomness entirely.',
    tags: ['time-gap-roulette', 'cross-team', 'triggers'],
    concepts: ['orch-time-gap-roulette'],
  },
  {
    id: 'orc-mcq-a9',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A warehouse-inventory sync job runs at a fixed time each hour, reading the latest committed state from an upstream fulfillment-events table. Occasionally, in-flight orders get double-counted as available inventory for roughly an hour before the numbers correct themselves. What\'s the likely root cause?',
    options: [
      { id: 'a', text: "The fixed-hourly schedule occasionally runs while the upstream fulfillment-events table is only partially updated for that hour's orders — the sync reads a snapshot missing some just-fulfilled orders, over-counts inventory, and self-corrects once the next sync catches the now-complete table.", isCorrect: true },
      { id: 'b', text: "A bug in the sync job's own aggregation logic causes it to occasionally double-count in-flight orders, entirely independent of when the job happens to run relative to the upstream fulfillment-events table's own write schedule.", isCorrect: false },
      { id: 'c', text: "Delta Lake's time travel feature is misconfigured on the fulfillment-events table, causing the sync job to intermittently read an older, already-fulfilled version of the table instead of the current committed state.", isCorrect: false },
      { id: 'd', text: "The warehouse system's physical inventory count has its own independent counting error that happens to align with the hourly sync schedule purely by coincidence, unrelated to how or when the sync job actually runs.", isCorrect: false },
    ],
    explanation:
      'The "self-corrects an hour later" detail is the giveaway — that\'s the NEXT scheduled run happening to catch the upstream table once it\'s finally complete, which is Time-Gap Roulette working exactly as badly as it always does: intermittently and without an error to point at.',
    tags: ['time-gap-roulette', 'cross-team', 'triggers'],
    concepts: ['orch-time-gap-roulette'],
  },

  // Partition Blast Radius (x3)
  {
    id: 'orc-mcq-a10',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A finance analyst needs to reprocess just March 15th\'s transactions in a daily-partitioned gold table after finding a bug. They run the existing nightly job manually, which does df.write.mode("overwrite").saveAsTable("gold_daily_totals") with no date filter. What actually happens, and why is this called "Partition Blast Radius"?',
    options: [
      { id: 'a', text: "Only March 15th's partition is affected, since Delta Lake automatically inspects the incoming DataFrame's date values and infers which partition to scope the overwrite to, even without an explicit replaceWhere predicate.", isCorrect: false },
      { id: 'b', text: "The unscoped overwrite() replaces the entire table with just that one day's reprocessed rows - every other historical date is silently deleted. A single-day fix intended to touch one partition instead destroys years of financial history in one command.", isCorrect: true },
      { id: 'c', text: "The job fails outright with a clear error, because Delta Lake refuses to run mode('overwrite') on any table that has more than a single partition, specifically to prevent this exact kind of accidental data loss.", isCorrect: false },
      { id: 'd', text: 'Delta automatically creates a full backup snapshot of the table\'s previous state immediately before executing any overwrite() call, so the lost historical data can always be trivially and instantly recovered afterward.', isCorrect: false },
    ],
    explanation:
      'The fix is scoping the overwrite with a predicate — .option("replaceWhere", "event_date = \'2024-03-15\'") — so the write only touches the matching partition. (Time travel can recover the lost history after the fact, but that\'s a rescue, not a substitute for scoping the write correctly in the first place.)',
    tags: ['partition-blast-radius', 'replacewhere', 'backfill'],
    concepts: ['orch-partition-blast-radius'],
  },
  {
    id: 'orc-mcq-a11',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A healthcare data engineer needs to correct one week of a patient-visit gold table after a coding-system bug is found. Under a strict audit-retention policy, the team runs their standard weekly-refresh job, which does a full mode("overwrite") intended to only ever run on Sundays with a full week of fresh data. What is the compliance risk of running this same job to backfill just one historical week?',
    options: [
      { id: 'a', text: "None - the job is designed to run weekly with a full mode('overwrite'), so running that exact same job to backfill one historical week is precisely the use case it was built and tested for from the start.", isCorrect: false },
      { id: 'b', text: 'Healthcare tables stored in Delta Lake are automatically protected against destructive overwrite() calls by a built-in platform safeguard, regardless of how the write itself is coded or which options are passed to it.', isCorrect: false },
      { id: 'c', text: "The full-table overwrite() wipes out every other week's data along with the correction - for an audited healthcare table, that can mean an unrecoverable compliance violation, years of visit history gone, with real regulatory consequences beyond a normal data-quality incident.", isCorrect: true },
      { id: 'd', text: 'The risk described here only applies to gold-layer tables specifically, and does not apply at all to any bronze or silver table governed by the same audit-retention policy, regardless of how those tables are written to.', isCorrect: false },
    ],
    explanation:
      'This is the same Partition Blast Radius mechanism as the finance scenario, but the stakes shift the response: in a regulated domain, this isn\'t just "rebuild from bronze" — it can be a reportable incident. The prevention is identical either way: scope every backfill write to exactly the partition(s) being corrected.',
    tags: ['partition-blast-radius', 'replacewhere', 'backfill'],
    concepts: ['orch-partition-blast-radius'],
  },
  {
    id: 'orc-mcq-a12',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    question:
      'An e-commerce team\'s product-catalog gold table is partitioned by ingestion_date. An engineer wants to re-run just today\'s catalog sync after a source-feed glitch, so they re-trigger the existing sync notebook — which was written assuming it only ever runs once, on the current day, with mode("overwrite") and no date predicate. What happens the SECOND time they re-run it that same day to test their fix?',
    options: [
      { id: 'a', text: 'The second run is a completely safe no-op, since the source-feed glitch has already been fixed by that point and the data being written is byte-for-byte identical to what the first run already wrote to the table.', isCorrect: false },
      { id: 'b', text: "Delta Lake automatically detects that the same notebook has been triggered twice for the same logical day and silently merges the two runs' output together, deduplicating any overlapping rows before committing the write.", isCorrect: false },
      { id: 'c', text: 'The second run fails outright with a clear error, because Delta Lake enforces a hard rule that a given table can only be written to once within any single calendar day, specifically to prevent this kind of accidental duplication.', isCorrect: false },
      { id: 'd', text: "It 'works' by coincidence - the unscoped overwrite() replaces the whole table with today's corrected data both times, so a same-day re-run doesn't lose history. The real danger surfaces the day someone reuses this notebook to fix a PAST date, at which point the entire catalog history silently disappears.", isCorrect: true },
    ],
    explanation:
      'This scenario is deliberately the "it looks fine" case: an unscoped overwrite() run for the CURRENT day doesn\'t destroy history, because it\'s regenerating the same day it would\'ve overwritten anyway. That false sense of safety is exactly what makes the notebook a landmine — the missing replaceWhere predicate only becomes catastrophic the first time someone (reasonably) reuses it for a historical date.',
    tags: ['partition-blast-radius', 'replacewhere', 'backfill'],
    concepts: ['orch-partition-blast-radius'],
  },

  // Silent Drop Sinking (x3)
  {
    id: 'orc-mcq-a13',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A sales pipeline uses expect_or_drop on silver rows where order_total is null, with no quarantine table configured — dropped rows just vanish from the pipeline\'s metrics view, which nobody checks daily. Three months later, finance notices gold revenue is consistently a few percent lower than the source system reports. What happened, and what\'s this anti-pattern called?',
    options: [
      { id: 'a', text: "'Silent Drop Sinking' - expect_or_drop has been quietly removing a small but real fraction of orders every run for three months with no quarantine stream to catch them, and with nobody watching the DLT metrics dashboard, the under-reporting only surfaced via an unrelated cross-check months later.", isCorrect: true },
      { id: 'b', text: 'A few percent revenue gap sustained consistently over three full months is normal, expected noise in any large orders table and has no meaningful connection to how the expect_or_drop expectation is configured on that table.', isCorrect: false },
      { id: 'c', text: "expect_or_drop only ever removes rows during a Delta Live Tables pipeline's very first run after it's newly created, so a gap that has persisted steadily for three months couldn't possibly be caused by that expectation.", isCorrect: false },
      { id: 'd', text: 'The revenue gap must be caused by an unrelated currency-conversion bug somewhere upstream, since expect_or_drop only removes individual rows from a table\'s output and has no way to affect a downstream aggregate total.', isCorrect: false },
    ],
    explanation:
      'The fix is DLT\'s dual-stream quarantine pattern: route dropped rows to a separate table instead of just discarding them, and put row-drop volume on a dashboard someone actually watches — a silently draining metric is functionally the same as an unmonitored one.',
    tags: ['silent-drop-sinking', 'dlt', 'expectations'],
    concepts: ['orch-silent-drop-sinking'],
  },
  {
    id: 'orc-mcq-a14',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A marketing team\'s lead-scoring pipeline applies expect_or_drop to silver rows missing a lead_source field, no quarantine stream configured. After a source-system change starts omitting lead_source for an entire new channel, marketing\'s lead-volume dashboard shows a slow, steady decline over several weeks that nobody can explain from campaign performance alone. What\'s actually going on?',
    options: [
      { id: 'a', text: "The lead-scoring model itself must be gradually degrading in quality over time for some unrelated reason, and that degradation happens to coincide with the same weeks the new channel's leads started arriving without lead_source.", isCorrect: false },
      { id: 'b', text: "The entire new channel's leads are silently dropped every run because they all fail the lead_source check, and with no quarantine table, there's no visibility into which leads or how many are vanishing - the dashboard just shows an unexplained decline instead of a clear rejection signal.", isCorrect: true },
      { id: 'c', text: 'Rows removed by expect_or_drop are actually queued internally by Delta Live Tables and automatically re-inserted into the table once the upstream source-system issue generating them is eventually fixed, so this will self-correct.', isCorrect: false },
      { id: 'd', text: "Delta Live Tables automatically sends an email alert to the pipeline's registered owner any time a single expect_or_drop expectation removes more than 5% of a run's rows, so this should have already been flagged.", isCorrect: false },
    ],
    explanation:
      'A quarantine table would have made this diagnosable in minutes: querying it by lead_source (or its absence) and by date would immediately show a step-change on the day the new channel started omitting the field, rather than a mysterious multi-week "decline" the team had to reverse-engineer.',
    tags: ['silent-drop-sinking', 'dlt', 'expectations'],
    concepts: ['orch-silent-drop-sinking'],
  },
  {
    id: 'orc-mcq-a15',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A product-analytics pipeline uses expect_or_drop on event rows with a malformed session_id, no quarantine stream. After a mobile SDK update introduces a bug that malforms session_id for one specific app version, event-volume metrics for that version look artificially low in every downstream dashboard. What would a quarantine-stream have changed about how this was caught?',
    options: [
      { id: 'a', text: 'Nothing would change - a quarantine table only affects whether dropped rows are physically retained or discarded, and has no bearing at all on how quickly an engineer could trace the underlying SDK bug back to its source.', isCorrect: false },
      { id: 'b', text: 'A quarantine table would have automatically detected the malformed session_id pattern and applied a corrective transformation to repair the values in place, before those rows were ever dropped by the expectation in the first place.', isCorrect: false },
      { id: 'c', text: "With dropped rows landing in a quarantine table instead of vanishing, an engineer could query it directly, see it's dominated by one app version, and trace the malformed session_id back to that version's SDK update in minutes - instead of discovering it weeks later via 'why does engagement look low.'", isCorrect: true },
      { id: 'd', text: 'Quarantine tables in Delta Live Tables only ever capture rows removed by the expect_or_fail decorator, never rows removed by expect_or_drop, so a quarantine stream would not have captured anything useful in this scenario.', isCorrect: false },
    ],
    explanation:
      'The pattern across all three Silent Drop Sinking scenarios is the same: expect_or_drop is the right mechanism for excluding bad rows, but without a quarantine destination, "excluded" becomes indistinguishable from "vanished" — turning a five-minute query into a weeks-long mystery.',
    tags: ['silent-drop-sinking', 'dlt', 'expectations'],
    concepts: ['orch-silent-drop-sinking'],
  },

  // Discrimination question — two anti-patterns with a similar symptom
  {
    id: 'orc-mcq-a16',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A gold revenue table has been reading noticeably low for the past few days, with no pipeline failures anywhere. You know this could be either Time-Gap Roulette or Silent Drop Sinking — both produce "numbers are quietly too low, nothing errored." Which piece of evidence tells them apart?',
    options: [
      { id: 'a', text: "There's genuinely no way to distinguish the two from the symptom alone - both anti-patterns require rewriting the entire pipeline from scratch before any useful diagnostic information becomes available to an engineer.", isCorrect: false },
      { id: 'b', text: "Time-Gap Roulette is a failure mode that can only occur in streaming pipelines; Silent Drop Sinking is a failure mode that can only occur in batch pipelines, so the pipeline's execution mode alone is enough to tell them apart.", isCorrect: false },
      { id: 'c', text: 'Silent Drop Sinking always manifests as a complete, visible pipeline failure with an error message, while Time-Gap Roulette never produces any error at all, so the mere presence of an error is the deciding piece of evidence.', isCorrect: false },
      { id: 'd', text: 'Check whether the shortfall correlates with upstream job duration - some days low, some fine, tracking days the upstream ran long, points to Time-Gap Roulette - versus a steady under-count every run regardless of timing, traceable to rows failing a DLT expectation with no quarantine table, which points to Silent Drop Sinking.', isCorrect: true },
    ],
    explanation:
      'Time-Gap Roulette is a timing problem — its symptom is intermittent, correlated with how long the upstream happened to take that day, and fixed by triggers instead of fixed schedules. Silent Drop Sinking is a data-quality problem — its symptom is a steadier, expectation-shaped under-count, and fixed by adding a quarantine stream so the dropped rows become visible instead of invisible. Confusing the two sends you fixing the wrong layer of the pipeline.',
    tags: ['silent-drop-sinking', 'time-gap-roulette', 'discrimination'],
    concepts: ['orch-silent-drop-sinking', 'orch-time-gap-roulette'],
  },

  // ────────────────────────────────────────────────────────────────────
  // CODING (2) + PARSONS (1)
  // ────────────────────────────────────────────────────────────────────
  {
    id: 'orc-coding-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    language: CodeLanguage.PYTHON,
    question: `Define a Delta Live Tables silver table named silver_orders that reads from bronze_orders, applying two rules with different severities:

1. order_total must be greater than 0. This is a hard invariant — a violating row must never appear in the output, and its presence means something upstream is fundamentally broken, so the whole pipeline run should stop immediately.
2. customer_id must not be null. This is a soft rule — violations should be recorded for visibility, but the row should still be kept in the output; do not drop it and do not stop the pipeline.

Use the DLT expectation decorator that matches each rule's severity.`,
    starterCode: `import dlt

@dlt.table(name="silver_orders")
def silver_orders():
    return dlt.read("bronze_orders")`,
    testCases: [
      {
        input: 'bronze_orders',
        expectedOutput: 'silver_orders defined with expect_or_fail on order_total > 0 and expect on customer_id IS NOT NULL',
        description: 'Should apply expect_or_fail to the hard invariant and plain expect to the soft rule',
      },
    ],
    solution: `import dlt

@dlt.table(name="silver_orders")
@dlt.expect_or_fail("valid_order_total", "order_total > 0")
@dlt.expect("customer_id_present", "customer_id IS NOT NULL")
def silver_orders():
    return dlt.read("bronze_orders")
# OR
import dlt

@dlt.expect_or_fail("valid_order_total", "order_total > 0")
@dlt.expect("customer_id_present", "customer_id IS NOT NULL")
@dlt.table(name="silver_orders")
def silver_orders():
    return dlt.read("bronze_orders")`,
    explanation:
      'expect_or_fail matches rule 1 because continuing past a violation would mean the pipeline keeps building on fundamentally broken data — better to stop and force investigation. Plain expect matches rule 2 because a missing customer_id is tolerable and should not block the rest of the pipeline; it just needs to be visible in pipeline metrics.',
    tieredHints: {
      apiSignature: 'dlt.expect_or_fail(name, expr)',
      skeleton: `import dlt\n\n@dlt.table(name="silver_orders")\n@dlt.____("valid_order_total", "order_total > 0")\n@dlt.____("customer_id_present", "customer_id IS NOT NULL")\ndef silver_orders():\n    return dlt.____("bronze_orders")`,
    },
    hints: [
      'expect_or_fail stops the whole pipeline run on a violation — use it for the rule where continuing would be worse than stopping.',
      'expect keeps the row and only logs the violation — use it for the rule that\'s tolerable.',
      'Both decorators take a name string and a boolean SQL expression string, stacked above the table function.',
    ],
    tags: ['dlt', 'expectations', 'quality-gates'],
    concepts: ['orch-dlt-expectations', 'orch-quality-gates'],
  },
  {
    id: 'orc-coding-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    language: CodeLanguage.PYTHON,
    question: `The write below is meant to backfill a single day (March 15, 2024) in the Delta table gold_daily_sales, but as written it silently replaces the ENTIRE table with just that one day's rows every time it runs — a Partition Blast Radius bug. The table is partitioned by a DATE column named event_date.

Fix the write so it only replaces the March 15, 2024 partition and leaves every other date in gold_daily_sales untouched.`,
    starterCode: `(corrected_df
    .write
    .format("delta")
    .mode("overwrite")
    .saveAsTable("gold_daily_sales"))`,
    testCases: [
      {
        input: 'corrected_df for event_date = 2024-03-15',
        expectedOutput: 'write scoped to event_date = \'2024-03-15\' via the replaceWhere option, other partitions untouched',
        description: 'Should scope the overwrite to only the March 15, 2024 partition',
      },
    ],
    solution: `(corrected_df
    .write
    .format("delta")
    .mode("overwrite")
    .option("replaceWhere", "event_date = '2024-03-15'")
    .saveAsTable("gold_daily_sales"))
# OR
corrected_df.write.format("delta").mode("overwrite").option("replaceWhere", "event_date = '2024-03-15'").saveAsTable("gold_daily_sales")`,
    explanation:
      'The replaceWhere option scopes an overwrite() to only the rows matching the predicate — Delta atomically replaces just the matching partition(s) and leaves everything else in the table exactly as it was. Without it, mode("overwrite") always means the WHOLE table, regardless of how narrow the DataFrame being written actually is.',
    tieredHints: {
      apiSignature: 'dfWriter.option(key, value)',
      skeleton: `(corrected_df\n    .____\n    .____("delta")\n    .____("overwrite")\n    .____("replaceWhere", "event_date = '2024-03-15'")\n    .____("gold_daily_sales"))`,
    },
    hints: [
      'Delta\'s replaceWhere write option scopes an overwrite to only matching rows.',
      'The predicate is a SQL boolean expression string comparing the partition column to the target date.',
      'Without replaceWhere, mode("overwrite") always replaces the entire table, no matter how small the input DataFrame is.',
    ],
    tags: ['partition-blast-radius', 'replacewhere', 'backfill'],
    concepts: ['orch-partition-blast-radius', 'dim-idempotency'],
  },
  {
    id: 'orc-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    language: CodeLanguage.PYTHON,
    question:
      'Reassemble a for_each_task backfill configuration (as a Python dict) that reprocesses each date in backfill_dates, running at most 4 dates concurrently at once, where each iteration runs the backfill_one_date notebook task.',
    correctOrder: [
      'for_each_task_config = {',
      '    "inputs": backfill_dates,',
      '    "concurrency": 4,',
      '    "task": {"task_key": "backfill_one_date", "notebook_task": {"notebook_path": "/Repos/etl/backfill_day"}},',
      '}',
    ],
    distractorLines: [
      '    "concurrency": 999,',
      'for_each_task_config = [',
    ],
    solution:
      'for_each_task_config = {\n    "inputs": backfill_dates,\n    "concurrency": 4,\n    "task": {"task_key": "backfill_one_date", "notebook_task": {"notebook_path": "/Repos/etl/backfill_day"}},\n}',
    explanation:
      'The config is a dict (not a list) with three keys: inputs (the array to loop over), concurrency (the cap — deliberately modest, since a huge value like 999 defeats the entire purpose by re-creating the cluster-quota and Delta-log contention the cap exists to prevent), and task (the template run once per input value).',
    hints: [
      'for_each_task is configured as a dict with "inputs", "concurrency", and "task" keys — not a list.',
      'A very high concurrency value defeats the purpose: the cap exists specifically to bound parallel load on the cluster and the Delta log.',
      'The "task" key holds the template that runs once per date in "inputs".',
    ],
    tags: ['for_each_task', 'backfill', 'concurrency', 'parsons'],
    concepts: ['orch-for-each-task'],
  },
];

