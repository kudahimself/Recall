/**
 * Price tags: small functions for the bookshop's labels, written in TypeScript.
 * Reference solution.
 */

export type Format = 'paperback' | 'hardback' | 'ebook';

export function price(base: number, format: Format, discount?: number): number {
  let cost = base;
  if (format === 'hardback') cost = base + 5;
  if (format === 'ebook') cost = Math.max(0, base - 3);
  return cost - (discount ?? 0);
}

export function pageCount(raw: unknown): number {
  if (typeof raw === 'number') return raw;
  if (typeof raw === 'string') {
    const n = Number(raw);
    return Number.isNaN(n) ? 0 : n;
  }
  return 0;
}

export function label(title: string, tags: string[] = []): string {
  return tags.length > 0 ? `${title} [${tags.join(', ')}]` : title;
}

export function shelfCode(id: string | number): string {
  if (typeof id === 'number') return `B${String(id).padStart(3, '0')}`;
  return id.trim().toUpperCase();
}

export function fail(message: string): never {
  throw new Error(message);
}
