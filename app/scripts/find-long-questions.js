const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

function readTemplateLiteral(src, i) {
  if (src[i] !== '`') return null;
  let j = i + 1;
  while (j < src.length) {
    const c = src[j];
    if (c === '\\') { j += 2; continue; }
    if (c === '`') return { body: src.slice(i + 1, j), end: j + 1 };
    j++;
  }
  return null;
}

function readQuotedString(src, i) {
  const quote = src[i];
  if (quote !== "'" && quote !== '"') return null;
  let j = i + 1;
  while (j < src.length) {
    if (src[j] === '\\') { j += 2; continue; }
    if (src[j] === quote) return { body: src.slice(i + 1, j), end: j + 1 };
    j++;
  }
  return null;
}

function extractField(chunk, name) {
  const re = new RegExp(`(^|[\\s,{])${name}:\\s*`, 'g');
  const m = re.exec(chunk);
  if (!m) return null;
  let i = m.index + m[0].length;
  while (i < chunk.length && /\s/.test(chunk[i])) i++;
  if (chunk[i] === '`') {
    const lit = readTemplateLiteral(chunk, i);
    return lit ? lit.body : null;
  }
  if (chunk[i] === "'" || chunk[i] === '"') {
    const q = readQuotedString(chunk, i);
    return q ? q.body : null;
  }
  return null;
}

function scanFiles() {
  const files = fs.readdirSync(DATA_DIR).filter(f => f.startsWith('topic_py_') && f.endsWith('.ts'));
  const questions = [];

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Split into chunks by id:
    const idRe = /id:\s*['"]([^'"]+)['"]/g;
    const ids = [];
    let m;
    while ((m = idRe.exec(content))) {
      ids.push({ id: m[1], index: m.index });
    }

    for (let i = 0; i < ids.length; i++) {
      const start = ids[i].index;
      const end = i + 1 < ids.length ? ids[i + 1].index : content.length;
      const chunk = content.slice(start, end);
      
      const isCoding = /type:\s*QuestionType\.CODING/.test(chunk);
      if (isCoding) {
        const questionText = extractField(chunk, 'question') || '';
        const solutionText = extractField(chunk, 'solution') || '';
        if (solutionText.includes('print(') && solutionText.length > 300) {
          questions.push({
            id: ids[i].id,
            file,
            questionLength: questionText.length,
            solutionLength: solutionText.length,
            questionText,
            solutionText
          });
        }
      }
    }
  }

  console.log(`FOUND ${questions.length} PYTHON CODING QUESTIONS WITH PRINT() IN SOLUTION:`);
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    console.log(`${i+1}. [${q.id}] in ${q.file} (Sol: ${q.solutionLength} chars)`);
    console.log(`   Prompt: ${q.questionText.slice(0, 150).replace(/\n/g, ' ')}...`);
  }
}

scanFiles();
