#!/usr/bin/env node
/**
 * Concept-tag bootstrap.
 *
 * For every question in the selected course, propose a concepts: [...] list by
 * cross-referencing the question's existing free-form `tags` array against
 * a hand-curated tag→concept map (kept in sync with TAG_TO_CONCEPTS in
 * src/utils/conceptRegistry.ts).
 *
 * Output: scripts/concept-tags-proposed[-<course>].json — a sidecar file with
 * one entry per question so the QA pass can sort by confidence and patch the
 * gaps before any concept ids are written into question source files.
 *
 * Confidence tiers:
 *   HIGH    — at least one existing tag mapped to a concept
 *   LOW     — question has tags but none mapped (concept registry gap)
 *   NONE    — question has no tags at all (full manual triage)
 *
 * Usage:
 *   node scripts/bootstrap-concept-tags.js                 # default: backend
 *   node scripts/bootstrap-concept-tags.js --course=webdev
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const REGISTRY_PATH = path.join(__dirname, '..', 'src', 'utils', 'conceptRegistry.ts');

const args = process.argv.slice(2);
const COURSE = (args.find(a => a.startsWith('--course='))?.slice('--course='.length) || 'backend').toLowerCase();
const OUTPUT = path.join(__dirname, COURSE === 'backend' ? 'concept-tags-proposed.json' : `concept-tags-proposed-${COURSE}.json`);

// Topic-key prefixes that mark a file as part of each course.
const COURSE_FILE_PATTERNS = {
  backend: [
    /^py.*\.ts$/i, /^dj.*\.ts$/i, /^backend.*\.ts$/i, /^celery.*\.ts$/i,
    /^topic_(py|dj|be|ce)_.*\.ts$/i,
  ],
  webdev: [
    /^webdev.*\.ts$/i, /^htmlCss.*\.ts$/i, /^jsBasics.*\.ts$/i, /^jsMisconception.*\.ts$/i,
    /^nextjs.*\.ts$/i, /^advancedNext.*\.ts$/i, /^prisma.*\.ts$/i, /^formsTesting.*\.ts$/i,
    /^a11yShadcn.*\.ts$/i, /^designPattern.*\.ts$/i, /^projectQuestions.*\.ts$/i,
    /^securityQuestions.*\.ts$/i,
  ],
  databricks: [
    /^questions\.ts$/i, /^expandedQuestions\.ts$/i, /^masteryQuestions\.ts$/i,
    /^certificationQuestions\.ts$/i, /^dataModelingQuestions\.ts$/i,
    /^sparkSql.*\.ts$/i, /^sqlMisconception.*\.ts$/i,
  ],
};

const FILE_PATTERNS = COURSE_FILE_PATTERNS[COURSE];
if (!FILE_PATTERNS) {
  console.error(`Unknown --course=${COURSE}. Known: ${Object.keys(COURSE_FILE_PATTERNS).join(', ')}`);
  process.exit(1);
}

/**
 * String-aware code mask. Returns Uint8Array same length as src; bytes are 1 if
 * the position is in code (outside strings/comments) and 0 otherwise. The
 * brace walker consults this so braces inside backtick template literals (e.g.
 * Django LOGGING dicts, JSX expressions, CSS-in-JS) don't throw off block
 * extraction.
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

/**
 * Parse the per-course tag map and the registry's concept ids from
 * conceptRegistry.ts via regex. Single source of truth; if the registry shape
 * ever changes, this will fail loudly rather than silently drift.
 *
 * The two courses use different tag maps so that abstract tag names like
 * `closure` or `inheritance` mean different concepts per course.
 */
