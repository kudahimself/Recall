#!/usr/bin/env node
/**
 * Scans every coding question in src/data/*.ts and flags those whose
 * `question` prompt text contains operational code snippets that give away
 * the solution (e.g. `Counter(s)`, `c.most_common(3)`, `@dataclass`,
 * `field(default_factory=list)`).
 *
 * Works by extracting backticked segments from the prompt and scoring each:
 *   +3  decorator          `@foo` / `@foo(args)`
 *   +3  def / class / lambda declaration
 *   +2  function call with non-empty args   `foo(x)` / `obj.method(x)`
 *   +2  assignment (= but not == / <= / >=)
 *   +2  type annotation with a concrete type  `x: list[int]`
 *   +2  `field(...)` / `TypeVar(...)` / `Generic[...]` etc.
 *
 * Benign segments score 0 (pure identifier, string literal, number, URL,
 * path, data literal like `[1, 2, 3]` or `{'a': 1}`).
 *
 * Per-question score = sum over backticked segments.
 * Thresholds:
 *   score >= 10 → HIGH    (prompt is a walkthrough of the solution)
 *   score >=  6 → MEDIUM  (multiple code snippets in the prompt)
 *   score >=  3 → LOW     (at least one clearly-code snippet)
 *
 * Usage: node scripts/check-prompt-leaks.js
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

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

function readQuotedString(src, i) {
  const quote = src[i];
  if (quote !== "'" && quote !== '"') return null;
  let j = i + 1;
  while (j < src.length) {
    if (src[j] === '\\') { j += 2; continue; }
    if (src[j] === quote) return { body: src.slice(i + 1, j), end: j + 1 };
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
  if (chunk[i] === '`') {
    const lit = readTemplateLiteral(chunk, i);
    return lit ? unescapeJsString(lit.body) : null;
  }
  if (chunk[i] === "'" || chunk[i] === '"') {
    const q = readQuotedString(chunk, i);
    return q ? unescapeJsString(q.body) : null;
  }
  return null;
}

// Translate JS-escaped chars back (enough for our audit purposes)
function unescapeJsString(s) {
  return s
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\\\/g, '\\');
}

function extractCodingQuestions(src) {
  // Split the source on `id: '...'` boundaries. Each chunk begins with the id
  // and runs to the start of the next id (or end of file).
  const results = [];
  const idRe = /id:\s*['"]([^'"]+)['"]/g;
  const ids = [];
  let m;
  while ((m = idRe.exec(src))) ids.push({ id: m[1], index: m.index });
  for (let i = 0; i < ids.length; i++) {
    const start = ids[i].index;
    const end = i + 1 < ids.length ? ids[i + 1].index : src.length;
    const chunk = src.slice(start, end);
    if (!/type:\s*QuestionType\.CODING/.test(chunk)) continue;
    const question = extractField(chunk, 'question');
    if (!question) continue;
    // Pull all expectedOutput values (may be multiple test cases) so we can
    // skip backticked segments that are actually test spec, not code.
    const expectedOutputs = [];
    const eoRe = /expectedOutput:\s*/g;
    let em;
    while ((em = eoRe.exec(chunk))) {
      let j = em.index + em[0].length;
      while (j < chunk.length && /\s/.test(chunk[j])) j++;
      let val = null;
      if (chunk[j] === '`') {
        const lit = readTemplateLiteral(chunk, j);
        if (lit) val = unescapeJsString(lit.body);
      } else if (chunk[j] === "'" || chunk[j] === '"') {
        const q = readQuotedString(chunk, j);
        if (q) val = unescapeJsString(q.body);
      }
      if (val) expectedOutputs.push(val);
    }
    results.push({ id: ids[i].id, question, expectedOutputs });
  }
  return results;
}

