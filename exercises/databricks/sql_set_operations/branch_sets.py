"""Set-operation queries: each function returns the SQL text of one query.

The tests register these temp views, run your text with spark.sql and compare the rows:

    north_books(title)        -- one row per copy on the North shelf
    south_books(book_title)   -- one row per copy on the South shelf; note the different column name

Set operations match columns by position, not by name.
"""


def all_copies_sql() -> str:
    """Every copy from both shelves, duplicates kept: one column."""
    # TODO: stack the two queries without removing anything
    raise NotImplementedError


def distinct_titles_sql() -> str:
    """Each title that is on either shelf, listed once: one column."""
    # TODO: stack the two queries and drop duplicate rows
    raise NotImplementedError


def on_both_shelves_sql() -> str:
    """Titles found on both shelves, listed once: one column."""
    # TODO: the rows that appear in both results
    raise NotImplementedError


def only_north_sql() -> str:
    """Titles on the North shelf and not on the South shelf: one column."""
    # TODO: the rows of the first result that are missing from the second
    raise NotImplementedError


def only_south_sql() -> str:
    """Titles on the South shelf and not on the North shelf: one column."""
    # TODO: mind which query comes first
    raise NotImplementedError


def extra_north_copies_sql() -> str:
    """North copies beyond what South has of the same title: one row per surplus copy.

    A title with 2 North copies and 1 South copy gives one row.
    """
    # TODO: the variant that keeps duplicates and subtracts one for one
    raise NotImplementedError
