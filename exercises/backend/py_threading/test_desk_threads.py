import threading
import time

from desk_threads import LoanCounter, process_queue, run_all, wait_then_run


def test_loan_counter_counts_every_add_from_many_threads():
    counter = LoanCounter()

    def record():
        for _ in range(10_000):
            counter.add()

    threads = [threading.Thread(target=record) for _ in range(8)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    assert counter.count == 80_000


def test_loan_counter_adds_only_while_holding_its_lock():
    counter = LoanCounter()
    assert isinstance(counter.lock, type(threading.Lock()))
    with counter.lock:
        t = threading.Thread(target=counter.add, args=(5,))
        t.start()
        time.sleep(0.2)
        assert counter.count == 0, "add() changed count without taking the lock"
    t.join(2)
    assert counter.count == 5


def test_run_all_returns_every_result_in_order():
    def slow_double(n):
        time.sleep(0.05 * (5 - n))   # later items finish first
        return n * 2

    assert run_all(slow_double, [1, 2, 3, 4]) == [2, 4, 6, 8]


def test_run_all_runs_the_calls_at_the_same_time():
    def wait(n):
        time.sleep(0.2)
        return n

    start = time.perf_counter()
    assert run_all(wait, list(range(10))) == list(range(10))
    assert time.perf_counter() - start < 1.5   # one after another would take 2 seconds


def test_process_queue_handles_every_job_with_the_workers():
    threads_used = set()
    before = threading.active_count()

    def handle(title):
        threads_used.add(threading.current_thread().ident)
        time.sleep(0.05)
        return title.upper()

    jobs = ["dune", "emma", "ubik", "kim", "beloved", "ulysses"]
    results = process_queue(jobs, handle, workers=3)
    assert sorted(results) == sorted(j.upper() for j in jobs)
    assert threading.main_thread().ident not in threads_used
    assert 1 < len(threads_used) <= 3
    assert threading.active_count() == before   # every worker has finished


def test_wait_then_run_waits_for_the_event():
    ran = []
    opened = threading.Event()
    t = wait_then_run(opened, lambda: ran.append("open"))
    assert isinstance(t, threading.Thread)
    assert t.daemon
    time.sleep(0.2)
    assert ran == [] and t.is_alive()
    opened.set()
    t.join(2)
    assert ran == ["open"]
