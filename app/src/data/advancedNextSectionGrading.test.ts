import { questions } from './questions';
import { webdevOrderedQuestions } from './webdevOrderedQuestions';
import { advancedWebdevOrderedQuestions } from './advancedWebdevOrderedQuestions';
import {
  QuestionType, CodingQuestion, ClozeCodeQuestion, ParsonsQuestion, MultipleChoiceQuestion, Topic, CodeLanguage,
} from '../types';
import { gradeCodingSubmission } from '../utils/codeValidator';

const SECTION_TOPICS = [Topic.NEXT_TANSTACK, Topic.NEXT_URL_STATE, Topic.NEXT_ERROR_HANDLING, Topic.NEXT_AUTH_DEEP];
const sectionQuestions = questions.filter(q => SECTION_TOPICS.includes(q.topic as Topic));
const sectionCoding = sectionQuestions.filter(q => q.type === QuestionType.CODING) as CodingQuestion[];

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
  const q = questions.find(x => x.id === id && x.type === QuestionType.CODING) as CodingQuestion | undefined;
  if (!q) throw new Error(`missing ${id}`);
  return q;
}

function swap(code: string, from: string, to: string): string {
  if (!code.includes(from)) throw new Error(`"${from.slice(0, 40)}" is not in the reference`);
  return code.replace(from, to);
}

