import { Question, QuestionType, Difficulty, Topic, CodeLanguage, Course } from '../types';

export const a11yShadcnQuestions: Question[] = [

  // =====================================================================
  // ACCESSIBILITY (8 questions)
  // =====================================================================

  // -- Accessible Modal/Dialog (Coding #1) --

  {
    id: 'a11y-modal-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.ACCESSIBILITY,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Create an accessible modal/dialog component. Use role="dialog", aria-modal="true", aria-labelledby pointing to the title, trap focus inside the modal, and close on Escape key. Include a useEffect for the keydown listener and focus trapping.',
    starterCode: `import { useEffect, useRef } from "react";\n\nfunction AccessibleModal({ isOpen, onClose, title, children }) {\n`,
    testCases: [
      {
        input: 'accessible modal',
        expectedOutput: 'role="dialog" aria-modal="true" aria-labelledby with focus trap and Escape handler',
        description: 'Should render an accessible dialog with focus trapping',
      },
    ],
    solution: `import { useEffect, useRef } from "react";

function AccessibleModal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Save the element that was focused before the modal opened
    previousFocusRef.current = document.activeElement;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab") {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstEl = focusableElements[0];
        const lastEl = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Focus the first focusable element inside the modal
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements?.length) {
      focusableElements[0].focus();
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      // Restore focus to the previously focused element
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title">{title}</h2>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}`,
    explanation:
      'Accessible modals require several features: role="dialog" tells assistive tech this is a dialog; aria-modal="true" indicates content behind it is inert; aria-labelledby connects the dialog to its title; focus trapping keeps keyboard users inside the modal (Tab wraps from last to first element); Escape closes the modal; and restoring focus to the previously focused element when the modal closes ensures users don\'t lose their place in the page.',
    hints: [
      'Use role="dialog" and aria-modal="true" on the modal container',
      'aria-labelledby should reference the id of the title element',
      'Trap focus by intercepting Tab and Shift+Tab on first/last focusable elements',
      'Listen for Escape key in a useEffect keydown handler',
    ],
    tieredHints: {
      apiSignature: 'function AccessibleModal({ isOpen, onClose, title, children })',
      skeleton: `function AccessibleModal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "____") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const focusable = modalRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (e.shiftKey && document.activeElement === focusable[0]) {
          e.preventDefault();
          focusable[focusable.length - 1].____();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div ref={modalRef} role="____" aria-modal="____" aria-labelledby="modal-title">
        <h2 id="modal-title">{title}</h2>
        {children}
      </div>
    </div>
  );
}`,
    },
    tags: ['accessibility', 'modal', 'dialog', 'focus-trap', 'aria', 'react'],
    concepts: ['a11y-aria-roles'],
  },

  // -- WCAG Conformance Levels (MC #1, questionIndex=1, correct at position b) --

  {
    id: 'a11y-wcag-levels-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.ACCESSIBILITY,
    course: Course.WEB_DEV,
    question:
      'What are the WCAG conformance levels, and which level do most legal requirements target?',
    options: [
      { id: 'a', text: 'Levels 1, 2, and 3 — most legal requirements mandate Level 3 for maximum coverage', isCorrect: false },
      { id: 'b', text: 'Levels A (minimum), AA (standard target), and AAA (highest) — most legal requirements mandate AA, which includes criteria like 4.5:1 color contrast ratio, keyboard navigability, and screen reader compatibility', isCorrect: true },
      { id: 'c', text: 'Levels A and B — Level A covers visual accessibility like contrast and alt text, and Level B covers auditory accessibility like captions and transcripts for media', isCorrect: false },
      { id: 'd', text: 'There is only one level — a site either passes or fails the full WCAG checklist', isCorrect: false },
    ],
    explanation:
      'WCAG defines three conformance levels: A is the bare minimum (e.g., all images have alt text), AA is the standard target that most laws like the ADA and EU Accessibility Act reference (requiring 4.5:1 contrast for normal text, keyboard navigation, and screen reader support), and AAA is the highest level with stricter criteria (7:1 contrast, sign language for video). AA is the practical target because AAA is often infeasible for all content.',
    hints: [
      'Think of them as bronze, silver, gold tiers',
      'Most accessibility lawsuits reference AA compliance',
    ],
    tags: ['WCAG', 'conformance', 'accessibility', 'standards'],
    concepts: ['a11y-aria-roles'],
  },

  // -- aria-label vs aria-labelledby vs aria-describedby (MC #2, questionIndex=2, correct at position c) --

  {
    id: 'a11y-aria-labels-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.ACCESSIBILITY,
    course: Course.WEB_DEV,
    question:
      'What is the difference between aria-label, aria-labelledby, and aria-describedby?',
    options: [
      { id: 'a', text: 'They are interchangeable — all three provide the same accessible name to screen readers', isCorrect: false },
      { id: 'b', text: 'aria-label adds a hover tooltip to the element, aria-labelledby adds a visible subtitle above it, and aria-describedby adds a footer note rendered at the bottom of the page', isCorrect: false },
      { id: 'c', text: 'aria-label provides an inline text label, aria-labelledby references another element\'s ID as the primary label (overriding visible text for screen readers), and aria-describedby references an element providing supplementary description', isCorrect: true },
      { id: 'd', text: 'aria-label is for inputs only, aria-labelledby is for buttons only, and aria-describedby is for images only', isCorrect: false },
    ],
    explanation:
      'These three attributes serve distinct roles: aria-label sets the accessible name directly as a string (useful when there is no visible label). aria-labelledby points to the ID of another element whose text becomes the accessible name — it overrides any visible text or aria-label for screen readers. aria-describedby points to an element providing extra context (like help text or error messages) that is announced after the label. The priority order for accessible names is: aria-labelledby > aria-label > visible text content.',
    hints: [
      'Think: label = name it, describedby = explain it',
      'aria-labelledby can reference multiple IDs separated by spaces',
    ],
    tags: ['aria', 'aria-label', 'aria-labelledby', 'aria-describedby', 'accessibility'],
    concepts: ['a11y-aria-roles'],
  },

  // -- Visually-Hidden-Until-Focused CSS (Cloze fade for skip-nav) --

  {
    id: 'a11y-visually-hidden-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.ACCESSIBILITY,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Fill in (1) the property that pushes the element off-screen so sighted users never see it, and (2) the pseudo-class that should reveal it again for keyboard users.',
    template: `.visually-hidden {
  position: absolute;
  ___: -9999px;
}

.visually-hidden:___ {
  position: fixed;
  left: 0;
  top: 0;
}`,
    blanks: ['left', 'focus'],
    solution: '.visually-hidden {\n  position: absolute;\n  left: -9999px;\n}\n\n.visually-hidden:focus {\n  position: fixed;\n  left: 0;\n  top: 0;\n}',
    explanation: 'Pushing an element far off-screen with a large negative `left` hides it visually without `display: none` (which would also remove it from the accessibility tree and tab order). The `:focus` rule resets `left`/`position` so the element snaps back into view the moment a keyboard user tabs to it — this is the trick behind skip-navigation links and other "visually hidden until focused" patterns.',
    hints: ['Same axis as the offset you would use to hide a sidebar off-canvas.', 'Pseudo-class that matches while an element has keyboard focus.'],
    tags: ['visually-hidden', 'keyboard', 'focus', 'accessibility', 'cloze'],
    concepts: ['a11y-keyboard-nav'],
  },

  // -- Skip Navigation Link (Coding #2) --

  {
    id: 'a11y-skip-nav-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.ACCESSIBILITY,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Create a skip navigation link — a hidden link at the very top of the page that becomes visible on focus and jumps the user to #main-content. Include the CSS for making the link visually hidden but focusable.',
    starterCode: `// SkipNav.jsx\nfunction SkipNav() {\n\n}\n\n// styles.css\n`,
    testCases: [
      {
        input: 'skip navigation',
        expectedOutput: 'a link with href="#main-content" that is visually hidden until focused',
        description: 'Should render a skip-to-content link with proper styling',
      },
    ],
    solution: `// SkipNav.jsx
function SkipNav() {
  return (
    <a href="#main-content" className="skip-nav">
      Skip to main content
    </a>
  );
}

// Usage in layout:
// <body>
//   <SkipNav />
//   <header>...</header>
//   <main id="main-content" tabIndex={-1}>...</main>
// </body>

// styles.css
// .skip-nav {
//   position: absolute;
//   left: -9999px;
//   top: auto;
//   width: 1px;
//   height: 1px;
//   overflow: hidden;
//   z-index: 9999;
//   padding: 1rem;
//   background: #000;
//   color: #fff;
//   text-decoration: none;
//   font-size: 1rem;
// }
//
// .skip-nav:focus {
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: auto;
//   height: auto;
//   overflow: visible;
//   clip: auto;
// }`,
    explanation:
      'Skip navigation links allow keyboard and screen reader users to bypass repetitive navigation menus and jump straight to the main content. The link is positioned off-screen so sighted users don\'t see it, but it appears when a keyboard user tabs to it (via :focus styles). The target element (main) needs tabIndex={-1} so it can receive programmatic focus. This is a WCAG 2.4.1 Level A requirement — one of the most basic accessibility features every site should have.',
    hints: [
      'Use position: absolute with left: -9999px to hide it visually',
      'On :focus, reset position to fixed at top: 0 to make it visible',
      'The target element needs id="main-content" and tabIndex={-1}',
    ],
    tieredHints: {
      apiSignature: 'function SkipNav()',
      skeleton: `// SkipNav.jsx
function SkipNav() {
  return (
    <a href="#____" className="____">
      ____
    </a>
  );
}

// styles.css
// .skip-nav { position: absolute; left: -9999px; }
// .skip-nav:____ { position: fixed; left: 0; top: 0; }`,
    },
    tags: ['skip-nav', 'keyboard', 'navigation', 'accessibility', 'WCAG'],
    concepts: ['a11y-keyboard-nav', 'a11y-aria-roles'],
  },

  // -- Focus Management in SPAs (MC #3, questionIndex=4, correct at position a) --

  {
    id: 'a11y-focus-spa-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.ACCESSIBILITY,
    course: Course.WEB_DEV,
    question:
      'Why is focus management particularly important in single-page applications (SPAs)?',
    options: [
      { id: 'a', text: 'When SPAs navigate between views, the DOM updates but focus stays on the old location — screen reader users get lost because they aren\'t informed of the new content, so you must programmatically move focus to the new page content', isCorrect: true },
      { id: 'b', text: 'SPAs load faster than traditional sites, so focus management slows them down to give users time to read', isCorrect: false },
      { id: 'c', text: 'Focus management is only needed for SPAs built with React — other frameworks handle it automatically', isCorrect: false },
      { id: 'd', text: 'SPAs disable the browser\'s built-in focus handling entirely, so you must write custom JavaScript to re-enable Tab key navigation and restore the default focus ring on every element', isCorrect: false },
    ],
    explanation:
      'In traditional multi-page websites, the browser fully reloads the page on navigation and focus resets to the top of the document. SPAs update the DOM in-place without a page reload, so focus stays wherever it was on the old view. Screen reader users may not realize the page content has changed at all. The fix is to programmatically move focus to the new content (e.g., the h1 of the new "page") and optionally announce the navigation with an aria-live region. Libraries like @reach/router handle this automatically.',
    hints: [
      'Think about what happens to focus when the DOM changes without a page reload',
      'Screen readers rely on focus position to know where to start reading',
    ],
    tags: ['focus', 'SPA', 'screen-reader', 'navigation', 'accessibility'],
    concepts: ['a11y-keyboard-nav', 'a11y-aria-roles'],
  },

  // -- prefers-reduced-motion (MC #4, questionIndex=5, correct at position b) --

  {
    id: 'a11y-reduced-motion-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.ACCESSIBILITY,
    course: Course.WEB_DEV,
    question:
      'What does the prefers-reduced-motion CSS media query do, and why is it important for accessibility?',
    options: [
      { id: 'a', text: 'It detects slow network connections or a low battery and automatically strips heavy animations and transitions to improve rendering performance on constrained devices', isCorrect: false },
      { id: 'b', text: 'It detects when a user has requested less animation in their OS settings (often due to vestibular disorders that cause motion sickness) — you use @media (prefers-reduced-motion: reduce) to disable or simplify animations', isCorrect: true },
      { id: 'c', text: 'It forces all CSS transitions to use ease-in-out timing for smoother motion', isCorrect: false },
      { id: 'd', text: 'It is a JavaScript API that measures animation frame rates and throttles them on slow devices', isCorrect: false },
    ],
    explanation:
      'prefers-reduced-motion is a CSS media query that reflects the user\'s operating system setting (e.g., "Reduce motion" on macOS/iOS or "Show animations" off on Windows). People with vestibular disorders like vertigo can experience nausea, dizziness, and disorientation from animations. Using @media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } } respects their preference. A better approach is to set reduced durations rather than fully removing them, so users still get visual feedback.',
    hints: [
      'It\'s an OS-level setting, not a browser-only feature',
      'Vestibular disorders affect balance and spatial orientation',
    ],
    tags: ['prefers-reduced-motion', 'animation', 'media-query', 'accessibility'],
    concepts: ['web-css-responsive', 'a11y-aria-roles'],
  },

  // -- Accessible Custom Dropdown (Coding #3) --

  {
    id: 'a11y-dropdown-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.ACCESSIBILITY,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Create an accessible custom dropdown/select. Use role="listbox" on the options container, role="option" on each item, aria-expanded on the trigger button, and implement keyboard navigation: ArrowUp/Down to move between options, Enter to select, Escape to close.',
    starterCode: `import { useState, useRef, useEffect } from "react";\n\nfunction AccessibleDropdown({ options, value, onChange, label }) {\n`,
    testCases: [
      {
        input: 'accessible dropdown',
        expectedOutput: 'role="listbox" role="option" aria-expanded with keyboard navigation',
        description: 'Should render a dropdown with proper ARIA roles and keyboard support',
      },
    ],
    solution: `import { useState, useRef, useEffect } from "react";

function AccessibleDropdown({ options, value, onChange, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (isOpen && listRef.current) {
      listRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setActiveIndex(0);
        } else {
          setActiveIndex((prev) =>
            prev < options.length - 1 ? prev + 1 : prev
          );
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (isOpen && activeIndex >= 0) {
          onChange(options[activeIndex]);
          setIsOpen(false);
          buttonRef.current?.focus();
        } else {
          setIsOpen(true);
          setActiveIndex(0);
        }
        break;
      case "Escape":
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
    }
  };

  return (
    <div onKeyDown={handleKeyDown}>
      <label id="dropdown-label">{label}</label>
      <button
        ref={buttonRef}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="dropdown-label"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value || "Select an option"}
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          role="listbox"
          aria-labelledby="dropdown-label"
          tabIndex={-1}
        >
          {options.map((option, index) => (
            <li
              key={option}
              role="option"
              aria-selected={option === value}
              className={index === activeIndex ? "active" : ""}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
                buttonRef.current?.focus();
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
    explanation:
      'Custom dropdowns are one of the hardest components to make accessible because native <select> gives you keyboard navigation and screen reader support for free. When building a custom one, you need: role="listbox" on the container so screen readers know it\'s a selection list; role="option" on each item; aria-expanded on the trigger to announce open/closed state; aria-selected to indicate the current selection; keyboard navigation (ArrowUp/Down, Enter, Escape); and proper focus management. This is why libraries like Radix UI and Headless UI are so valuable — they handle all of this for you.',
    hints: [
      'Use role="listbox" on the options container and role="option" on each item',
      'aria-expanded on the button tells screen readers if the list is open',
      'Track activeIndex for keyboard navigation with ArrowUp/ArrowDown',
      'Return focus to the trigger button when closing',
    ],
    tieredHints: {
      apiSignature: 'function AccessibleDropdown({ options, value, onChange, label })',
      skeleton: `function AccessibleDropdown({ options, value, onChange, label }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div onKeyDown={handleKeyDown}>
      <button aria-haspopup="____" aria-expanded={____} onClick={() => setIsOpen(!isOpen)}>
        {value || "Select an option"}
      </button>
      {isOpen && (
        <ul role="____" aria-labelledby="dropdown-label">
          {options.map((option) => (
            <li key={option} role="____" aria-selected={option === value}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
    },
    tags: ['dropdown', 'listbox', 'keyboard', 'aria', 'accessibility', 'react'],
    concepts: ['a11y-keyboard-nav', 'a11y-aria-roles'],
  },

  // -- Accessibility Audit Tools (MC #5, questionIndex=7, correct at position d) --

  {
    id: 'a11y-audit-tools-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.ACCESSIBILITY,
    course: Course.WEB_DEV,
    question:
      'What tools can you use to audit a website for accessibility issues, and what percentage of issues can automated tools typically detect?',
    options: [
      { id: 'a', text: 'ESLint with TypeScript strict mode catches all accessibility issues at compile time', isCorrect: false },
      { id: 'b', text: 'Chrome DevTools alone is sufficient — its built-in accessibility panel identifies all WCAG violations', isCorrect: false },
      { id: 'c', text: 'Only manual testing with real users with disabilities is valid — automated tools are unreliable and should never be trusted as part of any serious accessibility process', isCorrect: false },
      { id: 'd', text: 'axe-core/axe DevTools for automated scanning, Lighthouse for audits, NVDA/VoiceOver for screen reader testing, plus keyboard-only testing — but automated tools only catch about 30% of issues, so manual testing is essential', isCorrect: true },
    ],
    explanation:
      'A comprehensive accessibility testing strategy uses multiple tools: axe-core (or the axe DevTools browser extension) scans for programmatically detectable issues like missing alt text, low contrast, and missing ARIA attributes. Lighthouse includes an accessibility audit score. But automated tools can only catch roughly 30% of accessibility issues — things like whether alt text is actually meaningful, whether focus order makes logical sense, or whether a custom widget is truly usable with a keyboard require manual testing. NVDA (Windows) and VoiceOver (macOS) let you test the actual screen reader experience. eslint-plugin-jsx-a11y catches some issues in code, but is no substitute for runtime testing.',
    hints: [
      'Automated tools are a great start but not sufficient on their own',
      'Screen readers are the gold standard for real-world accessibility testing',
    ],
    tags: ['axe', 'lighthouse', 'NVDA', 'VoiceOver', 'testing', 'accessibility'],
    concepts: ['a11y-aria-roles'],
  },

  // =====================================================================
  // ACCESSIBILITY — INTERMEDIATE RAMP (8 questions)
  // Bridges beginner MCQs -> the advanced modal/dropdown coding questions.
  // Faded (Parsons + Cloze) scaffolds each primitive those two demand,
  // then two decision MCQs. React renders -> NO predict-output here.
  // =====================================================================

  // -- Escape-to-close keydown effect (INTERMEDIATE Parsons) --

  {
    id: 'a11y-escape-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.ACCESSIBILITY,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Assemble a useEffect that closes a modal when the user presses Escape and cleans up its listener. Order the lines top to bottom: effect signature, declare the handler, the Escape check, attach the listener, return the cleanup that detaches it, then the closing line with the dependency array.',
    correctOrder: [
      'useEffect(() => {',
      '  const onKey = (e) => {',
      '    if (e.key === "Escape") onClose();',
      '  };',
      '  document.addEventListener("keydown", onKey);',
      '  return () => document.removeEventListener("keydown", onKey);',
      '}, [onClose]);',
    ],
    distractorLines: [
      '  document.addEventListener("click", onKey);',
      '}, []);',
    ],
    solution: `useEffect(() => {
  const onKey = (e) => {
    if (e.key === "Escape") onClose();
  };
  document.addEventListener("keydown", onKey);
  return () => document.removeEventListener("keydown", onKey);
}, [onClose]);`,
    explanation:
      'Escape-to-close is a keyboard event, so you listen for "keydown", not "click". The cleanup function removing the same handler reference prevents listeners stacking up each render. onClose belongs in the dependency array — an empty [] would capture a stale onClose from the first render.',
    hints: [
      'The dismiss key arrives via a "keydown" listener, not "click"',
      'Return a cleanup that removes the exact handler you added',
      'onClose is used inside the effect, so it goes in the deps array',
    ],
    tags: ['accessibility', 'modal', 'keyboard', 'escape', 'useEffect', 'parsons'],
    concepts: ['a11y-keyboard-nav', 'a11y-aria-roles'],
  },

  // -- Dialog ARIA attributes (INTERMEDIATE Cloze) --

  {
    id: 'a11y-dialog-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.ACCESSIBILITY,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Fill in the ARIA attributes that make this dialog accessible: the role that identifies it as a dialog, the attribute that marks the rest of the page inert, and the attribute that names the dialog from its title element.',
    template: `<div
  role="___"
  aria-modal="___"
  aria-labelledby="___"
>
  <h2 id="dialog-title">{title}</h2>
</div>`,
    blanks: ['dialog', 'true', 'dialog-title'],
    solution: `<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
>
  <h2 id="dialog-title">{title}</h2>
</div>`,
    explanation:
      'role="dialog" tells assistive tech this container is a dialog. aria-modal="true" signals that content outside it is inert while it is open. aria-labelledby references the id of the title element ("dialog-title"), so screen readers announce the dialog using its heading text.',
    hints: [
      'The role and the attribute value both describe a "dialog"',
      'aria-modal takes a boolean string',
      'aria-labelledby points at the id of the <h2>',
    ],
    tags: ['accessibility', 'dialog', 'aria', 'aria-modal', 'cloze'],
    concepts: ['a11y-aria-roles'],
  },

  // -- Focus trap Tab wrap (INTERMEDIATE Cloze) --

  {
    id: 'a11y-focustrap-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.ACCESSIBILITY,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Complete the focus-trap branch: when the user presses Shift+Tab while the first element is focused, stop the browser default and wrap focus to the last element.',
    template: `if (e.key === "Tab" && e.shiftKey && document.activeElement === firstEl) {
  e.___();
  ___.focus();
}`,
    blanks: ['preventDefault', 'lastEl'],
    solution: `if (e.key === "Tab" && e.shiftKey && document.activeElement === firstEl) {
  e.preventDefault();
  lastEl.focus();
}`,
    explanation:
      'A focus trap keeps keyboard users inside the modal. On Shift+Tab from the first focusable element, e.preventDefault() stops focus from leaving the dialog, and lastEl.focus() wraps it to the end. The forward case is the mirror: Tab on the last element wraps to firstEl.',
    hints: [
      'Stop the browser from moving focus out with e.preventDefault()',
      'Shift+Tab from the first element should wrap to the LAST element',
    ],
    tags: ['accessibility', 'focus-trap', 'keyboard', 'tab', 'cloze'],
    concepts: ['a11y-keyboard-nav', 'a11y-aria-roles'],
  },

  // -- Listbox markup (INTERMEDIATE Parsons) --

  {
    id: 'a11y-listbox-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.ACCESSIBILITY,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Assemble the accessible markup for a custom dropdown\'s option list. Order top to bottom: the listbox container, the map opening, the option element, the option label, the option close, the map close, the container close.',
    correctOrder: [
      '<ul role="listbox" aria-labelledby="dd-label">',
      '  {options.map((opt) => (',
      '    <li role="option" aria-selected={opt === value}>',
      '      {opt}',
      '    </li>',
      '  ))}',
      '</ul>',
    ],
    distractorLines: [
      '<ul role="menu" aria-labelledby="dd-label">',
      '    <li role="listitem" aria-selected={opt === value}>',
    ],
    solution: `<ul role="listbox" aria-labelledby="dd-label">
  {options.map((opt) => (
    <li role="option" aria-selected={opt === value}>
      {opt}
    </li>
  ))}
</ul>`,
    explanation:
      'A selection widget uses role="listbox" on the container and role="option" on each item — not role="menu" (which is for action commands) or role="listitem" (a plain list item with no selection semantics). aria-selected on each option tells the screen reader which value is currently chosen.',
    hints: [
      'A selectable list is a "listbox", not a "menu"',
      'Each choice is an "option", not a generic "listitem"',
      'aria-selected marks the currently chosen option',
    ],
    tags: ['accessibility', 'dropdown', 'listbox', 'option', 'aria', 'parsons'],
    concepts: ['a11y-aria-roles', 'a11y-keyboard-nav'],
  },

  // -- Trigger button aria-expanded / aria-haspopup (INTERMEDIATE Cloze) --

  {
    id: 'a11y-expanded-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.ACCESSIBILITY,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Fill in the ARIA on the dropdown trigger: the attribute value announcing what kind of popup opens, and the state bound to whether the list is currently open.',
    template: `<button
  aria-haspopup="___"
  aria-expanded={___}
  onClick={() => setIsOpen(!isOpen)}
>
  {value || "Select an option"}
</button>`,
    blanks: ['listbox', 'isOpen'],
    solution: `<button
  aria-haspopup="listbox"
  aria-expanded={isOpen}
  onClick={() => setIsOpen(!isOpen)}
>
  {value || "Select an option"}
</button>`,
    explanation:
      'aria-haspopup="listbox" tells assistive tech the button opens a listbox-style popup. aria-expanded={isOpen} must stay bound to the open state so screen readers announce "expanded" or "collapsed" correctly — a hard-coded value would lie about the current state.',
    hints: [
      'The popup the button opens is a listbox',
      'aria-expanded should reflect the live open/closed state variable',
    ],
    tags: ['accessibility', 'dropdown', 'aria-expanded', 'aria-haspopup', 'cloze'],
    concepts: ['a11y-aria-roles', 'a11y-keyboard-nav'],
  },

  // -- Arrow-key navigation handler (INTERMEDIATE Parsons) --

  {
    id: 'a11y-arrownav-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.ACCESSIBILITY,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Assemble the ArrowDown case of a dropdown keydown handler that moves the active option down without running past the end. Order top to bottom: the case label, prevent default, the functional state update opening, the clamped next index, the update closing, then break.',
    correctOrder: [
      'case "ArrowDown":',
      '  e.preventDefault();',
      '  setActiveIndex((prev) =>',
      '    prev < options.length - 1 ? prev + 1 : prev',
      '  );',
      '  break;',
    ],
    distractorLines: [
      '  setActiveIndex(activeIndex + 1);',
      '    prev + 1',
    ],
    solution: `case "ArrowDown":
  e.preventDefault();
  setActiveIndex((prev) =>
    prev < options.length - 1 ? prev + 1 : prev
  );
  break;`,
    explanation:
      'e.preventDefault() stops the arrow key from scrolling the page. The functional update (prev) => ... reads the latest index safely instead of a stale activeIndex closure. The clamp prev < length - 1 ? prev + 1 : prev keeps the highlight from running past the last option.',
    hints: [
      'preventDefault stops the page from scrolling on arrow keys',
      'Use the functional updater (prev) => ... , not stale activeIndex',
      'Clamp at the last index so it does not run off the end',
    ],
    tags: ['accessibility', 'dropdown', 'keyboard', 'arrow-keys', 'parsons'],
    concepts: ['a11y-keyboard-nav', 'a11y-aria-roles'],
  },

  // -- Roving tabindex vs aria-activedescendant (INTERMEDIATE MC, correct at b) --

  {
    id: 'a11y-roving-tabindex-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.ACCESSIBILITY,
    course: Course.WEB_DEV,
    question:
      'In a composite widget like a custom listbox or toolbar, what are the two standard patterns for managing keyboard focus among the items?',
    options: [
      { id: 'a', text: 'Give every item tabindex="0" so the user can Tab to each one individually, and rely on the browser\'s default focus ring to indicate which item is active inside the widget', isCorrect: false },
      { id: 'b', text: 'Roving tabindex (one item is tabindex="0", the rest tabindex="-1", and you move the 0 as the user arrows) or aria-activedescendant (focus stays on the container, pointing at the active item\'s id)', isCorrect: true },
      { id: 'c', text: 'Set tabindex="-1" on all items and capture every keystroke at the document level to decide what is focused', isCorrect: false },
      { id: 'd', text: 'Use autofocus on the first item and disable Tab entirely by calling preventDefault on every key', isCorrect: false },
    ],
    explanation:
      'Composite widgets should be ONE Tab stop, with arrow keys moving between items. Two patterns achieve this: roving tabindex keeps exactly one item at tabindex="0" (the others at "-1") and moves that 0 as the user arrows; aria-activedescendant keeps DOM focus on the container while the aria-activedescendant attribute points to the active item\'s id. Giving every item tabindex="0" (option a) forces the user to Tab through all of them, which is the anti-pattern these solve.',
    hints: [
      'A composite widget should be a single Tab stop, not one per item',
      'One pattern moves a single tabindex="0"; the other points to an id',
    ],
    tags: ['accessibility', 'roving-tabindex', 'aria-activedescendant', 'keyboard', 'focus'],
    concepts: ['a11y-keyboard-nav', 'a11y-aria-roles'],
  },

  // -- Prefer native elements first (INTERMEDIATE MC, correct at d) --

  {
    id: 'a11y-native-first-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.ACCESSIBILITY,
    course: Course.WEB_DEV,
    question:
      'You need a select dropdown and a modal dialog. Why do accessibility experts recommend reaching for native HTML (<select>, <dialog>) before building custom React versions?',
    options: [
      { id: 'a', text: 'Native elements are always faster to render because the browser draws them on the GPU, which reduces the JavaScript bundle and improves the Lighthouse performance score on every device', isCorrect: false },
      { id: 'b', text: 'Native elements automatically match every design system, so no CSS styling is ever required for them', isCorrect: false },
      { id: 'c', text: 'Custom React components cannot receive keyboard events at all without a third-party helper library installed', isCorrect: false },
      { id: 'd', text: 'They provide keyboard support, focus management, and screen reader semantics for free, while a custom widget must re-implement all of that correctly', isCorrect: true },
    ],
    explanation:
      'Native form controls and <dialog> ship with keyboard interaction, focus handling, and correct screen reader semantics built in. Rebuilding them in React means re-implementing arrow-key navigation, focus trapping, ARIA roles, and Escape handling by hand — and getting any of it wrong breaks the experience for assistive-tech users. Reach for native first; build custom only when the design genuinely cannot be met otherwise (and then lean on tested primitives like Radix).',
    hints: [
      'Think about everything the modal and dropdown coding questions had to implement by hand',
      'Native elements give you that behavior with zero extra code',
    ],
    tags: ['accessibility', 'native-html', 'dialog', 'select', 'progressive-enhancement'],
    concepts: ['a11y-aria-roles', 'a11y-keyboard-nav'],
  },

  // =====================================================================
  // ACCESSIBILITY — PERCEPTION-SIDE WCAG CRITERIA (7 questions)
  // Closes the doc's flagged gap: the existing set is interaction-heavy
  // (modal/dropdown/focus-trap). These cover the perception criteria:
  // contrast, alt-text, heading structure, live regions, tabindex
  // values, and accessible-name computation.
  // =====================================================================

  // -- Color contrast ratios (BEGINNER MCQ, correct at a) --

  {
    id: 'a11y-contrast-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.ACCESSIBILITY,
    course: Course.WEB_DEV,
    question:
      'What are the WCAG 2.2 Level AA contrast ratio requirements, and which text qualifies for the lower threshold?',
    options: [
      { id: 'a', text: 'Normal text needs a 4.5:1 contrast ratio against its background; large text (18pt+/24px+, or 14pt+/18.66px+ bold) and UI components/graphical objects need only 3:1', isCorrect: true },
      { id: 'b', text: 'Normal text needs 3:1 contrast and large text needs 4.5:1 - bigger text needs MORE contrast because it covers more of the visual field and draws the eye more strongly', isCorrect: false },
      { id: 'c', text: 'Every element on the page needs a flat 7:1 contrast ratio at Level AA - the 4.5:1 and 3:1 numbers belong to Level A, the lower conformance tier, not AA', isCorrect: false },
      { id: 'd', text: 'Contrast is computed from font-weight alone - any bold text automatically passes regardless of the actual foreground and background color values chosen', isCorrect: false },
    ],
    explanation:
      'WCAG 2.2 Level AA sets 4.5:1 as the minimum contrast ratio for normal-size text against its background. Large text - 18pt+ (24px), or 14pt+ (18.66px) if bold - gets a relaxed 3:1 minimum because bigger glyphs are legible at lower contrast. UI components (button borders, form field outlines) and meaningful graphical objects (icons conveying information) also use the 3:1 threshold. 7:1 is the Level AAA number for normal text, not AA.',
    hints: [
      'The two numbers to memorize are 4.5:1 and 3:1',
      'Large text gets the relaxed ratio, not the stricter one',
    ],
    tags: ['contrast', 'WCAG', 'AA', 'accessibility'],
    concepts: ['a11y-contrast'],
  },

  // -- alt-text decisions (BEGINNER MCQ, correct at a) --

  {
    id: 'a11y-alt-text-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.ACCESSIBILITY,
    course: Course.WEB_DEV,
    question:
      'A product page has a purely decorative divider icon between sections, and a product photo that is the only way to see the item for sale. How should each image\'s alt attribute be written?',
    options: [
      { id: 'a', text: 'The decorative divider gets alt="" (empty, but present) so screen readers skip it silently; the product photo gets a descriptive alt like alt="Red leather wallet, folded, showing the front snap closure"', isCorrect: true },
      { id: 'b', text: 'Both images should omit the alt attribute entirely, since screen readers already announce the filename of any img element that has no alt at all', isCorrect: false },
      { id: 'c', text: 'The decorative divider needs a descriptive alt so screen reader users know a visual separator exists there; the product photo can safely use alt="" since sighted users can already see it', isCorrect: false },
      { id: 'd', text: 'Both images should use alt="image" as a generic placeholder - screen readers only care whether the attribute is present, not what text it contains', isCorrect: false },
    ],
    explanation:
      'Decorative images that add no information get alt="" (present but empty) so assistive tech skips them entirely instead of announcing something meaningless like "divider.png". Informational images - especially ones that are the ONLY way to perceive content, like a product photo - need a description of what they actually show. Omitting alt entirely (option b) makes some screen readers fall back to reading the filename or URL, which is worse than an empty alt.',
    hints: [
      'Empty alt="" is a deliberate signal meaning "skip me", not a mistake',
      'Ask: does this image convey information nothing else on the page conveys?',
    ],
    tags: ['alt-text', 'images', 'decorative', 'accessibility'],
    concepts: ['a11y-alt-text'],
  },

  // -- Heading structure as navigation (BEGINNER MCQ, correct at c) --

  {
    id: 'a11y-heading-structure-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.ACCESSIBILITY,
    course: Course.WEB_DEV,
    question:
      'Why do screen reader users care about heading structure (h1-h6), and what is the rule for using heading levels correctly?',
    options: [
      { id: 'a', text: 'Screen readers only read h1 elements aloud - h2 through h6 exist purely for visual CSS styling and carry no meaning to assistive technology', isCorrect: false },
      { id: 'b', text: 'Heading levels control font size only - as long as the text looks like a heading visually, the specific level number chosen makes no difference to any user', isCorrect: false },
      { id: 'c', text: 'Screen readers let users jump between headings like a table of contents, so a page needs exactly one h1 and must not skip levels (e.g. h2 straight to h4) - the hierarchy should mirror the page\'s actual content outline', isCorrect: true },
      { id: 'd', text: 'Heading levels are assigned automatically by the browser based on an element\'s position in the DOM tree, so authors never need to choose h1 through h6 themselves', isCorrect: false },
    ],
    explanation:
      'Screen readers expose a headings list that lets users navigate a page the way a sighted user scans a table of contents - jumping straight to the section they want. This only works if the hierarchy is logical: one h1 per page (the main title), and no skipped levels (an h2 followed directly by an h4 suggests a missing h3, which breaks the outline a screen reader user is relying on to understand the page structure).',
    hints: [
      'Screen readers expose headings as a jump-to list, similar to a table of contents',
      'Skipping a level (h2 to h4) breaks the outline someone is navigating by',
    ],
    tags: ['headings', 'h1', 'navigation', 'accessibility'],
    concepts: ['a11y-heading-structure'],
  },

  // -- aria-live regions: polite vs assertive (INTERMEDIATE MCQ, correct at c) --

  {
    id: 'a11y-aria-live-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.ACCESSIBILITY,
    course: Course.WEB_DEV,
    question:
      'A search page needs to announce "12 results found" after the user types a filter, and a form needs to announce a validation error immediately. What is the difference between aria-live="polite" and aria-live="assertive"?',
    options: [
      { id: 'a', text: 'aria-live="polite" only works inside a <form> element, while aria-live="assertive" only works inside a <main> element - the value required depends on the surrounding container', isCorrect: false },
      { id: 'b', text: 'aria-live="polite" repeats the announcement three times to make sure it was heard, while aria-live="assertive" announces it only once and then removes the region from the DOM', isCorrect: false },
      { id: 'c', text: 'aria-live="polite" waits for the screen reader to finish its current announcement before speaking the update (good for result counts); aria-live="assertive" interrupts immediately (good for urgent errors) - role="alert" implies assertive automatically', isCorrect: true },
      { id: 'd', text: 'aria-live="polite" is for visible text updates and aria-live="assertive" is for updates hidden with display: none - the CSS visibility of the region determines which value to use', isCorrect: false },
    ],
    explanation:
      '"polite" queues the announcement politely, waiting for the current speech to finish - the right choice for non-urgent updates like a result count, since it won\'t talk over whatever the user was already doing. "assertive" interrupts immediately, appropriate for time-sensitive information like a form validation error the user needs to hear right now. role="alert" is a shortcut that implies aria-live="assertive" plus aria-atomic="true" without setting them explicitly.',
    hints: [
      'One waits its turn; the other interrupts',
      'role="alert" is shorthand for one of these two values',
    ],
    tags: ['aria-live', 'polite', 'assertive', 'accessibility'],
    concepts: ['a11y-live-regions'],
  },

  // -- aria-live region: result-count announcement (INTERMEDIATE Coding) --

  {
    id: 'a11y-aria-live-coding-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.ACCESSIBILITY,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'A SearchResults component receives a count prop (the number of filtered results). Render a visually-hidden live region that announces "{count} results found" politely whenever count changes, without interrupting whatever the screen reader is currently saying.',
    starterCode: `function SearchResults({ count, results }) {\n  return (\n    <div>\n      {/* announce the count here */}\n      <ul>{results.map((r) => <li key={r.id}>{r.name}</li>)}</ul>\n    </div>\n  );\n}`,
    testCases: [
      {
        input: 'count = 12',
        expectedOutput: 'a visually-hidden div with aria-live="polite" containing "12 results found"',
        description: 'Should render a polite live region announcing the result count',
      },
    ],
    solution: `function SearchResults({ count, results }) {
  return (
    <div>
      <div aria-live="polite" aria-atomic="true" className="visually-hidden">
        {count} results found
      </div>
      <ul>{results.map((r) => <li key={r.id}>{r.name}</li>)}</ul>
    </div>
  );
}`,
    explanation:
      'aria-live="polite" on the announcing div means updates are queued and spoken once the screen reader finishes its current sentence - correct for a non-urgent count update. aria-atomic="true" tells the screen reader to re-read the whole region\'s text on any change, not just the part that changed (without it, some screen readers might only announce a changed word fragment). The visually-hidden class keeps the text out of the sighted layout while it stays in the accessibility tree - unlike display: none, which would remove it from both.',
    hints: [
      'aria-live="polite" is right for a non-urgent count, not "assertive"',
      'aria-atomic="true" re-reads the whole updated text, not just the changed part',
      'Use the visually-hidden pattern, not display: none, so it stays announceable',
    ],
    tieredHints: {
      apiSignature: 'function SearchResults({ count, results })',
      skeleton: `function SearchResults({ count, results }) {
  return (
    <div>
      <div aria-live="____" aria-atomic="____" className="____">
        {count} results found
      </div>
      {/* results list unchanged from starterCode */}
    </div>
  );
}`,
    },
    tags: ['aria-live', 'live-region', 'screen-reader', 'accessibility', 'react'],
    concepts: ['a11y-live-regions'],
  },

  // -- tabindex values: 0 vs -1 vs positive (INTERMEDIATE Coding) --

  {
    id: 'a11y-tabindex-coding-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.ACCESSIBILITY,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'A CardList renders custom, non-native "card" divs that need to be keyboard-focusable in normal document order, and a hidden CardDetails panel that should only receive focus programmatically (never via Tab). Write the tabindex values for each, and explain in a comment why a positive tabindex value should never be used.',
    starterCode: `function Card({ title }) {\n  // your code here\n}\n\nfunction CardDetails({ detailsRef, children }) {\n  // your code here\n}`,
    testCases: [
      {
        input: 'Card and CardDetails',
        expectedOutput: 'Card uses tabIndex={0}, CardDetails uses tabIndex={-1}, with a comment explaining positive tabindex is never used',
        description: 'Should assign the correct tabindex values for natural vs programmatic-only focus',
      },
    ],
    solution: `function Card({ title }) {
  // tabIndex={0} inserts this div into the natural tab order,
  // right where it sits in the DOM - the same position a native
  // focusable element would occupy.
  return <div tabIndex={0}>{title}</div>;
}

function CardDetails({ detailsRef, children }) {
  // tabIndex={-1} makes this div focusable ONLY via detailsRef.current.focus()
  // in JavaScript (e.g. after opening it) - it is skipped entirely by Tab.
  return <div ref={detailsRef} tabIndex={-1}>{children}</div>;
}

// A positive tabindex (tabIndex={1}, {2}, ...) is never used because it
// creates a SECOND tab order that runs before tabIndex={0}/native elements,
// regardless of where those positive-tabindex elements sit in the DOM.
// This produces a confusing, hard-to-maintain focus order that no longer
// matches the visual/document layout.`,
    explanation:
      'tabIndex={0} adds an element to the natural tab order at its DOM position - the standard way to make a custom widget keyboard-focusable. tabIndex={-1} removes an element from the Tab sequence entirely while still allowing element.focus() to target it programmatically (used for focus-trap targets, panels opened via JS, and skip-link destinations). A positive tabIndex value creates a separate, DOM-position-independent tab order that overrides the natural one - this is the universally cited anti-pattern, because it decouples keyboard order from visual/DOM order and becomes unmaintainable as the page changes.',
    hints: [
      'Natural tab order: tabIndex={0}',
      'Programmatic-focus-only, skipped by Tab: tabIndex={-1}',
      'Positive values (1, 2, ...) override natural order - this is why they are avoided',
    ],
    tieredHints: {
      apiSignature: 'function Card({ title })',
      skeleton: `function Card({ title }) {
  return <div tabIndex={____}>{title}</div>;
}

function CardDetails(props) {
  return <div ref={____} tabIndex={____}>{____}</div>;
}`,
    },
    tags: ['tabindex', 'keyboard', 'focus', 'accessibility', 'react'],
    concepts: ['a11y-tabindex'],
  },

  // -- Accessible name computation precedence (ADVANCED MCQ, correct at d) --

  {
    id: 'a11y-accessible-name-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.ACCESSIBILITY,
    course: Course.WEB_DEV,
    question:
      'A button has aria-labelledby pointing to a heading, an aria-label string, visible text content, and a title attribute - all with different wording. Which one does a screen reader announce as the button\'s accessible name, and why does the order matter?',
    options: [
      { id: 'a', text: 'The title attribute always wins, since it is the oldest and most universally supported way to label an element across every browser and assistive technology combination', isCorrect: false },
      { id: 'b', text: 'The browser picks whichever string is alphabetically first among the four candidates, since there is no defined precedence order in the accessible name computation spec', isCorrect: false },
      { id: 'c', text: 'All four are concatenated together into one long announcement, so a screen reader user hears every candidate string back to back in DOM order', isCorrect: false },
      { id: 'd', text: 'aria-labelledby wins first, then aria-label, then the visible text content, and title is the last resort - each step is used only when everything higher in the chain is absent, so authoring several at once with different wording just makes the lower ones dead code', isCorrect: true },
    ],
    explanation:
      'The accessible name computation algorithm has a strict precedence: aria-labelledby (references another element\'s text) overrides everything if present; if absent, aria-label (an explicit string) is used; if that is also absent, the element\'s own visible text content (or an associated <label>) is used; title is the last resort, used only as a fallback and also rendered as a mouse-hover tooltip. Authoring multiple candidates with conflicting text is a common bug - only the highest-precedence one is ever announced, so the others silently do nothing for screen reader users while still showing up in tooltips or visible text.',
    hints: [
      'aria-labelledby sits at the top of the precedence chain',
      'title is the fallback of last resort, not a competitor to the others',
    ],
    tags: ['accessible-name', 'aria-labelledby', 'aria-label', 'title', 'accessibility'],
    concepts: ['a11y-accessible-name'],
  },

  // =====================================================================
  // NEXT_SHADCN (5 questions)
  // =====================================================================

  // BEGINNER faded (Parsons + Cloze) — lower-load scaffold before cold coding

  {
    id: 'shadcn-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_SHADCN,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'Assemble the cn() utility used throughout shadcn/ui. It imports clsx and tailwind-merge, then merges class names. Arrange the lines in this order: clsx import, tailwind-merge import, function signature, return, closing brace.',
    correctOrder: [
      'import { clsx, type ClassValue } from "clsx";',
      'import { twMerge } from "tailwind-merge";',
      'export function cn(...inputs: ClassValue[]) {',
      '  return twMerge(clsx(inputs));',
      '}',
    ],
    distractorLines: [
      'import { twMerge } from "clsx";',
      '  return clsx(twMerge(inputs));',
    ],
    solution: `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`,
    explanation:
      'twMerge comes from tailwind-merge, not clsx. The nesting order matters: clsx runs first to resolve conditionals into one class string, then twMerge dedupes conflicting Tailwind utilities (e.g. "p-2 p-4" → "p-4"). Reversing them (clsx(twMerge(...))) would feed clsx already-merged output and lose the conflict resolution.',
    hints: [
      'twMerge is imported from "tailwind-merge"',
      'clsx resolves conditionals first; twMerge dedupes the result',
      'The outer call is twMerge wrapping clsx',
    ],
    tags: ['shadcn', 'cn', 'clsx', 'tailwind-merge', 'parsons'],
    concepts: ['shadcn-cn-utility', 'shadcn-radix-primitives'],
  },

  {
    id: 'shadcn-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_SHADCN,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'Complete the body of cn(): the inner call resolves conditional class names, the outer call dedupes conflicting Tailwind utilities.',
    template: `export function cn(...inputs: ClassValue[]) {
  return ___(___(inputs));
}`,
    blanks: ['twMerge', 'clsx'],
    solution: `export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`,
    explanation:
      'clsx (inner) turns the inputs — strings, conditionals, arrays — into a single space-separated class string. twMerge (outer) then resolves Tailwind conflicts so the last utility in a group wins. The order is essential: dedupe AFTER conditionals are resolved.',
    hints: [
      'The outer call resolves Tailwind class conflicts',
      'The inner call handles conditional class names',
    ],
    tags: ['shadcn', 'cn', 'cloze'],
    concepts: ['shadcn-cn-utility'],
  },

  {
    id: 'shadcn-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_SHADCN,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'Complete the code: import the type that clsx accepts for its inputs, and call the shadcn helper that merges a component\'s base classes with an incoming className prop.',
    template: `import { clsx, type ___ } from "clsx";
import { twMerge } from "tailwind-merge";

// In a component:
<div className={___("rounded-lg p-4", className)} />`,
    blanks: ['ClassValue', 'cn'],
    solution: `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// In a component:
<div className={cn("rounded-lg p-4", className)} />`,
    explanation:
      'ClassValue is the union type clsx accepts (string, number, array, object, etc.), so cn(...inputs: ClassValue[]) stays fully typed. Wrapping base styles and the consumer\'s className in cn() lets callers override defaults without class conflicts winning unpredictably.',
    hints: [
      'The clsx type covering any acceptable class input',
      'The shadcn helper that merges class names',
    ],
    tags: ['shadcn', 'cn', 'ClassValue', 'cloze'],
    concepts: ['shadcn-cn-utility', 'shadcn-radix-primitives'],
  },

  // -- What is shadcn/ui (MC #1, questionIndex=8, correct at position a) --

  {
    id: 'shadcn-what-is-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_SHADCN,
    course: Course.WEB_DEV,
    question:
      'What is shadcn/ui, and how does it differ from traditional component libraries like Material UI or Chakra UI?',
    options: [
      { id: 'a', text: 'shadcn/ui copies component source code directly into your project so you own and fully customize it — unlike Material UI or Chakra which are npm dependencies with limited customization. It\'s built on Radix UI primitives + Tailwind CSS.', isCorrect: true },
      { id: 'b', text: 'shadcn/ui is a CSS-only library with no JavaScript — it provides pre-styled class names you apply to plain HTML elements', isCorrect: false },
      { id: 'c', text: 'shadcn/ui is a paid premium component library with better performance than free alternatives like Chakra', isCorrect: false },
      { id: 'd', text: 'shadcn/ui is a Figma plugin that generates React components from design files', isCorrect: false },
    ],
    explanation:
      'The key insight of shadcn/ui is its distribution model: instead of installing a package you can\'t easily modify (like `npm install @chakra-ui/react`), you run `npx shadcn-ui add button` and it copies the full component source code into your project\'s components/ui/ directory. This means you own the code, can read it, modify it, and understand exactly what\'s happening. Under the hood, components use Radix UI (for accessibility and behavior) and Tailwind CSS (for styling). You get best-of-both-worlds: accessible components you can fully customize.',
    hints: [
      'Think about the difference between installing a package vs. copying source code',
      'Consider which approach gives you more control',
    ],
    tags: ['shadcn', 'radix', 'tailwind', 'component-library'],
    concepts: ['shadcn-radix-primitives', 'web-tailwind-utility'],
  },

  // -- cn() utility (Coding #1) --

  {
    id: 'shadcn-cn-utility-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_SHADCN,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'Create the cn() utility function used throughout shadcn/ui projects. It combines clsx (for conditional class names) with tailwind-merge (for resolving Tailwind class conflicts). Explain why tailwind-merge is necessary — what happens with conflicting classes like "p-2 p-4" without it?',
    starterCode: `// Import clsx (with the ClassValue type) and twMerge\n// Export cn(...inputs: ClassValue[]) returning twMerge(clsx(inputs))\n`,
    testCases: [
      {
        input: 'cn("p-2", "p-4")',
        expectedOutput: '"p-4" (tailwind-merge resolves the conflict)',
        description: 'Should merge conflicting Tailwind classes correctly',
      },
    ],
    solution: `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Why this exists:
// clsx("p-2", condition && "p-4") → "p-2 p-4" (BOTH classes applied!)
// CSS specificity means both padding rules exist — the result is unpredictable.
//
// twMerge("p-2 p-4") → "p-4" (intelligently resolves the conflict)
// tailwind-merge understands Tailwind's utility structure and removes
// the overridden class, keeping only the last one.
//
// Together: cn("p-2", condition && "p-4")
//   1. clsx resolves conditionals → "p-2 p-4"
//   2. twMerge deduplicates → "p-4"
//
// Usage in components:
// <div className={cn("rounded-lg p-4", className)} />
// Allows consumers to override default styles without conflicts.`,
    explanation:
      'The cn() function solves a real problem in Tailwind component libraries: when you merge className props, conflicting utilities like "p-2 p-4" both end up in the class list. Since Tailwind utilities have equal CSS specificity, which one wins depends on the order they appear in the generated CSS file — not the order in your className string. tailwind-merge understands Tailwind\'s class structure and intelligently removes the overridden class. clsx handles the conditional logic (falsy values, arrays, objects). Together they make component className merging reliable.',
    hints: [
      'clsx handles conditional classes: clsx("a", false && "b") → "a"',
      'twMerge handles Tailwind conflicts: twMerge("p-2 p-4") → "p-4"',
      'The function is just: twMerge(clsx(inputs))',
    ],
    tieredHints: {
      apiSignature: 'function cn(...inputs: ClassValue[])',
      skeleton: `// imports: clsx (with the ClassValue type) and twMerge from tailwind-merge
export function cn(...inputs: ____[]) {
  return ____(____(inputs));
}`,
    },
    tags: ['cn', 'clsx', 'tailwind-merge', 'utility', 'shadcn'],
    concepts: ['shadcn-cn-utility', 'shadcn-radix-primitives'],
  },

  // -- Radix UI Primitives (MC #2, questionIndex=10, correct at position c) --

  {
    id: 'shadcn-radix-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_SHADCN,
    course: Course.WEB_DEV,
    question:
      'What are Radix UI primitives, and why does shadcn/ui build on top of them?',
    options: [
      { id: 'a', text: 'Radix UI is a CSS framework similar to Tailwind — shadcn uses it instead of writing custom CSS', isCorrect: false },
      { id: 'b', text: 'Radix UI is a state management library that replaces React Context — shadcn uses it for data flow', isCorrect: false },
      { id: 'c', text: 'Radix UI provides unstyled, accessible component primitives that handle ARIA attributes, keyboard navigation, and focus management — shadcn adds Tailwind styling on top, giving you accessibility for free', isCorrect: true },
      { id: 'd', text: 'Radix UI is a server-side rendering framework — shadcn uses it to pre-render components on the server', isCorrect: false },
    ],
    explanation:
      'Radix UI provides the behavioral layer of components — the parts that are hardest to get right: proper ARIA roles and attributes, keyboard navigation (Arrow keys, Enter, Escape), focus management, and screen reader announcements. These primitives are completely unstyled (no CSS opinions), so shadcn layers Tailwind CSS on top for the visual design. This separation means you get fully accessible components (dialogs, dropdowns, tabs, tooltips) without having to implement the complex accessibility logic yourself. The alternative — building a custom dropdown with proper listbox roles, keyboard navigation, and focus trapping from scratch — takes hundreds of lines and is easy to get wrong.',
    hints: [
      'Think about what\'s hardest about building a custom dropdown or modal',
      'Radix handles behavior; Tailwind handles styling',
    ],
    tags: ['radix', 'primitives', 'accessibility', 'shadcn', 'headless'],
    concepts: ['shadcn-radix-primitives', 'a11y-aria-roles'],
  },

  // -- Dark Mode with Tailwind (Coding #2) --

  {
    id: 'shadcn-dark-mode-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_SHADCN,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question:
      'Configure Tailwind for dark mode using the "class" strategy. Show: (1) the Tailwind config setting, (2) CSS variables for light/dark theme colors in globals.css, and (3) a ThemeToggle component using next-themes that switches between light and dark mode.',
    starterCode: `/* tailwind.config.js */\n\n/* globals.css */\n\n/* ThemeToggle component */\n`,
    testCases: [
      {
        input: 'dark mode config',
        expectedOutput: 'darkMode: "class" with CSS variables and next-themes toggle',
        description: 'Should configure class-based dark mode with theme toggle',
      },
    ],
    solution: `/* tailwind.config.js */
/* module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))",
        muted: "hsl(var(--muted))",
      },
    },
  },
}; */

/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222 47% 11%;
    --primary: 222 47% 31%;
    --muted: 210 40% 96%;
  }

  .dark {
    --background: 222 47% 11%;
    --foreground: 210 40% 98%;
    --primary: 210 40% 80%;
    --muted: 217 33% 17%;
  }
}

/* ThemeToggle component (React/JSX): */
/* import { useTheme } from "next-themes";
 *
 * function ThemeToggle() {
 *   const { theme, setTheme } = useTheme();
 *
 *   return (
 *     <button
 *       onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
 *       className="rounded-md p-2 bg-muted text-foreground"
 *     >
 *       {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
 *     </button>
 *   );
 * } */`,
    explanation:
      'Tailwind\'s class-based dark mode works by adding a "dark" class to the <html> element. When darkMode: "class" is set, any utility prefixed with dark: only applies when that class is present (e.g., dark:bg-gray-900). Using CSS variables (custom properties) for colors means you define them once in :root for light mode and override in .dark for dark mode — then reference them in Tailwind config with hsl(var(--color)). The next-themes library handles persisting the preference to localStorage, syncing with system preference, and preventing the flash of wrong theme on page load by injecting a blocking script.',
    hints: [
      'Set darkMode: "class" in tailwind.config.js',
      'Define CSS variables in :root (light) and .dark (dark)',
      'next-themes provides useTheme() hook with theme and setTheme',
    ],
    tieredHints: {
      apiSignature: 'darkMode: "class"',
      skeleton: `/* tailwind.config.js */
/* module.exports = {
  darkMode: "____",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: { colors: { background: "hsl(var(--background))" } } },
}; */

/* globals.css */
@layer base {
  :root { --background: 0 0% 100%; }
  .____ { --background: 222 47% 11%; }
}

/* ThemeToggle.jsx */
/* const { theme, setTheme } = useTheme();
 * <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
 *   {theme === "____" ? "Light" : "Dark"}
 * </button> */`,
    },
    tags: ['dark-mode', 'tailwind', 'next-themes', 'css-variables', 'shadcn'],
    concepts: ['web-tailwind-utility', 'shadcn-radix-primitives'],
  },

  // -- Customizing shadcn components (MC #3, questionIndex=12, correct at position a) --

  {
    id: 'shadcn-customize-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_SHADCN,
    course: Course.WEB_DEV,
    question:
      'What is the recommended approach for customizing shadcn/ui components?',
    options: [
      { id: 'a', text: 'Edit the source code directly in components/ui/ — that\'s the whole point of shadcn\'s copy-paste model. Override CSS variables in globals.css for theme-wide color changes. Extend the design system rather than fighting it.', isCorrect: true },
      { id: 'b', text: 'Never modify the generated files — create wrapper components and use !important overrides in a separate CSS file', isCorrect: false },
      { id: 'c', text: 'Fork the shadcn GitHub repository and publish your own modified version to npm', isCorrect: false },
      { id: 'd', text: 'Use the shadcn CLI\'s --customize flag to pass configuration options that modify the component before it\'s generated', isCorrect: false },
    ],
    explanation:
      'The entire philosophy of shadcn/ui is that you own the code. When you run `npx shadcn-ui add button`, the Button component source code is copied into your project\'s components/ui/button.tsx. You\'re expected to open that file and modify it to match your design needs — change the variants, adjust the styles, add new props. For theme-wide changes (colors, border radius, fonts), modify the CSS variables in globals.css. This is fundamentally different from traditional libraries where you fight against the library\'s opinions with CSS overrides and wrapper components. The tradeoff is that you\'re responsible for maintaining the component code yourself.',
    hints: [
      'Think about what makes shadcn different from npm-installed libraries',
      'The components live in YOUR project, not in node_modules',
    ],
    tags: ['shadcn', 'customization', 'components', 'css-variables'],
    concepts: ['shadcn-radix-primitives'],
  },

  // =====================================================================
  // NEXT_SHADCN — CVA + asChild (7 questions)
  // Closes the doc's flagged gap: every shadcn component is built on
  // class-variance-authority, and asChild/Slot is the composition
  // pattern used throughout - neither had any coverage yet.
  // =====================================================================

  // -- cva() call signature (INTERMEDIATE Cloze, faded before the coding Q) --

  {
    id: 'shadcn-cva-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_SHADCN,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'Complete this cva() call: the first argument is the base classes every variant shares, and the second argument object holds the variant option groups plus the fallback variants used when none are passed.',
    template: `import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "___",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        outline: "border border-input bg-background",
      },
    },
    ___: {
      variant: "default",
    },
  }
);`,
    blanks: ['inline-flex items-center justify-center rounded-md font-medium', 'defaultVariants'],
    solution: `import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        outline: "border border-input bg-background",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);`,
    explanation:
      'cva() takes the classes shared by every variant as its first argument (base layout/shape classes that never change), and a config object as its second: variants groups each option axis (variant, size, ...) with its class strings, and defaultVariants supplies the fallback used when a caller does not pass that prop at all.',
    hints: [
      'The first argument is a plain string of always-applied classes',
      'The property naming the fallback options is defaultVariants',
    ],
    tags: ['cva', 'class-variance-authority', 'variants', 'cloze', 'shadcn'],
    concepts: ['shadcn-cva'],
  },

  // -- Build button variants with cva (INTERMEDIATE Coding) --

  {
    id: 'shadcn-cva-coding-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_SHADCN,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'Using cva from class-variance-authority, build buttonVariants with a variant axis ("default" | "destructive") and a size axis ("default" | "sm"), defaulting to variant "default" and size "default". Base classes: "inline-flex items-center justify-center rounded-md".',
    starterCode: `import { cva } from "class-variance-authority";\n\nexport const buttonVariants = cva(\n`,
    testCases: [
      {
        input: 'buttonVariants({ variant: "destructive", size: "sm" })',
        expectedOutput: 'a class string combining the base classes with the destructive and sm variant classes',
        description: 'Should return the correct combined class string for the given variant/size',
      },
    ],
    solution: `import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// buttonVariants({ variant: "destructive", size: "sm" })
//   -> "inline-flex items-center justify-center rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 h-9 px-3"`,
    explanation:
      'cva() generates a function that takes an options object matching the variants config and returns the base classes plus whichever variant classes were selected (or the defaultVariants classes for any option left unspecified). This is the pattern every shadcn/ui component (Button, Badge, Alert) is built on: one cva() call defines every visual permutation as a single typed function call instead of manual string concatenation or a lookup object.',
    hints: [
      'variants groups each axis (variant, size) with its named class strings',
      'defaultVariants supplies the classes used when a caller omits that prop',
      'The generated function returns the base classes plus the resolved variant classes',
    ],
    tieredHints: {
      apiSignature: 'const buttonVariants = cva(base, options)',
      skeleton: `import { cva } from "class-variance-authority";

export const buttonVariants = cva("inline-flex items-center justify-center rounded-md", {
  variants: {
    variant: { default: "____", destructive: "____" },
  },
  defaultVariants: { variant: "____" },
});`,
    },
    tags: ['cva', 'class-variance-authority', 'variants', 'shadcn'],
    concepts: ['shadcn-cva'],
  },

  // -- asChild + Radix Slot (INTERMEDIATE MCQ, correct at b) --

  {
    id: 'shadcn-aschild-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_SHADCN,
    course: Course.WEB_DEV,
    question:
      'A shadcn Button component accepts an asChild prop. What does asChild do, and what problem does it solve when you want a Next.js <Link> to look exactly like a Button?',
    options: [
      { id: 'a', text: 'asChild renders the Button\'s own <button> element as usual, then nests the Link inside it - producing a <button><a>...</a></button> structure so the Link still receives the Button\'s styling', isCorrect: false },
      { id: 'b', text: 'asChild uses Radix\'s Slot component to merge the Button\'s props (className, onClick, ARIA attributes) onto its single child instead of rendering its own DOM element - so <Button asChild><Link href="/about">About</Link></Button> renders one real <a>, styled like a button, with no wrapper element', isCorrect: true },
      { id: 'c', text: 'asChild is a CSS-only prop that copies the parent element\'s computed styles onto whichever child is passed, without touching props, event handlers, or ARIA attributes at all', isCorrect: false },
      { id: 'd', text: 'asChild tells React to skip hydration for that component entirely, rendering it as static server HTML with no client-side interactivity attached', isCorrect: false },
    ],
    explanation:
      'Slot (from @radix-ui/react-slot) is a component that, instead of rendering its own DOM node, clones its single child and merges the parent\'s props onto it - className gets combined, event handlers get chained, ARIA attributes pass through. Button\'s asChild prop swaps its rendered element from "button" to Slot when true, so <Button asChild><Link href="/about">About</Link></Button> produces exactly one <a> tag carrying the button\'s classes, with no extra wrapping <button> or <div> polluting the DOM - important both semantically (a link should be an <a>, not a button wrapping an <a>) and for CSS layout (no extra box in the tree).',
    hints: [
      'Nesting a real <button> around a real <a> would be invalid, non-semantic HTML',
      'Slot merges props onto its child rather than rendering a wrapper element',
    ],
    tags: ['asChild', 'radix-slot', 'composition', 'shadcn'],
    concepts: ['shadcn-aschild'],
  },

  // -- Render a Link styled as a Button via asChild (INTERMEDIATE Coding) --

  {
    id: 'shadcn-aschild-coding-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_SHADCN,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'Add asChild support to this Button component using Radix\'s Slot, then use it to render a Next.js Link that looks like a Button, without wrapping the Link in an extra <button> element.',
    starterCode: `import { Link } from "next/link";\nimport { cn } from "@/lib/utils";\nimport { buttonVariants } from "./button-variants";\n\nfunction Button({ asChild, className, variant, size, ...props }) {\n  // your code here\n}\n\n// Render a Link styled as a Button, with no wrapper element\n`,
    testCases: [
      {
        input: '<Button asChild><Link href="/about">About</Link></Button>',
        expectedOutput: 'renders a single <a> element with the Button\'s classes, no wrapping <button>',
        description: 'Should compose Button styling onto the Link with no extra DOM element',
      },
    ],
    solution: `import { Slot } from "@radix-ui/react-slot";
import { Link } from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button-variants";

function Button({ asChild, className, variant, size, ...props }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

// Render a Link styled as a Button, with no wrapper element:
// <Button asChild variant="outline">
//   <Link href="/about">About</Link>
// </Button>
// -> renders a single <a href="/about" class="...button classes..."> element`,
    explanation:
      'Comp switches from the literal string "button" to Slot when asChild is true. Slot does not render its own element - it clones the single child it receives (the Link) and merges the incoming className and props onto it. The result is one <a> tag carrying the button\'s Tailwind classes, exactly matching how the button would look, with the semantics of a real link and no wrapper element in the DOM.',
    hints: [
      'Comp is a ternary: asChild ? Slot : "button"',
      'Slot comes from @radix-ui/react-slot',
      'Slot merges props onto its child instead of rendering its own element',
    ],
    tieredHints: {
      apiSignature: 'function Button({ asChild, className, variant, size, ...props })',
      skeleton: `import { Slot } from "@radix-ui/react-slot";

function Button({ asChild, className, variant, size, ...props }) {
  const Comp = asChild ? ____ : "____";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...____} />;
}`,
    },
    tags: ['asChild', 'radix-slot', 'composition', 'shadcn', 'next-link'],
    concepts: ['shadcn-aschild'],
  },

  // -- Theming via CSS variables (INTERMEDIATE Coding) --

  {
    id: 'shadcn-theming-coding-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_SHADCN,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question:
      'Add a new "brand" color to the theme: define --brand as HSL channel values (no hsl() wrapper) in :root and .dark with different lightness for each mode, then map it into Tailwind config as a usable color under theme.extend.colors.',
    starterCode: `/* globals.css */\n@layer base {\n  :root {\n    --background: 0 0% 100%;\n  }\n  .dark {\n    --background: 222 47% 11%;\n  }\n}\n\n/* tailwind.config.js */\n`,
    testCases: [
      {
        input: 'bg-brand utility class',
        expectedOutput: '--brand defined as raw HSL channels in :root and .dark, mapped via hsl(var(--brand)) in tailwind.config.js',
        description: 'Should define and wire up a theme-aware brand color using CSS variables',
      },
    ],
    solution: `/* globals.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --brand: 262 83% 58%;
  }
  .dark {
    --background: 222 47% 11%;
    --brand: 262 83% 70%;
  }
}

/* tailwind.config.js */
/* module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        brand: "hsl(var(--brand))",
      },
    },
  },
}; */

// Usage: className="bg-brand text-white" now resolves to the light-mode
// --brand value normally, and the .dark override automatically once the
// "dark" class is present on <html>.`,
    explanation:
      'shadcn\'s theming convention stores each color as raw HSL channel values ("262 83% 58%", no hsl() wrapper) so Tailwind can wrap it with hsl(var(--brand)) and still apply opacity modifiers like bg-brand/50. Defining the same variable name in both :root and .dark with different lightness values means one Tailwind class (bg-brand) automatically resolves to the right shade for whichever mode is active - no dark: prefix needed on every usage, because the swap happens at the CSS variable level, not the class level.',
    hints: [
      'Store the value as raw HSL channels, not wrapped in hsl(...)',
      'Same variable name in :root and .dark, different lightness',
      'Tailwind config wraps it as hsl(var(--brand)) so opacity modifiers still work',
    ],
    tieredHints: {
      apiSignature: 'var(--brand)',
      skeleton: `// globals.css
// @layer base { :root { --brand: light-value } .dark { --brand: dark-value } }
:root {
  --brand: ____;
}
.dark {
  --brand: ____;
}
// tailwind.config.js colors.brand maps to hsl(var(____))`,
    },
    tags: ['theming', 'css-variables', 'dark-mode', 'tailwind', 'shadcn'],
    concepts: ['web-tailwind-utility'],
  },

  // -- VariantProps<typeof buttonVariants> typing (ADVANCED Coding) --

  {
    id: 'shadcn-variantprops-coding-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_SHADCN,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'buttonVariants is already defined elsewhere via cva() with a "variant" and a "size" axis, and VariantProps, ButtonHTMLAttributes, and buttonVariants are already imported. Type ButtonProps so it accepts every native <button> attribute PLUS whichever variant/size options buttonVariants defines - without manually re-declaring "variant" and "size" as separate props that could drift out of sync with the cva() config.',
    starterCode: `interface ButtonProps {\n  // your code here\n}`,
    testCases: [
      {
        input: '<Button variant="outline" size="sm" onClick={fn} />',
        expectedOutput: 'ButtonProps accepts variant, size, onClick, and every other native button attribute, all fully typed',
        description: 'Should type ButtonProps by extending both native attributes and VariantProps',
      },
    ],
    solution: `import { type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes } from "react";
import { buttonVariants } from "./button-variants";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}`,
    explanation:
      'VariantProps<typeof buttonVariants> extracts a props type with one property per variants axis (variant, size), typed as a union of that axis\'s option keys. Extending both ButtonHTMLAttributes<HTMLButtonElement> and VariantProps<typeof buttonVariants> gives ButtonProps every native button attribute (onClick, disabled, type, ...) plus variant/size typed directly from the cva() config - so the two can never drift apart the way manually re-declared variant?: "default" | "outline" props could if someone added a variant to cva() but forgot to update the interface.',
    hints: [
      'VariantProps<typeof buttonVariants> derives variant/size types from the cva config itself',
      'Extend BOTH ButtonHTMLAttributes<HTMLButtonElement> and VariantProps<typeof buttonVariants>',
      'This avoids hand-typing variant/size unions that could drift from the cva() source of truth',
    ],
    tieredHints: {
      apiSignature: 'interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}',
      skeleton: `import { type VariantProps } from "class-variance-authority";

interface ButtonProps
  extends ButtonHTMLAttributes<____>,
    ____<typeof ____> {}`,
    },
    tags: ['VariantProps', 'cva', 'typescript', 'shadcn'],
    concepts: ['shadcn-cva'],
  },

  // -- shadcn Form field pattern (ADVANCED MCQ, correct at d) --

  {
    id: 'shadcn-form-pattern-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_SHADCN,
    course: Course.WEB_DEV,
    question:
      'shadcn\'s <Form>, <FormField>, <FormItem>, <FormLabel>, and <FormMessage> components wrap a form built with react-hook-form. What is actually happening underneath FormField, and what does it give you for free?',
    options: [
      { id: 'a', text: 'FormField is a plain wrapper <div> with no logic of its own - all the validation and error handling still has to be written by hand inside every individual field, identically to a bare react-hook-form setup', isCorrect: false },
      { id: 'b', text: 'FormField replaces react-hook-form entirely with its own internal state management, so react-hook-form\'s useForm, register, and handleSubmit are never used once the shadcn Form components are adopted', isCorrect: false },
      { id: 'c', text: 'FormField is a server-only component that validates form data on the server before the page even renders, so no client-side validation logic runs in the browser at all', isCorrect: false },
      { id: 'd', text: 'FormField renders react-hook-form\'s Controller under the hood, and the surrounding Form* components wire up the generated ids so FormLabel, the field input, and FormMessage are automatically connected via aria-describedby and htmlFor - giving you an accessible, wired-up field without writing that boilerplate by hand', isCorrect: true },
    ],
    explanation:
      'Under shadcn\'s Form pattern, <FormField> renders react-hook-form\'s <Controller> to bridge a controlled component into RHF\'s registration system, while a React context (FormFieldContext/FormItemContext) generates and shares a unique id across FormLabel (htmlFor), the input (id, aria-describedby, aria-invalid), and FormMessage (the id aria-describedby points to). The payoff is that every field gets correct label association and error announcement automatically, instead of an author hand-wiring htmlFor/id/aria-describedby on every field in every form.',
    hints: [
      'react-hook-form is still doing the actual form state management underneath',
      'The wiring being automated is the label/input/error-message ARIA relationship',
    ],
    tags: ['shadcn', 'form', 'react-hook-form', 'Controller', 'accessibility'],
    concepts: ['shadcn-form-pattern', 'a11y-aria-roles'],
  },
];
