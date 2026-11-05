"""Late fees: practise functions, default and keyword arguments, *args, **kwargs and scope.

Fill in each function so the tests in test_fees.py pass.
Run them from this folder with: pytest
"""

# Fees charged so far today. late_fee must NOT change this.
fees_today = 0


def late_fee(days, per_day=20):
    """Return the fee in pence for a book returned `days` late; `per_day` defaults to 20.

    late_fee(3) -> 60
    late_fee(3, per_day=50) -> 150
    """
    # TODO
    raise NotImplementedError


def total_fees(*days_late, per_day=20):
    """Return the sum of late_fee for any number of loans, all charged at the same rate.

    total_fees(1, 2, 3) -> 120
    total_fees() -> 0
    total_fees(2, 2, per_day=50) -> 200
    """
    # TODO
    raise NotImplementedError


def describe(title, **details):
    """Return the title followed by any extra details in brackets, in the order they were passed.

    describe("Dune") -> "Dune"
    describe("Dune", shelf="B4", copies=2) -> "Dune (shelf=B4, copies=2)"
    """
    # TODO
    raise NotImplementedError


def add_hold(title, holds=None):
    """Append `title` to the `holds` list and return the list.

    Called without a list, it starts a NEW empty list on every call.
    add_hold("Dune") -> ["Dune"]
    add_hold("Emma") -> ["Emma"]            (not ["Dune", "Emma"])
    add_hold("Emma", ["Dune"]) -> ["Dune", "Emma"]
    """
    # TODO
    raise NotImplementedError
