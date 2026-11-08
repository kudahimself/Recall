"""Starter: record, read and apply the row changes of a `titles` Delta table (isbn, shelf). Fill in each TODO."""


def create_tracked(spark, table):
    """Create `table` with the columns isbn STRING and shelf STRING, recording its changes from the start."""
    # TODO: CREATE TABLE with the table property that switches the Change Data Feed on
    raise NotImplementedError


def start_tracking(spark, table):
    """Switch the Change Data Feed on for an existing `table`, from its next commit on."""
    # TODO: one ALTER TABLE statement
    raise NotImplementedError


def changes_since(spark, table, start, end=None):
    """Return the changes from version `start` (to `end` if given) as a list of tuples.

    Each tuple is (commit version, isbn, shelf, change type), ordered by version and then isbn.
    Leave out the old values of updated rows, so each update shows once, with its new shelf.
    """
    # TODO: a query over table_changes, filtered on _change_type
    raise NotImplementedError


def change_counts(spark, table, start):
    """Return how many rows were inserted, updated and deleted from version `start` on.

    The dict always has the keys "insert", "update" and "delete", and an update counts once.
    """
    # TODO: count the changes by type
    raise NotImplementedError


def apply_changes(spark, table, target, start):
    """Bring `target` (isbn, shelf), a copy of `table` as it was just before version `start`, up to date.

    Use the changes from `start` on, and only the latest change of each isbn:
    a delete removes the isbn from the target, an insert or update sets its shelf,
    adding the isbn when the target does not have it.
    """
    # TODO: the latest change per isbn (a ROW_NUMBER window on _commit_version), then one MERGE INTO
    raise NotImplementedError
