/**
 * Reading page: two components that keep in step with things outside React,
 * the tab's title, a timer and a request, using useEffect and its cleanup.
 *
 * Fill in both components so the tests in ReadingPage.test.jsx pass.
 * Run them from this folder with: npm test
 */
import { useEffect, useState } from 'react';

/**
 * "Emma: 3s", the seconds since the timer appeared on the page, counted up by
 * a setInterval every 1000 ms that is started once and cleared when the timer
 * leaves the page.
 * While it is on the page the tab's title (document.title) reads "Reading Emma",
 * following the `book` prop when it changes; when the timer leaves the page,
 * the title goes back to what it was before.
 *
 * <ReadingTimer book="Emma" />  ->  <p>Emma: 0s</p>, then Emma: 1s a second later
 */
export function ReadingTimer({ book }) {
  // TODO
  return null;
}

/**
 * The blurb of book `id`, loaded with fetchBlurb(id), which returns a Promise of
 * the text. It calls fetchBlurb again only when `id` changes.
 * Shows "<p>Loading...</p>" until the blurb of the current id arrives, then
 * "<p>{the text}</p>", or "<p>Could not load the blurb</p>" when the Promise rejects.
 * A response for an id the component no longer shows is ignored, however late it comes.
 */
export function BookBlurb({ id, fetchBlurb }) {
  // TODO
  return null;
}
