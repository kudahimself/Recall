"""The tests your fixtures in conftest.py must serve. Do not change this file."""
import store


def test_shelf_starts_with_two_books(shelf):
    assert shelf == ["Dune", "Emma"]
    shelf.append("Ubik")


def test_each_test_gets_a_fresh_shelf(shelf):
    assert shelf == ["Dune", "Emma"]


def test_shelf_comes_from_the_store_and_earlier_ones_were_closed(shelf):
    assert len(store.OPEN_SHELVES) == 1
    assert store.OPEN_SHELVES[0] is shelf


def test_member_starts_with_no_loans(member):
    assert member == {"id": "m1", "loans": []}


def test_borrower_takes_the_first_book_from_the_same_shelf(borrower, shelf):
    assert borrower["loans"] == ["Dune"]
    assert shelf == ["Emma"]


def test_catalogue_file_sits_in_a_temporary_folder(catalogue_file, tmp_path):
    assert catalogue_file == tmp_path / "catalogue.txt"
    assert catalogue_file.read_text().splitlines() == ["Dune", "Emma", "Ubik"]


def test_catalogue_is_loaded(catalogue):
    assert catalogue["9780441013593"] == "Dune"
    assert store.LOADS == 1


def test_catalogue_is_loaded_only_once_per_test_file(catalogue):
    assert len(catalogue) == 3
    assert store.LOADS == 1
