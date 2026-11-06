import {
  ChooseJustifyQuestion,
  CodeLanguage,
  Difficulty,
  ExplainQuestion,
  PredictOutcomeQuestion,
  Question,
  QuestionType,
  SpotFlawQuestion,
  Topic,
} from '../types';

/**
 * One sample of each decision and design type, from the worked topic in the
 * Data Engineering redesign (Re-runs & Idempotent Loads). They are NOT in the
 * question bank: the unit tests use them as fixtures, and the dev server shows
 * one in the real quiz view at `?sample=<id>` (App.tsx, development only;
 * nothing is recorded). Their numbers were checked on SQLite.
 */

export const SAMPLE_PREDICT_OUTCOME: PredictOutcomeQuestion = {
  id: 'dev-sample-predict-outcome',
  type: QuestionType.PREDICT_OUTCOME,
  difficulty: Difficulty.BEGINNER,
  topic: Topic.DE_IDEMPOTENT_LOADS,
  question:
    'The nightly job below loads 2026-11-01. It writes its rows, then times out before reporting success, so the orchestrator runs it again.\n' +
    'After both runs, how many rows for 2026-11-01 are in daily_sales?',
  tables: [
    {
      name: 'staging_sales',
      columns: ['sale_id', 'sale_date', 'amount'],
      rows: [
        [11, '2026-11-01', 12],
        [12, '2026-11-01', 30],
        [13, '2026-11-01', 8],
        [14, '2026-11-01', 50],
        [9, '2026-10-31', 15],
      ],
    },
    {
      name: 'daily_sales (before the job)',
      columns: ['sale_id', 'sale_date', 'amount'],
      rows: [
        [7, '2026-10-31', 20],
        [8, '2026-10-31', 10],
      ],
    },
  ],
  code:
    '-- the job, run twice\n' +
    'INSERT INTO daily_sales\n' +
    'SELECT sale_id, sale_date, amount\n' +
    'FROM staging_sales\n' +
    "WHERE sale_date = '2026-11-01';",
  language: CodeLanguage.SQL,
  answer: '8',
  unit: 'rows',
  tempting: [
    {
      answer: '10',
      why: '10 is the whole table (the 2 older rows plus 8), or the 5 staged rows twice: the WHERE keeps the late 2026-10-31 row out of both runs.',
    },
    {
      answer: '4',
      why: '4 is one run. The retry runs the same append again, and nothing in it removes the rows the first run wrote.',
    },
  ],
  explanation:
    'The job is an append, so each run adds the slice again: 4 rows on the first run, the same 4 on the retry, 8 in all for 2026-11-01.\n' +
    'Revenue for the day now reads 200 instead of 100.',
};

export const SAMPLE_CHOOSE_JUSTIFY: ChooseJustifyQuestion = {
  id: 'dev-sample-choose-justify',
  type: QuestionType.CHOOSE_JUSTIFY,
  difficulty: Difficulty.INTERMEDIATE,
  topic: Topic.DE_IDEMPOTENT_LOADS,
  question:
    "Orders come from a shop API. An order's status can change for up to 30 days after it is placed, and each nightly extract returns every order updated yesterday, whatever its order_date.\n" +
    'fact_orders is partitioned by order_date and the orchestrator retries failed runs. Which load keeps fact_orders correct, and why?',
  decisions: [
    { id: 'overwrite', text: "Overwrite the partition for yesterday's order_date", isCorrect: false },
    { id: 'merge', text: 'MERGE on order_id: update rows that match, insert the rest', isCorrect: true },
    { id: 'append', text: 'Append every night, then dedupe with ROW_NUMBER() on Sundays', isCorrect: false },
    { id: 'truncate', text: 'Truncate fact_orders and reload it from the extract each night', isCorrect: false },
  ],
  reasons: [
    {
      id: 'identity',
      text: "The extract spans many order_date partitions, so no partition is this run's slice; order_id is the stable identity a re-run can match on",
      isCorrect: true,
    },
    { id: 'fewer-files', text: 'A MERGE rewrites fewer files than an overwrite, so the retry finishes before it can time out again', isCorrect: false },
    { id: 'exactly-once', text: 'A MERGE gives exactly-once delivery from the API, so the orchestrator no longer needs retries', isCorrect: false },
    { id: 'both-versions', text: 'Updated orders must keep their old version as well, and a MERGE keeps both rows', isCorrect: false },
  ],
  explanation:
    'A MERGE on order_id is idempotent because a second run matches the same keys and updates them to the same values, whichever partitions they sit in.\n' +
    "Overwriting yesterday's partition would drop the updates to older orders; a Sunday dedupe leaves six days of double counts; a truncate loses every order not in last night's extract.",
};

