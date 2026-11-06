"""Advanced OOP: practise abstract base classes, super() and properties.

Fill in each part so the tests in test_lending.py pass.
Run them from this folder with: pytest
"""
from abc import ABC, abstractmethod


# TODO: make Lendable an abstract base class.
class Lendable:
    """Anything the library lends: it has a title and a fine per late day."""

    def __init__(self, title, fine_per_day=20):
        self.title = title
        self.fine_per_day = fine_per_day

    # TODO: make loan_days an abstract method that every subclass must override.
    def loan_days(self):
        """How many days this item can be borrowed for."""
        raise NotImplementedError

    def due_label(self):
        """Return "<title>: due in <loan_days()> days"."""
        # TODO
        raise NotImplementedError

    # TODO: make fine_per_day a property, with a setter that raises ValueError
    # for a negative fine. Store the value in self._fine_per_day.


class Book(Lendable):
    """A book: 21 days when it has more than 500 pages, 14 otherwise."""

    def __init__(self, title, pages, fine_per_day=20):
        # TODO: this replaces Lendable's __init__, so title and fine_per_day are never set.
        self.pages = pages

    def loan_days(self):
        # TODO
        raise NotImplementedError


class Dvd(Lendable):
    """A DVD: 7 days."""

    def loan_days(self):
        # TODO
        raise NotImplementedError


class ReferenceBook(Book):
    """A reference book: 2 days, and its label says it stays in the library."""

    def loan_days(self):
        # TODO
        raise NotImplementedError

    def due_label(self):
        """The parent's label followed by " (library use only)"."""
        # TODO: extend the parent's version rather than rewriting it.
        raise NotImplementedError
