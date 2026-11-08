import { describe, expect, test } from 'vitest';
import { loadPage } from '../page.js';

const page = () => loadPage(new URL('./review.html', import.meta.url)).document;
const shown = text => text.replace(/\s+/g, ' ').trim();
const only = (doc, selector) => {
  const found = doc.querySelectorAll(selector);
  expect(found, `expected exactly one ${selector}`).toHaveLength(1);
  return found[0];
};

describe('the page landmarks', () => {
  test('a header holds the site name and the nav of the three site links', () => {
    const doc = page();
    const header = only(doc, 'body > header');
    expect(shown(header.textContent)).toMatch(/^Corner Books/);
    const nav = only(doc, 'nav');
    expect(header.contains(nav)).toBe(true);
    expect([...nav.querySelectorAll('a')].map(a => a.getAttribute('href'))).toEqual(['/', '/books', '/events']);
  });

  test('one main holds the primary content, with the header and footer outside it', () => {
    const doc = page();
    const main = only(doc, 'main');
    expect(main.parentElement).toBe(doc.body);
    expect(main.querySelector('header, footer')).toBeNull();
    expect(main.textContent).toContain('The Night Circus, reviewed');
    expect(main.textContent).toContain('More staff picks');
  });

  test('a footer holds the address', () => {
    const footer = only(page(), 'body > footer');
    expect(shown(footer.textContent)).toBe('Corner Books, 12 Mill Street. Open every day, 9 to 5.');
  });
});

describe('the review', () => {
  test('is an article in the main, under the page\'s one h1', () => {
    const doc = page();
    const article = only(doc, 'main article');
    const h1 = only(doc, 'h1');
    expect(article.contains(h1)).toBe(true);
    expect(shown(h1.textContent)).toBe('The Night Circus, reviewed');
  });

  test('has its two parts as sections, each under an h2', () => {
    const sections = [...page().querySelectorAll('article section')];
    expect(sections.map(s => shown(s.querySelector('h2')?.textContent ?? ''))).toEqual(['The story', 'Our verdict']);
    expect(sections[0].querySelector('p')?.textContent).toContain('A circus that opens only at night');
    expect(sections[1].querySelector('p')?.textContent).toContain('five stars from the shop');
  });

  test('ties the cover to its caption in a figure', () => {
    const figure = only(page(), 'article figure');
    expect(figure.querySelector('img')?.getAttribute('src')).toBe('night-circus.jpg');
    expect(shown(figure.querySelector('figcaption')?.textContent ?? '')).toBe('The first edition cover, 2011.');
  });

  test('hides the spoilers in a disclosure that starts closed', () => {
    const details = only(page(), 'article details');
    expect(details.open).toBe(false);
    expect(shown(details.querySelector('summary')?.textContent ?? '')).toBe('Spoilers');
    expect(details.querySelector('p')?.textContent).toContain('The contest can only end');
  });
});

test('the staff picks sit beside the review in an aside with its own heading', () => {
  const doc = page();
  const aside = only(doc, 'aside');
  expect(doc.querySelector('article').contains(aside)).toBe(false);
  expect(shown(aside.querySelector('h1, h2, h3, h4, h5, h6')?.textContent ?? '')).toBe('More staff picks');
  expect([...aside.querySelectorAll('li a')].map(a => a.textContent.trim())).toEqual(['Piranesi', 'The Starless Sea']);
});

test('the headings start at one h1 and never skip a level', () => {
  const levels = [...page().querySelectorAll('h1, h2, h3, h4, h5, h6')].map(h => Number(h.tagName[1]));
  expect(levels[0]).toBe(1);
  expect(levels.filter(l => l === 1)).toHaveLength(1);
  levels.forEach((level, i) => {
    if (i > 0) expect(level, `an h${level} after an h${levels[i - 1]} skips a level`).toBeLessThanOrEqual(levels[i - 1] + 1);
  });
});

test('no div is left: each one became the element that says what it is', () => {
  expect(page().querySelectorAll('div')).toHaveLength(0);
});
