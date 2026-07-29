/**
 * Topic.TSQL_TYPES — SQL for Data Engineering (T-SQL).
 * Pillar 2 (DDL & Constraints): choosing column data types for a warehouse.
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const tsql_types_questions: Question[] = [
  {
    id: 'tsql-types-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_TYPES,
    course: Course.SQL,
    question: 'Choosing column types for a warehouse table, which set of choices is correct?',
    options: [
      { id: 'a', text: '`NVARCHAR` for Unicode text, `DECIMAL(p, s)` for money (exact), and `DATETIME2` for timestamps (wider range/precision than `DATETIME`).', isCorrect: true },
      { id: 'b', text: '`VARCHAR` for all text including Unicode, `FLOAT` for money (fast), and `DATETIME` for timestamps (the recommended modern type).', isCorrect: false },
      { id: 'c', text: '`TEXT` for names, `MONEY` is forbidden so use `REAL`, and `SMALLDATETIME` for all timestamps to save space.', isCorrect: false },
      { id: 'd', text: '`CHAR` for variable-length names, `INT` for money in cents only, and `DATE` whenever a time component is also needed.', isCorrect: false },
    ],
    explanation: 'Money must be exact, so `DECIMAL(p,s)` (or `NUMERIC`) — never `FLOAT`/`REAL`, which are binary approximations and lose cents. `NVARCHAR` stores Unicode; reserve `VARCHAR` for known-ASCII. `DATETIME2` supersedes the legacy `DATETIME` (range back to year 0001, up to 100ns precision). `TEXT` is deprecated.',
    hints: ['Money = exact = DECIMAL, never FLOAT', 'NVARCHAR = Unicode; DATETIME2 over DATETIME'],
    tags: ['tsql', 'types', 'decimal', 'nvarchar'],
  },
  {
    id: 'tsql-types-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_TYPES,
    course: Course.SQL,
    question: 'What does `DECIMAL(10, 2)` allow, and what is the `BIT` type used for?',
    options: [
      { id: 'a', text: 'Up to 10 total digits with 2 after the decimal point (max 99,999,999.99); `BIT` stores 0, 1, or NULL — T-SQL\'s boolean.', isCorrect: true },
      { id: 'b', text: 'Exactly 10 digits before and 2 after the point (12 total); `BIT` stores a single ASCII character flag like \'Y\'/\'N\'.', isCorrect: false },
      { id: 'c', text: '10 bytes of storage with 2 reserved for sign; `BIT` is an 8-bit integer from 0 to 255.', isCorrect: false },
      { id: 'd', text: 'A floating value with 10 significant figures; `BIT` is a variable-length bitmap column for flags.', isCorrect: false },
    ],
    explanation: '`DECIMAL(p, s)` = precision `p` (total significant digits) and scale `s` (digits right of the point). `DECIMAL(10,2)` therefore allows 8 digits before the point and 2 after. `BIT` is the boolean type: `0`, `1`, or `NULL` (often several BIT columns pack into a byte).',
    hints: ['precision = total digits, scale = digits after the point', 'BIT = 0/1/NULL boolean'],
    tags: ['tsql', 'types', 'decimal', 'bit'],
  },
  {
    id: 'tsql-types-bigint-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_TYPES,
    course: Course.SQL,
    question: "A `SalesKey` identity column is expected to grow past 2 billion rows over the table's lifetime. Which type should you use, and why?",
    options: [
      { id: 'a', text: 'BIGINT - INT tops out around 2.1 billion (its signed 32-bit range), while BIGINT covers a signed 64-bit range with room to spare.', isCorrect: true },
      { id: 'b', text: 'INT - it is always sufficient for a primary key regardless of row count.', isCorrect: false },
      { id: 'c', text: 'DECIMAL(19, 0) - integers must switch to DECIMAL once they exceed a few million rows.', isCorrect: false },
      { id: 'd', text: 'BIT - keys should be as small as possible to save space.', isCorrect: false },
    ],
    explanation: 'INT is a signed 32-bit integer, capped at roughly 2.1 billion. A large fact table\'s surrogate key can realistically approach or exceed that, so BIGINT (signed 64-bit) is the safer default there - the extra 4 bytes per row is cheap insurance against an overflow that would halt loads.',
    hints: ['INT maxes out around 2.1 billion', 'BIGINT = 64-bit, the standard choice for large fact-table keys'],
    tags: ['tsql', 'types', 'bigint', 'int'],
  },
  {
    id: 'tsql-types-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_TYPES,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the column types: exact money with 2 decimals, a modern timestamp, and a 0/1 flag.',
    template: `-- dbo.FactSale(SaleId, Category, SubCategory, Amount, SaleDate)
CREATE TABLE dbo.FactSale (
    SaleKey    INT,
    Amount     ___(10, 2),   -- exact money, 2 decimals
    SoldAt     ___,          -- date + time, modern type
    IsReturned ___           -- 0/1 flag
);`,
    blanks: ['DECIMAL', 'DATETIME2', 'BIT'],
    solution: `CREATE TABLE dbo.FactSale (
    SaleKey    INT,
    Amount     DECIMAL(10, 2),
    SoldAt     DATETIME2,
    IsReturned BIT
);`,
    explanation: '`DECIMAL(10,2)` keeps money exact, `DATETIME2` is the modern timestamp, and `BIT` is the boolean flag. Picking precise types up front keeps the warehouse compact and prevents rounding bugs downstream.',
    hints: ['Exact money → DECIMAL; modern timestamp → DATETIME2; flag → BIT'],
    tags: ['tsql', 'types', 'cloze'],
  },
];
