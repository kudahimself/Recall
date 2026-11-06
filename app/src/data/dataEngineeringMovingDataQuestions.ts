import { CodeLanguage, Course, Difficulty, Question, QuestionType, SqlTable, Topic } from '../types';

/**
 * Data Engineering, section "Moving Data": the first section of the course
 * rewrite (decisions and designs). Six topics, each taught by a lesson
 * (src/data/lessons/dataEngineeringLessons.ts) and then practised with cards
 * that make the learner produce the answer:
 *
 *   introduce: one term-check MCQ, predict the outcome over small tables;
 *   combine:   choose and justify, order the steps (Parsons with prose lines);
 *   apply:     spot the flaw, predict or choose under three or more constraints;
 *   review:    explain in your own words (review-only, never a new card).
 *
 * Authoring rules for this file:
 *   - MCQ distractors are real misconceptions with their (wrong) reasoning,
 *     options length-matched, no absolute-word giveaways;
 *   - every predict-the-outcome answer is checked by running it:
 *     dataEngineeringMovingDataChecks.ts holds the check, scripts/check-outcomes.js
 *     runs it (part of npm test);
 *   - tables are tool-agnostic SQL; MERGE and DATEADD appear as notation and
 *     their checks model them in SQLite.
 */

const DE = Course.DATA_ENGINEERING;

const table = (name: string, columns: string[], rows: (string | number | null)[][]): SqlTable => ({ name, columns, rows });

/** Prose lines for a Parsons card: its solution is the lines in order. */
const steps = (lines: string[]) => lines.join('\n');

// ════════════════════════════════════════════════════════════════════════
// ETL, ELT & Staging
// ════════════════════════════════════════════════════════════════════════

const etlEltStaging: Question[] = [
  {
    id: 'de-stage-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_ETL_ELT_STAGING,
    course: DE,
    question: 'ETL and ELT run the same three steps: extract, transform, load. What actually separates them?',
    options: [
      { id: 'a', text: 'When it runs: ELT transforms each row as it streams in, while ETL waits for a nightly batch', isCorrect: false },
      { id: 'b', text: 'How much it moves: ELT loads the rows that changed, while ETL reloads each table in full', isCorrect: false },
      { id: 'c', text: 'Where the transform runs: ELT lands the raw rows first and reshapes them in the warehouse', isCorrect: true },
      { id: 'd', text: 'Who writes it: ELT is SQL that analysts write, while ETL is Python that engineers write', isCorrect: false },
    ],
    explanation:
      'ETL reshapes the data in a separate engine and loads only the result; ELT loads the rows as extracted and transforms them inside the warehouse, so the raw rows are there to transform again.\n' +
      'Batch or streaming, full or incremental, SQL or Python are separate choices: an ELT pipeline can be any of them.',
  },
  {
    id: 'de-stage-2',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_ETL_ELT_STAGING,
    course: DE,
    question:
      'Each night the extract appends that night\'s orders to stg_orders, and nothing ever clears it. The load below then runs.\n' +
      'The tables show the state just after night 2\'s extract. How many rows does night 2\'s load insert into fact_orders?',
    tables: [
      table('stg_orders', ['order_id', 'order_date', 'amount', 'extracted_on'], [
        [1, '2026-11-01', 40, '2026-11-02'],
        [2, '2026-11-01', 25, '2026-11-02'],
        [3, '2026-11-01', 35, '2026-11-02'],
        [4, '2026-11-02', 60, '2026-11-03'],
        [5, '2026-11-02', 15, '2026-11-03'],
      ]),
      table('fact_orders', ['order_id', 'order_date', 'amount'], [
        [1, '2026-11-01', 40],
        [2, '2026-11-01', 25],
        [3, '2026-11-01', 35],
      ]),
    ],
    code: 'INSERT INTO fact_orders\nSELECT order_id, order_date, amount\nFROM stg_orders;',
    language: CodeLanguage.SQL,
    answer: '5',
    acceptableAnswers: ['five'],
    unit: 'rows',
    tempting: [
      { answer: '2', why: 'Two is what tonight\'s extract added. The load reads the whole staging table, and night 1\'s three rows are still in it.' },
      { answer: '8', why: 'Eight is what fact_orders holds after the load, not what the load inserted: orders 1, 2 and 3 are now in it twice.' },
    ],
    explanation:
      'Staging is the hand-off for one batch, so whatever it still holds is loaded again: the load inserts all 5 staged rows, and orders 1-3 are now in fact_orders twice.\n' +
      'Clear staging before each extract (or tag its rows with the batch and load only that batch).',
  },
  {
    id: 'de-stage-3',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_ETL_ELT_STAGING,
    course: DE,
    question:
      'An ETL job reads orders from a shop API, converts amounts to euros in flight, and loads only the converted rows: no raw copy is kept.\n' +
      'The API returns orders from the 2 days before the day it is called. On 2026-11-04 you find the conversion used the wrong rate on 2026-11-01, 11-02 and 11-03, and you fix it.\n' +
      'How many of those three days can be rebuilt correctly?',
    tables: [
      table('fact_revenue (wrong rate)', ['order_date', 'revenue_eur'], [
        ['2026-11-01', 1180],
        ['2026-11-02', 960],
        ['2026-11-03', 1320],
      ]),
    ],
    answer: '2',
    acceptableAnswers: ['two'],
    unit: 'days',
    tempting: [
      { answer: '3', why: 'Three needs the source rows of 2026-11-01. The warehouse holds only converted amounts, and on 11-04 the API serves 11-02 and 11-03 only.' },
      { answer: '0', why: 'The API still serves 11-02 and 11-03 on 11-04, so those two days can be extracted and converted again.' },
    ],
    explanation:
      'Called on 2026-11-04, the API returns 11-02 and 11-03, so those two days can be re-extracted and converted with the fixed rate.\n' +
      '2026-11-01 is gone from the source, and ETL kept no raw copy, so it cannot be rebuilt. Landing the raw rows first (ELT) is what makes every past day rebuildable.',
  },
  {
    id: 'de-stage-4',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_ETL_ELT_STAGING,
    course: DE,
    question:
      'A hospital feed holds patient names and national ID numbers. Policy says identifiers may never be stored in the analytics warehouse, and analysts want to re-run their transforms when rules change.\n' +
      'How should the identifiers be handled, and why?',
    decisions: [
      { id: 'mask-first', text: 'Hash the identifiers in the pipeline before the rows land, then do the rest in the warehouse', isCorrect: true },
      { id: 'view', text: 'Land the raw rows in the warehouse and give analysts a view that hides the identifier columns', isCorrect: false },
      { id: 'schema', text: 'Land the raw rows in a schema locked to the engineers\' service account, out of analysts\' reach', isCorrect: false },
      { id: 'delete', text: 'Land the raw rows, hash them in the warehouse, then delete the raw table after each run', isCorrect: false },
    ],
    reasons: [
      { id: 'stored', text: 'Landed rows are stored, in backups and query logs too, whatever a view or grant hides', isCorrect: true },
      { id: 'faster', text: 'Hashing outside the warehouse is faster, since the warehouse has to scan less data each run', isCorrect: false },
      { id: 'no-hash', text: 'Warehouse SQL lacks hash functions, so masking has to happen in the extract code instead', isCorrect: false },
      { id: 'smaller', text: 'Hashed values compress better than names, so the warehouse bill for the table drops', isCorrect: false },
    ],
    explanation:
      'A rule about what may be stored is broken the moment raw identifiers land, even if nobody can query them: the warehouse keeps them in backups, time travel and query history.\n' +
      'So transform those columns before the load (ETL for that part) and keep ELT for everything else, which still lets analysts re-run their transforms.',
  },
  {
    id: 'de-stage-5',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_ETL_ELT_STAGING,
    course: DE,
    question:
      'A rate-limited marketing API returns the last 90 days of campaign data. The rules for turning it into reporting tables change most months.\n' +
      'Which design fits, and why?',
    decisions: [
      { id: 'etl', text: 'ETL: transform in the extract job and load just the finished reporting rows', isCorrect: false },
      { id: 'elt', text: 'ELT: land each extract unchanged and keep it, then transform in the warehouse', isCorrect: true },
      { id: 'live', text: 'Skip the copy: point the reports at the API and transform results per query', isCorrect: false },
      { id: 'monthly', text: 'ETL again each month: re-extract the full 90 days whenever the rules change', isCorrect: false },
    ],
    reasons: [
      { id: 'cheaper', text: 'Warehouse compute costs less than an ETL server, so transforms belong in the warehouse', isCorrect: false },
      { id: 'incremental', text: 'ELT loads the rows that changed since the last run, which keeps under the API limit', isCorrect: false },
      { id: 'rerun', text: 'Kept raw rows let a new rule re-run on stored data; the API forgets after 90 days', isCorrect: true },
      { id: 'faster-raw', text: 'Raw API rows answer report queries faster than modelled tables, so reports read them', isCorrect: false },
    ],
    explanation:
      'The rules change monthly and the source forgets after 90 days, so the raw extracts are the only full history: keep them and re-run the new rules on them, without calling a rate-limited API again.\n' +
      'Cost, incremental loading and query speed are separate questions; ELT does not settle any of them.',
  },
  {
    id: 'de-stage-6',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_ETL_ELT_STAGING,
    course: DE,
    language: CodeLanguage.SQL,
    question: 'Put the steps of one ELT batch in order. Two steps do not belong.',
    correctOrder: [
      'Clear the staging table for this batch',
      'Extract the run\'s rows from the source into staging, unchanged',
      'Check staging: row count against the source, key columns not null',
      'Transform staging into the target\'s rows with SQL in the warehouse',
      'Replace the run\'s slice of the target with the transformed rows',
    ],
    distractorLines: [
      'Clean and reshape each row in the extract script before it lands',
      'Join the live source tables during the transform to fill missing fields',
    ],
    solution: steps([
      'Clear the staging table for this batch',
      'Extract the run\'s rows from the source into staging, unchanged',
      'Check staging: row count against the source, key columns not null',
      'Transform staging into the target\'s rows with SQL in the warehouse',
      'Replace the run\'s slice of the target with the transformed rows',
    ]),
    explanation:
      'ELT lands the batch as extracted, checks it, and transforms it inside the warehouse; the transform reads staging, the snapshot the checks passed.\n' +
      'Reshaping in the extract script is ETL, and reading the live source during the transform loads rows the checks never saw.',
  },
  {
    id: 'de-stage-7',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_ETL_ELT_STAGING,
    course: DE,
    question:
      'Two jobs run on the clock, with no dependency between them. On 2026-11-03 the source database is down, so extract_orders fails before its truncate and staging still holds the orders it extracted on 11-02.\n' +
      'load_orders runs at 02:30 as usual. How many rows for 2026-11-01 does fact_orders hold afterwards?',
    tables: [
      table('stg_orders (at 02:30 on 11-03)', ['order_id', 'order_date', 'amount'], [
        [1, '2026-11-01', 40],
        [2, '2026-11-01', 25],
        [3, '2026-11-01', 35],
      ]),
      table('fact_orders (before 02:30)', ['order_id', 'order_date', 'amount'], [
        [1, '2026-11-01', 40],
        [2, '2026-11-01', 25],
        [3, '2026-11-01', 35],
      ]),
    ],
    code:
      'extract_orders: every day at 02:00   -- TRUNCATE stg_orders, then load yesterday\'s orders\n' +
      'load_orders:    every day at 02:30   -- INSERT INTO fact_orders SELECT * FROM stg_orders',
    answer: '6',
    acceptableAnswers: ['six'],
    unit: 'rows',
    tempting: [
      { answer: '3', why: 'Three assumes the load waits for a fresh extract. It runs on the clock and inserts whatever staging holds, which is 11-01 again.' },
      { answer: '0', why: 'Nothing deletes from fact_orders: the failed extract never reached its truncate, and the load only inserts.' },
    ],
    explanation:
      'The load inserts staging\'s three 11-01 rows a second time, so fact_orders holds 6 rows for 11-01 and none for 11-02.\n' +
      'Make the load depend on the extract of the same run (not on the time), and make it replace its slice rather than append.',
  },
  {
    id: 'de-stage-8',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_ETL_ELT_STAGING,
    course: DE,
    question:
      'The staging check on line 4 passes every night, yet fact_orders sometimes holds orders it never counted, and re-running an old date loads different rows than the first run did.\n' +
      'Click the line that causes it.',
    language: CodeLanguage.SQL,
    lines: [
      '-- nightly ELT job for :run_date',
      'TRUNCATE TABLE stg_orders;',
      'INSERT INTO stg_orders SELECT * FROM src.orders WHERE order_date = :run_date;',
      '-- check: COUNT(*) of stg_orders = the source\'s count for :run_date',
      'INSERT INTO fact_orders',
      'SELECT o.order_id, o.order_date, o.amount, c.region',
      'FROM src.orders o JOIN dim_customer c ON c.customer_id = o.customer_id',
      'WHERE o.order_date = :run_date;',
    ],
    flawLines: [7],
    note: 'src.orders is the live source database; dim_customer lives in the warehouse.',
    explanation:
      'Line 7 reads src.orders, the live source, instead of stg_orders, so the load sees rows written after the extract and checks, and a re-run of an old date sees the source as it is now.\n' +
      'Transform from staging: it is the snapshot the checks passed, and it is what makes a run repeatable.',
  },
  {
    id: 'de-stage-9',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_ETL_ELT_STAGING,
    course: DE,
    question:
      'An audit finds national ID numbers in the warehouse\'s 30-day backups and in its query history, although patients holds only hashes and patients_raw is emptied every night.\n' +
      'Click the step that causes it.',
    lines: [
      'extract: read patients from the clinic database',
      'load: write the rows to warehouse.patients_raw',
      'transform: patients = patients_raw with national_id replaced by sha256(national_id + salt)',
      'cleanup: delete every row of warehouse.patients_raw after the transform succeeds',
      'grant: analysts may read warehouse.patients',
    ],
    flawLines: [2],
    explanation:
      'Step 2 lands the raw identifiers in the warehouse, and from that moment they are in its backups and logs, whatever step 4 deletes later.\n' +
      'Hash the column in the pipeline before the load, so the warehouse never receives it.',
  },
  {
    id: 'de-stage-10',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_ETL_ELT_STAGING,
    course: DE,
    question: 'In two or three sentences: why does an ELT pipeline keep the raw extract after the clean tables are built? Say what it costs to keep.',
    keyPoints: [
      'Transform rules change and bugs are found, so past data has to be transformed again',
      'The source may no longer hold that history, or re-extracting it is slow or rate-limited',
      'With raw kept, a fix is re-run on stored rows without touching the source',
      'The cost: storage, plus guarding sensitive raw columns',
    ],
    modelAnswer:
      'Rules change and transforms have bugs, so old data has to be transformed again, and the source may have forgotten it or be slow to re-extract. ' +
      'Keeping the raw extract lets a fix re-run on stored rows without touching the source. ' +
      'The price is storage and access control for whatever sensitive data the raw rows carry.',
    explanation: 'Raw data is the pipeline\'s undo history: it turns "re-extract, if the source still has it" into "re-run the transform".',
  },
  {
    id: 'de-stage-11',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_ETL_ELT_STAGING,
    course: DE,
    question: 'In two or three sentences: when does transforming before the load (ETL) still beat ELT? Give two cases.',
    keyPoints: [
      'Data that may not be stored in the target (identifiers, regulated fields) must be masked or dropped before it lands',
      'When the raw volume is far larger than what is needed, filtering first saves loading and storing it',
      'When the target cannot run the transform (no SQL engine, or not enough compute)',
    ],
    modelAnswer:
      'When some data may not be stored in the target at all, such as identifiers under a privacy rule, it has to be masked before it lands. ' +
      'ETL also wins when the raw feed is much bigger than what is used, so filtering first avoids loading and storing it, or when the target cannot run the transform.',
    explanation: 'ELT is the default when the warehouse can do the work; ETL is chosen for what must never land or is not worth landing.',
  },
];

