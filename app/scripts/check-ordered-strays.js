// Which backend topic-file questions are NOT referenced by backendOrderedQuestions.ts?
// Those are served only via the redundant spreads in questions.ts.
const fs = require('fs');
const path = require('path');
const dataDir = path.join(__dirname, '..', 'src', 'data');

const ordered = fs.readFileSync(path.join(dataDir, 'backendOrderedQuestions.ts'), 'utf8');
const orderedIds = new Set();
let m;
const reQ = /q\('([^']+)'\)/g;
while ((m = reQ.exec(ordered))) orderedIds.add(m[1]);

const files = fs.readdirSync(dataDir).filter(f => /^topic_(py_|dj_|be_)/.test(f));
let total = 0;
for (const f of files) {
  const src = fs.readFileSync(path.join(dataDir, f), 'utf8');
  const ids = [];
  const reId = /^\s{4,8}id:\s*'([^']+)'/gm;
  while ((m = reId.exec(src))) ids.push(m[1]);
  const missing = ids.filter(id => !orderedIds.has(id));
  if (missing.length) {
    console.log(f);
    for (const id of missing) console.log('   ', id);
    total += missing.length;
  }
}
console.log('\nTotal not in ordered bank:', total);
