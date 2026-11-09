-- Who has what: write one T-SQL query under each `-- query:` line.
-- Keep the `-- query:` lines as they are, and end each query with ;
--
-- dbo.Member (MemberId INT, MemberName NVARCHAR(40))
-- dbo.Book   (BookId INT, Title NVARCHAR(60))
-- dbo.Loan   (LoanId INT, MemberId INT, BookId INT, LoanYear INT)   one row per loan
-- README.md lists the rows the tests put in them.

-- query: loans_with_titles
-- One row per loan: MemberName, Title.
SELECT m.MemberName, b.Title
FROM dbo.Loan l
JOIN dbo.Member m ON m.MemberId = l.MemberId
JOIN dbo.Book b ON b.BookId = l.BookId;

-- query: members_in_2026
-- Every member with each title they borrowed in 2026: MemberName, Title.
-- A member with no 2026 loan still appears once, with NULL for the Title.
SELECT m.MemberName, b.Title
FROM dbo.Member m
LEFT JOIN dbo.Loan l ON l.MemberId = m.MemberId AND l.LoanYear = 2026
LEFT JOIN dbo.Book b ON b.BookId = l.BookId;

-- query: no_loans
-- The members who have never borrowed a book: MemberName.
SELECT m.MemberName
FROM dbo.Member m
LEFT JOIN dbo.Loan l ON l.MemberId = m.MemberId
WHERE l.LoanId IS NULL;

-- query: never_borrowed
-- The books nobody has borrowed: Title.
SELECT b.Title
FROM dbo.Book b
LEFT JOIN dbo.Loan l ON l.BookId = b.BookId
WHERE l.LoanId IS NULL;
