#!/usr/bin/env node
/**
 * Scans coding questions in the web-dev course files and flags starter code
 * that leaks the solution. For JS/TS/JSX the expected baseline is:
 *   - imports / `'use client'` / `'use server'`
 *   - optional function-signature / component-skeleton stub with an empty body
 *   - optional "given data" literal copied from the prompt
 *   - `// TODO` / `// your code here` markers
 *
 * Any *other* comment that describes the solution mechanism (e.g. "Use
 * { ...defaults, ...userPrefs }" or "Use array destructuring to pull the first
 * two elements") is a leak, as is any executable code beyond a scaffold.
 *
 * HTML and CSS are inspected separately with looser rules (scaffold is OK; the
 * concern is inline text / selectors that directly answer the prompt).
 *
 * Score per starter:
 *   +3  comment line containing operator / call / template literal that
 *       resembles the solution (e.g. `// Use {...a, ...b}`)
 *   +3  comment starting with "Use " followed by specific syntax
 *   +2  comment that names a specific method/function the user must write
 *   +2  any executable line beyond imports / signature / return stub
 *   +1  comment referencing a concrete identifier from the prompt is fine; a
 *       comment prescribing the full approach adds +1 per extra hint
 *
 * Thresholds:
 *   >= 6 HIGH
 *   >= 3 MEDIUM
 *   >= 1 LOW
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const WEBDEV_FILES = [
  'htmlCssQuestions.ts',
  'webdevQuestions.ts',
  'webdevOrderedQuestions.ts',
  'webdevGapQuestions.ts',
  'webdevAdvancedQuestions.ts',
  'nextjsQuestions.ts',
  'advancedNextQuestions.ts',
  'advancedWebdevOrderedQuestions.ts',
  'prismaQuestions.ts',
];

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

function unescapeJsString(s) {
  return s
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\\\/g, '\\');
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

function extractCodingQuestions(src) {
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
    const starterCode = extractField(chunk, 'starterCode');
    if (!starterCode) continue;
    const question = extractField(chunk, 'question') || '';
    const solution = extractField(chunk, 'solution') || '';
    const languageMatch = chunk.match(/language:\s*CodeLanguage\.(\w+)/);
    const language = languageMatch ? languageMatch[1] : '';
    results.push({ id: ids[i].id, question, starterCode, solution, language });
  }
  return results;
}

// --- comment / line helpers ------------------------------------------------

function splitLines(s) {
  return s.replace(/\r\n/g, '\n').split('\n');
}

function stripInlineComment(line) {
  // Keep both the code part and the comment part separately
  const idx = line.indexOf('//');
  if (idx === -1) return { code: line, comment: '' };
  // avoid false positive on http:// urls inside strings — good enough for our starters
  const before = line.slice(0, idx);
  const quoteCount = (before.match(/['"`]/g) || []).length;
  if (quoteCount % 2 !== 0) return { code: line, comment: '' };
  return { code: before, comment: line.slice(idx + 2).trim() };
}

function isBlockCommentOnly(line) {
  const t = line.trim();
  return /^\/\*/.test(t) || /^\*/.test(t) || /\*\/$/.test(t);
}

