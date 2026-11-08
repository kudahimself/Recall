import { CodeLanguage, Course, Difficulty, Question, QuestionType, SqlTable, Topic } from '../types';

/**
 * Data Engineering, section "Running Pipelines": the seventh section of the
 * course rewrite (decisions and designs). Five topics, each taught by a
 * lesson (src/data/lessons/dataEngineeringLessons.ts) and then practised with
 * cards that make the learner produce the answer:
 *
 *   introduce: one term-check MCQ, predict the outcome over small tables;
 *   combine:   choose and justify, order the steps (Parsons with prose lines);
 *   apply:     spot the flaw, predict or choose under three or more constraints;
 *   review:    explain in your own words (review-only, never a new card).
 *
 * Authoring rules for this file (the same as the sections before it):
 *   - MCQ distractors are real misconceptions with their (wrong) reasoning,
 *     options length-matched, no absolute-word giveaways;
 *   - every predict-the-outcome answer is checked by running it:
 *     dataEngineeringOpsChecks.ts holds the check,
 *     scripts/check-outcomes.js runs it (part of npm test);
 *   - tool-agnostic: tables, SQL and a few lines of pseudo-config are the
 *     notation, never one vendor's API. "DAG", "sensor", "role", "row filter",
 *     "lineage" and "embedding" are the general terms; every orchestrator,
 *     warehouse and vector store has them under some name.
 *
 * It replaces the old MCQ-only Operations, Quality & Modern DE section
 * (de-orch-, de-airflow-, de-dq-, de-obs-, de-gov-, de-ai-); those ids are not
 * reused.
 */

const DE = Course.DATA_ENGINEERING;

const table = (name: string, columns: string[], rows: (string | number | null)[][]): SqlTable => ({ name, columns, rows });

/** Prose lines for a Parsons card: its solution is the lines in order. */
const steps = (lines: string[]) => lines.join('\n');

// ════════════════════════════════════════════════════════════════════════
// Orchestration: DAGs, Dependencies, Sensors & Retries
// ════════════════════════════════════════════════════════════════════════

const orchestration: Question[] = [
  {
    id: 'de-dag-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_ORCHESTRATION_DAGS,
    course: DE,
    question:
      'A DAG has four tasks: extract feeds transform, transform feeds load, and extract also feeds audit. One night transform fails on every retry. What happens to load and audit?',
    options: [
      { id: 'a', text: 'load and audit both stop: one task failing after its retries ends the whole run at once', isCorrect: false },
      { id: 'b', text: 'load runs on the output transform left last night, since that table is still in place', isCorrect: false },
      { id: 'c', text: 'load is not run and is marked upstream failed; audit runs, as it needs only extract', isCorrect: true },
      { id: 'd', text: 'audit waits for transform to be fixed, since a run starts its tasks in the order listed', isCorrect: false },
    ],
    explanation:
      'A DAG is tasks plus the edges between them, and a task runs when every task upstream of it has succeeded. transform failed, so load, which needs it, is not run; audit needs only extract, which succeeded, so it runs as usual.\n' +
      'A failure stops its own branch, not the run. Nothing runs on last night\'s output by accident, and the order tasks are written in means nothing: only the edges do.',
  },
  {
    id: 'de-dag-2',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_ORCHESTRATION_DAGS,
    course: DE,
    question:
      'edges lists the DAG\'s dependencies: a task runs only when every task upstream of it has succeeded. Tonight extract_customers fails after its retries.\n' +
      'How many tasks are left not run?',
    tables: [
      table('edges', ['upstream', 'downstream'], [
        ['extract_orders', 'clean_orders'],
        ['clean_orders', 'fact_orders'],
        ['extract_customers', 'dim_customers'],
        ['dim_customers', 'fact_orders'],
        ['dim_customers', 'customer_report'],
        ['fact_orders', 'revenue_report'],
        ['revenue_report', 'email_summary'],
      ]),
    ],
    answer: '5',
    unit: 'tasks',
    tempting: [
      { answer: '1', why: '1 counts dim_customers only, the task right after the failure. The tasks after dim_customers need it too, so they do not run either.' },
      { answer: '7', why: '7 stops every other task. extract_orders and clean_orders do not depend on extract_customers, so they still run.' },
    ],
    explanation:
      'Everything reachable from extract_customers is left out: dim_customers, then fact_orders and customer_report, then revenue_report, then email_summary, 5 tasks. extract_orders and clean_orders are on another branch and finish.\n' +
      'Once the cause is fixed, clearing extract_customers runs it and those 5 again for the same run; the branch that succeeded is not run twice.',
  },
  {
    id: 'de-dag-3',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_ORCHESTRATION_DAGS,
    course: DE,
    question:
      'extract_sales copies the day\'s sales into staging, and load_sales is scheduled at 02:00 because the extract "is always done by then". Nothing else links the two tasks.\n' +
      'On how many of these nights did load_sales start before the extract had finished?',
    tables: [
      table('extract_runs', ['run_date', 'extract_finished'], [
        ['2026-11-02', '01:35'],
        ['2026-11-03', '01:50'],
        ['2026-11-04', '02:20'],
        ['2026-11-05', '01:40'],
        ['2026-11-06', '03:05'],
        ['2026-11-07', '01:55'],
      ]),
    ],
    answer: '2',
    unit: 'nights',
    tempting: [
      { answer: '0', why: '0 assumes load_sales waits for the extract. A start time is not a dependency: at 02:00 the load starts whatever the extract is doing.' },
      { answer: '1', why: '1 counts the 03:05 night only. On 2026-11-04 the extract finished at 02:20, also after the load had started.' },
    ],
    explanation:
      'On 2026-11-04 and 2026-11-06 the extract was still running at 02:00, so load_sales read a half-filled staging table, loaded it and succeeded. Nothing failed, and the day\'s numbers were short.\n' +
      'A schedule is a guess at when the upstream task is done. An edge from extract_sales to load_sales makes the load start when the extract has finished, at 01:35 on a quick night and 03:05 on a slow one.',
  },
  {
    id: 'de-dag-4',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_ORCHESTRATION_DAGS,
    course: DE,
    question:
      'The run starts at minute 0. Each task starts as soon as every task upstream of it has finished, and there are workers enough to run any number of tasks at once.\n' +
      'At which minute does revenue_report finish?',
    tables: [
      table('tasks', ['task_name', 'minutes'], [
        ['extract_orders', 20],
        ['extract_customers', 10],
        ['clean_orders', 30],
        ['dim_customers', 15],
        ['fact_orders', 25],
        ['revenue_report', 5],
      ]),
      table('edges', ['upstream', 'downstream'], [
        ['extract_orders', 'clean_orders'],
        ['clean_orders', 'fact_orders'],
        ['extract_customers', 'dim_customers'],
        ['dim_customers', 'fact_orders'],
        ['fact_orders', 'revenue_report'],
      ]),
    ],
    answer: '80',
    unit: 'minutes',
    tempting: [
      { answer: '105', why: '105 adds every task as if they ran one after another. The orders and customers branches run side by side.' },
      { answer: '55', why: '55 follows the customers branch. fact_orders waits for both of its inputs, so the slower branch, orders, sets the time.' },
    ],
    explanation:
      'The orders branch finishes at 20 + 30 = 50 and the customers branch at 10 + 15 = 25. fact_orders starts at 50, when its later input is done, and finishes at 75; revenue_report finishes at 80.\n' +
      'A run lasts as long as its longest path, the critical path. Speeding up dim_customers changes nothing here; speeding up clean_orders brings the report forward.',
  },
  {
    id: 'de-dag-5',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_ORCHESTRATION_DAGS,
    course: DE,
    question:
      'A partner drops a sales file in a folder each night, any time between 01:00 and 05:00, and once or twice a month not at all. load_partner_sales must start only once the file is there, and the sales team wants the numbers as early as they can have them.\n' +
      'How should the DAG start the load, and why?',
    decisions: [
      { id: 'sensor', text: 'Wait for the file with a sensor that checks every few minutes and gives up at 07:00', isCorrect: true },
      { id: 'late', text: 'Schedule the load at 05:30, half an hour after the latest the file has ever landed', isCorrect: false },
      { id: 'retry', text: 'Start the load at 01:00 and retry it every 15 minutes until it finds the file there', isCorrect: false },
      { id: 'usual', text: 'Load whatever file is in the folder at 03:00, the time at which it usually lands', isCorrect: false },
    ],
    reasons: [
      { id: 'starts-on-data', text: 'The load starts soon after the file lands, and a file that never comes ends in an alert at 07:00', isCorrect: true },
      { id: 'past-latest', text: 'A start after the latest landing so far is safe, since the file has never come later than 05:00', isCorrect: false },
      { id: 'retries-cover', text: 'Retries are built for this: a task that fails because its input is not there yet is what they cover', isCorrect: false },
      { id: 'next-night', text: 'The usual time is right on most nights, and the next night\'s run picks up a file that came late', isCorrect: false },
    ],
    explanation:
      'A sensor is a task that waits for a condition, here the file existing, and succeeds when it holds, so the load runs at 01:10 on an early night and 04:50 on a late one. Its timeout turns a missing file into a failure the team hears about.\n' +
      '05:30 makes every night as slow as the worst one and breaks the first time the file is later. Retrying a load for a missing file looks like a failing job all night and hides a real error among the expected ones.',
  },
  {
    id: 'de-dag-6',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_ORCHESTRATION_DAGS,
    course: DE,
    question:
      'Two tasks fail on the same night. extract_rates gets "503 service unavailable" from a currency API that is back a few minutes later. load_orders fails with "column discount_code does not exist" after the shop renamed a column.\n' +
      'What retry policy fits, and why?',
    decisions: [
      { id: 'split', text: 'Retry extract_rates a few times with longer waits; fail load_orders at once and alert', isCorrect: true },
      { id: 'both-many', text: 'Retry both of the tasks 10 times, a minute apart, before anyone is alerted to them', isCorrect: false },
      { id: 'neither', text: 'Retry neither of the tasks, and page the on-call engineer for each of the two failures', isCorrect: false },
      { id: 'swap', text: 'Retry load_orders with a longer timeout, and fail extract_rates at once and alert', isCorrect: false },
    ],
    reasons: [
      { id: 'transient', text: 'A 503 clears up on its own, while a missing column fails the same way on every attempt', isCorrect: true },
      { id: 'ten-covers', text: 'Ten tries cover most failures, and the alert after them goes out just when it is needed', isCorrect: false },
      { id: 'human', text: 'A retry hides a fault the team should hear of, so each failure is best looked at by a person', isCorrect: false },
      { id: 'migration', text: 'A missing column is often a schema change still running, so more time lets it finish first', isCorrect: false },
    ],
    explanation:
      'Retry what is transient: a timeout, a 503, a lock held for a moment. Waiting longer between tries (for example 1, 2, then 4 minutes) gives the service time to recover without hammering it.\n' +
      'A failure that is deterministic, such as a renamed column, a bug or a bad record, gives the same error on every attempt, so retries only delay the alert. Paging on every 503 wakes people for something that fixes itself.',
  },
  {
    id: 'de-dag-7',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_ORCHESTRATION_DAGS,
    course: DE,
    language: CodeLanguage.SQL,
    question:
      'load_orders failed at 03:10 for run_date 2026-11-07 after its retries, so fact_orders and revenue_report did not run.\n' +
      'Put the steps of recovering the run in order. Two steps do not belong.',
    correctOrder: [
      'Read the failed attempt\'s log to find the error: the worker\'s disk was full',
      'Free space on the worker\'s disk, so the next attempt does not fail the same way',
      'Clear load_orders for run_date 2026-11-07, so the orchestrator runs it again',
      'Let fact_orders and revenue_report run after it, for the same run_date',
      'Compare the day\'s row counts with a normal day before telling the report\'s readers',
    ],
    distractorLines: [
      'Start a new run of the whole DAG for today\'s date, 2026-11-08',
      'Mark load_orders as succeeded, so that fact_orders and revenue_report can start',
    ],
    solution: steps([
      'Read the failed attempt\'s log to find the error: the worker\'s disk was full',
      'Free space on the worker\'s disk, so the next attempt does not fail the same way',
      'Clear load_orders for run_date 2026-11-07, so the orchestrator runs it again',
      'Let fact_orders and revenue_report run after it, for the same run_date',
      'Compare the day\'s row counts with a normal day before telling the report\'s readers',
    ]),
    explanation:
      'Recover the run that failed, for its own run_date: find the cause, remove it, clear the failed task, and its downstream tasks follow from the edges. Nothing upstream runs twice.\n' +
      'A run for today would load 2026-11-08, not the missing day. Marking the task succeeded lets downstream tasks build reports from a load that never happened.',
  },
  {
    id: 'de-dag-8',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_ORCHESTRATION_DAGS,
    course: DE,
    question:
      'A daily DAG computes a running balance: each day\'s run reads the result of the day before, so a run may start only once the previous day\'s run has succeeded. A backfill reruns the six days below, the orchestrator allows 3 runs at a time, and each run takes 30 minutes.\n' +
      'How many minutes does the backfill take?',
    tables: [
      table('backfill_runs', ['run_date', 'minutes'], [
        ['2026-11-01', 30],
        ['2026-11-02', 30],
        ['2026-11-03', 30],
        ['2026-11-04', 30],
        ['2026-11-05', 30],
        ['2026-11-06', 30],
      ]),
    ],
    answer: '180',
    unit: 'minutes',
    tempting: [
      { answer: '60', why: '60 runs the days 3 at a time, two waves of 30 minutes. Each day needs the day before it, so only one run can go at a time.' },
      { answer: '30', why: '30 runs all six days at once. The limit is 3, and the dependency on the day before allows just 1.' },
    ],
    explanation:
      '2026-11-02 cannot start until 2026-11-01 has succeeded, and so on, so the six runs go one after another: 6 x 30 = 180 minutes. The limit of 3 never comes into play.\n' +
      'Runs that are independent (each day reads only its own input) can backfill in parallel, which is one reason to avoid a dependency on the previous run where the logic allows it.',
  },
  {
    id: 'de-dag-9',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_ORCHESTRATION_DAGS,
    course: DE,
    question:
      'A nightly task loads 2 million payment events from files. Last night one event had an amount it could not parse, "12,50", and the task failed on all 4 attempts, so no payments loaded and finance\'s 07:00 report was empty. Finance needs every valid payment by 07:00, and every payment accounted for.\n' +
      'What should the task do with a record it cannot parse, and why?',
    decisions: [
      { id: 'reject', text: 'Write it to a rejects table with its error, load the rest, and alert on any reject', isCorrect: true },
      { id: 'more-retries', text: 'Raise its retries from 3 to 10, and leave a longer wait between each of the attempts', isCorrect: false },
      { id: 'skip', text: 'Skip it and load the rest, since one payment in 2 million is within the noise', isCorrect: false },
      { id: 'keep-failing', text: 'Keep failing the task, so that nobody reads payments until the file is fixed', isCorrect: false },
    ],
    reasons: [
      { id: 'poison', text: 'A bad record fails the same way each try; set aside, it waits for a fix and is not lost', isCorrect: true },
      { id: 'slow-parser', text: 'More tries give a slow parser more chances, and the fault is gone by the tenth or so', isCorrect: false },
      { id: 'noise', text: 'One payment barely moves a total over 2 million rows, so the report stays right as it is', isCorrect: false },
      { id: 'empty-safe', text: 'An empty report is safer than one that might miss a payment, so finance should wait', isCorrect: false },
    ],
    explanation:
      'A poison record fails identically on every attempt, so retries cannot help and one row holds back 2 million. Writing it to a rejects (dead-letter) table with the error lets the valid rows load on time, and the alert and the table mean nothing is lost: someone fixes "12,50" and loads it.\n' +
      'Skipping it silently breaks "every payment accounted for"; failing the whole task breaks the 07:00 deadline for every valid payment.',
  },
  {
    id: 'de-dag-10',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_ORCHESTRATION_DAGS,
    course: DE,
    question:
      'Some mornings the revenue report is missing the last hours of the day before, though every task in the DAG shows success.\n' +
      'Click the line that causes it.',
    lines: [
      'dag: nightly_sales, one run a day for run_date = yesterday',
      'extract_sales: at 01:00, copy run_date\'s orders from the shop database to staging',
      'load_sales: at 02:00, insert staging\'s rows for run_date into fact_sales',
      'build_report: after load_sales succeeds, rebuild revenue_report',
      'retries: 2 for every task, 5 minutes apart',
    ],
    flawLines: [3],
    note: 'extract_sales usually takes 40 minutes, and up to 2 hours on sale days.',
    explanation:
      'load_sales starts at a time of day, not after extract_sales. On a sale day the extract is still copying at 02:00, so the load reads part of the day, succeeds, and the report is built from it.\n' +
      'Make load_sales downstream of extract_sales: it then starts when the extract has finished, whenever that is. build_report already does this right with load_sales.',
  },
  {
    id: 'de-dag-11',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_ORCHESTRATION_DAGS,
    course: DE,
    question:
      'A partner stopped sending files on Monday. By Friday no pipeline in the orchestrator was running at all, though no task had failed.\n' +
      'Click the line that causes it.',
    lines: [
      'workers: 4 slots, shared by every DAG in the orchestrator',
      'dag: partner_import, a new run each day at 01:00',
      'wait_for_file: check every minute for the day\'s file, with no timeout, holding a worker slot',
      'load_file: after wait_for_file, load the file into partner_sales',
      'alert: email the team when a task fails after its retries',
    ],
    flawLines: [3],
    note: 'Each day\'s run starts its own wait_for_file.',
    explanation:
      'With no timeout, a sensor whose file never comes waits for ever, and it keeps its worker slot. Monday\'s to Thursday\'s runs each left one waiting, so by Friday all 4 slots were held and nothing else could start; and since nothing failed, the alert never fired.\n' +
      'Give the sensor a timeout (here a few hours after the latest normal landing) so a missing file becomes a failure and an alert, and let it give up its slot between checks where the orchestrator allows. More slots would only delay the jam.',
  },
  {
    id: 'de-dag-12',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_ORCHESTRATION_DAGS,
    course: DE,
    question: 'In two or three sentences: why should a task wait on its input rather than start at a fixed time, and what should it do if the input never comes?',
    keyPoints: [
      'A start time is only a guess at when the upstream work ends; on a late night the task reads partial or old data and still succeeds',
      'A dependency, or a sensor on the input, starts the task as soon as its input is complete and never before',
      'The wait needs a timeout, so a missing input ends in a failure and an alert rather than a silent stall',
      'The tasks downstream then do not run, so nothing is published from data that is not there',
    ],
    modelAnswer:
      'A fixed time is a bet that the upstream work is done by then, and on the night it is not, the task happily reads half the data and reports success. ' +
      'Make the task depend on the upstream task, or wait on its input with a sensor, so it starts when the data is complete; give the wait a timeout so a missing input fails loudly and stops the downstream tasks.',
    explanation: 'Edges carry the order; schedules only decide when a run begins.',
  },
  {
    id: 'de-dag-13',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_ORCHESTRATION_DAGS,
    course: DE,
    question: 'In two or three sentences: which failures should an orchestrator retry, and what must be true of a task for retries to be safe?',
    keyPoints: [
      'Retry transient failures, such as a timeout or a service briefly down, a few times with growing waits',
      'Do not retry failures that repeat the same way (a bug, a schema change, a bad record): fail fast, or set the record aside',
      'A retried task must be idempotent: running it again for the same run_date leaves the same result',
      'Retries need a limit, after which the task fails and someone is alerted',
    ],
    modelAnswer:
      'Retries are for transient failures, a timeout or a 503, tried a few times with longer waits; a deterministic failure such as a renamed column or a malformed record fails identically each time, so fail fast or put the record in a rejects table. ' +
      'A retry runs the task again on the same input, so the task must be idempotent for its run_date, replacing its slice rather than appending, and the retries must stop at a limit and alert.',
    explanation: 'The orchestrator decides when to try again; only the task\'s design decides whether trying again is safe.',
  },
];

