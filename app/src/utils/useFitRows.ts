import { useLayoutEffect, useState } from 'react';

/**
 * How many of a list's rows fit in the list's own height, so a screen that
 * must not scroll shows whole rows instead of clipping one (and never leaves
 * a hidden button in the Tab order). The list must take its height from its
 * container, not from its rows. All rows where it cannot be measured (tests).
 */
export function useFitRows(ref: React.RefObject<HTMLElement | null>, count: number, enabled: boolean): number {
  const [fit, setFit] = useState(count);
  useLayoutEffect(() => {
    setFit(count);
    const el = ref.current;
    if (!enabled || !el || typeof ResizeObserver === 'undefined') return undefined;
    const measure = () => {
      const row = el.querySelector<HTMLElement>(':scope > li');
      const rowH = row?.offsetHeight ?? 0;
      const gap = parseFloat(getComputedStyle(el).rowGap) || 0;
      if (!rowH || !el.clientHeight) return;
      setFit(Math.max(1, Math.min(count, Math.floor((el.clientHeight + gap) / (rowH + gap)))));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, count, enabled]);
  return enabled ? fit : count;
}
