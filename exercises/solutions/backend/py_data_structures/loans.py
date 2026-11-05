"""Loan lists: reference solution."""


def unique_titles(loans):
    return sorted(set(loans))


def count_loans(loans):
    counts = {}
    for title in loans:
        counts[title] = counts.get(title, 0) + 1
    return counts


def total_fines(fines, titles):
    total = 0
    for title in titles:
        total += fines.get(title, 0)
    return total


def on_both_lists(list_a, list_b):
    return sorted(set(list_a) & set(list_b))


def describe_spot(spot):
    aisle, shelf = spot
    return f"aisle {aisle}, shelf {shelf}"


def last_three(loans):
    recent = loans[-3:]
    recent.reverse()
    return recent
