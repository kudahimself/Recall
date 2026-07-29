/**
 * Topic.TSQL_STRING_FUNCTIONS — SQL for Data Engineering (T-SQL).
 * Pillar 1 (Querying Foundations): CONCAT, LEN, UPPER/LOWER, TRIM,
 * SUBSTRING, LEFT/RIGHT, REPLACE, CHARINDEX.
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const tsql_string_functions_questions: Question[] = [
  {
    id: 'tsql-str-concat-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_STRING_FUNCTIONS,
    course: Course.SQL,
    question: "How do `CONCAT(FirstName, ' ', LastName)` and `FirstName + ' ' + LastName` differ when `LastName` is NULL?",
    options: [
      { id: 'a', text: 'They behave identically in every case - both return NULL whenever any single argument passed in happens to be NULL.', isCorrect: false },
      { id: 'b', text: 'CONCAT raises a hard error the moment it sees NULL input; `+` silently skips over NULL arguments and keeps whatever is left.', isCorrect: false },
      { id: 'c', text: 'CONCAT treats a NULL argument as an empty string and still returns the other parts; `+` propagates NULL, so the whole expression becomes NULL.', isCorrect: true },
      { id: 'd', text: '`+` is the NULL-safe one, treating NULL as an empty string; CONCAT is actually the operator that propagates NULL through the result.', isCorrect: false },
    ],
    explanation: '`CONCAT()` is NULL-safe - a NULL argument is treated as an empty string, so the other parts still come through. The classic `+` gotcha is that any NULL operand makes the *entire* concatenated result NULL, which is why `CONCAT` is generally the safer default for building display strings.',
    hints: ['CONCAT treats NULL as empty string', '+ propagates NULL through the whole expression'],
    tags: ['tsql', 'string-functions', 'concat'],
  },
  {
    id: 'tsql-str-len-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_STRING_FUNCTIONS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: "Fill in the function that returns a string's character count.",
    template: `-- dbo.DimProduct(ProductKey, ProductCode, ProductName, Category, Price)
SELECT ProductName, ___(ProductName) AS NameLength
FROM dbo.DimProduct;`,
    blanks: ['LEN'],
    solution: `SELECT ProductName, LEN(ProductName) AS NameLength
FROM dbo.DimProduct;`,
    explanation: '`LEN(string)` returns the number of characters, ignoring trailing spaces. (`DATALENGTH` counts bytes including trailing spaces - a different, storage-oriented measure.)',
    hints: ['Character-count function'],
    tags: ['tsql', 'string-functions', 'len', 'cloze'],
  },
  {
    id: 'tsql-str-case-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_STRING_FUNCTIONS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the two case-conversion functions.',
    template: `-- dbo.DimProduct(ProductKey, ProductCode, ProductName, Category, Price)
SELECT ___(Category) AS UpperCategory, ___(Category) AS LowerCategory
FROM dbo.DimProduct;`,
    blanks: ['UPPER', 'LOWER'],
    solution: `SELECT UPPER(Category) AS UpperCategory, LOWER(Category) AS LowerCategory
FROM dbo.DimProduct;`,
    explanation: '`UPPER(string)` and `LOWER(string)` convert every character to upper/lowercase - handy for case-insensitive comparisons and consistent display formatting.',
    hints: ['Convert to upper / lower case'],
    tags: ['tsql', 'string-functions', 'upper', 'lower', 'cloze'],
  },
  {
    id: 'tsql-str-trim-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_STRING_FUNCTIONS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the function that strips both leading and trailing spaces in one call.',
    template: `-- stg.Customer(CustomerId, FullName, Email, City, UpdatedAt)
SELECT ___(Email) AS CleanEmail
FROM stg.Customer;`,
    blanks: ['TRIM'],
    solution: `SELECT TRIM(Email) AS CleanEmail
FROM stg.Customer;`,
    explanation: '`TRIM(string)` removes leading and trailing whitespace in a single call. `LTRIM`/`RTRIM` do just one side each - `TRIM` is the one-shot form for the common "strip both ends" case, useful for cleaning staged text before it lands in a dimension.',
    hints: ['One function, both ends'],
    tags: ['tsql', 'string-functions', 'trim', 'cloze'],
  },
  {
    id: 'tsql-str-substring-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_STRING_FUNCTIONS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'What single value does this query return?',
    code: `SELECT SUBSTRING('DataEngineer', 5, 3) AS Result;`,
    expectedOutput: `Eng`,
    explanation: '`SUBSTRING(string, start, length)` uses a 1-based start position. Counting `D-a-t-a-E-n-g-i-n-e-e-r`, position 5 is \'E\'; taking 3 characters from there gives \'Eng\'.',
    hints: ['1-based indexing', 'Start at position 5, take 3 characters'],
    tags: ['tsql', 'string-functions', 'substring', 'predict'],
  },
  {
    id: 'tsql-str-leftright-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_STRING_FUNCTIONS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the functions that grab the first 4 characters and the last 3 characters.',
    template: `-- dbo.DimProduct(ProductKey, ProductCode, ProductName, Category, Price)
SELECT ___(ProductName, 4) AS Prefix, ___(ProductName, 3) AS Suffix
FROM dbo.DimProduct;`,
    blanks: ['LEFT', 'RIGHT'],
    solution: `SELECT LEFT(ProductName, 4) AS Prefix, RIGHT(ProductName, 3) AS Suffix
FROM dbo.DimProduct;`,
    explanation: '`LEFT(string, n)` and `RIGHT(string, n)` grab a fixed number of characters from the start or end - a shorthand for the common case that `SUBSTRING` can also express, but without having to compute a length or start position.',
    hints: ['Fixed-count grab from the start / from the end'],
    tags: ['tsql', 'string-functions', 'left', 'right', 'cloze'],
  },
  {
    id: 'tsql-str-replace-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_STRING_FUNCTIONS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'What single value does this query return?',
    code: `SELECT REPLACE('2026-07-14', '-', '/') AS Result;`,
    expectedOutput: `2026/07/14`,
    explanation: '`REPLACE(string, old, new)` substitutes every occurrence of `old` with `new` - here every hyphen becomes a slash.',
    hints: ['Every occurrence of the old substring is replaced'],
    tags: ['tsql', 'string-functions', 'replace', 'predict'],
  },
  {
    id: 'tsql-str-charindex-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_STRING_FUNCTIONS,
    course: Course.SQL,
    question: "What does `CHARINDEX('@', Email)` return for `'alex@example.com'`?",
    options: [
      { id: 'a', text: "The substring that comes before the '@', meaning it would return just 'alex' from that email.", isCorrect: false },
      { id: 'b', text: "A boolean value indicating only whether or not an '@' is present anywhere in the string.", isCorrect: false },
      { id: 'c', text: "The total count of how many '@' characters appear anywhere in the whole string.", isCorrect: false },
      { id: 'd', text: "5 - the 1-based position of the first '@' character; it returns 0 if the substring is not found.", isCorrect: true },
    ],
    explanation: '`CHARINDEX(substring, string)` returns the 1-based starting position of the first match, or 0 if it never appears. Combined with `SUBSTRING`/`LEFT`, it is how you split text at a delimiter whose position varies row to row.',
    hints: ['1-based position of the first match', 'Returns 0 when not found'],
    tags: ['tsql', 'string-functions', 'charindex'],
  },
  {
    id: 'tsql-str-substring-len-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_STRING_FUNCTIONS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the function that computes how many characters to keep, dropping a fixed 3-character suffix.',
    template: `-- dbo.DimProduct(ProductKey, ProductCode, ProductName, Category, Price)
SELECT ProductCode, SUBSTRING(ProductCode, 1, ___(ProductCode) - 3) AS BaseCode
FROM dbo.DimProduct;`,
    blanks: ['LEN'],
    solution: `SELECT ProductCode, SUBSTRING(ProductCode, 1, LEN(ProductCode) - 3) AS BaseCode
FROM dbo.DimProduct;`,
    explanation: '`LEN(ProductCode) - 3` computes the length to keep dynamically, so `SUBSTRING` grabs everything except the last 3 characters regardless of how long each code is - a common way to strip a fixed-width suffix like a check digit or variant code.',
    hints: ['SUBSTRING\'s length argument can be a computed expression', 'Total length minus the 3 characters to drop'],
    tags: ['tsql', 'string-functions', 'substring', 'len', 'cloze'],
  },
  {
    id: 'tsql-str-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_STRING_FUNCTIONS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    requires: [/UPPER/i, /CONCAT/i],
    question: "From `dbo.DimProduct` (ProductName, Category), return one column `Label` that combines Category and ProductName separated by ' - ', with the whole result in uppercase (e.g. 'BOOKS - THE GREAT NOVEL').",
    starterCode: `-- dbo.DimProduct(ProductName, Category); return one Label column
`,
    testCases: [
      {
        input: "UPPER(CONCAT(Category, ' - ', ProductName))",
        expectedOutput: 'Uppercase "CATEGORY - PRODUCTNAME" label per row',
        description: 'Concatenation + case conversion',
      },
    ],
    solution: `SELECT UPPER(CONCAT(Category, ' - ', ProductName)) AS Label
FROM dbo.DimProduct;
-- OR
SELECT CONCAT(UPPER(Category), ' - ', UPPER(ProductName)) AS Label
FROM dbo.DimProduct;`,
    explanation: '`CONCAT` joins the three pieces (Category, the literal separator, ProductName); wrapping the whole thing in `UPPER` (or upper-casing each piece before concatenating) produces the all-caps label either way.',
    hints: ["CONCAT(Category, ' - ', ProductName)", 'Wrap the result in UPPER (or upper-case each piece first)'],
    tags: ['tsql', 'string-functions', 'concat', 'upper'],
    tieredHints: {
      apiSignature: 'CONCAT(string1, string2, ..., string_n) -> varchar',
      skeleton: `SELECT ____(____(Category, ____, ProductName)) AS Label
FROM dbo.DimProduct;`,
    },
  },
  {
    id: 'tsql-str-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_STRING_FUNCTIONS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    requires: [/LEN/i, /TRIM/i],
    question: 'From `stg.Customer` (Email), return Email and a column `EmailLength` giving the length of Email with leading/trailing whitespace excluded from the count.',
    starterCode: `-- stg.Customer(Email); return Email and EmailLength
`,
    testCases: [
      {
        input: 'LEN(TRIM(Email))',
        expectedOutput: 'Email + its trimmed character length',
        description: 'TRIM + LEN combined',
      },
    ],
    solution: `SELECT Email, LEN(TRIM(Email)) AS EmailLength
FROM stg.Customer;`,
    explanation: 'Trimming first (`TRIM(Email)`) removes stray leading/trailing spaces from the staged value before `LEN` measures it - without the trim, whitespace in the raw data would inflate the count.',
    hints: ['Trim before measuring', 'LEN(TRIM(Email))'],
    tags: ['tsql', 'string-functions', 'trim', 'len'],
    tieredHints: {
      apiSignature: 'TRIM(string_expression) -> varchar',
      skeleton: `SELECT Email, ____(____(Email)) AS ____
FROM stg.Customer;`,
    },
  },
  {
    id: 'tsql-str-domain-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_STRING_FUNCTIONS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: "Fill in the function that extracts everything after the '@', and the one that locates it.",
    template: `-- dbo.DimCustomer(CustomerKey, CustomerId, FullName, Email, City, Country, SignupDate)
SELECT Email,
       ___(Email, ___('@', Email) + 1, LEN(Email)) AS Domain
FROM dbo.DimCustomer;`,
    blanks: ['SUBSTRING', 'CHARINDEX'],
    solution: `SELECT Email,
       SUBSTRING(Email, CHARINDEX('@', Email) + 1, LEN(Email)) AS Domain
FROM dbo.DimCustomer;`,
    explanation: '`CHARINDEX(\'@\', Email)` finds the delimiter\'s position; adding 1 skips past it. `SUBSTRING` then takes everything from there to the end - passing `LEN(Email)` as the length is a common trick, since asking for more characters than remain is safe and simply returns the rest of the string.',
    hints: ['Find the delimiter first, then slice from just past it', 'SUBSTRING(string, start, length)'],
    tags: ['tsql', 'string-functions', 'substring', 'charindex', 'cloze'],
  },
  {
    id: 'tsql-str-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_STRING_FUNCTIONS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    requires: [/TRIM/i, /REPLACE/i],
    question: "Staged phone numbers in `stg.Customer` (CustomerId, Phone) sometimes contain hyphens and stray leading/trailing whitespace, e.g. ' 555-123-4567 '. Return CustomerId and a cleaned `Phone` with every hyphen removed and the whitespace trimmed.",
    starterCode: `-- clean the Phone column: remove hyphens, trim whitespace
`,
    testCases: [
      {
        input: "TRIM(REPLACE(Phone, '-', ''))",
        expectedOutput: 'CustomerId + hyphen-free, trimmed Phone',
        description: 'REPLACE + TRIM data-cleaning',
      },
    ],
    solution: `SELECT CustomerId, TRIM(REPLACE(Phone, '-', '')) AS Phone
FROM stg.Customer;`,
    explanation: '`REPLACE(Phone, \'-\', \'\')` strips every hyphen; wrapping that in `TRIM` then removes the surrounding whitespace. Order matters here only in that both must run - REPLACE does not touch whitespace, and TRIM does not touch hyphens, so neither alone is enough.',
    hints: ['REPLACE removes the hyphens', 'TRIM removes the surrounding whitespace'],
    tags: ['tsql', 'string-functions', 'replace', 'trim'],
    tieredHints: {
      apiSignature: 'REPLACE(string_expression, string_pattern, string_replacement) -> varchar',
      skeleton: `SELECT CustomerId, ____(____(Phone, ____, ____)) AS ____
FROM stg.Customer;`,
    },
  },
];
