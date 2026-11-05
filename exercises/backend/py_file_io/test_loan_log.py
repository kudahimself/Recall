from loan_log import add_loan, first_loan, longest_title, read_loans, save_loans


def test_save_loans_writes_one_title_per_line(tmp_path):
    path = tmp_path / "loans.txt"
    save_loans(path, ["Dune", "Emma"])
    assert path.read_text() == "Dune\nEmma\n"


def test_save_loans_replaces_the_old_contents(tmp_path):
    path = tmp_path / "loans.txt"
    path.write_text("Old\nStuff\n")
    save_loans(path, ["Beloved"])
    assert path.read_text() == "Beloved\n"


def test_add_loan_keeps_existing_lines(tmp_path):
    path = tmp_path / "loans.txt"
    save_loans(path, ["Dune", "Emma"])
    add_loan(path, "Ubik")
    assert path.read_text() == "Dune\nEmma\nUbik\n"


def test_add_loan_creates_a_missing_file(tmp_path):
    path = tmp_path / "new.txt"
    add_loan(path, "Dune")
    assert path.read_text() == "Dune\n"


def test_read_loans_strips_newlines_and_skips_blanks(tmp_path):
    path = tmp_path / "loans.txt"
    path.write_text("Dune\n\nEmma\nUbik\n\n")
    assert read_loans(path) == ["Dune", "Emma", "Ubik"]


def test_first_loan(tmp_path):
    path = tmp_path / "loans.txt"
    path.write_text("Dune\nEmma\n")
    assert first_loan(path) == "Dune"
    empty = tmp_path / "empty.txt"
    empty.write_text("")
    assert first_loan(empty) == ""


def test_longest_title(tmp_path):
    path = tmp_path / "loans.txt"
    path.write_text("Dune\nBeloved\nUlysses\nEmma\n")
    assert longest_title(path) == "Beloved"
    empty = tmp_path / "empty.txt"
    empty.write_text("")
    assert longest_title(empty) == ""
