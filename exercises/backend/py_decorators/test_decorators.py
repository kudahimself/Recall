import pytest

import decorators
from decorators import CALLS, hold_fee, logged, require_positive


@pytest.fixture(autouse=True)
def empty_calls():
    CALLS.clear()


def test_logged_records_the_call_and_returns_the_result():
    @logged
    def double(x):
        return x * 2

    assert double(4) == 8
    assert CALLS == [("double", (4,), {})]


def test_logged_passes_any_arguments_through():
    @logged
    def join(*parts, sep="-"):
        return sep.join(parts)

    assert join("a", "b", sep="+") == "a+b"
    assert CALLS == [("join", ("a", "b"), {"sep": "+"})]


def test_logged_records_before_calling():
    @logged
    def boom():
        raise RuntimeError("fails")

    with pytest.raises(RuntimeError):
        boom()
    assert CALLS == [("boom", (), {})]


def test_logged_keeps_name_and_docstring():
    @logged
    def double(x):
        """Twice x."""
        return x * 2

    assert double.__name__ == "double"
    assert double.__doc__ == "Twice x."


def test_require_positive_refuses_without_calling():
    ran = []

    @require_positive
    def record(*numbers):
        ran.append(numbers)
        return sum(numbers)

    assert record(1, 2) == 3
    with pytest.raises(ValueError) as e:
        record(1, 0)
    assert str(e.value) == "arguments must be positive"
    with pytest.raises(ValueError):
        record(-5)
    assert ran == [(1, 2)]


def test_require_positive_keeps_name():
    @require_positive
    def area(w, h):
        """Width times height."""
        return w * h

    assert area.__name__ == "area"
    assert area.__doc__ == "Width times height."


def test_hold_fee_is_decorated_in_the_right_order():
    assert hold_fee(3, per_book=25) == 75
    with pytest.raises(ValueError):
        hold_fee(0)
    assert CALLS == [("hold_fee", (3,), {"per_book": 25})]
    assert hold_fee.__name__ == "hold_fee"
    assert decorators.hold_fee.__doc__ == "Return the fee for placing holds on `books` books."
