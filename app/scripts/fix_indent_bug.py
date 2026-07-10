"""
Strip the source-file's 2-space indent that leaked into PREDICT_OUTPUT
template literals (`code:` and `expectedOutput:` fields).

The bug pattern in source:
    expectedOutput: `13
  6
  8`,

…produces a runtime value of `"13\n  6\n  8"`. The grading matcher preserves
leading whitespace, so users typing `13\n6\n8` get rejected even though the
program would print exactly that.

What this script does:
  1. Walks every *.ts file in src/data/.
  2. Finds every `code:` and `expectedOutput:` template literal.
  3. For each, dedents only when EVERY non-first non-blank line starts with
     exactly 2 spaces followed by a non-bracket character. That heuristic
     avoids touching dict/list/tuple outputs (which legitimately use leading
     whitespace) and 4+-space-indented Python source (which uses real indent).
  4. Default = dry run (prints a sample of diffs + counts). Pass --apply to write.

Usage:
    conda run -n recall-srs python scripts/fix_indent_bug.py
    conda run -n recall-srs python scripts/fix_indent_bug.py --apply
"""
from __future__ import annotations
import re
import sys
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "src" / "data"

# `(code|expectedOutput): \`...\`` — non-greedy, no escaped backticks present in
# the predict-output bank, so [^`]* is safe.
TEMPLATE_RE = re.compile(r"(?P<field>code|expectedOutput):\s*`(?P<body>[^`]*)`")


def should_dedent(body: str) -> bool:
    """True iff every non-first, non-blank line starts with EXACTLY '  '
    (two spaces) + a non-space char. The 4+-space exclusion avoids touching
    legitimate hierarchical pretty-printed output (e.g. json.dumps with
    indent=4). 2-space indent before brackets is NOT preserved — print() of
    a list/dict/tuple never inserts leading whitespace, so a line like
    `  [1, 2, 3]` is the source-file leak, not real indentation."""
    lines = body.split("\n")
    if len(lines) < 2:
        return False
    saw_indented_line = False
    for line in lines[1:]:
        if not line:
            continue  # blank lines are fine
        if not line.startswith("  "):
            return False
        if line.startswith("   "):
            return False  # 3+ spaces: probably real indentation
        rest = line[2:]
        if not rest:
            return False
        saw_indented_line = True
    return saw_indented_line


def dedent_continuation(body: str) -> str:
    """Strip the leading 2 spaces from every non-first line."""
    lines = body.split("\n")
    out = [lines[0]]
    for line in lines[1:]:
        if line.startswith("  "):
            out.append(line[2:])
        else:
            out.append(line)
    return "\n".join(out)


def process_file(path: Path) -> tuple[str, int, list[tuple[str, str, str]]]:
    """Return (new_source, num_blocks_changed, samples) for this file.

    samples = list of (field, before, after) for diff preview.
    """
    src = path.read_text(encoding="utf-8")
    samples: list[tuple[str, str, str]] = []

    def repl(m: re.Match) -> str:
        field = m.group("field")
        body = m.group("body")
        if not should_dedent(body):
            return m.group(0)
        new_body = dedent_continuation(body)
        samples.append((field, body, new_body))
        return f"{field}: `{new_body}`"

    new_src = TEMPLATE_RE.sub(repl, src)
    return new_src, len(samples), samples


def show_diff_sample(field: str, before: str, after: str) -> None:
    print(f"  -- {field} BEFORE --")
    for line in before.split("\n"):
        print(f"     │ {line!r}")
    print(f"  -- {field} AFTER --")
    for line in after.split("\n"):
        print(f"     │ {line!r}")
    print()


def main() -> None:
    apply = "--apply" in sys.argv

    total_files_changed = 0
    total_blocks_changed = 0
    all_samples: list[tuple[Path, str, str, str]] = []

    for path in sorted(DATA.glob("*.ts")):
        new_src, n, samples = process_file(path)
        if n == 0:
            continue
        total_files_changed += 1
        total_blocks_changed += n
        for s in samples:
            all_samples.append((path, *s))
        print(f"  {path.name:45s} {n:>3} block(s)")
        if apply:
            path.write_text(new_src, encoding="utf-8")

    print()
    print(f"Files affected: {total_files_changed}")
    print(f"Template literals fixed: {total_blocks_changed}")
    if not apply:
        print("\n(Dry run — pass --apply to write.)\n")
        print("Sample diffs (first 5):")
        for path, field, before, after in all_samples[:5]:
            print(f"\n=== {path.name} ===")
            show_diff_sample(field, before, after)
    else:
        print("\nApplied. Re-run without --apply to confirm zero residual.")


if __name__ == "__main__":
    main()
