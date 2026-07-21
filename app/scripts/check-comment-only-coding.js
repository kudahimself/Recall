#!/usr/bin/env node
/**
 * check-comment-only-coding.js
 *
 * Flags CODING questions whose `solution` is (almost) entirely COMMENTS.
 *
 * Why this matters: codeValidator.ts strips comments/whitespace from both the
 * user's code and the solution before comparing. If the solution is all comments
 * it normalizes to the empty string, so the validator's token-set match passes
 * for ANY input — the card is ungraded ("type anything, always correct"). These
 * are also almost always the "prompt restates the answer" anti-pattern, where the
 * shell commands / config are spelled out in the prompt and starter.
 *
 * This is the gap NEITHER existing script catches:
 *   - check-leaks.js strips comments first, so a comment-only solution looks like
 *     a tiny solution (ratio noise), not a leak.
 *   - check-leaks.js lane A only compares STARTER comments to SOLUTION code.
 *
 * Metric: strip # / // / -- line comments, /* *​/ and ''' """ blocks, and all
 * whitespace from `solution`. Report the residual "real code" length.
 *   residual == 0            → DEAD     (un-gradeable: validator accepts anything)
 *   residual < 15 chars      → NEAR-DEAD (only a token or two of real code)
 *
 * Usage: node scripts/check-comment-only-coding.js
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

function readTemplateLiteral(src, i) {
  if (src[i] !== '`') return null;
  let j = i + 1;
  while (j < src.length) {
    if (src[j] === '\\') { j += 2; continue; }
    if (src[j] === '`') return { body: src.slice(i + 1, j), end: j + 1 };
    j++;
  }
  return null;
}

function extractField(chunk, name) {
  const re = new RegExp(`(^|[\\s,{])${name}:\\s*`, 'g');
  const m = re.exec(chunk);
  if (!m) return null;
  let i = m.index + m[0].length;
  while (i < chunk.length && /\s/.test(chunk[i])) i++;
  if (chunk[i] === '`') { const lit = readTemplateLiteral(chunk, i); return lit ? lit.body : null; }
  if (chunk[i] === "'" || chunk[i] === '"') {
    const q = chunk[i]; let j = i + 1;
    while (j < chunk.length) { if (chunk[j] === '\\') { j += 2; continue; } if (chunk[j] === q) return chunk.slice(i + 1, j); j++; }
  }
  return null;
}

// Residual real-code length after removing comments + whitespace (mirrors validator intent).
// IMPORTANT: solutions are often single-line template literals using ESCAPED \n, so we must
// un-escape first — otherwise a leading `// file.tsx` / `# file.py` comment wipes the whole
// (apparently single) line and real code below it is mistaken for "all comments".
function residualCode(raw) {
  const src = raw
    .replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\\\/g, '\\');
  return src
    .split(/\r?\n/)
    .map(l => l.replace(/#.*$/, '').replace(/\/\/.*$/, '').replace(/--.*$/, ''))
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/"""[\s\S]*?"""/g, '')
    .replace(/'''[\s\S]*?'''/g, '')
    .replace(/\s+/g, '');
}

const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.ts'));
const findings = [];

for (const file of files) {
  const src = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
  const idRe = /id:\s*'([^']+)'/g;
  const ids = [];
  let m;
  while ((m = idRe.exec(src))) ids.push({ id: m[1], i: m.index });
  for (let k = 0; k < ids.length; k++) {
    const chunk = src.slice(ids[k].i, k + 1 < ids.length ? ids[k + 1].i : src.length);
    if (!/type:\s*QuestionType\.CODING/.test(chunk)) continue;
    const solution = extractField(chunk, 'solution');
    if (solution === null) continue;
    const residual = residualCode(solution);
    if (residual.length === 0) findings.push({ file, id: ids[k].id, residual: 0, tier: 'DEAD' });
    else if (residual.length < 15) findings.push({ file, id: ids[k].id, residual: residual.length, tier: 'NEAR-DEAD' });
  }
}

findings.sort((a, b) => (a.tier === b.tier ? a.id.localeCompare(b.id) : a.tier === 'DEAD' ? -1 : 1));

if (!findings.length) { console.log('No comment-only / un-gradeable CODING questions found.'); process.exit(0); }

console.log(`Found ${findings.length} CODING questions with comment-only / near-empty solutions:\n`);
for (const f of findings) {
  console.log(`[${f.tier.padEnd(9)}] ${f.id.padEnd(36)} residual=${f.residual}  ${f.file}`);
}
const dead = findings.filter(f => f.tier === 'DEAD').length;
console.log(`\nSummary: DEAD=${dead}  NEAR-DEAD=${findings.length - dead}`);
