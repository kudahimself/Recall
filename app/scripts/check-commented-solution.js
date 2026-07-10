// Detect the "just uncomment it" anti-pattern: starterCode whose COMMENT lines,
// once uncommented, reproduce most of the solution's code tokens.
// check-leaks.js strips comments first, so it is blind to this by design.
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'src', 'data');
const files = fs.readdirSync(dataDir).filter(f => f.startsWith('topic_dj_'));

function extractField(block, field) {
  const re = new RegExp(field + ':\\s*`');
  const m = re.exec(block);
  if (!m) return null;
  const start = m.index + m[0].length;
  const end = block.indexOf('`', start);
  return end === -1 ? null : block.slice(start, end);
}

function tokens(code) {
  return new Set((code.match(/[A-Za-z_][A-Za-z0-9_]*|==|=|\(|\)|\[|\]/g) || []).filter(t => t.length > 1));
}

const findings = [];
for (const f of files) {
  const src = fs.readFileSync(path.join(dataDir, f), 'utf8');
  const idRe = /id:\s*'([^']+)'/g;
  const idxs = [];
  let m;
  while ((m = idRe.exec(src))) idxs.push({ id: m[1], start: m.index });
  for (let i = 0; i < idxs.length; i++) {
    const end = i + 1 < idxs.length ? idxs[i + 1].start : src.length;
    const block = src.slice(idxs[i].start, end);
    if (!/type:\s*QuestionType\.CODING/.test(block)) continue;
    const starter = extractField(block, 'starterCode');
    const solution = extractField(block, 'solution');
    if (!starter || !solution) continue;
    // take only comment lines from the starter, uncomment them
    const commentCode = starter
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(l => l.startsWith('#') || l.startsWith('//') || l.startsWith('--'))
      .map(l => l.replace(/^(#|\/\/|--)\s?/, ''))
      .join('\n');
    if (commentCode.length < 30) continue;
    const ct = tokens(commentCode);
    const st = tokens(solution);
    if (st.size === 0) continue;
    let hit = 0;
    for (const t of st) if (ct.has(t)) hit++;
    const ratio = hit / st.size;
    if (ratio >= 0.6) findings.push({ id: idxs[i].id, file: f, ratio });
  }
}
findings.sort((a, b) => b.ratio - a.ratio);
for (const x of findings) console.log(`[${x.ratio >= 0.8 ? 'HIGH' : 'MED '}] ${x.id.padEnd(36)} ratio=${x.ratio.toFixed(2)}  ${x.file}`);
console.log(`\nTotal commented-solution suspects: ${findings.length}`);