// ════════════════════════════════════════════════════════════════════════
// Data Quality: Tests, Contracts & Circuit Breakers
// ════════════════════════════════════════════════════════════════════════

const quality: Question[] = [
  {
    id: 'de-quality-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_QUALITY_GATES,
    course: DE,
    question:
      'The checkout team owns the orders feed and agrees a data contract with the analytics team that reads it. What does the contract give analytics?',
    options: [
      { id: 'a', text: 'A promise that the feed is on time and right, with checkout paying for each failure', isCorrect: false },
      { id: 'b', text: 'A promise of the columns, types, keys and meaning, checked on each batch and versioned', isCorrect: true },
      { id: 'c', text: 'The tests analytics runs on its own tables, written down so that checkout can read them', isCorrect: false },
      { id: 'd', text: 'A copy of today\'s schema, which analytics updates each time checkout changes the feed', isCorrect: false },
    ],
    explanation:
      'A data contract is the producer\'s promise about the feed: its schema, keys, what each column means, and often how fresh it is. It is checked at the boundary on every batch, so a break fails loudly at the source, and a breaking change ships as a new version readers move to.\n' +
      'It is not a promise of perfection or a penalty clause, it covers the feed rather than the readers\' own tables, and a schema the readers chase after each change is the problem a contract exists to end.',
  },
  {
    id: 'de-quality-2',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_QUALITY_GATES,
    course: DE,
    question:
      'Three tests run on the day\'s batch before it is published: customer_id is not NULL, amount is 0 or more, and status is one of paid, refunded or cancelled.\n' +
      'How many rows of the batch fail at least one test?',
    tables: [
      table('staging_orders', ['order_id', 'customer_id', 'status', 'amount'], [
        [1, 11, 'paid', 40],
        [2, null, 'paid', 25],
        [3, 12, 'shipped', 30],
        [4, 13, 'paid', -5],
        [5, null, 'pending', 10],
        [6, 14, 'refunded', 20],
        [7, 15, 'cancelled', 0],
        [8, 16, 'paid', 55],
      ]),
    ],
    answer: '4',
    unit: 'rows',
    tempting: [
      { answer: '5', why: '5 counts failures, not rows: order 5 breaks two tests, NULL customer and an unknown status, but it is one row.' },
      { answer: '3', why: '3 misses one of the failing rows. Order 7\'s amount of 0 passes "0 or more"; order 4\'s -5 does not.' },
    ],
    explanation:
      'Order 2 has no customer, order 3 an unknown status, order 4 a negative amount, and order 5 both a NULL customer and an unknown status: 4 rows. Orders 1, 6, 7 and 8 pass all three.\n' +
      'Each test is a query for the rows that break one rule, written down from what the readers rely on, and it runs on the new batch, where a bad day cannot hide among old rows.',
  },
  {
    id: 'de-quality-3',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_QUALITY_GATES,
    course: DE,
    question:
      'A relationships test checks that every order\'s customer_id exists in dim_customers.\n' +
      'How many order rows fail it?',
    tables: [
      table('staging_orders', ['order_id', 'customer_id'], [
        [101, 11],
        [102, 12],
        [103, 19],
        [104, 13],
        [105, 19],
        [106, 21],
        [107, 11],
      ]),
      table('dim_customers', ['customer_id', 'segment'], [
        [11, 'retail'],
        [12, 'retail'],
        [13, 'business'],
        [14, 'retail'],
        [15, 'business'],
      ]),
    ],
    answer: '3',
    unit: 'rows',
    tempting: [
      { answer: '2', why: '2 counts the missing customers, 19 and 21. The test counts order rows, and customer 19 has two of them.' },
      { answer: '0', why: '0 assumes every customer_id that is filled in is valid. A value can be present and still point at no customer.' },
    ],
    explanation:
      'Orders 103 and 105 point at customer 19 and order 106 at customer 21; neither is in dim_customers, so 3 rows fail. A join to the dimension would drop them, and revenue would fall with no error.\n' +
      'Often the customer is simply late, loaded in a later batch. Then the fix is to load the dimension first, or keep the rows with an "unknown" member until it arrives, rather than lose them.',
  },
  {
    id: 'de-quality-4',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_QUALITY_GATES,
    course: DE,
    question:
      'Each day\'s batch is published only when it has no blocking failures; warning failures send an alert but do not stop it. A held batch leaves the published table as it was.\n' +
      'After the 2026-11-07 run, what is the latest run_date the dashboard has data for?',
    tables: [
      table('batches', ['run_date', 'blocking_failed', 'warning_failed'], [
        ['2026-11-03', 0, 0],
        ['2026-11-04', 0, 2],
        ['2026-11-05', 0, 0],
        ['2026-11-06', 0, 5],
        ['2026-11-07', 1, 0],
      ]),
    ],
    answer: '2026-11-06',
    tempting: [
      { answer: '2026-11-05', why: '2026-11-05 treats the warnings as blocking. 2026-11-06 failed only warning tests, so it was published, with an alert.' },
      { answer: '2026-11-07', why: '2026-11-07 publishes the batch anyway. It failed a blocking test, so it was held.' },
    ],
    explanation:
      'The 2026-11-07 batch was held, so the table still ends at 2026-11-06, which went out with an alert for its 5 warnings. The dashboard is a day behind, and right.\n' +
      'That is the circuit breaker: a blocking failure stops bad data from reaching readers, at the cost of freshness. Warnings are for rules readers do not depend on, so a small issue does not make everything stale.',
  },
  {
    id: 'de-quality-5',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_QUALITY_GATES,
    course: DE,
    question:
      'Today\'s orders batch fails one test: 40 of its 1.2 million rows have a phone number in a format the test does not expect. Finance reads the table at 07:00 for revenue, and support uses the phone numbers to call customers back.\n' +
      'What should the pipeline do, and why?',
    decisions: [
      { id: 'warn', text: 'Publish the batch and send the failure to the owner of the phone column', isCorrect: true },
      { id: 'hold', text: 'Hold the whole batch until the source has fixed the 40 phone numbers', isCorrect: false },
      { id: 'drop', text: 'Delete the 40 rows from the batch, then publish the rows that are left', isCorrect: false },
      { id: 'silent', text: 'Publish the batch with no alert, since 40 rows is far under one percent', isCorrect: false },
    ],
    reasons: [
      { id: 'scope', text: 'The rule does not touch revenue, so holding the batch would leave finance stale for nothing', isCorrect: true },
      { id: 'any-bad', text: 'A batch with a known bad value should reach no one, whatever the column is then used for', isCorrect: false },
      { id: 'noise-rows', text: 'Rows that break a rule are safe to leave out, since they would just add noise to the totals', isCorrect: false },
      { id: 'small-share', text: 'A failure in under one percent of the rows is noise, so it is fine to let it pass unremarked', isCorrect: false },
    ],
    explanation:
      'Severity follows what readers rely on. Revenue does not depend on a phone format, so this test should warn: the batch is published on time and the column\'s owner gets the 40 rows to fix for support.\n' +
      'Holding blocks finance for a problem it does not have. Dropping the rows removes 40 orders\' revenue without telling anyone, and staying silent leaves support with numbers it cannot dial.',
  },
  {
    id: 'de-quality-6',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_QUALITY_GATES,
    course: DE,
    question:
      'A nightly job appends each day\'s orders to fact_orders, which 30 dashboards and two downstream jobs read. The tests run on fact_orders after the load, and when one fails, someone deletes the bad day by hand in the morning.\n' +
      'Where should the tests run, and why?',
    decisions: [
      { id: 'staging', text: 'On a staging copy of the batch, publishing it to fact_orders if they pass', isCorrect: true },
      { id: 'after-alert', text: 'On fact_orders after the load, as now, with an alert the moment a test fails', isCorrect: false },
      { id: 'dashboard', text: 'In each dashboard\'s query, which hides the rows that break a rule from view', isCorrect: false },
      { id: 'source', text: 'On the source database, before the extract, so no bad row leaves checkout', isCorrect: false },
    ],
    reasons: [
      { id: 'never-see', text: 'Readers never see a batch that failed, and the failed one is kept to debug', isCorrect: true },
      { id: 'night-alert', text: 'An alert at night gets the bad day deleted before most readers have opened it', isCorrect: false },
      { id: 'own-needs', text: 'Each dashboard knows its own needs, so it is the place to decide what to trust', isCorrect: false },
      { id: 'only-source', text: 'Bad data comes in from the source, so a test there is the one that counts most', isCorrect: false },
    ],
    explanation:
      'Write, audit, publish: load the batch where nobody reads it, test it there, and only then make it visible. A failed batch never reaches the dashboards or the two jobs, which would otherwise build on it before anyone wakes up.\n' +
      'Thirty dashboards with thirty filters are thirty definitions of good data. Source checks help, but the pipeline\'s own joins and transforms can also break the data.',
  },
  {
    id: 'de-quality-7',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_QUALITY_GATES,
    course: DE,
    language: CodeLanguage.SQL,
    question: 'Put the steps of a write-audit-publish load for one run_date in order. Two steps do not belong.',
    correctOrder: [
      'Write the run_date\'s batch into a staging table that no reader queries',
      'Run the blocking tests on the staged batch',
      'If a blocking test fails, stop: keep the published table as it is and alert the owner',
      'If they all pass, replace the run_date\'s slice of the published table in one transaction',
      'Tell the downstream jobs that the run_date is published, so they start',
    ],
    distractorLines: [
      'Insert the batch into the published table, then run the tests on what it now holds',
      'Delete the rows that fail a test and publish the rest without an alert',
    ],
    solution: steps([
      'Write the run_date\'s batch into a staging table that no reader queries',
      'Run the blocking tests on the staged batch',
      'If a blocking test fails, stop: keep the published table as it is and alert the owner',
      'If they all pass, replace the run_date\'s slice of the published table in one transaction',
      'Tell the downstream jobs that the run_date is published, so they start',
    ]),
    explanation:
      'The audit sits between the write and the publish, so readers only ever see batches that passed, and the publish is one transaction, so they never see half of one. Downstream jobs start from the publish, not from the write.\n' +
      'Testing after the insert lets readers see the bad batch first; dropping failing rows silently changes the numbers with nobody told.',
  },
  {
    id: 'de-quality-8',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_QUALITY_GATES,
    course: DE,
    question:
      'A volume test fails a day when its row count is under half the average of the 3 days before it. It runs on each day from 2026-11-04 to 2026-11-08.\n' +
      'On how many of those days does it fail?',
    tables: [
      table('daily_rows', ['run_date', 'row_count'], [
        ['2026-11-01', 40000],
        ['2026-11-02', 41000],
        ['2026-11-03', 39000],
        ['2026-11-04', 30000],
        ['2026-11-05', 24000],
        ['2026-11-06', 19000],
        ['2026-11-07', 15000],
        ['2026-11-08', 6000],
      ]),
    ],
    answer: '1',
    unit: 'days',
    tempting: [
      { answer: '3', why: '3 compares each day with half of a normal day, 20,000. The test compares with the 3 days just before, which were falling too.' },
      { answer: '0', why: '0 misses 2026-11-08: the 3 days before average about 19,333, half of that is about 9,667, and 6,000 is under it.' },
    ],
    explanation:
      'Each day is compared with the days just before it, and those were already falling: 30,000 against a threshold of 20,000, 24,000 against 18,333, 19,000 against 15,500, 15,000 against 12,167. Only 2026-11-08 fails, five days into a drop from 40,000.\n' +
      'A window of recent days follows a slow decline down. Compare with a baseline the decline cannot drag along, such as the same weekday over the last few weeks, or add a floor from what a normal day looks like.',
  },
  {
    id: 'de-quality-9',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_QUALITY_GATES,
    course: DE,
    question:
      'The checkout team wants to change the orders feed\'s amount from dollars to whole cents. Twelve teams read the feed, two of them only once a month, and checkout must ship the change this quarter.\n' +
      'How should they make it, and why?',
    decisions: [
      { id: 'version', text: 'Add amount_cents beside amount, announce it, and drop amount once each reader has moved', isCorrect: true },
      { id: 'same-name', text: 'Keep the column named amount, and change its values to cents in a single release', isCorrect: false },
      { id: 'rename', text: 'Rename amount to amount_cents in one release, and see whose queries break to know who to tell', isCorrect: false },
      { id: 'weekend', text: 'Ship the change on a weekend, when the fewest of the readers run jobs against the feed', isCorrect: false },
    ],
    reasons: [
      { id: 'own-pace', text: 'A breaking change goes out as a new version beside the old, so readers move at their own pace', isCorrect: true },
      { id: 'no-break', text: 'The column keeps its name and type, so no reader\'s query breaks and nobody needs to change', isCorrect: false },
      { id: 'loud', text: 'A reader that breaks loudly finds out at once, which is faster than waiting on twelve replies', isCorrect: false },
      { id: 'quiet-time', text: 'Few jobs run on a weekend, so the change is in place before most readers read the feed again', isCorrect: false },
    ],
    explanation:
      'A change of unit breaks the contract even though no query fails. Shipping amount_cents next to amount lets each reader switch when ready, the two monthly readers included, and amount is dropped only when nobody uses it.\n' +
      'Keeping the name makes every total 100 times too big with no error at all, the worst kind of break. Renaming in place breaks twelve teams at once, on a weekend or not.',
  },
  {
    id: 'de-quality-10',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_QUALITY_GATES,
    course: DE,
    question:
      'Yesterday 30% of new orders arrived without a customer_id, and every test passed.\n' +
      'Click the line that causes it.',
    lines: [
      'load: the run_date\'s orders into staging_orders',
      'test: order_id is unique in staging_orders',
      'test: under 1% of the customer_id values in fact_orders are NULL',
      'publish: if every test passes, insert staging_orders into fact_orders',
      'alert: page the owner when a test fails',
    ],
    flawLines: [3],
    note: 'fact_orders holds 3 years of orders, about 1 million a month. Yesterday\'s batch had 40,000 rows.',
    explanation:
      'The NULL test measures the whole published table, where 12,000 bad rows among about 36 million are 0.03%: a bad day is diluted to nothing. It also looks at fact_orders, which does not hold the new batch until after the tests.\n' +
      'Test the batch: under 1% of customer_id NULL in staging_orders would have failed at 30% and held the day.',
  },
  {
    id: 'de-quality-11',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_QUALITY_GATES,
    course: DE,
    question:
      'Since Tuesday every new order in fact_orders has a NULL customer_id, and no job failed.\n' +
      'Click the line that causes it.',
    lines: [
      'extract: every column of the shop\'s orders table, for rows changed on run_date',
      'map: copy columns to fact_orders by name; a column the extract lacks is set to NULL',
      'test: order_id is unique and not NULL',
      'test: row count within 20% of the same weekday last week',
      'publish: insert the batch into fact_orders',
    ],
    flawLines: [2],
    note: 'On Tuesday the shop renamed its customer_id column to customer_ref.',
    explanation:
      'After the rename the extract has customer_ref and no customer_id, and the mapping quietly fills the missing column with NULL. The schema drifted and the load absorbed it.\n' +
      'Check the incoming columns against the contract (customer_id required, of this type) and fail when one is missing or changed: the load then stops on Tuesday with an error that names the column.',
  },
  {
    id: 'de-quality-12',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_QUALITY_GATES,
    course: DE,
    question: 'In two or three sentences: why test a batch before publishing it, and what should a failing test do?',
    keyPoints: [
      'The tests run on the new batch in a staging table, before any reader can see it',
      'A failing blocking test stops the publish, so readers keep yesterday\'s correct data instead of today\'s wrong data',
      'The owner is alerted, and the failed batch is kept to find the cause',
      'Rules readers do not rely on can warn instead of block, so a small issue does not make the data stale',
    ],
    modelAnswer:
      'Testing the batch in staging means a bad day is caught before dashboards and downstream jobs read it, instead of being cleaned up after they have. ' +
      'A failing blocking test holds the batch, leaving the published table as it was, alerts the owner and keeps the batch for debugging; tests on things readers do not depend on only warn.',
    explanation: 'Stale and right beats fresh and wrong, but only for the rules that matter to readers.',
  },
  {
    id: 'de-quality-13',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_QUALITY_GATES,
    course: DE,
    question: 'In two or three sentences: what does a data contract promise, and how should its owner make a breaking change?',
    keyPoints: [
      'The producer promises the feed\'s schema, keys, meaning and freshness, agreed with its readers',
      'The promise is checked on each batch at the boundary, so a break fails loudly instead of flowing through',
      'A breaking change, such as a rename or a new type or unit, ships as a new version beside the old one',
      'Readers move to it on their own schedule, and the old version is dropped once they have',
    ],
    modelAnswer:
      'A data contract is the producer\'s written promise about a feed: its columns and types, its keys, what the values mean and how fresh they are, checked on every batch so a break stops at the boundary. ' +
      'A breaking change is published as a new version alongside the old, announced to the readers, who switch when ready; the old version is retired only once nobody reads it.',
    explanation: 'A silent change of meaning, such as dollars to cents under the same name, is the break a contract most needs to prevent.',
  },
];

