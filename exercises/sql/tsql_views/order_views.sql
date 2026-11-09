-- Lines and views: write the T-SQL for each `-- step:` line.
-- Keep the `-- step:` lines as they are, and end each statement with ;
-- The tests run each step on its own, on the tables README.md describes for it.

-- step: create_lines
-- Create dbo.OrderLine: LineId (INT, identifies the line), Title (NVARCHAR(60)), Qty (INT) and
-- Price (DECIMAL(6, 2)), all required, then two computed columns:
-- LineTotal, Qty times Price, worked out on every read, and
-- WithTax, Qty times Price times 1.2, stored with the row.
-- TODO


-- step: big_lines
-- Create the view dbo.BigLine (LineId, Title, LineTotal) of the lines worth 20 or more,
-- then, in the same step, query it: Title, LineTotal, biggest first.
-- TODO


-- step: loan_list
-- Create the view dbo.LoanList (MemberName, Title, LoanDate): one row per loan,
-- with the member's name and the book's title in place of their ids.
-- TODO