describe('Web Dev Advanced Next.js Patterns section grading', () => {
  it('has all 59 section questions, each once in the ordered bank', () => {
    expect(sectionQuestions.length).toBe(59);
    const ordered = [...webdevOrderedQuestions, ...advancedWebdevOrderedQuestions];
    for (const q of sectionQuestions) {
      expect({ id: q.id, inBank: ordered.filter(x => x.id === q.id).length }).toEqual({ id: q.id, inBank: 1 });
    }
  });

  it.each(sectionCoding.map(q => [q.id, q] as const))('%s: every reference branch passes the grader', (_id, q) => {
    for (const branch of branches(q)) {
      expect({ id: q.id, branch: branch.slice(0, 60), pass: passes(q, branch) })
        .toEqual({ id: q.id, branch: branch.slice(0, 60), pass: true });
    }
  });

  it.each(sectionCoding.map(q => [q.id, q] as const))('%s: the starter code is not accepted', (_id, q) => {
    expect(passes(q, q.starterCode || '')).toBe(false);
  });

  it.each(sectionCoding.map(q => [q.id, q] as const))('%s: has a requires guard every branch satisfies', (_id, q) => {
    expect(Array.isArray(q.requires) && q.requires.length > 0).toBe(true);
    for (const branch of branches(q)) {
      for (const r of q.requires || []) {
        const hit = typeof r === 'string' ? branch.toLowerCase().includes(r.toLowerCase()) : r.test(branch);
        expect({ id: q.id, requires: String(r), hit }).toEqual({ id: q.id, requires: String(r), hit: true });
      }
    }
  });

  it('rejects a query keyed ["user"] or with no error guard in tanstack-1, and accepts status checks', () => {
    const q = coding('tanstack-1');
    const ref = branches(q)[1];
    expect(hardFails(q, swap(ref, 'queryKey: ["users"]', 'queryKey: ["user"]'))).toBe(true);
    expect(hardFails(q, swap(ref, '  if (isError) return <p>Error: {error.message}</p>;\n', ''))).toBe(true);
    const byStatus = swap(swap(swap(ref, 'const { data, isPending, isError, error } =', 'const { data, status, error } ='),
      'if (isPending)', 'if (status === "pending")'), 'if (isError)', 'if (status === "error")');
    expect(hardFails(q, byStatus)).toBe(false);
  });

  it('rejects a mutation with no invalidation or a button never disabled in tanstack-2', () => {
    const q = coding('tanstack-2');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(swap(ref, '      queryClient.invalidateQueries({ queryKey: ["users"] });\n', ''), '  const queryClient = useQueryClient();\n', ''))).toBe(true);
    expect(hardFails(q, swap(ref, ' disabled={mutation.isPending}', ''))).toBe(true);
  });

  it('rejects an optimistic update with no cancelQueries or with onSuccess for onSettled in tanstack-6', () => {
    const q = coding('tanstack-6');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, '      await queryClient.cancelQueries({ queryKey: ["todos"] });\n', ''))).toBe(true);
    expect(hardFails(q, swap(ref, 'onSettled:', 'onSuccess:'))).toBe(true);
  });

  it('rejects a module-level or eagerly built QueryClient in tanstack-7', () => {
    const q = coding('tanstack-7');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, 'useState(() => new QueryClient())', 'useState(new QueryClient())'))).toBe(true);
    expect(hardFails(q, swap(swap(ref, '  const [queryClient] = useState(() => new QueryClient());\n', ''),
      'export default function', 'const queryClient = new QueryClient();\n\nexport default function'))).toBe(true);
  });

  it('rejects a search box that pushes, rebuilds the query or never clears its timer in next-url-state-1', () => {
    const q = coding('next-url-state-1');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, 'router.replace(', 'router.push('))).toBe(true);
    expect(hardFails(q, swap(ref, 'new URLSearchParams(searchParams.toString())', 'new URLSearchParams()'))).toBe(true);
    expect(hardFails(q, swap(ref, '    return () => clearTimeout(timer);\n', ''))).toBe(true);
  });

  it('rejects page links that drop the other params in next-url-state-6 and proj-url-1', () => {
    const pager = coding('next-url-state-6');
    expect(hardFails(pager, swap(branches(pager)[0], 'new URLSearchParams(searchParams.toString())', 'new URLSearchParams()'))).toBe(true);
    const page = coding('proj-url-1');
    const ref = branches(page)[0];
    const d = '$'; // the reference holds a template literal, so build "${" without writing it in a string
    const keepParams = `const params = new URLSearchParams(query);\n    params.set("page", String(n));\n    return \`/products?${d}{params.toString()}\`;`;
    expect(hardFails(page, swap(ref, keepParams, `return \`/products?page=${d}{n}\`;`))).toBe(true);
    expect(hardFails(page, swap(ref, '    params.delete("page"); // new results start at page 1\n', ''))).toBe(true);
  });

  it('rejects the Next.js 14 form (searchParams read without await) in next-url-state-2 and proj-url-1', () => {
    const q = coding('next-url-state-2');
    expect(hardFails(q, swap(branches(q)[0], '= await searchParams;', '= searchParams;'))).toBe(true);
    const p = coding('proj-url-1');
    expect(hardFails(p, swap(branches(p)[0], 'const query = await searchParams;', 'const query = searchParams;'))).toBe(true);
  });

  it('rejects an infinite feed with no in-flight guard or no observer cleanup in proj-url-2', () => {
    const q = coding('proj-url-2');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, 'entries[0].isIntersecting && hasNextPage && !isFetchingNextPage', 'entries[0].isIntersecting && hasNextPage'))).toBe(true);
    expect(hardFails(q, swap(ref, '    return () => observer.disconnect();\n', ''))).toBe(true);
  });

  it('rejects error.tsx with no "use client" or with reset called in render, and accepts onClick={reset}, in next-error-handling-1', () => {
    const q = coding('next-error-handling-1');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, '"use client";\n', ''))).toBe(true);
    expect(hardFails(q, swap(ref, 'onClick={() => reset()}', 'onClick={reset()}'))).toBe(true);
    expect(hardFails(q, swap(ref, 'onClick={() => reset()}', 'onClick={reset}'))).toBe(false);
  });

  it('rejects a Server Action that parses and throws, or saves the raw form, in next-error-handling-2', () => {
    const q = coding('next-error-handling-2');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, 'userSchema.safeParse(', 'userSchema.parse('))).toBe(true);
    expect(hardFails(q, swap(ref, 'await saveUser(result.data);', 'await saveUser(Object.fromEntries(formData));'))).toBe(true);
  });

  it('rejects a Server Action that turns every save error into data, or swallows the unexpected ones, in next-error-handling-2', () => {
    const q = coding('next-error-handling-2');
    const ref = branches(q)[0];
    const fieldError = '      return { success: false, errors: { email: ["Email already registered"] } };\n';
    expect(hardFails(q, swap(ref, `    if (error instanceof EmailTakenError) {\n${fieldError}    }\n    throw error;\n`, fieldError))).toBe(true);
    expect(hardFails(q, swap(ref, '    throw error;\n', '    console.error(error);\n    return { success: false };\n'))).toBe(true);
    expect(hardFails(q, swap(ref, '    throw error;', '    throw new Error("Could not save the user");'))).toBe(true);
  });

  it('rejects a route handler with no try/catch, a 200 on error, or an unawaited call in next-error-handling-6', () => {
    const q = coding('next-error-handling-6');
    const ref = branches(q)[1];
    expect(hardFails(q, swap(ref, '{ status: 500 }', '{ status: 200 }'))).toBe(true);
    expect(hardFails(q, swap(ref, 'const order = await getOrderById(id);', 'const order = getOrderById(id);'))).toBe(true);
    const noTry = 'import { NextRequest, NextResponse } from "next/server";\nimport { getOrderById } from "@/lib/db";\n\n'
      + 'export async function GET(\n  request: NextRequest,\n  { params }: { params: Promise<{ id: string }> }\n) {\n'
      + '  const { id } = await params;\n  const order = await getOrderById(id);\n  return NextResponse.json(order);\n}';
    expect(hardFails(q, noTry)).toBe(true);
  });

  it('rejects an unawaited auth() in next-auth-deep-2', () => {
    const q = coding('next-auth-deep-2');
    expect(hardFails(q, swap(branches(q)[0], 'const session = await auth();', 'const session = auth();'))).toBe(true);
  });

  it('rejects callbacks with no session copy or no user guard in next-auth-deep-6', () => {
    const q = coding('next-auth-deep-6');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, '      session.user.role = token.role;\n', ''))).toBe(true);
    expect(hardFails(q, swap(ref, '      if (user) {\n        token.role = user.role;\n      }', '      token.role = user.role;'))).toBe(true);
  });

  it('rejects a plain-text or unawaited password check, or no handlers export, in next-auth-deep-1', () => {
    const q = coding('next-auth-deep-1');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, 'await bcrypt.compare(password, user.hashedPassword)', 'password === user.hashedPassword'))).toBe(true);
    expect(hardFails(q, swap(ref, 'await bcrypt.compare(', 'bcrypt.compare('))).toBe(true);
    expect(hardFails(q, swap(ref, 'export const { handlers, auth, signIn, signOut }', 'export const { auth, signIn, signOut }'))).toBe(true);
  });

  it('accepts any type argument to useForm in next-forms-3, and still rejects a form with no resolver', () => {
    const q = coding('next-forms-3');
    const typed = branches(q)[2];
    for (const arg of ['<z.infer<typeof registrationSchema>>', '<FormValues>', '']) {
      expect({ arg, fails: hardFails(q, swap(typed, 'useForm<RegistrationValues>(', `useForm${arg}(`)) }).toEqual({ arg, fails: false });
    }
    expect(hardFails(q, swap(typed, 'resolver: zodResolver(registrationSchema),', ''))).toBe(true);
  });

  it('every cloze fills to its solution, and every alternate is a different token', () => {
    for (const q of sectionQuestions.filter(x => x.type === QuestionType.CLOZE_CODE) as ClozeCodeQuestion[]) {
      let i = 0;
      const filled = q.template.replace(/___/g, () => q.blanks[i++]);
      expect({ id: q.id, blanks: i, filled }).toEqual({ id: q.id, blanks: q.blanks.length, filled: q.solution });
      (q.blankAlternates || []).forEach((alts, k) => {
        for (const a of alts) expect(a).not.toBe(q.blanks[k]);
      });
    }
  });

  it('every Parsons answer joins to its solution and no distractor is an answer line', () => {
    for (const q of sectionQuestions.filter(x => x.type === QuestionType.PARSONS) as ParsonsQuestion[]) {
      expect(q.correctOrder.join('\n')).toBe(q.solution);
      for (const d of q.distractorLines || []) expect(q.correctOrder.includes(d)).toBe(false);
    }
  });

  it('every MCQ in the section has exactly one correct option', () => {
    for (const q of sectionQuestions.filter(x => x.type === QuestionType.MULTIPLE_CHOICE) as MultipleChoiceQuestion[]) {
      expect({ id: q.id, correct: q.options.filter(o => o.isCorrect).length }).toEqual({ id: q.id, correct: 1 });
    }
  });

  it('no question in the section contains an em dash', () => {
    for (const q of sectionQuestions) {
      expect({ id: q.id, emDash: JSON.stringify(q).includes('—') }).toEqual({ id: q.id, emDash: false });
    }
  });
});
