#!/usr/bin/env node
/**
 * Reads scripts/concept-tags-proposed[-<course>].json and writes
 * `concepts: [...]` into each HIGH-confidence question's source file.
 * LOW-confidence questions are left alone — they fall through to legacy
 * scheduling until tagged manually.
 *
 * Idempotent: if a question already has a `concepts:` field, it is left as-is.
 *
 * Usage:
 *   node scripts/apply-concept-tags.js --dry-run                  # preview backend
 *   node scripts/apply-concept-tags.js                            # apply backend
 *   node scripts/apply-concept-tags.js --course=webdev --dry-run  # preview webdev
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const ONLY_FILE = args.find(a => a.startsWith('--only='))?.slice('--only='.length);
const COURSE = (args.find(a => a.startsWith('--course='))?.slice('--course='.length) || 'backend').toLowerCase();
const SIDECAR = path.join(__dirname, COURSE === 'backend' ? 'concept-tags-proposed.json' : `concept-tags-proposed-${COURSE}.json`);

/**
 * String-aware code mask. Mirrors the helper in bootstrap-concept-tags.js so
 * braces inside template literals/strings/comments don't throw off block walks.
 */
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

function loadSidecar() {
  const data = JSON.parse(fs.readFileSync(SIDECAR, 'utf8'));
  const map = new Map();
  for (const p of data.proposals) {
    if (p.confidence === 'HIGH' && p.suggestedConcepts.length > 0) {
      map.set(p.id, p.suggestedConcepts);
    }
  }
  return map;
}

/**
 * Walk each question object in `src` and yield {block, openIdx, closeIdx, id}.
 * Same anchor-on-topic-field strategy used by bootstrap-concept-tags.js.
 */
function* iterateQuestionBlocks(src) {
  const isCode = buildIsCodeMask(src);
  const topicRe = /topic\s*:\s*Topic\.([A-Z_]+)/g;
  let tm;
  while ((tm = topicRe.exec(src)) !== null) {
    if (!isCode[tm.index]) continue;
    let depth = 0;
    let openIdx = -1;
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
    if (!idMatch) continue;

    yield { block, openIdx, closeIdx, id: idMatch[1] };
  }
}

/**
 * For a single question block, return either:
 *   - { kind: 'skip', reason }    — already has concepts, or no edit
 *   - { kind: 'insert', insertAt, text } — absolute offsets in original `src`
 */
function planEdit(src, blockInfo, conceptIds) {
  const { block, openIdx } = blockInfo;

  // Idempotent check: if `concepts:` already appears in this block, skip.
  if (/\bconcepts\s*:\s*\[/.test(block)) {
    return { kind: 'skip', reason: 'already has concepts' };
  }

  // Find the `tags:` line inside the block (relative to block start).
  const tagsRe = /(^[\t ]*)tags\s*:\s*\[[^\]]*\]\s*,?\s*$/m;
  const tagsMatch = block.match(tagsRe);
  if (!tagsMatch) {
    return { kind: 'skip', reason: 'no tags line found' };
  }
  const indent = tagsMatch[1];
  const tagsLineStart = block.indexOf(tagsMatch[0]);
  const tagsLineEnd = tagsLineStart + tagsMatch[0].length;

  // Insert immediately AFTER the tags line (and its trailing newline if any).
  // We add the new line ourselves with a leading newline.
  const conceptsLiterals = conceptIds.map(c => `'${c}'`).join(', ');
  const insertText = `\n${indent}concepts: [${conceptsLiterals}],`;
  const insertAt = openIdx + tagsLineEnd;

  return { kind: 'insert', insertAt, text: insertText };
}

function applyEditsToFile(filename, sidecarMap) {
  const filePath = path.join(DATA_DIR, filename);
  const src = fs.readFileSync(filePath, 'utf8');

  const edits = [];
  let questionsInFile = 0;
  let highMatchInFile = 0;
  let alreadyHasConcepts = 0;
  let noTagsLine = 0;

  for (const blockInfo of iterateQuestionBlocks(src)) {
    questionsInFile++;
    const conceptIds = sidecarMap.get(blockInfo.id);
    if (!conceptIds) continue;
    highMatchInFile++;

    const plan = planEdit(src, blockInfo, conceptIds);
    if (plan.kind === 'skip') {
      if (plan.reason === 'already has concepts') alreadyHasConcepts++;
      else if (plan.reason === 'no tags line found') noTagsLine++;
      continue;
    }
    edits.push(plan);
  }

  // Apply edits in reverse offset order so earlier offsets remain valid.
  edits.sort((a, b) => b.insertAt - a.insertAt);
  let next = src;
  for (const e of edits) {
    next = next.slice(0, e.insertAt) + e.text + next.slice(e.insertAt);
  }

  return {
    filename,
    questionsInFile,
    highMatchInFile,
    edited: edits.length,
    alreadyHasConcepts,
    noTagsLine,
    contentBefore: src,
    contentAfter: next,
  };
}

function main() {
  if (!fs.existsSync(SIDECAR)) {
    console.error(`Sidecar not found: ${SIDECAR}`);
    console.error(`Run bootstrap-concept-tags.js --course=${COURSE} first.`);
    process.exit(1);
  }
  const sidecarMap = loadSidecar();
  console.log(`Course: ${COURSE}`);
  console.log(`Sidecar: ${sidecarMap.size} HIGH-confidence questions to tag.`);
  console.log(DRY_RUN ? 'Mode: DRY RUN (no writes)' : 'Mode: APPLY');
  if (ONLY_FILE) console.log(`Filter: only ${ONLY_FILE}`);

  const allFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.ts'));
  const targetFiles = ONLY_FILE
    ? allFiles.filter(f => f === ONLY_FILE)
    : allFiles;

  let totalQuestions = 0;
  let totalHighMatches = 0;
  let totalEdited = 0;
  let totalAlready = 0;
  let totalNoTags = 0;

  for (const filename of targetFiles) {
    const result = applyEditsToFile(filename, sidecarMap);
    totalQuestions += result.questionsInFile;
    totalHighMatches += result.highMatchInFile;
    totalEdited += result.edited;
    totalAlready += result.alreadyHasConcepts;
    totalNoTags += result.noTagsLine;

    if (result.edited > 0) {
      console.log(`  ${filename.padEnd(50)} ${result.edited.toString().padStart(4)} edits`);
      if (!DRY_RUN) {
        fs.writeFileSync(path.join(DATA_DIR, filename), result.contentAfter);
      }
    }
  }

  console.log('');
  console.log(`Files scanned:        ${targetFiles.length}`);
  console.log(`Questions seen:       ${totalQuestions}`);
  console.log(`HIGH matches in pool: ${totalHighMatches}`);
  console.log(`Edits applied:        ${totalEdited}`);
  console.log(`Already had concepts: ${totalAlready}`);
  console.log(`No tags line:         ${totalNoTags}`);
  if (DRY_RUN) {
    console.log('\n(Dry run — no files written. Re-run without --dry-run to apply.)');
  }
}

main();
