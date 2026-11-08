"""Starter: a loans table kept as a Delta folder at a path. Fill in each TODO."""


def create_loans(spark, path, rows):
    """Create the Delta table at `path` from `(loan_id, title)` tuples, replacing anything there.

    Columns are named `loan_id` and `title`.
    """
    # TODO: build a DataFrame, then write it in delta format with the overwrite mode
    raise NotImplementedError


def add_loans(spark, path, rows):
    """Add `(loan_id, title)` tuples to the table at `path`, keeping the rows already there."""
    # TODO: the same write, with the mode that adds rows
    raise NotImplementedError


def read_loans(spark, path):
    """Return the table at `path` as a DataFrame (its latest version)."""
    # TODO: read in delta format from the path
    raise NotImplementedError


def append_checked(spark, path, rows_with_copies):
    """Try to add `(loan_id, title, copies)` tuples to the table at `path`.

    Return True if Delta refused the write because the schema does not match (nothing is committed),
    and False if the write went through.
    """
    # TODO: write with the plain append mode and catch the AnalysisException that Delta raises
    raise NotImplementedError


def append_evolving(spark, path, rows_with_copies):
    """Add `(loan_id, title, copies)` tuples to the table at `path` and let the new `copies` column join its schema."""
    # TODO: append again, but with the write option that allows new columns
    raise NotImplementedError


def commit_versions(spark, path):
    """Return the version numbers of the table's commits as a list, oldest first."""
    # TODO: ask the table for its history and collect the version column
    raise NotImplementedError
