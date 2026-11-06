import { useEffect, useState } from 'react';

/**
 * Whether a CSS media query matches, kept up to date as the window changes.
 * Where matchMedia is missing (tests), `fallback` is used.
 */
export function useMediaQuery(query: string, fallback = false): boolean {
  const read = () => (typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(query).matches
    : fallback);
  const [matches, setMatches] = useState(read);
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);
    update();
    list.addEventListener('change', update);
    return () => list.removeEventListener('change', update);
  }, [query]);
  return matches;
}
