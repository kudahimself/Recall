/**
 * Book records: the shapes a book takes on its way through the shop, each made
 * from Book with a utility type, so they stay in step when Book changes.
 * Reference solution.
 */

export interface Book {
  isbn: string;
  title: string;
  price: number;
  stock: number;
}

export type Format = 'paperback' | 'hardback' | 'ebook';

export type NewBook = Omit<Book, 'stock'>;

export type BookCard = Pick<Book, 'title' | 'price'>;

export type BookPatch = Partial<Omit<Book, 'isbn'>>;

export type StockByFormat = Record<Format, number>;

export type Shelved = ReturnType<typeof shelve>;

export function shelve(book: NewBook): Book {
  return { ...book, stock: 0 };
}

export function toCard(book: Book): BookCard {
  // Pick only shapes the type: copy the two fields, or the rest travels on.
  return { title: book.title, price: book.price };
}

export function applyPatch(book: Book, patch: BookPatch): Book {
  // Partial allows { price: undefined }, which a plain spread would copy over.
  const set = Object.fromEntries(Object.entries(patch).filter(([, value]) => value !== undefined));
  return { ...book, ...set };
}

export function freeze(book: Book): Readonly<Book> {
  return Object.freeze({ ...book });
}

export function totalStock(stock: StockByFormat): number {
  return Object.values(stock).reduce((sum, n) => sum + n, 0);
}
