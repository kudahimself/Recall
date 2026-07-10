import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const webdevOrderedQuestions: Question[] = [

  // ===== HTML_BASICS =====
  // Beginner MC → Beginner Coding → Intermediate → Advanced

  {
    id: 'html-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_BASICS,
    course: Course.WEB_DEV,
    question: 'What does HTML stand for?',
    options: [
      { id: 'a', text: 'HyperText Markup Language — it defines the structure and content of web pages', isCorrect: true },
      { id: 'b', text: 'High Tech Modern Language', isCorrect: false },
      { id: 'c', text: 'HyperText Making Links', isCorrect: false },
      { id: 'd', text: 'Home Tool Markup Language', isCorrect: false },
    ],
    explanation: 'HTML provides the skeleton of a web page using elements (tags) to define headings, paragraphs, links, images, forms, etc. CSS handles styling, JavaScript handles behavior.',
    tags: ['html', 'fundamentals'],
    concepts: ['web-html-semantics'],
  },

  {
    id: 'html-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_BASICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Assemble a minimal HTML5 document in document order (outermost first): the doctype, the html element with lang="en", a head holding the title, then a body holding an h1.',
    correctOrder: [
      '<!DOCTYPE html>',
      '<html lang="en">',
      '<head>',
      '  <title>My Page</title>',
      '</head>',
      '<body>',
      '  <h1>Hello World</h1>',
      '</body>',
      '</html>',
    ],
    distractorLines: [
      '<head lang="en">',
      '<h1>Hello World',
    ],
    solution: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>`,
    explanation: '<!DOCTYPE html> declares HTML5 and must come first. lang goes on <html> (not <head>) so assistive tech knows the language. <head> holds metadata like <title>; <body> holds visible content. Tags nest and must close.',
    hints: ['Doctype first; lang on <html>; head (metadata) before body (content).'],
    tags: ['html', 'structure', 'boilerplate'],
    concepts: ['web-html-semantics'],
  },

  {
    id: 'html-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_BASICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Fill in (1) the attribute that opens the link in a new tab, and (2) the rel value that stops the new page from accessing window.opener.',
    template: `<a href="https://example.com" ___="_blank" rel="___">Visit</a>`,
    blanks: ['target', 'noopener noreferrer'],
    blankAlternates: [['target'], ['noopener', 'noopener noreferrer']],
    solution: `<a href="https://example.com" target="_blank" rel="noopener noreferrer">Visit</a>`,
    explanation: 'target="_blank" opens a new tab. Pair it with rel="noopener noreferrer" (or at least noopener) so the opened page cannot reach back into your page via window.opener — a known security/tabnabbing risk.',
    hints: ['target opens the tab; rel guards window.opener.'],
    tags: ['html', 'anchor', 'link'],
    concepts: ['web-html-semantics', 'web-html-link-security'],
  },

  {
    id: 'html-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_BASICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Fill in the required attribute that gives an image its text alternative (read aloud by screen readers and shown if the image fails to load).',
    template: `<img src="photo.jpg" ___="A sunset over the ocean" width="600">`,
    blanks: ['alt'],
    solution: `<img src="photo.jpg" alt="A sunset over the ocean" width="600">`,
    explanation: 'alt provides the accessible text alternative for an image. It is required for meaningful images; decorative images use alt="" so screen readers skip them.',
    hints: ['Three-letter accessibility attribute on <img>.'],
    tags: ['html', 'image', 'accessibility'],
    concepts: ['web-html-semantics', 'a11y-aria-roles'],
  },

  {
    id: 'html-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_BASICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Write the basic HTML5 document structure with a DOCTYPE, html tag (lang="en"), head with a title "My Page", and body with an h1 saying "Hello World".',
    starterCode: `<!DOCTYPE html>\n`,
    testCases: [
      {
        input: 'HTML structure',
        expectedOutput: '<!DOCTYPE html><html lang="en"><head><title>',
        description: 'Should have correct HTML5 structure',
      },
    ],
    solution: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>My Page</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>`,
    explanation: '<!DOCTYPE html> declares HTML5. <html lang="en"> sets the language. <head> contains metadata (charset, title). <body> contains visible content. This is the minimal valid HTML5 document.',
    hints: ['Start with <!DOCTYPE html>', '<head> for metadata, <body> for content', 'Always set lang on <html>'],
    tags: ['html', 'structure', 'boilerplate'],
    concepts: ['web-html-semantics'],
  },

  {
    id: 'html-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_BASICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Create an anchor tag that links to "https://example.com", opens in a new tab, and displays the text "Visit Example".',
    starterCode: `<!-- Create a link -->\n`,
    testCases: [
      {
        input: 'link element',
        expectedOutput: '<a href="https://example.com" target="_blank"',
        description: 'Should create link with new tab',
      },
    ],
    solution: `<a href="https://example.com" target="_blank" rel="noopener noreferrer">Visit Example</a>`,
    explanation: 'href sets the URL. target="_blank" opens in a new tab. rel="noopener noreferrer" is a security best practice for external links — it prevents the new page from accessing window.opener.',
    hints: ['Use target="_blank" for new tab', 'Add rel="noopener noreferrer" for security'],
    tags: ['html', 'anchor', 'link'],
    concepts: ['web-html-semantics', 'web-html-link-security'],
  },

  {
    id: 'html-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_BASICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Create an image tag that displays "photo.jpg" with alt text "A sunset over the ocean" and a width of 600 pixels.',
    starterCode: `<!-- Image element -->\n`,
    testCases: [
      {
        input: 'image element',
        expectedOutput: '<img src="photo.jpg" alt="A sunset over the ocean"',
        description: 'Should create image with alt text',
      },
    ],
    solution: `<img src="photo.jpg" alt="A sunset over the ocean" width="600">`,
    explanation: '<img> is self-closing (no closing tag). src is the image path. alt is required for accessibility — screen readers read it aloud, and it displays if the image fails to load. Always include meaningful alt text.',
    hints: ['<img> is self-closing', 'alt is required for accessibility', 'width can be set as attribute or CSS'],
    tags: ['html', 'image', 'accessibility'],
    concepts: ['web-html-semantics', 'a11y-aria-roles'],
  },

  // ===== HTML_FORMS =====
  // Intermediate Coding

  {
    id: 'html-form-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_FORMS,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Assemble an accessible email field: the label line FIRST (tied to the input via for/id), then the email input below it.',
    correctOrder: [
      '<label for="email">Email</label>',
      '<input type="email" id="email" name="email" required>',
    ],
    distractorLines: [
      '<label name="email">Email</label>',
      '<input type="text" id="email" name="email" required>',
    ],
    solution: `<label for="email">Email</label>\n<input type="email" id="email" name="email" required>`,
    explanation: 'A label is tied to its input by matching the label\'s for to the input\'s id (not the label\'s name). type="email" gives built-in format validation; clicking the label then focuses the input.',
    hints: ['label for= must match input id=; use type="email".'],
    tags: ['html', 'form', 'label', 'a11y'],
    concepts: ['web-html-semantics', 'web-html-forms-a11y'],
  },

  {
    id: 'html-form-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_FORMS,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Fill in the label attribute and the matching input attribute that associate a label with its input for accessibility.',
    template: `<label ___="email">Email</label>
<input type="email" ___="email">`,
    blanks: ['for', 'id'],
    solution: `<label for="email">Email</label>\n<input type="email" id="email">`,
    explanation: 'label[for] must equal input[id]. This pairing lets screen readers announce the field name and lets users click the label to focus the input.',
    hints: ['label uses "for"; input uses the matching "id".'],
    tags: ['html', 'form', 'label', 'a11y'],
    concepts: ['web-html-forms-a11y'],
  },

  {
    id: 'html-form-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_FORMS,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Fill in (1) the input type that gives built-in email-format validation, and (2) the boolean attribute that blocks submitting an empty field.',
    template: `<input type="___" ___>`,
    blanks: ['email', 'required'],
    solution: `<input type="email" required>`,
    explanation: 'type="email" validates the address format in the browser; required prevents submission when the field is empty. Both are native HTML constraints — no JavaScript needed.',
    hints: ['Input type for addresses; boolean attribute meaning "must be filled".'],
    tags: ['html', 'form', 'validation'],
    concepts: ['web-html-forms-a11y'],
  },

  {
    id: 'html-form-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_FORMS,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Create a form with: an email input (required, placeholder "Enter email"), a password input (required, minlength 8), and a submit button saying "Sign Up".',
    starterCode: `<form>\n`,
    testCases: [
      {
        input: 'signup form',
        expectedOutput: '<input type="email" required> <input type="password" minlength="8">',
        description: 'Should create form with validation',
      },
    ],
    solution: `<form>\n  <label for="email">Email:</label>\n  <input type="email" id="email" name="email" required placeholder="Enter email">\n\n  <label for="password">Password:</label>\n  <input type="password" id="password" name="password" required minlength="8">\n\n  <button type="submit">Sign Up</button>\n</form>`,
    explanation: 'type="email" provides built-in email validation. required prevents empty submission. minlength enforces minimum length. Always pair inputs with <label> using for/id for accessibility. name attributes are needed for form submission.',
    hints: ['type="email" validates email format', 'required prevents empty submission', 'Always use <label> with for= matching input id'],
    tags: ['html', 'form', 'input', 'validation'],
    concepts: ['web-html-semantics', 'web-html-forms-a11y', 'forms-zod-schema'],
  },

  {
    id: 'html-form-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_FORMS,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Create a select dropdown with label "Country", options for "UK", "US", "Canada", and a disabled default option "Select a country".',
    starterCode: `<!-- Dropdown -->\n`,
    testCases: [
      {
        input: 'select dropdown',
        expectedOutput: '<select> with <option> elements',
        description: 'Should create dropdown with options',
      },
    ],
    solution: `<label for="country">Country:</label>\n<select id="country" name="country">\n  <option value="" disabled selected>Select a country</option>\n  <option value="uk">UK</option>\n  <option value="us">US</option>\n  <option value="ca">Canada</option>\n</select>`,
    explanation: '<select> creates a dropdown. <option> defines choices. disabled selected on the placeholder option shows it by default but prevents it from being submitted. value is what gets sent on form submission.',
    hints: ['Use disabled selected for placeholder option', 'value is what the server receives'],
    tags: ['html', 'form', 'select', 'dropdown'],
    concepts: ['web-html-semantics', 'web-html-forms-a11y'],
  },

  // ===== HTML_SEMANTIC =====
  // Intermediate MC → Intermediate Coding

  {
    id: 'html-sem-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_SEMANTIC,
    course: Course.WEB_DEV,
    question: 'Why should you use semantic HTML elements like <header>, <nav>, <main>, <article>, <section>, <footer> instead of generic <div> elements?',
    options: [
      { id: 'a', text: 'They are faster to render', isCorrect: false },
      { id: 'b', text: 'They improve accessibility (screen readers understand page structure), SEO (search engines prioritize structured content), and code readability', isCorrect: true },
      { id: 'c', text: 'They automatically add styling', isCorrect: false },
      { id: 'd', text: 'They are required by browsers', isCorrect: false },
    ],
    explanation: 'Semantic elements convey meaning. A screen reader can announce "navigation" for <nav> or "main content" for <main>. Search engines use them to understand content hierarchy. Developers can quickly scan the structure. <div> is meaningless — use it only when no semantic element fits.',
    tags: ['semantic', 'accessibility', 'seo', 'html'],
    concepts: ['web-html-semantics', 'a11y-aria-roles'],
  },

  {
    id: 'html-sem-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_SEMANTIC,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Assemble a semantic page skeleton in document order: the header (wrapping the nav) first, then main (wrapping an article), then the footer.',
    correctOrder: [
      '<header><nav>Links</nav></header>',
      '<main><article>Content</article></main>',
      '<footer>Copyright</footer>',
    ],
    distractorLines: [
      '<div><nav>Links</nav></div>',
      '<section>Copyright</section>',
    ],
    solution: `<header><nav>Links</nav></header>\n<main><article>Content</article></main>\n<footer>Copyright</footer>`,
    explanation: 'Semantic landmarks (header, nav, main, article, footer) describe the page to screen readers and search engines. Use them instead of generic <div>/<section> where a specific element fits — <main> is the one primary-content landmark per page.',
    hints: ['header → main → footer; landmarks, not divs.'],
    tags: ['html', 'semantic', 'layout'],
    concepts: ['web-html-semantics'],
  },

  {
    id: 'html-sem-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_SEMANTIC,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Fill in the single primary-content landmark element (there should be only one per page).',
    template: `<___>
  <h1>Welcome</h1>
</___>`,
    blanks: ['main', 'main'],
    solution: `<main>\n  <h1>Welcome</h1>\n</main>`,
    explanation: '<main> marks the page\'s primary content and must appear only once. Screen-reader users can jump straight to it, skipping repeated header/nav chrome.',
    hints: ['Four-letter landmark for the primary content.'],
    tags: ['html', 'semantic', 'landmark'],
    concepts: ['web-html-semantics', 'a11y-aria-roles'],
  },

  {
    id: 'html-sem-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_SEMANTIC,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Fill in the semantic elements that wrap (1) the site navigation links and (2) the page footer content.',
    template: `<___>
  <a href="/">Home</a>
</___>
<___>
  <p>&copy; 2024</p>
</___>`,
    blanks: ['nav', 'nav', 'footer', 'footer'],
    solution: `<nav>\n  <a href="/">Home</a>\n</nav>\n<footer>\n  <p>&copy; 2024</p>\n</footer>`,
    explanation: '<nav> groups major navigation links; <footer> holds footer content (copyright, secondary links). Both are landmark elements that improve accessibility and document structure.',
    hints: ['Navigation landmark; footer landmark.'],
    tags: ['html', 'semantic', 'landmark'],
    concepts: ['web-html-semantics'],
  },

  {
    id: 'html-sem-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_SEMANTIC,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Create a semantic page layout with: a <header> containing a <nav> with 3 links (Home, About, Contact), a <main> with an <article> containing an h2 and paragraph, and a <footer> with copyright text.',
    starterCode: `<!-- Semantic layout -->\n`,
    testCases: [
      {
        input: 'semantic page',
        expectedOutput: '<header><nav> <main><article> <footer>',
        description: 'Should use semantic elements',
      },
    ],
    solution: `<header>\n  <nav>\n    <a href="/">Home</a>\n    <a href="/about">About</a>\n    <a href="/contact">Contact</a>\n  </nav>\n</header>\n\n<main>\n  <article>\n    <h2>Welcome</h2>\n    <p>This is the main content.</p>\n  </article>\n</main>\n\n<footer>\n  <p>&copy; 2024 My Site</p>\n</footer>`,
    explanation: '<header> for site header/banner. <nav> for navigation links. <main> for the primary page content (only one per page). <article> for self-contained content. <footer> for page footer. This structure is immediately understandable to both humans and machines.',
    hints: ['<main> should appear only once per page', '<article> is for self-contained content', '<nav> wraps navigation links'],
    tags: ['semantic', 'layout', 'structure', 'html'],
    concepts: ['web-html-semantics'],
  },

  // ===== CSS_BASICS =====
  // Beginner MC → Beginner Coding → Intermediate MC → Intermediate Coding

  {
    id: 'css-basic-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_BASICS,
    course: Course.WEB_DEV,
    question: 'What is the CSS box model (from inside out)?',
    options: [
      { id: 'a', text: 'Margin → Border → Padding → Content', isCorrect: false },
      { id: 'b', text: 'Border → Content → Padding → Margin', isCorrect: false },
      { id: 'c', text: 'Content → Padding → Border → Margin', isCorrect: true },
      { id: 'd', text: 'Content → Margin → Border → Padding', isCorrect: false },
    ],
    explanation: 'Every element is a box: Content (the actual text/image), Padding (space inside the border), Border (the visible edge), Margin (space outside the border). Use box-sizing: border-box to include padding and border in the element\'s width/height.',
    tags: ['css', 'box-model', 'fundamentals'],
    concepts: ['web-css-box-model'],
  },

  {
    id: 'css-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_BASICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Assemble a fadeIn animation: declare the @keyframes (opacity goes 0 → 1) FIRST, then the .modal rule that applies it over 0.3s.',
    correctOrder: [
      '@keyframes fadeIn {',
      '  from { opacity: 0; }',
      '  to { opacity: 1; }',
      '}',
      '',
      '.modal {',
      '  animation: fadeIn 0.3s ease;',
      '}',
    ],
    distractorLines: [
      '  to { opacity: 0; }',
      '.modal { animation: 0.3s ease; }',
    ],
    solution: `@keyframes fadeIn {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}\n\n.modal {\n  animation: fadeIn 0.3s ease;\n}`,
    explanation: '@keyframes defines the steps (from = start, to = end). The animation shorthand references the keyframes name plus a duration and timing function. The name in animation must match the @keyframes name.',
    hints: ['Define @keyframes (from 0 → to 1) first, then reference its name in animation.'],
    tags: ['css', 'keyframes', 'animation'],
    concepts: ['web-css-animation'],
  },

  {
    id: 'css-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_BASICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Fill in (1) the property for inner spacing between content and the border (16px), then (2) the property that rounds the corners (8px).',
    template: `.card {
  ___: 16px;
  ___: 8px;
}`,
    blanks: ['padding', 'border-radius'],
    solution: `.card {\n  padding: 16px;\n  border-radius: 8px;\n}`,
    explanation: 'padding is the space inside the box (between content and border); margin is the space outside it. border-radius rounds the corners.',
    hints: ['Inner spacing; then the corner-rounding property.'],
    tags: ['css', 'box-model'],
    concepts: ['web-css-box-model'],
  },

  {
    id: 'css-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_BASICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Fill in (1) the property that smoothly animates value changes, and (2) the pseudo-class for the mouse-over state.',
    template: `.btn {
  ___: background-color 0.2s ease;
}

.btn:___ {
  background: #2563eb;
}`,
    blanks: ['transition', 'hover'],
    solution: `.btn {\n  transition: background-color 0.2s ease;\n}\n\n.btn:hover {\n  background: #2563eb;\n}`,
    explanation: 'transition (declared on the base rule, not on :hover) interpolates between the normal and hover states. :hover is the pseudo-class that matches while the pointer is over the element.',
    hints: ['Property that interpolates changes; pseudo-class for pointer-over.'],
    tags: ['css', 'transition', 'hover'],
    concepts: ['web-css-animation'],
  },

  {
    id: 'css-basic-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_BASICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Write CSS to style a .card class with: white background, 1px solid #ddd border, 16px padding, 8px border-radius, and a subtle box-shadow.',
    starterCode: `.card {\n`,
    testCases: [
      {
        input: 'card styling',
        expectedOutput: 'background, border, padding, border-radius, box-shadow',
        description: 'Should style a card component',
      },
    ],
    solution: `.card {\n  background: white;\n  border: 1px solid #ddd;\n  padding: 16px;\n  border-radius: 8px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n}`,
    explanation: 'This is a common card pattern. border-radius rounds corners. box-shadow adds depth: offset-x, offset-y, blur-radius, color. rgba() with low alpha creates subtle shadows. These properties together create a modern card UI.',
    hints: ['box-shadow: x y blur color', 'rgba(0,0,0,0.1) for subtle shadow', 'border-radius for rounded corners'],
    tags: ['css', 'card', 'box-shadow', 'styling'],
    concepts: ['web-css-box-model'],
  },

  {
    id: 'css-basic-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_BASICS,
    course: Course.WEB_DEV,
    question: 'What is CSS specificity order (from lowest to highest)?',
    options: [
      { id: 'a', text: 'ID → Class → Element → Inline', isCorrect: false },
      { id: 'b', text: 'Class → ID → Element → !important', isCorrect: false },
      { id: 'c', text: 'All selectors have equal specificity', isCorrect: false },
      { id: 'd', text: 'Element (p, div) → Class (.card) → ID (#header) → Inline style → !important', isCorrect: true },
    ],
    explanation: 'When multiple rules target the same element, specificity determines which wins. Elements (0,0,1), classes (0,1,0), IDs (1,0,0), inline (1,0,0,0). !important overrides everything (avoid using it). More specific selectors win.',
    tags: ['css', 'specificity', 'selectors'],
    concepts: ['web-css-specificity'],
  },

  {
    id: 'css-anim-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_BASICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Write CSS for a .btn class that smoothly transitions background-color and transform on hover: darker background and slight scale-up (1.05) with a 0.2s ease transition.',
    starterCode: `.btn {\n`,
    testCases: [{ input: 'button with transition', expectedOutput: 'transition, hover with background and transform', description: 'Should add hover transition' }],
    solution: `.btn {\n  background: #3b82f6;\n  color: white;\n  padding: 12px 24px;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n  transition: background-color 0.2s ease, transform 0.2s ease;\n}\n\n.btn:hover {\n  background: #2563eb;\n  transform: scale(1.05);\n}`,
    explanation: 'transition defines which properties animate and how long. List multiple properties with commas. The hover state defines the end values — CSS smoothly interpolates between normal and hover states. ease is the default timing function.',
    hints: ['transition on the base state, not :hover', 'Comma-separate multiple properties', 'transform: scale() for size change'],
    tags: ['css', 'transition', 'hover', 'animation'],
    concepts: ['web-css-animation'],
  },

  {
    id: 'css-anim-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_BASICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Create a CSS @keyframes animation called "fadeIn" that goes from opacity 0 to opacity 1. Apply it to a .modal class with 0.3s duration.',
    starterCode: `/* Declare @keyframes fadeIn with from/to opacity 0→1
 * Apply the animation to .modal at 0.3s using a reasonable easing */
`,
    testCases: [{ input: 'fade in animation', expectedOutput: '@keyframes with from/to, animation property', description: 'Should create keyframe animation' }],
    solution: `@keyframes fadeIn {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}\n\n.modal {\n  animation: fadeIn 0.3s ease;\n}`,
    explanation: '@keyframes defines animation steps. from/to = 0%/100%. The animation shorthand: name duration timing-function. You can also use percentages: 0%, 50%, 100% for multi-step animations. animation-fill-mode: forwards keeps the end state.',
    hints: ['@keyframes name { from {} to {} }', 'animation: name duration timing', 'animation-fill-mode: forwards to keep end state'],
    tags: ['css', 'keyframes', 'animation', 'fadeIn'],
    concepts: ['web-css-animation'],
  },

  {
    id: 'css-anim-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.CSS_BASICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Create a spinning loader using CSS: a .spinner element that is a 40px circle with a 4px border (top border colored blue, rest transparent), rotating infinitely.',
    starterCode: `.spinner {\n`,
    testCases: [{ input: 'spinner', expectedOutput: 'border with transparent + colored, animation rotate infinite', description: 'Should create CSS spinner' }],
    solution: `@keyframes spin {\n  to { transform: rotate(360deg); }\n}\n\n.spinner {\n  width: 40px;\n  height: 40px;\n  border: 4px solid transparent;\n  border-top-color: #3b82f6;\n  border-radius: 50%;\n  animation: spin 0.8s linear infinite;\n}`,
    explanation: 'border-radius: 50% makes a circle. Transparent borders with one colored side creates the spinner appearance. linear timing keeps constant speed. infinite repeats forever. This is the pure CSS alternative to loading GIFs.',
    hints: ['border-radius: 50% for circle', 'One colored border side, rest transparent', 'animation: ... infinite for continuous'],
    tags: ['css', 'spinner', 'animation', 'loading'],
    concepts: ['next-streaming-suspense'],
  },

  // ===== CSS_LAYOUT =====
  // Intermediate Coding

  {
    id: 'css-layout-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_LAYOUT,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Fill in (1) the display value that creates a flex container, (2) the property that spreads items to the edges horizontally, (3) the property that centers them vertically.',
    template: `.navbar {
  display: ___;
  ___: space-between;
  ___: center;
}`,
    blanks: ['flex', 'justify-content', 'align-items'],
    solution: `.navbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}`,
    explanation: 'display: flex makes a flex container. On the default row direction, justify-content controls the MAIN (horizontal) axis and align-items the CROSS (vertical) axis.',
    hints: ['flex; main-axis distribution; cross-axis alignment.'],
    tags: ['css', 'flexbox', 'layout'],
    concepts: ['web-css-flexbox'],
  },

  {
    id: 'css-layout-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_LAYOUT,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Fill in (1) the display value for a grid, and (2) the value that makes exactly 3 equal-width columns using a repeat function with fr units.',
    template: `.grid {
  display: ___;
  grid-template-columns: ___;
}`,
    blanks: ['grid', 'repeat(3, 1fr)'],
    blankAlternates: [['grid'], ['repeat(3,1fr)', '1fr 1fr 1fr']],
    solution: `.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n}`,
    explanation: 'display: grid enables 2D grid layout. repeat(3, 1fr) is shorthand for "1fr 1fr 1fr" — three columns each taking one equal fraction of the free space.',
    hints: ['grid; repeat(count, 1fr).'],
    tags: ['css', 'grid', 'layout'],
    concepts: ['web-css-grid'],
  },

  {
    id: 'css-layout-cloze-3',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_LAYOUT,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Fill in the two flex properties that center children, in order: (1) horizontal centering, then (2) vertical centering.',
    template: `.overlay {
  display: flex;
  ___: center;
  ___: center;
}`,
    blanks: ['justify-content', 'align-items'],
    solution: `.overlay {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}`,
    explanation: 'With the default row direction, justify-content: center centers along the horizontal (main) axis and align-items: center along the vertical (cross) axis — the classic flexbox centering pattern.',
    hints: ['Main-axis property first, then cross-axis property.'],
    tags: ['css', 'flexbox', 'centering'],
    concepts: ['web-css-flexbox'],
  },

  {
    id: 'css-layout-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_LAYOUT,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Write CSS for a .navbar class using flexbox to: arrange items in a row, space them evenly, center them vertically, with a gap of 16px.',
    starterCode: `.navbar {\n`,
    testCases: [
      {
        input: 'navbar layout',
        expectedOutput: 'display: flex; justify-content; align-items; gap',
        description: 'Should create flex navbar',
      },
    ],
    solution: `.navbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 16px;\n}`,
    explanation: 'display: flex creates a flex container. justify-content controls horizontal distribution (space-between spreads items to edges). align-items: center vertically centers items. gap adds consistent spacing between children.',
    hints: ['display: flex activates flexbox', 'justify-content for horizontal, align-items for vertical', 'gap for spacing between items'],
    tags: ['css', 'flexbox', 'layout', 'navbar'],
    concepts: ['web-css-flexbox'],
  },

  {
    id: 'css-layout-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_LAYOUT,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Write CSS for a .grid-container that creates a responsive 3-column grid with 16px gap. Each column should be equal width using fr units.',
    starterCode: `/* Declare .grid-container using display: grid, repeat(3, 1fr), and gap: 16px */
`,
    testCases: [
      {
        input: 'grid layout',
        expectedOutput: 'display: grid; grid-template-columns: repeat(3, 1fr); gap',
        description: 'Should create 3-column grid',
      },
    ],
    solution: `.grid-container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}`,
    explanation: 'CSS Grid is for 2D layouts. grid-template-columns defines column sizes. repeat(3, 1fr) creates 3 equal columns. 1fr means "1 fraction of available space". gap works for both rows and columns.',
    hints: ['display: grid activates grid', 'repeat(n, size) for repeated columns', '1fr = equal share of available space'],
    tags: ['css', 'grid', 'layout', 'columns'],
    concepts: ['web-css-grid'],
  },

  {
    id: 'css-layout-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_LAYOUT,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Center a .modal both horizontally and vertically on the page using flexbox on its parent .overlay.',
    starterCode: `.overlay {\n`,
    testCases: [
      {
        input: 'centered modal',
        expectedOutput: 'display: flex; justify-content: center; align-items: center',
        description: 'Should center content with flexbox',
      },
    ],
    solution: `.overlay {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n}`,
    explanation: 'The classic centering pattern: flex container with justify-content: center (horizontal) and align-items: center (vertical). position: fixed + full width/height covers the entire viewport. This is the modern replacement for old margin/transform hacks.',
    hints: ['justify-content: center for horizontal', 'align-items: center for vertical', 'Parent needs height for vertical centering to work'],
    tags: ['css', 'flexbox', 'centering', 'modal'],
    concepts: ['web-css-flexbox'],
  },

  // ===== CSS_RESPONSIVE =====
  // Intermediate MC → Intermediate Coding

  {
    id: 'css-resp-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_RESPONSIVE,
    course: Course.WEB_DEV,
    question: 'What meta tag is required for responsive design to work properly on mobile devices?',
    options: [
      { id: 'a', text: '<meta name="viewport" content="width=device-width, initial-scale=1.0">', isCorrect: true },
      { id: 'b', text: '<meta name="mobile" content="true">', isCorrect: false },
      { id: 'c', text: '<meta name="responsive" content="yes">', isCorrect: false },
      { id: 'd', text: 'No meta tag is needed', isCorrect: false },
    ],
    explanation: 'Without the viewport meta tag, mobile browsers render the page at desktop width (typically 980px) and zoom out. width=device-width sets the viewport to the device width. initial-scale=1.0 sets the initial zoom level. Always include this.',
    tags: ['viewport', 'responsive', 'meta', 'mobile'],
    concepts: ['web-css-responsive'],
  },

  {
    id: 'css-resp-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_RESPONSIVE,
    course: Course.WEB_DEV,
    question: 'What are common responsive breakpoints?',
    options: [
      { id: 'a', text: 'sm: 640px (mobile landscape), md: 768px (tablet), lg: 1024px (desktop), xl: 1280px (large desktop), 2xl: 1536px', isCorrect: true },
      { id: 'b', text: 'There is only one breakpoint at 800px', isCorrect: false },
      { id: 'c', text: 'Breakpoints are only for mobile phones', isCorrect: false },
      { id: 'd', text: 'You should never use breakpoints', isCorrect: false },
    ],
    explanation: 'These match Tailwind CSS defaults and are widely adopted. Mobile-first: write base styles for mobile, then use min-width media queries to add desktop overrides. Design for the most constrained screen first.',
    tags: ['responsive', 'breakpoints', 'mobile-first', 'css'],
    concepts: ['web-css-responsive'],
  },

  {
    id: 'css-resp-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_RESPONSIVE,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Assemble a mobile-first responsive grid: the base .grid rule (1 column) FIRST, then a min-width 768px media query that overrides it to 3 columns.',
    correctOrder: [
      '.grid {',
      '  grid-template-columns: 1fr;',
      '}',
      '',
      '@media (min-width: 768px) {',
      '  .grid {',
      '    grid-template-columns: repeat(3, 1fr);',
      '  }',
      '}',
    ],
    distractorLines: [
      '@media (max-width: 768px) {',
      '  .grid { columns: 3; }',
    ],
    solution: `.grid {\n  grid-template-columns: 1fr;\n}\n\n@media (min-width: 768px) {\n  .grid {\n    grid-template-columns: repeat(3, 1fr);\n  }\n}`,
    explanation: 'Mobile-first means base styles target the smallest screen (1 column) and min-width media queries add enhancements for larger screens (3 columns at 768px+). Using min-width (not max-width) keeps the base case simplest.',
    hints: ['Base mobile rule first; then @media (min-width: ...) override.'],
    tags: ['css', 'responsive', 'media-query', 'mobile-first'],
    concepts: ['web-css-responsive'],
  },

  {
    id: 'css-resp-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_RESPONSIVE,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Fill in (1) the at-rule that applies styles conditionally by screen size, and (2) the media feature that targets screens at least 768px wide (mobile-first).',
    template: `___ (___: 768px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}`,
    blanks: ['@media', 'min-width'],
    solution: `@media (min-width: 768px) {\n  .grid { grid-template-columns: repeat(3, 1fr); }\n}`,
    explanation: '@media wraps conditional styles. min-width applies the rules when the viewport is at least that wide — the mobile-first direction. max-width would instead target screens up to that width.',
    hints: ['The at-rule for media queries; the "at least this wide" feature.'],
    tags: ['css', 'responsive', 'media-query'],
    concepts: ['web-css-responsive'],
  },

  {
    id: 'css-resp-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_RESPONSIVE,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Fill in (1) the property that caps the element width on large screens and (2) the margin value that centers it horizontally.',
    template: `.container {
  ___: 1200px;
  margin: ___;
}`,
    blanks: ['max-width', '0 auto'],
    blankAlternates: [['max-width'], ['0 auto', 'auto']],
    solution: `.container {\n  max-width: 1200px;\n  margin: 0 auto;\n}`,
    explanation: 'max-width lets the element shrink on small screens but caps it on large ones. margin: 0 auto sets top/bottom to 0 and left/right to auto, which centers a block horizontally within its parent.',
    hints: ['Width cap property; "0 auto" centers a block.'],
    tags: ['css', 'responsive', 'container', 'centering'],
    concepts: ['web-css-responsive'],
  },

  {
    id: 'css-resp-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_RESPONSIVE,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Write a media query that changes a .grid from 3 columns to 1 column on screens smaller than 768px (mobile-first approach).',
    starterCode: `/* Write mobile-first CSS: base .grid uses display: grid with a single column */\n/* Add a @media (min-width: 768px) rule that expands .grid to 3 equal columns */\n`,
    testCases: [
      {
        input: 'responsive grid',
        expectedOutput: '@media (min-width: 768px) { grid-template-columns: repeat(3, 1fr) }',
        description: 'Should use media query for responsive grid',
      },
    ],
    solution: `.grid {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 16px;\n}\n\n@media (min-width: 768px) {\n  .grid {\n    grid-template-columns: repeat(3, 1fr);\n  }\n}`,
    explanation: 'Mobile-first: base styles are for mobile (1 column), then @media (min-width) adds desktop overrides (3 columns). This is better than max-width because mobile styles are simpler and load first. 768px is a common tablet breakpoint.',
    hints: ['Mobile-first: base = mobile, media query = desktop', 'Use min-width for mobile-first', '768px is the common tablet breakpoint'],
    tags: ['css', 'responsive', 'media-query', 'mobile-first'],
    concepts: ['web-css-responsive'],
  },

  {
    id: 'css-resp-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_RESPONSIVE,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Write CSS for a .container class that: has max-width of 1200px, auto horizontal margins (centered), and responsive padding (16px on mobile, 32px on tablet+).',
    starterCode: `.container {\n`,
    testCases: [{ input: 'responsive container', expectedOutput: 'max-width, margin auto, responsive padding', description: 'Should create responsive container' }],
    solution: `.container {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 0 16px;\n}\n\n@media (min-width: 768px) {\n  .container {\n    padding: 0 32px;\n  }\n}`,
    explanation: 'max-width limits width on large screens. margin: 0 auto centers horizontally. Mobile-first: base padding is small, media query increases it for larger screens. This is the standard container pattern used by most CSS frameworks.',
    hints: ['max-width + margin auto for centering', 'Mobile-first: small padding base', 'Media query increases for larger screens'],
    tags: ['css', 'responsive', 'container', 'centering'],
    concepts: ['web-css-responsive', 'web-css-flexbox'],
  },

  {
    id: 'css-resp-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.CSS_RESPONSIVE,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Create a responsive navigation that is a vertical column on mobile and a horizontal row on desktop (768px+). Hide the nav on mobile behind a hamburger-style toggle using a checkbox hack.',
    starterCode: `.nav {\n`,
    testCases: [{ input: 'responsive nav', expectedOutput: 'flex-direction column/row with media query', description: 'Should create responsive nav' }],
    solution: `.nav {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n\n.nav-toggle {\n  display: block;\n}\n\n.nav-links {\n  display: none;\n}\n\n.nav-toggle:checked ~ .nav-links {\n  display: flex;\n  flex-direction: column;\n}\n\n@media (min-width: 768px) {\n  .nav {\n    flex-direction: row;\n    align-items: center;\n  }\n  .nav-toggle {\n    display: none;\n  }\n  .nav-links {\n    display: flex;\n    flex-direction: row;\n    gap: 16px;\n  }\n}`,
    explanation: 'Mobile: nav-links hidden, checkbox toggle shows/hides them. Desktop: toggle hidden, nav-links always visible in a row. The ~ sibling combinator with :checked creates a CSS-only toggle without JavaScript.',
    hints: ['Hide nav-links on mobile by default', 'Show on checkbox :checked with ~ combinator', 'Media query shows everything on desktop'],
    tags: ['responsive', 'navigation', 'hamburger', 'css'],
    concepts: ['web-css-responsive'],
  },

  // ===== TAILWIND =====
  // Beginner MC → Intermediate Coding

  {
    id: 'tw-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TAILWIND,
    course: Course.WEB_DEV,
    question: 'What is Tailwind CSS?',
    options: [
      { id: 'a', text: 'A component library like Bootstrap', isCorrect: false },
      { id: 'b', text: 'A utility-first CSS framework that provides low-level utility classes (like p-4, flex, text-center) that you compose to build designs directly in HTML', isCorrect: true },
      { id: 'c', text: 'A CSS preprocessor like Sass', isCorrect: false },
      { id: 'd', text: 'A JavaScript framework', isCorrect: false },
    ],
    explanation: 'Unlike Bootstrap (pre-built components), Tailwind provides tiny utility classes. Instead of writing custom CSS, you apply classes: <div class="p-4 bg-white rounded-lg shadow-md">. It purges unused classes in production for tiny file sizes.',
    tags: ['tailwind', 'utility-first', 'fundamentals'],
    concepts: ['web-tailwind-utility'],
  },

  {
    id: 'tw-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TAILWIND,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Fill in the single Tailwind utility class for a medium box-shadow (the surrounding classes give the card its background, rounding, and padding).',
    template: `<div class="bg-white rounded-lg ___ p-6">Card</div>`,
    blanks: ['shadow-md'],
    solution: `<div class="bg-white rounded-lg shadow-md p-6">Card</div>`,
    explanation: 'Tailwind shadows scale shadow-sm < shadow < shadow-md < shadow-lg < shadow-xl. Utilities are composed directly in the class attribute — no custom CSS.',
    hints: ['shadow-{size}; medium is the "-md" step.'],
    tags: ['tailwind', 'utility', 'shadow'],
    concepts: ['web-tailwind-utility'],
  },

  {
    id: 'tw-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TAILWIND,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Fill in the responsive grid classes in order: (1) 1 column on mobile, (2) 2 columns from the md breakpoint, (3) 3 columns from lg.',
    template: `<div class="grid ___ ___ ___ gap-6"></div>`,
    blanks: ['grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3'],
    solution: `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>`,
    explanation: 'Unprefixed classes apply at every size (mobile-first); breakpoint prefixes (md:, lg:) apply from that width up. Stacking grid-cols-1 / md:grid-cols-2 / lg:grid-cols-3 progressively adds columns.',
    hints: ['grid-cols-{n}; prefix with md:/lg: for larger screens.'],
    tags: ['tailwind', 'responsive', 'grid'],
    concepts: ['web-tailwind-utility', 'web-css-responsive'],
  },

  {
    id: 'tw-cloze-3',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TAILWIND,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Fill in (1) the class for a vertical (column) flex layout on mobile, and (2) the class for a horizontal (row) layout from the md breakpoint up.',
    template: `<nav class="flex ___ ___ gap-4 items-center"></nav>`,
    blanks: ['flex-col', 'md:flex-row'],
    solution: `<nav class="flex flex-col md:flex-row gap-4 items-center"></nav>`,
    explanation: 'flex-col stacks children vertically (mobile default); md:flex-row switches to a horizontal row at 768px+. This is the standard responsive navbar pattern in Tailwind.',
    hints: ['flex-col for mobile; md:flex-row for desktop.'],
    tags: ['tailwind', 'responsive', 'flex'],
    concepts: ['web-tailwind-utility', 'web-css-flexbox'],
  },

  {
    id: 'tw-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TAILWIND,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Using Tailwind classes, create a card div with: white background, rounded corners (lg), shadow (md), padding (6), and margin-bottom (4).',
    starterCode: `<!-- Tailwind card -->\n<div class="`,
    testCases: [
      {
        input: 'card component',
        expectedOutput: 'bg-white rounded-lg shadow-md p-6 mb-4',
        description: 'Should use correct Tailwind utilities',
      },
    ],
    solution: `<div class="bg-white rounded-lg shadow-md p-6 mb-4">\n  <h2 class="text-xl font-bold">Card Title</h2>\n  <p class="text-gray-600">Card content here.</p>\n</div>`,
    explanation: 'bg-white = white background. rounded-lg = large border radius. shadow-md = medium box shadow. p-6 = 1.5rem padding. mb-4 = 1rem margin bottom. text-xl = 1.25rem font. font-bold = bold. text-gray-600 = gray text.',
    hints: ['p-{n} for padding, m-{n} for margin', 'bg-{color} for backgrounds', 'rounded-{size} for border radius'],
    tags: ['tailwind', 'card', 'utilities'],
    concepts: ['web-tailwind-utility'],
  },

  {
    id: 'tw-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TAILWIND,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Using Tailwind, create a responsive flex navbar: items in a row on desktop, column on mobile. Use flex-col for mobile, md:flex-row for desktop, with gap-4 and items centered.',
    starterCode: `<!-- Responsive navbar -->\n<nav class="`,
    testCases: [
      {
        input: 'responsive navbar',
        expectedOutput: 'flex flex-col md:flex-row gap-4 items-center',
        description: 'Should use responsive Tailwind classes',
      },
    ],
    solution: `<nav class="flex flex-col md:flex-row gap-4 items-center p-4">\n  <a href="/" class="hover:text-blue-500">Home</a>\n  <a href="/about" class="hover:text-blue-500">About</a>\n  <a href="/contact" class="hover:text-blue-500">Contact</a>\n</nav>`,
    explanation: 'Tailwind responsive prefixes: sm: (640px+), md: (768px+), lg: (1024px+), xl: (1280px+). Base classes apply to mobile, prefixed classes apply at that breakpoint and above. flex-col = vertical on mobile, md:flex-row = horizontal on desktop.',
    hints: ['No prefix = mobile, md: = 768px+', 'flex-col for vertical, flex-row for horizontal', 'hover: prefix for hover states'],
    tags: ['tailwind', 'responsive', 'navbar', 'flex'],
    concepts: ['web-tailwind-utility', 'web-css-responsive', 'web-css-flexbox'],
  },

  {
    id: 'tw-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TAILWIND,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Using Tailwind, create a 3-column responsive grid: 1 column on mobile, 2 on tablet (md), 3 on desktop (lg), with gap-6.',
    starterCode: `<!-- Responsive grid -->\n<div class="`,
    testCases: [
      {
        input: 'responsive grid',
        expectedOutput: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
        description: 'Should create responsive Tailwind grid',
      },
    ],
    solution: `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">\n  <div class="bg-white p-4 rounded shadow">Item 1</div>\n  <div class="bg-white p-4 rounded shadow">Item 2</div>\n  <div class="bg-white p-4 rounded shadow">Item 3</div>\n</div>`,
    explanation: 'grid-cols-1 = 1 column (mobile). md:grid-cols-2 = 2 columns at 768px+. lg:grid-cols-3 = 3 columns at 1024px+. This progressive enhancement is the standard responsive grid pattern in Tailwind.',
    hints: ['grid-cols-{n} sets column count', 'Stack breakpoint prefixes for progressive enhancement', 'gap-{n} for grid spacing'],
    tags: ['tailwind', 'grid', 'responsive', 'columns'],
    concepts: ['web-tailwind-utility', 'web-css-grid', 'web-css-responsive'],
  },

  {
    id: 'tw-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TAILWIND,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Using Tailwind, style a primary button with: blue background (bg-blue-500), white text, padding (px-6 py-2), rounded, and hover darkening (hover:bg-blue-600), with a transition.',
    starterCode: `<!-- Styled button -->\n<button class="`,
    testCases: [
      {
        input: 'primary button',
        expectedOutput: 'bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition',
        description: 'Should style button with hover',
      },
    ],
    solution: `<button class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition">\n  Click Me\n</button>`,
    explanation: 'bg-blue-500 = medium blue. text-white = white text. px-6 py-2 = horizontal/vertical padding. rounded = border-radius. hover:bg-blue-600 = darker on hover. transition = smooth CSS transition. This is the standard Tailwind button pattern.',
    hints: ['hover: prefix for hover states', 'transition adds smooth animation', 'px = horizontal padding, py = vertical'],
    tags: ['tailwind', 'button', 'hover', 'styling'],
    concepts: ['web-tailwind-utility'],
  },

  // ===== HTML_CSS_PROJECT =====
  // Advanced Coding

  {
    id: 'htmlcss-project-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.HTML_CSS_PROJECT,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: `Build a responsive landing-page hero section using Tailwind utility classes.

The outer element is a full-width <section> that fills at least the viewport height. Its background is a left-to-right gradient from blue-500 to purple-600, and its contents are centred both horizontally and vertically.

Inside the section, place a centred container holding (in order): a large heading, a subtitle paragraph, and a row of two buttons (a primary solid button and an outline button).

The hero must be responsive:

- On mobile (default), the heading uses a smaller text size; on md screens and up, it scales to a larger one — pick a sensible pair (e.g. text-3xl → text-5xl).
- The two buttons stack vertically on mobile and sit side-by-side from sm upward.
- Constrain the inner container to a comfortable max width so prose doesn't span the full screen on large monitors.

Add at least one hover transition on the primary button (e.g. background or scale).`,
    starterCode: `<!-- Hero section -->\n<section class="`,
    testCases: [
      {
        input: 'hero section',
        expectedOutput: 'gradient bg, centered flex, responsive text, two styled buttons',
        description: 'Should create responsive hero with Tailwind',
      },
    ],
    solution: `<section class="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen flex items-center justify-center px-4">\n  <div class="text-center text-white max-w-2xl">\n    <h1 class="text-3xl md:text-5xl font-bold mb-4">Welcome to Our Platform</h1>\n    <p class="text-lg md:text-xl mb-8 opacity-90">Build something amazing with modern tools.</p>\n    <div class="flex flex-col sm:flex-row gap-4 justify-center">\n      <a href="#" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition">Get Started</a>\n      <a href="#" class="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-blue-600 transition">Learn More</a>\n    </div>\n  </div>\n</section>`,
    explanation: 'This combines: gradient background (bg-gradient-to-r from-X to-Y), flex centering, responsive text sizes (text-3xl md:text-5xl), responsive button layout (flex-col sm:flex-row), hover state transitions, and max-width container. This is a production-ready hero pattern.',
    hints: ['bg-gradient-to-r with from/to colors', 'min-h-screen for full viewport height', 'flex items-center justify-center for centering', 'Responsive text: text-3xl md:text-5xl'],
    tags: ['project', 'tailwind', 'hero', 'responsive', 'gradient'],
    concepts: ['web-tailwind-utility', 'web-css-responsive'],
  },

  {
    id: 'htmlcss-project-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.HTML_CSS_PROJECT,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: `Build a responsive three-tier pricing section using Tailwind.

The outer element is a <section> with vertical padding and a neutral page background. Inside it, render three pricing cards: "Starter", "Pro", and "Enterprise". Each card is an <article> containing a tier name, a price (e.g. "$9/mo"), a short description, an unordered list of three feature bullets, and a call-to-action button.

Layout:

- On mobile, the cards stack vertically.
- From md screens and up, they sit in a three-column grid with a gap between them.
- Each card has a white background, rounded corners, padding, and a subtle shadow.

The MIDDLE card ("Pro") is visually highlighted as the recommended option:

- It has a coloured border or a slightly larger scale (e.g. md:scale-105) so it visually pops on desktop.
- Its CTA button uses the primary solid style; the other two use an outline style.

Each card must lift slightly on hover (e.g. shadow grows, or translateY) with a transition. Use semantic HTML (<section>, <article>, <h3>, <ul>, <li>) — don't reach for <div> for everything.`,
    starterCode: `<section class="`,
    testCases: [
      {
        input: 'three-tier pricing grid',
        expectedOutput: 'responsive grid, three article cards, middle card highlighted, hover lift',
        description: 'Should render three pricing cards with the middle one visually featured',
      },
    ],
    solution: `<section class="bg-gray-50 py-16 px-4">
  <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
    <article class="bg-white rounded-lg shadow p-8 hover:shadow-xl transition">
      <h3 class="text-xl font-bold mb-2">Starter</h3>
      <p class="text-3xl font-bold mb-2">$9<span class="text-base font-normal">/mo</span></p>
      <p class="text-gray-600 mb-6">For solo developers getting started.</p>
      <ul class="space-y-2 mb-6 text-gray-700">
        <li>1 project</li>
        <li>5 GB storage</li>
        <li>Email support</li>
      </ul>
      <a href="#" class="block text-center border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-blue-600 hover:text-white transition">Choose Starter</a>
    </article>
    <article class="bg-white rounded-lg shadow-lg p-8 border-2 border-blue-600 md:scale-105 hover:shadow-xl transition">
      <h3 class="text-xl font-bold mb-2">Pro</h3>
      <p class="text-3xl font-bold mb-2">$29<span class="text-base font-normal">/mo</span></p>
      <p class="text-gray-600 mb-6">For growing teams shipping fast.</p>
      <ul class="space-y-2 mb-6 text-gray-700">
        <li>Unlimited projects</li>
        <li>50 GB storage</li>
        <li>Priority support</li>
      </ul>
      <a href="#" class="block text-center bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition">Choose Pro</a>
    </article>
    <article class="bg-white rounded-lg shadow p-8 hover:shadow-xl transition">
      <h3 class="text-xl font-bold mb-2">Enterprise</h3>
      <p class="text-3xl font-bold mb-2">$99<span class="text-base font-normal">/mo</span></p>
      <p class="text-gray-600 mb-6">For large orgs with custom needs.</p>
      <ul class="space-y-2 mb-6 text-gray-700">
        <li>SSO and SAML</li>
        <li>Unlimited storage</li>
        <li>Dedicated rep</li>
      </ul>
      <a href="#" class="block text-center border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-blue-600 hover:text-white transition">Choose Enterprise</a>
    </article>
  </div>
</section>`,
    explanation: 'Integrates: CSS Grid responsive layout (grid-cols-1 → md:grid-cols-3), semantic HTML (article/h3/ul), card-as-component pattern, visual hierarchy via the featured-card styling (border + scale), hover transitions, and the outline-vs-solid button contrast that signals primary CTA. The md:scale-105 on the middle card is a small touch but does most of the heavy lifting for "this is the one we want you to pick."',
    hints: [
      'grid-cols-1 md:grid-cols-3 gives the responsive layout in two utility classes.',
      'md:scale-105 + border-2 border-blue-600 is enough to visually feature the middle card.',
      'transition on the article makes the hover shadow change feel smooth.',
    ],
    tags: ['project', 'tailwind', 'pricing', 'grid', 'responsive', 'cards'],
    concepts: ['web-tailwind-utility', 'web-css-grid', 'web-css-responsive'],
  },

  {
    id: 'htmlcss-project-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.HTML_CSS_PROJECT,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: `Build a sticky responsive navigation bar using Tailwind, with a desktop menu that collapses behind a hamburger toggle on mobile.

Use a <header> wrapping a <nav>. The header is sticky to the top of the viewport (sticky top-0) with a white background, a subtle bottom border, and a high z-index so it sits above page content.

Inside the nav, lay out three groups in a single row: the brand mark on the left, the primary links in the middle/right, and a sign-in button on the far right. Use flex with items-center and justify-between for the row.

Responsive behaviour:

- From md upward, the primary links and the sign-in button are visible inline.
- Below md, the primary links and sign-in button are HIDDEN and a hamburger button appears in their place. The hamburger uses the appropriate aria attributes (aria-label="Toggle menu", aria-expanded, aria-controls) — write the markup as if a small bit of JS will toggle aria-expanded; you don't need to write the JS.
- The hidden mobile menu is a separate container below the nav row, also collapsed by default. (Class it "hidden" — the JS would toggle that.)

Use semantic HTML (<header>, <nav>, an unordered <ul> for the link group), keep links keyboard-focusable with a visible focus ring, and ensure the brand mark is wrapped in an <a href="/"> for click-to-home.`,
    starterCode: `<header class="`,
    testCases: [
      {
        input: 'sticky responsive nav',
        expectedOutput: 'sticky header, flex row, desktop links visible at md+, hamburger replaces them on mobile, mobile menu hidden by default',
        description: 'Should render sticky nav with mobile hamburger fallback',
      },
    ],
    solution: `<header class="sticky top-0 z-50 bg-white border-b border-gray-200">
  <nav class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
    <a href="/" class="text-xl font-bold text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded">Acme</a>

    <ul class="hidden md:flex items-center gap-6 text-gray-700">
      <li><a href="#" class="hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded">Product</a></li>
      <li><a href="#" class="hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded">Pricing</a></li>
      <li><a href="#" class="hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded">Docs</a></li>
    </ul>

    <a href="#" class="hidden md:inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition">Sign in</a>

    <button
      type="button"
      aria-label="Toggle menu"
      aria-expanded="false"
      aria-controls="mobile-menu"
      class="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
    </button>
  </nav>

  <div id="mobile-menu" class="hidden md:hidden border-t border-gray-200 px-4 py-3">
    <ul class="space-y-2 text-gray-700">
      <li><a href="#" class="block py-1 hover:text-blue-600">Product</a></li>
      <li><a href="#" class="block py-1 hover:text-blue-600">Pricing</a></li>
      <li><a href="#" class="block py-1 hover:text-blue-600">Docs</a></li>
      <li><a href="#" class="block py-1 font-bold text-blue-600">Sign in</a></li>
    </ul>
  </div>
</header>`,
    explanation: 'Integrates: sticky positioning (sticky top-0 with z-index), flex row with justify-between for the three-column nav, the hidden / md:flex / md:hidden trio that powers the responsive show-hide of desktop links and the hamburger, accessibility attributes on the toggle (aria-label, aria-expanded, aria-controls) so screen readers announce state, semantic HTML (header > nav > ul/a), and visible focus rings so keyboard users can see where they are. The mobile menu container is the small bit of "structure you write now, JS toggles later" pattern that\'s common in real codebases.',
    hints: [
      'Pair `hidden md:flex` (or `md:inline-block`) with `md:hidden` to swap desktop and mobile UI.',
      'Sticky needs both `sticky` and `top-0` on the same element; without `top-0` it never engages.',
      'aria-expanded on a toggle button MUST be wired up by JS in real code; the markup just declares the contract.',
    ],
    tags: ['project', 'tailwind', 'navbar', 'responsive', 'accessibility', 'sticky'],
    concepts: ['web-tailwind-utility', 'web-css-responsive', 'a11y-aria-roles'],
  },

  // ===== JS_VARIABLES_TYPES =====
  // Beginner MC → Beginner Coding → Intermediate MC → Intermediate Coding

  {
    id: 'js-var-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_VARIABLES_TYPES,
    course: Course.WEB_DEV,
    question: 'What is the difference between let, const, and var in JavaScript?',
    options: [
      { id: 'a', text: 'let and const are block-scoped; var is function-scoped. const cannot be reassigned; let and var can.', isCorrect: true },
      { id: 'b', text: 'They are all identical', isCorrect: false },
      { id: 'c', text: 'const is faster than let', isCorrect: false },
      { id: 'd', text: 'var is block-scoped, let is function-scoped', isCorrect: false, misconceptionTag: 'js-let-vs-var-scope' },
    ],
    explanation: 'var is function-scoped and hoisted. let and const are block-scoped ({}). const prevents reassignment but does NOT make objects immutable — you can still modify properties of a const object.',
    tags: ['variables', 'let', 'const', 'var', 'scope'],
    concepts: ['js-var-let-const', 'js-closures'],
  },

  {
    id: 'js-var-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_VARIABLES_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Use destructuring to extract "name" and "age" from the object person = { name: "Alice", age: 30, city: "London" }.',
    starterCode: `const person = { name: "Alice", age: 30, city: "London" };\n\n// Destructure name and age\n`,
    testCases: [
      {
        input: 'person object',
        expectedOutput: 'const { name, age } = person',
        description: 'Should destructure name and age',
      },
    ],
    solution: `const person = { name: "Alice", age: 30, city: "London" };\n\nconst { name, age } = person;`,
    explanation: 'Object destructuring extracts properties into variables with matching names. You can also rename: const { name: firstName } = person; or set defaults: const { name, role = "user" } = person;',
    hints: ['Use const { prop1, prop2 } = object', 'Variable names must match property names'],
    tags: ['destructuring', 'objects', 'es6'],
    concepts: ['js-spread-destructuring', 'js-object-mutation'],
  },

  {
    id: 'js-var-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_VARIABLES_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Use array destructuring to extract the first two elements from the array colors = ["red", "green", "blue", "yellow"] into variables "primary" and "secondary".',
    starterCode: `// Declare colors as in the prompt\n// Use array destructuring to pull the first two elements into primary and secondary\n`,
    testCases: [
      {
        input: 'colors array',
        expectedOutput: 'const [primary, secondary] = colors',
        description: 'Should destructure first two elements',
      },
    ],
    solution: `const colors = ["red", "green", "blue", "yellow"];\n\nconst [primary, secondary] = colors;`,
    explanation: 'Array destructuring assigns elements by position. Use commas to skip: const [first, , third] = arr; Use rest: const [first, ...rest] = arr;',
    hints: ['Use const [a, b] = array', 'Elements are assigned by position'],
    tags: ['destructuring', 'arrays', 'es6'],
    concepts: ['js-spread-destructuring', 'js-array-methods'],
  },

  {
    id: 'js-var-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_VARIABLES_TYPES,
    course: Course.WEB_DEV,
    question: 'What does typeof null return in JavaScript?',
    options: [
      { id: 'a', text: '"null"', isCorrect: false },
      { id: 'b', text: '"object" — this is a known bug in JavaScript that has never been fixed for backward compatibility', isCorrect: true },
      { id: 'c', text: '"undefined"', isCorrect: false },
      { id: 'd', text: '"boolean"', isCorrect: false },
    ],
    explanation: 'typeof null === "object" is a legacy bug from the first JavaScript implementation. Use value === null for null checks. Other typeof results: "string", "number", "boolean", "undefined", "function", "symbol", "bigint".',
    tags: ['typeof', 'null', 'types', 'quirks'],
    concepts: ['ts-narrowing'],
  },

  {
    id: 'js-var-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_VARIABLES_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Use the spread operator to merge two objects: defaults = { theme: "dark", lang: "en" } and userPrefs = { lang: "fr", fontSize: 16 }. User prefs should override defaults.',
    starterCode: `const defaults = { theme: "dark", lang: "en" };\nconst userPrefs = { lang: "fr", fontSize: 16 };\n\n// your code here\n`,
    testCases: [
      {
        input: 'two objects',
        expectedOutput: 'const merged = { ...defaults, ...userPrefs }',
        description: 'Should merge with spread operator',
      },
    ],
    solution: `const defaults = { theme: "dark", lang: "en" };\nconst userPrefs = { lang: "fr", fontSize: 16 };\n\nconst merged = { ...defaults, ...userPrefs };`,
    explanation: 'The spread operator (...) copies properties into a new object. Later spreads override earlier ones. Result: { theme: "dark", lang: "fr", fontSize: 16 }. This creates a shallow copy.',
    hints: ['Use { ...obj1, ...obj2 }', 'Later properties override earlier ones'],
    tags: ['spread', 'merge', 'objects', 'es6'],
    concepts: ['js-spread-destructuring', 'js-object-mutation'],
  },

  // ===== JS_FUNCTIONS =====
  // Beginner Coding → Intermediate MC → Intermediate Coding

  {
    id: 'js-fn-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_FUNCTIONS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Write an arrow function called "double" that takes a number and returns it doubled.',
    starterCode: `// Arrow function\n`,
    testCases: [
      {
        input: '5',
        expectedOutput: 'const double = (n) => n * 2',
        description: 'Should double the input',
      },
    ],
    solution: `const double = (n) => n * 2;\n# OR\nconst double = n => n * 2;`,
    explanation: 'Arrow functions provide concise syntax. Single-parameter functions can omit parentheses: n => n * 2. Single-expression bodies have implicit return (no braces needed). Arrow functions do not have their own "this".',
    hints: ['Use => for arrow function', 'Single expression = implicit return'],
    tags: ['arrow-function', 'functions', 'es6'],
    concepts: ['js-this-binding'],
  },

  {
    id: 'js-fn-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_FUNCTIONS,
    course: Course.WEB_DEV,
    question: 'What is the key difference between arrow functions and regular functions regarding "this"?',
    options: [
      { id: 'a', text: 'Arrow functions are faster', isCorrect: false },
      { id: 'b', text: 'Regular functions cannot access "this"', isCorrect: false },
      { id: 'c', text: 'Arrow functions inherit "this" from their enclosing scope (lexical this). Regular functions have their own "this" determined by how they are called.', isCorrect: true },
      { id: 'd', text: 'There is no difference', isCorrect: false },
    ],
    explanation: 'Arrow functions have lexical "this" — they capture "this" from where they are defined, not where they are called. This makes them ideal for callbacks. Regular functions bind "this" dynamically based on the call site (obj.method(), new Constructor(), etc.).',
    tags: ['arrow-function', 'this', 'scope', 'functions'],
    concepts: ['js-this-binding', 'js-closures'],
  },

  {
    id: 'js-fn-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_FUNCTIONS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Write a function "createCounter" that returns an object with increment(), decrement(), and getCount() methods using closure to keep the count private.',
    starterCode: `// Closure-based counter\nfunction createCounter() {\n`,
    testCases: [
      {
        input: 'counter usage',
        expectedOutput: 'closure with let count = 0 and returned methods',
        description: 'Should use closure for private state',
      },
    ],
    solution: `function createCounter() {\n  let count = 0;\n  return {\n    increment() { count++; },\n    decrement() { count--; },\n    getCount() { return count; }\n  };\n}`,
    explanation: 'A closure is when a function remembers variables from its outer scope even after the outer function has returned. Here, count is private — only accessible through the returned methods. This is a fundamental pattern for encapsulation in JavaScript.',
    hints: ['Declare count inside createCounter', 'Return an object with methods that access count', 'The methods "close over" the count variable'],
    tags: ['closure', 'encapsulation', 'functions', 'pattern'],
    concepts: ['js-closures'],
  },

  {
    id: 'js-fn-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_FUNCTIONS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Write a higher-order function "withLogging" that takes a function and returns a new function that logs the arguments and result before returning it.',
    starterCode: `// Higher-order function\nfunction withLogging(fn) {\n`,
    testCases: [
      {
        input: 'any function',
        expectedOutput: 'returns wrapper that logs and calls fn',
        description: 'Should create logging wrapper',
      },
    ],
    solution: `function withLogging(fn) {\n  return function(...args) {\n    console.log("Args:", args);\n    const result = fn(...args);\n    console.log("Result:", result);\n    return result;\n  };\n}`,
    explanation: 'A higher-order function takes a function as an argument or returns a function. This pattern (wrapping a function with extra behavior) is called a decorator. It is used extensively in JavaScript: middleware, React HOCs, memoisation.',
    hints: ['Return a new function that calls fn(...args)', 'Use ...args (rest) to accept any arguments', 'Use ...args (spread) to pass them to fn'],
    tags: ['higher-order', 'decorator', 'functions', 'pattern'],
    concepts: ['pattern-structural'],
  },

  // ===== JS_ARRAYS =====
  // Beginner Coding → Intermediate Coding

  {
    id: 'js-arr-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ARRAYS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Given numbers = [1, 2, 3, 4, 5], use map() to create a new array where each number is squared.',
    starterCode: `const numbers = [1, 2, 3, 4, 5];\n\nconst squared = `,
    testCases: [
      {
        input: '[1, 2, 3, 4, 5]',
        expectedOutput: 'numbers.map(n => n * n) or numbers.map(n => n ** 2)',
        description: 'Should square each number',
      },
    ],
    solution: `const numbers = [1, 2, 3, 4, 5];\n\nconst squared = numbers.map(n => n * n);\n# OR\nconst squared = numbers.map(n => n ** 2);`,
    explanation: 'map() creates a new array by applying a function to each element. It does not modify the original array. Result: [1, 4, 9, 16, 25]. Use map when you want to transform every element.',
    hints: ['map() transforms each element', 'n * n or n ** 2 for squaring'],
    tags: ['map', 'arrays', 'transform'],
    concepts: ['js-array-methods'],
  },

  {
    id: 'js-arr-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ARRAYS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Given numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], use filter() to get only the even numbers.',
    starterCode: `const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\n\nconst evens = `,
    testCases: [
      {
        input: '[1..10]',
        expectedOutput: 'numbers.filter(n => n % 2 === 0)',
        description: 'Should filter even numbers',
      },
    ],
    solution: `const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\n\nconst evens = numbers.filter(n => n % 2 === 0);`,
    explanation: 'filter() creates a new array with only elements that pass the test function (return true). Result: [2, 4, 6, 8, 10]. The original array is not modified.',
    hints: ['filter() keeps elements where the callback returns true', 'n % 2 === 0 tests for even'],
    tags: ['filter', 'arrays'],
    concepts: ['js-array-methods'],
  },

  {
    id: 'js-arr-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ARRAYS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Given numbers = [1, 2, 3, 4, 5], use reduce() to calculate the sum of all numbers.',
    starterCode: `const numbers = [1, 2, 3, 4, 5];\n\nconst sum = `,
    testCases: [
      {
        input: '[1, 2, 3, 4, 5]',
        expectedOutput: 'numbers.reduce((acc, n) => acc + n, 0)',
        description: 'Should sum all numbers',
      },
    ],
    solution: `const numbers = [1, 2, 3, 4, 5];\n\nconst sum = numbers.reduce((acc, n) => acc + n, 0);`,
    explanation: 'reduce() accumulates a single value by calling the callback for each element. The first parameter (acc) is the accumulator, second (n) is the current element. 0 is the initial value. Result: 15.',
    hints: ['reduce(callback, initialValue)', 'Callback gets (accumulator, currentElement)'],
    tags: ['reduce', 'arrays', 'accumulate'],
    concepts: ['js-array-methods'],
  },

  {
    id: 'js-arr-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ARRAYS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Declare `const users = [{name: "Alice", age: 25}, {name: "Bob", age: 30}, {name: "Charlie", age: 17}]`. Use `Array.prototype.find()` to assign the FIRST user with `age >= 18` to a `const adult` — expect `{name: "Alice", age: 25}`.',
    starterCode: `const users = [{name: "Alice", age: 25}, {name: "Bob", age: 30}, {name: "Charlie", age: 17}];\n\n// your code here\n`,
    testCases: [
      {
        input: 'users array',
        expectedOutput: 'users.find(u => u.age >= 18)',
        description: 'Should find first adult',
      },
    ],
    solution: `const users = [{name: "Alice", age: 25}, {name: "Bob", age: 30}, {name: "Charlie", age: 17}];\n\nconst adult = users.find(u => u.age >= 18);`,
    explanation: 'find() returns the FIRST element that passes the test, or undefined if none match. Unlike filter() which returns all matches, find() stops at the first match. Result: {name: "Alice", age: 25}.',
    hints: ['find() returns the first match', 'Returns undefined if no match'],
    tags: ['find', 'arrays', 'search'],
    concepts: ['js-array-methods'],
  },

  {
    id: 'js-arr-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_ARRAYS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Chain map and filter: given numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], get the squares of only the even numbers.',
    starterCode: `const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\n\n// your code here\n`,
    testCases: [
      {
        input: '[1..10]',
        expectedOutput: 'numbers.filter(n => n % 2 === 0).map(n => n ** 2)',
        description: 'Should filter then map',
      },
    ],
    solution: `const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\n\nconst result = numbers.filter(n => n % 2 === 0).map(n => n ** 2);`,
    explanation: 'Array methods can be chained because filter() and map() both return new arrays. Filter first (reduce the set), then map (transform). Result: [4, 16, 36, 64, 100]. Order matters for performance — filter first to reduce work for map.',
    hints: ['Chain .filter().map()', 'Filter first, then transform'],
    tags: ['chaining', 'filter', 'map', 'arrays'],
    concepts: ['js-array-methods'],
  },

  // ===== JS_OBJECTS =====
  // Beginner Coding → Intermediate MC → Intermediate Coding → Advanced Coding

  {
    id: 'js-obj-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_OBJECTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Create an object "car" with properties make: "Toyota", model: "Camry", year: 2024, and a method getInfo() that returns "2024 Toyota Camry".',
    starterCode: `const car = {\n`,
    testCases: [{ input: 'car object', expectedOutput: 'object with properties and method', description: 'Should create object with method' }],
    solution: `const car = {\n  make: "Toyota",\n  model: "Camry",\n  year: 2024,\n  getInfo() {\n    return \`\${this.year} \${this.make} \${this.model}\`;\n  }\n};`,
    explanation: 'Object methods can use shorthand syntax: getInfo() {} instead of getInfo: function() {}. "this" refers to the object the method is called on. Template literals combine the values.',
    hints: ['Method shorthand: name() {}', 'this.property accesses the object'],
    tags: ['objects', 'methods', 'this', 'javascript'],
    concepts: ['js-object-mutation', 'js-this-binding'],
  },

  {
    id: 'js-obj-7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_OBJECTS,
    course: Course.WEB_DEV,
    question: 'What is the difference between shallow copy and deep copy?',
    options: [
      { id: 'a', text: 'Shallow copy copies top-level properties (nested objects are still shared references). Deep copy recursively copies everything (fully independent).', isCorrect: true },
      { id: 'b', text: 'Shallow copy is faster and always preferred', isCorrect: false },
      { id: 'c', text: 'Deep copy only works with arrays', isCorrect: false },
      { id: 'd', text: 'There is no difference', isCorrect: false },
    ],
    explanation: '{ ...obj } and Object.assign() create shallow copies — nested objects point to the same memory. Modifying a nested property in the copy modifies the original too. Deep copy (structuredClone, JSON trick) creates fully independent copies.',
    tags: ['shallow-copy', 'deep-copy', 'spread', 'objects'],
    concepts: ['js-spread-destructuring', 'js-object-mutation'],
  },

  {
    id: 'js-obj-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_OBJECTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Given user = { name: "Alice", address: { city: "London", zip: "SW1" } }, use nested destructuring to extract city and zip into separate variables.',
    starterCode: `// Declare user as in the prompt\n// Use nested destructuring: const { address: { city, zip } } = user\n`,
    testCases: [{ input: 'nested object', expectedOutput: 'const { address: { city, zip } } = user', description: 'Should destructure nested object' }],
    solution: `const user = { name: "Alice", address: { city: "London", zip: "SW1" } };\n\nconst { address: { city, zip } } = user;`,
    explanation: 'Nested destructuring follows the object shape: { outer: { inner } }. address: { city, zip } means "go into address and pull out city and zip". The variable "address" itself is NOT created.',
    hints: ['{ outer: { inner } } for nesting', 'The outer key becomes a path, not a variable'],
    tags: ['destructuring', 'nested', 'objects', 'javascript'],
    concepts: ['js-spread-destructuring', 'js-object-mutation'],
  },

  {
    id: 'js-obj-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_OBJECTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Write a function "pick" that takes an object and an array of keys, and returns a new object with only those keys. E.g., pick({a:1, b:2, c:3}, ["a","c"]) returns {a:1, c:3}.',
    starterCode: `function pick(obj, keys) {
  // your code here
}
`,
    testCases: [{ input: 'object and keys', expectedOutput: 'Object.fromEntries or reduce pattern', description: 'Should pick specific keys' }],
    solution: `function pick(obj, keys) {\n  return Object.fromEntries(\n    keys.filter(k => k in obj).map(k => [k, obj[k]])\n  );\n}`,
    explanation: 'Object.fromEntries() converts [key, value] pairs back into an object. filter(k => k in obj) skips keys that don\'t exist. This is a common utility function (lodash _.pick).',
    hints: ['Map keys to [key, value] pairs', 'Object.fromEntries converts pairs to object', '"k in obj" checks if key exists'],
    tags: ['objects', 'utility', 'fromEntries', 'javascript'],
    concepts: ['js-object-mutation'],
  },

  {
    id: 'js-obj-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_OBJECTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Use Object.keys(), Object.values(), and Object.entries() on scores = {math: 90, science: 85, english: 92} to: get the subject names, get the score values, and get [subject, score] pairs.',
    starterCode: `const scores = {math: 90, science: 85, english: 92};

// your code here
`,
    testCases: [{ input: 'scores object', expectedOutput: 'Object.keys, values, entries', description: 'Should use Object static methods' }],
    solution: `const scores = {math: 90, science: 85, english: 92};\n\nconst subjects = Object.keys(scores);\nconst values = Object.values(scores);\nconst pairs = Object.entries(scores);`,
    explanation: 'Object.keys() returns ["math","science","english"]. Object.values() returns [90,85,92]. Object.entries() returns [["math",90],["science",85],["english",92]]. Use entries() for iterating with both key and value.',
    hints: ['keys() for property names', 'values() for property values', 'entries() for [key, value] pairs'],
    tags: ['Object.keys', 'Object.values', 'Object.entries', 'javascript'],
    concepts: ['js-object-mutation'],
  },

  {
    id: 'js-obj-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_OBJECTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Write a function "deepClone" that creates a deep copy of an object (nested objects should be new references, not shared). Use JSON parse/stringify.',
    starterCode: `function deepClone(obj) {\n`,
    testCases: [{ input: 'nested object', expectedOutput: 'JSON.parse(JSON.stringify(obj))', description: 'Should deep clone' }],
    solution: `function deepClone(obj) {\n  return JSON.parse(JSON.stringify(obj));\n}`,
    explanation: 'JSON.parse(JSON.stringify()) is the quick deep clone trick. Limitations: loses functions, undefined, Date objects (become strings), and circular references throw. For production, use structuredClone() (modern) or a library.',
    hints: ['JSON.stringify converts to string', 'JSON.parse converts back to object', 'structuredClone() is the modern alternative'],
    tags: ['deep-clone', 'JSON', 'objects', 'javascript'],
    concepts: ['js-object-mutation'],
  },

  {
    id: 'js-obj-6',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_OBJECTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Use computed property names to create an object where the key comes from a variable. Given key = "color" and value = "blue", create { color: "blue" } dynamically.',
    starterCode: `const key = "color";\nconst value = "blue";\n\n// your code here\n`,
    testCases: [{ input: 'dynamic key', expectedOutput: '{ [key]: value }', description: 'Should use computed property' }],
    solution: `const key = "color";\nconst value = "blue";\n\nconst obj = { [key]: value };`,
    // eslint-disable-next-line no-template-curly-in-string
    explanation: '[expression] in object literal position computes the key at runtime. { [key]: value } becomes { color: "blue" }. Useful for dynamic keys from variables, function returns, or template strings: { [`${prefix}_id`]: 1 }.',
    hints: ['[variable] as key in object literal', 'The expression inside [] is evaluated'],
    tags: ['computed-property', 'dynamic-key', 'objects', 'javascript'],
    concepts: ['js-object-mutation'],
  },

  {
    id: 'js-obj-8',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.JS_OBJECTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Write a function "groupBy" that groups an array of objects by a key. E.g., groupBy([{type:"fruit",name:"apple"},{type:"veg",name:"carrot"},{type:"fruit",name:"banana"}], "type") returns {fruit:[...], veg:[...]}.',
    starterCode: `function groupBy(arr, key) {\n`,
    testCases: [{ input: 'array of objects', expectedOutput: 'reduce to group by key', description: 'Should group by key' }],
    solution: `function groupBy(arr, key) {\n  return arr.reduce((groups, item) => {\n    const val = item[key];\n    groups[val] = groups[val] || [];\n    groups[val].push(item);\n    return groups;\n  }, {});\n}`,
    explanation: 'reduce() accumulates into an object. For each item, get the grouping key value, create the array if needed, push the item. This is a very common utility — used extensively in data processing. Object.groupBy() is the new native version.',
    hints: ['Use reduce with {} as initial value', 'groups[val] = groups[val] || [] to initialise', 'Push item into the correct group'],
    tags: ['groupBy', 'reduce', 'utility', 'objects', 'javascript'],
    concepts: ['js-array-methods', 'js-object-mutation'],
  },

  // ===== JS_ASYNC =====
  // Intermediate MC → Intermediate Coding → Advanced Coding

  {
    id: 'js-async-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ASYNC,
    course: Course.WEB_DEV,
    question: 'What is the difference between a Promise and async/await?',
    options: [
      { id: 'a', text: 'async/await is faster than Promises', isCorrect: false },
      { id: 'b', text: 'Promises are deprecated in favour of async/await', isCorrect: false },
      { id: 'c', text: 'async/await does not use Promises internally', isCorrect: false },
      { id: 'd', text: 'They are the same thing — async/await is syntactic sugar over Promises that makes asynchronous code look synchronous', isCorrect: true },
    ],
    explanation: 'async functions always return a Promise. await pauses execution until the Promise resolves. Under the hood it is identical to .then() chains, but reads like synchronous code, making it easier to understand and debug.',
    tags: ['async', 'await', 'promise', 'fundamentals'],
    concepts: ['js-promises-async'],
  },

  {
    id: 'js-async-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ASYNC,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Write an async function "fetchUser" that fetches data from the URL "https://api.example.com/users/1", parses the JSON response, and returns the user object. Include error handling with try/catch.',
    starterCode: `// Async fetch with error handling\nasync function fetchUser() {\n`,
    testCases: [
      {
        input: 'API URL',
        expectedOutput: 'async function with await fetch, await .json(), try/catch',
        description: 'Should fetch and parse JSON with error handling',
      },
    ],
    solution: `async function fetchUser() {\n  try {\n    const response = await fetch("https://api.example.com/users/1");\n    if (!response.ok) throw new Error("HTTP error: " + response.status);\n    const user = await response.json();\n    return user;\n  } catch (error) {\n    console.error("Failed to fetch user:", error);\n    throw error;\n  }\n}`,
    explanation: 'await fetch() returns a Response object. Check response.ok for HTTP errors (fetch does not throw on 404/500). await response.json() parses the body. try/catch handles both network errors and HTTP errors.',
    hints: ['fetch does not throw on 404/500 — check response.ok', 'response.json() also returns a Promise', 'Wrap in try/catch for error handling'],
    tags: ['async', 'fetch', 'error-handling', 'api'],
    concepts: ['js-promises-async', 'js-error-handling'],
  },

  {
    id: 'js-async-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.JS_ASYNC,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Given an array of URLs, fetch all of them concurrently using Promise.all() and return an array of JSON results.',
    starterCode: `const urls = [\n  "https://api.example.com/users/1",\n  "https://api.example.com/users/2",\n  "https://api.example.com/users/3"\n];\n\nasync function fetchAll(urls) {\n`,
    testCases: [
      {
        input: 'array of URLs',
        expectedOutput: 'Promise.all(urls.map(url => fetch(url).then(r => r.json())))',
        description: 'Should fetch all concurrently',
      },
    ],
    solution: `async function fetchAll(urls) {\n  const responses = await Promise.all(urls.map(url => fetch(url)));\n  const data = await Promise.all(responses.map(r => r.json()));\n  return data;\n}`,
    explanation: 'Promise.all() takes an array of Promises and returns a single Promise that resolves when ALL complete. This runs fetches concurrently (not sequentially). If any Promise rejects, the whole Promise.all rejects — use Promise.allSettled() for fault tolerance.',
    hints: ['Promise.all() runs Promises concurrently', 'Map URLs to fetch calls', 'Two awaits: one for responses, one for JSON parsing'],
    tags: ['promise-all', 'concurrent', 'async', 'fetch'],
    concepts: ['js-promises-async'],
  },

  // ===== JS_ES6_PLUS =====
  // Beginner MC (git) → Beginner Coding → Intermediate MC (git) → Intermediate Coding

  {
    id: 'js-es6-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ES6_PLUS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Use template literals to create a string: "Hello, Alice! You are 30 years old." using variables name = "Alice" and age = 30.',
    starterCode: `// Declare name and age as in the prompt\n// Build const greeting using a backtick template literal that interpolates both\n`,
    testCases: [
      {
        input: 'name and age variables',
        // eslint-disable-next-line no-template-curly-in-string
        expectedOutput: '`Hello, ${name}! You are ${age} years old.`',
        description: 'Should use template literal',
      },
    ],
    solution: `const name = "Alice";\nconst age = 30;\n\nconst greeting = \`Hello, \${name}! You are \${age} years old.\`;`,
    explanation: 'Template literals use backticks (`) and dollar-brace expressions for interpolation. They support multi-line strings and any JavaScript expression inside the braces.',
    // eslint-disable-next-line no-template-curly-in-string
    hints: ['Use backticks ` not quotes', '${variable} for interpolation'],
    tags: ['template-literal', 'string', 'es6'],
    concepts: ['js-var-let-const'],
  },

  {
    id: 'js-es6-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ES6_PLUS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Use optional chaining (?.) and nullish coalescing (??) to safely access user.address.city, defaulting to "Unknown" if any part is null/undefined.',
    starterCode: `const user = { name: "Alice", address: null };\n\n// your code here\n`,
    testCases: [
      {
        input: 'user with null address',
        expectedOutput: 'user?.address?.city ?? "Unknown"',
        description: 'Should safely access nested property',
      },
    ],
    solution: `const user = { name: "Alice", address: null };\n\nconst city = user?.address?.city ?? "Unknown";`,
    explanation: '?. (optional chaining) short-circuits to undefined if any part is null/undefined, avoiding "Cannot read property of null" errors. ?? (nullish coalescing) provides a default only for null/undefined (not for "" or 0, unlike ||).',
    hints: ['?. stops if null/undefined', '?? defaults only for null/undefined, not falsy'],
    tags: ['optional-chaining', 'nullish-coalescing', 'es2020'],
    concepts: ['js-equality-coercion'],
  },

  {
    id: 'js-es6-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ES6_PLUS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Use array destructuring with rest to extract the first element as "leader" and the remaining as "members" from team = ["Alice", "Bob", "Charlie", "Diana"].',
    starterCode: `const team = ["Alice", "Bob", "Charlie", "Diana"];\n\n`,
    testCases: [
      {
        input: 'team array',
        expectedOutput: 'const [leader, ...members] = team',
        description: 'Should use rest with destructuring',
      },
    ],
    solution: `const team = ["Alice", "Bob", "Charlie", "Diana"];\n\nconst [leader, ...members] = team;`,
    explanation: 'The rest operator (...) in destructuring collects remaining elements into a new array. leader = "Alice", members = ["Bob", "Charlie", "Diana"]. Rest must be the last element in the destructuring pattern.',
    hints: ['...rest collects remaining elements', 'Must be last in the pattern'],
    tags: ['rest', 'destructuring', 'arrays', 'es6'],
    concepts: ['api-rest-conventions', 'js-spread-destructuring', 'js-array-methods'],
  },

  // Git questions (misclassified as JS_ES6_PLUS — kept at end of JS section per instructions)
  {
    id: 'git-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ES6_PLUS,
    course: Course.WEB_DEV,
    question: 'What is the correct Git workflow for making changes: stage, commit, push?',
    options: [
      { id: 'a', text: 'git push → git commit → git add', isCorrect: false },
      { id: 'b', text: 'git commit → git add → git push', isCorrect: false },
      { id: 'c', text: 'git add <files> (stage) → git commit -m "message" (save snapshot) → git push (upload to remote)', isCorrect: true },
      { id: 'd', text: 'git save → git upload', isCorrect: false },
    ],
    explanation: 'git add stages changes (selects what to include). git commit creates a snapshot with a message. git push uploads commits to the remote repository (GitHub). Working directory → Staging area → Local repo → Remote repo.',
    tags: ['git', 'workflow', 'add', 'commit', 'push'],
    concepts: ['web-git-workflow'],
  },

  {
    id: 'git-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_ES6_PLUS,
    course: Course.WEB_DEV,
    question: 'What is the difference between git merge and git rebase?',
    options: [
      { id: 'a', text: 'They are identical', isCorrect: false },
      { id: 'b', text: 'Rebase is always safer than merge', isCorrect: false },
      { id: 'c', text: 'Merge deletes the branch, rebase keeps it', isCorrect: false },
      { id: 'd', text: 'Merge creates a merge commit preserving branch history. Rebase replays your commits on top of the target branch for a linear history.', isCorrect: true },
    ],
    explanation: 'Merge: git merge feature creates a merge commit, preserving the exact branch history (non-linear). Rebase: git rebase main replays your commits on top of main, creating a clean linear history. Never rebase commits that others have pulled.',
    tags: ['git', 'merge', 'rebase', 'branching'],
    concepts: ['js-spread-destructuring'],
  },

  {
    id: 'git-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ES6_PLUS,
    course: Course.WEB_DEV,
    question: 'What does "git stash" do?',
    options: [
      { id: 'a', text: 'Temporarily saves uncommitted changes so you can switch branches, then reapply them later with "git stash pop"', isCorrect: true },
      { id: 'b', text: 'Permanently deletes changes', isCorrect: false },
      { id: 'c', text: 'Creates a new branch', isCorrect: false },
      { id: 'd', text: 'Pushes changes to remote', isCorrect: false },
    ],
    explanation: 'git stash saves your working directory and staging area changes to a stack. git stash pop reapplies the most recent stash. Useful when you need to switch branches but have uncommitted work. git stash list shows all stashes.',
    tags: ['git', 'stash', 'workflow'],
    concepts: ['web-git-workflow'],
  },

  // ===== JS_DOM =====
  // Beginner Coding → Intermediate MC → Intermediate Coding → Advanced Coding

  {
    id: 'js-dom-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_DOM,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Select an element with id "title" and change its text content to "Hello World". Then select all elements with class "item" and log the count.',
    starterCode: `// DOM selection\n`,
    testCases: [{ input: 'DOM elements', expectedOutput: 'getElementById or querySelector, querySelectorAll', description: 'Should select and modify DOM' }],
    solution: `const title = document.getElementById("title");\ntitle.textContent = "Hello World";\n\nconst items = document.querySelectorAll(".item");\nconsole.log(items.length);`,
    explanation: 'getElementById() finds by ID (fastest). querySelector() finds the first match for any CSS selector. querySelectorAll() finds ALL matches (returns NodeList). textContent sets text (safer than innerHTML which can inject HTML).',
    hints: ['getElementById for IDs', 'querySelectorAll for multiple elements', 'textContent for safe text updates'],
    tags: ['dom', 'querySelector', 'textContent', 'javascript'],
    concepts: ['js-dom-events'],
  },

  {
    id: 'js-dom-7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_DOM,
    course: Course.WEB_DEV,
    question: 'What is the difference between textContent and innerHTML?',
    options: [
      { id: 'a', text: 'innerHTML is faster', isCorrect: false },
      { id: 'b', text: 'textContent sets/gets plain text (safe from XSS). innerHTML sets/gets HTML (can inject scripts if using user input — security risk).', isCorrect: true },
      { id: 'c', text: 'textContent supports HTML tags', isCorrect: false },
      { id: 'd', text: 'They are identical', isCorrect: false },
    ],
    explanation: 'innerHTML parses HTML: el.innerHTML = "<b>bold</b>" renders bold text. But el.innerHTML = userInput is dangerous — if userInput contains <script>, it executes. textContent treats everything as plain text — always safe. Use textContent for user data.',
    tags: ['dom', 'textContent', 'innerHTML', 'xss', 'security'],
    concepts: ['js-dom-events', 'web-security-xss', 'web-security-input-validation'],
  },

  {
    id: 'js-dom-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_DOM,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Create a new <li> element with text "New Item", add a class "highlight" to it, and append it to an existing <ul> with id "list".',
    starterCode: `// Create and append element\n`,
    testCases: [{ input: 'new list item', expectedOutput: 'createElement, textContent, classList.add, appendChild', description: 'Should create and append element' }],
    solution: `const li = document.createElement("li");\nli.textContent = "New Item";\nli.classList.add("highlight");\ndocument.getElementById("list").appendChild(li);`,
    explanation: 'createElement() creates a new element. textContent sets its text. classList.add() adds a CSS class. appendChild() adds it as the last child. Other methods: prepend() (first child), before()/after() (sibling), remove() (delete).',
    hints: ['createElement to create', 'classList.add for CSS classes', 'appendChild to insert into DOM'],
    tags: ['dom', 'createElement', 'classList', 'appendChild', 'javascript'],
    concepts: ['js-dom-events'],
  },

  {
    id: 'js-dom-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_DOM,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Add a click event listener to a button with id "btn" that toggles the class "active" on a div with id "panel".',
    starterCode: `// Event listener with class toggle\n`,
    testCases: [{ input: 'click handler', expectedOutput: 'addEventListener("click", ...) with classList.toggle', description: 'Should toggle class on click' }],
    solution: `document.getElementById("btn").addEventListener("click", () => {\n  document.getElementById("panel").classList.toggle("active");\n});`,
    explanation: 'addEventListener(event, callback) attaches event handlers. classList.toggle() adds the class if missing, removes if present. Other events: "submit", "input", "keydown", "mouseover", "scroll". Use removeEventListener() to clean up.',
    hints: ['addEventListener("click", callback)', 'classList.toggle adds/removes', 'Arrow function for concise callback'],
    tags: ['dom', 'addEventListener', 'toggle', 'events', 'javascript'],
    concepts: ['js-dom-events'],
  },

  {
    id: 'js-dom-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_DOM,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Use event delegation: add a single click handler to a <ul id="nav"> that detects which <li> was clicked and logs its text content.',
    starterCode: `// Event delegation\n`,
    testCases: [{ input: 'delegated click', expectedOutput: 'addEventListener on parent, check e.target', description: 'Should use event delegation' }],
    solution: `document.getElementById("nav").addEventListener("click", (e) => {\n  if (e.target.tagName === "LI") {\n    console.log(e.target.textContent);\n  }\n});`,
    explanation: 'Event delegation attaches ONE handler to a parent instead of many handlers to each child. Events bubble up from the clicked element. e.target is the actual clicked element. This is more efficient and handles dynamically added elements.',
    hints: ['One handler on parent, not N on children', 'e.target is the actual clicked element', 'Check tagName to filter'],
    tags: ['dom', 'event-delegation', 'bubbling', 'javascript'],
    concepts: ['js-dom-events'],
  },

  {
    id: 'js-dom-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_DOM,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Listen for form submission on a form with id "signup", prevent the default page reload, and get the value of an input with name "email".',
    starterCode: `// Form handling\n`,
    testCases: [{ input: 'form submit', expectedOutput: 'addEventListener("submit"), e.preventDefault(), FormData or value', description: 'Should handle form submit' }],
    solution: `document.getElementById("signup").addEventListener("submit", (e) => {\n  e.preventDefault();\n  const email = e.target.elements.email.value;\n  console.log("Email:", email);\n});`,
    explanation: 'Forms submit causes a page reload by default. e.preventDefault() stops it. e.target is the form. e.target.elements.name accesses inputs by their name attribute. Alternative: new FormData(e.target) gets all form data.',
    hints: ['e.preventDefault() stops page reload', 'e.target.elements.inputName.value gets values', 'new FormData(form) for all data at once'],
    tags: ['dom', 'form', 'preventDefault', 'events', 'javascript'],
    concepts: ['js-dom-events', 'web-html-forms-a11y'],
  },

  {
    id: 'js-dom-6',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.JS_DOM,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Write a debounce function that delays execution until the user stops typing. Use it on a search input to only log the value after 300ms of no typing.',
    starterCode: `// Debounce\nfunction debounce(fn, delay) {\n`,
    testCases: [{ input: 'debounce function', expectedOutput: 'clearTimeout/setTimeout pattern', description: 'Should implement debounce' }],
    solution: `function debounce(fn, delay) {\n  let timer;\n  return function(...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), delay);\n  };\n}\n\nconst searchInput = document.getElementById("search");\nsearchInput.addEventListener("input", debounce((e) => {\n  console.log("Search:", e.target.value);\n}, 300));`,
    explanation: 'Debounce delays execution until activity stops. Each call resets the timer. Only the last call within the delay period executes. Essential for search inputs, window resize, scroll events — prevents firing 100s of times per second.',
    hints: ['clearTimeout cancels previous timer', 'setTimeout sets new timer', 'Returns a wrapper function (closure)'],
    tags: ['debounce', 'performance', 'closure', 'dom', 'javascript'],
    concepts: ['js-closures', 'js-dom-events'],
  },

  {
    id: 'js-dom-8',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.JS_DOM,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: `Build a dynamic list in vanilla JavaScript that supports adding items and deleting them via per-item buttons.

Assume the page already contains an empty <ul id="list">. Define a function addItem(text) that builds a new <li> containing the provided text plus a "Delete" button, and appends that <li> to the list element.

Wire deletion using event delegation, NOT a separate listener per row: attach a single click handler to the <ul> itself, and inside that handler, check whether the click target is a delete button — if so, remove the enclosing <li>.

Use document.createElement and appendChild for the DOM construction, .closest("li") to walk from the clicked button up to its row, and .remove() to delete the row from the DOM. The event delegation pattern is the point of this exercise — adding listeners per-row would also work but doesn't scale.`,
    starterCode: `// Dynamic list\nfunction addItem(text) {\n`,
    testCases: [{ input: 'dynamic list', expectedOutput: 'createElement, appendChild, addEventListener for delete', description: 'Should add/remove list items' }],
    solution: `function addItem(text) {\n  const li = document.createElement("li");\n  li.textContent = text;\n\n  const btn = document.createElement("button");\n  btn.textContent = "X";\n  btn.addEventListener("click", () => li.remove());\n\n  li.appendChild(btn);\n  document.getElementById("list").appendChild(li);\n}`,
    explanation: 'This combines: createElement, textContent, addEventListener, appendChild, and remove(). The delete handler uses closure — it captures the specific li reference. element.remove() removes itself from the DOM.',
    hints: ['Create both li and button elements', 'Button click handler calls li.remove()', 'Closure captures the specific li'],
    tags: ['project', 'dom', 'crud', 'events', 'javascript'],
    concepts: ['js-dom-events'],
  },

  // ===== JS_PROJECT =====
  // Beginner MC (testing) → Intermediate Coding (testing) → Advanced Coding

  {
    id: 'test-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_PROJECT,
    course: Course.WEB_DEV,
    question: 'What are the three types of tests in web development?',
    options: [
      { id: 'a', text: 'Fast tests, slow tests, manual tests', isCorrect: false },
      { id: 'b', text: 'Unit tests (individual functions), Integration tests (components working together), End-to-end tests (full user flows in a browser)', isCorrect: true },
      { id: 'c', text: 'Frontend tests, backend tests, database tests', isCorrect: false },
      { id: 'd', text: 'Dev tests, staging tests, prod tests', isCorrect: false },
    ],
    explanation: 'The testing pyramid: many unit tests (fast, cheap), fewer integration tests, even fewer E2E tests (slow, expensive). Unit tests verify functions in isolation. Integration tests verify components work together. E2E tests simulate real user behavior.',
    tags: ['testing', 'unit', 'integration', 'e2e'],
    concepts: ['testing-rtl-queries', 'testing-async'],
  },

  {
    id: 'js-project-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_PROJECT,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Assemble a single Jest test that checks add(2, 3) equals 5. Order: group with describe, declare the test, assert with expect, then close both callbacks.',
    correctOrder: [
      'describe("add", () => {',
      '  test("adds two numbers", () => {',
      '    expect(add(2, 3)).toBe(5);',
      '  });',
      '});',
    ],
    distractorLines: [
      '    expect(add(2, 3)).toBe;',
      '    assert(add(2, 3) === 5);',
    ],
    solution: 'describe("add", () => {\n  test("adds two numbers", () => {\n    expect(add(2, 3)).toBe(5);\n  });\n});',
    explanation: 'describe() groups related tests; test() (or it()) declares one case; expect(value).toBe(expected) asserts equality. The matcher must be CALLED with the expected value (.toBe(5)); Jest uses expect, not a bare assert().',
    hints: ['describe > test > expect', 'The matcher is called with the expected value'],
    tags: ['jest', 'testing', 'unit-test'],
    concepts: ['testing-rtl-queries'],
  },

  {
    id: 'js-project-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_PROJECT,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the matcher for primitive equality and the one for deep object equality.',
    template: 'expect(2 + 3).___(5);\nexpect({ a: 1 }).___({ a: 1 });',
    blanks: ['toBe', 'toEqual'],
    solution: 'expect(2 + 3).toBe(5);\nexpect({ a: 1 }).toEqual({ a: 1 });',
    explanation: 'toBe uses Object.is (reference/primitive identity) — correct for numbers and strings. Two distinct objects with the same contents are NOT the same reference, so use toEqual for deep structural comparison.',
    hints: ['Identity vs deep equality'],
    tags: ['jest', 'matchers', 'testing'],
    concepts: ['testing-rtl-queries'],
  },

  {
    id: 'js-project-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_PROJECT,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the function that declares a single test case and the function that begins an assertion.',
    template: '___("returns the sum", () => {\n  ___(add(1, 1)).toBe(2);\n});',
    blanks: ['test', 'expect'],
    solution: 'test("returns the sum", () => {\n  expect(add(1, 1)).toBe(2);\n});',
    explanation: 'test(name, fn) (alias it) declares one case; the callback holds the assertions. expect(value) begins an assertion, chained with a matcher like toBe.',
    hints: ['Declares a case', 'Begins an assertion'],
    tags: ['jest', 'testing', 'unit-test'],
    concepts: ['testing-rtl-queries'],
  },

  {
    id: 'test-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_PROJECT,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Write a Jest test for a function add(a, b) that returns a + b. Test: normal addition, negative numbers, and zero.',
    starterCode: `// Jest test\n`,
    testCases: [
      {
        input: 'add function',
        expectedOutput: 'describe, test/it, expect().toBe()',
        description: 'Should write Jest tests',
      },
    ],
    solution: `describe("add", () => {\n  test("adds two positive numbers", () => {\n    expect(add(2, 3)).toBe(5);\n  });\n\n  test("handles negative numbers", () => {\n    expect(add(-1, -2)).toBe(-3);\n  });\n\n  test("handles zero", () => {\n    expect(add(5, 0)).toBe(5);\n  });\n});`,
    explanation: 'describe() groups related tests. test() (or it()) defines a single test case. expect(value).toBe(expected) asserts equality. Other matchers: toEqual (deep), toBeTruthy, toContain, toThrow, toHaveBeenCalled.',
    hints: ['describe() for grouping', 'test() or it() for each case', 'expect().toBe() for assertion'],
    tags: ['jest', 'testing', 'unit-test', 'assertions'],
    concepts: ['testing-rtl-queries'],
  },

  {
    id: 'js-project-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.JS_PROJECT,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: `Build a TodoManager class that stores todos in memory and exposes immutable-style array operations.

Each todo is an object with three fields: a numeric id, a string text, and a boolean done that starts as false. The class maintains an internal array of todos and an auto-incrementing id counter; both should be initialised in the constructor.

Methods:

- add(text): pushes a new todo with the next id, the supplied text, and done: false. Returns the created todo.
- toggle(id): finds the todo with the given id and flips its done flag. Does nothing if no todo matches.
- remove(id): removes the todo with the given id from the array (use .filter to produce a new array, then assign it).
- getActive(): returns the subset of todos where done is false.
- getCompleted(): returns the subset of todos where done is true.
- summary(): returns the string "X done, Y remaining" — X is the count of completed todos, Y is the count of active todos.

Prefer .find / .filter / .map over manual for-loops where it reads cleanly.`,
    starterCode: `class TodoManager {\n  constructor() {\n    this.todos = [];\n    this.nextId = 1;\n  }\n\n`,
    testCases: [
      {
        input: 'Todo operations',
        expectedOutput: 'Class with add, toggle, remove, getActive, getCompleted, summary methods using array methods',
        description: 'Should implement full TodoManager',
      },
    ],
    solution: `class TodoManager {\n  constructor() {\n    this.todos = [];\n    this.nextId = 1;\n  }\n\n  add(text) {\n    this.todos.push({ id: this.nextId++, text, done: false });\n  }\n\n  toggle(id) {\n    const todo = this.todos.find(t => t.id === id);\n    if (todo) todo.done = !todo.done;\n  }\n\n  remove(id) {\n    this.todos = this.todos.filter(t => t.id !== id);\n  }\n\n  getActive() {\n    return this.todos.filter(t => !t.done);\n  }\n\n  getCompleted() {\n    return this.todos.filter(t => t.done);\n  }\n\n  summary() {\n    const done = this.todos.filter(t => t.done).length;\n    const remaining = this.todos.length - done;\n    return \`\${done} done, \${remaining} remaining\`;\n  }\n}`,
    explanation: 'This project combines: classes, array methods (push, find, filter), template literals, and boolean toggling. find() locates by id, filter() creates filtered views and removes items. This is a common pattern for state management.',
    hints: ['Use push() to add', 'find() to locate by id', 'filter() for getActive/getCompleted and remove', 'Template literal for summary'],
    tags: ['project', 'class', 'arrays', 'todo'],
    concepts: ['js-array-methods'],
  },

  // ===== TS_BASIC_TYPES =====
  // Beginner faded (Parsons + Cloze) → Beginner Coding → Intermediate Coding

  {
    id: 'ts-basic-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_BASIC_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Assemble a typed function "add" that takes two numbers and returns their sum (number). Put the signature first, then the return statement, then the closing brace.',
    correctOrder: [
      'function add(a: number, b: number): number {',
      '  return a + b;',
      '}',
    ],
    distractorLines: [
      'function add(a, b): number {',
      'function add(a: number, b: number) {',
    ],
    solution: 'function add(a: number, b: number): number {\n  return a + b;\n}',
    explanation: 'Each parameter is typed with : Type, and the return type goes after the parameter list (: number here). The untyped distractor (a, b) lets any value through, and the variant with no return type forces TypeScript to infer it instead of stating intent.',
    hints: ['param: Type for each parameter', 'The : ReturnType comes after the parameter list'],
    tags: ['functions', 'types', 'typescript'],
    concepts: ['ts-any-vs-unknown'],
  },

  {
    id: 'ts-basic-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_BASIC_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the type annotation for each variable.',
    template: 'let count: ___ = 0;\nlet label: ___ = "ready";\nlet tags: ___ = ["a", "b"];',
    blanks: ['number', 'string', 'string[]'],
    blankAlternates: [[], [], ['Array<string>']],
    solution: 'let count: number = 0;\nlet label: string = "ready";\nlet tags: string[] = ["a", "b"];',
    explanation: 'Type annotations go after the variable name with : Type. An array of strings is string[] (or the equivalent Array<string>). Assigning a value of the wrong type — say a number to label — is a compile-time error.',
    hints: [': Type after the name', 'An array of strings is string[] or Array<string>'],
    tags: ['types', 'basics', 'typescript'],
    concepts: ['ts-any-vs-unknown'],
  },

  {
    id: 'ts-basic-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_BASIC_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the keyword that names a reusable type, and the type used to annotate the variable below it.',
    template: '___ Point = { x: number; y: number };\nconst origin: ___ = { x: 0, y: 0 };',
    blanks: ['type', 'Point'],
    solution: 'type Point = { x: number; y: number };\nconst origin: Point = { x: 0, y: 0 };',
    explanation: 'type Name = { ... } creates a reusable type alias, so { x: number; y: number } can be referred to as Point everywhere instead of being repeated. Annotate origin with that alias.',
    hints: ['The keyword that defines a named type', 'Annotate origin with the alias you just defined'],
    tags: ['type-alias', 'typescript'],
    concepts: ['ts-type-vs-interface'],
  },

  {
    id: 'ts-type-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_BASIC_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Declare a function "greet" that takes a name (string) and an optional greeting (string, defaults to "Hello") and returns a string like "Hello, Alice!".',
    starterCode: `// Typed function with optional parameter\n`,
    testCases: [
      {
        input: 'name and optional greeting',
        expectedOutput: 'function greet(name: string, greeting: string = "Hello"): string',
        description: 'Should have typed parameters and return type',
      },
    ],
    solution: `function greet(name: string, greeting: string = "Hello"): string {\n  return \`\${greeting}, \${name}!\`;\n}`,
    explanation: 'TypeScript function parameters are typed with : Type. Optional parameters use ? or default values (= "Hello"). The return type goes after the parameter list. TypeScript infers the return type, but being explicit is good practice.',
    hints: ['param: Type for parameter types', ': ReturnType after the param list', 'Use = defaultValue for optional params'],
    tags: ['functions', 'types', 'optional', 'typescript'],
    concepts: ['ts-any-vs-unknown'],
  },

  {
    id: 'ts-basic-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_BASIC_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Declare typed variables: name as string, age as number, isActive as boolean, and tags as an array of strings.',
    starterCode: `// Typed variables\n`,
    testCases: [{ input: 'typed declarations', expectedOutput: 'let name: string, etc.', description: 'Should declare typed variables' }],
    solution: `let name: string = "Alice";\nlet age: number = 30;\nlet isActive: boolean = true;\nlet tags: string[] = ["admin", "user"];`,
    explanation: 'TypeScript adds types after the variable name with : Type. string[] is an array of strings. You can also use Array<string>. Types are checked at compile time — assigning a number to a string variable causes an error.',
    hints: [': Type after the variable name', 'string[] or Array<string> for arrays', 'Types prevent assignment mistakes'],
    tags: ['types', 'basics', 'typescript'],
    concepts: ['ts-any-vs-unknown'],
  },

  {
    id: 'ts-basic-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_BASIC_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Define a type alias "Point" for { x: number, y: number } and a function "distance" that takes two Points and returns the distance between them.',
    starterCode: `// Type alias and function\n`,
    testCases: [{ input: 'two points', expectedOutput: 'type Point = { x: number; y: number }', description: 'Should use type alias' }],
    solution: `type Point = { x: number; y: number };\n\nfunction distance(a: Point, b: Point): number {\n  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);\n}`,
    explanation: 'Type aliases create reusable type definitions. type vs interface: both work for objects. type can also define unions (type ID = string | number), while interface supports declaration merging and extends.',
    hints: ['type Name = { ... } for type alias', 'Type aliases are reusable', 'Both type and interface work for objects'],
    tags: ['type-alias', 'functions', 'typescript'],
    concepts: ['ts-type-vs-interface'],
  },

  // ===== TS_INTERFACES =====
  // Beginner faded (Parsons + Cloze) → Beginner/Intermediate Coding

  {
    id: 'ts-iface-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_INTERFACES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Assemble an interface "Animal" with a name, then an interface "Dog" that extends Animal and adds breed. Define Animal first.',
    correctOrder: [
      'interface Animal {',
      '  name: string;',
      '}',
      'interface Dog extends Animal {',
      '  breed: string;',
      '}',
    ],
    distractorLines: [
      'interface Dog implements Animal {',
      'interface Dog extends Animal, {',
    ],
    solution: 'interface Animal {\n  name: string;\n}\ninterface Dog extends Animal {\n  breed: string;\n}',
    explanation: 'An interface uses extends (not implements — that keyword is for classes) to inherit another interface\'s members. Dog ends up requiring both name and breed. extends takes the parent name directly, with no trailing comma.',
    hints: ['Interfaces inherit with extends, not implements', 'Define the parent interface before the child'],
    tags: ['interface', 'extends', 'inheritance', 'typescript'],
    concepts: ['ts-type-vs-interface', 'js-prototype-chain'],
  },

  {
    id: 'ts-iface-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_INTERFACES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the keyword that declares an object shape, and the marker that makes the email property optional.',
    template: '___ User {\n  id: number;\n  email___: string;\n}',
    blanks: ['interface', '?'],
    solution: 'interface User {\n  id: number;\n  email?: string;\n}',
    explanation: 'interface Name { ... } declares the shape of an object. A ? immediately after a property name makes it optional, so a User without an email still satisfies the type.',
    hints: ['The keyword for an object-shape declaration', 'A single character after the name makes a property optional'],
    tags: ['interface', 'optional', 'typescript'],
    concepts: ['ts-type-vs-interface'],
  },

  {
    id: 'ts-iface-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_INTERFACES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the keyword that makes Admin inherit every member of User.',
    template: 'interface User {\n  id: number;\n}\ninterface Admin ___ User {\n  permissions: string[];\n}',
    blanks: ['extends'],
    solution: 'interface User {\n  id: number;\n}\ninterface Admin extends User {\n  permissions: string[];\n}',
    explanation: 'extends makes Admin inherit all of User\'s members, so an Admin must have both id and permissions. This composes interfaces instead of repeating their fields.',
    hints: ['The keyword that one interface uses to inherit another'],
    tags: ['interface', 'extends', 'typescript'],
    concepts: ['ts-type-vs-interface'],
  },

  {
    id: 'ts-type-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_INTERFACES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Define an interface "User" with id (number), name (string), email (string), and optional role (string). Then create a function "createUser" that takes a User and returns a greeting string.',
    starterCode: `// Define interface and function\n`,
    testCases: [
      {
        input: 'User interface',
        expectedOutput: 'interface User { id: number; name: string; email: string; role?: string; }',
        description: 'Should define interface with optional property',
      },
    ],
    solution: `interface User {\n  id: number;\n  name: string;\n  email: string;\n  role?: string;\n}\n\nfunction createUser(user: User): string {\n  return \`Welcome, \${user.name}!\`;\n}`,
    explanation: 'Interfaces define the shape of an object. Properties ending with ? are optional. Interfaces can be extended (interface Admin extends User {}). They provide compile-time type checking without runtime overhead.',
    hints: ['Use ? for optional properties', 'interface Name { prop: Type; }'],
    tags: ['interface', 'types', 'optional', 'typescript'],
    concepts: ['ts-type-vs-interface'],
  },

  {
    id: 'ts-iface-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_INTERFACES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Define an interface "Product" with id (number), name (string), price (number). Then extend it to create "DigitalProduct" that adds downloadUrl (string) and fileSize (number).',
    starterCode: `// Interface inheritance\n`,
    testCases: [{ input: 'interfaces', expectedOutput: 'interface extends interface', description: 'Should extend interface' }],
    solution: `interface Product {\n  id: number;\n  name: string;\n  price: number;\n}\n\ninterface DigitalProduct extends Product {\n  downloadUrl: string;\n  fileSize: number;\n}`,
    explanation: 'extends creates a child interface that inherits all parent properties and adds new ones. A DigitalProduct must have all Product fields PLUS downloadUrl and fileSize. This is composition over repetition.',
    hints: ['interface Child extends Parent', 'Child inherits all parent properties', 'Add new properties in the child body'],
    tags: ['interface', 'extends', 'inheritance', 'typescript'],
    concepts: ['ts-type-vs-interface', 'js-prototype-chain'],
  },

  {
    id: 'ts-iface-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_INTERFACES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Define an interface "ApiConfig" with baseUrl (string), timeout (number, optional), and headers (Record<string, string>, optional). Write a function "createClient" that takes ApiConfig and returns a string summary.',
    starterCode: `// Interface with optional and Record\n`,
    testCases: [{ input: 'ApiConfig', expectedOutput: 'interface with ? and Record<string, string>', description: 'Should use optional and Record' }],
    solution: `interface ApiConfig {\n  baseUrl: string;\n  timeout?: number;\n  headers?: Record<string, string>;\n}\n\nfunction createClient(config: ApiConfig): string {\n  return \`Client: \${config.baseUrl} (timeout: \${config.timeout ?? 5000}ms)\`;\n}`,
    explanation: 'Record<K, V> defines an object with keys of type K and values of type V. Record<string, string> = any string keys with string values. ?? is nullish coalescing — provides a default for null/undefined.',
    hints: ['Record<string, string> for flexible key-value', '? makes a property optional', '?? for default values'],
    tags: ['interface', 'Record', 'optional', 'typescript'],
    concepts: ['ts-type-vs-interface', 'ts-utility-types'],
  },

  // ===== TS_GENERICS =====
  // Beginner faded (Parsons + Cloze + Predict) → Beginner Coding → Advanced Coding

  {
    id: 'ts-gen-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_GENERICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Assemble a generic function "first" that returns the first element of an array, or undefined. Signature first, then the return, then the closing brace.',
    correctOrder: [
      'function first<T>(arr: T[]): T | undefined {',
      '  return arr[0];',
      '}',
    ],
    distractorLines: [
      'function first(arr: T[]): T | undefined {',
      'function first<T>(arr: T): T[] {',
    ],
    solution: 'function first<T>(arr: T[]): T | undefined {\n  return arr[0];\n}',
    explanation: 'The <T> after the name DECLARES the type parameter — without it, T is an undeclared name (the first distractor). The same T flows through the parameter (T[]) and the return (T | undefined), so first([1,2,3]) is typed number | undefined.',
    hints: ['Declare the type parameter with <T> after the function name', 'An array of T is T[]'],
    tags: ['generics', 'type-parameter', 'typescript'],
    concepts: ['ts-generics'],
  },

  {
    id: 'ts-gen-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_GENERICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the generic type-parameter declaration, and the return type for a value wrapped in an array.',
    template: 'function wrapInArray___(value: T): ___ {\n  return [value];\n}',
    blanks: ['<T>', 'T[]'],
    blankAlternates: [[], ['Array<T>']],
    solution: 'function wrapInArray<T>(value: T): T[] {\n  return [value];\n}',
    explanation: '<T> declares the type parameter; the return type T[] (or Array<T>) says the result is an array of whatever T was. wrapInArray("hi") is then typed string[] and wrapInArray(42) is number[].',
    hints: ['Declare the parameter with <T> after the name', 'An array of T is T[] or Array<T>'],
    tags: ['generics', 'type-parameter', 'typescript'],
    concepts: ['ts-generics'],
  },

  {
    id: 'ts-gen-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_GENERICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'What does this code log?',
    code: `function identity<T>(value: T): T {
  return value;
}
console.log(identity<number>(42));
console.log(identity<string>("hi"));`,
    expectedOutput: `42
hi`,
    explanation: 'Generics are a COMPILE-TIME feature — the <number> / <string> type arguments are erased before the code runs, so they change nothing at runtime. identity simply returns its argument unchanged: 42, then "hi".',
    hints: ['Type arguments are erased at runtime — what does the body actually do?'],
    tags: ['generics', 'type-erasure', 'typescript'],
    concepts: ['ts-generics'],
  },

  {
    id: 'ts-type-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_GENERICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Write a generic function "wrapInArray" that takes a value of any type T and returns it wrapped in an array of type T[].',
    starterCode: `// Generic function\n`,
    testCases: [
      {
        input: 'any value',
        expectedOutput: 'function wrapInArray<T>(value: T): T[]',
        description: 'Should use generic type parameter',
      },
    ],
    solution: `function wrapInArray<T>(value: T): T[] {\n  return [value];\n}`,
    explanation: 'Generics (<T>) let you write functions that work with any type while maintaining type safety. wrapInArray(42) returns number[], wrapInArray("hello") returns string[]. The type is inferred from the argument.',
    hints: ['Use <T> after function name', 'T is a placeholder for any type', 'Return type is T[]'],
    tags: ['generics', 'type-parameter', 'typescript'],
    concepts: ['ts-generics'],
  },

  {
    id: 'ts-gen-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_GENERICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Write a generic function "first" that takes an array of type T and returns the first element (T | undefined). It should work with any type.',
    starterCode: `// Generic first element\n`,
    testCases: [{ input: 'any array', expectedOutput: 'function first<T>(arr: T[]): T | undefined', description: 'Should return first element generically' }],
    solution: `function first<T>(arr: T[]): T | undefined {\n  return arr[0];\n}`,
    explanation: 'The generic <T> flows through: arr is T[], return is T | undefined. first([1,2,3]) returns number | undefined. first(["a","b"]) returns string | undefined. TypeScript infers T from the argument.',
    hints: ['<T> declares the generic', 'T | undefined for possibly empty array', 'Type is inferred from the argument'],
    tags: ['generics', 'first', 'union', 'typescript'],
    concepts: ['ts-generics'],
  },

  {
    id: 'ts-gen-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TS_GENERICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Write a generic function "merge" that takes two objects of types T and U and returns their merged type T & U.',
    starterCode: `// Generic merge\n`,
    testCases: [{ input: 'two objects', expectedOutput: 'function merge<T, U>(a: T, b: U): T & U', description: 'Should merge with intersection type' }],
    solution: `function merge<T extends object, U extends object>(a: T, b: U): T & U {\n  return { ...a, ...b };\n}`,
    explanation: 'T & U is an intersection type — the result has ALL properties from both T and U. "extends object" constrains the generics to only accept objects (not primitives). The spread operator copies properties from both.',
    hints: ['T & U = intersection type', 'extends object constrains to objects', 'Result has all properties from both'],
    tags: ['generics', 'intersection', 'merge', 'typescript'],
    concepts: ['ts-generics', 'js-spread-destructuring'],
  },

  // ===== TS_ADVANCED_TYPES =====
  // Beginner faded (Parsons + Cloze + Predict) → Beginner Coding → Advanced Coding

  {
    id: 'ts-adv-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_ADVANCED_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Assemble a type guard "isString" for an unknown value. Put the signature (with its type predicate) first, then the typeof check, then the closing brace.',
    correctOrder: [
      'function isString(val: unknown): val is string {',
      '  return typeof val === "string";',
      '}',
    ],
    distractorLines: [
      'function isString(val: unknown): boolean {',
      'function isString(val: string): val is string {',
    ],
    solution: 'function isString(val: unknown): val is string {\n  return typeof val === "string";\n}',
    explanation: 'The return type "val is string" is a type predicate — it tells TypeScript that a true result means val is a string, so it narrows the type at the call site. A plain : boolean return (the distractor) checks the value but does NOT narrow.',
    hints: ['The return annotation is "val is string", not boolean', 'Accept unknown so the guard is useful on any value'],
    tags: ['type-guard', 'narrowing', 'unknown', 'typescript'],
    concepts: ['ts-narrowing', 'ts-any-vs-unknown'],
  },

  {
    id: 'ts-adv-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_ADVANCED_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the keyword that makes this a type predicate, and the operator that checks a primitive type at runtime.',
    template: 'function isNumber(val: unknown): val ___ number {\n  return ___ val === "number";\n}',
    blanks: ['is', 'typeof'],
    solution: 'function isNumber(val: unknown): val is number {\n  return typeof val === "number";\n}',
    explanation: '"val is number" is the type predicate that turns this into a type guard; returning true narrows val to number at the call site. typeof is the runtime operator that reports a primitive\'s type as a string.',
    hints: ['The predicate form is "val ___ number"', 'The runtime primitive-type operator'],
    tags: ['type-guard', 'narrowing', 'typescript'],
    concepts: ['ts-narrowing'],
  },

  {
    id: 'ts-adv-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_ADVANCED_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'What does this code log?',
    code: `type Shape =
  | { kind: "circle"; r: number }
  | { kind: "square"; side: number };

function area(s: Shape): number {
  switch (s.kind) {
    case "circle": return Math.PI * s.r ** 2;
    case "square": return s.side ** 2;
  }
}
console.log(area({ kind: "square", side: 4 }));`,
    expectedOutput: `16`,
    explanation: 'The "kind" field is the discriminant. switch(s.kind) selects the "square" branch, and inside it TypeScript has narrowed s to the square variant, so s.side is available: 4 ** 2 = 16.',
    hints: ['Which switch branch does kind: "square" select?'],
    tags: ['discriminated-union', 'narrowing', 'typescript'],
    concepts: ['ts-discriminated-unions', 'ts-narrowing'],
  },

  {
    id: 'ts-type-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_ADVANCED_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Define a discriminated union type "Shape" that can be a Circle (kind: "circle", radius: number) or Rectangle (kind: "rectangle", width: number, height: number). Write a function "area" that calculates the area based on the shape kind.',
    starterCode: `// Discriminated union\n`,
    testCases: [
      {
        input: 'Shape union type',
        expectedOutput: 'type Shape = Circle | Rectangle with kind discriminant',
        description: 'Should use discriminated union',
      },
    ],
    solution: `type Circle = { kind: "circle"; radius: number };\ntype Rectangle = { kind: "rectangle"; width: number; height: number };\ntype Shape = Circle | Rectangle;\n\nfunction area(shape: Shape): number {\n  switch (shape.kind) {\n    case "circle":\n      return Math.PI * shape.radius ** 2;\n    case "rectangle":\n      return shape.width * shape.height;\n  }\n}`,
    explanation: 'A discriminated union uses a common "kind" (or "type") field to distinguish variants. TypeScript narrows the type inside each case branch — in "circle" case, shape.radius is available. This pattern is used extensively in Redux actions and event handling.',
    hints: ['Use a common literal field like "kind" for discrimination', 'switch on the kind field', 'TypeScript narrows the type in each case'],
    tags: ['discriminated-union', 'narrowing', 'advanced', 'typescript'],
    concepts: ['ts-discriminated-unions', 'ts-narrowing'],
  },

  {
    id: 'ts-adv-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_ADVANCED_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Write a type guard function "isString" that takes an unknown value and returns true if it is a string. Use it to narrow the type in an if statement.',
    starterCode: `// Type guard\n`,
    testCases: [{ input: 'unknown value', expectedOutput: 'function isString(val: unknown): val is string', description: 'Should create type guard' }],
    solution: `function isString(val: unknown): val is string {\n  return typeof val === "string";\n}\n\nfunction process(input: unknown) {\n  if (isString(input)) {\n    console.log(input.toUpperCase());\n  }\n}`,
    explanation: '"val is string" is a type predicate — it tells TypeScript that when this function returns true, val is definitely a string. Inside the if block, TypeScript narrows the type from unknown to string, allowing .toUpperCase().',
    hints: ['Return type "param is Type" creates a type guard', 'TypeScript narrows inside the if block', 'Use typeof for primitive checks'],
    tags: ['type-guard', 'narrowing', 'unknown', 'typescript'],
    concepts: ['ts-narrowing', 'ts-any-vs-unknown'],
  },

  {
    id: 'ts-adv-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TS_ADVANCED_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Define a union type "Result<T>" that is either { ok: true, data: T } or { ok: false, error: string }. Write a function that returns Result<number> for a division that can fail.',
    starterCode: `// Result type\n`,
    testCases: [{ input: 'division result', expectedOutput: 'type Result<T> = { ok: true, data: T } | { ok: false, error: string }', description: 'Should define Result union type' }],
    solution: `type Result<T> = \n  | { ok: true; data: T }\n  | { ok: false; error: string };\n\nfunction safeDivide(a: number, b: number): Result<number> {\n  if (b === 0) return { ok: false, error: "Division by zero" };\n  return { ok: true, data: a / b };\n}`,
    explanation: 'This is the "Result type" pattern (common in Rust/Go). The ok field acts as a discriminant. When ok is true, data is available. When false, error is available. TypeScript narrows the type when you check ok.',
    hints: ['Union of success | failure', 'ok field discriminates the union', 'Check ok to narrow the type'],
    tags: ['result-type', 'discriminated-union', 'generic', 'typescript'],
    concepts: ['ts-discriminated-unions', 'ts-generics'],
  },

  // ===== TS_UTILITY_TYPES =====
  // Beginner faded (Parsons + Cloze) → Beginner Coding

  {
    id: 'ts-util-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_UTILITY_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Assemble a "User" interface (id, name), then a "DraftUser" type where every field is optional, using a utility type. Define the interface first.',
    correctOrder: [
      'interface User {',
      '  id: number;',
      '  name: string;',
      '}',
      'type DraftUser = Partial<User>;',
    ],
    distractorLines: [
      'type DraftUser = Optional<User>;',
      'type DraftUser = Partial(User);',
    ],
    solution: 'interface User {\n  id: number;\n  name: string;\n}\ntype DraftUser = Partial<User>;',
    explanation: 'Partial<T> is the built-in utility that makes every property of T optional — there is no Optional<T>, and utility types use angle brackets Partial<User>, not call parentheses. DraftUser then accepts { } or any subset of User\'s fields.',
    hints: ['The "all optional" utility is Partial', 'Utility types take their argument in angle brackets'],
    tags: ['utility-types', 'partial', 'typescript'],
    concepts: ['ts-utility-types'],
  },

  {
    id: 'ts-util-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_UTILITY_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the utility type that makes every field optional, and the separator between the picked keys.',
    template: '// every field optional\ntype Draft = ___<User>;\n// only id and name\ntype Preview = Pick<User, "id" ___ "name">;',
    blanks: ['Partial', '|'],
    solution: 'type Draft = Partial<User>;\ntype Preview = Pick<User, "id" | "name">;',
    explanation: 'Partial<T> makes all properties optional. Pick<T, Keys> selects a subset; the keys are a union of string literals joined with | — Pick<User, "id" | "name"> keeps just those two fields.',
    hints: ['The "all optional" utility', 'Multiple keys form a union, joined with a single character'],
    tags: ['utility-types', 'partial', 'pick', 'typescript'],
    concepts: ['ts-utility-types'],
  },

  {
    id: 'ts-util-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_UTILITY_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the utility type that removes a field, and the one that makes every field immutable.',
    template: '// User without the id field\ntype NewUser = ___<User, "id">;\n// immutable User\ntype Frozen = ___<User>;',
    blanks: ['Omit', 'Readonly'],
    solution: 'type NewUser = Omit<User, "id">;\ntype Frozen = Readonly<User>;',
    explanation: 'Omit<T, Keys> produces T without the named keys — handy for "create" DTOs that have no id yet. Readonly<T> marks every property readonly, so assignment after creation is a compile error.',
    hints: ['The "remove these keys" utility takes a second key argument', 'The "no mutation" utility wraps the whole type'],
    tags: ['utility-types', 'omit', 'readonly', 'typescript'],
    concepts: ['ts-utility-types'],
  },

  {
    id: 'ts-type-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_UTILITY_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Given interface User { id: number; name: string; email: string; role: string }, create a type "UpdateUser" where all fields are optional (for partial updates) using a utility type.',
    starterCode: `interface User {\n  id: number;\n  name: string;\n  email: string;\n  role: string;\n}\n\n// Make all fields optional\n`,
    testCases: [
      {
        input: 'User interface',
        expectedOutput: 'type UpdateUser = Partial<User>',
        description: 'Should use Partial utility type',
      },
    ],
    solution: `interface User {\n  id: number;\n  name: string;\n  email: string;\n  role: string;\n}\n\ntype UpdateUser = Partial<User>;`,
    explanation: 'Partial<T> makes all properties of T optional. Other useful utility types: Required<T> (all required), Pick<T, Keys> (select specific keys), Omit<T, Keys> (exclude keys), Record<K, V> (key-value map), Readonly<T> (immutable).',
    hints: ['Partial<T> makes all properties optional', 'Other utils: Pick, Omit, Required, Record'],
    tags: ['utility-types', 'partial', 'typescript'],
    concepts: ['ts-utility-types'],
  },

  {
    id: 'ts-util-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_UTILITY_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Given interface User { id: number; name: string; email: string; role: string }, create: "UserPreview" with only id and name (using Pick), and "CreateUser" without id (using Omit).',
    starterCode: `interface User { id: number; name: string; email: string; role: string; }\n\n`,
    testCases: [{ input: 'User interface', expectedOutput: 'Pick<User, "id"|"name"> and Omit<User, "id">', description: 'Should use Pick and Omit' }],
    solution: `interface User { id: number; name: string; email: string; role: string; }\n\ntype UserPreview = Pick<User, "id" | "name">;\ntype CreateUser = Omit<User, "id">;`,
    explanation: 'Pick<T, Keys> creates a type with only the specified keys. Omit<T, Keys> creates a type without the specified keys. Use Pick for API responses (return subset), Omit for creation DTOs (no id yet).',
    hints: ['Pick<Type, "key1" | "key2"> selects keys', 'Omit<Type, "key"> removes keys', 'Combine: Omit<Pick<...>, ...>'],
    tags: ['Pick', 'Omit', 'utility-types', 'typescript'],
    concepts: ['ts-utility-types'],
  },

  {
    id: 'ts-util-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_UTILITY_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Create a type "ReadonlyUser" from User that makes all properties readonly (immutable), and a type "RequiredConfig" from a config with optional fields that makes all fields required.',
    starterCode: `interface User { id: number; name: string; }\ninterface Config { host?: string; port?: number; debug?: boolean; }\n\n`,
    testCases: [{ input: 'User and Config', expectedOutput: 'Readonly<User> and Required<Config>', description: 'Should use Readonly and Required' }],
    solution: `interface User { id: number; name: string; }\ninterface Config { host?: string; port?: number; debug?: boolean; }\n\ntype ReadonlyUser = Readonly<User>;\ntype RequiredConfig = Required<Config>;`,
    explanation: 'Readonly<T> makes all properties readonly — assignment after creation causes a compile error. Required<T> removes all ? optional markers — every property becomes required. These are structural transformations on existing types.',
    hints: ['Readonly prevents mutation', 'Required removes optional markers', 'Both create new types from existing ones'],
    tags: ['Readonly', 'Required', 'utility-types', 'typescript'],
    concepts: ['ts-utility-types'],
  },

  // ===== TS_PROJECT =====
  // Advanced Coding

  {
    id: 'ts-project-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TS_PROJECT,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: `Create a typed wrapper around fetch that always returns a discriminated success/error envelope.

First, define a generic type ApiResponse<T> with three fields:

- success: boolean
- data: T | null — populated on success, null on error
- error: string | null — populated on error, null on success

Then write a generic async function apiCall<T>(url: string): Promise<ApiResponse<T>>.

Behaviour:

- On a successful fetch (response.ok is true), parse the body as JSON and return { success: true, data: parsed, error: null }.
- If response.ok is false, do NOT throw — return { success: false, data: null, error: \`HTTP \${response.status}\` }.
- Wrap the whole thing in a try/catch so network failures (rejected fetch) are also captured: return { success: false, data: null, error: err.message }.

The point of the envelope is that callers never have to wrap a try/catch themselves — they branch on response.success and trust both branches are well-typed.`,
    starterCode: `// Typed API handler\n`,
    testCases: [
      {
        input: 'API URL',
        expectedOutput: 'Generic ApiResponse<T> type and async apiCall<T> function',
        description: 'Should create typed API handler with generics',
      },
    ],
    solution: `interface ApiResponse<T> {\n  success: boolean;\n  data: T | null;\n  error: string | null;\n}\n\nasync function apiCall<T>(url: string): Promise<ApiResponse<T>> {\n  try {\n    const response = await fetch(url);\n    if (!response.ok) {\n      return { success: false, data: null, error: \`HTTP \${response.status}\` };\n    }\n    const data: T = await response.json();\n    return { success: true, data, error: null };\n  } catch (err) {\n    return { success: false, data: null, error: (err as Error).message };\n  }\n}`,
    explanation: 'This project combines generics (ApiResponse<T>), async/await, error handling, and union types (T | null). The generic parameter T flows from the function to the return type, giving callers type-safe access to the response data.',
    hints: ['ApiResponse<T> with data: T | null', 'async function returning Promise<ApiResponse<T>>', 'Handle both HTTP errors and network errors'],
    tags: ['project', 'generics', 'api', 'async', 'typescript'],
    concepts: ['ts-generics', 'js-promises-async'],
  },

  // ===== REACT_COMPONENTS =====
  // Beginner faded (Parsons + Cloze) → Beginner Coding

  {
    id: 'react-comp-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_COMPONENTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Assemble a functional component "Greeting" that destructures a name prop and returns an h1 reading "Hello, {name}!".',
    correctOrder: [
      'function Greeting({ name }) {',
      '  return <h1>Hello, {name}!</h1>;',
      '}',
    ],
    distractorLines: [
      'function Greeting(name) {',
      '  return <h1>Hello, name!</h1>;',
    ],
    solution: 'function Greeting({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}',
    explanation: 'A component is a function returning JSX. Destructure props in the parameter list ({ name }); a bare name parameter would force you to write name.name. Inside JSX, {name} interpolates the value — without the braces it renders the literal text "name".',
    hints: ['Destructure { name } in the parameters', '{name} in JSX inserts the value'],
    tags: ['component', 'props', 'jsx', 'react'],
    concepts: ['react-conditional-rendering', 'js-spread-destructuring'],
  },

  {
    id: 'react-comp-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_COMPONENTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the operator that chooses inline between two JSX values.',
    template: 'function Status({ online }) {\n  return <p>{online ___ "Active" : "Offline"}</p>;\n}',
    blanks: ['?'],
    solution: 'function Status({ online }) {\n  return <p>{online ? "Active" : "Offline"}</p>;\n}',
    explanation: 'The ternary condition ? a : b is the standard way to choose between two values inside JSX, where if/else statements are not allowed. Use condition && <X /> instead when you want to render something OR nothing.',
    hints: ['Inline conditional inside {} uses the ternary operator'],
    tags: ['conditional', 'ternary', 'jsx', 'react'],
    concepts: ['react-conditional-rendering'],
  },

  {
    id: 'react-comp-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_COMPONENTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the operator that renders the badge only when unread is positive, and the prop reference for the count.',
    template: 'function Inbox({ unread }) {\n  return <div>{unread > 0 ___ <span>{___} new</span>}</div>;\n}',
    blanks: ['&&', 'unread'],
    solution: 'function Inbox({ unread }) {\n  return <div>{unread > 0 && <span>{unread} new</span>}</div>;\n}',
    explanation: 'condition && <JSX /> renders the JSX only when the condition is truthy. Guard with unread > 0, not bare unread — a falsy NUMBER like 0 would render the literal "0" instead of nothing.',
    hints: ['Short-circuit render uses &&', 'Interpolate the prop with {unread}'],
    tags: ['conditional', 'short-circuit', 'jsx', 'react'],
    concepts: ['react-conditional-rendering'],
  },

  {
    id: 'react-comp-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_COMPONENTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Write a React functional component "Greeting" that accepts props "name" (string) and renders "Hello, {name}!" in an h1 tag.',
    starterCode: `// Greeting component\n`,
    testCases: [
      {
        input: 'name prop',
        expectedOutput: 'function Greeting({ name }) or React.FC<Props>',
        description: 'Should render greeting with name',
      },
    ],
    solution: `function Greeting({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}`,
    explanation: 'React functional components are JavaScript functions that return JSX. Props are passed as an object and can be destructured in the parameter. JSX uses {expression} for dynamic values.',
    hints: ['Destructure props: { name }', 'Use {name} in JSX for dynamic content'],
    tags: ['component', 'props', 'jsx', 'react'],
    concepts: ['react-conditional-rendering', 'js-spread-destructuring'],
  },

  {
    id: 'react-cond-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_COMPONENTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Write a component "StatusMessage" that takes props "isLoading" (boolean), "error" (string or null), and "data" (any). Render: a loading spinner if loading, an error message if error, or the data if successful.',
    starterCode: `function StatusMessage({ isLoading, error, data }) {
  // your code here
}
`,
    testCases: [
      {
        input: 'loading/error/data states',
        expectedOutput: 'conditional rendering with if/&&/ternary',
        description: 'Should handle all three states',
      },
    ],
    solution: `function StatusMessage({ isLoading, error, data }) {\n  if (isLoading) return <p>Loading...</p>;\n  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;\n  return <div>{JSON.stringify(data)}</div>;\n}`,
    explanation: 'Early returns are the cleanest pattern for multiple exclusive states. Check loading first, then error, then render data. This avoids nested ternaries. Each state gets its own clear render path.',
    hints: ['Early return for loading', 'Early return for error', 'Final return for success'],
    tags: ['conditional', 'loading', 'error-handling', 'patterns', 'react'],
    concepts: ['next-streaming-suspense', 'js-error-handling'],
  },

  // ===== REACT_STATE =====
  // Beginner faded (Parsons + Cloze) → Beginner Coding → Intermediate MC → Intermediate Coding

  {
    id: 'react-state-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_STATE,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Assemble a Counter component: a count state starting at 0 and a button that increments it on click.',
    correctOrder: [
      'function Counter() {',
      '  const [count, setCount] = useState(0);',
      '  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;',
      '}',
    ],
    distractorLines: [
      '  const count = useState(0);',
      '  return <button onClick={setCount(count + 1)}>Count: {count}</button>;',
    ],
    solution: 'function Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;\n}',
    explanation: 'useState returns a [value, setter] pair — destructure both. Pass a FUNCTION to onClick (() => setCount(...)); onClick={setCount(count + 1)} calls it immediately on every render, causing an infinite update loop.',
    hints: ['Destructure [count, setCount] from useState', 'onClick takes a function, not a call'],
    tags: ['useState', 'state', 'events', 'react'],
    concepts: ['react-state-immutability', 'js-dom-events'],
  },

  {
    id: 'react-state-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_STATE,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the hook and the conventional name of its setter.',
    template: 'const [name, ___] = ___("");',
    blanks: ['setName', 'useState'],
    solution: 'const [name, setName] = useState("");',
    explanation: 'useState(initial) returns a [value, setter] tuple. The setter is conventionally named set + the capitalised state name (setName). Calling the setter is the only correct way to update state and trigger a re-render.',
    hints: ['Setter convention: setX for state x', 'The hook is useState'],
    tags: ['useState', 'state', 'react'],
    concepts: ['react-state-immutability'],
  },

  {
    id: 'react-state-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_STATE,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the operator for an immutable add and the method for an immutable remove.',
    template: '// add an item without mutating\nsetItems([___items, newItem]);\n// remove the item with the given id\nsetItems(items.___(item => item.id !== id));',
    blanks: ['...', 'filter'],
    solution: '// add an item without mutating\nsetItems([...items, newItem]);\n// remove the item with the given id\nsetItems(items.filter(item => item.id !== id));',
    explanation: 'State must be replaced, not mutated. Spread (...) builds a new array with the extra item; filter() builds a new array without the matched item. push()/splice() mutate in place, so React keeps the same reference and skips the re-render.',
    hints: ['Spread to add a copy', 'filter to remove by predicate'],
    tags: ['useState', 'immutable', 'arrays', 'react'],
    concepts: ['react-state-immutability', 'js-object-mutation'],
  },

  {
    id: 'react-state-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_STATE,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Write a React component "Counter" with a count state (starting at 0), an increment button, and a display of the current count.',
    starterCode: `import { useState } from "react";

function Counter() {
  // your code here
}
`,
    testCases: [
      {
        input: 'Counter component',
        expectedOutput: 'useState(0) with onClick handler',
        description: 'Should manage count state',
      },
    ],
    solution: `import { useState } from "react";\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>Increment</button>\n    </div>\n  );\n}`,
    explanation: 'useState(initialValue) returns [currentValue, setterFunction]. Never modify state directly — always use the setter. React re-renders the component when state changes. Use the functional form setCount(prev => prev + 1) when the new state depends on the previous.',
    hints: ['const [state, setState] = useState(initial)', 'Use onClick={() => setState(newValue)}'],
    tags: ['useState', 'state', 'events', 'react'],
    concepts: ['react-state-immutability', 'js-dom-events'],
  },

  {
    id: 'react-state-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_STATE,
    course: Course.WEB_DEV,
    question: 'Why should you never mutate state directly in React (e.g., state.push(item))?',
    options: [
      { id: 'a', text: 'It causes memory leaks', isCorrect: false },
      { id: 'b', text: 'It throws a runtime error', isCorrect: false },
      { id: 'c', text: 'React detects changes by comparing references. Mutating the same object/array keeps the same reference, so React does not know to re-render.', isCorrect: true },
      { id: 'd', text: 'It is slower than creating new objects', isCorrect: false },
    ],
    explanation: 'React uses === reference equality to detect state changes. If you mutate an array with push(), the reference stays the same — React thinks nothing changed and skips the re-render. Always create new arrays/objects: [...arr, item], { ...obj, key: value }.',
    tags: ['immutability', 'state', 'reference', 'react'],
    concepts: ['react-state-immutability', 'js-object-mutation'],
  },

  {
    id: 'react-state-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_STATE,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Write a component that manages a list of items in state. Add an input and button to add items, and a delete button next to each item.',
    starterCode: `import { useState } from "react";\n\nfunction ItemList() {\n`,
    testCases: [{ input: 'item list', expectedOutput: 'useState with array, add/delete handlers', description: 'Should manage list state' }],
    solution: `import { useState } from "react";\n\nfunction ItemList() {\n  const [items, setItems] = useState([]);\n  const [input, setInput] = useState("");\n\n  const addItem = () => {\n    if (input.trim()) {\n      setItems([...items, { id: Date.now(), text: input }]);\n      setInput("");\n    }\n  };\n\n  const deleteItem = (id) => {\n    setItems(items.filter(item => item.id !== id));\n  };\n\n  return (\n    <div>\n      <input value={input} onChange={e => setInput(e.target.value)} />\n      <button onClick={addItem}>Add</button>\n      <ul>\n        {items.map(item => (\n          <li key={item.id}>\n            {item.text}\n            <button onClick={() => deleteItem(item.id)}>X</button>\n          </li>\n        ))}\n      </ul>\n    </div>\n  );\n}`,
    explanation: 'State is immutable — use spread [...items, newItem] to add, filter() to delete. Never push/splice directly. key={item.id} helps React track which items changed. Controlled input with value + onChange.',
    hints: ['Spread to add: [...items, newItem]', 'Filter to delete: items.filter(i => i.id !== id)', 'Always use unique keys'],
    tags: ['useState', 'list', 'crud', 'immutable', 'react'],
    concepts: ['react-state-immutability', 'js-object-mutation'],
  },

  {
    id: 'react-state-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_STATE,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Write a component that lifts state up: a parent "TemperatureConverter" with a temperature state, and two child inputs for Celsius and Fahrenheit that stay in sync.',
    starterCode: `import { useState } from "react";\n\nfunction TemperatureConverter() {\n`,
    testCases: [{ input: 'synced inputs', expectedOutput: 'parent state with conversion functions passed to children', description: 'Should lift state up' }],
    solution: `import { useState } from "react";\n\nfunction TemperatureConverter() {\n  const [celsius, setCelsius] = useState("");\n\n  const fahrenheit = celsius ? ((parseFloat(celsius) * 9/5) + 32).toFixed(1) : "";\n\n  return (\n    <div>\n      <label>Celsius: </label>\n      <input value={celsius} onChange={e => setCelsius(e.target.value)} />\n      <label>Fahrenheit: </label>\n      <input value={fahrenheit} readOnly />\n    </div>\n  );\n}`,
    explanation: 'Lifting state up: the parent owns the state and passes it (or derived values) to children. Fahrenheit is derived from celsius — no need for separate state. This is React\'s answer to keeping multiple inputs in sync.',
    hints: ['Single source of truth in parent', 'Derive other values from state', 'No duplicate state for computed values'],
    tags: ['lifting-state', 'derived', 'controlled', 'react'],
    concepts: ['react-controlled-forms'],
  },

  // ===== REACT_EFFECTS =====
  // Beginner faded (Parsons + Cloze) → Beginner Coding → Intermediate Coding

  {
    id: 'react-effect-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_EFFECTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Assemble a useEffect that starts an interval on mount and clears it on unmount. Order: open the effect, create the interval, return the cleanup, then close with the dependency array.',
    correctOrder: [
      'useEffect(() => {',
      '  const id = setInterval(tick, 1000);',
      '  return () => clearInterval(id);',
      '}, []);',
    ],
    distractorLines: [
      '  clearInterval(id);',
      '}, );',
    ],
    solution: 'useEffect(() => {\n  const id = setInterval(tick, 1000);\n  return () => clearInterval(id);\n}, []);',
    explanation: 'The function RETURNED from an effect is its cleanup, run before the next effect and on unmount — return () => clearInterval(id), not a bare clearInterval(id). The empty [] dependency array makes the effect run once on mount.',
    hints: ['Cleanup is a returned function', 'Empty [] = run once on mount'],
    tags: ['useEffect', 'cleanup', 'lifecycle', 'react'],
    concepts: ['react-effect-deps', 'react-effect-cleanup'],
  },

  {
    id: 'react-effect-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_EFFECTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the dependency that makes the effect re-run whenever count changes.',
    template: 'useEffect(() => {\n  document.title = "Count: " + count;\n}, [___]);',
    blanks: ['count'],
    solution: 'useEffect(() => {\n  document.title = "Count: " + count;\n}, [count]);',
    explanation: 'The dependency array lists every reactive value the effect reads. Including count re-runs the effect after each change. An empty [] would run it only once (leaving a stale title); omitting the array entirely runs it on every render.',
    hints: ['List the value the effect reads'],
    tags: ['useEffect', 'deps', 'react'],
    concepts: ['react-effect-deps'],
  },

  {
    id: 'react-effect-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_EFFECTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the method that detaches the listener in cleanup, and the dependency array that runs this effect only once.',
    template: 'useEffect(() => {\n  window.addEventListener("resize", onResize);\n  return () => window.___("resize", onResize);\n}, ___);',
    blanks: ['removeEventListener', '[]'],
    solution: 'useEffect(() => {\n  window.addEventListener("resize", onResize);\n  return () => window.removeEventListener("resize", onResize);\n}, []);',
    explanation: 'Cleanup must mirror setup: removeEventListener with the SAME event name and SAME function reference. The empty [] subscribes once on mount and unsubscribes on unmount.',
    hints: ['Cleanup mirrors addEventListener', '[] = subscribe once'],
    tags: ['useEffect', 'cleanup', 'events', 'react'],
    concepts: ['react-effect-cleanup', 'js-dom-events'],
  },

  {
    id: 'react-effect-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_EFFECTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Write a useEffect that fetches user data from "/api/users" when the component mounts, stores it in state, and cleans up by aborting the fetch on unmount.',
    starterCode: `import { useState, useEffect } from "react";\n\nfunction UserList() {\n`,
    testCases: [
      {
        input: 'UserList component',
        expectedOutput: 'useEffect with fetch, AbortController cleanup, empty deps',
        description: 'Should fetch on mount with cleanup',
      },
    ],
    solution: `import { useState, useEffect } from "react";\n\nfunction UserList() {\n  const [users, setUsers] = useState([]);\n\n  useEffect(() => {\n    const controller = new AbortController();\n\n    fetch("/api/users", { signal: controller.signal })\n      .then(res => res.json())\n      .then(data => setUsers(data))\n      .catch(err => {\n        if (err.name !== "AbortError") console.error(err);\n      });\n\n    return () => controller.abort();\n  }, []);\n\n  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;\n}`,
    explanation: 'useEffect with [] as dependency array runs once on mount. The cleanup function (returned) runs on unmount. AbortController cancels in-flight requests when the component unmounts, preventing "setState on unmounted component" warnings.',
    hints: ['Empty deps [] = run once on mount', 'Return a cleanup function for unmount', 'AbortController cancels fetch on unmount'],
    tags: ['useEffect', 'fetch', 'cleanup', 'lifecycle', 'react'],
    concepts: ['react-effect-deps', 'js-promises-async', 'react-effect-cleanup'],
  },

  {
    id: 'react-fetch-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_EFFECTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Write a custom hook "useFetch" that takes a URL, manages loading/error/data state, fetches on mount, and returns { data, loading, error }.',
    starterCode: `import { useState, useEffect } from "react";\n\nfunction useFetch(url) {\n`,
    testCases: [
      {
        input: 'API URL',
        expectedOutput: 'custom hook with useState for loading/error/data and useEffect for fetch',
        description: 'Should create reusable fetch hook',
      },
    ],
    solution: `import { useState, useEffect } from "react";\n\nfunction useFetch(url) {\n  const [data, setData] = useState(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n\n  useEffect(() => {\n    const controller = new AbortController();\n    setLoading(true);\n\n    fetch(url, { signal: controller.signal })\n      .then(res => {\n        if (!res.ok) throw new Error("HTTP " + res.status);\n        return res.json();\n      })\n      .then(data => { setData(data); setError(null); })\n      .catch(err => {\n        if (err.name !== "AbortError") setError(err.message);\n      })\n      .finally(() => setLoading(false));\n\n    return () => controller.abort();\n  }, [url]);\n\n  return { data, loading, error };\n}`,
    explanation: 'This is the standard data fetching pattern in React. Three states (loading/error/data), AbortController for cleanup, error handling for HTTP errors. Consumers use: const { data, loading, error } = useFetch("/api/users"). In production, consider React Query or SWR.',
    hints: ['Three states: loading, error, data', 'AbortController for cleanup on unmount', 'Return object for easy destructuring'],
    tags: ['custom-hook', 'fetch', 'loading', 'pattern', 'react'],
    concepts: ['react-custom-hooks', 'js-promises-async', 'next-streaming-suspense'],
  },

  // ===== REACT_HOOKS =====
  // Beginner faded (Parsons + Cloze) → Beginner Coding → Intermediate Coding → Advanced Coding

  {
    id: 'react-hooks-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_HOOKS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Assemble a counter reducer that handles an "increment" action and falls back to the current state. Order: function header, switch header, the increment case, the default case, then close the switch and the function.',
    correctOrder: [
      'function reducer(state, action) {',
      '  switch (action.type) {',
      '    case "increment": return { count: state.count + 1 };',
      '    default: return state;',
      '  }',
      '}',
    ],
    distractorLines: [
      '    case "increment": state.count + 1;',
      '    default: return undefined;',
    ],
    solution: 'function reducer(state, action) {\n  switch (action.type) {\n    case "increment": return { count: state.count + 1 };\n    default: return state;\n  }\n}',
    explanation: 'A reducer is (state, action) => newState. Each case must RETURN a new state object; case "increment": state.count + 1 without return falls through to undefined. The default case returns the unchanged state so unknown actions are safe no-ops.',
    hints: ['Each case returns new state', 'default returns the current state'],
    tags: ['useReducer', 'state', 'react'],
    concepts: ['react-state-immutability'],
  },

  {
    id: 'react-hooks-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_HOOKS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the hook that holds a mutable reference, and the property that points at the DOM node.',
    template: 'const inputRef = ___(null);\nreturn (\n  <>\n    <input ref={inputRef} />\n    <button onClick={() => inputRef.___.focus()}>Focus</button>\n  </>\n);',
    blanks: ['useRef', 'current'],
    solution: 'const inputRef = useRef(null);\nreturn (\n  <>\n    <input ref={inputRef} />\n    <button onClick={() => inputRef.current.focus()}>Focus</button>\n  </>\n);',
    explanation: 'useRef(null) creates a ref object whose .current is set to the DOM node once React attaches ref={inputRef}. Reading or writing .current does not trigger a re-render — unlike state.',
    hints: ['Hook for a persistent mutable box', 'The node lives on .current'],
    tags: ['useRef', 'dom', 'react'],
    concepts: ['react-ref-imperative', 'js-dom-events'],
  },

  {
    id: 'react-hooks-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_HOOKS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the hook that caches an expensive result, and the dependency it recomputes on.',
    template: 'const visible = ___(() => items.filter(i => i.active), [___]);',
    blanks: ['useMemo', 'items'],
    solution: 'const visible = useMemo(() => items.filter(i => i.active), [items]);',
    explanation: 'useMemo(fn, deps) caches fn\'s result and only recomputes when a dependency changes. Listing [items] recomputes the filtered list only when items changes, not on every render. Use it for genuinely expensive work, not every value.',
    hints: ['Hook that memoizes a computed value', 'Recompute when the source array changes'],
    tags: ['useMemo', 'memoization', 'performance', 'react'],
    concepts: ['react-memoization'],
  },

  {
    id: 'react-hooks-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_HOOKS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Write a custom hook "useLocalStorage" that syncs state with localStorage. It should take a key and initial value, return [value, setValue] like useState.',
    starterCode: `import { useState, useEffect } from "react";

function useLocalStorage(key, initialValue) {
  // your code here
}
`,
    testCases: [
      {
        input: 'key and initialValue',
        expectedOutput: 'custom hook with useState + useEffect + localStorage',
        description: 'Should sync state with localStorage',
      },
    ],
    solution: `import { useState, useEffect } from "react";\n\nfunction useLocalStorage(key, initialValue) {\n  const [value, setValue] = useState(() => {\n    const saved = localStorage.getItem(key);\n    return saved !== null ? JSON.parse(saved) : initialValue;\n  });\n\n  useEffect(() => {\n    localStorage.setItem(key, JSON.stringify(value));\n  }, [key, value]);\n\n  return [value, setValue];\n}`,
    explanation: 'Custom hooks extract reusable stateful logic. This hook initialises from localStorage (lazy initialiser in useState), and syncs changes back via useEffect. Custom hooks must start with "use" to follow React conventions.',
    hints: ['Use lazy initialiser: useState(() => ...)', 'Sync to localStorage in useEffect', 'Return [value, setValue] like useState'],
    tags: ['custom-hook', 'localStorage', 'useState', 'useEffect', 'react'],
    concepts: ['react-custom-hooks', 'js-dom-events', 'react-state-immutability', 'react-effect-deps'],
  },

  {
    id: 'react-reducer-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_HOOKS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Rewrite a counter using useReducer instead of useState. The reducer should handle "increment", "decrement", and "reset" actions.',
    starterCode: `import { useReducer } from "react";\n\n`,
    testCases: [
      {
        input: 'Counter with useReducer',
        expectedOutput: 'useReducer with switch on action.type',
        description: 'Should manage state with useReducer',
      },
    ],
    solution: `import { useReducer } from "react";\n\nfunction reducer(state, action) {\n  switch (action.type) {\n    case "increment": return { count: state.count + 1 };\n    case "decrement": return { count: state.count - 1 };\n    case "reset": return { count: 0 };\n    default: throw new Error("Unknown action: " + action.type);\n  }\n}\n\nfunction Counter() {\n  const [state, dispatch] = useReducer(reducer, { count: 0 });\n\n  return (\n    <div>\n      <p>Count: {state.count}</p>\n      <button onClick={() => dispatch({ type: "increment" })}>+</button>\n      <button onClick={() => dispatch({ type: "decrement" })}>-</button>\n      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>\n    </div>\n  );\n}`,
    explanation: 'useReducer is like useState but for complex state logic. The reducer function takes (state, action) and returns new state. dispatch({type}) sends actions. Preferable over useState when state updates depend on previous state or involve multiple sub-values.',
    hints: ['reducer(state, action) returns new state', 'dispatch({ type: "action" }) triggers updates', 'useReducer(reducer, initialState)'],
    tags: ['useReducer', 'state', 'dispatch', 'react'],
    concepts: ['react-state-immutability'],
  },

  {
    id: 'react-perf-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_HOOKS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Given a component that filters a large list on every render, use useMemo to memoize the filtered result so it only recalculates when "items" or "searchTerm" change.',
    starterCode: `import { useState, useMemo } from "react";

function FilteredList({ items }) {
  // your code here
}
`,
    testCases: [
      {
        input: 'expensive filter',
        expectedOutput: 'useMemo(() => items.filter(...), [items, searchTerm])',
        description: 'Should memoize filtered result',
      },
    ],
    solution: `import { useState, useMemo } from "react";\n\nfunction FilteredList({ items }) {\n  const [searchTerm, setSearchTerm] = useState("");\n\n  const filtered = useMemo(() => {\n    return items.filter(item =>\n      item.name.toLowerCase().includes(searchTerm.toLowerCase())\n    );\n  }, [items, searchTerm]);\n\n  return (\n    <div>\n      <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />\n      <ul>{filtered.map(item => <li key={item.id}>{item.name}</li>)}</ul>\n    </div>\n  );\n}`,
    explanation: 'useMemo(fn, deps) caches the result of fn and only recomputes when deps change. Without it, the filter runs on every render (even unrelated state changes). Use useMemo for expensive computations, not for every value.',
    hints: ['useMemo(() => computation, [dependencies])', 'Only recomputes when deps change', 'Don\'t overuse — only for expensive operations'],
    tags: ['useMemo', 'performance', 'memoization', 'react'],
    concepts: ['react-memoization'],
  },

  {
    id: 'react-ref-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_HOOKS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Use useRef to create a component with a text input and a "Focus" button that focuses the input when clicked.',
    starterCode: `import { useRef } from "react";

function FocusInput() {
  // your code here
}
`,
    testCases: [
      {
        input: 'focus input',
        expectedOutput: 'useRef(null) with ref={inputRef} and inputRef.current.focus()',
        description: 'Should focus input with useRef',
      },
    ],
    solution: `import { useRef } from "react";\n\nfunction FocusInput() {\n  const inputRef = useRef(null);\n\n  return (\n    <div>\n      <input ref={inputRef} type="text" />\n      <button onClick={() => inputRef.current.focus()}>Focus</button>\n    </div>\n  );\n}`,
    explanation: 'useRef creates a mutable ref object that persists across renders. ref={inputRef} attaches it to a DOM element. inputRef.current gives you the actual DOM node. Unlike state, changing a ref does not trigger a re-render.',
    hints: ['useRef(null) creates the ref', 'Attach with ref={myRef}', 'Access DOM node with myRef.current'],
    tags: ['useRef', 'dom', 'focus', 'react'],
    concepts: ['react-ref-imperative', 'js-dom-events', 'a11y-keyboard-nav'],
  },

  {
    id: 'react-perf-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_HOOKS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Use useCallback to memoize an "onDelete" handler passed to child components, preventing unnecessary re-renders of the children.',
    starterCode: `import { useState, useCallback } from "react";

function TodoList() {
  // your code here
}
`,
    testCases: [
      {
        input: 'memoized callback',
        expectedOutput: 'useCallback(() => ..., [deps])',
        description: 'Should memoize callback with useCallback',
      },
    ],
    solution: `import { useState, useCallback } from "react";\n\nfunction TodoList() {\n  const [todos, setTodos] = useState([]);\n\n  const onDelete = useCallback((id) => {\n    setTodos(prev => prev.filter(t => t.id !== id));\n  }, []);\n\n  return (\n    <ul>\n      {todos.map(todo => (\n        <TodoItem key={todo.id} todo={todo} onDelete={onDelete} />\n      ))}\n    </ul>\n  );\n}`,
    explanation: 'useCallback(fn, deps) returns a memoized version of the function that only changes when deps change. Without it, a new function is created every render, causing child components to re-render even if their props haven\'t changed (when using React.memo).',
    hints: ['useCallback memoizes the function reference', 'Use functional update (prev => ...) to avoid deps on state', 'Pair with React.memo on child components'],
    tags: ['useCallback', 'performance', 'memoization', 'react'],
    concepts: ['react-memoization'],
  },

  // ===== REACT_CONTEXT =====
  // Beginner faded (Parsons + Cloze) → Intermediate MC → Beginner/Intermediate Coding

  {
    id: 'react-context-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_CONTEXT,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Assemble a ThemeContext (default "light") and a useTheme hook that reads it. Order: create the context, the hook header, the return line, then the closing brace.',
    correctOrder: [
      'const ThemeContext = createContext("light");',
      'function useTheme() {',
      '  return useContext(ThemeContext);',
      '}',
    ],
    distractorLines: [
      'const ThemeContext = createContext;',
      '  return useContext();',
    ],
    solution: 'const ThemeContext = createContext("light");\nfunction useTheme() {\n  return useContext(ThemeContext);\n}',
    explanation: 'createContext(default) must be CALLED with the default value. useContext must be passed the context object (useContext(ThemeContext)); calling it with no argument returns undefined. Wrapping useContext in a custom hook gives consumers a clean useTheme() API.',
    hints: ['createContext is called with a default', 'Pass the context to useContext'],
    tags: ['context', 'useContext', 'custom-hook', 'react'],
    concepts: ['react-context', 'react-custom-hooks'],
  },

  {
    id: 'react-context-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_CONTEXT,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the function that creates a context and the hook that reads it.',
    template: 'const AuthContext = ___(null);\nfunction useAuth() {\n  return ___(AuthContext);\n}',
    blanks: ['createContext', 'useContext'],
    solution: 'const AuthContext = createContext(null);\nfunction useAuth() {\n  return useContext(AuthContext);\n}',
    explanation: 'createContext(default) builds the context object once. useContext(Context) subscribes a component to its current value and re-renders when the provider value changes.',
    hints: ['One creates, one consumes'],
    tags: ['context', 'useContext', 'react'],
    concepts: ['react-context'],
  },

  {
    id: 'react-context-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_CONTEXT,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the sub-component that supplies the context value to the tree below it.',
    template: 'function ThemeProvider({ children }) {\n  const [theme, setTheme] = useState("light");\n  return (\n    <ThemeContext.___ value={{ theme, setTheme }}>\n      {children}\n    </ThemeContext.Provider>\n  );\n}',
    blanks: ['Provider'],
    solution: 'function ThemeProvider({ children }) {\n  const [theme, setTheme] = useState("light");\n  return (\n    <ThemeContext.Provider value={{ theme, setTheme }}>\n      {children}\n    </ThemeContext.Provider>\n  );\n}',
    explanation: 'Context.Provider wraps a subtree and passes data through the value prop; every consumer below re-renders when value changes. {children} renders whatever the provider wraps.',
    hints: ['The value-supplying sub-component of a context'],
    tags: ['context', 'provider', 'react'],
    concepts: ['react-context'],
  },

  {
    id: 'react-ctx-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_CONTEXT,
    course: Course.WEB_DEV,
    question: 'When should you use Context vs prop drilling vs a state management library?',
    options: [
      { id: 'a', text: 'Always use Context', isCorrect: false },
      { id: 'b', text: 'Always use Redux', isCorrect: false },
      { id: 'c', text: 'Never use prop drilling', isCorrect: false },
      { id: 'd', text: 'Props for 1-2 levels. Context for global state shared by many components (theme, auth, locale). State library (Zustand/Redux) for complex state with many updates.', isCorrect: true },
    ],
    explanation: 'Prop drilling is fine for shallow trees. Context is great for infrequently-changing global state (theme, auth, locale) — but every consumer re-renders on any context change. For frequently changing state with many consumers, use Zustand (simple) or Redux (complex).',
    tags: ['context', 'prop-drilling', 'state-management', 'react'],
    concepts: ['react-context'],
  },

  {
    id: 'react-context-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_CONTEXT,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Create a ThemeContext with createContext (default "light"), a ThemeProvider component that manages theme state, and a useTheme custom hook to consume it.',
    starterCode: `import { createContext, useContext, useState } from "react";\n\n`,
    testCases: [
      {
        input: 'Theme context',
        expectedOutput: 'createContext, Provider with useState, useContext hook',
        description: 'Should create context with provider and consumer hook',
      },
    ],
    solution: `import { createContext, useContext, useState } from "react";\n\nconst ThemeContext = createContext("light");\n\nfunction ThemeProvider({ children }) {\n  const [theme, setTheme] = useState("light");\n\n  return (\n    <ThemeContext.Provider value={{ theme, setTheme }}>\n      {children}\n    </ThemeContext.Provider>\n  );\n}\n\nfunction useTheme() {\n  return useContext(ThemeContext);\n}`,
    explanation: 'Context provides a way to pass data through the component tree without prop drilling. createContext sets the default. Provider wraps the tree and supplies the value. useContext consumes it. The custom hook (useTheme) is a clean API for consumers.',
    hints: ['createContext(default) creates the context', 'Provider wraps children with a value', 'useContext(Context) consumes the value'],
    tags: ['context', 'provider', 'useContext', 'custom-hook', 'react'],
    concepts: ['react-context', 'react-custom-hooks'],
  },

  {
    id: 'react-ctx-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_CONTEXT,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Create an AuthContext that provides { user, login, logout } to the app. The login function takes a username and sets user state. Logout sets user to null. Create a useAuth hook.',
    starterCode: `import { createContext, useContext, useState } from "react";\n\n`,
    testCases: [{ input: 'auth context', expectedOutput: 'createContext, Provider with login/logout, useAuth hook', description: 'Should create auth context' }],
    solution: `import { createContext, useContext, useState } from "react";\n\nconst AuthContext = createContext(null);\n\nfunction AuthProvider({ children }) {\n  const [user, setUser] = useState(null);\n\n  const login = (username) => setUser({ username });\n  const logout = () => setUser(null);\n\n  return (\n    <AuthContext.Provider value={{ user, login, logout }}>\n      {children}\n    </AuthContext.Provider>\n  );\n}\n\nfunction useAuth() {\n  const context = useContext(AuthContext);\n  if (!context) throw new Error("useAuth must be within AuthProvider");\n  return context;\n}`,
    explanation: 'This is the standard auth context pattern. The Provider manages user state. login/logout modify state. useAuth gives any component access to the user and auth functions. The error in useAuth catches misuse outside the Provider.',
    hints: ['Provider owns the state', 'Custom hook wraps useContext', 'Throw error if used outside Provider'],
    tags: ['context', 'auth', 'provider', 'custom-hook', 'react'],
    concepts: ['react-context', 'web-security-auth-tokens', 'react-custom-hooks'],
  },

  // ===== REACT_FORMS =====
  // Beginner faded (Parsons + Cloze) → Beginner Coding → Intermediate Coding

  {
    id: 'react-forms-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_FORMS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Assemble a submit handler that stops the browser reload and logs the email. Order: handler header, prevent the default, log the value, then close the arrow function.',
    correctOrder: [
      'const handleSubmit = (e) => {',
      '  e.preventDefault();',
      '  console.log(email);',
      '};',
    ],
    distractorLines: [
      '  e.stopPropagation();',
      '  return false;',
    ],
    solution: 'const handleSubmit = (e) => {\n  e.preventDefault();\n  console.log(email);\n};',
    explanation: 'e.preventDefault() stops the form\'s default full-page reload so React can handle the data. stopPropagation() only halts event bubbling (a different concern), and return false does nothing useful in a React handler.',
    hints: ['preventDefault stops the reload', 'stopPropagation is for bubbling, not this'],
    tags: ['forms', 'events', 'controlled', 'react'],
    concepts: ['react-controlled-forms', 'js-dom-events'],
  },

  {
    id: 'react-forms-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_FORMS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the event prop that makes the input controlled, and the property holding the typed text.',
    template: '<input value={email} ___={(e) => setEmail(e.target.___)} />',
    blanks: ['onChange', 'value'],
    solution: '<input value={email} onChange={(e) => setEmail(e.target.value)} />',
    explanation: 'A controlled input binds value={state} and updates that state in onChange. e.target.value is the current text of the input. Without onChange the field is effectively read-only.',
    hints: ['The event prop fired on every keystroke', 'Read the typed text from e.target'],
    tags: ['forms', 'controlled', 'events', 'react'],
    concepts: ['react-controlled-forms'],
  },

  {
    id: 'react-forms-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_FORMS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the method that prevents the page reload and the form event prop that runs the handler.',
    template: 'const handleSubmit = (e) => {\n  e.___();\n  save(form);\n};\nreturn <form ___={handleSubmit}>...</form>;',
    blanks: ['preventDefault', 'onSubmit'],
    solution: 'const handleSubmit = (e) => {\n  e.preventDefault();\n  save(form);\n};\nreturn <form onSubmit={handleSubmit}>...</form>;',
    explanation: 'Attach the handler to the form\'s onSubmit (fired by Enter or the submit button), then call e.preventDefault() first so the browser does not reload the page.',
    hints: ['Method on the event object', 'Form-level submit prop'],
    tags: ['forms', 'events', 'react'],
    concepts: ['react-controlled-forms'],
  },

  {
    id: 'react-forms-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_FORMS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Write a controlled form component "LoginForm" with email and password inputs, and an onSubmit handler that prevents default and logs the values.',
    starterCode: `import { useState } from "react";\n\nfunction LoginForm() {\n`,
    testCases: [
      {
        input: 'Login form',
        expectedOutput: 'useState for email/password, controlled inputs, onSubmit with preventDefault',
        description: 'Should create controlled form',
      },
    ],
    solution: `import { useState } from "react";\n\nfunction LoginForm() {\n  const [email, setEmail] = useState("");\n  const [password, setPassword] = useState("");\n\n  const handleSubmit = (e) => {\n    e.preventDefault();\n    console.log({ email, password });\n  };\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input\n        type="email"\n        value={email}\n        onChange={(e) => setEmail(e.target.value)}\n      />\n      <input\n        type="password"\n        value={password}\n        onChange={(e) => setPassword(e.target.value)}\n      />\n      <button type="submit">Login</button>\n    </form>\n  );\n}`,
    explanation: 'Controlled components bind input value to state and update state on change. This gives React full control over the form data. Always use e.preventDefault() in onSubmit to prevent page reload. value + onChange = controlled input.',
    hints: ['value={state} + onChange={setState} = controlled', 'e.preventDefault() stops page reload', 'Each input needs its own state'],
    tags: ['forms', 'controlled', 'useState', 'events', 'react'],
    concepts: ['web-html-forms-a11y', 'react-controlled-forms', 'react-state-immutability', 'js-dom-events'],
  },

  {
    id: 'react-form-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_FORMS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Build a registration form with: name, email, password fields, all required. Show validation errors below each field. Disable the submit button until all fields are filled.',
    starterCode: `import { useState } from "react";\n\nfunction RegisterForm() {\n`,
    testCases: [{ input: 'registration form', expectedOutput: 'useState for each field + errors, validation on submit', description: 'Should create form with validation' }],
    solution: `import { useState } from "react";\n\nfunction RegisterForm() {\n  const [form, setForm] = useState({ name: "", email: "", password: "" });\n  const [errors, setErrors] = useState({});\n\n  const handleChange = (e) => {\n    setForm({ ...form, [e.target.name]: e.target.value });\n  };\n\n  const handleSubmit = (e) => {\n    e.preventDefault();\n    const newErrors = {};\n    if (!form.name) newErrors.name = "Name is required";\n    if (!form.email.includes("@")) newErrors.email = "Valid email required";\n    if (form.password.length < 8) newErrors.password = "Min 8 characters";\n    setErrors(newErrors);\n    if (Object.keys(newErrors).length === 0) {\n      console.log("Submit:", form);\n    }\n  };\n\n  const isValid = form.name && form.email && form.password;\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />\n      {errors.name && <span>{errors.name}</span>}\n      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />\n      {errors.email && <span>{errors.email}</span>}\n      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" />\n      {errors.password && <span>{errors.password}</span>}\n      <button type="submit" disabled={!isValid}>Register</button>\n    </form>\n  );\n}`,
    explanation: 'Single handleChange with [e.target.name] updates the right field dynamically. Validation on submit sets error messages. Object.keys(errors).length === 0 checks if all valid. disabled={!isValid} prevents premature submission.',
    hints: ['One state object for all fields', '[e.target.name] for dynamic field update', 'Validate on submit, show errors conditionally'],
    tags: ['forms', 'validation', 'controlled', 'react'],
    concepts: ['web-html-forms-a11y', 'forms-zod-schema', 'react-controlled-forms'],
  },

  {
    id: 'react-form-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_FORMS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Build a select dropdown component that manages a list of options and calls an onChange callback with the selected value. Include a "Choose..." placeholder option.',
    starterCode: `function SelectField({ label, options, value, onChange }) {\n`,
    testCases: [{ input: 'select component', expectedOutput: 'controlled select with map over options', description: 'Should create reusable select' }],
    solution: `function SelectField({ label, options, value, onChange }) {\n  return (\n    <div>\n      <label>{label}</label>\n      <select value={value} onChange={e => onChange(e.target.value)}>\n        <option value="" disabled>Choose...</option>\n        {options.map(opt => (\n          <option key={opt.value} value={opt.value}>{opt.label}</option>\n        ))}\n      </select>\n    </div>\n  );\n}`,
    explanation: 'Controlled select: value prop syncs with state, onChange updates state. Disabled placeholder option with empty value. options.map renders each option. This is a reusable component pattern — pass data and callbacks via props.',
    hints: ['value + onChange = controlled select', 'disabled on placeholder option', 'Map over options array for choices'],
    tags: ['forms', 'select', 'controlled', 'reusable', 'react'],
    concepts: ['web-html-forms-a11y', 'react-controlled-forms'],
  },

  // ===== REACT_PATTERNS =====
  // Beginner faded (Parsons + Cloze) → Beginner Coding → Advanced MC → Advanced Coding

  {
    id: 'react-patterns-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_PATTERNS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Assemble a router with a single home route. Order from outermost to innermost: the router, the routes container, the route itself, then close the containers in reverse.',
    correctOrder: [
      '<BrowserRouter>',
      '  <Routes>',
      '    <Route path="/" element={<Home />} />',
      '  </Routes>',
      '</BrowserRouter>',
    ],
    distractorLines: [
      '    <Route path="/" component={Home} />',
      '  <Switch>',
    ],
    solution: '<BrowserRouter>\n  <Routes>\n    <Route path="/" element={<Home />} />\n  </Routes>\n</BrowserRouter>',
    explanation: 'React Router v6 nests Route inside Routes inside BrowserRouter, and maps a path to a component with element={<Home />}. The old v5 API (component={Home}, <Switch>) no longer works in v6.',
    hints: ['BrowserRouter > Routes > Route', 'v6 uses element=, not component='],
    tags: ['react-router', 'routing', 'react'],
    concepts: ['next-app-router'],
  },

  {
    id: 'react-patterns-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_PATTERNS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the Route prop that names the component to render, and the hook that reads the URL parameter.',
    template: '<Route path="/users/:id" ___={<UserProfile />} />\n// inside UserProfile:\nconst { id } = ___();',
    blanks: ['element', 'useParams'],
    solution: '<Route path="/users/:id" element={<UserProfile />} />\n// inside UserProfile:\nconst { id } = useParams();',
    explanation: 'In v6 a route renders via element={<Component />}. The :id segment is exposed by useParams(), which returns an object of matched params — destructure { id } to read it.',
    hints: ['v6 route render prop', 'Hook returning the route params'],
    tags: ['react-router', 'useParams', 'routing', 'react'],
    concepts: ['next-app-router', 'next-data-fetching'],
  },

  {
    id: 'react-patterns-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_PATTERNS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the function that defers loading a component and the boundary that shows a fallback while it loads.',
    template: 'const Dashboard = ___(() => import("./Dashboard"));\nreturn (\n  <___ fallback={<p>Loading...</p>}>\n    <Dashboard />\n  </Suspense>\n);',
    blanks: ['lazy', 'Suspense'],
    solution: 'const Dashboard = lazy(() => import("./Dashboard"));\nreturn (\n  <Suspense fallback={<p>Loading...</p>}>\n    <Dashboard />\n  </Suspense>\n);',
    explanation: 'lazy(() => import(...)) code-splits a component so it only downloads when first rendered. It must render inside a <Suspense> boundary that supplies a fallback UI during the load.',
    hints: ['Defers the import', 'Boundary providing the fallback'],
    tags: ['lazy', 'suspense', 'code-splitting', 'react'],
    concepts: ['next-streaming-suspense'],
  },

  {
    id: 'react-router-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_PATTERNS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Set up React Router with three routes: "/" renders Home, "/about" renders About, "/users/:id" renders UserProfile. Include a nav with Link components.',
    starterCode: `// Assume Home, About, and UserProfile components already exist — import them from "./components".

function App() {
  // your code here
}
`,
    testCases: [
      {
        input: 'routing setup',
        expectedOutput: 'BrowserRouter, Routes, Route with path and element',
        description: 'Should set up React Router',
      },
    ],
    solution: `import { BrowserRouter, Routes, Route, Link } from "react-router-dom";\n\nfunction App() {\n  return (\n    <BrowserRouter>\n      <nav>\n        <Link to="/">Home</Link>\n        <Link to="/about">About</Link>\n      </nav>\n      <Routes>\n        <Route path="/" element={<Home />} />\n        <Route path="/about" element={<About />} />\n        <Route path="/users/:id" element={<UserProfile />} />\n      </Routes>\n    </BrowserRouter>\n  );\n}`,
    explanation: 'BrowserRouter provides routing context. Routes is the switch container. Route maps a path to a component via element={}. :id is a URL parameter (access with useParams()). Link renders an <a> without page reload.',
    hints: ['Wrap app in BrowserRouter', 'Route path="/path" element={<Component />}', ':id for dynamic segments'],
    tags: ['react-router', 'routing', 'link', 'react'],
    concepts: ['next-app-router', 'web-html-link-security'],
  },

  {
    id: 'react-router-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_PATTERNS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Write a UserProfile component that reads the "id" URL parameter using useParams() and displays "User ID: {id}".',
    starterCode: `// Import useParams from react-router-dom\n// Define UserProfile: destructure { id } from useParams() and render <h1>User ID: {id}</h1>\n`,
    testCases: [
      {
        input: '/users/42',
        expectedOutput: 'useParams() to get id',
        description: 'Should read URL params',
      },
    ],
    solution: `import { useParams } from "react-router-dom";\n\nfunction UserProfile() {\n  const { id } = useParams();\n\n  return <h1>User ID: {id}</h1>;\n}`,
    explanation: 'useParams() returns an object of URL parameters defined in the Route path (e.g., :id). Destructure to get specific params. Use this to fetch user data, load product details, etc.',
    hints: ['const { paramName } = useParams()', 'Matches :paramName in Route path'],
    tags: ['useParams', 'routing', 'dynamic', 'react'],
    concepts: ['next-app-router', 'next-data-fetching'],
  },

  {
    id: 'react-error-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_PATTERNS,
    course: Course.WEB_DEV,
    question: 'How do you handle errors in React component trees?',
    options: [
      { id: 'a', text: 'Error boundaries — class components with componentDidCatch() and getDerivedStateFromError() that catch errors in child components and display a fallback UI', isCorrect: true },
      { id: 'b', text: 'try/catch around JSX', isCorrect: false },
      { id: 'c', text: 'window.onerror', isCorrect: false },
      { id: 'd', text: 'Errors cannot be caught in React', isCorrect: false },
    ],
    explanation: 'Error boundaries catch JavaScript errors in their child component tree during rendering, lifecycle methods, and constructors. They cannot catch errors in event handlers (use regular try/catch), async code, or SSR. Currently only class components can be error boundaries.',
    tags: ['error-boundary', 'error-handling', 'patterns', 'react'],
    concepts: ['next-error-boundary', 'js-error-handling'],
  },

  {
    id: 'react-lazy-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_PATTERNS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Use React.lazy and Suspense to lazy-load a Dashboard component, showing "Loading..." as a fallback.',
    starterCode: `import { Suspense, lazy } from "react";\n\n`,
    testCases: [
      {
        input: 'lazy loading',
        expectedOutput: 'lazy(() => import("./Dashboard")) with Suspense fallback',
        description: 'Should lazy load with Suspense',
      },
    ],
    solution: `import { Suspense, lazy } from "react";\n\nconst Dashboard = lazy(() => import("./Dashboard"));\n\nfunction App() {\n  return (\n    <Suspense fallback={<div>Loading...</div>}>\n      <Dashboard />\n    </Suspense>\n  );\n}`,
    explanation: 'React.lazy() takes a function that returns a dynamic import(). The component is only loaded when first rendered. Suspense shows a fallback while loading. This reduces initial bundle size — great for large components or routes.',
    hints: ['lazy(() => import("./path"))', 'Wrap in Suspense with fallback', 'Reduces initial bundle size'],
    tags: ['lazy', 'suspense', 'code-splitting', 'performance', 'react'],
    concepts: ['next-streaming-suspense'],
  },

  // ===== REACT_PROJECT =====
  // Advanced Coding

  {
    id: 'react-project-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.REACT_PROJECT,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: `Build a SearchableList React component that filters a list by free-text search and by category.

Props:

- items: an array of objects with shape { id, name, category }.

The component owns two pieces of local state via useState: a search string (initialised to "") and a selected category (initialised to "all").

Render, in order:

- A text <input> bound to the search state.
- A <select> dropdown for category. The first option is "All" (value "all"). The rest are derived from the unique set of categories present in items — don't hardcode them.
- A small "Showing N of M" line that reports how many items match the current filters versus how many were passed in.
- A <ul> of the filtered items (one <li> per match, showing name and category). Each <li> needs a stable key — use item.id.

Filtering rule: an item matches when its name contains the search string (case-insensitive) AND its category equals the selected category (or the selected category is "all").

Compute the filtered list inline during render — no useMemo unless you can articulate why; the list size doesn't justify it.`,
    starterCode: `import { useState } from "react";\n\nfunction SearchableList({ items }) {\n`,
    testCases: [
      {
        input: 'items array with search/filter',
        expectedOutput: 'useState for search/category, filtered list with .filter(), count display',
        description: 'Should create searchable filterable list',
      },
    ],
    solution: `import { useState } from "react";\n\nfunction SearchableList({ items }) {\n  const [search, setSearch] = useState("");\n  const [category, setCategory] = useState("all");\n\n  const categories = ["all", ...new Set(items.map(i => i.category))];\n\n  const filtered = items.filter(item => {\n    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());\n    const matchesCategory = category === "all" || item.category === category;\n    return matchesSearch && matchesCategory;\n  });\n\n  return (\n    <div>\n      <input\n        type="text"\n        placeholder="Search..."\n        value={search}\n        onChange={(e) => setSearch(e.target.value)}\n      />\n      <select value={category} onChange={(e) => setCategory(e.target.value)}>\n        {categories.map(c => <option key={c} value={c}>{c}</option>)}\n      </select>\n      <p>{filtered.length} results</p>\n      <ul>\n        {filtered.map(item => <li key={item.id}>{item.name} ({item.category})</li>)}\n      </ul>\n    </div>\n  );\n}`,
    explanation: 'This project combines: controlled inputs, useState, array filter with multiple conditions, Set for unique categories, and list rendering with keys. The filtering is derived from state — no separate effect needed. This is a very common React pattern.',
    hints: ['Two useState: search and category', 'Derive filtered list from state (no useEffect needed)', 'Use Set for unique categories', 'Always use key prop in lists'],
    tags: ['project', 'filter', 'search', 'controlled', 'react'],
    concepts: ['js-array-methods', 'react-controlled-forms'],
  },

  {
    id: 'react-project-todo',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.REACT_PROJECT,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: `Build a TodoApp React component whose state is managed with useReducer (not useState).

Define a reducer that handles three action types:

- ADD_TODO — payload is a string. Append a new todo { id, text, completed: false } where id is the next number (track it in state as nextId, or compute via Date.now()).
- TOGGLE_TODO — payload is the id. Flip the completed flag on that todo.
- DELETE_TODO — payload is the id. Remove that todo from the array.

State shape: { todos: Todo[], nextId: number } (or equivalent). The reducer must return a NEW state object each time — never mutate the existing one (no .push, no direct assignment to existing items). Use spread / map / filter.

The component renders:

- A controlled text input plus an "Add" button. Clicking Add (or pressing Enter) dispatches ADD_TODO and clears the input. Empty strings are ignored.
- A list of todos. Each row shows the text. Clicking a row dispatches TOGGLE_TODO and applies a strike-through (textDecoration: "line-through") when completed. A delete button per row dispatches DELETE_TODO.
- A small footer line showing the count of NOT-completed todos: e.g. "3 remaining".

The discipline being practiced: separating "what changed" (the action) from "how state updates" (the reducer), and keeping every transition immutable.`,
    starterCode: `import { useReducer, useState } from "react";\n\n`,
    testCases: [
      {
        input: 'Todo app',
        expectedOutput: 'useReducer with ADD/TOGGLE/DELETE, controlled input, list rendering',
        description: 'Should build complete todo with useReducer',
      },
    ],
    solution: `import { useReducer, useState } from "react";\n\nfunction reducer(state, action) {\n  switch (action.type) {\n    case "ADD_TODO":\n      return [...state, { id: Date.now(), text: action.text, done: false }];\n    case "TOGGLE_TODO":\n      return state.map(t => t.id === action.id ? { ...t, done: !t.done } : t);\n    case "DELETE_TODO":\n      return state.filter(t => t.id !== action.id);\n    default: return state;\n  }\n}\n\nfunction TodoApp() {\n  const [todos, dispatch] = useReducer(reducer, []);\n  const [text, setText] = useState("");\n\n  const handleAdd = () => {\n    if (text.trim()) {\n      dispatch({ type: "ADD_TODO", text });\n      setText("");\n    }\n  };\n\n  const remaining = todos.filter(t => !t.done).length;\n\n  return (\n    <div>\n      <input value={text} onChange={e => setText(e.target.value)} />\n      <button onClick={handleAdd}>Add</button>\n      <p>{remaining} remaining</p>\n      <ul>\n        {todos.map(todo => (\n          <li key={todo.id} style={{ textDecoration: todo.done ? "line-through" : "none" }}>\n            <span onClick={() => dispatch({ type: "TOGGLE_TODO", id: todo.id })}>{todo.text}</span>\n            <button onClick={() => dispatch({ type: "DELETE_TODO", id: todo.id })}>X</button>\n          </li>\n        ))}\n      </ul>\n    </div>\n  );\n}`,
    explanation: 'This project combines: useReducer for complex state, controlled input, immutable state updates (map, filter, spread), derived state (remaining count), conditional styling, list rendering with keys, and event handling.',
    hints: ['Reducer returns new state (immutable)', 'Use spread to update individual items', 'Derived state (remaining) computed from todos'],
    tags: ['project', 'useReducer', 'todo', 'crud', 'react'],
    concepts: ['react-state-immutability'],
  },

  {
    id: 'react-project-theme',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.REACT_PROJECT,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: `Build a ThemeProvider in React that exposes "light"/"dark" theme state via Context, persists the choice to localStorage, and reflects it on the document body.

Three pieces:

1. A ThemeContext created with React.createContext, holding { theme, toggleTheme } where theme is the string "light" or "dark" and toggleTheme flips it. Provide a sensible default value so consumers outside the provider don't crash (e.g. theme: "light", toggleTheme: () => {}).

2. A ThemeProvider component that:
   - Reads the initial theme from localStorage (key "theme") on mount; if absent, defaults to "light". Use the lazy-init form of useState (a function passed to useState) so the read happens once, not on every render.
   - Exposes toggleTheme that switches between "light" and "dark" and writes the new value to localStorage.
   - Inside a useEffect keyed on theme, sets a class on document.body — either "theme-light" or "theme-dark" — replacing any prior theme class.
   - Renders { children } wrapped in <ThemeContext.Provider value={...}>.

3. A useTheme hook that calls useContext(ThemeContext) and returns the value. This is the only API consumers should use.

The mental model being practiced: Context for global UI state (NOT for state that changes on every keystroke), separation of "what it is" (context) from "how it lives" (provider) from "how I read it" (hook).`,
    starterCode: `import { createContext, useContext, useState, useEffect } from "react";\n\n`,
    testCases: [
      {
        input: 'Theme system',
        expectedOutput: 'createContext, Provider with localStorage, useTheme hook',
        description: 'Should build theme system with context + localStorage',
      },
    ],
    solution: `import { createContext, useContext, useState, useEffect } from "react";\n\nconst ThemeContext = createContext();\n\nfunction ThemeProvider({ children }) {\n  const [theme, setTheme] = useState(() => {\n    return localStorage.getItem("theme") || "light";\n  });\n\n  useEffect(() => {\n    localStorage.setItem("theme", theme);\n    document.body.className = theme;\n  }, [theme]);\n\n  const toggleTheme = () => setTheme(prev => prev === "light" ? "dark" : "light");\n\n  return (\n    <ThemeContext.Provider value={{ theme, toggleTheme }}>\n      {children}\n    </ThemeContext.Provider>\n  );\n}\n\nfunction useTheme() {\n  const context = useContext(ThemeContext);\n  if (!context) throw new Error("useTheme must be used within ThemeProvider");\n  return context;\n}`,
    explanation: 'This combines: Context for global state, localStorage for persistence, useEffect for side effects (DOM class + storage), lazy initializer for reading storage, and a custom hook with error boundary for misuse detection.',
    hints: ['Lazy initializer: useState(() => localStorage.getItem(...))', 'useEffect syncs to localStorage and DOM', 'Throw error if hook used outside Provider'],
    tags: ['project', 'context', 'theme', 'localStorage', 'react'],
    concepts: ['react-context', 'js-dom-events'],
  },

  {
    id: 'test-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.REACT_PROJECT,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Write a React Testing Library test for a Counter component: render it, check initial count is 0, click the increment button, verify count is 1.',
    starterCode: `// Import render, screen, fireEvent from "@testing-library/react" and Counter from "./Counter"
// Write a test case: render <Counter />, expect "Count: 0" in the document,
// fireEvent.click on the "Increment" button, then expect "Count: 1"
`,
    testCases: [
      {
        input: 'Counter component',
        expectedOutput: 'render, screen.getByText, fireEvent.click',
        description: 'Should test React component',
      },
    ],
    solution: `import { render, screen, fireEvent } from "@testing-library/react";\nimport Counter from "./Counter";\n\ntest("increments counter on click", () => {\n  render(<Counter />);\n  expect(screen.getByText("Count: 0")).toBeInTheDocument();\n  fireEvent.click(screen.getByText("Increment"));\n  expect(screen.getByText("Count: 1")).toBeInTheDocument();\n});`,
    explanation: 'React Testing Library tests components like a user would. render() mounts the component. screen.getByText() finds elements by visible text. fireEvent.click() simulates a click. Tests should verify behavior, not implementation details.',
    hints: ['render(<Component />) to mount', 'screen.getByText() to find elements', 'fireEvent.click() to simulate interaction'],
    tags: ['testing-library', 'react-testing', 'fireEvent', 'react'],
    concepts: ['testing-user-event'],
  },
];
