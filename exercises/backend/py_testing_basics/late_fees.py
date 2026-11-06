"""Late fees: the code your tests check. Do not change this file."""


def late_fee(days_late, per_day=20, cap=500):
    """Return the fee in pence for a book returned `days_late` days late.

    A book returned on time (0 days late) costs nothing.
    Each day late costs `per_day` pence.
    The fee never goes above `cap` pence.
    A negative `days_late` raises ValueError("days_late cannot be negative").
    """
    if days_late < 0:
        raise ValueError("days_late cannot be negative")
    return min(days_late * per_day, cap)
