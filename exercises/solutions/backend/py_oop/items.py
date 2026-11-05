"""Library items: reference solution."""


class Item:
    loan_days = 21

    def __init__(self, title):
        self.title = title
        self.holds = []

    def label(self):
        return self.title

    def place_hold(self, name):
        self.holds.append(name)
        return len(self.holds)


class Dvd(Item):
    loan_days = 7

    def __init__(self, title, minutes):
        super().__init__(title)
        self.minutes = minutes

    def label(self):
        return super().label() + f" ({self.minutes} min)"
