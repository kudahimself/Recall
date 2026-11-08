# Search box

Topic: Hooks (useRef, useMemo, custom hooks) (Web Dev, React).
Time: about 20 minutes.

## Task

Write a title search in `SearchBox.jsx`: two custom hooks, then a component that uses one of them with `useRef`.

- `useFilter(items, query)` gives back the items (strings) that contain the query, ignoring case and the spaces around the query.
  Work the list out with `useMemo`, so that while `items` and `query` stay the same the hook gives back the very same array.
  A blank query gives back `items` itself.
- `usePrevious(value)` gives back the value it was given on the render before, or `undefined` on the first render.
  Keep it in a ref: `useRef`'s box lasts across renders, and setting `ref.current` does not render again.
- `SearchBox({ titles })` shows an `<input aria-label="Search">`, controlled by state, that has the focus as soon as it appears; a `<p>` with what matches, `2 found: Dune, Dubliners`, or `No matches`; and a `<button>Clear</button>` that empties the box and puts the focus back in it.

Call every hook at the top level, the same ones in the same order on every render.
A blank query is the tempting place to break that rule with an early `return` before `useMemo`, and React then fails as soon as the query changes.

## Examples

```js
useFilter(["Emma", "Dune", "Dubliners"], "du ")   // ["Dune", "Dubliners"]
useFilter(titles, "")                              // titles itself

// a component rendered with 1, then 2, then 3
usePrevious(value)                                 // undefined, then 1, then 2
```

The hooks' tests call them through React Testing Library's `renderHook`, whose `rerender` renders the hook again with new props, and compare the arrays with `toBe` (the same array) as well as `toEqual` (the same contents).
The component's tests check `toHaveFocus()` on the box.

## Run the tests

Install the packages once, from the repository root: `cd exercises/web_dev && npm ci`.
Then:

```bash
cd exercises/web_dev/react_hooks
npm test
```

Every test fails until you fill in the hooks and the component.
When they all pass, tick the exercise done in Recall under Progress, Topics.
