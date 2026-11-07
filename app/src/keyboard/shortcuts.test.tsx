/**
 * The shortcut registry and its dispatcher: single keys never fire while
 * typing, a dialog takes the keys while it is open, the ? overlay lists the
 * registry, and a dialog holds focus and gives it back.
 *
 * Run: npm test -- --testPathPattern=keyboard/shortcuts --watchAll=false
 */
/* eslint-disable testing-library/no-node-access -- focus tests read document.activeElement */
import React, { useState } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { Dialog } from '../components/ui/Dialog';
import { QuestionShell } from '../components/ui/QuestionShell';
import { Difficulty, MultipleChoiceQuestion, QuestionType, Topic } from '../types';
import { ShortcutHelp } from './ShortcutHelp';
import { isTypingTarget, SHORTCUTS, useShortcut } from './shortcuts';

function Counter({ onHint }: { onHint: () => void }) {
  useShortcut('hint', () => onHint());
  return (
    <div>
      <input aria-label="text box" />
      <textarea aria-label="area" />
      <input type="radio" aria-label="radio" />
      <button type="button">a button</button>
    </div>
  );
}

describe('isTypingTarget', () => {
  it('counts text boxes, text areas and editable regions as typing, not radios or buttons', () => {
    render(<Counter onHint={() => {}} />);
    expect(isTypingTarget(screen.getByLabelText('text box'))).toBe(true);
    expect(isTypingTarget(screen.getByLabelText('area'))).toBe(true);
    expect(isTypingTarget(screen.getByLabelText('radio'))).toBe(false);
    expect(isTypingTarget(screen.getByRole('button'))).toBe(false);
    expect(isTypingTarget(window)).toBe(false);
  });
});

describe('useShortcut', () => {
  it('fires a single key on the page but never while typing', () => {
    const onHint = jest.fn();
    render(<Counter onHint={onHint} />);
    fireEvent.keyDown(screen.getByLabelText('text box'), { key: 'h' });
    fireEvent.keyDown(screen.getByLabelText('area'), { key: 'H' });
    expect(onHint).not.toHaveBeenCalled();
    fireEvent.keyDown(screen.getByLabelText('radio'), { key: 'h' });
    fireEvent.keyDown(window, { key: 'H' });
    expect(onHint).toHaveBeenCalledTimes(2);
    // Browser shortcuts stay the browser's.
    fireEvent.keyDown(window, { key: 'h', ctrlKey: true });
    expect(onHint).toHaveBeenCalledTimes(2);
  });

  it('ignores auto-repeated keys, so holding Enter cannot pick or check the next question', () => {
    const onPick = jest.fn();
    const onSubmit = jest.fn();
    function Keys() {
      useShortcut('pick', () => onPick());
      useShortcut('submit', () => onSubmit());
      return null;
    }
    render(<Keys />);
    fireEvent.keyDown(window, { key: 'Enter', repeat: true });
    fireEvent.keyDown(window, { key: '1', repeat: true });
    expect(onSubmit).not.toHaveBeenCalled();
    expect(onPick).not.toHaveBeenCalled();
    fireEvent.keyDown(window, { key: 'Enter' });
    fireEvent.keyDown(window, { key: '1' });
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onPick).toHaveBeenCalledTimes(1);
  });

  it('ignores a held Shift+Enter or Ctrl+Enter, even inside a text box', () => {
    const onTypingSubmit = jest.fn();
    function Keys() {
      useShortcut('submitTyping', () => onTypingSubmit());
      return <textarea aria-label="area" />;
    }
    render(<Keys />);
    const area = screen.getByLabelText('area');
    fireEvent.keyDown(area, { key: 'Enter', shiftKey: true, repeat: true });
    fireEvent.keyDown(area, { key: 'Enter', ctrlKey: true, repeat: true });
    fireEvent.keyDown(window, { key: 'Enter', shiftKey: true, repeat: true });
    expect(onTypingSubmit).not.toHaveBeenCalled();
    fireEvent.keyDown(area, { key: 'Enter', shiftKey: true });
    expect(onTypingSubmit).toHaveBeenCalledTimes(1);
  });

  it('runs a sequence (G then H) ahead of the single key of its last letter, and only then', () => {
    const onHome = jest.fn();
    const onHint = jest.fn();
    function Keys() {
      useShortcut('hint', () => onHint());
      useShortcut('goHome', () => onHome());
      return <input aria-label="text box" />;
    }
    render(<Keys />);
    fireEvent.keyDown(window, { key: 'g' });
    fireEvent.keyDown(window, { key: 'h' });
    expect(onHome).toHaveBeenCalledTimes(1);
    expect(onHint).not.toHaveBeenCalled();
    // H on its own is still the hint.
    fireEvent.keyDown(window, { key: 'h' });
    expect(onHint).toHaveBeenCalledTimes(1);
    // G then another key drops the sequence, and that key does its own thing.
    fireEvent.keyDown(window, { key: 'g' });
    fireEvent.keyDown(window, { key: 'x' });
    fireEvent.keyDown(window, { key: 'h' });
    expect(onHome).toHaveBeenCalledTimes(1);
    expect(onHint).toHaveBeenCalledTimes(2);
    // Typing G and H in a text box types them.
    fireEvent.keyDown(screen.getByLabelText('text box'), { key: 'g' });
    fireEvent.keyDown(screen.getByLabelText('text box'), { key: 'h' });
    expect(onHome).toHaveBeenCalledTimes(1);
  });

  it('gives the keys to an open dialog, and back when it closes', () => {
    const onHint = jest.fn();
    function WithDialog() {
      const [open, setOpen] = useState(true);
      return (
        <>
          <Counter onHint={onHint} />
          {open && <Dialog title="A dialog" onClose={() => setOpen(false)}><p>Inside</p></Dialog>}
        </>
      );
    }
    render(<WithDialog />);
    fireEvent.keyDown(window, { key: 'h' });
    expect(onHint).not.toHaveBeenCalled();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    fireEvent.keyDown(window, { key: 'h' });
    expect(onHint).toHaveBeenCalledTimes(1);
  });
});