// ════════════════════════════════════════════════════════════════════════
// Observability & Lineage
// ════════════════════════════════════════════════════════════════════════

const observability: Question[] = [
  {
    id: 'de-lineage-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_PIPELINE_OBSERVABILITY,
    course: DE,
    question:
      'Every task of last night\'s pipeline succeeded on time, but fact_orders holds 3,100 rows for yesterday, against about 48,000 on a normal day. Which check would have flagged it?',
    options: [
      { id: 'a', text: 'A freshness check, comparing the time of the last load with the table\'s deadline', isCorrect: false },
      { id: 'b', text: 'A job alert, paging the on-call engineer when a task still fails after its retries', isCorrect: false },
      { id: 'c', text: 'A schema check, comparing the columns and types with the ones of the last load', isCorrect: false },
      { id: 'd', text: 'A volume check, comparing the rows loaded for the day with a normal day\'s count', isCorrect: true },
    ],
    explanation:
      'A job reports whether it ran, not whether its input was complete: a short file loads just as successfully as a full one. Only a check on the data itself, rows for the day against what a day normally holds, sees that 3,100 is a sixteenth of normal.\n' +
      'The load ran on time, so freshness passes; nothing failed, so no job alert; the columns did not change, so the schema check passes too.',
  },
  {
    id: 'de-lineage-2',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_PIPELINE_OBSERVABILITY,
    course: DE,
    question:
      'It is 09:00 on 2026-11-08. A table is late when its last load is more hours old than its freshness SLA allows.\n' +
      'How many tables are late?',
    tables: [
      table('freshness', ['table_name', 'last_loaded_at', 'sla_hours'], [
        ['fact_orders', '2026-11-08 05:40', 6],
        ['dim_customers', '2026-11-08 00:10', 12],
        ['fact_payments', '2026-11-08 01:30', 4],
        ['stock_levels', '2026-11-08 08:20', 1],
        ['web_sessions', '2026-11-07 06:00', 24],
        ['fx_rates', '2026-11-08 07:55', 2],
      ]),
    ],
    answer: '2',
    unit: 'tables',
    tempting: [
      { answer: '1', why: '1 counts only web_sessions, the one not loaded today. fact_payments was loaded today, but 7.5 hours ago against an SLA of 4.' },
      { answer: '0', why: '0 treats every table that was loaded at some point as fresh. Freshness is age against the table\'s own SLA.' },
    ],
    explanation:
      'fact_payments is 7.5 hours old against an SLA of 4, and web_sessions 27 hours against 24: 2 tables. stock_levels is only 40 minutes old, but its SLA is 1 hour, so it is fine for now.\n' +
      'Each table gets its own SLA from what its readers need: stock levels hourly, a web sessions table daily.',
  },
  {
    id: 'de-lineage-3',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_PIPELINE_OBSERVABILITY,
    course: DE,
    question:
      'orders_raw has held duplicated rows since Monday. lineage lists which table each table is built from.\n' +
      'How many tables are built, directly or not, from orders_raw?',
    tables: [
      table('lineage', ['source_table', 'target_table'], [
        ['orders_raw', 'orders_clean'],
        ['customers_raw', 'dim_customers'],
        ['orders_clean', 'fact_orders'],
        ['orders_clean', 'revenue_daily'],
        ['dim_customers', 'fact_orders'],
        ['fact_orders', 'revenue_daily'],
        ['fact_orders', 'customer_ltv'],
        ['dim_customers', 'customer_ltv'],
        ['revenue_daily', 'exec_dashboard'],
        ['payments_raw', 'fact_payments'],
        ['fact_payments', 'exec_dashboard'],
      ]),
    ],
    answer: '5',
    unit: 'tables',
    tempting: [
      { answer: '1', why: '1 is orders_clean alone, the table built straight from orders_raw. Every table built from orders_clean carries the duplicates on.' },
      { answer: '7', why: '7 counts revenue_daily and exec_dashboard twice, once for each path that reaches them. Each table is affected once.' },
    ],
    explanation:
      'Walking downstream: orders_clean, then fact_orders and revenue_daily, then customer_ltv and exec_dashboard: 5 tables. dim_customers and fact_payments are built from other sources and are untouched.\n' +
      'This is impact analysis: the downstream walk lists every table to rebuild for the bad days and every owner to tell, before anyone has to ask around.',
  },
  {
    id: 'de-lineage-4',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_PIPELINE_OBSERVABILITY,
    course: DE,
    question:
      'The exec dashboard shows half of yesterday\'s revenue. table_health has each table\'s row count for yesterday and its usual count; lineage shows what each table is built from.\n' +
      'Which table is the first to go wrong, the one to fix?',
    tables: [
      table('lineage', ['source_table', 'target_table'], [
        ['orders_raw', 'orders_clean'],
        ['orders_clean', 'fact_orders'],
        ['fx_rates', 'fact_orders'],
        ['fact_orders', 'revenue_daily'],
        ['revenue_daily', 'exec_dashboard'],
      ]),
      table('table_health', ['table_name', 'rows_yesterday', 'rows_usual'], [
        ['orders_raw', 48000, 48000],
        ['orders_clean', 24100, 47800],
        ['fx_rates', 30, 30],
        ['fact_orders', 24100, 47800],
        ['revenue_daily', 1, 1],
        ['exec_dashboard', 1, 1],
      ]),
    ],
    answer: 'orders_clean',
    tempting: [
      { answer: 'fact_orders', why: 'fact_orders is short, but only because its input is: orders_clean already has half its rows. Fix it there and fact_orders follows.' },
      { answer: 'orders_raw', why: 'orders_raw is the source, but its 48,000 rows are normal. The rows went missing in the step that builds orders_clean.' },
    ],
    explanation:
      'Walk upstream from the dashboard: revenue_daily has its one row, fact_orders is at half, and its inputs are orders_clean, also at half, and fx_rates, normal. orders_clean is short while its own input, orders_raw, is complete: the cleaning step lost the rows.\n' +
      'The first table that is wrong while everything it is built from is right is the root cause. The tables after it are only symptoms, and rebuilding them first changes nothing.',
  },
  {
    id: 'de-lineage-5',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_PIPELINE_OBSERVABILITY,
    course: DE,
    question:
      'A platform of 300 tables sends about 200 alerts a week to one shared channel, mostly warnings nobody acts on. Last week the payments table was 9 hours late, and finance noticed before the data team did.\n' +
      'What should change, and why?',
    decisions: [
      { id: 'owned', text: 'Page a table\'s owner when a deadline its readers rely on is missed; batch the rest daily', isCorrect: true },
      { id: 'more-checks', text: 'Add checks on more columns of each of the 300 tables, so that fewer problems slip past', isCorrect: false },
      { id: 'thresholds', text: 'Raise each threshold by half, so the channel gets about half the alerts that it gets now', isCorrect: false },
      { id: 'jobs-only', text: 'Turn the warnings off, and keep the alerts from tasks that still fail after their retries', isCorrect: false },
    ],
    reasons: [
      { id: 'actionable', text: 'An alert that is rare, owned and tied to what a reader would notice is one people act on', isCorrect: true },
      { id: 'coverage', text: 'A problem that no check covers is the risk, so coverage matters more than alert count', isCorrect: false },
      { id: 'fewer', text: 'Fewer alerts in the channel mean each one is read, whichever ones are the ones dropped', isCorrect: false },
      { id: 'failures-real', text: 'A failed task is the clear sign of trouble, and warnings about the data are mostly noise', isCorrect: false },
    ],
    explanation:
      'Two hundred alerts a week in a shared channel train everyone to ignore them, so the one that mattered was lost. Tie alerts to expectations readers have (payments by 06:00), send them to the table\'s owner, and keep the rest as a summary to review.\n' +
      'More checks add noise to a channel nobody reads; raising thresholds blindly drops real alerts with the noise; and a late table is not a failed task, so jobs-only alerts would have missed it too.',
  },
  {
    id: 'de-lineage-6',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_PIPELINE_OBSERVABILITY,
    course: DE,
    question:
      'The team keeps a lineage diagram on a wiki page, updated by hand. During last week\'s incident it was missing two jobs added in the summer, and a broken table\'s readers were found by asking around.\n' +
      'How should lineage be kept, and why?',
    decisions: [
      { id: 'from-runs', text: 'Collect it from the jobs as they run: the tables each run reads and writes', isCorrect: true },
      { id: 'review', text: 'Review the wiki diagram every month, with each team checking its own jobs', isCorrect: false },
      { id: 'sheet', text: 'Ask each job\'s author to list its inputs and outputs in a shared spreadsheet', isCorrect: false },
      { id: 'names', text: 'Name each table after the tables it is built from, so lineage is in the names', isCorrect: false },
    ],
    reasons: [
      { id: 'no-drift', text: 'Lineage taken from the runs shows what really read what, so it cannot drift from the code', isCorrect: true },
      { id: 'monthly', text: 'A regular review keeps the diagram close to the code, and a month is short for most changes', isCorrect: false },
      { id: 'author', text: 'The author knows the job best, so a list from the author is the most accurate record of it', isCorrect: false },
      { id: 'travels', text: 'Names travel with the tables into each tool, so anyone can read lineage with no new system', isCorrect: false },
    ],
    explanation:
      'Lineage written by hand is out of date the day a job changes. Taking it from the jobs themselves, from the SQL they run or the events each run emits (OpenLineage is an open standard for these), records what actually happened, including jobs nobody remembered to document.\n' +
      'A monthly review or an author\'s list is the same hand-kept record on a different schedule, and names cannot hold a table built from five others.',
  },
  {
    id: 'de-lineage-7',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_PIPELINE_OBSERVABILITY,
    course: DE,
    language: CodeLanguage.SQL,
    question: 'The exec dashboard shows half of yesterday\'s revenue. Put the steps of the investigation in order. Two steps do not belong.',
    correctOrder: [
      'Confirm the drop against a normal day, and find the date it started',
      'Walk the lineage upstream from the dashboard, checking each table\'s volume and freshness',
      'Stop at the first table that is wrong while every table it is built from is right',
      'Fix that table\'s cause, then rebuild it and every table downstream for the affected dates',
      'Compare the rebuilt dashboard with a normal day before closing the incident',
    ],
    distractorLines: [
      'Re-run every pipeline on the platform for yesterday, and see whether the figure recovers',
      'Start at the raw tables and check every table on the platform, in order of name',
    ],
    solution: steps([
      'Confirm the drop against a normal day, and find the date it started',
      'Walk the lineage upstream from the dashboard, checking each table\'s volume and freshness',
      'Stop at the first table that is wrong while every table it is built from is right',
      'Fix that table\'s cause, then rebuild it and every table downstream for the affected dates',
      'Compare the rebuilt dashboard with a normal day before closing the incident',
    ]),
    explanation:
      'Lineage turns "something is wrong" into a short walk: from the symptom upstream, table by table, to the first one that is bad with good inputs. Fix there, rebuild downstream for every affected date, and check the symptom is gone.\n' +
      'Re-running everything may hide the cause without finding it, and checking 300 tables by name ignores the graph that says which ones matter.',
  },
  {
    id: 'de-lineage-8',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_PIPELINE_OBSERVABILITY,
    course: DE,
    question:
      'The team will change how orders_clean.discount is computed. column_lineage lists which column each column is computed from.\n' +
      'How many columns, in any table, are computed directly or not from orders_clean.discount?',
    tables: [
      table('column_lineage', ['source_column', 'target_column'], [
        ['orders_clean.order_id', 'fact_orders.order_id'],
        ['orders_clean.amount', 'fact_orders.gross_amount'],
        ['orders_clean.discount', 'fact_orders.discount'],
        ['fact_orders.gross_amount', 'fact_orders.net_amount'],
        ['fact_orders.discount', 'fact_orders.net_amount'],
        ['fact_orders.net_amount', 'revenue_daily.revenue'],
        ['fact_orders.order_id', 'revenue_daily.order_count'],
        ['fact_orders.discount', 'promo_report.total_discount'],
        ['revenue_daily.revenue', 'exec_dashboard.revenue'],
        ['revenue_daily.order_count', 'exec_dashboard.orders'],
      ]),
    ],
    answer: '5',
    unit: 'columns',
    tempting: [
      { answer: '9', why: '9 is every column of the tables the change reaches, which is what table-level lineage would flag. Columns such as order_count do not use the discount.' },
      { answer: '1', why: '1 is fact_orders.discount alone. net_amount is computed from it, and revenue from net_amount, and so on.' },
    ],
    explanation:
      'From orders_clean.discount: fact_orders.discount, then fact_orders.net_amount and promo_report.total_discount, then revenue_daily.revenue, then exec_dashboard.revenue: 5 columns. order_id, gross_amount, order_count and orders do not change.\n' +
      'Table-level lineage would send the change to every reader of four tables; column-level lineage names the five numbers that will move, and so the readers who need telling.',
  },
  {
    id: 'de-lineage-9',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_PIPELINE_OBSERVABILITY,
    course: DE,
    question:
      'web_sessions loads about 900,000 rows on weekdays and 250,000 on Saturdays and Sundays, and it grows about 2% a month. The check "fail when under 70% of the day before" fails every Saturday, and the team has learned to ignore it.\n' +
      'How should the volume check be defined, and why?',
    decisions: [
      { id: 'weekday', text: 'Compare each day with the same weekday\'s average over the last 4 weeks', isCorrect: true },
      { id: 'floor', text: 'Fail when a day loads under a fixed 200,000 rows, the lowest normal day', isCorrect: false },
      { id: 'seven', text: 'Compare each day with the average of the 7 days before it, of any weekday', isCorrect: false },
      { id: 'skip', text: 'Skip the check on weekends, and keep the day-before rule on the weekdays', isCorrect: false },
    ],
    reasons: [
      { id: 'season', text: 'The normal count depends on the weekday, and a recent window follows the slow growth', isCorrect: true },
      { id: 'never-normal', text: 'A fixed floor never fires on a normal day, and it is still low enough to catch a drop', isCorrect: false },
      { id: 'smooth', text: 'A 7-day average smooths the weekend out, so a normal Saturday stops looking like a drop', isCorrect: false },
      { id: 'small', text: 'Weekend data is small, so a drop on a weekend matters too little to be worth a check', isCorrect: false },
    ],
    explanation:
      'What a normal day looks like depends on which day it is, so the baseline must too: a Saturday against recent Saturdays, a Tuesday against recent Tuesdays. Four weeks is recent enough to move with 2% a month of growth.\n' +
      'A floor of 200,000 misses a Tuesday that falls to 300,000; a 7-day average still flags every Saturday at about 35% of it; and skipping weekends leaves two days a week unwatched.',
  },
  {
    id: 'de-lineage-10',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_PIPELINE_OBSERVABILITY,
    course: DE,
    question:
      'The shop stopped sending orders on Friday evening, and the freshness check on orders_raw stayed green all weekend.\n' +
      'Click the line that causes it.',
    lines: [
      'job: every hour, reload orders_raw from the newest file in landing/orders/',
      'column loaded_at: when the job wrote the row',
      'column ordered_at: when the customer placed the order',
      'check: fail when the newest loaded_at in orders_raw is over 2 hours old',
      'alert: page the owner of orders_raw when the check fails',
    ],
    flawLines: [4],
    note: 'When the shop stopped, its last file stayed in landing/orders/, and the job kept reloading it.',
    explanation:
      'The check measures when the job last wrote, and the job wrote every hour, reloading Friday\'s file. The table was fresh by load time and two days stale by the data in it.\n' +
      'Measure freshness on the data\'s own time: fail when the newest ordered_at is over 2 hours old. That fires on Friday night, whatever the job does.',
  },
  {
    id: 'de-lineage-11',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_PIPELINE_OBSERVABILITY,
    course: DE,
    question:
      'The team dropped the region column from dim_store after checking who read it. The next morning the sales-by-region report failed.\n' +
      'Click the line that causes it.',
    lines: [
      'change: drop the region column from dim_store',
      'check: list the reports and jobs that query dim_store directly',
      'result: none of them select region, so the change is approved',
      'deploy: run the change on Sunday night, when no jobs are running',
      'notify: post the change in the data team\'s channel',
    ],
    flawLines: [2],
    note: 'store_sales_mart is built from dim_store and carries region along; the sales-by-region report reads store_sales_mart.',
    explanation:
      'The impact check stopped at direct readers. region reaches the report through store_sales_mart, two steps away, so the check found nothing and the change broke a report it never listed.\n' +
      'Walk the lineage downstream as far as it goes, column by column where possible: region feeds store_sales_mart.region, which the report reads.',
  },
  {
    id: 'de-lineage-12',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_PIPELINE_OBSERVABILITY,
    course: DE,
    question: 'In two or three sentences: why can every job succeed and the data still be wrong, and what should you watch to catch it?',
    keyPoints: [
      'A job only reports whether it ran; it succeeds just as well on an empty, late or changed input',
      'Watch the tables themselves: freshness, volume, schema and the values (null rates, ranges)',
      'Compare each with what is normal for that table, such as the same weekday\'s row count',
      'Alert the table\'s owner when something a reader relies on is broken',
    ],
    modelAnswer:
      'A job\'s status says it ran without an error, and loading an empty or half-written file, or yesterday\'s file again, is not an error. ' +
      'So watch the data: how fresh each table is by its own timestamps, how many rows arrived against a normal day, whether the schema changed and whether null rates or ranges shifted, and page the table\'s owner when a reader-facing expectation breaks.',
    explanation: 'Monitoring jobs tells you the pipeline ran; observing the data tells you it worked.',
  },
  {
    id: 'de-lineage-13',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_PIPELINE_OBSERVABILITY,
    course: DE,
    question: 'In two or three sentences: how does lineage help when a number looks wrong, and before you change a table?',
    keyPoints: [
      'Lineage is the graph of which tables and columns each one is built from, best taken from the jobs\' runs',
      'For a wrong number, walk upstream to the first table that is wrong while its inputs are right',
      'Before a change, walk downstream to find every table and report affected, not only the direct readers',
      'Column-level lineage narrows both walks to the columns that actually carry the value',
    ],
    modelAnswer:
      'Lineage records what each table and column is built from, so for a wrong number you walk upstream from it, checking each table, until you reach the first one that is wrong while its inputs are fine: that is where the fault is. ' +
      'Before a change you walk downstream as far as it goes to list every table, report and owner it reaches, and column-level lineage keeps both lists to the columns that really carry the value.',
    explanation: 'Upstream finds the cause; downstream finds the impact.',
  },
];

