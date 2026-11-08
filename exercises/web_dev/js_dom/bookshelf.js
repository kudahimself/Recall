/**
 * My shelf: practise selecting elements, changing them, building new ones,
 * and handling events with one listener on the list.
 *
 * Fill in setupShelf so the tests in bookshelf.test.js pass.
 * Run them from this folder with: npm test
 *
 * The page (bookshelf.html) calls setupShelf(document) once, after its elements exist.
 * The tests call it on a fresh copy of the page.
 */

/**
 * Wire up the shelf page in `doc`:
 *
 * - Show the number of books on the shelf in #count: "1 book", "2 books", "0 books".
 * - Submitting #add-form adds the trimmed title from #title as a new <li> at the end of #shelf,
 *   shaped like the one in the page, then empties the box and updates the count.
 *   An empty or blank title adds nothing. The page never reloads.
 * - Clicking a book's title toggles the class "read" on its <li>.
 * - Clicking a book's Remove button removes its <li> and updates the count.
 *
 * Both clicks are handled by one listener on #shelf, so they work for every book,
 * those added later included.
 */
export function setupShelf(doc) {
  // TODO
  throw new Error('TODO: setupShelf');
}
