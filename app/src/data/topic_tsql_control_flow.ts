/**
 * Topic.TSQL_CONTROL_FLOW — SQL for Data Engineering (T-SQL).
 * Pillar 4 (Transactions & Procedural): IF … BEGIN … END / ELSE, WHILE,
 * scalar & table-valued CREATE FUNCTION, batch GO.
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const tsql_control_flow_questions: Question[] = [
  {
    id: 'tsql-flow-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_CONTROL_FLOW,
    course: Course.SQL,
    question: 'When does an `IF` in T-SQL require a `BEGIN … END` block?',
    options: [
      { id: 'a', text: 'Whenever the branch contains more than one statement — without BEGIN…END, IF controls only the single statement that follows it.', isCorrect: true },
      { id: 'b', text: 'Always — every IF must be followed by BEGIN…END even for a single statement, or it is a syntax error.', isCorrect: false },
      { id: 'c', text: 'Never — T-SQL uses indentation like Python to decide which statements belong to the IF.', isCorrect: false },
      { id: 'd', text: 'Only when the IF is inside a WHILE loop; standalone IFs never need it.', isCorrect: false },
    ],
    explanation: 'A bare `IF <cond> <statement>;` governs exactly one statement. To run multiple statements conditionally you must group them in `BEGIN … END` — otherwise only the first runs conditionally and the rest run unconditionally, a classic silent bug.',
    hints: ['One statement → no block needed', 'Multiple statements → wrap in BEGIN…END'],
    tags: ['tsql', 'control-flow', 'if', 'begin-end'],
  },
  {
    id: 'tsql-flow-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_CONTROL_FLOW,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'What does this batch print?',
    code: `DECLARE @n INT = 7;
IF @n % 2 = 0
    PRINT 'even';
ELSE
    PRINT 'odd';`,
    expectedOutput: `odd`,
    explanation: '`7 % 2` is 1 (not 0), so the IF condition is false and the ELSE branch runs, printing `odd`. The `%` operator is modulo in T-SQL.',
    hints: ['7 % 2 = 1, so the condition is false'],
    tags: ['tsql', 'control-flow', 'if', 'predict'],
  },
  {
    id: 'tsql-flow-while-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_CONTROL_FLOW,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'What does this batch print?',
    code: `DECLARE @i INT = 1, @sum INT = 0;
WHILE @i <= 4
BEGIN
    SET @sum = @sum + @i;
    SET @i = @i + 1;
END
PRINT @sum;`,
    expectedOutput: `10`,
    explanation: 'The loop adds 1+2+3+4 = 10. The condition is checked before each pass; once `@i` reaches 5 the loop exits and `@sum` (10) is printed. Forgetting `SET @i = @i + 1` would loop forever.',
    hints: ['Sums 1 through 4', 'Loop exits when @i = 5'],
    tags: ['tsql', 'control-flow', 'while', 'predict'],
  },
  {
    id: 'tsql-flow-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_CONTROL_FLOW,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the loop keyword and the block keywords so the batch counts from 1 to 3.',
    template: `DECLARE @i INT = 1;
___ @i <= 3
___
    PRINT @i;
    SET @i = @i + 1;
___`,
    blanks: ['WHILE', 'BEGIN', 'END'],
    solution: `DECLARE @i INT = 1;
WHILE @i <= 3
BEGIN
    PRINT @i;
    SET @i = @i + 1;
END`,
    explanation: '`WHILE <cond>` repeats while the condition holds; the multi-statement body must be wrapped in `BEGIN … END`. Without the block, only the first `PRINT @i` would loop and the increment would run once, causing an infinite loop.',
    hints: ['Loop keyword is WHILE', 'Multi-statement body → BEGIN … END'],
    tags: ['tsql', 'control-flow', 'while', 'begin-end', 'cloze'],
  },
  {
    id: 'tsql-flow-func-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_CONTROL_FLOW,
    course: Course.SQL,
    question: 'How does a scalar `CREATE FUNCTION` differ from a stored procedure?',
    options: [
      { id: 'a', text: 'A function must return a value and can be used inline in a SELECT/WHERE, but cannot modify data; a procedure can modify data and is invoked with EXEC.', isCorrect: true },
      { id: 'b', text: 'A function can run INSERT/UPDATE/DELETE freely; a procedure can only return a value and never changes data.', isCorrect: false },
      { id: 'c', text: 'They are interchangeable — both are called with EXEC and both can be embedded in a SELECT list.', isCorrect: false },
      { id: 'd', text: 'A function may not take parameters, whereas a procedure requires at least one.', isCorrect: false },
    ],
    explanation: 'A function is a value-producing expression: it must RETURN a result, can be embedded in SELECT/WHERE, and is side-effect-free (no data modification). A procedure is an action: it can modify data, is run with EXEC, and can\'t appear inside a SELECT. (Note: scalar functions used per-row can hurt performance.)',
    hints: ['Function = returns a value, usable in SELECT, no data changes', 'Procedure = an action run with EXEC'],
    tags: ['tsql', 'control-flow', 'function', 'procedures'],
  },
  {
    id: 'tsql-flow-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_CONTROL_FLOW,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Create a scalar function `dbo.NetAmount` that takes `@Gross DECIMAL(10,2)` and `@DiscountPct DECIMAL(5,2)` (a percentage like 10 for 10%) and RETURNS the discounted amount as `DECIMAL(10,2)`: gross minus gross times the percentage.',
    starterCode: `-- CREATE FUNCTION dbo.NetAmount (...) RETURNS DECIMAL(10,2) AS BEGIN ... END
`,
    testCases: [
      {
        input: 'CREATE FUNCTION dbo.NetAmount (@Gross, @DiscountPct) RETURNS DECIMAL(10,2)',
        expectedOutput: 'Scalar function returning gross discounted by the given percentage',
        description: 'Scalar function with RETURN',
      },
    ],
    solution: `CREATE FUNCTION dbo.NetAmount
    (@Gross DECIMAL(10, 2), @DiscountPct DECIMAL(5, 2))
RETURNS DECIMAL(10, 2)
AS
BEGIN
    RETURN @Gross - @Gross * @DiscountPct / 100;
END;`,
    explanation: 'A scalar function declares its parameters in parentheses, states `RETURNS <type>`, and the body `RETURN`s a single value. `@Gross * @DiscountPct / 100` converts the percentage to a fraction; subtracting it from the gross gives the net. The function can then be used inline, e.g. `SELECT dbo.NetAmount(Price, 10) FROM …`.',
    hints: ['RETURNS DECIMAL(10,2), body RETURNs one value', '@Gross - @Gross * @DiscountPct / 100'],
    tags: ['tsql', 'control-flow', 'function'],
  },
];
