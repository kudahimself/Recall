// @vitest-environment jsdom
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { AddForm, STORAGE_KEY, Wishlist, loadWishlist, wishlistReducer } from './Wishlist.jsx';

afterEach(cleanup);

/** A list frozen all the way down, so changing it in place throws. */
const list = () => Object.freeze([
  Object.freeze({ id: 1, title: 'Emma', bought: true }),
  Object.freeze({ id: 4, title: 'Dune', bought: false }),
]);

/** Storage shaped like localStorage, keeping strings in a Map. */
function fakeStorage(entries = {}) {
  const data = new Map(Object.entries(entries));
  return {
    data,
    getItem: key => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => { data.set(key, String(value)); },
  };
}

describe('wishlistReducer', () => {
  test('adds the trimmed title at the end, with the next id, not bought yet', () => {
    expect(wishlistReducer(list(), { type: 'added', title: ' Piranesi ' }))
      .toEqual([...list(), { id: 5, title: 'Piranesi', bought: false }]);
    expect(wishlistReducer([], { type: 'added', title: 'Emma' })).toEqual([{ id: 1, title: 'Emma', bought: false }]);
  });

  test('gives back the same list for a blank title or an action it does not know', () => {
    const items = list();
    expect(wishlistReducer(items, { type: 'added', title: '  ' })).toBe(items);
    expect(wishlistReducer(items, { type: 'shuffled' })).toBe(items);
  });

  test('toggles one item as a new object and keeps the other', () => {
    const items = list();
    const after = wishlistReducer(items, { type: 'toggled', id: 4 });
    expect(after.map(item => item.bought)).toEqual([true, true]);
    expect(after[1]).not.toBe(items[1]);
    expect(after[0]).toBe(items[0]);
  });

  test('removes one item', () => {
    expect(wishlistReducer(list(), { type: 'removed', id: 1 })).toEqual([list()[1]]);
  });
});

test('loadWishlist reads the saved list, or starts empty', () => {
  expect(loadWishlist(fakeStorage({ wishlist: JSON.stringify(list()) }))).toEqual(list());
  expect(loadWishlist(fakeStorage())).toEqual([]);
  expect(loadWishlist(fakeStorage({ wishlist: '{broken' }))).toEqual([]);
  expect(loadWishlist(fakeStorage({ wishlist: '{"id":1}' }))).toEqual([]);
});

test('AddForm hands up what was typed, empties the box, and skips a blank title', () => {
  const onAdd = vi.fn();
  render(<AddForm onAdd={onAdd} />);
  const box = screen.getByRole('textbox', { name: 'Title' });
  fireEvent.change(box, { target: { value: 'Persuasion' } });
  expect(fireEvent.submit(box.closest('form'))).toBe(false);
  expect(onAdd).toHaveBeenCalledWith('Persuasion');
  expect(box).toHaveValue('');
  fireEvent.change(box, { target: { value: '   ' } });
  fireEvent.click(screen.getByRole('button', { name: 'Add' }));
  expect(onAdd).toHaveBeenCalledTimes(1);
});

describe('Wishlist', () => {
  /** Render the app on `storage`, with helpers that use it the way a reader does. */
  function app(storage = fakeStorage()) {
    render(<Wishlist storage={storage} />);
    return {
      storage,
      add(title) {
        fireEvent.change(screen.getByRole('textbox', { name: 'Title' }), { target: { value: title } });
        fireEvent.click(screen.getByRole('button', { name: 'Add' }));
      },
      titles: () => screen.queryAllByRole('listitem').map(li => li.firstChild.textContent),
      summary: () => screen.getByText(/wanted, \d+ bought/).textContent,
      saved: () => JSON.parse(storage.data.get(STORAGE_KEY)),
    };
  }

  test('starts from the saved list', () => {
    const { titles, summary } = app(fakeStorage({ wishlist: JSON.stringify(list()) }));
    expect(titles()).toEqual(['Emma', 'Dune']);
    expect(screen.getByRole('checkbox', { name: 'Bought Emma' })).toBeChecked();
    expect(summary()).toBe('1 wanted, 1 bought');
  });

  test('adds books from the form', () => {
    const { add, titles, summary } = app();
    add('Emma');
    add('Dune');
    expect(titles()).toEqual(['Emma', 'Dune']);
    expect(summary()).toBe('2 wanted, 0 bought');
  });

  test('ticks a book as bought, and removes one', () => {
    const { add, titles, summary } = app();
    add('Emma');
    add('Dune');
    fireEvent.click(screen.getByRole('checkbox', { name: 'Bought Dune' }));
    expect(summary()).toBe('1 wanted, 1 bought');
    fireEvent.click(screen.getByRole('button', { name: 'Remove Emma' }));
    expect(titles()).toEqual(['Dune']);
    expect(summary()).toBe('0 wanted, 1 bought');
  });

  test('Still wanted leaves the bought books out, and All brings them back', () => {
    const { titles, summary } = app(fakeStorage({ wishlist: JSON.stringify(list()) }));
    const all = screen.getByRole('button', { name: 'All' });
    const wanted = screen.getByRole('button', { name: 'Still wanted' });
    expect(all).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(wanted);
    expect(titles()).toEqual(['Dune']);
    expect(wanted).toHaveAttribute('aria-pressed', 'true');
    expect(all).toHaveAttribute('aria-pressed', 'false');
    expect(summary()).toBe('1 wanted, 1 bought');
    fireEvent.click(all);
    expect(titles()).toEqual(['Emma', 'Dune']);
  });

  test('saves the list each time it changes', () => {
    const { add, saved } = app();
    add('Emma');
    expect(saved()).toEqual([{ id: 1, title: 'Emma', bought: false }]);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Bought Emma' }));
    expect(saved()).toEqual([{ id: 1, title: 'Emma', bought: true }]);
    fireEvent.click(screen.getByRole('button', { name: 'Remove Emma' }));
    expect(saved()).toEqual([]);
  });

  // Your test here: for example, that a book bought under "Still wanted" leaves the list at once.
});
