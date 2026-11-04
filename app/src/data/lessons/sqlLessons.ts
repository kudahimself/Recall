/**
 * SQL for Data Engineering lessons, one per topic, in course order.
 *
 * Section 1, Querying Foundations: every topic.
 * Section 2, DDL & Constraints: every topic.
 * Later sections follow one per PR (next: Analytical & Window SQL).
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
];
