"""Context managers: practise __enter__/__exit__, @contextmanager with try/finally, and ExitStack.

Fill in each part so the tests in test_desk.py pass.
Run them from this folder with: pytest
"""
from contextlib import ExitStack, contextmanager


class Desk:
    """The lending desk, used as `with Desk(log) as desk:`.

    `log` is a list the desk writes to: "open" on entering, "close" on leaving.
    """

    def __init__(self, log):
        self.log = log

    def __enter__(self):
        """Append "open" to the log and return the desk itself, so `as` binds it."""
        # TODO
        raise NotImplementedError

    def __exit__(self, kind, err, tb):
        """Append "close" to the log, whatever happened in the block.

        A KeyError from the block (an unknown member card) is noted as
        "unknown card" in the log, after "close", and swallowed.
        Any other exception carries on.
        """
        # TODO
        raise NotImplementedError


# TODO: turn borrowed into a context manager with @contextmanager.
def borrowed(shelf, title):
    """Take `title` off the `shelf` list for the length of a `with` block and put it back afterwards.

    `with borrowed(shelf, "Dune") as book:` binds "Dune". When the block ends,
    the title goes back at the end of the shelf, even if the block raised;
    the block's exception still carries on.
    """
    # TODO
    raise NotImplementedError


def first_lines(paths):
    """Open every file in `paths` with one ExitStack and return each file's first line, without its newline.

    Every file is closed when the function returns, and also when one of them fails to open.
    """
    # TODO
    raise NotImplementedError
