"""Starter: keep a `holdings` table (isbn, copies) up to date with Delta SQL. Fill in each TODO."""


def apply_delivery(spark, table, delivery):
    """Upsert a delivery DataFrame `(isbn, copies)` into `table`.

    An ISBN already held gets the delivered copies added to its count.
    An ISBN the table does not have yet is inserted.
    Every other row stays as it is.
    """
    # TODO: expose `delivery` as a temp view, then run one MERGE INTO with a matched and a not-matched clause
    raise NotImplementedError


def write_off(spark, table, isbn, lost):
    """Subtract `lost` copies from the row of `isbn` in `table`, and change no other row."""
    # TODO: an UPDATE with a WHERE clause
    raise NotImplementedError


def drop_empty(spark, table):
    """Remove the rows of `table` that have no copies left (0 or fewer)."""
    # TODO: a DELETE with a WHERE clause
    raise NotImplementedError


def mirror_catalogue(spark, table, catalogue):
    """Make `table` equal to the DataFrame `catalogue` of `(isbn, copies)`.

    Rows in both are updated to the catalogue's copies, new ISBNs are inserted,
    and ISBNs missing from the catalogue are removed, all in a single statement.
    """
    # TODO: one MERGE with three clauses, the last acting on target rows that the source lacks
    raise NotImplementedError


def make_copy(spark, table, copy_name):
    """Create `copy_name` as a shallow clone of `table`: metadata only, reading the source's data files."""
    # TODO: CREATE TABLE ... SHALLOW CLONE
    raise NotImplementedError
