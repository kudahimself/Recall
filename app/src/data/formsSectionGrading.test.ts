import { questions } from './questions';
import { webdevOrderedQuestions } from './webdevOrderedQuestions';
import { advancedWebdevOrderedQuestions } from './advancedWebdevOrderedQuestions';
import {
  QuestionType, CodingQuestion, ClozeCodeQuestion, ParsonsQuestion, MultipleChoiceQuestion, Topic, CodeLanguage,
} from '../types';
import { gradeCodingSubmission } from '../utils/codeValidator';

const formsQuestions = questions.filter(q => q.topic === Topic.NEXT_FORMS_VALIDATION);
const formsCoding = formsQuestions.filter(q => q.type === QuestionType.CODING) as CodingQuestion[];

function passes(question: CodingQuestion, code: string): boolean {
  const results = gradeCodingSubmission(question, code);
  return results.length > 0 && results.every(r => r.verdict === 'pass');
}

function hardFails(question: CodingQuestion, code: string): boolean {
  return gradeCodingSubmission(question, code).some(r => r.verdict === 'fail');
}

function branches(q: CodingQuestion): string[] {
  const sep = q.language === CodeLanguage.SQL ? /\n\s*--\s*OR\s*\n/i : /\n\s*#\s*OR\s*\n/i;
  return q.solution.split(sep).map(s => s.trim()).filter(Boolean);
}

function coding(id: string): CodingQuestion {
  const q = formsCoding.find(x => x.id === id);
  if (!q) throw new Error(`missing ${id}`);
  return q;
}

function swap(code: string, from: string, to: string): string {
  if (!code.includes(from)) throw new Error(`"${from.slice(0, 40)}" is not in the reference`);
  return code.replace(from, to);
}

describe('Web Dev Forms & Validation section grading', () => {
  it('has all 25 section questions, each once in the ordered bank', () => {
    expect(formsQuestions.length).toBe(25);
    const ordered = [...webdevOrderedQuestions, ...advancedWebdevOrderedQuestions];
    for (const q of formsQuestions) {
      expect({ id: q.id, inBank: ordered.filter(x => x.id === q.id).length }).toEqual({ id: q.id, inBank: 1 });
    }
  });

  it.each(formsCoding.map(q => [q.id, q] as const))('%s: every reference branch passes the grader', (_id, q) => {
    for (const branch of branches(q)) {
      expect({ id: q.id, branch: branch.slice(0, 60), pass: passes(q, branch) })
        .toEqual({ id: q.id, branch: branch.slice(0, 60), pass: true });
    }
  });

  it.each(formsCoding.map(q => [q.id, q] as const))('%s: the starter code is not accepted', (_id, q) => {
    expect(passes(q, q.starterCode || '')).toBe(false);
  });

  it.each(formsCoding.map(q => [q.id, q] as const))('%s: has a requires guard every branch satisfies', (_id, q) => {
    expect(Array.isArray(q.requires) && q.requires.length > 0).toBe(true);
    for (const branch of branches(q)) {
      for (const r of q.requires || []) {
        const hit = typeof r === 'string' ? branch.toLowerCase().includes(r.toLowerCase()) : r.test(branch);
        expect({ id: q.id, requires: String(r), hit }).toEqual({ id: q.id, requires: String(r), hit: true });
      }
    }
  });

  it('rejects a login form with no pattern rule or with no handleSubmit in next-forms-1', () => {
    const q = coding('next-forms-1');
    const ref = branches(q)[0];
    expect(hardFails(q, ref.replace(/pattern: \{[\s\S]*?\},\n/, ''))).toBe(true);
    expect(hardFails(q, swap(ref, '<form onSubmit={handleSubmit(onSubmit)}>', '<form onSubmit={onSubmit}>'))).toBe(true);
  });

  it('rejects a refine with no path in next-forms-2, and accepts a destructured comparison', () => {
    const q = coding('next-forms-2');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, '    path: ["confirmPassword"],\n', ''))).toBe(true);
    const destructured = swap(ref, '(data) => data.password === data.confirmPassword', '({ password, confirmPassword }) => password === confirmPassword');
    expect(hardFails(q, destructured)).toBe(false);
  });

  it('rejects a form with no resolver in next-forms-3', () => {
    const q = coding('next-forms-3');
    expect(hardFails(q, swap(branches(q)[0], '{\n    resolver: zodResolver(registrationSchema),\n  }', ''))).toBe(true);
  });

  it('rejects a comment form with no empty default, or with no awaited postComment, in next-forms-10', () => {
    const q = coding('next-forms-10');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, '{\n    defaultValues: { comment: "" },\n  }', ''))).toBe(true);
    expect(hardFails(q, swap(ref, 'await postComment(data);', 'postComment(data);'))).toBe(true);
  });

  it('rejects a Server Action with no "use server" or that returns the raw values in next-forms-6', () => {
    const q = coding('next-forms-6');
    expect(hardFails(q, swap(branches(q)[0], '"use server";\n', ''))).toBe(true);
    expect(hardFails(q, swap(branches(q)[1], 'data: parsed.data', 'data: rawData'))).toBe(true);
  });

  it('rejects a published default that breaks the resolver types, and a missing revalidatePath, in proj-forms-1', () => {
    const q = coding('proj-forms-1');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, 'published: z.boolean(),\n});', 'published: z.boolean().default(false),\n});'))).toBe(true);
    expect(hardFails(q, swap(ref, '  revalidatePath("/posts");\n', ''))).toBe(true);
  });

  it('rejects a Next.js 14 style edit page (params read without await) in proj-forms-2', () => {
    const q = coding('proj-forms-2');
    const wrong = swap(swap(branches(q)[0], 'params: Promise<{ id: string }>;', 'params: { id: string };'), 'const { id } = await params;', 'const { id } = params;');
    expect(hardFails(q, wrong)).toBe(true);
  });

  it('every cloze fills to its solution', () => {
    for (const q of formsQuestions.filter(x => x.type === QuestionType.CLOZE_CODE) as ClozeCodeQuestion[]) {
      let i = 0;
      const filled = q.template.replace(/___/g, () => q.blanks[i++]);
      expect({ id: q.id, blanks: i, filled }).toEqual({ id: q.id, blanks: q.blanks.length, filled: q.solution });
    }
  });

  it('every Parsons answer joins to its solution and no distractor is an answer line', () => {
    for (const q of formsQuestions.filter(x => x.type === QuestionType.PARSONS) as ParsonsQuestion[]) {
      expect(q.correctOrder.join('\n')).toBe(q.solution);
      for (const d of q.distractorLines || []) expect(q.correctOrder.includes(d)).toBe(false);
    }
  });

  it('every MCQ in the section has exactly one correct option', () => {
    for (const q of formsQuestions.filter(x => x.type === QuestionType.MULTIPLE_CHOICE) as MultipleChoiceQuestion[]) {
      expect({ id: q.id, correct: q.options.filter(o => o.isCorrect).length }).toEqual({ id: q.id, correct: 1 });
    }
  });

  it('no question in the section contains an em dash', () => {
    for (const q of formsQuestions) {
      expect({ id: q.id, emDash: JSON.stringify(q).includes('—') }).toEqual({ id: q.id, emDash: false });
    }
  });
});
