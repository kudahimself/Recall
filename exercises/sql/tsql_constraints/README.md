# Rules for copies

Topic: Constraints (PK, FK, CHECK) (SQL for Data Engineering, DDL & Constraints).
Time: about 20 minutes.

## Task

Bad rows keep getting into the library's copy list: copies at branches that do not exist, two copies with one barcode, prices of 0.
Put the rules in the tables, so the database refuses a bad row instead of storing it.
Write the T-SQL for each `-- step:` line of `copy_rules.sql`:

- `create_branch` creates `dbo.Branch`, where `BranchId` (`INT`) identifies the branch and `City` (`NVARCHAR(40)`) must be given and differ from every other branch's.
- `create_copy` creates `dbo.Copy` with these columns and rules:
  - `CopyId` (`INT`) identifies the copy.
  - `BranchId` (`INT`) must be given and must be a branch in `dbo.Branch`, through a foreign key named `FK_Copy_Branch`; deleting a branch deletes its copies.
  - `Barcode` (`NVARCHAR(20)`) must be given and differ from every other copy's.
  - `Condition` (`NVARCHAR(10)`) must be given, is `'good'` when an `INSERT` leaves it out, and must be `'good'`, `'worn'` or `'damaged'`, by a check named `CK_Copy_Condition`.
  - `Price` (`DECIMAL(6, 2)`) must be given and above 0, by a check named `CK_Copy_Price`.

## What the tests do

The `create_branch` tests run your step and insert branches 1, Leeds and 2, York, then try a second branch 1, a second York and a branch with no city: each one must be refused.
The `create_copy` tests make `dbo.Branch` themselves, with branches 1 and 2, run your step and insert copy 10 at branch 1, then try a row that breaks each rule above.
They read the constraint names and the `ON DELETE CASCADE` from your T-SQL.

## Examples

```
INSERT INTO dbo.Copy (CopyId, BranchId, Barcode, Price) VALUES (10, 1, 'B-0010', 12.00);   stored, Condition 'good'
INSERT INTO dbo.Copy VALUES (11, 3, 'B-0011', 'good', 8.00);                             refused: no branch 3
INSERT INTO dbo.Copy VALUES (12, 1, 'B-0012', 'good', NULL);                             refused: Price must be given
```

Watch for the lesson's pitfall: `CHECK (Price > 0)` lets a NULL price through, because `NULL > 0` is unknown, not false, so `Price` needs `NOT NULL` as well.
DuckDB, which runs the tests, cannot cascade a delete, so it checks the foreign key on every insert and the tests read the `ON DELETE CASCADE` from your T-SQL.
On SQL Server, deleting branch 1 would delete copy 10 with it.

## Run the tests

```bash
cd exercises/sql/tsql_constraints
pytest
```

The tests read your T-SQL and run it on DuckDB (see `exercises/sql/README.md`).
Every test fails until you write the steps.
When they all pass, tick the exercise done in Recall under Progress, Topics.
