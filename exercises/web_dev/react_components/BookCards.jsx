/**
 * Book cards: the bookshop's shelf as React components, props in and JSX out.
 * Each book is { id, title, author, stock, isNew }.
 *
 * Fill in each component so the tests in BookCards.test.jsx pass.
 * Run them from this folder with: npm test
 * The components only read their props; none keeps state.
 */

/**
 * "<b>2 left</b>" while there is stock, "<i>sold out</i>" when stock is 0.
 *
 * <StockNote stock={2} />  ->  <b>2 left</b>
 */
export function StockNote({ stock }) {
  // TODO
  return null;
}

/**
 * One book as an <li> with the class "book", plus "sold-out" when its stock is 0.
 * Inside, in order: the title in a <span class="title">, " by " and the author
 * only when the book has one, a space, its StockNote, and a <button>
 * reading "Buy", or "Sold out" and disabled when its stock is 0.
 *
 * <BookCard title="Emma" author="Austen" stock={2} />
 *   ->  <li class="book"><span class="title">Emma</span> by Austen <b>2 left</b><button>Buy</button></li>
 */
export function BookCard({ title, author, stock }) {
  // TODO
  return null;
}

/**
 * The shelf, with no wrapping element: whatever the parent nests inside <Shelf>
 * first, then a <span class="badge"> reading "2 new" when some books are new
 * (nothing at all when none is), then a <ul> with a BookCard for each book,
 * keyed by its id. With no books, a <p> reading "Nothing on this shelf"
 * takes the <ul>'s place.
 *
 * <Shelf books={books}><h2>Fiction</h2></Shelf>
 */
export function Shelf({ books, children }) {
  // TODO
  return null;
}
