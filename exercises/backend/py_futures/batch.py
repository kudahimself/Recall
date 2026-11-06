"""Parallelism: practise worker pools, futures and as_completed.

Fill in each function so the tests in test_batch.py pass.
Run them from this folder with: pytest
"""
from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor, as_completed


def fetch_all(fetch, isbns, workers=4):
    """Call fetch(isbn) for every isbn on a pool of `workers` threads; return the results in isbn order.

    If a call raises, fetch_all raises that error.
    """
    # TODO
    raise NotImplementedError


def check_all(fetch, isbns, workers=4):
    """Call fetch(isbn) for every isbn on a thread pool and return (found, failed).

    found maps each isbn whose call returned to its result.
    failed maps each isbn whose call raised to the exception it raised.
    One failing call must not stop the others being collected.
    """
    # TODO
    raise NotImplementedError


def finish_order(fetch, isbns, workers=4):
    """Call fetch(isbn) for every isbn on a thread pool; return the isbns in the order their calls finished."""
    # TODO
    raise NotImplementedError


def count_words(text):
    """The number of words in text. It sits at the top level of the module so a process pool can send it to its workers."""
    return len(text.split())


def count_words_parallel(texts):
    """Run count_words on every text with a ProcessPoolExecutor; return the counts in text order."""
    # TODO
    raise NotImplementedError
