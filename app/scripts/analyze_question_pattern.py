"""
Analyze whether the user's recent question selection makes sense.

Surfaces:
- Last N attempts and how often each question id repeats
- Backend-vs-other distribution (the user is supposedly on Backend)
- Concept SRS state for the cards that are repeating most
- Cards with concepts whose pool is so small they keep cycling
"""
from __future__ import annotations
import json, re, shutil, sqlite3, sys
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

import cramjam

FF = Path(r"C:\Users\kudam\AppData\Roaming\Mozilla\Firefox\Profiles\m0986uie.default-release\storage\default\http+++localhost+3000\ls\data.sqlite")
TMP = Path(r"C:\Users\kudam\AppData\Local\Temp\recall-storage.sqlite")
DATA_DIR = Path(__file__).resolve().parent.parent / "src" / "data"


def decode(blob, ct, comp):
    raw = bytes(cramjam.snappy.decompress_raw(blob)) if comp == 1 else bytes(blob)
    return raw.decode("utf-16-le", errors="replace") if ct == 0 else raw.decode("utf-8", errors="replace")


def load_storage():
    shutil.copyfile(FF, TMP)
    out = {}
    with sqlite3.connect(TMP) as conn:
        for k, v, ct, comp in conn.execute(
            "SELECT key, value, conversion_type, compression_type FROM data"
        ):
            out[k] = decode(v, ct, comp)
    return out


def fmt(ms):
    return datetime.fromtimestamp(ms / 1000, tz=timezone.utc).strftime("%H:%M:%S") if ms else "—"


# ── Load every question from src/data via regex (id → topic, course, concepts) ──
QUESTION_RE = re.compile(
    r"id:\s*'([^']+)'.*?topic:\s*Topic\.([A-Z_]+)"
    r"(?:.*?course:\s*Course\.([A-Z_]+))?"
    r"(?:.*?concepts:\s*\[([^\]]*)\])?",
    re.DOTALL,
)


def load_question_index():
    by_id = {}
    for f in DATA_DIR.glob("*.ts"):
        src = f.read_text(encoding="utf-8")
        # Naive split on `id:` boundaries so each chunk is one question.
        chunks = re.split(r"\n\s*\{\s*\n", src)
        for ch in chunks:
            m = re.search(r"id:\s*'([^']+)'", ch)
            if not m:
                continue
            qid = m.group(1)
            topic_m = re.search(r"topic:\s*Topic\.([A-Z_]+)", ch)
            course_m = re.search(r"course:\s*Course\.([A-Z_]+)", ch)
            concepts_m = re.search(r"concepts:\s*\[([^\]]*)\]", ch)
            concepts = []
            if concepts_m:
                concepts = [c.strip().strip("'\"") for c in concepts_m.group(1).split(",") if c.strip()]
            by_id[qid] = {
                "file": f.name,
                "topic": topic_m.group(1) if topic_m else "?",
                "course": course_m.group(1) if course_m else "?",
                "concepts": concepts,
            }
    return by_id


def topic_to_course(topic):
    DBX = {"DATABRICKS_BASICS","PYSPARK_BASICS","PYSPARK_DATAFRAMES","PYSPARK_TRANSFORMATIONS",
           "PYSPARK_ACTIONS","SPARK_SQL","SPARK_OPTIMIZATION","ADVANCED_TOPICS","STRING_FUNCTIONS",
           "DATETIME_FUNCTIONS","COLLECTION_FUNCTIONS","MATH_FUNCTIONS","WINDOW_FUNCTIONS",
           "NULL_HANDLING","DELTA_LAKE_BASICS","DELTA_OPERATIONS","DELTA_TIME_TRAVEL",
           "DELTA_OPTIMIZATION","SQL_JOINS","SQL_AGGREGATIONS","SQL_SUBQUERIES",
           "SQL_WINDOW_FUNCTIONS","SQL_SET_OPERATIONS","DATABRICKS_PLATFORM",
           "DATABRICKS_UTILITIES","STRUCTURED_STREAMING","AUTO_LOADER","MEDALLION_ARCHITECTURE",
           "CHANGE_DATA_CAPTURE","DELTA_LIVE_TABLES","DATABRICKS_WORKFLOWS","DATA_GOVERNANCE",
           "DATA_MODELING","SCD_PATTERNS","PIPELINE_DESIGN"}
    if topic.startswith(("HTML_","CSS_","TAILWIND","JS_","TS_","REACT_","NEXT_","ACCESSIBILITY",
                        "PATTERNS_","API_DESIGN","DB_DESIGN")):
        return "WEB_DEV"
    if topic in DBX:
        return "DATABRICKS"
    if topic.startswith("DE_"):
        return "DATA_ENGINEERING"
    return "BACKEND"


