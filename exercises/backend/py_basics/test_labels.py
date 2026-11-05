from labels import average_pages, clean_title, parse_pages, reading_time, shelf_code


def test_clean_title_strips_and_capitalises():
    assert clean_title("  the hobbit ") == "The Hobbit"
    assert clean_title("DUNE") == "Dune"


def test_clean_title_leaves_the_argument_alone():
    raw = "  emma "
    clean_title(raw)
    assert raw == "  emma "


def test_shelf_code():
    assert shelf_code("  dune ", 4) == "DUN-4"
    assert shelf_code("the hobbit", 12) == "THE-12"


def test_parse_pages():
    assert parse_pages("310 pages") == 310
    assert parse_pages("96 pages") == 96
    assert type(parse_pages("1 pages")) is int


def test_reading_time():
    assert reading_time(310, 40) == "7 h 45 min"
    assert reading_time(30, 60) == "0 h 30 min"
    assert reading_time(120, 60) == "2 h 0 min"
    assert reading_time(100, 30) == "3 h 20 min"


def test_average_pages_is_always_a_float():
    assert average_pages(900, 3) == 300.0
    assert type(average_pages(900, 3)) is float
    assert average_pages(7, 2) == 3.5
