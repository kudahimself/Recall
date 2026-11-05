"""Fees and packing: reference solution."""
from math import ceil


def late_fee(days, per_day=20):
    return days * per_day


def boxes_needed(books, per_box):
    return ceil(books / per_box)
