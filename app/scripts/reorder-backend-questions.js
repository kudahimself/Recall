const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const ORDERED_BANK_PATH = path.join(DATA_DIR, 'backendOrderedQuestions.ts');

const DRANK = { BEGINNER: 0, INTERMEDIATE: 1, ADVANCED: 2 };
const TRANK = { MULTIPLE_CHOICE: 0, PREDICT_OUTPUT: 1, PARSONS: 2, CLOZE_CODE: 3, CODING: 4 };

// Step 1: Scan topic files and extract question metadata
const files = fs.readdirSync(DATA_DIR).filter(f => /^topic_(py|dj)_.*\.ts$/.test(f));
const questionMeta = {}; // id -> { topic, difficulty, type }

function parseTopicFile(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
  const idRe = /^\s+id:\s*['"]([^'"]+)['"]/gm;
  const ms = [];
  let m;
  while ((m = idRe.exec(src))) {
    ms.push({ id: m[1], i: m.index });
  }
  for (let k = 0; k < ms.length; k++) {
    const w = src.slice(ms[k].i, k + 1 < ms.length ? ms[k + 1].i : src.length);
    const typeMatch = /type:\s*QuestionType\.(\w+)/.exec(w);
    const diffMatch = /difficulty:\s*Difficulty\.(\w+)/.exec(w);
    const topicMatch = /topic:\s*Topic\.(\w+)/.exec(w);
    
    if (typeMatch && diffMatch && topicMatch) {
      questionMeta[ms[k].id] = {
        id: ms[k].id,
        type: typeMatch[1],
        difficulty: diffMatch[1],
        topic: topicMatch[1]
      };
    } else {
      console.warn(`Warning: Could not parse metadata for question ${ms[k].id}`);
    }
  }
}

for (const file of files) {
  parseTopicFile(path.join(DATA_DIR, file));
}

// Step 2: Read backendOrderedQuestions.ts and find all q('id') calls
const bankSrc = fs.readFileSync(ORDERED_BANK_PATH, 'utf8');
const arrayStartMarker = 'export const backendOrderedQuestions: Question[] = [';
const arrayStartIndex = bankSrc.indexOf(arrayStartMarker);
if (arrayStartIndex === -1) {
  console.error('Error: Could not find backendOrderedQuestions array in file.');
  process.exit(1);
}

const beforeArray = bankSrc.slice(0, arrayStartIndex + arrayStartMarker.length);
const arrayBody = bankSrc.slice(arrayStartIndex + arrayStartMarker.length);
const arrayEndIndex = arrayBody.lastIndexOf('];');
if (arrayEndIndex === -1) {
  console.error('Error: Could not find closing ]; of the array.');
  process.exit(1);
}

const afterArray = arrayBody.slice(arrayEndIndex);
const arrayContent = arrayBody.slice(0, arrayEndIndex);

// Extract all q('id') matches
const qRe = /q\(['"]([^'"]+)['"]\)/g;
const orderedIds = [];
let mq;
while ((mq = qRe.exec(arrayContent))) {
  orderedIds.push(mq[1]);
}

console.log(`Found ${orderedIds.length} question IDs in ordered bank.`);

// Step 3: Group by topic, keeping the first occurrence order of each topic
const topicOrder = [];
const questionsByTopic = {};

for (const id of orderedIds) {
  const meta = questionMeta[id];
  if (!meta) {
    console.error(`Error: Question ${id} in ordered bank was not found in any topic file.`);
    process.exit(1);
  }
  const t = meta.topic;
  if (!questionsByTopic[t]) {
    questionsByTopic[t] = [];
    topicOrder.push(t);
  }
  questionsByTopic[t].push(meta);
}

// Step 4: Sort questions within each topic
for (const t of topicOrder) {
  questionsByTopic[t].sort((a, b) => {
    const diffDiff = (DRANK[a.difficulty] ?? 99) - (DRANK[b.difficulty] ?? 99);
    if (diffDiff !== 0) return diffDiff;
    return (TRANK[a.type] ?? 99) - (TRANK[b.type] ?? 99);
  });
}

// Step 5: Rebuild the array content
let newArrayContent = '\n';
for (const t of topicOrder) {
  newArrayContent += `  // ===== Topic.${t} =====\n`;
  const qs = questionsByTopic[t];
  
  // Print in groups of 4 for readability, or line-by-line if desired. Let's do 4 per line.
  let line = '  ';
  for (let i = 0; i < qs.length; i++) {
    line += `q('${qs[i].id}'), `;
    if ((i + 1) % 4 === 0 || i === qs.length - 1) {
      newArrayContent += line.trimEnd() + '\n';
      line = '  ';
    }
  }
  newArrayContent += '\n';
}

// Strip trailing newlines and make sure it ends nicely
newArrayContent = newArrayContent.trimEnd() + '\n';

// Step 6: Write the updated file
const finalSrc = beforeArray + newArrayContent + afterArray;
fs.writeFileSync(ORDERED_BANK_PATH, finalSrc, 'utf8');
console.log('Reordered bank written successfully!');
