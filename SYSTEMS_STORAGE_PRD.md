# PRD: Machines, Memory and Disks (Data Engineering, Section 7)

Status: not started.
Written 2026-07-29.
Owner: solo learner (repo owner).

This document is self-contained.
An implementing conversation should not need prior context beyond the repo itself and `CLAUDE.md`.

---

## 0. Summary

Add a new **section** to the Data Engineering course teaching the hardware and OS layer beneath data storage: the memory hierarchy, RAM vs disk, sequential vs random I/O, the page cache, virtual memory, CPU cache locality, SSD vs HDD, and spill-to-disk.

It is a **section inside Data Engineering**, not a sixth course.
Two blocking bug-fix phases (Phase 0) come first.

---

## 1. Phase 0: fix the outstanding issues first

These are pre-existing defects found on 2026-07-29.
Do these before authoring any new questions.

### 0a. Hinted passes can never clear a drain card

**The bug.**
Drain-queue membership requires the card's topic to be mastered (`countPendingDrain` in `app/src/utils/spacedRepetition.ts`).
Mastery also forces the MATURE hint-credit schedule via `getHintCreditSchedule`:

```ts
export const HINT_CREDIT_MATURE = [1, 0.5, 0.25];   // tier 0, 1, 2
export const CREDIT_CORRECT_THRESHOLD = 0.75;
```

So on a drain card, tier 1 earns 0.5 and tier 2 earns 0.25, both under the 0.75 bar.
`latestCorrectness` records the attempt as **wrong**, and the card stays queued no matter how cleanly it was then solved.
**No hint tier can produce a passing credit on any drain card.**

**Confirmed instance.**
Card `winfn-6`, 2026-07-29 22:06, logged `isCorrect: true, credit: 0.5, hintTierUsed: 1`.
It stayed in the drain and froze the queue counter.
Rare in absolute terms (12 of 6530 recorded attempts are correct-but-under-credit) but it lands hardest exactly where it is most confusing.

**Second half of the bug: the UI never says so.**
`App.tsx` surfaces the credit schedule *before* answering (the `hintCreditSchedule` prop, around line 847).
The result panel says nothing afterwards.
The learner sees a pass while the SRS logs a miss.

**Required outcome.** Both of:

1. The result panel states the discount explicitly after a hinted pass.
   Wording along the lines of: "Tier 1 hint used: 0.5 credit, below the 0.75 bar. This card stays in review."
2. Split "counts as correct for queue membership" from "earns full spacing".
   A hinted pass should release the card from the drain queue but reset its spacing streak, so it returns tomorrow rather than being pinned until answered unaided.

Item 2 is the real fix; item 1 is worth doing regardless because it makes the system legible.

**Tests.** Extend `app/src/utils/spacedRepetition.hints.test.ts`.
At minimum: a tier-1 pass on a mastered-topic drain card leaves the drain queue, and its next interval is the streak-reset interval rather than the full one.

### 0b. Seven HIGH leak violations

Run from `app/`.
None were introduced by recent work; all predate 2026-07-29.

`node scripts/check-leaks.js` (HIGH 2, tracked in `LEAK_AUDIT_TRACKER.md`):

| id | file | signal |
|---|---|---|
| `pe1-m4-11` | `topic_py_data_structures.ts` | lane A, recall 1.00 |
| `pe1-fileio-3` | `topic_py_file_io.ts` | lane A, recall 0.83 |

`node scripts/check-prompt-leaks.js` (HIGH 3, **not** in the tracker):

| id | file | score |
|---|---|---|
| `tsql-flow-1` | `topic_tsql_control_flow.ts` | 12 |
| `tsql-etlproc-2` | `topic_tsql_etl_proc.ts` | 11 |
| `py-adv-magic-1` | `topic_py_magic_methods.ts` | 10 |

`node scripts/check-starter-leaks-webdev.js` (HIGH 2, **not** in the tracker):

| id | file | score |
|---|---|---|
| `next-api-dynamic-1` | `nextjsQuestions.ts` | 6 |
| `next-error-handling-6` | `advancedNextQuestions.ts` | 6 |

