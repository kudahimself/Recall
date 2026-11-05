"""Regex: practise finding, validating and replacing text with the re module.

Fill in each function so the tests in test_codes.py pass.
Run them from this folder with: pytest
"""
import re


def find_isbns(text):
    """Return every 13-digit ISBN starting with 978 or 979 in `text`, in order."""
    # TODO
    raise NotImplementedError


def parse_call_number(text):
    """Find a call number such as "FIC-HER-1965" anywhere in `text`.

    Three capital letters for the section, three for the author and a four-digit year,
    joined by "-". Return {"section": ..., "author": ..., "year": <int>}, read from
    named groups, or None when the text holds no call number.
    """
    # TODO
    raise NotImplementedError


def is_member_id(text):
    """True only when the WHOLE of `text` is "M-" followed by exactly five digits."""
    # TODO
    raise NotImplementedError


def first_year(text):
    """Return the first four-digit number anywhere in `text` as an int, or None."""
    # TODO
    raise NotImplementedError


def tidy_spaces(text):
    """Turn every run of whitespace into a single space and trim both ends."""
    # TODO
    raise NotImplementedError


def strip_tags(html):
    """Remove every tag such as <b> or </i>, keeping the text between them."""
    # TODO
    raise NotImplementedError
