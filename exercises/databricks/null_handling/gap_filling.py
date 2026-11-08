"""Gap filling: find, test, default and drop missing values.

Fill in the functions.
Members have the columns member_id, phone, email and visits; any of the last three can be null.
The id-returning helpers give a sorted Python list of member_id values.
"""


def without_phone(members):
    """The ids of members whose phone is missing."""
    # TODO: use the null test, not a comparison with None
    raise NotImplementedError


def phone_differs(members, phone):
    """The ids of members whose phone is not `phone`, INCLUDING members with no phone at all."""
    # TODO: a plain != drops the null rows, so keep them on purpose
    raise NotImplementedError


def add_contact(members):
    """Add `contact`: the email if there is one, else the phone, else the text "none"."""
    # TODO: use the function that returns its first non-null argument
    raise NotImplementedError


def fill_defaults(members):
    """Replace a missing visits by 0 and a missing phone by "unknown".

    Leave email alone, so a missing email stays null.
    """
    # TODO: fill each column with its own default
    raise NotImplementedError


def add_next_visits(members):
    """Add `visits_next`: visits plus one, counting a missing visits as 0 (so null becomes 1)."""
    # TODO: null plus one is null, so give the null a default first
    raise NotImplementedError


def drop_unreachable(members):
    """The ids of members who have a phone or an email, leaving out those with neither."""
    # TODO: drop rows where both are null, restricted to those two columns
    raise NotImplementedError
