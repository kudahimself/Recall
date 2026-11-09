from datetime import date
from pathlib import Path

import pytest

from tsql_runner import assert_rows, block, run

SQL = Path(__file__).with_name("loan_dates.sql")


@pytest.fixture
def loans(con):
    con.execute("CREATE TABLE dbo.Loan (LoanId INTEGER, LoanDate DATE, ReturnDate DATE)")
    con.execute("""
        INSERT INTO dbo.Loan VALUES
          (1, '2026-01-30', '2026-02-02'), (2, '2026-02-10', '2026-03-05'), (3, '2026-03-31', '2026-04-01'),
          (4, '2026-02-20', NULL), (5, '2025-12-28', '2026-01-25'), (6, '2026-03-03', NULL)
    """)
    return con


def test_days_out_counts_days_for_returned_loans(loans):
    result = run(loans, block(SQL, "days_out"))
    assert_rows(result, ["LoanId", "DaysOut"], [(1, 3), (2, 23), (3, 1), (5, 28)])


def test_due_dates_move_21_days_and_find_the_month_end(loans):
    result = run(loans, block(SQL, "due_dates"))
    assert_rows(
        result,
        ["LoanId", "DueDate", "MonthEnd"],
        [
            (1, date(2026, 2, 20), date(2026, 1, 31)), (2, date(2026, 3, 3), date(2026, 2, 28)),
            (3, date(2026, 4, 21), date(2026, 3, 31)), (4, date(2026, 3, 13), date(2026, 2, 28)),
            (5, date(2026, 1, 18), date(2025, 12, 31)), (6, date(2026, 3, 24), date(2026, 3, 31)),
        ],
    )


def test_late_returns_compare_with_the_due_date(loans):
    result = run(loans, block(SQL, "late_returns"))
    assert_rows(result, ["LoanId", "DaysLate"], [(2, 2), (5, 7)])


def test_loan_parts_pull_out_year_month_and_quarter(loans):
    result = run(loans, block(SQL, "loan_parts"))
    assert_rows(
        result,
        ["LoanId", "LoanYear", "LoanMonth", "LoanQuarter"],
        [(1, 2026, 1, 1), (2, 2026, 2, 1), (3, 2026, 3, 1), (4, 2026, 2, 1), (5, 2025, 12, 4), (6, 2026, 3, 1)],
    )


def test_out_on_march_15_keeps_loans_not_yet_back(loans):
    # Loan 2 was back on 5 March, and loan 3 had not gone out yet.
    result = run(loans, block(SQL, "out_on_march_15"))
    assert_rows(result, ["LoanId", "DaysOut"], [(4, 23), (6, 12)])


def test_out_on_march_15_counts_a_loan_returned_later(loans):
    loans.execute("INSERT INTO dbo.Loan VALUES (7, '2026-03-10', '2026-03-20')")
    result = run(loans, block(SQL, "out_on_march_15"))
    assert_rows(result, ["LoanId", "DaysOut"], [(4, 23), (6, 12), (7, 5)])
