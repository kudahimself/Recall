#!/usr/bin/env node
/**
 * Scans every coding question in src/data/*.ts and flags starterCode that hands
 * the learner too much of the solution.
 *
 * Two leak shapes exist, one per authoring style, so the detector auto-routes
 * per question based on whether the starter is comment-only:
 *
 *   Lane A — COMMENTED-SOLUTION (SQL course pattern)
 *     The starter is entirely comments (every line is --/#//), and those
 *     comments, once uncommented, reproduce the solution:
 *       starterCode: `-- SELECT Email, LEN(TRIM(Email)) AS EmailLength FROM stg.Customer;`
 *     check-leaks used to strip comments FIRST, see an empty starter, and call
 *     it clean — blind by design. Lane A instead uncomments and measures how
 *     many of the solution's essential tokens the starter reveals (recall).
 *     Intent-prose comments ("-- filter orders older than 30 days") share few
 *     tokens with the solution and score low, so they pass.
 *
 *   Lane B — CODE SCAFFOLDING (Web Dev / Next.js / Python pattern)
 *     The starter is real code (imports, signatures, JSX shells) with occasional
 *     `// your code here` guidance. The leak, if any, lives in the non-comment
 *     code, so we strip comments and compare stripped char-length to the
 *     solution. Uncommenting here would false-positive on legit guidance
 *     comments — which is exactly why routing matters.
 *
 * Thresholds:
 *   Lane A (token recall):   >= 0.80 HIGH, >= 0.55 MEDIUM
 *   Lane B (char ratio):     >= 0.70 HIGH, >= 0.40 MEDIUM, >= 0.20 LOW
 *
 * Usage: node scripts/check-leaks.js
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

// Remove comments AND whitespace — used to measure "how much real code is here".
function stripNoise(src) {
  return stripComments(src).replace(/\s+/g, '');
}

// Remove comment markers + their text, keep everything else. Handles SQL (--),
// C-style (// and /* */), and Python/shell (#) comments.
function stripComments(src) {
  return src
    .split(/\r?\n/)
    .map(line => line.replace(/--.*$/, '').replace(/\/\/.*$/, '').replace(/#.*$/, ''))
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/"""[\s\S]*?"""/g, '')
    .replace(/'''[\s\S]*?'''/g, '');
}

// Uncomment: strip only the comment MARKERS, keeping the prose/code that was
// commented out. This is what turns a "-- SELECT ..." starter back into code
// so Lane A can compare it against the solution.
function uncomment(src) {
  return src
    .split(/\r?\n/)
    .map(l => l.trim().replace(/^(--|\/\/|#)\s?/, ''))
    .filter(Boolean)
    .join('\n')
    .replace(/\/\*|\*\//g, '');
}

// A few pervasive English words that show up in intent-prose comments but carry
// no solution signal. Deliberately tiny: SQL keywords (SELECT, FROM, WHERE) and
// function names ARE the answer in the SQL course, so they must stay as signal.
const STOPWORDS = new Set([
  'the', 'a', 'an', 'to', 'of', 'and', 'or', 'for', 'with', 'as',
  'return', 'each', 'per', 'that', 'this', 'your', 'here', 'code',
]);

// Solutions may hold several acceptable forms separated by `-- OR` / `# OR`.
// A verbatim starter only needs to match one of them.
function splitAlternatives(solution) {
  return solution.split(/\n\s*(?:--|#)\s*OR\s*\n/i).map(s => s.trim()).filter(Boolean);
}

function essentialTokens(code) {
  const raw = code.match(/[A-Za-z_][A-Za-z0-9_]*/g) || [];
  return new Set(
    raw
      .map(t => t.toLowerCase())
      .filter(t => t.length > 1 && !STOPWORDS.has(t)),
  );
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
  const results = [];
  const idRe = /id:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = idRe.exec(src))) {
    const id = m[1];
    const start = m.index;
    const nextId = idRe.lastIndex;
    const windowEnd = src.indexOf('id:', nextId);
    const chunk = src.slice(start, windowEnd === -1 ? start + 6000 : windowEnd);
    if (!/type:\s*QuestionType\.CODING/.test(chunk)) continue;
    const starter = extractField(chunk, 'starterCode');
    const solution = extractField(chunk, 'solution');
    const prompt = extractField(chunk, 'question') || '';
    if (starter !== null && solution !== null) {
      results.push({ id, starter, solution, prompt });
    }
  }
  return results;
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

// Ignore tiny questions — short answers trivially have high ratios because
// there's barely any room between "empty scaffold" and "the answer".
const MIN_SOLUTION_CHARS = 80;
// Lane A needs enough uncommented content to be a real leak, not a stray word.
const MIN_UNCOMMENT_CHARS = 25;

function laneBSeverity(ratio, solutionChars) {
  if (solutionChars < MIN_SOLUTION_CHARS) return null;
  if (ratio >= 0.70) return 'HIGH';
  if (ratio >= 0.40) return 'MEDIUM';
  if (ratio >= 0.20) return 'LOW';
  return null;
}

function laneASeverity(recall) {
  if (recall >= 0.80) return 'HIGH';
  if (recall >= 0.55) return 'MEDIUM';
  return null;
}

const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.ts'));
const leaks = [];

for (const file of files) {
  const src = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
  const questions = extractQuestions(src);
  for (const q of questions) {
    const solutionStripped = stripNoise(q.solution);
    if (solutionStripped.length === 0 || solutionStripped.length < MIN_SOLUTION_CHARS) continue;

    const starterCodeOnly = stripNoise(q.starter);

    if (starterCodeOnly.length === 0) {
      // ── Lane A: comment-only starter → the "just uncomment it" anti-pattern ──
      const revealed = uncomment(q.starter);
      if (revealed.length < MIN_UNCOMMENT_CHARS) continue;
      const normStarter = revealed.replace(/\s+/g, '').toLowerCase();

      // Primary signal: the uncommented starter contains a solution (or one of
      // its `-- OR` / `# OR` alternatives) nearly verbatim. This is precise —
      // it fires on dt-1 (starter IS the query) but not on a "rewrite this
      // anti-pattern" starter, whose commented code differs from the solution.
      let verbatim = false;
      for (const alt of splitAlternatives(q.solution)) {
        const normAlt = stripNoise(alt).toLowerCase();
        if (normAlt.length >= 40 && normStarter.includes(normAlt)) { verbatim = true; break; }
      }

      if (verbatim) {
        leaks.push({ file, id: q.id, lane: 'A', severity: 'HIGH', metric: 'verbatim-solution' });
        continue;
      }

      // Secondary: reworded partial reveal. Score only the solution tokens the
      // PROMPT didn't already hand over — tables/columns/target names are given
      // context, so restating them isn't a leak.
      const promptTokens = essentialTokens(q.prompt);
      const solTokens = [...essentialTokens(q.solution)].filter(t => !promptTokens.has(t));
      if (solTokens.length < 3) continue;
      const starterTokens = essentialTokens(revealed);
      let hit = 0;
      for (const t of solTokens) if (starterTokens.has(t)) hit++;
      const recall = hit / solTokens.length;
      const sev = laneASeverity(recall);
      if (sev) {
        leaks.push({ file, id: q.id, lane: 'A', severity: sev, metric: `recall=${recall.toFixed(2)}` });
      }
    } else {
      // ── Lane B: real-code scaffolding → stripped char ratio ──
      const ratio = starterCodeOnly.length / solutionStripped.length;
      const sev = laneBSeverity(ratio, solutionStripped.length);
      if (sev) {
        leaks.push({
          file, id: q.id, lane: 'B', severity: sev,
          metric: `ratio=${ratio.toFixed(2)} (${starterCodeOnly.length}/${solutionStripped.length})`,
        });
      }
    }
  }
}

const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
leaks.sort((a, b) => order[a.severity] - order[b.severity] || a.file.localeCompare(b.file));

if (leaks.length === 0) {
  console.log('No leaks detected.');
  process.exit(0);
}

console.log(`Found ${leaks.length} potentially leaky questions:\n`);
for (const l of leaks) {
  console.log(`[${l.severity.padEnd(6)}] lane ${l.lane}  ${l.id.padEnd(30)} ${l.metric.padEnd(28)} ${l.file}`);
}

const counts = leaks.reduce((acc, l) => ({ ...acc, [l.severity]: (acc[l.severity] || 0) + 1 }), {});
console.log(`\nSummary: HIGH=${counts.HIGH || 0}  MEDIUM=${counts.MEDIUM || 0}  LOW=${counts.LOW || 0}`);
