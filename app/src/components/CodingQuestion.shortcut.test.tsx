/**
 * Cmd/Ctrl+Enter in the Monaco editor must grade the code currently in the
 * editor, the same as the Run Code button.
 *
 * The command is registered once in onMount. It used to call the mount-time
 * handleSubmit, whose `code` was the starter, so typed code was never graded.
 *
 * Monaco is mocked as a textarea that calls onMount with a fake editor whose
 * addCommand records the handlers, so the test can fire the keyboard command.
 *
 * Run: npm test -- --testPathPattern=shortcut --watchAll=false
 */
import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { CodingQuestion } from './CodingQuestion';
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
const MOCK_ENTER = 3;
const MOCK_KEY_R = 48;
const mockCommands = new Map<number, (accessor: unknown) => void>();

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
        addCommand: (keybinding: number, handler: (accessor: unknown) => void) => {
          mockCommands.set(keybinding, handler);
        },
        focus: () => {},
        dispose: () => {},
      };
      const monaco = {
        KeyMod: { CtrlCmd: MOCK_CTRL_CMD },
        KeyCode: { Enter: MOCK_ENTER, KeyR: MOCK_KEY_R },
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

  test('matches the Run Code button on the same typed code', async () => {
    const onAnswer = jest.fn();
    render(<CodingQuestion question={QUESTION} onAnswer={onAnswer} showHints={true} />);

    fireEvent.change(screen.getByTestId('code-editor'), { target: { value: SOLUTION } });
    fireEvent.click(screen.getByRole('button', { name: /Run Code/i }));

    await waitFor(() =>
      expect(onAnswer).toHaveBeenCalledWith(true, expect.objectContaining({ attempts: 1 })),
    );
  });

  test('Cmd/Ctrl+R resets to the starter after typing', async () => {
    render(<CodingQuestion question={QUESTION} onAnswer={jest.fn()} showHints={true} />);

    fireEvent.change(screen.getByTestId('code-editor'), { target: { value: SOLUTION } });
    await act(async () => {
      fireCommand(MOCK_CTRL_CMD | MOCK_KEY_R);
    });

    expect((screen.getByTestId('code-editor') as HTMLTextAreaElement).value).toBe('# your code here');
  });
});
