---
name: topic-stats
description: Topic coverage analysis - question count by type/difficulty, identifies gaps, validates completeness
---

# Topic Stats

Token-efficient coverage analysis for topics. Identifies gaps in difficulty ramp and question type distribution.

## Usage

```bash
/topic-stats <topic>              # single topic (e.g., PY_BASICS)
/topic-stats --course <course>    # course summary (webdev, backend, databricks, data_eng)
/topic-stats --compare <t1> <t2>  # compare two topics
```

## Output format (AXI-compliant, TOON-style)

### Single topic view

```
Topic: PY_BASICS
Course: BACKEND
Path order: 1/47
─────────────────────────────

Total: 43 questions

By difficulty:
  Beginner     18  ████████████████░░░░  42%
  Intermediate 15  ███████████░░░░░░░░░  35%
  Advanced     10  ███████░░░░░░░░░░░░░  23%

By type:
  MCQ          12  █████████░░░░░░░░░░░  28%
  Predict       8  ██████░░░░░░░░░░░░░░  19%
  Parsons       6  ████░░░░░░░░░░░░░░░░  14%
  Cloze         9  ██████░░░░░░░░░░░░░░  21%
  Coding        8  ██████░░░░░░░░░░░░░░  18%

Difficulty × Type matrix:
              MCQ  Pred  Pars  Cloz  Code
  Beginner      6     5     4     3     0
  Intermediate  4     2     2     4     3
  Advanced      2     1     0     2     5

Ordered bank: ✓ 43/43 (100%)

─────────────────────────────
Ramp: ✓ complete (B→I→A coverage across types)
Gap: No beginner coding questions
Next: Consider adding 2-3 beginner coding drills
```

### Gap detection rules

**Complete ramp:**
- ✓ All three difficulties represented (B, I, A)
- ✓ At least 2 question types per difficulty
- ✓ Beginner has MCQ + at least one faded type (predict/parsons/cloze)
- ✓ Advanced has coding questions

**Gaps flagged:**
- ✗ Missing difficulty tier entirely
- ✗ Beginner has only MCQ (no faded/predict introduction)
- ✗ Intermediate or Advanced missing coding questions
- ✗ Only one question type across all difficulties
- ⚠ Heavy skew (one type >60% of total)

### Course summary view

```
Course: BACKEND
Topics: 47
Total questions: 387
─────────────────────────────

By difficulty:
  Beginner     156  ████████████░░░░░░░░  40%
  Intermediate 142  ███████████░░░░░░░░░  37%
  Advanced      89  ███████░░░░░░░░░░░░░  23%

By type:
  MCQ          147  ███████████░░░░░░░░░  38%
  Predict       58  ████░░░░░░░░░░░░░░░░  15%
  Parsons       42  ███░░░░░░░░░░░░░░░░░  11%
  Cloze         67  █████░░░░░░░░░░░░░░░  17%
  Coding        73  █████░░░░░░░░░░░░░░░  19%

Topic gaps: 3 topics with incomplete ramps
  • PY_CONCURRENCY: no beginner questions
  • DJ_MIDDLEWARE: no advanced coding
  • BE_SECURITY: only MCQ (no faded/coding)

Ordered bank coverage: 385/387 (99%)
  Missing: py_advanced_042, dj_models_018

─────────────────────────────
Next: /topic-stats PY_CONCURRENCY --detail
```

### Compare mode

```
Compare: PY_BASICS vs PY_ADVANCED
─────────────────────────────

                    PY_BASICS   PY_ADVANCED
Total                     43            38
Beginner                  18             3
Intermediate              15            12
Advanced                  10            23

MCQ                       12            15
Predict                    8             2
Parsons                    6             0
Cloze                      9             5
Coding                     8            16

Avg difficulty         1.81          2.53
Coding %                19%           42%

─────────────────────────────
PY_ADVANCED shows expected progression:
  • More advanced questions (23 vs 10)
  • Higher coding % (42% vs 19%)
  • Fewer faded types (appropriate for advanced)
```

## Derived metrics

**Difficulty score:**
- Beginner: 1.0
- Intermediate: 2.0
- Advanced: 3.0
- Avg = weighted mean

**Ramp completeness:**
- 0-33%: ✗ incomplete (missing tiers)
- 34-66%: ⚠ partial (gaps in type distribution)
- 67-100%: ✓ complete (B→I→A coverage)

**Coding intensity:**
- 0-10%: MCQ-heavy (concept/API course, expected for some topics)
- 11-25%: balanced
- 26%+: code-heavy (appropriate for advanced/applied topics)

## Integration with courseConfig.ts

Reads from single source of truth:
- Topic → Course mapping via `getCourseForTopic`
- Path order from `WEBDEV_PATH_ORDER` / `BACKEND_PATH_ORDER` / etc.
- Section structure from `*_SECTIONS` constants

## Token optimization (AXI principle 1-3)

- **TOON format** for matrix/tables (not JSON)
- **Bar charts** use Unicode blocks (█░) not ASCII art
- **Truncate** at 10 topics in course summary, offer `--full` for complete list
- **Minimal schema** - show 4 fields per topic in batch mode, detail on request
- **Pre-computed aggregates** - include totalCount, avgDifficulty, rampCompleteness

## Exit codes

- `0` - stats computed successfully
- `1` - topic not found / invalid course name
