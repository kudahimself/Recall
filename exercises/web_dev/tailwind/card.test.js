import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { loadPage } from '../page.js';

const page = () => loadPage(new URL('./card.html', import.meta.url)).document;
const cards = () => [...page().querySelectorAll('article')];
const classesOf = el => [...(el?.classList ?? [])];
/** Expect `el` to carry every class in `wanted` (a space-separated list). */
const expectClasses = (el, wanted) => expect(classesOf(el)).toEqual(expect.arrayContaining(wanted.split(' ')));

describe('each card', () => {
  test('is a white box with 1rem of padding, large rounded corners and a medium shadow', () => {
    for (const card of cards()) expectClasses(card, 'bg-white p-4 rounded-lg shadow-md');
    expect(cards()).toHaveLength(2);
  });

  test('takes a large shadow while the pointer is over it', () => {
    for (const card of cards()) {
      expectClasses(card, 'hover:shadow-lg');
      expect(classesOf(card)).not.toContain('shadow-lg');
    }
    expect(cards()).toHaveLength(2);
  });

  test('stacks the cover over the text on a phone and puts them side by side from 640px, 1rem apart', () => {
    for (const card of cards()) {
      expectClasses(card, 'flex flex-col sm:flex-row gap-4');
      expect(classesOf(card), 'an unprefixed flex-row would apply on phones too').not.toContain('flex-row');
    }
    expect(cards()).toHaveLength(2);
  });

  test('shows the cover full width on a phone and 8rem wide from 640px, with rounded corners', () => {
    for (const img of page().querySelectorAll('article img')) expectClasses(img, 'w-full sm:w-32 rounded');
    expect(page().querySelectorAll('article img')).toHaveLength(2);
  });

  test('turns its title the brand color while the pointer is anywhere over the card', () => {
    for (const card of cards()) {
      expectClasses(card, 'group');
      expectClasses(card.querySelector('h2'), 'group-hover:text-brand-500 text-lg font-semibold');
    }
    expect(cards()).toHaveLength(2);
  });

  test('sets the author small and grey, and the price bold at exactly 15px, a little below it', () => {
    for (const card of cards()) {
      expectClasses(card.querySelector('.author'), 'text-sm text-gray-600');
      expectClasses(card.querySelector('.price'), 'mt-2 font-bold text-[15px]');
    }
    expect(cards()).toHaveLength(2);
  });
});

test('the buttons are brand-colored, darker on hover, outlined on keyboard focus and faded when disabled', () => {
  const buttons = [...page().querySelectorAll('article button')];
  expect(buttons).toHaveLength(2);
  for (const button of buttons) {
    expectClasses(button, 'bg-brand-500 text-white px-4 py-2 rounded mt-4');
    expectClasses(button, 'hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50');
    expect(classesOf(button), 'fade only the disabled button, with the disabled: variant').not.toContain('opacity-50');
  }
  expect(buttons.map(b => b.disabled)).toEqual([false, true]);
});

test('theme.css brings in Tailwind and adds the two brand colors as theme tokens', () => {
  const css = readFileSync(new URL('./theme.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  expect(css).toMatch(/@import\s+["']tailwindcss["']\s*;/);
  const theme = css.match(/@theme\s*\{([^}]*)\}/)?.[1] ?? '';
  expect(theme).toMatch(/--color-brand-500\s*:\s*#7c3aed\s*;/i);
  expect(theme).toMatch(/--color-brand-600\s*:\s*#6d28d9\s*;?/i);
});
