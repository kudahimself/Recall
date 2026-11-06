"""Dates, times and paths: practise datetime, timedelta, time zones and pathlib.

Fill in each function so the tests in test_dues.py pass.
Run them from this folder with: pytest
"""
from datetime import datetime, timedelta, timezone
from pathlib import Path


def due_at(lent_at, days=14):
    """Return the datetime `days` days after `lent_at`."""
    # TODO
    raise NotImplementedError


def days_overdue(due, now):
    """Return how many whole days `now` is past `due`, or 0 when it is not past."""
    # TODO
    raise NotImplementedError


def as_utc(dt):
    """Return `dt` as an aware datetime in UTC.

    A naive datetime is taken to be UTC already: attach timezone.utc.
    An aware datetime is converted to UTC.
    """
    # TODO
    raise NotImplementedError


def format_due(dt):
    """Show `dt` as day, short month and year: "31 Jan 2025"."""
    # TODO
    raise NotImplementedError


def parse_day(text):
    """Read "2025-03-01" into datetime(2025, 3, 1)."""
    # TODO
    raise NotImplementedError


def report_path(folder, year):
    """Return the Path <folder>/reports/loans-<year>.csv. `folder` may be a str or a Path."""
    # TODO
    raise NotImplementedError


def report_years(folder):
    """Return the years of the loans-<year>.csv files in `folder`, sorted, as ints.

    Other files in the folder are ignored.
    """
    # TODO
    raise NotImplementedError


def json_twin(path):
    """Return the same path with a .json extension instead of its own."""
    # TODO
    raise NotImplementedError
