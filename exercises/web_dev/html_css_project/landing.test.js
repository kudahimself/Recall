import { describe, expect, test } from 'vitest';
import { loadPage } from '../page.js';

const page = () => loadPage(new URL('./landing.html', import.meta.url)).document;
const shown = text => text.replace(/\s+/g, ' ').trim();
const classesOf = el => [...(el?.classList ?? [])];
const expectClasses = (el, wanted) => expect(classesOf(el)).toEqual(expect.arrayContaining(wanted.split(' ')));
const only = (doc, selector) => {
  const found = doc.querySelectorAll(selector);
  expect(found, `expected exactly one ${selector}`).toHaveLength(1);
  return found[0];
};
/** The picks: the articles of the section headed "This week's picks". */
const picks = doc => [...doc.querySelectorAll('section')].find(s => shown(s.querySelector('h2')?.textContent ?? '') === "This week's picks");

describe('the markup', () => {
  test('has a header with the nav, one main and a footer, in that order', () => {
    const doc = page();
    const header = only(doc, 'body > header');
    const main = only(doc, 'body > main');
    const footer = only(doc, 'body > footer');
    expect(header.querySelector('nav')).not.toBeNull();
    const order = [...doc.body.children].filter(el => [header, main, footer].includes(el));
    expect(order).toEqual([header, main, footer]);
    expect(shown(footer.textContent)).toBe('Corner Books, 12 Mill Street. Open every day, 9 to 5.');
  });

  test('opens the main with the hero section, its h1 and the call to action as a real link', () => {
    const doc = page();
    const hero = doc.querySelector('main > section');
    expect(shown(hero?.querySelector('h1')?.textContent ?? '')).toBe('Books for every corner of your life');
    expect(only(doc, 'h1')).toBe(hero.querySelector('h1'));
    const cta = [...hero.querySelectorAll('a')].find(a => shown(a.textContent) === 'Browse the shelves');
    expect(cta?.getAttribute('href')).toBe('/books');
  });

  test('gives each pick an article with its h3 and a Read more link, under the section\'s h2', () => {
    const section = picks(page());
    const articles = [...(section?.querySelectorAll('article') ?? [])];
    expect(articles.map(a => shown(a.querySelector('h3')?.textContent ?? ''))).toEqual(['The Night Circus', 'Piranesi', 'Emma']);
    for (const article of articles) {
      const link = article.querySelector('a[href]');
      expect(shown(link?.textContent ?? '')).toBe('Read more');
    }
  });

  test('keeps the headings in order and uses real buttons and links, no clickable divs', () => {
    const doc = page();
    const levels = [...doc.querySelectorAll('h1, h2, h3, h4, h5, h6')].map(h => Number(h.tagName[1]));
    expect(levels).toEqual([1, 2, 3, 3, 3]);
    expect(doc.querySelector('[onclick], div[role="button"]')).toBeNull();
    expect(doc.querySelector('header nav button')?.type).toBe('button');
  });
});

describe('the Tailwind classes', () => {
  test('lay the picks out one per row on a phone and three across from md', () => {
    const grid = picks(page())?.querySelector('article')?.parentElement;
    expectClasses(grid, 'grid grid-cols-1 md:grid-cols-3 gap-6');
    expect(classesOf(grid), 'three columns must only start at md').not.toContain('grid-cols-3');
    expect(classesOf(grid)).not.toContain('md:grid-cols-1');
  });

  test('show the menu button on a phone and the nav links from md', () => {
    const nav = page().querySelector('header nav');
    const links = [...nav.querySelectorAll('a')].filter(a => ['Books', 'Events', 'Contact'].includes(shown(a.textContent)));
    expect(links).toHaveLength(3);
    const box = links[0].parentElement;
    expect(links.every(a => a.parentElement === box)).toBe(true);
    expectClasses(box, 'hidden md:flex');
    expectClasses(nav.querySelector('button'), 'md:hidden');
    expect(shown(nav.querySelector('button').textContent)).toBe('Menu');
  });

  test('cap the content width and centre it', () => {
    const main = page().querySelector('main');
    expect(classesOf(main)).toContain('mx-auto');
    expect(classesOf(main).some(c => /^max-w-/.test(c))).toBe(true);
  });

  test('give every link in the main a hover and a keyboard-focus style that change smoothly', () => {
    const links = [...page().querySelectorAll('main a')];
    expect(links).toHaveLength(4);
    for (const link of links) {
      const classes = classesOf(link);
      expect(classes.some(c => c.startsWith('hover:')), `${shown(link.textContent)} needs a hover: style`).toBe(true);
      expect(classes.some(c => c.startsWith('focus-visible:')), `${shown(link.textContent)} needs a focus-visible: style`).toBe(true);
      expect(classes.some(c => /^transition(-|$)/.test(c)), `${shown(link.textContent)} needs a transition`).toBe(true);
    }
  });
});
