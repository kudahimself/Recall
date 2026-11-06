"""A stand-in for the library's storage, used by the fixtures you write. Do not change this file."""

# Shelves opened with open_shelf and not closed yet.
OPEN_SHELVES = []

# How many times load_catalogue has run.
LOADS = 0


def open_shelf():
    """Open a new shelf holding two books and return it."""
    shelf = ["Dune", "Emma"]
    OPEN_SHELVES.append(shelf)
    return shelf


def close_shelf(shelf):
    """Close a shelf that open_shelf returned."""
    for i, held in enumerate(OPEN_SHELVES):
        if held is shelf:
            del OPEN_SHELVES[i]
            return
    raise ValueError("that shelf is not open")


def load_catalogue():
    """Load the whole catalogue, as {isbn: title}; slow in real life, so load it once."""
    global LOADS
    LOADS += 1
    return {"9780441013593": "Dune", "9780141439587": "Emma", "9780547928227": "The Hobbit"}
