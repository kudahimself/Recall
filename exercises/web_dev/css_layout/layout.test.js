import { describe, expect, test } from 'vitest';
import { loadPage, styleOf } from '../page.js';

const page = () => loadPage(new URL('./layout.html', import.meta.url)).document;
/** grid-template-columns without spaces, `repeat(3, 1fr)` written out as `1fr 1fr 1fr`. */
const columns = el => styleOf(el, 'grid-template-columns')
  .replace(/repeat\(\s*(\d+)\s*,\s*([^)]+?)\s*\)/g, (_, n, track) => Array(Number(n)).fill(track).join(' '))
  .replace(/\s+/g, ' ').trim();
/** The flex shorthand's grow, shrink and basis as the browser reads them. */
function flexOf(el) {
  const [grow = '0', shrink = '1', basis = 'auto'] = styleOf(el, 'flex').split(/\s+/);
  return { grow: Number(styleOf(el, 'flex-grow') || grow), shrink: Number(styleOf(el, 'flex-shrink') || shrink), basis: styleOf(el, 'flex-basis') || basis };
}

describe('the header', () => {
  test('lays the logo and the menu out in one row, at the two ends, centred across it', () => {
    const header = page().querySelector('.site-header');
    expect(styleOf(header, 'display')).toBe('flex');
    expect(['', 'row']).toContain(styleOf(header, 'flex-direction'));
    expect(styleOf(header, 'justify-content')).toBe('space-between');
    expect(styleOf(header, 'align-items')).toBe('center');
  });

  test('sticks to the top of the viewport, in front of the cards', () => {
    const header = page().querySelector('.site-header');
    expect(styleOf(header, 'position')).toBe('sticky');
    expect(styleOf(header, 'top')).toMatch(/^0(px)?$/);
    expect(Number(styleOf(header, 'z-index'))).toBeGreaterThan(0);
  });

  test('spaces the menu links 16px apart in a row', () => {
    const menu = page().querySelector('.menu');
    expect(styleOf(menu, 'display')).toBe('flex');
    expect(styleOf(menu, 'gap').split(/\s+/)[0]).toBe('16px');
  });
});

test('the filters keep 240px and the results take the rest of the row', () => {
  const doc = page();
  expect(styleOf(doc.querySelector('.page'), 'display')).toBe('flex');
  const filters = flexOf(doc.querySelector('.filters'));
  expect(filters.grow).toBe(0);
  expect(filters.shrink).toBe(0);
  expect([filters.basis, styleOf(doc.querySelector('.filters'), 'width')]).toContain('240px');
  const results = flexOf(doc.querySelector('.results'));
  expect(results.grow).toBe(1);
});

test('the cards fill a grid of three equal columns, 24px apart', () => {
  const grid = page().querySelector('.grid');
  expect(styleOf(grid, 'display')).toBe('grid');
  expect(columns(grid)).toBe('1fr 1fr 1fr');
  expect(styleOf(grid, 'gap').split(/\s+/)[0]).toBe('24px');
});

test('each badge sits 8px from the top right corner of its own card', () => {
  const doc = page();
  for (const card of doc.querySelectorAll('.card')) expect(styleOf(card, 'position')).toBe('relative');
  for (const badge of doc.querySelectorAll('.badge')) {
    expect(styleOf(badge, 'position')).toBe('absolute');
    expect(styleOf(badge, 'top')).toBe('8px');
    expect(styleOf(badge, 'right')).toBe('8px');
  }
});
