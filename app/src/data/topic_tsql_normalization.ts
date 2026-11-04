/**
 * Topic.TSQL_NORMALIZATION - SQL for Data Engineering (T-SQL).
 * Pillar 5 (Data Modeling): normalization vs denormalization tradeoffs for
 * analytics (MCQ-led).
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const tsql_normalization_questions: Question[] = [
  {
    id: 'tsql-norm-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_NORMALIZATION,
    course: Course.SQL,
    question: 'What is the primary goal of normalization in an OLTP (transactional) database?',
    options: [
      { id: 'a', text: 'Store each fact once by splitting data into related tables, so a write changes one place and update anomalies cannot occur.', isCorrect: true },
      { id: 'b', text: 'Copy data into every table that needs it, so that each query can be answered without a join.', isCorrect: false },
      { id: 'c', text: 'Hold each record as one JSON document, so that the schema never has to change.', isCorrect: false },
      { id: 'd', text: 'Put as many columns as possible into each table, so that the total number of tables stays small.', isCorrect: false },
    ],
    explanation: 'Normalization removes redundancy by decomposing tables so each piece of data lives in exactly one place. That protects write integrity: there is no second copy to fall out of sync, so no update/insert/delete anomalies. OLTP systems prize this because they are write-heavy.',
    hints: ['Store each fact once', 'Prevents update anomalies on writes'],
    tags: ['tsql', 'normalization', 'oltp'],
  },
  {
    id: 'tsql-norm-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_NORMALIZATION,
    course: Course.SQL,
    question: 'Why do analytical warehouses deliberately DENORMALIZE dimensions instead of fully normalizing like OLTP?',
    options: [
      { id: 'a', text: 'Warehouses are read-heavy: wide dimensions need fewer joins per query, and the redundancy is safe because loads are controlled.', isCorrect: true },
      { id: 'b', text: 'Warehouse engines cannot run joins, so every query has to be answered from one wide table.', isCorrect: false },
      { id: 'c', text: 'Normalized tables use more disk, and a warehouse always has less storage than an OLTP system.', isCorrect: false },
      { id: 'd', text: 'Denormalized data is automatically more accurate, because repeated values cross-check each other.', isCorrect: false },
    ],
    explanation: 'A warehouse optimizes for reads, not writes. Wide, denormalized dimensions (Category, Department all on DimProduct) mean fewer joins per analytical query - simpler SQL and better performance. The redundancy that would be dangerous in OLTP is safe here because data is loaded by a controlled ETL process, not edited row by row.',
    hints: ['Warehouses are read-optimized', 'Fewer joins > avoiding redundancy'],
    tags: ['tsql', 'normalization', 'denormalization', 'olap'],
  },
  {
    id: 'tsql-norm-mcq-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_NORMALIZATION,
    course: Course.SQL,
    tables: [{
      name: 'dbo.OrderFlat',
      columns: ['OrderId', 'CustomerId', 'CustomerName'],
      rows: [[1, 7, 'Ann Lee'], [2, 7, 'Ann Lee'], [3, 8, 'Bo Chan']],
    }],
    question: 'The table `dbo.OrderFlat` is keyed by OrderId and also stores CustomerId and CustomerName. CustomerName depends on CustomerId, a non-key column, not on the key. Which normal form does this break, and what is the fix?',
    options: [
      { id: 'a', text: 'Third normal form (a transitive dependency): move CustomerName into a Customer table keyed by CustomerId.', isCorrect: true },
      { id: 'b', text: 'Second normal form (a partial dependency): split the table in two by column, keeping a few columns in each.', isCorrect: false },
      { id: 'c', text: 'First normal form, because the same name repeats: replace the repeated names with one list per customer.', isCorrect: false },
      { id: 'd', text: 'No normal form: a name stored beside its CustomerId is always correct, so no change is needed.', isCorrect: false },
    ],
    explanation: 'The key is OrderId, but CustomerName depends on CustomerId, a non-key column. A non-key column that depends on another non-key column is a transitive dependency, which breaks 3NF. (2NF is about depending on only part of a composite key, and OrderId alone is the key; 1NF is about atomic values, which a repeated name still is.) Storing it here means every order for a customer repeats the name, so one change can leave the copies out of step. The fix is to factor CustomerName into its own Customer table keyed by CustomerId. A warehouse might keep the redundancy deliberately, but OLTP normalizes it away.',
    hints: ['Non-key column depending on a non-key column', 'Factor it into its own table keyed by CustomerId'],
    tags: ['tsql', 'normalization', 'third-normal-form'],
  },
  {
    id: 'tsql-norm-mcq-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_NORMALIZATION,
    course: Course.SQL,
    question: 'A team builds a warehouse fact table by copying twenty descriptive customer and product columns directly into every fact row (no dimensions). What is the main downside?',
    options: [
      { id: 'a', text: 'The fact table, already the largest, bloats with repeated text, and changing one attribute means rewriting millions of fact rows.', isCorrect: true },
      { id: 'b', text: 'None: this is the recommended warehouse design, because it removes every join and so is always the fastest.', isCorrect: false },
      { id: 'c', text: 'The fact table will not load, because a fact table cannot hold text columns.', isCorrect: false },
      { id: 'd', text: 'Queries stop working, because GROUP BY cannot use a column that sits in a fact table.', isCorrect: false },
    ],
    explanation: 'Denormalizing dimensions is good; collapsing them INTO the fact is not. The fact has the most rows by far, so repeating wide descriptive columns there multiplies storage and turns a single attribute change into a rewrite of millions of rows. Dimensions hold descriptive data once; the fact holds keys and measures. Denormalize within a dimension, not into the fact.',
    hints: ['Fact has the most rows - redundancy hurts most there', 'Keep descriptive columns in dimensions'],
    tags: ['tsql', 'normalization', 'denormalization', 'dimensional-modeling'],
  },
  {
    id: 'tsql-norm-mcq-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_NORMALIZATION,
    course: Course.SQL,
    question: 'When is a more NORMALIZED (snowflaked) dimension genuinely the better choice in a warehouse?',
    options: [
      { id: 'a', text: 'When a large or fast-changing sub-hierarchy is shared by several dimensions, so normalizing it avoids copying it and gives one place to edit.', isCorrect: true },
      { id: 'b', text: 'Never: fully denormalized star dimensions are strictly better than a snowflake in every case.', isCorrect: false },
      { id: 'c', text: 'Always: a warehouse should mirror its OLTP source and normalize every table to third normal form.', isCorrect: false },
      { id: 'd', text: 'Whenever a dimension is small, because splitting a few rows costs nothing and saves joins.', isCorrect: false },
    ],
    explanation: 'The star/denormalized default has real exceptions: if a sub-dimension is large, rapidly changing, or reused by several dimensions, snowflaking it avoids massive duplication and gives one place to maintain those attributes. It is an engineering trade-off, fewer joins (star) against less redundancy and easier maintenance (snowflake), not a universal rule. Small dimensions gain nothing from it: the split only adds a join.',
    hints: ['Large/volatile/shared sub-hierarchy', 'Trade fewer joins for less duplication'],
    tags: ['tsql', 'normalization', 'snowflake', 'tradeoffs'],
  },
  {
    id: 'tsql-norm-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_NORMALIZATION,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'The customer\'s name is stored on every order row. What single value does the final SELECT return?',
    tables: [{
      name: 'dbo.OrderFlat',
      columns: ['OrderId', 'CustomerId', 'CustomerName'],
      rows: [[1, 7, 'Ann Lee'], [2, 7, 'Ann Lee'], [3, 8, 'Bo Chan']],
    }],
    code: `UPDATE dbo.OrderFlat SET CustomerName = 'Ann Park' WHERE OrderId = 1;
SELECT COUNT(DISTINCT CustomerName) AS NameCount
FROM dbo.OrderFlat
WHERE CustomerId = 7;`,
    expectedOutput: `2`,
    explanation: 'The UPDATE changes one of customer 7\'s two copies of the name, so that customer now has two names: Ann Park on order 1 and Ann Lee on order 2. This is an update anomaly, the risk redundancy brings. Normalizing moves CustomerName into a Customer table keyed by CustomerId, so the name lives in one row and one UPDATE changes it everywhere.',
    hints: ['How many rows does the WHERE in the UPDATE touch?', 'Customer 7\'s name was stored twice'],
    tags: ['tsql', 'normalization', 'update-anomaly', 'redundancy', 'predict'],
  },
];
