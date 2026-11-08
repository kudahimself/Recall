import { describe, expect, test } from 'vitest';
import { fileTypeErrors, typeErrors } from '../typecheck.js';
import { indexById, longest, paginate, pluck } from './pagedLists';

/**
 * The type errors in `code`, a few lines that use pagedLists.ts, as the compiler
 * reports them. A line after `// @ts-expect-error` must not compile.
 * Equals<A, B> is true only when A and B are exactly the same type (an `any` is not).
 */
const check = (code: string) => typeErrors(`import { indexById, longest, paginate, pluck } from "./pagedLists";
import type { Labelled, Page } from "./pagedLists";
type Equals<A, B> = (<X>() => X extends A ? 1 : 2) extends (<X>() => X extends B ? 1 : 2) ? true : false;
const books = [{ id: 7, title: "Emma", year: 1815 }, { id: 4, title: "Dune", year: 1965 }];
type BookRow = { id: number; title: string; year: number };
${code}`, import.meta.url);

describe('the types', () => {
  test('pagedLists.ts compiles with strict checks, every parameter typed', () => {
    expect(fileTypeErrors(new URL('./pagedLists.ts', import.meta.url))).toEqual([]);
  });

  test('Page<T> holds items of its type parameter', () => {
    expect(check(`
      const page: Page<string> = { items: ["Emma"], page: 1, total: 1, pages: 1 };
      // @ts-expect-error a Page<string> holds strings
      const wrong: Page<string> = { items: [1], page: 1, total: 1, pages: 1 };
      // @ts-expect-error every field is there
      const short: Page<number> = { items: [1] };
    `)).toEqual([]);
  });

  test('Labelled<T> holds a string when it is given no type', () => {
    expect(check(`
      const a: Labelled = { value: "Emma", label: "title" };
      const b: Labelled<number> = { value: 1815, label: "year" };
      // @ts-expect-error a plain Labelled holds a string
      const c: Labelled = { value: 1815, label: "year" };
    `)).toEqual([]);
  });

  test('paginate gives a Page of whatever it is given', () => {
    expect(check(`
      const page = paginate(books, 1);
      const exact: Equals<typeof page, Page<BookRow>> = true;
      const title: string = page.items[0].title;
      const second: Equals<ReturnType<typeof paginate<number>>, Page<number>> = true;
      paginate(books, 1, 2);
    `)).toEqual([]);
  });

  test('longest takes anything with a length and gives back the same type', () => {
    expect(check(`
      const word = longest(["Emma", "Ulysses"]);
      const exact: Equals<typeof word, string | undefined> = true;
      const list = longest([[1], [1, 2]]);
      const exactList: Equals<typeof list, number[] | undefined> = true;
      // @ts-expect-error numbers have no length
      longest([1, 2]);
    `)).toEqual([]);
  });

  test('pluck takes only a real key and gives an array of its type', () => {
    expect(check(`
      const years = pluck(books, "year");
      const exact: Equals<typeof years, number[]> = true;
      const titles: Equals<ReturnType<typeof pluck<BookRow, "title">>, string[]> = true;
      // @ts-expect-error the books have no author key
      pluck(books, "author");
    `)).toEqual([]);
  });

  test('indexById takes rows with a numeric id and maps to the same rows', () => {
    expect(check(`
      const byId = indexById(books);
      const exact: Equals<typeof byId, Map<number, BookRow>> = true;
      // @ts-expect-error these rows have no id
      indexById([{ title: "Emma" }]);
      // @ts-expect-error the id must be a number
      indexById([{ id: "7", title: "Emma" }]);
    `)).toEqual([]);
  });
});

const letters = ['a', 'b', 'c', 'd', 'e'];
const books = [
  { id: 7, title: 'Emma', year: 1815 },
  { id: 4, title: 'Dune', year: 1965 },
];

describe('paginate', () => {
  test('gives the first page by default', () => {
    expect(paginate(letters, 2)).toEqual({ items: ['a', 'b'], page: 1, total: 5, pages: 3 });
  });

  test('gives the page asked for, short at the end and empty past it', () => {
    expect(paginate(letters, 2, 3)).toEqual({ items: ['e'], page: 3, total: 5, pages: 3 });
    expect(paginate(letters, 2, 4).items).toEqual([]);
    expect(paginate([], 2)).toEqual({ items: [], page: 1, total: 0, pages: 0 });
  });

  test('leaves the list as it was', () => {
    const all = [...letters];
    paginate(all, 2, 2);
    expect(all).toEqual(letters);
  });
});

test('longest finds the first of the longest, or undefined', () => {
  expect(longest(['Emma', 'Ulysses', 'Beowulf'])).toBe('Ulysses');
  expect(longest([[1], [1, 2, 3], [4, 5]])).toEqual([1, 2, 3]);
  expect(longest([])).toBeUndefined();
});

test('pluck reads one key from every row', () => {
  expect(pluck(books, 'year')).toEqual([1815, 1965]);
  expect(pluck(books, 'title')).toEqual(['Emma', 'Dune']);
});

test('indexById maps each id to its row', () => {
  const byId = indexById(books);
  expect(byId).toBeInstanceOf(Map);
  expect(byId.size).toBe(2);
  expect(byId.get(4)).toBe(books[1]);
  expect(byId.get(99)).toBeUndefined();
});
