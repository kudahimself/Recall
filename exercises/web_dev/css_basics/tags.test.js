import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { loadPage, styleOf } from '../page.js';

const page = () => loadPage(new URL('./tags.html', import.meta.url)).document;
const css = () => readFileSync(new URL('./tags.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const CRIMSON = 'rgb(220, 20, 60)';
const NAVY = 'rgb(0, 0, 128)';
const INK = 'rgb(34, 34, 34)';
const GREY = 'rgb(85, 85, 85)';

test('the root element holds the two custom properties', () => {
  const root = page().documentElement;
  expect(styleOf(root, '--accent')).toBe('crimson');
  expect(styleOf(root, '--ink')).toBe('#222');
});

test('the page text is the ink color, which headings inherit from the body', () => {
  const doc = page();
  expect(css()).toMatch(/var\(\s*--ink\s*\)/);
  expect(styleOf(doc.body, 'color')).toBe(INK);
  for (const title of doc.querySelectorAll('h1, .title')) expect(styleOf(title, 'color')).toBe(INK);
  // shop.css still colors every paragraph, and an element's own rule beats what it inherits.
  for (const blurb of doc.querySelectorAll('.blurb')) expect(styleOf(blurb, 'color')).toBe(GREY);
});

test('a tag is 200px wide with its padding and border inside that width', () => {
  for (const tag of page().querySelectorAll('.tag')) {
    expect(styleOf(tag, 'box-sizing')).toBe('border-box');
    expect(styleOf(tag, 'width')).toBe('200px');
    for (const side of ['top', 'right', 'bottom', 'left']) {
      expect(styleOf(tag, `padding-${side}`)).toBe('12px');
      expect(styleOf(tag, `border-${side}-width`)).toBe('2px');
      expect(styleOf(tag, `border-${side}-style`)).toBe('solid');
      expect(styleOf(tag, `border-${side}-color`)).toBe(CRIMSON);
    }
    expect(styleOf(tag, 'margin-bottom')).toBe('16px');
    expect(styleOf(tag, 'margin-top')).toBe('0px');
  }
});

test('every sale price is in the accent, the featured one included, and only sale prices', () => {
  const doc = page();
  const text = css();
  expect(text, 'win on specificity, not with !important').not.toMatch(/!important/);
  expect(text).toMatch(/var\(\s*--accent\s*\)/);
  expect([...doc.querySelectorAll('.sale')].map(p => styleOf(p, 'color'))).toEqual([CRIMSON, CRIMSON]);
  expect(styleOf(doc.querySelector('#featured .price:not(.sale)'), 'color')).toBe(NAVY);
  expect(styleOf(doc.querySelectorAll('.tag')[1].querySelector('.price'), 'color')).toBe(GREY);
  for (const el of doc.querySelectorAll('[style]')) expect(el.getAttribute('style')).toBe('');
});
