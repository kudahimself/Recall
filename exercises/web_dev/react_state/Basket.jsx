/**
 * Basket: a bookshop basket whose lines live in React state.
 * `books` is the catalogue, an array of { id, title, price }; the basket's lines
 * are { id, qty }, in the order the books were first added.
 *
 * Fill in Basket so the tests in Basket.test.jsx pass.
 * Run them from this folder with: npm test
 * State is replaced, never changed in place, and the catalogue is never changed.
 */
import { useState } from 'react';

/** 8 -> "£8.00" */
const money = amount => `£${amount.toFixed(2)}`;

/**
 * The catalogue as buttons, then the basket.
 *
 * - One <button> per catalogue book, "Add Emma", which puts one copy in the basket:
 *   a new line at the end, or one more copy on the book's line when it has one.
 * - A <ul> with an <li> per line, "Emma x2", holding three buttons:
 *   "More Emma" adds one copy, "Two more Emma" adds two in one click
 *   (by adding one copy twice), and "Remove Emma" takes the line out.
 * - A <p> summing the basket up: "3 copies, £28.00", "1 copy, £8.00",
 *   or "Basket is empty" when there are no lines.
 *
 * The count and the total are worked out from the lines on every render,
 * not kept in state of their own.
 */
export function Basket({ books }) {
  // TODO: keep the lines in state, starting empty, and render them
  return null;
}
