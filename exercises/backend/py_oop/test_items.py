from items import Dvd, Item


def test_item_stores_its_title():
    assert Item("Dune").title == "Dune"
    assert Item("Dune").label() == "Dune"


def test_each_item_has_its_own_holds():
    a, b = Item("Dune"), Item("Emma")
    assert a.place_hold("Ana") == 1
    assert a.place_hold("Ben") == 2
    assert a.holds == ["Ana", "Ben"]
    assert b.holds == []


def test_loan_days_is_a_class_variable():
    assert Item.loan_days == 21
    assert Item("Dune").loan_days == 21
    assert "loan_days" not in vars(Item("Dune"))


def test_dvd_is_an_item_with_minutes():
    dvd = Dvd("Alien", 117)
    assert isinstance(dvd, Item)
    assert dvd.title == "Alien"
    assert dvd.minutes == 117
    assert dvd.holds == []
    assert dvd.place_hold("Ana") == 1


def test_dvd_loan_days():
    assert Dvd.loan_days == 7
    assert Item.loan_days == 21


def test_dvd_label():
    assert Dvd("Alien", 117).label() == "Alien (117 min)"


def test_dvd_init_lets_item_init_run(monkeypatch):
    seen = []
    original = Item.__init__

    def spy(self, title):
        seen.append(title)
        original(self, title)

    monkeypatch.setattr(Item, "__init__", spy)
    Dvd("Alien", 117)
    assert seen == ["Alien"]


def test_dvd_label_builds_on_item_label(monkeypatch):
    monkeypatch.setattr(Item, "label", lambda self: "ITEM")
    assert Dvd("Alien", 117).label() == "ITEM (117 min)"
