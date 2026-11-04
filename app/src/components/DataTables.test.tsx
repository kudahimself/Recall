import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { DataTables } from './DataTables';
import { renderInlineCode } from './InlineCode';
import { PredictOutputQuestion } from './PredictOutputQuestion';
import { MultipleChoiceQuestion } from './MultipleChoiceQuestion';
import { questions } from '../data/questions';
import {
  MultipleChoiceQuestion as MCQ,
  PredictOutputQuestion as PredictQ,
} from '../types';

const byId = <T,>(id: string) => questions.find(q => q.id === id) as unknown as T;

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
    const payment = screen.getByText('dbo.Payment').closest('figure') as HTMLElement;
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
    const [realNull, textNull] = within(screen.getByText('dbo.T').closest('figure') as HTMLElement).getAllByRole('cell');
    expect(realNull).toHaveClass('data-table-null');
    expect(textNull).not.toHaveClass('data-table-null');
    expect(within(screen.getByText('dbo.Empty').closest('figure') as HTMLElement).getByText('(no rows)')).toBeInTheDocument();
  });
});

describe('renderInlineCode', () => {
  it('turns backticked spans into inline code and leaves the rest as text', () => {
    const { container } = render(<p>{renderInlineCode('Use `IS NULL`, not `= NULL`.')}</p>);
    expect(Array.from(container.querySelectorAll('code')).map(c => c.textContent)).toEqual(['IS NULL', '= NULL']);
    expect(container.textContent).toBe('Use IS NULL, not = NULL.');
  });

  it('shows an unpaired backtick as written', () => {
    const { container } = render(<p>{renderInlineCode('a `b` c ` d')}</p>);
    expect(container.querySelectorAll('code')).toHaveLength(1);
    expect(container.textContent).toBe('a b c ` d');
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
    const { container } = render(<MultipleChoiceQuestion question={q} onAnswer={() => {}} showHints={false} />);
    expect(screen.getByText('dbo.DimColor')).toBeInTheDocument();
    expect(screen.getByText('dbo.DimSize')).toBeInTheDocument();
    const heading = container.querySelector('.question-text') as HTMLElement;
    expect(heading.textContent).not.toContain('`');
    expect(heading.querySelector('code')?.textContent).toContain('CROSS JOIN');
  });
});
