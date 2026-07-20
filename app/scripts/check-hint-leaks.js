#!/usr/bin/env node
/**
 * Scans every coding question in src/data/*.ts that has a `tieredHints` block
 * and flags Tier 2 skeletons that leak too much of the solution.
 *
 * A skeleton must genuinely omit load-bearing tokens (cloze-style). Two checks:
 *   1. Blank floor: at least MIN_BLANKS `____` markers.
 *   2. Retention ratio: strip the blanks, whitespace, and comments from both the
 *      skeleton and the solution, then compute skeleton_stripped.length /
 *      solution_stripped.length. A skeleton that keeps most of the solution's
 *      substance barely blanked anything.
 *
 * Thresholds (retention ratio):
 *   ratio >= 0.80  → HIGH   (skeleton is nearly the whole solution)
 *   ratio >= 0.65  → MEDIUM (thin blanking)
 *   below + enough blanks → CLEAN
 *
 * Usage: node scripts/check-hint-leaks.js
 * Exit code 1 if any HIGH finding or any skeleton under the blank floor.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const MIN_BLANKS = 3;
const BLANK_RE = /_{3,}/g;

function stripNoise(src) {
  return src
    .split(/\r?\n/)
    .map(line => line.replace(/#.*$/, '').replace(/\/\/.*$/, '').replace(/--.*$/, ''))
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/"""[\s\S]*?"""/g, '')
    .replace(/'''[\s\S]*?'''/g, '')
    // Empty the bodies of PLAIN string literals (the question's given input data,
    // shared verbatim by skeleton and solution). Raw / f / b strings are kept -
    // they carry the regex pattern and interpolated code that the skeleton blanks,
    // so they must still count toward what the skeleton omits.
    .replace(/(?<![rRbBfF])"(?:[^"\\]|\\.)*"/g, '""')
    .replace(/(?<![rRbBfF])'(?:[^'\\]|\\.)*'/g, "''")
    .replace(/_{3,}/g, '')
    .replace(/\s+/g, '');
}

// Match a balanced template literal starting at index i (expects src[i] === '`')
function readTemplateLiteral(src, i) {
  if (src[i] !== '`') return null;
  let j = i + 1;
  while (j < src.length) {
    const c = src[j];
    if (c === '\\') { j += 2; continue; }
    if (c === '`') return { body: src.slice(i + 1, j), end: j + 1 };
    j++;
  }
  return null;
}

function extractField(chunk, name) {
  const re = new RegExp(`${name}:\\s*`, 'g');
  const m = re.exec(chunk);
  if (!m) return null;
  let i = m.index + m[0].length;
  while (i < chunk.length && /\s/.test(chunk[i])) i++;
  if (chunk[i] === '`') {
    const lit = readTemplateLiteral(chunk, i);
    return lit ? lit.body : null;
  }
  if (chunk[i] === "'" || chunk[i] === '"') {
    const quote = chunk[i];
    let j = i + 1;
    while (j < chunk.length) {
      if (chunk[j] === '\\') { j += 2; continue; }
      if (chunk[j] === quote) return chunk.slice(i + 1, j);
      j++;
    }
  }
  return null;
}

function extractQuestions(src) {
  const results = [];
  const idRe = /id:\s*['"]([^'"]+)['"]/g;
  // Collect all question-id boundaries up front (using the same quoted
  // `id: '...'` pattern used to find them) so a bare `id:` substring inside
  // a solution/skeleton body - e.g. `id: Date.now()` - can't be mistaken for
  // the next question's boundary and truncate the current chunk early.
  const boundaries = [];
  let m;
  while ((m = idRe.exec(src))) {
    boundaries.push({ id: m[1], start: m.index });
  }
  for (let k = 0; k < boundaries.length; k++) {
    const { id, start } = boundaries[k];
    const windowEnd = k + 1 < boundaries.length ? boundaries[k + 1].start : start + 8000;
    const chunk = src.slice(start, windowEnd);
    // Only questions carrying a tieredHints block are in scope.
    if (!/tieredHints:/.test(chunk)) continue;
    const skeleton = extractField(chunk, 'skeleton');
    const solution = extractField(chunk, 'solution');
    if (skeleton !== null && solution !== null) {
      results.push({ id, skeleton, solution });
    }
  }
  return results;
}

function severity(ratio) {
  if (ratio >= 0.80) return 'HIGH';
  if (ratio >= 0.65) return 'MEDIUM';
  return null;
}

const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.ts'));
const findings = [];

for (const file of files) {
  const src = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
  const questions = extractQuestions(src);
  for (const q of questions) {
    const blanks = (q.skeleton.match(BLANK_RE) || []).length;
    const skeletonStripped = stripNoise(q.skeleton);
    const solutionStripped = stripNoise(q.solution);
    if (solutionStripped.length === 0) continue;
    const ratio = skeletonStripped.length / solutionStripped.length;

    if (blanks < MIN_BLANKS) {
      findings.push({ file, id: q.id, kind: 'FEW-BLANKS', detail: `${blanks} blanks (min ${MIN_BLANKS})`, fail: true });
    }
    const sev = severity(ratio);
    if (sev) {
      findings.push({ file, id: q.id, kind: sev, detail: `retention=${ratio.toFixed(2)}`, fail: sev === 'HIGH' });
    }
  }
}

if (findings.length === 0) {
  console.log('No hint leaks detected.');
  process.exit(0);
}

console.log(`Found ${findings.length} hint issues:\n`);
for (const f of findings) {
  console.log(`[${f.kind}] ${f.id.padEnd(30)} ${f.detail}  ${f.file}`);
}

const anyFail = findings.some(f => f.fail);
process.exit(anyFail ? 1 : 0);