// ════════════════════════════════════════════════════════════════════════
// Governance & Access
// ════════════════════════════════════════════════════════════════════════

const governance: Question[] = [
  {
    id: 'de-access-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_ACCESS_GOVERNANCE,
    course: DE,
    question: 'A new analyst joins the marketing team and needs the data the team works with. How should they get access?',
    options: [
      { id: 'a', text: 'Add them to the marketing analyst role, which holds the grants for that job', isCorrect: true },
      { id: 'b', text: 'Copy the grants of a senior analyst on the team, who has the tables needed', isCorrect: false },
      { id: 'c', text: 'Grant them read on the whole warehouse, and take away what they should not see', isCorrect: false },
      { id: 'd', text: 'Grant each table to them by name as they ask, so access follows their work', isCorrect: false },
    ],
    explanation:
      'Grants go to roles that match a job, and people are members of roles (role-based access control). The new analyst gets exactly what the job needs in one step, and leaving the team is one step too.\n' +
      'A senior colleague\'s grants have piled up over years; read-everything-then-subtract starts from the most exposure; and per-person grants on each table are impossible to review once there are hundreds of them.',
  },
  {
    id: 'de-access-2',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_ACCESS_GOVERNANCE,
    course: DE,
    question:
      'Access is granted to roles, and a user can read every table that any of their roles can read.\n' +
      'How many tables can priya read?',
    tables: [
      table('user_roles', ['user_name', 'role_name'], [
        ['priya', 'marketing_analyst'],
        ['priya', 'all_staff'],
        ['tom', 'finance_analyst'],
        ['tom', 'all_staff'],
      ]),
      table('role_grants', ['role_name', 'table_name'], [
        ['marketing_analyst', 'campaigns'],
        ['marketing_analyst', 'web_sessions'],
        ['marketing_analyst', 'dim_customers'],
        ['all_staff', 'dim_date'],
        ['all_staff', 'dim_store'],
        ['all_staff', 'web_sessions'],
        ['finance_analyst', 'fact_orders'],
        ['finance_analyst', 'fact_payments'],
      ]),
    ],
    answer: '5',
    unit: 'tables',
    tempting: [
      { answer: '6', why: '6 counts web_sessions twice: both of priya\'s roles grant it, and it is one table.' },
      { answer: '3', why: '3 is the marketing_analyst role alone. priya is in all_staff as well, and its grants add up with the first role\'s.' },
    ],
    explanation:
      'priya\'s two roles give campaigns, web_sessions and dim_customers, plus dim_date, dim_store and web_sessions again: 5 distinct tables. tom\'s finance tables are not among them.\n' +
      'What a person can see is the union of all their roles, so reviewing access means reviewing every role they are in, including the broad ones like all_staff.',
  },
  {
    id: 'de-access-3',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_ACCESS_GOVERNANCE,
    course: DE,
    question:
      'sales is shared through a row filter: a user sees only the rows whose region is one of theirs in user_regions.\n' +
      'What total amount does lena\'s sales dashboard show?',
    tables: [
      table('sales', ['sale_id', 'region', 'amount'], [
        [1, 'EU', 120],
        [2, 'US', 300],
        [3, 'EU', 80],
        [4, 'APAC', 150],
        [5, 'US', 50],
        [6, 'EU', 40],
        [7, 'APAC', 60],
      ]),
      table('user_regions', ['user_name', 'region'], [
        ['lena', 'EU'],
        ['lena', 'APAC'],
        ['omar', 'US'],
      ]),
    ],
    answer: '450',
    tempting: [
      { answer: '800', why: '800 is every sale. The filter drops the US rows before lena\'s query sees the table at all.' },
      { answer: '240', why: '240 is the EU rows only. lena has two regions, EU and APAC, so the APAC 210 is hers too.' },
    ],
    explanation:
      'lena sees EU (120 + 80 + 40 = 240) and APAC (150 + 60 = 210): 450. The same query run by omar returns 350, the US rows.\n' +
      'A row filter is applied by the platform to every query on the table, so the dashboard, a notebook and an ad hoc query all get the same answer for the same user.',
  },
  {
    id: 'de-access-4',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_ACCESS_GOVERNANCE,
    course: DE,
    question:
      'A role can include other roles: its members also get every grant of the roles it includes, and of the roles those include.\n' +
      'How many tables can a member of finance_analyst read?',
    tables: [
      table('role_includes', ['role_name', 'included_role'], [
        ['finance_analyst', 'analyst_base'],
        ['analyst_base', 'all_staff'],
        ['finance_lead', 'finance_analyst'],
      ]),
      table('role_grants', ['role_name', 'table_name'], [
        ['finance_analyst', 'fact_orders'],
        ['finance_analyst', 'fact_payments'],
        ['analyst_base', 'dim_customers'],
        ['analyst_base', 'dim_product'],
        ['analyst_base', 'fact_orders'],
        ['all_staff', 'dim_date'],
        ['all_staff', 'dim_store'],
        ['finance_lead', 'payroll_summary'],
      ]),
    ],
    answer: '6',
    unit: 'tables',
    tempting: [
      { answer: '7', why: '7 adds payroll_summary. finance_lead includes finance_analyst, not the other way: grants flow from an included role to the role that includes it.' },
      { answer: '4', why: '4 stops one level down, at analyst_base. analyst_base includes all_staff, so dim_date and dim_store come too.' },
    ],
    explanation:
      'finance_analyst gets its own fact_orders and fact_payments, analyst_base\'s dim_customers, dim_product and fact_orders again, and all_staff\'s dim_date and dim_store: 6 distinct tables.\n' +
      'Nested roles keep grants in one place, but what a role really allows is the whole chain below it. A grant added to all_staff reaches every role that includes it, which is why broad roles should hold very little.',
  },
  {
    id: 'de-access-5',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_ACCESS_GOVERNANCE,
    course: DE,
    question:
      'Marketing wants to count how many newsletter subscribers have also placed an order. Both tables hold the email address, and marketing must not see any address.\n' +
      'How should marketing get the data, and why?',
    decisions: [
      { id: 'hash', text: 'Give marketing both tables with email replaced by the same keyed hash of it', isCorrect: true },
      { id: 'short-grant', text: 'Grant marketing read on both tables for one week, then take the grant back', isCorrect: false },
      { id: 'drop', text: 'Remove the email column from both of the tables in the copies marketing reads', isCorrect: false },
      { id: 'sheet', text: 'Export both lists to a spreadsheet that only the marketing lead can open', isCorrect: false },
    ],
    reasons: [
      { id: 'joins', text: 'Equal addresses give equal hashes, so the tables still join, and no address is shown', isCorrect: true },
      { id: 'window', text: 'A short grant keeps the risk small, since addresses are open only for the week of work', isCorrect: false },
      { id: 'nothing-left', text: 'Without the column nothing personal is left, and the count comes from the other rows', isCorrect: false },
      { id: 'one-person', text: 'One person with the file is fewer people than a role, so fewer can see the addresses', isCorrect: false },
    ],
    explanation:
      'A hash keyed with a secret the platform holds turns each address into a code that is the same in both tables, so the join and the count work, while the addresses cannot be read or worked back by hashing guesses. This is pseudonymisation: useful, and still personal data to govern.\n' +
      'A week\'s grant still shows every address; dropping the column leaves nothing to join on; and a spreadsheet is an ungoverned copy that outlives the work.',
  },
  {
    id: 'de-access-6',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_ACCESS_GOVERNANCE,
    course: DE,
    question:
      'Each of 12 regional managers must see the sales of their own region only. Sales is one table, and new regions are added a few times a year.\n' +
      'How should the access be set up, and why?',
    decisions: [
      { id: 'row-filter', text: 'Keep one sales table, with a row filter that matches each user\'s region', isCorrect: true },
      { id: 'copies', text: 'Copy sales into a table per region, and grant each manager their own copy', isCorrect: false },
      { id: 'dashboard', text: 'Give managers the whole table, and have the dashboard filter it by region', isCorrect: false },
      { id: 'views', text: 'Create a view per region by hand, and grant each manager the view for theirs', isCorrect: false },
    ],
    reasons: [
      { id: 'one-rule', text: 'One table and one rule: one place to secure and audit, enforced by the platform', isCorrect: true },
      { id: 'apart', text: 'Separate copies keep regions apart, since a manager has no grant on another\'s copy', isCorrect: false },
      { id: 'where-seen', text: 'The dashboard is what managers open, so a filter there is where they meet the data', isCorrect: false },
      { id: 'easy-view', text: 'A view per region is easy to read, so a new region is just one more view and grant', isCorrect: false },
    ],
    explanation:
      'A row filter on the table is checked on every query by every user, from a mapping of users to regions: a new region or a new manager is a row in that mapping. There is one table to fix, load and audit.\n' +
      'Twelve copies are twelve loads that drift apart; a dashboard filter does nothing for a manager who queries the table; and a view per region multiplies the grants to review with every region added.',
  },
  {
    id: 'de-access-7',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_ACCESS_GOVERNANCE,
    course: DE,
    language: CodeLanguage.SQL,
    question:
      'A new table, support_tickets, holds customers\' names and phone numbers, and the support analysts need it.\n' +
      'Put the steps of opening it up in order. Two steps do not belong.',
    correctOrder: [
      'Register support_tickets in the catalog, with its owner and the meaning of each column',
      'Tag the name and phone columns as personal data, so the masking policy covers them',
      'Grant the support_analyst role read on the table, with tagged columns masked',
      'Check, as a member of the role, that names and phone numbers show masked',
      'Review each quarter who is in the role and the reads logged against the table',
    ],
    distractorLines: [
      'Grant each support analyst\'s own account read on the whole support schema',
      'Copy the table into each analyst\'s sandbox with the phone column removed',
    ],
    solution: steps([
      'Register support_tickets in the catalog, with its owner and the meaning of each column',
      'Tag the name and phone columns as personal data, so the masking policy covers them',
      'Grant the support_analyst role read on the table, with tagged columns masked',
      'Check, as a member of the role, that names and phone numbers show masked',
      'Review each quarter who is in the role and the reads logged against the table',
    ]),
    explanation:
      'The catalog entry gives the table an owner and a meaning; the tags mark what is sensitive, so one masking policy covers it; the grant goes to a role, then is checked as that role would see it; and access is reviewed against the audit log over time.\n' +
      'Personal grants on a whole schema give more than needed to the wrong kind of principal, and sandbox copies are copies to secure, audit and erase from.',
  },
  {
    id: 'de-access-8',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_ACCESS_GOVERNANCE,
    course: DE,
    question:
      'Customer 42 asked to be erased, and on 2026-11-03 the team deleted their row from customers, a table format that keeps old snapshots for time travel. Today, 2026-11-08, a cleanup expires every snapshot committed before 2026-11-01.\n' +
      'After the cleanup, how many snapshots can still return customer 42\'s row?',
    tables: [
      table('snapshots', ['snapshot_id', 'committed_on', 'has_customer_42'], [
        [1, '2026-10-28', 1],
        [2, '2026-10-30', 1],
        [3, '2026-11-01', 1],
        [4, '2026-11-02', 1],
        [5, '2026-11-03', 0],
        [6, '2026-11-05', 0],
        [7, '2026-11-07', 0],
      ]),
    ],
    answer: '2',
    unit: 'snapshots',
    tempting: [
      { answer: '0', why: '0 assumes the delete removed the row everywhere. It made a new snapshot without it; the older snapshots still hold it until they expire.' },
      { answer: '4', why: '4 counts the snapshots before the cleanup. Snapshots 1 and 2 were committed before 2026-11-01, so the cleanup removes them.' },
    ],
    explanation:
      'Snapshots 3 and 4, from 2026-11-01 and 2026-11-02, survive the cleanup and still hold the row: a time-travel query to either returns customer 42. The erasure is done only once every snapshot from before the delete has expired.\n' +
      'So an erasure process deletes the rows and then expires the older snapshots (and removes their files), inside the deadline the law gives.',
  },
  {
    id: 'de-access-9',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_ACCESS_GOVERNANCE,
    course: DE,
    question:
      'A customer\'s name, email and address are copied into 40 tables, and each table keeps 30 days of snapshots. The law gives 30 days to erase a person on request, requests come in weekly, and analysts need order counts and revenue to stay the same after an erasure.\n' +
      'How should the platform be designed for erasure, and why?',
    decisions: [
      { id: 'one-place', text: 'Keep personal fields in one table by customer_key; the other 40 hold the key only', isCorrect: true },
      { id: 'script', text: 'Run a script that deletes the person\'s rows from each of the 40 tables on request', isCorrect: false },
      { id: 'flag', text: 'Set an erased flag on the person, and filter their rows out of the queries after', isCorrect: false },
      { id: 'keep-snapshots', text: 'Delete the person from the 40 tables, and keep the snapshots, which no report reads', isCorrect: false },
    ],
    reasons: [
      { id: 'one-delete', text: 'One delete there and its snapshots expiring erase them, and their orders stay counted', isCorrect: true },
      { id: 'complete', text: 'Deleting each of the person\'s rows is the fullest erasure, as nothing of theirs is left', isCorrect: false },
      { id: 'hidden', text: 'A row filtered out of each query cannot be seen, and being unseen is what the law asks', isCorrect: false },
      { id: 'unread', text: 'Snapshots are read by no report, so the data in them is out of use and out of reach', isCorrect: false },
    ],
    explanation:
      'With personal fields in one place, an erasure is one delete there, plus expiring that table\'s older snapshots within the 30 days. The 40 tables keep their rows under a customer_key that no longer leads to anyone, so counts and revenue do not change.\n' +
      'Deleting from 40 tables weekly is slow and error-prone and removes orders from the totals; a flag leaves the data stored; and snapshots can be queried by time travel, so they still hold the person.',
  },
  {
    id: 'de-access-10',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_ACCESS_GOVERNANCE,
    course: DE,
    question:
      'An intern on the marketing team could read every employee\'s salary.\n' +
      'Click the line that causes it.',
    lines: [
      'role marketing_analyst: the marketing team\'s analysts and interns',
      'grant marketing_analyst: read on the marketing schema',
      'role all_staff: every employee is a member',
      'grant all_staff: read on every schema, so people can explore',
      'schema hr: salaries and reviews, owned by the HR data team',
    ],
    flawLines: [4],
    explanation:
      'all_staff includes everyone, and it can read every schema, hr included, so the marketing role\'s careful grant does not matter: the intern reads salaries through all_staff.\n' +
      'Least privilege applies most to the broadest role. Give all_staff only what is truly for everyone (a calendar dimension, the catalog), and let people request the rest through the role for their job.',
  },
  {
    id: 'de-access-11',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_ACCESS_GOVERNANCE,
    course: DE,
    question:
      'An analyst pulled 50,000 customers\' email addresses with one query, for a mailing nobody approved.\n' +
      'Click the line that causes it.',
    lines: [
      'table customers: customer_id, email, phone, region; email and phone tagged personal',
      'grant analyst: read on every column of customers',
      'dashboard customer_list: shows email and phone as ***',
      'grant support: read on customers through the support app',
      'audit: log each query run against customers',
    ],
    flawLines: [2],
    note: 'The analysts use customers for counts by region, never for contact details.',
    explanation:
      'The analyst role can read the raw email column, so any query returns it; the masking lives only in one dashboard, which a query does not pass through.\n' +
      'Put the protection on the data: the analyst role reads customers with tagged columns masked (or without them), since its job is counts by region. The audit log shows what happened; it does not stop it.',
  },
  {
    id: 'de-access-12',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_ACCESS_GOVERNANCE,
    course: DE,
    question: 'In two or three sentences: why grant access to roles, with least privilege, rather than to people, and where do masking and row filters fit?',
    keyPoints: [
      'A role matches a job, so joining, moving or leaving is one change, and what a person can see is easy to review',
      'Least privilege: a role gets only the tables, columns and rows its job needs',
      'Personal columns are tagged and masked (or hashed) for roles that do not need their values',
      'A row filter in the platform shows each user only their rows, and no dashboard or query gets around it',
    ],
    modelAnswer:
      'Grants made to roles that match jobs make access a matter of membership: a joiner, a mover or a leaver is one change, and a review reads a few roles instead of thousands of personal grants, each role holding only what its job needs. ' +
      'Within a table, tagged personal columns are masked or hashed for roles that do not need the values, and row filters limit each user to their rows, both enforced by the platform on every query.',
    explanation: 'Protect the data where it lives, not in the tools people happen to read it with.',
  },
  {
    id: 'de-access-13',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_ACCESS_GOVERNANCE,
    course: DE,
    question: 'In two or three sentences: why is erasing one person\'s data hard on a data platform, and how do you design for it?',
    keyPoints: [
      'Personal data is copied into many tables, files, snapshots and backups, so you must know every place it lives',
      'Deleting a row leaves it in the table\'s older snapshots until they expire',
      'Keep personal fields in one table keyed by a pseudonymous key, with other tables holding only the key',
      'Erasing is then one delete there plus snapshot expiry, and the facts stay counted under a key that names no one',
    ],
    modelAnswer:
      'A person\'s details spread into many tables, extracts and snapshots, and a deleted row lives on in every older snapshot, so an erasure has to find and clean every copy within the deadline. ' +
      'Design for it by keeping personal fields in one table keyed by a pseudonymous customer key that the other tables carry instead, so erasure is one delete there plus expiring its snapshots, and the person\'s orders stay in the totals under a key that names no one.',
    explanation: 'The catalog and lineage are what tell you where the copies are; the design keeps them few.',
  },
];

