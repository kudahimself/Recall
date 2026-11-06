"""Pytest Fixtures: practise writing fixtures, yield cleanup and fixture scope.

pytest loads conftest.py by itself and hands its fixtures to every test in this folder.
Write the fixtures below so the tests in test_store_fixtures.py pass; do not change test_store_fixtures.py.
Run them from this folder with: pytest
"""
import pytest

import store

# TODO: shelf - a fresh shelf for every test, from store.open_shelf().
#       Once the test is over, close it with store.close_shelf(...).

# TODO: member - a new member, {"id": "m1", "loans": []}.

# TODO: borrower - the member after borrowing the first book on the shelf:
#       move it from the shelf to the member's loans and return the member.

# TODO: catalogue_file - a file called catalogue.txt in a temporary folder,
#       holding the lines Dune, Emma and Ubik; return its path.

# TODO: catalogue - the dict from store.load_catalogue(), loaded only once
#       for all the tests in a test file.
