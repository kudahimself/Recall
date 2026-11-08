"""Starter: choose how loans are ingested and laid out, and keep a copy in step with the source. Fill in each TODO.

The loans table is (loan_id INT, branch STRING, due DATE). A change log row is
(seq INT, op STRING, loan_id INT, branch STRING, due DATE), where op is "I", "U" or "D"
and a higher seq is a later change.
"""


def pick_trigger(freshness_seconds, push_source):
    """Return the keyword arguments for writeStream.trigger(...).

    Only a push source (such as Kafka) whose consumers need data within 60 seconds gets a
    continuous stream, {"processingTime": "<freshness_seconds> seconds"}; anything else is
    incremental batch, {"availableNow": True}, run on a schedule.
    """
    # TODO
    raise NotImplementedError


def choose_layout(table_gb, column, distinct_values):
    """Return the layout clause for a table of `table_gb` GB filtered on `column`.

    Partition, "PARTITIONED BY (<column>)", only when the table is over 1000 GB (about 1 TB)
    and each of the column's `distinct_values` would hold at least 1 GB; otherwise cluster,
    "CLUSTER BY (<column>)".
    """
    # TODO
    raise NotImplementedError


def create_clustered(spark, table, keys):
    """Create the empty loans table `table`, liquid clustered by the column names in `keys`."""
    # TODO: CREATE TABLE ... CLUSTER BY
    raise NotImplementedError


def recluster(spark, table, keys):
    """Change `table`'s clustering keys to `keys`, without rewriting its data."""
    # TODO: one ALTER TABLE
    raise NotImplementedError


def apply_change_log(spark, table, changes):
    """Apply the change log DataFrame `changes` to the loans table `table` with one MERGE.

    Use only the latest change (highest seq) of each loan_id: "D" deletes the loan, and "I" or "U"
    sets its branch and due, inserting the loan when the table does not hold it.
    """
    # TODO: the latest change per loan (a ROW_NUMBER window), then MERGE INTO
    raise NotImplementedError


def snapshot_changes(old, new):
    """Diff two snapshots of loans (DataFrames) into changes: op, loan_id, branch, due.

    "I" for a loan only in `new`, "D" for one only in `old` (with its old values), and "U" for one
    in both whose branch or due differs (with its new values); unchanged loans give no row.
    Return a DataFrame in loan_id order. A NULL due is a value like any other.
    """
    # TODO: a full outer join on loan_id
    raise NotImplementedError


def sync_method(has_change_log, rows, small_rows=100_000):
    """Return how to keep a copy of a source table in step: "change log", "snapshot diff" or "full reload".

    Read the change log when the source has one; without one, reload in full only a table of at
    most `small_rows` rows, and diff snapshots of anything bigger.
    """
    # TODO
    raise NotImplementedError
