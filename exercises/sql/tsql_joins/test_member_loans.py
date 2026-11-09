from pathlib import Path

import pytest

from tsql_runner import assert_rows, block, run

SQL = Path(__file__).with_name("member_loans.sql")


@pytest.fixture
def library(con):
    con.execute("CREATE TABLE dbo.Member (MemberId INTEGER, MemberName VARCHAR)")
    con.execute("CREATE TABLE dbo.Book (BookId INTEGER, Title VARCHAR)")
    con.execute("CREATE TABLE dbo.Loan (LoanId INTEGER, MemberId INTEGER, BookId INTEGER, LoanYear INTEGER)")
    con.execute("INSERT INTO dbo.Member VALUES (1, 'Ana'), (2, 'Ben'), (3, 'Cleo'), (4, 'Dev')")
    con.execute("INSERT INTO dbo.Book VALUES (10, 'Dune'), (11, 'Emma'), (12, 'Ubik'), (13, 'Hyperion')")
    con.execute("""
        INSERT INTO dbo.Loan VALUES
          (100, 1, 10, 2025), (101, 1, 11, 2026), (102, 3, 12, 2026), (103, 3, 10, 2026), (104, 2, 11, 2025)
    """)
    return con


def test_loans_with_titles_gives_one_row_per_loan(library):
    result = run(library, block(SQL, "loans_with_titles"))
    assert_rows(
        result,
        ["MemberName", "Title"],
        [("Ana", "Dune"), ("Ana", "Emma"), ("Cleo", "Ubik"), ("Cleo", "Dune"), ("Ben", "Emma")],
    )


def test_members_in_2026_keeps_members_without_a_2026_loan(library):
    # The year in WHERE instead of ON would drop Ben and Dev.
    result = run(library, block(SQL, "members_in_2026"))
    assert_rows(
        result,
        ["MemberName", "Title"],
        [("Ana", "Emma"), ("Ben", None), ("Cleo", "Ubik"), ("Cleo", "Dune"), ("Dev", None)],
    )


def test_no_loans_finds_the_unmatched_members(library):
    result = run(library, block(SQL, "no_loans"))
    assert_rows(result, ["MemberName"], [("Dev",)])


def test_no_loans_follows_the_data(library):
    library.execute("INSERT INTO dbo.Member VALUES (5, 'Eve')")
    library.execute("INSERT INTO dbo.Loan VALUES (105, 4, 13, 2026)")
    result = run(library, block(SQL, "no_loans"))
    assert_rows(result, ["MemberName"], [("Eve",)])


def test_never_borrowed_finds_the_unmatched_books(library):
    result = run(library, block(SQL, "never_borrowed"))
    assert_rows(result, ["Title"], [("Hyperion",)])