function loadRegistry() {
  const src = fs.readFileSync(REGISTRY_PATH, 'utf8');

  // Per-course tag map name. Backend uses TAG_TO_CONCEPTS (the original);
  // other courses use <COURSE>_TAG_TO_CONCEPTS (e.g. WEBDEV_TAG_TO_CONCEPTS).
  const tagMapName = COURSE === 'backend' ? 'TAG_TO_CONCEPTS' : `${COURSE.toUpperCase()}_TAG_TO_CONCEPTS`;
  const tagBlockRe = new RegExp(`${tagMapName}[^=]*=\\s*\\{([\\s\\S]*?)\\n\\};`);
  const tagBlock = src.match(tagBlockRe);
  if (!tagBlock) throw new Error(`Could not locate ${tagMapName} in conceptRegistry.ts`);
  const tagToConcepts = {};
  const entryRe = /['"]([^'"]+)['"]\s*:\s*\[([^\]]*)\]/g;
  let em;
  while ((em = entryRe.exec(tagBlock[1])) !== null) {
    const key = em[1].toLowerCase();
    const values = em[2].split(',')
      .map(s => s.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean);
    tagToConcepts[key] = values;
  }

  // Per-course concept array — BACKEND_CONCEPTS or WEBDEV_CONCEPTS etc.
  // Pull only concept ids that appear inside that array, by isolating the array body.
  const conceptArrayName = COURSE === 'backend' ? 'BACKEND_CONCEPTS' : `${COURSE.toUpperCase()}_CONCEPTS`;
  const arrayBlockRe = new RegExp(`${conceptArrayName}[^=]*=\\s*\\[([\\s\\S]*?)\\n\\];`);
  const arrayBlock = src.match(arrayBlockRe);
  if (!arrayBlock) throw new Error(`Could not locate ${conceptArrayName} in conceptRegistry.ts`);
  const conceptIds = [];
  const idRe = /\{[^}]*?\bid\s*:\s*['"]([a-z][a-z0-9-]*)['"]/g;
  let im;
  while ((im = idRe.exec(arrayBlock[1])) !== null) {
    conceptIds.push(im[1]);
  }

  return { tagToConcepts, conceptIds };
}

function isCourseFile(filename) {
  return FILE_PATTERNS.some(re => re.test(filename));
}

/**
 * Extract { id, topic, tags } from a TS question file via lightweight regex.
 * Each question in these files looks like:
 *   {
 *     id: 'py-basics-1',
 *     ...
 *     topic: Topic.PY_BASICS,
 *     ...
 *     tags: ['truthiness', 'oop'],
 *     ...
 *   }
 * We don't try to parse the whole TS file — just walk { ... } chunks and pull
 * the three fields we care about.
 */
function extractQuestions(src, filename) {
  const out = [];
  const isCode = buildIsCodeMask(src);
  // Walk the source and pull question objects. We anchor on `topic: Topic.X`
  // because that field exists on questions but not on MCQ option subobjects.
  // For each topic-anchored hit, scan backwards to find the enclosing object's
  // `id:` field, and forwards into the same object for `tags:`.
  const topicRe = /topic\s*:\s*Topic\.([A-Z_]+)/g;
  let tm;
  while ((tm = topicRe.exec(src)) !== null) {
    if (!isCode[tm.index]) continue;
    const topic = tm[1];
    // Find the enclosing object literal containing this topic field.
    // Scan backwards for the matching open-brace, accounting for nested braces
    // and skipping anything inside strings/comments via the code mask.
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

    // Scan forwards for the matching close-brace.
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
    const id = idMatch[1];

    // Extract tags (array of string literals on a single line in these files).
    const tagsMatch = block.match(/tags\s*:\s*\[([^\]]*)\]/);
    let tags = [];
    if (tagsMatch) {
      tags = tagsMatch[1]
        .split(',')
        .map(s => s.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean);
    }
    out.push({ id, topic, tags, sourceFile: filename });
  }
  return out;
}

