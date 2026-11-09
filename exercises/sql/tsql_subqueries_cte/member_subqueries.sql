-- Questions inside questions: write one T-SQL query under each `-- query:` line.
-- Keep the `-- query:` lines as they are, and end each query with ;
--
-- dbo.Member (MemberId INT, MemberName NVARCHAR(40))
-- dbo.Book   (BookId INT, Title NVARCHAR(60), Pages INT)
-- dbo.Loan   (LoanId INT, MemberId INT, BookId INT NULL, Days INT)   BookId is NULL when the book's tag was lost
-- README.md lists the rows the tests put in them.

-- query: long_books
-- The books with more pages than the average book: Title, Pages.
-- TODO


-- query: long_loaners
-- The members with at least one loan longer than 20 days: MemberName. Use EXISTS.
-- TODO


-- query: never_borrowed
-- The books that appear in no loan: Title.
-- TODO


-- query: busiest
-- With a CTE that counts each member's loans, the member or members with the most: MemberName, Loans.
-- TODO
