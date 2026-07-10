import { questions } from '../src/data/questions';
import { BACKEND_PATH_ORDER, BACKEND_SECTIONS, getCourseForTopic } from '../src/utils/courseConfig';
import { Course, QuestionType, Difficulty } from '../src/types';

const sections = BACKEND_SECTIONS;
const order = BACKEND_PATH_ORDER;

const pad = (s: string, n: number) => s.padEnd(n).slice(0, n);
const ipad = (n: number, w: number) => String(n).padStart(w);

console.log(pad('SECTION', 38) + '  ' + pad('TOPIC', 42) + '  ' + 'N'.padStart(4) + '   ' + 'MCQ'.padStart(3) + ' ' + 'COD'.padStart(3) + ' ' + 'PAR'.padStart(3) + ' ' + 'PRD'.padStart(3) + ' ' + 'CLZ'.padStart(3) + '    ' + 'B'.padStart(3) + ' ' + 'I'.padStart(3) + ' ' + 'A'.padStart(3));
console.log('='.repeat(130));

for (const sectionName of order) {
  const section = sections[sectionName];
  if (!section) continue;
  let firstUnit = true;
  for (const [unitName, topicKeys] of Object.entries(section.topics)) {
    const qs = questions.filter(q => topicKeys.includes(q.topic) && getCourseForTopic(q.topic) === Course.BACKEND);
    if (qs.length === 0) continue;
    const c = (t: QuestionType) => qs.filter(q => q.type === t).length;
    const d = (l: Difficulty) => qs.filter(q => q.difficulty === l).length;
    const sec = firstUnit ? pad(sectionName, 38) : pad('', 38);
    const unit = pad(unitName, 42);
    const line = sec + '  ' + unit + '  ' + ipad(qs.length, 4) + '   ' +
      ipad(c(QuestionType.MULTIPLE_CHOICE), 3) + ' ' +
      ipad(c(QuestionType.CODING), 3) + ' ' +
      ipad(c(QuestionType.PARSONS), 3) + ' ' +
      ipad(c(QuestionType.PREDICT_OUTPUT), 3) + ' ' +
      ipad(c(QuestionType.CLOZE_CODE), 3) + '    ' +
      ipad(d(Difficulty.BEGINNER), 3) + ' ' +
      ipad(d(Difficulty.INTERMEDIATE), 3) + ' ' +
      ipad(d(Difficulty.ADVANCED), 3);
    console.log(line);
    firstUnit = false;
  }
  console.log('-'.repeat(130));
}
