"""Shell and OS: practise subprocess.run, shutil and tempfile.

The program these functions run is Python itself, sys.executable, so they work on any machine.
Fill in each part so the tests in test_backup.py pass.
Run them from this folder with: pytest
"""
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path


def run_python(code):
    """Run `python -c code` and return what it printed, as text.

    Raise subprocess.CalledProcessError when the program exits with a non-zero code.
    """
    # TODO
    raise NotImplementedError


def exit_code(code):
    """Run `python -c code` and return its exit code (0 means success); never raise for it."""
    # TODO
    raise NotImplementedError


def echo(text):
    """Run a Python program that prints its first command-line argument, with `text` as that argument.

    Return the printed text without its newline.
    The text must reach the program as one value that no shell ever reads.
    """
    # TODO
    raise NotImplementedError


def backup(folder, dest):
    """Copy the whole folder, with its subfolders, to `dest` (which must not exist yet).

    Return the names of the files in the copy's top level, sorted.
    """
    # TODO
    raise NotImplementedError


def find_program(program):
    """Return the full path of `program` on the PATH, or None when it is not there."""
    # TODO
    raise NotImplementedError


def scratch_copy(titles):
    """In a temporary folder: write `titles` to titles.txt, one per line, copy it to copy.txt, read the copy.

    Return (the copy's text, the temporary folder's path as a string).
    The folder must be deleted by the time the function returns.
    """
    # TODO
    raise NotImplementedError
