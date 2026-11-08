// @vitest-environment jsdom
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { JoinForm } from './JoinForm.jsx';

afterEach(cleanup);

/** Render the form with a spy for onJoin, and helpers that use it as a reader would. */
function joinForm() {
  const onJoin = vi.fn();
  render(<JoinForm onJoin={onJoin} />);
  const field = label => screen.getByLabelText(label);
  return {
    onJoin,
    field,
    type: (label, value) => fireEvent.change(field(label), { target: { value } }),
    join: () => fireEvent.click(screen.getByRole('button', { name: 'Join' })),
    /** Submit the form itself, as Enter in a field does; true when the page would reload. */
    pressEnter: () => fireEvent.submit(field('Name').closest('form')),
  };
}

describe('the fields', () => {
  test('are labelled, named and start empty, with the first genre chosen', () => {
    const { field } = joinForm();
    expect(field('Name')).toHaveAttribute('name', 'reader');
    expect(field('Email')).toHaveAttribute('type', 'email');
    expect(field('Email')).toHaveAttribute('name', 'email');
    expect(field('Favourite genre')).toHaveAttribute('name', 'genre');
    expect(field('Send me the newsletter')).toHaveAttribute('name', 'news');
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('');
    expect(field('Favourite genre')).toHaveValue('fiction');
    expect([...field('Favourite genre').options].map(o => o.value)).toEqual(['fiction', 'history', 'poetry']);
    expect(field('Send me the newsletter')).not.toBeChecked();
  });

  test('keep what is typed, chosen and ticked', () => {
    const { field, type } = joinForm();
    type('Name', 'Ada');
    type('Email', 'ada@example.com');
    fireEvent.change(field('Favourite genre'), { target: { value: 'poetry' } });
    fireEvent.click(field('Send me the newsletter'));
    expect(field('Name')).toHaveValue('Ada');
    expect(field('Email')).toHaveValue('ada@example.com');
    expect(field('Favourite genre')).toHaveValue('poetry');
    expect(field('Send me the newsletter')).toBeChecked();
    fireEvent.click(field('Send me the newsletter'));
    expect(field('Send me the newsletter')).not.toBeChecked();
  });
});

describe('joining', () => {
  test('hands the entry to onJoin, trimmed, without reloading the page', () => {
    const { onJoin, field, type, pressEnter } = joinForm();
    type('Name', '  Ada ');
    type('Email', ' ada@example.com ');
    fireEvent.change(field('Favourite genre'), { target: { value: 'history' } });
    fireEvent.click(field('Send me the newsletter'));
    expect(pressEnter()).toBe(false);
    expect(onJoin).toHaveBeenCalledTimes(1);
    expect(onJoin).toHaveBeenCalledWith({ reader: 'Ada', email: 'ada@example.com', genre: 'history', news: true });
  });

  test('works from the Join button too', () => {
    const { onJoin, type, join } = joinForm();
    type('Name', 'Grace');
    type('Email', 'grace@example.com');
    join();
    expect(onJoin).toHaveBeenCalledWith({ reader: 'Grace', email: 'grace@example.com', genre: 'fiction', news: false });
  });

  test('empties the form and welcomes the reader by name', () => {
    const { field, type, join } = joinForm();
    type('Name', 'Ada');
    type('Email', 'ada@example.com');
    fireEvent.click(field('Send me the newsletter'));
    join();
    expect(screen.getByRole('status')).toHaveTextContent('Welcome, Ada');
    expect(field('Name')).toHaveValue('');
    expect(field('Email')).toHaveValue('');
    expect(field('Send me the newsletter')).not.toBeChecked();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  test('asks for a name, and does not join, when the name is blank', () => {
    const { onJoin, type, pressEnter } = joinForm();
    type('Name', '   ');
    type('Email', 'ada@example.com');
    expect(pressEnter()).toBe(false);
    expect(screen.getByRole('alert')).toHaveTextContent('Enter your name');
    expect(onJoin).not.toHaveBeenCalled();
  });

  test('asks for a valid email, and does not join, when it has no @', () => {
    const { onJoin, field, type, join } = joinForm();
    type('Name', 'Ada');
    type('Email', 'ada.example.com');
    join();
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email');
    expect(onJoin).not.toHaveBeenCalled();
    expect(field('Name')).toHaveValue('Ada');
  });
});
