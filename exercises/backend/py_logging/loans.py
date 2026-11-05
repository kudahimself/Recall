"""Logging: practise loggers, levels, lazy arguments and log.exception.

Fill in each part so the tests in test_loans.py pass.
Run them from this folder with: pytest
"""
import logging

# TODO: the module's logger, named "library.loans".
log = None


def configure():
    """Show INFO and above for every logger under "library".

    Set the level on the "library" logger only; its children inherit it.
    """
    # TODO
    raise NotImplementedError


def lend(title, member):
    """Log "lent %s to %s" at INFO, passing title and member as arguments.

    Return "<title> -> <member>".
    """
    # TODO
    raise NotImplementedError


def check_return(title, days_late):
    """Log a late return at WARNING, an on-time one at DEBUG.

    Late (days_late > 0): "%s returned %d days late" with title and days_late.
    On time: "%s returned on time" with title.
    """
    # TODO
    raise NotImplementedError


def renew_all(titles, renew):
    """Call renew(title) for every title and return the titles that were renewed.

    When renew raises, log "renewal failed for %s" with log.exception (it keeps the
    traceback) and carry on with the next title.
    """
    # TODO
    raise NotImplementedError
