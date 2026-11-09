// The swaps below are answer code, so their strings hold literal ${...} on purpose.
/* eslint-disable no-template-curly-in-string */
import { questions } from './questions';
import { advancedWebdevOrderedQuestions } from './advancedWebdevOrderedQuestions';
import { CodeLanguage, CodingQuestion, PredictOutputQuestion, QuestionType, Topic } from '../types';
import { gradeCodingSubmission } from '../utils/codeValidator';
import { outputMatches } from '../utils/predictOutput';

const SECTION_TOPICS: string[] = [
  Topic.PATTERNS_CREATIONAL,
  Topic.PATTERNS_STRUCTURAL,
  Topic.PATTERNS_BEHAVIORAL,
  Topic.PATTERNS_ARCHITECTURAL,
  Topic.API_DESIGN,
  Topic.DB_DESIGN,
];
const section = questions.filter(q => SECTION_TOPICS.includes(q.topic as string));
const sectionCoding = section.filter(q => q.type === QuestionType.CODING) as CodingQuestion[];

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
  const q = sectionCoding.find(x => x.id === id);
  if (!q) throw new Error(`missing ${id}`);
  return q;
}

/** A branch with exact pieces of text swapped out; fails loudly if a piece is not there. */
function swap(code: string, ...pairs: string[]): string {
  for (let i = 0; i < pairs.length; i += 2) {
    expect(code).toContain(pairs[i]);
    code = code.replace(pairs[i], pairs[i + 1]);
  }
  return code;
}

