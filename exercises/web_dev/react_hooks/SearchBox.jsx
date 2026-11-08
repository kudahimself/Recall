/**
 * Search box: a title search built from hooks, two custom ones and a component
 * that uses them with useRef.
 *
 * Fill in each one so the tests in SearchBox.test.jsx pass.
 * Run them from this folder with: npm test
 * Call hooks at the top level only: never inside an if, a loop or after an early return.
 */
import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * The items (strings) that contain the query, ignoring case and the spaces
 * around the query, worked out with useMemo, so while `items` and `query` stay
 * the same the hook gives back the very same array.
 * A blank query gives back `items` itself.
 *
 * useFilter(["Emma", "Dune", "Dubliners"], "du ")  ->  ["Dune", "Dubliners"]
 */
export function useFilter(items, query) {
  // TODO
}

/**
 * The value this hook was given on the render before, or undefined on the first
 * render, kept in a ref: useRef's box lasts across renders, and setting it does
 * not render again.
 *
 * renders with 1, then 2, then 3  ->  undefined, then 1, then 2
 */
export function usePrevious(value) {
  // TODO
}

/**
 * An <input aria-label="Search"> that has the focus as soon as the box appears,
 * so the reader can type straight away, a <p> with what matches,
 * "2 found: Dune, Dubliners", or "No matches", and a <button>Clear</button>
 * that empties the box and puts the focus back in it.
 * The input is controlled: its value comes from state.
 */
export function SearchBox({ titles }) {
  // TODO
  return null;
}
