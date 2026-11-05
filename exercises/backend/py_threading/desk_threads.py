"""Threading: practise starting and joining threads, locks, queues and events.

Fill in each part so the tests in test_desk_threads.py pass.
Run them from this folder with: pytest
"""
import threading
from queue import Queue


class LoanCounter:
    """Counts loans recorded from many threads at once."""

    def __init__(self):
        self.count = 0
        # TODO: give the counter a threading.Lock() named `lock`.

    def add(self, n=1):
        """Add n to count, letting only one thread at a time do the read-add-write."""
        # TODO
        raise NotImplementedError


def run_all(fn, items):
    """Call fn(item) for every item, each in its own thread, and return the results in item order.

    Start every thread before waiting for any, then wait for them all to finish.
    """
    # TODO
    raise NotImplementedError


def process_queue(jobs, handle, workers=3):
    """Handle every job with `workers` worker threads sharing one Queue; return the results.

    Put the jobs on a Queue, then one None per worker as a stop signal.
    Start the workers; each takes jobs with get() and calls handle(job) on each,
    until it gets a None.
    Return the list of results (in any order) once every worker has finished.
    """
    # TODO
    raise NotImplementedError


def wait_then_run(opened, action):
    """Start a daemon thread that waits until `opened` (a threading.Event) is set, then calls action().

    Return the started thread without waiting for it.
    """
    # TODO
    raise NotImplementedError
