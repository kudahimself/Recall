// One-off stats for the Django course review: per-topic counts by difficulty x type,
// plus ordering check against backendOrderedQuestions.ts.
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'src', 'data');
const files = fs.readdirSync(dataDir).filter(f => f.startsWith('topic_dj_'));

const DIFFS = ['beginner', 'intermediate', 'advanced'];
const TYPES = ['multiple_choice', 'coding', 'parsons', 'predict_output', 'cloze_code'];

function parseQuestions(src) {
  // crude block parse: find each `id: '...'` then nearest type/difficulty/topic after it
  const out = [];
  const re = /id:\s*['"]([^'"]+)['"]/g;
  let m;
  const idxs = [];
  while ((m = re.exec(src))) idxs.push({ id: m[1], start: m.index });
  for (let i = 0; i < idxs.length; i++) {
    const end = i + 1 < idxs.length ? idxs[i + 1].start : src.length;
    const block = src.slice(idxs[i].start, end);
    const type = (block.match(/type:\s*QuestionType\.(\w+)/) || [])[1];
    const diff = (block.match(/difficulty:\s*Difficulty\.(\w+)/) || [])[1];
    const topic = (block.match(/topic:\s*Topic\.(\w+)/) || [])[1];
    if (type && diff) out.push({ id: idxs[i].id, type: type.toLowerCase(), diff: diff.toLowerCase(), topic });
  }
  return out;
}

const byTopic = {};
let all = [];
for (const f of files) {
  const src = fs.readFileSync(path.join(dataDir, f), 'utf8');
  const qs = parseQuestions(src);
  for (const q of qs) {
    const t = (q.topic || f).toLowerCase();
    byTopic[t] = byTopic[t] || [];
    byTopic[t].push(q);
  }
  all = all.concat(qs.map(q => ({ ...q, file: f })));
}

console.log('TOPIC                          TOT | beg int adv | MCQ COD PAR CLZ PRD');
for (const t of Object.keys(byTopic).sort()) {
  const qs = byTopic[t];
  const d = Object.fromEntries(DIFFS.map(x => [x, qs.filter(q => q.diff === x).length]));
  const ty = {
    mcq: qs.filter(q => q.type === 'multiple_choice').length,
    cod: qs.filter(q => q.type === 'coding').length,
    par: qs.filter(q => q.type === 'parsons').length,
    clz: qs.filter(q => q.type === 'cloze_code').length,
    prd: qs.filter(q => q.type === 'predict_output').length,
  };
  console.log(
    t.padEnd(30), String(qs.length).padStart(3), '|',
    String(d.beginner).padStart(3), String(d.intermediate).padStart(3), String(d.advanced).padStart(3), '|',
    String(ty.mcq).padStart(3), String(ty.cod).padStart(3), String(ty.par).padStart(3), String(ty.clz).padStart(3), String(ty.prd).padStart(3)
  );
}
console.log('\nTotal dj questions:', all.length);

// Ordering check: are dj ids in backendOrderedQuestions.ts, and do difficulties ascend within topic?
const orderedSrc = fs.readFileSync(path.join(dataDir, 'backendOrderedQuestions.ts'), 'utf8');
const orderedIds = [];
const reOrd = /['"]([\w][\w.-]*)['"]/g;
let mo;
while ((mo = reOrd.exec(orderedSrc))) orderedIds.push(mo[1]);
const orderedSet = new Set(orderedIds);
const missing = all.filter(q => !orderedSet.has(q.id));
console.log('\ndj questions NOT in backendOrderedQuestions.ts:', missing.length);
for (const q of missing.slice(0, 40)) console.log('  ', q.id, `(${q.topic}/${q.diff}/${q.type})`, q.file);

// difficulty inversions within topic order
const rank = { beginner: 0, intermediate: 1, advanced: 2 };
const byId = Object.fromEntries(all.map(q => [q.id, q]));
const seenPerTopic = {};
const inversions = [];
for (const id of orderedIds) {
  const q = byId[id];
  if (!q) continue;
  const t = q.topic;
  const prev = seenPerTopic[t];
  if (prev !== undefined && rank[q.diff] < prev.maxRank) {
    inversions.push(`${id} (${q.diff}) appears after ${prev.maxId} (${DIFFS[prev.maxRank]}) in ${t}`);
  }
  if (prev === undefined || rank[q.diff] > prev.maxRank) seenPerTopic[t] = { maxRank: rank[q.diff], maxId: id };
}
console.log('\nDifficulty inversions in ordered bank (within dj topics):', inversions.length);
inversions.slice(0, 30).forEach(x => console.log('  ', x));
