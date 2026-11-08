// @vitest-environment jsdom
import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router';
import { AppRoutes } from './BookRoutes.jsx';

afterEach(cleanup);

/** The app's routes in a router that starts at `url` and keeps its history in memory. */
const openAt = url => render(<MemoryRouter initialEntries={[url]}><AppRoutes /></MemoryRouter>);
const heading = () => screen.getByRole('heading', { level: 1 }).textContent;
const link = name => screen.getByRole('link', { name });

describe('the pages', () => {
  test('"/" lists the books, each linking to its page, under the Home link', () => {
    openAt('/');
    expect(heading()).toBe('Pick a book');
    expect(screen.getByRole('navigation')).toContainElement(link('Home'));
    expect(link('Home')).toHaveAttribute('href', '/');
    const items = screen.getAllByRole('listitem');
    expect(items.map(li => li.textContent)).toEqual(['Emma', 'Dune', 'Beowulf']);
    expect(link('Dune')).toHaveAttribute('href', '/books/2');
  });

  test('"/books/2" shows that book, inside the same frame', () => {
    openAt('/books/2');
    expect(heading()).toBe('Dune');
    expect(link('Home')).toBeInTheDocument();
    expect(link('Next book')).toHaveAttribute('href', '/books/3');
  });

  test('the last book has no Next book link', () => {
    openAt('/books/3');
    expect(heading()).toBe('Beowulf');
    expect(screen.queryByRole('link', { name: 'Next book' })).toBeNull();
  });

  test('an unknown book and an unknown page each say so', () => {
    openAt('/books/99');
    expect(heading()).toBe('No such book');
    cleanup();
    openAt('/basket/old');
    expect(heading()).toBe('Page not found');
    expect(link('Home')).toBeInTheDocument();
  });
});

describe('moving around without reloading the page', () => {
  test('a book\'s link in the list opens its page', () => {
    openAt('/');
    fireEvent.click(link('Emma'));
    expect(heading()).toBe('Emma');
  });

  test('Home goes back to the list', () => {
    openAt('/books/1');
    fireEvent.click(link('Home'));
    expect(heading()).toBe('Pick a book');
  });

  test('Back to the list goes to "/"', () => {
    openAt('/books/2');
    fireEvent.click(screen.getByRole('button', { name: 'Back to the list' }));
    expect(heading()).toBe('Pick a book');
  });

  test('the note starts empty again on the next book', () => {
    openAt('/books/1');
    const note = () => screen.getByRole('textbox', { name: 'Your note' });
    fireEvent.change(note(), { target: { value: 'Read chapter 3 again' } });
    expect(note()).toHaveValue('Read chapter 3 again');
    fireEvent.click(link('Next book'));
    expect(heading()).toBe('Dune');
    expect(note()).toHaveValue('');
  });
});
