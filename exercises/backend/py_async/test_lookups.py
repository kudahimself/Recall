import asyncio
import inspect
import threading
import time

from lookups import DELAY, fetch_all, fetch_one_by_one, fetch_title, lend_while_waiting, main, pause


def timed(coro, limit=3):
    """Run a coroutine to the end; return (its result, seconds taken).

    It runs on its own thread, so a loop that never yields (a blocking sleep inside
    a `while` loop, say) fails the test after `limit` seconds instead of hanging.
    """
    outcome = {}

    def run():
        try:
            outcome["result"] = asyncio.run(coro)
        except BaseException as e:  # hand any error back to the test
            outcome["error"] = e

    start = time.perf_counter()
    worker = threading.Thread(target=run, daemon=True)
    worker.start()
    worker.join(limit)
    took = time.perf_counter() - start
    assert not worker.is_alive(), f"still running after {limit}s: is something blocking the event loop?"
    if "error" in outcome:
        raise outcome["error"]
    return outcome["result"], took


def test_fetch_title_is_a_coroutine_that_waits():
    assert inspect.iscoroutinefunction(fetch_title)
    title, took = timed(fetch_title("111"))
    assert title == "Dune"
    assert took >= DELAY * 0.9
    assert timed(fetch_title("999"))[0] == "Unknown"


def test_fetch_one_by_one_waits_for_each_in_turn():
    titles, took = timed(fetch_one_by_one(["111", "222", "333"]))
    assert titles == ["Dune", "Emma", "Ubik"]
    assert took >= DELAY * 3 * 0.9


def test_fetch_all_keeps_the_order_of_the_isbns():
    titles, _ = timed(fetch_all(["555", "111", "999", "222"]))
    assert list(titles) == ["Ulysses", "Dune", "Unknown", "Emma"]


def test_fetch_all_runs_the_lookups_at_the_same_time():
    titles, took = timed(fetch_all(["111", "222", "333", "444", "555"]))
    assert len(titles) == 5
    # One by one would take 5 * DELAY; together they take about one DELAY.
    assert took < DELAY * 4


def test_pause_does_not_block_the_loop():
    async def two_pauses():
        await asyncio.gather(pause(0.2), pause(0.2))

    _, took = timed(two_pauses())
    assert 0.18 <= took < 0.39   # blocking pauses would take 0.4 seconds


def test_lend_while_waiting_does_other_work_meanwhile():
    (title, count), took = timed(lend_while_waiting("333"))
    assert title == "Ubik"
    assert count >= 3
    assert took < DELAY * 3


def test_main_returns_titles_not_a_coroutine():
    result = main(["222", "999"])
    assert not inspect.iscoroutine(result)
    assert list(result) == ["Emma", "Unknown"]
