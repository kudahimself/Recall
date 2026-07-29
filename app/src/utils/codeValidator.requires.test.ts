/**
 * `requires` satisfiability guard.
 *
 * A `requires` entry is checked against the raw submission before anything else
 * runs, so a token that appears in only SOME of a solution's `# OR` / `-- OR`
 * branches makes the other branches unreachable: the learner writes an answer
 * the question itself lists as correct and gets hard-failed.
 *
 * This caught tsql-pivot-1, which required 'PIVOT' while its primary solution
 * was conditional aggregation (`SUM(CASE WHEN …)`) with no PIVOT token at all.
 */
import { questions } from '../data/questions';
import { QuestionType, CodeLanguage } from '../types';

describe('requires entries are satisfiable by every solution branch', () => {
  const offenders: string[] = [];

  questions.forEach(q => {
    if (q.type !== QuestionType.CODING) return;
    const reqs = q.requires || q.requiredKeywords;
    if (!reqs || reqs.length === 0) return;

    const sep = q.language === CodeLanguage.SQL ? /\n\s*--\s*OR\s*\n/i : /\n\s*#\s*OR\s*\n/i;
    const branches = q.solution.split(sep).map(s => s.trim()).filter(Boolean);

    branches.forEach((branch, i) => {
      reqs.forEach(kw => {
        const ok = typeof kw === 'string' ? branch.includes(kw) : kw.test(branch);
        if (!ok) {
          offenders.push(`${q.id} branch ${i + 1} does not satisfy ${String(kw)}`);
        }
      });
    });
  });

  it('has no unreachable solution branch', () => {
    expect(offenders).toEqual([]);
  });
});
