import { questions } from './questions';
import { advancedWebdevOrderedQuestions } from './advancedWebdevOrderedQuestions';
import { QuestionType, CodingQuestion, ClozeCodeQuestion, ParsonsQuestion, PredictOutputQuestion, Topic } from '../types';
import { gradeCodingSubmission } from '../utils/codeValidator';
import { outputMatches } from '../utils/predictOutput';
import { blankMatches } from '../components/ClozeCodeQuestion';

const a11yQuestions = questions.filter(q => q.topic === Topic.ACCESSIBILITY);
const a11yCoding = a11yQuestions.filter(q => q.type === QuestionType.CODING) as CodingQuestion[];

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
  const q = a11yCoding.find(x => x.id === id);
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

describe('Web Dev Accessibility section grading', () => {
  it('has all 25 accessibility questions, each once in the ordered bank', () => {
    expect(a11yQuestions.length).toBe(25);
    const ordered = advancedWebdevOrderedQuestions.filter(q => q.topic === Topic.ACCESSIBILITY).map(q => q.id);
    expect(new Set(ordered).size).toBe(ordered.length);
    expect([...ordered].sort()).toEqual(a11yQuestions.map(q => q.id).sort());
  });

  it.each(a11yCoding.map(q => [q.id, q] as const))('%s: every reference branch passes the grader and its requires', (_id, q) => {
    for (const branch of branches(q)) {
      expect({ id: q.id, branch: branch.slice(0, 60), pass: passes(q, branch) })
        .toEqual({ id: q.id, branch: branch.slice(0, 60), pass: true });
    }
  });

  it.each(a11yCoding.map(q => [q.id, q] as const))('%s: the starter code is not accepted', (_id, q) => {
    expect(passes(q, q.starterCode || '')).toBe(false);
  });

  it.each(a11yCoding.map(q => [q.id, q] as const))('%s: has a requires guard', (_id, q) => {
    expect(Array.isArray(q.requires) && q.requires.length > 0).toBe(true);
  });

  it('a11y-skip-nav-1 rejects a link without #, a focusable or unfocusable main, and a skip link after the header', () => {
    const q = coding('a11y-skip-nav-1');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, 'href="#main-content"', 'href="main-content"'))).toBe(true);
    expect(hardFails(q, swap(ref, 'tabIndex={-1}', 'tabIndex={0}'))).toBe(true);
    expect(hardFails(q, swap(ref, ' tabIndex={-1}', ''))).toBe(true);
    expect(hardFails(q, swap(ref, '      <SkipNav />\n', ''))).toBe(true);
    expect(hardFails(q, swap(ref,
      '      <SkipNav />\n      <header>\n        <nav>{/* site links */}</nav>\n      </header>',
      '      <header>\n        <nav>{/* site links */}</nav>\n      </header>\n      <SkipNav />'))).toBe(true);
    expect(hardFails(q, swap(ref, ' className="skip-link"', ''))).toBe(true);
  });

  it('a11y-skip-nav-1 accepts a string tabIndex and a one-line SkipNav', () => {
    const q = coding('a11y-skip-nav-1');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, 'tabIndex={-1}', 'tabIndex="-1"'))).toBe(false);
    expect(passes(q, swap(ref,
      '  return (\n    <a href="#main-content" className="skip-link">\n      Skip to main content\n    </a>\n  );',
      '  return <a href="#main-content" className="skip-link">Skip to main content</a>;'))).toBe(true);
  });

  it('a11y-aria-live-coding-1 rejects assertive, role="alert", a non-atomic region and display: none', () => {
    const q = coding('a11y-aria-live-coding-1');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, 'aria-live="polite"', 'aria-live="assertive"'))).toBe(true);
    expect(hardFails(q, swap(ref, '<div aria-live="polite" aria-atomic="true"', '<div role="alert"'))).toBe(true);
    expect(hardFails(q, swap(ref, ' aria-atomic="true"', ''))).toBe(true);
    expect(hardFails(q, swap(ref, 'className="visually-hidden"', 'style={{ display: "none" }}'))).toBe(true);
  });

  it('a11y-aria-live-coding-1 accepts sr-only, aria-atomic={true} and a one-node template literal', () => {
    const q = coding('a11y-aria-live-coding-1');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, 'className="visually-hidden"', 'className="sr-only"'))).toBe(false);
    expect(hardFails(q, swap(ref, 'aria-atomic="true"', 'aria-atomic={true}'))).toBe(false);
    // eslint-disable-next-line no-template-curly-in-string
    expect(hardFails(q, swap(ref, ' aria-atomic="true"', '', '{count} results found', '{`${count} results found`}'))).toBe(false);
  });

  it('a11y-tabindex-coding-1 rejects swapped values, a positive tabIndex and an unattached ref', () => {
    const q = coding('a11y-tabindex-coding-1');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, 'tabIndex={0}', 'tabIndex={X}', 'tabIndex={-1}', 'tabIndex={0}', 'tabIndex={X}', 'tabIndex={-1}'))).toBe(true);
    expect(hardFails(q, swap(ref, 'tabIndex={0}', 'tabIndex={1}'))).toBe(true);
    expect(hardFails(q, swap(ref, 'ref={detailsRef} ', ''))).toBe(true);
  });

  it('a11y-tabindex-coding-1 accepts the title inside a heading and the attributes in either order', () => {
    const q = coding('a11y-tabindex-coding-1');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, '<div tabIndex={0}>{title}</div>', '<div tabIndex={0}>\n      <h3>{title}</h3>\n    </div>'))).toBe(false);
    expect(passes(q, swap(ref, '<div ref={detailsRef} tabIndex={-1}>', '<div tabIndex={-1} ref={detailsRef}>'))).toBe(true);
  });

  it('a11y-modal-1 rejects no Escape, no Tab trap, a listener never removed, no name, no aria-modal and a non-modal show()', () => {
    const q = coding('a11y-modal-1');
    const [ref, native] = branches(q);
    expect(hardFails(q, swap(ref, '      if (e.key === "Escape") {\n        onClose();\n        return;\n      }\n\n', ''))).toBe(true);
    expect(hardFails(q, ref.replace(/\n {6}if \(e\.key === "Tab"\) \{[\s\S]*?\n {6}\}\n {4}\};/, '\n    };'))).toBe(true);
    expect(hardFails(q, swap(ref, '      document.removeEventListener("keydown", handleKeyDown);\n', ''))).toBe(true);
    expect(hardFails(q, swap(ref, '        aria-labelledby="modal-title"\n', ''))).toBe(true);
    expect(hardFails(q, swap(ref, '        aria-modal="true"\n', ''))).toBe(true);
    expect(hardFails(q, swap(native, 'dialog.showModal()', 'dialog.show()'))).toBe(true);
  });

  it('a11y-modal-1 accepts aria-modal={true} and a click-to-close overlay', () => {
    const q = coding('a11y-modal-1');
    const ref = branches(q)[0];
    expect(hardFails(q, swap(ref, 'aria-modal="true"', 'aria-modal={true}'))).toBe(false);
    expect(hardFails(q, swap(ref, '<div className="modal-overlay">', '<div className="modal-overlay" onClick={onClose}>'))).toBe(false);
  });

  it('a11y-dropdown-1 rejects a CSS-only highlight, role="menu", and missing aria-expanded, Escape or preventDefault', () => {
    const q = coding('a11y-dropdown-1');
    const ref = branches(q)[0];
    const highlightOnly = ref
      // eslint-disable-next-line no-template-curly-in-string
      .split('          aria-activedescendant={activeIndex >= 0 ? `option-${activeIndex}` : undefined}\n').join('')
      // eslint-disable-next-line no-template-curly-in-string
      .split('              id={`option-${index}`}\n').join('');
    expect(highlightOnly).not.toContain('aria-activedescendant');
    expect(highlightOnly).not.toContain('id={`option-');
    expect(hardFails(q, highlightOnly)).toBe(true);
    expect(hardFails(q, swap(ref, 'role="listbox"', 'role="menu"', 'aria-haspopup="listbox"', 'aria-haspopup="menu"'))).toBe(true);
    expect(hardFails(q, swap(ref, '        aria-expanded={isOpen}\n', ''))).toBe(true);
    expect(hardFails(q, swap(ref, '      case "Escape":\n        setIsOpen(false);\n        buttonRef.current?.focus();\n        break;\n', ''))).toBe(true);
    expect(hardFails(q, ref.split('        e.preventDefault();\n').join(''))).toBe(true);
  });

  it('a11y-dropdown-1 accepts a <span> label', () => {
    const q = coding('a11y-dropdown-1');
    for (const branch of branches(q)) {
      expect(hardFails(q, swap(branch, '<label id="dropdown-label">{label}</label>', '<span id="dropdown-label">{label}</span>'))).toBe(false);
    }
  });

  it('every cloze template filled with its blanks gives its solution', () => {
    for (const q of a11yQuestions.filter(x => x.type === QuestionType.CLOZE_CODE) as ClozeCodeQuestion[]) {
      const parts = q.template.split('___');
      expect({ id: q.id, blanks: parts.length - 1 }).toEqual({ id: q.id, blanks: q.blanks.length });
      const filled = parts.reduce((acc, part, i) => acc + (i > 0 ? q.blanks[i - 1] : '') + part, '');
      expect({ id: q.id, filled }).toEqual({ id: q.id, filled: q.solution });
    }
  });

  it('a11y-visually-hidden-cloze-1 accepts :focus-visible for the second blank', () => {
    const q = a11yQuestions.find(x => x.id === 'a11y-visually-hidden-cloze-1') as ClozeCodeQuestion;
    expect(blankMatches(q, 1, 'focus')).toBe(true);
    expect(blankMatches(q, 1, 'focus-visible')).toBe(true);
    expect(blankMatches(q, 1, 'hover')).toBe(false);
  });

  it('every Parsons answer joins to its solution, and no distractor is a line of the answer', () => {
    for (const q of a11yQuestions.filter(x => x.type === QuestionType.PARSONS) as ParsonsQuestion[]) {
      expect({ id: q.id, joined: q.correctOrder.join('\n') }).toEqual({ id: q.id, joined: q.solution });
      for (const d of q.distractorLines || []) {
        expect({ id: q.id, d, inAnswer: q.correctOrder.includes(d) }).toEqual({ id: q.id, d, inAnswer: false });
      }
    }
  });

  it('a11y-tab-order-predict-1 accepts the Tab order Chromium gives, one per line or comma-separated', () => {
    const q = a11yQuestions.find(x => x.id === 'a11y-tab-order-predict-1') as PredictOutputQuestion;
    const accepted = [q.expectedOutput, ...(q.acceptableOutputs || [])];
    expect(outputMatches('Help\nHome\nCart\nCard\nExit', accepted, q.language)).toBe(true);
    expect(outputMatches('Help, Home, Cart, Card, Exit', accepted, q.language)).toBe(true);
    expect(outputMatches('Home\nCart\nCard\nHelp\nExit', accepted, q.language)).toBe(false);
  });

  it('every MCQ in the section has exactly one correct option', () => {
    for (const q of a11yQuestions.filter(x => x.type === QuestionType.MULTIPLE_CHOICE) as any[]) {
      expect({ id: q.id, correct: q.options.filter((o: any) => o.isCorrect).length }).toEqual({ id: q.id, correct: 1 });
    }
  });

  it('no MCQ explanation names an option by its letter (the options are shuffled)', () => {
    for (const q of a11yQuestions.filter(x => x.type === QuestionType.MULTIPLE_CHOICE)) {
      expect({ id: q.id, letter: /\(option [a-d]\)|option [a-d]\b/i.test(q.explanation || '') }).toEqual({ id: q.id, letter: false });
    }
  });

  it('no question in the section contains an em dash', () => {
    for (const q of a11yQuestions) {
      expect({ id: q.id, emDash: JSON.stringify(q).includes('—') }).toEqual({ id: q.id, emDash: false });
    }
  });
});