function suggestConcepts(tags, tagToConcepts) {
  const concepts = new Set();
  const matchedTags = [];
  const unmatchedTags = [];
  for (const tag of tags) {
    const key = String(tag).toLowerCase().trim();
    const mapped = tagToConcepts[key];
    if (mapped && mapped.length > 0) {
      matchedTags.push(tag);
      mapped.forEach(c => concepts.add(c));
    } else {
      unmatchedTags.push(tag);
    }
  }
  return {
    suggested: Array.from(concepts),
    matchedTags,
    unmatchedTags,
  };
}

function classifyConfidence(tags, suggested) {
  if (tags.length === 0) return 'NONE';
  if (suggested.length > 0) return 'HIGH';
  return 'LOW';
}

function main() {
  const { tagToConcepts, conceptIds } = loadRegistry();
  const registryConceptSet = new Set(conceptIds);
  console.log(`Registry: ${conceptIds.length} concepts, ${Object.keys(tagToConcepts).length} tag→concept mappings.`);

  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.ts') && isCourseFile(f));
  const proposals = [];
  let totalQuestions = 0;

  for (const filename of files) {
    const src = fs.readFileSync(path.join(DATA_DIR, filename), 'utf8');
    const questions = extractQuestions(src, filename);
    totalQuestions += questions.length;

    for (const q of questions) {
      const { suggested, matchedTags, unmatchedTags } = suggestConcepts(q.tags, tagToConcepts);
      proposals.push({
        id: q.id,
        sourceFile: q.sourceFile,
        topic: q.topic,
        currentTags: q.tags,
        suggestedConcepts: suggested,
        matchedTags,
        unmatchedTags,
        confidence: classifyConfidence(q.tags, suggested),
      });
    }
  }

  // Stats summary by confidence tier.
  const byTier = { HIGH: 0, LOW: 0, NONE: 0 };
  const conceptCounts = {};
  const unmatchedTagCounts = {};
  for (const p of proposals) {
    byTier[p.confidence] = (byTier[p.confidence] || 0) + 1;
    for (const c of p.suggestedConcepts) {
      conceptCounts[c] = (conceptCounts[c] || 0) + 1;
    }
    for (const t of p.unmatchedTags) {
      const key = String(t).toLowerCase().trim();
      unmatchedTagCounts[key] = (unmatchedTagCounts[key] || 0) + 1;
    }
  }

  // Sort proposals: NONE first (worst), then LOW, then HIGH — easiest to triage.
  const tierRank = { NONE: 0, LOW: 1, HIGH: 2 };
  proposals.sort((a, b) => tierRank[a.confidence] - tierRank[b.confidence]);

  const result = {
    summary: {
      filesScanned: files.length,
      totalQuestions,
      byConfidence: byTier,
      conceptHistogram: conceptCounts,
    },
    proposals,
  };

  fs.writeFileSync(OUTPUT, JSON.stringify(result, null, 2));

  console.log(`Course: ${COURSE}. Scanned ${files.length} files, ${totalQuestions} questions.`);
  console.log(`Confidence: HIGH=${byTier.HIGH}  LOW=${byTier.LOW}  NONE=${byTier.NONE}`);

  console.log(`\nTop matched concepts (concepts the existing tags do reach):`);
  Object.entries(conceptCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .forEach(([c, n]) => console.log(`  ${n.toString().padStart(4)}  ${c}`));

  console.log(`\nTop unmapped tags (candidates for TAG_TO_CONCEPTS or new concepts):`);
  Object.entries(unmatchedTagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .forEach(([t, n]) => console.log(`  ${n.toString().padStart(4)}  ${t}`));

  // Surface concepts in conceptRegistry.ts that match ZERO questions —
  // those are oversized, wrongly-named, or have no tag in the bootstrap map yet.
  const missing = [...registryConceptSet].filter(c => !conceptCounts[c]);
  if (missing.length > 0) {
    console.log(`\nConcepts in registry with ZERO questions matched (resize/rename/add tags):`);
    missing.forEach(c => console.log(`  ${c}`));
  }

  console.log(`\nWrote ${OUTPUT}`);
}

main();
