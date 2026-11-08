"""Join queries for the library: each function returns the SQL text of one query.

The tests register these temp views, run your text with spark.sql and compare the rows:

    books(book_id, title)
    members(member_id, member_name, referred_by)   -- referred_by is another member_id, or NULL
    loans(loan_id, book_id, member_id)
    branches(branch)
"""


def loaned_titles_sql() -> str:
    """One row per loan: (title, member_name). Books nobody borrowed do not appear."""
    # TODO: join loans to books and to members
    raise NotImplementedError


def all_books_with_loans_sql() -> str:
    """Every book, with its loans: (title, loan_id). A book with no loan shows loan_id NULL."""
    # TODO: keep every book even when no loan matches
    raise NotImplementedError


def never_loaned_sql() -> str:
    """The titles of books that have no loan at all: (title)."""
    # TODO: keep the books that have no match in loans
    raise NotImplementedError


def referrals_sql() -> str:
    """Each member who was referred, with who referred them: (member_name, referrer)."""
    # TODO: read members twice under two aliases
    raise NotImplementedError


def member_branch_pairs_sql() -> str:
    """Every member paired with every branch: (member_name, branch)."""
    # TODO: pair every row of one table with every row of the other
    raise NotImplementedError
