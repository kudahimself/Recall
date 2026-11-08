import { questions } from './questions';
import { advancedWebdevOrderedQuestions } from './advancedWebdevOrderedQuestions';
import { QuestionType, CodingQuestion, ClozeCodeQuestion, ParsonsQuestion, Topic } from '../types';
import { gradeCodingSubmission } from '../utils/codeValidator';

const prismaQuestions = questions.filter(q => q.topic === Topic.NEXT_PRISMA);
const prismaCoding = prismaQuestions.filter(q => q.type === QuestionType.CODING) as CodingQuestion[];

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
  const q = prismaCoding.find(x => x.id === id);
  if (!q) throw new Error(`missing ${id}`);
  return q;
}

/** A branch with one exact piece of text swapped out; fails loudly if the text is not there. */
function swap(code: string, from: string, to: string): string {
  expect(code).toContain(from);
  return code.replace(from, to);
}

describe('Web Dev Prisma & Database section grading', () => {
  it('has all 30 next_prisma questions, each once in the ordered bank', () => {
    expect(prismaQuestions.length).toBe(30);
    const ordered = advancedWebdevOrderedQuestions.filter(q => q.topic === Topic.NEXT_PRISMA).map(q => q.id);
    expect(new Set(ordered).size).toBe(ordered.length);
    expect([...ordered].sort()).toEqual(prismaQuestions.map(q => q.id).sort());
  });

  it.each(prismaCoding.map(q => [q.id, q] as const))('%s: every reference branch passes the grader and its requires', (_id, q) => {
    for (const branch of branches(q)) {
      expect({ id: q.id, branch: branch.slice(0, 60), pass: passes(q, branch) })
        .toEqual({ id: q.id, branch: branch.slice(0, 60), pass: true });
    }
  });

  it.each(prismaCoding.map(q => [q.id, q] as const))('%s: the starter code is not accepted', (_id, q) => {
    expect(passes(q, q.starterCode || '')).toBe(false);
  });

  it.each(prismaCoding.map(q => [q.id, q] as const))('%s: has a requires guard', (_id, q) => {
    expect(Array.isArray(q.requires) && q.requires.length > 0).toBe(true);
  });

  it('prisma-1 rejects a schema without @unique, without the ? on name, or without @relation', () => {
    const q = coding('prisma-1');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, 'email String  @unique', 'email String'))).toBe(true);
    expect(hardFails(q, swap(ref, 'name  String?', 'name  String'))).toBe(true);
    expect(hardFails(q, swap(ref, '@relation(fields: [authorId], references: [id])', ''))).toBe(true);
    expect(hardFails(q, swap(ref, 'id    Int     @id @default', 'id    Int     @default'))).toBe(true);
  });

  it('prisma-2 rejects a search without mode "insensitive" and a create without the nested post', () => {
    const q = coding('prisma-2');
    const ref = branches(q)[1];
    expect(hardFails(q, swap(ref, ', mode: "insensitive"', ''))).toBe(true);
    expect(hardFails(q, swap(ref, 'id: "desc"', 'id: "asc"'))).toBe(true);
    expect(hardFails(q, swap(ref, 'posts: { create: {', 'posts: {'))).toBe(true);
  });

  it('prisma-5 rejects two separate awaits outside $transaction', () => {
    const q = coding('prisma-5');
    const wrong = 'async function updateUserAndCreatePost() {\n'
      + '  const updatedUser = await prisma.user.update({ where: { id: 1 }, data: { name: "Alice Updated" } });\n'
      + '  const newPost = await prisma.post.create({ data: { title: "Transaction Post", content: "Created in a transaction", authorId: 1 } });\n'
      + '  return { updatedUser, newPost };\n'
      + '}';
    expect(hardFails(q, wrong)).toBe(true);
  });

  it('prisma-7 rejects a client that is never stored on globalThis or never reused', () => {
    const q = coding('prisma-7');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, 'globalForPrisma.prisma = prisma;', ''))).toBe(true);
    expect(hardFails(q, swap(ref, 'globalForPrisma.prisma ?? new PrismaClient()', 'new PrismaClient()'))).toBe(true);
  });

  it('prisma-7 accepts a singleton whose client variable has another name', () => {
    const renamed = 'import { PrismaClient } from "@prisma/client";\n\n'
      + 'const globalForPrisma = globalThis as unknown as {\n  prisma: PrismaClient | undefined;\n};\n\n'
      + 'const client = globalForPrisma.prisma ?? new PrismaClient();\n\n'
      + 'if (process.env.NODE_ENV !== "production") {\n  globalForPrisma.prisma = client;\n}\n\n'
      + 'export default client;';
    expect(hardFails(coding('prisma-7'), renamed)).toBe(false);
  });

  it('prisma-9 rejects a relation without onDelete: Cascade, even when written as comments', () => {
    const q = coding('prisma-9');
    for (const branch of branches(q)) {
      expect(hardFails(q, swap(branch, ', onDelete: Cascade', ''))).toBe(true);
      expect(hardFails(q, swap(branch, 'onDelete: Cascade', 'onDelete: SetNull'))).toBe(true);
    }
  });

  it('prisma-11 rejects createMany without skipDuplicates and a loop of create calls', () => {
    const q = coding('prisma-11');
    expect(hardFails(q, swap(branches(q)[0], '    skipDuplicates: true,\n', ''))).toBe(true);
    const loop = 'async function seedTags() {\n  let count = 0;\n'
      + '  for (const label of ["sale", "new", "featured"]) {\n    await prisma.tag.create({ data: { label } });\n    count++;\n  }\n'
      + '  return count;\n}';
    expect(hardFails(q, loop)).toBe(true);
  });

  it('prisma-13 rejects a filter that drops NOT or turns OR into AND', () => {
    const q = coding('prisma-13');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, 'NOT: { authorId: 1 }', 'authorId: 1'))).toBe(true);
    expect(hardFails(q, swap(ref, 'OR: [', 'AND: ['))).toBe(true);
  });

  it('prisma-14 rejects a cursor page that keeps the cursor row or skips by offset', () => {
    const q = coding('prisma-14');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, '    skip: 1,\n', ''))).toBe(true);
    expect(hardFails(q, swap(ref, 'skip: 1', 'skip: 10'))).toBe(true);
  });

  it('every cloze template filled with its blanks gives its solution', () => {
    for (const q of prismaQuestions.filter(x => x.type === QuestionType.CLOZE_CODE) as ClozeCodeQuestion[]) {
      const parts = q.template.split('___');
      expect({ id: q.id, blanks: parts.length - 1 }).toEqual({ id: q.id, blanks: q.blanks.length });
      const filled = parts.reduce((acc, part, i) => acc + (i > 0 ? q.blanks[i - 1] : '') + part, '');
      expect({ id: q.id, filled }).toEqual({ id: q.id, filled: q.solution });
    }
  });

  it('every Parsons answer joins to its solution, and no distractor is a line of the answer', () => {
    for (const q of prismaQuestions.filter(x => x.type === QuestionType.PARSONS) as ParsonsQuestion[]) {
      expect({ id: q.id, joined: q.correctOrder.join('\n') }).toEqual({ id: q.id, joined: q.solution });
      for (const d of q.distractorLines || []) {
        expect({ id: q.id, d, inAnswer: q.correctOrder.includes(d) }).toEqual({ id: q.id, d, inAnswer: false });
      }
    }
  });

  it('every MCQ in the section has exactly one correct option', () => {
    for (const q of prismaQuestions.filter(x => x.type === QuestionType.MULTIPLE_CHOICE) as any[]) {
      expect({ id: q.id, correct: q.options.filter((o: any) => o.isCorrect).length }).toEqual({ id: q.id, correct: 1 });
    }
  });

  it('no question in the section contains an em dash', () => {
    for (const q of prismaQuestions) {
      expect({ id: q.id, emDash: JSON.stringify(q).includes('—') }).toEqual({ id: q.id, emDash: false });
    }
  });
});
