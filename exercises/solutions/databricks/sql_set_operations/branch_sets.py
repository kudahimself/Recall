"""Reference solution for branch_sets.py: look only after your own tests pass."""


def all_copies_sql() -> str:
    return "SELECT title FROM north_books UNION ALL SELECT book_title FROM south_books"


def distinct_titles_sql() -> str:
    return "SELECT title FROM north_books UNION SELECT book_title FROM south_books"


def on_both_shelves_sql() -> str:
    return "SELECT title FROM north_books INTERSECT SELECT book_title FROM south_books"


def only_north_sql() -> str:
    return "SELECT title FROM north_books EXCEPT SELECT book_title FROM south_books"


def only_south_sql() -> str:
    return "SELECT book_title FROM south_books EXCEPT SELECT title FROM north_books"


def extra_north_copies_sql() -> str:
    return "SELECT title FROM north_books EXCEPT ALL SELECT book_title FROM south_books"
