// @vitest-environment jsdom
import { afterEach, expect, test } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Basket } from './Basket.jsx';

afterEach(cleanup);

/** The catalogue, frozen, so changing it in place throws. */
const books = () => Object.freeze([
  Object.freeze({ id: 7, title: 'Emma', price: 8 }),
  Object.freeze({ id: 9, title: 'Dune', price: 12 }),
  Object.freeze({ id: 3, title: 'Beowulf', price: 6.5 }),
]);

const click = name => fireEvent.click(screen.getByRole('button', { name }));
/** The text of each basket line, without its buttons' labels. */
const lines = () => screen.queryAllByRole('listitem').map(li => {
  const copy = li.cloneNode(true);
  copy.querySelectorAll('button').forEach(b => b.remove());
  return copy.textContent.replace(/\s+/g, ' ').trim();
});
const summary = () => screen.getByText(/copy|copies|empty/).textContent;

test('starts with one Add button per book and an empty basket', () => {
  render(<Basket books={books()} />);
  expect(screen.getAllByRole('button').map(b => b.textContent)).toEqual(['Add Emma', 'Add Dune', 'Add Beowulf']);
  expect(lines()).toEqual([]);
  expect(summary()).toBe('Basket is empty');
});

test('adds a line for a book, and sums it up', () => {
  render(<Basket books={books()} />);
  click('Add Emma');
  expect(lines()).toEqual(['Emma x1']);
  expect(summary()).toBe('1 copy, £8.00');
});

test('adds a copy to the book\'s line when it is already in the basket', () => {
  render(<Basket books={books()} />);
  click('Add Emma');
  click('Add Dune');
  click('Add Emma');
  expect(lines()).toEqual(['Emma x2', 'Dune x1']);
  expect(summary()).toBe('3 copies, £28.00');
});

test('More adds one copy to that line only', () => {
  render(<Basket books={books()} />);
  click('Add Emma');
  click('Add Beowulf');
  click('More Beowulf');
  expect(lines()).toEqual(['Emma x1', 'Beowulf x2']);
  expect(summary()).toBe('3 copies, £21.00');
});

test('Two more adds two copies in one click', () => {
  render(<Basket books={books()} />);
  click('Add Dune');
  click('Two more Dune');
  expect(lines()).toEqual(['Dune x3']);
  click('Two more Dune');
  expect(lines()).toEqual(['Dune x5']);
  expect(summary()).toBe('5 copies, £60.00');
});

test('Remove takes the line out and keeps the others', () => {
  render(<Basket books={books()} />);
  click('Add Emma');
  click('Add Dune');
  click('Add Beowulf');
  click('Remove Dune');
  expect(lines()).toEqual(['Emma x1', 'Beowulf x1']);
  expect(screen.queryByRole('button', { name: 'Remove Dune' })).toBeNull();
  click('Remove Emma');
  click('Remove Beowulf');
  expect(summary()).toBe('Basket is empty');
});

test('each basket keeps its own lines', () => {
  render(<><Basket books={books()} /><Basket books={books()} /></>);
  fireEvent.click(screen.getAllByRole('button', { name: 'Add Emma' })[0]);
  expect(lines()).toEqual(['Emma x1']);
  expect(screen.getByText('Basket is empty')).toBeInTheDocument();
});
