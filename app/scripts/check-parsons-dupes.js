#!/usr/bin/env node
// Find Parsons questions where a distractor line exactly matches a correctOrder line.
// Such duplicate tiles render as visually identical and force the user into a 50/50 guess.

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'src', 'data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.ts'));

const offenders = [];

for (const f of files) {
  const src = fs.readFileSync(path.join(dataDir, f), 'utf8');
  // Naive but robust: split into question objects by `id:` boundaries and look at each
  // question that has BOTH correctOrder and distractorLines arrays.
  const idRegex = /id:\s*'([^']+)'/g;
  // Walk through the source, finding each "id" occurrence and the slice up to the next one.
  const idMatches = [...src.matchAll(idRegex)];
  for (let i = 0; i < idMatches.length; i++) {
    const start = idMatches[i].index;
    const end = i + 1 < idMatches.length ? idMatches[i + 1].index : src.length;
    const slice = src.slice(start, end);
    const id = idMatches[i][1];
    // Only Parsons questions
    if (!/QuestionType\.PARSONS/.test(slice)) continue;
    const co = extractArrayLines(slice, 'correctOrder');
    const dl = extractArrayLines(slice, 'distractorLines');
    if (!co || !dl) continue;
    const coSet = new Set(co.map(s => s.trim()));
    const dups = dl.filter(d => coSet.has(d.trim()));
    if (dups.length > 0) {
      offenders.push({ file: f, id, dups, co, dl });
    }
  }
}

if (offenders.length === 0) {
  console.log('No Parsons duplicate-tile offenders found.');
  process.exit(0);
}

console.log(`Found ${offenders.length} Parsons questions with duplicate tiles:\n`);
for (const o of offenders) {
  console.log(`  [${o.file}]  ${o.id}`);
  for (const d of o.dups) {
    console.log(`     duplicate: ${JSON.stringify(d)}`);
  }
}

function extractArrayLines(slice, key) {
  // Match `key: [ ... ]` where the inner content is single-quoted strings separated by commas.
  // This is brittle but works for our style of authored questions.
  const re = new RegExp(`${key}\\s*:\\s*\\[([\\s\\S]*?)\\]`, 'm');
  const m = slice.match(re);
  if (!m) return null;
  const body = m[1];
  // Strip /* ... */ and // line comments
  const stripped = body.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  const out = [];
  // Pull each single-quoted string, allowing for backslash-escaped quotes.
  const strRe = /'((?:\\.|[^'\\])*)'/g;
  let mm;
  while ((mm = strRe.exec(stripped)) !== null) {
    // unescape `\'` and `\\`
    out.push(mm[1].replace(/\\'/g, "'").replace(/\\\\/g, '\\'));
  }
  return out;
}
