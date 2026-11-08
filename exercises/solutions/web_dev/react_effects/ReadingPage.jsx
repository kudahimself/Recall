/**
 * Reading page: two components that keep in step with things outside React,
 * the tab's title, a timer and a request, using useEffect and its cleanup.
 * Reference solution.
 */
import { useEffect, useState } from 'react';

export function ReadingTimer({ book }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // Started once; the updater reads the latest count, never the first render's.
    const timer = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const before = document.title;
    document.title = `Reading ${book}`;
    return () => {
      document.title = before;
    };
  }, [book]);

  return <p>{book}: {seconds}s</p>;
}

export function BookBlurb({ id, fetchBlurb }) {
  // The result remembers which id it belongs to, so a stale one is never shown.
  const [result, setResult] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetchBlurb(id).then(
      text => { if (!ignore) setResult({ id, text }); },
      () => { if (!ignore) setResult({ id, text: 'Could not load the blurb' }); },
    );
    return () => {
      ignore = true;
    };
  }, [id, fetchBlurb]);

  const current = result?.id === id ? result.text : 'Loading...';
  return <p>{current}</p>;
}
