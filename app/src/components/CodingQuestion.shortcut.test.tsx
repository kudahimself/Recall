/**
 * Cmd/Ctrl+Enter and Shift+Enter in the Monaco editor must grade the code
 * currently in the editor, the same as the Check button; Esc leaves the
 * editor unless a suggestion, find or snippet widget is open; Ctrl+R is not
 * bound (it reloads the page everywhere else).
 *
 * The commands are registered once in onMount. They used to call the mount-time
 * handleSubmit, whose `code` was the starter, so typed code was never graded.
 *
 * Monaco is mocked as a textarea that calls onMount with a fake editor whose
 * addCommand records the handlers, so the test can fire the keyboard commands.
 *
 * Run: npm test -- --testPathPattern=shortcut --watchAll=false
 */
import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { CodingQuestion } from './CodingQuestion';
import { validateByComputedStyle } from '../utils/computedStyleValidator';
import {
  CodeLanguage,
  Difficulty,
  QuestionType,
  Topic,
  CodingQuestion as CQ,
} from '../types';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      onchange: null,
      dispatchEvent: () => false,
    }),
  });
});

const MOCK_CTRL_CMD = 2048;
const MOCK_SHIFT = 1024;
const MOCK_ENTER = 3;
const MOCK_ESCAPE = 9;
const MOCK_KEY_R = 48;
const mockCommands = new Map<number, (accessor: unknown) => void>();
const mockContexts = new Map<number, string | undefined>();
let mockKeyDown: ((e: { browserEvent: { repeat: boolean } }) => void) | undefined;

jest.mock('../utils/computedStyleValidator', () => ({
  validateByComputedStyle: jest.fn(),
}));

// Real Monaco calls addCommand handlers with a ServicesAccessor, not a DOM
// event, so the fake fires them the same way.
const mockAccessor = { get: () => undefined };
function fireCommand(keybinding: number) {
  const handler = mockCommands.get(keybinding);
  expect(handler).toBeDefined();
  handler!(mockAccessor);
}

