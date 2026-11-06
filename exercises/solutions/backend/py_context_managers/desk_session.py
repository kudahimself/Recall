"""Context managers: reference solution."""
from contextlib import ExitStack, contextmanager


class Desk:
    def __init__(self, log):
        self.log = log

    def __enter__(self):
        self.log.append("open")
        return self

    def __exit__(self, kind, err, tb):
        self.log.append("close")
        if kind is not None and issubclass(kind, KeyError):
            self.log.append("unknown card")
            return True
        return False


@contextmanager
def borrowed(shelf, title):
    shelf.remove(title)
    try:
        yield title
    finally:
        shelf.append(title)


def first_lines(paths):
    with ExitStack() as stack:
        files = [stack.enter_context(open(path)) for path in paths]
        return [f.readline().rstrip("\n") for f in files]
