/**
 * Sample rows for the warehouse tables the SQL for DE Querying Foundations
 * questions query (dbo.DimProduct, dbo.FactOrders, stg.Customer, ...), shown
 * as read-only grids so a learner sees what the query runs against.
 *
 * Predict questions carry their own small `tables`, because their exact rows
 * decide the answer. Every other question in the section gets these canonical
 * tables attached by `attachSampleTables`, trimmed to the columns the question
 * itself mentions so the grid stays small.
 */
import { Question, QuestionType, SqlTable, SqlCell, MultipleChoiceQuestion } from '../types';
import { referencedTables } from '../utils/sqlTableRefs';

const SAMPLE: SqlTable[] = [
  {
    name: 'dbo.DimProduct',
    columns: ['ProductKey', 'ProductCode', 'ProductName', 'Category', 'Price', 'Discontinued'],
    rows: [
      [101, 'BK-1001-PB', 'The Great Novel', 'Books', 24.99, 0],
      [102, 'BK-1002-HC', 'Atlas of Rivers', 'Books', 129.0, 0],
      [103, 'TY-2001-ST', 'Wooden Train', 'Toys', 39.5, 0],
      [104, 'TY-2002-ST', 'Kite', 'Toys', 12.0, 1],
      [105, 'GD-3001-XL', 'Desk Lamp', 'Home', 64.0, 0],
      [106, 'BK-1003-PB', 'Cooking Basics', null, 18.75, 0],
    ],
  },
  {
    name: 'dbo.DimCustomer',
    columns: ['CustomerKey', 'CustomerId', 'FullName', 'Email', 'City', 'Country', 'SignupDate', 'IsActive'],
    rows: [
      [1, 'C-001', 'Ingrid Berg', 'ingrid@example.no', 'Oslo', 'NO', '2024-03-14', 1],
      [2, 'C-002', 'Lars Holm', null, 'Bergen', 'NO', '2025-11-02', 1],
      [3, 'C-003', 'Sofia Lind', 'sofia@example.se', 'Malmo', 'SE', '2023-07-30', 0],
      [4, 'C-004', 'Amara Okafor', 'amara@example.com', 'Lagos', 'NG', '2025-01-19', 1],
      [5, 'C-005', null, 'anon@example.se', 'Uppsala', 'SE', '2026-02-08', 1],
    ],
  },
  {
    name: 'dbo.FactOrders',
    columns: ['OrderId', 'CustomerKey', 'ProductKey', 'OrderDate', 'Amount'],
    rows: [
      [5001, 1, 102, '2026-09-03 10:15', 129.0],
      [5002, 1, 101, '2026-09-21 18:40', 24.99],
      [5003, 2, 103, '2026-10-02 09:05', 79.0],
      [5004, 4, 105, '2026-10-28 14:30', 640.0],
      [5005, 4, 102, '2026-11-01 11:00', 516.0],
      [5006, 3, 104, '2026-11-03 16:20', 12.0],
    ],
  },
  {
    name: 'dbo.DimSupplier',
    columns: ['SupplierKey', 'SupplierId', 'SupplierName', 'Country'],
    rows: [
      [1, 'S-01', 'Nordic Paper', 'NO'],
      [2, 'S-02', 'Lagos Crafts', 'NG'],
      [3, 'S-03', 'Rhine Toys', 'DE'],
    ],
  },
  {
    name: 'stg.Customer',
    columns: ['CustomerId', 'FullName', 'Email', 'City', 'Phone', 'UpdatedAt', 'IsActive'],
    rows: [
      ['C-001', 'Ingrid Berg', '  ingrid@example.no ', 'Oslo', ' 555-123-4567 ', '2026-11-01', 1],
      ['C-003', 'Sofia Lind', 'sofia@example.se', 'Lund', '555-987-6543', '2026-11-02', 0],
      ['C-009', 'Tom Reyes', ' tom@example.com', 'Austin', '555-222-0101', '2026-11-03', 0],
    ],
  },
  {
    name: 'stg.Product',
    columns: ['ProductKey', 'ProductName'],
    rows: [
      [101, 'The Great Novel'],
      [102, 'Atlas of World Rivers'],
      [103, 'Wooden Train'],
    ],
  },
  {
    name: 'dbo.StageOrders',
    columns: ['StageId', 'OrderId', 'Amount'],
    rows: [
      [1, 5001, 129.0],
      [2, 5002, 24.99],
      [3, 5003, 79.0],
    ],
  },
  {
    name: 'dbo.Employee',
    columns: ['EmployeeId', 'ManagerId', 'FullName'],
    rows: [
      [1, null, 'Grace Hopper'],
      [2, 1, 'Alan Kay'],
      [3, 1, 'Barbara Liskov'],
      [4, 2, 'Ken Thompson'],
    ],
  },
];

const BY_NAME = new Map(SAMPLE.map(t => [t.name.toLowerCase(), t]));

/** The SQL a question shows: code, template, solution, parsons lines, or SQL inside an MCQ. */
export function questionSql(q: Question): string {
  switch (q.type) {
    case QuestionType.PREDICT_OUTPUT:
      return q.code;
    case QuestionType.CLOZE_CODE:
      return `${q.template}\n${q.solution}`;
    case QuestionType.CODING:
      return q.solution;
    case QuestionType.PARSONS:
      return [...q.correctOrder, ...(q.distractorLines ?? [])].join('\n');
    case QuestionType.MULTIPLE_CHOICE: {
      // Prose like "rows from both tables" is not SQL: read only backticked
      // spans in the question and options that are themselves a statement.
      const mcq = q as MultipleChoiceQuestion;
      const spans = Array.from(mcq.question.matchAll(/`([^`]+)`/g)).map(m => m[1]);
      const statements = mcq.options
        .map(o => o.text)
        .filter(t => /^\s*(SELECT|WITH|INSERT|UPDATE|DELETE|TRUNCATE)\b/i.test(t) && /;\s*$/.test(t));
      return [...spans, ...statements].join('\n');
    }
    default:
      return '';
  }
}

function questionText(q: Question): string {
  const parts: string[] = [q.question, questionSql(q)];
  if (q.type === QuestionType.CODING) parts.push(q.starterCode ?? '');
  return parts.join('\n');
}

function pick(table: SqlTable, mentioned: string): SqlTable {
  const idx = table.columns
    .map((c, i) => [c, i] as const)
    .filter(([c]) => new RegExp(`\\b${c}\\b`, 'i').test(mentioned))
    .map(([, i]) => i);
  const keep = idx.length > 0 ? idx : table.columns.map((_, i) => i);
  return {
    name: table.name,
    columns: keep.map(i => table.columns[i]),
    rows: table.rows.map(r => keep.map(i => r[i] as SqlCell)),
  };
}

/**
 * Give every question that reads a known sample table (and has no `tables`
 * of its own) a preview of it, showing only the columns the question mentions.
 */
export function attachSampleTables<T extends Question>(qs: T[]): T[] {
  return qs.map(q => {
    if (q.tables) return q;
    const refs = referencedTables(questionSql(q)).filter(r => BY_NAME.has(r));
    if (refs.length === 0) return q;
    const text = questionText(q);
    return { ...q, tables: refs.map(r => pick(BY_NAME.get(r) as SqlTable, text)) };
  });
}
