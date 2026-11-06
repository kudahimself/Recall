"""Comprehensions: practise list, dict and set comprehensions, filters, if/else and generator expressions.

Every book is a dict like {"title": "Dune", "author": "Herbert", "year": 1965, "pages": 412}.
Write each function body as ONE comprehension (or one generator expression), not a loop.
Fill in each part so the tests in test_views.py pass.
Run them from this folder with: pytest
"""


def shouted(titles):
    """Return every title in capitals, in order: ["Dune"] -> ["DUNE"]."""
    # TODO
    raise NotImplementedError


def published_after(books, year):
    """Return the titles of the books published after `year`, in order."""
    # TODO
    raise NotImplementedError


def size_labels(books):
    """Return one label per book, in order: "long" for 300 pages or more, otherwise "short"."""
    # TODO
    raise NotImplementedError


def pages_by_title(books):
    """Return a dict of title -> pages."""
    # TODO
    raise NotImplementedError


def authors(books):
    """Return the set of authors, each one once."""
    # TODO
    raise NotImplementedError


def shelf_slots(aisles, shelves):
    """Return every slot code, aisle by aisle: ("A", "B"), (1, 2) -> ["A1", "A2", "B1", "B2"]."""
    # TODO
    raise NotImplementedError


def total_pages(books):
    """Return the pages of all the books added up, using a generator expression (no list)."""
    # TODO
    raise NotImplementedError
