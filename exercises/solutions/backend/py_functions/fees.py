"""Late fees: reference solution."""

fees_today = 0


def late_fee(days, per_day=20):
    fee = days * per_day
    return fee


def total_fees(*days_late, per_day=20):
    total = 0
    for days in days_late:
        total += late_fee(days, per_day=per_day)
    return total


def describe(title, **details):
    if not details:
        return title
    parts = []
    for key, value in details.items():
        parts.append(f"{key}={value}")
    return f"{title} ({', '.join(parts)})"


def add_hold(title, holds=None):
    if holds is None:
        holds = []
    holds.append(title)
    return holds
