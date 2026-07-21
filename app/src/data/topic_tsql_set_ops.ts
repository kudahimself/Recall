/**
 * Topic.TSQL_SET_OPS — SQL for Data Engineering (T-SQL).
 * Pillar 1 (Querying Foundations): UNION / UNION ALL / INTERSECT / EXCEPT.
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const tsql_set_ops_questions: Question[] = [
  {
    id: 'tsql-setops-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_SET_OPS,
    course: Course.SQL,
    question: 'What is the difference between `UNION` and `UNION ALL`?',
    options: [
      { id: 'a', text: 'UNION removes duplicate rows (incurring a sort/distinct cost); UNION ALL keeps every row including duplicates and is faster.', isCorrect: true },
      { id: 'b', text: 'UNION keeps duplicates; UNION ALL removes them — ALL means "all unique values".', isCorrect: false },
      { id: 'c', text: 'They are identical; ALL is an optional keyword that has no effect on the result.', isCorrect: false },
      { id: 'd', text: 'UNION combines columns side by side; UNION ALL stacks the rows of the two queries.', isCorrect: false },
    ],
    explanation: 'Both stack rows from two union-compatible queries. `UNION` then de-duplicates the combined result (which costs a sort/hash); `UNION ALL` skips that and returns everything — so when you know there are no duplicates (or want them), `UNION ALL` is the faster choice.',
    hints: ['UNION dedups (costs work); UNION ALL keeps everything'],
    tags: ['tsql', 'set-ops', 'union'],
  },
  {
    id: 'tsql-setops-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_SET_OPS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'What does this query output (one value per line)?',
    code: `SELECT v.n FROM (VALUES (1), (2)) AS v(n)
UNION
SELECT w.n FROM (VALUES (2), (3)) AS w(n)
ORDER BY n;`,
    expectedOutput: `1
2
3`,
    explanation: '`UNION` combines both row sets and removes duplicates, so the shared value 2 appears once: {1, 2, 3}. With `UNION ALL` the output would be 1, 2, 2, 3.',
    hints: ['UNION removes the duplicate 2'],
    tags: ['tsql', 'set-ops', 'union', 'predict'],
  },
  {
    id: 'tsql-setops-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_SET_OPS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the operator that stacks both result sets and keeps duplicate rows.',
    template: `-- combine both lists, keeping duplicates
SELECT Country FROM dbo.DimCustomer
___ ___
SELECT Country FROM dbo.DimSupplier;`,
    blanks: ['UNION', 'ALL'],
    solution: `-- combine both lists, keeping duplicates
SELECT Country FROM dbo.DimCustomer
UNION ALL
SELECT Country FROM dbo.DimSupplier;`,
    explanation: '`UNION ALL` concatenates the rows of both queries without the de-duplication pass — the right choice when duplicates are acceptable or impossible, since it avoids the sort cost.',
    hints: ['Two-word operator that keeps duplicates'],
    tags: ['tsql', 'set-ops', 'union', 'cloze'],
  },
  {
    id: 'tsql-setops-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_SET_OPS,
    course: Course.SQL,
    question: 'What do `INTERSECT` and `EXCEPT` return?',
    options: [
      { id: 'a', text: 'INTERSECT returns rows present in BOTH queries; EXCEPT returns rows in the first but not the second — both deduplicate and need union-compatible columns.', isCorrect: true },
      { id: 'b', text: 'INTERSECT returns rows in either query; EXCEPT returns rows in both — they are the OR and AND of result sets.', isCorrect: false },
      { id: 'c', text: 'INTERSECT joins the two queries on a key; EXCEPT performs an outer join and keeps the unmatched side.', isCorrect: false },
      { id: 'd', text: 'Both keep all duplicate rows and require the two queries to have different column lists.', isCorrect: false },
    ],
    explanation: 'INTERSECT = set intersection (rows in both); EXCEPT = set difference (rows in the first query not found in the second). Both compare whole rows, remove duplicates, and require the two SELECTs to be union-compatible (same column count and compatible types).',
    hints: ['INTERSECT = in both; EXCEPT = in first not second', 'both dedup'],
    tags: ['tsql', 'set-ops', 'intersect', 'except'],
  },
  {
    id: 'tsql-setops-except-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_SET_OPS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the operator that returns rows from the first query with no match in the second.',
    template: `-- countries with customers but no suppliers
SELECT Country FROM dbo.DimCustomer
___
SELECT Country FROM dbo.DimSupplier;`,
    blanks: ['EXCEPT'],
    solution: `-- countries with customers but no suppliers
SELECT Country FROM dbo.DimCustomer
EXCEPT
SELECT Country FROM dbo.DimSupplier;`,
    explanation: '`EXCEPT` returns rows from the first query that have no match in the second, deduplicated - the set-difference operator. It compares whole rows, so both queries must be union-compatible.',
    hints: ['Set-difference operator: rows in the first query, not the second'],
    tags: ['tsql', 'set-ops', 'except', 'cloze'],
  },
  {
    id: 'tsql-setops-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_SET_OPS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Both `dbo.DimCustomer` and `dbo.DimSupplier` have a `Country` column. Return the distinct Country values that appear in `dbo.DimCustomer` but NOT in `dbo.DimSupplier`.',
    starterCode: `-- SELECT Country FROM ... EXCEPT SELECT Country FROM ...
`,
    testCases: [
      {
        input: 'SELECT Country FROM dbo.DimCustomer EXCEPT SELECT Country FROM dbo.DimSupplier',
        expectedOutput: 'Countries with customers but no suppliers, deduplicated',
        description: 'EXCEPT set difference',
      },
    ],
    solution: `SELECT Country FROM dbo.DimCustomer
EXCEPT
SELECT Country FROM dbo.DimSupplier;`,
    tieredHints: {
      apiSignature: 'SELECT cols FROM t1 EXCEPT SELECT cols FROM t2',
      skeleton: `SELECT ____ FROM dbo.DimCustomer
____
SELECT ____ FROM dbo.DimSupplier;`,
    },
    explanation: '`EXCEPT` returns rows from the first query that are not in the second, deduplicated — exactly "countries with customers but no suppliers". It is far cleaner than a `LEFT JOIN … IS NULL` when comparing whole rows.',
    hints: ['First-query rows minus second-query rows → EXCEPT'],
    tags: ['tsql', 'set-ops', 'except'],
  },
];
