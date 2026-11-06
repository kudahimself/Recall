/**
 * InlineText renders backticks as code and **bold** as bold in every course.
 * The data scan guards that switch: prose in the bank must not use a backtick
 * or a double star as a literal character (a JS template literal, `**` as the
 * power operator), or it would render as markup.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { questions } from '../../data/questions';
import { Question, QuestionType } from '../../types';
import { InlineText, parseBlocks, parseInline } from './InlineText';

describe('parseInline', () => {
  it('turns backticked spans into code and **spans** into bold', () => {
    expect(parseInline('`//` rounds **down**, so `17 // 5` is 3')).toEqual([
      { kind: 'code', text: '//' },
      { kind: 'text', text: ' rounds ' },
      { kind: 'bold', text: 'down' },
      { kind: 'text', text: ', so ' },
      { kind: 'code', text: '17 // 5' },
      { kind: 'text', text: ' is 3' },
    ]);
  });

  it('keeps an unpaired backtick as written', () => {
    expect(parseInline('a `b` c ` d')).toEqual([
      { kind: 'text', text: 'a ' },
      { kind: 'code', text: 'b' },
      { kind: 'text', text: ' c ` d' },
    ]);
  });

  it('leaves the power operator alone in prose and inside code', () => {
    expect(parseInline('2 ** 3 is 8, and 4 ** 2 is 16')).toEqual([{ kind: 'text', text: '2 ** 3 is 8, and 4 ** 2 is 16' }]);
    expect(parseInline('`f(**kwargs)` takes **any** keyword')).toEqual([
      { kind: 'code', text: 'f(**kwargs)' },
      { kind: 'text', text: ' takes ' },
      { kind: 'bold', text: 'any' },
      { kind: 'text', text: ' keyword' },
    ]);
  });

  it('keeps a fenced block as code, template literals and all', () => {
    // eslint-disable-next-line no-template-curly-in-string
    const text = 'What does this log?\n\n```js\nconst s = `Hi, ${name}`;\nconsole.log(n**2);\n```\nPick one.';
    expect(parseBlocks(text)).toEqual([
      { kind: 'text', text: 'What does this log?' },
      // eslint-disable-next-line no-template-curly-in-string
      { kind: 'fence', lang: 'js', code: 'const s = `Hi, ${name}`;\nconsole.log(n**2);' },
      { kind: 'text', text: 'Pick one.' },
    ]);
    render(<h2><InlineText text={text} /></h2>);
    const codes = screen.getAllByText((_, node) => node?.tagName === 'CODE');
    expect(codes).toHaveLength(1);
    // eslint-disable-next-line no-template-curly-in-string
    expect(codes[0]).toHaveTextContent('const s = `Hi, ${name}`;');
  });

  it('renders code and bold elements', () => {
    render(<p data-testid="p"><InlineText text="Use `x` **now**" /></p>);
    expect(screen.getByText('x', { selector: 'code' })).toBeInTheDocument();
    expect(screen.getByText('now', { selector: 'strong' })).toBeInTheDocument();
    expect(screen.getByTestId('p')).toHaveTextContent(/^Use x now$/);
  });
});

/** Every prose string a question screen renders through InlineText. */
function proseOf(q: Question): string[] {
  const out = [q.question, q.explanation, ...(q.hints ?? [])];
  if (q.type === QuestionType.MULTIPLE_CHOICE) out.push(...q.options.map(o => o.text));
  if (q.type === QuestionType.CHOOSE_JUSTIFY) out.push(...q.decisions.map(o => o.text), ...q.reasons.map(o => o.text));
  if (q.type === QuestionType.PREDICT_OUTCOME) out.push(...(q.tempting ?? []).map(t => t.why));
  if (q.type === QuestionType.SPOT_FLAW && q.note) out.push(q.note);
  if (q.type === QuestionType.EXPLAIN) out.push(q.modelAnswer, ...q.keyPoints);
  return out;
}

describe('question bank prose is safe to render as inline markup', () => {
  // Fenced blocks are code and shown as written; only the prose around them is scanned.
  const rows = questions.flatMap(q => proseOf(q).flatMap(text => parseBlocks(text)
    .flatMap(b => (b.kind === 'text' ? [{ id: q.id, text: b.text }] : []))));

  it('uses a literal backtick only alone, so it is shown as written', () => {
    // A template-literal explanation ("wrapped in backticks (`)") has one
    // backtick and renders it as text. Three would pair the wrong two.
    const odd = rows.filter(r => (r.text.match(/`/g) ?? []).length % 2 === 1);
    expect(odd.filter(r => (r.text.match(/`/g) ?? []).length > 1)).toEqual([]);
    odd.forEach(r => expect(parseInline(r.text).filter(p => p.kind === 'code')).toEqual([]));
  });

  it('never bolds across code such as f(*args, **kwargs) or 2 ** 3', () => {
    const bolded = rows.flatMap(r => parseInline(r.text).filter(p => p.kind === 'bold').map(p => ({ id: r.id, bold: p.text })));
    expect(bolded.length).toBeGreaterThan(0);
    expect(bolded.filter(b => /\*|\bargs\b|kwargs/.test(b.bold))).toEqual([]);
  });
});
