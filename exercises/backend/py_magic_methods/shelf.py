"""Magic methods: practise the dunder methods Python calls for built-in features.

Fill in each method so the tests in test_shelf.py pass.
Run them from this folder with: pytest
"""


class Shelf:
    """A shelf of book titles, kept in order."""

    def __init__(self, titles):
        self.titles = list(titles)

    # TODO: __repr__ -> "Shelf(['Dune', 'Emma'])", the developer view (use !r on the list).

    # TODO: __str__ -> "2 books", or "1 book" for a single title.

    # TODO: __len__ -> how many titles; it also makes an empty shelf false.

    # TODO: __iter__ -> loop over the titles, which also makes `in` work.

    # TODO: __getitem__ -> shelf[i] and shelf[1:3] give what the titles list gives.

    # TODO: __add__ -> a NEW Shelf with this shelf's titles then the other's.

    # TODO: __eq__ -> equal when the other is a Shelf with the same titles in the same order.
