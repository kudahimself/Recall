import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

// ORCHESTRATION_DESIGN - Databricks course, "Lakehouse Architecture &
// Engineering Practice" section.
//
// This topic is the orchestration and data-quality design layer on top of
// databricks_workflows and pipeline_design: run one pipeline as one Lakeflow
// Job, start on a table update instead of a guessed time, run_if rules,
// for_each_task backfills, and the bronze/silver/gold quality checks built
// with pipeline expectations, plus the failures that follow when these are
// misused (a fan-in left on ALL_SUCCESS, staggered cron jobs, a fixed-time
// guess, an unscoped overwrite, dropped rows nobody sees).
//
// Coverage (37 questions):
//   Beginner (6 MCQ): the six core ideas.
//   Intermediate (12): 6 predicts that run the run_if and expectation rules
//     as small Python functions, and 6 scenario MCQs.
//   Advanced (16 MCQ): each failure in three settings, and one question that
//     tells two look-alike failures apart.
//   Coding/Parsons (3): expectations of two severities, a scoped backfill
//     write, and a for_each_task definition.

export const orchestrationDesignQuestions: Question[] = [
  // ────────────────────────────────────────────────────────────────────
  // BEGINNER (6)
  // ────────────────────────────────────────────────────────────────────
  {
    id: 'orc-mcq-b1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    question:
      'In a Databricks job, what does it mean for the task graph to "fan out" and then "fan in"?',
    options: [
      { id: 'a', text: 'Fan-out runs the whole job twice in parallel as a safety copy, and fan-in keeps only the output of whichever copy finishes first.', isCorrect: false },
      { id: 'b', text: 'Fan-out is a task that retries a failed step several times, and fan-in is the point where the retries stop and the job is marked failed.', isCorrect: false },
      { id: 'c', text: 'Fan-out is one task followed by several parallel tasks, such as one per region; fan-in is a task that depends on all of those branches.', isCorrect: true },
      { id: 'd', text: 'Fan-out splits a table into many partitions for Spark to process, and fan-in is the repartitioning that joins them back into one.', isCorrect: false },
    ],
    explanation:
      'Fan-out and fan-in describe the shape of the task graph. A root task, such as one that finds the regions, is followed by one parallel branch per slice, and a final task that depends on every branch builds the combined result. A first task often hands the list of slices on with taskValues.',
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
      'A task depends on several upstream tasks. What do the run_if rules ALL_SUCCESS, NONE_FAILED and AT_LEAST_ONE_SUCCESS each decide?',
    options: [
      { id: 'a', text: "ALL_SUCCESS runs only if every upstream succeeded; NONE_FAILED also accepts skipped ones but stops on a failure; AT_LEAST_ONE_SUCCESS needs one success.", isCorrect: true },
      { id: 'b', text: 'ALL_SUCCESS runs once every upstream has finished, whatever its result; NONE_FAILED treats a skipped upstream as a failure; AT_LEAST_ONE_SUCCESS needs a majority.', isCorrect: false },
      { id: 'c', text: 'They set retry budgets: ALL_SUCCESS retries a failed upstream 3 times, NONE_FAILED retries it 5 times, and AT_LEAST_ONE_SUCCESS retries until one attempt works.', isCorrect: false },
      { id: 'd', text: 'They set when the task starts: ALL_SUCCESS when the upstreams begin, NONE_FAILED when the first one begins, AT_LEAST_ONE_SUCCESS in random order.', isCorrect: false },
    ],
    explanation:
      'run_if decides whether a task runs, given the outcomes of its upstream tasks. ALL_SUCCESS is the default. It is often too strict once the graph has branches that are skipped on purpose, which is the cause of the Ghost Sink Failure later in this topic. NONE_FAILED accepts success and skipped but stops on a real failure.',
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
      "What is the problem with scheduling a downstream job at a fixed cron time chosen to be \"a bit after\" another team's job usually finishes, and what is the Lakeflow alternative?",
    options: [
      { id: 'a', text: 'A fixed offset is always safe, because Databricks adds a hidden buffer to every cron schedule that absorbs normal differences in run time.', isCorrect: false },
      { id: 'b', text: 'It leaves the downstream cluster idle while it waits, and the fix is to have that cluster shut down sooner between runs.', isCorrect: false },
      { id: 'c', text: "A fixed time only guesses the upstream's run time; a table update trigger starts the job when the upstream table actually changes.", isCorrect: true },
      { id: 'd', text: 'The fix is to drop schedules altogether and run every downstream job all the time, so no gap can open after the upstream finishes.', isCorrect: false },
    ],
    explanation:
      'The cron time is a guess about someone else\'s run time. The day the upstream runs longer, the downstream starts anyway and builds from stale or partial data, and nothing reports an error. A table update trigger replaces the guess with a real signal: the job starts when the upstream table has been updated.',
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
      "When backfilling a range of historical dates, what does a for_each_task loop with a concurrency limit give you that starting every date's run at once does not?",
    options: [
      { id: 'a', text: "One task per date, with a cap on how many run together, so the cluster holds up and commits to the table do not collide.", isCorrect: true },
      { id: 'b', text: 'It retries a failing date again and again with no cap, even when the error is one a retry could never fix.', isCorrect: false },
      { id: 'c', text: 'It turns each batch task into a continuously running streaming task, so old dates are processed as if they were arriving live.', isCorrect: false },
      { id: 'd', text: 'It guarantees the dates reach the table in order, with each date fully committed before the next date is allowed to start.', isCorrect: false },
    ],
    explanation:
      'for_each_task runs one copy of a task template per input value. The concurrency limit, such as 4, keeps the loop from using every worker at once and from making many runs commit to the same Delta table together, which slows them down and can make them conflict. The dates still need a write that is safe to repeat.',
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
      'In a bronze, silver and gold pipeline, how do you decide where a data-quality check belongs and what it should do when it fails?',
    options: [
      { id: 'a', text: 'Bronze checks business sanity before any transformation, silver checks structure on cleaned data, and gold checks integrity as a last pass before a BI tool reads it.', isCorrect: false },
      { id: 'b', text: "Bronze checks a record parses and flags it if not; silver checks the table's own rules and quarantines bad rows; gold checks the business number is sensible.", isCorrect: true },
      { id: 'c', text: 'Only silver needs checks, because gold inherits silver\'s correctness automatically and bronze is meant to hold whatever arrives.', isCorrect: false },
      { id: 'd', text: 'Bronze checks that files stay under a size limit, silver that column names follow a convention, and gold that the BI refresh finished on time.', isCorrect: false },
    ],
    explanation:
      'Each hop checks a different kind of correctness. Bronze asks whether a record parses at all. Silver asks whether the rows obey the table\'s invariants, such as a unique key or a value that cannot be negative. Gold asks whether the business number is plausible. Putting all checks at one hop either lets structural garbage in early or makes gold carry the cleaning.',
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
      'In a Lakeflow Spark Declarative Pipeline (formerly Delta Live Tables), what is the difference in behavior between the expect, expect_or_drop and expect_or_fail decorators?',
    options: [
      { id: 'a', text: "expect records violations in the pipeline metrics but keeps the rows; expect_or_drop also removes them; expect_or_fail stops the update.", isCorrect: true },
      { id: 'b', text: 'expect works only on numeric columns, expect_or_drop only on string columns, and expect_or_fail only on columns used in a join.', isCorrect: false },
      { id: 'c', text: 'expect logs a warning and keeps the row; expect_or_drop keeps it too but marks it low-confidence; expect_or_fail behaves exactly like expect_or_drop.', isCorrect: false },
      { id: 'd', text: 'expect applies only to streaming tables and expect_or_drop only to batch tables, while expect_or_fail has been retired and acts like expect.', isCorrect: false },
    ],
    explanation:
      'Pick the severity to match the rule. expect is for a rule you want to watch without changing the data. expect_or_drop removes violating rows from the target and lets the update continue. expect_or_fail treats a violation as fatal: the update stops and nothing from that batch is committed.',
    tags: ['dlt', 'expectations'],
    concepts: ['orch-dlt-expectations'],
  },

  // ────────────────────────────────────────────────────────────────────
  // INTERMEDIATE (12) - 6 predicts + 6 scenario MCQs
  // ────────────────────────────────────────────────────────────────────
  {
    id: 'orc-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    language: CodeLanguage.PYTHON,
    question:
      'This Python function models how a run_if rule decides whether a task runs, from the outcomes of its upstream tasks. What does the code print? The answer is True or False.',
    code: `def should_run(rule, outcomes):
    if rule == "ALL_SUCCESS":
        return all(v == "success" for v in outcomes.values())
    if rule == "NONE_FAILED":
        return all(v != "failed" for v in outcomes.values())
    if rule == "AT_LEAST_ONE_SUCCESS":
        return any(v == "success" for v in outcomes.values())

outcomes = {"regional_a": "success", "regional_b": "failed", "regional_c": "success"}
print(should_run("ALL_SUCCESS", outcomes))`,
    expectedOutput: 'False',
    explanation:
      'ALL_SUCCESS needs every upstream outcome to be "success", and regional_b failed, so the check is False however many of the others succeeded. This is the strict default rule.',
    hints: [
      'Which rule is being checked, and what does it require of every outcome?',
    ],
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
      'The same should_run function, now checked with NONE_FAILED where one upstream branch was skipped on purpose and none failed. What does the code print? The answer is True or False.',
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
      'NONE_FAILED only rejects the value "failed", so a skipped branch passes. That is why NONE_FAILED is the rule for a fan-in task downstream of an If/Else branch that is skipped on purpose; ALL_SUCCESS would block it.',
    hints: [
      'Does "skipped" equal "failed"?',
    ],
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
      'The same should_run function, now checked with AT_LEAST_ONE_SUCCESS where two of three upstream branches failed. What does the code print? The answer is True or False.',
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
      'AT_LEAST_ONE_SUCCESS needs only one success among the upstream outcomes, and replica_b succeeded. It is the most permissive of the three rules and suits work that is still useful with only part of the inputs, such as publishing from the replicas that came back.',
    hints: [
      'How many successes does this rule need?',
    ],
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
      'This Python function models what each expectation kind does to a batch of order totals; a total is bad if it is zero or less. What does the code print for expect? The answer is the printed line: either "N kept, M bad" with two numbers, or the single word failed.',
    code: `def run(kind, totals):
    bad = [t for t in totals if t <= 0]
    if kind == "expect":
        kept = totals
    elif kind == "expect_or_drop":
        kept = [t for t in totals if t > 0]
    elif bad:
        return "failed"
    else:
        kept = totals
    return f"{len(kept)} kept, {len(bad)} bad"

totals = [30, -2, 15, 0]
print(run("expect", totals))`,
    expectedOutput: '4 kept, 2 bad',
    explanation:
      'Two of the four totals are bad (-2 and 0). Plain expect only counts the violations, so all 4 rows are kept: "4 kept, 2 bad". The bad rows still land in the table, which is why expect is the wrong choice for a rule that must never let bad data through.',
    hints: [
      'Which totals are zero or less?',
      'What does expect do with a row that breaks the rule?',
    ],
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
      'The same run function and the same batch, now with expect_or_drop. What does the code print? The answer is the printed line: either "N kept, M bad" with two numbers, or the single word failed.',
    code: `def run(kind, totals):
    bad = [t for t in totals if t <= 0]
    if kind == "expect":
        kept = totals
    elif kind == "expect_or_drop":
        kept = [t for t in totals if t > 0]
    elif bad:
        return "failed"
    else:
        kept = totals
    return f"{len(kept)} kept, {len(bad)} bad"

totals = [30, -2, 15, 0]
print(run("expect_or_drop", totals))`,
    expectedOutput: '2 kept, 2 bad',
    explanation:
      'expect_or_drop removes the 2 bad rows and keeps 30 and 15: "2 kept, 2 bad". The update goes on without them, which is right for a rule where bad rows should be excluded, provided the dropped rows are also sent to a quarantine table so they can be seen and fixed.',
    hints: [
      'Which rows does expect_or_drop remove?',
    ],
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
      'The same run function and the same batch, now with expect_or_fail. What does the code print? The answer is the printed line: either "N kept, M bad" with two numbers, or the single word failed.',
    code: `def run(kind, totals):
    bad = [t for t in totals if t <= 0]
    if kind == "expect":
        kept = totals
    elif kind == "expect_or_drop":
        kept = [t for t in totals if t > 0]
    elif bad:
        return "failed"
    else:
        kept = totals
    return f"{len(kept)} kept, {len(bad)} bad"

totals = [30, -2, 15, 0]
print(run("expect_or_fail", totals))`,
    expectedOutput: 'failed',
    explanation:
      'The batch has bad rows and the kind is expect_or_fail, so the function returns "failed": a violation is fatal and the update stops with nothing committed. Use it for a hard invariant, such as a total that can never be negative, and not for rules where a few bad rows are an expected part of real data.',
    hints: [
      'Follow the branches in order: which condition matches expect_or_fail with bad rows present?',
    ],
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
      'A downstream job reads a table that another team owns and runs at a fixed 6am, because the upstream "usually" finishes by 5:45am. One morning the upstream runs until 6:10am. What happens, and what is the fix?',
    options: [
      { id: 'a', text: 'Databricks sees the upstream is still running and delays the downstream start until its last write commits, with no configuration needed.', isCorrect: false },
      { id: 'b', text: 'The downstream job fails at once with an "upstream table not ready" error, which pages the on-call engineer before any incomplete data is read.', isCorrect: false },
      { id: 'c', text: 'The downstream job retries every 5 minutes until the upstream table\'s row count stops changing, so the problem is caught within about 15 minutes.', isCorrect: false },
      { id: 'd', text: "The job runs at 6am on what is committed so far, with no error, and builds stale or partial output; use a table update trigger instead.", isCorrect: true },
    ],
    explanation:
      'The schedule knows nothing about the upstream. The downstream job reads the last committed version of the table, which is missing the new data, and succeeds. Because nothing fails, the wrong gold output is harder to notice than an outright error. A table update trigger starts the job from the upstream table\'s change.',
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
      'A compliance rule says a reporting pipeline must never read an upstream regulatory table while it is only partly written for the day. A fixed start time, even a late one, is not enough. What solves it?',
    options: [
      { id: 'a', text: 'Agree what "complete for the day" means, such as a marker row or table, and start the pipeline on that signal rather than on a clock time.', isCorrect: true },
      { id: 'b', text: 'Schedule the pipeline as late in the day as is reasonable and rely on the upstream always being done by then, which is the usual accepted approach.', isCorrect: false },
      { id: 'c', text: "Use a bigger cluster so the read finishes before any partial rows can be seen, whatever time the job starts on a cluster sized for the whole table.", isCorrect: false },
      { id: 'd', text: 'Poll the upstream row count every minute and start once it has stopped changing for two checks, treating a steady count as proof of completion.', isCorrect: false },
    ],
    explanation:
      'A pause in the middle of a write looks the same as a finished one, so a steady row count proves nothing. An explicit completion signal, agreed between the two teams as a data contract, is the reliable form of "wait for the upstream". A table update trigger or a completion-marker table implements that signal.',
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
      'You must backfill 90 days of a silver table. Starting all 90 runs at once causes cluster quota errors and commit conflicts. You also want each day to appear as its own run that can fail and be retried alone. What is the fix?',
    options: [
      { id: 'a', text: 'Loop over the dates inside one notebook task, one day after another, so there is a single long run on one cluster.', isCorrect: false },
      { id: 'b', text: 'Create 90 separate jobs, each on a cron schedule a few minutes after the one before it, so they never overlap.', isCorrect: false },
      { id: 'c', text: 'Empty the silver table and reload every date from bronze in one large job, since backfilling over existing data is riskier than starting clean.', isCorrect: false },
      { id: 'd', text: 'Use a for_each_task over the 90 dates with a concurrency limit such as 4 to 8, so a few days run together without exceeding capacity.', isCorrect: true },
    ],
    explanation:
      'for_each_task makes each date its own run, so a failed day shows up alone and can be repeated without the rest. The concurrency limit gives enough parallelism to finish in reasonable time while staying inside the cluster and keeping the commits to the table manageable. One notebook loop hides the days inside a single run; staggered cron jobs replace dependencies with timing guesses.',
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
      'A 90-date for_each_task backfill fails after 60 dates succeed. You start the whole loop again from the top. What must the write for each date be so that doing this is safe?',
    options: [
      { id: 'a', text: 'Idempotent, for example replaceWhere scoped to that one date, so repeating a date leaves the table the same as before.', isCorrect: true },
      { id: 'b', text: 'As fast as possible, so that redoing all 90 dates, including the 60 that were already right, is cheap enough to accept.', isCorrect: false },
      { id: 'c', text: 'Append-only, so a repeat never touches rows already written and a date that ran before just adds a second copy.', isCorrect: false },
      { id: 'd', text: 'Nothing special, because a new run of the loop skips the dates that succeeded in an earlier run and only runs the rest.', isCorrect: false },
    ],
    explanation:
      'A new run of the loop starts every date again. That is only safe when each date\'s write replaces that date\'s rows, with replaceWhere or MERGE, so the 60 finished dates are rewritten with the same data and the 30 unfinished ones are completed. An append would duplicate the finished dates.',
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
      'A silver order_total must never be negative: if it ever is, something upstream is broken and every gold number built on it would be wrong. Which expectation fits this rule?',
    options: [
      { id: 'a', text: 'expect, which logs the violation and lets the update run on, because a negative total is ordinary variation in transaction data.', isCorrect: false },
      { id: 'b', text: 'expect_or_drop, which removes any row with a negative total and carries on, since a few malformed rows are normal in a large orders table.', isCorrect: false },
      { id: 'c', text: 'expect_or_fail, since carrying on would publish wrong numbers; stopping the update forces someone to find the upstream cause.', isCorrect: true },
      { id: 'd', text: 'None of them, because a rule like this belongs in application code before the data reaches the pipeline, not in an expectation on silver.', isCorrect: false },
    ],
    explanation:
      'Choose expect_or_fail when carrying on would be worse than stopping. A negative order total usually means an upstream extraction or currency bug, and gold numbers built on it would be wrong. A late pipeline is better than a wrong one.',
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
      'A known, small share of incoming rows lack an optional promo_code. That is expected and harmless, and nothing is broken. Which expectation fits, and why not expect_or_fail?',
    options: [
      { id: 'a', text: 'expect_or_fail, because any row missing a declared field should stop the update; tolerating one gap sets a precedent for the other rules.', isCorrect: false },
      { id: 'b', text: 'expect_or_drop, because a row without promo_code means nothing to consumers, so removing it keeps every declared field complete.', isCorrect: false },
      { id: 'c', text: "expect records the rows and keeps them; expect_or_fail would halt the pipeline over harmless variation and teach people to ignore failures.", isCorrect: true },
      { id: 'd', text: 'expect_or_fail, because a table\'s expectations must all share one severity, so mixing expect and expect_or_fail on one table is not allowed.', isCorrect: false },
    ],
    explanation:
      'Use the mildest rule that fits. A missing optional field is expected, so expect records it for visibility and changes nothing. Using expect_or_fail on routine variation turns it into failed updates and alerts, and a team that gets alerts for nothing stops trusting them, including the ones that matter. Expectations of different severities can sit on one table.',
    tags: ['dlt', 'expectations', 'quality-gates'],
    concepts: ['orch-dlt-expectations', 'orch-quality-gates'],
  },

  // ────────────────────────────────────────────────────────────────────
  // ADVANCED (16)
  // ────────────────────────────────────────────────────────────────────

  // Fan-in left on ALL_SUCCESS (x3)
  {
    id: 'orc-mcq-a1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    question:
      'In a job, an If/Else task skips the "apply local tax rules" branch for most regions. The final gold task depends on both that branch and the main branch, and keeps the default run_if of ALL_SUCCESS. What happens for a region where the tax branch is skipped, and what is the fix?',
    options: [
      { id: 'a', text: 'Nothing unusual: ALL_SUCCESS treats a task skipped on purpose as a success, because conditional branches are meant to be invisible to run_if.', isCorrect: false },
      { id: 'b', text: 'The gold task is skipped too, since a skip is not "success", so gold is not built although nothing failed; set the gold task to NONE_FAILED.', isCorrect: true },
      { id: 'c', text: 'Databricks notices the conditional branch and rewrites the gold task\'s rule to NONE_FAILED itself, so it runs correctly without any change.', isCorrect: false },
      { id: 'd', text: 'The gold task runs twice for that region, once when the skip is recorded and once when the other branch finishes, writing duplicate rows.', isCorrect: false },
    ],
    explanation:
      'This is the Ghost Sink Failure. ALL_SUCCESS needs every upstream task to succeed, and a task skipped on purpose did not, so the fan-in task is skipped as well, with no failure to point at. NONE_FAILED accepts succeeded and skipped upstream tasks and still stops on a real failure, which is what the If/Else branch was designed to allow.',
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
      'A job has a beta_flag parameter. An If/Else task runs the "enrich with beta data" task only when the flag is true, and skips it otherwise. The report-build task depends on that task with ALL_SUCCESS. Which runs break, and why?',
    options: [
      { id: 'a', text: 'None, because Databricks counts a task skipped by a feature flag as a success, unlike one skipped by a data condition.', isCorrect: false },
      { id: 'b', text: 'Only the runs with the flag on, since they are the only ones whose report-build task depends on the enrichment task at all.', isCorrect: false },
      { id: 'c', text: "Runs with the flag off: the enrichment is skipped, not successful, so ALL_SUCCESS skips report-build and those runs produce no report.", isCorrect: true },
      { id: 'd', text: 'None, because the flag system forces the skipped enrichment task to report "success" whenever it is bypassed, so ALL_SUCCESS is never affected.', isCorrect: false },
    ],
    explanation:
      'The mechanism is the same as in the previous question, but the harm falls on the common path: runs with the flag off never get a report, and it looks like an unrelated failure. A task downstream of any branch that can be skipped on purpose needs NONE_FAILED.',
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
      'An experiment job takes a variant parameter, A or B. An If/Else task sends each run to either process_a or process_b, and the other is skipped. A metrics task depends on both with ALL_SUCCESS. What is the effect on the metrics?',
    options: [
      { id: 'a', text: "The metrics task never runs: every run skips one of the two branches and ALL_SUCCESS needs both to succeed, so no metrics are produced at all.", isCorrect: true },
      { id: 'b', text: 'Metrics are produced correctly, because Databricks recognises branches that exclude each other and passes a skipped one as a success.', isCorrect: false },
      { id: 'c', text: 'Only runs for variant A get metrics, because ALL_SUCCESS checks the upstream tasks in the order they are listed and stops at the first success.', isCorrect: false },
      { id: 'd', text: 'The first deployment switches the metrics task to AT_LEAST_ONE_SUCCESS once it sees that the two branches can never both succeed.', isCorrect: false },
    ],
    explanation:
      'With exclusive branches ALL_SUCCESS can never be satisfied, so the metrics task is skipped on every run. The total failure is at least easy to spot, unlike the partial versions. The fix is NONE_FAILED (or AT_LEAST_ONE_SUCCESS) on the task that follows the branches.',
    tags: ['ghost-sink-failure', 'run_if', 'dag'],
    concepts: ['orch-ghost-sink-failure', 'orch-run-if'],
  },

  // One pipeline split across separately scheduled jobs (x3)
  {
    id: 'orc-mcq-a4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    question:
      "A retail team's pipeline \"ingest orders, build silver, build gold\" runs as three separate jobs on their own cron schedules, 20 minutes apart, instead of one job with task dependencies. What goes wrong?",
    options: [
      { id: 'a', text: 'Nothing: three jobs 20 minutes apart behave like one job with three dependent tasks, since Databricks treats steady timing as an implicit dependency.', isCorrect: false },
      { id: 'b', text: 'Each dependency became a timing guess: if ingest runs long silver starts on incomplete data, and a failed ingest does not stop silver from running.', isCorrect: true },
      { id: 'c', text: 'The three jobs are merged into one workflow the next time one is saved in the UI, because the platform sees the shared table lineage.', isCorrect: false },
      { id: 'd', text: 'Nothing, and it saves cost: with a dedicated cluster per job a slow job can never affect the other two, so there is no downside.', isCorrect: false },
    ],
    explanation:
      'Splitting one logical pipeline across schedules replaces a real dependency with an assumption about run time, and it also removes any error propagation between the jobs. The fix is one job with depends_on, so a failure blocks what follows and there is no timing to get wrong.',
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
      'A marketing attribution model is built by a fifth job that needs four source jobs (ads, email, web, CRM) to finish first. The five jobs run on their own fixed schedules with no dependencies between them. One week the CRM job fails. What happens to the model that week?',
    options: [
      { id: 'a', text: 'The model job waits, retrying every hour until the CRM job succeeds, and only then builds the model from all four sources.', isCorrect: false },
      { id: 'b', text: 'All four source jobs, including the three that worked, are re-run from scratch so the model always sees a complete set.', isCorrect: false },
      { id: 'c', text: 'The model job runs on its own schedule, builds from the three sources it has, and nothing marks the result as incomplete.', isCorrect: true },
      { id: 'd', text: 'The model job fails with a clear "missing CRM source" message that notifies the on-call engineer of the gap.', isCorrect: false },
    ],
    explanation:
      'Without dependencies a failure travels nowhere. The model job does not know the CRM job exists, so it runs and succeeds on three of four inputs. One job with depends_on and a suitable run_if would have blocked the model, or routed it to a deliberate, labelled partial path.',
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
      'A month-end close runs as six separately scheduled jobs owned by two teams, coordinated by a shared spreadsheet of expected finish times. One month a ledger job finishes early with less data than usual, without failing. What is the biggest structural risk?',
    options: [
      { id: 'a', text: "A job that succeeds with incomplete data gives the next jobs no signal, so wrong figures can be published while every job reports success.", isCorrect: true },
      { id: 'b', text: 'None, as long as each job finishes without an error, because the spreadsheet is as safe as one workflow with dependencies between all six steps.', isCorrect: false },
      { id: 'c', text: 'The spreadsheet updates its own cells whenever a job\'s row count changes a lot, so the gap between the teams does not exist in practice.', isCorrect: false },
      { id: 'd', text: 'It is safer than one shared workflow, because ownership split across two teams keeps any bug to that team\'s three jobs.', isCorrect: false },
    ],
    explanation:
      'The finance setting raises the stakes but the mechanism is the same: dependency tracking has been replaced with a human process, a spreadsheet and tribal knowledge of usual finish times, which cannot catch a job that is quietly wrong. Dependencies and a data check, such as a gold-level expectation, would have stopped the chain.',
    tags: ['cron-surgery', 'dag', 'workflows'],
    concepts: ['orch-cron-surgery'],
  },

  // Starting on a guessed time (x3)
  {
    id: 'orc-mcq-a7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A gold sales summary is rebuilt by a job scheduled 90 minutes after the silver job "usually" finishes. One day silver takes 2 hours instead of 45 minutes. What does gold contain, and what is the underlying failure?',
    options: [
      { id: 'a', text: 'Gold waits until silver finishes, because every scheduled job notices when the tables it reads are still being written.', isCorrect: false },
      { id: 'b', text: 'Gold reads silver\'s half-written files and fails with a corrupt-file error, because Delta readers can see uncommitted data.', isCorrect: false },
      { id: 'c', text: "Gold ends up one day behind, and the next run corrects it automatically, so nobody needs to do anything, and the summary is simply a day late.", isCorrect: false },
      { id: 'd', text: "Gold starts on the clock and reads silver's last commit, missing that day with no error; the schedule only guessed silver's run time.", isCorrect: true },
    ],
    explanation:
      'Delta readers always see a consistent committed version, never a torn write. That does not help here: the version gold reads is consistent but incomplete, because silver has not yet committed the new data. The run succeeds with understated numbers. Starting gold from a table update trigger removes the guess.',
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
      'A support dashboard refreshes every morning at 7am from a silver ticket table that another team updates "sometime overnight". Leadership sees it look a day stale now and then, with no pattern. What is happening?',
    options: [
      { id: 'a', text: 'The dashboard tool has a caching bug unrelated to the pipeline, and clearing its cache each morning would fix it.', isCorrect: false },
      { id: 'b', text: "On nights the other job ends after 7am the refresh reads yesterday's data, and as run time varies, the staleness has no pattern.", isCorrect: true },
      { id: 'c', text: 'The dashboard is correct every day, and leadership is reading the silver table\'s last-modified time as the dashboard\'s refresh time.', isCorrect: false },
      { id: 'd', text: 'Silver tables on Delta Lake are written physically only once a week, whatever the schedule of the ingestion job.', isCorrect: false },
    ],
    explanation:
      '"No pattern" is the clue: the staleness depends on how long the other team\'s job happened to run that night, which a fixed 7am refresh cannot account for. Starting the refresh from a table update trigger on the silver table removes the randomness.',
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
      'An hourly inventory job runs at a fixed minute and reads a fulfilment-events table. Now and then stock levels come out too high for about an hour and then correct themselves. What is the likely root cause?',
    options: [
      { id: 'a', text: "It sometimes runs while the events table is part updated, so it misses fulfilled orders; the next run sees the full table.", isCorrect: true },
      { id: 'b', text: 'A bug in the job\'s own aggregation double-counts orders now and then, whenever the job runs relative to the events table\'s writes.', isCorrect: false },
      { id: 'c', text: 'Delta time travel is misconfigured on the events table, so the job sometimes reads an older version instead of the current one.', isCorrect: false },
      { id: 'd', text: 'The warehouse\'s own physical count has an error that happens to line up with the hourly run, unrelated to when the job runs.', isCorrect: false },
    ],
    explanation:
      'The clue is that the figure corrects itself an hour later: the next scheduled run happens to read the table after it is complete. The fixed schedule is a guess about when the upstream finishes, and it is wrong only some of the time, which makes the problem intermittent and error-free.',
    tags: ['time-gap-roulette', 'cross-team', 'triggers'],
    concepts: ['orch-time-gap-roulette'],
  },

  // Overwrite without a predicate (x3)
  {
    id: 'orc-mcq-a10',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    question:
      'An analyst must reprocess only March 15 in a daily-partitioned gold table. They run the nightly job by hand, which does df.write.mode("overwrite").saveAsTable("gold_daily_totals") with no date filter. What happens?',
    options: [
      { id: 'a', text: 'Only the March 15 partition changes, because Delta looks at the dates in the DataFrame and limits the overwrite to them.', isCorrect: false },
      { id: 'b', text: "The whole table is replaced by that one day's rows, so every other date is deleted from the live table in one command.", isCorrect: true },
      { id: 'c', text: 'The job fails with an error, because Delta refuses to overwrite a table that has more than one partition.', isCorrect: false },
      { id: 'd', text: 'The day\'s rows are added next to the existing ones, so March 15 now appears twice, and the other dates are untouched.', isCorrect: false },
    ],
    explanation:
      'mode("overwrite") means the whole table, whatever size the DataFrame is. The fix is to scope the write with .option("replaceWhere", "event_date = \'2024-03-15\'"), so only matching rows are replaced. Time travel can bring the old version back with RESTORE, but that is a rescue and not a reason to write unscoped.',
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
      'A patient-visit gold table must be corrected for one past week. The standard weekly job does a full mode("overwrite") and is meant to run on Sundays with a full week of fresh data. An engineer runs it to backfill that one old week. What is the risk, given the audit-retention rules?',
    options: [
      { id: 'a', text: 'None: the job is built to run weekly with a full overwrite, so using it to backfill one week is exactly what it was tested for.', isCorrect: false },
      { id: 'b', text: "Delta Lake protects healthcare tables from destructive overwrites with a built-in safeguard, whatever options the write is given or who runs it.", isCorrect: false },
      { id: 'c', text: 'The risk applies only to gold tables, so bronze and silver tables under the same retention rules are safe from this kind of write.', isCorrect: false },
      { id: 'd', text: "It overwrites the whole table with one week, deleting the other weeks; only a restore brings them back, and an audit gap is serious.", isCorrect: true },
    ],
    explanation:
      'The same mechanism as an unscoped single-day fix, with higher stakes: in an audited domain even a temporary loss of other weeks can be a reportable incident, and restoring an older version works only if it has not been vacuumed. Scope every backfill write to the rows being corrected.',
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
      "A product-catalog sync notebook was written to run once a day for the current day, with mode(\"overwrite\") and no date predicate. It has been re-run several times on the same day after feed glitches, with no harm. What happens the first time someone reuses it to fix a past date, and why did the re-runs look fine?",
    options: [
      { id: 'a', text: "The past date is replaced and the rest is untouched, since Delta works out from the data which dates the write covers and so limits the overwrite to them.", isCorrect: false },
      { id: 'b', text: "The run fails with an error saying an overwrite needs a predicate, so a past-date run is stopped before it does harm, which is the safeguard Delta provides.", isCorrect: false },
      { id: 'c', text: "The past date's rows are merged into the table and any overlap is removed, which is why re-running the same day was harmless, so nothing is lost either way.", isCorrect: false },
      { id: 'd', text: "It replaces the whole table with that past day, deleting all other history; same-day re-runs rewrote the same data and hid the problem.", isCorrect: true },
    ],
    explanation:
      'An unscoped overwrite is harmless only while the DataFrame already holds everything the table should contain. That false sense of safety is what makes the notebook a trap: the missing replaceWhere does damage the first time someone reasonably reuses it for a different date.',
    tags: ['partition-blast-radius', 'replacewhere', 'backfill'],
    concepts: ['orch-partition-blast-radius'],
  },

  // Dropped rows nobody sees (x3)
  {
    id: 'orc-mcq-a13',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    question:
      "A sales pipeline uses expect_or_drop on silver rows with a null order_total and keeps no quarantine table. The drop counts sit in the pipeline's event log, which nobody checks. Three months on, gold revenue is a few percent below the source system. What happened, and what should have been done?",
    options: [
      { id: 'a', text: "A steady gap of a few percent is normal noise in a large orders table and has nothing to do with how the expectation is configured or with any other part of the pipeline.", isCorrect: false },
      { id: 'b', text: 'The pipeline would have sent an alert by itself when rows were dropped, so the gap must come from an unrelated currency bug upstream.', isCorrect: false },
      { id: 'c', text: 'Dropping rows cannot change a downstream total, so the gap must come from an unrelated currency-conversion bug somewhere upstream.', isCorrect: false },
      { id: 'd', text: "expect_or_drop removed a small share of orders each run and nothing kept them; send dropped rows to a quarantine table and watch the counts.", isCorrect: true },
    ],
    explanation:
      'Dropping is a fine way to exclude bad rows, but without a quarantine table the dropped rows are gone and only a count remains, which is easy to ignore. Send the failing rows to a separate table and monitor how many are dropped, so under-reporting shows up in days instead of months.',
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
      "A lead-scoring pipeline applies expect_or_drop to silver rows missing lead_source, with no quarantine table. A source change starts omitting lead_source for a whole new channel, and marketing's lead-volume dashboard shows a slow, unexplained decline over several weeks. What is going on?",
    options: [
      { id: 'a', text: "The scoring model is getting worse for an unrelated reason that starts in the same weeks the new channel appears, so the fall is real.", isCorrect: false },
      { id: 'b', text: 'Rows dropped by expect_or_drop are queued and put back automatically once the upstream issue is fixed, so the decline will correct itself.', isCorrect: false },
      { id: 'c', text: "Every lead from the new channel fails the check and is dropped, with no quarantine table to show which or how many; the dashboard just declines.", isCorrect: true },
      { id: 'd', text: "The pipeline emails its owner whenever one expectation drops more than 5% of a run, so this would already have been flagged by the default alert settings.", isCorrect: false },
    ],
    explanation:
      'With the dropped rows in a quarantine table, a query grouped by channel and date would show a step on the day the new channel began. Without one, the team has a slow decline to reverse-engineer. Dropped rows are not queued or retried, and no alert fires by default.',
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
      "A product-analytics pipeline uses expect_or_drop on events with a malformed session_id and keeps no quarantine table. A mobile SDK update malforms session_id for one app version, and that version's event volume looks artificially low everywhere. What would a quarantine table have changed?",
    options: [
      { id: 'a', text: "Nothing: a quarantine table only decides whether dropped rows are kept, and has no effect on how fast the SDK bug could be traced back.", isCorrect: false },
      { id: 'b', text: 'It would repair the malformed session_id values in place before the rows were ever dropped, so the volume would never have dipped.', isCorrect: false },
      { id: 'c', text: "It would hold only the rows removed by expect_or_fail, so it would have caught nothing from this expect_or_drop rule in this pipeline.", isCorrect: false },
      { id: 'd', text: "Dropped rows would sit in a table you can query and show one app version dominating, instead of weeks asking why engagement is low.", isCorrect: true },
    ],
    explanation:
      'A quarantine table turns "excluded" from "vanished" into something you can query: grouping it by app version shows the cause in minutes. It stores the rows you send it, from a drop rule or otherwise. It does not repair values, and the quarantine is for diagnosis and replay.',
    tags: ['silent-drop-sinking', 'dlt', 'expectations'],
    concepts: ['orch-silent-drop-sinking'],
  },

  // Telling two failures apart
  {
    id: 'orc-mcq-a16',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.ORCHESTRATION_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A gold revenue table has read too low for several days with no pipeline failures. It could be a job that starts on a fixed time before its upstream finishes, or expect_or_drop silently removing rows with no quarantine table. What evidence tells them apart?',
    options: [
      { id: 'a', text: "Neither can be told apart from the symptom alone, and diagnosing either one means rewriting the pipeline first and then redesigning the alerts.", isCorrect: false },
      { id: 'b', text: 'The early-start problem happens only in streaming pipelines and the dropped-rows problem only in batch, so the execution mode decides.', isCorrect: false },
      { id: 'c', text: 'The dropped-rows problem always ends in a visible failure with an error message, and the early-start problem never raises one, so an error settles it.', isCorrect: false },
      { id: 'd', text: "Low on some days, tracking days the upstream ran long, means an early start; a steady shortfall every run, traced to failing rows, means drops.", isCorrect: true },
    ],
    explanation:
      'A fixed-time start is a timing problem: the shortfall is intermittent and follows how long the upstream took, and a table update trigger fixes it. Silent drops are a data-quality problem: the shortfall is steadier and matches the rows failing an expectation, and a quarantine table plus a watched drop count fixes it. Mixing them up sends you to fix the wrong layer.',
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
    requires: [
      'expect_or_fail',
      'expect(',
      'order_total > 0',
      'customer_id IS NOT NULL',
      /expect_or_fail\(\s*["'][^"']+["']\s*,\s*["']\s*order_total\s*>\s*0\s*["']\s*\)/,
      /\.expect\(\s*["'][^"']+["']\s*,\s*["']\s*customer_id\s+IS\s+NOT\s+NULL\s*["']\s*\)/i,
      /silver_orders/,
    ],
    question: `In a Lakeflow Spark Declarative Pipeline, define a table named silver_orders that reads bronze_orders and applies two rules of different severity:

1. order_total must be greater than 0. This is a hard invariant: a violating row must never reach the output, and a violation means something upstream is broken, so the whole update should stop.
2. customer_id must not be null. This is a soft rule: record violations for visibility, but keep the row in the output and do not stop the update.

Use the expectation decorator that matches each rule's severity.`,
    starterCode: `from pyspark import pipelines as dp

@dp.table(name="silver_orders")
def silver_orders():
    return spark.read.table("bronze_orders")`,
    testCases: [
      {
        input: 'bronze_orders',
        expectedOutput: 'silver_orders defined with expect_or_fail on order_total > 0 and expect on customer_id IS NOT NULL',
        description: 'Applies expect_or_fail to the hard invariant and plain expect to the soft rule.',
      },
    ],
    solution: `from pyspark import pipelines as dp

@dp.table(name="silver_orders")
@dp.expect_or_fail("valid_order_total", "order_total > 0")
@dp.expect("customer_id_present", "customer_id IS NOT NULL")
def silver_orders():
    return spark.read.table("bronze_orders")
# OR
from pyspark import pipelines as dp

@dp.expect_or_fail("valid_order_total", "order_total > 0")
@dp.expect("customer_id_present", "customer_id IS NOT NULL")
@dp.table(name="silver_orders")
def silver_orders():
    return spark.readStream.table("bronze_orders")
# OR
import dlt

@dlt.table(name="silver_orders")
@dlt.expect_or_fail("valid_order_total", "order_total > 0")
@dlt.expect("customer_id_present", "customer_id IS NOT NULL")
def silver_orders():
    return dlt.read("bronze_orders")`,
    explanation:
      'expect_or_fail matches rule 1: carrying on past a violation would build on broken data, so the update stops. Plain expect matches rule 2: a missing customer_id is tolerable, so the rows are kept and the violations are only counted in the pipeline metrics. The older dlt module has the same decorators.',
    tieredHints: {
      apiSignature: 'dp.expect_or_fail(name, expression)',
      skeleton: `from pyspark import pipelines as dp\n\n@dp.table(name="silver_orders")\n@dp.____("valid_order_total", "order_total > 0")\n@dp.____("customer_id_present", "customer_id IS NOT NULL")\ndef silver_orders():\n    return spark.____.table("bronze_orders")`,
    },
    hints: [
      'expect_or_fail stops the update on a violation, so use it for the rule where carrying on would be worse than stopping.',
      'expect keeps the row and only counts the violation, so use it for the rule that is tolerable.',
      'Each decorator takes a name string and a SQL condition string, stacked with the table decorator above the function.',
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
    requires: ['replaceWhere', 'overwrite', 'event_date', '2024-03-15'],
    question: `The write below is meant to backfill one day, March 15, 2024, in the Delta table gold_daily_sales, which has a DATE column named event_date. As written, it replaces the ENTIRE table with that one day's rows every time it runs.

Fix the write so that it replaces only the March 15, 2024 rows of gold_daily_sales and leaves every other date untouched.`,
    starterCode: `(corrected_df
    .write
    .format("delta")
    .mode("overwrite")
    .saveAsTable("gold_daily_sales"))`,
    testCases: [
      {
        input: 'corrected_df for event_date = 2024-03-15',
        expectedOutput: "write scoped to event_date = '2024-03-15' with the replaceWhere option, other dates untouched",
        description: 'Scopes the overwrite to the March 15, 2024 rows with replaceWhere.',
      },
    ],
    solution: `(corrected_df
    .write
    .format("delta")
    .mode("overwrite")
    .option("replaceWhere", "event_date = '2024-03-15'")
    .saveAsTable("gold_daily_sales"))
# OR
corrected_df.write.format("delta").mode("overwrite").option("replaceWhere", "event_date = '2024-03-15'").saveAsTable("gold_daily_sales")
# OR
(corrected_df.write
    .mode("overwrite")
    .option("replaceWhere", "event_date = DATE'2024-03-15'")
    .saveAsTable("gold_daily_sales"))`,
    explanation:
      'With mode("overwrite") alone Delta replaces the whole table, however small the DataFrame is. The replaceWhere option limits the overwrite to rows matching its predicate, and Delta swaps just those rows in one atomic commit. Every row in corrected_df must match the predicate, or the write fails.',
    tieredHints: {
      apiSignature: 'dfWriter.option(key, value)',
      skeleton: `(corrected_df\n    .write\n    .format("____")\n    .mode("____")\n    .____("replaceWhere", "event_date = '2024-03-15'")\n    .saveAsTable("gold_daily_sales"))`,
    },
    hints: [
      'A DataFrameWriter option can narrow an overwrite.',
      'The predicate is a SQL condition on event_date, written as a string.',
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
      'Using the Databricks SDK, define a task named days that loops over two dates, at most 4 at a time, and runs the notebook /Repos/etl/backfill_day for each. Order the lines. Two lines do not belong.',
    correctOrder: [
      'from databricks.sdk.service.jobs import ForEachTask, NotebookTask, Task',
      'one_day = Task(task_key="one_day", notebook_task=NotebookTask(notebook_path="/Repos/etl/backfill_day"))',
      'loop = ForEachTask(inputs=\'["2026-01-01", "2026-01-02"]\', task=one_day, concurrency=4)',
      'days = Task(task_key="days", for_each_task=loop)',
    ],
    distractorLines: [
      'loop = ForEachTask(inputs=\'["2026-01-01", "2026-01-02"]\', task=one_day, concurrency=999)',
      'days = Task(task_key="days", for_each_task=one_day)',
    ],
    solution:
      'from databricks.sdk.service.jobs import ForEachTask, NotebookTask, Task\none_day = Task(task_key="one_day", notebook_task=NotebookTask(notebook_path="/Repos/etl/backfill_day"))\nloop = ForEachTask(inputs=\'["2026-01-01", "2026-01-02"]\', task=one_day, concurrency=4)\ndays = Task(task_key="days", for_each_task=loop)',
    explanation:
      'The task to repeat is defined first, as one_day. A ForEachTask wraps it with the list of inputs and a concurrency of 4, and the outer task days carries the loop. Each name is defined before it is used. A concurrency of 999 would defeat the limit, and for_each_task must be given a ForEachTask, not the inner task.',
    hints: [
      'A name has to be defined before a later line can use it.',
      'The concurrency limit exists to bound parallel load, so a huge value defeats it.',
    ],
    tags: ['for_each_task', 'backfill', 'concurrency', 'parsons'],
    concepts: ['orch-for-each-task'],
  },
];
