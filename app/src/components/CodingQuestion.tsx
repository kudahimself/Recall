import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { CodingQuestion as CQQuestion, CodeLanguage } from '../types';
import { validateAnswer, ValidationResult, ValidationVerdict } from '../utils/codeValidator';
import { StyledButton } from './StyledButton';
import { StyledBadge } from './StyledBadge';
import './CodingQuestion.css';

interface Props {
  question: CQQuestion;
  onAnswer: (isCorrect: boolean) => void;
  onNext?: () => void;
  showHints: boolean;
}

export const CodingQuestion: React.FC<Props> = ({
  question,
  onAnswer,
  onNext,
  showHints,
}) => {
  const [code, setCode] = useState(question.starterCode);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [testResults, setTestResults] = useState<ValidationResult[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  // null = not yet self-graded (or no uncertain result). After the user
  // self-grades, this records their answer so the UI can flip the uncertain
  // test row to pass/fail.
  const [selfGrade, setSelfGrade] = useState<boolean | null>(null);
  // Monaco's font is driven here in JS, deliberately OUTSIDE the CSS --fs-*
  // token scale (Monaco doesn't inherit CSS font-size). It mirrors the same
  // (max-height: 860px) laptop breakpoint the CSS root knob uses, but stays
  // pinned at 13/14px rather than scaling with the root — the editor is the
  // interactive surface and stays readable while surrounding CSS shrinks.
  const [editorFontSize, setEditorFontSize] = useState(
    () => (typeof window !== 'undefined' && window.innerHeight <= 860 ? 13 : 14),
  );
  // Responsive editor height based on viewport
  const [editorHeight, setEditorHeight] = useState(() => {
    if (typeof window === 'undefined') return '450px';
    const vh = window.innerHeight;
    if (vh <= 768) return '300px';      // Small screens/mobile
    if (vh <= 900) return '350px';      // Laptop
    if (vh <= 1080) return '450px';     // Standard desktop
    return '500px';                      // Large monitor
  });
  const startTime = useRef(Date.now());
  const editorRef = useRef<any>(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-height: 860px)');
    const handler = (e: MediaQueryListEvent) => setEditorFontSize(e.matches ? 13 : 14);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Update editor height on viewport resize
  useEffect(() => {
    const updateEditorHeight = () => {
      const vh = window.innerHeight;
      if (vh <= 768) setEditorHeight('300px');
      else if (vh <= 900) setEditorHeight('350px');
      else if (vh <= 1080) setEditorHeight('450px');
      else setEditorHeight('500px');
    };

    window.addEventListener('resize', updateEditorHeight);
    return () => window.removeEventListener('resize', updateEditorHeight);
  }, []);

  // Reset state when question changes
  useEffect(() => {
    // Dispose previous editor instance when question changes
    if (editorRef.current) {
      try {
        editorRef.current.dispose?.();
      } catch (e) {
        // Ignore disposal errors
      }
      editorRef.current = null;
    }

    setCode(question.starterCode);
    setIsSubmitted(false);
    setTestResults([]);
    setShowHint(false);
    setHintIndex(0);
    setShowSolution(false);
    setSelfGrade(null);
    startTime.current = Date.now();
  }, [question.id, question.starterCode]);

  // Handle editor cleanup on unmount
  useEffect(() => {
    return () => {
      if (editorRef.current) {
        try {
          editorRef.current.dispose?.();
        } catch (e) {
          // Ignore disposal errors
        }
        editorRef.current = null;
      }
    };
  }, []);

  // Handle editor mount
  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Define custom theme
    monaco.editor.defineTheme('recall-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6b6b75', fontStyle: 'italic' },
        { token: 'keyword', foreground: '0ea5e9', fontStyle: 'bold' },
        { token: 'string', foreground: '22c55e' },
        { token: 'number', foreground: 'f59e0b' },
        { token: 'function', foreground: '38bdf8' },
        { token: 'variable', foreground: 'fafafa' },
        { token: 'type', foreground: '0ea5e9' },
      ],
      colors: {
        'editor.background': '#12121a',
        'editor.foreground': '#fafafa',
        'editor.lineHighlightBackground': '#1a1a2420',
        'editor.selectionBackground': '#0ea5e920',
        'editorLineNumber.foreground': '#6b6b75',
        'editorLineNumber.activeForeground': '#fafafa',
        'editorCursor.foreground': '#0ea5e9',
        'editorWhitespace.foreground': '#2a2a30',
      },
    });
    monaco.editor.setTheme('recall-dark');

    // Add keyboard shortcut for submit (Cmd/Ctrl + Enter)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (!isSubmitted) {
        handleSubmit();
      }
    });

    // Add keyboard shortcut for reset (Cmd/Ctrl + R)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR, (e: any) => {
      e?.preventDefault();
      handleReset();
    });

    // Focus the editor after a short delay to ensure it's ready for input
    setTimeout(() => {
      editor.focus();
    }, 100);
  };

  const getLanguage = (): string => {
    const langMap: Record<string, string> = {
      [CodeLanguage.PYTHON]: 'python',
      [CodeLanguage.SQL]: 'sql',
      [CodeLanguage.JAVASCRIPT]: 'javascript',
      [CodeLanguage.TYPESCRIPT]: 'typescript',
      [CodeLanguage.JSX]: 'javascript',
      [CodeLanguage.HTML]: 'html',
      [CodeLanguage.CSS]: 'css',
    };
    return langMap[question.language] || 'plaintext';
  };

  const validateCode = (): ValidationResult[] => {
    const solution = question.solution || question.testCases[0]?.expectedOutput || '';

    const results: ValidationResult[] = question.testCases.map(testCase => {
      try {
        return validateAnswer(
          code,
          solution,
          question.language,
          testCase.description,
          question.starterCode,
        );
      } catch (error) {
        return {
          passed: false,
          verdict: 'fail' as ValidationVerdict,
          description: testCase.description,
          error: error instanceof Error ? error.message : 'Validation error',
        };
      }
    });

    setTestResults(results);
    return results;
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const results = validateCode();
    // If any verdict is uncertain (and none are definitively failed), wait for
    // the user to self-grade against the reference instead of recording an
    // answer the validator isn't confident about.
    const anyUncertain = results.some(r => r.verdict === 'uncertain');
    const anyFail = results.some(r => r.verdict === 'fail');
    if (anyUncertain && !anyFail) {
      // Hold onAnswer until handleSelfGrade fires.
      return;
    }
    onAnswer(results.every(r => r.verdict === 'pass'));
  };

  const handleSelfGrade = (matches: boolean) => {
    setSelfGrade(matches);
    // Resolve any uncertain verdicts to the user's self-assessment so the test
    // row UI flips to pass / fail and the post-submit buttons show.
    setTestResults(prev =>
      prev.map(r =>
        r.verdict === 'uncertain'
          ? {
              ...r,
              passed: matches,
              verdict: matches ? 'pass' : 'fail',
              error: matches ? undefined : 'Self-graded as not matching the reference.',
              output: matches ? 'Self-graded as matching the reference.' : undefined,
            }
          : r,
      ),
    );
    onAnswer(matches);
  };

  const handleReset = () => {
    setCode(question.starterCode);
    setIsSubmitted(false);
    setTestResults([]);
    setShowSolution(false);
    setShowHint(false);
    setHintIndex(0);
    setSelfGrade(null);
    startTime.current = Date.now();
  };

  const handleNextHint = () => {
    if (question.hints && hintIndex < question.hints.length - 1) {
      setHintIndex(hintIndex + 1);
    }
  };

  return (
    <div className="coding-question">
      <h3 className="question-text">{question.question}</h3>

      <div className="badges">
        <StyledBadge variant="difficulty">
          {question.difficulty}
        </StyledBadge>
        <StyledBadge variant="topic">
          {question.topic.replace(/_/g, ' ')}
        </StyledBadge>
        <StyledBadge variant="language">
          {question.language}
        </StyledBadge>
      </div>

      <div className="answer-editor-wrapper">
        <Editor
          key={question.id}
          height={editorHeight}
          language={getLanguage()}
          value={code}
          onChange={value => setCode(value || '')}
          onMount={handleEditorDidMount}
          theme="recall-dark"
          options={{
            // Visual features
            minimap: { enabled: true, scale: 2, showSlider: 'mouseover' },
            fontSize: editorFontSize,
            lineHeight: 24,
            fontFamily: 'IBM Plex Mono, SF Mono, Consolas, monospace',
            fontLigatures: true,
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,

            // Bracket features
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: true,
              indentation: true,
            },

            // Code intelligence
            quickSuggestions: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            tabCompletion: 'on',
            wordBasedSuggestions: 'matchingDocuments',
            suggest: {
              preview: true,
              showMethods: true,
              showFunctions: true,
              showVariables: true,
              showKeywords: true,
            },

            // Code quality
            formatOnPaste: true,
            formatOnType: true,
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',

            // Behavior
            scrollBeyondLastLine: false,
            automaticLayout: true,
            readOnly: isSubmitted && testResults.every(r => r.passed),
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
              alwaysConsumeMouseWheel: false,
            },
            mouseWheelZoom: false,
          }}
        />
      </div>

      <div className="button-group">
        {!isSubmitted ? (
          <>
            <StyledButton variant="primary" onClick={handleSubmit} shortcut="⌘↵">
              Run Code
            </StyledButton>
            <StyledButton variant="secondary" onClick={handleReset} shortcut="⌘R">
              Reset
            </StyledButton>
            {showHints && question.hints && question.hints.length > 0 && (
              <>
                {!showHint ? (
                  <StyledButton variant="warning" onClick={() => setShowHint(true)}>
                    Show Hint
                  </StyledButton>
                ) : (
                  hintIndex < question.hints.length - 1 && (
                    <StyledButton variant="warning" onClick={handleNextHint}>
                      Next Hint
                    </StyledButton>
                  )
                )}
              </>
            )}
          </>
        ) : (
          <>
            {onNext && (
              <StyledButton variant="primary" onClick={onNext}>
                Next Question →
              </StyledButton>
            )}
            {!showSolution && (
              <StyledButton variant="danger" onClick={() => setShowSolution(true)}>
                Show Solution
              </StyledButton>
            )}
          </>
        )}
      </div>

      {!isSubmitted && showHint && question.hints && question.hints.length > 0 && (
        <div className="hint">
          <strong>Hint {hintIndex + 1}:</strong> {question.hints[hintIndex]}
        </div>
      )}

      {isSubmitted && (
        <>
        <div className="results">
          <h4>Test Results:</h4>
          {testResults.map((result, idx) => {
            const cls =
              result.verdict === 'pass'
                ? 'test-pass'
                : result.verdict === 'uncertain'
                ? 'test-uncertain'
                : 'test-fail';
            const icon =
              result.verdict === 'pass' ? '✓' : result.verdict === 'uncertain' ? '?' : '✗';
            return (
              <div key={idx} className={cls}>
                <span className="test-icon">{icon}</span>
                <span>{result.description}</span>
                {result.error && <div className="test-error">{result.error}</div>}
                {result.output && <div className="test-output">{result.output}</div>}
              </div>
            );
          })}

          {/* Honest abstain: validator isn't confident, so we show the reference
              and ask the user to self-grade. Avoids the "validator rejected my
              correct code" trust-killer and the "validator accepted my wrong
              code" silent-failure. */}
          {selfGrade === null && testResults.some(r => r.verdict === 'uncertain') && (
            <div className="self-grade-prompt">
              <h4>Need your eyes on this one</h4>
              <p>
                Your code might be a valid alternative the validator can't recognise.
                Compare with the reference below — does your code do the same thing?
              </p>
              <div className="self-grade-reference">
                <div className="self-grade-reference-label">Reference solution</div>
                <pre className="self-grade-reference-code">{question.solution}</pre>
              </div>
              <div className="self-grade-actions">
                <StyledButton variant="primary" onClick={() => handleSelfGrade(true)}>
                  My code matches
                </StyledButton>
                <StyledButton variant="secondary" onClick={() => handleSelfGrade(false)}>
                  It doesn't match
                </StyledButton>
              </div>
            </div>
          )}
        </div>

        <div className="explanation">
          <h4>Explanation:</h4>
          <p>{question.explanation}</p>
        </div>

        {showSolution && (
          <div className="solution">
            <h4>Solution:</h4>
            <div className="solution-editor-wrapper">
              <Editor
                key={`${question.id}-solution`}
                height="100%"
                language={getLanguage()}
                value={question.solution}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: editorFontSize,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  readOnly: true,
                  scrollbar: {
                    vertical: 'auto',
                    horizontal: 'auto',
                    alwaysConsumeMouseWheel: false,
                  },
                  mouseWheelZoom: false,
                }}
              />
            </div>
          </div>
        )}
        </>
      )}

    </div>
  );
};
