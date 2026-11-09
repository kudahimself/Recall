import { questions } from './questions';
import { webdevOrderedQuestions } from './webdevOrderedQuestions';
import { advancedWebdevOrderedQuestions } from './advancedWebdevOrderedQuestions';
import {
  QuestionType, CodingQuestion, ClozeCodeQuestion, ParsonsQuestion, MultipleChoiceQuestion, PredictOutputQuestion, Topic,
} from '../types';
import { gradeCodingSubmission } from '../utils/codeValidator';
import { outputMatches } from '../utils/predictOutput';

const sectionQuestions = questions.filter(q => q.topic === Topic.NEXT_SHADCN);
const sectionCoding = sectionQuestions.filter(q => q.type === QuestionType.CODING) as CodingQuestion[];

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
  const q = questions.find(x => x.id === id && x.type === QuestionType.CODING) as CodingQuestion | undefined;
  if (!q) throw new Error(`missing ${id}`);
  return q;
}

function swap(code: string, from: string, to: string): string {
  if (!code.includes(from)) throw new Error(`"${from.slice(0, 40)}" is not in the reference`);
  return code.replace(from, to);
}

describe('Web Dev UI Libraries & Advanced Styling section grading', () => {
  it('has all 17 section questions, each once in the ordered bank', () => {
    expect(sectionQuestions.length).toBe(17);
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

  it('rejects a reversed, clsx-only or unexported cn() in shadcn-cn-utility-1, and accepts clsx(...inputs)', () => {
    const q = coding('shadcn-cn-utility-1');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, 'twMerge(clsx(inputs))', 'clsx(twMerge(inputs))'))).toBe(true);
    expect(hardFails(q, swap(ref, 'twMerge(clsx(inputs))', 'clsx(inputs)'))).toBe(true);
    expect(hardFails(q, swap(ref, 'import { twMerge } from "tailwind-merge";', 'import { twMerge } from "clsx";'))).toBe(true);
    expect(hardFails(q, swap(ref, 'export function cn', 'function cn'))).toBe(true);
    expect(passes(q, swap(ref, 'twMerge(clsx(inputs))', 'twMerge(clsx(...inputs))'))).toBe(true);
  });

  it('teaches the Tailwind 4 setup in shadcn-dark-mode-1 and shadcn-theming-coding-1, with no Tailwind 3 config', () => {
    for (const id of ['shadcn-dark-mode-1', 'shadcn-theming-coding-1']) {
      const q = coding(id);
      expect(q.solution).toContain('@import "tailwindcss";');
      expect(q.solution).toContain('@theme inline');
      expect(q.solution).not.toMatch(/@tailwind\s+base|tailwind\.config|darkMode/);
    }
  });

  it('rejects @theme without inline, a media-query dark mode or Tailwind 3 directives in shadcn-dark-mode-1', () => {
    const q = coding('shadcn-dark-mode-1');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, '@theme inline {', '@theme {'))).toBe(true);
    expect(hardFails(q, swap(ref, '@custom-variant dark (&:is(.dark *));', ''))).toBe(true);
    expect(hardFails(q, swap(ref, '@import "tailwindcss";', '@tailwind base;\n@tailwind components;\n@tailwind utilities;'))).toBe(true);
    expect(hardFails(q, swap(ref, ':root {\n  --background: oklch(1 0 0);', ':root {\n  --background: oklch(0.145 0 0);'))).toBe(true);
    expect(passes(q, swap(ref, '@import "tailwindcss";', "@import 'tailwindcss';"))).toBe(true);
  });

  it('rejects a brand colour with no dark value or no @theme entry in shadcn-theming-coding-1', () => {
    const q = coding('shadcn-theming-coding-1');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, '  --brand: oklch(0.7 0.18 290);\n', ''))).toBe(true);
    expect(hardFails(q, swap(ref, '  --color-brand: var(--brand);\n', ''))).toBe(true);
    expect(hardFails(q, swap(ref, '--color-brand: var(--brand)', '--brand-color: var(--brand)'))).toBe(true);
  });

  it('rejects buttonVariants with no defaults or a missing size default in shadcn-cva-coding-1, and accepts single quotes', () => {
    const q = coding('shadcn-cva-coding-1');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, '    defaultVariants: {\n      variant: "default",\n      size: "default",\n    },\n', ''))).toBe(true);
    expect(hardFails(q, swap(ref, '      size: "default",\n    },\n  }', '    },\n  }'))).toBe(true);
    expect(passes(q, ref.replace(/"/g, "'"))).toBe(true);
  });

  it('rejects className first, no asChild on the Link, a swapped ternary or a named Link import in shadcn-aschild-coding-1', () => {
    const q = coding('shadcn-aschild-coding-1');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, 'cn(buttonVariants({ variant, size }), className)', 'cn(className, buttonVariants({ variant, size }))'))).toBe(true);
    expect(hardFails(q, swap(ref, '<Button asChild variant="outline">', '<Button variant="outline">'))).toBe(true);
    expect(hardFails(q, swap(ref, 'asChild ? Slot : "button"', 'asChild ? "button" : Slot'))).toBe(true);
    expect(hardFails(q, swap(ref, ' {...props} />', ' />'))).toBe(true);
    expect(hardFails(q, swap(ref, 'import Link from "next/link";', 'import { Link } from "next/link";'))).toBe(true);
  });

  it('accepts both Slot imports and both className placements in shadcn-aschild-coding-1', () => {
    const q = coding('shadcn-aschild-coding-1');
    const [reactSlot, radixUi] = branches(q);
    expect(passes(q, swap(reactSlot, 'cn(buttonVariants({ variant, size }), className)', 'cn(buttonVariants({ variant, size, className }))'))).toBe(true);
    expect(passes(q, swap(radixUi, 'cn(buttonVariants({ variant, size, className }))', 'cn(buttonVariants({ variant, size }), className)'))).toBe(true);
  });

  it('rejects VariantProps without typeof, hand-typed options or HTMLAttributes in shadcn-variantprops-coding-1', () => {
    const q = coding('shadcn-variantprops-coding-1');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, 'VariantProps<typeof buttonVariants>', 'VariantProps<buttonVariants>'))).toBe(true);
    expect(hardFails(q, swap(ref, 'ButtonHTMLAttributes<HTMLButtonElement>,', 'HTMLAttributes<HTMLButtonElement>,'))).toBe(true);
    const handTyped = swap(ref, 'interface ButtonProps\n  extends ButtonHTMLAttributes<HTMLButtonElement>,\n    VariantProps<typeof buttonVariants> {}',
      'interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {\n  variant?: "default" | "outline";\n  size?: "default" | "sm";\n}');
    expect(hardFails(q, handTyped)).toBe(true);
    expect(passes(q, 'interface ButtonProps\n  extends ButtonHTMLAttributes<HTMLButtonElement>,\n    VariantProps<typeof buttonVariants> {}')).toBe(true);
  });

  it('shadcn-cn-predict-1 accepts the tailwind-merge output and rejects the plain clsx join', () => {
    const q = sectionQuestions.find(x => x.id === 'shadcn-cn-predict-1') as PredictOutputQuestion;
    const accepted = [q.expectedOutput, ...(q.acceptableOutputs || [])];
    expect(outputMatches('px-4 py-2 text-sm bg-white\np-4 text-red-500 px-2 text-lg\ntext-lg p-4\nrounded-md bg-blue-600', accepted, q.language)).toBe(true);
    expect(outputMatches('px-4 py-2 text-sm bg-white\np-4 text-red-500 px-2 text-lg\npx-2 text-lg p-4\nrounded-md bg-gray-100 bg-blue-600', accepted, q.language)).toBe(false);
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

  it('every MCQ in the section has exactly one correct option, and no explanation names an option letter', () => {
    for (const q of sectionQuestions.filter(x => x.type === QuestionType.MULTIPLE_CHOICE) as MultipleChoiceQuestion[]) {
      expect({ id: q.id, correct: q.options.filter(o => o.isCorrect).length }).toEqual({ id: q.id, correct: 1 });
      expect({ id: q.id, letter: /\boption [a-d]\b|\([a-d]\)/i.test(q.explanation) }).toEqual({ id: q.id, letter: false });
    }
  });

  it('no question in the section contains an em dash or the retired shadcn-ui CLI name', () => {
    for (const q of sectionQuestions) {
      const text = JSON.stringify(q);
      expect({ id: q.id, emDash: text.includes('—') }).toEqual({ id: q.id, emDash: false });
      expect({ id: q.id, oldCli: /npx shadcn-ui\b/.test(text) }).toEqual({ id: q.id, oldCli: false });
    }
  });
});
