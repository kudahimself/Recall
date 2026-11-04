/**
 * Topic.TSQL_PROCEDURES — SQL for Data Engineering (T-SQL).
 * Pillar 4 (Transactions & Procedural): CREATE PROCEDURE / EXEC, input &
 * output params, DECLARE @v, SET / SELECT @v, RETURN.
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

export const tsql_procedures_questions: Question[] = [
  {
    id: 'tsql-proc-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_PROCEDURES,
    course: Course.SQL,
    question: 'Why package warehouse load logic in a stored procedure instead of repeating ad-hoc SQL?',
    options: [
      { id: 'a', text: 'The logic is stored once on the server under one name, takes parameters, and a scheduler runs it with a single EXEC.', isCorrect: true },
      { id: 'b', text: 'Its statements run as one transaction by themselves, so a load step that fails halfway never leaves partial changes.', isCorrect: false },
      { id: 'c', text: 'Its writes skip the transaction log, so the same INSERTs and UPDATEs run faster than when sent as a plain batch.', isCorrect: false },
      { id: 'd', text: 'Its result rows are cached, so a second call with the same parameters returns them without reading the tables again.', isCorrect: false },
    ],
    explanation: 'A procedure stores reusable, parameterised logic server-side under one name - the natural unit a scheduler (SQL Agent / ADF) calls for an ELT step. It centralises the logic, supports input/output params, and can be granted EXECUTE permission without exposing the underlying tables. It is not automatically a transaction: each statement inside still autocommits unless the body opens one with `BEGIN TRAN`. It is logged like any other write, and what SQL Server caches is the query plan, not the result rows.',
    hints: ['Reusable, parameterised, named server-side unit', 'The thing a scheduler calls for a load step'],
    tags: ['tsql', 'procedures', 'stored-proc'],
  },
  {
    id: 'tsql-proc-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_PROCEDURES,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the keyword that creates a procedure, and the character every parameter name starts with.',
    tables: [sampleTable('dbo.FactOrders', ['OrderId', 'CustomerKey', 'Amount'])],
    template: `-- dbo.FactOrders(OrderId, CustomerKey, ProductKey, OrderDate, Amount)
CREATE ___ dbo.GetCustomerOrders
    ___ CustomerKey INT
AS
BEGIN
    SELECT OrderId, Amount
    FROM dbo.FactOrders
    WHERE CustomerKey = @CustomerKey;
END;`,
    blanks: ['PROCEDURE', '@'],
    solution: `CREATE PROCEDURE dbo.GetCustomerOrders
    @CustomerKey INT
AS
BEGIN
    SELECT OrderId, Amount
    FROM dbo.FactOrders
    WHERE CustomerKey = @CustomerKey;
END;`,
    blankAlternates: [['PROC'], []],
    explanation: '`CREATE PROCEDURE <name>` defines the proc; parameters are declared after the name and always start with `@`. The body goes between `AS BEGIN` and `END`. Here `@CustomerKey` filters the orders to one customer.',
    hints: ['CREATE PROCEDURE (or PROC)', 'Parameter names start with @'],
    tags: ['tsql', 'procedures', 'create-procedure', 'cloze'],
  },
  {
    id: 'tsql-proc-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_PROCEDURES,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Assemble a procedure `dbo.AddSale` that takes `@CustomerKey INT` and then `@Amount DECIMAL(10,2)`, and inserts one row into `dbo.FactSales (CustomerKey, Amount)`.',
    tables: [sampleTable('dbo.FactSales', ['CustomerKey', 'Amount'])],
    correctOrder: [
      'CREATE PROCEDURE dbo.AddSale',
      '    @CustomerKey INT,',
      '    @Amount DECIMAL(10, 2)',
      'AS',
      'BEGIN',
      '    INSERT INTO dbo.FactSales (CustomerKey, Amount)',
      '    VALUES (@CustomerKey, @Amount);',
      'END;',
    ],
    distractorLines: [
      'CREATE PROCEDURE dbo.AddSale ()',
      '    CustomerKey INT,',
      '    INSERT INTO dbo.FactSales VALUES @CustomerKey, @Amount;',
    ],
    solution: `CREATE PROCEDURE dbo.AddSale
    @CustomerKey INT,
    @Amount DECIMAL(10, 2)
AS
BEGIN
    INSERT INTO dbo.FactSales (CustomerKey, Amount)
    VALUES (@CustomerKey, @Amount);
END;`,
    explanation: 'A procedure header is `CREATE PROCEDURE <name>` followed by comma-separated `@param TYPE` declarations, then `AS BEGIN ... END`. Parentheses around the list are optional, but an empty `()` followed by parameters is a syntax error, and every parameter name needs its `@`. Parameters feed straight into the INSERT\'s VALUES list, which always needs its parentheses.',
    hints: ['The parameter list needs no parentheses, and each name starts with @', 'Header → params → AS → BEGIN → body → END'],
    tags: ['tsql', 'procedures', 'create-procedure', 'parsons'],
  },
  {
    id: 'tsql-proc-output-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_PROCEDURES,
    course: Course.SQL,
    question: 'In T-SQL, how does an OUTPUT parameter differ from the value given by `RETURN`?',
    options: [
      { id: 'a', text: 'An OUTPUT parameter can carry any type, and there can be several; RETURN sends back one integer, by convention a status code.', isCorrect: true },
      { id: 'b', text: 'RETURN can carry any type, such as a total or a name; an OUTPUT parameter only carries an integer status code.', isCorrect: false },
      { id: 'c', text: 'An OUTPUT parameter can carry any type and needs nothing extra at the call; RETURN is read with EXEC @rc = ...', isCorrect: false },
      { id: 'd', text: 'RETURN sends a whole result set back to the caller; an OUTPUT parameter sends back one value of any type.', isCorrect: false },
    ],
    explanation: 'Use an `OUTPUT` parameter to hand back a result of any type (and you can have several), and write `OUTPUT` at the call too, or the caller\'s variable keeps its old value. `RETURN` yields a single integer, by convention a status code (0 = success), not data, so it cannot hand back an amount like 19.99 or a name. Rows come back from a `SELECT` in the body, not from RETURN.',
    hints: ['OUTPUT = any type, many values', 'RETURN = one integer status code'],
    tags: ['tsql', 'procedures', 'output-parameter', 'return'],
  },
  {
    id: 'tsql-proc-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_PROCEDURES,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'What does this script PRINT (one value)?',
    tables: [{ name: 'dbo.Ticket', columns: ['TicketId'], rows: [[1], [2], [3]] }],
    code: `CREATE PROCEDURE dbo.CountTickets @MinId INT, @Total INT OUTPUT
AS
BEGIN
    SELECT @Total = COUNT(*) FROM dbo.Ticket WHERE TicketId >= @MinId;
END;
GO
DECLARE @n INT = -1;
EXEC dbo.CountTickets @MinId = 2, @Total = @n;
PRINT @n;`,
    expectedOutput: `-1`,
    explanation: 'The procedure does set `@Total` to 2, but the call site passes `@Total = @n` without `OUTPUT`, so `@n` goes in by value and the 2 never comes back. `@n` keeps the -1 it was declared with. Writing `@Total = @n OUTPUT` in the EXEC would print 2: the keyword is needed in the header and at the call.',
    hints: ['Look at the EXEC line, not the procedure body', 'Without OUTPUT at the call site the value is not copied back'],
    tags: ['tsql', 'procedures', 'output-parameter', 'exec', 'predict'],
  },
  {
    id: 'tsql-proc-outparam-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_PROCEDURES,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the keyword that marks a parameter as returning a value to the caller.',
    tables: [sampleTable('dbo.FactOrders', ['OrderId', 'CustomerKey', 'Amount'])],
    template: `-- dbo.FactOrders(OrderId, CustomerKey, ProductKey, OrderDate, Amount)
CREATE PROCEDURE dbo.GetOrderTotal
    @CustomerKey INT,
    @Total DECIMAL(10, 2) ___
AS
BEGIN
    SELECT @Total = SUM(Amount)
    FROM dbo.FactOrders
    WHERE CustomerKey = @CustomerKey;
END;`,
    blanks: ['OUTPUT'],
    blankAlternates: [['OUT']],
    solution: `CREATE PROCEDURE dbo.GetOrderTotal
    @CustomerKey INT,
    @Total DECIMAL(10, 2) OUTPUT
AS
BEGIN
    SELECT @Total = SUM(Amount)
    FROM dbo.FactOrders
    WHERE CustomerKey = @CustomerKey;
END;`,
    explanation: 'Appending `OUTPUT` (or its short form `OUT`) after a parameter\'s type in the procedure header marks it as an output parameter - the body can write a value into it that the caller reads back after EXEC. For customer 1 the body sets `@Total` to 153.99. The call site must also repeat `OUTPUT`.',
    hints: ['Goes right after the parameter\'s type', 'Same keyword as at the EXEC call site'],
    tags: ['tsql', 'procedures', 'output-parameter', 'cloze'],
  },
  {
    id: 'tsql-proc-exec-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_PROCEDURES,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'The procedure `dbo.CountOrders @CustomerKey INT, @OrderCount INT OUTPUT` already exists. Fill in the keyword that runs it and the keyword that copies its count back into `@cnt`.',
    template: `DECLARE @cnt INT;
___ dbo.CountOrders @CustomerKey = 42, @OrderCount = @cnt ___;
SELECT @cnt AS Orders;`,
    blanks: ['EXEC', 'OUTPUT'],
    solution: `DECLARE @cnt INT;
EXEC dbo.CountOrders @CustomerKey = 42, @OrderCount = @cnt OUTPUT;
SELECT @cnt AS Orders;`,
    blankAlternates: [['EXECUTE'], ['OUT']],
    explanation: '`EXEC` (or `EXECUTE`) runs a stored procedure. To receive an OUTPUT parameter you must repeat the `OUTPUT` keyword at the call site - omit it and `@cnt` stays NULL, the value it was declared with, because the argument is passed in by value and nothing is copied back.',
    hints: ['Run a proc with EXEC / EXECUTE', 'Repeat OUTPUT at the call site to capture it'],
    tags: ['tsql', 'procedures', 'exec', 'output-parameter', 'cloze'],
  },
  {
    id: 'tsql-proc-return-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_PROCEDURES,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the statement that exits the procedure early with status 1 when the order is missing, and the one that exits with status 0 on success.',
    tables: [sampleTable('dbo.FactOrders', ['OrderId', 'Amount'])],
    template: `-- dbo.FactOrders(OrderId, CustomerKey, ProductKey, OrderDate, Amount)
CREATE PROCEDURE dbo.GetOrderAmount
    @OrderId INT,
    @Amount DECIMAL(10, 2) OUTPUT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM dbo.FactOrders WHERE OrderId = @OrderId)
    BEGIN
        ___ 1;
    END
    SELECT @Amount = Amount FROM dbo.FactOrders WHERE OrderId = @OrderId;
    ___ 0;
END;`,
    blanks: ['RETURN', 'RETURN'],
    solution: `CREATE PROCEDURE dbo.GetOrderAmount
    @OrderId INT,
    @Amount DECIMAL(10, 2) OUTPUT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM dbo.FactOrders WHERE OrderId = @OrderId)
    BEGIN
        RETURN 1;
    END
    SELECT @Amount = Amount FROM dbo.FactOrders WHERE OrderId = @OrderId;
    RETURN 0;
END;`,
    explanation: '`RETURN <int>` immediately exits the procedure with that integer as its status code - by convention 0 for success, nonzero for a specific failure reason. It carries no data (that is what the OUTPUT parameter is for) and a caller reads it via `EXEC @rc = dbo.GetOrderAmount ...`.',
    hints: ['RETURN <int> exits immediately with a status code', 'Convention: 0 = success, nonzero = failure reason'],
    tags: ['tsql', 'procedures', 'return', 'cloze'],
  },
  {
    id: 'tsql-proc-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_PROCEDURES,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    requires: [/CREATE\s+(OR\s+ALTER\s+)?PROC(EDURE)?\b/i],
    question: 'Create a stored procedure `dbo.GetOrdersSince` with one input parameter `@FromDate DATE` that returns `OrderId`, `OrderDate`, and `Amount` from `dbo.FactOrders` where `OrderDate >= @FromDate`, ordered by `OrderDate`.',
    tables: [sampleTable('dbo.FactOrders', ['OrderId', 'OrderDate', 'Amount'])],
    starterCode: `-- dbo.FactOrders(OrderId, CustomerKey, ProductKey, OrderDate, Amount)
`,
    testCases: [
      {
        input: 'CREATE PROCEDURE dbo.GetOrdersSince @FromDate DATE',
        expectedOutput: 'Procedure returning orders on or after @FromDate, ordered by date',
        description: 'Parameterised stored procedure',
      },
    ],
    solution: `CREATE PROCEDURE dbo.GetOrdersSince
    @FromDate DATE
AS
BEGIN
    SELECT OrderId, OrderDate, Amount
    FROM dbo.FactOrders
    WHERE OrderDate >= @FromDate
    ORDER BY OrderDate;
END;
-- OR
CREATE PROC dbo.GetOrdersSince @FromDate DATE
AS
BEGIN
    SELECT OrderId, OrderDate, Amount FROM dbo.FactOrders
    WHERE OrderDate >= @FromDate ORDER BY OrderDate;
END;`,
    tieredHints: {
      apiSignature: 'CREATE PROCEDURE proc_name @param_name data_type AS BEGIN ... END;',
      skeleton: `CREATE PROCEDURE dbo.GetOrdersSince
    @FromDate DATE
AS
BEGIN
    SELECT ____, ____, ____
    FROM dbo.FactOrders
    WHERE OrderDate ____ @FromDate
    ORDER BY ____;
END;`,
    },
    explanation: 'The `@FromDate DATE` parameter is declared after the proc name and used in the `WHERE` to filter on or after that date: `EXEC dbo.GetOrdersSince \'2026-10-28\'` returns orders 5004, 5005 and 5006. Wrapping the query in `CREATE PROCEDURE ... AS BEGIN ... END` turns a one-off query into a reusable, schedulable load/report step; `CREATE PROC` is fine too.',
    hints: ['Declare @FromDate DATE after the name', 'WHERE OrderDate >= @FromDate, ORDER BY OrderDate'],
    tags: ['tsql', 'procedures', 'create-procedure'],
  },
  {
    id: 'tsql-proc-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_PROCEDURES,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    requires: [/\bOUT(PUT)?\b/i],
    question: 'Create a stored procedure `dbo.CountOrdersForCustomer` with an input parameter `@CustomerKey INT` and an output parameter `@OrderCount INT` that sets the output parameter to the number of rows in `dbo.FactOrders` for that customer.',
    tables: [sampleTable('dbo.FactOrders', ['OrderId', 'CustomerKey'])],
    starterCode: `-- dbo.FactOrders(OrderId, CustomerKey, ProductKey, OrderDate, Amount)
`,
    testCases: [
      {
        input: 'CREATE PROCEDURE dbo.CountOrdersForCustomer @CustomerKey INT, @OrderCount INT OUTPUT',
        expectedOutput: 'Procedure that writes the customer\'s order count into the output parameter',
        description: 'Procedure with an input and an output parameter',
      },
    ],
    solution: `CREATE PROCEDURE dbo.CountOrdersForCustomer
    @CustomerKey INT,
    @OrderCount INT OUTPUT
AS
BEGIN
    SELECT @OrderCount = COUNT(*)
    FROM dbo.FactOrders
    WHERE CustomerKey = @CustomerKey;
END;
-- OR
CREATE PROCEDURE dbo.CountOrdersForCustomer @CustomerKey INT, @OrderCount INT OUT
AS
BEGIN
    SELECT @OrderCount = COUNT(*) FROM dbo.FactOrders WHERE CustomerKey = @CustomerKey;
END;
-- OR
CREATE PROC dbo.CountOrdersForCustomer @CustomerKey INT, @OrderCount INT OUTPUT
AS
BEGIN
    SELECT @OrderCount = COUNT(*) FROM dbo.FactOrders WHERE CustomerKey = @CustomerKey;
END;
-- OR
CREATE PROC dbo.CountOrdersForCustomer @CustomerKey INT, @OrderCount INT OUT
AS
BEGIN
    SELECT @OrderCount = COUNT(*) FROM dbo.FactOrders WHERE CustomerKey = @CustomerKey;
END;
-- OR
CREATE PROCEDURE dbo.CountOrdersForCustomer @CustomerKey INT, @OrderCount INT OUTPUT
AS
BEGIN
    SET @OrderCount = (SELECT COUNT(*) FROM dbo.FactOrders WHERE CustomerKey = @CustomerKey);
END;`,
    tieredHints: {
      apiSignature: '@param_name data_type OUTPUT',
      skeleton: `CREATE PROCEDURE dbo.CountOrdersForCustomer
    @CustomerKey INT,
    @____ INT ____
AS
BEGIN
    SELECT @OrderCount = ____(*)
    FROM dbo.FactOrders
    WHERE ____ = @____;
END;`,
    },
    explanation: 'The header declares one plain input parameter and one parameter suffixed `OUTPUT` (or `OUT`). The body assigns into the output parameter with `SELECT @OrderCount = COUNT(*) ...` (or `SET @OrderCount = (SELECT COUNT(*) ...)`) rather than returning a result set - the caller reads the count back through the parameter after EXEC, not from a SELECT. For customer 4 it is 2.',
    hints: ['Second parameter needs the OUTPUT suffix', 'Assign the count into it with SELECT @OrderCount = COUNT(*) ... WHERE CustomerKey = @CustomerKey'],
    tags: ['tsql', 'procedures', 'output-parameter', 'create-procedure'],
  },
];
