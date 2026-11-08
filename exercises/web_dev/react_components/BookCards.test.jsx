// @vitest-environment jsdom
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { BookCard, Shelf, StockNote } from './BookCards.jsx';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const books = () => [
  { id: 7, title: 'Emma', author: 'Austen', stock: 2, isNew: false },
  { id: 9, title: 'Dune', author: 'Herbert', stock: 0, isNew: true },
  { id: 3, title: 'Beowulf', author: '', stock: 5, isNew: false },
];

// React warns about each mistake once per run, so this test renders first.
test('the shelf renders without React warnings: a key on each card, and className, not class', () => {
  const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
  render(<Shelf books={books()}><h2>Fiction</h2></Shelf>);
  expect(screen.getAllByRole('listitem')).toHaveLength(3);
  expect(errors).not.toHaveBeenCalled();
});

describe('StockNote', () => {
  test('shows how many are left in bold', () => {
    const { container } = render(<StockNote stock={2} />);
    expect(container.innerHTML).toBe('<b>2 left</b>');
  });

  test('shows sold out in italics, never the number 0', () => {
    const { container } = render(<StockNote stock={0} />);
    expect(container.innerHTML).toBe('<i>sold out</i>');
  });
});

describe('BookCard', () => {
  test('is one <li class="book"> with the title, the author and the stock', () => {
    const { container } = render(<BookCard title="Emma" author="Austen" stock={2} />);
    const li = container.firstChild;
    expect(li.tagName).toBe('LI');
    expect(li).toHaveClass('book');
    expect(li).not.toHaveClass('sold-out');
    expect(li.querySelector('span.title')).toHaveTextContent('Emma');
    expect(li).toHaveTextContent('Emma by Austen 2 left');
    expect(screen.getByRole('button', { name: 'Buy' })).toBeEnabled();
  });

  test('leaves out " by " when there is no author', () => {
    render(<BookCard title="Beowulf" author="" stock={5} />);
    expect(screen.getByRole('listitem')).toHaveTextContent(/^Beowulf 5 left/);
    expect(screen.getByRole('listitem').textContent).not.toMatch(/by/);
  });

  test('is marked sold out, with a disabled button, when the stock is 0', () => {
    render(<BookCard title="Dune" author="Herbert" stock={0} />);
    expect(screen.getByRole('listitem')).toHaveClass('book', 'sold-out');
    expect(screen.getByRole('listitem')).toHaveTextContent('Dune by Herbert sold out');
    expect(screen.getByRole('button', { name: 'Sold out' })).toBeDisabled();
  });
});

describe('Shelf', () => {
  test('shows the children, then the badge, then one card per book, with no wrapping element', () => {
    const { container } = render(<Shelf books={books()}><h2>Fiction</h2></Shelf>);
    expect([...container.children].map(el => el.tagName)).toEqual(['H2', 'SPAN', 'UL']);
    expect(container.querySelector('h2')).toHaveTextContent('Fiction');
    expect(container.querySelector('span.badge')).toHaveTextContent('1 new');
    const titles = screen.getAllByRole('listitem').map(li => li.querySelector('.title').textContent);
    expect(titles).toEqual(['Emma', 'Dune', 'Beowulf']);
  });

  test('shows nothing at all for the badge when no book is new, not a 0', () => {
    const none = books().map(b => ({ ...b, isNew: false }));
    const { container } = render(<Shelf books={none}><h2>Fiction</h2></Shelf>);
    expect([...container.children].map(el => el.tagName)).toEqual(['H2', 'UL']);
    expect(container.textContent).not.toMatch(/0/);
  });

  test('keys each card by the book\'s id, so a card stays with its book when the list changes', () => {
    const { rerender } = render(<Shelf books={books()} />);
    const emma = screen.getByText('Emma').closest('li');
    const persuasion = { id: 12, title: 'Persuasion', author: 'Austen', stock: 1, isNew: true };
    rerender(<Shelf books={[persuasion, ...books()]} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
    expect(screen.getByText('Emma').closest('li')).toBe(emma);
  });

  test('says the shelf is empty instead of an empty list', () => {
    const { container } = render(<Shelf books={[]} />);
    expect(container.querySelector('ul')).toBeNull();
    expect(container.querySelector('p')).toHaveTextContent('Nothing on this shelf');
    expect(container.querySelector('.badge')).toBeNull();
  });
});
