from pathlib import Path

import pytest
from sqlglot import exp

from tsql_runner import block, parse, rejects, run

SQL = Path(__file__).with_name("copy_rules.sql")


@pytest.fixture
def branches(con):
    run(con, block(SQL, "create_branch"))
    con.execute("INSERT INTO dbo.Branch VALUES (1, 'Leeds'), (2, 'York')")
    return con


@pytest.fixture
def copies(con):
    con.execute("CREATE TABLE dbo.Branch (BranchId INTEGER PRIMARY KEY, City VARCHAR NOT NULL UNIQUE)")
    con.execute("INSERT INTO dbo.Branch VALUES (1, 'Leeds'), (2, 'York')")
    run(con, block(SQL, "create_copy"))
    con.execute("INSERT INTO dbo.Copy (CopyId, BranchId, Barcode, Price) VALUES (10, 1, 'B-0010', 12.00)")
    return con


def named_constraints():
    """{constraint name (lower case): its T-SQL} from the create_copy step."""
    found = {}
    for statement in parse(block(SQL, "create_copy")):
        for c in statement.find_all(exp.Constraint, exp.ColumnConstraint):
            if c.name:  # CONSTRAINT name ..., at the table's end or on a column
                found[c.name.lower()] = c.sql("tsql").upper()
    return found


def test_create_branch_accepts_good_rows(branches):
    assert branches.execute("SELECT COUNT(*) FROM dbo.Branch").fetchone() == (2,)


def test_create_branch_refuses_a_second_branch_id(branches):
    assert rejects(branches, "INSERT INTO dbo.Branch VALUES (1, 'Hull')"), "BranchId identifies the branch: PRIMARY KEY"


def test_create_branch_refuses_a_missing_or_repeated_city(branches):
    assert rejects(branches, "INSERT INTO dbo.Branch VALUES (3, NULL)"), "City must be given: NOT NULL"
    assert rejects(branches, "INSERT INTO dbo.Branch VALUES (3, 'York')"), "Two branches cannot share a City: UNIQUE"


def test_create_copy_fills_condition_with_its_default(copies):
    assert copies.execute("SELECT Condition FROM dbo.Copy WHERE CopyId = 10").fetchone() == ("good",)


def test_create_copy_accepts_a_good_row(copies):
    copies.execute("INSERT INTO dbo.Copy VALUES (11, 2, 'B-0011', 'worn', 8.00)")
    assert copies.execute("SELECT COUNT(*) FROM dbo.Copy").fetchone() == (2,)


@pytest.mark.parametrize(
    "row, rule",
    [
        ("(11, 3, 'B-0011', 'good', 8.00)", "BranchId must be a branch in dbo.Branch: FOREIGN KEY ... REFERENCES"),
        ("(11, NULL, 'B-0011', 'good', 8.00)", "BranchId must be given: NOT NULL"),
        ("(10, 2, 'B-0011', 'good', 8.00)", "CopyId identifies the copy: PRIMARY KEY"),
        ("(11, 2, 'B-0010', 'good', 8.00)", "Two copies cannot share a Barcode: UNIQUE"),
        ("(11, 2, NULL, 'good', 8.00)", "Barcode must be given: NOT NULL"),
        ("(11, 2, 'B-0011', 'lost', 8.00)", "Condition must be good, worn or damaged: CHECK (Condition IN (...))"),
        ("(11, 2, 'B-0011', 'good', 0)", "Price must be above 0: CHECK (Price > 0)"),
        ("(11, 2, 'B-0011', 'good', NULL)", "A NULL passes CHECK (Price > 0), so Price needs NOT NULL too"),
    ],
)
def test_create_copy_refuses_a_row_that_breaks_a_rule(copies, row, rule):
    assert rejects(copies, f"INSERT INTO dbo.Copy VALUES {row}"), rule


def test_create_copy_names_its_constraints():
    found = named_constraints()
    for name in ("fk_copy_branch", "ck_copy_price", "ck_copy_condition"):
        assert name in found, f"Name the constraint: CONSTRAINT {name.upper()} ..."
    assert "REFERENCES" in found["fk_copy_branch"], "FK_Copy_Branch is the FOREIGN KEY (BranchId) REFERENCES dbo.Branch (BranchId)"
    assert "CHECK" in found["ck_copy_price"] and "CHECK" in found["ck_copy_condition"]


def test_create_copy_cascades_a_deleted_branch():
    assert "ON DELETE CASCADE" in named_constraints().get("fk_copy_branch", ""), (
        "Deleting a branch deletes its copies: end the foreign key with ON DELETE CASCADE"
    )
