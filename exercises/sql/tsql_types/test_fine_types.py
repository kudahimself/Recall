from datetime import datetime
from decimal import Decimal
from pathlib import Path

import pytest
from sqlglot import exp

from tsql_runner import assert_rows, block, declared_columns, parse, rejects, run, type_name

SQL = Path(__file__).with_name("fine_types.sql")


@pytest.fixture
def fines(con):
    con.execute("""
        CREATE TABLE dbo.Fine (
            FineId BIGINT, Borrower VARCHAR, Amount DECIMAL(6, 2), IssuedOn DATE, PaidAt TIMESTAMP, Waived BOOLEAN
        )
    """)
    con.execute("""
        INSERT INTO dbo.Fine VALUES
          (3000000001, 'Łukasz', 1.25, '2026-03-02', NULL, 0),
          (3000000002, 'Ravi', 0.75, '2026-03-09', '2026-03-10 18:30', 0),
          (3000000003, 'Ana', 2.45, '2026-03-16', NULL, 0),
          (3000000004, 'Ben', 4.00, '2026-03-16', NULL, 1),
          (3000000005, 'Cleo', 1.50, '2026-03-20', '2026-03-21 09:15', 0)
    """)
    return con


def declared(name):
    return type_name(declared_columns(block(SQL, "create_fine"), "Fine")[name].args["kind"])


def test_create_fine_gives_each_column_its_type():
    assert declared("fineid") == "BIGINT", "More than 2.1 billion ids do not fit an INT: use BIGINT"
    assert declared("borrower") == "NVARCHAR(50)", "Names in any alphabet, up to 50 characters: NVARCHAR(50)"
    assert declared("amount") == "DECIMAL(6,2)", "Exact money up to 9,999.99 is 6 digits, 2 after the point: DECIMAL(6, 2)"
    assert declared("issuedon") == "DATE", "A day with no time is a DATE"
    assert declared("paidat").startswith("DATETIME2"), "A day and a time is a DATETIME2"
    assert declared("waived") == "BIT", "A yes or no flag is a BIT"


def test_create_fine_keeps_big_ids_any_name_and_exact_cents(con):
    run(con, block(SQL, "create_fine"))
    con.execute("INSERT INTO dbo.Fine VALUES (3000000001, 'Łukasz', 1.255, '2026-03-02', '2026-03-10 18:30:15', 1)")
    con.execute("INSERT INTO dbo.Fine VALUES (3000000002, 'Ravi', 9999.99, '2026-03-09', NULL, 0)")
    rows = con.execute("SELECT FineId, Borrower, Amount, PaidAt, Waived FROM dbo.Fine ORDER BY FineId").fetchall()
    assert rows[0][:3] == (3000000001, "Łukasz", Decimal("1.26")), "1.255 is rounded to the cent and kept exact"
    assert rows[0][3] == datetime(2026, 3, 10, 18, 30, 15), "PaidAt keeps the time of day"
    assert rows[1][2] == Decimal("9999.99")


def test_create_fine_refuses_an_amount_too_big(con):
    run(con, block(SQL, "create_fine"))
    assert rejects(con, "INSERT INTO dbo.Fine VALUES (1, 'Ana', 10000.00, '2026-03-02', NULL, 0)"), (
        "Amount goes up to 9,999.99 and no more: 4 digits before the point"
    )


def test_fix_price_makes_the_sum_exact(con):
    con.execute("CREATE TABLE dbo.PriceList (Item VARCHAR, Price DOUBLE)")
    con.executemany("INSERT INTO dbo.PriceList VALUES (?, 0.1)", [(f"item {i}",) for i in range(10)])
    assert con.execute("SELECT SUM(Price) FROM dbo.PriceList").fetchone()[0] != 1.0  # the float drift
    sql = block(SQL, "fix_price")
    actions = [a for s in parse(sql) if isinstance(s, exp.Alter) for a in s.args.get("actions") or []]
    changed = [a for a in actions if isinstance(a, exp.AlterColumn) and a.name.lower() == "price"]
    assert changed, "Change the type with ALTER TABLE dbo.PriceList ALTER COLUMN Price ..."
    assert type_name(changed[0].args["dtype"]) == "DECIMAL(8,2)", "6 digits before the point and 2 after is DECIMAL(8, 2)"
    run(con, sql)
    assert con.execute("SELECT SUM(Price) FROM dbo.PriceList").fetchone()[0] == Decimal("1.00")


def test_unpaid_total_adds_up_open_unwaived_fines(fines):
    result = run(fines, block(SQL, "unpaid_total"))
    assert_rows(result, ["Owed"], [(Decimal("3.70"),)])
    assert result.rows[0][0] == Decimal("3.70")


def test_paid_after_six_reads_the_time_of_day(fines):
    result = run(fines, block(SQL, "paid_after_six"))
    assert_rows(result, ["Borrower", "PaidAt"], [("Ravi", datetime(2026, 3, 10, 18, 30))])
