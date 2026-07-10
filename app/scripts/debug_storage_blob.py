"""Dump raw blob bytes for a single key to understand Firefox's framing."""
from __future__ import annotations
import sqlite3, shutil, sys

FF = r"C:\Users\kudam\AppData\Roaming\Mozilla\Firefox\Profiles\m0986uie.default-release\storage\default\http+++localhost+3000\ls\data.sqlite"
TMP = r"C:\Users\kudam\AppData\Local\Temp\recall-storage.sqlite"


def main() -> None:
    shutil.copyfile(FF, TMP)
    with sqlite3.connect(TMP) as conn:
        cur = conn.cursor()
        cur.execute("SELECT name, sql FROM sqlite_master")
        for n, s in cur.fetchall():
            print(f"-- {n}")
            print(s)
            print()
        cur.execute("SELECT * FROM database")
        cols = [d[0] for d in cur.description]
        print("database row:")
        for row in cur.fetchall():
            for c, v in zip(cols, row):
                print(f"  {c}: {v!r}")
        print()

        cur.execute("SELECT key, utf16_length, conversion_type, compression_type, length(value), hex(value) FROM data WHERE key='recall-progress'")
        row = cur.fetchone()
        if row:
            k, l16, ct, comp, blen, hexv = row
            print(f"key={k}")
            print(f"  utf16_length={l16}, conversion_type={ct}, compression_type={comp}")
            print(f"  blob length={blen}")
            print(f"  hex (first 200): {hexv[:200]}")
            print()

        # Also dump for recall-misconceptions which decoded OK
        cur.execute("SELECT key, utf16_length, conversion_type, compression_type, length(value), hex(value) FROM data WHERE key='recall-misconceptions'")
        row = cur.fetchone()
        if row:
            k, l16, ct, comp, blen, hexv = row
            print(f"key={k}")
            print(f"  utf16_length={l16}, conversion_type={ct}, compression_type={comp}")
            print(f"  blob length={blen}")
            print(f"  hex: {hexv}")


if __name__ == "__main__":
    main()
