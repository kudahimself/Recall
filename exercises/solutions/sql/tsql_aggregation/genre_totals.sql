-- Loans by genre: write one T-SQL query under each `-- query:` line.
-- Keep the `-- query:` lines as they are, and end each query with ;
--
-- dbo.Loan (LoanId INT, MemberId INT, Title NVARCHAR(60), Genre NVARCHAR(20), Days INT)   one row per loan
-- README.md lists the rows the tests put in it.

-- query: per_genre
-- One row per genre: Genre, Loans (how many), Titles (how many different titles), TotalDays.
SELECT Genre,
       COUNT(*) AS Loans,
       COUNT(DISTINCT Title) AS Titles,
       SUM(Days) AS TotalDays
FROM dbo.Loan
GROUP BY Genre;

-- query: totals
-- One row for the whole table: Loans, Members (how many different members), LongestLoan, ShortestLoan.
SELECT COUNT(*) AS Loans,
       COUNT(DISTINCT MemberId) AS Members,
       MAX(Days) AS LongestLoan,
       MIN(Days) AS ShortestLoan
FROM dbo.Loan;

-- query: busy_members
-- The members with 3 or more loans: MemberId, Loans.
SELECT MemberId, COUNT(*) AS Loans
FROM dbo.Loan
GROUP BY MemberId
HAVING COUNT(*) >= 3;

-- query: long_loan_genres
-- Counting only loans of 10 days or more, the genres whose loans add up to 20 days or more: Genre, TotalDays.
SELECT Genre, SUM(Days) AS TotalDays
FROM dbo.Loan
WHERE Days >= 10
GROUP BY Genre
HAVING SUM(Days) >= 20;
