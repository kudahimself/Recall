"""Starter: look after the files of a `visits` Delta table with OPTIMIZE and VACUUM. Fill in each TODO."""


def file_count(spark, table):
    """Return how many data files the current version of `table` uses, as an int."""
    # TODO: DESCRIBE DETAIL reports it
    raise NotImplementedError


def compact(spark, table):
    """Compact the small files of `table` into larger ones, without changing any row."""
    # TODO: one OPTIMIZE statement
    raise NotImplementedError


def compact_by(spark, table, column):
    """Compact `table` and also sort its data so rows with close values of `column` share files."""
    # TODO: OPTIMIZE with the clause that co-locates data by a column
    raise NotImplementedError


def vacuum_default(spark, table):
    """Delete the files the table no longer needs, but only those older than the default retention period."""
    # TODO: a plain VACUUM
    raise NotImplementedError


def vacuum_now(spark, table):
    """Delete every unused file at once, whatever its age, and leave the safety check switched on afterwards.

    Delta refuses a retention shorter than the default unless the check is switched off for the session.
    """
    # TODO: switch off spark.databricks.delta.retentionDurationCheck.enabled, VACUUM with a zero-hour retention,
    # and switch the check back on in a finally block
    raise NotImplementedError
