"""Library items: practise classes, __init__, methods, inheritance and class variables.

Fill in both classes so the tests in test_items.py pass.
Run them from this folder with: pytest
"""


class Item:
    """A book or anything else the library lends.

    - Item("Dune") stores the title on the instance as `title`.
    - Each item has its OWN list of holds, `holds`, starting empty.
    - `loan_days` is a class variable: 21 for every Item.
    - label() returns the title.
    - place_hold(name) adds `name` to this item's holds and returns how many holds it now has.
    """

    # TODO: the class variable loan_days

    def __init__(self, title):
        # TODO
        raise NotImplementedError

    def label(self):
        # TODO
        raise NotImplementedError

    def place_hold(self, name):
        # TODO
        raise NotImplementedError


class Dvd(Item):
    """A DVD: an Item with a running time.

    - Dvd("Alien", 117) lets Item.__init__ set up the title and holds, then stores `minutes`.
    - `loan_days` is 7 for every Dvd.
    - label() returns the Item's label followed by " (117 min)".
      Build it on Item's label() rather than repeating it.
    """

    # TODO: loan_days, __init__(self, title, minutes) and label(self)
