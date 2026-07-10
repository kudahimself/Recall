"""
Find PREDICT_OUTPUT questions whose `expectedOutput` template literal has the
leading-whitespace bug — lines after the first start with the source file's
indentation rather than truly being indented in the expected output.

The bug looks like this in source:
    expectedOutput: `13
  6
  8`,

The runtime sees `expectedOutput = "13\n  6\n  8"` — and the matcher
preserves leading whitespace, so the user typing `13\n6\n8` gets rejected.

Heuristic: the line right after `expectedOutput:` is the first line; subsequent
lines up to the closing backtick that start with exactly two spaces and a
non-space character are suspect. Code that's MEANT to have leading spaces (e.g.
indented dict output) usually has 4 or more spaces, or starts with `{`/`[`/`(`.
"""
from __future__ import annotations
import re
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "src" / "data"

# Match `expectedOutput: \`...\`` blocks (non-greedy, multiline).
PATTERN = re.compile(
    r"expectedOutput:\s*`([^`]*)`",
    re.DOTALL,
)


def is_suspect(value: str) -> bool:
    lines = value.split("\n")
    if len(lines) < 2:
        return False
    # All non-first lines must start with EXACTLY "  " (2 spaces) followed by
    # a non-space, non-bracket char. That's the signature of source-file
    # indentation accidentally embedded.
    for line in lines[1:]:
        if not line:  # blank line — fine
            continue
        if not line.startswith("  "):
            return False
        if line.startswith("   "):  # 3+ spaces is probably intentional
            return False
        # 2 spaces followed by something that suggests structure (not output)
        rest = line[2:]
        if not rest:
            return False
        # Common dict/list/tuple outputs start with these — preserved indentation
        # would be intentional in that case. Skip them (avoid false positives).
        if rest[0] in "{[(":
            return False
    return True


def main() -> None:
    total = 0
    suspect = 0
    by_file: dict[str, list[str]] = {}
    for f in sorted(DATA.glob("*.ts")):
        src = f.read_text(encoding="utf-8")
        for m in PATTERN.finditer(src):
            total += 1
            value = m.group(1)
            if is_suspect(value):
                suspect += 1
                # Find a nearby id for reporting
                start = max(0, m.start() - 800)
                segment = src[start:m.start()]
                id_match = re.findall(r"id:\s*'([^']+)'", segment)
                qid = id_match[-1] if id_match else "?"
                by_file.setdefault(f.name, []).append(qid)

    print(f"Total expectedOutput blocks: {total}")
    print(f"Suspect (leading 2-space indent on lines 2+): {suspect}\n")
    for fn, ids in sorted(by_file.items()):
        print(f"  {fn}  ({len(ids)} questions)")
        for qid in ids:
            print(f"    {qid}")


if __name__ == "__main__":
    main()