describe('arrow keys', () => {
  it('match either key of a pair, never with a modifier or while typing, and show as arrow caps', () => {
    const onTab = jest.fn();
    function Arrows() {
      useShortcut('switchTab', e => onTab(e.key));
      return <input aria-label="text box" />;
    }
    render(<Arrows />);
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fireEvent.keyDown(window, { key: 'ArrowRight', shiftKey: true });
    fireEvent.keyDown(window, { key: 'ArrowRight', ctrlKey: true });
    fireEvent.keyDown(window, { key: 'ArrowUp' });
    fireEvent.keyDown(screen.getByLabelText('text box'), { key: 'ArrowLeft' });
    expect(onTab.mock.calls).toEqual([['ArrowLeft'], ['ArrowRight']]);
  });

  it('lists the Progress keys in the ? overlay with arrow caps', () => {
    render(<ShortcutHelp />);
    fireEvent.keyDown(window, { key: '?', shiftKey: true });
    const progress = within(screen.getByRole('dialog', { name: 'Keyboard shortcuts' })).getByRole('region', { name: 'Progress' });
    ['←', '→', '↑', '↓', 'D'].forEach(k => expect(within(progress).getByText(k)).toBeInTheDocument());
  });
});

describe('Dialog', () => {
  it('is labelled, takes focus, keeps Tab inside, closes on Esc and gives focus back', () => {
    function Opener() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>open</button>
          {open && (
            <Dialog title="Settings" onClose={() => setOpen(false)}>
              <button type="button">first</button>
              <button type="button">last</button>
            </Dialog>
          )}
        </>
      );
    }
    render(<Opener />);
    const opener = screen.getByRole('button', { name: 'open' });
    opener.focus();
    fireEvent.click(opener);
    const dialog = screen.getByRole('dialog', { name: 'Settings' });
    const buttons = within(dialog).getAllByRole('button');
    expect(document.activeElement).toBe(buttons[0]);
    buttons[buttons.length - 1].focus();
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'Tab' });
    expect(document.activeElement).toBe(buttons[0]);
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(buttons[buttons.length - 1]);
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(opener);
  });
});

describe('The ? overlay', () => {
  it('opens on ?, lists every shortcut from the registry, and closes on ? or Esc', () => {
    render(<ShortcutHelp />);
    fireEvent.keyDown(window, { key: '?', shiftKey: true });
    const dialog = screen.getByRole('dialog', { name: 'Keyboard shortcuts' });
    Object.values(SHORTCUTS).forEach(def => expect(within(dialog).getByText(def.label)).toBeInTheDocument());
    expect(within(dialog).getAllByText('Enter').length).toBeGreaterThan(0);
    fireEvent.keyDown(window, { key: '?', shiftKey: true });
    expect(screen.queryByRole('dialog')).toBeNull();
    fireEvent.keyDown(window, { key: '?', shiftKey: true });
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

describe('QuestionShell solution key', () => {
  const question: MultipleChoiceQuestion = {
    id: 'shell-solution-test',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PY_BASICS,
    question: 'Pick one.',
    explanation: 'Because.',
    options: [],
  };

  it('shows a solution with S only after a miss', () => {
    const { rerender } = render(
      <QuestionShell question={question} format="Test" graded={false} solution={<p>The worked solution</p>}>
        <p>answer area</p>
      </QuestionShell>,
    );
    fireEvent.keyDown(window, { key: 's' });
    expect(screen.queryByText('The worked solution')).toBeNull();
    rerender(
      <QuestionShell question={question} format="Test" graded feedback={{ verdict: 'wrong', title: 'Not quite' }} solution={<p>The worked solution</p>}>
        <p>answer area</p>
      </QuestionShell>,
    );
    expect(screen.getByRole('button', { name: 'Show solution' })).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 's' });
    expect(screen.getByText('The worked solution')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Show solution' })).toBeNull();
  });
});
