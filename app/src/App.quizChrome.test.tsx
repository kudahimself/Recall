/**
 * The quiz chrome against the real <App/>: one header row (Back, the section
 * and topic names from courseConfig, one session-status badge, Rule card and
 * Filters), the lesson's steps, the column beside the question, and the
 * filters dialog, opened with F and used with the keyboard only.
 */
/* eslint-disable testing-library/no-node-access -- these tests are about focus and the header row, so they read document.activeElement and the row the breadcrumb sits in */
import React from 'react';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { PROGRESS_KEY } from './utils/progressStorage';
import { questions } from './data/questions';
import { Course, Topic } from './types';
import { getCourseForTopic, getTopicPlace } from './utils/courseConfig';

// The no-column test needs a course whose topics have no rule card: Web Dev,
// with its lessons left out of this file (every course now opens on lessons).
jest.mock('./data/lessons', () => {
  const actual = jest.requireActual('./data/lessons');
  const config = jest.requireActual('./utils/courseConfig');
  return { ...actual, LESSONS: actual.LESSONS.filter((l: { topicKeys: string[] }) => config.getCourseForTopic(l.topicKeys[0]) !== 'web_dev') };
});

const START = /Start today's session/;
const CHECK = /Check answer/;

/** Keys typed wherever focus is now, as a keyboard user would. */
const press = (keys: string) => userEvent.keyboard(keys);

function progressWith(answered: string[]) {
  const t = 1_700_000_000_000;
  return JSON.stringify({
    questionsAttempted: answered,
    correctAnswers: answered,
    attemptHistory: answered.map((id, i) => ({ questionId: id, timestamp: t + i, isCorrect: true, attempts: 1, timeSpent: 9000 })),
    topicScores: {},
    difficultyScores: {},
    lastAttempt: Object.fromEntries(answered.map((id, i) => [id, t + i])),
    repetitionQueue: {},
    masteredTopics: [],
  });
}

/** Start today's SQL session past its first lesson, with a question on screen. */
async function startSql() {
  localStorage.setItem('recall-active-course', 'sql');
  localStorage.setItem(PROGRESS_KEY, progressWith(['tsql-select-mcq-1']));
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: START }));
  await screen.findByRole('button', { name: CHECK }, { timeout: 3000 });
}

const bar = () => screen.getByRole('navigation', { name: 'Where you are' }).parentElement as HTMLElement;
const filtersButton = () => within(bar()).getByRole('button', { name: /^Filters/ });
const filtersDialog = () => screen.queryByRole('dialog', { name: 'Filters' });

beforeEach(() => {
  localStorage.clear();
});

describe('the header', () => {
  test('every question topic has a section and a topic name in courseConfig, so the breadcrumb never shows a raw key', () => {
    const missing = Array.from(new Set(questions.map(q => q.topic))).filter(t => !getTopicPlace(t));
    expect(missing).toEqual([]);
  });

  test('shows Back, the section and topic by name, one status badge, Rule card and Filters', async () => {
    await startSql();
    const crumb = screen.getByRole('navigation', { name: 'Where you are' });
    const places = Array.from(new Set(questions.filter(q => getCourseForTopic(q.topic) === Course.SQL).map(q => q.topic)))
      .map(t => getTopicPlace(t)!);
    expect(places.some(p => crumb.textContent === `${p.section}${p.unit}`)).toBe(true);
    expect(crumb.textContent).not.toMatch(/_|^Tsql /);

    const row = bar();
    expect(within(row).getByRole('button', { name: 'Back' })).toBeInTheDocument();
    expect(within(row).getAllByTitle(/^.*Today: \d+ of \d+ answered today/)).toHaveLength(1);
    expect(within(row).getByRole('button', { name: /Rule card/ })).toBeInTheDocument();
    expect(filtersButton()).toHaveTextContent(/^Filters/);
    // The pills it replaces are gone.
    expect(within(row).queryByText(/Reviews left|Reviews done|\+1 again/)).toBeNull();
  });

  test('the lesson rule card has the same header, with the exercises to come as steps', async () => {
    localStorage.setItem('recall-active-course', 'sql');
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: START }));
    await screen.findByRole('button', { name: /Try the exercises/ }, { timeout: 3000 });

    const place = getTopicPlace(Topic.TSQL_SELECT)!;
    expect(screen.getByRole('navigation', { name: 'Where you are' })).toHaveTextContent(`${place.section}${place.unit}`);
    expect(within(bar()).getByText('Lesson')).toBeInTheDocument();
    const steps = screen.getByRole('list', { name: /^Lesson · / });
    expect(within(steps).getAllByRole('listitem')).toHaveLength(5);
    expect(within(steps).queryByText(/current/)).toBeNull();
  });
});

