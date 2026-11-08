import { describe, expect, test } from 'vitest';
import { fileTypeErrors, typeErrors } from '../typecheck.js';
import { applyPatch, freeze, shelve, toCard, totalStock } from './bookRecords';

/**
 * The type errors in `code`, a few lines that use bookRecords.ts, as the compiler
 * reports them. A line after `// @ts-expect-error` must not compile.
 * Equals<A, B> is true only when A and B are exactly the same type.
 */
const check = (code: string) => typeErrors(`import { applyPatch, freeze, shelve, toCard, totalStock } from "./bookRecords";
import type { Book, BookCard, BookPatch, NewBook, Shelved, StockByFormat } from "./bookRecords";
type Equals<A, B> = (<X>() => X extends A ? 1 : 2) extends (<X>() => X extends B ? 1 : 2) ? true : false;
type Flat<T> = { [K in keyof T]: T[K] };
const emma: Book = { isbn: "111", title: "Emma", price: 8, stock: 2 };
${code}`, import.meta.url);

describe('the types', () => {
  test('bookRecords.ts compiles with strict checks, every parameter typed', () => {
    expect(fileTypeErrors(new URL('./bookRecords.ts', import.meta.url))).toEqual([]);
  });

  test('NewBook is a Book without its stock', () => {
    expect(check(`
      const same: Equals<Flat<NewBook>, { isbn: string; title: string; price: number }> = true;
      // @ts-expect-error a new book has no stock yet
      const stocked: NewBook = { isbn: "1", title: "Dune", price: 9, stock: 3 };
    `)).toEqual([]);
  });

  test('BookCard holds only the title and the price', () => {
    expect(check(`
      const same: Equals<Flat<BookCard>, { title: string; price: number }> = true;
      // @ts-expect-error a card has no isbn
      toCard(emma).isbn;
    `)).toEqual([]);
  });

  test('BookPatch may hold any field but the isbn, each optional', () => {
    expect(check(`
      const same: Equals<Flat<BookPatch>, { title?: string; price?: number; stock?: number }> = true;
      applyPatch(emma, {});
      applyPatch(emma, { price: 6 });
      // @ts-expect-error the isbn cannot be patched
      applyPatch(emma, { isbn: "222" });
      // @ts-expect-error a price is still a number
      applyPatch(emma, { price: "6" });
    `)).toEqual([]);
  });

  test('StockByFormat needs a count for every format', () => {
    expect(check(`
      const all: StockByFormat = { paperback: 3, hardback: 0, ebook: 9 };
      totalStock(all);
      // @ts-expect-error the hardback and ebook counts are missing
      const some: StockByFormat = { paperback: 3 };
      // @ts-expect-error there is no audio format
      const audio: StockByFormat = { paperback: 3, hardback: 0, ebook: 9, audio: 1 };
    `)).toEqual([]);
  });

  test('Shelved is read off shelve, and is a Book', () => {
    expect(check(`
      const same: Equals<Shelved, Book> = true;
      const shelved: Shelved = shelve({ isbn: "1", title: "Dune", price: 9 });
    `)).toEqual([]);
  });

  test('freeze gives back a book whose fields cannot be set', () => {
    expect(check(`
      const frozen = freeze(emma);
      const same: Equals<typeof frozen, Readonly<Book>> = true;
      // @ts-expect-error a frozen book is readonly
      frozen.price = 1;
    `)).toEqual([]);
  });
});

const emma = { isbn: '111', title: 'Emma', price: 8, stock: 2 };

test('shelve adds a stock of 0 to a copy', () => {
  const fresh = { isbn: '222', title: 'Dune', price: 9 };
  expect(shelve(fresh)).toEqual({ isbn: '222', title: 'Dune', price: 9, stock: 0 });
  expect(fresh).toEqual({ isbn: '222', title: 'Dune', price: 9 });
});

test('toCard copies only the title and the price', () => {
  const withExtras = { ...emma, supplier: 'Penguin' };
  expect(toCard(withExtras)).toEqual({ title: 'Emma', price: 8 });
  expect(Object.keys(toCard(withExtras))).toEqual(['title', 'price']);
});

describe('applyPatch', () => {
  test('lays the patch over a copy of the book', () => {
    expect(applyPatch(emma, { price: 6 })).toEqual({ isbn: '111', title: 'Emma', price: 6, stock: 2 });
    expect(applyPatch(emma, { title: 'Emma (new edition)', stock: 5 }))
      .toEqual({ isbn: '111', title: 'Emma (new edition)', price: 8, stock: 5 });
    expect(emma).toEqual({ isbn: '111', title: 'Emma', price: 8, stock: 2 });
  });

  test('keeps a field the patch sets to undefined', () => {
    expect(applyPatch(emma, { price: undefined, stock: 0 })).toEqual({ isbn: '111', title: 'Emma', price: 8, stock: 0 });
  });
});

test('freeze freezes a copy, not the book', () => {
  const book = { ...emma };
  const frozen = freeze(book);
  expect(frozen).toEqual(book);
  expect(Object.isFrozen(frozen)).toBe(true);
  expect(Object.isFrozen(book)).toBe(false);
});

test('totalStock adds up every format', () => {
  expect(totalStock({ paperback: 3, hardback: 0, ebook: 9 })).toBe(12);
  expect(totalStock({ paperback: 0, hardback: 0, ebook: 0 })).toBe(0);
});
