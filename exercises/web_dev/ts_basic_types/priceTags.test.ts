import { describe, expect, test } from 'vitest';
import { fileTypeErrors, typeErrors } from '../typecheck.js';
import { fail, label, pageCount, price, shelfCode } from './priceTags';

/**
 * The type errors in `code`, a few lines that use priceTags.ts, as the compiler
 * reports them. A line after `// @ts-expect-error` must not compile.
 */
const check = (code: string) => typeErrors(`import { fail, label, pageCount, price, shelfCode } from "./priceTags";
import type { Format } from "./priceTags";
${code}`, import.meta.url);

describe('the types', () => {
  test('priceTags.ts compiles with strict checks, every parameter typed', () => {
    expect(fileTypeErrors(new URL('./priceTags.ts', import.meta.url))).toEqual([]);
  });

  test('Format allows the three formats and no other string', () => {
    expect(check(`
      const formats: Format[] = ["paperback", "hardback", "ebook"];
      // @ts-expect-error "audio" is not a Format
      const audio: Format = "audio";
      // @ts-expect-error a Format is one of three strings, not any string
      const someString: Format = String("ebook");
    `)).toEqual([]);
  });

  test('price takes a number, a Format and an optional number, and returns a number', () => {
    expect(check(`
      const a: number = price(12, "ebook");
      const b: number = price(12, "paperback", 2);
      // @ts-expect-error the base price is a number, not a string
      price("12", "ebook");
      // @ts-expect-error the format must be a Format
      price(12, "audio");
      // @ts-expect-error price returns a number
      const c: string = price(12, "hardback");
    `)).toEqual([]);
  });

  test('pageCount takes unknown, not any, and returns a number', () => {
    expect(check(`
      type Param = Parameters<typeof pageCount>[0];
      type IsAny<T> = 0 extends 1 & T ? true : false;
      const notAny: IsAny<Param> = false;
      const takesAnything: unknown extends Param ? true : false = true;
      const n: number = pageCount({ pages: 3 });
    `)).toEqual([]);
  });

  test('label takes a title and tags that may be left out', () => {
    expect(check(`
      const a: string = label("Emma");
      const b: string = label("Emma", ["classic"]);
      // @ts-expect-error the tags are an array of strings
      label("Emma", "classic");
      // @ts-expect-error the title is a string
      label(7);
    `)).toEqual([]);
  });

  test('shelfCode takes a string or a number', () => {
    expect(check(`
      const a: string = shelfCode(7);
      const b: string = shelfCode("b12");
      // @ts-expect-error neither a string nor a number
      shelfCode(true);
    `)).toEqual([]);
  });

  test('fail is declared to return never', () => {
    expect(check(`
      type IsNever<T> = [T] extends [never] ? true : false;
      const never: IsNever<ReturnType<typeof fail>> = true;
      // @ts-expect-error the message is a string
      fail(404);
    `)).toEqual([]);
  });
});

describe('price', () => {
  test('is the base for a paperback, 5 more for a hardback and 3 less for an ebook', () => {
    expect(price(12, 'paperback')).toBe(12);
    expect(price(12, 'hardback')).toBe(17);
    expect(price(12, 'ebook')).toBe(9);
  });

  test('takes the discount off when there is one', () => {
    expect(price(12, 'ebook', 2)).toBe(7);
    expect(price(12, 'paperback', 0)).toBe(12);
  });

  test('never makes an ebook cost less than nothing', () => {
    expect(price(2, 'ebook')).toBe(0);
  });
});

test('pageCount keeps a number, converts a string and counts anything else as 0', () => {
  expect(pageCount(328)).toBe(328);
  expect(pageCount('320')).toBe(320);
  expect(pageCount(' 12 ')).toBe(12);
  expect(pageCount('lots')).toBe(0);
  expect(pageCount(null)).toBe(0);
  expect(pageCount(undefined)).toBe(0);
  expect(pageCount({ pages: 3 })).toBe(0);
});

test('label adds the tags in brackets when there are some', () => {
  expect(label('Emma', ['classic', 'romance'])).toBe('Emma [classic, romance]');
  expect(label('Emma')).toBe('Emma');
  expect(label('Emma', [])).toBe('Emma');
});

test('shelfCode pads a number and tidies a string', () => {
  expect(shelfCode(7)).toBe('B007');
  expect(shelfCode(1234)).toBe('B1234');
  expect(shelfCode(' b12 ')).toBe('B12');
});

test('fail throws an Error with the message', () => {
  expect(() => fail('no such book')).toThrow(new Error('no such book'));
});
