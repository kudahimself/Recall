import { describe, expect, test } from 'vitest';
import { fileTypeErrors, typeErrors } from '../typecheck.js';
import { bookOnly, card, makeShelf, restock } from './bookShapes';

/**
 * The type errors in `code`, a few lines that use bookShapes.ts, as the compiler
 * reports them. A line after `// @ts-expect-error` must not compile.
 */
const check = (code: string) => typeErrors(`import { bookOnly, card, makeShelf, restock } from "./bookShapes";
import type { Book, Ebook, Isbn, Shelf, Stock } from "./bookShapes";
${code}`, import.meta.url);

describe('the types', () => {
  test('bookShapes.ts compiles with strict checks, every parameter typed', () => {
    expect(fileTypeErrors(new URL('./bookShapes.ts', import.meta.url))).toEqual([]);
  });

  test('Isbn is another name for string', () => {
    expect(check(`
      const isbn: Isbn = "111";
      const text: string = isbn;
      // @ts-expect-error an Isbn is a string, not a number
      const n: Isbn = 111;
    `)).toEqual([]);
  });

  test('a Book has a readonly isbn, a title, and pages it may not have', () => {
    expect(check(`
      const emma: Book = { isbn: "111", title: "Emma", pages: 474 };
      const dune: Book = { isbn: "222", title: "Dune" };
      emma.title = "Emma (new edition)";
      // @ts-expect-error a book needs a title
      const untitled: Book = { isbn: "333" };
      // @ts-expect-error pages are a number
      const bad: Book = { isbn: "333", title: "Beowulf", pages: "182" };
      // @ts-expect-error the isbn cannot be changed once set
      emma.isbn = "999";
    `)).toEqual([]);
  });

  test('an Ebook is a Book with a size, and fits wherever a Book does', () => {
    expect(check(`
      const dune: Ebook = { isbn: "222", title: "Dune", sizeMb: 2 };
      const asBook: Book = dune;
      card(dune, {});
      // @ts-expect-error an ebook needs its size
      const noSize: Ebook = { isbn: "222", title: "Dune" };
      // @ts-expect-error an ebook is still a book, with a title
      const noTitle: Ebook = { isbn: "222", sizeMb: 2 };
    `)).toEqual([]);
  });

  test('a Stock takes any ISBN as a key, each mapped to a number', () => {
    expect(check(`
      const stock: Stock = { "111": 4, "222": 0 };
      stock["333"] = 1;
      const left: number = restock(stock, "111", 2)["111"];
      // @ts-expect-error the counts are numbers
      const words: Stock = { "111": "four" };
    `)).toEqual([]);
  });

  test('a Shelf has a name, books and a count() method', () => {
    expect(check(`
      const shelf: Shelf = makeShelf("Fiction", [{ isbn: "111", title: "Emma" }]);
      const n: number = shelf.count();
      const first: Book = shelf.books[0];
      // @ts-expect-error count is a method to call
      const m: number = shelf.count;
      // @ts-expect-error a shelf's books are Books
      makeShelf("Fiction", ["Emma"]);
    `)).toEqual([]);
  });

  test('bookOnly gives back a Book', () => {
    expect(check(`
      const plain: Book = bookOnly({ isbn: "222", title: "Dune", sizeMb: 2 } as Ebook);
      // @ts-expect-error what comes back is a Book, which has no sizeMb
      bookOnly({ isbn: "222", title: "Dune", sizeMb: 2 } as Ebook).sizeMb;
    `)).toEqual([]);
  });
});

const emma = { isbn: '111', title: 'Emma', pages: 474 };
const dune = { isbn: '222', title: 'Dune', sizeMb: 2 };

test('card shows the title, the pages and the copies left, with fallbacks', () => {
  expect(card(emma, { '111': 4 })).toBe('Emma: 474 pages, 4 left');
  expect(card(dune, { '111': 4 })).toBe('Dune: ? pages, 0 left');
  expect(card(emma, { '111': 0 })).toBe('Emma: 474 pages, 0 left');
});

test('restock adds copies in a new Stock, leaving the old one as it was', () => {
  const stock = { '111': 4 };
  expect(restock(stock, '111', 2)).toEqual({ '111': 6 });
  expect(restock(stock, '222', 3)).toEqual({ '111': 4, '222': 3 });
  expect(stock).toEqual({ '111': 4 });
});

test('bookOnly keeps the Book fields and drops the rest', () => {
  expect(bookOnly(dune)).toEqual({ isbn: '222', title: 'Dune' });
  expect(Object.keys(bookOnly(dune))).toEqual(['isbn', 'title']);
  expect(bookOnly(emma)).toEqual(emma);
  expect(bookOnly(emma)).not.toBe(emma);
});

test('makeShelf counts its books', () => {
  const shelf = makeShelf('Fiction', [emma, dune]);
  expect(shelf.name).toBe('Fiction');
  expect(shelf.books).toEqual([emma, dune]);
  expect(shelf.count()).toBe(2);
  expect(makeShelf('Empty', []).count()).toBe(0);
});
