import time

import pytest

import batch
from batch import check_all, count_words_parallel, fetch_all, finish_order

TITLES = {"111": "Dune", "222": "Emma", "333": "Ubik", "444": "Kim"}


def slow_lookup(isbn):
    time.sleep(0.2)
    return TITLES[isbn]


def test_fetch_all_keeps_the_input_order():
    def lookup(isbn):
        time.sleep(0.05 * int(isbn[0]))   # "444" finishes last, so finishing order differs from input order
        return TITLES[isbn]

    assert fetch_all(lookup, ["444", "111", "333", "222"]) == ["Kim", "Dune", "Ubik", "Emma"]


def test_fetch_all_uses_the_pool_at_the_same_time():
    start = time.perf_counter()
    assert fetch_all(slow_lookup, ["111", "222", "333", "444"] * 2, workers=4) == list(TITLES.values()) * 2
    assert time.perf_counter() - start < 1.0   # one after another would take 1.6 seconds


def test_fetch_all_raises_a_failing_call():
    with pytest.raises(KeyError):
        fetch_all(slow_lookup, ["111", "999"])


def test_check_all_collects_results_and_errors():
    found, failed = check_all(slow_lookup, ["111", "999", "333", "000"])
    assert found == {"111": "Dune", "333": "Ubik"}
    assert set(failed) == {"999", "000"}
    assert all(isinstance(err, KeyError) for err in failed.values())


def test_finish_order_follows_finishing_time():
    delays = {"111": 0.6, "222": 0.05, "333": 0.3}

    def lookup(isbn):
        time.sleep(delays[isbn])
        return TITLES[isbn]

    assert finish_order(lookup, ["111", "222", "333"]) == ["222", "333", "111"]


def test_count_words_parallel_uses_a_process_pool(monkeypatch):
    used = []

    class SpyPool(batch.ProcessPoolExecutor):
        def __init__(self, *args, **kwargs):
            used.append(True)
            super().__init__(*args, **kwargs)

    monkeypatch.setattr(batch, "ProcessPoolExecutor", SpyPool)
    texts = ["Dune by Frank Herbert", "Emma", "", "The Left Hand of Darkness"]
    assert count_words_parallel(texts) == [4, 1, 0, 5]
    assert used == [True]
