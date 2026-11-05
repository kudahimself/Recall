"""Generators: practise yield, lazy and endless generators, yield from, send, and reading a generator once.

Fill in each part so the tests in test_reading.py pass.
Run them from this folder with: pytest
"""


def numbered(titles):
    """Generator: yield "1. Dune", "2. Emma", ... one title at a time."""
    # TODO
    raise NotImplementedError


def ticket_numbers(start):
    """Generator that never ends: yield start, start + 1, start + 2, ... for the holds queue."""
    # TODO
    raise NotImplementedError


def chunks(items, size):
    """Generator: yield lists of `size` items in order; the last list may be shorter.

    chunks(["a", "b", "c"], 2) yields ["a", "b"] then ["c"].
    """
    # TODO
    raise NotImplementedError


def all_titles(*shelves):
    """Generator: yield every title of the first shelf, then of the next, and so on, using `yield from`."""
    # TODO
    raise NotImplementedError


def running_total():
    """Coroutine: keep a running total of the fees sent in.

    The first next() yields 0; after that, each gen.send(fee) adds the fee and yields the new total.
    """
    # TODO
    raise NotImplementedError


def stats(titles):
    """Return (how many titles, the longest title) for any iterable of titles, a generator included.

    The first one wins a tie, and no titles gives (0, "").
    """
    # TODO
    raise NotImplementedError