**Required outcome.**
All seven at MEDIUM or below.
Add the five untracked ones to `LEAK_AUDIT_TRACKER.md` so its baseline stops understating the backlog (it currently records only the `check-leaks.js` counts: HIGH 2 / MEDIUM 34 / LOW 85).
Standing permission exists to fix or remove poor-quality questions during other work.

---

## 2. Why this section

The DE course already covers the *data* storage half: `de_rows_vs_columns`, `de_parquet_basics`, `de_object_storage`, `de_what_is_a_file_format`, `de_oltp_vs_olap`.
Section 5 ("Distributed Systems & Storage") covers `de_lsm_vs_btree`, `de_compaction_bloom`, `de_partitioning`, `de_replication`.

What is missing is the layer underneath all of it.
`de_lsm_vs_btree` assumes you already know what a page is and why random I/O costs more than sequential; nothing in the course teaches that.

The payoff is conversion of memorized facts into derivable ones:

- why Spark shuffles are expensive and what "spill" means
- why columnar formats win analytics scans (cache lines and compression, not magic)
- why a B-tree is page-shaped
- why N+1 queries hurt out of proportion to row count
- why connection pooling exists

Today those are five unrelated facts across three courses.

**Honest caveats.**
This is a knowledge subject, not a skill subject, so the code validator buys nothing.
It is adjacent to the stated fullstack goal rather than on it; it pays off in debugging instinct, not shipping speed.

---

## 3. Placement decision

**Append as the LAST section, Step 7.**
Do not insert it earlier in `DATA_ENG_PATH_ORDER`.

`getUnlockedSections` (`app/src/utils/spacedRepetition.ts`, around lines 1013-1025) is a strict sequential chain:

```ts
for (let i = 0; i < pathOrder.length; i++) {
  if (i === 0) { sections.add(sectionName); continue; }
  const prevKeys = getTopicKeysForSection(pathOrder[i - 1]);
  if (isMastered(prevKeys, questions, progress)) sections.add(sectionName);
  else break;
}
```

Because of the `break`, inserting a new section at position 2 would hard-lock Steps 3 through 6 for a learner already past them until the new section is mastered.
That is a real progress regression, not a cosmetic one.
Appending at the end costs nothing and disrupts no existing unlock state.

The pedagogical cost is that foundational material arrives last.
For the current learner this is acceptable: they have already worked through most of DE, so it lands as a deepening pass that explains what they have already seen, which is a legitimate concrete-then-abstract order.

---

## 4. Topics

Eight topics, new `Topic` enum entries, `de_*` prefix to match the course.

| Topic key | Display name | Teaches |
|---|---|---|
| `de_memory_hierarchy` | The Memory Hierarchy | registers, CPU cache, RAM, SSD, disk, network; order-of-magnitude latency |
| `de_ram_vs_disk` | RAM vs Disk | volatility, cost per byte, capacity, why working sets matter |
| `de_sequential_vs_random_io` | Sequential vs Random I/O | why a scan beats scattered reads; block/page granularity |
| `de_page_cache` | The Page Cache | OS buffering, why a second read is fast, buffered vs direct writes, fsync |
| `de_virtual_memory` | Virtual Memory and Paging | address translation, page faults, thrashing, swap |
| `de_cpu_cache_locality` | CPU Cache and Locality | cache lines, spatial/temporal locality, why columnar layouts vectorize |
| `de_ssd_vs_hdd` | SSD vs HDD | seek time vs erase blocks, write amplification, wear |
| `de_spill_to_disk` | Spill to Disk | what spilling is, why shuffles and joins trigger it, how to reduce it |

Ordering is deliberate: hardware facts, then OS abstractions built on them, then the two applications (`de_cpu_cache_locality` explains columnar, `de_spill_to_disk` explains Spark).

---

## 5. Question shape

Model on the Data Engineering course, not the coding courses.

