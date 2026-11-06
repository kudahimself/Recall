import pytest

import desk_report as desk


def make_loans():
    return [
        {"title": "Emma", "branch": "north", "days": 12, "returned": True},
        {"title": "Dune", "branch": "south", "days": 30, "returned": False},
        {"title": "Ubik", "branch": "north", "days": 30, "returned": True},
        {"title": "Kim", "branch": "south", "days": 5, "returned": True},
    ]


class Counted:
    """A one-pass iterator over the loans that counts how many it has handed out."""

    def __init__(self, loans):
        self._it = iter(loans)
        self.taken = 0

    def __iter__(self):
        return self

    def __next__(self):
        loan = next(self._it)
        self.taken += 1
        return loan


def test_numbered_counts_from_one():
    assert desk.numbered(["Dune", "Emma", "Ubik"]) == ["1. Dune", "2. Emma", "3. Ubik"]
    assert desk.numbered([]) == []


def test_numbered_takes_any_iterable():
    assert desk.numbered(t for t in ("Kim",)) == ["1. Kim"]


def test_shelf_map_stops_at_the_shorter_list():
    assert desk.shelf_map(["Emma", "Dune", "Ubik"], ["A1", "B2"]) == {"Emma": "A1", "Dune": "B2"}
    assert desk.shelf_map(["Emma"], ["A1", "B2"]) == {"Emma": "A1"}


def test_any_overdue():
    assert desk.any_overdue(make_loans()) is True
    assert desk.any_overdue(make_loans(), limit=30) is False
    assert desk.any_overdue([]) is False


def test_any_overdue_stops_at_the_first_overdue_loan():
    loans = Counted(make_loans())
    assert desk.any_overdue(loans) is True
    assert loans.taken == 2, "any() should stop as soon as Dune is found overdue"


def test_all_back():
    assert desk.all_back(make_loans()) is False
    assert desk.all_back([loan for loan in make_loans() if loan["returned"]]) is True
    assert desk.all_back([]) is True


def test_all_back_stops_at_the_first_loan_still_out():
    loans = Counted(make_loans())
    assert desk.all_back(loans) is False
    assert loans.taken == 2, "all() should stop as soon as Dune is found still out"


def test_by_branch_sorts_by_branch_then_title():
    loans = make_loans()
    assert [loan["title"] for loan in desk.by_branch(loans)] == ["Emma", "Ubik", "Dune", "Kim"]


def test_by_branch_leaves_the_input_alone_and_takes_any_iterable():
    loans = make_loans()
    desk.by_branch(loans)
    assert [loan["title"] for loan in loans] == ["Emma", "Dune", "Ubik", "Kim"]
    assert [loan["title"] for loan in desk.by_branch(iter(loans))] == ["Emma", "Ubik", "Dune", "Kim"]


def test_longest_first_breaks_ties_by_title():
    loans = make_loans()
    assert [loan["title"] for loan in desk.longest_first(loans)] == ["Dune", "Ubik", "Emma", "Kim"]
    assert [loan["title"] for loan in loans] == ["Emma", "Dune", "Ubik", "Kim"]


def test_shelve_in_place_sorts_the_list_itself_and_returns_none():
    loans = make_loans()
    assert desk.shelve_in_place(loans) is None
    assert [loan["title"] for loan in loans] == ["Dune", "Emma", "Kim", "Ubik"]


@pytest.mark.parametrize("raw, clean", [
    ("  late   fee \n", "late fee"),
    ("The\tLeft  Hand of\nDarkness ", "The Left Hand of Darkness"),
    ("Dune", "Dune"),
    ("   ", ""),
])
def test_tidy_collapses_whitespace(raw, clean):
    assert desk.tidy(raw) == clean


@pytest.mark.parametrize("text, link", [
    ("https://books.example.org/dune", True),
    ("http://books.example.org", True),
    ("  HTTPS://Books.example.org ", True),
    ("ftp://books.example.org", False),
    ("see https://books.example.org", False),
    ("", False),
])
def test_is_link(text, link):
    assert desk.is_link(text) is link
