"""Starter: the decisions of a declarative pipeline, made in plain Python and Spark. Fill in each TODO."""


class ExpectationFailed(Exception):
    """Raised when a row breaks an expectation whose action is "fail" (already written for you)."""


def constraint_sql(name, condition, on_violation=None):
    """Return the SQL text of one expectation, e.g. "CONSTRAINT has_k EXPECT (k IS NOT NULL)".

    `on_violation` is None (only warn), "drop" (drop failing rows) or "fail" (stop the update),
    and adds the matching ON VIOLATION clause. Raise ValueError for any other value.
    """
    # TODO: build the text, adding the clause for drop and fail
    raise NotImplementedError


def pick_dataset(append_only_source, aggregates_or_joins):
    """Return "STREAMING TABLE" or "MATERIALIZED VIEW" for a dataset.

    A dataset that reads an append-only source and neither aggregates nor joins processes
    only its new rows; anything else needs its whole result kept correct.
    """
    # TODO: decide from the two flags
    raise NotImplementedError


def check_rows(df, expectations):
    """Apply expectations to a Spark DataFrame the way a pipeline applies them to a dataset.

    `expectations` is a list of (name, condition, action): `condition` is a SQL expression a
    good row makes true, and `action` is "warn", "drop" or "fail".
    Return (kept, failures): `kept` is the DataFrame without the rows a "drop" expectation
    rejects, and `failures` maps every expectation's name to its number of failing rows.
    Raise ExpectationFailed, naming the expectation, when a "fail" expectation has a failing row.
    The tests use conditions that are never NULL.
    """
    # TODO: count each expectation's failing rows, then filter on the "drop" ones
    raise NotImplementedError


def update_order(datasets):
    """Return the dataset names in an order the pipeline can build them in.

    `datasets` maps each name to its query text. A query depends on every other dataset whose
    name appears in it as a whole word (as in `FROM silver_t` or `STREAM(bronze_t)`), and a
    dataset comes after everything it depends on. When several are ready at once, take them
    in alphabetical order. Raise ValueError when the dependencies form a cycle.
    """
    # TODO: find each query's dependencies, then build the order a ready dataset at a time
    raise NotImplementedError
