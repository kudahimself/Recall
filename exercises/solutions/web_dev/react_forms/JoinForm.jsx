/**
 * Join form: the reading club's sign-up form, every field controlled by state.
 * Reference solution.
 */
import { useState } from 'react';

/** The genres the select offers, in order; the first is chosen at the start. */
export const GENRES = ['fiction', 'history', 'poetry'];

const EMPTY = { reader: '', email: '', genre: GENRES[0], news: false };

export function JoinForm({ onJoin }) {
  const [entry, setEntry] = useState(EMPTY);
  const [error, setError] = useState('');
  const [welcome, setWelcome] = useState('');

  // One handler for every field: the input's name picks the key to replace.
  function update(e) {
    const field = e.target;
    const value = field.type === 'checkbox' ? field.checked : field.value;
    setEntry({ ...entry, [field.name]: value });
  }

  function join(e) {
    e.preventDefault();
    const reader = entry.reader.trim();
    const email = entry.email.trim();
    if (reader === '') return setError('Enter your name');
    if (!email.includes('@')) return setError('Enter a valid email');
    onJoin({ ...entry, reader, email });
    setError('');
    setWelcome(`Welcome, ${reader}`);
    setEntry(EMPTY);
  }

  return (
    // noValidate: the form checks its fields itself, instead of the browser's bubbles.
    <form noValidate onSubmit={join}>
      <label htmlFor="reader">Name</label>
      <input id="reader" name="reader" value={entry.reader} onChange={update} />
      <label htmlFor="email">Email</label>
      <input id="email" type="email" name="email" value={entry.email} onChange={update} />
      <label htmlFor="genre">Favourite genre</label>
      <select id="genre" name="genre" value={entry.genre} onChange={update}>
        {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
      </select>
      <input id="news" type="checkbox" name="news" checked={entry.news} onChange={update} />
      <label htmlFor="news">Send me the newsletter</label>
      <button>Join</button>
      {error && <p role="alert">{error}</p>}
      {welcome && <p role="status">{welcome}</p>}
    </form>
  );
}
