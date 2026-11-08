"""Three-part names, USE statements and a first schema: fill in the TODOs."""


def qualify(ref, catalog, schema):
    """Return the full `catalog.schema.table` name for a one, two or three-part reference.

    A one-part name uses the current catalog and schema, a two-part name is `schema.table`
    in the current catalog, and a three-part name is returned unchanged.
    Raise ValueError for any other number of parts.
    """
    # TODO: split on "." and fill in what is missing
    raise NotImplementedError


def apply_use(current, statement):
    """Return the new `(catalog, schema)` after running `USE CATALOG x` or `USE SCHEMA y`.

    `current` is the tuple before the statement. Mind what a catalog switch does to the schema.
    Raise ValueError for any other statement.
    """
    # TODO: parse the statement and return the new tuple
    raise NotImplementedError


def grant_sql(privilege, kind, target, principal):
    """Return a GRANT statement, with the principal in backticks.

    Example result: GRANT SELECT ON SCHEMA cat.sch TO `readers`
    """
    # TODO: build the SQL text
    raise NotImplementedError


def create_loans(spark, schema, rows):
    """Create `schema` if needed, save `rows` (loan_id, title) as the table `schema.loans`,
    and return the table format that DESCRIBE DETAIL reports.

    Replace the table if it already exists.
    """
    # TODO: CREATE SCHEMA, saveAsTable, then DESCRIBE DETAIL
    raise NotImplementedError


def list_tables(spark, schema):
    """Return the sorted names of the tables in `schema`, leaving out temporary views."""
    # TODO: SHOW TABLES IN the schema and keep the permanent ones
    raise NotImplementedError


def save_query(spark, view, query):
    """Save `query` as a temporary view called `view` for this session and return its row count."""
    # TODO: CREATE OR REPLACE TEMP VIEW, then count
    raise NotImplementedError
