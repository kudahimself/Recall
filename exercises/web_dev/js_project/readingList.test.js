import { JSDOM } from 'jsdom';
import { describe, expect, test } from 'vitest';
import { STORAGE_KEY, addBook, loadList, removeBook, renderList, saveList, toggleRead, unreadCount } from './readingList.js';

const list = () => [
  { id: 1, title: 'Emma', read: true },
  { id: 4, title: 'Dune', read: false },
  { id: 2, title: 'Piranesi', read: false },
];

/** Storage shaped like localStorage, keeping strings in a Map. */
function fakeStorage(entries = {}) {
  const data = new Map(Object.entries(entries));
  return {
    data,
    getItem: key => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => { data.set(key, String(value)); },
  };
}

describe('addBook', () => {
  test('adds the trimmed title at the end, with the next id, unread', () => {
    const books = list();
    const after = addBook(books, '  Persuasion ');
    expect(after).toEqual([...list(), { id: 5, title: 'Persuasion', read: false }]);
    expect(after).not.toBe(books);
    expect(books).toEqual(list());
  });

  test('starts the ids at 1', () => {
    expect(addBook([], 'Emma')).toEqual([{ id: 1, title: 'Emma', read: false }]);
  });

  test('gives back the same list for a blank title', () => {
    const books = list();
    expect(addBook(books, '   ')).toBe(books);
    expect(addBook(books, '')).toBe(books);
  });
});

test('toggleRead flips one book as a new object and keeps the rest', () => {
  const books = list();
  const after = toggleRead(books, 4);
  expect(after.map(b => b.read)).toEqual([true, true, false]);
  expect(after).not.toBe(books);
  expect(after[1]).not.toBe(books[1]);
  expect(after[0]).toBe(books[0]);
  expect(after[2]).toBe(books[2]);
  expect(books).toEqual(list());
  expect(toggleRead(after, 4)[1].read).toBe(false);
});

test('removeBook leaves out one book', () => {
  const books = list();
  expect(removeBook(books, 4).map(b => b.title)).toEqual(['Emma', 'Piranesi']);
  expect(removeBook(books, 99)).toEqual(list());
  expect(books).toEqual(list());
});

test('unreadCount counts the books not read yet', () => {
  expect(unreadCount(list())).toBe(2);
  expect(unreadCount([])).toBe(0);
});

describe('saving and loading', () => {
  test('saveList keeps the list as JSON under the storage key', () => {
    const storage = fakeStorage();
    saveList(list(), storage);
    expect(STORAGE_KEY).toBe('reading-list');
    expect(JSON.parse(storage.data.get('reading-list'))).toEqual(list());
  });

  test('loadList gives back what was saved', () => {
    const storage = fakeStorage();
    saveList(list(), storage);
    expect(loadList(storage)).toEqual(list());
  });

  test('loadList gives an empty list for nothing saved, broken JSON or something else saved', () => {
    expect(loadList(fakeStorage())).toEqual([]);
    expect(loadList(fakeStorage({ 'reading-list': '{not json' }))).toEqual([]);
    expect(loadList(fakeStorage({ 'reading-list': '{"id":1}' }))).toEqual([]);
  });
});

describe('renderList', () => {
  const page = () => new JSDOM('<ul id="list"><li>stale</li></ul>').window.document;

  test('rebuilds the list from the books, in order, replacing what was there', () => {
    const doc = page();
    const ul = doc.getElementById('list');
    renderList(list(), ul);
    const items = [...ul.children];
    expect(items.map(li => li.tagName)).toEqual(['LI', 'LI', 'LI']);
    expect(items.map(li => li.textContent)).toEqual(['Emma', 'Dune', 'Piranesi']);
    expect(items.map(li => li.dataset.id)).toEqual(['1', '4', '2']);
    expect(items.map(li => li.classList.contains('read'))).toEqual([true, false, false]);
    renderList([], ul);
    expect(ul.children).toHaveLength(0);
  });

  test('puts titles in as text, never as markup', () => {
    const ul = page().getElementById('list');
    renderList([{ id: 1, title: '<b>Bold</b>', read: false }], ul);
    expect(ul.querySelector('b')).toBeNull();
    expect(ul.textContent).toBe('<b>Bold</b>');
  });
});
