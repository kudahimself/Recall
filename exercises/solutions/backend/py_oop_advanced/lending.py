"""Advanced OOP: reference solution."""
from abc import ABC, abstractmethod


class Lendable(ABC):
    """Anything the library lends: it has a title and a fine per late day."""

    def __init__(self, title, fine_per_day=20):
        self.title = title
        self.fine_per_day = fine_per_day

    @abstractmethod
    def loan_days(self):
        """How many days this item can be borrowed for."""

    def due_label(self):
        return f"{self.title}: due in {self.loan_days()} days"

    @property
    def fine_per_day(self):
        return self._fine_per_day

    @fine_per_day.setter
    def fine_per_day(self, value):
        if value < 0:
            raise ValueError("fine_per_day cannot be negative")
        self._fine_per_day = value


class Book(Lendable):
    """A book: 21 days when it has more than 500 pages, 14 otherwise."""

    def __init__(self, title, pages, fine_per_day=20):
        super().__init__(title, fine_per_day)
        self.pages = pages

    def loan_days(self):
        return 21 if self.pages > 500 else 14


class Dvd(Lendable):
    """A DVD: 7 days."""

    def loan_days(self):
        return 7


class ReferenceBook(Book):
    """A reference book: 2 days, and its label says it stays in the library."""

    def loan_days(self):
        return 2

    def due_label(self):
        return super().due_label() + " (library use only)"
