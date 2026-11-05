"""Pytest Fixtures: reference solution."""
import pytest

import store


@pytest.fixture
def shelf():
    opened = store.open_shelf()
    yield opened
    store.close_shelf(opened)


@pytest.fixture
def member():
    return {"id": "m1", "loans": []}


@pytest.fixture
def borrower(member, shelf):
    member["loans"].append(shelf.pop(0))
    return member


@pytest.fixture
def catalogue_file(tmp_path):
    path = tmp_path / "catalogue.txt"
    path.write_text("Dune\nEmma\nUbik\n")
    return path


@pytest.fixture(scope="module")
def catalogue():
    return store.load_catalogue()
