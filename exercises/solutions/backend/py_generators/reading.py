"""Generators: reference solution."""


def numbered(titles):
    n = 1
    for title in titles:
        yield f"{n}. {title}"
        n += 1


def ticket_numbers(start):
    n = start
    while True:
        yield n
        n += 1


def chunks(items, size):
    batch = []
    for item in items:
        batch.append(item)
        if len(batch) == size:
            yield batch
            batch = []
    if batch:
        yield batch


def all_titles(*shelves):
    for shelf in shelves:
        yield from shelf


def running_total():
    total = 0
    while True:
        fee = yield total
        total += fee


def stats(titles):
    titles = list(titles)
    if not titles:
        return 0, ""
    return len(titles), max(titles, key=len)
