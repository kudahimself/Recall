"""Magic methods: reference solution."""


class Shelf:
    """A shelf of book titles, kept in order."""

    def __init__(self, titles):
        self.titles = list(titles)

    def __repr__(self):
        return f"Shelf({self.titles!r})"

    def __str__(self):
        count = len(self)
        return f"{count} book" if count == 1 else f"{count} books"

    def __len__(self):
        return len(self.titles)

    def __iter__(self):
        return iter(self.titles)

    def __getitem__(self, index):
        return self.titles[index]

    def __add__(self, other):
        return Shelf(self.titles + other.titles)

    def __eq__(self, other):
        if not isinstance(other, Shelf):
            return NotImplemented
        return self.titles == other.titles
