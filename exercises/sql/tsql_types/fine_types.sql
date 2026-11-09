-- Fines, typed: write the T-SQL for each `-- step:` and `-- query:` line.
-- Keep those lines as they are, and end each statement with ;
-- The tests run each block on its own, on the tables README.md describes for it.

-- step: create_fine
-- Create dbo.Fine with a type for each column that fits what README.md says it holds:
-- FineId, Borrower, Amount, IssuedOn, PaidAt, Waived.
-- TODO


-- step: fix_price
-- dbo.PriceList keeps Price as FLOAT. Change it to an exact amount with up to 6 digits before the point
-- and 2 after it.
-- TODO


-- query: unpaid_total
-- The fines not paid yet and not waived, added up: Owed.
-- TODO


-- query: paid_after_six
-- The fines paid at 18:00 or later on any day: Borrower, PaidAt.
-- TODO
