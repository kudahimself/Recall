/**
 * Book routes: the bookshop as a routed app with React Router 7, a page per URL
 * and no page reloads, plus a note box that starts fresh for every book.
 *
 * Reference solution.
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

export function Layout() {
  return (
    <>
      <nav><Link to="/">Home</Link></nav>
      <Outlet />
    </>
  );
}

export function BookList() {
  return (
    <>
      <h1>Pick a book</h1>
      <ul>
        {BOOKS.map(b => (
          <li key={b.id}><Link to={`/books/${b.id}`}>{b.title}</Link></li>
        ))}
      </ul>
    </>
  );
}

export function BookPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const at = BOOKS.findIndex(b => String(b.id) === id);
  if (at === -1) return <h1>No such book</h1>;
  const next = BOOKS[at + 1];
  return (
    <>
      <h1>{BOOKS[at].title}</h1>
      {/* A new key for each book makes React mount a fresh NoteBox. */}
      <NoteBox key={id} />
      {next && <Link to={`/books/${next.id}`}>Next book</Link>}
      <button onClick={() => navigate('/')}>Back to the list</button>
    </>
  );
}

export function NotFound() {
  return <h1>Page not found</h1>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<BookList />} />
        <Route path="books/:id" element={<BookPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

/** The app in a browser, reading the address bar. */
export function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
