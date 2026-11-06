import functools

import pytest

from fee_tools import LOOKUPS, combine, counted, dvd_fine, fees_for, fees_for_list, shelf_for


@pytest.fixture(autouse=True)
def fresh_cache():
    LOOKUPS.clear()
    getattr(shelf_for, "cache_clear", lambda: None)()


def test_shelf_for_returns_the_code():
    assert shelf_for("dune") == "D-4"
    assert shelf_for("Beloved") == "B-7"


def test_shelf_for_runs_its_body_once_per_title():
    shelf_for("dune")
    shelf_for("dune")
    shelf_for("emma")
    assert shelf_for("dune") == "D-4"
    assert LOOKUPS == ["dune", "emma"]
    info = shelf_for.cache_info()
    assert (info.hits, info.misses) == (2, 2)


def test_dvd_fine_is_a_partial():
    assert isinstance(dvd_fine, functools.partial)
    assert dvd_fine(3) == 150
    assert dvd_fine(0) == 0


def test_combine_folds_the_counts():
    first = {"Dune": 2}
    counts = [first, {"Dune": 1, "Emma": 4}, {"Ubik": 1}]
    assert combine(counts) == {"Dune": 3, "Emma": 4, "Ubik": 1}
    assert first == {"Dune": 2}
    assert combine([]) == {}


def test_counted_counts_and_keeps_the_name():
    @counted
    def renew(title, days=14):
        """Renew a loan."""
        return f"{title}: {days}"

    assert renew.calls == 0
    assert renew("Dune", days=7) == "Dune: 7"
    assert renew("Emma") == "Emma: 14"
    assert renew.calls == 2
    assert renew.__name__ == "renew"
    assert renew.__doc__ == "Renew a loan."


def test_fees_for_list_passes_something_hashable():
    with pytest.raises(TypeError):
        fees_for([1, 2])
    assert fees_for_list([1, 2]) == 60
    assert fees_for_list([]) == 0
    assert fees_for_list([3]) == fees_for((3,))
