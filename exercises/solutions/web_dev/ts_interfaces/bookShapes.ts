/**
 * Book shapes: the catalogue's objects named with interfaces and type aliases.
 * Reference solution.
 */

export type Isbn = string;

export interface Book {
  readonly isbn: Isbn;
  title: string;
  pages?: number;
}

export interface Ebook extends Book {
  sizeMb: number;
}

export interface Stock {
  [isbn: string]: number;
}

export interface Shelf {
  name: string;
  books: Book[];
  count(): number;
}

export function card(book: Book, stock: Stock): string {
  const left = stock[book.isbn] ?? 0;
  return `${book.title}: ${book.pages ?? '?'} pages, ${left} left`;
}

export function restock(stock: Stock, isbn: Isbn, copies: number): Stock {
  return { ...stock, [isbn]: (stock[isbn] ?? 0) + copies };
}

export function bookOnly(book: Book): Book {
  // The parameter's type does not strip extra properties: pick the fields to keep.
  const copy: Book = { isbn: book.isbn, title: book.title };
  if (book.pages !== undefined) copy.pages = book.pages;
  return copy;
}

export function makeShelf(name: string, books: Book[]): Shelf {
  return { name, books, count: () => books.length };
}
