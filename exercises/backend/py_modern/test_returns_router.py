import typing

import pytest

import returns_router as router
from returns_router import Book, Desk


@pytest.mark.parametrize("item, where_to", [
    (Book("Dune", 612), "Dune: big shelf"),
    (Book("Emma", 474), "Emma: main shelf"),
    (Book("Kim", 500), "Kim: main shelf"),
    ({"isbn": "978-0", "qty": 2}, "order 978-0"),
    ({"title": "Ubik"}, "returns desk"),
    (3, "fine paid: 3"),
    (2.5, "fine paid: 2.5"),
    (["Ubik", "Kim", "Emma"], "Ubik + 2 more"),
    (["Ubik"], "Ubik + 0 more"),
    ([], "returns desk"),
    ("Dune", "returns desk"),
    (None, "returns desk"),
])
def test_shelve(item, where_to):
    assert router.shelve(item) == where_to


@pytest.mark.parametrize("command, answer", [
    ("lend Dune ana", "Dune lent to ana"),
    ("return Emma", "Emma returned"),
    ("  return   Emma ", "Emma returned"),
    ("renew Ubik 14", "Ubik renewed for 14 days"),
    ("renew Ubik 7", "Ubik renewed for 7 days"),
    ("renew Ubik 30", "renewals are 14 days at most"),
    ("", "nothing to do"),
    ("lend Dune", "unknown command"),
    ("return Emma Dune", "unknown command"),
    ("burn Dune", "unknown command"),
])
def test_handle(command, answer):
    assert router.handle(command) == answer


def test_where_compares_with_the_desk_constants():
    assert router.where(Desk.FRONT) == "by the door"
    assert router.where(Desk.STAFF) == "behind the counter"


def test_big_orders_prices_each_order_once():
    orders = [{"title": "Dune", "qty": 3}, {"title": "Emma", "qty": 1}, {"title": "Ubik", "qty": 5}]
    priced = []

    def price_of(order):
        priced.append(order["title"])
        return order["qty"] * 8

    assert router.big_orders(orders, price_of) == [("Dune", 24), ("Ubik", 40)]
    assert priced == ["Dune", "Emma", "Ubik"], "call price_of once per order, not again for the result"


def test_branch_settings_merges_into_a_new_dict():
    before = dict(router.DEFAULTS)
    merged = router.branch_settings({"loan_days": 14, "late_desk": "north"})
    assert merged == {"loan_days": 14, "max_loans": 5, "fines": True, "late_desk": "north"}
    assert merged is not router.DEFAULTS
    assert router.DEFAULTS == before


def test_find_shelf():
    shelves = {"Dune": "B2", "Emma": "A1"}
    assert router.find_shelf("Dune", shelves) == "B2"
    assert router.find_shelf("Ubik", shelves) is None


def test_find_shelf_uses_the_new_type_hints():
    hints = typing.get_type_hints(router.find_shelf)
    assert hints == {"title": str, "shelves": dict[str, str], "return": str | None}
