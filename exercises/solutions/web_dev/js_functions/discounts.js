/** Discounts: reference solution. */

export function lateFee(days, perDay = 20) {
  return days * perDay;
}

// Parentheses around the object literal, or the braces would be read as a function body.
export const toTag = (book) => ({ id: book.isbn, label: book.title.toUpperCase() });

export function percentOff(percent) {
  return (price) => Math.round((price * (100 - percent)) / 100);
}

export function minus(amount) {
  return (price) => Math.max(0, price - amount);
}

export function applyAll(price, ...discounts) {
  let result = price;
  for (const discount of discounts) {
    result = discount(result);
  }
  return result;
}

export function makeCounter(start = 0) {
  let count = start;
  return () => {
    count += 1;
    return count;
  };
}

export function once(fn) {
  let called = false;
  let result;
  return (...args) => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}
