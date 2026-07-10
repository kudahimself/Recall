"""Check repeat history of a single question id and its concept pool."""
from __future__ import annotations
import json, re, shutil, sqlite3, sys
from datetime import datetime, timezone
from pathlib import Path
import cramjam

FF = Path(r"C:\Users\kudam\AppData\Roaming\Mozilla\Firefox\Profiles\m0986uie.default-release\storage\default\http+++localhost+3000\ls\data.sqlite")
TMP = Path(r"C:\Users\kudam\AppData\Local\Temp\recall-storage.sqlite")
DATA = Path(__file__).resolve().parent.parent / "src" / "data"

QID = sys.argv[1] if len(sys.argv) > 1 else "py-data-structures-parsons-7"


def decode(blob, ct, comp):
    raw = bytes(cramjam.snappy.decompress_raw(blob)) if comp == 1 else bytes(blob)
    return raw.decode("utf-16-le", "replace") if ct == 0 else raw.decode("utf-8", "replace")


def main() -> None:
    shutil.copyfile(FF, TMP)
    with sqlite3.connect(TMP) as conn:
        store = {
            k: decode(v, ct, comp)
            for k, v, ct, comp in conn.execute(
                "SELECT key, value, conversion_type, compression_type FROM data"
            )
        }

    prog = json.loads(store["recall-progress"])
    cp = json.loads(store.get("recall-concept-progress", "{}") or "{}")

    hist = [a for a in prog["attemptHistory"] if a.get("questionId") == QID]
    print(f"Attempts on {QID}: {len(hist)}")
    for a in hist:
        ok = "✓" if a.get("isCorrect") else "✗"
        d = datetime.fromtimestamp(a["timestamp"] / 1000, tz=timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
        print(f"  {d}  {ok}  {a.get('timeSpent', 0) / 1000:.1f}s")

    # Find this question's concepts
    concepts = []
    for f in DATA.glob("*.ts"):
        src = f.read_text(encoding="utf-8")
        m = re.search(rf"id:\s*'{re.escape(QID)}'.{{0,2000}}?concepts:\s*\[([^\]]*)\]", src, re.DOTALL)
        if m:
            concepts = [c.strip().strip("'\"") for c in m.group(1).split(",") if c.strip()]
            print(f"\nFound in {f.name}, concepts={concepts}")
            break

    print("\nConcept SRS state:")
    for cid in concepts:
        st = cp.get(cid)
        if st is None:
            print(f"  {cid}: <untouched>")
        else:
            from math import exp
            m = 1 / (1 + exp(-(0.4 * st["successes"] - 0.6 * st["failures"])))
            print(
                f"  {cid}: ✓{st['successes']} ✗{st['failures']} "
                f"stab={st['stability']:.2f} mastery={m:.3f}"
            )

    # Pool size for each concept
    print("\nPool size per concept (other questions tagged the same concept):")
    for cid in concepts:
        pool = []
        for f in DATA.glob("*.ts"):
            src = f.read_text(encoding="utf-8")
            for m in re.finditer(r"id:\s*'([^']+)'.{0,2000}?concepts:\s*\[([^\]]*)\]", src, re.DOTALL):
                if cid in m.group(2):
                    pool.append((m.group(1), f.name))
        print(f"  {cid}: pool={len(pool)}")
        for q, fn in pool:
            print(f"    {q:40s} {fn}")


if __name__ == "__main__":
    main()
