from views import authors, pages_by_title, published_after, shelf_slots, shouted, size_labels, total_pages

BOOKS = [
    {"title": "Dune", "author": "Herbert", "year": 1965, "pages": 412},
    {"title": "Emma", "author": "Austen", "year": 1815, "pages": 474},
    {"title": "Ubik", "author": "Dick", "year": 1969, "pages": 202},
    {"title": "Persuasion", "author": "Austen", "year": 1817, "pages": 249},
]


def test_shouted():
    assert shouted(["Dune", "Emma"]) == ["DUNE", "EMMA"]
    assert shouted([]) == []


def test_published_after_filters_and_keeps_order():
    assert published_after(BOOKS, 1900) == ["Dune", "Ubik"]
    assert published_after(BOOKS, 2000) == []


def test_size_labels_gives_one_label_per_book():
    assert size_labels(BOOKS) == ["long", "long", "short", "short"]
    assert size_labels([{"title": "X", "author": "Y", "year": 2000, "pages": 300}]) == ["long"]


def test_pages_by_title():
    assert pages_by_title(BOOKS) == {"Dune": 412, "Emma": 474, "Ubik": 202, "Persuasion": 249}


def test_authors_drops_duplicates():
    assert authors(BOOKS) == {"Herbert", "Austen", "Dick"}


def test_shelf_slots_outer_loop_first():
    assert shelf_slots(("A", "B"), (1, 2)) == ["A1", "A2", "B1", "B2"]
    assert shelf_slots(("C",), (3, 1, 2)) == ["C3", "C1", "C2"]


def test_total_pages():
    assert total_pages(BOOKS) == 1337
    assert total_pages([]) == 0
    assert total_pages(book for book in BOOKS if book["author"] == "Austen") == 723