export const SAMPLE_SPOT_FLAW: SpotFlawQuestion = {
  id: 'dev-sample-spot-flaw',
  type: QuestionType.SPOT_FLAW,
  difficulty: Difficulty.ADVANCED,
  topic: Topic.DE_IDEMPOTENT_LOADS,
  question:
    'This load replaces the day it is given, inside one transaction, yet running it twice for 2026-11-01 leaves duplicate rows behind.\n' +
    'Click the line that causes it.',
  language: CodeLanguage.SQL,
  lines: [
    '-- :run_date is passed in by the orchestrator',
    'BEGIN;',
    'DELETE FROM fact_orders',
    '  WHERE order_date = :run_date;',
    'INSERT INTO fact_orders SELECT * FROM staging_orders;',
    'COMMIT;',
    'UPDATE load_log SET last_loaded = :run_date;',
  ],
  flawLines: [5],
  note: 'staging_orders holds every file that landed overnight, so a late order from the day before is in it too.',
  tables: [
    {
      name: 'staging_orders',
      columns: ['order_id', 'order_date', 'amount'],
      rows: [
        [101, '2026-11-01', 40],
        [102, '2026-11-01', 25],
        [97, '2026-10-31', 15],
      ],
    },
  ],
  resultTables: [
    {
      name: 'fact_orders, rows per day',
      columns: ['order_date', 'before', 'after run 1', 'after run 2'],
      rows: [
        ['2026-10-31', 2, 3, 4],
        ['2026-11-01', 0, 2, 2],
      ],
    },
  ],
  explanation:
    'Line 5 inserts every staged row, but line 4 deletes only :run_date. The late 2026-10-31 order is outside the slice the load replaces, so each run appends it again: 3 rows after run 1, 4 after run 2.\n' +
    'The delete and the insert must cover the same slice: add WHERE order_date = :run_date to line 5, and load late rows with their own day (or MERGE them on order_id).',
};

export const SAMPLE_EXPLAIN: ExplainQuestion = {
  id: 'dev-sample-explain',
  type: QuestionType.EXPLAIN,
  difficulty: Difficulty.ADVANCED,
  topic: Topic.DE_IDEMPOTENT_LOADS,
  question:
    'In two or three sentences: why does "at-least-once delivery plus an idempotent write" end in the same table as exactly-once processing?\n' +
    'Name one kind of step that breaks it.',
  keyPoints: [
    'At-least-once may repeat a batch, but never loses one',
    'An idempotent write gives the same end state when applied again',
    'So the end state is the one exactly-once would give',
    'Names a breaker: a blind append, or a side effect outside the table (email, API call)',
  ],
  modelAnswer:
    'At-least-once can apply a batch more than once but never drops it. ' +
    'An idempotent write makes a second application a no-op on the end state, so the table ends as if each batch were applied exactly once. ' +
    'It breaks with a blind append, or with a side effect outside the table, such as an email or an API call, that the retry repeats.',
  explanation:
    'Exactly-once is a property of the end state, not of delivery: a pipeline gets it by pairing a delivery that never loses data with a write that is safe to repeat.',
};

export const SAMPLE_QUESTIONS = [
  SAMPLE_PREDICT_OUTCOME,
  SAMPLE_CHOOSE_JUSTIFY,
  SAMPLE_SPOT_FLAW,
  SAMPLE_EXPLAIN,
] as const;

/**
 * The sample a `?sample=<id>` query names, outside production builds only
 * (App.tsx shows it in the quiz view without recording the answer). Besides
 * the samples above, any question of the bank can be opened by its id, so a
 * screenshot can show one question of each type without seeding progress.
 */
export function sampleFromSearch(
  search: string,
  env: string | undefined = process.env.NODE_ENV,
  bank?: ReadonlyMap<string, Question>,
): Question | null {
  if (env === 'production') return null;
  const id = new URLSearchParams(search).get('sample');
  if (!id) return null;
  return SAMPLE_QUESTIONS.find(q => q.id === id) ?? bank?.get(id) ?? null;
}
