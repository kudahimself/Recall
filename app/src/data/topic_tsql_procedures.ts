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

export const tsql_procedures_questions: Question[] = [
  {
    id: 'tsql-proc-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_PROCEDURES,
    course: Course.SQL,
    question: 'Why package warehouse load logic in a stored procedure instead of repeating ad-hoc SQL?',
    options: [
      { id: 'a', text: 'It is compiled and stored server-side, can be parameterised and reused, and gives the load one named, versioned, schedulable entry point.', isCorrect: true },
      { id: 'b', text: 'A stored procedure runs without ever touching the transaction log, so it is always faster than plain SQL.', isCorrect: false },
      { id: 'c', text: 'A stored procedure can only contain a single SELECT statement, which makes it simpler to audit.', isCorrect: false },
      { id: 'd', text: 'Stored procedures bypass all permissions, so any user can run any logic inside them.', isCorrect: false },
    ],
    explanation: 'A procedure stores reusable, parameterised logic server-side under one name — the natural unit a scheduler (SQL Agent / ADF) calls for an ELT step. It centralises the logic, supports input/output params, and can be granted EXECUTE permission without exposing the underlying tables.',
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
    question: 'Fill in the keywords that create a procedure with one input parameter.',
    template: `CREATE ___ dbo.GetCustomerOrders
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
    question: 'Assemble a procedure `dbo.AddSale` that takes `@CustomerKey INT` and `@Amount DECIMAL(10,2)` and inserts one row into `dbo.FactSales (CustomerKey, Amount)`. Order: header line, parameter list, AS, BEGIN, the INSERT, END.',
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
    explanation: 'A procedure header is `CREATE PROCEDURE <name>` followed by comma-separated `@param TYPE` declarations (no parentheses around the list in T-SQL), then `AS BEGIN … END`. Parameters feed straight into the INSERT\'s VALUES list.',
    hints: ['No parentheses around a T-SQL parameter list', 'Header → params → AS → BEGIN → body → END'],
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
      { id: 'a', text: 'An OUTPUT parameter can pass back any type and multiple values; RETURN sends back a single integer, conventionally a status code.', isCorrect: true },
      { id: 'b', text: 'They are identical; OUTPUT is just an alias for RETURN with a longer keyword.', isCorrect: false },
      { id: 'c', text: 'RETURN can pass back any type and multiple values; OUTPUT only sends a single integer status code.', isCorrect: false },
      { id: 'd', text: 'OUTPUT parameters work only in functions; RETURN works only in procedures.', isCorrect: false },
    ],
    explanation: 'Use an `OUTPUT` parameter to hand back a result of any type (and you can have several). `RETURN` yields a single integer — by convention a status/exit code (0 = success), not data. Mixing them up (returning a row count via RETURN, say) silently breaks once the count exceeds the int range or you need a non-integer.',
    hints: ['OUTPUT = any type, many values', 'RETURN = one integer status code'],
    tags: ['tsql', 'procedures', 'output-parameter', 'return'],
  },
  {
    id: 'tsql-proc-outparam-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_PROCEDURES,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the keyword that marks a parameter as returning a value to the caller.',
    template: `CREATE PROCEDURE dbo.GetOrderTotal
    @CustomerKey INT,
    @Total DECIMAL(10, 2) ___
AS
BEGIN
    SELECT @Total = SUM(Amount)
    FROM dbo.FactOrders
    WHERE CustomerKey = @CustomerKey;
END;`,
    blanks: ['OUTPUT'],
    solution: `CREATE PROCEDURE dbo.GetOrderTotal
    @CustomerKey INT,
    @Total DECIMAL(10, 2) OUTPUT
AS
BEGIN
    SELECT @Total = SUM(Amount)
    FROM dbo.FactOrders
    WHERE CustomerKey = @CustomerKey;
END;`,
    explanation: 'Appending `OUTPUT` after a parameter\'s type in the procedure header marks it as an output parameter - the body can write a value into it that the caller reads back after EXEC (the call site must also repeat `OUTPUT`, as seen when invoking one).',
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
    question: 'Fill in the keyword that runs the procedure and the keyword that marks the captured argument as an output.',
    template: `DECLARE @cnt INT;
___ dbo.CountOrders @CustomerKey = 42, @OrderCount = @cnt ___;
SELECT @cnt AS Orders;`,
    blanks: ['EXEC', 'OUTPUT'],
    solution: `DECLARE @cnt INT;
EXEC dbo.CountOrders @CustomerKey = 42, @OrderCount = @cnt OUTPUT;
SELECT @cnt AS Orders;`,
    blankAlternates: [['EXECUTE'], []],
    explanation: '`EXEC` (or `EXECUTE`) runs a stored procedure. To receive an OUTPUT parameter you must repeat the `OUTPUT` keyword at the call site — omit it and the variable stays NULL because the value is passed by value, not by reference.',
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
    template: `CREATE PROCEDURE dbo.GetOrderAmount
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
    question: 'Create a stored procedure `dbo.GetOrdersSince` with one input parameter `@FromDate DATE` that returns `OrderId`, `OrderDate`, and `Amount` from `dbo.FactOrders` where `OrderDate >= @FromDate`, ordered by `OrderDate`.',
    starterCode: `-- CREATE PROCEDURE dbo.GetOrdersSince @FromDate DATE AS ...
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
END;`,
    explanation: 'The `@FromDate DATE` parameter is declared after the proc name and used in the `WHERE` to filter on or after that date. Wrapping the query in `CREATE PROCEDURE … AS BEGIN … END` turns a one-off query into a reusable, schedulable load/report step.',
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
    question: 'Create a stored procedure `dbo.CountOrdersForCustomer` with an input parameter `@CustomerKey INT` and an output parameter `@OrderCount INT` that sets the output parameter to the number of rows in `dbo.FactOrders` for that customer.',
    starterCode: `-- CREATE PROCEDURE dbo.CountOrdersForCustomer ( ... ) AS ...
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
END;`,
    explanation: 'The header declares one plain input parameter and one parameter suffixed `OUTPUT`. The body assigns into the output parameter with `SELECT @OrderCount = COUNT(*) ...` rather than returning a result set - the caller reads the count back through the parameter after EXEC, not from a SELECT.',
    hints: ['Second parameter needs the OUTPUT suffix', 'Assign the count into it with SELECT @OrderCount = COUNT(*) ... WHERE CustomerKey = @CustomerKey'],
    tags: ['tsql', 'procedures', 'output-parameter', 'create-procedure'],
  },
];
