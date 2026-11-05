from shelf import Shelf


def test_repr_is_the_developer_view():
    assert repr(Shelf(["Dune", "Emma"])) == "Shelf(['Dune', 'Emma'])"


def test_a_list_of_shelves_shows_each_repr():
    assert str([Shelf(["Ubik"]), Shelf([])]) == "[Shelf(['Ubik']), Shelf([])]"


def test_str_is_the_friendly_view():
    assert str(Shelf(["Dune", "Emma"])) == "2 books"
    assert str(Shelf(["Dune"])) == "1 book"
    assert f"{Shelf([])}" == "0 books"


def test_len_and_truthiness():
    assert len(Shelf(["Dune", "Emma", "Ubik"])) == 3
    assert bool(Shelf(["Dune"])) is True
    assert bool(Shelf([])) is False


def test_iteration_and_in():
    shelf = Shelf(["Dune", "Emma"])
    assert [title.upper() for title in shelf] == ["DUNE", "EMMA"]
    assert "Emma" in shelf
    assert "Ubik" not in shelf


def test_indexing_and_slicing():
    shelf = Shelf(["Dune", "Emma", "Ubik"])
    assert shelf[0] == "Dune"
    assert shelf[-1] == "Ubik"
    assert shelf[1:] == ["Emma", "Ubik"]


def test_add_makes_a_new_shelf():
    a = Shelf(["Dune"])
    b = Shelf(["Emma", "Ubik"])
    both = a + b
    assert isinstance(both, Shelf)
    assert both.titles == ["Dune", "Emma", "Ubik"]
    assert a.titles == ["Dune"]
    assert b.titles == ["Emma", "Ubik"]


def test_equality_compares_titles_in_order():
    assert Shelf(["Dune", "Emma"]) == Shelf(["Dune", "Emma"])
    assert Shelf(["Dune", "Emma"]) != Shelf(["Emma", "Dune"])
    assert Shelf(["Dune"]) != ["Dune"]
