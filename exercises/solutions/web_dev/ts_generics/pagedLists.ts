/**
 * Paged lists: helpers that work for a list of anything and keep track of what
 * it holds, written with generics.
 * Reference solution.
 */

export interface Page<T> {
  items: T[];
  page: number;
  total: number;
  pages: number;
}

export interface Labelled<T = string> {
  value: T;
  label: string;
}

export function paginate<T>(all: T[], size: number, page = 1): Page<T> {
  const start = (page - 1) * size;
  return {
    items: all.slice(start, start + size),
    page,
    total: all.length,
    pages: Math.ceil(all.length / size),
  };
}

export function longest<T extends { length: number }>(items: T[]): T | undefined {
  let best: T | undefined;
  for (const item of items) {
    if (best === undefined || item.length > best.length) best = item;
  }
  return best;
}

export function pluck<T, K extends keyof T>(rows: T[], key: K): T[K][] {
  return rows.map(row => row[key]);
}

export function indexById<T extends { id: number }>(rows: T[]): Map<number, T> {
  return new Map(rows.map(row => [row.id, row]));
}
