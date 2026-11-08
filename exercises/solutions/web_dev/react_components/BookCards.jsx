/**
 * Book cards: the bookshop's shelf as React components, props in and JSX out.
 * Each book is { id, title, author, stock, isNew }.
 *
 * Reference solution.
 */

/** "<b>2 left</b>" while there is stock, "<i>sold out</i>" when stock is 0. */
export function StockNote({ stock }) {
  return stock > 0 ? <b>{stock} left</b> : <i>sold out</i>;
}

/** One book as an <li class="book">, also "sold-out" when its stock is 0. */
export function BookCard({ title, author, stock }) {
  const soldOut = stock === 0;
  return (
    <li className={soldOut ? 'book sold-out' : 'book'}>
      <span className="title">{title}</span>
      {author && ` by ${author}`} <StockNote stock={stock} />
      <button disabled={soldOut}>{soldOut ? 'Sold out' : 'Buy'}</button>
    </li>
  );
}

/** The parent's children, a "2 new" badge when some books are new, then the cards. */
export function Shelf({ books, children }) {
  const newCount = books.filter(b => b.isNew).length;
  return (
    <>
      {children}
      {newCount > 0 && <span className="badge">{newCount} new</span>}
      {books.length > 0 ? (
        <ul>
          {books.map(b => (
            <BookCard key={b.id} title={b.title} author={b.author} stock={b.stock} />
          ))}
        </ul>
      ) : (
        <p>Nothing on this shelf</p>
      )}
    </>
  );
}
