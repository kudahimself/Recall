import { questions } from './questions';
import { webdevOrderedQuestions } from './webdevOrderedQuestions';
import { advancedWebdevOrderedQuestions } from './advancedWebdevOrderedQuestions';
import { QuestionType, CodingQuestion, Topic, CodeLanguage } from '../types';
import { gradeCodingSubmission } from '../utils/codeValidator';

const NEXT_TOPICS = new Set<string>([
  Topic.NEXT_ROUTING, Topic.NEXT_SERVER_COMPONENTS, Topic.NEXT_DATA_FETCHING,
  Topic.NEXT_API_ROUTES, Topic.NEXT_MIDDLEWARE, Topic.NEXT_AUTH,
  Topic.NEXT_OPTIMIZATION, Topic.NEXT_DEPLOYMENT,
]);

const nextQuestions = questions.filter(q => NEXT_TOPICS.has(q.topic));
const nextCoding = nextQuestions.filter(q => q.type === QuestionType.CODING) as CodingQuestion[];

function passes(question: CodingQuestion, code: string): boolean {
  const results = gradeCodingSubmission(question, code);
  return results.length > 0 && results.every(r => r.verdict === 'pass');
}

function branches(q: CodingQuestion): string[] {
  const sep = q.language === CodeLanguage.SQL ? /\n\s*--\s*OR\s*\n/i : /\n\s*#\s*OR\s*\n/i;
  return q.solution.split(sep).map(s => s.trim()).filter(Boolean);
}

function coding(id: string): CodingQuestion {
  const q = nextCoding.find(x => x.id === id);
  if (!q) throw new Error(`missing ${id}`);
  return q;
}

describe('Web Dev Next.js section grading', () => {
  it('has Next.js coding questions loaded in the app bank', () => {
    expect(nextCoding.length).toBeGreaterThan(20);
  });

  it.each(nextCoding.map(q => [q.id, q] as const))('%s: every reference branch passes the grader', (_id, q) => {
    for (const branch of branches(q)) {
      expect({ id: q.id, branch: branch.slice(0, 60), pass: passes(q, branch) })
        .toEqual({ id: q.id, branch: branch.slice(0, 60), pass: true });
    }
  });

  it.each(nextCoding.map(q => [q.id, q] as const))('%s: the starter code is not accepted', (_id, q) => {
    expect(passes(q, q.starterCode || '')).toBe(false);
  });

  it.each(nextCoding.map(q => [q.id, q] as const))('%s: has a requires guard', (_id, q) => {
    expect(Array.isArray(q.requires) && q.requires.length > 0).toBe(true);
  });

  it('rejects the Pages Router useRouter import in next-route-useroute-1', () => {
    const q = coding('next-route-useroute-1');
    expect(passes(q, branches(q)[0].replace('next/navigation', 'next/router'))).toBe(false);
  });

  it('rejects a Next.js 14 style post page (params read without await) in proj-next-1', () => {
    const q = coding('proj-next-1');
    const wrong = branches(q)[0].replace(/const \{ slug \} = await params;/g, 'const { slug } = params as any;');
    expect(passes(q, wrong)).toBe(false);
  });

  it('rejects sequential awaits in next-parallel-1', () => {
    const q = coding('next-parallel-1');
    /* eslint-disable no-template-curly-in-string */
    const wrong = 'export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {\n'
      + '  const { id } = await params;\n'
      + '  const product = await (await fetch(`https://api.example.com/products/${id}`)).json();\n'
      + '  const reviews = await (await fetch(`https://api.example.com/reviews?productId=${id}`)).json();\n'
      + '  return (<div><h1>{product.name}</h1><p>{product.price}</p><ul>{reviews.map((review: { id: number; text: string }) => <li key={review.id}>{review.text}</li>)}</ul></div>);\n'
      + '}';
    /* eslint-enable no-template-curly-in-string */
    expect(passes(q, wrong)).toBe(false);
  });

  it('rejects a session cookie without httpOnly in next-auth-session-cookie-1', () => {
    const q = coding('next-auth-session-cookie-1');
    expect(passes(q, branches(q)[0].replace('httpOnly: true,', ''))).toBe(false);
  });

  it('rejects an unawaited jwtVerify in sec-auth-5', () => {
    const q = coding('sec-auth-5');
    expect(passes(q, branches(q)[0].replace('await jwtVerify(', 'jwtVerify('))).toBe(false);
  });

  it('proj-next-2 now lives in next_shadcn, still graded and reachable once in the ordered bank', () => {
    const q = questions.find(x => x.id === 'proj-next-2') as CodingQuestion | undefined;
    expect(q?.topic).toBe(Topic.NEXT_SHADCN);
    expect(q && branches(q).every(b => passes(q, b))).toBe(true);
    const ordered = [...webdevOrderedQuestions, ...advancedWebdevOrderedQuestions].filter(x => x.id === 'proj-next-2');
    expect(ordered.length).toBe(1);
    expect(ordered[0].topic).toBe(Topic.NEXT_SHADCN);
  });

  it('every MCQ in the section has exactly one correct option', () => {
    for (const q of nextQuestions.filter(x => x.type === QuestionType.MULTIPLE_CHOICE) as any[]) {
      expect({ id: q.id, correct: q.options.filter((o: any) => o.isCorrect).length }).toEqual({ id: q.id, correct: 1 });
    }
  });

  it('no question in the section contains an em dash', () => {
    for (const q of nextQuestions) {
      expect({ id: q.id, emDash: JSON.stringify(q).includes('—') }).toEqual({ id: q.id, emDash: false });
    }
  });
});
