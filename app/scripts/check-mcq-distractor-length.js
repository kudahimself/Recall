#!/usr/bin/env node
/**
 * Scans every multiple-choice question in src/data/*.ts and flags those
 * where the correct answer is substantially longer than the distractors —
 * the "pick the longest option = correct" antipattern that lets users
 * answer without engaging with the concept.
 *
 * Metrics per question (lengths in characters of the option text):
 *   maxRatio  = correct.length / max(distractor.length)
 *   meanRatio = correct.length / mean(distractor.length)
 *
 * Severity:
 *   maxRatio >= 2.5  → HIGH    (correct dwarfs every distractor)
 *   maxRatio >= 1.8  → MEDIUM  (correct clearly stands out)
 *   maxRatio >= 1.4  → LOW     (noticeable edge, gameable)
 *   below            → CLEAN
 *
 * Ignores tiny-option questions (max option text < 40 chars) — those are
 * legitimate one-word answers where length parity isn't meaningful.
 *
 * Also reports per-file positional bias: what % of correct answers sit at
 * each letter (a/b/c/d). Healthy is roughly 25% each; >40% at one letter
 * means the user can guess by position alone.
 *
 * Usage:
 *   node scripts/check-mcq-distractor-length.js              # all data files
 *   node scripts/check-mcq-distractor-length.js dataEng      # only files matching substring
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const filter = process.argv[2] || '';

// ---------- string-literal walker (handles ', ", and ` with escapes) ----------

function readString(src, i) {
  const quote = src[i];
  if (quote !== "'" && quote !== '"' && quote !== '`') return null;
  let j = i + 1;
  let out = '';
  while (j < src.length) {
    const c = src[j];
    if (c === '\\') {
      const next = src[j + 1];
      // unescape common forms; preserve the literal char for length purposes
      if (next === 'n') out += '\n';
      else if (next === 't') out += '\t';
      else if (next === 'r') out += '\r';
      else out += next;
      j += 2;
      continue;
    }
    if (c === quote) return { value: out, end: j + 1 };
    // template literal interpolation — skip the ${...} block but count it as one char
    if (quote === '`' && c === '$' && src[j + 1] === '{') {
      let depth = 1;
      let k = j + 2;
      while (k < src.length && depth > 0) {
        if (src[k] === '{') depth++;
        else if (src[k] === '}') depth--;
        k++;
      }
      out += '${...}';
      j = k;
      continue;
    }
    out += c;
    j++;
  }
  return null;
}

// ---------- options-array extractor ----------

// Given source starting just after `options:`, walk the array and pull each
// { id: '...', text: '...', isCorrect: true/false } object's text + correctness.
function extractOptions(src, start) {
  let i = start;
  // skip whitespace
  while (i < src.length && /\s/.test(src[i])) i++;
  if (src[i] !== '[') return null;
  i++;

  const options = [];
  while (i < src.length) {
    while (i < src.length && /\s/.test(src[i])) i++;
    if (src[i] === ']') return { options, end: i + 1 };
    if (src[i] !== '{') return null;

    // walk one object
    const objStart = i;
    let depth = 1;
    let j = i + 1;
    while (j < src.length && depth > 0) {
      const c = src[j];
      if (c === "'" || c === '"' || c === '`') {
        const s = readString(src, j);
        if (!s) return null;
        j = s.end;
        continue;
      }
      if (c === '{') depth++;
      else if (c === '}') depth--;
      j++;
    }
    const objSrc = src.slice(objStart, j);
    options.push(parseOptionObject(objSrc));
    i = j;
    while (i < src.length && /\s/.test(src[i])) i++;
    if (src[i] === ',') i++;
  }
  return null;
}

function parseOptionObject(objSrc) {
  // Find id:, text:, isCorrect: — text can be in any quote style.
  const out = { id: null, text: '', isCorrect: false };

  const idMatch = /id:\s*(['"`])([^'"`]*)\1/.exec(objSrc);
  if (idMatch) out.id = idMatch[2];

  const textKey = /text:\s*/.exec(objSrc);
  if (textKey) {
    const startIdx = textKey.index + textKey[0].length;
    let i = startIdx;
    while (i < objSrc.length && /\s/.test(objSrc[i])) i++;
    const s = readString(objSrc, i);
    if (s) out.text = s.value;
  }

  const correctMatch = /isCorrect:\s*(true|false)/.exec(objSrc);
  if (correctMatch) out.isCorrect = correctMatch[1] === 'true';

  return out;
}

// ---------- question walker ----------

