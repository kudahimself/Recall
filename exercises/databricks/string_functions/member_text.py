"""Member text: tidy names, emails and card numbers with column string functions.

Fill in the functions.
Each one takes the members DataFrame and returns it with one extra column, so every original column stays.
The columns are member_id, first, middle, last, email and card; `middle` can be null.
"""


def add_first_tidy(members):
    """Add `first_tidy`: the first name with surrounding spaces removed, in lower case."""
    # TODO: combine two string functions from pyspark.sql.functions
    raise NotImplementedError


def add_full_name(members):
    """Add `full_name`: first (spaces removed), middle and last, joined by single spaces.

    A member without a middle name must give "Ada Lovelace", not null and not a double space.
    """
    # TODO: pick the join function that skips nulls
    raise NotImplementedError


def add_email_domain(members):
    """Add `domain`: the part of the email after the @, in lower case."""
    # TODO: use a regular-expression function that returns one capture group
    raise NotImplementedError


def add_card_number(members):
    """Add `card_no`: the digits of a card like "LIB-0042" as an integer (42)."""
    # TODO: extract the digits, then cast them
    raise NotImplementedError


def mask_card(members):
    """Add `card_masked`: the card with every digit replaced by "#", so "LIB-0042" becomes "LIB-####"."""
    # TODO: use a regular-expression function that rewrites every match
    raise NotImplementedError
