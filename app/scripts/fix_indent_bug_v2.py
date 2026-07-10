"""
Round 2 of the source-indent leak fix.

The original `fix_indent_bug.py` only swept `code:` and `expectedOutput:`. The
same bug exists in OTHER template-literal fields:
  - starterCode:  (CODING questions — leaks into the Monaco editor)
  - solution:     (CODING — shown when user gets it wrong, also used by validator)
  - template:     (CLOZE_CODE)

Bug pattern in source (note that "blank" lines are actually 2-space lines):
    starterCode: `import math
      # comment
      print(...)
      `,

…produces a runtime value where every line after the first carries a leading
"  ". For starterCode that means the editor opens with broken indentation; for
solution/template the validator may match against indented forms.

Improvements over v1:
  1. Lines that are pure whitespace are treated as blank (don't abort detection).
  2. Detection rule: dedent iff EVERY non-first, non-blank line starts with
     EXACTLY 2 spaces followed by a non-space char (the 2-space-leak
     signature). 3+-space-indented lines mean real Python indentation — leave
     it alone.
  3. After detection, also strip the leading 2 spaces from "blank" lines that
     were just whitespace, so the cleaned output doesn't carry weird trailing
     space.

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
    """Whitespace-only or empty."""
    return line.strip() == ""


def should_dedent(body: str) -> bool:
    """True iff every non-first, non-blank line starts with EXACTLY 2 spaces
    followed by a non-space char. Pure-whitespace lines are treated as blank
    (the previous heuristic aborted on a `  ` line, missing many cases)."""
    lines = body.split("\n")
    if len(lines) < 2:
        return False
    saw_indented_line = False
    for line in lines[1:]:
        if is_blank(line):
            continue
        if not line.startswith("  "):
            return False
        if line.startswith("   "):
            return False  # 3+ spaces = real Python indentation
        rest = line[2:]
        if not rest:
            return False  # shouldn't happen since is_blank caught it, but defensive
        saw_indented_line = True
    return saw_indented_line


def dedent_continuation(body: str) -> str:
    """Strip leading 2 spaces from every non-first line. For pure-whitespace
    lines (the `  ` sentinels), collapse them to truly empty so the cleaned
    text is tidy."""
    lines = body.split("\n")
    out = [lines[0]]
    for line in lines[1:]:
        if is_blank(line):
            out.append("")
        elif line.startswith("  "):
            out.append(line[2:])
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
        if not should_dedent(body):
            return m.group(0)
        new_body = dedent_continuation(body)
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
        print("Sample diffs (first 5):")
        for path, field, before, after in all_samples[:5]:
            print(f"\n=== {path.name} ===")
            show_diff(field, before, after)
    else:
        print("\nApplied. Re-run dry to confirm zero residual.")


if __name__ == "__main__":
    main()
