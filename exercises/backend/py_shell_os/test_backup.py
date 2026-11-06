import os
import subprocess
import sys
from pathlib import Path

import pytest

import backup as backup_module
from backup import backup, echo, exit_code, find_program, run_python, scratch_copy


def test_run_python_returns_the_output():
    assert run_python("print(2 + 3)") == "5\n"
    assert run_python("print('Dune'); print('Emma')") == "Dune\nEmma\n"


def test_run_python_raises_on_a_failing_program():
    with pytest.raises(subprocess.CalledProcessError):
        run_python("import sys; sys.exit(1)")


def test_exit_code():
    assert exit_code("import sys; sys.exit(3)") == 3
    assert exit_code("print('fine')") == 0
    assert exit_code("raise ValueError('boom')") == 1


def test_echo_passes_text_as_one_plain_argument(monkeypatch):
    seen = []
    real_run = subprocess.run

    def spy(args, **kwargs):
        seen.append((args, kwargs))
        return real_run(args, **kwargs)

    monkeypatch.setattr(backup_module.subprocess, "run", spy)
    assert echo("Dune; rm -rf ~") == "Dune; rm -rf ~"
    assert echo("$(whoami) & `ls`") == "$(whoami) & `ls`"
    for args, kwargs in seen:
        assert isinstance(args, list), "pass the command as a list"
        assert not kwargs.get("shell"), "never use shell=True"


def test_backup_copies_the_whole_folder(tmp_path):
    shelf = tmp_path / "shelf"
    (shelf / "old").mkdir(parents=True)
    (shelf / "b.txt").write_text("Emma\n")
    (shelf / "a.txt").write_text("Dune\n")
    (shelf / "old" / "c.txt").write_text("Ubik\n")
    dest = tmp_path / "shelf-backup"
    assert backup(shelf, dest) == ["a.txt", "b.txt"]
    assert (dest / "old" / "c.txt").read_text() == "Ubik\n"
    assert (shelf / "a.txt").exists()


def test_find_program(monkeypatch):
    python = Path(sys.executable)
    monkeypatch.setenv("PATH", str(python.parent))
    found = find_program(python.name)
    assert found is not None
    assert Path(found).resolve() == python.resolve()
    assert find_program("no-such-program-here") is None


def test_scratch_copy_cleans_up_after_itself():
    text, folder = scratch_copy(["Dune", "Emma"])
    assert text == "Dune\nEmma\n"
    assert isinstance(folder, str)
    assert not os.path.exists(folder)
