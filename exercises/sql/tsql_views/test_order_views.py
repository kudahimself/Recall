from datetime import date
from decimal import Decimal
from pathlib import Path

import pytest
from sqlglot import exp

from tsql_runner import assert_rows, block, declared_columns, rejects, run

SQL = Path(__file__).with_name("order_views.sql")


@pytest.fixture
def lines(con):
    con.execute("""
        CREATE TABLE dbo.OrderLine (
            LineId INTEGER PRIMARY KEY, Title VARCHAR NOT NULL, Qty INTEGER NOT NULL, Price DECIMAL(6, 2) NOT NULL,
            LineTotal AS (Qty * Price)
        )
    """)
    con.execute("""
        INSERT INTO dbo.OrderLine (LineId, Title, Qty, Price) VALUES
          (1, 'Dune', 2, 9.00), (2, 'Emma', 1, 7.50), (3, 'Ubik', 3, 8.00), (4, 'Circe', 4, 6.25)
    """)
    return con


@pytest.fixture
def library(con):
    con.execute("CREATE TABLE dbo.Member (MemberId INTEGER, MemberName VARCHAR)")
    con.execute("CREATE TABLE dbo.Book (BookId INTEGER, Title VARCHAR)")
    con.execute("CREATE TABLE dbo.Loan (LoanId INTEGER, MemberId INTEGER, BookId INTEGER, LoanDate DATE)")
    con.execute("INSERT INTO dbo.Member VALUES (1, 'Ana'), (2, 'Ben')")
    con.execute("INSERT INTO dbo.Book VALUES (10, 'Dune'), (11, 'Emma')")
    con.execute("INSERT INTO dbo.Loan VALUES (100, 1, 10, '2026-03-02'), (101, 2, 10, '2026-03-04'), (102, 1, 11, '2026-03-09')")
    return con


def computed(name):
    column = declared_columns(block(SQL, "create_lines"), "OrderLine")[name]
    return column.find(exp.ComputedColumnConstraint)


def test_create_lines_computes_the_totals(con):
    run(con, block(SQL, "create_lines"))
    con.execute("INSERT INTO dbo.OrderLine (LineId, Title, Qty, Price) VALUES (1, 'Dune', 2, 9.50), (2, 'Emma', 3, 5.00)")
    result = run(con, "SELECT LineId, LineTotal, WithTax FROM dbo.OrderLine;")
    assert_rows(result, ["LineId", "LineTotal", "WithTax"], [(1, Decimal("19.00"), Decimal("22.80")), (2, Decimal("15.00"), Decimal("18.00"))])


def test_create_lines_follows_a_changed_quantity(con):
    run(con, block(SQL, "create_lines"))
    con.execute("INSERT INTO dbo.OrderLine (LineId, Title, Qty, Price) VALUES (1, 'Dune', 2, 9.50)")
    con.execute("UPDATE dbo.OrderLine SET Qty = 4 WHERE LineId = 1")
    assert con.execute("SELECT LineTotal FROM dbo.OrderLine").fetchone() == (Decimal("38.00"),)


def test_create_lines_requires_the_base_columns(con):
    run(con, block(SQL, "create_lines"))
    con.execute("INSERT INTO dbo.OrderLine (LineId, Title, Qty, Price) VALUES (1, 'Dune', 2, 9.50)")
    assert rejects(con, "INSERT INTO dbo.OrderLine (LineId, Title, Qty, Price) VALUES (2, 'Emma', NULL, 5.00)"), "Qty is required: NOT NULL"
    assert rejects(con, "INSERT INTO dbo.OrderLine (LineId, Title, Qty, Price) VALUES (1, 'Emma', 1, 5.00)"), "LineId identifies the line: PRIMARY KEY"


def test_create_lines_stores_only_with_tax():
    assert computed("linetotal") is not None, "LineTotal is computed: LineTotal AS (Qty * Price)"
    assert not computed("linetotal").args.get("persisted"), "LineTotal is worked out on every read, so it is not PERSISTED"
    assert computed("withtax") is not None and computed("withtax").args.get("persisted"), (
        "WithTax is stored with the row: WithTax AS (...) PERSISTED"
    )


def test_big_lines_creates_the_view_and_queries_it(lines):
    result = run(lines, block(SQL, "big_lines"))
    assert_rows(result, ["Title", "LineTotal"], [("Circe", Decimal("25.00")), ("Ubik", Decimal("24.00"))], ordered=True)


def test_big_lines_view_is_not_a_snapshot(lines):
    run(lines, block(SQL, "big_lines"))
    lines.execute("INSERT INTO dbo.OrderLine (LineId, Title, Qty, Price) VALUES (5, 'Hyperion', 2, 10.00)")
    result = run(lines, "SELECT LineId, Title, LineTotal FROM dbo.BigLine;")
    assert_rows(
        result,
        ["LineId", "Title", "LineTotal"],
        [(4, "Circe", Decimal("25.00")), (3, "Ubik", Decimal("24.00")), (5, "Hyperion", Decimal("20.00"))],
    )


def test_loan_list_names_the_member_and_the_book(library):
    run(library, block(SQL, "loan_list"))
    result = run(library, "SELECT MemberName, Title, LoanDate FROM dbo.LoanList;")
    assert_rows(
        result,
        ["MemberName", "Title", "LoanDate"],
        [("Ana", "Dune", date(2026, 3, 2)), ("Ben", "Dune", date(2026, 3, 4)), ("Ana", "Emma", date(2026, 3, 9))],
    )


def test_loan_list_shows_a_loan_added_later(library):
    run(library, block(SQL, "loan_list"))
    library.execute("INSERT INTO dbo.Loan VALUES (103, 2, 11, '2026-03-12')")
    result = run(library, "SELECT Title FROM dbo.LoanList WHERE MemberName = 'Ben';")
    assert_rows(result, ["Title"], [("Dune",), ("Emma",)])
