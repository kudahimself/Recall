-- Who has what: write one T-SQL query under each `-- query:` line.
-- Keep the `-- query:` lines as they are, and end each query with ;
--
-- dbo.Member (MemberId INT, MemberName NVARCHAR(40))
-- dbo.Book   (BookId INT, Title NVARCHAR(60))
-- dbo.Loan   (LoanId INT, MemberId INT, BookId INT, LoanYear INT)   one row per loan
-- README.md lists the rows the tests put in them.

-- query: loans_with_titles
-- One row per loan: MemberName, Title.
-- TODO


-- query: members_in_2026
-- Every member with each title they borrowed in 2026: MemberName, Title.
-- A member with no 2026 loan still appears once, with NULL for the Title.
-- TODO


-- query: no_loans
-- The members who have never borrowed a book: MemberName.
-- TODO


-- query: never_borrowed
-- The books nobody has borrowed: Title.
-- TODO