describe('F and the filters dialog, keys only', () => {
  test('F opens the filters with focus inside; F again closes them and focus comes back', async () => {
    await startSql();
    const before = document.activeElement;
    expect(before).toHaveAttribute('type', 'radio');

    press('f');
    const dialog = filtersDialog()!;
    expect(dialog).toBeInTheDocument();
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
    expect(document.activeElement).toHaveAccessibleName('Beginner');

    press('f');
    expect(filtersDialog()).toBeNull();
    expect(document.activeElement).toBe(before);
  });

  test('Esc closes the filters too, and the Filters button opens them', async () => {
    await startSql();
    fireEvent.click(filtersButton());
    expect(filtersDialog()).toBeInTheDocument();
    press('{Escape}');
    expect(filtersDialog()).toBeNull();
  });

  test('Tab moves through the toggles and stays inside the dialog', async () => {
    await startSql();
    press('f');
    const dialog = filtersDialog()!;
    for (let i = 0; i < 40; i++) {
      userEvent.tab();
      expect(dialog).toContainElement(document.activeElement as HTMLElement);
    }
    userEvent.tab({ shift: true });
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
  });

  test('Space on a toggle turns a difficulty off: the session follows and the Filters button says one is on', async () => {
    await startSql();
    press('f');
    userEvent.tab(); // Beginner -> Intermediate
    userEvent.tab(); // -> Advanced
    expect(document.activeElement).toHaveAccessibleName('Advanced');
    press(' ');
    expect(screen.getByRole('button', { name: 'Advanced' })).toHaveAttribute('aria-pressed', 'false');
    expect(JSON.parse(localStorage.getItem('recall-filters')!).difficulties).toEqual(['beginner', 'intermediate']);

    press('{Escape}');
    expect(filtersButton()).toHaveAccessibleName('Filters 1 on');
  });

  test('a section checkbox takes all its topics in or out, and shows a mix as mixed', async () => {
    await startSql();
    press('f');
    const topics = screen.getByRole('region', { name: 'Topics' });
    const [first] = within(topics).getAllByRole('checkbox') as HTMLInputElement[];
    first.focus();
    press(' ');
    expect(first).not.toBeChecked();

    // Open the section's topics with its arrow button and take one back in.
    userEvent.tab({ shift: true });
    expect(document.activeElement).toHaveAttribute('aria-expanded', 'false');
    press('{Enter}');
    expect(document.activeElement).toHaveAttribute('aria-expanded', 'true');
    const units = within(topics).getAllByRole('checkbox') as HTMLInputElement[];
    units[1].focus();
    press(' ');
    expect(units[1]).toBeChecked();
    expect(first.indeterminate).toBe(true);
  });

  test('Reset selects everything again, and the count on Filters goes', async () => {
    await startSql();
    press('f');
    fireEvent.click(within(screen.getByRole('region', { name: 'Question type' })).getByRole('button', { name: 'Deselect all' }));
    expect(await screen.findByText(/You're all caught up/)).toBeInTheDocument();
    expect(filtersButton()).toHaveAccessibleName('Filters 1 on');

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(await screen.findByRole('button', { name: CHECK }, { timeout: 3000 })).toBeInTheDocument();
    expect(filtersButton()).toHaveAccessibleName('Filters');
    press('{Escape}');
    // The question that replaced the old one takes focus when the dialog closes.
    await waitFor(() => expect(document.activeElement).toHaveAttribute('type', 'radio'));
  });

  test('F does nothing while typing in a text box', async () => {
    await startSql();
    const box = document.createElement('textarea');
    document.body.appendChild(box);
    box.focus();
    fireEvent.keyDown(box, { key: 'f' });
    expect(filtersDialog()).toBeNull();
    box.remove();
  });

  test('F does nothing while the rule card is open over the question', async () => {
    await startSql();
    press('r');
    expect(screen.getByRole('dialog', { name: /^Rule card/ })).toBeInTheDocument();
    press('f');
    expect(filtersDialog()).toBeNull();
    press('r');
    press('f');
    expect(filtersDialog()).toBeInTheDocument();
  });

  test('F works when the filters leave nothing to serve, so they can be changed back', async () => {
    localStorage.setItem('recall-active-course', 'sql');
    localStorage.setItem(PROGRESS_KEY, progressWith(['tsql-select-mcq-1']));
    localStorage.setItem('recall-filters', JSON.stringify({ topics: [Topic.TSQL_JOINS] }));
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: START }));
    expect(await screen.findByText(/Nothing left today for these filters/, {}, { timeout: 3000 })).toBeInTheDocument();
    press('f');
    expect(filtersDialog()).toBeInTheDocument();
  });
});

describe('the column beside the question', () => {
  test('a topic without a rule card, in a course with rule cards, keeps the column: the topic and how it stands', async () => {
    localStorage.setItem('recall-active-course', 'data_engineering');
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: START }));
    await screen.findByRole('button', { name: CHECK }, { timeout: 3000 });
    const column = screen.getByRole('complementary', { name: /^This topic: / });
    expect(within(column).getByText('questions seen')).toBeInTheDocument();
    expect(within(column).getByText(/not scored yet|right lately/)).toBeInTheDocument();
    // Hide takes the column away; the header's toggle brings it back.
    const hide = within(column).getByRole('button', { name: /Hide/ });
    hide.focus();
    press('{Enter}');
    expect(screen.queryByRole('complementary')).toBeNull();
    const toggle = within(bar()).getByRole('button', { name: 'Show the panel beside the question' });
    await waitFor(() => expect(document.activeElement).toBe(toggle));
    press('{Enter}');
    expect(screen.getByRole('complementary', { name: /^This topic: / })).toBeInTheDocument();
  });

  test('a course without rule cards has no column, so its questions keep the full width', async () => {
    localStorage.setItem('recall-active-course', 'web_dev');
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: START }));
    await screen.findByRole('button', { name: CHECK }, { timeout: 3000 });
    expect(screen.queryByRole('complementary')).toBeNull();
    expect(within(bar()).queryByRole('button', { name: /panel beside the question/ })).toBeNull();
  });
});
