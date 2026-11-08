/**
 * Basket: a bookshop basket whose lines live in React state.
 * Reference solution.
 */
import { useState } from 'react';

/** 8 -> "£8.00" */
const money = amount => `£${amount.toFixed(2)}`;

export function Basket({ books }) {
  const [lines, setLines] = useState([]);

  function addCopy(id) {
    // The updater reads the latest lines, so two calls in one click add two.
    setLines(current => (current.some(line => line.id === id)
      ? current.map(line => (line.id === id ? { ...line, qty: line.qty + 1 } : line))
      : [...current, { id, qty: 1 }]));
  }
  function addTwo(id) {
    addCopy(id);
    addCopy(id);
  }
  function remove(id) {
    setLines(current => current.filter(line => line.id !== id));
  }

  const bookOf = id => books.find(b => b.id === id);
  const copies = lines.reduce((n, line) => n + line.qty, 0);
  const total = lines.reduce((sum, line) => sum + line.qty * bookOf(line.id).price, 0);
  const summary = copies === 0
    ? 'Basket is empty'
    : `${copies} ${copies === 1 ? 'copy' : 'copies'}, ${money(total)}`;

  return (
    <>
      {books.map(b => (
        <button key={b.id} onClick={() => addCopy(b.id)}>Add {b.title}</button>
      ))}
      <ul>
        {lines.map(line => {
          const { title } = bookOf(line.id);
          return (
            <li key={line.id}>
              {title} x{line.qty}
              <button onClick={() => addCopy(line.id)}>More {title}</button>
              <button onClick={() => addTwo(line.id)}>Two more {title}</button>
              <button onClick={() => remove(line.id)}>Remove {title}</button>
            </li>
          );
        })}
      </ul>
      <p>{summary}</p>
    </>
  );
}
