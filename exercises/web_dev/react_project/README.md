# Wishlist

Topic: React Project (Web Dev, React).
Time: about 30 minutes.

## Task

Build a small React app in `Wishlist.jsx`: the books a reader wants, which they add, tick off as bought, remove and filter.
It puts the section's pieces together: a reducer holds every change, a form hands new titles up through a callback, what is shown is worked out from the list on every render, and an effect saves the list.
An item is `{ id, title, bought }`.

- `wishlistReducer(items, action)` returns the next list as a new array, never changing the one it is given:
  - `{ type: "added", title }` adds the trimmed title at the end as `{ id, title, bought: false }`, its id one more than the highest in the list (1 for an empty list), and a blank title gives back the same list;
  - `{ type: "toggled", id }` flips `bought` on that item, as a new object;
  - `{ type: "removed", id }` leaves that item out;
  - any other action gives back the same list.
- `loadWishlist(storage)` gives back the list saved under `STORAGE_KEY` in `storage`, which is shaped like `localStorage`, or an empty list when nothing is saved or what is saved is not a JSON array.
- `AddForm({ onAdd })` is a `<form>` with a controlled `<input>` labelled `Title` and a `<button>Add</button>`.
  Submitting it, without reloading the page, calls `onAdd` with the text and empties the box; a blank title is not handed up.
- `Wishlist({ storage })` is the app.
  Its list starts as `loadWishlist(storage)`, changes only through `wishlistReducer`, and is saved to `storage` as JSON under `STORAGE_KEY` each time it changes.
  It shows, in order: an `AddForm`; two buttons, `All` and `Still wanted`, choosing what the list shows, with `aria-pressed="true"` on the chosen one (`All` at the start); a `<ul>` with an `<li>` per item shown, starting with its title, then a checkbox labelled `Bought Emma` that toggles it and a `<button>Remove Emma</button>`, leaving out the bought items under `Still wanted`; and a `<p>` such as `2 wanted, 1 bought`, counted over the whole list.

Keep one list in state and work the rest out from it during render: the shown items and the counts are not state of their own.
`useReducer(wishlistReducer, storage, loadWishlist)` reads the storage once, on the first render.

## Examples

```text
Add "Emma", Add "Dune"           Emma, Dune          2 wanted, 0 bought
tick Bought Dune                 Emma, Dune          1 wanted, 1 bought
Still wanted                     Emma                1 wanted, 1 bought
reload the page                  the same list, read back from storage
```

`Wishlist.test.jsx` tests the reducer as a plain function and the app the way a reader uses it, with React Testing Library: `render` it, find what is on the page with `getByRole`, act with `fireEvent`, and check what is shown, not the state inside.
Its storage is a fake one the tests can read back.
When everything passes, add a test of your own where the file says, for example that a book ticked as bought while `Still wanted` is chosen leaves the list at once.

## Run the tests

Install the packages once, from the repository root: `cd exercises/web_dev && npm ci`.
Then:

```bash
cd exercises/web_dev/react_project
npm test
```

Every test fails until you fill in the file.
When they all pass, tick the exercise done in Recall under Progress, Topics.