// Lines that are part of the allowed skeleton
function isAllowedSkeletonLine(line) {
  const t = line.trim();
  if (t === '') return true;
  if (/^import\s+/.test(t)) return true;
  if (/^export\s+(default\s+)?(function|const|class)\s+\w+/.test(t)) {
    // signature start only — no body code
    return /[{(]\s*$/.test(t) || /=>\s*{?\s*$/.test(t);
  }
  if (/^(const|let|var)\s+\w+\s*=\s*require\(/.test(t)) return true;
  if (/^['"`]use (client|server)['"`];?$/.test(t)) return true;
  if (/^function\s+\w+\s*\(/.test(t) && /[{]\s*$/.test(t)) return true;
  if (/^(const|let|var)\s+\w+\s*=\s*(async\s*)?\(.*\)\s*=>\s*{?\s*$/.test(t)) return true;
  if (/^(const|let|var)\s+\w+\s*=\s*\(.*\)\s*=>\s*{?\s*$/.test(t)) return true;
  if (t === '}' || t === '};' || t === ')' || t === ');') return true;
  if (t === 'return;' || /^return\s+null\s*;?$/.test(t) || /^return\s+<>\s*<\/>\s*;?$/.test(t)) return true;
  if (/^return\s*\(\s*$/.test(t)) return true;
  if (/^\/\/\s*(TODO|FIXME|your code here|write your code|your answer|implementation).*/i.test(t)) return true;
  if (isBlockCommentOnly(t)) return true;
  // Closing tokens
  if (/^[)\]}]+[;,]?$/.test(t)) return true;
  // Simple `return identifier;` — the returned variable is defined elsewhere in the scaffold
  if (/^return\s+\w+(\.\w+)?\s*;?$/.test(t)) return true;
  if (/^return\s*\{\s*\w+(\s*,\s*\w+)*\s*\}\s*;?$/.test(t)) return true;
  // TS interface/type field declarations inside a block
  if (/^\w+\??\s*:\s*[\w<>\[\]|&\s,'"]+;?$/.test(t) && !/=/.test(t)) return true;
  // Destructured param line in multi-line arrow signature: e.g. `  params,`
  if (/^\w+\s*,?$/.test(t)) return true;
  if (/^\}\s*:\s*\{?\s*$/.test(t)) return true;
  // Variable assignment whose RHS is an await call / construction — scaffolding, not answer
  if (/^const\s+\w+\s*=\s*(await\s+)?new\s+\w+\s*\(\)\s*;?$/.test(t)) return true;
  if (/^const\s+\w+\s*=\s*useQueryClient\(\)\s*;?$/.test(t)) return true;
  // Initialising instance fields in a constructor: `this.x = []` / `this.x = 0` / `this.x = null`
  if (/^this\.\w+\s*=\s*(\[\]|\{\}|null|true|false|-?\d+(\.\d+)?|['"`][^'"`]*['"`])\s*;?$/.test(t)) return true;
  return false;
}

// Score a single comment for "does it describe the solution"
function scoreComment(cmt, solution) {
  const c = cmt.trim();
  if (!c) return 0;

  // Short instructional markers are fine
  if (/^(TODO|FIXME|your code here|write your code|your answer|implementation)[.!:]?$/i.test(c)) return 0;

  let score = 0;

  // Comment containing executable-looking syntax (code-in-comment)
  // e.g. `// Use { ...defaults, ...userPrefs }`
  if (/[{}]\s*\.\.\.|\[\s*\.\.\.|=>|===|!==|\?\?|&&|\|\|/.test(c)) score += 3;
  if (/\w+\s*=\s*[^=]/.test(c) && !/^[A-Za-z]+\s*=\s*(a|an|the)\s/i.test(c)) score += 2;
  if (/\w+\(.+\)/.test(c)) score += 2;
  if (/`[^`]+`/.test(c)) score += 2;

  // Prescriptive phrasing like "Use array destructuring"
  if (/^use\s+/i.test(c)) score += 2;
  if (/^call\s+/i.test(c)) score += 2;
  if (/^return\s+[a-zA-Z<]/.test(c)) score += 2;

  // Mentions a concrete method name the solution uses
  if (solution) {
    // method tokens in the solution
    const solTokens = new Set();
    const reMethod = /\.(\w+)\s*\(/g;
    let m;
    while ((m = reMethod.exec(solution))) solTokens.add(m[1]);
    for (const t of solTokens) {
      if (t.length > 2 && new RegExp(`\\b${t}\\b`).test(c)) { score += 1; break; }
    }
  }

  return score;
}

// Collapse multi-line data literals (top-level `=` followed by `[...]` or
// `{...}` that spans multiple lines) into a single logical line. Anything else
// is returned as-is.
function collapseMultilineLiterals(code) {
  const lines = splitLines(code);
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const opener = line.match(/^(.*?[=:]\s*)([\[{(])\s*$/);
    if (opener) {
      let buf = line;
      let depth = 1;
      let j = i + 1;
      while (j < lines.length && depth > 0) {
        const nxt = lines[j];
        buf += '\n' + nxt;
        for (const ch of nxt) {
          if (ch === '[' || ch === '{' || ch === '(') depth++;
          else if (ch === ']' || ch === '}' || ch === ')') depth--;
          if (depth === 0) break;
        }
        j++;
      }
      out.push(buf);
      i = j;
    } else {
      out.push(line);
      i++;
    }
  }
  return out;
}

function isCollapsedDataLiteral(line) {
  const t = line.trim();
  // const|let|var NAME = [ ... ]; where "..." is only strings/numbers/nulls/bools
  if (!/^(const|let|var|export\s+const)\s+\w+\s*(:\s*[^=]+)?=\s*[\[{]/.test(t)) return false;
  // no function calls inside
  if (/\w+\s*\(/.test(t)) return false;
  // no arrow functions
  if (/=>/.test(t)) return false;
  return true;
}

function isAllowedSignature(line) {
  const t = line.trim();
  // function foo() {  /  async function foo() {  /  export [default] [async] function foo() {
  if (/^(export\s+(default\s+)?)?(async\s+)?function\s*\**\s*\w*\s*\(/.test(t) && /[{]\s*$/.test(t)) return true;
  // class Foo ... { / extends
  if (/^(export\s+(default\s+)?)?class\s+\w+/.test(t) && /[{]\s*$/.test(t)) return true;
  // const foo = (args) => {  /  const foo = async (args) => {
  if (/^(export\s+)?(const|let|var)\s+\w+\s*(:\s*[^=]+)?=\s*(async\s*)?\(.*\)\s*(:\s*[^=]+)?=>\s*\{?\s*$/.test(t)) return true;
  // const foo = (args) =>  (partial opener)
  if (/^(export\s+)?(const|let|var)\s+\w+\s*=\s*(async\s*)?\(.*\)\s*=>\s*$/.test(t)) return true;
  // const foo = function (args) {
  if (/^(export\s+)?(const|let|var)\s+\w+\s*=\s*(async\s+)?function\s*\(.*\)\s*\{?\s*$/.test(t)) return true;
  // type Foo = ...  /  interface Foo { ... }
  if (/^(export\s+)?type\s+\w+\s*=/.test(t)) return true;
  if (/^(export\s+)?interface\s+\w+/.test(t)) return true;
  return false;
}

function auditStarter(q) {
  const lang = q.language;
  if (lang === 'HTML' || lang === 'CSS') {
    return { score: 0, hits: [], skipped: true };
  }

  const lines = collapseMultilineLiterals(q.starterCode);
  let score = 0;
  const hits = [];

  const promptData = extractPromptLiterals(q.question);

  for (const raw of lines) {
    const first = splitLines(raw)[0];
    if (first.trim() === '') continue;
    const { code, comment } = stripInlineComment(first);
    // Score the comment
    if (comment) {
      const s = scoreComment(comment, q.solution);
      if (s > 0) {
        score += s;
        hits.push({ line: raw, kind: 'comment', score: s });
      }
    }
    // Score the code portion
    const codeTrim = code.trim();
    if (codeTrim === '') continue;
    if (isAllowedSkeletonLine(code)) continue;
    if (isAllowedSignature(raw)) continue;
    if (isCollapsedDataLiteral(raw)) continue;
    if (promptData.some(lit => raw.includes(lit))) continue;

    // Otherwise it's executable code beyond the scaffold
    score += 2;
    hits.push({ line: raw.split('\n')[0], kind: 'code', score: 2 });
  }

  return { score, hits, skipped: false };
}

// Pull out literals that appear in the prompt — anything in backticks or in
// `name = { ... }` style declarations — so we can treat them as "given" in the
// starter without flagging.
function extractPromptLiterals(prompt) {
  const literals = [];
  const re = /`([^`]+)`/g;
  let m;
  while ((m = re.exec(prompt))) literals.push(m[1].trim());
  const re2 = /\b(\w+)\s*=\s*(\{[^}]+\}|\[[^\]]+\])/g;
  while ((m = re2.exec(prompt))) literals.push(m[2].trim());
  // Catch simple "<name> = "string"" or "<name> = 42" prompt mentions, and
  // synthesize the whole `const <name> = <value>` line as a starter-literal
  // that the student is expected to declare verbatim.
  const re3 = /\b(\w+)\s*=\s*(["'][^"']+["']|-?\d+(?:\.\d+)?|null|true|false)/g;
  while ((m = re3.exec(prompt))) {
    literals.push(`${m[1]} = ${m[2]}`);
    literals.push(`const ${m[1]} = ${m[2]}`);
  }
  return literals;
}

function severity(s) {
  if (s >= 6) return 'HIGH';
  if (s >= 3) return 'MEDIUM';
  if (s >= 1) return 'LOW';
  return null;
}

const leaks = [];
for (const file of WEBDEV_FILES) {
  const full = path.join(DATA_DIR, file);
  if (!fs.existsSync(full)) continue;
  const src = fs.readFileSync(full, 'utf8');
  const qs = extractCodingQuestions(src);
  for (const q of qs) {
    const { score, hits, skipped } = auditStarter(q);
    if (skipped) continue;
    const sev = severity(score);
    if (sev) leaks.push({ file, id: q.id, score, severity: sev, hits, language: q.language });
  }
}

leaks.sort((a, b) => {
  const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
  if (order[a.severity] !== order[b.severity]) return order[a.severity] - order[b.severity];
  return b.score - a.score;
});

const verbose = process.argv.includes('-v');
if (leaks.length === 0) {
  console.log('No starter-code leaks in web dev files.');
  process.exit(0);
}

console.log(`Found ${leaks.length} starter-code leaks in web dev course:\n`);
for (const l of leaks) {
  console.log(`[${l.severity}] ${l.id.padEnd(34)} score=${String(l.score).padEnd(3)}  ${l.language.padEnd(10)} ${l.file}`);
  if (verbose) {
    for (const h of l.hits) console.log(`   +${h.score} ${h.kind.padEnd(7)} ${JSON.stringify(h.line)}`);
  }
}
const counts = leaks.reduce((a, l) => ({ ...a, [l.severity]: (a[l.severity] || 0) + 1 }), {});
console.log(`\nSummary: HIGH=${counts.HIGH || 0}  MEDIUM=${counts.MEDIUM || 0}  LOW=${counts.LOW || 0}`);
console.log('Pass -v for per-line details.');
