-- Rules for copies: write the T-SQL for each `-- step:` line.
-- Keep the `-- step:` lines as they are, and end each statement with ;
-- The tests run each step on its own and then try rows that break each rule.

-- step: create_branch
-- Create dbo.Branch: BranchId (INT) identifies the branch, and City (NVARCHAR(40)) must be given
-- and differ from every other branch's.
CREATE TABLE dbo.Branch (
    BranchId INT PRIMARY KEY,
    City     NVARCHAR(40) NOT NULL UNIQUE
);

-- step: create_copy
-- Create dbo.Copy with the rules README.md lists: CopyId, BranchId, Barcode, Condition, Price,
-- and the constraints FK_Copy_Branch, CK_Copy_Price and CK_Copy_Condition named as shown there.
CREATE TABLE dbo.Copy (
    CopyId    INT PRIMARY KEY,
    BranchId  INT NOT NULL,
    Barcode   NVARCHAR(20) NOT NULL UNIQUE,
    Condition NVARCHAR(10) NOT NULL DEFAULT 'good',
    Price     DECIMAL(6, 2) NOT NULL,
    CONSTRAINT FK_Copy_Branch FOREIGN KEY (BranchId)
        REFERENCES dbo.Branch (BranchId) ON DELETE CASCADE,
    CONSTRAINT CK_Copy_Price CHECK (Price > 0),
    CONSTRAINT CK_Copy_Condition CHECK (Condition IN ('good', 'worn', 'damaged'))
);
