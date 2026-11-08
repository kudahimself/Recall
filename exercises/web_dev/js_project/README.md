# Reading list

Topic: JS Project (Web Dev, JavaScript Fundamentals).
Time: about 30 minutes.

## Task

Write the logic of a small reading-list app in `readingList.js`.
The list is an array of `{ id, title, read }` objects and it is the truth: the functions that change it return a new array, `renderList` rebuilds the page from it, and `saveList` and `loadList` keep it across reloads.

- `addBook(list, title)` adds the trimmed title at the end as `{ id, title, read: false }`, its id one more than the highest in the list (1 for an empty list); a blank title gives back the same list.
- `toggleRead(list, id)` flips `read` on that book, as a new object, keeping the other book objects as they are.
- `removeBook(list, id)` leaves that book out.
- `unreadCount(list)` counts the books not read yet.
- `saveList(list, storage)` saves the list as JSON under `STORAGE_KEY` in `storage`, which is shaped like `localStorage` (`getItem` and `setItem`).
- `loadList(storage)` gives back the saved list, or an empty one when nothing is saved, the text is not valid JSON, or it is not an array.
- `renderList(list, ul)` replaces the contents of a `<ul>` with one `<li>` per book: the title as text, `data-id` set to the id, and the class `read` when it is read.

None of the functions may change the list or the books they are given.

## Examples

```js
let books = addBook([], "Emma");        // [{ id: 1, title: "Emma", read: false }]
books = addBook(books, " Dune ");       // ... { id: 2, title: "Dune", read: false }
books = toggleRead(books, 1);           // Emma is read
unreadCount(books);                     // 1
saveList(books, localStorage);
loadList(localStorage);                 // the same two books, after a reload too
renderList(books, document.querySelector("ul"));  // <li data-id="1" class="read">Emma</li><li data-id="2">Dune</li>
```

`readingList.test.js` is written with `describe`, `test` and `expect`, as in the lesson: read it, and see where it uses `toBe` (the same object) and where `toEqual` (the same contents).
Then add a test of your own, for example that removing a book and adding another never reuses an id that is still in the list.

## Run the tests

Install the packages once, from the repository root: `cd exercises/web_dev && npm ci`.
Then:

```bash
cd exercises/web_dev/js_project
npm test
```

Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
