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
    """Say where a returned item goes, with one match statement."""
    match item:
        case Book(title=t, pages=p) if p > 500:
            return f"{t}: big shelf"
        case Book(title=t):
            return f"{t}: main shelf"
        case {"isbn": code}:
            return f"order {code}"
        case int() | float():
            return f"fine paid: {item}"
        case [first, *rest]:
            return f"{first} + {len(rest)} more"
        case _:
            return "returns desk"


def handle(command):
    """Run one desk command, a string such as "lend Dune ana", with one match statement."""
    match command.split():
        case ["lend", title, member]:
            return f"{title} lent to {member}"
        case ["return", title]:
            return f"{title} returned"
        case ["renew", title, days] if days.isdigit() and int(days) <= MAX_RENEWAL:
            return f"{title} renewed for {days} days"
        case ["renew", _, _]:
            return f"renewals are {MAX_RENEWAL} days at most"
        case []:
            return "nothing to do"
        case _:
            return "unknown command"


def where(desk):
    """Where a Desk member is, matched against the Desk constants."""
    match desk:
        case Desk.FRONT:
            return "by the door"
        case Desk.STAFF:
            return "behind the counter"


def big_orders(orders, price_of):
    """(title, cost) for each order costing more than 20, calling price_of(order) once per order."""
    return [(order["title"], cost) for order in orders if (cost := price_of(order)) > 20]


def branch_settings(overrides):
    """DEFAULTS with the branch's overrides on top, as a new dict; DEFAULTS is left alone."""
    return DEFAULTS | overrides


def find_shelf(title: str, shelves: dict[str, str]) -> str | None:
    """The shelf for the title, or None when it has none."""
    return shelves.get(title)