// ════════════════════════════════════════════════════════════════════════
// Full vs Incremental Loads
// ════════════════════════════════════════════════════════════════════════

const fullVsIncremental: Question[] = [
  {
    id: 'de-incr-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_FULL_VS_INCREMENTAL,
    course: DE,
    question: 'An incremental load keeps a high-water mark between runs. What should the mark record?',
    options: [
      { id: 'a', text: 'The time the last load started, read from the scheduler\'s clock when the job began', isCorrect: false },
      { id: 'b', text: 'The newest order_date in the target, so the next run starts at the following day', isCorrect: false },
      { id: 'c', text: 'The row count of the target after the last load, so the next run skips that many', isCorrect: false },
      { id: 'd', text: 'The highest change value (updated_at or an id) that the last successful load read', isCorrect: true },
    ],
    explanation:
      'The next run asks the source for rows past the mark, so the mark has to be a value from the data the last run actually loaded.\n' +
      'The job\'s clock misses rows committed late; a business date misses changes to older rows; a row count says nothing about which rows changed.',
  },
  {
    id: 'de-incr-2',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_FULL_VS_INCREMENTAL,
    course: DE,
    question: 'The incremental extract below runs with the load_state shown. How many rows does it read?',
    tables: [
      table('load_state', ['tbl', 'last_loaded'], [['orders', '2026-11-01 23:00']]),
      table('src_orders', ['order_id', 'order_date', 'status', 'updated_at'], [
        [101, '2026-10-28', 'shipped', '2026-11-02 09:15'],
        [102, '2026-11-01', 'paid', '2026-11-01 22:40'],
        [103, '2026-11-02', 'paid', '2026-11-02 08:05'],
        [104, '2026-11-02', 'paid', '2026-11-02 10:30'],
        [105, '2026-10-30', 'cancelled', '2026-11-01 23:00'],
      ]),
    ],
    code:
      'SELECT order_id\nFROM src_orders\n' +
      "WHERE updated_at > (SELECT last_loaded FROM load_state WHERE tbl = 'orders');",
    language: CodeLanguage.SQL,
    answer: '3',
    acceptableAnswers: ['three'],
    unit: 'rows',
    tempting: [
      { answer: '2', why: 'Two counts orders placed on 11-02. The filter is on updated_at, so order 101 from October is read too: it changed on 11-02.' },
      { answer: '4', why: 'Order 105 changed at exactly 23:00, the mark itself. The last run read it, and > leaves it out.' },
    ],
    explanation:
      'Rows 101, 103 and 104 changed after 23:00, so the run reads 3 rows, including an order placed in October.\n' +
      'An incremental load follows the change column, not the business date: old orders that change come back in.',
  },
  {
    id: 'de-incr-3',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_FULL_VS_INCREMENTAL,
    course: DE,
    question:
      'Run 2 of an incremental load appends every changed row to fact_orders. Order 102 was paid on 11-01 and refunded on 11-02.\n' +
      'After run 2, what does SELECT SUM(amount) FROM fact_orders WHERE status = \'paid\' return?',
    tables: [
      table('fact_orders (after run 1)', ['order_id', 'status', 'amount'], [
        [101, 'paid', 40],
        [102, 'paid', 25],
      ]),
      table('changed_orders (run 2)', ['order_id', 'status', 'amount'], [
        [102, 'refunded', 25],
        [103, 'paid', 30],
      ]),
    ],
    code: 'INSERT INTO fact_orders\nSELECT order_id, status, amount\nFROM changed_orders;',
    language: CodeLanguage.SQL,
    answer: '95',
    tempting: [
      { answer: '70', why: 'Seventy is the right revenue, which an upsert on order_id gives. The append leaves 102\'s paid row in place beside its refunded row.' },
      { answer: '120', why: '120 adds every row; the WHERE status = \'paid\' leaves the refunded row out.' },
    ],
    explanation:
      'The append keeps the old version of 102 (paid, 25) and adds the new one (refunded), so paid revenue is 40 + 25 + 30 = 95 instead of 70.\n' +
      'An incremental load of rows that can change has to replace them by key (upsert or MERGE), not append them.',
  },
  {
    id: 'de-incr-4',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_FULL_VS_INCREMENTAL,
    course: DE,
    question:
      'fx_rates has 2,000 rows and no updated_at column, and the finance team sometimes deletes a wrong rate at the source. The warehouse copy must match the source each morning.\n' +
      'How should it be loaded, and why?',
    decisions: [
      { id: 'full', text: 'Reload it in full each night, replacing the target in one transaction', isCorrect: true },
      { id: 'id-mark', text: 'Load it incrementally, with the highest rate_id seen so far as the mark', isCorrect: false },
      { id: 'append', text: 'Append the whole table nightly and let reports pick the newest copy', isCorrect: false },
      { id: 'today', text: 'Copy the rates whose rate_date is today, since older rates are final', isCorrect: false },
    ],
    reasons: [
      { id: 'sees-all', text: 'Without a change column, and with source deletes, a full copy sees each change; 2,000 rows is cheap', isCorrect: true },
      { id: 'keeps-old', text: 'A full reload keeps the previous night\'s rows as well, so a deleted rate stays there for audits', isCorrect: false },
      { id: 'streaming', text: 'Incremental loads need a streaming engine, and a nightly batch job like this one does not have it', isCorrect: false },
      { id: 'reused', text: 'Rate ids are reused after a delete, so a mark on rate_id would load the same rate twice, night after night', isCorrect: false },
    ],
    explanation:
      'An incremental load needs a column that says what changed, and it never sees deletes; this table has neither, and it is small.\n' +
      'Replacing it in full each night, in one transaction, makes the copy match the source including deletions, for the price of copying 2,000 rows.',
  },
  {
    id: 'de-incr-5',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_FULL_VS_INCREMENTAL,
    course: DE,
    question:
      'app_events gains 40 million rows a day; rows are never updated or deleted. One writer assigns event_id in increasing order as rows commit, and the warehouse copy holds 9 billion rows.\n' +
      'How should it be loaded, and why?',
    decisions: [
      { id: 'id-mark', text: 'Incremental: load rows whose event_id is above the highest one loaded', isCorrect: true },
      { id: 'full', text: 'Full: copy the 9 billion rows each night into a new table and swap it in', isCorrect: false },
      { id: 'today', text: 'Incremental: load rows whose event_date is today by the warehouse clock', isCorrect: false },
      { id: 'clock', text: 'Incremental by updated_at, with the mark set to the job\'s start time', isCorrect: false },
    ],
    reasons: [
      { id: 'append-only', text: 'Rows are appended, not changed, and ids commit in order, so the top id loaded marks where new rows begin', isCorrect: true },
      { id: 'unique', text: 'Event ids are unique, so a load filtered on them will not insert the same row twice in the same night', isCorrect: false },
      { id: 'clocks-agree', text: 'Today\'s events are the ones reports need, and the warehouse clock agrees with the source database clock', isCorrect: false },
      { id: 'faster', text: 'Reading in id order is faster than filtering on a date, whatever engine the warehouse runs on', isCorrect: false },
    ],
    explanation:
      'An append-only table with ids that commit in order is the easy case: the highest id loaded is an exact mark, and each run reads only the new rows.\n' +
      'Uniqueness alone is not enough (ids that commit out of order would be skipped), and copying 9 billion rows a night to pick up 40 million is waste.',
  },
  {
    id: 'de-incr-6',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_FULL_VS_INCREMENTAL,
    course: DE,
    language: CodeLanguage.SQL,
    question: 'Put the steps of one incremental load run in order. Two steps do not belong.',
    correctOrder: [
      'Read last_loaded for the table from load_state',
      'Extract source rows with updated_at > last_loaded',
      'Upsert them into the target on the business key',
      'Set last_loaded to the max updated_at just extracted, in the same transaction',
    ],
    distractorLines: [
      'Set last_loaded to the current time before extracting',
      'Append the extracted rows to the target table',
    ],
    solution: steps([
      'Read last_loaded for the table from load_state',
      'Extract source rows with updated_at > last_loaded',
      'Upsert them into the target on the business key',
      'Set last_loaded to the max updated_at just extracted, in the same transaction',
    ]),
    explanation:
      'The mark moves only after the rows it covers are written, and to a value taken from those rows, so a failed run is simply repeated and nothing is skipped.\n' +
      'A clock-time mark skips rows that commit late, and appending changed rows keeps their old versions.',
  },
  {
    id: 'de-incr-7',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_FULL_VS_INCREMENTAL,
    course: DE,
    question:
      'Run 1 started at 10:00, read every committed row with updated_at after 09:00, then saved last_loaded = 10:00, its own start time.\n' +
      'Row 7 was stamped 09:58 by a long transaction that committed at 10:03, after run 1 had read. Run 2 starts at 11:00 and reads committed rows with updated_at > last_loaded.\n' +
      'How many of rows 5-8 are in the target after run 2?',
    tables: [
      table('src_rows', ['row_id', 'updated_at', 'committed_at'], [
        [5, '2026-11-02 09:20', '2026-11-02 09:20'],
        [6, '2026-11-02 09:45', '2026-11-02 09:45'],
        [7, '2026-11-02 09:58', '2026-11-02 10:03'],
        [8, '2026-11-02 10:30', '2026-11-02 10:30'],
      ]),
    ],
    answer: '3',
    acceptableAnswers: ['three'],
    unit: 'rows',
    tempting: [
      { answer: '4', why: 'Four is what a mark taken from the data gives: run 1\'s highest updated_at was 09:45, and 09:58 is after it.' },
      { answer: '2', why: 'Run 2 does pick up row 8, stamped 10:30. Only row 7 falls in the gap between the clock mark and its commit.' },
    ],
    explanation:
      'Run 1 loads rows 5 and 6 (row 7 is not committed yet); run 2 asks for rows after 10:00 and loads row 8. Row 7, stamped 09:58, is never read: 3 rows.\n' +
      'Set the mark to the highest value the run actually loaded (09:45 here), and row 7 is picked up by run 2.',
  },
  {
    id: 'de-incr-8',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_FULL_VS_INCREMENTAL,
    course: DE,
    question:
      'One night this job failed while inserting (the disk was full). The next night\'s run succeeded, but the orders that changed before the failure never reached fact_orders.\n' +
      'Click the line that causes it.',
    language: CodeLanguage.SQL,
    lines: [
      "DECLARE @from DATETIME2 = (SELECT last_loaded FROM load_state WHERE tbl = 'orders');",
      'DECLARE @to DATETIME2 = (SELECT MAX(updated_at) FROM src_orders);',
      "UPDATE load_state SET last_loaded = @to WHERE tbl = 'orders';",
      'BEGIN TRAN;',
      'DELETE FROM fact_orders WHERE order_id IN',
      '  (SELECT order_id FROM src_orders WHERE updated_at > @from AND updated_at <= @to);',
      'INSERT INTO fact_orders SELECT order_id, status, amount',
      '  FROM src_orders WHERE updated_at > @from AND updated_at <= @to;',
      'COMMIT;',
    ],
    flawLines: [3],
    explanation:
      'Line 3 moves the mark before the load commits. When the insert failed, the transaction rolled back, but the mark had already moved past those rows, so the next run started after them.\n' +
      'Update load_state inside the transaction, after the insert, so the mark and the rows commit together.',
  },
  {
    id: 'de-incr-9',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_FULL_VS_INCREMENTAL,
    course: DE,
    question:
      'New orders reach fact_orders every night, but refunds and cancellations of orders placed before yesterday never show up.\n' +
      'Click a line that causes it.',
    language: CodeLanguage.SQL,
    lines: [
      '-- nightly incremental load of orders',
      'DECLARE @last DATE = (SELECT MAX(order_date) FROM fact_orders);',
      'MERGE fact_orders AS t',
      'USING (SELECT * FROM src_orders WHERE order_date > @last) AS s',
      '  ON t.order_id = s.order_id',
      'WHEN MATCHED THEN UPDATE SET status = s.status, amount = s.amount',
      'WHEN NOT MATCHED THEN INSERT VALUES (s.order_id, s.order_date, s.status, s.amount);',
    ],
    flawLines: [2, 4],
    explanation:
      'The mark is a business date (line 2) and the filter uses it (line 4), so only newly placed orders are read; a refund changes an old order, whose order_date is behind the mark.\n' +
      'Track and filter on the change column (updated_at), so any order that changed is read whatever day it was placed.',
  },
  {
    id: 'de-incr-10',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_FULL_VS_INCREMENTAL,
    course: DE,
    question: 'In two or three sentences: why should an incremental load\'s mark be the highest value it actually loaded, saved together with the load, and not the time the job ran?',
    keyPoints: [
      'Rows can commit after the job started with an earlier timestamp, so a clock mark skips them',
      'A mark taken from the loaded rows starts the next run right after what was really read',
      'Saving it in the same transaction as the load means a failed run leaves the mark where it was',
    ],
    modelAnswer:
      'A row can commit after the job starts while carrying an earlier timestamp, so a mark set to the job\'s clock skips it. ' +
      'Taking the mark from the rows actually loaded starts the next run right after what was read, and saving it in the load\'s transaction means a failed run leaves the mark unmoved.',
    explanation: 'The mark is a promise that everything up to it is loaded; only the data and the commit can keep that promise.',
  },
  {
    id: 'de-incr-11',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_FULL_VS_INCREMENTAL,
    course: DE,
    question: 'In two or three sentences: when is a full reload the better choice than an incremental load? Give the signs to look for.',
    keyPoints: [
      'The table is small enough that copying it all is cheap',
      'There is no reliable change column to mark progress with',
      'Rows are deleted at the source, which an incremental read on a change column never sees',
    ],
    modelAnswer:
      'A full reload wins when the table is small enough to copy cheaply, or when there is no trustworthy change column to build a mark on. ' +
      'It also sees deletes, which an incremental read on updated_at cannot, so a small table whose rows get deleted is a clear case for it.',
    explanation: 'Incremental is an optimisation for large tables with a good change column; without those, it only adds ways to miss changes.',
  },
];

