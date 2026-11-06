"""Shell and OS: reference solution."""
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path


def run_python(code):
    result = subprocess.run(
        [sys.executable, "-c", code], capture_output=True, text=True, check=True,
    )
    return result.stdout


def exit_code(code):
    result = subprocess.run([sys.executable, "-c", code], capture_output=True, text=True)
    return result.returncode


def echo(text):
    result = subprocess.run(
        [sys.executable, "-c", "import sys; print(sys.argv[1])", text],
        capture_output=True, text=True, check=True,
    )
    return result.stdout.rstrip("\n")


def backup(folder, dest):
    shutil.copytree(folder, dest)
    return sorted(p.name for p in Path(dest).iterdir() if p.is_file())


def find_program(program):
    return shutil.which(program)


def scratch_copy(titles):
    with tempfile.TemporaryDirectory() as tmp:
        src = Path(tmp) / "titles.txt"
        src.write_text("".join(t + "\n" for t in titles))
        copy = Path(tmp) / "copy.txt"
        shutil.copy(src, copy)
        text = copy.read_text()
    return text, tmp
