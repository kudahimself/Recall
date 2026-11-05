"""Loan log: practise reading and writing text files.

Every function takes the path of a text file with one title per line.
Fill in each function so the tests in test_loan_log.py pass.
Run them from this folder with: pytest
"""


def save_loans(path, titles):
    """Write `titles` to the file, one per line, replacing whatever the file held.

    save_loans(path, ["Dune", "Emma"]) leaves the file containing "Dune\\nEmma\\n".
    """
    # TODO
    raise NotImplementedError


def add_loan(path, title):
    """Add one title as a new last line, keeping the lines already there.

    Creates the file when it does not exist yet.
    """
    # TODO
    raise NotImplementedError


def read_loans(path):
    """Return the titles in the file, in order, without their newlines; blank lines are skipped."""
    # TODO
    raise NotImplementedError


def first_loan(path):
    """Return the first line without its newline, or "" for an empty file.

    Read only that one line, not the whole file.
    """
    # TODO
    raise NotImplementedError


def longest_title(path):
    """Return the longest title in the file, reading it line by line.

    The first one wins a tie, and an empty file gives "".
    """
    # TODO
    raise NotImplementedError
