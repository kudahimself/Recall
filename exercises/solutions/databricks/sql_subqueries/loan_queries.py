"""Reference solution for loan_queries.py: look only after your own tests pass."""


def longer_than_average_sql() -> str:
    return "SELECT title FROM books WHERE pages > (SELECT AVG(pages) FROM books)"


def longer_than_genre_average_sql() -> str:
    return """SELECT title FROM books o
              WHERE pages > (SELECT AVG(i.pages) FROM books i WHERE i.genre = o.genre)"""


def borrowed_titles_sql() -> str:
    return """SELECT title FROM books b
              WHERE EXISTS (SELECT 1 FROM loans l WHERE l.title = b.title)"""


def never_borrowed_sql() -> str:
    return """SELECT title FROM books b
              WHERE NOT EXISTS (SELECT 1 FROM loans l WHERE l.title = b.title)"""


def popular_titles_sql() -> str:
    return """WITH counts AS (
                SELECT title, COUNT(*) AS n_loans FROM loans GROUP BY title
              )
              SELECT title, n_loans FROM counts WHERE n_loans >= 2"""
