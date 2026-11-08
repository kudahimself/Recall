import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { loadPage, styleOf } from '../page.js';

const file = new URL('./catalogue.html', import.meta.url);
const at = (width, options = {}) => loadPage(file, { width, ...options }).document;
const css = () => readFileSync(new URL('./catalogue.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const columnCount = el => styleOf(el, 'grid-template-columns')
  .replace(/repeat\(\s*(\d+)\s*,\s*([^)]+?)\s*\)/g, (_, n, track) => Array(Number(n)).fill(track).join(' '))
  .trim().split(/\s+/).filter(Boolean).length;

test('the page asks a phone to render it at the phone\'s own width', () => {
  const meta = at(375).querySelector('meta[name="viewport"]');
  const content = (meta?.getAttribute('content') ?? '').replace(/\s+/g, '');
  expect(content.split(',').sort()).toEqual(['initial-scale=1', 'width=device-width']);
});

test('the content is centred and capped at 1100px, with 16px at the sides on a phone', () => {
  for (const width of [375, 1440]) {
    const main = at(width).querySelector('.container');
    expect(styleOf(main, 'max-width')).toBe('1100px');
    expect(styleOf(main, 'margin-left')).toBe('auto');
    expect(styleOf(main, 'margin-right')).toBe('auto');
    expect(styleOf(main, 'padding-left')).toBe('16px');
    expect(styleOf(main, 'padding-right')).toBe('16px');
  }
});

describe('the list of books', () => {
  test.each([[375, 1], [639, 1], [640, 2], [900, 2], [1024, 4], [1440, 4]])('at %ipx wide has %i equal columns', (width, count) => {
    const books = at(width).querySelector('.books');
    expect(styleOf(books, 'display')).toBe('grid');
    expect(columnCount(books)).toBe(count);
    expect(styleOf(books, 'grid-template-columns')).toMatch(/1fr/);
  });

  test('is written mobile-first: the phone layout has no media query, and none asks for a max-width', () => {
    const text = css();
    expect(text).toMatch(/@media[^{]*min-width/);
    expect(text).not.toMatch(/@media[^{]*max-width/);
    const books = at(375).querySelector('.books');
    expect(columnCount(books)).toBe(1);
  });
});

test('the phone shows the menu button, and from 768px the menu itself as a row', () => {
  const phone = at(767);
  expect(styleOf(phone.querySelector('.menu-button'), 'display')).toBe('block');
  expect(styleOf(phone.querySelector('.menu'), 'display')).toBe('none');
  const tablet = at(768);
  expect(styleOf(tablet.querySelector('.menu-button'), 'display')).toBe('none');
  expect(styleOf(tablet.querySelector('.menu'), 'display')).toBe('flex');
});

test('the heading scales with the width between 24px and 40px', () => {
  const size = width => styleOf(at(width).querySelector('h1'), 'font-size');
  expect(css()).toMatch(/clamp\(/);
  expect(size(375)).toBe('24px');
  expect(size(800)).toBe('32px');
  expect(size(1440)).toBe('40px');
});

test('the books animate on hover, except for a reader who asks for reduced motion', () => {
  const moving = styleOf(at(1024).querySelector('.book'), 'transition');
  expect(moving).toMatch(/transform/);
  expect(moving).toMatch(/0?\.2s|200ms/);
  const still = styleOf(at(1024, { reducedMotion: true }).querySelector('.book'), 'transition');
  expect(still === 'none' || /^(all )?0s/.test(still)).toBe(true);
});
