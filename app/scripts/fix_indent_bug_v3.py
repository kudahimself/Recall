"""
Round 3 of the source-indent leak fix.

v2 was too conservative: it bailed whenever ANY non-first line had 3+ leading
spaces, missing the very common case of a function body where real Python
indent (4) stacks on top of the source-file leak (2) → lines starting with 6.

Bug example (from topic_py_modules.ts):
    code: `def main():
          print("running main")
      print(__name__)`

Body content sees:
  line 1: 'def main():'                            (no indent)
  line 2: '      print("running main")'            (6 = 2 leak + 4 real indent)
  line 3: '  print(__name__)'                      (2 = leak only, top-level)

The leak signature: across all non-first non-blank lines, the MINIMUM leading
indent is exactly 2 (= the leak width). Real Python indentation that doesn't
have a leak would have a min of 0 (top-level) or 4 (function body without
top-level lines), never 2. So when min == 2, dedent every non-first line by 2.

This generalises v2 (which only fired when EVERY non-first line was exactly 2)
without becoming aggressive — code that was indented as 4 + 0 (no top-level
mixed in) still has min=4 and is left alone.

Default = dry run. Pass --apply to write.
"""
from __future__ import annotations
import re
import sys
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "src" / "data"

FIELDS = ("code", "expectedOutput", "starterCode", "solution", "template")
TEMPLATE_RE = re.compile(
    r"(?P<field>" + "|".join(FIELDS) + r"):\s*`(?P<body>[^`]*)`"
)


def is_blank(line: str) -> bool:
    return line.strip() == ""


def leading_spaces(line: str) -> int:
    """Number of leading space chars (not tabs — codebase uses spaces)."""
    n = 0
    for ch in line:
        if ch == " ":
            n += 1
        else:
            break
    return n


def detect_leak(body: str) -> int:
    """Return 2 if the body matches the 2-space leak signature, else 0.

    Signature: at least one non-first non-blank line, AND the minimum leading
    indent across all such lines is EXACTLY 2.

    Why min==2 specifically:
      - 0 → no leak (some line is at column 0, so the source didn't leak).
      - 2 → leak exactly (top-level lines pinned at the leak width).
      - 4+ → real Python indent without leak (no top-level lines mixed in,
        so we can't disambiguate from genuine indent — leave alone).
    """
    lines = body.split("\n")
    if len(lines) < 2:
        return 0
    indents: list[int] = []
    for line in lines[1:]:
        if is_blank(line):
            continue
        indents.append(leading_spaces(line))
    if not indents:
        return 0
    return 2 if min(indents) == 2 else 0


def dedent_by(body: str, n: int) -> str:
    """Strip up to n leading spaces from every non-first line.
    Whitespace-only lines collapse to truly empty (cleaner)."""
    lines = body.split("\n")
    out = [lines[0]]
    for line in lines[1:]:
        if is_blank(line):
            out.append("")
        else:
            stripped = line[n:] if line[:n] == " " * n else line.lstrip(" ")
            # Only strip exactly n spaces when the line started with at least n;
            # otherwise leave it alone (shouldn't happen given detect_leak's
            # min==n guarantee, but defensive).
            if line.startswith(" " * n):
                out.append(line[n:])
            else:
                out.append(line)
    return "\n".join(out)


def process_file(path: Path):
    src = path.read_text(encoding="utf-8")
    samples: list[tuple[str, str, str]] = []
    counts_by_field: dict[str, int] = {}

    def repl(m: re.Match) -> str:
        field = m.group("field")
        body = m.group("body")
        n = detect_leak(body)
        if n == 0:
            return m.group(0)
        new_body = dedent_by(body, n)
        if new_body == body:
            return m.group(0)
        samples.append((field, body, new_body))
        counts_by_field[field] = counts_by_field.get(field, 0) + 1
        return f"{field}: `{new_body}`"

    new_src = TEMPLATE_RE.sub(repl, src)
    return new_src, len(samples), counts_by_field, samples


def show_diff(field: str, before: str, after: str) -> None:
    print(f"  -- {field} BEFORE --")
    for line in before.split("\n"):
        print(f"     | {line!r}")
    print(f"  -- {field} AFTER --")
    for line in after.split("\n"):
        print(f"     | {line!r}")
    print()


def main() -> None:
    apply = "--apply" in sys.argv

    total_files = 0
    total_blocks = 0
    grand_counts: dict[str, int] = {}
    all_samples: list[tuple[Path, str, str, str]] = []

    for path in sorted(DATA.glob("*.ts")):
        new_src, n, counts, samples = process_file(path)
        if n == 0:
            continue
        total_files += 1
        total_blocks += n
        for f, c in counts.items():
            grand_counts[f] = grand_counts.get(f, 0) + c
        for s in samples:
            all_samples.append((path, *s))
        breakdown = ", ".join(f"{f}={c}" for f, c in counts.items())
        print(f"  {path.name:55s} {n:>3} block(s)  ({breakdown})")
        if apply:
            path.write_text(new_src, encoding="utf-8")

    print()
    print(f"Files affected:           {total_files}")
    print(f"Template literals fixed:  {total_blocks}")
    if grand_counts:
        print("By field:")
        for f, c in sorted(grand_counts.items(), key=lambda kv: -kv[1]):
            print(f"  {f:18s} {c}")

    if not apply:
        print("\n(Dry run - pass --apply to write.)\n")
        print("Sample diffs (first 6):")
        for path, field, before, after in all_samples[:6]:
            print(f"\n=== {path.name} ===")
            show_diff(field, before, after)
    else:
        print("\nApplied. Re-run dry to confirm zero residual.")


if __name__ == "__main__":
    main()
