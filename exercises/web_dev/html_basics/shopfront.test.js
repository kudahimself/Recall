import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { loadPage } from '../page.js';

const file = new URL('./shopfront.html', import.meta.url);
const source = () => readFileSync(file, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
const page = () => loadPage(file).document;
/** Text with every run of whitespace collapsed to one space, as the browser shows it. */
const shown = text => text.replace(/\s+/g, ' ').trim();

describe('the document', () => {
  test('starts with the doctype and is an English page', () => {
    const doc = page();
    expect(doc.doctype?.name).toBe('html');
    expect(doc.documentElement.getAttribute('lang')).toBe('en');
  });

  test('has a head with the UTF-8 charset and the title "Corner Books"', () => {
    const doc = page();
    expect(source(), 'the exercise asks you to write the <head> element yourself').toMatch(/<head[\s>]/i);
    expect(doc.head.querySelector('meta[charset]')?.getAttribute('charset')).toMatch(/^utf-8$/i);
    expect(doc.title).toBe('Corner Books');
  });
});

describe('the body', () => {
  test('has one main heading, "Corner Books"', () => {
    const headings = page().querySelectorAll('h1');
    expect(headings).toHaveLength(1);
    expect(shown(headings[0].textContent)).toBe('Corner Books');
  });

  test('shows the shop photo with text for when it cannot be seen', () => {
    const img = page().querySelector('img');
    expect(img?.getAttribute('src')).toBe('shop.jpg');
    expect(img.getAttribute('alt')?.trim().length).toBeGreaterThan(10);
  });

  test('gives the opening hours in one paragraph, with a line break before the closing day', () => {
    const strong = page().querySelector('p strong');
    expect(shown(strong?.textContent ?? '')).toBe('every day');
    const p = strong.closest('p');
    expect(p.querySelectorAll('br')).toHaveLength(1);
    const [before, after] = p.innerHTML.split(/<br\s*\/?>/i).map(html => shown(html.replace(/<[^>]+>/g, '')));
    expect(before).toBe('Open every day, 9 to 5.');
    expect(after).toBe('Closed on 25 December.');
  });

  test('lists what the shop sells, one item each', () => {
    const items = [...page().querySelectorAll('ul > li')].map(li => shown(li.textContent));
    expect(items).toEqual(['Paperbacks & comics', 'Maps & guides', 'Second-hand classics']);
  });

  test('shows & and < in the text, written as entities', () => {
    const doc = page();
    const kids = [...doc.querySelectorAll('p')].find(p => shown(p.textContent).startsWith("Kids' corner"));
    expect(shown(kids?.textContent ?? '')).toBe("Kids' corner: every book < £5.");
  });

  test('links to the events page and opens the map in a new tab safely', () => {
    const links = [...page().querySelectorAll('a')];
    const events = links.find(a => shown(a.textContent) === 'our events');
    expect(events?.getAttribute('href')).toBe('events.html');
    expect(events.hasAttribute('target')).toBe(false);
    const map = links.find(a => shown(a.textContent) === 'find us on the map');
    expect(map?.getAttribute('href')).toMatch(/^https:\/\//);
    expect(map.getAttribute('target')).toBe('_blank');
    expect(map.getAttribute('rel')?.split(/\s+/)).toEqual(expect.arrayContaining(['noopener', 'noreferrer']));
  });
});
