import { describe, expect, test } from 'vitest';
import { loadPage } from '../page.js';

const file = new URL('./signup.html', import.meta.url);
const setup = () => {
  const { window, document } = loadPage(file);
  const form = document.querySelector('form');
  const field = name => form.elements.namedItem(name);
  return { window, document, form, field };
};
/** The text of the labels pointing at a field, joined. */
const labelOf = el => [...(el?.labels ?? [])].map(l => l.textContent.trim()).join(' ');

/** Fill every field with a valid answer, for the tests that change one of them. */
function fillValid({ field }) {
  field('email').value = 'ann@example.com';
  field('first_name').value = 'Ann';
  field('age').value = '34';
  field('genre').value = 'history';
}

test('the form posts to /subscribe', () => {
  const { form } = setup();
  expect(form.getAttribute('action')).toBe('/subscribe');
  expect(form.method).toBe('post');
});

test('every field has a name to send and a label that points at its id', () => {
  const { form } = setup();
  const fields = [...form.querySelectorAll('input, select, textarea')];
  expect(fields.map(f => f.name).filter((n, i, all) => all.indexOf(n) === i))
    .toEqual(['email', 'first_name', 'age', 'format', 'genre', 'events']);
  for (const f of fields) {
    expect(f.id, `the ${f.name} field needs an id`).not.toBe('');
    expect(labelOf(f), `no label points at #${f.id}`).not.toBe('');
  }
});

describe('validation', () => {
  test('the email is required and must look like an email', () => {
    const ctx = setup();
    const email = ctx.field('email');
    expect(email.type).toBe('email');
    expect(labelOf(email)).toBe('Email');
    fillValid(ctx);
    email.value = '';
    expect(email.validity.valueMissing).toBe(true);
    email.value = 'ann.example.com';
    expect(email.validity.typeMismatch).toBe(true);
    email.value = 'ann@example.com';
    expect(ctx.form.checkValidity()).toBe(true);
  });

  test('the first name is required, two letters at least', () => {
    const ctx = setup();
    const first = ctx.field('first_name');
    expect(first.type).toBe('text');
    expect(labelOf(first)).toBe('First name');
    expect(first.minLength).toBe(2);
    fillValid(ctx);
    first.value = '';
    expect(first.validity.valueMissing).toBe(true);
  });

  test('the age is an optional number from 13 to 120', () => {
    const ctx = setup();
    const age = ctx.field('age');
    expect(age.type).toBe('number');
    expect(labelOf(age)).toBe('Age');
    fillValid(ctx);
    age.value = '12';
    expect(age.validity.rangeUnderflow).toBe(true);
    age.value = '121';
    expect(age.validity.rangeOverflow).toBe(true);
    age.value = '';
    expect(ctx.form.checkValidity()).toBe(true);
  });
});

test('the format is one choice of three, in a named group, paperback to start with', () => {
  const { form, document } = setup();
  const radios = [...form.querySelectorAll('input[type="radio"]')];
  expect(radios.map(r => r.value)).toEqual(['paperback', 'ebook', 'audiobook']);
  expect(radios.map(labelOf)).toEqual(['Paperback', 'Ebook', 'Audiobook']);
  expect(radios.every(r => r.name === 'format')).toBe(true);
  const fieldset = radios[0].closest('fieldset');
  expect(fieldset?.querySelector('legend')?.textContent.trim()).toBe('Format');
  expect(radios.every(r => r.closest('fieldset') === fieldset)).toBe(true);
  expect(radios.filter(r => r.checked).map(r => r.value)).toEqual(['paperback']);
  radios[1].checked = true;
  expect(radios.filter(r => r.checked).map(r => r.value)).toEqual(['ebook']);
  expect(document.querySelectorAll('input[name="format"]:checked')).toHaveLength(1);
});

test('the genre is a dropdown of fiction, history and science', () => {
  const { field } = setup();
  const genre = field('genre');
  expect(genre?.tagName).toBe('SELECT');
  expect(labelOf(genre)).toBe('Favourite genre');
  expect([...genre.options].map(o => [o.value, o.textContent.trim()]))
    .toEqual([['fiction', 'Fiction'], ['history', 'History'], ['science', 'Science']]);
});

test('submitting sends each field as name=value, the events box only when ticked', () => {
  const ctx = setup();
  const { window, form, field } = ctx;
  expect(form.querySelector('button')?.type).toBe('submit');
  expect(form.querySelector('button').textContent.trim()).toBe('Sign up');
  fillValid(ctx);
  form.querySelector('input[value="ebook"]').checked = true;
  expect(labelOf(field('events'))).toBe('Tell me about events');
  expect([...new window.FormData(form)]).toEqual([
    ['email', 'ann@example.com'], ['first_name', 'Ann'], ['age', '34'], ['format', 'ebook'], ['genre', 'history'],
  ]);
  field('events').checked = true;
  expect(new window.FormData(form).get('events')).toBe('yes');
});
