from codes import find_isbns, first_year, is_member_id, parse_call_number, strip_tags, tidy_spaces


def test_find_isbns():
    text = "Dune 9780441013593, Emma 9780141439587, card 12345, odd 9781234"
    assert find_isbns(text) == ["9780441013593", "9780141439587"]
    assert find_isbns("new 9798886451740 here") == ["9798886451740"]
    assert find_isbns("no codes") == []


def test_parse_call_number_anywhere_in_the_text():
    assert parse_call_number("shelf FIC-HER-1965, aisle 4") == {"section": "FIC", "author": "HER", "year": 1965}
    assert parse_call_number("REF-OED-1989") == {"section": "REF", "author": "OED", "year": 1989}


def test_parse_call_number_without_a_match_gives_none():
    assert parse_call_number("shelf unknown") is None
    assert parse_call_number("fic-her-1965") is None


def test_is_member_id_checks_the_whole_text():
    assert is_member_id("M-00421") is True
    assert is_member_id("M-00421 (old card)") is False
    assert is_member_id("card M-00421") is False
    assert is_member_id("M-0042") is False
    assert is_member_id("M-004211") is False


def test_first_year_looks_anywhere():
    assert first_year("printed in 1965, reprinted 1990") == 1965
    assert first_year("1817 edition") == 1817
    assert first_year("no year here") is None


def test_tidy_spaces():
    assert tidy_spaces("  Dune \n  by\tHerbert ") == "Dune by Herbert"
    assert tidy_spaces("Emma") == "Emma"


def test_strip_tags_takes_the_shortest_tag():
    assert strip_tags("<b>Dune</b> by <i>Herbert</i>") == "Dune by Herbert"
    assert strip_tags("plain") == "plain"
