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
      { id: 'b', text: 'The maximum number of rows a single load is allowed to process before it stops and waits for the next run.', isCorrect: false },
      { id: 'c', text: 'A lock that stops any new rows arriving in the source while the load runs, so the data cannot change under it.', isCorrect: false },
      { id: 'd', text: 'The oldest row in the source, which every run reloads from so that no row is ever missed.', isCorrect: false },
    ],
    explanation: 'A high-watermark is the boundary of what you have already loaded, typically `MAX(UpdatedAt)` or `MAX(Id)`. Persisting it (for example in a control table) lets each run filter the source to just the new delta (`> watermark`) instead of rescanning everything. It is a position in the data, not a row limit or a lock.',
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
      { id: 'a', text: 'Late-arriving data; reload a lookback window (the watermark minus a few hours) with an idempotent MERGE, so reprocessed rows are not duplicated.', isCorrect: true },
      { id: 'b', text: 'Clock drift between servers; set the new watermark from `GETDATE()` instead of from the newest row loaded.', isCorrect: false },
      { id: 'c', text: 'A boundary-row bug; compare with `>=` the watermark and keep the plain INSERT, so no row is ever skipped.', isCorrect: false },
      { id: 'd', text: 'A concurrent-update conflict; lock the control table so the watermark cannot move while a load runs.', isCorrect: false },
    ],
    explanation: 'A strict `> watermark` filter silently skips rows whose event time precedes the watermark but which arrived afterward (late data). The fix is a lookback overlap (reload from `watermark − Δ`) combined with an idempotent MERGE or upsert, so the overlap reprocesses safely without creating duplicates. Using `>=` only re-reads the single boundary value, not the 09:00 row, and would duplicate rows with a plain INSERT; a clock-based watermark skips even more data; locking the control table does not help a row that arrives late.',
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
    tables: [
      {
        name: 'stg.Sales',
        columns: ['OrderId', 'Amount', 'UpdatedAt'],
        rows: [[1, 20, '2026-03-01 05:00'], [2, 35, '2026-03-01 09:30'], [3, 15, '2026-03-01 11:30']],
      },
    ],
    template: `DECLARE @lastLoaded DATETIME2 = '2026-03-01 10:00';
SELECT OrderId, Amount, UpdatedAt
FROM stg.Sales
WHERE UpdatedAt > ___(HOUR, -4, @lastLoaded);`,
    blanks: ['DATEADD'],
    solution: `DECLARE @lastLoaded DATETIME2 = '2026-03-01 10:00';
SELECT OrderId, Amount, UpdatedAt
FROM stg.Sales
WHERE UpdatedAt > DATEADD(HOUR, -4, @lastLoaded);`,
    explanation: '`DATEADD(HOUR, -4, @lastLoaded)` shifts the filter boundary 4 hours earlier, to 06:00, re-scanning a lookback window so rows whose event time is before the watermark but which only staged afterward are not silently missed: orders 2 and 3 come back, where a strict `> @lastLoaded` would return only order 3. In production this SELECT would feed a MERGE (or a dedup step), not a plain INSERT, since rows already loaded last run reappear in the overlap and would otherwise duplicate.',
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
    question: 'Fill in the comparison operator that selects only the rows newer than the stored watermark.',
    tables: [
      { name: 'dbo.FactSales', columns: ['OrderId', 'Amount', 'UpdatedAt'], rows: [[1, 20, '2026-03-01 09:00'], [2, 35, '2026-03-01 10:00']] },
      {
        name: 'stg.Sales',
        columns: ['OrderId', 'Amount', 'UpdatedAt'],
        rows: [[2, 35, '2026-03-01 10:00'], [3, 15, '2026-03-01 11:30'], [4, 40, '2026-03-01 12:00']],
      },
    ],
    template: `DECLARE @lastLoaded DATETIME2 = '2026-03-01 10:00';
INSERT INTO dbo.FactSales (OrderId, Amount, UpdatedAt)
SELECT OrderId, Amount, UpdatedAt
FROM stg.Sales
WHERE UpdatedAt ___ @lastLoaded;`,
    blanks: ['>'],
    solution: `DECLARE @lastLoaded DATETIME2 = '2026-03-01 10:00';
INSERT INTO dbo.FactSales (OrderId, Amount, UpdatedAt)
SELECT OrderId, Amount, UpdatedAt
FROM stg.Sales
WHERE UpdatedAt > @lastLoaded;`,
    explanation: 'The delta filter is `WHERE UpdatedAt > @lastLoaded`, strictly greater so you do not reload the boundary row already captured by the previous run: order 2, stamped exactly 10:00, is already in the fact table, so only orders 3 and 4 are inserted. (When late data is a concern, you widen this to a lookback window and rely on an idempotent MERGE.)',
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
    tables: [
      { name: 'dbo.FactSales', columns: ['OrderId', 'Amount', 'UpdatedAt'], rows: [[1, 20, '2026-03-01 09:00'], [2, 35, '2026-03-01 10:00']] },
    ],
    starterCode: `-- dbo.FactSales (OrderId, Amount, UpdatedAt)
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
    explanation: '`MAX(UpdatedAt)` returns NULL on an empty table, which would break a `> NULL` comparison on the next run (everything compares false). Wrapping it in `ISNULL(…, \'1900-01-01\')` (or `COALESCE`) supplies a safe floor so the first incremental run still pulls all rows. On the shown table the result is 2026-03-01 10:00.',
    hints: ["ISNULL(MAX(UpdatedAt), '1900-01-01')", 'Guards against NULL on an empty table'],
    requires: [/MAX/i, /ISNULL|COALESCE/i],
    tags: ['tsql', 'incremental', 'watermark', 'null-handling'],
  },
  {
    id: 'tsql-incr-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_INCREMENTAL,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'The last run loaded every staged row up to 10:00 and stored that watermark. Order 2 reached staging only after that run. Which rows does this run pick up? Write one row per line in the ORDER BY order, as OrderId and Amount separated by a comma.',
    tables: [
      { name: 'dbo.EtlControl', columns: ['TableName', 'LastLoadedAt'], rows: [['FactSales', '2026-03-01 10:00']] },
      {
        name: 'stg.Sales',
        columns: ['OrderId', 'Amount', 'UpdatedAt'],
        rows: [
          [1, 20, '2026-03-01 09:00'],
          [2, 35, '2026-03-01 09:30'],
          [3, 10, '2026-03-01 10:00'],
          [4, 15, '2026-03-01 11:30'],
          [5, 40, '2026-03-01 12:00'],
        ],
      },
    ],
    code: `DECLARE @lastLoaded DATETIME2;
SELECT @lastLoaded = LastLoadedAt FROM dbo.EtlControl WHERE TableName = 'FactSales';
SELECT OrderId, Amount
FROM stg.Sales
WHERE UpdatedAt > @lastLoaded
ORDER BY OrderId;`,
    expectedOutput: `4, 15
5, 40`,
    explanation: 'The filter keeps rows strictly after the 10:00 watermark: orders 4 and 5. Order 3, stamped exactly 10:00, was loaded by the last run, and the strict > rightly skips it. Order 2 is stamped 09:30, so the filter skips it too, although no run ever loaded it: it arrived late. A lookback window (watermark minus a margin) feeding an idempotent MERGE picks such rows up without duplicating the ones already loaded.',
    hints: ['Compare each UpdatedAt with 10:00, strictly greater', 'The filter reads the timestamp, not when the row arrived'],
    tags: ['tsql', 'incremental', 'high-watermark', 'late-arriving', 'predict'],
  },
];
