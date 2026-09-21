import { questions } from './questions';
import { QuestionType, CodeLanguage } from '../types';

// Data-integrity guard over the whole compiled question bank. It catches the
// three "unanswerable question" faults found in the bug hunt (report bugs #2
// and #11): an MCQ with no (or several) correct options, a cloze whose answer
// key contradicts its template, and a coding question with no test cases (which
// leaves it without any described, per-case check of what is being graded).
//
// These checks read structural data only - they do not run the grader - so they
// stay valid regardless of how CodingQuestion / MultipleChoiceQuestion /
// ClozeCodeQuestion evaluate answers.

// Collapse a code string to a whitespace- and comment-free canonical form so
// that assembling a cloze template can be compared against its stored solution
// without tripping on indentation or the teaching comments that templates carry
// but solutions omit (e.g. `# -> ['a', 'b']`). Comment stripping is best-effort
// (a `#`/`//`/`--` inside a string literal would be over-stripped), so the
// comparison is intentionally a containment check (see below) rather than strict
// equality, which tolerates that and the preamble/comment gaps between the two.
function canonicalizeCode(source: string, language: unknown): string {
  let out = source.replace(/\/\*[\s\S]*?\*\//g, '');
  out = out
    .split('\n')
    .map(line => {
      if (language === CodeLanguage.SQL) return line.replace(/--.*$/, '');
      if (language === CodeLanguage.PYTHON) return line.replace(/#.*$/, '');
      return line.replace(/\/\/.*$/, '');
    })
    .join('\n');
  return out.replace(/\s+/g, '');
}

// Substitute a cloze's answer key into its template's `___` slots.
function assembleCloze(template: string, blanks: string[]): string {
  const parts = template.split('___');
  let assembled = parts[0] ?? '';
  for (let i = 0; i < blanks.length; i++) {
    assembled += blanks[i] + (parts[i + 1] ?? '');
  }
  return assembled;
}

describe('question bank integrity', () => {
  const bank = questions as any[];

  test('every multiple-choice question has exactly one correct option', () => {
    const offenders = bank
      .filter(q => q.type === QuestionType.MULTIPLE_CHOICE)
      .map(q => ({
        id: q.id,
        correct: (q.options ?? []).filter((o: any) => o.isCorrect === true).length,
      }))
      .filter(x => x.correct !== 1)
      .map(x => `${x.id} (has ${x.correct} correct)`);

    expect(offenders).toEqual([]);
  });

  test('every cloze template matches its answer key', () => {
    const offenders: string[] = [];

    for (const q of bank) {
      if (q.type !== QuestionType.CLOZE_CODE) continue;

      const blanks: string[] = q.blanks ?? [];
      const markerCount = (q.template.match(/___/g) ?? []).length;

      // The number of `___` slots must equal the number of answer-key entries.
      if (markerCount !== blanks.length) {
        offenders.push(`${q.id} (${markerCount} slots vs ${blanks.length} blanks)`);
        continue;
      }

      // Filling the key into the template must reproduce the stored solution
      // (a template may add teaching comments/preamble the solution omits, so
      // the canonical solution must be *contained* in the canonical assembly -
      // a key that contradicts its template, e.g. `middleName?..length` or
      // `Box<T = string string>`, breaks that containment).
      if (typeof q.solution === 'string') {
        const assembled = canonicalizeCode(assembleCloze(q.template, blanks), q.language);
        const solution = canonicalizeCode(q.solution, q.language);
        if (!assembled.includes(solution)) {
          offenders.push(`${q.id} (filled template does not contain its solution)`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });

  test('every coding question has at least one test case', () => {
    const offenders = bank
      .filter(q => q.type === QuestionType.CODING)
      .filter(q => !Array.isArray(q.testCases) || q.testCases.length === 0)
      .map(q => q.id);

    expect(offenders).toEqual([]);
  });
});
