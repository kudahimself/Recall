"""Queries with subqueries and CTEs: each function returns the SQL text of one query.

The tests register these temp views, run your text with spark.sql and compare the rows:

    books(title, pages, genre)
    loans(title, member)
"""


def longer_than_average_sql() -> str:
    """Titles with more pages than the average of all books: (title)."""
    # TODO: a subquery that returns one value
    raise NotImplementedError


def longer_than_genre_average_sql() -> str:
    """Titles with more pages than the average of their own genre: (title)."""
    # TODO: a subquery that refers to the outer row
    raise NotImplementedError


def borrowed_titles_sql() -> str:
    """Titles that have at least one loan: (title)."""
    # TODO: test for the existence of a matching loan
    raise NotImplementedError


def never_borrowed_sql() -> str:
    """Titles that have no loan: (title)."""
    # TODO: the opposite of the previous query
    raise NotImplementedError


def popular_titles_sql() -> str:
    """Titles with 2 or more loans: (title, n_loans).

    Write it as a CTE: name the per-title loan counts first with WITH, then query that name.
    """
    # TODO: WITH ... AS (...) SELECT ...
    raise NotImplementedError
