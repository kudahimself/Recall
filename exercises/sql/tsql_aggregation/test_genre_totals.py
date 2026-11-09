from pathlib import Path

import pytest

from tsql_runner import assert_rows, block, run

SQL = Path(__file__).with_name("genre_totals.sql")


@pytest.fixture
def loans(con):
    con.execute("CREATE TABLE dbo.Loan (LoanId INTEGER, MemberId INTEGER, Title VARCHAR, Genre VARCHAR, Days INTEGER)")
    con.execute("""
        INSERT INTO dbo.Loan VALUES
          (1, 1, 'Dune', 'SciFi', 14), (2, 2, 'Ubik', 'SciFi', 7), (3, 1, 'Emma', 'Classic', 21),
          (4, 3, 'Hyperion', 'SciFi', 10), (5, 2, 'Beloved', 'Classic', 3), (6, 3, 'Dune', 'SciFi', 5),
          (7, 1, 'Rebecca', 'Mystery', 9), (8, 4, 'Rebecca', 'Mystery', 12), (9, 1, 'Dune', 'SciFi', 30),
          (10, 2, 'Circe', 'Fantasy', 18)
    """)
    return con


def test_per_genre_counts_loans_titles_and_days(loans):
    # SciFi has 5 loans but 3 titles: Dune went out three times.
    result = run(loans, block(SQL, "per_genre"))
    assert_rows(
        result,
        ["Genre", "Loans", "Titles", "TotalDays"],
        [("SciFi", 5, 3, 66), ("Classic", 2, 2, 24), ("Mystery", 2, 1, 21), ("Fantasy", 1, 1, 18)],
    )


def test_totals_is_one_row_for_the_whole_table(loans):
    result = run(loans, block(SQL, "totals"))
    assert_rows(result, ["Loans", "Members", "LongestLoan", "ShortestLoan"], [(10, 4, 30, 3)])


def test_busy_members_filters_groups_with_having(loans):
    result = run(loans, block(SQL, "busy_members"))
    assert_rows(result, ["MemberId", "Loans"], [(1, 4), (2, 3)])


def test_long_loan_genres_filters_rows_then_groups(loans):
    # Without the WHERE, Mystery's 9 + 12 = 21 days would qualify; with it, Mystery has 12.
    result = run(loans, block(SQL, "long_loan_genres"))
    assert_rows(result, ["Genre", "TotalDays"], [("SciFi", 54), ("Classic", 21)])


def test_long_loan_genres_follows_the_data(loans):
    loans.execute("INSERT INTO dbo.Loan VALUES (11, 4, 'Circe', 'Fantasy', 9), (12, 3, 'Piranesi', 'Fantasy', 10)")
    result = run(loans, block(SQL, "long_loan_genres"))
    assert_rows(result, ["Genre", "TotalDays"], [("SciFi", 54), ("Classic", 21), ("Fantasy", 28)])
