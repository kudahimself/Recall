"""Collections and itertools: reference solution."""
from collections import ChainMap, Counter, defaultdict, deque, namedtuple
from itertools import chain, groupby, islice

DEFAULTS = {"loan_days": 14, "fee_per_day": 20, "max_loans": 5}

Shelf = namedtuple("Shelf", "aisle number")


def top_titles(titles, n):
    return Counter(titles).most_common(n)


def titles_by_member(loans):
    groups = defaultdict(list)
    for member, title in loans:
        groups[member].append(title)
    return groups


def recent(titles, n=3):
    return deque(titles, maxlen=n)


def settings(overrides):
    return ChainMap(overrides, DEFAULTS)


def first_titles(shelves, n):
    return list(islice(chain(*shelves), n))


def loans_per_month(loans):
    def month_of(loan):
        return loan[0]

    ordered = sorted(loans, key=month_of)
    return [(month, len(list(run))) for month, run in groupby(ordered, key=month_of)]
