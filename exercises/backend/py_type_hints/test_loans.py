import dataclasses
import typing

import pytest

from loans import Loan, ShelfMark, find, loan_from_form, to_rows, total_days


def test_loan_is_a_dataclass_with_defaults():
    loan = Loan("Dune", "ana")
    assert dataclasses.is_dataclass(Loan)
    assert loan.days == 14
    assert loan.renewals == []
    assert repr(loan) == "Loan(title='Dune', member='ana', days=14, renewals=[])"
    assert Loan("Dune", "ana", 21) == Loan("Dune", "ana", days=21)


def test_each_loan_gets_its_own_renewals_list():
    first = Loan("Dune", "ana")
    second = Loan("Emma", "ben")
    first.renewals.append("2025-03-01")
    assert second.renewals == []


def test_loan_fields_are_hinted():
    assert typing.get_type_hints(Loan) == {
        "title": str,
        "member": str,
        "days": int,
        "renewals": list[str],
    }


def test_shelf_mark_is_frozen():
    mark = ShelfMark("B", 3)
    assert typing.get_type_hints(ShelfMark) == {"aisle": str, "shelf": int}
    assert mark == ShelfMark("B", 3)
    with pytest.raises(dataclasses.FrozenInstanceError):
        mark.shelf = 4
    assert len({ShelfMark("B", 3), ShelfMark("B", 3), ShelfMark("C", 1)}) == 2


def test_functions_are_hinted():
    assert typing.get_type_hints(total_days) == {"loans": list[Loan], "return": int}
    assert typing.get_type_hints(loan_from_form) == {"form": dict[str, str], "return": Loan}
    find_hints = typing.get_type_hints(find)
    assert find_hints["loans"] == list[Loan]
    assert find_hints["title"] is str
    assert set(typing.get_args(find_hints["return"])) == {Loan, type(None)}
    rows_hints = typing.get_type_hints(to_rows)
    assert rows_hints["loans"] == list[Loan]
    assert typing.get_origin(rows_hints["return"]) is list


def test_total_days_and_find():
    loans = [Loan("Dune", "ana"), Loan("Emma", "ben", 7), Loan("Dune", "cy", 21)]
    assert total_days(loans) == 42
    assert total_days([]) == 0
    assert find(loans, "Dune") is loans[0]
    assert find(loans, "Ubik") is None


def test_loan_from_form_converts_and_checks():
    assert loan_from_form({"title": "Dune", "member": "ana", "days": "21"}) == Loan("Dune", "ana", 21)
    assert loan_from_form({"title": "Emma", "member": "ben"}).days == 14
    with pytest.raises(ValueError) as e:
        loan_from_form({"title": "Dune", "member": "ana", "days": "many"})
    assert str(e.value) == "days must be a whole number"
    with pytest.raises(ValueError) as e:
        loan_from_form({"title": "Dune", "member": "ana", "days": "0"})
    assert str(e.value) == "days must be at least 1"


def test_to_rows():
    loans = [Loan("Dune", "ana", renewals=["2025-03-01"]), Loan("Emma", "ben", 7)]
    assert to_rows(loans) == [
        {"title": "Dune", "member": "ana", "days": 14, "renewals": ["2025-03-01"]},
        {"title": "Emma", "member": "ben", "days": 7, "renewals": []},
    ]
