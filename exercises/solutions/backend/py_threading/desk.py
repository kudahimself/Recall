"""Threading: reference solution."""
import threading
from queue import Queue


class LoanCounter:
    def __init__(self):
        self.count = 0
        self.lock = threading.Lock()

    def add(self, n=1):
        with self.lock:
            self.count += n


def run_all(fn, items):
    results = [None] * len(items)

    def work(i, item):
        results[i] = fn(item)

    threads = [threading.Thread(target=work, args=(i, item)) for i, item in enumerate(items)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    return results


def process_queue(jobs, handle, workers=3):
    queue = Queue()
    for job in jobs:
        queue.put(job)
    for _ in range(workers):
        queue.put(None)              # one stop signal per worker
    results = []
    lock = threading.Lock()

    def worker():
        while True:
            job = queue.get()
            if job is None:
                return
            result = handle(job)
            with lock:
                results.append(result)

    threads = [threading.Thread(target=worker) for _ in range(workers)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    return results


def wait_then_run(opened, action):
    def waiter():
        opened.wait()
        action()

    t = threading.Thread(target=waiter, daemon=True)
    t.start()
    return t