jest.mock('@monaco-editor/react', () => {
  const ReactActual = jest.requireActual('react');
  const MockEditor = ({
    value,
    onChange,
    onMount,
  }: {
    value: string;
    onChange: (v: string) => void;
    onMount: (editor: any, monaco: any) => void;
  }) => {
    ReactActual.useEffect(() => {
      const editor = {
        addCommand: (keybinding: number, handler: (accessor: unknown) => void, context?: string) => {
          mockCommands.set(keybinding, handler);
          mockContexts.set(keybinding, context);
        },
        onKeyDown: (listener: (e: { browserEvent: { repeat: boolean } }) => void) => {
          mockKeyDown = listener;
        },
        focus: () => {},
        dispose: () => {},
      };
      const monaco = {
        KeyMod: { CtrlCmd: MOCK_CTRL_CMD, Shift: MOCK_SHIFT },
        KeyCode: { Enter: MOCK_ENTER, Escape: MOCK_ESCAPE, KeyR: MOCK_KEY_R },
        editor: { defineTheme: () => {}, setTheme: () => {} },
      };
      onMount(editor, monaco);
      // Mount once, like Monaco: the command must not depend on re-registration.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
      <textarea
        data-testid="code-editor"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    );
  };
  return { __esModule: true, default: MockEditor };
});

const SOLUTION = 'total = sum(numbers)\nprint(total)';

const QUESTION = {
  id: 'py_shortcut_1',
  type: QuestionType.CODING,
  difficulty: Difficulty.BEGINNER,
  topic: Topic.PY_BASICS,
  question: 'Sum the numbers list and print the total.',
  explanation: 'sum() adds the iterable.',
  language: CodeLanguage.PYTHON,
  starterCode: '# your code here',
  testCases: [{ input: '', expectedOutput: '15', description: 'sums the list' }],
  solution: SOLUTION,
} as CQ;

async function pressCtrlEnter() {
  await act(async () => {
    fireCommand(MOCK_CTRL_CMD | MOCK_ENTER);
  });
}

beforeEach(() => {
  mockCommands.clear();
  mockContexts.clear();
  mockKeyDown = undefined;
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('CodingQuestion Cmd/Ctrl+Enter', () => {
  test('grades the typed code, not the starter', async () => {
    const onAnswer = jest.fn();
    render(<CodingQuestion question={QUESTION} onAnswer={onAnswer} showHints={true} />);

    fireEvent.change(screen.getByTestId('code-editor'), { target: { value: SOLUTION } });
    await pressCtrlEnter();

    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer).toHaveBeenCalledWith(true, expect.objectContaining({ attempts: 1 }));
    expect(screen.queryByText(/Write your solution before submitting/i)).toBeNull();
  });

  test('Shift+Enter in the editor grades the typed code too', async () => {
    const onAnswer = jest.fn();
    render(<CodingQuestion question={QUESTION} onAnswer={onAnswer} showHints={true} />);

    fireEvent.change(screen.getByTestId('code-editor'), { target: { value: SOLUTION } });
    await act(async () => {
      fireCommand(MOCK_SHIFT | MOCK_ENTER);
    });

    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer).toHaveBeenCalledWith(true, expect.objectContaining({ attempts: 1 }));
  });

  test('matches the Check button on the same typed code', async () => {
    const onAnswer = jest.fn();
    render(<CodingQuestion question={QUESTION} onAnswer={onAnswer} showHints={true} />);

    fireEvent.change(screen.getByTestId('code-editor'), { target: { value: SOLUTION } });
    fireEvent.click(screen.getByRole('button', { name: /^Check/ }));

    await waitFor(() =>
      expect(onAnswer).toHaveBeenCalledWith(true, expect.objectContaining({ attempts: 1 })),
    );
  });

  test('binds no Cmd/Ctrl+R (a page reload everywhere else); Reset is a button', async () => {
    render(<CodingQuestion question={QUESTION} onAnswer={jest.fn()} showHints={true} />);
    expect(mockCommands.has(MOCK_CTRL_CMD | MOCK_KEY_R)).toBe(false);

    fireEvent.change(screen.getByTestId('code-editor'), { target: { value: SOLUTION } });
    fireEvent.click(screen.getByRole('button', { name: /Reset/ }));
    expect((screen.getByTestId('code-editor') as HTMLTextAreaElement).value).toBe('# your code here');
  });

  test('Esc leaves the editor for the question, but only when no suggest, find or snippet widget is open', async () => {
    render(<CodingQuestion question={QUESTION} onAnswer={jest.fn()} showHints={true} />);
    const when = mockContexts.get(MOCK_ESCAPE) ?? '';
    for (const widget of ['suggestWidgetVisible', 'findWidgetVisible', 'inSnippetMode']) {
      expect(when).toContain(`!${widget}`);
    }

    screen.getByTestId('code-editor').focus();
    await act(async () => {
      fireCommand(MOCK_ESCAPE);
    });
    expect(screen.getByRole('article')).toHaveFocus();
  });
});

describe('CodingQuestion double check', () => {
  test('a second check while a preview grade is still running is ignored', async () => {
    let settle: (results: unknown[]) => void = () => {};
    (validateByComputedStyle as jest.Mock).mockImplementation(
      () => new Promise(resolve => { settle = resolve; }),
    );
    const onAnswer = jest.fn();
    const question = {
      ...QUESTION,
      previewChecks: [{ selector: 'p', property: 'color', description: 'colours the text' }],
    } as unknown as CQ;
    render(<CodingQuestion question={question} onAnswer={onAnswer} showHints={true} />);

    await pressCtrlEnter();
    await act(async () => {
      fireCommand(MOCK_SHIFT | MOCK_ENTER);
    });
    fireEvent.click(screen.getByRole('button', { name: /^Check/ }));
    await act(async () => {
      settle([{ passed: true, verdict: 'pass', description: 'colours the text' }]);
    });

    expect(validateByComputedStyle).toHaveBeenCalledTimes(1);
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer).toHaveBeenCalledWith(true, expect.objectContaining({ attempts: 1 }));
  });

  test('a held Shift+Enter checks once; the repeat does not check again', async () => {
    const onAnswer = jest.fn();
    const question = {
      ...QUESTION,
      tieredHints: { apiSignature: 'sum(iterable) -> int', skeleton: 'total = ____(____)' },
    } as CQ;
    render(<CodingQuestion question={question} onAnswer={onAnswer} showHints={true} />);
    const shiftEnter = (repeat: boolean) => act(async () => {
      mockKeyDown?.({ browserEvent: { repeat } });
      fireCommand(MOCK_SHIFT | MOCK_ENTER);
    });

    fireEvent.change(screen.getByTestId('code-editor'), { target: { value: 'nonsense unrelated tokens' } });
    await shiftEnter(false);
    expect(screen.getByRole('button', { name: /Try again/ })).toBeInTheDocument();

    fireEvent.change(screen.getByTestId('code-editor'), { target: { value: SOLUTION } });
    await shiftEnter(true);
    expect(onAnswer).not.toHaveBeenCalled();

    await shiftEnter(false);
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer).toHaveBeenCalledWith(true, expect.objectContaining({ attempts: 2 }));
  });
});
