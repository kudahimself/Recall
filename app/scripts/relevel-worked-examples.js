#!/usr/bin/env node
/**
 * Re-level worked-example questions (CLOZE_CODE / PARSONS / PREDICT_OUTPUT)
 * across all topic_py_*.ts files using the heuristic:
 *
 *   CLOZE   — INTERMEDIATE → BEGINNER if `blanks` has <=2 entries with a single
 *             unique value (introduces ONE primitive)
 *   PARSONS — INTERMEDIATE → BEGINNER if `correctOrder` length <= 5 lines
 *             (covers single-primitive demos like itertools-parsons-1)
 *   PREDICT — INTERMEDIATE → BEGINNER if `code` has <=4 non-blank lines AND
 *             the snippet imports a single symbol
 *
 * Only touches blocks currently labeled INTERMEDIATE — never re-levels ADVANCED
 * down to BEGINNER. Prints a per-topic before/after table.
 *
 * Usage:
 *   node scripts/relevel-worked-examples.js [--dry-run] [--only=topic1,topic2]
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const args = process.argv.slice(2);
const DRY = args.includes('--dry-run');
const onlyArg = args.find(a => a.startsWith('--only='));
const ONLY = onlyArg ? onlyArg.split('=')[1].split(',') : null;

const files = fs.readdirSync(DATA_DIR)
  .filter(f => /^topic_py_.*\.ts$/.test(f))
  .filter(f => !ONLY || ONLY.some(t => f.includes(t)));

// Split a TS file's top-level array into individual `{ ... }` blocks.
// Naive but works because each block in these files starts at column 2 with `{`
// and ends with `},` followed by another `{` or `];`.
function splitBlocks(src) {
  const start = src.indexOf('= [');
  const end = src.lastIndexOf('];');
  if (start < 0 || end < 0) return null;
  const header = src.slice(0, start + 3);
  const footer = src.slice(end);
  const body = src.slice(start + 3, end);

  // Walk braces to split into balanced top-level blocks.
  const blocks = [];
  let depth = 0;
  let buf = '';
  let inStr = false;
  let strCh = '';
  let inBT = false;       // template literal
  let prev = '';
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    buf += c;
    if (inBT) {
      if (c === '`' && prev !== '\\') inBT = false;
    } else if (inStr) {
      if (c === strCh && prev !== '\\') inStr = false;
    } else {
      if (c === '`') inBT = true;
      else if (c === '"' || c === "'") { inStr = true; strCh = c; }
      else if (c === '{') depth++;
      else if (c === '}') {
        depth--;
        if (depth === 0) {
          // Consume trailing comma + whitespace
          let j = i + 1;
          while (j < body.length && /[\s,]/.test(body[j])) { buf += body[j]; j++; }
          blocks.push(buf);
          buf = '';
          i = j - 1;
        }
      }
    }
    prev = c;
  }
  // Anything left in buf is trailing whitespace / comments
  return { header, footer, blocks, trailing: buf };
}

function getField(block, field) {
  // Match `field: <value>` at the start of a line in this block.
  const re = new RegExp(`\\b${field}:\\s*`);
  const m = block.match(re);
  if (!m) return null;
  return m;
}

function getId(block) {
  const m = block.match(/\bid:\s*'([^']+)'/);
  return m ? m[1] : null;
}

function getType(block) {
  const m = block.match(/\btype:\s*QuestionType\.(\w+)/);
  return m ? m[1] : null;
}

function getDifficulty(block) {
  const m = block.match(/\bdifficulty:\s*Difficulty\.(\w+)/);
  return m ? m[1] : null;
}

function setDifficulty(block, newDiff) {
  return block.replace(
    /(\bdifficulty:\s*Difficulty\.)(\w+)/,
    `$1${newDiff}`,
  );
}

// --- Heuristics ---

// Count distinct imported symbols across all `import X` / `from X import Y[, Z]`
// statements in a chunk of code. Each comma-separated symbol counts once.
function countImportedSymbols(code) {
  const set = new Set();
  const lines = code.split('\n').map(l => l.trim());
  for (const l of lines) {
    const fm = l.match(/^from\s+\S+\s+import\s+(.+?)(?:\s*#.*)?$/);
    if (fm) {
      fm[1].split(',').map(s => s.trim()).map(s => s.split(/\s+as\s+/)[0]).filter(Boolean).forEach(s => set.add(s));
      continue;
    }
    const im = l.match(/^import\s+(.+?)(?:\s*#.*)?$/);
    if (im) {
      im[1].split(',').map(s => s.trim()).map(s => s.split(/\s+as\s+/)[0]).filter(Boolean).forEach(s => set.add(s));
    }
  }
  return set.size;
}

function getStringField(block, field) {
  // Match `field: '...'`, `field: "..."`, or `field: \`...\``
  const re = new RegExp(`\\b${field}:\\s*(\`([\\s\\S]*?)\`|'((?:[^'\\\\]|\\\\.)*)'|"((?:[^"\\\\]|\\\\.)*)")`);
  const m = block.match(re);
  if (!m) return null;
  // Pick the first non-undefined capture group from 2/3/4
  const v = m[2] !== undefined ? m[2] : (m[3] !== undefined ? m[3] : m[4]);
  // Un-escape \n in single-quoted strings
  return typeof v === 'string' ? v.replace(/\\n/g, '\n').replace(/\\'/g, "'").replace(/\\"/g, '"') : null;
}

function clozeIsBeginner(block) {
  // Use `solution` if available — fully assembled correct code is the cleanest signal.
  const sol = getStringField(block, 'solution');
  const code = sol || getStringField(block, 'template') || '';
  if (!code) return false;
  const imports = countImportedSymbols(code);
  // 0 imports = built-in only (still beginner-able). 1 import = single primitive.
  // 2+ imports = combines primitives → INTERMEDIATE.
  if (imports > 1) return false;
  // Also gate on blanks count: <=2 blanks AND all same value = single primitive
  const m = block.match(/\bblanks:\s*\[([^\]]+)\]/);
  if (m) {
    const items = m[1].split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
    const unique = new Set(items);
    if (items.length > 2 || unique.size > 1) return false;
  }
  return true;
}

function parsonsIsBeginner(block) {
  const sol = getStringField(block, 'solution');
  if (!sol) return false;
  if (countImportedSymbols(sol) > 1) return false;
  // correctOrder length check — count comma-separated entries at depth 0
  const m = block.match(/\bcorrectOrder:\s*\[([\s\S]*?)\]/);
  if (!m) return false;
  const body = m[1];
  let depth = 0, inStr = false, strCh = '', commas = 0, sawAny = false, prev = '';
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (inStr) {
      if (c === strCh && prev !== '\\') inStr = false;
    } else {
      if (c === '"' || c === "'" || c === '`') { inStr = true; strCh = c; sawAny = true; }
      else if (c === '[' || c === '(' || c === '{') depth++;
      else if (c === ']' || c === ')' || c === '}') depth--;
      else if (c === ',' && depth === 0) commas++;
      else if (!/\s/.test(c)) sawAny = true;
    }
    prev = c;
  }
  if (!sawAny) return false;
  return (commas + 1) <= 6;  // allow trailing comma
}

function predictIsBeginner(block) {
  const code = getStringField(block, 'code');
  if (!code) return false;
  if (countImportedSymbols(code) > 1) return false;
  const lines = code.split('\n').map(l => l.trim()).filter(Boolean);
  return lines.length <= 4;
}

const HEURISTICS = {
  CLOZE_CODE: clozeIsBeginner,
  PARSONS: parsonsIsBeginner,
  PREDICT_OUTPUT: predictIsBeginner,
};

// --- Run ---

const summary = [];
for (const file of files) {
  const fp = path.join(DATA_DIR, file);
  const src = fs.readFileSync(fp, 'utf8');
  const parsed = splitBlocks(src);
  if (!parsed) { console.warn(`SKIP (cannot parse): ${file}`); continue; }

  let changed = 0;
  let candidates = 0;
  const promotions = [];
  const newBlocks = parsed.blocks.map(b => {
    const id = getId(b);
    const type = getType(b);
    const diff = getDifficulty(b);
    if (!id || !type || diff !== 'INTERMEDIATE') return b;
    const fn = HEURISTICS[type];
    if (!fn) return b;
    candidates++;
    if (!fn(b)) return b;
    changed++;
    promotions.push(`${id} (${type})`);
    return setDifficulty(b, 'BEGINNER');
  });

  const out = parsed.header + newBlocks.join('') + parsed.trailing + parsed.footer;
  if (!DRY && out !== src) fs.writeFileSync(fp, out, 'utf8');
  summary.push({ file, candidates, changed, promotions });
}

// Print summary
console.log(DRY ? '\n=== DRY RUN ===\n' : '\n=== APPLIED ===\n');
console.log('topic'.padEnd(40) + 'cand  promoted');
console.log('-'.repeat(60));
let totalCand = 0, totalChg = 0;
for (const s of summary) {
  console.log(s.file.padEnd(40) + String(s.candidates).padStart(4) + '   ' + s.changed);
  totalCand += s.candidates;
  totalChg += s.changed;
}
console.log('-'.repeat(60));
console.log('TOTAL'.padEnd(40) + String(totalCand).padStart(4) + '   ' + totalChg);

if (DRY) {
  console.log('\nPer-topic promotions:\n');
  for (const s of summary) {
    if (s.promotions.length === 0) continue;
    console.log(`  ${s.file}:`);
    for (const p of s.promotions) console.log(`    - ${p}`);
  }
}
