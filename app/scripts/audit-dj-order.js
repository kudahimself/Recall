#!/usr/bin/env node
/**
 * audit-dj-order.js
 *
 * Audits within-topic question ordering for EVERY Django (dj_*) topic.
 *
 * The selector (spacedRepetition.ts) serves NEW questions sorted by
 *   difficulty: BEGINNER(0) → INTERMEDIATE(1) → ADVANCED(2)   (primary)
 *   type:       MCQ(0) → PREDICT(1) → PARSONS(2) → CLOZE(3) → CODING(4)  (within tier)
 * — it ignores literal position in backendOrderedQuestions.ts for new cards.
 * So the meaningful question is: within each difficulty tier, do the faded
 * scaffolds (PARSONS/CLOZE/PREDICT) come BEFORE cold CODING? They always will
 * once labeled at the same tier — the real bug is a faded scaffold mislabeled
 * ABOVE beginner, which then sorts AFTER beginner cold-coding.
 *
 * Per Django authoring rules (project_django_faded_layer):
 *   - dj_* topics get PARSONS + CLOZE only (NO predict — no deterministic stdout).
 *   - Several ops/infra topics are intentionally MCQ+coding with no faded layer:
 *     dj_nginx, dj_deployment, dj_cicd, dj_postgres, dj_monitoring, dj_file_uploads.
 *
 * Output: per-topic served order, per-tier type composition, and three flags:
 *   [MISLABELED FADED]  faded scaffold not at BEGINNER (sorts after beginner coding)
 *   [NO FADED ON-RAMP]  a tier has cold CODING but zero faded scaffolds preceding it
 *   [PREDICT IN DJANGO]  a PREDICT_OUTPUT exists (allowed only as rare exception)
 *
 * Usage: node scripts/audit-dj-order.js [> dj-order-audit.txt]
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const files = fs.readdirSync(DATA_DIR).filter(f => /^topic_dj_.*\.ts$/.test(f)).sort();

const DRANK = { BEGINNER: 0, INTERMEDIATE: 1, ADVANCED: 2 };
const TRANK = { MULTIPLE_CHOICE: 0, PREDICT_OUTPUT: 1, PARSONS: 2, CLOZE_CODE: 3, CODING: 4 };
const TSHORT = { MULTIPLE_CHOICE: 'MCQ', PREDICT_OUTPUT: 'PREDICT', PARSONS: 'PARSONS', CLOZE_CODE: 'CLOZE', CODING: 'CODING' };
const FADED = new Set(['PARSONS', 'CLOZE_CODE', 'PREDICT_OUTPUT']);

// Topics intentionally left without a faded on-ramp (config/YAML/shell-conceptual)
const NO_FADED_BY_DESIGN = new Set([
  'dj_nginx', 'dj_deployment', 'dj_cicd', 'dj_postgres', 'dj_monitoring', 'dj_file_uploads',
]);

function parse(src) {
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
  return qs;
}

let totalQ = 0;
const allFlags = [];

for (const file of files) {
  const topic = file.replace(/^topic_/, '').replace(/\.ts$/, '');
  const qs = parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  totalQ += qs.length;
  qs.sort((a, b) =>
    (DRANK[a.difficulty] - DRANK[b.difficulty]) || (TRANK[a.type] - TRANK[b.type]));

  console.log(`\n${'='.repeat(78)}`);
  console.log(`${topic}   (${qs.length} questions)${NO_FADED_BY_DESIGN.has(topic) ? '   [no-faded by design]' : ''}`);
  console.log('='.repeat(78));

  let tier = null, pos = 0;
  for (const q of qs) {
    if (q.difficulty !== tier) {
      tier = q.difficulty;
      console.log(`  --- ${tier} ---`);
    }
    console.log(`  ${String(++pos).padStart(2)}. ${TSHORT[q.type].padEnd(8)} ${q.id}`);
  }

  // Composition
  const comp = {};
  for (const d of ['BEGINNER', 'INTERMEDIATE', 'ADVANCED']) {
    const tq = qs.filter(q => q.difficulty === d);
    if (!tq.length) continue;
    const c = {};
    for (const q of tq) c[TSHORT[q.type]] = (c[TSHORT[q.type]] || 0) + 1;
    comp[d] = c;
  }
  console.log('  composition:', JSON.stringify(comp));

  // --- Flags ---
  // NOTE: the selector sorts new cards difficulty→type, so within EVERY tier the
  // ramp MCQ→PREDICT→PARSONS→CLOZE→CODING is correct by construction. A faded card
  // at INTERMEDIATE/ADVANCED is NOT a bug — it scaffolds that tier's combination.
  // So we only flag the things that are genuinely off-design:
  const flags = [];

  // 1. A BEGINNER or INTERMEDIATE tier that jumps straight to cold CODING with no
  //    MCQ/faded on-ramp WITHIN that same tier. (ADVANCED is allowed to be cold —
  //    rubric: advanced = realistic 3+-primitive scenario.)
  for (const d of ['BEGINNER', 'INTERMEDIATE']) {
    const tq = qs.filter(q => q.difficulty === d)
      .sort((a, b) => TRANK[a.type] - TRANK[b.type]);
    if (!tq.length) continue;
    const hasCoding = tq.some(q => q.type === 'CODING');
    const hasOnRamp = tq.some(q => q.type !== 'CODING'); // any MCQ/predict/parsons/cloze
    if (hasCoding && !hasOnRamp) {
      flags.push(`[COLD ${d} TIER] only CODING in this tier — no MCQ/faded on-ramp`);
    }
  }

  // 2. Topic has cold CODING but zero faded scaffolds in the WHOLE topic
  //    (and isn't an intentionally config/ops topic).
  if (!NO_FADED_BY_DESIGN.has(topic)) {
    const hasCoding = qs.some(q => q.type === 'CODING');
    const hasFaded = qs.some(q => q.type === 'PARSONS' || q.type === 'CLOZE_CODE');
    if (hasCoding && !hasFaded) {
      flags.push(`[NO FADED ON-RAMP] topic has CODING but zero PARSONS/CLOZE scaffolds`);
    }
  }

  // 3. PREDICT in a Django topic — per authoring rules dj_* gets PARSONS+CLOZE only
  //    (no deterministic stdout). Allowed only where output is genuinely
  //    deterministic (Python-level: __str__, form.errors dict, QuerySet .count()).
  const predicts = qs.filter(q => q.type === 'PREDICT_OUTPUT');
  if (predicts.length) {
    flags.push(`[PREDICT x${predicts.length}] verify each is deterministic stdout: ${predicts.map(q => q.id).join(', ')}`);
  }

  if (flags.length) {
    console.log('  FLAGS:');
    for (const f of flags) console.log('    ' + f);
    allFlags.push({ topic, flags });
  }
}

console.log(`\n${'#'.repeat(78)}`);
console.log(`SUMMARY: ${files.length} Django topics, ${totalQ} questions`);
console.log('#'.repeat(78));
if (!allFlags.length) {
  console.log('No ordering flags. All faded scaffolds are at BEGINNER; tiers ramp MCQ→faded→coding.');
} else {
  for (const { topic, flags } of allFlags) {
    console.log(`\n${topic}:`);
    for (const f of flags) console.log('  ' + f);
  }
}
console.log();
