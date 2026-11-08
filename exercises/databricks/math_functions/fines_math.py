"""Fines maths: row-wise math functions and aggregates on late fines.

Fill in the functions.
Fines have the columns member_id, branch and amount (a double that can be null).
Import the module with `from pyspark.sql import functions as F` and call `F.sum`, so Python's own `sum` and `round` stay usable.
"""


def fines_summary(fines):
    """One row per branch with the columns branch, total, avg_fine and n.

    total is the sum of amount, avg_fine the average rounded to 2 decimals, n the number of rows (not of amounts).
    """
    # TODO: group by branch and aggregate; round the average
    raise NotImplementedError


def add_whole_pounds(fines):
    """Add `pounds`: each amount rounded up to the next whole pound (2.0 stays 2, 3.5 becomes 4)."""
    # TODO: use the rounding-up math function
    raise NotImplementedError


def add_capped(fines, cap):
    """Add `charged`: the amount, but never more than `cap`."""
    # TODO: pick the smaller of two values on each row
    raise NotImplementedError


def row_stats(fines):
    """A dict {"rows": ..., "filled": ..., "mean": ...}.

    rows counts every row, filled counts rows that have an amount, and mean is the average of the amounts that exist.
    Compute all three in one pass and return plain Python numbers.
    """
    # TODO: one agg() with count of everything, count of the column, and avg
    raise NotImplementedError


def largest_fine(fines):
    """The biggest amount as a plain Python float."""
    # TODO: aggregate the whole table to one value
    raise NotImplementedError