// ════════════════════════════════════════════════════════════════════════
// Re-runs & Idempotent Loads (the worked topic of the redesign report)
// ════════════════════════════════════════════════════════════════════════

const SALES_STAGED = table('staging_sales', ['sale_id', 'sale_date', 'amount'], [
  [11, '2026-11-01', 12],
  [12, '2026-11-01', 30],
  [13, '2026-11-01', 8],
  [14, '2026-11-01', 50],
  [9, '2026-10-31', 15],
]);

const SALES_BEFORE = table('daily_sales', ['sale_id', 'sale_date', 'amount'], [
  [7, '2026-10-31', 20],
  [8, '2026-10-31', 10],
]);

const idempotentLoads: Question[] = [
  {
    id: 'de-idem-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_IDEMPOTENT_LOADS,
    course: DE,
    question: 'A load is idempotent when...',
    options: [
      { id: 'a', text: 'it rarely fails in practice, so the orchestrator seldom has to retry it', isCorrect: false },
      { id: 'b', text: 'running it twice on the same input leaves the target as running it once', isCorrect: true },
      { id: 'c', text: 'its transform returns the same rows each time it runs on the same input', isCorrect: false },
      { id: 'd', text: 'it processes just the rows that are new since its last successful run', isCorrect: false },
    ],
    explanation:
      'Idempotent is about the target: applying the load again changes nothing.\n' +
      'A load that rarely fails is reliable, not idempotent; a deterministic transform is needed but not enough (append its same rows twice and you have duplicates); loading only new rows is incremental, and an incremental append still doubles a slice when it is retried.',
  },
  {
    id: 'de-idem-2',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_IDEMPOTENT_LOADS,
    course: DE,
    question:
      'The nightly job below loads 2026-11-01. It writes its rows, then times out before reporting success, so the orchestrator runs it again.\n' +
      'After both runs, how many rows for 2026-11-01 are in daily_sales?',
    tables: [SALES_STAGED, SALES_BEFORE],
    code:
      '-- the job, run twice\n' +
      'INSERT INTO daily_sales\n' +
      'SELECT sale_id, sale_date, amount\n' +
      'FROM staging_sales\n' +
      "WHERE sale_date = '2026-11-01';",
    language: CodeLanguage.SQL,
    answer: '8',
    acceptableAnswers: ['eight'],
    unit: 'rows',
    tempting: [
      { answer: '10', why: 'Ten is the whole table (the 2 older rows plus 8), or the 5 staged rows twice: the WHERE keeps the late 2026-10-31 row out of both runs.' },
      { answer: '4', why: 'Four is one run. The retry runs the same append again, and nothing in it removes the rows the first run wrote.' },
    ],
    explanation:
      'The job is an append, so each run adds the slice again: 4 rows on the first run, the same 4 on the retry, 8 in all for 2026-11-01.\n' +
      'Revenue for the day now reads 200 instead of 100.',
  },
  {
    id: 'de-idem-3',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_IDEMPOTENT_LOADS,
    course: DE,
    question:
      'The same tables, but now the job replaces the day inside one transaction. It runs twice for 2026-11-01.\n' +
      'How many rows does daily_sales hold in total afterwards?',
    tables: [SALES_STAGED, SALES_BEFORE],
    code:
      '-- the job, run twice\n' +
      'BEGIN;\n' +
      "DELETE FROM daily_sales WHERE sale_date = '2026-11-01';\n" +
      'INSERT INTO daily_sales\n' +
      'SELECT sale_id, sale_date, amount\n' +
      'FROM staging_sales\n' +
      "WHERE sale_date = '2026-11-01';\n" +
      'COMMIT;',
    language: CodeLanguage.SQL,
    answer: '6',
    acceptableAnswers: ['six'],
    unit: 'rows',
    tempting: [
      { answer: '4', why: 'Four is the 2026-11-01 slice alone. The delete touches only that day, so the 2 older rows stay.' },
      { answer: '10', why: 'Ten treats the second run as adding rows. It first deletes what the first run wrote, then writes the same 4 rows back.' },
    ],
    explanation:
      'Each run empties 2026-11-01 and fills it with the same 4 rows, so the second run ends where the first did: 2 older rows plus 4, 6 in total.\n' +
      'That is idempotence: the slice is set to the run\'s output, not added to.',
  },
  {
    id: 'de-idem-4',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_IDEMPOTENT_LOADS,
    course: DE,
    question:
      'The MERGE below runs, times out, and is retried once with the same batch.\n' +
      'What does SELECT SUM(amount) FROM balances return afterwards?',
    tables: [
      table('balances', ['account_id', 'amount'], [
        [101, 40],
        [102, 25],
      ]),
      table('batch', ['account_id', 'amount'], [
        [102, 30],
        [103, 35],
      ]),
    ],
    code:
      'MERGE balances AS t\n' +
      'USING batch AS s ON t.account_id = s.account_id\n' +
      'WHEN MATCHED THEN UPDATE SET amount = s.amount\n' +
      'WHEN NOT MATCHED THEN INSERT (account_id, amount) VALUES (s.account_id, s.amount);',
    language: CodeLanguage.SQL,
    answer: '105',
    tempting: [
      { answer: '195', why: '195 treats the MERGE as an insert of the batch on each run (65 + 65 + 65). A matched key is updated, not added again.' },
      { answer: '65', why: 'Sixty-five is the batch alone. MERGE changes the rows it matches and inserts the rest; account 101 is left as it was.' },
    ],
    explanation:
      'Run 1 sets 102 to 30 and inserts 103 at 35: 40 + 30 + 35 = 105. The retry matches 102 and 103 and sets them to the same values, so the total stays 105.\n' +
      'A MERGE on a stable key is idempotent because a second run finds its own rows and writes the same values over them.',
  },
  {
    id: 'de-idem-5',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_IDEMPOTENT_LOADS,
    course: DE,
    question:
      'A daily job always writes into the partition CURRENT_DATE - 1. On 2026-11-20 an engineer points it at the 2026-11-03 files to backfill that day.\n' +
      'Which partition do the 2026-11-03 rows land in?',
    code:
      '-- run on 2026-11-20, reading the 2026-11-03 files\n' +
      'DELETE FROM fact_events WHERE event_day = CURRENT_DATE - 1;\n' +
      'INSERT INTO fact_events\n' +
      'SELECT CURRENT_DATE - 1 AS event_day, user_id, action\n' +
      'FROM files_2026_11_03;',
    language: CodeLanguage.SQL,
    answer: '2026-11-19',
    acceptableAnswers: ['19 November 2026', 'Nov 19 2026', '2026/11/19'],
    tempting: [
      { answer: '2026-11-03', why: 'That is the day the files belong to, but the job never reads a date from its input: it computes the partition from the clock.' },
      { answer: '2026-11-20', why: 'The job subtracts a day from today, so it writes yesterday, 2026-11-19.' },
    ],
    explanation:
      'The partition comes from the clock, so the backfill writes 2026-11-03\'s rows into 2026-11-19 and deletes that day\'s real rows on the way.\n' +
      'Take the slice from the run\'s input (the run_date the orchestrator passes) so a run for any day writes that day.',
  },
  {
    id: 'de-idem-6',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_IDEMPOTENT_LOADS,
    course: DE,
    question:
      "Orders come from a shop API. An order's status can change for up to 30 days after it is placed, and each nightly extract returns every order updated yesterday, whatever its order_date.\n" +
      'fact_orders is partitioned by order_date and the orchestrator retries failed runs. Which load keeps fact_orders correct, and why?',
    decisions: [
      { id: 'overwrite', text: "Overwrite the partition for yesterday's order_date", isCorrect: false },
      { id: 'merge', text: 'MERGE on order_id: update rows that match, insert the rest', isCorrect: true },
      { id: 'append', text: 'Append each night, then dedupe with ROW_NUMBER() on Sundays', isCorrect: false },
      { id: 'truncate', text: 'Truncate fact_orders and reload it from the extract each night', isCorrect: false },
    ],
    reasons: [
      {
        id: 'identity',
        text: "The extract spans many partitions, so none is the run's slice; order_id is the key a re-run can match",
        isCorrect: true,
      },
      { id: 'fewer-files', text: 'A MERGE rewrites fewer files than an overwrite, so the retry finishes before it can time out again', isCorrect: false },
      { id: 'exactly-once', text: 'A MERGE gives exactly-once delivery from the API, so the orchestrator can stop retrying', isCorrect: false },
      { id: 'both-versions', text: 'Updated orders have to keep their old version as well, and a MERGE keeps both rows side by side', isCorrect: false },
    ],
    explanation:
      'A MERGE on order_id is idempotent because a second run matches the same keys and updates them to the same values, whichever partitions they sit in.\n' +
      "Overwriting yesterday's partition would drop the updates to older orders; a Sunday dedupe leaves six days of double counts; a truncate loses every order not in last night's extract.",
  },
  {
    id: 'de-idem-7',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_IDEMPOTENT_LOADS,
    course: DE,
    language: CodeLanguage.SQL,
    question: 'Put the steps of an idempotent daily load in order. Two steps do not belong.',
    correctOrder: [
      'Read the source slice for the run_date the orchestrator passes',
      'Transform it into the target\'s rows',
      'Run quality checks on the new rows',
      'In one transaction, delete the target partition for run_date and insert the new rows',
      'Record run_date as loaded',
    ],
    distractorLines: [
      'Compute the date to load from today\'s date inside the job',
      'Append the new rows to the target table',
    ],
    solution: steps([
      'Read the source slice for the run_date the orchestrator passes',
      'Transform it into the target\'s rows',
      'Run quality checks on the new rows',
      'In one transaction, delete the target partition for run_date and insert the new rows',
      'Record run_date as loaded',
    ]),
    explanation:
      'The run is defined by its run_date, checked before it touches the target, and written as one atomic replace of that day, so retries and backfills land in the same state.\n' +
      'A date from the clock sends backfills to the wrong day; an append doubles the day on every retry.',
  },
  {
    id: 'de-idem-8',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_IDEMPOTENT_LOADS,
    course: DE,
    question:
      'The job below runs its two statements in autocommit, with no transaction around them. On 2026-11-02 it is killed just after the DELETE, and the orchestrator retries it 20 minutes later.\n' +
      'A dashboard refreshes every minute in between. How many rows for 2026-11-01 did it see during those 20 minutes?',
    tables: [
      table('fact_orders (before the run)', ['order_id', 'order_date', 'amount'], [
        [101, '2026-11-01', 40],
        [102, '2026-11-01', 25],
        [103, '2026-11-01', 35],
      ]),
    ],
    code:
      "DELETE FROM fact_orders WHERE order_date = '2026-11-01';   -- commits on its own\n" +
      'INSERT INTO fact_orders\n' +
      "SELECT order_id, order_date, amount FROM staging_orders WHERE order_date = '2026-11-01';",
    language: CodeLanguage.SQL,
    answer: '0',
    acceptableAnswers: ['zero', 'none'],
    unit: 'rows',
    tempting: [
      { answer: '3', why: 'Three would be right if the delete and insert were one transaction: a reader then sees the old rows until the new ones commit.' },
      { answer: '6', why: 'Nothing ran twice in those 20 minutes: the killed run only deleted, and the retry had not started.' },
    ],
    explanation:
      'In autocommit the DELETE commits on its own, so for 20 minutes the day is empty and the dashboard shows no revenue for it; the retry then fills it.\n' +
      'The end state is right, but readers saw a hole: the replace has to be one atomic commit (a transaction, or a partition swap).',
  },
  {
    id: 'de-idem-9',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_IDEMPOTENT_LOADS,
    course: DE,
    question:
      'A task replaces the run_date partition of fact_orders, then emails "daily report ready" to 400 people. It times out about once a week after the email has gone, and the orchestrator retries it.\n' +
      'What should change, and why?',
    decisions: [
      { id: 'record', text: 'Log each sent email in a table keyed by run_date; skip sending if it is there', isCorrect: true },
      { id: 'one-txn', text: 'Put the partition replace and the email inside one database transaction', isCorrect: false },
      { id: 'no-retry', text: 'Set the task\'s retries to zero, so that a timeout stops sending the email twice', isCorrect: false },
      { id: 'timeout', text: 'Raise the task\'s timeout from 10 minutes to 60 so it stops timing out', isCorrect: false },
    ],
    reasons: [
      { id: 'side-effect', text: 'The replace is safe to repeat, but a sent email stays sent, so that step needs its own record of having run', isCorrect: true },
      { id: 'rollback', text: 'A database transaction can roll back an email that was already sent if the rest of the task fails afterwards', isCorrect: false },
      { id: 'dedupe-mail', text: 'Mail servers drop identical messages sent within a day, so the second copy is discarded before delivery', isCorrect: false },
      { id: 'success-only', text: 'Retries happen after failures, so once the email step succeeds it is not repeated by the orchestrator', isCorrect: false },
    ],
    explanation:
      'A retry re-runs the whole task. The partition replace ends in the same state, but the email is a side effect outside the table, so it needs its own idempotency key: a row per run_date, checked before sending.\n' +
      'No transaction can take back an email, zero retries turns a timeout into a missing day, and a longer timeout makes the duplicate rarer but still possible.',
  },
  {
    id: 'de-idem-10',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_IDEMPOTENT_LOADS,
    course: DE,
    question:
      'One malformed row in a 2-million-row nightly batch makes the load fail. The orchestrator retries it three times over two hours, every attempt fails the same way, and the day ends up missing.\n' +
      'What should change, and why?',
    decisions: [
      { id: 'quarantine', text: 'Set rows that fail parsing aside in a rejected table, load the rest, and alert', isCorrect: true },
      { id: 'more-retries', text: 'Raise the retry count to ten, with a longer back-off between the attempts', isCorrect: false },
      { id: 'skip-day', text: 'Mark the day as loaded after the third failure so tomorrow\'s run is not held up', isCorrect: false },
      { id: 'per-row', text: 'Wrap each row\'s insert in its own retry loop, so one bad row retries alone', isCorrect: false },
    ],
    reasons: [
      { id: 'deterministic', text: 'Retries help with faults that pass; a malformed row fails the same way on each attempt', isCorrect: true },
      { id: 'backoff', text: 'The row is rejected because the database is busy, and a longer back-off lets it through on a quieter attempt', isCorrect: false },
      { id: 'idempotent-skip', text: 'An idempotent load can mark a day as done safely, since a re-run would write the same rows anyway', isCorrect: false },
      { id: 'per-row-fix', text: 'Retrying row by row isolates the fault, and each row then succeeds once the batch stops getting in its way', isCorrect: false },
    ],
    explanation:
      'Retrying is for faults that may clear (a network blip, a lock timeout); a malformed row is deterministic and fails on every attempt.\n' +
      'Quarantining it (a rejected table or dead-letter queue, keyed by run_date so re-runs do not duplicate it) lets the day load and leaves the row for a person to fix and replay.',
  },
  {
    id: 'de-idem-11',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_IDEMPOTENT_LOADS,
    course: DE,
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
      table('staging_orders', ['order_id', 'order_date', 'amount'], [
        [101, '2026-11-01', 40],
        [102, '2026-11-01', 25],
        [97, '2026-10-31', 15],
      ]),
      table('fact_orders', ['order_id', 'order_date', 'amount'], [
        [95, '2026-10-31', 30],
        [96, '2026-10-31', 20],
      ]),
    ],
    resultTables: [
      table('fact_orders, rows per day', ['order_date', 'before', 'after run 1', 'after run 2'], [
        ['2026-10-31', 2, 3, 4],
        ['2026-11-01', 0, 2, 2],
      ]),
    ],
    explanation:
      'Line 5 inserts every staged row, but line 4 deletes only :run_date. The late 2026-10-31 order is outside the slice the load replaces, so each run appends it again: 3 rows after run 1, 4 after run 2.\n' +
      'The delete and the insert must cover the same slice: add WHERE order_date = :run_date to line 5, and load late rows with their own day (or MERGE them on order_id).',
  },
  {
    id: 'de-idem-12',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_IDEMPOTENT_LOADS,
    course: DE,
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
  },
  {
    id: 'de-idem-13',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_IDEMPOTENT_LOADS,
    course: DE,
    question: 'In two or three sentences: why should a load take the slice it replaces from the run_date it is given, rather than from the clock, and why must the replace be one commit?',
    keyPoints: [
      'A retry, a re-run or a backfill runs the job on a day other than the one it loads',
      'A slice from the clock then replaces the wrong day, while run_date names the right one',
      'If the delete and insert commit separately, readers see the day empty, and a crash between them leaves it empty',
    ],
    modelAnswer:
      'Retries, re-runs and backfills run the job later than the day it loads, so a slice computed from today\'s date replaces the wrong day, while the run_date passed in names the right one. ' +
      'The delete and insert must commit together, or readers see the day empty in between, and a crash between them leaves it empty.',
    explanation: 'The same input must give the same rows in the same place, at any time and in one step: that is what makes a load safe to run again.',
  },
];

