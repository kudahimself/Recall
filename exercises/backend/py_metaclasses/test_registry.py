from registry import REGISTRY, Item, Registered, make_kind, own_attributes, parent_names, setting


def test_item_is_registered():
    assert REGISTRY.get("Item") is Item


def test_every_subclass_is_registered():
    class Magazine(Item):
        loan_days = 3

    assert REGISTRY.get("Magazine") is Magazine


def test_the_metaclass_is_not_a_parent():
    assert type(Item) is Registered
    assert isinstance(Item, Registered)
    assert Item.__bases__ == (object,)
    assert not issubclass(Item, Registered)


def test_make_kind_builds_a_class_at_run_time():
    Dvd = make_kind("Dvd", 7)
    assert Dvd.__name__ == "Dvd"
    assert issubclass(Dvd, Item)
    assert Dvd.loan_days == 7
    assert Dvd().loan_days == 7
    assert REGISTRY.get("Dvd") is Dvd


def test_own_attributes_skips_inherited_and_dunder_names():
    class Map(Item):
        loan_days = 5

        def fold(self):
            return "folded"

    assert own_attributes(Map) == ["fold", "loan_days"]
    assert own_attributes(make_kind("Comic", 10)) == ["loan_days"]


def test_parent_names():
    class Atlas(Item):
        pass

    class Extra:
        pass

    class BigAtlas(Atlas, Extra):
        pass

    assert parent_names(Atlas) == ["Item"]
    assert parent_names(BigAtlas) == ["Atlas", "Extra"]


def test_setting_falls_back_to_a_default():
    assert setting(Item(), "loan_days") == 14
    assert setting(Item(), "renewals", 0) == 0
    assert setting(Item, "renewals") is None