// ════════════════════════════════════════════════════════════════════════
// Data for AI
// ════════════════════════════════════════════════════════════════════════

const dataForAi: Question[] = [
  {
    id: 'de-rag-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_DATA_FOR_AI,
    course: DE,
    question:
      'An assistant answers from the help centre\'s articles by retrieval. Asked "how do I get my money back?", it retrieves the "Refund policy" article, which never uses the word money. Why?',
    options: [
      { id: 'a', text: 'The index keeps synonyms for each article, and "money back" is one it lists for refunds', isCorrect: false },
      { id: 'b', text: 'The same model embedded the question and articles, and close meanings get close vectors', isCorrect: true },
      { id: 'c', text: 'The language model reads through the articles for each question and picks the best fit', isCorrect: false },
      { id: 'd', text: 'The search matches the question\'s words with the article\'s, and "get" and "my" are in it', isCorrect: false },
    ],
    explanation:
      'An embedding model turns a text into a vector, a list of numbers, so that texts with similar meaning get vectors close together. The articles were embedded when indexed, the question is embedded with the same model when asked, and the nearest article vectors are retrieved: meaning, not shared words.\n' +
      'Nobody keeps a synonym list, the language model only sees the few passages retrieved, and a word match on "get" and "my" would retrieve almost anything.',
  },
  {
    id: 'de-rag-2',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_DATA_FOR_AI,
    course: DE,
    question:
      'A nightly job keeps a vector index of the help articles. It embeds a document again when the document is new, or when its content hash differs from the hash stored with it in the index.\n' +
      'How many documents does tonight\'s run embed?',
    tables: [
      table('documents', ['doc_id', 'content_hash'], [
        [1, 'a91'],
        [2, 'c07'],
        [3, 'f3e'],
        [4, 'b12'],
        [5, 'd44'],
        [6, 'e58'],
      ]),
      table('indexed', ['doc_id', 'content_hash'], [
        [1, 'a91'],
        [2, 'c06'],
        [3, 'f3e'],
        [4, 'b10'],
        [5, 'd44'],
        [7, 'k20'],
      ]),
    ],
    answer: '3',
    unit: 'documents',
    tempting: [
      { answer: '2', why: '2 counts the changed documents, 2 and 4. Document 6 is new, with nothing in the index yet, so it is embedded too.' },
      { answer: '6', why: '6 embeds every document again. Documents 1, 3 and 5 have the same hash as when they were indexed, so their vectors are still right.' },
    ],
    explanation:
      'Documents 2 and 4 changed (c06 to c07, b10 to b12) and document 6 is new: 3 to embed. Document 7 is in the index but no longer a document, so its chunks must be deleted, or the assistant keeps quoting an article that is gone.\n' +
      'A content hash makes the refresh incremental: only what changed costs an embedding.',
  },
  {
    id: 'de-rag-3',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_DATA_FOR_AI,
    course: DE,
    question:
      'A document is split into chunks of 500 tokens that overlap by 100: each chunk starts 400 tokens after the one before, and chunks are made until one reaches the end of the document.\n' +
      'How many chunks does the document make?',
    tables: [
      table('chunking', ['doc_tokens', 'chunk_tokens', 'overlap_tokens'], [
        [2300, 500, 100],
      ]),
    ],
    answer: '6',
    unit: 'chunks',
    tempting: [
      { answer: '5', why: '5 is 2,300 / 500 rounded up, chunks with no overlap. With the overlap each chunk moves on only 400 tokens.' },
      { answer: '4', why: '4 is 2,300 / 500 rounded down, which leaves the last 300 tokens out of every chunk.' },
    ],
    explanation:
      'The chunks start at 0, 400, 800, 1,200, 1,600 and 2,000; the fifth ends at 2,100, short of 2,300, so a sixth covers 2,000 to 2,300. 6 chunks.\n' +
      'The overlap keeps a sentence that crosses a boundary whole in at least one chunk, at the cost of more chunks to embed and store. Splitting at headings or paragraphs keeps each chunk about one thing.',
  },
  {
    id: 'de-rag-4',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_DATA_FOR_AI,
    course: DE,
    question:
      'For each question the search returns the 4 chunks nearest to it, and then the app removes the chunks the user may not see. A user who is only in all_staff asks about parental leave.\n' +
      'How many chunks reach the language model?',
    tables: [
      table('chunks', ['chunk_id', 'distance', 'access_group'], [
        ['c1', 0.12, 'hr_only'],
        ['c2', 0.15, 'hr_only'],
        ['c3', 0.19, 'all_staff'],
        ['c4', 0.21, 'hr_only'],
        ['c5', 0.24, 'all_staff'],
        ['c6', 0.30, 'all_staff'],
        ['c7', 0.33, 'all_staff'],
      ]),
    ],
    answer: '1',
    unit: 'chunks',
    tempting: [
      { answer: '4', why: '4 is what filtering first would give: c3, c5, c6 and c7. Here the search picks 4 first, and 3 of them are then removed.' },
      { answer: '3', why: '3 counts the chunks removed, c1, c2 and c4. One chunk, c3, is left for the model.' },
    ],
    explanation:
      'The 4 nearest are c1 to c4; three are hr_only, so only c3 reaches the model, and the answer about parental leave is built from one passage while c5 to c7 were there to use.\n' +
      'Filter by the user\'s access inside the search, so the nearest chunks are chosen among those they may see. It gives better answers, and the restricted text never leaves the index for a user who cannot read it.',
  },
  {
    id: 'de-rag-5',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_DATA_FOR_AI,
    course: DE,
    question:
      'An assistant\'s index holds 200,000 help articles. About 300 change and 20 are removed each day, embedding all of them again takes 9 hours, and answers must reflect a change by the next morning.\n' +
      'How should the index be kept up to date, and why?',
    decisions: [
      { id: 'incremental', text: 'Each night, embed the articles whose hash changed, and delete removed ones\' chunks', isCorrect: true },
      { id: 'weekly', text: 'Embed all 200,000 articles again every weekend, when the assistant is used least', isCorrect: false },
      { id: 'once', text: 'Embed each article once, when it is first published, and leave its chunks as they are', isCorrect: false },
      { id: 'on-question', text: 'Embed the articles when a question comes in, so each answer reads the newest text', isCorrect: false },
    ],
    reasons: [
      { id: 'few-changes', text: 'Changes are few and a hash finds them; removed articles go, or they keep being retrieved', isCorrect: true },
      { id: 'full', text: 'A full rebuild leaves no article out of date, and once a week is enough for help articles', isCorrect: false },
      { id: 'meaning', text: 'An article\'s meaning seldom changes when it is edited, so its first vectors stay close', isCorrect: false },
      { id: 'fast', text: 'Embedding is fast for a single question\'s articles, so the index is built as it is needed', isCorrect: false },
    ],
    explanation:
      'Embeddings go stale when their source changes: the index then answers from the old text of a policy, and a removed article keeps being cited. A nightly run that embeds the ~300 changed articles (found by content hash) and deletes the chunks of the 20 removed ones meets the next-morning deadline cheaply.\n' +
      'A weekly rebuild leaves changes up to a week stale; never refreshing is the problem itself; and the search needs every article\'s vector before the question, to find which ones are near it.',
  },
  {
    id: 'de-rag-6',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_DATA_FOR_AI,
    course: DE,
    question:
      'A churn model scores each customer from their last 90 days of activity. The retention team calls the 500 highest-risk customers each Monday, and the scores need not change during the week.\n' +
      'How should the scores be produced, and why?',
    decisions: [
      { id: 'batch', text: 'Score every customer in a weekly batch job, and write the scores to a table', isCorrect: true },
      { id: 'api', text: 'Serve the model behind an API, and score customers when the team looks them up', isCorrect: false },
      { id: 'stream', text: 'Score each customer again every time one of their events arrives, in a stream', isCorrect: false },
      { id: 'sheet', text: 'Score the customers in the team\'s spreadsheet, with the model as a formula', isCorrect: false },
    ],
    reasons: [
      { id: 'read-weekly', text: 'The scores are read once a week from data already stored, so a batch is all it needs', isCorrect: true },
      { id: 'newest', text: 'A score computed when it is read is the newest there can be, which is what a model is for', isCorrect: false },
      { id: 'every-event', text: 'Each event changes the risk, so a weekly score is out of date for most of the week', isCorrect: false },
      { id: 'where-used', text: 'The team works in the sheet, so scores kept there save a step for those who use them', isCorrect: false },
    ],
    explanation:
      'Choose how to serve a model by when its output is used and when its inputs exist. Here both are weekly and stored, so a batch job writes a scores table the team reads on Monday: cheap, simple to test and easy to look back at.\n' +
      'Real-time scoring earns its cost when the input exists only at that moment and the answer is needed at once, such as a fraud score on a basket at checkout.',
  },
  {
    id: 'de-rag-7',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_DATA_FOR_AI,
    course: DE,
    language: CodeLanguage.SQL,
    question: 'Put the steps of the nightly run that keeps an assistant\'s vector index up to date in order. Two steps do not belong.',
    correctOrder: [
      'Find the documents whose content hash differs from the one stored in the index',
      'Split each of those documents into chunks at its headings',
      'Embed each chunk with the same model the index was built with',
      'Replace each document\'s old chunks with the new ones, with its id, hash and access group',
      'Ask a fixed set of test questions and compare the passages found with last night\'s',
    ],
    distractorLines: [
      'Embed each chunk with the newest embedding model released that week',
      'Add the new chunks beside the document\'s old ones, so both versions can be found',
    ],
    solution: steps([
      'Find the documents whose content hash differs from the one stored in the index',
      'Split each of those documents into chunks at its headings',
      'Embed each chunk with the same model the index was built with',
      'Replace each document\'s old chunks with the new ones, with its id, hash and access group',
      'Ask a fixed set of test questions and compare the passages found with last night\'s',
    ]),
    explanation:
      'Only changed documents are chunked and embedded, with the index\'s own model, and their old chunks are replaced so the index holds one version of each. The access group travels with every chunk, so the search can filter by it, and a fixed set of questions catches a run that broke retrieval.\n' +
      'A newer model\'s vectors cannot be compared with the rest of the index, and old chunks left beside new ones keep the outdated text retrievable.',
  },
  {
    id: 'de-rag-8',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_DATA_FOR_AI,
    course: DE,
    question:
      'A churn model is trained on rows like customer 7\'s below. Its feature tickets_30d should count the support tickets the customer opened in the 30 days before the prediction date, as they were known on that date.\n' +
      'What value should tickets_30d have in customer 7\'s row?',
    tables: [
      table('training_rows', ['customer_id', 'prediction_date'], [
        [7, '2026-10-01'],
      ]),
      table('tickets', ['ticket_id', 'customer_id', 'opened_on'], [
        [1, 7, '2026-08-20'],
        [2, 7, '2026-09-05'],
        [3, 7, '2026-09-18'],
        [4, 7, '2026-09-29'],
        [5, 7, '2026-10-04'],
        [6, 7, '2026-10-12'],
        [7, 9, '2026-09-20'],
      ]),
    ],
    answer: '3',
    unit: 'tickets',
    tempting: [
      { answer: '6', why: '6 counts every ticket customer 7 has today. Tickets 5 and 6 came after the prediction date, and ticket 1 is more than 30 days before it.' },
      { answer: '5', why: '5 counts from 30 days before the prediction date up to today, so it lets in tickets 5 and 6, opened after 2026-10-01: the model would learn from the future.' },
    ],
    explanation:
      'The window is 2026-09-01 up to 2026-10-01: tickets 2, 3 and 4. Tickets opened after the prediction date did not exist when a real prediction would be made, so using them is leakage: the model looks better in training than it will be in use.\n' +
      'Build each training row\'s features as of its own date (a point-in-time join), with the same code that computes them for live predictions.',
  },
  {
    id: 'de-rag-9',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_DATA_FOR_AI,
    course: DE,
    question:
      'A better embedding model is out. The index holds 5 million chunks from the current model, embedding them all again takes 2 days, and the assistant must keep answering well while the change is made.\n' +
      'How should the team switch, and why?',
    decisions: [
      { id: 'new-index', text: 'Build a second index with the new model, fill it, then send questions to it', isCorrect: true },
      { id: 'switch-now', text: 'Embed new questions with the new model now, and redo the chunks over 2 days', isCorrect: false },
      { id: 'new-only', text: 'Keep the old chunks, and use the new model only for documents added from now', isCorrect: false },
      { id: 'offline', text: 'Take the assistant offline for 2 days, and embed the 5 million chunks in place', isCorrect: false },
    ],
    reasons: [
      { id: 'spaces', text: 'Two models\' vectors cannot be compared, so the old index serves until the new is full', isCorrect: true },
      { id: 'close', text: 'Each model places a text by its meaning, so its vectors land close to the old model\'s', isCorrect: false },
      { id: 'served-well', text: 'New documents get the better vectors, and old ones keep vectors that have served them well', isCorrect: false },
      { id: 'simple', text: 'One index rebuilt in place stays simple, and 2 days offline is fair for better answers', isCorrect: false },
    ],
    explanation:
      'Each embedding model has its own space: the distance between a new-model question and an old-model chunk means nothing. So build the new index beside the old, embedding everything (and new documents into both meanwhile), and switch questions over once it is complete and tested.\n' +
      'Switching the question model first breaks retrieval for 2 days; mixing models in one index breaks it for good; and going offline breaks the constraint to keep answering.',
  },
  {
    id: 'de-rag-10',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_DATA_FOR_AI,
    course: DE,
    question:
      'An employee asked the company assistant about salary bands and got a table from an HR-only page.\n' +
      'Click the line that causes it.',
    lines: [
      'source: every page of the company wiki, including HR-only pages',
      'chunk: about 400 tokens, split at headings',
      'store: each chunk\'s vector, text, page id and the page\'s access group',
      'retrieve: the 5 nearest chunks to the question, from every page',
      'answer: the language model answers from those chunks, citing their pages',
    ],
    flawLines: [4],
    explanation:
      'Each chunk carries its page\'s access group, but the search ignores it and takes the nearest chunks from every page, so an HR-only table is handed to the model for anyone who asks about salaries.\n' +
      'Retrieve the nearest chunks among those whose access group the user belongs to. Indexing restricted pages is fine; serving them past their permissions is the leak.',
  },
  {
    id: 'de-rag-11',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_DATA_FOR_AI,
    course: DE,
    question:
      'Since last week the assistant cites unrelated pages, though no document has changed.\n' +
      'Click the line that causes it.',
    lines: [
      'index: 2 million chunks embedded with embedding model v1',
      'nightly: new and changed documents embedded with model v1',
      'questions: embedded with model v2, switched to last week for its better scores',
      'search: the 5 chunks nearest to the question by cosine distance',
      'answer: the language model answers from those 5 chunks',
    ],
    flawLines: [3],
    explanation:
      'Questions are now v2 vectors and the chunks are v1 vectors. The two models place texts in different spaces, so "nearest" no longer means "closest in meaning" and the search returns noise.\n' +
      'The question and the chunks must come from the same model and version. To move to v2, build a v2 index beside the v1 one and switch both together.',
  },
  {
    id: 'de-rag-12',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_DATA_FOR_AI,
    course: DE,
    question: 'In two or three sentences: how does a retrieval assistant find the passages for a question, and what must the pipeline do when documents change?',
    keyPoints: [
      'Documents are split into chunks, and each chunk is embedded as a vector that captures its meaning',
      'The question is embedded with the same model, and the chunks with the nearest vectors go to the language model',
      'Changed documents are found, by a content hash, and their chunks replaced; removed documents\' chunks are deleted',
      'Each chunk keeps its source and access group, so the search returns only what the user may see',
    ],
    modelAnswer:
      'The pipeline splits documents into chunks, embeds each chunk into a vector with an embedding model and stores it with its source and access group; a question is embedded with the same model, and the nearest chunks the user may see are passed to the language model. ' +
      'When documents change, the pipeline finds them by content hash, replaces their chunks and deletes those of removed documents, so answers follow the current text.',
    explanation: 'The assistant can only be as current and as well governed as the index behind it.',
  },
  {
    id: 'de-rag-13',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_DATA_FOR_AI,
    course: DE,
    question: 'In two or three sentences: what is leakage in a model\'s training data, and how do you build features to avoid it?',
    keyPoints: [
      'Leakage is a feature that uses information from after the moment of the prediction',
      'The model then looks accurate in training and does worse in use, where that information does not exist yet',
      'Compute each training row\'s features as of its prediction date, from data known then (a point-in-time join)',
      'Use the same feature code for training and for live predictions, so the two match',
    ],
    modelAnswer:
      'Leakage is when a training row\'s features include something that happened after its prediction date, such as tickets opened later, so the model learns from the future and scores well in training but worse on real predictions. ' +
      'Avoid it by computing each row\'s features as of its own date with a point-in-time join over the data known then, using the same feature code that serves live predictions.',
    explanation: 'The same rule as a point-in-time join to a slowly changing dimension: read the world as it was at the row\'s date.',
  },
];

export const dataEngineeringOpsQuestions: Question[] = [...orchestration, ...quality, ...observability, ...governance, ...dataForAi];
