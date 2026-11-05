"""Shelf labels: practise variables, types and strings.

Fill in each function so the tests in test_labels.py pass.
Run them from this folder with: pytest
"""


def clean_title(raw):
    """Return the title without surrounding spaces, with each word capitalised.

    clean_title("  the hobbit ") -> "The Hobbit"
    """
    # TODO
    raise NotImplementedError


def shelf_code(title, shelf):
    """Return the first three letters of the cleaned title in capitals, a dash, then the shelf number.

    shelf_code("  dune ", 4) -> "DUN-4"
    """
    # TODO
    raise NotImplementedError


def parse_pages(text):
    """Return the page count in text such as "310 pages" as an int.

    parse_pages("310 pages") -> 310
    """
    # TODO
    raise NotImplementedError


def reading_time(pages, pages_per_hour):
    """Return how long a book takes to read as "<hours> h <minutes> min".

    Work in whole minutes, rounded down.
    reading_time(310, 40) -> "7 h 45 min"
    """
    # TODO
    raise NotImplementedError


def average_pages(total_pages, books):
    """Return the average number of pages per book, always as a float.

    average_pages(900, 3) -> 300.0
    """
    # TODO
    raise NotImplementedError