def main():
    store = load_storage()
    progress = json.loads(store["recall-progress"])
    cp = json.loads(store.get("recall-concept-progress", "{}"))
    by_id = load_question_index()
    print(f"Loaded {len(by_id)} questions from src/data\n")

    history = progress["attemptHistory"]
    print("=" * 78)
    print(f"LAST 60 ATTEMPTS — does it make sense?")
    print("=" * 78)
    for a in history[-60:]:
        qid = a["questionId"]
        info = by_id.get(qid, {})
        topic = info.get("topic", "?")
        course_via_topic = topic_to_course(topic)
        concepts = info.get("concepts", [])
        ok = "✓" if a.get("isCorrect") else "✗"
        flag = "" if course_via_topic == "BACKEND" else f"[{course_via_topic}!] "
        print(f"  {fmt(a['timestamp'])} {ok}  {flag}{qid:35s} {topic:25s} concepts={concepts}")

    # Course distribution of recent picks
    print()
    print("=" * 78)
    print("COURSE DISTRIBUTION OF LAST 100 ATTEMPTS (active course = backend)")
    print("=" * 78)
    course_counter = Counter()
    for a in history[-100:]:
        info = by_id.get(a["questionId"], {})
        course_counter[topic_to_course(info.get("topic", "?"))] += 1
    for c, n in course_counter.most_common():
        print(f"  {c:20s} {n}")

    # Most-repeated in last 200 attempts
    print()
    print("=" * 78)
    print("REPEAT FREQUENCY IN LAST 200 ATTEMPTS")
    print("=" * 78)
    recent_counter = Counter(a["questionId"] for a in history[-200:])
    for qid, n in recent_counter.most_common(15):
        info = by_id.get(qid, {})
        print(f"  {n:>3}× {qid:35s} {info.get('topic','?'):25s} "
              f"course={topic_to_course(info.get('topic','?'))} "
              f"concepts={info.get('concepts', [])}")

    # Concept-pool sizes — how many questions reach each tagged concept?
    print()
    print("=" * 78)
    print("CONCEPT POOL SIZE — concepts touched by user's progress")
    print("=" * 78)
    concept_pool = defaultdict(list)
    for qid, info in by_id.items():
        for c in info.get("concepts", []):
            concept_pool[c].append(qid)
    for cid, state in sorted(cp.items(), key=lambda x: -x[1].get("successes", 0))[:25]:
        pool = concept_pool.get(cid, [])
        succ = state.get("successes", 0)
        fail = state.get("failures", 0)
        # Mastery via PFA formula (γ=0.4, ρ=0.6, β=0)
        from math import exp
        beta = 0  # most concepts have beta=0
        m = 1 / (1 + exp(-(beta + 0.4 * succ - 0.6 * fail)))
        bucket = "DUE" if state.get("stability", 0) < 1 else (
            "FRINGE" if 0.5 <= m <= 0.85 else (
                "MASTERED" if m > 0.85 else "BELOW_FRINGE"))
        print(f"  {cid:35s} pool={len(pool):>3}  ✓{succ:>2}/✗{fail:<2} "
              f"m={m:.2f} stab={state.get('stability',0):.2f} → {bucket}")

    # The "pe1-m1-1" interpreted question specifically
    print()
    print("=" * 78)
    print("DETAILED LOOK: pe1-m1-1 (the interpreted-language question)")
    print("=" * 78)
    target_attempts = [a for a in history if a["questionId"] == "pe1-m1-1"]
    print(f"  Total attempts: {len(target_attempts)}")
    for a in target_attempts:
        ok = "✓" if a.get("isCorrect") else "✗"
        d = datetime.fromtimestamp(a["timestamp"]/1000, tz=timezone.utc).strftime("%Y-%m-%d %H:%M:%SZ")
        print(f"    {d}  {ok}  {a.get('timeSpent', 0)/1000:.1f}s")
    info = by_id.get("pe1-m1-1", {})
    print(f"  Question concepts: {info.get('concepts', [])}")
    py_runtime_cards = [q for q, i in by_id.items() if "py-runtime" in i.get("concepts", [])]
    print(f"  Other questions tagged 'py-runtime' ({len(py_runtime_cards)}):")
    for q in py_runtime_cards:
        print(f"    {q:35s} {by_id[q]['topic']}")


if __name__ == "__main__":
    main()
