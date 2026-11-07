/**
 * Moving around the app with the keyboard only, against the real <App/>:
 * the course switcher in the top bar (C, arrows, numbers, Enter, Esc), the
 * G sequences to Home, Learn, Progress and Settings, Enter on Home to start
 * today's session, and every Settings control reachable with Tab and working
 * from the keys.
 *
 * Run: npm test -- --testPathPattern=App.navigation --watchAll=false
 */
/* eslint-disable testing-library/no-node-access -- these tests are about focus, so they read document.activeElement */
import React from 'react';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { SHORTCUTS } from './keyboard/shortcuts';
import * as progressStorage from './utils/progressStorage';
import { TODAY_SIZE_KEY } from './utils/spacedRepetition';

/** A key pressed wherever focus is now, as a keyboard user would. */
const press = (keys: string) => userEvent.keyboard(keys);
const focused = () => document.activeElement as HTMLElement;
const trigger = () => screen.getByRole('button', { name: /Switch course/ });

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('recall-active-course', 'sql');
  jest.restoreAllMocks();
});

describe('the course switcher', () => {
  test('C opens it on the current course; the arrows and Enter switch, and focus goes back to it', () => {
    render(<App />);
    expect(trigger()).toHaveAccessibleName('Course: SQL for Data Engineering. Switch course');

    press('c');
    const menu = screen.getByRole('menu', { name: 'Courses' });
    expect(trigger()).toHaveAttribute('aria-expanded', 'true');
    expect(focused()).toHaveAccessibleName('SQL for Data Engineering');
    expect(focused()).toHaveAttribute('aria-checked', 'true');
    // Five courses, each with its number key.
    expect(within(menu).getAllByRole('menuitemradio')).toHaveLength(5);

    press('{arrowdown}');
    expect(focused()).toHaveAccessibleName('Databricks & PySpark');
    press('{arrowdown}{arrowdown}');
    expect(focused()).toHaveAccessibleName('Backend Engineering');
    press('{enter}');

    expect(screen.queryByRole('menu')).toBeNull();
    expect(trigger()).toHaveAccessibleName('Course: Backend Engineering. Switch course');
    expect(focused()).toBe(trigger());
    expect(localStorage.getItem('recall-active-course')).toBe('backend');
  });

  test('a number picks a course straight away', () => {
    render(<App />);
    press('c');
    press('2');
    expect(trigger()).toHaveAccessibleName('Course: Web Development. Switch course');
    expect(screen.queryByRole('menu')).toBeNull();
  });

  test('Esc, or C again, closes it without a change; other keys wait until it is closed', () => {
    render(<App />);
    press('c');
    press('{esc}');
    expect(screen.queryByRole('menu')).toBeNull();
    expect(focused()).toBe(trigger());

    press('c');
    // G then P would leave Home; while the list is open it does nothing.
    press('gp');
    expect(screen.getByRole('menu')).toBeInTheDocument();
    press('c');
    expect(screen.queryByRole('menu')).toBeNull();
    expect(trigger()).toHaveAccessibleName('Course: SQL for Data Engineering. Switch course');
    expect(screen.getByRole('heading', { name: "Today's session" })).toBeInTheDocument();
  });

  test('Enter or the arrow keys on the focused button open it too', () => {
    render(<App />);
    trigger().focus();
    press('{enter}');
    expect(screen.getByRole('menu')).toBeInTheDocument();
    press('{esc}');
    press('{arrowdown}');
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
});

describe('G sequences', () => {
  const rail = () => within(screen.getByRole('navigation', { name: 'Main navigation' }));

  test('G then P, S and H go to Progress, Settings and Home', () => {
    render(<App />);
    press('gp');
    expect(rail().getByRole('button', { name: 'Progress' })).toHaveAttribute('aria-current', 'page');
    expect(focused()).toHaveAccessibleName('Overview');
    expect(focused()).toHaveClass('progress-tab', 'active');
    press('gs');
    expect(rail().getByRole('button', { name: 'Settings' })).toHaveAttribute('aria-current', 'page');
    expect(focused()).toHaveAccessibleName('Settings');
    press('gh');
    expect(rail().getByRole('button', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
    expect(focused()).toHaveAccessibleName("Today's session");
  });

  test('G then L starts today\'s session, as Learn does', async () => {
    render(<App />);
    press('gl');
    expect(rail().getByRole('button', { name: 'Learn' })).toHaveAttribute('aria-current', 'page');
    expect(await screen.findByRole('button', { name: /Check answer|Try the exercises/ }, { timeout: 3000 })).toBeInTheDocument();
  });

  test('a lone G, or G then a pause, does nothing', () => {
    jest.useFakeTimers();
    try {
      render(<App />);
      press('g');
      act(() => { jest.advanceTimersByTime(2000); });
      press('p');
      expect(rail().getByRole('button', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
    } finally {
      jest.useRealTimers();
    }
  });

  test('the ? overlay lists every way to move around', () => {
    render(<App />);
    press('?');
    const dialog = screen.getByRole('dialog', { name: 'Keyboard shortcuts' });
    for (const id of ['goHome', 'goLearn', 'goProgress', 'goSettings', 'switchCourse', 'startSession'] as const) {
      expect(within(dialog).getByText(SHORTCUTS[id].label)).toBeInTheDocument();
    }
  });
});

describe('Home', () => {
  test('focus starts on Today, and Enter starts the session', async () => {
    render(<App />);
    expect(focused()).toHaveAccessibleName("Today's session");
    press('{enter}');
    expect(await screen.findByRole('button', { name: /Check answer|Try the exercises/ }, { timeout: 3000 })).toBeInTheDocument();
  });

  test('Tab goes through Today in order: its settings link, Start, then Keep going', () => {
    render(<App />);
    userEvent.tab();
    expect(focused()).toHaveAccessibleName('Change the session settings');
    userEvent.tab();
    expect(focused()).toHaveAccessibleName(/Start today's session/);
    userEvent.tab();
    expect(focused()).toHaveAccessibleName(/Keep going without a limit/);
    userEvent.tab({ shift: true });
    userEvent.tab({ shift: true });
    press('{enter}');
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
  });
});

describe('Settings, keys only', () => {
  const openSettings = () => press('gs');

  test('Tab reaches every control in order', () => {
    render(<App />);
    openSettings();
    const order: string[] = [];
    for (let i = 0; i < 6; i++) {
      userEvent.tab();
      const el = focused();
      order.push(el instanceof HTMLInputElement ? `radio ${el.closest('fieldset')?.querySelector('legend')?.textContent}` : el.textContent?.trim() ?? '');
    }
    // Left column (the session, the shortcuts), then the right (the progress file, reset).
    expect(order).toEqual([
      'radio Questions per session',
      'radio Reviews take up to',
      expect.stringMatching(/^All shortcuts/),
      'Export',
      'Import',
      'Reset SQL for Data Engineering progress',
    ]);
  });

  test('the session size changes from the keyboard and is stored', () => {
    render(<App />);
    openSettings();
    userEvent.tab();
    expect(focused()).toHaveAttribute('value', '20');
    // The arrows move a browser's radio group; Space chooses the radio in focus.
    const thirty = screen.getByRole('radio', { name: '30' });
    thirty.focus();
    press(' ');
    expect(thirty).toBeChecked();
    expect(localStorage.getItem(TODAY_SIZE_KEY)).toBe('30');
    press('gh');
    expect(screen.getByText(/30 per session/)).toBeInTheDocument();
  });

  test('Export, Import and Reset work from Enter', () => {
    const download = jest.spyOn(progressStorage, 'downloadTextFile').mockImplementation(() => {});
    const confirm = jest.spyOn(window, 'confirm').mockReturnValue(false);
    render(<App />);
    openSettings();
    const input = screen.getByTestId('import-progress-input') as HTMLInputElement;
    const pick = jest.spyOn(input, 'click').mockImplementation(() => {});

    screen.getByRole('button', { name: 'Export' }).focus();
    press('{enter}');
    expect(download).toHaveBeenCalledTimes(1);

    userEvent.tab();
    expect(focused()).toHaveAccessibleName('Import');
    press('{enter}');
    expect(pick).toHaveBeenCalledTimes(1);

    userEvent.tab();
    press('{enter}');
    expect(confirm).toHaveBeenCalledWith(expect.stringMatching(/reset all progress for SQL for Data Engineering/));
  });
});