// ════════════════════════════════════════════════════════════════════════
// Change Data Capture
// ════════════════════════════════════════════════════════════════════════

const changeDataCapture: Question[] = [
  {
    id: 'de-capture-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_CHANGE_DATA_CAPTURE,
    course: DE,
    question: 'Where does log-based change data capture (CDC) get its changes from?',
    options: [
      { id: 'a', text: 'An updated_at column on each table, queried on a timer for rows changed since the last run', isCorrect: false },
      { id: 'b', text: 'Triggers added to the source tables, which copy each changed row into an audit table', isCorrect: false },
      { id: 'c', text: 'A nightly export of each table, compared row by row with the export of the night before', isCorrect: false },
      { id: 'd', text: 'The database\'s write-ahead log, which records each insert, update and delete in order', isCorrect: true },
    ],
    explanation:
      'Log-based CDC reads the log the database already writes for recovery, so it sees every committed change, deletes included, in order, without querying the tables.\n' +
      'Polling an updated_at column is query-based CDC, triggers are trigger-based CDC, and comparing exports is a snapshot diff: all real methods, each missing something the log has.',
  },
  {
    id: 'de-capture-2',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_CHANGE_DATA_CAPTURE,
    course: DE,
    question:
      'The change events below are applied to customers in lsn order: I inserts a row, U updates the row with that customer_id, D deletes it.\n' +
      'How many rows does customers hold afterwards?',
    tables: [
      table('customers (before)', ['customer_id', 'email'], [
        [1, 'ana@a.io'],
        [2, 'ben@b.io'],
        [3, 'cy@c.io'],
      ]),
      table('cdc_batch', ['lsn', 'op', 'customer_id', 'email'], [
        [41, 'U', 2, 'ben@new.io'],
        [42, 'I', 4, 'di@d.io'],
        [43, 'D', 1, null],
        [44, 'I', 5, 'eve@e.io'],
      ]),
    ],
    answer: '4',
    acceptableAnswers: ['four'],
    unit: 'rows',
    tempting: [
      { answer: '7', why: 'Seven adds every event as a row. An event is an instruction about a row: U changes row 2 in place and D removes row 1.' },
      { answer: '5', why: 'Five ignores the delete. The D event for customer 1 removes that row from the copy.' },
    ],
    explanation:
      'Start with 3 rows: U changes customer 2 in place, the two I events add 4 and 5, and D removes 1, so 3 + 2 - 1 = 4.\n' +
      'A change log is applied, not appended: each event says what happened to one key.',
  },
  {
    id: 'de-capture-3',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_CHANGE_DATA_CAPTURE,
    course: DE,
    question:
      'Query-based CDC copies source rows with updated_at past the mark and upserts them into dw_customers. Customer 3 was deleted at the source on 2026-11-02.\n' +
      'After the poll, how many rows does dw_customers hold?',
    tables: [
      table('src_customers (now)', ['customer_id', 'email', 'updated_at'], [
        [1, 'ana@a.io', '2026-10-15 08:00'],
        [2, 'ben@new.io', '2026-11-02 09:00'],
        [4, 'di@d.io', '2026-11-02 10:00'],
      ]),
      table('dw_customers (before)', ['customer_id', 'email'], [
        [1, 'ana@a.io'],
        [2, 'ben@b.io'],
        [3, 'cy@c.io'],
      ]),
    ],
    code:
      "-- the mark is '2026-11-01 23:00'\n" +
      'upsert into dw_customers on customer_id:\n' +
      "  SELECT customer_id, email FROM src_customers WHERE updated_at > '2026-11-01 23:00'",
    answer: '4',
    acceptableAnswers: ['four'],
    unit: 'rows',
    tempting: [
      { answer: '3', why: 'Three is what the source holds. A deleted row has no updated_at left to find, so the poll never learns customer 3 is gone.' },
      { answer: '2', why: 'The poll adds and updates rows; it removes none, so the copy only grows: 1, 2 and 3 stay and 4 is added.' },
    ],
    explanation:
      'The poll upserts 2 and 4 and leaves 1 and 3 alone, so the copy holds 4 rows, one of them a customer who no longer exists.\n' +
      'A poll can only find rows that are still there; deletes need the change log (or a soft-delete flag the source updates).',
  },
  {
    id: 'de-capture-4',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_CHANGE_DATA_CAPTURE,
    course: DE,
    question:
      'After a connector restart, a file of change events arrives with two updates for customer 7 in the order shown. The job applies each event in file order.\n' +
      'Which email does customer 7 end with?',
    tables: [
      table('cdc_file (in file order)', ['lsn', 'op', 'customer_id', 'email'], [
        [58, 'U', 7, 'kim@new.io'],
        [55, 'U', 7, 'kim@old.io'],
      ]),
    ],
    code: "-- for each row of cdc_file, in file order:\nUPDATE customers SET email = :email WHERE customer_id = :customer_id;",
    language: CodeLanguage.SQL,
    answer: 'kim@old.io',
    tempting: [
      { answer: 'kim@new.io', why: 'That is the right end state, the event with the higher lsn. Applied in file order, the older event (lsn 55) runs last and wins.' },
    ],
    explanation:
      'The newer event (lsn 58) is applied first and the older one (lsn 55) last, so customer 7 ends with the stale email.\n' +
      'Apply events per key in log order (by lsn), or keep only the highest lsn per key in a batch; arrival order is not change order.',
  },
  {
    id: 'de-capture-5',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_CHANGE_DATA_CAPTURE,
    course: DE,
    question:
      'order_status_history is filled by an hourly poll that adds one row per order whose updated_at is past the last poll. Order 88 went paid at 10:05, packed at 10:20 and shipped at 10:50.\n' +
      'How many history rows for order 88 does the 11:00 poll add?',
    tables: [
      table('src_orders (at 11:00)', ['order_id', 'status', 'updated_at'], [
        [88, 'shipped', '2026-11-02 10:50'],
        [89, 'paid', '2026-11-02 10:40'],
        [90, 'paid', '2026-11-02 09:30'],
      ]),
    ],
    code: "-- the 11:00 poll; the last poll ran at 10:00\nINSERT INTO order_status_history\nSELECT order_id, status, updated_at FROM src_orders\nWHERE updated_at > '2026-11-02 10:00';",
    language: CodeLanguage.SQL,
    answer: '1',
    acceptableAnswers: ['one'],
    unit: 'rows',
    tempting: [
      { answer: '3', why: 'Three is what the change log holds: each committed change. The poll sees the row once, as it stands at 11:00.' },
    ],
    explanation:
      'A poll sees the current state of each row, so the three changes inside the hour collapse into one history row: shipped.\n' +
      'For an audit trail of every change, read the change log; polling is enough only when the latest state is all you need.',
  },
  {
    id: 'de-capture-6',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_CHANGE_DATA_CAPTURE,
    course: DE,
    question:
      'Finance needs the warehouse to reflect deleted invoices and to keep every status change of each invoice for audits. The source is a busy OLTP database.\n' +
      'How should changes be captured, and why?',
    decisions: [
      { id: 'log', text: 'Log-based CDC: read the database\'s change log and apply each event', isCorrect: true },
      { id: 'poll', text: 'Query-based CDC: poll on a 5-minute timer for rows with a newer updated_at', isCorrect: false },
      { id: 'full', text: 'A full copy of the invoices table each hour, replacing the warehouse copy', isCorrect: false },
      { id: 'diff', text: 'A nightly export of the table, diffed against the previous night\'s export', isCorrect: false },
    ],
    reasons: [
      { id: 'log-has-all', text: 'The log holds each committed change, deletes and in-between states too, and is read without querying the tables', isCorrect: true },
      { id: 'exactly-once', text: 'Log-based CDC delivers each change to the warehouse exactly once, so the audit trail is free of duplicate rows', isCorrect: false },
      { id: 'locks', text: 'Polling on updated_at locks the invoices table while it runs, which stalls a busy database\'s writes', isCorrect: false },
      { id: 'forever', text: 'The database keeps its log for good, so reading changes can start without a snapshot of the table', isCorrect: false },
    ],
    explanation:
      'Deletes and every intermediate status are exactly what polling and snapshots lose, and the log has both, read without querying the busy tables.\n' +
      'CDC feeds are usually at-least-once (apply them idempotently), logs are kept for days, not forever (start from a snapshot), and a poll is a read, not a lock.',
  },
  {
    id: 'de-capture-7',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_CHANGE_DATA_CAPTURE,
    course: DE,
    question:
      'country_codes has 250 rows, is edited a few times a year, and is read by most reports. The source team offers a CDC feed or a nightly CSV of the full table.\n' +
      'Which should the warehouse use, and why?',
    decisions: [
      { id: 'csv', text: 'Load the nightly CSV in full, replacing the warehouse table', isCorrect: true },
      { id: 'cdc', text: 'Subscribe to the CDC feed and apply each change by key', isCorrect: false },
      { id: 'poll', text: 'Poll the table hourly on updated_at and upsert the changes', isCorrect: false },
      { id: 'once', text: 'Copy the table once and edit it by hand when told of a change', isCorrect: false },
    ],
    reasons: [
      { id: 'cheap', text: 'A 250-row copy is cheap and sees deletes; a CDC feed adds moving parts the reports gain nothing from', isCorrect: true },
      { id: 'cdc-loses', text: 'A CDC feed drops changes made to small tables, since it batches events by size before sending them', isCorrect: false },
      { id: 'history', text: 'A full reload keeps each night\'s copy side by side, which gives reports a history of the codes', isCorrect: false },
      { id: 'lock', text: 'Hourly polling would lock the 250 rows while reports read them, so reports would slow down', isCorrect: false },
    ],
    explanation:
      'CDC pays off when tables are large, change often, or need every change. A tiny table that changes a few times a year is cheaper and simpler to copy in full, and a full copy picks up deletes too.\n' +
      'A hand-maintained copy drifts the first time nobody is told.',
  },
  {
    id: 'de-capture-8',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_CHANGE_DATA_CAPTURE,
    course: DE,
    language: CodeLanguage.SQL,
    question: 'Put the steps of starting CDC on an existing table in order. Two steps do not belong.',
    correctOrder: [
      'Note the change log\'s current position',
      'Take a snapshot of the table',
      'Load the snapshot into the target',
      'Apply change events from the noted position on, by key in log order',
    ],
    distractorLines: [
      'Start reading the change log from wherever it is once the snapshot finishes',
      'Append each change event to the target as a new row',
    ],
    solution: steps([
      'Note the change log\'s current position',
      'Take a snapshot of the table',
      'Load the snapshot into the target',
      'Apply change events from the noted position on, by key in log order',
    ]),
    explanation:
      'Noting the position before the snapshot means every change made during the snapshot is replayed afterwards; applied by key, a change the snapshot already holds is simply written again.\n' +
      'Starting the log after the snapshot leaves a gap, and appending events turns updates and deletes into extra rows.',
  },
  {
    id: 'de-capture-9',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_CHANGE_DATA_CAPTURE,
    course: DE,
    question:
      'A connector snapshots customers from 09:00 to 09:10, copying customer 5 at 09:02. It then starts reading the change log at the position it is at when the snapshot ends, 09:10.\n' +
      'Customer 5 changed email at 09:04 and has not changed since. Which email does the warehouse hold for customer 5?',
    tables: [
      table('snapshot_rows', ['customer_id', 'email', 'copied_at'], [
        [5, 'max@old.io', '2026-11-02 09:02'],
        [6, 'ola@o.io', '2026-11-02 09:03'],
      ]),
      table('change_log', ['lsn', 'committed_at', 'op', 'customer_id', 'email'], [
        [310, '2026-11-02 09:04', 'U', 5, 'max@new.io'],
        [322, '2026-11-02 09:12', 'U', 6, 'ola@new.io'],
      ]),
    ],
    answer: 'max@old.io',
    tempting: [
      { answer: 'max@new.io', why: 'That is the source\'s value. The snapshot copied customer 5 before the change, and the log is read only from 09:10 on, so the 09:04 change is in neither.' },
    ],
    explanation:
      'The 09:04 change falls in the gap: after the snapshot copied customer 5, before the log position the connector starts from. The warehouse keeps max@old.io, silently, until customer 5 changes again.\n' +
      'Note the log position before the snapshot starts, then replay from it; replaying a change the snapshot already has is harmless when events are applied by key.',
  },
  {
    id: 'de-capture-10',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_CHANGE_DATA_CAPTURE,
    course: DE,
    question:
      'Customers deleted at the source come back in the warehouse after the next batch is applied.\n' +
      'Click the line that causes it.',
    language: CodeLanguage.SQL,
    lines: [
      '-- apply one batch of change events (op = I, U or D) to customers',
      'CREATE TEMP TABLE latest AS',
      '  SELECT *, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY lsn DESC) AS rn',
      '  FROM cdc_batch;',
      'DELETE FROM customers WHERE customer_id IN (SELECT customer_id FROM latest WHERE rn = 1);',
      'INSERT INTO customers (customer_id, email)',
      'SELECT customer_id, email FROM latest WHERE rn = 1;',
    ],
    flawLines: [7],
    explanation:
      'Line 5 removes every key in the batch, and line 7 writes back the latest event for each one, including keys whose latest event is a delete. A deleted customer is re-inserted (with a NULL email).\n' +
      'Add AND op <> \'D\' to line 7, so a key whose last event is a delete stays deleted.',
  },
  {
    id: 'de-capture-11',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_CHANGE_DATA_CAPTURE,
    course: DE,
    question:
      'After a connector restart re-sends a few minutes of events, some customers\' emails go back to an older value.\n' +
      'Click the line that causes it.',
    language: CodeLanguage.SQL,
    lines: [
      '-- keep the newest event per customer in the batch, then apply it',
      'WITH latest AS (',
      '  SELECT *, ROW_NUMBER() OVER (',
      '    PARTITION BY customer_id ORDER BY received_at DESC) AS rn',
      '  FROM cdc_batch)',
      'SELECT customer_id, op, email FROM latest WHERE rn = 1;',
    ],
    flawLines: [4],
    note: 'received_at is when the warehouse received the event; lsn is its position in the source\'s log.',
    explanation:
      'Line 4 ranks events by when they arrived. A re-sent old event arrives after the newer one, so it is kept as "newest" and the email goes back.\n' +
      'Rank by lsn, the source\'s commit order: ORDER BY lsn DESC.',
  },
  {
    id: 'de-capture-12',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_CHANGE_DATA_CAPTURE,
    course: DE,
    question: 'In two or three sentences: which changes does query-based CDC (polling updated_at) miss that log-based CDC catches, and why?',
    keyPoints: [
      'Deletes: a deleted row is gone, so no query can find it',
      'Changes between polls: several updates collapse into the state at poll time',
      'The log records each committed change, so it has both',
    ],
    modelAnswer:
      'A poll can only see rows that still exist, so deletes are invisible, and it sees each row as it stands at poll time, so several updates between polls collapse into one. ' +
      'The database log records every committed change, deletes and intermediate states included, so log-based CDC catches both.',
    explanation: 'Polling answers "what does the row look like now"; the log answers "what happened to it".',
  },
  {
    id: 'de-capture-13',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_CHANGE_DATA_CAPTURE,
    course: DE,
    question: 'In two or three sentences: why must change events be applied per key in log order, and what goes wrong if a batch is simply inserted as rows?',
    keyPoints: [
      'Each event changes one key, and the last event in log order is that key\'s current state',
      'Out of order, an older event can overwrite a newer one',
      'Inserted as rows, updates become duplicates and deletes become extra rows instead of removals',
    ],
    modelAnswer:
      'Each event describes one change to one key, and the key\'s current state is its last event in log order, so applying them out of order lets an older value overwrite a newer one. ' +
      'Inserting events as rows turns every update into a duplicate and every delete into one more row, instead of a change or a removal.',
    explanation: 'A change log is a list of instructions; the target is what you get by following them in order.',
  },
];

