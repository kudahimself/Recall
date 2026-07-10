"""
Decode Recall's Firefox localStorage and analyze the user's question history.

Firefox stores localStorage in storage/default/<origin>/ls/data.sqlite. Values
under ~64 chars are stored uncompressed; longer values are snappy-compressed
(conversion_type=1, compression_type=1 in the data table). cramjam handles snappy.

Usage:
  conda run -n recall-srs python scripts/inspect_firefox_storage.py
"""
from __future__ import annotations

import json
import os
import shutil
import sqlite3
import sys
from collections import Counter
from datetime import datetime, timezone

import cramjam

FF_PROFILE = (
    r"C:\Users\kudam\AppData\Roaming\Mozilla\Firefox\Profiles"
    r"\m0986uie.default-release\storage\default\http+++localhost+3000\ls\data.sqlite"
)
TMP_COPY = r"C:\Users\kudam\AppData\Local\Temp\recall-storage.sqlite"


def decode_value(blob: bytes, conversion_type: int, compression_type: int) -> str:
    """Firefox localStorage payload: optionally snappy-compressed UTF-8 / UTF-16.

    Firefox uses snappy BLOCK format (varint length prefix + compressed bytes),
    not the stream format with the sNaPpY magic header. cramjam exposes block
    format via decompress_raw.
    """
    if compression_type == 1:
        raw = bytes(cramjam.snappy.decompress_raw(blob))
    else:
        raw = bytes(blob)
    # Firefox's conversion_type: 0 = UTF-16 LE, 1 = UTF-8.
    if conversion_type == 0:
        return raw.decode("utf-16-le", errors="replace")
    return raw.decode("utf-8", errors="replace")


def load_storage() -> dict[str, str]:
    shutil.copyfile(FF_PROFILE, TMP_COPY)
    out: dict[str, str] = {}
    with sqlite3.connect(TMP_COPY) as conn:
        for k, blob, ct, comp in conn.execute(
            "SELECT key, value, conversion_type, compression_type FROM data"
        ):
            try:
                out[k] = decode_value(blob, ct, comp)
            except Exception as e:  # noqa: BLE001
                out[k] = f"<decode error: {e}>"
    return out


def fmt_ts(ms: int) -> str:
    if not ms:
        return "—"
    return datetime.fromtimestamp(ms / 1000, tz=timezone.utc).strftime("%Y-%m-%d %H:%M:%SZ")


def main() -> None:
    if not os.path.exists(FF_PROFILE):
        print(f"Firefox profile not found at {FF_PROFILE}", file=sys.stderr)
        sys.exit(1)

    store = load_storage()

    print("=" * 70)
    print("KEYS IN STORAGE")
    print("=" * 70)
    for k in sorted(store):
        size = len(store[k])
        preview = store[k].replace("\n", " ")[:80]
        print(f"  {k:32s} {size:>7}  {preview}")
    print()

    # ── Active course / profile / filters ──
    print("=" * 70)
    print("ACTIVE COURSE & PROFILE")
    print("=" * 70)
    print(f"  active course: {store.get('recall-active-course', '?')}")
    profile = json.loads(store.get("recall-profile", "{}") or "{}")
    print(f"  profile: {json.dumps(profile, indent=2, default=str)}")
    print()

    filters = json.loads(store.get("recall-filters", "{}") or "{}")
    print(f"  filters: topics={len(filters.get('topics', []))} difficulties="
          f"{filters.get('difficulties', [])} types={filters.get('questionTypes', [])}")
    print()

    # ── Progress ──
    progress = json.loads(store.get("recall-progress", "{}") or "{}")
    history = progress.get("attemptHistory") or []
    attempted = progress.get("questionsAttempted") or []
    correct = progress.get("correctAnswers") or []
    print("=" * 70)
    print(f"PROGRESS — {len(attempted)} unique attempted, {len(correct)} correct, "
          f"{len(history)} total attempts")
    print("=" * 70)

    # Last 30 attempts
    print("\n  LAST 30 ATTEMPTS (most recent last):")
    for a in history[-30:]:
        ok = "✓" if a.get("isCorrect") else "✗"
        ms = a.get("timestamp", 0)
        print(f"    {fmt_ts(ms)}  {ok}  {a.get('questionId', '?'):40s} "
              f"{a.get('timeSpent', 0)/1000:.1f}s")

    # Repeat counts
    print("\n  TOP-15 MOST-REPEATED QUESTIONS:")
    counts = Counter(a.get("questionId") for a in history)
    for qid, n in counts.most_common(15):
        print(f"    {n:>3}× {qid}")

    # Topic breakdown for last 50 attempts
    topic_scores = progress.get("topicScores") or []
    print("\n  TOPIC SCORES:")
    if isinstance(topic_scores, list):
        for entry in topic_scores:
            if isinstance(entry, list) and len(entry) == 2:
                topic, score = entry
                print(f"    {topic:35s} {score.get('correct',0)}/{score.get('total',0)}")

    # ── Concept progress ──
    cp = json.loads(store.get("recall-concept-progress", "{}") or "{}")
    print()
    print("=" * 70)
    print(f"CONCEPT PROGRESS — {len(cp)} concepts touched")
    print("=" * 70)
    rows = []
    for cid, state in cp.items():
        rows.append(
            (
                cid,
                state.get("successes", 0),
                state.get("failures", 0),
                state.get("stability", 0),
                state.get("lastSeen", 0),
                state.get("masteredAt"),
            )
        )
    rows.sort(key=lambda r: r[4], reverse=True)  # most recent first
    print(f"\n  {'concept':40s} {'✓':>3} {'✗':>3} {'stab':>6} {'lastSeen':20s} mastered")
    for cid, ok, no, st, ls, m in rows[:40]:
        print(f"  {cid:40s} {ok:>3} {no:>3} {st:6.2f} {fmt_ts(ls):20s} "
              f"{fmt_ts(m) if m else '—'}")

    # ── Card difficulty ──
    cd = json.loads(store.get("recall-card-difficulty", "{}") or "{}")
    print()
    print("=" * 70)
    print(f"CARD DIFFICULTY — {len(cd)} cards with FSRS difficulty recorded")
    print("=" * 70)


if __name__ == "__main__":
    main()
