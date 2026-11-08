/** Orders: reference solution. */

import formatPrice from './money.js';

export function deliveryTown(order) {
  return order?.customer?.address?.town ?? 'Collect in shop';
}

// ?? keeps a real 0, where || would turn it into 1.
export function quantityOf(line) {
  return line.quantity ?? 1;
}

export function withDefaults(options = {}) {
  return {
    pageSize: options.pageSize ?? 20,
    showSoldOut: options.showSoldOut ?? true,
    label: options.label ?? 'Books',
  };
}

export function latest(orders) {
  return orders.at(-1);
}

export function firstAndRest(lines) {
  const [first, ...rest] = lines;
  return { first, rest };
}

export function addLine(order, line) {
  return { ...order, lines: [...order.lines, line] };
}

export function receiptLine(line) {
  const quantity = quantityOf(line);
  return `${quantity} x ${line.title}: ${formatPrice(line.pence * quantity)}`;
}
