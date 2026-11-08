from datetime import date

import pytest

import due_dates


@pytest.fixture()
def raw(spark):
    return spark.createDataFrame(
        [(1, "05/03/2026"), (2, "20/02/2026")], ["loan_id", "borrowed_text"])


@pytest.fixture()
def dated(spark):
    rows = [
        (1, date(2026, 3, 5), date(2026, 3, 19)),
        (2, date(2026, 2, 20), date(2026, 3, 1)),
        (3, date(2026, 3, 31), date(2026, 4, 2)),
        (4, date(2025, 3, 10), date(2025, 3, 12)),
    ]
    return spark.createDataFrame(rows, ["loan_id", "borrowed", "returned"])


def column(df, field):
    return {r["loan_id"]: r[field] for r in df.collect()}


def test_parse_borrowed_reads_day_month_year_into_a_date_column(raw):
    out = due_dates.parse_borrowed(raw)
    assert dict(out.dtypes)["borrowed"] == "date"
    assert column(out, "borrowed") == {1: date(2026, 3, 5), 2: date(2026, 2, 20)}


def test_add_due_date_is_21_days_after_borrowing_across_month_ends(dated):
    due = column(due_dates.add_due_date(dated), "due")
    assert due[1] == date(2026, 3, 26)
    assert due[2] == date(2026, 3, 13)


def test_add_days_out_counts_days_from_borrowed_to_returned(dated):
    days = column(due_dates.add_days_out(dated), "days_out")
    assert days == {1: 14, 2: 9, 3: 2, 4: 2}


def test_add_month_label_uses_year_dash_month(dated):
    labels = column(due_dates.add_month_label(dated), "month_label")
    assert labels == {1: "2026-03", 2: "2026-02", 3: "2026-03", 4: "2025-03"}


def test_count_in_month_matches_year_and_month(dated):
    n = due_dates.count_in_month(dated, 2026, 3)
    assert n == 2
    assert isinstance(n, int)


def test_count_in_month_is_zero_when_no_loan_matches(dated):
    assert due_dates.count_in_month(dated, 2024, 1) == 0
