/** Shop records: reference solution. */

export function describeBook(book, keys) {
  return keys.map((key) => `${key}: ${book[key]}`).join(', ');
}

export function restocked(book, copies) {
  return { ...book, stock: book.stock + copies };
}

// Spread copies one level, so the address needs its own spread or it stays shared.
export function movedShop(shop, town) {
  return { ...shop, address: { ...shop.address, town } };
}

export function townOf(shop) {
  const { address: { town } } = shop;
  return town;
}

export function copyOrder(order) {
  return structuredClone(order);
}

export class Basket {
  constructor(owner) {
    this.owner = owner;
    this.lines = [];
  }

  add(book, quantity = 1) {
    const line = this.lines.find((l) => l.isbn === book.isbn);
    if (line) {
      line.quantity += quantity;
    } else {
      this.lines.push({ isbn: book.isbn, title: book.title, pence: book.pence, quantity });
    }
    return this;
  }

  count() {
    return this.lines.reduce((total, line) => total + line.quantity, 0);
  }

  total() {
    return this.lines.reduce((total, line) => total + line.pence * line.quantity, 0);
  }
}
