#!/usr/bin/env node
/**
 * Wire all CLOZE / PARSONS / PREDICT questions across the topic_py_*.ts files
 * into backendOrderedQuestions.ts, grouped by topic + difficulty.
 *
 * Strategy:
 *   - Read every topic_py_*.ts; collect each question's id, type, difficulty.
 *   - Filter to CLOZE_CODE / PARSONS / PREDICT_OUTPUT only.
 *   - Skip ids already present in backendOrderedQuestions.ts.
 *   - Append a new section at the end of the Python Advanced curation
 *     (immediately before the next `// ===== STEP …` marker) containing
 *     the missing ids, grouped per topic + difficulty.
 *
 * The selectNextQuestion sort handles MCQ→PREDICT→PARSONS→CLOZE→CODING
 * ordering within (topic, difficulty); the bank position just acts as a
 * tiebreaker. We list them topic-by-topic so the section is readable.
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const BANK_FILE = path.join(DATA_DIR, 'backendOrderedQuestions.ts');

// Topic ordering follows backendOrderedQuestions.ts comment numbering (1..22).
// Topics not in this list still get included, alphabetically, at the end.
const PYTHON_ADVANCED_TOPICS = [
  'type_hints',
  'dataclasses',
  'comprehensions',
  'collections',
  'itertools',
  'functools',
  'context_managers',
  'magic_methods',
  'http',
  'async',
  'concurrency',
  'regex',
  'datetime_paths',
  'serialization',
  'pydantic',
  'logging',
  'testing',
  'security',
  'shell_os',
  'cli',
  'packaging',
  'advanced_capstone',
  'modern',
  'modules',
  'oop',
  'decorators',
  'error_handling',
  'file_io',
  'functions',
  'data_structures',
  'basics',
  'daily_patterns',
  'project',
];

const WORKED_TYPES = new Set(['CLOZE_CODE', 'PARSONS', 'PREDICT_OUTPUT']);

// Split the top-level array body into balanced `{...}` blocks so we don't
// accidentally capture nested option ids (MCQs have inner `id: 'a'` etc).
function splitTopLevelBlocks(src) {
  const start = src.indexOf('= [');
  const end = src.lastIndexOf('];');
  if (start < 0 || end < 0) return [];
  const body = src.slice(start + 3, end);
  const blocks = [];
  let depth = 0, buf = '', inStr = false, strCh = '', inBT = false, prev = '';
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
        if (depth === 0) { blocks.push(buf); buf = ''; }
      }
    }
    prev = c;
  }
  return blocks;
}

function collectQuestions() {
  const byTopic = {};
  for (const file of fs.readdirSync(DATA_DIR)) {
    if (!/^topic_py_.*\.ts$/.test(file)) continue;
    const topicSlug = file.replace(/^topic_py_/, '').replace(/\.ts$/, '');
    const src = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
    const items = [];
    for (const block of splitTopLevelBlocks(src)) {
      const idM = block.match(/\bid:\s*'([^']+)'/);
      const tyM = block.match(/\btype:\s*QuestionType\.(\w+)/);
      const dfM = block.match(/\bdifficulty:\s*Difficulty\.(\w+)/);
      if (!idM || !tyM || !dfM) continue;
      items.push({ id: idM[1], type: tyM[1], difficulty: dfM[1] });
    }
    byTopic[topicSlug] = items;
  }
  return byTopic;
}

function bankIds(bankSrc) {
  const set = new Set();
  const re = /\bq\(\s*'([^']+)'\s*\)/g;
  let m;
  while ((m = re.exec(bankSrc)) !== null) set.add(m[1]);
  return set;
}

const DIFF_ORDER = { BEGINNER: 0, INTERMEDIATE: 1, ADVANCED: 2 };
const TYPE_ORDER = {
  MULTIPLE_CHOICE: 0,
  PREDICT_OUTPUT: 1,
  PARSONS: 2,
  CLOZE_CODE: 3,
  CODING: 4,
};

function genTopicBlock(topicSlug, missingItems) {
  if (missingItems.length === 0) return '';
  // Sort by difficulty then type then id
  missingItems.sort((a, b) => {
    const d = (DIFF_ORDER[a.difficulty] ?? 99) - (DIFF_ORDER[b.difficulty] ?? 99);
    if (d !== 0) return d;
    const t = (TYPE_ORDER[a.type] ?? 99) - (TYPE_ORDER[b.type] ?? 99);
    if (t !== 0) return t;
    return a.id.localeCompare(b.id);
  });

  const lines = [`  // ${topicSlug}`];
  let curDiff = null;
  let bucket = [];
  const flush = () => {
    if (bucket.length === 0) return;
    // Wrap ~3 per line
    for (let i = 0; i < bucket.length; i += 3) {
      const chunk = bucket.slice(i, i + 3).map(id => `q('${id}')`).join(', ');
      lines.push(`  ${chunk},`);
    }
    bucket = [];
  };
  for (const item of missingItems) {
    if (item.difficulty !== curDiff) {
      flush();
      curDiff = item.difficulty;
      lines.push(`  // ${curDiff.toLowerCase()}`);
    }
    bucket.push(item.id);
  }
  flush();
  return lines.join('\n');
}

function main() {
  const args = process.argv.slice(2);
  const DRY = args.includes('--dry-run');

  const byTopic = collectQuestions();
  const bankSrc = fs.readFileSync(BANK_FILE, 'utf8');
  // Strip any prior auto-generated section BEFORE computing inBank — otherwise
  // re-runs see the previously-wired ids and skip them on the rewrite.
  const cleanedSrc = bankSrc.replace(
    /\n\n  \/\/ ===== STEP 2e: PYTHON ADVANCED — WORKED EXAMPLES =====[\s\S]*?(?=\n  \/\/ ===== STEP)/,
    '',
  );
  const inBank = bankIds(cleanedSrc);

  const blocks = [];
  let totalMissing = 0;
  const orderedTopics = [...PYTHON_ADVANCED_TOPICS];
  for (const slug of Object.keys(byTopic).sort()) {
    if (!orderedTopics.includes(slug)) orderedTopics.push(slug);
  }

  for (const slug of orderedTopics) {
    const items = byTopic[slug] || [];
    const missing = items.filter(it => WORKED_TYPES.has(it.type) && !inBank.has(it.id));
    if (missing.length === 0) continue;
    totalMissing += missing.length;
    blocks.push(genTopicBlock(slug, missing));
  }

  if (totalMissing === 0) {
    console.log('Nothing to wire — every worked example is already in the bank.');
    return;
  }

  const section = [
    '',
    '  // ===== STEP 2e: PYTHON ADVANCED — WORKED EXAMPLES =====',
    '  // Auto-generated by scripts/wire-worked-examples.js. Each topic\'s cloze /',
    '  // parsons / predict-output questions land here so the selectNextQuestion',
    '  // sort can serve them at the right (topic, difficulty, type) slot. The',
    '  // existing per-topic curation above is preserved.',
    blocks.join('\n\n'),
    '',
  ].join('\n');

  // Insertion point: just before `// ===== STEP 3: DJANGO =====`
  const marker = '  // ===== STEP 3: DJANGO =====';
  const reIdx = cleanedSrc.indexOf(marker);
  if (reIdx < 0) {
    console.error('ERROR: cannot find STEP 3: DJANGO marker in bank file.');
    process.exit(1);
  }
  const out = cleanedSrc.slice(0, reIdx) + section + '\n' + cleanedSrc.slice(reIdx);

  if (DRY) {
    console.log(`Would wire ${totalMissing} worked-example ids across ${blocks.length} topics.`);
    console.log('\nPreview (first 60 lines of new section):\n');
    console.log(section.split('\n').slice(0, 60).join('\n'));
  } else {
    fs.writeFileSync(BANK_FILE, out, 'utf8');
    console.log(`Wired ${totalMissing} worked-example ids across ${blocks.length} topics into ${path.basename(BANK_FILE)}.`);
  }
}

main();