describe('Web Dev Design Patterns & Architecture section grading', () => {
  it('has all 79 questions, each once in the ordered bank', () => {
    expect(section.length).toBe(79);
    const ordered = advancedWebdevOrderedQuestions.filter(q => SECTION_TOPICS.includes(q.topic as string)).map(q => q.id);
    expect(new Set(ordered).size).toBe(ordered.length);
    expect([...ordered].sort()).toEqual(section.map(q => q.id).sort());
  });

  it('proj-capstone-1 (a Prisma schema) sits in db_design', () => {
    expect(section.find(q => q.id === 'proj-capstone-1')?.topic).toBe(Topic.DB_DESIGN);
  });

  it('every coding question is on the Web Dev stack (no Python or Django left)', () => {
    for (const q of sectionCoding) {
      expect({ id: q.id, language: q.language }).not.toEqual({ id: q.id, language: CodeLanguage.PYTHON });
      expect({ id: q.id, django: /django|rest_framework|def \w+\(/i.test(q.solution) }).toEqual({ id: q.id, django: false });
    }
  });

  it.each(sectionCoding.map(q => [q.id, q] as const))('%s: every reference branch passes the grader and its requires', (_id, q) => {
    for (const branch of branches(q)) {
      expect({ id: q.id, branch: branch.slice(0, 60), pass: passes(q, branch) })
        .toEqual({ id: q.id, branch: branch.slice(0, 60), pass: true });
    }
  });

  it.each(sectionCoding.map(q => [q.id, q] as const))('%s: the starter code is not accepted', (_id, q) => {
    expect(passes(q, q.starterCode || '')).toBe(false);
  });

  it.each(sectionCoding.map(q => [q.id, q] as const))('%s: has a requires guard', (_id, q) => {
    expect(Array.isArray(q.requires) && q.requires.length > 0).toBe(true);
  });

  it('dp-create-2 rejects a public constructor and a getInstance that always builds a new pool', () => {
    const q = coding('dp-create-2');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, 'private constructor', 'constructor'))).toBe(true);
    expect(hardFails(q, swap(ref,
      'if (!DatabasePool.instance) {\n      DatabasePool.instance = new DatabasePool(connectionString);\n    }\n    return DatabasePool.instance;',
      'return new DatabasePool(connectionString);'))).toBe(true);
    expect(hardFails(q, swap(ref, 'if (!DatabasePool.instance) {', 'if (DatabasePool.instance === undefined) {'))).toBe(false);
  });

  it('dp-struct-2 rejects a wrapper that drops the result or the arguments, and accepts a renamed result', () => {
    const q = coding('dp-struct-2');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, '    return result;\n  };', '  };'))).toBe(true);
    expect(hardFails(q, swap(ref, 'fn(...args)', 'fn()'))).toBe(true);
    expect(hardFails(q, swap(ref, 'const result = fn(...args);', 'const out = fn(...args);', 'return result;', 'return out;'))).toBe(false);
  });

  it('dp-behav-1 rejects an off() that removes nothing or the whole event, and an emit that drops the arguments', () => {
    const q = coding('dp-behav-1');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, 'this.listeners.get(event)?.delete(listener);', ''))).toBe(true);
    expect(hardFails(q, swap(ref, 'this.listeners.get(event)?.delete(listener);', 'this.listeners.delete(event);'))).toBe(true);
    expect(hardFails(q, swap(ref, 'listener(...args)', 'listener()'))).toBe(true);
  });

  it('dp-arch-5 rejects a class that does not implement UserRepo or keys users by name, and accepts an untyped new Map()', () => {
    const q = coding('dp-arch-5');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, 'class InMemoryUserRepo implements UserRepo', 'class InMemoryUserRepo'))).toBe(true);
    expect(hardFails(q, swap(ref, 'this.users.set(user.id, user);', 'this.users.set(user.displayName, user);'))).toBe(true);
    expect(hardFails(q, swap(ref, 'private users = new Map<string, User>();',
      'private users: Map<string, User>;\n\n  constructor() {\n    this.users = new Map();\n  }'))).toBe(false);
  });

  it('dp-db-4 rejects a fast version that still queries per book', () => {
    const q = coding('dp-db-4');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, 'prisma.book.findMany({ include: { author: true } })', 'prisma.book.findMany()',
      '`${book.title} by ${book.author.penName}`', '`${book.title}`'))).toBe(true);
    expect(hardFails(q, swap(ref, 'include: { author: true }', 'include: { books: true }'))).toBe(true);
    expect(hardFails(q, swap(ref, 'prisma.author.findUnique(', 'prisma.author.findFirst('))).toBe(false);
  });

  it('dp-api-4 rejects no toJSON, a 400 validation error and a class that is not an Error', () => {
    const q = coding('dp-api-4');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, 'toJSON() {', 'serialize() {'))).toBe(true);
    expect(hardFails(q, swap(ref, 'new ApiError(422,', 'new ApiError(400,'))).toBe(true);
    expect(hardFails(q, swap(ref, 'class ApiError extends Error {', 'class ApiError {', 'super(message);', 'this.message = message;'))).toBe(true);
    expect(hardFails(q, swap(ref, '...(this.details && { details: this.details }),', '...(this.details ? { details: this.details } : {}),'))).toBe(false);
  });

  it('sec-comm-2 rejects a wildcard origin, an unchecked echo, no preflight handler and no credentials header', () => {
    const q = coding('sec-comm-2');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, '"Access-Control-Allow-Origin": origin,', '"Access-Control-Allow-Origin": "*",'))).toBe(true);
    expect(hardFails(q, swap(ref, 'if (!origin || !allowedOrigins.includes(origin)) return {};', 'if (!origin) return {};'))).toBe(true);
    expect(hardFails(q, swap(ref,
      'export async function OPTIONS(req: Request) {\n  return new Response(null, { status: 204, headers: corsHeaders(req.headers.get("origin")) });\n}\n\n', ''))).toBe(true);
    expect(hardFails(q, swap(ref, '    "Access-Control-Allow-Credentials": "true",\n', ''))).toBe(true);
    expect(hardFails(q, swap(ref, 'const allowedOrigins = ["https://myapp.com", "http://localhost:3000"];',
      'const allowedOrigins = new Set(["https://myapp.com", "http://localhost:3000"]);', 'allowedOrigins.includes(origin)', 'allowedOrigins.has(origin)'))).toBe(false);
  });

  it('sec-arch-2 rejects swapped 401/403, a delete before the checks, an editor who may delete and unawaited params', () => {
    const q = coding('sec-arch-2');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, '{ status: 401 }', '{ status: 4XX }', '{ status: 403 }', '{ status: 401 }', '{ status: 4XX }', '{ status: 403 }'))).toBe(true);
    expect(hardFails(q, swap(ref,
      '  const session = await auth();\n  if (!session) return new Response(null, { status: 401 });\n  if (!can(session.user.role, "DELETE")) return new Response(null, { status: 403 });\n  const { id } = await params;\n  await prisma.article.delete({ where: { id } });',
      '  const { id } = await params;\n  await prisma.article.delete({ where: { id } });\n  const session = await auth();\n  if (!session) return new Response(null, { status: 401 });\n  if (!can(session.user.role, "DELETE")) return new Response(null, { status: 403 });'))).toBe(true);
    expect(hardFails(q, swap(ref, 'editor: ["GET", "PUT"],', 'editor: ["GET", "PUT", "DELETE"],'))).toBe(true);
    expect(hardFails(q, swap(ref, 'const { id } = await params;', 'const { id } = params as any;'))).toBe(true);
  });

  it('sec-attack-2 rejects string-built SQL, a quoted placeholder and an unselected ORM query, and accepts Prisma.sql', () => {
    const q = coding('sec-attack-2');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, 'prisma.$queryRaw`SELECT id, email FROM "User" WHERE username = ${username}`;',
      'prisma.$queryRawUnsafe(`SELECT id, email FROM "User" WHERE username = \'${username}\'`);'))).toBe(true);
    expect(hardFails(q, swap(ref, 'username = ${username}`', 'username = \'${username}\'`'))).toBe(true);
    expect(hardFails(q, swap(ref, '    select: { id: true, email: true },\n', ''))).toBe(true);
    expect(hardFails(q, swap(ref, 'prisma.$queryRaw`SELECT id, email FROM "User" WHERE username = ${username}`;',
      'prisma.$queryRaw(Prisma.sql`SELECT id, email FROM "User" WHERE username = ${username}`);'))).toBe(false);
  });

  it('sec-attack-5 rejects no Retry-After, a 403, a window that never resets and rounding down', () => {
    const q = coding('sec-attack-5');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, '      headers: { "Retry-After": String(limit.retryAfter) },\n', ''))).toBe(true);
    expect(hardFails(q, swap(ref, 'status: 429', 'status: 403'))).toBe(true);
    expect(hardFails(q, swap(ref, 'if (!entry || now - entry.windowStart >= WINDOW_MS) {', 'if (!entry) {'))).toBe(true);
    expect(hardFails(q, swap(ref, 'Math.ceil(', 'Math.floor('))).toBe(true);
    expect(hardFails(q, swap(ref, 'if (!entry || now - entry.windowStart >= WINDOW_MS) {', 'if (!entry || entry.windowStart + WINDOW_MS <= now) {'))).toBe(false);
  });

  it('proj-capstone-1 rejects a cascading assignee, an index led by status and no per-pair unique, and accepts either pair order', () => {
    const q = coding('proj-capstone-1');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, 'references: [id], onDelete: SetNull)', 'references: [id], onDelete: Cascade)'))).toBe(true);
    expect(hardFails(q, swap(ref, '@@index([projectId, status])', '@@index([status, projectId])'))).toBe(true);
    expect(hardFails(q, swap(ref, '\n  @@unique([userId, workspaceId])', ''))).toBe(true);
    expect(hardFails(q, swap(ref, '@@unique([userId, workspaceId])', '@@unique([workspaceId, userId])'))).toBe(false);
  });

  it('proj-capstone-2 rejects no redirect, an error.tsx without "use client", onClick={reset()} and a hand-made sign-out POST', () => {
    const q = coding('proj-capstone-2');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, '  if (!session) redirect("/login");\n', ''))).toBe(true);
    expect(hardFails(q, swap(ref, '"use client";\n\n', ''))).toBe(true);
    expect(hardFails(q, swap(ref, 'onClick={() => reset()}', 'onClick={reset()}'))).toBe(true);
    expect(hardFails(q, swap(ref,
      '<form\n          action={async () => {\n            "use server";\n            await signOut({ redirectTo: "/login" });\n          }}\n        >',
      '<form action="/api/auth/signout" method="POST">'))).toBe(true);
    expect(hardFails(q, swap(ref, 'onClick={() => reset()}', 'onClick={reset}'))).toBe(false);
  });

  it('each predict accepts the output it prints when run', () => {
    const printed: Record<string, string> = {
      'dp-create-predict-1': 'true\ndev\n1',
      'dp-struct-predict-1': 'outer in 10\ninner in 10\ninner out 12\nouter out 12\n12',
      'dp-behav-predict-1': 'A sees 1\nB sees 1\nB sees 2',
      'dp-arch-predict-1': 'Mail sent to ada@shop.io\nNo such user\nMail sent to fake@test',
      'dp-api-predict-1': '50,40\n40,30\n30,20',
      'dp-db-predict-1': 'loop: 4\nbatched: 2',
    };
    const predicts = section.filter(q => q.type === QuestionType.PREDICT_OUTPUT) as PredictOutputQuestion[];
    expect(predicts.map(q => q.id).sort()).toEqual(Object.keys(printed).sort());
    for (const q of predicts) {
      const accepted = [q.expectedOutput, ...(q.acceptableOutputs || [])];
      expect({ id: q.id, ok: outputMatches(printed[q.id], accepted, q.language) }).toEqual({ id: q.id, ok: true });
    }
  });

  it('every MCQ in the section has exactly one correct option', () => {
    for (const q of section.filter(x => x.type === QuestionType.MULTIPLE_CHOICE) as any[]) {
      expect({ id: q.id, correct: q.options.filter((o: any) => o.isCorrect).length }).toEqual({ id: q.id, correct: 1 });
    }
  });

  it('no MCQ explanation names an option by its letter (the options are shuffled)', () => {
    for (const q of section.filter(x => x.type === QuestionType.MULTIPLE_CHOICE)) {
      expect({ id: q.id, letter: /\(option [a-d]\)|option [a-d]\b/i.test(q.explanation || '') }).toEqual({ id: q.id, letter: false });
    }
  });

  it('no question in the section contains an em dash', () => {
    for (const q of section) {
      expect({ id: q.id, emDash: JSON.stringify(q).includes('—') }).toEqual({ id: q.id, emDash: false });
    }
  });
});
