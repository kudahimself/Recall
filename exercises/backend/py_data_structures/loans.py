"""Loan lists: practise lists, tuples, dicts and sets.

Fill in each function so the tests in test_loans.py pass.
Run them from this folder with: pytest
"""


def unique_titles(loans):
    """Return each title once, in alphabetical order, as a new list.

    The list passed in must be left exactly as it was.
    unique_titles(["Ubik", "Dune", "Ubik"]) -> ["Dune", "Ubik"]
    """
    # TODO
    raise NotImplementedError


def count_loans(loans):
    """Return a dict of title -> times borrowed, with keys in the order each title first appears.

    count_loans(["Emma", "Dune", "Emma"]) -> {"Emma": 2, "Dune": 1}
    """
    # TODO
    raise NotImplementedError


def total_fines(fines, titles):
    """Return the sum of the fines owed for `titles`; a title missing from `fines` owes 0.

    total_fines({"Dune": 20, "Ubik": 5}, ["Dune", "Emma"]) -> 20
    """
    # TODO
    raise NotImplementedError


def on_both_lists(list_a, list_b):
    """Return the titles that appear on both lists, each once, in alphabetical order.

    on_both_lists(["Dune", "Emma", "Dune"], ["Emma", "Dune", "Ubik"]) -> ["Dune", "Emma"]
    """
    # TODO
    raise NotImplementedError


def describe_spot(spot):
    """Return where a book sits, from an (aisle, shelf) tuple.

    describe_spot(("B", 4)) -> "aisle B, shelf 4"
    """
    # TODO
    raise NotImplementedError


def last_three(loans):
    """Return the three most recent loans (the end of the list), newest first, as a new list.

    last_three(["Dune", "Emma", "Ubik", "Beloved"]) -> ["Beloved", "Ubik", "Emma"]
    """
    # TODO
    raise NotImplementedError
