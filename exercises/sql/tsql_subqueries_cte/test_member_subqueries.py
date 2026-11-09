from pathlib import Path

import pytest
from sqlglot import exp

from tsql_runner import assert_rows, block, parse, run

SQL = Path(__file__).with_name("member_subqueries.sql")


@pytest.fixture
def library(con):
    con.execute("CREATE TABLE dbo.Member (MemberId INTEGER, MemberName VARCHAR)")
    con.execute("CREATE TABLE dbo.Book (BookId INTEGER, Title VARCHAR, Pages INTEGER)")
    con.execute("CREATE TABLE dbo.Loan (LoanId INTEGER, MemberId INTEGER, BookId INTEGER, Days INTEGER)")
    con.execute("INSERT INTO dbo.Member VALUES (1, 'Ana'), (2, 'Ben'), (3, 'Cleo'), (4, 'Dev'), (5, 'Eve')")
    con.execute("""
        INSERT INTO dbo.Book VALUES
          (10, 'Dune', 412), (11, 'Emma', 474), (12, 'Ubik', 202), (13, 'Hyperion', 482), (14, 'Beloved', 324)
    """)
    con.execute("""
        INSERT INTO dbo.Loan VALUES
          (100, 1, 10, 14), (101, 1, 11, 30), (102, 2, 12, 7), (103, 3, 13, 21), (104, 3, 10, 4), (105, 5, NULL, 9)
    """)
    return con


def test_long_books_compares_with_the_average(library):
    result = run(library, block(SQL, "long_books"))
    assert_rows(result, ["Title", "Pages"], [("Dune", 412), ("Emma", 474), ("Hyperion", 482)])


def test_long_books_follows_the_data(library):
    # Two short books bring the average down to 284, so Beloved now counts.
    library.execute("INSERT INTO dbo.Book VALUES (15, 'Ubik II', 100), (16, 'Pamphlet', 0)")
    result = run(library, block(SQL, "long_books"))
    assert_rows(result, ["Title", "Pages"], [("Dune", 412), ("Emma", 474), ("Hyperion", 482), ("Beloved", 324)])


def test_long_loaners_uses_exists(library):
    result = run(library, block(SQL, "long_loaners"))
    assert_rows(result, ["MemberName"], [("Ana",), ("Cleo",)])
    [query] = parse(block(SQL, "long_loaners"))
    assert query.find(exp.Exists) is not None, "Test for a matching loan with EXISTS (SELECT 1 FROM dbo.Loan l WHERE ...)"


def test_never_borrowed_survives_a_null_book_id(library):
    # NOT IN (SELECT BookId FROM dbo.Loan) returns nothing here: loan 105's BookId is NULL.
    result = run(library, block(SQL, "never_borrowed"))
    assert_rows(result, ["Title"], [("Beloved",)])


def test_busiest_keeps_every_member_tied_for_the_most(library):
    result = run(library, block(SQL, "busiest"))
    assert_rows(result, ["MemberName", "Loans"], [("Ana", 2), ("Cleo", 2)])
    [query] = parse(block(SQL, "busiest"))
    assert query.args.get("with_") is not None or query.find(exp.With) is not None, "Count the loans in a CTE: WITH LoanCounts AS (...)"


def test_busiest_follows_the_data(library):
    library.execute("INSERT INTO dbo.Loan VALUES (106, 2, 14, 3), (107, 2, 11, 6)")
    result = run(library, block(SQL, "busiest"))
    assert_rows(result, ["MemberName", "Loans"], [("Ben", 3)])
