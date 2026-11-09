-- Due dates: write one T-SQL query under each `-- query:` line.
-- Keep the `-- query:` lines as they are, and end each query with ;
--
-- dbo.Loan (LoanId INT, LoanDate DATE, ReturnDate DATE NULL)   NULL ReturnDate: still out
-- A loan is due back 21 days after its LoanDate. README.md lists the rows the tests put in it.

-- query: days_out
-- The loans that came back: LoanId, DaysOut (days from LoanDate to ReturnDate).
SELECT LoanId,
       DATEDIFF(day, LoanDate, ReturnDate) AS DaysOut
FROM dbo.Loan
WHERE ReturnDate IS NOT NULL;

-- query: due_dates
-- Every loan: LoanId, DueDate (21 days after LoanDate), MonthEnd (the last day of LoanDate's month).
SELECT LoanId,
       DATEADD(day, 21, LoanDate) AS DueDate,
       EOMONTH(LoanDate) AS MonthEnd
FROM dbo.Loan;

-- query: late_returns
-- The loans that came back after their due date: LoanId, DaysLate (days from DueDate to ReturnDate).
SELECT LoanId,
       DATEDIFF(day, DATEADD(day, 21, LoanDate), ReturnDate) AS DaysLate
FROM dbo.Loan
WHERE ReturnDate > DATEADD(day, 21, LoanDate);

-- query: loan_parts
-- Every loan: LoanId, LoanYear, LoanMonth, LoanQuarter, each a number.
SELECT LoanId,
       YEAR(LoanDate) AS LoanYear,
       MONTH(LoanDate) AS LoanMonth,
       DATEPART(quarter, LoanDate) AS LoanQuarter
FROM dbo.Loan;

-- query: out_on_march_15
-- The loans still out on 2026-03-15 (lent by then, not back by then): LoanId, DaysOut on that day.
-- Write the day as CAST('2026-03-15' AS DATE).
SELECT LoanId,
       DATEDIFF(day, LoanDate, CAST('2026-03-15' AS DATE)) AS DaysOut
FROM dbo.Loan
WHERE LoanDate <= CAST('2026-03-15' AS DATE)
  AND (ReturnDate IS NULL OR ReturnDate > CAST('2026-03-15' AS DATE));
