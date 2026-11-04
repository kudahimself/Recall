/**
 * Topic.TSQL_STAR_SCHEMA - SQL for Data Engineering (T-SQL).
 * Pillar 5 (Data Modeling): star vs snowflake, conformed dimensions,
 * fact-to-dimension join patterns.
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';
import { sampleTable } from './tsqlSampleTables';

export const tsql_star_schema_questions: Question[] = [
  {
    id: 'tsql-star-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_STAR_SCHEMA,
    course: Course.SQL,
    question: 'What is the defining shape of a star schema?',
    options: [
      { id: 'a', text: 'One central fact table joined directly to denormalized dimension tables, so each dimension is a single join from the fact.', isCorrect: true },
      { id: 'b', text: 'Several fact tables chained to each other with no dimensions, so every report walks the chain of joins.', isCorrect: false },
      { id: 'c', text: 'One wide table holding every fact and dimension column, so that a query needs no join at all.', isCorrect: false },
      { id: 'd', text: 'One fact table whose dimensions are split into sub-tables, so that reaching an attribute can take several joins.', isCorrect: false },
    ],
    explanation: 'A star = a central fact surrounded by denormalized dimensions, each a single join from the fact. The denormalization (e.g. Category stored on DimProduct, not in a separate DimCategory) keeps queries to one hop per dimension, which is simple and fast for BI tools. A dimension split into sub-tables is a snowflake, not a star.',
    hints: ['Central fact, ring of dimensions', 'Each dimension one join away'],
    tags: ['tsql', 'star-schema', 'dimensional-modeling'],
  },
  {
    id: 'tsql-star-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_STAR_SCHEMA,
    course: Course.SQL,
    question: 'How does a snowflake schema differ from a star, and what is the main trade-off?',
    options: [
      { id: 'a', text: 'A snowflake normalizes dimensions into sub-tables (DimProduct to DimCategory): less redundancy, but extra joins make typical queries longer and often slower.', isCorrect: true },
      { id: 'b', text: 'A snowflake drops the dimensions and keeps every attribute in the fact, so queries touch one table and run faster.', isCorrect: false },
      { id: 'c', text: 'A snowflake denormalizes dimensions further than a star: it needs fewer joins but repeats more data in each row.', isCorrect: false },
      { id: 'd', text: 'A snowflake is just a star that has more than four dimensions; the name describes how many there are.', isCorrect: false },
    ],
    explanation: 'Snowflaking normalizes a dimension into a hierarchy of sub-tables (DimProduct to DimCategory to DimDepartment). It cuts storage redundancy and centralizes attribute edits, but every extra level is another join, hurting query simplicity and (often) speed. Most warehouses prefer denormalized star dimensions and accept the redundancy.',
    hints: ['Snowflake = normalized dimension hierarchy', 'Less redundancy, more joins'],
    tags: ['tsql', 'star-schema', 'snowflake'],
  },
  {
    id: 'tsql-star-mcq-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_STAR_SCHEMA,
    course: Course.SQL,
    question: 'What makes a dimension "conformed", and why does it matter?',
    options: [
      { id: 'a', text: 'One shared dimension (such as DimDate or DimCustomer), with the same keys and meaning, used by several fact tables so their metrics line up.', isCorrect: true },
      { id: 'b', text: 'A dimension normalized to third normal form before loading, so every attribute is stored in exactly one place.', isCorrect: false },
      { id: 'c', text: 'A dimension whose column data types match the fact table\'s key types exactly, so that joins need no conversion.', isCorrect: false },
      { id: 'd', text: 'A separate copy of the dimension inside each fact\'s schema, so one fact can change it without affecting another.', isCorrect: false },
    ],
    explanation: 'A conformed dimension is shared, with the same keys and meaning, across multiple facts (sales and returns both joining the same DimDate/DimProduct). This is what lets you put metrics from different processes side by side on one row, the backbone of an enterprise bus-matrix design.',
    hints: ['Same dimension shared across multiple facts', 'Enables cross-fact comparison'],
    tags: ['tsql', 'star-schema', 'conformed-dimension'],
  },
  {
    id: 'tsql-star-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_STAR_SCHEMA,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the join keywords for a star query: total sales amount per product category.',
    tables: [
      sampleTable('dbo.FactSales', ['ProductKey', 'Amount']),
      sampleTable('dbo.DimProduct', ['ProductKey', 'Category']),
    ],
    template: `SELECT p.Category, SUM(f.Amount) AS TotalSales
FROM dbo.FactSales AS f
___ dbo.DimProduct AS p ___ p.ProductKey = f.ProductKey
GROUP BY p.Category;`,
    blanks: ['JOIN', 'ON'],
    solution: `SELECT p.Category, SUM(f.Amount) AS TotalSales
FROM dbo.FactSales AS f
JOIN dbo.DimProduct AS p ON p.ProductKey = f.ProductKey
GROUP BY p.Category;`,
    blankAlternates: [['INNER JOIN'], []],
    explanation: 'The canonical star query joins the fact to each needed dimension on its surrogate key (`f.ProductKey = p.ProductKey`), then groups by a dimension attribute (`Category`) and aggregates a measure (`SUM(f.Amount)`). On the shown rows it returns Books 129, Toys 79 and Home 640. One join per dimension is the star\'s whole appeal.',
    hints: ['Fact JOIN dimension', 'Match surrogate keys with ON'],
    tags: ['tsql', 'star-schema', 'join', 'cloze'],
  },
  {
    id: 'tsql-star-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_STAR_SCHEMA,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Write a star-schema query: join the fact `dbo.FactSales` (alias `f`) to the dimensions `dbo.DimCustomer` (alias `c`) and `dbo.DimProduct` (alias `p`), and return Country, Category and the total `Amount` as `TotalSales`, one row per Country and Category.',
    tables: [
      sampleTable('dbo.FactSales', ['CustomerKey', 'ProductKey', 'Amount']),
      sampleTable('dbo.DimCustomer', ['CustomerKey', 'Country']),
      sampleTable('dbo.DimProduct', ['ProductKey', 'Category']),
    ],
    starterCode: `-- Write the query below.
`,
    testCases: [
      {
        input: 'FactSales joined to DimCustomer and DimProduct, grouped by Country, Category',
        expectedOutput: 'Total sales per country and category',
        description: 'Two-dimension star join with aggregation',
      },
    ],
    solution: `SELECT c.Country, p.Category, SUM(f.Amount) AS TotalSales
FROM dbo.FactSales AS f
JOIN dbo.DimCustomer AS c ON c.CustomerKey = f.CustomerKey
JOIN dbo.DimProduct AS p ON p.ProductKey = f.ProductKey
GROUP BY c.Country, p.Category;
-- OR
SELECT c.Country, p.Category, SUM(f.Amount) AS TotalSales
FROM dbo.FactSales AS f
JOIN dbo.DimCustomer AS c ON c.CustomerKey = f.CustomerKey
JOIN dbo.DimProduct AS p ON p.ProductKey = f.ProductKey
GROUP BY c.Country, p.Category
ORDER BY c.Country, p.Category;`,
    tieredHints: {
      apiSignature: 'JOIN table AS alias ON alias.column = other.column',
      skeleton: `SELECT c.____, p.____, ____(f.____) AS TotalSales
FROM dbo.FactSales AS f
____ dbo.DimCustomer AS c ON c.____ = f.____
____ dbo.____ AS p ON p.____ = f.____
GROUP BY c.____, p.____;`,
    },
    explanation: 'FactSales joins directly to DimCustomer and DimProduct via their foreign keys (CustomerKey and ProductKey) - both star joins. `SUM(f.Amount)` is aggregated at the `(Country, Category)` level: NG Home 640, NO Books 129 and NO Toys 79 on the shown rows. An ORDER BY is fine but not required.',
    hints: ['Fact JOIN DimCustomer ON CustomerKey, JOIN DimProduct ON ProductKey', 'GROUP BY c.Country, p.Category; SUM(f.Amount)'],
    requires: [/JOIN/i, /GROUP\s+BY/i],
    tags: ['tsql', 'star-schema', 'join'],
  },
  {
    id: 'tsql-star-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_STAR_SCHEMA,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'One sale was loaded with a ProductKey that the dimension does not have yet. What single value does this query return?',
    tables: [
      { name: 'dbo.FactSales', columns: ['ProductKey', 'Amount'], rows: [[1, 10], [2, 15], [1, 5], [9, 20]] },
      { name: 'dbo.DimProduct', columns: ['ProductKey', 'Category'], rows: [[1, 'Books'], [2, 'Games']] },
    ],
    code: `SELECT SUM(f.Amount) AS Total
FROM dbo.FactSales AS f
JOIN dbo.DimProduct AS p ON p.ProductKey = f.ProductKey;`,
    expectedOutput: `30`,
    explanation: 'An inner join keeps only fact rows that find their dimension row. The sale with ProductKey 9 has none, so its 20 drops out: 10 + 15 + 5 = 30, not the 50 in the fact. Star loads avoid this by pointing unmatched keys at an "Unknown" member row (often key -1), so every fact row joins and the totals stay whole.',
    hints: ['Which fact row has no matching DimProduct row?', 'JOIN means INNER JOIN'],
    tags: ['tsql', 'star-schema', 'join', 'unknown-member', 'predict'],
  },
];
