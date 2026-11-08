// @vitest-environment jsdom
import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { BookBlurb, ReadingTimer } from './ReadingPage.jsx';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('ReadingTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.title = 'Bookshop';
  });
  /** Move the fake clock on, letting React render what the timers set. */
  const wait = ms => act(() => { vi.advanceTimersByTime(ms); });

  test('counts the seconds since it appeared', () => {
    render(<ReadingTimer book="Emma" />);
    expect(screen.getByText('Emma: 0s')).toBeInTheDocument();
    wait(1000);
    expect(screen.getByText('Emma: 1s')).toBeInTheDocument();
    wait(3000);
    expect(screen.getByText('Emma: 4s')).toBeInTheDocument();
  });

  test('starts one timer and stops it when it leaves the page', () => {
    const { rerender, unmount } = render(<ReadingTimer book="Emma" />);
    expect(vi.getTimerCount()).toBe(1);
    rerender(<ReadingTimer book="Dune" />);
    wait(2000);
    expect(screen.getByText('Dune: 2s')).toBeInTheDocument();
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  test('counts once a second under StrictMode, which sets an effect up, cleans it up and sets it up again', () => {
    render(<StrictMode><ReadingTimer book="Emma" /></StrictMode>);
    wait(3000);
    expect(screen.getByText('Emma: 3s')).toBeInTheDocument();
  });

  test('puts the book in the tab\'s title, follows the book, and puts the old title back at the end', () => {
    const { rerender, unmount } = render(<ReadingTimer book="Emma" />);
    expect(document.title).toBe('Reading Emma');
    rerender(<ReadingTimer book="Dune" />);
    expect(document.title).toBe('Reading Dune');
    unmount();
    expect(document.title).toBe('Bookshop');
  });
});

/** A fetchBlurb whose answers the test gives out by hand: answer(id, text) or fail(id). */
function fakeFetch() {
  const pending = new Map();
  const fetchBlurb = vi.fn(id => new Promise((resolve, reject) => pending.set(id, { resolve, reject })));
  return {
    fetchBlurb,
    answer: (id, text) => act(async () => { pending.get(id).resolve(text); }),
    fail: id => act(async () => { pending.get(id).reject(new Error('offline')); }),
  };
}

describe('BookBlurb', () => {
  test('loads the blurb of its book', async () => {
    const { fetchBlurb, answer } = fakeFetch();
    render(<BookBlurb id={7} fetchBlurb={fetchBlurb} />);
    expect(screen.getByRole('paragraph')).toHaveTextContent('Loading...');
    expect(fetchBlurb).toHaveBeenCalledWith(7);
    await answer(7, 'A young matchmaker in Highbury.');
    expect(screen.getByRole('paragraph')).toHaveTextContent('A young matchmaker in Highbury.');
  });

  test('asks again only when the id changes', async () => {
    const { fetchBlurb, answer } = fakeFetch();
    const { rerender } = render(<BookBlurb id={7} fetchBlurb={fetchBlurb} />);
    await answer(7, 'Emma');
    rerender(<BookBlurb id={7} fetchBlurb={fetchBlurb} />);
    expect(fetchBlurb).toHaveBeenCalledTimes(1);
    rerender(<BookBlurb id={9} fetchBlurb={fetchBlurb} />);
    expect(fetchBlurb).toHaveBeenCalledTimes(2);
    expect(fetchBlurb).toHaveBeenLastCalledWith(9);
    expect(screen.getByRole('paragraph')).toHaveTextContent('Loading...');
    await answer(9, 'Spice on Arrakis.');
    expect(screen.getByRole('paragraph')).toHaveTextContent('Spice on Arrakis.');
  });

  test('ignores a late answer for a book it no longer shows', async () => {
    const { fetchBlurb, answer } = fakeFetch();
    const { rerender } = render(<BookBlurb id={7} fetchBlurb={fetchBlurb} />);
    rerender(<BookBlurb id={9} fetchBlurb={fetchBlurb} />);
    await answer(9, 'Spice on Arrakis.');
    await answer(7, 'A young matchmaker in Highbury.');
    expect(screen.getByRole('paragraph')).toHaveTextContent('Spice on Arrakis.');
  });

  test('says so when the blurb cannot be loaded', async () => {
    const { fetchBlurb, fail } = fakeFetch();
    render(<BookBlurb id={7} fetchBlurb={fetchBlurb} />);
    await fail(7);
    expect(screen.getByRole('paragraph')).toHaveTextContent('Could not load the blurb');
  });
});
