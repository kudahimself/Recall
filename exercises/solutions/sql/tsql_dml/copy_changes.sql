-- Copies in and out: write the T-SQL for each `-- step:` line.
-- Keep the `-- step:` lines as they are, and end each statement with ;
-- The tests run each step on its own, on the starting rows in README.md.
--
-- dbo.BookCopy (CopyId INT, Title NVARCHAR(60), Loans INT,
--               Condition NVARCHAR(10) DEFAULT 'good', Price DECIMAL(6, 2))

-- step: add_copies
-- Add copy 6, Circe, 0 loans, price 11.00, leaving Condition to its default,
-- and copy 7, Piranesi, 2 loans, 'worn', price 10.00.
INSERT INTO dbo.BookCopy (CopyId, Title, Loans, Price)
VALUES (6, 'Circe', 0, 11.00);
INSERT INTO dbo.BookCopy (CopyId, Title, Loans, Condition, Price)
VALUES (7, 'Piranesi', 2, 'worn', 10.00);

-- step: lend
-- Dune and Beloved each went out once more: add 1 to their Loans.
UPDATE dbo.BookCopy
SET Loans = Loans + 1
WHERE Title IN ('Dune', 'Beloved');

-- step: reprice_worn
-- Worn copies sell for 20% less: multiply their Price by 0.8.
UPDATE dbo.BookCopy
SET Price = Price * 0.8
WHERE Condition = 'worn';

-- step: retire
-- Remove the worn copies that have never been lent.
DELETE FROM dbo.BookCopy
WHERE Condition = 'worn' AND Loans = 0;
