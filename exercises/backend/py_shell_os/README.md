# Backup runner

Topic: Shell & OS Interop (subprocess, shutil, tempfile) (Backend, Python Advanced).
Time: about 20 minutes.

## Task

The library's backup script runs other programs and copies folders.
To work the same on every machine, the program it runs is Python itself: `sys.executable` is the path of the Python running your code.
Fill in the six functions in `backup.py`:

- `run_python(code)` runs `python -c code`, waits for it and returns what it printed, raising `CalledProcessError` when it exits with an error.
- `exit_code(code)` runs `python -c code` and returns its exit code instead of raising.
- `echo(text)` runs a small Python program that prints its first argument, passing `text` as that argument, and returns the printed text without its newline.
- `backup(folder, dest)` copies the whole folder to `dest` and returns the names of the files in the copy, sorted.
- `find_program(program)` returns the full path of a program on the `PATH`, or `None`.
- `scratch_copy(titles)` writes the titles to a file in a temporary folder, copies that file within the folder, reads the copy back, and returns `(text, folder)`, where the folder is gone once the function returns.

## Examples

```python
run_python("print(2 + 3)")              # "5\n"
run_python("import sys; sys.exit(1)")   # raises subprocess.CalledProcessError
exit_code("import sys; sys.exit(3)")    # 3
echo("Dune; rm -rf ~")                  # "Dune; rm -rf ~", printed, never run
backup("shelf", "shelf-backup")         # ["a.txt", "b.txt"]
find_program("git")                     # "/usr/bin/git", or None
scratch_copy(["Dune", "Emma"])          # ("Dune\nEmma\n", "/tmp/tmpab12cd")
```

Watch for the lesson's pitfall: never build a command string from input and run it with `shell=True`.
Pass a list of arguments, so `"Dune; rm -rf ~"` reaches the program as one plain value.

## Run the tests

```bash
cd exercises/backend/py_shell_os
pytest
```

The tests copy folders only inside a temporary folder, and the only program they run is Python.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
