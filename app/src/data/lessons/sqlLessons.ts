/**
 * SQL for Data Engineering lessons, one per topic, in course order.
 *
 * Section 1, Querying Foundations: every topic.
 * Section 2, DDL & Constraints: every topic.
 * Section 3, Analytical & Window SQL: every topic.
 * Section 4, Transactions & Procedural T-SQL: every topic.
 * Section 5, Data Modeling in SQL: every topic.
 * Later sections follow one per PR (next: ELT & Transformation Patterns).
 *
 * Prose keeps one sentence per source line (`lines`); check-lessons.js runs
 * each worked example on sql.js and compares what it prints with `output`.
 */
import { CodeLanguage, Topic, TopicLesson } from '../../types';

/** One paragraph from its sentences, one per source line. */
const lines = (...sentences: string[]) => sentences.join('\n');

export const sqlLessons: TopicLesson[] = [
  {
    id: 'tsql_select/1',
    topicKeys: [Topic.TSQL_SELECT],
    step: 1,
    title: 'SELECT, WHERE, ORDER BY, TOP',
    idea: [
      lines(
        "A query runs in a fixed logical order: `FROM` picks the table, `WHERE` keeps the rows whose condition is true, `SELECT` picks the columns, and `ORDER BY` sorts what is left.",
        "The order you write the clauses in is not the order they run in.",
      ),
      lines(
        "`TOP (n)` right after `SELECT` keeps only the first n rows of the sorted result.",
        "T-SQL has no `LIMIT`.",
        "`SELECT DISTINCT` collapses duplicate rows of the chosen columns into one.",
      ),
      lines(
        "For pages of a list, `OFFSET n ROWS FETCH NEXT m ROWS ONLY` after the `ORDER BY` skips n rows and returns the next m.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `SELECT [DISTINCT] TOP (n) col1, col2  -- which columns, how many rows
FROM table                            -- which table
WHERE condition                       -- which rows
ORDER BY col DESC;                    -- in what order

ORDER BY col OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY;  -- a page`,
    },
    pitfall: lines(
      "`TOP` without `ORDER BY` returns some n rows, not the first n by anything.",
      "The engine may hand back a different set each time, so always sort when you mean \"the top\".",
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'Book',
          columns: ['Title', 'Genre', 'Pages'],
          rows: [
            ['Dune', 'SciFi', 412],
            ['Emma', 'Classic', 474],
            ['Ubik', 'SciFi', 202],
            ['Hyperion', 'SciFi', 482],
            ['Beloved', 'Classic', 324],
          ],
        },
      ],
      code: `SELECT TOP (2) Title, Pages
FROM Book
WHERE Genre = 'SciFi'
ORDER BY Pages DESC;`,
      steps: [
        "Line 2: `FROM Book` starts with all five rows.",
        "Line 3: `WHERE Genre = 'SciFi'` keeps Dune, Ubik and Hyperion; the two classics are gone.",
        "Line 4: `ORDER BY Pages DESC` sorts what is left longest first: Hyperion 482, Dune 412, Ubik 202.",
        "Line 1: `TOP (2)` keeps the first two rows of that sorted list, and `SELECT` shows only Title and Pages.",
      ],
      output: `Title | Pages
Hyperion | 482
Dune | 412`,
    },
    exercises: [
      'tsql-select-mcq-1',
      'tsql-select-distinct-mcq-1',
      'tsql-select-predict-1',
      'tsql-select-cloze-1',
      'tsql-select-1',
    ],
  },
  {
    id: 'tsql_filtering/1',
    topicKeys: [Topic.TSQL_FILTERING],
    step: 1,
    title: 'Filtering, NULLs & CASE',
    idea: [
      lines(
        "`WHERE` keeps a row only when its condition is true.",
        "`BETWEEN a AND b` is a range that includes both ends, `IN (...)` tests a list, and `LIKE 'A%'` matches a pattern where `%` stands for any run of characters.",
      ),
      lines(
        "`NULL` means unknown, so any comparison with it, even `= NULL`, is unknown rather than true, and `WHERE` drops the row.",
        "Test for it with `IS NULL` or `IS NOT NULL`, and replace it with `COALESCE(a, b, ...)`, which returns the first argument that is not NULL.",
      ),
      lines(
        "`CASE WHEN cond THEN value ... ELSE value END` turns conditions into one value per row.",
        "The first `WHEN` that is true wins, and a row that matches none gets the `ELSE` value, or NULL when there is no `ELSE`.",
        "`IIF(cond, a, b)` is the two-branch shorthand.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `WHERE col BETWEEN 10 AND 20        -- both ends included
  AND col IN ('a', 'b')            -- one of a list
  AND col LIKE 'A%'                -- % = any characters
  AND col IS NULL                  -- never col = NULL

COALESCE(col, 'default')           -- first value that is not NULL
CASE WHEN cond THEN x ELSE y END   -- one value per row`,
    },
    pitfall: lines(
      "`col <> 'x'` does not return the rows where col is NULL, because NULL compared with anything is unknown.",
      "Write `col <> 'x' OR col IS NULL` when the missing values belong in the answer.",
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'Member',
          columns: ['MemberName', 'City', 'Fines'],
          rows: [
            ['Ana', 'Oslo', 0],
            ['Ben', null, 12],
            ['Cleo', 'Bergen', 30],
            ['Dev', null, 0],
          ],
        },
      ],
      code: `SELECT MemberName,
       COALESCE(City, 'unknown') AS Town,
       CASE WHEN Fines >= 20 THEN 'blocked'
            WHEN Fines > 0 THEN 'owes'
            ELSE 'clear' END AS Standing
FROM Member
WHERE City <> 'Oslo' OR City IS NULL
ORDER BY MemberName;`,
      steps: [
        "Line 7: `City <> 'Oslo'` is true only for Cleo; for Ben and Dev it is unknown, because their City is NULL.",
        "The `OR City IS NULL` brings Ben and Dev back, so only Ana, who lives in Oslo, is filtered out.",
        "Line 2: `COALESCE` shows 'unknown' where City is NULL.",
        "Lines 3-5: Cleo's 30 matches the first `WHEN`, Ben's 12 the second, and Dev's 0 neither, so Dev gets the `ELSE` value.",
      ],
      output: `MemberName | Town | Standing
Ben | unknown | owes
Cleo | Bergen | blocked
Dev | unknown | clear`,
    },
    exercises: [
      'tsql-filter-mcq-1',
      'tsql-filter-predict-1',
      'tsql-filter-cloze-1',
      'tsql-filter-coalesce-mcq-1',
      'tsql-filter-case-cloze-1',
    ],
  },
  {
    id: 'tsql_string_functions/1',
    topicKeys: [Topic.TSQL_STRING_FUNCTIONS],
    step: 1,
    title: 'String Functions',
    idea: [
      lines(
        "A string function works on one value per row and returns a new value; the stored column does not change.",
        "`UPPER` and `LOWER` change case, `TRIM` strips spaces from both ends, and `REPLACE(s, old, new)` swaps every occurrence of old.",
      ),
      lines(
        "Positions count from 1.",
        "`SUBSTRING(s, start, length)` takes length characters from start, `LEFT(s, n)` and `RIGHT(s, n)` take n from either end, and `CHARINDEX(find, s)` gives the position of the first match, or 0 when there is none.",
        "`LEN(s)` counts characters, not counting trailing spaces.",
      ),
      lines(
        "`CONCAT(a, b, ...)` joins values and treats NULL as empty text, while `a + b` on strings is NULL as soon as one side is NULL.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `UPPER(s)  LOWER(s)  TRIM(s)  LEN(s)
REPLACE(s, 'old', 'new')
SUBSTRING(s, start, length)   -- start counts from 1
LEFT(s, n)  RIGHT(s, n)
CHARINDEX('x', s)             -- position of 'x', 0 if absent
CONCAT(a, ' ', b)             -- a NULL part counts as ''`,
    },
    pitfall: lines(
      "Building text with `+` turns the whole value into NULL when one part is NULL.",
      "Use `CONCAT`, or wrap each part in `COALESCE`.",
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'Author',
          columns: ['Handle', 'Pen'],
          rows: [
            ['ana.lima@ink.io', 'Ana Lima'],
            ['bo@press.org', 'Bo'],
            ['cyd.ng@ink.io', null],
          ],
        },
      ],
      code: `SELECT Handle,
       CHARINDEX('@', Handle) AS AtPos,
       UPPER(LEFT(Handle, CHARINDEX('@', Handle) - 1)) AS UserName,
       CONCAT(Pen, ' <', Handle, '>') AS Label
FROM Author
ORDER BY AtPos;`,
      steps: [
        "Line 2: `CHARINDEX('@', Handle)` counts from 1, so in 'bo@press.org' the '@' is at position 3.",
        "Line 3: `LEFT` keeps the characters before the '@' (its position minus 1), and `UPPER` capitalises them.",
        "Line 4: `CONCAT` joins four pieces; Cyd has no pen name, and `CONCAT` treats that NULL as empty text, so the label still appears.",
        "Written as `Pen + ' <' + Handle + '>'`, Cyd's label would be NULL instead.",
      ],
      output: `Handle | AtPos | UserName | Label
bo@press.org | 3 | BO | Bo <bo@press.org>
cyd.ng@ink.io | 7 | CYD.NG |  <cyd.ng@ink.io>
ana.lima@ink.io | 9 | ANA.LIMA | Ana Lima <ana.lima@ink.io>`,
    },
    exercises: [
      'tsql-str-concat-mcq-1',
      'tsql-str-substring-predict-1',
      'tsql-str-replace-predict-1',
      'tsql-str-len-cloze-1',
      'tsql-str-charindex-mcq-1',
    ],
  },
  {
    id: 'tsql_date_functions/1',
    topicKeys: [Topic.TSQL_DATE_FUNCTIONS],
    step: 1,
    title: 'Date & Time Functions',
    idea: [
      lines(
        "`YEAR(d)`, `MONTH(d)` and `DAY(d)` pull one part out of a date as a number, and `DATEPART(quarter, d)` does the same for any part.",
      ),
      lines(
        "`DATEADD(day, n, d)` moves a date by n units, and `DATEDIFF(day, start, end)` counts the unit boundaries crossed between two dates.",
        "So `DATEDIFF(month, '2026-01-31', '2026-02-01')` is 1, although only one day passed.",
      ),
      lines(
        "`EOMONTH(d)` gives the last day of d's month.",
        "`GETDATE()` is the server's current date and time, read once per statement, and `CAST(GETDATE() AS DATE)` drops the time when only the calendar day matters.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `YEAR(d)  MONTH(d)  DAY(d)  DATEPART(quarter, d)
DATEADD(day, 7, d)          -- d moved 7 days
DATEDIFF(day, start, end)   -- boundaries crossed
EOMONTH(d)                  -- last day of d's month
CAST(GETDATE() AS DATE)     -- today, without the time`,
    },
    pitfall: lines(
      "`DATEDIFF` counts boundaries, not whole periods.",
      "From 31 December to 1 January is one year by `DATEDIFF(year, ...)`, so work out ages and tenures from days, or compare full dates.",
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'Loan',
          columns: ['LoanId', 'LoanDate', 'ReturnDate'],
          rows: [
            [1, '2026-01-30', '2026-02-02'],
            [2, '2026-02-10', '2026-02-24'],
            [3, '2026-03-31', '2026-04-01'],
          ],
        },
      ],
      code: `SELECT LoanId,
       MONTH(LoanDate) AS LoanMonth,
       DATEDIFF(day, LoanDate, ReturnDate) AS DaysOut,
       DATEDIFF(month, LoanDate, ReturnDate) AS MonthsCrossed,
       DATEADD(day, 14, LoanDate) AS DueDate,
       EOMONTH(LoanDate) AS MonthEnd
FROM Loan
ORDER BY LoanId;`,
      steps: [
        "Line 3: loan 1 went out on 30 January and came back on 2 February, so `DATEDIFF(day, ...)` is 3.",
        "Line 4: the same loan crossed one month boundary, so `DATEDIFF(month, ...)` is 1, while loan 2 stayed inside February and gets 0.",
        "Line 5: `DATEADD(day, 14, LoanDate)` is the due date two weeks out; loan 3 moves from 31 March into April.",
        "Line 6: `EOMONTH` gives the last day of each loan's month, and 2026 is not a leap year, so February ends on the 28th.",
      ],
      output: `LoanId | LoanMonth | DaysOut | MonthsCrossed | DueDate | MonthEnd
1 | 1 | 3 | 1 | 2026-02-13 | 2026-01-31
2 | 2 | 14 | 0 | 2026-02-24 | 2026-02-28
3 | 3 | 1 | 1 | 2026-04-14 | 2026-03-31`,
    },
    exercises: [
      'tsql-dt-getdate-mcq-1',
      'tsql-dt-datediff-predict-1',
      'tsql-dt-eomonth-predict-1',
      'tsql-dt-yearmonthday-cloze-1',
      'tsql-dt-cast-cloze-1',
    ],
  },
  {
    id: 'tsql_joins/1',
    topicKeys: [Topic.TSQL_JOINS],
    step: 1,
    title: 'Joins',
    idea: [
      lines(
        "A join pairs the rows of two tables on a condition, usually a key: `FROM A JOIN B ON B.AKey = A.AKey`.",
        "Every pair that matches becomes one output row, so a row with three matches appears three times.",
      ),
      lines(
        "`INNER JOIN`, or just `JOIN`, keeps only the rows that match on both sides.",
        "`LEFT JOIN` keeps every row of the left table and fills the right table's columns with NULL where nothing matches; `RIGHT JOIN` is its mirror, and `FULL JOIN` keeps both sides.",
      ),
      lines(
        "A `LEFT JOIN` followed by `WHERE right.Key IS NULL` keeps exactly the left rows with no match, which is how you find customers without orders.",
        "Short table aliases such as `c` and `o` keep the column names unambiguous.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `SELECT a.col, b.col
FROM TableA a
INNER JOIN TableB b ON b.AKey = a.AKey   -- matches only
LEFT JOIN TableC c ON c.AKey = a.AKey    -- every row of a, NULLs where no match

WHERE c.AKey IS NULL                     -- the rows of a with no match in c`,
    },
    pitfall: lines(
      "A condition on the right table in `WHERE` undoes a `LEFT JOIN`: the NULL rows fail it and disappear.",
      "Put such a condition in the `ON` clause when unmatched left rows must stay.",
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'Member',
          columns: ['MemberId', 'MemberName'],
          rows: [
            [1, 'Ana'],
            [2, 'Ben'],
            [3, 'Cleo'],
          ],
        },
        {
          name: 'Loan',
          columns: ['LoanId', 'MemberId', 'Title'],
          rows: [
            [10, 1, 'Dune'],
            [11, 1, 'Emma'],
            [12, 3, 'Ubik'],
          ],
        },
      ],
      code: `SELECT m.MemberName, l.Title
FROM Member m
LEFT JOIN Loan l ON l.MemberId = m.MemberId
ORDER BY m.MemberName, l.Title;`,
      steps: [
        "Line 3: Ana's MemberId 1 matches two loans, so Ana appears twice, once per title.",
        "Ben has no loan, and `LEFT JOIN` keeps him anyway, with NULL in every Loan column.",
        "Cleo matches one loan, Ubik.",
        "With `INNER JOIN` Ben's row would be gone, and adding `WHERE l.LoanId IS NULL` would leave only Ben: the members with no loans.",
      ],
      output: `MemberName | Title
Ana | Dune
Ana | Emma
Ben | NULL
Cleo | Ubik`,
    },
    exercises: [
      'tsql-joins-mcq-1',
      'tsql-joins-predict-1',
      'tsql-joins-cloze-1',
      'tsql-joins-leftjoin-cloze-1',
      'tsql-joins-1',
    ],
  },
  {
    id: 'tsql_aggregation/1',
    topicKeys: [Topic.TSQL_AGGREGATION],
    step: 1,
    title: 'Aggregation & GROUP BY',
    idea: [
      lines(
        "An aggregate turns many rows into one value: `COUNT(*)` counts rows, `SUM`, `AVG`, `MIN` and `MAX` work on a column, and `COUNT(DISTINCT col)` counts different values.",
        "Without `GROUP BY` the whole table is one group, so the query returns one row.",
      ),
      lines(
        "`GROUP BY col` makes one group per value of col and returns one row per group.",
        "Every column in `SELECT` that is not inside an aggregate must be listed in `GROUP BY`.",
      ),
      lines(
        "`WHERE` filters rows before they are grouped, and `HAVING` filters groups after, so only `HAVING` can test an aggregate such as `SUM(Amount) > 1000`.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `SELECT col, COUNT(*) AS n, SUM(x) AS total
FROM table
WHERE row_condition        -- before grouping
GROUP BY col               -- one row per value of col
HAVING SUM(x) > 100        -- after grouping
ORDER BY total DESC;`,
    },
    pitfall: lines(
      "`WHERE SUM(x) > 100` is an error: when `WHERE` runs, the groups and their sums do not exist yet.",
      "Move the aggregate test to `HAVING`.",
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'Loan',
          columns: ['Title', 'Genre', 'Days'],
          rows: [
            ['Dune', 'SciFi', 14],
            ['Ubik', 'SciFi', 7],
            ['Emma', 'Classic', 21],
            ['Hyperion', 'SciFi', 10],
            ['Beloved', 'Classic', 3],
            ['Dune', 'SciFi', 5],
            ['Rebecca', 'Mystery', 9],
            ['Rebecca', 'Mystery', 12],
          ],
        },
      ],
      code: `SELECT Genre,
       COUNT(*) AS Loans,
       COUNT(DISTINCT Title) AS Titles,
       SUM(Days) AS TotalDays
FROM Loan
WHERE Days >= 5
GROUP BY Genre
HAVING COUNT(*) >= 2
ORDER BY TotalDays DESC;`,
      steps: [
        "Line 6: `WHERE Days >= 5` drops the 3-day Beloved loan before any group exists.",
        "Line 7: the seven loans left form three groups: SciFi with 4 rows, Mystery with 2 and Classic with 1.",
        "Lines 2-4: each group gets its counts and its sum; SciFi has 4 loans but only 3 different titles, because Dune was borrowed twice.",
        "Line 8: `HAVING COUNT(*) >= 2` removes the Classic group, which has one loan left.",
        "Line 9 sorts the two remaining groups by their total days.",
      ],
      output: `Genre | Loans | Titles | TotalDays
SciFi | 4 | 3 | 36
Mystery | 2 | 1 | 21`,
    },
    exercises: [
      'tsql-agg-mcq-1',
      'tsql-agg-predict-1',
      'tsql-agg-minmaxavg-predict-1',
      'tsql-agg-cloze-1',
      'tsql-agg-having-cloze-1',
    ],
  },
  {
    id: 'tsql_subqueries_cte/1',
    topicKeys: [Topic.TSQL_SUBQUERIES_CTE],
    step: 1,
    title: 'Subqueries & CTEs',
    idea: [
      lines(
        "A subquery is a query inside another, in parentheses.",
        "In `WHERE col IN (SELECT ...)` it supplies a list of values; in the `SELECT` list it must return one value per row.",
      ),
      lines(
        "`EXISTS (SELECT 1 FROM t WHERE t.Key = outer.Key)` is true when at least one row matches.",
        "Because it refers to the outer row it is correlated: it is evaluated for each outer row, and it stops at the first match.",
      ),
      lines(
        "A CTE names a query up front: `WITH StepName AS (SELECT ...)`, then the main query reads `FROM StepName` like a table.",
        "It reads top to bottom like a pipeline of steps, and the main query can use the CTE's column aliases directly.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `WITH StepName AS (
    SELECT ...                    -- any query, its columns named
)
SELECT ... FROM StepName;         -- use it like a table

WHERE col IN (SELECT col FROM other)        -- a list of values
WHERE EXISTS (SELECT 1 FROM other o
              WHERE o.Key = t.Key)          -- any match for this row`,
    },
    pitfall: lines(
      "`NOT IN (subquery)` returns no rows at all once the subquery returns a NULL, because `x <> NULL` is never true.",
      "Use `NOT EXISTS` when the list could hold NULLs.",
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'Member',
          columns: ['MemberId', 'MemberName'],
          rows: [
            [1, 'Ana'],
            [2, 'Ben'],
            [3, 'Cleo'],
            [4, 'Dev'],
          ],
        },
        {
          name: 'Loan',
          columns: ['LoanId', 'MemberId', 'Days'],
          rows: [
            [10, 1, 14],
            [11, 1, 30],
            [12, 2, 7],
            [13, 3, 21],
            [14, 3, 4],
          ],
        },
      ],
      code: `WITH LoanCounts AS (
    SELECT MemberId, COUNT(*) AS Loans
    FROM Loan
    GROUP BY MemberId
)
SELECT m.MemberName, lc.Loans
FROM Member m
JOIN LoanCounts lc ON lc.MemberId = m.MemberId
WHERE EXISTS (SELECT 1 FROM Loan l
              WHERE l.MemberId = m.MemberId AND l.Days > 20)
ORDER BY m.MemberName;`,
      steps: [
        "Lines 1-5: the CTE `LoanCounts` counts the loans per member: member 1 has 2, member 2 has 1 and member 3 has 2.",
        "Line 8: the main query joins members to that named result as if it were a table; Dev has no loans, so the inner join leaves him out.",
        "Lines 9-10: `EXISTS` runs once per member, looking for one of that member's loans longer than 20 days.",
        "Ana (30 days) and Cleo (21 days) have one, so they stay; Ben's only loan is 7 days, so he goes.",
      ],
      output: `MemberName | Loans
Ana | 2
Cleo | 2`,
    },
    exercises: [
      'tsql-subq-mcq-1',
      'tsql-subq-cte-cloze-1',
      'tsql-subq-predict-1',
      'tsql-subq-exists-cloze-1',
      'tsql-subq-1',
    ],
  },
  {
    id: 'tsql_set_ops/1',
    topicKeys: [Topic.TSQL_SET_OPS],
    step: 1,
    title: 'Set Operations',
    idea: [
      lines(
        "A set operator stacks the rows of two queries into one result.",
        "Both queries must return the same number of columns, with compatible types, and the column names come from the first query.",
      ),
      lines(
        "`UNION ALL` keeps every row, duplicates included, and `UNION` removes the duplicates, which costs a sort or a hash.",
        "`INTERSECT` keeps the rows found in both queries, and `EXCEPT` keeps the rows of the first query that are not in the second; both remove duplicates too.",
      ),
      lines(
        "One `ORDER BY` goes at the very end and sorts the combined result.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `SELECT col FROM A
UNION ALL        -- every row of both, duplicates kept
                 -- UNION:     every distinct row of both
                 -- INTERSECT: distinct rows found in both
                 -- EXCEPT:    distinct rows of A not in B
SELECT col FROM B
ORDER BY col;    -- once, at the end`,
    },
    pitfall: lines(
      "Set operators match columns by position, not by name.",
      "Swap two columns in the second query and the values land under the wrong headings without any error.",
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        { name: 'Shelf', columns: ['Title'], rows: [['Dune'], ['Emma'], ['Ubik'], ['Dune']] },
        { name: 'Wishlist', columns: ['Title'], rows: [['Ubik'], ['Hyperion']] },
      ],
      code: `SELECT Title FROM Shelf
EXCEPT
SELECT Title FROM Wishlist
ORDER BY Title;

SELECT Title FROM Shelf
UNION ALL
SELECT Title FROM Wishlist
ORDER BY Title;`,
      steps: [
        "Lines 1-4: `EXCEPT` takes the shelf titles (Dune, Emma, Ubik, Dune), removes Ubik because the wishlist has it, and removes the second Dune.",
        "Lines 6-9: `UNION ALL` keeps all six rows, so Dune and Ubik each appear twice.",
        "With `UNION` instead, the second result would be the four distinct titles.",
        "Each `ORDER BY` sorts the whole combined result, not only the query just above it.",
      ],
      output: `Title
Dune
Emma

Title
Dune
Dune
Emma
Hyperion
Ubik
Ubik`,
    },
    exercises: [
      'tsql-setops-mcq-1',
      'tsql-setops-predict-1',
      'tsql-setops-cloze-1',
      'tsql-setops-mcq-2',
      'tsql-setops-except-cloze-1',
    ],
  },
  {
    id: 'tsql_dml/1',
    topicKeys: [Topic.TSQL_DML],
    step: 1,
    title: 'Basic DML (INSERT, UPDATE, DELETE)',
    idea: [
      lines(
        "`INSERT INTO t (col1, col2) VALUES (...), (...)` adds new rows, one per tuple.",
        "The values follow the column list, and a column left out gets its default or NULL.",
      ),
      lines(
        "`UPDATE t SET col = expression WHERE condition` changes the matching rows in place.",
        "The expression can read the row's current values, so `SET Price = Price * 1.1` raises each price from its own starting point.",
      ),
      lines(
        "`DELETE FROM t WHERE condition` removes the matching rows, and the table itself stays.",
        "The `WHERE` is the only thing that limits `UPDATE` and `DELETE` to some of the rows.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `INSERT INTO t (col1, col2)
VALUES ('a', 1), ('b', 2);     -- one row per tuple

UPDATE t
SET col2 = col2 + 1            -- may read the old value
WHERE col1 = 'a';              -- which rows change

DELETE FROM t
WHERE col2 > 5;                -- which rows go`,
    },
    pitfall: lines(
      "Leave out the `WHERE` and `UPDATE` or `DELETE` hits every row of the table.",
      "Run the same `WHERE` in a `SELECT` first to see which rows it matches.",
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'BookCopy',
          columns: ['CopyId', 'Title', 'Loans'],
          rows: [
            [1, 'Dune', 3],
            [2, 'Emma', 0],
            [3, 'Ubik', 5],
          ],
        },
      ],
      code: `INSERT INTO BookCopy (CopyId, Title, Loans)
VALUES (4, 'Hyperion', 0), (5, 'Beloved', 1);

UPDATE BookCopy
SET Loans = Loans + 1
WHERE Title IN ('Dune', 'Beloved');

DELETE FROM BookCopy
WHERE Loans = 0;

SELECT CopyId, Title, Loans FROM BookCopy ORDER BY CopyId;`,
      steps: [
        "Lines 1-2: one `INSERT` adds two rows, Hyperion and Beloved, which makes five copies.",
        "Lines 4-6: `SET Loans = Loans + 1` reads each matching row's own value, so Dune goes from 3 to 4 and Beloved from 1 to 2.",
        "Lines 8-9: `DELETE` removes the two copies with no loans, Emma and Hyperion.",
        "Line 11: the `SELECT` shows the three rows left; without the `WHERE` on line 9, the table would be empty.",
      ],
      output: `CopyId | Title | Loans
1 | Dune | 4
3 | Ubik | 5
5 | Beloved | 2`,
    },
    exercises: [
      'tsql-dml-insert-mcq-1',
      'tsql-dml-nowhere-mcq-1',
      'tsql-dml-update-predict-1',
      'tsql-dml-delete-predict-1',
      'tsql-dml-update-cloze-1',
    ],
  },
  {
    id: 'tsql_ddl_tables/1',
    topicKeys: [Topic.TSQL_DDL_TABLES],
    step: 1,
    title: 'Creating & Altering Tables',
    idea: [
      lines(
        "`CREATE TABLE dbo.t (col type, ...)` defines a new, empty table: its name, its columns and the type of each.",
        "It is DDL, so it changes structure, not data, and an `INSERT` fills it afterwards.",
        "Name objects with their schema, as in `dbo.t`, so the name does not depend on who runs the script.",
      ),
      lines(
        "`ALTER TABLE` changes a table that already exists.",
        "`ADD col type` adds a column, and the rows already there hold NULL in it unless it has a `DEFAULT`.",
        "`ALTER COLUMN col newtype` changes a column's type, and `DROP COLUMN col` removes the column.",
      ),
      lines(
        "`DROP TABLE` removes the whole table, its columns and its rows, while `DELETE` removes only rows.",
        "`SELECT cols INTO #t FROM src` creates a table from a query and fills it in one statement, a common way to build a staging table.",
        "A `#t` table is a temp table that lasts for the session.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `CREATE TABLE dbo.t (
    id  INT,                                   -- name type, comma-separated
    col NVARCHAR(100)
);
ALTER TABLE dbo.t ADD col2 INT NULL;           -- ADD: no COLUMN keyword
ALTER TABLE dbo.t ALTER COLUMN col NVARCHAR(200);
ALTER TABLE dbo.t DROP COLUMN col2;
DROP TABLE dbo.t;                              -- structure and rows gone

SELECT id, col INTO #t FROM dbo.src;           -- create + fill in one go`,
    },
    pitfall: lines(
      "In T-SQL `ADD` takes no `COLUMN` keyword, but `ALTER COLUMN` and `DROP COLUMN` do, and `MODIFY` is not T-SQL at all.",
      "Write `ADD col type` to add a column, `ALTER COLUMN` to change its type and `DROP COLUMN` to remove it.",
    ),
    worked: {
      language: CodeLanguage.SQL,
      code: `CREATE TABLE Shelf (
    ShelfId INT,
    Room    NVARCHAR(30)
);
INSERT INTO Shelf VALUES (1, N'Reading room'), (2, N'Archive');
ALTER TABLE Shelf ADD Capacity INT NULL;
GO
UPDATE Shelf SET Capacity = 40 WHERE ShelfId = 1;
SELECT ShelfId, Room, Capacity FROM Shelf ORDER BY ShelfId;`,
      steps: [
        "Lines 1-4: `CREATE TABLE` defines Shelf with two columns and no rows.",
        "Line 5: the `INSERT` adds two shelves.",
        "Line 6: `ADD Capacity INT NULL` adds a third column, with no `COLUMN` keyword, and both shelves hold NULL in it.",
        "Line 7: `GO` ends the batch, so the statements below it are compiled after the new column exists.",
        "Lines 8-9: the `UPDATE` gives shelf 1 a capacity, and the Archive keeps its NULL.",
      ],
      output: `ShelfId | Room | Capacity
1 | Reading room | 40
2 | Archive | NULL`,
    },
    exercises: [
      'tsql-ddl-create-mcq-1',
      'tsql-ddl-create-cloze-1',
      'tsql-ddl-alter-mcq-1',
      'tsql-ddl-alter-predict-1',
      'tsql-ddl-alter-cloze-1',
    ],
  },
  {
    id: 'tsql_types/1',
    topicKeys: [Topic.TSQL_TYPES],
    step: 1,
    title: 'Data Types',
    idea: [
      lines(
        "A column's type fixes what it can hold and how much space each value takes.",
        "Text is `NVARCHAR(n)`, which stores any Unicode character, up to n of them.",
        "`VARCHAR` is for text you know is plain ASCII.",
      ),
      lines(
        "Whole numbers are `INT`, which tops out at about 2.1 billion, or `BIGINT` for the keys of a table that may grow past that.",
        "Money and other exact amounts are `DECIMAL(p, s)`: p digits in total, s of them after the point, so `DECIMAL(10, 2)` holds up to 99,999,999.99.",
        "A value with more than s decimals is rounded to fit.",
      ),
      lines(
        "A day is `DATE`, and a day with a time is `DATETIME2`, which has more range and precision than the older `DATETIME`.",
        "`BIT` is the yes or no flag and holds 0, 1 or NULL.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `CREATE TABLE dbo.t (
    id     BIGINT,            -- whole numbers; INT stops near 2.1 billion
    label  NVARCHAR(100),     -- Unicode text, up to 100 characters
    amount DECIMAL(p, s),     -- exact: p digits, s after the point
    day_of DATE,              -- a day
    at     DATETIME2,         -- a day and a time
    flag   BIT                -- 0, 1 or NULL
);`,
    },
    pitfall: lines(
      "`FLOAT` and `REAL` store binary approximations, so money kept in them drifts by fractions of a cent.",
      "Keep money and other exact amounts in `DECIMAL(p, s)`.",
    ),
    worked: {
      language: CodeLanguage.SQL,
      code: `CREATE TABLE Loan (
    LoanId   BIGINT,
    Borrower NVARCHAR(50),
    LateFee  DECIMAL(6, 2),
    DueOn    DATE,
    OnLoan   BIT
);
INSERT INTO Loan VALUES
    (1, N'Łukasz', 1.25, '2026-03-02', 0),
    (2, N'Ravi', 0.75, '2026-03-09', 1),
    (3, N'Ana', 2.45, '2026-03-16', 1);
SELECT Borrower, LateFee, DueOn
FROM Loan
WHERE OnLoan = 1
ORDER BY DueOn;`,
      steps: [
        "Line 2: `BIGINT` leaves room for more than 2.1 billion loans.",
        "Line 3: `NVARCHAR` stores any Unicode letter, such as the Ł in Łukasz.",
        "Line 4: `DECIMAL(6, 2)` keeps each fee exact to the cent, with up to 4 digits before the point.",
        "Lines 5-6: `DATE` holds just the day, and the `BIT` says whether the book is still out.",
        "Lines 12-15: the `WHERE` keeps the two loans with `OnLoan = 1`, earliest due day first.",
      ],
      output: `Borrower | LateFee | DueOn
Ravi | 0.75 | 2026-03-09
Ana | 2.45 | 2026-03-16`,
    },
    exercises: [
      'tsql-types-mcq-1',
      'tsql-types-mcq-2',
      'tsql-types-bigint-mcq-1',
      'tsql-types-decimal-predict-1',
      'tsql-types-cloze-1',
    ],
  },
  {
    id: 'tsql_constraints/1',
    topicKeys: [Topic.TSQL_CONSTRAINTS],
    step: 1,
    title: 'Constraints (PK, FK, CHECK)',
    idea: [
      lines(
        "Constraints are rules the table checks on every `INSERT` and `UPDATE`, so a bad row is rejected instead of stored.",
        "`NOT NULL` makes a column required, and `DEFAULT value` fills a column that an `INSERT` leaves out.",
      ),
      lines(
        "`PRIMARY KEY` is the row's identity: unique, never NULL, and one per table.",
        "`UNIQUE` forbids duplicates in another column, and a table can have several.",
        "`FOREIGN KEY (col) REFERENCES parent (col)` accepts only values that exist in the parent table, and `ON DELETE CASCADE` deletes the child rows along with their parent.",
      ),
      lines(
        "`CHECK (condition)` rejects a row when the condition is false.",
        "Name table-level constraints with `CONSTRAINT name ...`, so error messages and later changes can point at them.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `CREATE TABLE dbo.child (
    id        INT PRIMARY KEY,                -- unique + not NULL
    parent_id INT NOT NULL,                   -- required
    code      NVARCHAR(20) UNIQUE,            -- no duplicates
    qty       INT DEFAULT 0,                  -- when INSERT leaves it out
    CONSTRAINT FK_child_parent FOREIGN KEY (parent_id)
        REFERENCES dbo.parent (id) ON DELETE CASCADE,
    CONSTRAINT CK_child_qty CHECK (qty >= 0)  -- false = rejected
);`,
    },
    pitfall: lines(
      "`CHECK` rejects a row only when its condition is false, and a comparison with NULL is unknown, so a NULL passes `CHECK (qty >= 0)`.",
      "Add `NOT NULL` to the column when a missing value is not allowed either.",
    ),
    worked: {
      language: CodeLanguage.SQL,
      code: `CREATE TABLE Branch (
    BranchId INT PRIMARY KEY,
    City     NVARCHAR(40) NOT NULL UNIQUE
);
CREATE TABLE Copy (
    CopyId    INT PRIMARY KEY,
    BranchId  INT NOT NULL REFERENCES Branch (BranchId),
    Condition NVARCHAR(10) NOT NULL DEFAULT N'good',
    Price     INT NULL,
    CONSTRAINT CK_Copy_Price CHECK (Price > 0)
);
INSERT INTO Branch VALUES (1, N'Leeds'), (2, N'York');
INSERT INTO Copy (CopyId, BranchId, Price) VALUES (10, 1, 12), (11, 2, NULL);
INSERT INTO Copy VALUES (12, 2, N'worn', 8);
SELECT CopyId, BranchId, Condition, Price FROM Copy ORDER BY CopyId;`,
      steps: [
        "Lines 1-4: each branch has a `PRIMARY KEY` and a City that must be given and differ from every other branch's.",
        "Line 7: `REFERENCES Branch (BranchId)` accepts a copy only when its branch exists, so a copy for branch 3 would be rejected.",
        "Line 8: the `INSERT` on line 13 leaves Condition out, so the `DEFAULT` gives copies 10 and 11 'good'.",
        "Line 10: the named `CHECK` passes 12 and 8, and also copy 11's NULL Price, because `NULL > 0` is unknown, not false.",
        "Line 15: all three copies were stored, and a Price of 0 or a second branch in York would have been rejected.",
      ],
      output: `CopyId | BranchId | Condition | Price
10 | 1 | good | 12
11 | 2 | good | NULL
12 | 2 | worn | 8`,
    },
    exercises: [
      'tsql-constraints-mcq-1',
      'tsql-constraints-cloze-1',
      'tsql-constraints-check-predict-1',
      'tsql-constraints-fk-cloze-1',
      'tsql-constraints-check-cloze-1',
    ],
  },
  {
    id: 'tsql_views/1',
    topicKeys: [Topic.TSQL_VIEWS],
    step: 1,
    title: 'Views & Computed Columns',
    idea: [
      lines(
        "`CREATE VIEW v AS SELECT ...` saves a query under a name.",
        "The view stores no rows: each query against it runs its `SELECT` on the base tables as they are now.",
        "That makes it a stable name for a join or a filter that many queries reuse.",
      ),
      lines(
        "`CREATE VIEW` must be the only statement in its batch, so a script puts `GO` before and after it.",
        "An indexed view is the exception that stores its result: it is created `WITH SCHEMABINDING` and given a unique clustered index, and SQL Server keeps it current on every write.",
      ),
      lines(
        "A computed column, `col AS (expression)`, derives its value from other columns of the same row.",
        "By default it is worked out on every read, and `PERSISTED` stores it instead, so it can be indexed.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `CREATE VIEW dbo.v AS                 -- alone in its batch
SELECT a.col, b.col2
FROM dbo.a AS a
JOIN dbo.b AS b ON b.id = a.id;
GO
SELECT col, col2 FROM dbo.v;         -- runs the view's SELECT now

CREATE TABLE dbo.t (
    qty   INT,
    price INT,
    total AS (qty * price)           -- computed on every read
    -- total AS (qty * price) PERSISTED  -- stored, can be indexed
);`,
    },
    pitfall: lines(
      "A plain view is not a snapshot: rows added to its tables after `CREATE VIEW` show up the next time you query it.",
      "When you need a fixed copy, load a table, for example with `SELECT ... INTO`.",
    ),
    worked: {
      language: CodeLanguage.SQL,
      code: `CREATE TABLE OrderLine (
    Title     NVARCHAR(60) NOT NULL,
    Qty       INT NOT NULL,
    Price     INT NOT NULL,
    LineTotal AS (Qty * Price)
);
INSERT INTO OrderLine (Title, Qty, Price) VALUES (N'Dune', 2, 9), (N'Emma', 1, 7);
GO
CREATE VIEW BigLine AS
SELECT Title, LineTotal FROM OrderLine WHERE LineTotal >= 15;
GO
INSERT INTO OrderLine (Title, Qty, Price) VALUES (N'Ubik', 3, 5);
SELECT Title, LineTotal FROM BigLine ORDER BY LineTotal DESC;`,
      steps: [
        "Line 5: `LineTotal` is computed from Qty and Price, so the `INSERT` on line 7 gives it no value, and Dune works out to 18 and Emma to 7.",
        "Lines 9-10: the view saves a query for the lines worth 15 or more, between two `GO` lines because `CREATE VIEW` must stand alone in its batch.",
        "Line 12: Ubik, 3 times 5, is added after the view was created.",
        "Line 13: querying the view runs its `SELECT` now, so it finds Dune and Ubik, and Emma's 7 is filtered out.",
      ],
      output: `Title | LineTotal
Dune | 18
Ubik | 15`,
    },
    exercises: [
      'tsql-views-mcq-1',
      'tsql-views-predict-1',
      'tsql-views-cloze-1',
      'tsql-views-computed-cloze-1',
      'tsql-views-1',
    ],
  },
  {
    id: 'tsql_windows/1',
    topicKeys: [Topic.TSQL_WINDOWS],
    step: 1,
    title: 'Window Functions (ROW_NUMBER, RANK)',
    idea: [
      lines(
        "A window function computes a value across a set of rows and returns it on every row, so the detail rows stay.",
        "`GROUP BY` collapses each group to one row, while `OVER (...)` keeps them all and adds a column beside them.",
      ),
      lines(
        "`OVER (PARTITION BY col ORDER BY col2)` defines the window: `PARTITION BY` splits the rows into groups and restarts the numbering in each, and `ORDER BY` sets the order the numbers follow.",
        "Without `PARTITION BY` the whole result is one window.",
      ),
      lines(
        "On ties, `ROW_NUMBER()` still numbers every row uniquely (1, 2, 3), `RANK()` repeats the rank and then skips (1, 1, 3), and `DENSE_RANK()` repeats without skipping (1, 1, 2).",
        "`NTILE(n)` splits the ordered rows into n buckets of nearly equal size and labels them 1 to n.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `SELECT grp, val,                                                  -- on a tie:
  ROW_NUMBER() OVER (PARTITION BY grp ORDER BY val DESC) AS rn,   -- 1, 2, 3
  RANK()       OVER (PARTITION BY grp ORDER BY val DESC) AS rnk,  -- 1, 1, 3
  DENSE_RANK() OVER (PARTITION BY grp ORDER BY val DESC) AS drnk, -- 1, 1, 2
  NTILE(4)     OVER (ORDER BY val DESC) AS bucket                 -- 1 to 4
FROM t;`,
    },
    pitfall: lines(
      "A window function is worked out after `WHERE`, so `WHERE rn = 1` cannot see `rn` and fails.",
      "To keep the first row of each group, compute `rn` in a CTE or subquery and filter on it in the outer query.",
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'Book',
          columns: ['Title', 'Genre', 'Loans'],
          rows: [
            ['Dune', 'SciFi', 9],
            ['Emma', 'Classic', 7],
            ['Ubik', 'SciFi', 9],
            ['Hyperion', 'SciFi', 5],
            ['Beloved', 'Classic', 3],
            ['Solaris', 'SciFi', 4],
          ],
        },
      ],
      code: `SELECT Genre, Title, Loans,
       ROW_NUMBER() OVER (PARTITION BY Genre ORDER BY Loans DESC, Title) AS RowNo,
       RANK()       OVER (PARTITION BY Genre ORDER BY Loans DESC) AS RankNo,
       DENSE_RANK() OVER (PARTITION BY Genre ORDER BY Loans DESC) AS DenseNo
FROM Book
ORDER BY Genre, RowNo;`,
      steps: [
        "Line 2: `PARTITION BY Genre` restarts the numbering for each genre, and `ORDER BY Loans DESC, Title` numbers the most borrowed book 1, with Title breaking the Dune and Ubik tie so the numbers are fixed.",
        "Line 3: `RANK()` gives Dune and Ubik, both on 9 loans, rank 1, and then skips to 3 for Hyperion.",
        "Line 4: `DENSE_RANK()` gives the tie the same rank 1 but does not skip, so Hyperion is 2 and Solaris 3.",
        "Lines 5-6: every book row is still there with its three numbers beside it, and Classic sorts before SciFi.",
      ],
      output: `Genre | Title | Loans | RowNo | RankNo | DenseNo
Classic | Emma | 7 | 1 | 1 | 1
Classic | Beloved | 3 | 2 | 2 | 2
SciFi | Dune | 9 | 1 | 1 | 1
SciFi | Ubik | 9 | 2 | 1 | 1
SciFi | Hyperion | 5 | 3 | 3 | 2
SciFi | Solaris | 4 | 4 | 4 | 3`,
    },
    exercises: [
      'tsql-windows-mcq-1',
      'tsql-windows-mcq-2',
      'tsql-windows-predict-1',
      'tsql-windows-cloze-1',
      'tsql-windows-1',
    ],
  },
  {
    id: 'tsql_window_frames/1',
    topicKeys: [Topic.TSQL_WINDOW_FRAMES],
    step: 1,
    title: 'Window Frames & Running Totals',
    idea: [
      lines(
        "An aggregate with `OVER`, such as `SUM(col) OVER (...)`, totals a window of rows and returns the result on each row.",
        "With only `PARTITION BY`, the window is the whole partition, so every row of a group gets the group's total.",
      ),
      lines(
        "Adding `ORDER BY` inside `OVER` turns the window into a frame that ends at the current row.",
        "The default frame is `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`, which makes `SUM` a running total.",
      ),
      lines(
        "An explicit frame sets the window's size: `ROWS BETWEEN 2 PRECEDING AND CURRENT ROW` covers this row and the two before it, a 3-row moving window.",
        "`ROWS` counts physical rows, while `RANGE` also takes in every row that ties with the current one on the `ORDER BY` value.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `SELECT grp, d, amt,
  -- the whole partition
  SUM(amt) OVER (PARTITION BY grp) AS grp_total,
  -- first row to this row: a running total
  SUM(amt) OVER (PARTITION BY grp ORDER BY d) AS running,
  -- this row and the 2 before: a moving average
  AVG(amt) OVER (PARTITION BY grp ORDER BY d
    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS moving3
FROM t;`,
    },
    pitfall: lines(
      "The default frame is `RANGE`, so rows that tie on the `ORDER BY` value are peers and all show the same running total, which jumps by both amounts at once.",
      "Write `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` and order by something unique when each row should add only its own amount.",
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'Sale',
          columns: ['SaleId', 'Shop', 'SaleDay', 'Copies'],
          rows: [
            [1, 'Leeds', 1, 4],
            [2, 'Leeds', 2, 3],
            [3, 'Leeds', 2, 5],
            [4, 'Leeds', 3, 2],
            [5, 'York', 1, 6],
            [6, 'York', 2, 1],
          ],
        },
      ],
      code: `SELECT Shop, SaleDay, Copies,
       SUM(Copies) OVER (PARTITION BY Shop) AS ShopTotal,
       SUM(Copies) OVER (PARTITION BY Shop ORDER BY SaleDay) AS RangeRun,
       SUM(Copies) OVER (PARTITION BY Shop ORDER BY SaleDay, SaleId
                         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS RowsRun,
       SUM(Copies) OVER (PARTITION BY Shop ORDER BY SaleDay, SaleId
                         ROWS BETWEEN 1 PRECEDING AND CURRENT ROW) AS LastTwo
FROM Sale
ORDER BY Shop, SaleDay, SaleId;`,
      steps: [
        "Line 2: with no `ORDER BY` the window is the whole shop, so every Leeds row shows 14 and every York row 7.",
        "Line 3: `ORDER BY SaleDay` makes a running total with the default `RANGE` frame, and both Leeds sales on day 2 are peers, so both show 4 + 3 + 5 = 12.",
        "Lines 4-5: a `ROWS` frame ordered by SaleDay and then SaleId adds one row at a time, giving 4, 7, 12 and 14.",
        "Lines 6-7: `1 PRECEDING AND CURRENT ROW` slides a two-row window, so the third Leeds row is 3 + 5 = 8 and the fourth 5 + 2 = 7.",
        "Lines 2-7: `PARTITION BY Shop` restarts every window for York, whose running totals are 6 and 7.",
      ],
      output: `Shop | SaleDay | Copies | ShopTotal | RangeRun | RowsRun | LastTwo
Leeds | 1 | 4 | 14 | 4 | 4 | 4
Leeds | 2 | 3 | 14 | 12 | 7 | 7
Leeds | 2 | 5 | 14 | 12 | 12 | 8
Leeds | 3 | 2 | 14 | 14 | 14 | 7
York | 1 | 6 | 7 | 6 | 6 | 6
York | 2 | 1 | 7 | 7 | 7 | 7`,
    },
    exercises: [
      'tsql-frames-mcq-1',
      'tsql-frames-predict-1',
      'tsql-frames-cloze-1',
      'tsql-frames-1',
      'tsql-frames-movingavg-cloze-1',
    ],
  },
  {
    id: 'tsql_lag_lead/1',
    topicKeys: [Topic.TSQL_LAG_LEAD],
    step: 1,
    title: 'LAG / LEAD & Period-over-Period',
    idea: [
      lines(
        "`LAG(col)` reads `col` from the row before the current one in the window's order, and `LEAD(col)` reads it from the row after.",
        "Both need an `ORDER BY` in `OVER`, and `PARTITION BY` keeps each group's sequence apart.",
      ),
      lines(
        "`LAG(col, n, default)` looks n rows back and returns `default` where there is no such row; without a default, the first row gets NULL.",
        "`col - LAG(col) OVER (...)` is the change since the previous period, the heart of a period-over-period report.",
      ),
      lines(
        "`FIRST_VALUE(col)` returns the value of the first row of the ordered frame on every row, a fixed anchor such as each customer's first order.",
        "`LAST_VALUE(col)` reads the last row of the frame, and by default the frame ends at the current row.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `SELECT grp, d, amt,
  -- the row before, NULL on the first row
  LAG(amt) OVER (PARTITION BY grp ORDER BY d) AS prev_amt,
  -- the row after, 0 on the last row
  LEAD(amt, 1, 0) OVER (PARTITION BY grp ORDER BY d) AS next_amt,
  amt - LAG(amt) OVER (PARTITION BY grp ORDER BY d) AS change,
  FIRST_VALUE(amt) OVER (PARTITION BY grp ORDER BY d) AS first_amt,
  -- the whole partition's last row, not this row
  LAST_VALUE(amt) OVER (PARTITION BY grp ORDER BY d
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_amt
FROM t;`,
    },
    pitfall: lines(
      "`LAST_VALUE(col) OVER (ORDER BY d)` returns the current row's own value, because the default frame stops at the current row.",
      "Widen the frame with `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` to read the partition's real last value.",
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'MonthlyLoan',
          columns: ['Branch', 'MonthNo', 'Loans'],
          rows: [
            ['Leeds', 1, 40],
            ['Leeds', 2, 55],
            ['Leeds', 3, 50],
            ['York', 1, 20],
            ['York', 2, 30],
          ],
        },
      ],
      code: `SELECT Branch, MonthNo, Loans,
       LAG(Loans) OVER (PARTITION BY Branch ORDER BY MonthNo) AS PrevLoans,
       Loans - LAG(Loans) OVER (PARTITION BY Branch ORDER BY MonthNo) AS Change,
       LEAD(Loans, 1, 0) OVER (PARTITION BY Branch ORDER BY MonthNo) AS NextLoans,
       LAST_VALUE(Loans) OVER (PARTITION BY Branch ORDER BY MonthNo
           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastLoans
FROM MonthlyLoan
ORDER BY Branch, MonthNo;`,
      steps: [
        "Line 2: `LAG` reads the month before within the same branch, so each branch's first month has no previous row and gets NULL.",
        "Line 3: the change is this month minus the last, 15 and then -5 for Leeds, and NULL in month 1 because anything minus NULL is NULL.",
        "Line 4: `LEAD` reads the month after, and the default 0 fills each branch's last month.",
        "Lines 5-6: the full frame lets `LAST_VALUE` see the whole branch, so every Leeds row shows 50 and every York row 30.",
      ],
      output: `Branch | MonthNo | Loans | PrevLoans | Change | NextLoans | LastLoans
Leeds | 1 | 40 | NULL | NULL | 55 | 50
Leeds | 2 | 55 | 40 | 15 | 50 | 50
Leeds | 3 | 50 | 55 | -5 | 0 | 50
York | 1 | 20 | NULL | NULL | 30 | 30
York | 2 | 30 | 20 | 10 | 0 | 30`,
    },
    exercises: [
      'tsql-laglead-mcq-1',
      'tsql-laglead-predict-1',
      'tsql-laglead-cloze-1',
      'tsql-laglead-mcq-2',
      'tsql-laglead-1',
    ],
  },
  {
    id: 'tsql_grouping_sets/1',
    topicKeys: [Topic.TSQL_GROUPING_SETS],
    step: 1,
    title: 'GROUPING SETS, ROLLUP, CUBE',
    idea: [
      lines(
        "`GROUP BY ROLLUP(a, b)` returns the usual (a, b) groups, plus a subtotal for each a and one grand total, in a single query.",
        "On a subtotal row the rolled-up columns show NULL: the subtotal for an a has b = NULL, and the grand total has both NULL.",
      ),
      lines(
        "`CUBE(a, b)` gives every combination instead of a hierarchy: (a, b), (a), (b) and the grand total.",
        "`GROUPING SETS ((a, b), (a), ())` lists exactly the groupings you want, with `()` for the grand total, and ROLLUP and CUBE are shorthand for such lists.",
      ),
      lines(
        "`GROUPING(col)` returns 1 on a row where col was rolled up and 0 where col holds a real value.",
        "Use it to label subtotal rows or to sort them after the detail.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `SELECT a, b, SUM(x) AS total,
       GROUPING(b) AS b_rolled_up         -- 1 on a subtotal row for b
FROM t
GROUP BY ROLLUP(a, b);                    -- (a, b), (a), ()
-- GROUP BY CUBE(a, b);                   -- (a, b), (a), (b), ()
-- GROUP BY GROUPING SETS ((a, b), (a), ());  -- exactly these`,
    },
    pitfall: lines(
      "A NULL in a ROLLUP result is not always a subtotal: when b itself holds NULLs, the group of real NULLs looks just like the subtotal row.",
      "Test `GROUPING(b) = 1` to find the subtotals, not `b IS NULL`.",
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'Sale',
          columns: ['Genre', 'Shop', 'Copies'],
          rows: [
            ['SciFi', 'Leeds', 4],
            ['SciFi', 'York', 3],
            ['SciFi', 'Leeds', 2],
            ['Classic', 'Leeds', 5],
            ['Classic', null, 1],
          ],
        },
      ],
      code: `SELECT Genre, Shop, SUM(Copies) AS Total,
       GROUPING(Genre) AS AllGenres,
       GROUPING(Shop) AS AllShops
FROM Sale
GROUP BY ROLLUP(Genre, Shop)
ORDER BY AllGenres, Genre, AllShops, Shop;`,
      steps: [
        "Line 5: `ROLLUP(Genre, Shop)` computes three groupings in one pass: each genre and shop, each genre alone, and all rows.",
        "Lines 2-3: `GROUPING(Shop)` is 1 on the rows where Shop was rolled up, and `GROUPING(Genre)` is 1 only on the grand total.",
        "Line 3: two Classic rows show a NULL Shop, but the first is the sale with no shop recorded (AllShops 0) and the third is the Classic subtotal of 6 (AllShops 1).",
        "Line 6: sorting on the two flags puts each genre's subtotal after its shops and the grand total of 15 last.",
      ],
      output: `Genre | Shop | Total | AllGenres | AllShops
Classic | NULL | 1 | 0 | 0
Classic | Leeds | 5 | 0 | 0
Classic | NULL | 6 | 0 | 1
SciFi | Leeds | 6 | 0 | 0
SciFi | York | 3 | 0 | 0
SciFi | NULL | 9 | 0 | 1
NULL | NULL | 15 | 1 | 1`,
    },
    exercises: [
      'tsql-gs-mcq-1',
      'tsql-gs-rollup-predict-1',
      'tsql-gs-cloze-1',
      'tsql-gs-cube-cloze-1',
      'tsql-gs-groupingfn-cloze-1',
    ],
  },
  {
    id: 'tsql_pivot/1',
    topicKeys: [Topic.TSQL_PIVOT],
    step: 1,
    title: 'PIVOT & Conditional Aggregation',
    idea: [
      lines(
        "A pivot turns the values of one column into columns of their own, with an aggregate under each.",
        "Instead of a row per shop and genre, you get one row per shop with a column per genre.",
      ),
      lines(
        "The portable way is conditional aggregation: one `SUM(CASE WHEN col = 'x' THEN val ELSE 0 END)` per new column, and `GROUP BY` for the rows you keep.",
        "Each CASE passes a row's value only to its own column, and without `GROUP BY` the whole table collapses to one row.",
      ),
      lines(
        "T-SQL's `PIVOT (SUM(val) FOR col IN ([x], [y])) AS p` does the same inside `FROM`, grouping by every input column it does not pivot, so feed it a subquery of just the columns it needs.",
        "`UNPIVOT` is the reverse and turns columns back into rows of a name and a value.",
        "Either way the new columns are listed by hand, because neither form discovers them.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `-- portable: one SUM(CASE ...) per new column
SELECT grp,
       SUM(CASE WHEN col = 'x' THEN val ELSE 0 END) AS x,
       SUM(CASE WHEN col = 'y' THEN val ELSE 0 END) AS y
FROM t
GROUP BY grp;

-- T-SQL PIVOT: the new columns are fixed in IN (...)
SELECT grp, [x], [y]
FROM (SELECT grp, col, val FROM t) AS src
PIVOT (SUM(val) FOR col IN ([x], [y])) AS p;`,
    },
    pitfall: lines(
      "Without `ELSE 0`, a CASE gives NULL on the rows it does not match, so a group with no matching rows at all shows NULL in that column, not 0.",
      "Write `ELSE 0` when a missing combination should read as zero.",
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'Sale',
          columns: ['Shop', 'Genre', 'Copies'],
          rows: [
            ['Leeds', 'SciFi', 4],
            ['Leeds', 'Classic', 5],
            ['Leeds', 'SciFi', 2],
            ['York', 'SciFi', 3],
            ['York', 'Poetry', 1],
          ],
        },
      ],
      code: `SELECT Shop,
       SUM(CASE WHEN Genre = 'SciFi' THEN Copies ELSE 0 END) AS SciFi,
       SUM(CASE WHEN Genre = 'Classic' THEN Copies ELSE 0 END) AS Classic,
       SUM(Copies) AS AllCopies
FROM Sale
GROUP BY Shop
ORDER BY Shop;`,
      steps: [
        "Line 2: a row adds its Copies to SciFi only when its genre is SciFi, so Leeds gets 4 + 2 = 6 and York 3.",
        "Line 3: York sold no Classic books, and `ELSE 0` makes its Classic 0, where without it the column would be NULL.",
        "Line 4: the plain `SUM` still counts every genre, including York's Poetry sale, which has no column of its own.",
        "Line 6: `GROUP BY Shop` keeps one row per shop, and the genres have become its columns.",
      ],
      output: `Shop | SciFi | Classic | AllCopies
Leeds | 6 | 5 | 11
York | 3 | 0 | 4`,
    },
    exercises: [
      'tsql-pivot-mcq-1',
      'tsql-pivot-predict-1',
      'tsql-pivot-cloze-1',
      'tsql-pivot-native-cloze-1',
      'tsql-pivot-1',
    ],
  },
  {
    id: 'tsql_transactions/1',
    topicKeys: [Topic.TSQL_TRANSACTIONS],
    step: 1,
    title: 'Transactions (BEGIN TRAN, COMMIT, ROLLBACK)',
    idea: [
      lines(
        "A transaction makes a group of statements one unit of work: either all of their changes are kept or none are.",
        "`BEGIN TRAN` opens it, `COMMIT` makes every change since then permanent together, and `ROLLBACK` undoes all of them.",
        "Without `BEGIN TRAN`, each statement is its own transaction and commits as soon as it finishes.",
      ),
      lines(
        "`@@TRANCOUNT` counts how many transactions opened with `BEGIN TRAN` are still open on the connection.",
        "A nested `BEGIN TRAN` only adds 1: the inner `COMMIT` takes 1 away and commits nothing, and only the outermost `COMMIT` makes the work permanent.",
        "A bare `ROLLBACK` undoes everything back to the outermost `BEGIN TRAN` and sets the count to 0.",
      ),
      lines(
        "`SAVE TRAN name` marks a savepoint, and `ROLLBACK TRAN name` undoes only the work after it, leaving the transaction open.",
        "`SET XACT_ABORT ON` makes most run-time errors end the whole transaction instead of failing just one statement.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `SET XACT_ABORT ON;                 -- an error ends the whole transaction
BEGIN TRAN;                        -- @@TRANCOUNT 0 -> 1
    UPDATE t SET col = col - n WHERE id = 1;
    SAVE TRAN sp;                  -- a savepoint
    UPDATE t SET col = col + n WHERE id = 2;
    ROLLBACK TRAN sp;              -- undo back to sp, still open
COMMIT;                            -- keep it all (ROLLBACK: undo it all)`,
    },
    pitfall: lines(
      "Without `SET XACT_ABORT ON`, an error such as a constraint violation fails only its own statement: the next statement still runs and the transaction stays open.",
      "A script that then reaches `COMMIT` keeps half the work, so turn `XACT_ABORT` on, or handle the error with `TRY ... CATCH`.",
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'Shelf',
          columns: ['Branch', 'Copies'],
          rows: [
            ['North', 5],
            ['South', 2],
          ],
        },
      ],
      code: `BEGIN TRAN;
UPDATE Shelf SET Copies = Copies - 3 WHERE Branch = 'North';
UPDATE Shelf SET Copies = Copies + 3 WHERE Branch = 'South';
COMMIT;
BEGIN TRAN;
UPDATE Shelf SET Copies = Copies - 10 WHERE Branch = 'North';
SELECT Branch, Copies FROM Shelf ORDER BY Branch;
ROLLBACK;
SELECT Branch, Copies FROM Shelf ORDER BY Branch;`,
      steps: [
        "Lines 1-4: moving 3 copies is two updates in one transaction, so North drops to 2 and South rises to 5 together at the `COMMIT`.",
        "Line 6: a second transaction takes 10 copies from North by mistake, leaving -8.",
        "Line 7: inside its own open transaction the session sees that change, so the first result shows North at -8.",
        "Lines 8-9: `ROLLBACK` undoes everything since line 5, and the second result is back to the committed 2 and 5.",
      ],
      output: `Branch | Copies
North | -8
South | 5

Branch | Copies
North | 2
South | 5`,
    },
    exercises: [
      'tsql-tran-mcq-1',
      'tsql-tran-cloze-1',
      'tsql-tran-xact-mcq-1',
      'tsql-tran-predict-1',
      'tsql-tran-1',
    ],
  },
  {
    id: 'tsql_isolation/1',
    topicKeys: [Topic.TSQL_ISOLATION],
    step: 1,
    title: 'Isolation Levels & Locking',
    idea: [
      lines(
        "Isolation decides how much of another transaction's unfinished work yours can see.",
        "SQL Server enforces it with locks: readers take shared locks, and writers take exclusive locks that they hold until they commit.",
        "`SET TRANSACTION ISOLATION LEVEL ...` sets the level for the session's transactions from then on.",
      ),
      lines(
        "`READ UNCOMMITTED` reads without locks, so it can see a change that is later rolled back: a dirty read.",
        "`READ COMMITTED`, the default, sees only committed data, but a row read twice can change in between: a non-repeatable read.",
        "`REPEATABLE READ` keeps the rows it read locked until the end, and `SERIALIZABLE` also locks the range, so no new matching row, a phantom, can appear.",
      ),
      lines(
        "`SNAPSHOT` reads the data as it was committed when the transaction started, from row versions, so readers and writers do not block each other.",
        "A table hint sets the locking of one table in one statement: `WITH (UPDLOCK)` reads a row with an update lock, so a second session that wants to change it has to wait.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `SET TRANSACTION ISOLATION LEVEL READ COMMITTED;   -- the default
--   READ UNCOMMITTED   dirty reads possible, like WITH (NOLOCK)
--   READ COMMITTED     no dirty reads
--   REPEATABLE READ    and rows read cannot change
--   SERIALIZABLE       and no phantom rows
--   SNAPSHOT           versioned reads, no blocking
BEGIN TRAN;
SELECT col FROM t WITH (UPDLOCK) WHERE id = 1;    -- reserve the row
UPDATE t SET col = col - 1 WHERE id = 1;
COMMIT;`,
    },
    pitfall: lines(
      "`WITH (NOLOCK)` is not a free speed-up: it is READ UNCOMMITTED for that table, so a report can count changes that are rolled back, and skip or double-count rows that move while it reads.",
      "Keep it for numbers that may be rough, and use SNAPSHOT when readers must not block writers.",
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'Stock',
          columns: ['BookId', 'Copies'],
          rows: [
            [1, 1],
            [2, 4],
          ],
        },
      ],
      code: `SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
DECLARE @left INT;
BEGIN TRAN;
SELECT @left = Copies FROM Stock WITH (UPDLOCK, HOLDLOCK) WHERE BookId = 1;
IF @left > 0
    UPDATE Stock SET Copies = @left - 1 WHERE BookId = 1;
COMMIT;
SELECT BookId, Copies FROM Stock ORDER BY BookId;`,
      steps: [
        "Line 1: READ COMMITTED is the default, so this line only makes it explicit.",
        "Line 4: the session reads the last copy of book 1 into `@left` and holds an update lock on the row until `COMMIT`.",
        "Lines 5-6: with a copy left, it takes one, and the result shows book 1 at 0.",
        "Without the hint, a second session running the same code could read 1 before the first one updates, and both would sell the same copy.",
        "With it, the second session's line 4 waits until the first commits, then reads 0 and skips the update.",
      ],
      output: `BookId | Copies
1 | 0
2 | 4`,
    },
    exercises: [
      'tsql-iso-mcq-1',
      'tsql-iso-predict-1',
      'tsql-iso-mcq-3',
      'tsql-iso-mcq-4',
      'tsql-iso-cloze-2',
    ],
  },
  {
    id: 'tsql_procedures/1',
    topicKeys: [Topic.TSQL_PROCEDURES],
    step: 1,
    title: 'Stored Procedures',
    idea: [
      lines(
        "A stored procedure saves statements under a name, with parameters, so a scheduled job or a caller runs them with one `EXEC`.",
        "Parameters follow the name as `@name TYPE`, separated by commas and with no parentheses needed, and `= value` gives one a default.",
        "The body goes between `AS BEGIN` and `END`, and `CREATE PROCEDURE` must be alone in its batch.",
      ),
      lines(
        "A procedure hands results back in three ways.",
        "A `SELECT` in the body returns a result set to the caller.",
        "An `OUTPUT` parameter carries a value of any type back into the caller's variable.",
        "`RETURN n` ends the procedure at once with an integer status code, 0 for success by convention, which the caller reads with `EXEC @rc = name ...`.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `CREATE PROCEDURE dbo.name
    @in  INT,                   -- input
    @opt INT = 10,              -- input with a default
    @out INT OUTPUT             -- sent back to the caller
AS
BEGIN
    IF @in < 0 RETURN 1;        -- leave now with status 1
    SELECT @out = COUNT(*) FROM dbo.t WHERE col >= @in;
    RETURN 0;                   -- success
END;
GO
DECLARE @result INT, @rc INT;
EXEC @rc = dbo.name @in = 5, @out = @result OUTPUT;  -- OUTPUT here too`,
    },
    pitfall: lines(
      "`OUTPUT` has to be written twice: on the parameter in the header and after the argument in the `EXEC`.",
      "Leave it off the call and the procedure still runs, but the caller's variable keeps the value it had before.",
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'Loan',
          columns: ['LoanId', 'Member', 'Returned'],
          rows: [
            [1, 'Ada', 1],
            [2, 'Ada', 0],
            [3, 'Ben', 0],
            [4, 'Ada', 0],
          ],
        },
      ],
      code: `CREATE PROCEDURE OpenLoans @Member NVARCHAR(40), @Open INT OUTPUT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Loan WHERE Member = @Member)
        RETURN 1;
    SELECT @Open = COUNT(*) FROM Loan WHERE Member = @Member AND Returned = 0;
    RETURN 0;
END;
GO
DECLARE @n INT, @rc INT;
EXEC @rc = OpenLoans @Member = N'Ada', @Open = @n OUTPUT;
SELECT @rc AS Status, @n AS OpenLoans;
EXEC @rc = OpenLoans N'Cy', @n OUTPUT;
SELECT @rc AS Status, @n AS OpenLoans;`,
      steps: [
        "Line 1: the procedure takes a member's name and sends a count back through `@Open`.",
        "Lines 4-5: for a member with no loans at all it leaves at once with status 1.",
        "Line 11: for Ada, `@Open = @n OUTPUT` copies her 2 open loans into `@n`, and `@rc` gets the 0 from line 7.",
        "Line 13: the arguments go by position this time, and Cy has no loans, so `@rc` is 1.",
        "The procedure never set `@Open` for Cy, and an OUTPUT parameter starts with the value passed in, so `@n` comes back as 2.",
      ],
      output: `Status | OpenLoans
0 | 2

Status | OpenLoans
1 | 2`,
    },
    exercises: [
      'tsql-proc-mcq-1',
      'tsql-proc-cloze-1',
      'tsql-proc-output-mcq-1',
      'tsql-proc-predict-1',
      'tsql-proc-1',
    ],
  },
  {
    id: 'tsql_control_flow/1',
    topicKeys: [Topic.TSQL_CONTROL_FLOW],
    step: 1,
    title: 'Control Flow & Functions',
    idea: [
      lines(
        "`IF condition` runs the one statement after it when the condition is true, and `ELSE` runs the one after it otherwise.",
        "A condition that is NULL counts as false, so the `ELSE` branch runs.",
        "`WHILE condition` checks before every pass and repeats its statement until the condition is false.",
        "`BREAK` leaves the loop, and `CONTINUE` goes straight to the next check.",
      ),
      lines(
        "Variables hold values inside one batch: `DECLARE @v INT = 1;` creates one, and `SET @v = ...` changes it.",
        "`GO` ends the batch, and its variables end with it.",
      ),
      lines(
        "A scalar function, `CREATE FUNCTION ... RETURNS type`, works out one value from its parameters and hands it back with `RETURN`.",
        "Unlike a procedure it is used inside an expression, as in `SELECT dbo.f(col) FROM t`, and it cannot change data.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `DECLARE @i INT = 1;              -- lives until the next GO
IF @i > 0
    PRINT 'positive';            -- one statement: no block needed
ELSE
BEGIN                            -- several statements: BEGIN ... END
    PRINT 'not positive';
    SET @i = 1;
END
WHILE @i < 100                   -- checked before every pass
BEGIN
    SET @i = @i * 10;            -- BREAK leaves, CONTINUE checks again
END
GO
CREATE FUNCTION dbo.f (@x INT) RETURNS INT
AS BEGIN RETURN @x + 1; END;     -- used as SELECT dbo.f(col) FROM t`,
    },
    pitfall: lines(
      "`IF` and `WHILE` govern exactly one statement.",
      "To run several, wrap them in `BEGIN ... END`; otherwise only the first one is conditional, and a loop whose counter update falls outside the block never ends.",
    ),
    worked: {
      language: CodeLanguage.SQL,
      code: `CREATE FUNCTION dbo.LateFee (@DaysLate INT) RETURNS INT
AS
BEGIN
    IF @DaysLate <= 0 RETURN 0;
    RETURN @DaysLate * 5;
END;
GO
DECLARE @day INT = 0;
WHILE @day < 5
BEGIN
    SET @day = @day + 2;
    PRINT CONCAT('day ', @day, ': fee ', dbo.LateFee(@day - 3));
END`,
      steps: [
        "Lines 1-6: the function returns 0 for a book that is not late yet, and 5 per late day otherwise.",
        "Lines 8-9: `@day` starts at 0, and the loop runs while it is below 5.",
        "Lines 10-13: the two statements in `BEGIN ... END` both repeat, so each pass adds 2 days and prints the fee for that day, with the first 3 days free.",
        "The check comes before each pass, so `@day` = 4 still passes it, and that pass prints day 6 before the loop stops.",
      ],
      output: `day 2: fee 0
day 4: fee 5
day 6: fee 15`,
    },
    exercises: [
      'tsql-flow-mcq-1',
      'tsql-flow-func-mcq-1',
      'tsql-flow-predict-1',
      'tsql-flow-while-predict-1',
      'tsql-flow-1',
    ],
  },
  {
    id: 'tsql_error_handling/1',
    topicKeys: [Topic.TSQL_ERROR_HANDLING],
    step: 1,
    title: 'Error Handling (TRY…CATCH)',
    idea: [
      lines(
        "`BEGIN TRY ... END TRY` wraps the work, and `BEGIN CATCH ... END CATCH` right after it handles a failure.",
        "When a statement in TRY raises an error, the rest of TRY is skipped and CATCH runs; when nothing fails, CATCH is skipped.",
      ),
      lines(
        "Inside CATCH, `ERROR_NUMBER()` and `ERROR_MESSAGE()` describe the error that led there.",
        "`THROW 50001, 'message', 1;` raises your own error, with a number from 50000 up.",
        "A bare `THROW;` in CATCH raises the caught error again unchanged, which `RAISERROR`, the older statement, cannot do.",
      ),
      lines(
        "In a transaction, `COMMIT` is the last statement of TRY.",
        "`XACT_STATE()` tells CATCH what is left: 1 for an open transaction, -1 for one that can only be rolled back, and 0 for none.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `SET XACT_ABORT ON;
BEGIN TRY
    BEGIN TRAN;
    UPDATE t SET col = col - n WHERE id = 1;
    IF @bad = 1 THROW 50001, 'message', 1;   -- your own error
    COMMIT;                                  -- last statement of TRY
END TRY
BEGIN CATCH
    IF XACT_STATE() <> 0 ROLLBACK;           -- undo first
    -- ERROR_NUMBER(), ERROR_MESSAGE() describe the error
    THROW;                                   -- pass it on unchanged
END CATCH`,
    },
    pitfall: lines(
      "An error in TRY skips everything after it, including the `COMMIT`, so the transaction is still open when CATCH starts.",
      "Roll it back first, then end with `THROW;`: a CATCH that only prints the error leaves the caller and the job believing the work succeeded.",
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'Shelf',
          columns: ['Title', 'Copies'],
          rows: [
            ['Dune', 2],
            ['Emma', 1],
          ],
        },
      ],
      code: `SET XACT_ABORT ON;
BEGIN TRY
    BEGIN TRAN;
    UPDATE Shelf SET Copies = Copies - 1 WHERE Title = 'Dune';
    IF NOT EXISTS (SELECT 1 FROM Shelf WHERE Title = 'Ubik')
        THROW 50001, 'Ubik is not on the shelf', 1;
    COMMIT;
END TRY
BEGIN CATCH
    IF XACT_STATE() <> 0 ROLLBACK;
    PRINT CONCAT(ERROR_NUMBER(), ': ', ERROR_MESSAGE());
END CATCH
SELECT Title, Copies FROM Shelf ORDER BY Title;`,
      steps: [
        "Line 4: the loan of Dune takes its copies from 2 to 1 inside the open transaction.",
        "Lines 5-6: Ubik is not in the table, so `THROW` raises error 50001, and line 7's `COMMIT` never runs.",
        "Line 10: CATCH finds the transaction still there and rolls it back, which puts Dune back at 2.",
        "Line 11: the error's number and message are printed, and the final `SELECT` shows both titles unchanged.",
        "A load procedure would end its CATCH with `THROW;` as well, so the job that called it fails too.",
      ],
      output: `50001: Ubik is not on the shelf

Title | Copies
Dune | 2
Emma | 1`,
    },
    exercises: [
      'tsql-err-mcq-1',
      'tsql-err-throw-mcq-1',
      'tsql-err-predict-1',
      'tsql-err-cloze-1',
      'tsql-err-parsons-1',
    ],
  },
  {
    id: 'tsql_facts_dims/1',
    topicKeys: [Topic.TSQL_FACTS_DIMS],
    step: 1,
    title: 'Facts & Dimensions',
    idea: [
      lines(
        "A dimensional model splits data into two kinds of table.",
        "A fact table records events, such as a sale or a loan: one row per event, holding foreign keys to the dimensions and numeric measures such as `Quantity` or `Amount`.",
        "A dimension table holds the descriptive context you filter and group by, such as a customer's name or a product's category.",
        "Facts are tall and narrow; dimensions are short and wide.",
      ),
      lines(
        "The grain says what one fact row means, for example one product on one order.",
        "Declare it first: every measure must belong to that grain, and every dimension must apply to every row.",
      ),
      lines(
        "Most measures are additive and sum across every dimension.",
        "A balance in a daily snapshot is semi-additive: it sums across accounts on one day, but not across days.",
        "An order or invoice number with no attributes of its own stays in the fact as a degenerate dimension, with no table of its own.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `CREATE TABLE FactT (                                   -- grain: one <thing> per <event>
    FactKey   BIGINT IDENTITY PRIMARY KEY,
    AKey      INT NOT NULL REFERENCES DimA (AKey),     -- foreign keys to dimensions
    BKey      INT NOT NULL REFERENCES DimB (BKey),
    DocNumber VARCHAR(20) NOT NULL,                    -- degenerate dimension
    measure1  INT NOT NULL,                            -- measures of this grain
    measure2  DECIMAL(12, 2) NOT NULL
);`,
    },
    pitfall: lines(
      "Storing a measure of a coarser grain on a finer fact row, such as each order's total on every one of its lines, makes `SUM` count it once per line.",
      "Keep only measures of the declared grain, and get the order total by summing the lines.",
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'DimBook',
          columns: ['BookKey', 'Title', 'Genre'],
          rows: [
            [1, 'Dune', 'SciFi'],
            [2, 'Emma', 'Classic'],
            [3, 'Ubik', 'SciFi'],
          ],
        },
        {
          name: 'FactLoanLine',
          columns: ['LoanNumber', 'BookKey', 'Copies', 'Fee'],
          rows: [
            ['L1', 1, 1, 2],
            ['L1', 2, 2, 0],
            ['L2', 1, 1, 3],
            ['L3', 3, 1, 0],
          ],
        },
      ],
      code: `-- Grain: one book on one loan
SELECT b.Genre,
       COUNT(DISTINCT f.LoanNumber) AS Loans,
       SUM(f.Copies) AS Copies,
       SUM(f.Fee) AS Fees
FROM FactLoanLine AS f
JOIN DimBook AS b ON b.BookKey = f.BookKey
GROUP BY b.Genre
ORDER BY b.Genre;`,
      steps: [
        "Line 1: the grain is one book on one loan, so loan L1, which took two books, is two rows.",
        "Line 3: `LoanNumber` is a degenerate dimension; counting its distinct values counts loans, where `COUNT(*)` would count lines.",
        "Lines 4-5: `Copies` and `Fee` belong to the line grain and are additive, so summing them per genre is safe.",
        "Lines 6-8: the fact joins `DimBook` on its key and groups by the dimension attribute `Genre`.",
        "SciFi has three loans (L1, L2, L3), three copies and fees of 2 + 3 = 5; Classic has loan L1's two copies of Emma.",
      ],
      output: `Genre | Loans | Copies | Fees
Classic | 1 | 2 | 0
SciFi | 3 | 3 | 5`,
    },
    exercises: [
      'tsql-facts-mcq-1',
      'tsql-facts-mcq-2',
      'tsql-facts-predict-1',
      'tsql-facts-cloze-1',
      'tsql-facts-1',
    ],
  },
  {
    id: 'tsql_surrogate_keys/1',
    topicKeys: [Topic.TSQL_SURROGATE_KEYS],
    step: 1,
    title: 'Surrogate Keys',
    idea: [
      lines(
        "A surrogate key is a compact integer the warehouse assigns to each dimension row, such as `CustomerKey`, and facts store and join on it.",
        "The source system's own identifier, the natural or business key such as `CustomerId`, stays in the dimension as an ordinary attribute so loads can look the surrogate up.",
      ),
      lines(
        "Because the warehouse owns the surrogate, it survives the source renumbering its ids or two sources using the same id.",
        "It also lets one business key have several dimension rows over time, which Slowly Changing Dimensions need.",
      ),
      lines(
        "`IDENTITY(1, 1)` on the key column numbers rows as they are inserted, starting at 1 and adding 1.",
        "A `SEQUENCE` is a separate object: `NEXT VALUE FOR seq` hands out a number before the insert, and several tables can share it.",
        "Both leave gaps, since a deleted or rolled-back number is never handed out again.",
        "The date dimension is the usual exception, keyed by a readable `yyyymmdd` integer such as `20260628`.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `CREATE TABLE DimT (
    TKey  INT IDENTITY(1, 1) PRIMARY KEY,   -- surrogate: the warehouse assigns it
    TCode VARCHAR(20) NOT NULL,             -- natural key from the source
    attr  VARCHAR(100) NULL
);
CREATE SEQUENCE seq AS INT START WITH 1 INCREMENT BY 1;   -- standalone generator
-- Fact load: look the surrogate up by the natural key
INSERT INTO FactT (TKey, measure)
SELECT d.TKey, s.measure
FROM stg AS s
JOIN DimT AS d ON d.TCode = s.TCode;`,
    },
    pitfall: lines(
      "Copying the source id into the fact, and joining on it, ties the warehouse to the source system and breaks once a dimension keeps several versions of one entity.",
      "Facts hold the surrogate key; the load looks it up by natural key.",
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'DimMember',
          columns: ['MemberKey', 'MemberId', 'FullName'],
          rows: [
            [1, 'M-204', 'Ada Ross'],
            [2, 'M-311', 'Ben Okafor'],
            [3, 'M-090', 'Cy Lund'],
          ],
        },
        {
          name: 'StgLoan',
          columns: ['LoanNumber', 'MemberId', 'Copies'],
          rows: [
            ['L-1', 'M-311', 2],
            ['L-2', 'M-204', 1],
            ['L-3', 'M-311', 1],
          ],
        },
      ],
      code: `CREATE TABLE FactLoan (
    LoanNumber VARCHAR(10) NOT NULL,
    MemberKey  INT NOT NULL,
    Copies     INT NOT NULL
);
INSERT INTO FactLoan (LoanNumber, MemberKey, Copies)
SELECT s.LoanNumber, d.MemberKey, s.Copies
FROM StgLoan AS s
JOIN DimMember AS d ON d.MemberId = s.MemberId;
SELECT LoanNumber, MemberKey, Copies FROM FactLoan ORDER BY LoanNumber;`,
      steps: [
        "`DimMember` is shown after its load: `IDENTITY` gave the members keys 1, 2 and 3 in the order they arrived, and each keeps its source `MemberId`.",
        "Line 3: the fact stores `MemberKey`, the surrogate, and no source id.",
        "Lines 6-9: the load joins each staged loan to the dimension on the natural key and takes the surrogate it finds there.",
        "Line 10: loans L-1 and L-3 belong to M-311, so both get key 2; L-2 belongs to M-204 and gets key 1.",
      ],
      output: `LoanNumber | MemberKey | Copies
L-1 | 2 | 2
L-2 | 1 | 1
L-3 | 2 | 1`,
    },
    exercises: [
      'tsql-surr-cloze-1',
      'tsql-surr-mcq-1',
      'tsql-surr-mcq-2',
      'tsql-surr-predict-1',
      'tsql-surr-1',
    ],
  },
  {
    id: 'tsql_star_schema/1',
    topicKeys: [Topic.TSQL_STAR_SCHEMA],
    step: 1,
    title: 'Star Schema',
    idea: [
      lines(
        "A star schema puts one fact table in the middle, with each dimension one join away on its surrogate key.",
        "A star query joins the fact to the dimensions it needs, groups by dimension attributes, and aggregates the fact's measures.",
      ),
      lines(
        "Star dimensions are denormalized: `Category` and `Department` sit on `DimProduct` itself, not in tables of their own.",
        "A snowflake schema normalizes them into chains such as `DimProduct` to `DimCategory` to `DimDepartment`, which stores less repeated text but adds a join per level.",
      ),
      lines(
        "A conformed dimension, such as one shared `DimDate` or `DimProduct`, has the same keys and meaning in several facts.",
        "That is what lets sales and returns be compared side by side on one row.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `SELECT a.attr, b.attr, SUM(f.measure) AS total
FROM FactT AS f
JOIN DimA AS a ON a.AKey = f.AKey     -- one join per dimension
JOIN DimB AS b ON b.BKey = f.BKey     -- on the surrogate key
GROUP BY a.attr, b.attr;              -- group by dimension attributes
-- A source key with no dimension row loads as the Unknown member (key -1)`,
    },
    pitfall: lines(
      "An inner join silently drops fact rows whose key has no dimension row, so the totals come out smaller than the fact.",
      "Give every dimension an Unknown member row, often key -1, and point unmatched keys at it during the load, so every fact row joins.",
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'DimBook',
          columns: ['BookKey', 'Title', 'Genre'],
          rows: [
            [-1, 'Unknown', 'Unknown'],
            [1, 'Dune', 'SciFi'],
            [2, 'Emma', 'Classic'],
          ],
        },
        {
          name: 'DimShop',
          columns: ['ShopKey', 'City'],
          rows: [
            [1, 'Leeds'],
            [2, 'York'],
          ],
        },
        {
          name: 'FactSale',
          columns: ['BookKey', 'ShopKey', 'Price'],
          rows: [
            [1, 1, 12],
            [2, 1, 8],
            [1, 2, 9],
            [-1, 2, 6],
            [2, 2, 4],
          ],
        },
      ],
      code: `SELECT s.City, b.Genre, SUM(f.Price) AS Sales
FROM FactSale AS f
JOIN DimBook AS b ON b.BookKey = f.BookKey
JOIN DimShop AS s ON s.ShopKey = f.ShopKey
GROUP BY s.City, b.Genre
ORDER BY s.City, b.Genre;`,
      steps: [
        "Lines 3-4: one join per dimension, each on its surrogate key, so no dimension is more than one hop from the fact.",
        "Line 5: grouping by `City` and `Genre` gives one row per shop city and genre that has sales.",
        "The York sale of 6 came in with a book the dimension did not know yet; the load gave it key -1, the Unknown member, so it still joins and shows as its own row.",
        "The five totals add up to 39, the whole of `FactSale`; without the -1 row the inner joins would report 33.",
      ],
      output: `City | Genre | Sales
Leeds | Classic | 8
Leeds | SciFi | 12
York | Classic | 4
York | SciFi | 9
York | Unknown | 6`,
    },
    exercises: [
      'tsql-star-mcq-1',
      'tsql-star-mcq-3',
      'tsql-star-predict-1',
      'tsql-star-cloze-1',
      'tsql-star-1',
    ],
  },
  {
    id: 'tsql_scd/1',
    topicKeys: [Topic.TSQL_SCD],
    step: 1,
    title: 'Slowly Changing Dimensions',
    idea: [
      lines(
        "A Slowly Changing Dimension type says what a load does when a dimension attribute changes in the source, such as a customer's city.",
        "Type 1 overwrites the row: the dimension shows only the latest value, and old facts report it too.",
      ),
      lines(
        "Type 2 keeps history: the load closes the current row and inserts a new version with its own surrogate key.",
        "Each version carries `EffectiveDate`, `EndDate` (NULL while open) and an `IsCurrent` flag, so a business key has one current row and any number of expired ones.",
        "Facts keep the key of the version that was current when they happened.",
      ),
      lines(
        "A Type 1 load is one `MERGE` on the natural key: `WHEN MATCHED` updates, `WHEN NOT MATCHED BY TARGET` inserts.",
        "A Type 2 load runs two steps: expire the current rows whose tracked attribute changed, then insert a current row for every business key left without one.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `-- Type 1: overwrite
MERGE dim AS t USING stg AS s ON t.code = s.code
WHEN MATCHED THEN UPDATE SET t.attr = s.attr
WHEN NOT MATCHED BY TARGET THEN INSERT (code, attr) VALUES (s.code, s.attr);
-- Type 2, step 1: expire the current rows that changed
UPDATE t SET t.EndDate = @today, t.IsCurrent = 0
FROM dim AS t JOIN stg AS s ON s.code = t.code
WHERE t.IsCurrent = 1 AND t.attr <> s.attr;
-- Type 2, step 2: a new current row where none is left
INSERT INTO dim (code, attr, EffectiveDate, EndDate, IsCurrent)
SELECT s.code, s.attr, @today, NULL, 1 FROM stg AS s
WHERE NOT EXISTS (SELECT 1 FROM dim AS d
                  WHERE d.code = s.code AND d.IsCurrent = 1);`,
    },
    pitfall: lines(
      "An expire step that leaves out `IsCurrent = 1` or the changed-value test closes rows that did not change, and the insert step then adds a new version of them on every run.",
      "Expire only current rows whose tracked attribute differs, and never delete a version: the history is what Type 2 is for.",
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'DimMember',
          columns: ['MemberKey', 'MemberId', 'City', 'EffectiveDate', 'EndDate', 'IsCurrent'],
          rows: [
            [1, 'M-1', 'Leeds', '2025-01-10', '2026-03-01', 0],
            [2, 'M-2', 'Bath', '2025-06-02', null, 1],
            [3, 'M-1', 'York', '2026-03-01', null, 1],
          ],
        },
        {
          name: 'StgLoan',
          columns: ['LoanNumber', 'MemberId', 'LoanDate'],
          rows: [
            ['L-1', 'M-1', '2026-02-14'],
            ['L-2', 'M-1', '2026-03-05'],
            ['L-3', 'M-2', '2026-03-05'],
          ],
        },
      ],
      code: `-- Fact load: the version that was valid on the loan date
SELECT l.LoanNumber, d.MemberKey, d.City
FROM StgLoan AS l
JOIN DimMember AS d
  ON d.MemberId = l.MemberId
 AND l.LoanDate >= d.EffectiveDate
 AND (d.EndDate IS NULL OR l.LoanDate < d.EndDate)
ORDER BY l.LoanNumber;
-- Today's view: current rows only
SELECT MemberId, City FROM DimMember WHERE IsCurrent = 1 ORDER BY MemberId;`,
      steps: [
        "The table shows member M-1's move from Leeds to York on 2026-03-01: the load set `EndDate` and `IsCurrent = 0` on key 1 and inserted key 3 as the current version.",
        "Lines 5-7: a fact load matches the natural key and the date window, so each loan finds exactly one version; `EndDate` is exclusive, and NULL means the version is still open.",
        "L-1 on 2026-02-14 falls before the move and gets key 1 and Leeds; L-2 after it gets key 3 and York, and both keep those keys from now on.",
        "Line 10: `IsCurrent = 1` is the cheap filter for today's values, one row per member.",
      ],
      output: `LoanNumber | MemberKey | City
L-1 | 1 | Leeds
L-2 | 3 | York
L-3 | 2 | Bath

MemberId | City
M-1 | York
M-2 | Bath`,
    },
    exercises: [
      'tsql-scd-mcq-1',
      'tsql-scd-mcq-2',
      'tsql-scd-predict-1',
      'tsql-scd-cloze-1',
      'tsql-scd-parsons-1',
    ],
  },
  {
    id: 'tsql_normalization/1',
    topicKeys: [Topic.TSQL_NORMALIZATION],
    step: 1,
    title: 'Normalization Tradeoffs',
    idea: [
      lines(
        "Normalizing splits tables so each fact is stored in exactly one place: a customer's name lives in one Customer row, and orders refer to it by `CustomerId`.",
        "A column that depends on something other than the whole key, such as `CustomerName` on an order row, breaks the normal forms (2NF and 3NF) and belongs in its own table.",
      ),
      lines(
        "Transactional (OLTP) databases normalize because they are write-heavy.",
        "With one copy there is nothing to fall out of step, so there are no update, insert or delete anomalies.",
      ),
      lines(
        "Warehouses are read-heavy and loaded by a controlled ETL process, so they denormalize dimensions on purpose: `Category` and `Department` sit on `DimProduct` to save joins.",
        "Denormalize within a dimension, never into the fact, which has by far the most rows.",
        "Snowflaking a sub-dimension back out pays off when it is large, changes often or is shared by several dimensions.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `-- OLTP, normalized: each fact stored once
CREATE TABLE p (p_id INT PRIMARY KEY, p_attr VARCHAR(100));           -- stored once
CREATE TABLE c (c_id INT PRIMARY KEY, p_id INT REFERENCES p (p_id));  -- refers to it

-- Warehouse dimension, denormalized on purpose
CREATE TABLE DimT (
    TKey   INT PRIMARY KEY,
    attr   VARCHAR(100),
    level1 VARCHAR(50),   -- hierarchy flattened onto the row:
    level2 VARCHAR(50)    -- no join to reach it
);
-- Never: descriptive columns copied into every fact row`,
    },
    pitfall: lines(
      "A descriptive column stored on rows keyed by something else, such as a customer's name on every order, lets one `UPDATE` change some copies and not others.",
      "In OLTP, move it to the table keyed by what it describes; a warehouse dimension can keep such copies only because its ETL load rewrites them together.",
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'Member',
          columns: ['MemberId', 'FullName'],
          rows: [
            [7, 'Ada Ross'],
            [8, 'Ben Okafor'],
          ],
        },
        {
          name: 'Loan',
          columns: ['LoanId', 'MemberId', 'Title'],
          rows: [
            [1, 7, 'Dune'],
            [2, 8, 'Emma'],
            [3, 7, 'Ubik'],
          ],
        },
      ],
      code: `UPDATE Member SET FullName = 'Ada Stone' WHERE MemberId = 7;
SELECT l.LoanId, m.FullName, l.Title
FROM Loan AS l
JOIN Member AS m ON m.MemberId = l.MemberId
ORDER BY l.LoanId;`,
      steps: [
        "The name lives once, in `Member`; each loan holds only `MemberId`.",
        "Line 1: one `UPDATE` of one row renames member 7.",
        "Lines 2-5: the join reads the name through the key, so loans 1 and 3 both show Ada Stone, and no copy is left saying Ada Ross.",
        "The price is a join on every read, which a warehouse avoids by flattening a dimension's hierarchy, such as genre and shelf on one `DimBook` row.",
      ],
      output: `LoanId | FullName | Title
1 | Ada Stone | Dune
2 | Ben Okafor | Emma
3 | Ada Stone | Ubik`,
    },
    exercises: [
      'tsql-norm-mcq-1',
      'tsql-norm-predict-1',
      'tsql-norm-mcq-2',
      'tsql-norm-mcq-3',
      'tsql-norm-mcq-5',
    ],
  },
];
