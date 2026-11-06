"""Modern Python (3.10+): practise match/case, the walrus operator, dict | and the new type hints.

Fill in each part so the tests in test_returns_router.py pass.
Needs Python 3.10 or newer. Run the tests from this folder with: pytest
"""
from dataclasses import dataclass
from enum import Enum


@dataclass
class Book:
    title: str
    pages: int


class Desk(Enum):
    FRONT = "front"
    STAFF = "staff"


MAX_RENEWAL = 14

DEFAULTS = {"loan_days": 21, "max_loans": 5, "fines": True}


def shelve(item):
    """Say where a returned item goes, with one match statement.

    A Book over 500 pages: "<title>: big shelf"; any other Book: "<title>: main shelf".
    A dict with an "isbn" key: "order <isbn>".
    An int or a float: "fine paid: <amount>".
    A list with at least one title: "<first> + <how many others> more".
    Anything else, the empty list included: "returns desk".
    """
    # TODO
    raise NotImplementedError


def handle(command):
    """Run one desk command, a string such as "lend Dune ana", with one match statement.

    "lend <title> <member>"  -> "<title> lent to <member>"
    "return <title>"         -> "<title> returned"
    "renew <title> <days>"   -> "<title> renewed for <days> days" when days is at most MAX_RENEWAL,
                                otherwise "renewals are 14 days at most"
    "" (no words)            -> "nothing to do"
    anything else            -> "unknown command"
    """
    # TODO
    raise NotImplementedError


def where(desk):
    """Where a Desk member is: Desk.FRONT "by the door", Desk.STAFF "behind the counter"."""
    # TODO: match desk against the Desk constants
    raise NotImplementedError


def big_orders(orders, price_of):
    """(title, cost) for each order costing more than 20, in order.

    price_of(order) is slow: call it once per order, inside one list comprehension.
    """
    # TODO
    raise NotImplementedError


def branch_settings(overrides):
    """DEFAULTS with the branch's overrides on top, as a new dict; DEFAULTS is left alone."""
    # TODO
    raise NotImplementedError


# TODO: annotate: title is a str, shelves maps str to str, and it returns a str or None.
def find_shelf(title, shelves):
    """The shelf for the title, or None when it has none."""
    # TODO
    raise NotImplementedError
