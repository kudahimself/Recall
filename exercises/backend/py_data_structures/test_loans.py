from loans import count_loans, describe_spot, last_three, on_both_lists, total_fines, unique_titles


def test_unique_titles_sorted_without_duplicates():
    assert unique_titles(["Ubik", "Dune", "Ubik"]) == ["Dune", "Ubik"]
    assert unique_titles([]) == []


def test_unique_titles_leaves_the_list_alone():
    loans = ["Ubik", "Dune", "Ubik"]
    result = unique_titles(loans)
    assert loans == ["Ubik", "Dune", "Ubik"]
    assert result is not loans


def test_count_loans_keeps_first_seen_order():
    counts = count_loans(["Emma", "Dune", "Emma", "Ubik", "Emma"])
    assert counts == {"Emma": 3, "Dune": 1, "Ubik": 1}
    assert list(counts) == ["Emma", "Dune", "Ubik"]
    assert count_loans([]) == {}


def test_total_fines_treats_missing_titles_as_zero():
    fines = {"Dune": 20, "Ubik": 5}
    assert total_fines(fines, ["Dune", "Emma"]) == 20
    assert total_fines(fines, ["Dune", "Ubik", "Dune"]) == 45
    assert total_fines(fines, []) == 0


def test_on_both_lists():
    assert on_both_lists(["Dune", "Emma", "Dune"], ["Emma", "Dune", "Ubik"]) == ["Dune", "Emma"]
    assert on_both_lists(["Dune"], ["Emma"]) == []


def test_describe_spot():
    assert describe_spot(("B", 4)) == "aisle B, shelf 4"
    assert describe_spot(("K", 12)) == "aisle K, shelf 12"


def test_last_three_newest_first():
    loans = ["Dune", "Emma", "Ubik", "Beloved"]
    assert last_three(loans) == ["Beloved", "Ubik", "Emma"]
    assert loans == ["Dune", "Emma", "Ubik", "Beloved"]
    assert last_three(["Dune"]) == ["Dune"]
