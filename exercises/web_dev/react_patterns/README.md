# Book routes

Topic: Patterns & Best Practices (Web Dev, React).
Time: about 25 minutes.

## Task

Turn the bookshop into a routed app with React Router 7 in `BookRoutes.jsx`: a page for each URL, and moving between them without reloading the page.
`BOOKS`, `NoteBox` and `App` are written for you; fill in the components marked `TODO`.

- `Layout()` is every page's frame: a `<nav>` with a `<Link>` reading `Home` to `/`, then the matching page, rendered at an `<Outlet />`.
- `BookList()` is the page at `/`: an `<h1>Pick a book</h1>`, then a `<ul>` with an `<li>` per book holding a `<Link>` to its page, `/books/2`, that reads its title.
- `BookPage()` is the page at `/books/:id`, which reads the id with `useParams()`.
  It shows the book's title in an `<h1>`, a `NoteBox`, a `<Link>Next book</Link>` to the page of the next book in `BOOKS` (none after the last), and a `<button>Back to the list</button>` that goes to `/` with `navigate()` from `useNavigate()`.
  An id that is not in `BOOKS` shows only `<h1>No such book</h1>`.
- `NotFound()` shows `<h1>Page not found</h1>`.
- `AppRoutes()` returns the `<Routes>`: `/` renders `Layout`, and nested inside it `BookList` as the index route, `BookPage` at `books/:id`, and `NotFound` for every other path, `*`.

The note box keeps its text in its own state, and going from one book to the next renders `BookPage` again in the same place, so React keeps that state.
Give the `NoteBox` a `key` that changes with the book, so React throws the old one away and mounts a fresh, empty one.

## Examples

```text
/            Home | Pick a book: Emma, Dune, Beowulf
/books/2     Home | Dune, a note box, Next book (to /books/3), Back to the list
/books/99    Home | No such book
/basket/old  Home | Page not found
```

The tests put `AppRoutes` in a `MemoryRouter`, which starts at the URL they give and keeps its history in memory instead of the address bar, then click the links and the button.
A plain `<a href>` would ask the browser to load a new page, which jsdom does not do, so only a `<Link>` moves the tests to the next page.

## Run the tests

Install the packages once, from the repository root: `cd exercises/web_dev && npm ci`.
Then:

```bash
cd exercises/web_dev/react_patterns
npm test
```

Every test fails until you fill in the components.
When they all pass, tick the exercise done in Recall under Progress, Topics.
