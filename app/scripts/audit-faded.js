#!/usr/bin/env node
/**
 * Audits the faded-scaffold layer per topic. The selector serves question
 * types in a fixed order within each difficulty:
 *   MCQ -> PREDICT_OUTPUT -> PARSONS -> CLOZE_CODE -> CODING
 * A topic whose BEGINNER tier has CODING but little/no faded layer
 * (predict/parsons/cloze) drops the learner into cold coding too early.
 *
 * This script regex-parses src/data/*.ts (same approach as check-leaks.js),
 * extracts each question's {type, difficulty, topic, course}, and reports the
 * beginner-tier breakdown per topic, flagging the gap.
 *
 * Usage: node scripts/audit-faded.js [COURSE]   (default COURSE=BACKEND)
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const COURSE = (process.argv[2] || 'BACKEND').toUpperCase();

const field = (chunk, name) => {
  const m = chunk.match(new RegExp(name + ':\\s*(?:QuestionType|Difficulty|Topic|Course)\\.([A-Z_]+)'));
  return m ? m[1] : null;
};

// topic -> { difficulty -> { type -> count } }
const agg = {};

for (const f of fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.ts'))) {
  const src = fs.readFileSync(path.join(DATA_DIR, f), 'utf8');
  const idRe = /id:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = idRe.exec(src))) {
    const start = m.index;
    const nextId = src.indexOf('id:', idRe.lastIndex);
    const chunk = src.slice(start, nextId === -1 ? start + 6000 : nextId);
    const course = field(chunk, 'course');
    if (course !== COURSE) continue;
    const topic = field(chunk, 'topic');
    const type = field(chunk, 'type');
    const diff = field(chunk, 'difficulty');
    if (!topic || !type || !diff) continue;
    agg[topic] = agg[topic] || {};
    agg[topic][diff] = agg[topic][diff] || {};
    agg[topic][diff][type] = (agg[topic][diff][type] || 0) + 1;
  }
}

const TYPES = ['MULTIPLE_CHOICE', 'PREDICT_OUTPUT', 'PARSONS', 'CLOZE_CODE', 'CODING'];
const FADED = ['PREDICT_OUTPUT', 'PARSONS', 'CLOZE_CODE'];
const pad = (s, n) => String(s).padEnd(n).slice(0, n);
const r = (n, w) => String(n).padStart(w);

console.log(`\nCourse: ${COURSE}   (beginner-tier breakdown; type order = selector order)\n`);
console.log(pad('TOPIC', 30) + '  ' + ['MCQ', 'PRD', 'PAR', 'CLZ', 'COD'].map(t => r(t, 4)).join('') + '   FADED  FLAG');
console.log('='.repeat(72));

const rows = Object.keys(agg).sort();
for (const topic of rows) {
  const beg = agg[topic]['BEGINNER'] || {};
  const cnt = t => beg[t] || 0;
  const faded = FADED.reduce((s, t) => s + cnt(t), 0);
  const coding = cnt('CODING');
  let flag = '';
  if (coding > 0 && faded === 0) flag = 'GAP: no faded, has coding';
  else if (coding > 0 && faded < 3) flag = 'THIN: <3 faded before coding';
  else if (faded === 0 && coding === 0) flag = '(no coding, no faded)';
  console.log(
    pad(topic.toLowerCase(), 30) + '  ' +
    TYPES.map(t => r(cnt(t), 4)).join('') + '   ' + r(faded, 4) + '  ' + flag
  );
}
console.log('');
