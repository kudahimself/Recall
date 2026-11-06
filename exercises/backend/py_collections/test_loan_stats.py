from collections import ChainMap, defaultdict, deque
from itertools import count

from loan_stats import DEFAULTS, Shelf, first_titles, loans_per_month, recent, settings, titles_by_member, top_titles


def test_shelf_is_a_named_tuple():
    shelf = Shelf("B", 4)
    assert shelf.aisle == "B"
    assert shelf.number == 4
    aisle, number = shelf
    assert (aisle, number) == ("B", 4)
    assert shelf == ("B", 4)
    assert Shelf._fields == ("aisle", "number")


def test_top_titles():
    titles = ["Dune", "Emma", "Dune", "Ubik", "Dune", "Emma"]
    assert top_titles(titles, 2) == [("Dune", 3), ("Emma", 2)]
    assert top_titles([], 2) == []


def test_titles_by_member():
    groups = titles_by_member([("ana", "Dune"), ("ben", "Emma"), ("ana", "Ubik")])
    assert isinstance(groups, defaultdict)
    assert groups["ana"] == ["Dune", "Ubik"]
    assert groups["ben"] == ["Emma"]
    assert groups["cy"] == []


def test_recent_keeps_only_the_last_n():
    last = recent(["Dune", "Emma", "Ubik", "Beloved"])
    assert isinstance(last, deque)
    assert list(last) == ["Emma", "Ubik", "Beloved"]
    last.append("Ulysses")
    assert list(last) == ["Ubik", "Beloved", "Ulysses"]
    assert list(recent(["Dune", "Emma"], n=1)) == ["Emma"]


def test_settings_look_in_overrides_first():
    overrides = {"loan_days": 7}
    s = settings(overrides)
    assert isinstance(s, ChainMap)
    assert s["loan_days"] == 7
    assert s["fee_per_day"] == 20
    s["max_loans"] = 2
    assert overrides == {"loan_days": 7, "max_loans": 2}
    assert DEFAULTS == {"loan_days": 14, "fee_per_day": 20, "max_loans": 5}


def test_first_titles_takes_only_what_it_needs():
    assert first_titles([["Dune", "Emma"], ("Ubik",), ["Beloved"]], 3) == ["Dune", "Emma", "Ubik"]
    assert first_titles([["Dune"]], 5) == ["Dune"]
    endless = (f"Copy {i}" for i in count(1))
    assert first_titles([["Dune"], endless], 3) == ["Dune", "Copy 1", "Copy 2"]


def test_loans_per_month_groups_months_that_are_not_neighbours():
    loans = [
        ("2025-02", "Dune"),
        ("2025-01", "Emma"),
        ("2025-02", "Ubik"),
        ("2025-03", "Beloved"),
        ("2025-01", "Ulysses"),
    ]
    assert loans_per_month(loans) == [("2025-01", 2), ("2025-02", 2), ("2025-03", 1)]
    assert loans_per_month([]) == []
