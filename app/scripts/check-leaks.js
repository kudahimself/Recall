#!/usr/bin/env node
/**
 * Scans every coding question in src/data/*.ts and flags those whose
 * starterCode contains too much of the solution.
 *
 * Metric: strip whitespace and # comments from both starterCode and solution,
 * then compute starter_stripped.length / solution_stripped.length. A clean,
 * comment-only starter strips to near-zero. A leak leaves most of the answer.
 *
 * Thresholds:
 *   ratio >= 0.70  → HIGH   (starter is basically the solution)
 *   ratio >= 0.40  → MEDIUM (major scaffolding)
 *   ratio >= 0.20  → LOW    (noticeable scaffolding)
 *   below          → CLEAN
 *
 * Usage: node scripts/check-leaks.js
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

function stripNoise(src) {
  return src
    .split(/\r?\n/)
    .map(line => line.replace(/#.*$/, '').replace(/\/\/.*$/, '').replace(/--.*$/, ''))
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/"""[\s\S]*?"""/g, '')
    .replace(/'''[\s\S]*?'''/g, '')
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

function extractQuestions(src) {
  // Find every `id: '...'` then walk forward capturing starterCode and solution
  // until we hit the next `id:` or the closing `}` of the object.
  const results = [];
  const idRe = /id:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = idRe.exec(src))) {
    const id = m[1];
    const start = m.index;
    const nextId = idRe.lastIndex;
    // Search window = everything from this id up to the next id (or +4000 chars)
    const windowEnd = src.indexOf('id:', nextId);
    const chunk = src.slice(start, windowEnd === -1 ? start + 6000 : windowEnd);
    const starter = extractField(chunk, 'starterCode');
    const solution = extractField(chunk, 'solution');
    if (starter !== null && solution !== null) {
      results.push({ id, starter, solution });
    }
  }
  return results;
}

function extractField(chunk, name) {
  const re = new RegExp(`${name}:\\s*`, 'g');
  const m = re.exec(chunk);
  if (!m) return null;
  let i = m.index + m[0].length;
  // Skip whitespace
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

// Ignore tiny questions — short SQL/HTML answers trivially have high ratios
// because there's barely any room between "empty scaffold" and "the answer".
const MIN_SOLUTION_CHARS = 80;

function severity(ratio, solutionChars) {
  if (solutionChars < MIN_SOLUTION_CHARS) return null;
  if (ratio >= 0.70) return 'HIGH';
  if (ratio >= 0.40) return 'MEDIUM';
  if (ratio >= 0.20) return 'LOW';
  return null;
}

const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.ts'));
const leaks = [];

for (const file of files) {
  const src = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
  const questions = extractQuestions(src);
  for (const q of questions) {
    const starterStripped = stripNoise(q.starter);
    const solutionStripped = stripNoise(q.solution);
    if (solutionStripped.length === 0) continue;
    const ratio = starterStripped.length / solutionStripped.length;
    const sev = severity(ratio, solutionStripped.length);
    if (sev) {
      leaks.push({
        file,
        id: q.id,
        ratio: ratio.toFixed(2),
        starterChars: starterStripped.length,
        solutionChars: solutionStripped.length,
        severity: sev,
      });
    }
  }
}

leaks.sort((a, b) => {
  const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
  if (order[a.severity] !== order[b.severity]) return order[a.severity] - order[b.severity];
  return parseFloat(b.ratio) - parseFloat(a.ratio);
});

if (leaks.length === 0) {
  console.log('No leaks detected.');
  process.exit(0);
}

console.log(`Found ${leaks.length} potentially leaky questions:\n`);
for (const l of leaks) {
  console.log(
    `[${l.severity}] ${l.id.padEnd(30)} ratio=${l.ratio}  (${l.starterChars}/${l.solutionChars})  ${l.file}`,
  );
}

const counts = leaks.reduce((acc, l) => ({ ...acc, [l.severity]: (acc[l.severity] || 0) + 1 }), {});
console.log(`\nSummary: HIGH=${counts.HIGH || 0}  MEDIUM=${counts.MEDIUM || 0}  LOW=${counts.LOW || 0}`);
