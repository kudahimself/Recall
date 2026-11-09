-- Rules for copies: write the T-SQL for each `-- step:` line.
-- Keep the `-- step:` lines as they are, and end each statement with ;
-- The tests run each step on its own and then try rows that break each rule.

-- step: create_branch
-- Create dbo.Branch: BranchId (INT) identifies the branch, and City (NVARCHAR(40)) must be given
-- and differ from every other branch's.
-- TODO


-- step: create_copy
-- Create dbo.Copy with the rules README.md lists: CopyId, BranchId, Barcode, Condition, Price,
-- and the constraints FK_Copy_Branch, CK_Copy_Price and CK_Copy_Condition named as shown there.
-- TODO
