/**
 * On a phone the screen scrolls instead of the question card, so after
 * checking an answer the shell scrolls <main> to the verdict and Next.
 * jsdom has no layout: the boxes are given by hand.
 *
 * Run: npm test -- --testPathPattern=QuestionShell.phone --watchAll=false
 */
/* eslint-disable testing-library/no-node-access -- the test places the banner and footer boxes by hand */
import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { questions } from '../../data/questions';
import { MultipleChoiceQuestion as MCQ } from '../../types';
import { MultipleChoiceQuestion } from '../MultipleChoiceQuestion';
import { QuestionNavContext } from './QuestionShell';

const q = questions.find(x => x.id === 'pe1-m2-8') as unknown as MCQ;

type Box = { top: number; bottom: number };

/** Render the 17 // 5 question inside <main>, with <main> 500px tall and the banner and footer at the given boxes. */
function setup(banner: Box, footer: Box) {
  render(
    <main>
      <QuestionNavContext.Provider value={{ label: 'Next question', onNext: jest.fn() }}>
        <MultipleChoiceQuestion question={q} onAnswer={jest.fn()} showHints />
      </QuestionNavContext.Provider>
    </main>,
  );
  const main = screen.getByRole('main');
  let scrollTop = 0;
  Object.defineProperty(main, 'scrollTop', { configurable: true, get: () => scrollTop, set: v => { scrollTop = v; } });
  jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function box(this: HTMLElement) {
    const b = this === main ? { top: 0, bottom: 500 }
      : this.hasAttribute('data-verdict') ? banner
      : this.tagName === 'FOOTER' ? footer
      : { top: 0, bottom: 0 };
    return { ...b, height: b.bottom - b.top, left: 0, right: 0, width: 0, x: 0, y: b.top, toJSON: () => b } as DOMRect;
  });
  const answer = () => {
    const group = screen.getByRole('radiogroup', { name: 'Answer options' });
    const radios = within(group).getAllByRole('radio') as HTMLInputElement[];
    const three = radios.findIndex(r => /3$/.test(r.labels?.[0]?.textContent ?? ''));
    fireEvent.keyDown(document.activeElement ?? document.body, { key: String(three + 1) });
    fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Enter' });
  };
  return { answer, scrolled: () => scrollTop };
}

afterEach(() => jest.restoreAllMocks());

/** Let the banner open (it opens on the next animation frame) and the scroll follow. */
const settle = () => act(() => new Promise(r => { setTimeout(r, 50); }));

describe('After checking on a phone, the screen scrolls to the verdict and Next', () => {
  it('scrolls just far enough to show the banner and the footer under it', async () => {
    const { answer, scrolled } = setup({ top: 560, bottom: 760 }, { top: 760, bottom: 820 });
    answer();
    await settle();
    expect(screen.getByRole('status')).toHaveTextContent('Correct');
    expect(scrolled()).toBe(320);
  });

  it('brings the verdict to the top when the banner and footer are taller than the screen', async () => {
    const { answer, scrolled } = setup({ top: 560, bottom: 1100 }, { top: 1100, bottom: 1160 });
    answer();
    await settle();
    expect(scrolled()).toBe(560);
  });

  it('leaves the screen where it is when both are already in view (a laptop)', async () => {
    const { answer, scrolled } = setup({ top: 300, bottom: 420 }, { top: 420, bottom: 470 });
    answer();
    await settle();
    expect(screen.getByRole('button', { name: /Next question/ })).toBeInTheDocument();
    expect(scrolled()).toBe(0);
  });
});