// ════════════════════════════════════════════════════════════════════════
// Deduplication & Late-Arriving Data
// ════════════════════════════════════════════════════════════════════════

const dedupLateData: Question[] = [
  {
    id: 'de-dedup-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_DEDUP_LATE_DATA,
    course: DE,
    question: 'In a daily batch pipeline, a record is "late-arriving" when...',
    options: [
      { id: 'a', text: 'it reaches the pipeline after the load for the day it belongs to has already run', isCorrect: true },
      { id: 'b', text: 'its event time is later than its processing time, because the device clock runs fast', isCorrect: false },
      { id: 'c', text: 'it is a second copy of a record already loaded, sent again after a consumer retry', isCorrect: false },
      { id: 'd', text: 'it sits in staging because the load window closed before the job could reach it', isCorrect: false },
    ],
    explanation:
      'Late means the record belongs to a day whose load has already run: it happened on 11-01 but arrived on 11-02, so 11-01 has to be reopened to count it.\n' +
      'A record that is late has an event time earlier than its processing time, not later; a redelivered copy is a duplicate; a backlog in staging is a capacity problem.',
  },
  {
    id: 'de-dedup-2',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_DEDUP_LATE_DATA,
    course: DE,
    question:
      'A consumer restart redelivered two payments, which were staged again with a new ingested_at. The query below tries to remove the duplicates.\n' +
      'What total does it return?',
    tables: [
      table('stg_payments', ['payment_id', 'amount', 'ingested_at'], [
        [1, 20, '2026-11-02 02:00'],
        [2, 35, '2026-11-02 02:00'],
        [2, 35, '2026-11-02 02:07'],
        [3, 15, '2026-11-02 02:00'],
        [3, 15, '2026-11-02 02:07'],
      ]),
    ],
    code: 'SELECT SUM(amount)\nFROM (SELECT DISTINCT payment_id, amount, ingested_at\n      FROM stg_payments) AS d;',
    language: CodeLanguage.SQL,
    answer: '120',
    tempting: [
      { answer: '70', why: 'Seventy is the true total, one row per payment. The copies differ in ingested_at, so DISTINCT treats them as different rows and keeps both.' },
    ],
    explanation:
      'DISTINCT removes rows that are identical in every selected column, and a redelivered row carries a new ingested_at, so all 5 rows survive: 20 + 35 + 35 + 15 + 15 = 120.\n' +
      'Deduplicate on the business key (payment_id), keeping one row per key.',
  },
  {
    id: 'de-dedup-3',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_DEDUP_LATE_DATA,
    course: DE,
    question:
      'Staging holds three versions of order 7; the last row is an old message redelivered after a restart. The query keeps one row per order.\n' +
      'Which status does it keep for order 7?',
    tables: [
      table('stg_orders', ['order_id', 'status', 'updated_at', 'ingested_at'], [
        [7, 'paid', '2026-11-01 10:00', '2026-11-01 10:05'],
        [7, 'shipped', '2026-11-01 15:00', '2026-11-01 15:02'],
        [7, 'paid', '2026-11-01 10:00', '2026-11-01 16:30'],
      ]),
    ],
    code:
      'SELECT order_id, status FROM (\n' +
      '  SELECT *, ROW_NUMBER() OVER (\n' +
      '    PARTITION BY order_id ORDER BY updated_at DESC) AS rn\n' +
      '  FROM stg_orders) AS s\n' +
      'WHERE rn = 1;',
    language: CodeLanguage.SQL,
    answer: 'shipped',
    tempting: [
      { answer: 'paid', why: '"paid" is the row that arrived last, but the query ranks by updated_at, the time of the change, where shipped (15:00) is newest.' },
    ],
    explanation:
      'Ranking by updated_at puts the 15:00 version first, so order 7 keeps "shipped", although an older "paid" message arrived after it.\n' +
      'Pick the current version by when the change happened, never by when the row reached you.',
  },
  {
    id: 'de-dedup-4',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_DEDUP_LATE_DATA,
    course: DE,
    question:
      'Each batch_date is one nightly load; event 4 happened on 2026-11-01 but arrived with the 11-02 batch. The report below builds daily revenue.\n' +
      'What revenue does it show for 2026-11-01?',
    tables: [
      table('events', ['event_id', 'event_date', 'batch_date', 'amount'], [
        [1, '2026-11-01', '2026-11-01', 10],
        [2, '2026-11-01', '2026-11-01', 20],
        [3, '2026-11-02', '2026-11-02', 5],
        [4, '2026-11-01', '2026-11-02', 40],
      ]),
    ],
    code: 'SELECT batch_date AS sale_date, SUM(amount) AS revenue\nFROM events\nGROUP BY batch_date;',
    language: CodeLanguage.SQL,
    answer: '30',
    tempting: [
      { answer: '70', why: 'Seventy is the true revenue of 11-01, by event date. The report groups by batch_date, so event 4 is counted on 11-02.' },
      { answer: '45', why: 'Forty-five is the 11-02 row of this report: 5 plus the late 40, counted on the day it arrived.' },
    ],
    explanation:
      'Grouping by the load\'s date counts the late event on the day it arrived: 11-01 shows 30 and 11-02 shows 45, where the truth is 70 and 5.\n' +
      'Aggregate by event date, and accept that a late row changes a day already reported.',
  },
  {
    id: 'de-dedup-5',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_DEDUP_LATE_DATA,
    course: DE,
    question:
      'The 11-02 run loaded a late 2026-11-01 sale (25) into fact_sales under its own date. Then it rebuilt daily_summary with the job below, :run_date = \'2026-11-02\'.\n' +
      'What total does daily_summary show for 2026-11-01 afterwards?',
    tables: [
      table('fact_sales (after the 11-02 load)', ['sale_id', 'sale_date', 'amount'], [
        [1, '2026-11-01', 12],
        [2, '2026-11-01', 18],
        [3, '2026-11-02', 9],
        [4, '2026-11-01', 25],
      ]),
      table('daily_summary (before the job)', ['sale_date', 'total'], [['2026-11-01', 30]]),
    ],
    code:
      'DELETE FROM daily_summary WHERE sale_date = :run_date;\n' +
      'INSERT INTO daily_summary\n' +
      'SELECT sale_date, SUM(amount) FROM fact_sales\n' +
      'WHERE sale_date = :run_date\n' +
      'GROUP BY sale_date;',
    language: CodeLanguage.SQL,
    answer: '30',
    tempting: [
      { answer: '55', why: 'Fifty-five is what fact_sales now says for 11-01. The job rebuilds only :run_date, so the 11-01 summary row is never recomputed.' },
    ],
    explanation:
      'The fact table is right (12 + 18 + 25 = 55), but the summary job rebuilds only 11-02, so 11-01 keeps the 30 it was given yesterday.\n' +
      'Rebuild every day the batch touched (the distinct event dates in it), not only the run\'s own date.',
  },
  {
    id: 'de-dedup-6',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_DEDUP_LATE_DATA,
    course: DE,
    question:
      'The order feed redelivers messages after consumer restarts, sometimes hours later, so staging can hold several rows per order_id, with old versions arriving after new ones.\n' +
      'fact_orders must hold each order\'s current state. How should staging be deduplicated, and why?',
    decisions: [
      { id: 'updated', text: 'One row per order_id: the one with the highest updated_at', isCorrect: true },
      { id: 'ingested', text: 'One row per order_id: the one with the latest ingested_at', isCorrect: false },
      { id: 'distinct', text: 'SELECT DISTINCT over the staged columns of the batch', isCorrect: false },
      { id: 'first', text: 'One row per order_id: the first one that arrived, others dropped', isCorrect: false },
    ],
    reasons: [
      { id: 'change-time', text: 'Redelivery can land an old version after a new one, so the change time says which is current', isCorrect: true },
      { id: 'in-order', text: 'The feed sends changes in order, so the most recent arrival is the source\'s latest state of the order', isCorrect: false },
      { id: 'exact-copy', text: 'A redelivered message is an exact copy of the first, so removing identical rows leaves one per order', isCorrect: false },
      { id: 'final', text: 'Orders rarely change after they are placed, so the first version is usually the final one as well', isCorrect: false },
    ],
    explanation:
      'With redelivery, arrival order and change order differ, so the version to keep is the one with the latest change time (or source version number).\n' +
      'Redelivered rows differ in their ingestion columns, so DISTINCT keeps them, and keeping the first arrival freezes every order in its first state.',
  },
  {
    id: 'de-dedup-7',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_DEDUP_LATE_DATA,
    course: DE,
    language: CodeLanguage.SQL,
    question: 'Put the steps of a nightly load that handles duplicates and late rows in order. Two steps do not belong.',
    correctOrder: [
      'Land the batch in staging',
      'Keep one row per order_id: the one with the highest updated_at',
      'Collect the event dates the batch touches',
      'Replace those dates\' rows in the fact table',
      'Rebuild the daily totals for those dates',
    ],
    distractorLines: [
      'Keep the row that arrived last in staging for each order_id',
      'Rebuild the daily total for the run\'s own date only',
    ],
    solution: steps([
      'Land the batch in staging',
      'Keep one row per order_id: the one with the highest updated_at',
      'Collect the event dates the batch touches',
      'Replace those dates\' rows in the fact table',
      'Rebuild the daily totals for those dates',
    ]),
    explanation:
      'Dedupe on the key by change time, then let the batch say which days it reopened, and rebuild exactly those days in the fact table and the totals built on it.\n' +
      'Arrival order picks stale versions after a redelivery, and rebuilding only the run\'s date leaves the late rows out of their day\'s total.',
  },
  {
    id: 'de-dedup-8',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_DEDUP_LATE_DATA,
    course: DE,
    question:
      'Mobile app events can arrive up to 3 days after they happen (phones sync when back online). fact_events is partitioned by event date, and the revenue dashboard must show yesterday by 07:00.\n' +
      'How should the nightly job handle late events, and why?',
    decisions: [
      { id: 'window', text: 'Each night, rebuild the last 3 event days from raw events, replacing those partitions', isCorrect: true },
      { id: 'yesterday', text: 'Each night, load whatever arrived into yesterday\'s partition, whatever its event date', isCorrect: false },
      { id: 'drop', text: 'Drop events that arrive after their event day was loaded, and log how many were dropped', isCorrect: false },
      { id: 'hold', text: 'Hold each day off the dashboard until 3 days have passed, then load it once', isCorrect: false },
    ],
    reasons: [
      { id: 'reopen', text: 'Late rows reopen their own days; a replaced 3-day window fixes them, re-runs safely and still publishes yesterday', isCorrect: true },
      { id: 'never-late', text: 'With a 3-day window, an event that turns up a week late still lands in its own day on the next run', isCorrect: false },
      { id: 'speed', text: 'Replacing a partition is faster than inserting a few late rows, so the job finishes before 07:00', isCorrect: false },
      { id: 'arrival', text: 'The dashboard counts events by the day they reach the warehouse, so recent partitions are the ones it reads', isCorrect: false },
    ],
    explanation:
      'A rolling replace of the last 3 event days puts every late event in its own day, keeps yesterday on time (it is rebuilt again on the next two nights), and stays idempotent.\n' +
      'Loading into yesterday miscounts both days, dropping loses revenue, and holding days back misses the 07:00 deadline. Events later than the window still need a backfill or an alert.',
  },
  {
    id: 'de-dedup-9',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_DEDUP_LATE_DATA,
    course: DE,
    question:
      'After this load, fact_orders holds two rows for some orders, one "paid" and one "shipped".\n' +
      'Click the line that causes it.',
    language: CodeLanguage.SQL,
    lines: [
      '-- keep the current version of each staged order, then replace those orders',
      'DELETE FROM fact_orders WHERE order_id IN (SELECT order_id FROM stg_orders);',
      'INSERT INTO fact_orders',
      'SELECT order_id, status, amount FROM (',
      '  SELECT *, ROW_NUMBER() OVER (',
      '    PARTITION BY order_id, status ORDER BY updated_at DESC) AS rn',
      '  FROM stg_orders) AS s',
      'WHERE rn = 1;',
    ],
    flawLines: [6],
    explanation:
      'Line 6 partitions by order_id and status, so each status of an order gets its own "rn = 1": an order staged as paid and then shipped keeps both rows.\n' +
      'Partition by the business key alone (PARTITION BY order_id), so exactly one version per order survives.',
  },
  {
    id: 'de-dedup-10',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_DEDUP_LATE_DATA,
    course: DE,
    question:
      'Whenever the app syncs phones overnight, Monday\'s revenue reads low and Tuesday\'s reads high, although the right days are rebuilt.\n' +
      'Click a line that causes it.',
    language: CodeLanguage.SQL,
    lines: [
      '-- nightly: rebuild daily revenue for the days this batch touched',
      'DELETE FROM daily_revenue WHERE day IN (SELECT DISTINCT event_date FROM batch);',
      'INSERT INTO daily_revenue',
      'SELECT CAST(ingested_at AS DATE) AS day, SUM(amount)',
      'FROM fact_events',
      'WHERE event_date IN (SELECT DISTINCT event_date FROM batch)',
      'GROUP BY CAST(ingested_at AS DATE);',
    ],
    flawLines: [4, 7],
    explanation:
      'Lines 4 and 7 group by the day each event was ingested, so a Monday event synced on Tuesday is summed into Tuesday, although line 2 deleted the right days.\n' +
      'Group by event_date, the day the event happened.',
  },
  {
    id: 'de-dedup-11',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_DEDUP_LATE_DATA,
    course: DE,
    question: 'In two or three sentences: when deduplicating, why must "the latest row" be chosen by change time (or a version number), not by arrival time?',
    keyPoints: [
      'Retries and redeliveries can bring an old version in after a newer one',
      'So arrival order differs from the order the changes happened',
      'Change time or a source version number says which version is current',
    ],
    modelAnswer:
      'Retries and redeliveries can deliver an old version of a row after a newer one, so the order rows arrive in is not the order the changes happened. ' +
      'Only the change time, or a version number from the source, says which version is current.',
    explanation: 'Arrival time describes the pipeline; change time describes the data.',
  },
  {
    id: 'de-dedup-12',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_DEDUP_LATE_DATA,
    course: DE,
    question: 'In two or three sentences: why does late-arriving data mean a daily pipeline must reprocess more than the day it runs for? What decides how far back?',
    keyPoints: [
      'A late row belongs to an earlier day, so that day\'s rows and totals change',
      'The run has to rebuild every day its batch touches, or a fixed window of recent days',
      'The window is set by how late data can arrive; later rows need a backfill or an alert',
    ],
    modelAnswer:
      'A late row belongs to a day that was already loaded, so that day\'s rows and every total built on them change when it arrives. ' +
      'Each run therefore rebuilds the days its batch touches, or a fixed window of recent days sized to how late data can arrive, and anything later than the window needs a backfill or an alert.',
    explanation: 'A daily run is defined by the data it received, not by the date on the calendar.',
  },
];