// Pull out all backticked segments from a prompt
function extractBackticks(text) {
  const segments = [];
  const re = /`([^`]+)`/g;
  let m;
  while ((m = re.exec(text))) segments.push(m[1]);
  return segments;
}

function isPureIdentifier(s) {
  return /^\w+(\.\w+)*$/.test(s) && !s.includes('(');
}

function isStringLiteral(s) {
  return /^(['"]).*\1$/.test(s);
}

function isNumber(s) {
  return /^-?\d+(\.\d+)?$/.test(s);
}

function isUrl(s) {
  return /^https?:/.test(s);
}

function isFilePath(s) {
  return /^\/[\w./-]+$/.test(s) || /^[A-Z]:\\/.test(s);
}

// Data literals: [..], (..), {..} containing only simple values / strings
function isDataLiteral(s) {
  const t = s.trim();
  if (!/^[[({].*[\])}]$/s.test(t)) return false;
  // No identifier-followed-by-paren inside (that would be a function call)
  if (/\w+\s*\(/.test(t)) return false;
  // No `=` (no assignment / kwargs)
  if (/[^!<>=]=[^=]/.test(t)) return false;
  // No `def`/`class`/`lambda`
  if (/\b(def|class|lambda)\b/.test(t)) return false;
  return true;
}

function scoreSegment(seg) {
  const s = seg.trim();

  // Benign cases
  if (isPureIdentifier(s)) return 0;
  if (isStringLiteral(s)) return 0;
  if (isNumber(s)) return 0;
  if (isUrl(s)) return 0;
  if (isFilePath(s)) return 0;
  if (isDataLiteral(s)) return 0;
  if (/^\\\\w+$/.test(s)) return 0; // regex tokens

  let score = 0;
  const reasons = [];

  if (/^@\w/.test(s)) { score += 3; reasons.push('decorator'); }
  if (/\b(def|class|lambda)\s+\w/.test(s)) { score += 3; reasons.push('def/class'); }
  // Function call: identifier(arg) — needs non-empty args (avoids catching `func()` alone which is minor)
  if (/\w+\([^)]+\)/.test(s)) { score += 2; reasons.push('call'); }
  // Method-style: obj.method(
  if (/\w+\.\w+\s*\(/.test(s)) { score += 1; reasons.push('method-call'); }
  // Assignment (but not comparison operators)
  if (/\w+\s*=\s*[^=]/.test(s) && !/[!<>=]=/.test(s)) { score += 2; reasons.push('assignment'); }
  // Type annotation like `x: int` or `x: list[str]`
  if (/^\w+:\s*(list|dict|tuple|set|str|int|float|bool|None|Optional|Union|Any|list\[|dict\[|tuple\[)/.test(s)) {
    score += 2;
    reasons.push('type-ann');
  }
  // Pydantic / typing / dataclass calls that are themselves the answer
  if (/\b(field|Field|TypeVar|Generic|Protocol|ParamSpec|TypeGuard)\s*[(\[]/.test(s)) {
    score += 2;
    reasons.push('primitive-call');
  }

  return { score, reasons: [...new Set(reasons)] };
}

function auditQuestion(q) {
  const segs = extractBackticks(q.question);
  let total = 0;
  const hits = [];
  for (const seg of segs) {
    // Skip segments that are (or are contained within) an expectedOutput —
    // those are behavioural spec, not solution code.
    if (q.expectedOutputs && q.expectedOutputs.some(eo => eo.includes(seg.trim()))) continue;
    const r = scoreSegment(seg);
    const sc = typeof r === 'number' ? r : r.score;
    if (sc > 0) {
      total += sc;
      hits.push({ seg, score: sc, reasons: r.reasons || [] });
    }
  }
  return { total, hits };
}

function severity(score) {
  if (score >= 10) return 'HIGH';
  if (score >= 6) return 'MEDIUM';
  if (score >= 3) return 'LOW';
  return null;
}

const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.ts'));
const leaks = [];

for (const file of files) {
  const src = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
  const questions = extractCodingQuestions(src);
  for (const q of questions) {
    const { total, hits } = auditQuestion(q);
    const sev = severity(total);
    if (sev) leaks.push({ file, id: q.id, score: total, severity: sev, hits });
  }
}

leaks.sort((a, b) => {
  const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
  if (order[a.severity] !== order[b.severity]) return order[a.severity] - order[b.severity];
  return b.score - a.score;
});

if (leaks.length === 0) {
  console.log('No prompt leaks detected.');
  process.exit(0);
}

const verbose = process.argv.includes('-v') || process.argv.includes('--verbose');

console.log(`Found ${leaks.length} questions with code-in-prompt leaks:\n`);
for (const l of leaks) {
  console.log(`[${l.severity}] ${l.id.padEnd(36)} score=${String(l.score).padEnd(3)}  ${l.file}`);
  if (verbose) {
    for (const h of l.hits) {
      console.log(`   +${h.score} [${h.reasons.join(',')}]  \`${h.seg}\``);
    }
  }
}

const counts = leaks.reduce((acc, l) => ({ ...acc, [l.severity]: (acc[l.severity] || 0) + 1 }), {});
console.log(`\nSummary: HIGH=${counts.HIGH || 0}  MEDIUM=${counts.MEDIUM || 0}  LOW=${counts.LOW || 0}`);
console.log('Pass -v for per-segment details.');
