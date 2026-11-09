-- Questions inside questions: write one T-SQL query under each `-- query:` line.
-- Keep the `-- query:` lines as they are, and end each query with ;
--
-- dbo.Member (MemberId INT, MemberName NVARCHAR(40))
-- dbo.Book   (BookId INT, Title NVARCHAR(60), Pages INT)
-- dbo.Loan   (LoanId INT, MemberId INT, BookId INT NULL, Days INT)   BookId is NULL when the book's tag was lost
-- README.md lists the rows the tests put in them.

-- query: long_books
-- The books with more pages than the average book: Title, Pages.
SELECT Title, Pages
FROM dbo.Book
WHERE Pages > (SELECT AVG(Pages) FROM dbo.Book);

-- query: long_loaners
-- The members with at least one loan longer than 20 days: MemberName. Use EXISTS.
SELECT m.MemberName
FROM dbo.Member m
WHERE EXISTS (SELECT 1 FROM dbo.Loan l
              WHERE l.MemberId = m.MemberId AND l.Days > 20);

-- query: never_borrowed
-- The books that appear in no loan: Title.
SELECT b.Title
FROM dbo.Book b
WHERE NOT EXISTS (SELECT 1 FROM dbo.Loan l WHERE l.BookId = b.BookId);

-- query: busiest
-- With a CTE that counts each member's loans, the member or members with the most: MemberName, Loans.
WITH LoanCounts AS (
    SELECT MemberId, COUNT(*) AS Loans
    FROM dbo.Loan
    GROUP BY MemberId
)
SELECT m.MemberName, lc.Loans
FROM LoanCounts lc
JOIN dbo.Member m ON m.MemberId = lc.MemberId
WHERE lc.Loans = (SELECT MAX(Loans) FROM LoanCounts);
