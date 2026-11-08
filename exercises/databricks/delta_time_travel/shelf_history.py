"""Starter: read and rewind the history of a `shelves` Delta table (shelf, books). Fill in each TODO."""


def latest_version(spark, table):
    """Return the highest version number of `table` as an int."""
    # TODO: look at the table's history and take the largest version
    raise NotImplementedError


def operations(spark, table):
    """Return the operation names of the table's commits as a list, oldest first (e.g. `["CREATE TABLE", "WRITE"]`)."""
    # TODO: from the history, collect the operation column ordered by version
    raise NotImplementedError


def total_books_at_version(spark, table, version):
    """Return the total of the `books` column as it was at `version`."""
    # TODO: a query that reads an old version of the table
    raise NotImplementedError


def total_books_at_time(spark, table, moment):
    """Return the total of `books` as the table was at `moment`, a timestamp string such as '2026-01-15 10:00:00'."""
    # TODO: the time-based form of the same query, or the matching reader option
    raise NotImplementedError


def undo_to_version(spark, table, version):
    """Put `table` back to the state it had at `version`, keeping the later versions in the history."""
    # TODO: one RESTORE statement
    raise NotImplementedError
