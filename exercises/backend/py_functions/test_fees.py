import fees
from fees import add_hold, describe, late_fee, total_fees


def test_late_fee_default_rate():
    assert late_fee(3) == 60
    assert late_fee(0) == 0


def test_late_fee_rate_by_keyword():
    assert late_fee(3, per_day=50) == 150
    assert late_fee(per_day=10, days=4) == 40


def test_late_fee_leaves_the_global_alone():
    late_fee(5)
    assert fees.fees_today == 0


def test_total_fees_takes_any_number_of_loans():
    assert total_fees(1, 2, 3) == 120
    assert total_fees() == 0
    assert total_fees(2, 2, per_day=50) == 200


def test_describe_without_details():
    assert describe("Dune") == "Dune"


def test_describe_with_details_in_order():
    assert describe("Dune", shelf="B4", copies=2) == "Dune (shelf=B4, copies=2)"
    assert describe("Emma", floor=1) == "Emma (floor=1)"


def test_add_hold_starts_a_new_list_each_call():
    assert add_hold("Dune") == ["Dune"]
    assert add_hold("Emma") == ["Emma"]


def test_add_hold_appends_to_a_given_list():
    holds = ["Dune"]
    result = add_hold("Emma", holds)
    assert result == ["Dune", "Emma"]
    assert result is holds
