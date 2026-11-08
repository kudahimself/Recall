"""Due dates: parse, shift, count and format dates with column functions.

Fill in the functions.
Each helper takes a loans DataFrame and returns it with one extra column, except `count_in_month`.
"""


def parse_borrowed(loans):
    """Add `borrowed`, a date, parsed from the text column `borrowed_text` such as "05/03/2026" (day/month/year)."""
    # TODO: parse with a pattern; remember MM is the month and dd the day
    raise NotImplementedError


def add_due_date(loans):
    """Add `due`: the `borrowed` date plus 21 days."""
    # TODO: move the date by a number of days
    raise NotImplementedError


def add_days_out(loans):
    """Add `days_out`: the number of days from `borrowed` to `returned` (both are dates)."""
    # TODO: mind the argument order, end first
    raise NotImplementedError


def add_month_label(loans):
    """Add `month_label`: the borrowed date as text such as "2026-03" (year, dash, two-digit month)."""
    # TODO: format the date with a pattern, and check the case of the letters
    raise NotImplementedError


def count_in_month(loans, year, month):
    """How many loans were borrowed in that year and month, as a plain int."""
    # TODO: take the year and the month out of `borrowed`, filter, then count
    raise NotImplementedError
