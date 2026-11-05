"""Renewals: practise try/except/else, raising exceptions and your own exception type.

Fill in each part so the tests in test_renewals.py pass.
Run them from this folder with: pytest
"""

MAX_RENEWALS = 2


class RenewalError:
    """Raised when a loan cannot be renewed."""
    # TODO: make this an exception type


def parse_days(text):
    """Return the whole number of days in `text`, such as "14" or " 7 ".

    Raise ValueError("days must be a whole number") when the text is not a whole number,
    and ValueError("days must be positive") when it is 0 or less.
    """
    # TODO
    raise NotImplementedError


def renew(renewals, title):
    """Renew one loan and return its new renewal count.

    `renewals` maps each title on loan to how many times it was renewed.
    Raise RenewalError(f"{title} is not on loan") when the title is not in `renewals`,
    and RenewalError(f"{title} renewed too often") when it already has MAX_RENEWALS.
    """
    # TODO
    raise NotImplementedError


def renew_all(renewals, titles):
    """Try to renew each title, and return a tuple (renewed, refused).

    `renewed` lists the titles renewed, in order.
    `refused` maps each title that raised RenewalError to the error's message.
    Catch RenewalError only: any other error is a bug and must still reach the caller.
    """
    # TODO
    raise NotImplementedError
