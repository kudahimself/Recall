import { Question, QuestionType, Difficulty, Topic, CodeLanguage, Course } from '../types';

export const a11yShadcnQuestions: Question[] = [

  // =====================================================================
  // ACCESSIBILITY (9 questions)
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
      'Write AccessibleModal({ isOpen, onClose, title, children }), a modal dialog shown only while isOpen is true. While it is open, a screen reader announces it as a modal dialog named by its title, which it shows in an <h2>; focus moves to its first control; Tab and Shift+Tab cycle through its controls and never reach the page behind it; Escape calls onClose; and a Close button inside it calls onClose. When it closes, focus goes back to the element that had it before it opened. onClose keeps the same identity between renders (the parent wraps it in useCallback).',
    starterCode: `import { useEffect, useRef } from "react";\n\nfunction AccessibleModal({ isOpen, onClose, title, children }) {\n`,
    testCases: [
      {
        input: 'accessible modal',
        expectedOutput: 'a dialog named by its <h2>, with focus moved in, trapped and restored, and Escape calling onClose',
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
    <div className="modal-overlay">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <h2 id="modal-title">{title}</h2>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
# OR
import { useEffect, useRef } from "react";

function AccessibleModal({ isOpen, onClose, title, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog ref={dialogRef} aria-labelledby="modal-title" onClose={onClose}>
      <h2 id="modal-title">{title}</h2>
      {children}
      <button onClick={onClose}>Close</button>
    </dialog>
  );
}`,
    requires: [
      /role\s*=\s*["']dialog["']|<dialog\b/,
      /aria-modal\s*=\s*(["']true["']|\{\s*true\s*\})|\.showModal\s*\(/,
      /aria-labelledby\s*=/,
      /["']Escape["']|\.showModal\s*\(/,
      /["']Tab["']|\.showModal\s*\(/,
      /removeEventListener|\.showModal\s*\(/,
    ],
    explanation:
      'role="dialog" with aria-modal="true" tells a screen reader this is a modal dialog, and aria-labelledby names it from the <h2>. aria-modal only changes what is announced: it does not stop Tab from leaving, so the effect traps focus itself, wrapping from the last control to the first on Tab and from the first to the last on Shift+Tab, and handles Escape. On open it saves document.activeElement and focuses the first control; the cleanup removes the listener and puts focus back, so the user does not lose their place. The cleanup also runs whenever onClose changes, which is why onClose must be stable. A native <dialog> opened with showModal() does most of this for you: the rest of the page becomes inert, Escape closes it and fires its close event (which calls onClose here), focus moves in, and it returns to the opener when the dialog closes.',
    hints: [
      'role="dialog" and aria-modal="true" on the modal container',
      'aria-labelledby should reference the id of the title element',
      'Trap focus by intercepting Tab and Shift+Tab on the first and last focusable elements',
      'Save document.activeElement on open and focus it again in the cleanup',
    ],
    tieredHints: {
      apiSignature: 'function AccessibleModal({ isOpen, onClose, title, children })',
      skeleton: "function AccessibleModal({ isOpen, onClose, title, children }) {\n  const modalRef = useRef(null);\n  const previousFocusRef = useRef(null);\n\n  useEffect(() => {\n    if (!isOpen) return;\n    previousFocusRef.current = ____;\n    const handleKeyDown = (e) => {\n      if (e.key === \"____\") {\n        onClose();\n        return;\n      }\n      if (e.key === \"Tab\") {\n        const focusable = modalRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])');\n        if (e.shiftKey && document.activeElement === focusable[0]) {\n          e.preventDefault();\n          focusable[focusable.length - 1].____();\n        }\n        // and the mirror case for Tab on the last element\n      }\n    };\n    document.addEventListener(\"keydown\", handleKeyDown);\n    // focus the first control here\n    return () => {\n      document.removeEventListener(\"keydown\", handleKeyDown);\n      ____;\n    };\n  }, [isOpen, onClose]);\n\n  if (!isOpen) return null;\n  return (\n    <div className=\"modal-overlay\">\n      <div ref={modalRef} role=\"____\" aria-modal=\"____\" aria-labelledby=\"modal-title\">\n        <h2 id=\"modal-title\">{title}</h2>\n        {children}\n        <button onClick={onClose}>Close</button>\n      </div>\n    </div>\n  );\n}",
    },
    tags: ['accessibility', 'modal', 'dialog', 'focus-trap', 'aria', 'react'],
    concepts: ['a11y-aria-roles', 'a11y-keyboard-nav'],
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
      { id: 'a', text: 'Levels A, AA and AAA, and most laws require AAA, because a site has to meet every success criterion before it counts as accessible', isCorrect: false },
      { id: 'b', text: 'Levels A (the minimum), AA and AAA (the strictest), and most laws and contracts name AA, the level that adds rules such as 4.5:1 text contrast', isCorrect: true },
      { id: 'c', text: 'Levels A, AA and AAA, and most laws require only A, because AA and AAA are optional extras for sites that want a better audit score', isCorrect: false },
      { id: 'd', text: 'Levels 1, 2 and 3, each a separate checklist for one group of users (vision, hearing, motor), and the law requires all three of them', isCorrect: false },
    ],
    explanation: 'WCAG has three conformance levels, and each includes the ones below it. A is the floor (an image that carries information has a text alternative, everything works from the keyboard), AA adds criteria such as 4.5:1 contrast for normal text and a visible focus indicator, and AAA is the strictest (7:1 contrast, sign language for prerecorded video). Most laws and contracts name AA: the European Accessibility Act through the standard EN 301 549, and the US rules for government websites (Section 508 and the ADA Title II rule). AAA is not required as a whole, because some of its criteria cannot be met for every kind of content. The levels are tiers of strictness, not separate checklists for each disability.',
    hints: [
      'Think of them as bronze, silver and gold tiers',
      'Most laws and lawsuits cite the middle tier',
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
      { id: 'a', text: 'They are interchangeable: each sets the accessible name, and when more than one is present the screen reader reads all of them in a row', isCorrect: false },
      { id: 'b', text: 'aria-label shows a hover tooltip, aria-labelledby prints a visible caption above the element, and aria-describedby adds a note at the foot of the page', isCorrect: false },
      { id: 'c', text: 'aria-label gives the name as a string, aria-labelledby takes the name from another element\'s text by id (and wins over both), and aria-describedby adds a hint read after the name', isCorrect: true },
      { id: 'd', text: 'aria-label is for inputs, aria-labelledby is for buttons and aria-describedby is for images, and putting one on any other kind of element has no effect', isCorrect: false },
    ],
    explanation: 'aria-label sets the accessible name directly from a string, for a control with no visible text such as an icon button. aria-labelledby takes the name from the text of the element or elements whose ids it lists, and it wins over aria-label and over the element\'s own content. aria-describedby also points at other elements by id, but their text becomes the description, which the screen reader reads after the name and role, as for a hint or an error message. None of the three shows anything on screen, and all of them work on any element that can be named. The name is the first one present of aria-labelledby, aria-label, the content or <label>, then title.',
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
    question: 'Fill in (1) the offset property that pushes the element far past the left edge of the page so sighted users never see it, and (2) the pseudo-class that brings it back into view when a keyboard user tabs to it.',
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
    explanation: 'Pushing an element far off-screen with a large negative `left` hides it visually without `display: none`, which would also remove it from the accessibility tree and the Tab order. The `:focus` rule (or `:focus-visible`, which also matches when a keyboard user tabs to it) resets `left` and `position`, so the element snaps into view the moment it takes focus. This is the classic form for a skip link. For text that should stay hidden for good, such as a live region\'s message, the rule card\'s 1px box with `overflow: hidden` and `clip-path: inset(50%)` is the more common class today; both keep the text for the screen reader.',
    hints: ['Same axis as the offset you would use to hide a sidebar off-canvas.', 'Pseudo-class that matches while an element has keyboard focus.'],
    blankAlternates: [[], ['focus-visible']],
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
      'Add a skip link to this layout. Write SkipNav, a link reading "Skip to main content" that jumps to the main content, and render it as the first thing in Layout, before the header. Wrap children in a <main> with the id main-content that takes focus when the link is followed but is never a Tab stop itself. The page\'s CSS already has a skip-link class that hides the link until it has focus (Tailwind\'s sr-only focus:not-sr-only, which does the same, is accepted too).',
    starterCode: `function SkipNav() {

}

function Layout({ children }) {
  return (
    <>
      <header>
        <nav>{/* site links */}</nav>
      </header>
      {children}
    </>
  );
}
`,
    testCases: [
      {
        input: 'Layout with SkipNav',
        expectedOutput: 'the first Tab stop is a link to #main-content, hidden until focused, and <main id="main-content" tabIndex={-1}> wraps the children',
        description: 'Should render a skip link first that moves focus to the main content',
      },
    ],
    solution: `function SkipNav() {
  return (
    <a href="#main-content" className="skip-link">
      Skip to main content
    </a>
  );
}

function Layout({ children }) {
  return (
    <>
      <SkipNav />
      <header>
        <nav>{/* site links */}</nav>
      </header>
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
    </>
  );
}
# OR
function SkipNav() {
  return (
    <a href="#main-content" className="sr-only focus:not-sr-only">
      Skip to main content
    </a>
  );
}

function Layout({ children }) {
  return (
    <>
      <SkipNav />
      <header>
        <nav>{/* site links */}</nav>
      </header>
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
    </>
  );
}`,
    requires: [
      /href\s*=\s*["']#main-content["']/,
      /id\s*=\s*["']main-content["']/,
      /tabIndex\s*=\s*(\{\s*-1\s*\}|["']-1["'])/,
      /skip-link|sr-only/,
      /<SkipNav\s*\/>[\s\S]*<header/,
    ],
    explanation:
      'A skip link lets keyboard and screen reader users jump past the header and navigation, which they would otherwise Tab through on every page (WCAG 2.4.1, Bypass Blocks, Level A). It only helps if it is the first Tab stop, so SkipNav comes before the header. The class keeps it out of sight until it has focus; display: none would take it out of the Tab order too, so it could never be reached. Following the link scrolls to the element whose id matches the fragment, and tabIndex={-1} lets the browser move focus onto <main>, so the next Tab continues from the content and a screen reader starts reading there, while Tab itself never stops on <main>.',
    hints: [
      'The link\'s href is a fragment: # followed by the target\'s id',
      'tabIndex={-1} lets <main> take focus from the link without becoming a Tab stop',
      'Render <SkipNav /> before <header> so it is the first Tab stop',
    ],
    tieredHints: {
      apiSignature: 'function SkipNav()  /  function Layout({ children })',
      skeleton: `function SkipNav() {
  return <a ____>____</a>;
}

function Layout({ children }) {
  // ____ first, then the header, then <main ____> around children
}`,
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
      { id: 'a', text: 'The view changes without a page load, so focus stays on the clicked link (or falls to <body> if it was removed) and nothing is announced; you move focus to the new view\'s heading', isCorrect: true },
      { id: 'b', text: 'Every URL change resets focus to the top of the document, pushState included, so an SPA only has to update the page title for screen reader users', isCorrect: false },
      { id: 'c', text: 'Screen readers watch the DOM and read any newly inserted content aloud, so moving focus matters only for sighted keyboard users who follow the focus ring', isCorrect: false },
      { id: 'd', text: 'Client-side routers switch off the browser\'s Tab navigation while they swap views, so you must turn it back on by calling focus() on each link again', isCorrect: false },
    ],
    explanation: 'A full page load resets focus to the top of the new document, and the screen reader announces the new page. An SPA swaps the content in place: focus stays on the link that was clicked, or falls back to <body> when that link went away with the old view, and a screen reader user hears nothing about the change. The fix is to move focus to the new view yourself, usually to its <h1> given tabIndex={-1}, and optionally to announce the new page title in a polite live region; some routers announce the title for you, so check what yours does. Screen readers do not read new content on their own unless it is in a live region, and nothing switches Tab off.',
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
      { id: 'a', text: 'It detects a slow network connection or a low battery and automatically strips heavy animations and transitions to improve performance on constrained devices', isCorrect: false },
      { id: 'b', text: 'It matches when the user has turned on a "reduce motion" setting in their OS, often because motion makes them dizzy, so @media (prefers-reduced-motion: reduce) can tone animation down', isCorrect: true },
      { id: 'c', text: 'It makes the browser itself slow down every CSS animation and transition on the page once the user opts in, so the author never has to write any CSS for it', isCorrect: false },
      { id: 'd', text: 'It is a JavaScript-only setting that frameworks read to skip their animations; a CSS media query cannot see the user\'s motion preference at all', isCorrect: false },
    ],
    explanation: 'prefers-reduced-motion reflects an operating system setting: Reduce motion on macOS and iOS, Animation effects off on Windows, Remove animations on Android. Large movement, zooming and parallax can cause dizziness and nausea for people with vestibular disorders. The browser does nothing with the setting by itself: you write @media (prefers-reduced-motion: reduce) { ... } and remove or shorten the motion inside it, and JavaScript can read the same setting with window.matchMedia("(prefers-reduced-motion: reduce)"). A common reset sets animation-duration and transition-duration to 0.01ms !important, which stops the motion but still fires the animationend and transitionend events that scripts may wait for; swapping a slide for a fade is a gentler option that keeps the visual feedback.',
    hints: [
      'It\'s an OS-level setting, not a browser-only feature',
      'Vestibular disorders affect balance and spatial orientation',
    ],
    tags: ['prefers-reduced-motion', 'animation', 'media-query', 'accessibility'],
    concepts: ['web-css-responsive'],
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
      'Write AccessibleDropdown({ options, value, onChange, label }), a custom select made of a trigger button and a list of options (strings). A screen reader must hear the trigger as a button that opens a listbox, named by the label and the current value ("Select an option" when there is none), with whether it is expanded; the open list as a listbox named by the label, with the chosen option marked selected; and, as the user arrows through the list, the option they are on. Keys: ArrowDown opens the list on its first option and then moves down, ArrowUp moves up, both stop at the ends and never scroll the page; Enter or Space chooses the current option; Escape closes the list. Choosing or closing puts focus back on the trigger, and clicking an option chooses it.',
    starterCode: `import { useState, useRef, useEffect } from "react";\n\nfunction AccessibleDropdown({ options, value, onChange, label }) {\n`,
    testCases: [
      {
        input: 'accessible dropdown',
        expectedOutput: 'a button with aria-haspopup and aria-expanded opening a role="listbox" of role="option" items, with the active option announced and ArrowUp/ArrowDown/Enter/Escape handled',
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

  const choose = (option) => {
    onChange(option);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

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
          choose(options[activeIndex]);
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
        id="dropdown-button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="dropdown-label dropdown-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value || "Select an option"}
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          role="listbox"
          aria-labelledby="dropdown-label"
          aria-activedescendant={activeIndex >= 0 ? \`option-\${activeIndex}\` : undefined}
          tabIndex={-1}
        >
          {options.map((option, index) => (
            <li
              key={option}
              id={\`option-\${index}\`}
              role="option"
              aria-selected={option === value}
              className={index === activeIndex ? "active" : ""}
              onClick={() => choose(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
# OR
import { useState, useRef, useEffect } from "react";

function AccessibleDropdown({ options, value, onChange, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const optionRefs = useRef([]);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (isOpen && activeIndex >= 0) {
      optionRefs.current[activeIndex]?.focus();
    }
  }, [isOpen, activeIndex]);

  const choose = (option) => {
    onChange(option);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

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
          choose(options[activeIndex]);
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
        id="dropdown-button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="dropdown-label dropdown-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value || "Select an option"}
      </button>

      {isOpen && (
        <ul role="listbox" aria-labelledby="dropdown-label">
          {options.map((option, index) => (
            <li
              key={option}
              ref={(el) => {
                optionRefs.current[index] = el;
              }}
              role="option"
              tabIndex={-1}
              aria-selected={option === value}
              onClick={() => choose(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
    requires: [
      /role\s*=\s*["']listbox["']/,
      /role\s*=\s*["']option["']/,
      /aria-expanded\s*=/,
      /aria-selected\s*=/,
      /aria-activedescendant\s*=|\.current\[[^\]]+\]\??\.focus\(/,
      /["']ArrowDown["']/,
      /["']ArrowUp["']/,
      /["']Enter["']/,
      /["']Escape["']/,
      /preventDefault\(/,
    ],
    explanation:
      'A native <select> brings all of this for free, which is why a custom one is hard. The trigger is a <button> with aria-haspopup="listbox" and an aria-expanded bound to isOpen, so it is announced as "Fruit Banana, button, collapsed"; aria-labelledby lists two ids, the label and the button itself, so the name holds both the label and the current value. The list is role="listbox" with role="option" items, and aria-selected marks the chosen one. A CSS highlight alone is invisible to a screen reader, so the option the user is on must be exposed: either focus stays on the listbox and aria-activedescendant names the active option\'s id, or each option takes focus itself (tabIndex={-1} and .focus()). preventDefault stops the arrow keys and Space from scrolling the page, the functional setActiveIndex((prev) => ...) reads the latest index, and choosing or Escape sends focus back to the trigger so the user does not lose their place. Libraries such as Radix UI ship this pattern tested.',
    hints: [
      'role="listbox" on the list, role="option" and aria-selected on each item',
      'aria-expanded on the trigger reports whether the list is open',
      'Expose the active option with aria-activedescendant (or by focusing it); a CSS class is not announced',
      'Return focus to the trigger when the list closes',
    ],
    tieredHints: {
      apiSignature: 'function AccessibleDropdown({ options, value, onChange, label })',
      skeleton: "function AccessibleDropdown({ options, value, onChange, label }) {\n  const [isOpen, setIsOpen] = useState(false);\n  const [activeIndex, setActiveIndex] = useState(-1);\n\n  // handleKeyDown: ArrowDown, ArrowUp, Enter / Space, Escape\n\n  return (\n    <div onKeyDown={handleKeyDown}>\n      <label id=\"dropdown-label\">{label}</label>\n      <button id=\"dropdown-button\" aria-haspopup=\"____\" aria-expanded={____} aria-labelledby=\"____\" onClick={() => setIsOpen(!isOpen)}>\n        {value || \"Select an option\"}\n      </button>\n      {isOpen && (\n        <ul role=\"____\" aria-labelledby=\"dropdown-label\" ____={____} tabIndex={-1}>\n          {options.map((option, index) => (\n            <li key={option} id={____} role=\"____\" aria-selected={____}>\n              {option}\n            </li>\n          ))}\n        </ul>\n      )}\n    </div>\n  );\n}",
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
    question: 'Which approach finds a page\'s accessibility problems, and how much of them can automated checkers find on their own?',
    options: [
      { id: 'a', text: 'Lighthouse alone: an accessibility score of 100 means the page meets WCAG AA, so a manual check is needed only when the score drops', isCorrect: false },
      { id: 'b', text: 'axe or Lighthouse in CI, which catch about 90% of problems, so manual testing is kept for rare edge cases such as custom video players', isCorrect: false },
      { id: 'c', text: 'Only testing with disabled users counts, because automated checkers report so many false positives that none of their results can be trusted', isCorrect: false },
      { id: 'd', text: 'axe and Lighthouse to scan, then a keyboard and a screen reader such as NVDA or VoiceOver, because checkers find only about a third of problems', isCorrect: true },
    ],
    explanation: 'Automated checkers such as axe-core (the axe DevTools extension, and the engine behind Lighthouse\'s accessibility audit) find what code can detect: missing alt attributes, low contrast, inputs with no label, invalid ARIA. Studies put that at around a third of the barriers real users hit. They cannot tell whether alt text is meaningful, whether the focus order makes sense or whether a custom widget works from the keyboard, so you also Tab through the page and listen with a screen reader (NVDA on Windows, VoiceOver on macOS and iOS). A Lighthouse score of 100 only means no automated check failed. eslint-plugin-jsx-a11y catches some problems in JSX as you write it. Testing with disabled users is valuable on top of all this, not instead of the checkers, which are reliable for what they do check.',
    hints: [
      'Automated tools are a great start but not sufficient on their own',
      'Screen readers are the gold standard for real-world accessibility testing',
    ],
    tags: ['axe', 'lighthouse', 'NVDA', 'VoiceOver', 'testing', 'accessibility'],
    concepts: ['a11y-aria-roles'],
  },

  // =====================================================================
  // ACCESSIBILITY - INTERMEDIATE RAMP (8 questions)
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
    explanation: 'Escape-to-close is a keyboard event, so you listen for "keydown", not "click". The cleanup removes the same handler reference, so a new listener does not stack on the old one each time the effect runs again, and none is left behind when the modal unmounts. onClose belongs in the dependency array: an empty [] would keep the onClose from the first render.',
    hints: [
      'The dismiss key arrives via a "keydown" listener, not "click"',
      'Return a cleanup that removes the exact handler you added',
      'onClose is used inside the effect, so it goes in the deps array',
    ],
    tags: ['accessibility', 'modal', 'keyboard', 'escape', 'useEffect', 'parsons'],
    concepts: ['a11y-keyboard-nav'],
  },

  // -- Dialog ARIA attributes (INTERMEDIATE Cloze) --

  {
    id: 'a11y-dialog-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.ACCESSIBILITY,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the ARIA attributes that make this dialog accessible: the role that identifies it as a dialog, the value that tells assistive tech the rest of the page is inert while it is open, and the id that names the dialog from its title element.',
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
    explanation: 'role="dialog" tells assistive tech this container is a dialog. aria-modal="true" tells it that content outside the dialog is inert while it is open, so a screen reader keeps its reading inside; it does not stop the mouse or Tab from reaching the page, so a custom modal still traps focus itself. aria-labelledby references the id of the title element ("dialog-title"), so screen readers announce the dialog by its heading text. A native <dialog> opened with showModal() is a modal dialog without the role and aria-modal, and the browser makes the rest of the page inert for real.',
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
      '    <li key={opt} role="option" aria-selected={opt === value}>',
      '      {opt}',
      '    </li>',
      '  ))}',
      '</ul>',
    ],
    distractorLines: [
      '<ul role="menu" aria-labelledby="dd-label">',
      '    <li key={opt} role="listitem" aria-selected={opt === value}>',
    ],
    solution: '<ul role="listbox" aria-labelledby="dd-label">\n  {options.map((opt) => (\n    <li key={opt} role="option" aria-selected={opt === value}>\n      {opt}\n    </li>\n  ))}\n</ul>',
    explanation: 'A selection widget uses role="listbox" on the container and role="option" on each item, not role="menu" (which is for a list of actions) or role="listitem" (a plain list item with no selection semantics). aria-selected on each option tells the screen reader which value is currently chosen. key={opt} is React\'s usual key for items rendered by map, here the option string itself.',
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
    explanation: 'aria-haspopup="listbox" tells assistive tech the button opens a listbox-style popup. aria-expanded={isOpen} must stay bound to the open state so screen readers announce "expanded" or "collapsed" correctly; a hard-coded value would lie about the current state.',
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
      { id: 'c', text: 'Leave every item out of the Tab order and listen for arrow keys on document, moving a CSS highlight between items; the screen reader follows whichever item is highlighted', isCorrect: false },
      { id: 'd', text: 'Put autofocus on the first item and call preventDefault on Tab inside the widget, so focus stays inside it until the user presses Escape to leave', isCorrect: false },
    ],
    explanation: 'A composite widget should be ONE Tab stop, with the arrow keys moving between its items. Two patterns do this: roving tabindex keeps exactly one item at tabindex="0" (the others at "-1") and moves that 0, and focus with it, as the user arrows; aria-activedescendant keeps DOM focus on the container while the attribute points at the active item\'s id, so the screen reader announces that item. Giving every item tabindex="0" forces the user to Tab through all of them, which is the problem both patterns solve. A CSS highlight alone is invisible to a screen reader, and trapping Tab belongs to modal dialogs, not to a widget the user should be able to Tab past.',
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
      { id: 'a', text: 'Native elements are drawn by the browser on the GPU, so they render faster and raise the Lighthouse performance score, which is what accessibility audits measure', isCorrect: false },
      { id: 'b', text: 'Native elements are exempt from WCAG, so an accessibility audit skips them, while every custom widget has to be checked and certified separately', isCorrect: false },
      { id: 'c', text: 'React cannot attach keyboard handlers to a <div>, so a custom select or modal needs a third-party library before it can receive any key events', isCorrect: false },
      { id: 'd', text: 'They come with keyboard support, focus handling and screen reader roles built in, while a custom widget has to rebuild all of that and get it right', isCorrect: true },
    ],
    explanation: '<select> brings the listbox role, the arrow keys, type-ahead and the announced value; <dialog> opened with showModal() makes the rest of the page inert, closes on Escape, and moves focus in and back out. A custom React version has to rebuild each of those by hand, and any gap breaks it for keyboard and screen reader users. Reach for native first; build custom only when the design needs something the native element cannot do, and then lean on a tested primitive library such as Radix UI.',
    hints: [
      'List everything a custom modal or dropdown has to handle by hand',
      'Native elements give you that behaviour with no extra code',
    ],
    tags: ['accessibility', 'native-html', 'dialog', 'select', 'progressive-enhancement'],
    concepts: ['a11y-aria-roles', 'a11y-keyboard-nav'],
  },

  // =====================================================================
  // ACCESSIBILITY - PERCEPTION-SIDE WCAG CRITERIA (8 questions)
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
      { id: 'd', text: 'Only text smaller than 16px needs 4.5:1; anything at the 16px browser default or larger already counts as large text and needs just 3:1', isCorrect: false },
    ],
    explanation: 'WCAG 2.2 Level AA sets 4.5:1 as the minimum contrast ratio for normal-size text against its background. Large text - 18pt (24px) and up, or 14pt (18.66px) and up if bold - gets a relaxed 3:1 minimum because bigger glyphs are legible at lower contrast; 16px body text is normal text, not large. UI components (button borders, form field outlines, focus indicators) and meaningful graphical objects (icons that convey information) also use the 3:1 threshold. 7:1 is the Level AAA number for normal text, and Level A has no contrast ratio at all.',
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
    explanation: 'Decorative images that add no information get alt="" (present but empty) so assistive tech skips them entirely instead of announcing something meaningless like "divider.png". Informational images - especially ones that are the ONLY way to perceive content, like a product photo - need a description of what they actually show. Leaving alt out entirely makes many screen readers fall back to reading the filename or URL, which is worse than an empty alt, and a generic alt="image" tells the listener nothing.',
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
      { id: 'c', text: 'Screen readers let users jump between headings like a table of contents, so a page needs one h1 and no skipped levels (h2 straight to h4), mirroring its outline', isCorrect: true },
      { id: 'd', text: 'Heading levels are assigned automatically by the browser based on an element\'s position in the DOM tree, so authors never need to choose h1 through h6 themselves', isCorrect: false },
    ],
    explanation: 'Screen readers expose a headings list that lets users navigate a page the way a sighted user scans a table of contents - jumping straight to the section they want. This only works if the hierarchy is logical: one h1 per page (the main title), and no skipped levels (an h2 followed directly by an h4 suggests a missing h3, which breaks the outline a screen reader user is relying on). WCAG itself asks that the headings reflect the page\'s structure; one h1 and no skipped levels are the practice that meets it, and checkers such as axe flag a skipped level. Levels assigned automatically from nesting came from the HTML5 outline algorithm, which no browser ever implemented and the HTML standard dropped in 2022, so the number you write is the level a screen reader announces.',
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
      { id: 'c', text: 'aria-live="polite" waits until the screen reader finishes what it is saying, which suits the result count; aria-live="assertive" interrupts at once, which suits the urgent error', isCorrect: true },
      { id: 'd', text: 'aria-live="polite" is for visible text updates and aria-live="assertive" is for updates hidden with display: none - the CSS visibility of the region determines which value to use', isCorrect: false },
    ],
    explanation: '"polite" queues the announcement until the current speech finishes - the right choice for a non-urgent update like a result count, since it won\'t talk over whatever the user was already hearing. "assertive" interrupts immediately, for time-sensitive information like a validation error the user needs to hear now. role="alert" is shorthand for aria-live="assertive" with aria-atomic="true", and role="status" for aria-live="polite" with aria-atomic="true". Neither value depends on the surrounding element, and a region hidden with display: none is not announced at all.',
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
      'SearchResults receives count (the number of results after filtering) and results. Add a live region, hidden from sight with the page\'s visually-hidden class, that reads out "{count} results found" each time count changes. It must wait until the screen reader has finished speaking rather than interrupt, and read the whole sentence, not just the number that changed. Render it at all times, so the screen reader is already watching it when the text changes.',
    starterCode: `function SearchResults({ count, results }) {
  return (
    <div>
      {/* announce the count here */}
      <ul>{results.map((r) => <li key={r.id}>{r.name}</li>)}</ul>
    </div>
  );
}`,
    testCases: [
      {
        input: 'count = 12',
        expectedOutput: 'a visually hidden polite, atomic live region containing "12 results found"',
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
}
# OR
function SearchResults({ count, results }) {
  return (
    <div>
      <div role="status" className="visually-hidden">
        {count} results found
      </div>
      <ul>{results.map((r) => <li key={r.id}>{r.name}</li>)}</ul>
    </div>
  );
}`,
    requires: [
      /aria-live\s*=\s*["']polite["']|role\s*=\s*["']status["']/,
      /aria-atomic\s*=\s*(["']true["']|\{\s*true\s*\})|role\s*=\s*["']status["']|\{\s*`[^`]*\$\{\s*count\s*\}[^`]*`\s*\}/,
      /visually-hidden|sr-only/,
      /\{\s*count\s*\}/,
    ],
    explanation:
      'aria-live="polite" queues the update until the screen reader finishes its current sentence, which suits a result count; "assertive" and role="alert" interrupt, so keep them for errors. React renders {count} results found as two text nodes, "12" and " results found", and when count changes only the first one changes, so without aria-atomic="true" a screen reader may say just "13"; aria-atomic makes it read the whole region. role="status" is shorthand for both: it implies aria-live="polite" and aria-atomic="true". The region is rendered from the start, because a region inserted together with its text is often not announced at all. The visually-hidden class keeps the text off screen while it stays in the accessibility tree, unlike display: none, which removes it for screen readers too.',
    hints: [
      'A non-urgent update waits its turn: polite, not assertive',
      'Only the changed text node is read unless the region is atomic',
      'Use the visually-hidden class, not display: none, so it stays announceable',
    ],
    tieredHints: {
      apiSignature: 'function SearchResults({ count, results })',
      skeleton: `function SearchResults({ count, results }) {
  return (
    <div>
      <div ____="____" ____="____" className="____">
        ____
      </div>
      {/* the results list, unchanged */}
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
      'Write two components. Card renders a <div> showing title that keyboard users can Tab to at the point where it sits in the page. CardDetails renders a <div> holding children, attached to detailsRef, which script focuses with detailsRef.current.focus() when the details open, but which Tab must never stop on.',
    starterCode: `function Card({ title }) {

}

function CardDetails({ detailsRef, children }) {

}`,
    testCases: [
      {
        input: 'Card and CardDetails',
        expectedOutput: 'Card uses tabIndex={0}, CardDetails uses ref={detailsRef} and tabIndex={-1}',
        description: 'Should assign the correct tabindex values for natural vs programmatic-only focus',
      },
    ],
    solution: `function Card({ title }) {
  // 0: a Tab stop at its place in the document order
  return <div tabIndex={0}>{title}</div>;
}

function CardDetails({ detailsRef, children }) {
  // -1: focusable from script only; Tab skips it
  return <div ref={detailsRef} tabIndex={-1}>{children}</div>;
}
# OR
function Card({ title }) {
  return <div tabIndex="0">{title}</div>;
}

function CardDetails({ detailsRef, children }) {
  return <div ref={detailsRef} tabIndex="-1">{children}</div>;
}`,
    requires: [
      /tabIndex\s*=\s*(\{\s*0\s*\}|["']0["'])[^>]*>[^{}]*\{\s*title\s*\}/,
      /ref\s*=\s*\{\s*detailsRef\s*\}[^>]*tabIndex\s*=\s*(\{\s*-1\s*\}|["']-1["'])|tabIndex\s*=\s*(\{\s*-1\s*\}|["']-1["'])[^>]*ref\s*=\s*\{\s*detailsRef\s*\}/,
    ],
    explanation:
      'tabIndex={0} puts an element that is not focusable by nature into the Tab order at its place in the document, the same place a <button> there would take. tabIndex={-1} makes an element focusable from script, with .focus(), while Tab skips it: right for a panel you move focus into when it opens, a dialog\'s container or a skip link\'s target. A positive value such as tabIndex={1} is never used, because every positive tabindex is visited first, in order of value, before the rest of the page, wherever it sits, so the keyboard order stops matching the order the page reads in and breaks again whenever the page changes. A div that must also act like a button still needs a role and key handlers, which is why a real <button> is the better choice when it does something.',
    hints: [
      'Into the Tab order where it sits: tabIndex={0}',
      'Focusable from script but skipped by Tab: tabIndex={-1}',
      'Attach detailsRef with ref={...} so script can call .focus() on it',
    ],
    tieredHints: {
      apiSignature: 'function Card({ title })  /  function CardDetails({ detailsRef, children })',
      skeleton: `function Card({ title }) {
  return <div ____>{title}</div>;
}

function CardDetails({ detailsRef, children }) {
  return <div ____ ____>{children}</div>;
}`,
    },
    tags: ['tabindex', 'keyboard', 'focus', 'accessibility', 'react'],
    concepts: ['a11y-tabindex'],
  },

  // -- Predict: the Tab order that tabindex and native focusability give (INTERMEDIATE Predict) --

  {
    id: 'a11y-tab-order-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.ACCESSIBILITY,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question:
      'The page has just loaded and nothing has focus. The user presses Tab five times. Which element has focus after each press? Type the text of each focused element in order, one per line.',
    code: `<button>Home</button>
<a href="/cart">Cart</a>
<div tabindex="-1">Panel</div>
<div tabindex="0">Card</div>
<button tabindex="2">Help</button>
<button disabled>Pay</button>
<span onclick="openMenu()">Menu</span>
<button>Exit</button>`,
    expectedOutput: `Help
Home
Cart
Card
Exit`,
    acceptableOutputs: ['Help, Home, Cart, Card, Exit', 'Help,Home,Cart,Card,Exit'],
    explanation:
      'Tab visits every element with a positive tabindex first, in order of value, wherever it sits in the page, so Help comes before everything else. Then it walks the page in document order through the natively focusable elements (a button, a link with an href) and those with tabindex="0": Home, Cart, Card, Exit. tabindex="-1" makes Panel focusable from script with .focus() but skips it on Tab. A disabled button cannot take focus, and a span is not focusable at all, onclick or not, so a keyboard user can never reach Menu; that is why a clickable control should be a <button>. The jump to Help before Home is why a positive tabindex is avoided: it breaks the order the page reads in.',
    hints: [
      'Which element jumps the queue, and why?',
      'Does tabindex="-1", disabled, or an onclick put an element in the Tab order?',
    ],
    tags: ['tabindex', 'keyboard', 'focus', 'tab-order', 'accessibility', 'predict'],
    concepts: ['a11y-tabindex', 'a11y-keyboard-nav'],
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
      { id: 'a', text: 'The title attribute, because it is the oldest labelling method, and every browser and screen reader still gives it priority over the newer ARIA attributes', isCorrect: false },
      { id: 'b', text: 'The visible text content, because WCAG requires the spoken name to match the visible label, so browsers throw away any ARIA name that differs from it', isCorrect: false },
      { id: 'c', text: 'All four, joined in DOM order, because the browser concatenates every naming source it finds so that the screen reader user hears each one in turn', isCorrect: false },
      { id: 'd', text: 'aria-labelledby, because the name is the first one present of aria-labelledby, aria-label, the text content and title; title then becomes the description', isCorrect: true },
    ],
    explanation: 'The accessible name computation takes the first source present: aria-labelledby (the text of the elements it points at), then aria-label, then the element\'s own text content (or an associated <label> for a form control), and title only as the last resort. In Chrome, a button with all four is announced by the heading\'s text, and its title, unused for the name, becomes the accessible description, which some screen readers read after the name. The aria-label string and the visible text are not announced at all. That is a real bug: WCAG 2.5.3 (Label in Name) asks that the name contain the visible text, so a speech-input user who says "click" and the words they see can operate the control. Browsers do not enforce that; the author has to keep the wording in step.',
    hints: [
      'aria-labelledby sits at the top of the precedence chain',
      'title is the fallback of last resort, not a competitor to the others',
    ],
    tags: ['accessible-name', 'aria-labelledby', 'aria-label', 'title', 'accessibility'],
    concepts: ['a11y-accessible-name'],
  },

  // =====================================================================
  // NEXT_SHADCN (10 questions)
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

  // Dark mode with next-themes, the React side (moved from the Next.js deployment projects)
  {
    id: 'proj-next-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_SHADCN,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Build a dark/light theme toggle for a Next.js app with the next-themes package. Show both files.\n\n1. app/layout.tsx\n   - Import ThemeProvider from "next-themes"\n   - Render <html lang="en" suppressHydrationWarning> (next-themes sets a class on <html> before React hydrates)\n   - Inside <body>, wrap children in <ThemeProvider attribute="class" defaultTheme="system" enableSystem>\n\n2. components/ThemeToggle.tsx (a Client Component, default export ThemeToggle)\n   - Read resolvedTheme and setTheme from useTheme()\n   - Keep a mounted flag in state that an effect sets to true, and until then render an empty <button> placeholder, because the server cannot know the theme\n   - Then render a <button> that switches to the other theme: the text is "Switch to light" while the theme is dark and "Switch to dark" otherwise',
    starterCode: `// app/layout.tsx\n\n\n// components/ThemeToggle.tsx\n`,
    testCases: [
      {
        input: 'ThemeProvider setup',
        expectedOutput: '<html lang="en" suppressHydrationWarning> ... <ThemeProvider attribute="class" defaultTheme="system" enableSystem>',
        description: 'Layout wraps children in ThemeProvider with class-based theming',
      },
      {
        input: 'Client component',
        expectedOutput: '"use client"; const { resolvedTheme, setTheme } = useTheme();',
        description: 'ThemeToggle is a Client Component using the useTheme hook',
      },
      {
        input: 'Hydration safety',
        expectedOutput: 'if (!mounted) return <button />;',
        description: 'Renders a placeholder until mounted, so the server and first client render match',
      },
    ],
    solution: `// app/layout.tsx\nimport { ThemeProvider } from "next-themes";\n\nexport default function RootLayout({\n  children,\n}: {\n  children: React.ReactNode;\n}) {\n  return (\n    <html lang="en" suppressHydrationWarning>\n      <body>\n        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>\n          {children}\n        </ThemeProvider>\n      </body>\n    </html>\n  );\n}\n\n// components/ThemeToggle.tsx\n"use client";\n\nimport { useTheme } from "next-themes";\nimport { useState, useEffect } from "react";\n\nexport default function ThemeToggle() {\n  const { resolvedTheme, setTheme } = useTheme();\n  const [mounted, setMounted] = useState(false);\n\n  useEffect(() => {\n    setMounted(true);\n  }, []);\n\n  if (!mounted) {\n    return <button className="h-10 w-28 rounded-lg bg-gray-200 dark:bg-gray-700" />;\n  }\n\n  const isDark = resolvedTheme === "dark";\n\n  return (\n    <button\n      onClick={() => setTheme(isDark ? "light" : "dark")}\n      className="h-10 w-28 rounded-lg bg-gray-200 dark:bg-gray-700"\n    >\n      {isDark ? "Switch to light" : "Switch to dark"}\n    </button>\n  );\n}`,
    requires: [/import\s*\{\s*ThemeProvider\s*\}\s*from\s*["']next-themes["']/, /suppressHydrationWarning/, /<ThemeProvider\b[^>]*attribute=["']class["']/, /defaultTheme=["']system["']/, /["']use client["']/, /useTheme\(\)/, /resolvedTheme/, /setTheme\(/, /useEffect\(/, /Switch to light/, /Switch to dark/],
    explanation: 'Key decisions:\n\n1. **suppressHydrationWarning on <html>**: next-themes runs a small script before React hydrates that puts the theme class on <html>, so the server HTML and the browser\'s <html> differ. suppressHydrationWarning tells React to accept that one element\'s difference.\n\n2. **attribute="class"**: next-themes sets the theme as a class ("dark" or "light") on <html>. In Tailwind 4 the dark: variant follows the operating system by default, so globals.css adds @custom-variant dark (&:where(.dark, .dark *)); to make dark: follow that class instead (Tailwind 3 used darkMode: "class" in tailwind.config.js).\n\n3. **Mounted check**: the server does not know the visitor\'s theme (next-themes keeps it in localStorage). Rendering theme-dependent text on the server would not match the browser\'s first render, so the toggle renders a neutral placeholder until its effect has run in the browser.\n\n4. **resolvedTheme vs theme**: with defaultTheme="system", theme can be "system"; resolvedTheme is what that resolves to ("light" or "dark") from the operating system setting, which is what the button needs to compare.',
    hints: ['suppressHydrationWarning goes on <html>, because next-themes changes it before React hydrates', 'Use resolvedTheme instead of theme: it resolves "system" to the actual value', 'The mounted flag keeps the server render and the first browser render the same'],
    tieredHints: {
      apiSignature: 'useTheme(): { theme?: string; setTheme: (theme: string) => void; resolvedTheme?: string }',
      skeleton: '// app/layout.tsx\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang="en" ____>\n      <body>\n        <ThemeProvider ____>{children}</ThemeProvider>\n      </body>\n    </html>\n  );\n}\n\n// components/ThemeToggle.tsx\n"use client";\nexport default function ThemeToggle() {\n  const { ____, setTheme } = useTheme();\n  const [mounted, setMounted] = useState(false);\n\n  useEffect(() => {\n    ____;\n  }, []);\n\n  if (!mounted) {\n    return ____;\n  }\n\n  return <button onClick={() => ____}>____</button>;\n}',
    },
    tags: ['nextjs', 'dark-mode', 'theming', 'client-component', 'project'],
    concepts: ['next-server-vs-client'],
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

  // -- Predict: the class string cn() returns (BEGINNER Predict) --

  {
    id: 'shadcn-cn-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_SHADCN,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'cn() is the helper from a shadcn/ui project\'s lib/utils.ts. What does each console.log print? Type each class string exactly as printed, one per line, in order, without quotes.',
    code: `import { cn } from "@/lib/utils";

const isOpen = true;
const isDisabled = false;

console.log(cn("px-4 py-2 text-sm", isOpen && "bg-white", isDisabled && "opacity-50"));
console.log(cn("p-4 text-red-500", "px-2 text-lg"));
console.log(cn("px-2 text-lg", "p-4"));
console.log(cn("rounded-md bg-gray-100", { "bg-blue-600": isOpen, "rounded-full": isDisabled }));`,
    expectedOutput: `px-4 py-2 text-sm bg-white
p-4 text-red-500 px-2 text-lg
text-lg p-4
rounded-md bg-blue-600`,
    explanation:
      'cn() is twMerge(clsx(inputs)). clsx goes first: it drops false, null and undefined, and keeps an object key only when its value is true, so the first call loses "opacity-50" and the fourth keeps "bg-blue-600" but not "rounded-full". twMerge then removes any class that a later class of the same Tailwind group overrides, keeping the survivors in their original order. In the second call, "px-2" only refines the horizontal part of "p-4", so both stay, and "text-red-500" (a color) and "text-lg" (a font size) are different groups, so both stay too. In the third, "p-4" comes last and sets every side, so it overrides the earlier "px-2". The fourth drops "bg-gray-100" because the later "bg-blue-600" sets the same background color. Which class wins depends on its place in the cn() call, never on the order Tailwind writes its CSS, which is the reason shadcn components pass a caller\'s className last.',
    hints: [
      'clsx runs first and decides which inputs are kept at all',
      'Two classes conflict only when they set the same CSS property; does px-2 conflict with p-4, and does text-lg conflict with text-red-500?',
    ],
    tags: ['shadcn', 'cn', 'clsx', 'tailwind-merge', 'predict'],
    concepts: ['shadcn-cn-utility'],
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
