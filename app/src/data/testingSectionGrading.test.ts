import { questions } from './questions';
import { advancedWebdevOrderedQuestions } from './advancedWebdevOrderedQuestions';
import { QuestionType, CodingQuestion, ClozeCodeQuestion, ParsonsQuestion, Topic } from '../types';
import { gradeCodingSubmission } from '../utils/codeValidator';

const testingQuestions = questions.filter(q => q.topic === Topic.NEXT_TESTING);
const testingCoding = testingQuestions.filter(q => q.type === QuestionType.CODING) as CodingQuestion[];

function passes(question: CodingQuestion, code: string): boolean {
  const results = gradeCodingSubmission(question, code);
  return results.length > 0 && results.every(r => r.verdict === 'pass');
}

function hardFails(question: CodingQuestion, code: string): boolean {
  return gradeCodingSubmission(question, code).some(r => r.verdict === 'fail');
}

function branches(q: CodingQuestion): string[] {
  return q.solution.split(/\n\s*#\s*OR\s*\n/i).map(s => s.trim()).filter(Boolean);
}

function coding(id: string): CodingQuestion {
  const q = testingCoding.find(x => x.id === id);
  if (!q) throw new Error(`missing ${id}`);
  return q;
}

/** A branch with one exact piece of text swapped out; fails loudly if the text is not there. */
function swap(code: string, from: string, to: string): string {
  expect(code).toContain(from);
  return code.replace(from, to);
}

describe('Web Dev Testing section grading', () => {
  it('has all 25 next_testing questions, each once in the ordered bank', () => {
    expect(testingQuestions.length).toBe(25);
    const ordered = advancedWebdevOrderedQuestions.filter(q => q.topic === Topic.NEXT_TESTING).map(q => q.id);
    expect(new Set(ordered).size).toBe(ordered.length);
    expect([...ordered].sort()).toEqual(testingQuestions.map(q => q.id).sort());
  });

  it.each(testingCoding.map(q => [q.id, q] as const))('%s: every reference branch passes the grader and its requires', (_id, q) => {
    for (const branch of branches(q)) {
      expect({ id: q.id, branch: branch.slice(0, 60), pass: passes(q, branch) })
        .toEqual({ id: q.id, branch: branch.slice(0, 60), pass: true });
    }
  });

  it.each(testingCoding.map(q => [q.id, q] as const))('%s: the starter code is not accepted', (_id, q) => {
    expect(passes(q, q.starterCode || '')).toBe(false);
  });

  it.each(testingCoding.map(q => [q.id, q] as const))('%s: has a requires guard', (_id, q) => {
    expect(Array.isArray(q.requires) && q.requires.length > 0).toBe(true);
  });

  it('no JSX reference uses TypeScript-only syntax (the editor runs them as JavaScript)', () => {
    for (const q of testingCoding.filter(x => x.language === 'jsx')) {
      expect({ id: q.id, cast: /\bas\s+jest\.Mock\b|:\s*jest\.Mock\b/.test(q.solution) }).toEqual({ id: q.id, cast: false });
    }
  });

  it('next-testing-1 rejects a disabled test without disabled, a flipped assertion, or a missing click', () => {
    const q = coding('next-testing-1');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, '<Button onClick={handleClick} disabled>', '<Button onClick={handleClick}>'))).toBe(true);
    expect(hardFails(q, swap(ref, 'expect(handleClick).not.toHaveBeenCalled();', 'expect(handleClick).toHaveBeenCalled();'))).toBe(true);
    expect(hardFails(q, swap(ref,
      '    fireEvent.click(screen.getByRole("button", { name: "Click me" }));\n    expect(handleClick).toHaveBeenCalledTimes(1);',
      '    expect(handleClick).toHaveBeenCalledTimes(1);'))).toBe(true);
  });

  it('next-testing-2 rejects a sync getBy for the fetched name and a test with no fetch mock', () => {
    const q = coding('next-testing-2');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, 'await screen.findByRole("heading", { name: "Alice" })', 'screen.getByRole("heading", { name: "Alice" })'))).toBe(true);
    const noMock = ref.replace(/ {2}beforeEach\([\s\S]*?\n {2}\}\);\n\n/, '');
    expect(noMock).not.toContain('jest.fn');
    expect(hardFails(q, noMock)).toBe(true);
    expect(hardFails(q, swap(ref, '    expect(global.fetch).toHaveBeenCalledWith("/api/users/1");\n', ''))).toBe(true);
  });

  it('next-testing-5 rejects a bare toHaveBeenCalled() and a form that is never submitted', () => {
    const q = coding('next-testing-5');
    const ref = branches(q)[0];
    expect(hardFails(q, ref.replace(/expect\(handleSubmit\)\.toHaveBeenCalledWith\(\{[\s\S]*?\}\);/, 'expect(handleSubmit).toHaveBeenCalled();'))).toBe(true);
    expect(hardFails(q, swap(ref, '    fireEvent.click(screen.getByRole("button", { name: "Submit" }));\n', ''))).toBe(true);
  });

  it('next-testing-5 accepts submitting through fireEvent.submit', () => {
    const q = coding('next-testing-5');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, 'fireEvent.click(screen.getByRole("button", { name: "Submit" }));', 'fireEvent.submit(screen.getByRole("button", { name: "Submit" }));'))).toBe(false);
  });

  it('next-testing-9 rejects state changes outside act and a hook called outside renderHook', () => {
    const q = coding('next-testing-9');
    const ref = branches(q)[0];
    const noAct = ref
      .replace('act(() => {\n      result.current.increment();\n    });', 'result.current.increment();')
      .replace('act(() => {\n      result.current.decrement();\n    });', 'result.current.decrement();');
    expect(hardFails(q, noAct)).toBe(true);
    expect(hardFails(q, swap(ref,
      'const { result } = renderHook(() => useCounter());\n    expect(result.current.count).toBe(0);',
      'const result = useCounter();\n    expect(result.count).toBe(0);'))).toBe(true);
  });

  it('next-testing-7 rejects a POST without status 201, MSW 1 rest handlers, and a missing POST handler', () => {
    const q = coding('next-testing-7');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, ', { status: 201 }', ''))).toBe(true);
    expect(hardFails(q, ref.replace(/\n {2}http\.post[\s\S]*?\}\),\n/, '\n'))).toBe(true);
    const mswV1 = 'import { rest } from "msw";\n\nexport const handlers = [\n'
      + '  rest.get("/api/users", (req, res, ctx) => res(ctx.json([{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }]))),\n'
      + '  rest.post("/api/users", async (req, res, ctx) => res(ctx.status(201), ctx.json({ ...(await req.json()), id: 3 }))),\n'
      + '];';
    expect(hardFails(q, mswV1)).toBe(true);
  });

  it('next-testing-11 rejects a test with no URL check, no click, or an unawaited assertion', () => {
    const q = coding('next-testing-11');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, '    await expect(page).toHaveURL(/\\/dashboard/);\n', ''))).toBe(true);
    expect(hardFails(q, swap(ref, '    await page.getByRole("button", { name: "Log In" }).click();\n', ''))).toBe(true);
    expect(hardFails(q, swap(ref,
      'await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();',
      'expect(page.getByRole("heading", { name: "Welcome back" }));'))).toBe(true);
  });

  it('next-testing-15 rejects a server that never listens and names checked with a sync getBy', () => {
    const q = coding('next-testing-15');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, 'beforeAll(() => server.listen());\n', ''))).toBe(true);
    expect(hardFails(q, ref
      .replace('await screen.findByText("Alice")', 'screen.getByText("Alice")')
      .replace('await screen.findByText("Bob")', 'screen.getByText("Bob")'))).toBe(true);
    expect(hardFails(q, ref.replace(/\n {2}it\("shows error message[\s\S]*?\n {2}\}\);\n/, '\n'))).toBe(true);
  });

  it('every cloze template filled with its blanks gives its solution', () => {
    for (const q of testingQuestions.filter(x => x.type === QuestionType.CLOZE_CODE) as ClozeCodeQuestion[]) {
      const parts = q.template.split('___');
      expect({ id: q.id, blanks: parts.length - 1 }).toEqual({ id: q.id, blanks: q.blanks.length });
      const filled = parts.reduce((acc, part, i) => acc + (i > 0 ? q.blanks[i - 1] : '') + part, '');
      expect({ id: q.id, filled }).toEqual({ id: q.id, filled: q.solution });
    }
  });

  it('every Parsons answer joins to its solution, and no distractor is a line of the answer', () => {
    for (const q of testingQuestions.filter(x => x.type === QuestionType.PARSONS) as ParsonsQuestion[]) {
      expect({ id: q.id, joined: q.correctOrder.join('\n') }).toEqual({ id: q.id, joined: q.solution });
      for (const d of q.distractorLines || []) {
        expect({ id: q.id, d, inAnswer: q.correctOrder.includes(d) }).toEqual({ id: q.id, d, inAnswer: false });
      }
    }
  });

  it('every MCQ in the section has exactly one correct option', () => {
    for (const q of testingQuestions.filter(x => x.type === QuestionType.MULTIPLE_CHOICE) as any[]) {
      expect({ id: q.id, correct: q.options.filter((o: any) => o.isCorrect).length }).toEqual({ id: q.id, correct: 1 });
    }
  });

  it('no question in the section contains an em dash', () => {
    for (const q of testingQuestions) {
      expect({ id: q.id, emDash: JSON.stringify(q).includes('—') }).toEqual({ id: q.id, emDash: false });
    }
  });
});
