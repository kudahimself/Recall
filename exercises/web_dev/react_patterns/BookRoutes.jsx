/**
 * Book routes: the bookshop as a routed app with React Router 7, a page per URL
 * and no page reloads, plus a note box that starts fresh for every book.
 *
 * Fill in the components marked TODO so the tests in BookRoutes.test.jsx pass.
 * Run them from this folder with: npm test
 * BOOKS, NoteBox and App are done; leave them as they are.
 */
import { useState } from 'react';
import { BrowserRouter, Link, Outlet, Route, Routes, useNavigate, useParams } from 'react-router';

export const BOOKS = [
  { id: 1, title: 'Emma' },
  { id: 2, title: 'Dune' },
  { id: 3, title: 'Beowulf' },
];

/** A note the reader is writing, kept in this component's own state. */
export function NoteBox() {
  const [note, setNote] = useState('');
  return (
    <label>
      Your note
      <textarea value={note} onChange={e => setNote(e.target.value)} />
    </label>
  );
}

/**
 * Every page's frame: a <nav> with a <Link> "Home" to "/", then the page of
 * the route that matched, rendered at an <Outlet />.
 */
export function Layout() {
  // TODO
  return null;
}

/**
 * The page at "/": an <h1>Pick a book</h1>, then a <ul> with an <li> per book
 * holding a <Link> to its page, "/books/2", that reads its title.
 */
export function BookList() {
  // TODO
  return null;
}

/**
 * The page at "/books/:id": the book's title in an <h1>, a NoteBox that starts
 * empty again for each book (give it a key), a <Link>Next book</Link> to the
 * page of the next book in BOOKS (none after the last), and a
 * <button>Back to the list</button> that goes to "/" with navigate().
 * An id that is not in BOOKS shows only <h1>No such book</h1>.
 */
export function BookPage() {
  // TODO
  return null;
}

/** Any other URL: <h1>Page not found</h1>. */
export function NotFound() {
  // TODO
  return null;
}

/**
 * The routes: "/" renders Layout, and inside it BookList as the index route,
 * BookPage at "books/:id" and NotFound for every other path ("*").
 * It returns the <Routes> only, so the tests can put it in a router of their own.
 */
export function AppRoutes() {
  // TODO
  return null;
}

/** The app in a browser, reading the address bar. */
export function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
