"""Parallelism: reference solution."""
from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor, as_completed


def fetch_all(fetch, isbns, workers=4):
    with ThreadPoolExecutor(max_workers=workers) as pool:
        return list(pool.map(fetch, isbns))


def check_all(fetch, isbns, workers=4):
    found, failed = {}, {}
    with ThreadPoolExecutor(max_workers=workers) as pool:
        futures = {pool.submit(fetch, isbn): isbn for isbn in isbns}
        for fut in as_completed(futures):
            isbn = futures[fut]
            try:
                found[isbn] = fut.result()
            except Exception as err:
                failed[isbn] = err
    return found, failed


def finish_order(fetch, isbns, workers=4):
    with ThreadPoolExecutor(max_workers=workers) as pool:
        futures = {pool.submit(fetch, isbn): isbn for isbn in isbns}
        return [futures[fut] for fut in as_completed(futures)]


def count_words(text):
    """The number of words in text. It sits at the top level of the module so a process pool can send it to its workers."""
    return len(text.split())


def count_words_parallel(texts):
    with ProcessPoolExecutor() as pool:
        return list(pool.map(count_words, texts))
