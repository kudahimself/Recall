# Basket

Topic: State (useState) (Web Dev, React).
Time: about 20 minutes.

## Task

Write a bookshop basket as one React component, `Basket({ books })` in `Basket.jsx`, keeping its lines in `useState`.
`books` is the catalogue, an array of `{ id, title, price }`; a basket line is `{ id, qty }`, in the order the books were first added.

- One `<button>` per catalogue book, `Add Emma`, puts one copy in the basket: a new line at the end, or one more copy on the book's line when it already has one.
- A `<ul>` with an `<li>` per line, starting with its text, `Emma x2`, then three buttons: `More Emma` adds one copy, `Two more Emma` adds two in one click, and `Remove Emma` takes the line out.
- A `<p>` sums the basket up: `3 copies, £28.00`, `1 copy, £8.00`, or `Basket is empty` when it has no lines.

Replace the state, never change it in place: add with a spread, change one line with `map` and `{ ...line, qty }`, and remove with `filter`.
Work the count and the total out from the lines on every render instead of keeping them in state of their own.
Write `Two more` as adding one copy twice, so it only works when the setter gets an updater function: `setLines(current => ...)`.

## Examples

Emma costs £8, Dune £12 and Beowulf £6.50:

```text
Add Emma, Add Dune, Add Emma   ->  Emma x2, Dune x1     3 copies, £28.00
Two more Dune                  ->  Emma x2, Dune x3     5 copies, £52.00
Remove Emma                    ->  Dune x3              3 copies, £36.00
```

The tests render the basket with React Testing Library, click its buttons with `fireEvent.click`, and read the lines and the summary from the page.
The catalogue they pass is frozen, so changing it in place throws.

## Run the tests

Install the packages once, from the repository root: `cd exercises/web_dev && npm ci`.
Then:

```bash
cd exercises/web_dev/react_state
npm test
```

Every test fails until you fill in the component.
When they all pass, tick the exercise done in Recall under Progress, Topics.
