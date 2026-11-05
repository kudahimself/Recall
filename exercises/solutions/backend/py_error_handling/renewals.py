"""Renewals: reference solution."""

MAX_RENEWALS = 2


class RenewalError(Exception):
    """Raised when a loan cannot be renewed."""


def parse_days(text):
    try:
        days = int(text)
    except ValueError:
        raise ValueError("days must be a whole number")
    if days <= 0:
        raise ValueError("days must be positive")
    return days


def renew(renewals, title):
    if title not in renewals:
        raise RenewalError(f"{title} is not on loan")
    if renewals[title] >= MAX_RENEWALS:
        raise RenewalError(f"{title} renewed too often")
    renewals[title] += 1
    return renewals[title]


def renew_all(renewals, titles):
    renewed = []
    refused = {}
    for title in titles:
        try:
            renew(renewals, title)
        except RenewalError as e:
            refused[title] = str(e)
        else:
            renewed.append(title)
    return renewed, refused
