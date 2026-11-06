"""Async/await: practise coroutines, await, asyncio.gather and create_task.

Fill in each part so the tests in test_lookups.py pass.
Run them from this folder with: pytest
"""
import asyncio

# How long one catalogue lookup takes, in seconds: a stand-in for a network call.
DELAY = 0.1

CATALOGUE = {"111": "Dune", "222": "Emma", "333": "Ubik", "444": "Beloved", "555": "Ulysses"}


async def fetch_title(isbn):
    """Wait DELAY seconds without blocking the loop, then return the book's title.

    An isbn that is not in CATALOGUE gives "Unknown".
    """
    # TODO
    raise NotImplementedError


async def fetch_one_by_one(isbns):
    """Await fetch_title for each isbn in turn and return the titles, in order."""
    # TODO
    raise NotImplementedError


async def fetch_all(isbns):
    """Run fetch_title for every isbn at once and return the titles in the order of `isbns`."""
    # TODO
    raise NotImplementedError


async def pause(seconds):
    """Wait `seconds` seconds while letting other coroutines run."""
    # TODO
    raise NotImplementedError


async def lend_while_waiting(isbn):
    """Start fetch_title(isbn) as a background task and do other work until it is done.

    While the task is not done, count one unit of other work and `await pause(DELAY / 10)`.
    Return (title, count).
    """
    # TODO
    raise NotImplementedError


def main(isbns):
    """A plain (not async) function: run fetch_all(isbns) on a new event loop and return its list."""
    # TODO
    raise NotImplementedError
