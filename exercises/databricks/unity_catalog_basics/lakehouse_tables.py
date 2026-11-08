"""Three-level names, managed and external tables: fill in the TODOs."""


def split_name(full_name):
    """Split `catalog.schema.table` into a (catalog, schema, table) tuple.

    Raise ValueError unless there are exactly three non-empty parts.
    """
    # TODO: split on "." and check the parts
    raise NotImplementedError


def create_managed(spark, table):
    """Create a Delta table `table` (member_id INT, city STRING) and leave out any location.

    Spark then chooses where the files go and owns them.
    """
    # TODO: CREATE TABLE without LOCATION
    raise NotImplementedError


def create_external(spark, table, location):
    """Create a Delta table `table` (member_id INT, city STRING) whose files live at `location`."""
    # TODO: CREATE TABLE with a LOCATION clause
    raise NotImplementedError


def table_kind(spark, table):
    """Return "MANAGED" or "EXTERNAL", read from the table's DESCRIBE EXTENDED output."""
    # TODO: find the right row of DESCRIBE TABLE EXTENDED
    raise NotImplementedError


def table_location(spark, table):
    """Return the folder holding the table's files as a plain local path (no `file:` prefix)."""
    # TODO: find the location row of DESCRIBE TABLE EXTENDED
    raise NotImplementedError


def drop_removes_files(spark, table):
    """Drop `table` and return True if its data folder is gone afterwards, False if it is still there."""
    # TODO: read the location first, drop the table, then look at the folder
    raise NotImplementedError
