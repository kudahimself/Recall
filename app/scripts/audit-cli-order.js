#!/usr/bin/env node
/**
 * audit-cli-order.js
 *
 * Prints PY_CLI questions in the order the SELECTOR actually serves them.
 * The selector (spacedRepetition.ts ~L747) ignores backendOrderedQuestions.ts
 * literal position for NEW questions and sorts by:  difficulty  →  type.
 *   difficulty: BEGINNER(0) → INTERMEDIATE(1) → ADVANCED(2)   (PRIMARY axis)
 *   type:       MCQ(0) → PREDICT(1) → PARSONS(2) → CLOZE(3) → CODING(4)
 *
 * So the type ramp only orders WITHIN a tier; a beginner CODING legitimately
 * precedes an intermediate PARSONS. This audit surfaces (a) the served order,
 * (b) per-tier type composition, and (c) single-primitive faded questions
 * mislabeled above BEGINNER (the thing that makes parsons appear "after" coding).
 */
const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '../src/data/topic_py_cli.ts'), 'utf8');

const idRe = /^\s+id:\s*'([^']+)'/gm;
const ms = [];
let m;
while ((m = idRe.exec(src))) ms.push({ id: m[1], i: m.index });

const qs = [];
for (let k = 0; k < ms.length; k++) {
  const w = src.slice(ms[k].i, k + 1 < ms.length ? ms[k + 1].i : src.length);
  const type = /type:\s*QuestionType\.(\w+)/.exec(w);
  const diff = /difficulty:\s*Difficulty\.(\w+)/.exec(w);
  if (!type || !diff) continue;
  qs.push({ id: ms[k].id, type: type[1], difficulty: diff[1] });
}

const DRANK = { BEGINNER: 0, INTERMEDIATE: 1, ADVANCED: 2 };
const TRANK = { MULTIPLE_CHOICE: 0, PREDICT_OUTPUT: 1, PARSONS: 2, CLOZE_CODE: 3, CODING: 4 };
const TSHORT = { MULTIPLE_CHOICE: 'MCQ', PREDICT_OUTPUT: 'PREDICT', PARSONS: 'PARSONS', CLOZE_CODE: 'CLOZE', CODING: 'CODING' };

qs.sort((a, b) =>
  (DRANK[a.difficulty] - DRANK[b.difficulty]) || (TRANK[a.type] - TRANK[b.type]));

console.log('\n=== PY_CLI — served order (difficulty → type) ===\n');
let tier = null, pos = 0;
for (const q of qs) {
  if (q.difficulty !== tier) {
    tier = q.difficulty;
    console.log(`\n--- ${tier} ---`);
  }
  console.log(`${String(++pos).padStart(3)}. ${TSHORT[q.type].padEnd(8)} ${q.id}`);
}

console.log('\n\n=== Per-tier type composition ===\n');
for (const d of ['BEGINNER', 'INTERMEDIATE', 'ADVANCED']) {
  const tq = qs.filter(q => q.difficulty === d);
  const counts = {};
  for (const q of tq) counts[TSHORT[q.type]] = (counts[TSHORT[q.type]] || 0) + 1;
  console.log(`${d.padEnd(13)} (${tq.length}): ${JSON.stringify(counts)}`);
}

console.log('\n\n=== Faded labeled above BEGINNER (single-primitive scaffolds that sort after beginner coding) ===\n');
const FADED = new Set(['PARSONS', 'CLOZE_CODE', 'PREDICT_OUTPUT']);
const flagged = qs.filter(q => FADED.has(q.type) && q.difficulty !== 'BEGINNER');
if (!flagged.length) console.log('  (none)');
for (const q of flagged) console.log(`  ${q.difficulty.padEnd(13)} ${TSHORT[q.type].padEnd(8)} ${q.id}`);
console.log();
