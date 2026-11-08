# Book cards

Topic: Components & JSX (Web Dev, React).
Time: about 20 minutes.

## Task

Write the bookshop's shelf as three React components in `BookCards.jsx`.
Each is a function that takes its props and returns JSX; none of them keeps state.
A book is `{ id, title, author, stock, isNew }`.

- `StockNote({ stock })` returns `<b>2 left</b>` while there is stock and `<i>sold out</i>` when it is 0.
- `BookCard({ title, author, stock })` returns one `<li>` with the class `book`, and `sold-out` as well when the stock is 0.
  Inside it, in order: the title in a `<span class="title">`, ` by ` and the author only when there is one, a space, the book's `StockNote`, and a `<button>` that reads `Buy`, or `Sold out` and is disabled when the stock is 0.
- `Shelf({ books, children })` returns, with no element wrapped around them: whatever the parent nests inside `<Shelf>`, then a `<span class="badge">` reading `2 new` when some books are new (and nothing at all when none is), then a `<ul>` with a `BookCard` for each book.
  With no books, a `<p>` reading `Nothing on this shelf` takes the list's place.

Remember that JSX writes `className`, picks with a ternary or `&&`, repeats with `map`, and needs a `key` from the data on each item of a list.

## Examples

```jsx
<StockNote stock={0} />
// <i>sold out</i>

<BookCard title="Emma" author="Austen" stock={2} />
// <li class="book"><span class="title">Emma</span> by Austen <b>2 left</b><button>Buy</button></li>

<Shelf books={books}><h2>Fiction</h2></Shelf>
// <h2>Fiction</h2>
// <span class="badge">1 new</span>
// <ul><li class="book">...</li><li class="book sold-out">...</li>...</ul>
```

The tests render the components with React Testing Library in jsdom and read what ends up on the page.
One of them counts React's warnings, which is how a missing `key` or a `class` written for `className` shows up.
Another inserts a book at the top of the shelf and checks that Emma's card is still the same element, which only holds when each card is keyed by its book's `id`, not by its place in the array.

## Run the tests

Install the packages once, from the repository root: `cd exercises/web_dev && npm ci`.
Then:

```bash
cd exercises/web_dev/react_components
npm test
```

Every test fails until you fill in the components.
When they all pass, tick the exercise done in Recall under Progress, Topics.
