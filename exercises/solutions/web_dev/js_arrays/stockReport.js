/** Stockroom report: reference solution. */

export function inStockTitles(books) {
  return books.filter((book) => book.stock > 0).map((book) => book.title);
}

export function stockValue(books) {
  return books.reduce((total, book) => total + book.pence * book.stock, 0);
}

export function findByIsbn(books, isbn) {
  return books.find((book) => book.isbn === isbn);
}

// toSorted leaves `books` alone, and the comparator compares numbers, not strings.
export function cheapestFirst(books) {
  return books.toSorted((a, b) => a.pence - b.pence);
}

export function withoutIsbn(books, isbn) {
  return books.filter((book) => book.isbn !== isbn);
}

// slice makes the copy, so reversing it leaves `books` alone.
export function latestAdded(books, count) {
  return books.slice(-count).reverse();
}

export function copiesBy(books, author) {
  return books
    .filter((book) => book.author === author)
    .map((book) => book.stock)
    .reduce((total, stock) => total + stock, 0);
}
