import builtins

import pytest

from desk_session import Desk, borrowed, first_lines


def test_desk_opens_and_closes():
    log = []
    with Desk(log) as desk:
        assert isinstance(desk, Desk)
        assert log == ["open"]
    assert log == ["open", "close"]


def test_desk_swallows_an_unknown_card():
    log = []
    with Desk(log):
        raise KeyError("card 999")
    assert log == ["open", "close", "unknown card"]


def test_desk_lets_other_errors_through_but_still_closes():
    log = []
    with pytest.raises(ValueError):
        with Desk(log):
            raise ValueError("bad fee")
    assert log == ["open", "close"]


def test_borrowed_takes_the_title_and_puts_it_back():
    shelf = ["Dune", "Emma", "Ubik"]
    with borrowed(shelf, "Dune") as book:
        assert book == "Dune"
        assert shelf == ["Emma", "Ubik"]
    assert shelf == ["Emma", "Ubik", "Dune"]


def test_borrowed_puts_it_back_when_the_block_fails():
    shelf = ["Dune", "Emma"]
    with pytest.raises(ValueError):
        with borrowed(shelf, "Emma"):
            assert shelf == ["Dune"]
            raise ValueError("reader dropped it")
    assert shelf == ["Dune", "Emma"]


@pytest.fixture
def opened(monkeypatch):
    """Record every file object opened while the test runs."""
    files = []
    real_open = builtins.open

    def spy(*args, **kwargs):
        f = real_open(*args, **kwargs)
        files.append(f)
        return f

    monkeypatch.setattr(builtins, "open", spy)
    return files


def test_first_lines_reads_and_closes_every_file(tmp_path, opened):
    paths = []
    for title, text in [("a", "Dune\nmore\n"), ("b", "Emma\n"), ("c", "Ubik")]:
        path = tmp_path / f"{title}.txt"
        path.write_text(text)
        paths.append(path)
    assert first_lines(paths) == ["Dune", "Emma", "Ubik"]
    assert len(opened) == 3
    assert all(f.closed for f in opened)


def test_first_lines_closes_what_it_opened_when_one_is_missing(tmp_path, opened):
    good = tmp_path / "good.txt"
    good.write_text("Dune\n")
    with pytest.raises(FileNotFoundError):
        first_lines([good, tmp_path / "missing.txt"])
    assert len(opened) == 1
    assert opened[0].closed