- **Types:** MULTIPLE_CHOICE primarily, with PREDICT_OUTPUT where a concrete "which is faster and why" comparison works.
  No CODING questions.
  DE has no concept tags (`getSelectionPolicy` sets `useConceptSRS: false` for `Course.DATA_ENGINEERING`), so do not add `concepts` fields.
- **Volume:** roughly 9-12 per topic, matching existing DE density (41 topics, 381 questions). Target 80-95 total.
- **Ramp per topic:** BEGINNER defines the term plainly, INTERMEDIATE is "when does A beat B", ADVANCED is 1-2 real tradeoffs.
  The selector gates harder tiers behind beginner mastery automatically.
- **Ids:** fresh prefixes per topic, matching the existing style: `de-memhier-1`, `de-ramdisk-1`, `de-seqrand-1`, `de-pagecache-1`, `de-vmem-1`, `de-cpucache-1`, `de-ssdhdd-1`, `de-spill-1`.
- **Latency numbers:** state them as orders of magnitude (nanoseconds / microseconds / milliseconds), never as exact figures that will age badly.

**Distractor quality is the main risk on a knowledge course.**
Distractors must be real misconceptions, length-matched to the correct answer.
"Longest option is correct" is the recurring authoring failure here.
Run `/audit-mcq` on the finished section and act on what it flags.
Vary the correct letter; do not let it cluster.

Consult `/write-questions` for the per-type rubric before authoring.

---

## 6. Wiring checklist

All npm commands run from `app/`, not the repo root.

1. **`app/src/types/index.ts`** — add the 8 `DE_*` enum members to `Topic`, grouped with a comment like the existing section groupings.
2. **`app/src/data/dataEngineeringSystemsQuestions.ts`** — new file. Follow the header-comment style of `dataEngineeringFoundationsQuestions.ts` and export `dataEngineeringSystemsQuestions: Question[]`. Every question needs `course: Course.DATA_ENGINEERING`.
3. **`app/src/data/questions.ts`** — add the import (near line 43-48) and the spread into the exported array (near line 1031-1036).
4. **`app/src/utils/courseConfig.ts`** — three edits:
   - add the 8 topics to the `DATA_ENG_TOPICS` set (around line 53)
   - add the section to `DATA_ENG_SECTIONS` (after `'Operations, Quality & Modern DE'`) with `weight: 'Step 7'`
   - append the section name to `DATA_ENG_PATH_ORDER` (around line 555)

No changes to `App.tsx`, `ProgressTracker.tsx`, or `getUnlockedSections` are needed.
Those are only required when adding a whole course; a section is data-driven.

DE is not an ordered-bank course, so there is no `*OrderedQuestions.ts` append step.

---

## 7. Acceptance criteria

- [ ] Phase 0a: a tier-1 hinted pass on a mastered-topic drain card leaves the drain queue, with a test covering it.
- [ ] Phase 0a: the result panel names the credit discount after a hinted pass.
- [ ] Phase 0b: all seven HIGH leak violations at MEDIUM or below; the five untracked ones added to `LEAK_AUDIT_TRACKER.md`.
- [ ] 8 topics wired through all four files in section 6.
- [ ] 80-95 questions, every topic with a BEGINNER through ADVANCED ramp.
- [ ] `/audit-mcq` clean on the new section (distractor length parity, no positional bias).
- [ ] `/topic-stats` shows no coverage gaps across the 8 topics.
- [ ] `/verify` passes: tests, `tsc --noEmit`, lint, all four leak scripts with no NEW HIGH findings.
- [ ] The section appears as Step 7 in the DE path and unlocks only after "Operations, Quality & Modern DE" is mastered.
- [ ] Existing DE progress is unchanged: no previously-unlocked section becomes locked.

The last item is worth checking explicitly rather than assuming.

---

## 8. Out of scope

- Promoting this to a sixth course. Revisit only if it outgrows ~8 topics or starts pulling in Backend-side material (GIL, process vs thread memory, async I/O internals).
- Coding questions or any executable content.
- Concept tags. DE deliberately runs without them.
- Backfilling cross-references from the Databricks or Backend courses into these topics.
