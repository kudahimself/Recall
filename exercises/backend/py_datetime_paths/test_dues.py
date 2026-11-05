from datetime import datetime, timedelta, timezone
from pathlib import Path

import pytest

from dues import as_utc, days_overdue, due_at, format_due, json_twin, parse_day, report_path, report_years

UTC = timezone.utc


def test_due_at_adds_days():
    lent = datetime(2025, 1, 17, 9, 30, tzinfo=UTC)
    assert due_at(lent) == datetime(2025, 1, 31, 9, 30, tzinfo=UTC)
    assert due_at(lent, days=30) == datetime(2025, 2, 16, 9, 30, tzinfo=UTC)


def test_days_overdue():
    due = datetime(2025, 1, 31, 9, 30, tzinfo=UTC)
    assert days_overdue(due, datetime(2025, 2, 3, 10, 0, tzinfo=UTC)) == 3
    assert days_overdue(due, datetime(2025, 2, 1, 9, 0, tzinfo=UTC)) == 0
    assert days_overdue(due, datetime(2025, 1, 20, tzinfo=UTC)) == 0


def test_as_utc_makes_naive_and_aware_times_comparable():
    naive = datetime(2025, 1, 31, 9, 30)
    assert as_utc(naive) == datetime(2025, 1, 31, 9, 30, tzinfo=UTC)
    assert as_utc(naive).tzinfo is UTC
    paris = timezone(timedelta(hours=1))
    converted = as_utc(datetime(2025, 1, 31, 10, 30, tzinfo=paris))
    assert converted.tzinfo == UTC
    assert converted.hour == 9
    now = datetime(2025, 2, 3, 10, 0, tzinfo=UTC)
    with pytest.raises(TypeError):
        days_overdue(naive, now)
    assert days_overdue(as_utc(naive), now) == 3


def test_format_and_parse():
    assert format_due(datetime(2025, 1, 31, 9, 30)) == "31 Jan 2025"
    assert format_due(datetime(2025, 3, 5)) == "05 Mar 2025"
    assert parse_day("2025-03-01") == datetime(2025, 3, 1)


def test_report_path_joins_parts():
    assert report_path("data", 2025) == Path("data") / "reports" / "loans-2025.csv"
    path = report_path(Path("archive"), 2019)
    assert isinstance(path, Path)
    assert path.name == "loans-2019.csv"
    assert path.parent == Path("archive") / "reports"


def test_report_years_reads_only_loan_reports(tmp_path):
    for file_name in ["loans-2025.csv", "loans-2019.csv", "loans-2023.csv", "notes.txt", "fees-2024.csv"]:
        (tmp_path / file_name).write_text("x")
    assert report_years(tmp_path) == [2019, 2023, 2025]
    assert report_years(tmp_path / "missing") == []


def test_json_twin():
    assert json_twin(Path("data/loans-2025.csv")) == Path("data/loans-2025.json")
    assert json_twin("loans.csv") == Path("loans.json")