function extractMcqQuestions(src) {
  const results = [];
  const idRe = /id:\s*['"`]([^'"`]+)['"`]/g;
  let m;
  while ((m = idRe.exec(src))) {
    const id = m[1];
    const start = m.index;
    const lookahead = src.slice(start, start + 8000);
    const optionsKey = /options:\s*\[/.exec(lookahead);
    if (!optionsKey) continue;
    // Reject if the next `id:` lands before `options:` (means this question has no options field)
    const nextId = lookahead.slice(2).search(/id:\s*['"`]/) + 2;
    if (nextId > 1 && nextId < optionsKey.index) continue;

    const optStart = start + optionsKey.index + optionsKey[0].length - 1; // points at '['
    const parsed = extractOptions(src, optStart);
    if (!parsed) continue;
    if (parsed.options.length < 2) continue;
    results.push({ id, options: parsed.options });
  }
  return results;
}

// ---------- analysis ----------

function severity(maxRatio, maxOptionLen) {
  if (maxOptionLen < 40) return null; // skip trivially short options
  if (maxRatio >= 2.5) return 'HIGH';
  if (maxRatio >= 1.8) return 'MEDIUM';
  if (maxRatio >= 1.4) return 'LOW';
  return null;
}

const files = fs
  .readdirSync(DATA_DIR)
  .filter((f) => f.endsWith('.ts'))
  .filter((f) => f.includes(filter));

const findings = [];
const positionByFile = {}; // file → { a, b, c, d, total }

for (const file of files) {
  const src = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
  const questions = extractMcqQuestions(src);
  if (questions.length === 0) continue;

  positionByFile[file] = { a: 0, b: 0, c: 0, d: 0, other: 0, total: 0 };

  for (const q of questions) {
    const correct = q.options.find((o) => o.isCorrect);
    const distractors = q.options.filter((o) => !o.isCorrect);
    if (!correct || distractors.length === 0) continue;

    const correctLen = correct.text.length;
    const distractorLens = distractors.map((d) => d.text.length);
    const maxDistractorLen = Math.max(...distractorLens);
    const meanDistractorLen = distractorLens.reduce((a, b) => a + b, 0) / distractorLens.length;
    const maxOptionLen = Math.max(correctLen, maxDistractorLen);

    const maxRatio = maxDistractorLen === 0 ? Infinity : correctLen / maxDistractorLen;
    const meanRatio = meanDistractorLen === 0 ? Infinity : correctLen / meanDistractorLen;

    // positional bias bookkeeping
    const stats = positionByFile[file];
    stats.total++;
    const letter = (correct.id || '').toLowerCase();
    if (letter in stats) stats[letter]++;
    else stats.other++;

    const sev = severity(maxRatio, maxOptionLen);
    if (sev) {
      findings.push({
        file,
        id: q.id,
        severity: sev,
        correctId: correct.id,
        correctLen,
        maxDistractorLen,
        meanDistractorLen: Math.round(meanDistractorLen),
        maxRatio: maxRatio.toFixed(2),
        meanRatio: meanRatio.toFixed(2),
      });
    }
  }
}

// ---------- report ----------

findings.sort((a, b) => {
  const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
  if (order[a.severity] !== order[b.severity]) return order[a.severity] - order[b.severity];
  return parseFloat(b.maxRatio) - parseFloat(a.maxRatio);
});

if (findings.length === 0) {
  console.log('No length-parity issues detected.');
} else {
  console.log(`Found ${findings.length} questions where the correct answer is substantially longer than its distractors.\n`);
  console.log('Format: [SEV] id  correct=<letter>  correctLen/maxDistractorLen=ratio  (file)\n');
  for (const f of findings) {
    console.log(
      `[${f.severity.padEnd(6)}] ${f.id.padEnd(28)} correct=${f.correctId}  ${String(f.correctLen).padStart(4)}/${String(f.maxDistractorLen).padStart(3)}=${f.maxRatio.padStart(5)}  (mean ratio ${f.meanRatio})  ${f.file}`,
    );
  }
  const counts = findings.reduce((acc, f) => ({ ...acc, [f.severity]: (acc[f.severity] || 0) + 1 }), {});
  console.log(`\nLength parity summary: HIGH=${counts.HIGH || 0}  MEDIUM=${counts.MEDIUM || 0}  LOW=${counts.LOW || 0}`);
}

console.log('\n--- Positional bias (% of correct answers per letter, per file) ---\n');
const fileNames = Object.keys(positionByFile).sort();
let biasFlagged = 0;
for (const file of fileNames) {
  const s = positionByFile[file];
  if (s.total < 5) continue;
  const pct = (n) => ((n / s.total) * 100).toFixed(0).padStart(3);
  const max = Math.max(s.a, s.b, s.c, s.d) / s.total;
  const flag = max > 0.4 ? '  ⚠ skewed' : '';
  if (flag) biasFlagged++;
  console.log(`${file.padEnd(48)} n=${String(s.total).padStart(3)}  a=${pct(s.a)}%  b=${pct(s.b)}%  c=${pct(s.c)}%  d=${pct(s.d)}%${flag}`);
}
if (biasFlagged > 0) {
  console.log(`\n${biasFlagged} file(s) have one letter holding >40% of correct answers — vary the position when authoring.`);
}
