"""CLI tools and config: practise argparse and settings from the environment.

Fill in each part so the tests in test_lend.py pass.
Run them from this folder with: pytest
"""
import argparse
import os

DEFAULT_API = "http://localhost:8000"


def build_parser():
    """Return an ArgumentParser for: lend.py TITLE [--days N] [-v | --verbose].

    - title: required positional argument
    - --days: an int, 14 when not given
    - -v / --verbose: a flag, True only when given
    """
    # TODO
    raise NotImplementedError


def api_url():
    """Return the LIBRARY_API environment variable, or DEFAULT_API when it is not set."""
    # TODO
    raise NotImplementedError


def main(argv=None):
    """Parse `argv` (sys.argv[1:] when None) and return the message.

    "Lent Dune for 14 days", with " via <api_url()>" added at the end when verbose.
    """
    # TODO
    raise NotImplementedError


def load_env_file(path):
    """Read KEY=VALUE lines from the file at `path` into os.environ.

    Skip blank lines and lines starting with #, strip spaces around keys and values,
    and never replace a variable that is already set.
    Return a dict of the variables this call set.
    """
    # TODO
    raise NotImplementedError


if __name__ == "__main__":
    print(main())
