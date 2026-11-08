/**
 * Join form: the reading club's sign-up form, every field controlled by state.
 *
 * Fill in JoinForm so the tests in JoinForm.test.jsx pass.
 * Run them from this folder with: npm test
 */
import { useState } from 'react';

/** The genres the select offers, in order; the first is chosen at the start. */
export const GENRES = ['fiction', 'history', 'poetry'];

/**
 * A <form noValidate> (it checks the fields itself, so the browser's own checks
 * are turned off) with four controlled fields, each with a <label htmlFor> naming it:
 * - "Name": a text <input name="reader">
 * - "Email": an <input type="email" name="email">
 * - "Favourite genre": a <select name="genre"> with an <option> per genre
 * - "Send me the newsletter": a checkbox <input type="checkbox" name="news">
 * and a <button>Join</button> that submits it.
 *
 * On submit (the button, or Enter in a field), without reloading the page:
 * - a blank name shows <p role="alert">Enter your name</p>,
 * - an email without an "@" shows <p role="alert">Enter a valid email</p>,
 * - otherwise it calls onJoin({ reader, email, genre, news }) with the name and
 *   email trimmed, empties the form back to how it started, and shows
 *   <p role="status">Welcome, Ada</p> with the name.
 */
export function JoinForm({ onJoin }) {
  // TODO
  return null;
}
