import inspect

from reading import all_titles, chunks, numbered, running_total, stats, ticket_numbers


def test_numbered_is_a_generator():
    gen = numbered(["Dune", "Emma"])
    assert inspect.isgenerator(gen)
    assert next(gen) == "1. Dune"
    assert list(gen) == ["2. Emma"]
    assert list(gen) == []


def test_numbered_is_lazy():
    pulled = []

    def source():
        for title in ["Dune", "Emma", "Ubik"]:
            pulled.append(title)
            yield title

    gen = numbered(source())
    assert pulled == []
    assert next(gen) == "1. Dune"
    assert pulled == ["Dune"]


def test_ticket_numbers_never_ends():
    gen = ticket_numbers(100)
    assert inspect.isgenerator(gen)
    assert [next(gen) for _ in range(3)] == [100, 101, 102]
    for _ in range(10_000):
        next(gen)
    assert next(gen) == 10_103


def test_chunks():
    gen = chunks(["a", "b", "c", "d", "e"], 2)
    assert inspect.isgenerator(gen)
    assert list(gen) == [["a", "b"], ["c", "d"], ["e"]]
    assert list(chunks(["a", "b"], 2)) == [["a", "b"]]
    assert list(chunks([], 3)) == []


def test_all_titles_walks_every_shelf():
    gen = all_titles(["Dune", "Emma"], (), ("Ubik",))
    assert inspect.isgenerator(gen)
    assert list(gen) == ["Dune", "Emma", "Ubik"]
    assert list(all_titles()) == []


def test_running_total_takes_values_with_send():
    gen = running_total()
    assert next(gen) == 0
    assert gen.send(20) == 20
    assert gen.send(5) == 25
    assert gen.send(0) == 25


def test_stats_reads_a_generator_once():
    titles = (t for t in ["Dune", "Beloved", "Emma", "Ulysses"])
    assert stats(titles) == (4, "Beloved")
    assert stats(["Dune"]) == (1, "Dune")
    assert stats(t for t in []) == (0, "")
