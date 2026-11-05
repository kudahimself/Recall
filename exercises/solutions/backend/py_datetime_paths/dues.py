"""Dates, times and paths: reference solution."""
from datetime import datetime, timedelta, timezone
from pathlib import Path


def due_at(lent_at, days=14):
    return lent_at + timedelta(days=days)


def days_overdue(due, now):
    return max((now - due).days, 0)


def as_utc(dt):
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def format_due(dt):
    return dt.strftime("%d %b %Y")


def parse_day(text):
    return datetime.strptime(text, "%Y-%m-%d")


def report_path(folder, year):
    return Path(folder) / "reports" / f"loans-{year}.csv"


def report_years(folder):
    return sorted(int(p.stem.split("-")[1]) for p in Path(folder).glob("loans-*.csv"))


def json_twin(path):
    return Path(path).with_suffix(".json")
