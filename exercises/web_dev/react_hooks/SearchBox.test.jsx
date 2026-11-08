// @vitest-environment jsdom
import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, fireEvent, render, renderHook, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { SearchBox, useFilter, usePrevious } from './SearchBox.jsx';

afterEach(cleanup);

const titles = ['Emma', 'Dune', 'Dubliners', 'Persuasion'];

describe('useFilter', () => {
  test('keeps the items that contain the query, ignoring case and spaces around it', () => {
    const { result } = renderHook(() => useFilter(titles, ' dU '));
    expect(result.current).toEqual(['Dune', 'Dubliners']);
    expect(renderHook(() => useFilter(titles, 'xyz')).result.current).toEqual([]);
  });

  test('gives back the same array while the items and the query stay the same', () => {
    const { result, rerender } = renderHook(({ q }) => useFilter(titles, q), { initialProps: { q: 'du' } });
    const first = result.current;
    rerender({ q: 'du' });
    expect(result.current).toBe(first);
    rerender({ q: 'em' });
    expect(result.current).toEqual(['Emma']);
    expect(result.current).not.toBe(first);
  });

  test('gives back the items themselves for a blank query, and keeps working as the query changes', () => {
    const { result, rerender } = renderHook(({ q }) => useFilter(titles, q), { initialProps: { q: '' } });
    expect(result.current).toBe(titles);
    rerender({ q: 'sion' });
    expect(result.current).toEqual(['Persuasion']);
    rerender({ q: '  ' });
    expect(result.current).toBe(titles);
  });
});

test('usePrevious gives the value of the render before, undefined at first', () => {
  const { result, rerender } = renderHook(({ v }) => usePrevious(v), { initialProps: { v: 1 } });
  expect(result.current).toBeUndefined();
  rerender({ v: 2 });
  expect(result.current).toBe(1);
  rerender({ v: 3 });
  expect(result.current).toBe(2);
});

describe('SearchBox', () => {
  const box = () => screen.getByRole('textbox', { name: 'Search' });
  const type = text => fireEvent.change(box(), { target: { value: text } });

  test('has the focus as soon as it appears, and shows every title', () => {
    render(<SearchBox titles={titles} />);
    expect(box()).toHaveFocus();
    expect(screen.getByRole('paragraph')).toHaveTextContent('4 found: Emma, Dune, Dubliners, Persuasion');
  });

  test('shows the titles that match what is typed', () => {
    render(<SearchBox titles={titles} />);
    type('du');
    expect(box()).toHaveValue('du');
    expect(screen.getByRole('paragraph')).toHaveTextContent('2 found: Dune, Dubliners');
    type('zz');
    expect(screen.getByRole('paragraph')).toHaveTextContent('No matches');
  });

  test('Clear empties the box and puts the focus back in it', () => {
    render(<SearchBox titles={titles} />);
    type('em');
    const clear = screen.getByRole('button', { name: 'Clear' });
    clear.focus();
    expect(box()).not.toHaveFocus();
    fireEvent.click(clear);
    expect(box()).toHaveValue('');
    expect(box()).toHaveFocus();
    expect(screen.getByRole('paragraph')).toHaveTextContent('4 found');
  });
});
