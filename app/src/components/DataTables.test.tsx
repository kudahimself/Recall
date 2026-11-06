import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { DataTables } from './DataTables';
import { renderInlineCode } from './InlineCode';
import { PredictOutputQuestion } from './PredictOutputQuestion';
import { MultipleChoiceQuestion } from './MultipleChoiceQuestion';
import { questions } from '../data/questions';
import { getCourseForTopic } from '../utils/courseConfig';
import {
  Course,
  Difficulty,
  QuestionType,
  Topic,
  MultipleChoiceQuestion as MCQ,
  PredictOutputQuestion as PredictQ,
} from '../types';

const byId = <T,>(id: string) => questions.find(q => q.id === id) as unknown as T;

const table = (name: string) => {
  const match = screen.getAllByRole('figure').find(f => within(f).queryByText(name));
  if (!match) throw new Error(`no table named ${name}`);
  return match;
};
const codesIn = (el: HTMLElement) => within(el).queryAllByText((_, node) => node?.tagName === 'CODE');
const questionHeading = () => screen.getByRole('heading', { level: 2 });

describe('DataTables', () => {
  it('renders nothing when a question has no tables', () => {
    const { container } = render(<DataTables />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders each table with its name, column headers and rows', () => {
    render(
      <DataTables
        tables={[
          { name: 'dbo.Payment', columns: ['PaymentId', 'Amount'], rows: [[1, 10], [2, 20]] },
          { name: 'dbo.Visit', columns: ['Region'], rows: [['North']] },
        ]}
      />,
    );
    const payment = table('dbo.Payment');
    const headers = within(payment).getAllByRole('columnheader').map(h => h.textContent);
    expect(headers).toEqual(['PaymentId', 'Amount']);
    const cells = within(payment).getAllByRole('cell').map(c => c.textContent);
    expect(cells).toEqual(['1', '10', '2', '20']);
    expect(screen.getByText('dbo.Visit')).toBeInTheDocument();
  });

  it('pads a numeric column to its widest decimal places', () => {
    render(<DataTables tables={[{ name: 'dbo.P', columns: ['Id', 'Price'], rows: [[1, 129], [2, 24.99]] }]} />);
    expect(screen.getAllByRole('cell').map(c => c.textContent)).toEqual(['1', '129.00', '2', '24.99']);
  });

  it('shows NULL distinctly from the text "NULL" and marks an empty table', () => {
    render(
      <DataTables
        tables={[
          { name: 'dbo.T', columns: ['A', 'B'], rows: [[null, 'NULL']] },
          { name: 'dbo.Empty', columns: ['A'], rows: [] },
        ]}
      />,
    );
    const [realNull, textNull] = within(table('dbo.T')).getAllByRole('cell');
    expect(realNull).toHaveClass('data-table-null');
    expect(textNull).not.toHaveClass('data-table-null');
    expect(within(table('dbo.Empty')).getByText('(no rows)')).toBeInTheDocument();
  });
});

describe('renderInlineCode (the shared InlineText, in every course)', () => {
  it('turns backticked spans into inline code and leaves the rest as text', () => {
    render(<p data-testid="text">{renderInlineCode('Use `IS NULL`, not `= NULL`.', Topic.TSQL_FILTERING)}</p>);
    const text = screen.getByTestId('text');
    expect(codesIn(text).map(c => c.textContent)).toEqual(['IS NULL', '= NULL']);
    expect(text.textContent).toBe('Use IS NULL, not = NULL.');
  });

  it('shows an unpaired backtick as written', () => {
    render(<p data-testid="text">{renderInlineCode('a `b` c ` d', Topic.TSQL_FILTERING)}</p>);
    const text = screen.getByTestId('text');
    expect(codesIn(text)).toHaveLength(1);
    expect(text.textContent).toBe('a b c ` d');
  });

  it('keeps a fenced JS snippet, template literal and all, as one block of code', () => {
    const q = byId<MCQ>('js-misc-mcq-4');
    render(<MultipleChoiceQuestion question={q} onAnswer={() => {}} showHints={false} />);
    const heading = questionHeading();
    const codes = codesIn(heading);
    expect(codes).toHaveLength(1);
    // eslint-disable-next-line no-template-curly-in-string
    expect(codes[0].textContent).toContain('greet() { return `Hi, ${this.name}`; }');
    expect(heading.textContent).not.toContain('```');
  });

  it('renders inline code in a SQL question', () => {
    const q = questions.find(x => getCourseForTopic(x.topic) === Course.SQL && /`[^`]+`/.test(x.question) && x.type === QuestionType.MULTIPLE_CHOICE) as unknown as MCQ;
    render(<MultipleChoiceQuestion question={q} onAnswer={() => {}} showHints={false} />);
    const heading = questionHeading();
    expect(codesIn(heading).length).toBeGreaterThan(0);
    expect(heading.textContent).not.toContain('`');
  });

  const optionQuestion = (topic: Topic): MCQ => ({
    id: 'inline-code-option-test',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic,
    question: 'Pick one.',
    explanation: 'Because.',
    options: [
      { id: 'a', text: 'Use `NVARCHAR` here', isCorrect: true },
      { id: 'b', text: 'Plain option', isCorrect: false },
    ],
  });
  // eslint-disable-next-line testing-library/no-node-access
  const optionLabel = (value: string) => screen.getAllByRole('radio').find(r => (r as HTMLInputElement).value === value)!.closest('label') as HTMLElement;

  it.each([Topic.TSQL_FILTERING, Topic.JS_FUNCTIONS, Topic.PY_BASICS])('renders inline code in a multiple-choice option (%s)', topic => {
    render(<MultipleChoiceQuestion question={optionQuestion(topic)} onAnswer={() => {}} showHints={false} />);
    const option = optionLabel('a');
    expect(codesIn(option).map(c => c.textContent)).toEqual(['NVARCHAR']);
    expect(option.textContent).not.toContain('`');
  });
});

describe('SQL questions show their tables above the code', () => {
  it('a predict question renders its table and the query that reads it', () => {
    const q = byId<PredictQ>('tsql-agg-minmaxavg-predict-1');
    render(<PredictOutputQuestion question={q} onAnswer={() => {}} showHints={false} />);
    expect(screen.getByText('dbo.Payment')).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader').map(h => h.textContent)).toEqual(['PaymentId', 'Amount']);
    expect(screen.getByText(/FROM dbo\.Payment/)).toBeInTheDocument();
  });

  it('an MCQ renders its tables and its question text with inline code', () => {
    const q = byId<MCQ>('tsql-joins-cross-mcq-1');
    render(<MultipleChoiceQuestion question={q} onAnswer={() => {}} showHints={false} />);
    expect(screen.getByText('dbo.DimColor')).toBeInTheDocument();
    expect(screen.getByText('dbo.DimSize')).toBeInTheDocument();
    const heading = questionHeading();
    expect(heading.textContent).not.toContain('`');
    expect(codesIn(heading)[0]?.textContent).toContain('CROSS JOIN');
  });
});
