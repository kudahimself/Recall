/**
 * Reading list: a small app's logic, kept apart from the page so it can be tested.
 * The list, an array of { id, title, read } objects, is the truth: the functions
 * that change it return a new array, render rebuilds the page from it, and
 * save and load keep it in storage (localStorage on a real page).
 *
 * Fill in each function so the tests in readingList.test.js pass.
 * Run them from this folder with: npm test
 * None of the functions may change the list or the books they are given.
 */

/** The key the list is saved under. */
export const STORAGE_KEY = 'reading-list';

/**
 * A new list with the trimmed title added at the end as { id, title, read: false },
 * its id one more than the highest id in the list (1 for an empty list).
 * A blank title gives back the same list, unchanged.
 *
 * addBook([], "Emma") -> [{ id: 1, title: "Emma", read: false }]
 */
export function addBook(list, title) {
  // TODO
  throw new Error('TODO: addBook');
}

/**
 * A new list where the book with this id has `read` flipped, as a new object;
 * the other books are the same objects as before.
 */
export function toggleRead(list, id) {
  // TODO
  throw new Error('TODO: toggleRead');
}

/**
 * A new list without the book with this id.
 */
export function removeBook(list, id) {
  // TODO
  throw new Error('TODO: removeBook');
}

/**
 * How many books are not read yet.
 */
export function unreadCount(list) {
  // TODO
  throw new Error('TODO: unreadCount');
}

/**
 * Save the list in `storage` (shaped like localStorage) under STORAGE_KEY, as JSON.
 */
export function saveList(list, storage) {
  // TODO
  throw new Error('TODO: saveList');
}

/**
 * The list saved in `storage`, or an empty list when nothing is saved,
 * or what is saved is not valid JSON or not an array.
 */
export function loadList(storage) {
  // TODO
  throw new Error('TODO: loadList');
}

/**
 * Rebuild the <ul> element `ul` from the list: one <li> per book, in order, holding
 * its title as text, with data-id set to its id and the class "read" when it is read.
 * Whatever the <ul> held before is replaced.
 */
export function renderList(list, ul) {
  // TODO
  throw new Error('TODO: renderList');
}
