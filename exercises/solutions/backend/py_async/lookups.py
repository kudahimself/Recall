"""Async/await: reference solution."""
import asyncio

DELAY = 0.1

CATALOGUE = {"111": "Dune", "222": "Emma", "333": "Ubik", "444": "Beloved", "555": "Ulysses"}


async def fetch_title(isbn):
    await asyncio.sleep(DELAY)
    return CATALOGUE.get(isbn, "Unknown")


async def fetch_one_by_one(isbns):
    titles = []
    for isbn in isbns:
        titles.append(await fetch_title(isbn))
    return titles


async def fetch_all(isbns):
    return await asyncio.gather(*(fetch_title(isbn) for isbn in isbns))


async def pause(seconds):
    await asyncio.sleep(seconds)


async def lend_while_waiting(isbn):
    task = asyncio.create_task(fetch_title(isbn))
    count = 0
    while not task.done():
        count += 1
        await pause(DELAY / 10)
    return await task, count


def main(isbns):
    return asyncio.run(fetch_all(isbns))
