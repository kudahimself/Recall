/**
 * Search box: a title search built from hooks, two custom ones and a component
 * that uses them with useRef.
 * Reference solution.
 */
import { useEffect, useMemo, useRef, useState } from 'react';

export function useFilter(items, query) {
  // The blank-query case sits inside the memo, so the hook runs on every render.
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q === '') return items;
    return items.filter(item => item.toLowerCase().includes(q));
  }, [items, query]);
}

export function usePrevious(value) {
  const ref = useRef(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export function SearchBox({ titles }) {
  const [query, setQuery] = useState('');
  const boxRef = useRef(null);
  const found = useFilter(titles, query);

  useEffect(() => {
    boxRef.current.focus();
  }, []);

  function clear() {
    setQuery('');
    boxRef.current.focus();
  }

  return (
    <>
      <input aria-label="Search" ref={boxRef} value={query} onChange={e => setQuery(e.target.value)} />
      <p>{found.length > 0 ? `${found.length} found: ${found.join(', ')}` : 'No matches'}</p>
      <button onClick={clear}>Clear</button>
    </>
  );
}
