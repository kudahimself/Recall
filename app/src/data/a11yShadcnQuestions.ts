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
];
