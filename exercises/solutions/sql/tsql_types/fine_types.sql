-- Fines, typed: write the T-SQL for each `-- step:` and `-- query:` line.
-- Keep those lines as they are, and end each statement with ;
-- The tests run each block on its own, on the tables README.md describes for it.

-- step: create_fine
-- Create dbo.Fine with a type for each column that fits what README.md says it holds:
-- FineId, Borrower, Amount, IssuedOn, PaidAt, Waived.
CREATE TABLE dbo.Fine (
    FineId   BIGINT,
    Borrower NVARCHAR(50),
    Amount   DECIMAL(6, 2),
    IssuedOn DATE,
    PaidAt   DATETIME2,
    Waived   BIT
);

-- step: fix_price
-- dbo.PriceList keeps Price as FLOAT. Change it to an exact amount with up to 6 digits before the point
-- and 2 after it.
ALTER TABLE dbo.PriceList ALTER COLUMN Price DECIMAL(8, 2);

-- query: unpaid_total
-- The fines not paid yet and not waived, added up: Owed.
SELECT SUM(Amount) AS Owed
FROM dbo.Fine
WHERE PaidAt IS NULL AND Waived = 0;

-- query: paid_after_six
-- The fines paid at 18:00 or later on any day: Borrower, PaidAt.
SELECT Borrower, PaidAt
FROM dbo.Fine
WHERE DATEPART(hour, PaidAt) >= 18;
