/**
 * Wishlist: a small React app of books a reader wants, built from the section's
 * pieces. A reducer holds every change, a form hands new titles up through a
 * callback, what is shown is worked out from the list, and an effect saves it.
 * An item is { id, title, bought }.
 *
 * Fill in each part so the tests in Wishlist.test.jsx pass, then add a test of
 * your own. Run them from this folder with: npm test
 */
import { useEffect, useReducer, useState } from 'react';

/** The key the list is saved under in storage. */
export const STORAGE_KEY = 'wishlist';

/**
 * The next list after an action, as a new array; the list is never changed in place.
 * - { type: "added", title }: the trimmed title at the end as { id, title, bought: false },
 *   its id one more than the highest in the list (1 for an empty list);
 *   a blank title gives back the same list.
 * - { type: "toggled", id }: that item with `bought` flipped, as a new object.
 * - { type: "removed", id }: the list without that item.
 * - any other action: the same list.
 */
export function wishlistReducer(items, action) {
  // TODO
  throw new Error('TODO: wishlistReducer');
}

/**
 * The list saved under STORAGE_KEY in `storage` (shaped like localStorage), or an
 * empty list when nothing is saved or what is saved is not a JSON array.
 */
export function loadWishlist(storage) {
  // TODO
  throw new Error('TODO: loadWishlist');
}

/**
 * A <form> with an <input> labelled "Title" (controlled) and a <button>Add</button>.
 * Submitting it, without reloading the page, calls onAdd with the text and empties
 * the box; a blank title is not handed up.
 */
export function AddForm({ onAdd }) {
  // TODO
  return null;
}

/**
 * The app. Its list starts as loadWishlist(storage), changes only through
 * wishlistReducer, and is saved to `storage` as JSON under STORAGE_KEY each time it changes.
 *
 * It shows, in order:
 * - an AddForm that adds the title it hands up;
 * - two buttons, "All" and "Still wanted", that choose what the list shows, with
 *   aria-pressed="true" on the chosen one; "All" is chosen at the start;
 * - a <ul> with an <li> per item shown, holding its title, a checkbox labelled
 *   "Bought Emma" that toggles it, and a <button>Remove Emma</button>;
 *   under "Still wanted" the bought items are left out;
 * - a <p> such as "2 wanted, 1 bought", counted over the whole list.
 */
export function Wishlist({ storage }) {
  // TODO
  return null;
}
