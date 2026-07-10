#!/usr/bin/env node
/**
 * Difficulty-inversion auditor (faded vs cold-write ordering).
 *
 * The selector serves questions by (topic, difficulty, type) — so ALL beginner
 * questions in a topic precede all intermediate ones. The faded-layer convention
 * wants a primitive's faded scaffold (parsons/cloze/predict) served BEFORE its
 * cold-write CODING. That holds only if the faded is at the SAME or LOWER
 * difficulty than the coding. This audit centers on each cold-write and asks
 * whether its primitives have an on-ramp at or below its level.
 *
 * Primitive ~ a question's distinctive `tags` (topic-theme tags dropped by
 * frequency), matched CASE-INSENSITIVELY (so `lock` == `Lock`).
 *
 * TIER 1 — cold-write with NO same-primitive faded at or below its difficulty.
 *   1a (inversion): a faded for the primitive EXISTS but only ABOVE the cold-write
 *      → demote it. (This is the py-concurrency-parsons-1 / py-concurrency-4 bug.)
 *   1b (coverage):  no faded for the primitive anywhere (audit-coverage territory).
 * TIER 2 — cold-write HAS an at/below on-ramp, but more same-primitive faded sits
 *   ABOVE it. Often fine (advanced faded for advanced scenarios); review the
 *   adjacent-tier ones where the faded looks like the same content one tier up.
 *
 * HEURISTIC — eyeball every hit; tag links can be coincidental or missing.
 *
 * Usage:
 *   node scripts/audit-difficulty-inversion.js                 # BACKEND (Python), tier 1 only
 *   node scripts/audit-difficulty-inversion.js BACKEND --t2    # also print tier 2
 *   node scripts/audit-difficulty-inversion.js BACKEND PY_     # restrict topics
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const argv = process.argv.slice(2);
const SHOW_T2 = argv.includes('--t2');
const positional = argv.filter((a) => !a.startsWith('--'));
const courseFilter = (positional[0] || 'BACKEND').toUpperCase();
const topicFilter = (positional[1] || '').toUpperCase();

const GENERIC_FRACTION = 0.6;
const FADED = new Set(['PARSONS', 'CLOZE_CODE', 'PREDICT_OUTPUT']);
const RANK = { BEGINNER: 0, INTERMEDIATE: 1, ADVANCED: 2 };
const NAME = ['beginner', 'intermediate', 'advanced'];

function readTags(w) {
  const key = /tags:\s*\[/.exec(w);
  if (!key) return [];
  let i = key.index + key[0].length, out = [], cur = null;
  while (i < w.length) {
    const c = w[i];
    if (c === ']') break;
    if (c === "'" || c === '"' || c === '`') {
      if (cur === null) cur = { q: c, v: '' };
      else if (c === cur.q) { out.push(cur.v); cur = null; }
      else cur.v += c;
    } else if (cur !== null) cur.v += c;
    i++;
  }
  return out;
}

function extract(src, file) {
  const idRe = /^[ \t]+id:\s*['"`]([^'"`]+)['"`]/gm;
  const ms = []; let m;
  while ((m = idRe.exec(src))) ms.push({ id: m[1], i: m.index });
  const out = [];
  for (let k = 0; k < ms.length; k++) {
    const w = src.slice(ms[k].i, k + 1 < ms.length ? ms[k + 1].i : src.length);
    const type = /type:\s*QuestionType\.(\w+)/.exec(w);
    const topic = /topic:\s*Topic\.(\w+)/.exec(w);
    if (!type || !topic) continue;
    const diff = /difficulty:\s*Difficulty\.(\w+)/.exec(w);
    const course = /course:\s*Course\.(\w+)/.exec(w);
    out.push({
      id: ms[k].id, type: type[1], topic: topic[1],
      difficulty: diff ? diff[1] : '?',
      course: course ? course[1] : '?',
      tags: readTags(w).map((t) => t.toLowerCase()),
    });
  }
  return out;
}

let all = [];
for (const f of fs.readdirSync(DATA_DIR).filter((x) => x.endsWith('.ts'))) {
  all = all.concat(extract(fs.readFileSync(path.join(DATA_DIR, f), 'utf8'), f));
}

const byTopic = new Map();
for (const q of all) {
  if (!q.course.includes(courseFilter)) continue;
  if (topicFilter && !q.topic.includes(topicFilter)) continue;
  if (!byTopic.has(q.topic)) byTopic.set(q.topic, []);
  byTopic.get(q.topic).push(q);
}

const tier1 = []; // { topic, cold, above:[faded], kind:'inversion'|'coverage' }
const tier2 = []; // { topic, cold, above:[faded], gap }

for (const [topic, qs] of byTopic) {
  const tagCount = new Map();
  for (const q of qs) for (const t of new Set(q.tags)) tagCount.set(t, (tagCount.get(t) || 0) + 1);
  const distinctive = (q) => q.tags.filter((t) => tagCount.get(t) / qs.length < GENERIC_FRACTION);

  for (const c of qs) {
    if (c.type !== 'CODING' || !(c.difficulty in RANK)) continue;
    const ctags = distinctive(c);
    if (ctags.length === 0) continue;
    const cr = RANK[c.difficulty];

    const sameFaded = qs.filter(
      (f) => FADED.has(f.type) && f.difficulty in RANK && f.tags.some((t) => ctags.includes(t)),
    );
    const below = sameFaded.filter((f) => RANK[f.difficulty] <= cr);
    const above = sameFaded.filter((f) => RANK[f.difficulty] > cr);

    if (below.length === 0) {
      tier1.push({ topic, cold: c, above, kind: above.length ? 'inversion' : 'coverage' });
    } else if (above.length > 0) {
      const minGap = Math.min(...above.map((f) => RANK[f.difficulty] - cr));
      tier2.push({ topic, cold: c, above, gap: minGap });
    }
  }
}

function fadedStr(list, ctags) {
  return list
    .map((f) => {
      const shared = f.tags.filter((t) => ctags.includes(t));
      return `${f.id}[${f.difficulty.toLowerCase().slice(0, 3)}]{${shared.join(',')}}`;
    })
    .join(', ');
}
const distinctiveOf = (topic, q) => {
  const qs = byTopic.get(topic);
  const tagCount = new Map();
  for (const x of qs) for (const t of new Set(x.tags)) tagCount.set(t, (tagCount.get(t) || 0) + 1);
  return q.tags.filter((t) => tagCount.get(t) / qs.length < GENERIC_FRACTION);
};

console.log(`\n================ TIER 1 — cold-write with NO on-ramp at/below its level ================`);
tier1.sort((a, b) => (a.kind === b.kind ? a.topic.localeCompare(b.topic) : a.kind.localeCompare(b.kind)));
for (const f of tier1) {
  const ctags = distinctiveOf(f.topic, f.cold);
  console.log(`\n  [${f.kind}] ${f.cold.id}  (${f.cold.topic} / ${f.cold.difficulty.toLowerCase()})  tags{${ctags.join(', ')}}`);
  if (f.kind === 'inversion') console.log(`     same-primitive faded sits ABOVE → demote one: ${fadedStr(f.above, ctags)}`);
  else console.log(`     no faded shares its primitive (coverage gap — see audit-coverage.js)`);
}
console.log(`\n  Tier 1 total: ${tier1.length}  (inversion: ${tier1.filter((x) => x.kind === 'inversion').length}, coverage: ${tier1.filter((x) => x.kind === 'coverage').length})`);

if (SHOW_T2) {
  console.log(`\n\n================ TIER 2 — has on-ramp, but more faded sits above (review) ================`);
  tier2.sort((a, b) => (a.gap === b.gap ? a.topic.localeCompare(b.topic) : a.gap - b.gap));
  for (const f of tier2) {
    const ctags = distinctiveOf(f.topic, f.cold);
    console.log(`\n  (+${f.gap}) ${f.cold.id}  (${f.cold.topic} / ${f.cold.difficulty.toLowerCase()})`);
    console.log(`     faded above: ${fadedStr(f.above, ctags)}`);
  }
}
console.log(`\n  Tier 2 total: ${tier2.length}${SHOW_T2 ? '' : '  (run with --t2 to list)'}`);
console.log(`\nHeuristic — verify each. Tier 1 'inversion' = the actionable mislabels (e.g. the Lock parsons).`);
