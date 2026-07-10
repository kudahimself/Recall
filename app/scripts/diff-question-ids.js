#!/usr/bin/env node
/**
 * One-shot diagnostic: extract question ids from old per-type files vs new
 * topic_*.ts files and report any deltas.
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const BACKEND_FILE_PATTERNS = [/^py.*\.ts$/i, /^dj.*\.ts$/i, /^backend.*\.ts$/i, /^celery.*\.ts$/i];
const SKIP = new Set(['backendOrderedQuestions.ts']);

function buildIsCodeMask(src) {
  const N = src.length;
  const isCode = new Uint8Array(N);
  let state = 'code';
  let i = 0;
  while (i < N) {
    const ch = src[i];
    const next = i + 1 < N ? src[i + 1] : '';
    if (state === 'code') {
      isCode[i] = 1;
      if (ch === '/' && next === '/') { state = 'lc'; i += 2; continue; }
      if (ch === '/' && next === '*') { state = 'bc'; i += 2; continue; }
      if (ch === "'") { state = 'sq'; i++; continue; }
      if (ch === '"') { state = 'dq'; i++; continue; }
      if (ch === '`') { state = 'tpl'; i++; continue; }
      i++; continue;
    }
    if (state === 'lc') { if (ch === '\n') state = 'code'; i++; continue; }
    if (state === 'bc') { if (ch === '*' && next === '/') { state = 'code'; i += 2; continue; } i++; continue; }
    if (state === 'sq') { if (ch === '\\') { i += 2; continue; } if (ch === "'") { state = 'code'; i++; continue; } i++; continue; }
    if (state === 'dq') { if (ch === '\\') { i += 2; continue; } if (ch === '"') { state = 'code'; i++; continue; } i++; continue; }
    if (state === 'tpl') { if (ch === '\\') { i += 2; continue; } if (ch === '`') { state = 'code'; i++; continue; } i++; continue; }
    i++;
  }
  return isCode;
}

function* iterateQuestionBlocks(src) {
  const isCode = buildIsCodeMask(src);
  const topicRe = /topic\s*:\s*Topic\.([A-Z_]+)/g;
  let tm;
  while ((tm = topicRe.exec(src)) !== null) {
    if (!isCode[tm.index]) continue;
    let depth = 0, openIdx = -1;
    for (let i = tm.index; i >= 0; i--) {
      if (!isCode[i]) continue;
      const ch = src[i];
      if (ch === '}') depth++;
      else if (ch === '{') {
        if (depth === 0) { openIdx = i; break; }
        depth--;
      }
    }
    if (openIdx < 0) continue;
    depth = 0;
    let closeIdx = -1;
    for (let i = openIdx; i < src.length; i++) {
      if (!isCode[i]) continue;
      const ch = src[i];
      if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) { closeIdx = i; break; }
      }
    }
    if (closeIdx < 0) continue;
    const block = src.slice(openIdx, closeIdx + 1);
    const idMatch = block.match(/\bid\s*:\s*['"]([^'"]+)['"]/);
    if (idMatch) yield { id: idMatch[1], topic: tm[1] };
  }
}

function collectIds(filePredicate) {
  const ids = new Map(); // id → {sourceFile, topic}
  for (const f of fs.readdirSync(DATA_DIR)) {
    if (!filePredicate(f)) continue;
    const src = fs.readFileSync(path.join(DATA_DIR, f), 'utf8');
    for (const blk of iterateQuestionBlocks(src)) {
      if (ids.has(blk.id)) {
        console.log(`  DUP ${blk.id} in ${f} (already from ${ids.get(blk.id).sourceFile})`);
      }
      ids.set(blk.id, { sourceFile: f, topic: blk.topic });
    }
  }
  return ids;
}

const oldIds = collectIds(f =>
  !SKIP.has(f) && !f.startsWith('topic_') && BACKEND_FILE_PATTERNS.some(re => re.test(f))
);
const newIds = collectIds(f => f.startsWith('topic_') && f.endsWith('.ts'));

console.log(`old: ${oldIds.size}  new: ${newIds.size}\n`);

const missingFromNew = [];
for (const [id, info] of oldIds.entries()) {
  if (!newIds.has(id)) missingFromNew.push({ id, ...info });
}
const extraInNew = [];
for (const [id, info] of newIds.entries()) {
  if (!oldIds.has(id)) extraInNew.push({ id, ...info });
}

console.log(`missing from new: ${missingFromNew.length}`);
missingFromNew.forEach(m => console.log(`  ${m.id}  (was in ${m.sourceFile}, topic ${m.topic})`));
console.log(`\nextra in new: ${extraInNew.length}`);
extraInNew.forEach(m => console.log(`  ${m.id}  (in ${m.sourceFile}, topic ${m.topic})`));