// ════════════════════════════════════════════════════════════════════════
// Backfills & Reprocessing
// ════════════════════════════════════════════════════════════════════════

const backfills: Question[] = [
  {
    id: 'de-backfill-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_BACKFILLS,
    course: DE,
    question: 'In a batch pipeline, what is a backfill?',
    options: [
      { id: 'a', text: 'Copying the latest day\'s output into the empty days before it, so charts show each day', isCorrect: false },
      { id: 'b', text: 'Running the pipeline\'s normal job for past dates, each run loading the date it is given', isCorrect: true },
      { id: 'c', text: 'Re-running the failed tasks of last night\'s run, starting from the step where it stopped', isCorrect: false },
      { id: 'd', text: 'Restoring the target table from a backup, then replaying the days changed since the copy', isCorrect: false },
    ],
    explanation:
      'A backfill runs the same daily job once per past run_date: to fill days that were missed, or to rebuild days after the logic was fixed.\n' +
      'Filling gaps with copied values invents data, resuming last night\'s failed tasks is a retry, and restoring a backup brings back the old (wrong) rows.',
  },
  {
    id: 'de-backfill-2',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_BACKFILLS,
    course: DE,
    question:
      'The daily job below replaces one day of fact_orders from the kept raw rows. 2026-11-02 was loaded wrongly and 2026-11-03 failed, so a backfill runs the job for those two dates.\n' +
      'How many rows does fact_orders hold afterwards?',
    tables: [
      table('raw_orders', ['order_id', 'order_date', 'amount'], [
        [1, '2026-11-01', 40],
        [2, '2026-11-01', 25],
        [3, '2026-11-01', 35],
        [4, '2026-11-02', 50],
        [5, '2026-11-02', 20],
        [6, '2026-11-03', 15],
        [7, '2026-11-03', 30],
        [8, '2026-11-03', 45],
        [9, '2026-11-03', 10],
      ]),
      table('fact_orders (before)', ['order_id', 'order_date', 'amount'], [
        [1, '2026-11-01', 40],
        [2, '2026-11-01', 25],
        [3, '2026-11-01', 35],
        [4, '2026-11-02', 500],
        [5, '2026-11-02', 200],
      ]),
    ],
    code:
      '-- run once for :run_date = 2026-11-02, then 2026-11-03\n' +
      'BEGIN;\n' +
      'DELETE FROM fact_orders WHERE order_date = :run_date;\n' +
      'INSERT INTO fact_orders\n' +
      'SELECT order_id, order_date, amount FROM raw_orders WHERE order_date = :run_date;\n' +
      'COMMIT;',
    language: CodeLanguage.SQL,
    answer: '9',
    acceptableAnswers: ['nine'],
    unit: 'rows',
    tempting: [
      { answer: '11', why: 'Eleven keeps 11-02\'s two wrong rows beside the new ones. Each run deletes its day before inserting.' },
      { answer: '6', why: 'Six counts only the backfilled days. 2026-11-01 is outside the backfill and keeps its 3 rows.' },
    ],
    explanation:
      'The backfill replaces 11-02 (2 rows, now right) and fills 11-03 (4 rows), and leaves 11-01 alone: 3 + 2 + 4 = 9.\n' +
      'A backfill is only this simple because the daily job replaces exactly its own day.',
  },
  {
    id: 'de-backfill-3',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_BACKFILLS,
    course: DE,
    question:
      'raw_events keeps 30 days: on 2026-11-20 it holds events from 2026-10-21 through 2026-11-19. That day you find a bug that has written wrong totals for every day from 2026-10-01 through 2026-11-19.\n' +
      'How many of the affected days cannot be rebuilt from raw_events?',
    answer: '20',
    acceptableAnswers: ['twenty'],
    unit: 'days',
    tempting: [
      { answer: '50', why: 'Fifty is every affected day. The 30 days still in raw_events (10-21 to 11-19) can be rebuilt.' },
      { answer: '30', why: 'Thirty is the number that can be rebuilt, the days still kept. The question asks for the ones already gone.' },
      { answer: '19', why: 'October 1 to October 20 is 20 days, counting both ends.' },
    ],
    explanation:
      'The bug touched 50 days (31 in October up to 11-19); raw data is kept for the last 30 of them, so 2026-10-01 to 10-20, 20 days, can only be fixed from another source, if one exists.\n' +
      'Retention of raw data sets how far back a fix can reach: decide it before you need it.',
  },
  {
    id: 'de-backfill-4',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_BACKFILLS,
    course: DE,
    question:
      'A bug counted refunds as sales. A backfill re-runs the fixed daily job for 2026-11-01 to 11-03, replacing each day of fact_sales from raw_sales. monthly_summary was built by a separate monthly job after 2026-11-01 to 11-03 were loaded, so it was built from the wrong rows, and the backfill does not re-run it.\n' +
      'After the backfill, how much higher is monthly_summary\'s November total than the November sum of fact_sales?',
    tables: [
      table('raw_sales (fixed job keeps sales only)', ['sale_date', 'kind', 'amount'], [
        ['2026-11-01', 'sale', 100],
        ['2026-11-01', 'refund', 20],
        ['2026-11-02', 'sale', 120],
        ['2026-11-02', 'refund', 20],
        ['2026-11-03', 'sale', 80],
        ['2026-11-03', 'refund', 20],
      ]),
      table('monthly_summary', ['month', 'total'], [['2026-11', 360]]),
    ],
    code:
      'backfill: for run_date in 2026-11-01 .. 2026-11-03:\n' +
      "  replace fact_sales for run_date with SUM(amount) of raw_sales WHERE kind = 'sale'",
    answer: '60',
    tempting: [
      { answer: '0', why: 'Zero assumes the backfill rebuilt the summary too. It re-ran only the daily job; the summary keeps the 360 it was built with.' },
      { answer: '360', why: '360 is the summary\'s total itself; the question asks how far it is from the fixed facts.' },
    ],
    explanation:
      'After the backfill fact_sales sums to 100 + 120 + 80 = 300, while monthly_summary still says 360 (sales plus refunds), so it is 60 too high.\n' +
      'A backfill has to rebuild everything downstream of what it changed, for the same dates, in dependency order.',
  },
  {
    id: 'de-backfill-5',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_BACKFILLS,
    course: DE,
    question:
      'A currency bug wrote wrong amounts into two years of fact_orders. The daily job is now fixed, replaces one run_date per run, and the raw orders for all two years are kept.\n' +
      'How should history be repaired, and why?',
    decisions: [
      { id: 'backfill', text: 'Backfill: run the fixed daily job once per affected run_date', isCorrect: true },
      { id: 'update', text: 'One UPDATE over fact_orders that multiplies amounts by a factor', isCorrect: false },
      { id: 'forward', text: 'Leave history as it is and let the fixed job correct the future', isCorrect: false },
      { id: 'reload', text: 'Truncate fact_orders and reload two years in one large job', isCorrect: false },
    ],
    reasons: [
      { id: 'same-code', text: 'It reuses the tested job, one day at a time, so the work can resume, run in parallel and be checked per day', isCorrect: true },
      { id: 'update-size', text: 'An UPDATE is limited to a few million rows per statement, so two years of rows are too many for it', isCorrect: false },
      { id: 'faster', text: 'Many small runs finish sooner than one big statement, since the warehouse caches each day\'s files', isCorrect: false },
      { id: 'history', text: 'Running day by day keeps the old wrong rows next to the corrected ones, so reports can compare the two', isCorrect: false },
    ],
    explanation:
      'The fixed daily job is the code you trust, and it already replaces exactly one day, so running it for each affected day rebuilds history with the same logic, in pieces you can retry, parallelise and verify.\n' +
      'A hand-written UPDATE is new, untested logic over everything at once; a two-year reload is one huge step that fails as a whole.',
  },
  {
    id: 'de-backfill-6',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_BACKFILLS,
    course: DE,
    language: CodeLanguage.SQL,
    question: 'Put the steps of a backfill after a logic fix in order. Two steps do not belong.',
    correctOrder: [
      'Fix the transform and deploy it',
      'List the affected run_dates, from the bug\'s first day to yesterday',
      'Run the daily job once per run_date, each replacing only its own day',
      'Rebuild the downstream tables for the same dates, in dependency order',
      'Compare each day\'s row count and total with the raw data',
    ],
    distractorLines: [
      'Run one UPDATE over all past rows with the corrected formula',
      'Load every affected day into today\'s partition, then split it by date',
    ],
    solution: steps([
      'Fix the transform and deploy it',
      'List the affected run_dates, from the bug\'s first day to yesterday',
      'Run the daily job once per run_date, each replacing only its own day',
      'Rebuild the downstream tables for the same dates, in dependency order',
      'Compare each day\'s row count and total with the raw data',
    ]),
    explanation:
      'A backfill is the normal job, fixed first, run over a list of past dates, then carried through every table built from them and checked day by day.\n' +
      'A one-off UPDATE bypasses the tested job, and loading past days into today\'s partition breaks the one-run-one-day rule that makes re-runs safe.',
  },
  {
    id: 'de-backfill-7',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_BACKFILLS,
    course: DE,
    question:
      'Each run computes a day\'s closing balance as the previous day\'s closing balance plus the day\'s net, reading the previous day as it is when the run starts.\n' +
      'A backfill re-runs 2026-11-02 and 2026-11-03 with corrected nets, in parallel: both runs start at the same moment. What closing balance does 2026-11-03 end with?',
    tables: [
      table('closing_balance (before)', ['day', 'balance'], [
        ['2026-11-01', 100],
        ['2026-11-02', 130],
        ['2026-11-03', 150],
      ]),
      table('corrected_net', ['day', 'net'], [
        ['2026-11-02', 10],
        ['2026-11-03', 5],
      ]),
    ],
    code: 'balance(run_date) = balance(run_date - 1 day) + net(run_date)',
    answer: '135',
    tempting: [
      { answer: '115', why: '115 is the right balance, which running 11-02 before 11-03 gives. In parallel, 11-03 reads the old 130 for 11-02.' },
      { answer: '155', why: '155 adds the net to 11-03\'s own old balance. The run reads the previous day, 11-02.' },
    ],
    explanation:
      '11-02 becomes 100 + 10 = 110, but 11-03 started at the same moment and read the old 130, so it ends at 130 + 5 = 135 instead of 115.\n' +
      'A day that depends on the day before must be backfilled in date order; only days that read just their own inputs can run in parallel.',
  },
  {
    id: 'de-backfill-8',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_BACKFILLS,
    course: DE,
    question:
      'A 90-day backfill of fact_orders will take about 6 hours. Tonight\'s scheduled run, for yesterday, starts at 02:00 in the middle of it, and both write fact_orders. Each run replaces the partition for its own run_date.\n' +
      'What should happen to tonight\'s run, and why?',
    decisions: [
      { id: 'both', text: 'Let tonight\'s run go ahead while the backfill continues', isCorrect: true },
      { id: 'pause', text: 'Pause the schedule until the backfill has finished', isCorrect: false },
      { id: 'one-txn', text: 'Run the backfill as one transaction so tonight\'s run waits', isCorrect: false },
      { id: 'skip', text: 'Skip tonight\'s run and add yesterday to the backfill list', isCorrect: false },
    ],
    reasons: [
      { id: 'disjoint', text: 'Each run replaces its own run_date partition alone, so the two jobs write different rows', isCorrect: true },
      { id: 'queue', text: 'The warehouse queues writes to one table, so the two jobs end up running one after the other', isCorrect: false },
      { id: 'newest', text: 'The newest run wins a conflict, so tonight\'s rows overwrite whatever the backfill wrote', isCorrect: false },
      { id: 'cheap', text: 'Running both at once halves the warehouse cost, since they share the same file scans', isCorrect: false },
    ],
    explanation:
      'Runs that each replace a different partition do not touch each other\'s rows, so tonight\'s run can go ahead and yesterday is published on time.\n' +
      'Pausing or skipping delays fresh data for no gain, and one 90-day transaction would hold locks and fail as a whole. (A job that reads the day before, like a running balance, is different.)',
  },
  {
    id: 'de-backfill-9',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_BACKFILLS,
    course: DE,
    question:
      'The October backfill below ran on 2026-11-20. That night, the regular job took six hours and reloaded every day from November 1 onward.\n' +
      'Click the line that causes it.',
    language: CodeLanguage.SQL,
    lines: [
      '-- backfill driver: re-load October with the fixed transform',
      "DECLARE @d DATE = '2026-10-01';",
      "WHILE @d <= '2026-10-31'",
      'BEGIN',
      '  EXEC load_orders_day @run_date = @d;   -- replaces that day in fact_orders',
      "  UPDATE load_state SET last_loaded = @d WHERE tbl = 'orders';",
      '  SET @d = DATEADD(day, 1, @d);',
      'END;',
    ],
    flawLines: [6],
    note: 'The regular nightly job loads every day after load_state.last_loaded, up to yesterday.',
    explanation:
      'Line 6 moves the regular job\'s mark back to 2026-10-31, so its next run believes November was never loaded and reloads 19 days.\n' +
      'A backfill rebuilds past days without touching the live job\'s state; its progress belongs in its own record, if it needs one.',
  },
  {
    id: 'de-backfill-10',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_BACKFILLS,
    course: DE,
    question:
      'After this backfill, fact_orders holds the fixed rows for October, but daily_summary still shows the old wrong totals.\n' +
      'Click a line that causes it.',
    lines: [
      'backfill run_dates 2026-10-01 .. 2026-10-31, each run_date as one task:',
      '  step 1: rebuild daily_summary for run_date from fact_orders',
      '  step 2: rebuild fact_orders for run_date from raw_orders',
      '  step 3: check fact_orders rows for run_date = raw_orders rows for run_date',
    ],
    flawLines: [2, 3],
    explanation:
      'The summary is rebuilt (step 1) before the facts it reads are fixed (step 2), so it is recomputed from the old wrong rows.\n' +
      'Rebuild in dependency order: the fact table for the date first, then everything built from it.',
  },
  {
    id: 'de-backfill-11',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_BACKFILLS,
    course: DE,
    question: 'In two or three sentences: why should a backfill re-run the normal daily job for each date, instead of a one-off script that fixes history?',
    keyPoints: [
      'The daily job is the tested logic, so history is rebuilt exactly as new days are built',
      'Each run replaces one day, so the backfill can stop, resume, run in parallel and be re-run safely',
      'Each day can be checked on its own',
    ],
    modelAnswer:
      'The daily job is the logic that is tested and runs every night, so re-running it rebuilds history exactly the way new days are built, while a one-off script is new code run once over everything. ' +
      'Because each run replaces one day, the backfill can be stopped, resumed, parallelised and repeated safely, and each day checked on its own.',
    explanation: 'An idempotent daily job turns a history repair into a list of dates.',
  },
  {
    id: 'de-backfill-12',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_BACKFILLS,
    course: DE,
    question: 'In two or three sentences: what must be true of a daily job for its backfill days to run in parallel, in any order?',
    keyPoints: [
      'Each run reads only the inputs for its own run_date, not the clock',
      'Each run writes only its own run_date slice, replacing it',
      'No run depends on another day\'s output (such as yesterday\'s balance)',
    ],
    modelAnswer:
      'Each run must read only the inputs of its own run_date, never the clock, and write only its own day, replacing it. ' +
      'And no day may depend on another day\'s output, such as a running balance carried from yesterday, or the order of the runs changes the result.',
    explanation: 'Days that share nothing can be computed in any order; a day that reads yesterday has to wait for it.',
  },
];

export const dataEngineeringMovingDataQuestions: Question[] = [
  ...etlEltStaging,
  ...fullVsIncremental,
  ...idempotentLoads,
  ...changeDataCapture,
  ...dedupLateData,
  ...backfills,
];

