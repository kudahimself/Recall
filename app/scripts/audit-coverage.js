#!/usr/bin/env node
/**
 * Coverage-gap auditor.
 *
 * Enforces the faded-layer convention (see HOW_TO_CONSTRUCT_TOPIC.md):
 * every primitive a learner must COLD-WRITE in a CODING question should first
 * appear in a lower-cognitive-load form — a PARSONS, CLOZE_CODE, or
 * PREDICT_OUTPUT "faded" question — so the ramp is worked -> faded -> cold,
 * not straight to cold.
 *
 * It works PER TOPIC. A primitive is approximated by a question's distinctive
 * `tags` (generic tags that blanket the whole topic, e.g. 'security', are
 * dropped automatically by frequency). A CODING question is flagged when NONE
 * of its distinctive tags appears on any faded question in the same topic — i.e.
 * there is no faded on-ramp to that cold-write.
 *
 * This is a HEURISTIC: it produces candidates to eyeball, like the leak checks.
 * Tags are the only machine-readable signal for "which primitive" — a clean
 * flag means "no faded question shares a tag", which is usually a real gap but
 * occasionally just means the coding question's tags are scenario words.
 *
 * Usage:
 *   node scripts/audit-coverage.js                 # all data files, grouped by course
 *   node scripts/audit-coverage.js backend         # only topics whose course matches substring
 *   node scripts/audit-coverage.js --matrix        # also print the per-topic difficulty x type matrix
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

const args = process.argv.slice(2);
const SHOW_MATRIX = args.includes('--matrix');
const courseFilter = (args.find((a) => !a.startsWith('--')) || '').toUpperCase();

// Tags that appear on >= this fraction of a topic's questions are treated as
// generic (the topic's theme) and ignored when matching coding<->faded.
// Kept above 0.5 so a topic's CORE primitive (e.g. `argparse` in PY_CLI, which
// legitimately dominates the topic and IS heavily faded) is not stripped and
// then falsely flagged. Theme tags like `security`/`cli` blanket ~100% and are
// still removed.
const GENERIC_FRACTION = 0.6;

const FADED_TYPES = new Set(['PARSONS', 'CLOZE_CODE', 'PREDICT_OUTPUT']);

// ---------- tags array reader ----------

function readTags(window) {
  const key = /tags:\s*\[/.exec(window);
  if (!key) return [];
  let i = key.index + key[0].length; // just after '['
  const tags = [];
  let cur = null;
  while (i < window.length) {
    const c = window[i];
    if (c === ']') break;
    if (c === "'" || c === '"' || c === '`') {
      if (cur === null) {
        cur = { quote: c, value: '' };
      } else if (c === cur.quote) {
        tags.push(cur.value);
        cur = null;
      } else {
        cur.value += c;
      }
    } else if (cur !== null) {
      cur.value += c;
    }
    i++;
  }
  return tags;
}

// ---------- question walker ----------
// Top-level question ids sit on their own indented line (`      id: '...'`).
// Option ids live inline (`{ id: 'a', ... }`) so they never start a line with
// `id:` — the multiline anchor below cleanly skips them.

function extractQuestions(src, file) {
  const idRe = /^[ \t]+id:\s*['"`]([^'"`]+)['"`]/gm;
  const matches = [];
  let m;
  while ((m = idRe.exec(src))) matches.push({ id: m[1], index: m.index });

  const questions = [];
  for (let k = 0; k < matches.length; k++) {
    const start = matches[k].index;
    const end = k + 1 < matches.length ? matches[k + 1].index : src.length;
    const window = src.slice(start, end);

    const type = /type:\s*QuestionType\.(\w+)/.exec(window);
    const topic = /topic:\s*Topic\.(\w+)/.exec(window);
    if (!type || !topic) continue; // not a real question object

    const difficulty = /difficulty:\s*Difficulty\.(\w+)/.exec(window);
    const course = /course:\s*Course\.(\w+)/.exec(window);

    questions.push({
      id: matches[k].id,
      file,
      type: type[1],
      topic: topic[1],
      difficulty: difficulty ? difficulty[1] : '?',
      course: course ? course[1] : '?',
      tags: readTags(window),
    });
  }
  return questions;
}

// ---------- load ----------

const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.ts'));
let all = [];
for (const file of files) {
  const src = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
  all = all.concat(extractQuestions(src, file));
}

// group by topic
const byTopic = new Map();
for (const q of all) {
  if (!byTopic.has(q.topic)) byTopic.set(q.topic, []);
  byTopic.get(q.topic).push(q);
}

// ---------- analysis per topic ----------

const TYPE_ORDER = ['MULTIPLE_CHOICE', 'PREDICT_OUTPUT', 'PARSONS', 'CLOZE_CODE', 'CODING'];
const DIFF_ORDER = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', '?'];

const report = []; // { course, topic, counts, codingGaps:[], unclassified:[] }

for (const [topic, qs] of byTopic) {
  const course = qs[0].course;
  if (courseFilter && !course.includes(courseFilter)) continue;

  // tag frequency across the topic to find generics
  const tagCount = new Map();
  for (const q of qs) for (const t of new Set(q.tags)) tagCount.set(t, (tagCount.get(t) || 0) + 1);
  const isGeneric = (t) => tagCount.get(t) / qs.length >= GENERIC_FRACTION;
  const distinctive = (q) => q.tags.filter((t) => !isGeneric(t));

  // pool of distinctive tags that have a faded question
  const fadedTags = new Set();
  for (const q of qs) {
    if (FADED_TYPES.has(q.type)) for (const t of distinctive(q)) fadedTags.add(t);
  }

  const codingGaps = [];
  const unclassified = [];
  for (const q of qs) {
    if (q.type !== 'CODING') continue;
    const dtags = distinctive(q);
    if (dtags.length === 0) {
      unclassified.push(q);
      continue;
    }
    const hasOnRamp = dtags.some((t) => fadedTags.has(t));
    if (!hasOnRamp) codingGaps.push({ q, dtags });
  }

  // difficulty x type matrix counts
  const counts = {};
  for (const t of TYPE_ORDER) counts[t] = 0;
  for (const q of qs) counts[q.type] = (counts[q.type] || 0) + 1;

  report.push({ course, topic, total: qs.length, counts, codingGaps, unclassified, qs });
}

// ---------- print ----------

report.sort((a, b) => (a.course === b.course ? a.topic.localeCompare(b.topic) : a.course.localeCompare(b.course)));

let curCourse = null;
let totalGaps = 0;
for (const r of report) {
  if (r.course !== curCourse) {
    curCourse = r.course;
    console.log(`\n========== COURSE: ${curCourse} ==========`);
  }

  const typeSummary = TYPE_ORDER.filter((t) => r.counts[t])
    .map((t) => `${t.toLowerCase().replace('multiple_choice', 'mcq').replace('predict_output', 'predict').replace('cloze_code', 'cloze')}=${r.counts[t]}`)
    .join(' ');

  const flag = r.codingGaps.length ? `  ⚠ ${r.codingGaps.length} coding gap(s)` : '';
  console.log(`\n  ${r.topic}  (${r.total} q: ${typeSummary})${flag}`);

  if (SHOW_MATRIX) {
    const byDiff = {};
    for (const d of DIFF_ORDER) byDiff[d] = {};
    for (const q of r.qs) byDiff[q.difficulty][q.type] = (byDiff[q.difficulty][q.type] || 0) + 1;
    for (const d of DIFF_ORDER) {
      const row = TYPE_ORDER.filter((t) => byDiff[d][t]).map((t) => `${t.toLowerCase().slice(0, 6)}:${byDiff[d][t]}`).join('  ');
      if (row) console.log(`      ${d.padEnd(13)} ${row}`);
    }
  }

  if (r.codingGaps.length) {
    console.log(`      CODING with no faded on-ramp (no parsons/cloze/predict shares a distinctive tag):`);
    for (const { q, dtags } of r.codingGaps) {
      totalGaps++;
      console.log(`        • ${q.id.padEnd(26)} [${q.difficulty.toLowerCase()}]  tags{${dtags.join(', ')}}`);
    }
  }
  if (r.unclassified.length) {
    console.log(`      (coding with no distinctive tag — can't assess: ${r.unclassified.map((q) => q.id).join(', ')})`);
  }
}

console.log(`\n----------------------------------------`);
console.log(`Total CODING questions with no faded on-ramp: ${totalGaps}`);
console.log(`Heuristic: a clean flag means no faded question shares a distinctive tag — usually a missing faded scaffold, occasionally just scenario-only tags. Eyeball before acting.`);
