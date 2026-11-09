from decimal import Decimal
from pathlib import Path

import pytest
from sqlglot import exp

from tsql_runner import assert_rows, block, parse, run

SQL = Path(__file__).with_name("copy_changes.sql")
COLUMNS = ["CopyId", "Title", "Loans", "Condition", "Price"]
START = [
    (1, "Dune", 3, "good", Decimal("9.50")),
    (2, "Emma", 0, "worn", Decimal("7.00")),
    (3, "Ubik", 5, "good", Decimal("8.00")),
    (4, "Hyperion", 0, "good", Decimal("12.00")),
    (5, "Beloved", 1, "worn", Decimal("6.50")),
]


@pytest.fixture
def copies(con):
    con.execute("""
        CREATE TABLE dbo.BookCopy (
            CopyId INTEGER, Title VARCHAR, Loans INTEGER, Condition VARCHAR DEFAULT 'good', Price DECIMAL(6, 2)
        )
    """)
    con.executemany("INSERT INTO dbo.BookCopy VALUES (?, ?, ?, ?, ?)", START)
    return con


def table(con):
    return run(con, "SELECT CopyId, Title, Loans, Condition, Price FROM dbo.BookCopy;")


def changed(rows, copy_id, **values):
    out = []
    for row in rows:
        if row[0] == copy_id:
            row = tuple(values.get(c, v) for c, v in zip(COLUMNS, row))
        out.append(row)
    return out


def test_add_copies_inserts_both_and_uses_the_default(copies):
    run(copies, block(SQL, "add_copies"))
    assert_rows(table(copies), COLUMNS, START + [(6, "Circe", 0, "good", Decimal("11.00")), (7, "Piranesi", 2, "worn", Decimal("10.00"))])


def test_lend_adds_one_to_each_matching_copy(copies):
    run(copies, block(SQL, "lend"))
    assert_rows(table(copies), COLUMNS, changed(changed(START, 1, Loans=4), 5, Loans=2))


def test_reprice_worn_reads_each_rows_own_price(copies):
    run(copies, block(SQL, "reprice_worn"))
    assert_rows(table(copies), COLUMNS, changed(changed(START, 2, Price=Decimal("5.60")), 5, Price=Decimal("5.20")))


def test_retire_removes_only_unlent_worn_copies(copies):
    # Hyperion has never been lent either, but it is in good condition.
    run(copies, block(SQL, "retire"))
    assert_rows(table(copies), COLUMNS, [row for row in START if row[0] != 2])


def test_add_copies_leaves_condition_out_for_circe():
    for insert in (s for s in parse(block(SQL, "add_copies")) if isinstance(s, exp.Insert)):
        if "Circe" in insert.sql("tsql"):
            columns = [c.name.lower() for c in insert.this.expressions] if isinstance(insert.this, exp.Schema) else []
            assert columns, "Name the columns you give, as in INSERT INTO dbo.BookCopy (CopyId, Title, Loans, Price)"
            assert "condition" not in columns, "Leave Condition out of Circe's INSERT, so its DEFAULT fills it in"
            return
    raise AssertionError("No INSERT adds Circe")
