#!/usr/bin/env node
/**
 * audit-async-order.js
 *
 * Lists all PY_ASYNC questions in presentation order (from backendOrderedQuestions.ts)
 * showing: order #, ID, type, difficulty, and what it's testing.
 */

const fs = require('fs');
const path = require('path');

// Read backendOrderedQuestions.ts and extract async question order
const orderedPath = path.join(__dirname, '../src/data/backendOrderedQuestions.ts');
const orderedContent = fs.readFileSync(orderedPath, 'utf8');

// Extract all py-async/py-adv-async/py-gap-async question IDs in order
const asyncOrder = [];
const qRegex = /q\('(py-(?:async|adv-async|gap-async|fut|concurrency)-[^']+)'\)/g;
let match;

// Find the async section boundaries
const asyncStart = orderedContent.indexOf('// 10. Async / await');
const asyncEnd = orderedContent.indexOf('// 11a. Threading', asyncStart);
const asyncSection = orderedContent.slice(asyncStart, asyncEnd);

while ((match = qRegex.exec(asyncSection)) !== null) {
  const id = match[1];
  if (id.includes('async') || id.includes('gap-async')) {
    asyncOrder.push(id);
  }
}

// Read topic_py_async.ts to get question metadata
const topicPath = path.join(__dirname, '../src/data/topic_py_async.ts');
const topicContent = fs.readFileSync(topicPath, 'utf8');

// Parse questions from the TypeScript file
const questions = [];
const questionRegex = /{\s*id:\s*'([^']+)',\s*type:\s*QuestionType\.(\w+),\s*difficulty:\s*Difficulty\.(\w+),[\s\S]*?question:\s*(?:'([^']*)'|`([^`]*)`|"([^"]*)")/g;

while ((match = questionRegex.exec(topicContent)) !== null) {
  const id = match[1];
  const type = match[2];
  const difficulty = match[3];
  const question = (match[4] || match[5] || match[6] || '').trim().slice(0, 100);

  questions.push({ id, type, difficulty, question });
}

// Create lookup map
const questionMap = {};
questions.forEach(q => {
  questionMap[q.id] = q;
});

// Also check for gap-async questions
const gapAsyncPath = path.join(__dirname, '../src/data/pythonGapFillQuestions.ts');
if (fs.existsSync(gapAsyncPath)) {
  const gapContent = fs.readFileSync(gapAsyncPath, 'utf8');
  const gapRegex = /{\s*id:\s*'(py-gap-async-[^']+)',\s*type:\s*QuestionType\.(\w+),\s*difficulty:\s*Difficulty\.(\w+),[\s\S]*?question:\s*(?:'([^']*)'|`([^`]*)`|"([^"]*)")/g;

  while ((match = gapRegex.exec(gapContent)) !== null) {
    const id = match[1];
    const type = match[2];
    const difficulty = match[3];
    const question = (match[4] || match[5] || match[6] || '').trim().slice(0, 100);

    questionMap[id] = { id, type, difficulty, question };
  }
}

console.log('\n=== PY_ASYNC Questions in Presentation Order ===\n');
console.log('Total questions in order:', asyncOrder.length);
console.log();

let prevDifficulty = 'BEGINNER';
let tierNum = 1;

asyncOrder.forEach((id, idx) => {
  const q = questionMap[id];

  if (!q) {
    console.log(`${idx + 1}. ${id} - NOT FOUND IN TOPIC FILE`);
    return;
  }

  // Print tier header when difficulty changes
  if (q.difficulty !== prevDifficulty) {
    console.log();
    console.log(`--- ${q.difficulty} TIER (${tierNum++}) ---`);
    console.log();
    prevDifficulty = q.difficulty;
  }

  const typeDisplay = q.type.padEnd(18);
  const diffDisplay = q.difficulty.charAt(0);
  const questionPreview = q.question.replace(/\n/g, ' ').slice(0, 80);

  console.log(`${String(idx + 1).padStart(3)}. [${diffDisplay}] ${typeDisplay} ${id.padEnd(35)} ${questionPreview}`);
});

console.log();

// Summary by type and difficulty
console.log('\n=== Summary by Difficulty ===\n');

const summary = {
  BEGINNER: { MULTIPLE_CHOICE: 0, PREDICT_OUTPUT: 0, PARSONS: 0, CLOZE_CODE: 0, CODING: 0 },
  INTERMEDIATE: { MULTIPLE_CHOICE: 0, PREDICT_OUTPUT: 0, PARSONS: 0, CLOZE_CODE: 0, CODING: 0 },
  ADVANCED: { MULTIPLE_CHOICE: 0, PREDICT_OUTPUT: 0, PARSONS: 0, CLOZE_CODE: 0, CODING: 0 }
};

asyncOrder.forEach(id => {
  const q = questionMap[id];
  if (q && summary[q.difficulty]) {
    if (!summary[q.difficulty][q.type]) {
      summary[q.difficulty][q.type] = 0;
    }
    summary[q.difficulty][q.type]++;
  }
});

['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].forEach(diff => {
  console.log(`${diff}:`);
  const counts = summary[diff];
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  ['MULTIPLE_CHOICE', 'PREDICT_OUTPUT', 'PARSONS', 'CLOZE_CODE', 'CODING'].forEach(type => {
    if (counts[type] > 0) {
      console.log(`  ${type.padEnd(18)}: ${counts[type]}`);
    }
  });
  console.log(`  Total: ${total}`);
  console.log();
});

console.log('Grand total:', asyncOrder.length);
console.log();

// Verify type ordering within each difficulty tier
console.log('=== Type Order Validation ===\n');

const typeOrder = ['MULTIPLE_CHOICE', 'PREDICT_OUTPUT', 'PARSONS', 'CLOZE_CODE', 'CODING'];
let currentDiff = null;
let currentTypeIdx = -1;
let violations = [];

asyncOrder.forEach((id, idx) => {
  const q = questionMap[id];
  if (!q) return;

  if (q.difficulty !== currentDiff) {
    // New difficulty tier
    currentDiff = q.difficulty;
    currentTypeIdx = -1;
  }

  const qTypeIdx = typeOrder.indexOf(q.type);

  if (qTypeIdx < currentTypeIdx) {
    violations.push({
      position: idx + 1,
      id,
      expectedAfter: typeOrder[currentTypeIdx],
      got: q.type,
      difficulty: q.difficulty
    });
  } else {
    currentTypeIdx = qTypeIdx;
  }
});

if (violations.length === 0) {
  console.log('✓ Type ordering is CORRECT at all difficulty tiers');
  console.log('  (MCQ → PREDICT → PARSONS → CLOZE → CODING)');
} else {
  console.log('✗ Type ordering violations found:');
  violations.forEach(v => {
    console.log(`  Position ${v.position} (${v.difficulty}): ${v.id}`);
    console.log(`    Got ${v.type} after ${v.expectedAfter}`);
  });
}

console.log();
