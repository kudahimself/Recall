/**
 * Topic.TSQL_NORMALIZATION — SQL for Data Engineering (T-SQL).
 * Pillar 5 (Data Modeling): normalization vs denormalization tradeoffs for
 * analytics (MCQ-led).
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
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
      { id: 'a', text: 'Eliminate redundant data by splitting it into related tables so each fact is stored once — preventing update anomalies and keeping writes consistent.', isCorrect: true },
      { id: 'b', text: 'Duplicate data across many tables so every query can be answered without joins.', isCorrect: false },
      { id: 'c', text: 'Store all data as JSON blobs so the schema never needs to change.', isCorrect: false },
      { id: 'd', text: 'Maximize the number of columns per table to reduce the total table count.', isCorrect: false },
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
      { id: 'a', text: 'Warehouses are read-heavy: denormalized (wide) dimensions cut the number of joins per query, simplifying and speeding analytical reads — the redundancy is acceptable because loads are controlled.', isCorrect: true },
      { id: 'b', text: 'Denormalization is required because warehouses cannot perform joins at all.', isCorrect: false },
      { id: 'c', text: 'Because normalized tables use more disk, and warehouses always have less storage than OLTP systems.', isCorrect: false },
      { id: 'd', text: 'Because denormalized data is automatically more accurate than normalized data.', isCorrect: false },
    ],
    explanation: 'A warehouse optimizes for reads, not writes. Wide, denormalized dimensions (Category, Department all on DimProduct) mean fewer joins per analytical query — simpler SQL and better performance. The redundancy that would be dangerous in OLTP is safe here because data is loaded by a controlled ETL process, not edited row-by-row.',
    hints: ['Warehouses are read-optimized', 'Fewer joins > avoiding redundancy'],
    tags: ['tsql', 'normalization', 'denormalization', 'olap'],
  },
  {
    id: 'tsql-norm-mcq-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_NORMALIZATION,
    course: Course.SQL,
    question: 'A table stores OrderId, CustomerId, and CustomerName together. CustomerName depends on CustomerId, not on the full key. Which normal form does this violate, and what is the fix?',
    options: [
      { id: 'a', text: 'It violates 2NF/3NF (a non-key column depends on another non-key column); move CustomerName into a Customer table keyed by CustomerId.', isCorrect: true },
      { id: 'b', text: 'It violates 1NF because the table has more than two columns; split each column into its own table.', isCorrect: false },
      { id: 'c', text: 'It violates no normal form; storing the name alongside the id is always correct.', isCorrect: false },
      { id: 'd', text: 'It violates 1NF because CustomerName contains text; convert it to an integer code.', isCorrect: false },
    ],
    explanation: 'CustomerName depends on CustomerId rather than on the table\'s key — a transitive/partial dependency that breaks 2NF/3NF. Storing it here means every order for a customer repeats the name, risking inconsistency if a name changes. The fix is to factor CustomerName into its own Customer table. (A warehouse might keep the redundancy deliberately, but OLTP normalizes it away.)',
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
      { id: 'a', text: 'Massive redundancy bloats the (already huge) fact table and makes attribute changes require rewriting millions of fact rows — dimensions exist to isolate that descriptive data.', isCorrect: true },
      { id: 'b', text: 'There is no downside; this is the recommended warehouse design and always the fastest.', isCorrect: false },
      { id: 'c', text: 'The fact table will refuse to load because facts cannot contain text columns.', isCorrect: false },
      { id: 'd', text: 'Queries become impossible because you can no longer write a GROUP BY.', isCorrect: false },
    ],
    explanation: 'Denormalizing dimensions is good; collapsing them INTO the fact is not. The fact has the most rows by far, so repeating wide descriptive columns there multiplies storage and turns a single attribute change into a rewrite of millions of rows. Dimensions hold descriptive data once; the fact holds keys + measures. Denormalize within a dimension, not into the fact.',
    hints: ['Fact has the most rows — redundancy hurts most there', 'Keep descriptive columns in dimensions'],
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
      { id: 'a', text: 'When a sub-hierarchy is very large or volatile and shared across dimensions — normalizing it avoids duplicating huge/changing attribute sets and centralizes the edits.', isCorrect: true },
      { id: 'b', text: 'Never — fully denormalized star dimensions are always strictly better in every case.', isCorrect: false },
      { id: 'c', text: 'Always — warehouses should match OLTP and normalize every table to 3NF.', isCorrect: false },
      { id: 'd', text: 'Only when the warehouse has fewer than ten total rows.', isCorrect: false },
    ],
    explanation: 'The star/denormalized default has real exceptions: if a sub-dimension is large, rapidly changing, or reused by several dimensions, snowflaking it avoids massive duplication and gives one place to maintain those attributes. It is an engineering trade-off — fewer joins (star) vs less redundancy and easier maintenance (snowflake) — not a universal rule.',
    hints: ['Large/volatile/shared sub-hierarchy', 'Trade fewer joins for less duplication'],
    tags: ['tsql', 'normalization', 'snowflake', 'tradeoffs'],
  },
];
