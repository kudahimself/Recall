/** Stock lookups: reference solution. */

export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function bookTitle(url, fetchFn) {
  const response = await fetchFn(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  // json() returns a Promise too, so it needs its own await.
  const book = await response.json();
  return book.title;
}

export async function stockLine(title, fetchStock) {
  try {
    const stock = await fetchStock(title);
    return `${title}: ${stock} in stock`;
  } catch (error) {
    return `${title}: unavailable (${error.message})`;
  }
}

export async function allStock(titles, fetchStock) {
  return Promise.all(titles.map((title) => fetchStock(title)));
}

export async function stockReport(titles, fetchStock) {
  const outcomes = await Promise.allSettled(titles.map((title) => fetchStock(title)));
  return outcomes.map((outcome, i) => (outcome.status === 'fulfilled'
    ? { title: titles[i], ok: true, stock: outcome.value }
    : { title: titles[i], ok: false, error: outcome.reason.message }));
}

export async function firstInStock(titles, fetchStock) {
  for (const title of titles) {
    const stock = await fetchStock(title);
    if (stock > 0) return title;
  }
  return null;
}
