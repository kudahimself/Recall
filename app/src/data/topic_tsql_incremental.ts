/**
 * Topic.TSQL_INCREMENTAL — SQL for Data Engineering (T-SQL).
 * Pillar 6 (ELT & Transformation): high-watermark loads, staging → core flow,
 * late-arriving data, idempotency.
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const tsql_incremental_questions: Question[] = [
  {
    id: 'tsql-incr-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_INCREMENTAL,
    course: Course.SQL,
    question: 'What is a "high-watermark" in an incremental load?',
    options: [
      { id: 'a', text: 'The stored value (often a max timestamp or id) marking the newest data already loaded, so the next run pulls only rows beyond it.', isCorrect: true },
      { id: 'b', text: 'The maximum number of rows a single load is allowed to process before stopping.', isCorrect: false },
      { id: 'c', text: 'A lock that prevents any new rows from arriving while the load runs.', isCorrect: false },
      { id: 'd', text: 'The largest table in the warehouse, which sets the schedule for all others.', isCorrect: false },
    ],
    explanation: 'A high-watermark is the boundary of what you have already loaded — typically `MAX(UpdatedAt)` or `MAX(Id)`. Persisting it (e.g. in a control table) lets each run filter the source to just the new delta (`> watermark`) instead of rescanning everything.',
    hints: ['The marker of the newest already-loaded data', 'Next run loads rows beyond it'],
    tags: ['tsql', 'incremental', 'watermark'],
  },
  {
    id: 'tsql-incr-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_INCREMENTAL,
    course: Course.SQL,
    question: 'A source row is created with `UpdatedAt = 09:00` but does not reach staging until after a load that already advanced the watermark past 09:00. What is this problem, and a common mitigation?',
    options: [
      { id: 'a', text: 'Late-arriving data; mitigate by re-loading a lookback window (e.g. watermark minus a few hours) and using an idempotent MERGE so reprocessed rows are not duplicated.', isCorrect: true },
      { id: 'b', text: 'A deadlock; mitigate by raising the isolation level to SERIALIZABLE.', isCorrect: false },
      { id: 'c', text: 'A primary-key violation; mitigate by dropping the primary key during loads.', isCorrect: false },
      { id: 'd', text: 'A rounding error; mitigate by storing timestamps as floats.', isCorrect: false },
    ],
    explanation: 'A strict `> watermark` filter silently skips rows whose event time precedes the watermark but which arrived afterward (late data). The fix is a lookback overlap (reload from `watermark − Δ`) combined with an idempotent MERGE/upsert, so the overlap reprocesses safely without creating duplicates.',
    hints: ['Late-arriving data slips under a strict > filter', 'Lookback window + idempotent MERGE'],
    tags: ['tsql', 'incremental', 'late-arriving-data'],
  },
  {
    id: 'tsql-incr-lookback-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_INCREMENTAL,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the function that pulls the watermark back by 4 hours, widening the filter into a lookback window.',
    template: `-- stg.Sales(OrderId, CustomerId, ProductCode, Amount, UpdatedAt)
SELECT OrderId, Amount, UpdatedAt
FROM stg.Sales
WHERE UpdatedAt > ___(HOUR, -4, @lastLoaded);`,
    blanks: ['DATEADD'],
    solution: `SELECT OrderId, Amount, UpdatedAt
FROM stg.Sales
WHERE UpdatedAt > DATEADD(HOUR, -4, @lastLoaded);`,
    explanation: '`DATEADD(HOUR, -4, @lastLoaded)` shifts the filter boundary 4 hours earlier, re-scanning a lookback window so rows whose event time is before the watermark - but which only staged afterward - are not silently missed. In production this SELECT would feed a MERGE (or a dedup step), not a plain INSERT, since rows already loaded last run reappear in the overlap and would otherwise duplicate.',
    hints: ['Widen the boundary, do not just compare against it directly', 'DATEADD(unit, negative-offset, date)'],
    tags: ['tsql', 'incremental', 'late-arriving-data', 'dateadd', 'cloze'],
  },
  {
    id: 'tsql-incr-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_INCREMENTAL,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the predicate that selects only the rows newer than the stored watermark.',
    template: `-- dbo.FactSales(CustomerKey, ProductKey, Amount, OrderDate)
-- stg.Sales(OrderId, CustomerId, ProductCode, Amount, UpdatedAt)
INSERT INTO dbo.FactSales (OrderId, Amount, UpdatedAt)
SELECT OrderId, Amount, UpdatedAt
FROM stg.Sales
WHERE UpdatedAt ___ @lastLoaded;`,
    blanks: ['>'],
    solution: `INSERT INTO dbo.FactSales (OrderId, Amount, UpdatedAt)
SELECT OrderId, Amount, UpdatedAt
FROM stg.Sales
WHERE UpdatedAt > @lastLoaded;`,
    explanation: 'The delta filter is `WHERE UpdatedAt > @lastLoaded` — strictly greater so you do not reload the boundary row already captured by the previous run. (When late data is a concern, you widen this to a lookback window and rely on an idempotent MERGE.)',
    hints: ['Only rows strictly after the watermark', 'Strictly-greater comparison'],
    tags: ['tsql', 'incremental', 'watermark', 'cloze'],
  },
  {
    id: 'tsql-incr-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_INCREMENTAL,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Compute the next high-watermark to store. From `dbo.FactSales`, return the maximum `UpdatedAt` aliased as `NewWatermark`; if the table is empty, return a floor of `\'1900-01-01\'` instead of NULL (use ISNULL/COALESCE).',
    starterCode: `-- SELECT ISNULL(MAX(UpdatedAt), '1900-01-01') AS NewWatermark FROM ...
`,
    testCases: [
      {
        input: "SELECT ISNULL(MAX(UpdatedAt), '1900-01-01') AS NewWatermark FROM dbo.FactSales",
        expectedOutput: 'Max UpdatedAt, or the 1900 floor when empty',
        description: 'Null-safe watermark computation',
      },
    ],
    solution: `SELECT ISNULL(MAX(UpdatedAt), '1900-01-01') AS NewWatermark
FROM dbo.FactSales;
-- OR
SELECT COALESCE(MAX(UpdatedAt), '1900-01-01') AS NewWatermark
FROM dbo.FactSales;`,
    tieredHints: {
      apiSignature: 'MAX(expression) -> scalar',
      skeleton: `SELECT ____(____(UpdatedAt), ____) AS NewWatermark
FROM dbo.FactSales;`,
    },
    explanation: '`MAX(UpdatedAt)` returns NULL on an empty table, which would break a `> NULL` comparison on the next run (everything compares false). Wrapping it in `ISNULL(…, \'1900-01-01\')` (or `COALESCE`) supplies a safe floor so the first incremental run still pulls all rows.',
    hints: ["ISNULL(MAX(UpdatedAt), '1900-01-01')", 'Guards against NULL on an empty table'],
    requires: [/MAX/i, /ISNULL|COALESCE/i],
    tags: ['tsql', 'incremental', 'watermark', 'null-handling'],
  },
];
