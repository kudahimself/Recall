import { describe, expect, test } from 'vitest';
import { loadPage } from '../page.js';
import { setupShelf } from './bookshelf.js';

/** A fresh copy of the page, set up, with helpers to drive it. */
function shelfPage() {
  const { window, document } = loadPage(new URL('./bookshelf.html', import.meta.url));
  setupShelf(document);
  const input = document.getElementById('title');
  const form = document.getElementById('add-form');
  const shelf = document.getElementById('shelf');
  return {
    window,
    document,
    shelf,
    count: () => document.getElementById('count').textContent.trim(),
    titles: () => [...shelf.querySelectorAll('li')].map(li => li.querySelector('.title')?.textContent),
    item: title => [...shelf.querySelectorAll('li')].find(li => li.querySelector('.title')?.textContent === title),
    /** Type a title and submit the form; returns the submit event. */
    add(title) {
      input.value = title;
      const event = new window.Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(event);
      return event;
    },
    click: el => el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true })),
  };
}

test('shows the number of books already on the shelf', () => {
  expect(shelfPage().count()).toBe('1 book');
});

describe('adding a book', () => {
  test('appends an item like the page\'s own, empties the box and stops the page reloading', () => {
    const page = shelfPage();
    const event = page.add('  The Night Circus ');
    expect(event.defaultPrevented).toBe(true);
    expect(page.titles()).toEqual(['Emma', 'The Night Circus']);
    const li = page.item('The Night Circus');
    expect(li.dataset.title).toBe('The Night Circus');
    expect(li.querySelector('button.remove')?.textContent.trim()).toBe('Remove');
    expect(li.querySelector('button.remove').type).toBe('button');
    expect(page.document.getElementById('title').value).toBe('');
    expect(page.count()).toBe('2 books');
  });

  test('ignores an empty or blank title', () => {
    const page = shelfPage();
    page.add('');
    page.add('   ');
    expect(page.titles()).toEqual(['Emma']);
    expect(page.count()).toBe('1 book');
  });

  test('shows a title as text, never as markup', () => {
    const page = shelfPage();
    page.add('<img src=x onerror=alert(1)> & <b>Bold</b>');
    const li = page.shelf.lastElementChild;
    expect(li.querySelector('.title').textContent).toBe('<img src=x onerror=alert(1)> & <b>Bold</b>');
    expect(page.shelf.querySelector('img, b')).toBeNull();
  });
});

describe('clicking on the shelf', () => {
  test('toggles a book read when its title is clicked, the page\'s own book included', () => {
    const page = shelfPage();
    page.add('Dune');
    const emma = page.item('Emma');
    page.click(emma.querySelector('.title'));
    expect(emma.classList.contains('read')).toBe(true);
    page.click(page.item('Dune').querySelector('.title'));
    expect(page.item('Dune').classList.contains('read')).toBe(true);
    page.click(emma.querySelector('.title'));
    expect(emma.classList.contains('read')).toBe(false);
  });

  test('removes a book when its Remove button is clicked, and updates the count', () => {
    const page = shelfPage();
    page.add('Dune');
    page.add('Piranesi');
    page.click(page.item('Dune').querySelector('.remove'));
    expect(page.titles()).toEqual(['Emma', 'Piranesi']);
    expect(page.count()).toBe('2 books');
    page.click(page.item('Emma').querySelector('.remove'));
    page.click(page.item('Piranesi').querySelector('.remove'));
    expect(page.titles()).toEqual([]);
    expect(page.count()).toBe('0 books');
  });

  test('handles books it never saw being added, with one listener on the list', () => {
    const page = shelfPage();
    // A book put on the shelf by other code, after setupShelf ran.
    const li = page.document.createElement('li');
    li.innerHTML = '<span class="title">Persuasion</span> <button type="button" class="remove">Remove</button>';
    page.shelf.append(li);
    page.click(li.querySelector('.title'));
    expect(li.classList.contains('read')).toBe(true);
    page.click(li.querySelector('.remove'));
    expect(page.titles()).toEqual(['Emma']);
  });
});
