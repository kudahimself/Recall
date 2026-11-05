"""Testing Basics: reference solution."""
import pytest

from fees import late_fee


def test_on_time_costs_nothing():
    assert late_fee(0) == 0


@pytest.mark.parametrize("days_late, want", [(1, 20), (3, 60), (10, 200)])
def test_fee_per_day(days_late, want):
    assert late_fee(days_late) == want


def test_fee_stops_at_the_cap():
    assert late_fee(30) == 500
    assert late_fee(4, cap=50) == 50


def test_per_day_rate_can_be_changed():
    assert late_fee(3, per_day=50) == 150


def test_negative_days_are_refused():
    with pytest.raises(ValueError, match="cannot be negative"):
        late_fee(-1)
