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
    question: 'In `<a href="https://example.com">Visit</a>`, what is `href` and what is `a`?',
    options: [
      { id: 'a', text: '`a` is the element (the tag itself); `href` is an attribute on that element, supplying extra information (the link destination)', isCorrect: true },
      { id: 'b', text: '`href` is the element; `a` is an attribute describing what kind of link it is', isCorrect: false },
      { id: 'c', text: 'Both `a` and `href` are elements nested inside each other', isCorrect: false },
      { id: 'd', text: 'Both `a` and `href` are attributes; the anchor tag itself is implied by the surrounding text', isCorrect: false },
    ],
    explanation: 'An element is the tag that defines a piece of content or structure - here `<a>...</a>` marks a hyperlink. Attributes live inside the opening tag and configure that element - `href` tells the browser where the link goes. The same element can carry several attributes (e.g. `target`, `rel`) without changing what element it is.',
    tags: ['html', 'fundamentals', 'elements', 'attributes'],
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

  {
    id: 'html-list-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_BASICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Fill in (1) the tag that wraps an unordered list and (2) the tag for each list item.',
    template: `<___>\n  <___>Apple</li>\n  <li>Pear</li>\n</ul>`,
    blanks: ['ul', 'li'],
    solution: `<ul>\n  <li>Apple</li>\n  <li>Pear</li>\n</ul>`,
    explanation: '<ul> wraps an unordered (bulleted) list; <ol> would number the items instead. Each entry, in either list type, is an <li> (list item).',
    hints: ['Unordered = bulleted, not numbered.', 'Same item tag for both ul and ol.'],
    tags: ['html', 'lists'],
    concepts: ['web-html-semantics'],
  },

  {
    id: 'html-list-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_BASICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    previewHtml: `<p style="font-size: 13px; color: #64748b; margin-bottom: 6px;">Your ordered list renders below:</p>`,
    question: 'Create an ordered list (numbered) with three steps, in order: "Preheat oven", "Mix batter", "Bake 20 minutes".',
    starterCode: `<!-- Ordered list of steps -->\n`,
    testCases: [
      {
        input: 'ordered list',
        expectedOutput: '<ol><li>Preheat oven</li><li>Mix batter</li><li>Bake 20 minutes</li></ol>',
        description: 'Should create a numbered list with the three steps in order',
      },
    ],
    solution: `<ol>\n  <li>Preheat oven</li>\n  <li>Mix batter</li>\n  <li>Bake 20 minutes</li>\n</ol>`,
    explanation: '<ol> numbers its items automatically in document order - unlike <ul>, sequence matters here. Each step is still an <li>.',
    hints: ['<ol> for numbered, <ul> for bulleted', 'Order of <li> elements matters in an <ol>'],
    tags: ['html', 'lists'],
    concepts: ['web-html-semantics'],
  },

  {
    id: 'html-table-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_BASICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    previewHtml: `<style>table, th, td { border: 1px solid #94a3b8; border-collapse: collapse; padding: 4px 8px; }</style>`,
    question: 'Assemble a table with one header row (columns "Name", "Score") and one data row ("Ana", "92"), outermost first.',
    correctOrder: [
      '<table>',
      '  <tr>',
      '    <th>Name</th>',
      '    <th>Score</th>',
      '  </tr>',
      '  <tr>',
      '    <td>Ana</td>',
      '    <td>92</td>',
      '  </tr>',
      '</table>',
    ],
    distractorLines: [
      '<td>Name</td>',
      '<tr>Ana</tr>',
    ],
    solution: `<table>\n  <tr>\n    <th>Name</th>\n    <th>Score</th>\n  </tr>\n  <tr>\n    <td>Ana</td>\n    <td>92</td>\n  </tr>\n</table>`,
    explanation: '<table> holds one or more <tr> (table rows). Header cells use <th> (bold, centered by default); data cells use <td>. A row is <tr> containing either all <th> or all <td>.',
    hints: ['th = header cell, td = data cell.', 'Both live inside a <tr>, which lives inside <table>.'],
    tags: ['html', 'table'],
    concepts: ['web-html-semantics'],
  },

  {
    id: 'html-table-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_BASICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    previewHtml: `<style>table, th, td { border: 1px solid #94a3b8; border-collapse: collapse; padding: 4px 8px; }</style>`,
    question: 'Create a table with a header row of "Item" and "Price", and one data row of "Coffee" and "3.50".',
    starterCode: `<!-- Table with header and one row -->\n`,
    testCases: [
      {
        input: 'table element',
        expectedOutput: '<table><tr><th>Item</th><th>Price</th></tr><tr><td>Coffee</td><td>3.50</td></tr></table>',
        description: 'Should create a table with header cells and one data row',
      },
    ],
    solution: `<table>\n  <tr>\n    <th>Item</th>\n    <th>Price</th>\n  </tr>\n  <tr>\n    <td>Coffee</td>\n    <td>3.50</td>\n  </tr>\n</table>`,
    explanation: 'Header labels go in <th> cells inside a <tr>; each subsequent <tr> holds one row of <td> data cells, matched by column position.',
    hints: ['Header row uses <th>, data rows use <td>', 'Every cell sits inside a <tr>'],
    tags: ['html', 'table'],
    concepts: ['web-html-semantics'],
  },

  {
    id: 'html-textblock-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_BASICS,
    course: Course.WEB_DEV,
    question: 'What is the key difference between <div> and <span>?',
    options: [
      { id: 'a', text: '<div> is a block-level container (starts on its own line, stretches full width); <span> is inline (flows within text, sized to its content)', isCorrect: true },
      { id: 'b', text: '<div> can only hold text; <span> can hold any element', isCorrect: false },
      { id: 'c', text: '<span> is block-level and <div> is inline - the reverse of common assumption', isCorrect: false },
      { id: 'd', text: 'They are interchangeable; the choice is purely stylistic', isCorrect: false },
      { id: 'e', text: '<div> requires a closing tag but <span> is self-closing', isCorrect: false },
    ],
    explanation: '<div> is a generic block-level container - it forces a line break before and after, and stretches to fill its parent\'s width. <span> is a generic inline container - it flows inside a line of text, sized only to wrap the content you put inside it (e.g. highlighting one word in a sentence).',
    tags: ['html', 'div', 'span'],
    concepts: ['web-html-semantics'],
  },

  {
    id: 'html-textblock-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_BASICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    previewHtml: `<p style="font-size: 13px; color: #64748b; margin-bottom: 6px;">Rendered below - the line break and horizontal rule should be visible:</p>`,
    question: 'Fill in (1) the tag that forces a line break inside a paragraph, and (2) the tag that draws a horizontal divider between paragraphs.',
    template: `<p>Line one<___>Line two</p>\n<___>\n<p>Next section</p>`,
    blanks: ['br', 'hr'],
    solution: `<p>Line one<br>Line two</p>\n<hr>\n<p>Next section</p>`,
    explanation: '<br> inserts a single line break within flowing text - use it sparingly (not for spacing between paragraphs). <hr> draws a thematic horizontal rule, marking a shift between sections. Both are void elements (no closing tag, no children).',
    hints: ['Both are void (self-closing, no content).', 'One breaks a line; the other divides sections.'],
    tags: ['html', 'p', 'br', 'hr'],
    concepts: ['web-html-semantics'],
  },

  {
    id: 'html-meta-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_BASICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Fill in (1) the meta attribute that declares the document\'s character encoding, and (2) the meta name that supplies a page description for search engines.',
    template: `<head>\n  <meta ___="UTF-8">\n  <meta name="___" content="A recipe blog for home cooks.">\n</head>`,
    blanks: ['charset', 'description'],
    solution: `<head>\n  <meta charset="UTF-8">\n  <meta name="description" content="A recipe blog for home cooks.">\n</head>`,
    explanation: 'charset="UTF-8" tells the browser how to decode the byte stream into characters - it should be the first thing in <head>. <meta name="description" content="..."> supplies the snippet search engines often show under your page\'s title in results.',
    hints: ['charset goes first, no name attribute needed for it.', 'description is one of several meta "name" values (others: keywords, author).'],
    tags: ['html', 'meta', 'head'],
    concepts: ['web-html-semantics'],
  },

  {
    id: 'html-head-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_BASICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Fill in (1) the tag that loads an external stylesheet, and (2) the attribute on <script> that defers execution until after the document is parsed (without blocking parsing).',
    template: `<___ rel="stylesheet" href="styles.css">\n<script src="app.js" ___></script>`,
    blanks: ['link', 'defer'],
    solution: `<link rel="stylesheet" href="styles.css">\n<script src="app.js" defer></script>`,
    explanation: '<link rel="stylesheet"> pulls in an external CSS file (as opposed to an internal <style> block or an inline style attribute). defer on <script> lets the browser keep parsing HTML while the script downloads, then runs it only once parsing finishes - avoiding render-blocking without losing document-order execution.',
    hints: ['<link> for external CSS; <style> would be an internal block instead.', 'defer is boolean - no value needed.'],
    tags: ['html', 'link', 'script', 'head'],
    concepts: ['web-html-semantics'],
  },

  {
    id: 'html-head-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_BASICS,
    course: Course.WEB_DEV,
    question: 'A page has both <script src="app.js" defer></script> and <script src="track.js"></script> (no defer) in its <head>. What happens?',
    options: [
      { id: 'a', text: 'track.js blocks HTML parsing while it downloads and runs immediately; app.js downloads in parallel but only runs after parsing finishes', isCorrect: true },
      { id: 'b', text: 'Both scripts always wait until parsing finishes, regardless of defer', isCorrect: false },
      { id: 'c', text: 'defer makes app.js run first, before track.js, regardless of position in the document', isCorrect: false },
      { id: 'd', text: 'Neither script runs until an explicit page-load event fires', isCorrect: false },
      { id: 'e', text: 'track.js is skipped entirely because a later script has defer', isCorrect: false },
    ],
    explanation: 'Without defer (or async), a <script> is render-blocking: the parser stops, fetches, and executes it inline, exactly where it appears. defer tells the browser to fetch in the background and run the script only after parsing completes (still in document order relative to other deferred scripts) - so a non-deferred script placed anywhere still blocks, independent of what other script tags do.',
    tags: ['html', 'script', 'defer'],
    concepts: ['web-html-semantics'],
  },

  {
    id: 'html-paths-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_BASICS,
    course: Course.WEB_DEV,
    question: 'Your page is served from https://shop.example.com/products/index.html. Which href is a RELATIVE path to an image in a sibling "images" folder?',
    options: [
      { id: 'a', text: 'src="../images/logo.png"', isCorrect: true },
      { id: 'b', text: 'src="https://shop.example.com/images/logo.png"', isCorrect: false },
      { id: 'c', text: 'src="/products/images/logo.png"', isCorrect: false },
      { id: 'd', text: 'src="www.shop.example.com/images/logo.png"', isCorrect: false },
    ],
    explanation: 'A relative path is resolved against the CURRENT document\'s location, not the domain root. From /products/index.html, "../images/logo.png" steps up out of /products/ then into /images/. Option b (a full URL) and option c (a root-relative "/..." path starting from the domain root) are both absolute, not relative - they don\'t depend on where the current page lives.',
    tags: ['html', 'paths'],
    concepts: ['web-html-semantics'],
  },

  {
    id: 'html-paths-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.HTML_BASICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    previewHtml: `<div id="top"><p>Top of page</p></div>\n<div style="height: 400px;"></div>\n<h2 id="contact">Contact</h2>\n<p>Reach us here.</p>`,
    question: 'Create two links: one anchor linking to "about.html" in a sibling "pages" folder one directory up (relative path), and one anchor linking to the "#contact" fragment on the current page. Use the text "About" and "Contact" respectively.',
    starterCode: `<!-- Relative-path link and fragment link -->\n`,
    testCases: [
      {
        input: 'relative and fragment links',
        expectedOutput: '<a href="../pages/about.html">About</a><a href="#contact">Contact</a>',
        description: 'Should create a relative path link and a same-page fragment link',
      },
    ],
    solution: `<a href="../pages/about.html">About</a>\n<a href="#contact">Contact</a>`,
    explanation: '"../pages/about.html" is relative: ".." steps up one directory from the current file, then into "pages". "#contact" is a fragment link - no filename means it targets an element with id="contact" on the SAME page, scrolling to it rather than loading a new document.',
    hints: ['".." means "up one directory" in a relative path.', 'A href starting with "#" alone stays on the current page.'],
    tags: ['html', 'anchor', 'paths', 'fragment'],
    concepts: ['web-html-semantics'],
  },

  {
    id: 'html-entities-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_BASICS,
    course: Course.WEB_DEV,
    question: 'You want a paragraph to literally display: Terms & Conditions apply if a < b. Which markup renders that text correctly?',
    options: [
      { id: 'a', text: '<p>Terms &amp;amp; Conditions apply if a &amp;lt; b</p>', isCorrect: true },
      { id: 'b', text: '<p>Terms & Conditions apply if a < b</p>', isCorrect: false },
      { id: 'c', text: '<p>Terms &amp;amp;amp; Conditions apply if a &amp;amp;lt; b</p>', isCorrect: false },
      { id: 'd', text: '<p>Terms \\&amp; Conditions apply if a \\&lt; b</p>', isCorrect: false },
    ],
    explanation: '& and < are reserved characters in HTML (they can start an entity or a tag), so writing them literally risks the browser misparsing the rest of the line. &amp; and &lt; are their entity escapes and always render as the plain characters. Option c double-escapes (renders the literal text "&amp;" instead of "&"); option d\'s backslash is meaningless in HTML - escaping needs the entity, not a backslash.',
    tags: ['html', 'entities'],
    concepts: ['web-html-semantics'],
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
    id: 'html-form-select-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_FORMS,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Fill in the dropdown element and the elements that define its choices.',
    template: `<___ id="size" name="size">
  <___ value="s">Small</___>
  <___ value="m">Medium</___>
</___>`,
    blanks: ['select', 'option', 'option', 'option', 'option', 'select'],
    solution: '<select id="size" name="size">\n  <option value="s">Small</option>\n  <option value="m">Medium</option>\n</select>',
    explanation: '<select> wraps the whole dropdown. Each <option> is one choice — its value attribute is what gets submitted, its text content is what the user sees.',
    hints: ['One outer element, one repeated child element for each choice.'],
    tags: ['html', 'select', 'dropdown', 'form', 'cloze'],
    concepts: ['web-html-forms-a11y'],
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

  {
    id: 'html-radio-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_FORMS,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Fill in the shared attribute that groups these two radio buttons so only one can be selected at a time.',
    template: `<input type="radio" ___="plan" value="basic"> Basic
<input type="radio" ___="plan" value="pro"> Pro`,
    blanks: ['name', 'name'],
    solution: '<input type="radio" name="plan" value="basic"> Basic\n<input type="radio" name="plan" value="pro"> Pro',
    explanation: 'Radio buttons that share the same name form one group — the browser enforces that only one input in the group can be checked. Each option keeps its own value so the form knows which one was picked.',
    hints: ['Same attribute on both inputs makes them mutually exclusive.'],
    tags: ['html', 'radio', 'form', 'cloze'],
    concepts: ['web-html-forms-a11y'],
  },

  {
    id: 'html-radio-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_FORMS,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Create a radio group for shipping speed with two options, "Standard" and "Express", sharing the name "shipping". Make "Standard" checked by default. Label each option.',
    starterCode: `<!-- Radio group -->\n`,
    testCases: [
      {
        input: 'radio group',
        expectedOutput: 'two radio inputs sharing name="shipping", one checked',
        description: 'Should create a mutually-exclusive radio group with a default selection',
      },
    ],
    solution: `<label><input type="radio" name="shipping" value="standard" checked> Standard</label>\n<label><input type="radio" name="shipping" value="express"> Express</label>`,
    explanation: 'Sharing name="shipping" makes the two inputs mutually exclusive. checked pre-selects one option. Wrapping each input in its own <label> ties the click target to the input without needing separate for/id pairs.',
    hints: ['Both inputs need the same name.', 'checked (no value) marks the default.'],
    tags: ['html', 'radio', 'form'],
    concepts: ['web-html-forms-a11y'],
  },

  {
    id: 'html-checkbox-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_FORMS,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Create a labeled checkbox for "Subscribe to newsletter" with id "subscribe", unchecked by default.',
    starterCode: `<!-- Checkbox -->\n`,
    testCases: [
      {
        input: 'checkbox',
        expectedOutput: '<input type="checkbox" id="subscribe"> with matching label',
        description: 'Should create an accessible checkbox',
      },
    ],
    solution: `<input type="checkbox" id="subscribe" name="subscribe">\n<label for="subscribe">Subscribe to newsletter</label>`,
    explanation: 'A checkbox is independent (unlike a radio group, checking one has no effect on others). Leaving out checked keeps it unchecked by default. The label/for pairing still applies for accessibility.',
    hints: ['type="checkbox", no checked attribute means unchecked.'],
    tags: ['html', 'checkbox', 'form', 'a11y'],
    concepts: ['web-html-forms-a11y'],
  },

  {
    id: 'html-textarea-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_FORMS,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Create a labeled textarea for "Comments" with id "comments" and 4 visible rows. Pre-fill it with the text "Type here...".',
    starterCode: `<!-- Textarea -->\n`,
    testCases: [
      {
        input: 'textarea',
        expectedOutput: '<textarea id="comments" rows="4">Type here...</textarea>',
        description: 'Should create a textarea with rows and initial content',
      },
    ],
    solution: `<label for="comments">Comments</label>\n<textarea id="comments" name="comments" rows="4">Type here...</textarea>`,
    explanation: 'Unlike <input>, <textarea> has no value attribute — its starting text goes between the opening and closing tags. rows sets the visible height in text lines (the field still scrolls for longer input).',
    hints: ['Content goes between <textarea> and </textarea>, not in a value attribute.'],
    tags: ['html', 'textarea', 'form'],
    concepts: ['web-html-forms-a11y'],
  },

  {
    id: 'html-fieldset-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_FORMS,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Wrap a radio group (name "plan", options "Basic" and "Pro") in a <fieldset> with a <legend> reading "Choose a plan".',
    starterCode: `<!-- Fieldset -->\n`,
    testCases: [
      {
        input: 'fieldset',
        expectedOutput: '<fieldset><legend>Choose a plan</legend> two radio inputs</fieldset>',
        description: 'Should group related inputs under a labeled fieldset',
      },
    ],
    solution: `<fieldset>\n  <legend>Choose a plan</legend>\n  <label><input type="radio" name="plan" value="basic"> Basic</label>\n  <label><input type="radio" name="plan" value="pro"> Pro</label>\n</fieldset>`,
    explanation: '<fieldset> groups related controls; <legend> is its caption and must be the fieldset\'s first child. Screen readers announce the legend before each control in the group, so "Basic" is heard as "Choose a plan, Basic".',
    hints: ['<legend> must come immediately after the opening <fieldset> tag.'],
    tags: ['html', 'fieldset', 'legend', 'form', 'a11y'],
    concepts: ['web-html-forms-a11y'],
  },

  {
    id: 'html-form-method-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_FORMS,
    course: Course.WEB_DEV,
    question: 'What is the key difference between <form method="get"> and <form method="post">?',
    options: [
      { id: 'a', text: 'GET appends form data to the URL as a query string (visible, bookmarkable, length-limited); POST sends it in the request body (hidden from the URL, no practical length limit)', isCorrect: true },
      { id: 'b', text: 'POST is only usable for forms that upload files; GET is required for every other form, including logins and searches', isCorrect: false },
      { id: 'c', text: 'GET and POST are interchangeable in practice - the choice only changes which HTTP status code the server returns on success', isCorrect: false },
      { id: 'd', text: 'GET requires JavaScript to submit the form; POST is the only method that works with plain HTML and no scripting', isCorrect: false },
    ],
    explanation: 'GET puts data in the URL, which is why search forms use it (shareable/bookmarkable results) but it should never carry sensitive data. POST hides data in the body, which is why login and payment forms use it. Neither method is JS-only or tied to a specific status code.',
    tags: ['html', 'form', 'method'],
    concepts: ['web-html-forms-a11y'],
  },

  {
    id: 'html-form-method-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_FORMS,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Fill in the attribute that sets the submit URL and the attribute that sets the HTTP method, so the form submits sensitive data hidden from the URL.',
    template: `<form ___="/api/login" ___="post">`,
    blanks: ['action', 'method'],
    solution: '<form action="/api/login" method="post">',
    explanation: 'action is the URL the form data is sent to; method controls how it\'s sent. method="post" keeps the submitted fields out of the URL, which is required for anything sensitive like a password.',
    hints: ['One attribute for the destination URL, one for the HTTP verb.'],
    tags: ['html', 'form', 'method', 'action', 'cloze'],
    concepts: ['web-html-forms-a11y'],
  },

  {
    id: 'html-input-restrict-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.HTML_FORMS,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Create a labeled number input for "Quantity" (id "qty") restricted to whole numbers between 1 and 10, and a labeled date input for "Delivery date" (id "delivery") that cannot be before 2026-01-01.',
    starterCode: `<!-- Restricted inputs -->\n`,
    testCases: [
      {
        input: 'restricted inputs',
        expectedOutput: '<input type="number" min="1" max="10" step="1"> and <input type="date" min="2026-01-01">',
        description: 'Should restrict numeric range and minimum date',
      },
    ],
    solution: `<label for="qty">Quantity</label>\n<input type="number" id="qty" name="qty" min="1" max="10" step="1">\n\n<label for="delivery">Delivery date</label>\n<input type="date" id="delivery" name="delivery" min="2026-01-01">`,
    explanation: 'type="number" combined with min/max/step constrains the range and increment (step="1" blocks decimals). type="date" uses min in the same yyyy-mm-dd format to set the earliest selectable date. Both still need their own label/for pairing - the input type doesn\'t replace accessibility markup.',
    hints: ['number: min, max, step.', 'date: min in yyyy-mm-dd format.'],
    tags: ['html', 'form', 'validation', 'number', 'date'],
    concepts: ['web-html-forms-a11y'],
  },

  {
    id: 'html-signup-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.HTML_FORMS,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Build an accessible signup form: a required email input (labeled), a fieldset with legend "Account type" containing two radio buttons sharing the name "account" ("Personal" and "Business", "Personal" checked by default), a checkbox (labeled "I agree to the terms") that is required, and a submit button.',
    starterCode: `<form>\n`,
    testCases: [
      {
        input: 'signup form',
        expectedOutput: 'labeled email input, fieldset/legend with radio group, required checkbox, submit button',
        description: 'Should combine label/input pairing, fieldset grouping, radio group, and a required checkbox',
      },
    ],
    solution: `<form>\n  <label for="email">Email</label>\n  <input type="email" id="email" name="email" required>\n\n  <fieldset>\n    <legend>Account type</legend>\n    <label><input type="radio" name="account" value="personal" checked> Personal</label>\n    <label><input type="radio" name="account" value="business"> Business</label>\n  </fieldset>\n\n  <label><input type="checkbox" id="terms" name="terms" required> I agree to the terms</label>\n\n  <button type="submit">Sign Up</button>\n</form>`,
    explanation: 'This combines four already-introduced primitives: label/for (or wrapping label) for the email and checkbox, a radio group sharing one name for mutually-exclusive account types, fieldset/legend to caption that group, and required on the checkbox to block submission until it\'s checked.',
    hints: ['Radio group needs one shared name.', 'checkbox and radio inputs can use a wrapping <label> instead of for/id.', 'required works on checkboxes too.'],
    tags: ['html', 'form', 'signup', 'radio', 'checkbox', 'fieldset', 'a11y'],
    concepts: ['web-html-forms-a11y', 'forms-zod-schema'],
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

  {
    id: 'html-sem-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_SEMANTIC,
    course: Course.WEB_DEV,
    question: 'A blog page has one <article> per post, and each post has a "Related links" block in the sidebar. Which elements should wrap the post body and the sidebar block?',
    options: [
      { id: 'a', text: 'Post body in <section>, sidebar block in <article> - <section> is for any chunk of content, <article> for anything tangential', isCorrect: false },
      { id: 'b', text: 'Post body in <article> (self-contained, could stand alone/be syndicated), sidebar block in <aside> (tangentially related content)', isCorrect: true },
      { id: 'c', text: 'Both in <div> - <article> and <aside> are legacy tags that modern layouts no longer need', isCorrect: false },
      { id: 'd', text: 'Post body in <aside> (it is the main focus), sidebar block in <article> (it is a distinct standalone unit)', isCorrect: false },
    ],
    explanation: '<article> marks content that makes sense on its own (a blog post, a product card) - it could be pulled out and syndicated elsewhere. <aside> marks content tangentially related to the surrounding content (sidebars, pull quotes, related-links widgets). <section> is a generic thematic grouping used when neither more specific element fits, and <div> carries no semantic meaning at all.',
    tags: ['html', 'semantic', 'article', 'section', 'aside'],
    concepts: ['web-html-semantics'],
  },

  {
    id: 'html-sem-aside-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_SEMANTIC,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Extend this article with an <aside> after it containing an h3 "Related posts" and one link.',
    starterCode: `<article>\n  <h2>My Post</h2>\n  <p>Post content.</p>\n</article>\n`,
    testCases: [
      {
        input: 'article with aside',
        expectedOutput: '<article>...</article><aside><h3>Related posts</h3><a href="...">...</a></aside>',
        description: 'Should add a tangentially-related aside after the article',
      },
    ],
    solution: `<article>\n  <h2>My Post</h2>\n  <p>Post content.</p>\n</article>\n\n<aside>\n  <h3>Related posts</h3>\n  <a href="/post-2">Another Post</a>\n</aside>`,
    explanation: '<aside> holds content related to but separate from the main flow - here, a "Related posts" widget. It sits alongside the <article> it relates to, not nested inside content it would interrupt.',
    hints: ['<aside> is a sibling of <article>, placed after it.'],
    tags: ['html', 'semantic', 'aside'],
    concepts: ['web-html-semantics'],
  },

  {
    id: 'html-figure-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_SEMANTIC,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Fill in the element that groups an image with its caption, and the element that holds the caption text.',
    template: `<___>
  <img src="chart.png" alt="Sales chart">
  <___>Figure 1: Quarterly sales</___>
</___>`,
    blanks: ['figure', 'figcaption', 'figcaption', 'figure'],
    solution: `<figure>\n  <img src="chart.png" alt="Sales chart">\n  <figcaption>Figure 1: Quarterly sales</figcaption>\n</figure>`,
    explanation: '<figure> groups self-contained media (image, diagram, code snippet) with its caption. <figcaption> holds the caption text and can appear as the first or last child of <figure>.',
    hints: ['Outer wrapper is "figure"; caption element is "figcaption".'],
    tags: ['html', 'figure', 'figcaption', 'semantic', 'cloze'],
    concepts: ['web-html-semantics'],
  },

  {
    id: 'html-figure-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_SEMANTIC,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Create a <figure> containing an image (src "team.jpg", alt "Team photo") with the caption "The engineering team, 2026".',
    starterCode: `<!-- Figure -->\n`,
    testCases: [
      {
        input: 'figure',
        expectedOutput: '<figure><img src="team.jpg" alt="Team photo"><figcaption>The engineering team, 2026</figcaption></figure>',
        description: 'Should group the image with its caption',
      },
    ],
    solution: `<figure>\n  <img src="team.jpg" alt="Team photo">\n  <figcaption>The engineering team, 2026</figcaption>\n</figure>`,
    explanation: '<figure> + <figcaption> ties an image to its caption programmatically, so screen readers announce them as one unit - unlike a bare <img> followed by an unrelated <p>.',
    hints: ['<figcaption> goes inside <figure>, alongside the <img>.'],
    tags: ['html', 'figure', 'figcaption', 'semantic'],
    concepts: ['web-html-semantics'],
  },

  {
    id: 'html-details-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_SEMANTIC,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Create a collapsible FAQ entry using <details>: the visible summary is "What is your return policy?" and the hidden body text is "30 days, unused items only."',
    starterCode: `<!-- FAQ entry -->\n`,
    testCases: [
      {
        input: 'details/summary',
        expectedOutput: '<details><summary>What is your return policy?</summary>30 days, unused items only.</details>',
        description: 'Should create a native collapsible disclosure widget',
      },
    ],
    solution: `<details>\n  <summary>What is your return policy?</summary>\n  30 days, unused items only.\n</details>`,
    explanation: '<details> is a built-in disclosure widget - collapsed by default, no JavaScript needed. <summary> is the always-visible toggle; everything else inside <details> is the content revealed on click.',
    hints: ['<summary> must be the first child of <details>.'],
    tags: ['html', 'details', 'summary', 'semantic'],
    concepts: ['web-html-semantics'],
  },

  {
    id: 'html-media-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_SEMANTIC,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Fill in the element that plays the video, the boolean attribute that shows play/pause/volume controls, and the element that specifies the video file.',
    template: `<___ ___>
  <___ src="clip.mp4" type="video/mp4">
</___>`,
    blanks: ['video', 'controls', 'source', 'video'],
    solution: `<video controls>\n  <source src="clip.mp4" type="video/mp4">\n</video>`,
    explanation: '<video> is the player; controls (a boolean attribute) turns on the native play/pause/volume UI. <source> names the actual file and its MIME type - a <video> can list multiple <source> tags as fallbacks for different formats.',
    hints: ['Player element; boolean attribute for the UI; child element naming the file.'],
    tags: ['html', 'video', 'media', 'cloze'],
    concepts: ['web-html-semantics'],
  },

  {
    id: 'html-media-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_SEMANTIC,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Create an audio player with controls visible, an mp3 source at "podcast.mp3", and fallback text "Your browser does not support audio playback." for browsers that can\'t render <audio>.',
    starterCode: `<!-- Audio player -->\n`,
    testCases: [
      {
        input: 'audio player',
        expectedOutput: '<audio controls><source src="podcast.mp3" type="audio/mpeg">Your browser does not support audio playback.</audio>',
        description: 'Should create an audio player with controls, a source, and fallback text',
      },
    ],
    solution: `<audio controls>\n  <source src="podcast.mp3" type="audio/mpeg">\n  Your browser does not support audio playback.\n</audio>`,
    explanation: '<audio> mirrors <video>: controls shows the native UI, <source> names the file/type, and any text after the last <source> only renders as a fallback in browsers too old to support <audio> at all.',
    hints: ['Fallback text goes after <source>, inside <audio>.'],
    tags: ['html', 'audio', 'media'],
    concepts: ['web-html-semantics'],
  },

  {
    id: 'html-iframe-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.HTML_SEMANTIC,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Embed a third-party page at "https://maps.example.com/embed" in an <iframe>. Give it a title "Store location map" for screen readers, and lock it down with an empty sandbox attribute (maximally restricted - no scripts, no forms, no same-origin access).',
    starterCode: `<!-- Embedded map -->\n`,
    testCases: [
      {
        input: 'sandboxed iframe',
        expectedOutput: '<iframe src="https://maps.example.com/embed" title="Store location map" sandbox="">',
        description: 'Should embed with an accessible title and maximum sandbox restriction',
      },
    ],
    solution: `<iframe src="https://maps.example.com/embed" title="Store location map" sandbox=""></iframe>`,
    explanation: 'src is the embedded page. title is required for accessibility - without it, screen readers have no name to announce for the embedded frame. sandbox="" (empty) applies every restriction at once; specific tokens like sandbox="allow-scripts" would selectively re-enable capabilities.',
    hints: ['Empty sandbox="" is the most restrictive setting.'],
    tags: ['html', 'iframe', 'sandbox', 'a11y'],
    concepts: ['web-html-semantics', 'a11y-aria-roles'],
  },

  {
    id: 'html-picture-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.HTML_SEMANTIC,
    course: Course.WEB_DEV,
    question: 'Why would you use <img srcset="photo-480w.jpg 480w, photo-800w.jpg 800w" ...> instead of a single <img src="photo-800w.jpg">?',
    options: [
      { id: 'a', text: 'It lets the browser choose the smallest image that still satisfies the display size, saving bandwidth on smaller screens instead of always downloading the largest file', isCorrect: true },
      { id: 'b', text: 'It is required syntax - a bare src attribute with no accompanying srcset is deprecated, and modern browsers will simply refuse to render the image at all', isCorrect: false },
      { id: 'c', text: 'It plays the listed images in sequence as an automatic slideshow, cycling from the smallest declared width up to the largest one continuously', isCorrect: false },
      { id: 'd', text: 'It forces the browser to always download every single listed image up front, so that the later, larger ones are already cached before they are ever needed', isCorrect: false },
    ],
    explanation: 'srcset lists the same image at different resolutions with a width descriptor (480w, 800w); the browser picks the best match for the viewport and pixel density instead of the developer hardcoding one size for everyone. It is optional (plain src still works), not a slideshow, and it does NOT download every candidate - only the one the browser selects.',
    tags: ['html', 'srcset', 'responsive-images', 'performance'],
    concepts: ['web-html-semantics'],
  },

  {
    id: 'html-picture-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.HTML_SEMANTIC,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Fill in the wrapper element that lets the browser pick between formats, the element that offers a WebP candidate, and the required fallback element for browsers that support neither <picture> nor WebP.',
    template: `<___>
  <___ srcset="photo.webp" type="image/webp">
  <___ src="photo.jpg" alt="Product photo">
</___>`,
    blanks: ['picture', 'source', 'img', 'picture'],
    solution: `<picture>\n  <source srcset="photo.webp" type="image/webp">\n  <img src="photo.jpg" alt="Product photo">\n</picture>`,
    explanation: '<picture> tries each <source> in order and uses the first one the browser supports; <img> is mandatory as the last child - it is both the fallback and the element that actually renders (and carries the required alt text).',
    hints: ['Wrapper; candidate-offering element; required fallback/render element.'],
    tags: ['html', 'picture', 'source', 'responsive-images', 'cloze'],
    concepts: ['web-html-semantics'],
  },

  {
    id: 'html-heading-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.HTML_SEMANTIC,
    course: Course.WEB_DEV,
    question: 'A page has one <h1>, then jumps straight to an <h3> for a subsection, skipping <h2>. Why does this break the heading hierarchy rule?',
    options: [
      { id: 'a', text: 'Screen reader users often navigate by heading level; a skipped level makes them wonder if content is missing, since the outline implies an h2-level section exists but was never announced', isCorrect: true },
      { id: 'b', text: 'It does not actually break anything - HTML has no enforced rule about heading order, and browsers render an h3 identically whether or not an h2 precedes it on the page', isCorrect: false },
      { id: 'c', text: 'Browsers throw a hard rendering error and refuse to display any further heading elements for the remainder of the page once a level has been skipped', isCorrect: false },
      { id: 'd', text: 'Search engines immediately remove the entire page from their index the moment their crawler detects even one skipped heading level anywhere on it', isCorrect: false },
    ],
    explanation: 'There is exactly one <h1> per page, and heading levels should descend one step at a time (h1 → h2 → h3) so the outline they form is predictable. Skipping a level does not cause a rendering error or an SEO penalty, but it does break the mental map that heading-level navigation gives assistive-technology users.',
    tags: ['html', 'heading', 'accessibility', 'semantic'],
    concepts: ['web-html-semantics', 'a11y-aria-roles'],
  },

  {
    id: 'html-article-media-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.HTML_SEMANTIC,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Build an <article> for a tutorial page: an h2 title "Intro to Baking", a <figure> with an image (src "loaf.jpg", alt "Finished loaf") captioned "The finished loaf", a <video> with controls and a single source (src "intro.mp4", type "video/mp4"), and a <details> with summary "Ingredients" revealing the text "Flour, water, yeast, salt."',
    starterCode: `<article>\n`,
    testCases: [
      {
        input: 'tutorial article',
        expectedOutput: 'article containing h2, figure+figcaption, video+source, details+summary',
        description: 'Should combine figure, video, and details inside one article',
      },
    ],
    solution: `<article>\n  <h2>Intro to Baking</h2>\n\n  <figure>\n    <img src="loaf.jpg" alt="Finished loaf">\n    <figcaption>The finished loaf</figcaption>\n  </figure>\n\n  <video controls>\n    <source src="intro.mp4" type="video/mp4">\n  </video>\n\n  <details>\n    <summary>Ingredients</summary>\n    Flour, water, yeast, salt.\n  </details>\n</article>`,
    explanation: 'Combines three already-introduced primitives inside one <article>: figure/figcaption for the captioned image, video/source/controls for the embedded clip, and details/summary for the collapsible ingredients list - each keeps working exactly as it does standalone.',
    hints: ['Same figure/video/details patterns as the standalone questions, just nested in one article.'],
    tags: ['html', 'article', 'figure', 'video', 'details', 'semantic'],
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
    previewHtml: `<div class="modal" style="max-width: 260px; margin: 24px auto; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.15); padding: 20px;"><strong>Modal title</strong><p style="margin: 8px 0 0;">I fade in when the animation is wired up correctly.</p></div>`,
    explanation: '@keyframes defines the steps (from = start, to = end). The animation shorthand references the keyframes name plus a duration and timing function. The name in animation must match the @keyframes name.',
    hints: ['Define @keyframes (from 0 → to 1) first, then reference its name in animation.'],
    tags: ['css', 'keyframes', 'animation'],
    concepts: ['web-css-animation'],
  },

  {
    id: 'css-selector-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_BASICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Fill in (1) the selector for every <p> element, (2) the selector for elements with class "card", and (3) the selector for the element with id "header".',
    template: `___ {
  margin: 0;
}

___ {
  border: 1px solid #ddd;
}

___ {
  background: white;
}`,
    blanks: ['p', '.card', '#header'],
    solution: `p {\n  margin: 0;\n}\n\n.card {\n  border: 1px solid #ddd;\n}\n\n#header {\n  background: white;\n}`,
    previewHtml: `<div id="header" style="padding: 10px 14px; background: #e2e8f0;"><strong>Page header</strong> (id="header")</div><div class="card" style="margin: 12px 0; padding: 12px;">A card (class="card")<p>A paragraph inside the card.</p></div><p>A loose paragraph outside the card.</p>`,
    explanation: 'A bare tag name selects every element of that type (p matches every paragraph). A leading dot selects every element carrying that class (.card can match many elements). A leading hash selects the single element with that id (#header should be unique per page).',
    hints: ['Tag name matches every instance; dot matches a class; hash matches a unique id.'],
    tags: ['css', 'selectors', 'fundamentals'],
    concepts: ['web-css-selectors'],
  },

  {
    id: 'css-selector-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_BASICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Write three separate CSS rules: (1) every <li> element gets list-style: none, (2) every element with class "muted" gets color #6b7280, (3) the element with id "app-root" gets max-width: 960px.',
    starterCode: `/* Write the three rules described above */\n`,
    testCases: [{ input: 'selector rules', expectedOutput: 'li, .muted, #app-root rules', description: 'Should use element, class, and id selectors correctly' }],
    solution: `li {\n  list-style: none;\n}\n\n.muted {\n  color: #6b7280;\n}\n\n#app-root {\n  max-width: 960px;\n}`,
    previewHtml: `<div id="app-root" style="border: 1px dashed #94a3b8; padding: 12px;"><ul style="padding-left: 24px;"><li>First item</li><li>Second item</li></ul><p class="muted">Muted helper text (class="muted")</p><p>Regular text for contrast.</p></div>`,
    previewChecks: [
      { selector: 'li', properties: ['list-style-type'] },
      { selector: '.muted', properties: ['color'] },
      { selector: '#app-root', properties: ['max-width'] },
    ],
    explanation: 'Each selector targets a different scope: li matches every list item on the page, .muted matches any element carrying that class (reusable across many elements), and #app-root matches exactly one element since ids must be unique per page.',
    hints: ['Bare tag name for li', 'Leading dot for a class', 'Leading hash for an id'],
    tags: ['css', 'selectors', 'fundamentals'],
    concepts: ['web-css-selectors'],
  },

  {
    id: 'css-style-placement-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_BASICS,
    course: Course.WEB_DEV,
    question: 'A page has all three at once: a style="color:red" inline attribute on a <p>, an internal <style> block in <head> with p { color: blue; }, and an external stylesheet with p { color: green; }. What color is the paragraph text?',
    options: [
      { id: 'a', text: 'Green, because rules linked via an external stylesheet always override every other style source', isCorrect: false },
      { id: 'b', text: 'Blue, because an internal style block inside <head> always overrides inline styles set directly on an element', isCorrect: false },
      { id: 'c', text: 'Red, because an inline style attribute overrides any selector-based rule from a stylesheet, regardless of that rule\'s specificity', isCorrect: true },
      { id: 'd', text: 'It depends on the browser, since the three style sources have no fixed precedence order relative to each other', isCorrect: false },
    ],
    explanation: 'Inline styles (the style attribute) sit above any selector-based rule in the cascade, beating internal <style> blocks and external stylesheets no matter how specific their selectors are (short of !important). Between two stylesheet rules of equal specificity, the one declared LAST in the document wins — that tie-break only applies among stylesheet rules, never against an inline style.',
    hints: ['Inline styles are attached directly to the one element', 'This beats even a highly specific selector rule elsewhere'],
    tags: ['css', 'cascade', 'inline-styles', 'stylesheets'],
    concepts: ['web-css-cascade'],
  },

  {
    id: 'css-link-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_BASICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Fill in (1) the <link> attribute that tells the browser what kind of resource this is, and (2) its value for a CSS stylesheet.',
    template: `<link ___="___" href="styles.css">`,
    blanks: ['rel', 'stylesheet'],
    solution: `<link rel="stylesheet" href="styles.css">`,
    explanation: 'The <link> tag goes in <head>. rel="stylesheet" tells the browser to parse and apply the linked file as CSS, while href gives its path. This is what actually loads an EXTERNAL stylesheet, as opposed to an internal <style> block or an inline style attribute.',
    hints: ['The attribute naming the relationship type; its value for CSS'],
    tags: ['css', 'link', 'external-stylesheet'],
    concepts: ['web-css-cascade'],
  },

  {
    id: 'css-units-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_BASICS,
    course: Course.WEB_DEV,
    question: 'Which CSS unit scales relative to the root <html> element\'s font-size, making it a common choice for a consistent, user-scalable spacing scale across a whole page?',
    options: [
      { id: 'a', text: 'px, an absolute unit tied to a fixed number of screen pixels', isCorrect: false },
      { id: 'b', text: 'rem, relative to the root html element\'s font-size, so every rem value scales together if that root size changes', isCorrect: true },
      { id: 'c', text: 'vh, relative to 1% of the viewport\'s height', isCorrect: false },
      { id: 'd', text: 'em, relative to the current element\'s own font-size, so it compounds when nested', isCorrect: false },
    ],
    explanation: 'rem ("root em") is always relative to the <html> element\'s font-size, so changing that one root value scales every rem-based measurement uniformly - the standard choice for font sizes and spacing scales. em is relative to the element\'s OWN computed font-size, which can compound awkwardly through nested elements. px is a fixed absolute unit, and vh/vw are relative to the viewport, not typography.',
    hints: ['Root em vs local em', 'Which one gives a single global scale knob'],
    tags: ['css', 'units', 'rem', 'em'],
    concepts: ['web-css-units'],
  },

  {
    id: 'css-units-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_BASICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Fill in (1) the unit that is 100% of the viewport height, and (2) the unit relative to the root font-size, for a hero section that always fills the screen and has consistently-scaled padding.',
    template: `.hero {
  height: 100___;
  padding: 2___;
}`,
    blanks: ['vh', 'rem'],
    solution: `.hero {\n  height: 100vh;\n  padding: 2rem;\n}`,
    previewHtml: `<section class="hero" style="background: linear-gradient(160deg, #1e3a8a, #7c3aed); color: #ffffff;"><h1 style="margin: 0;">Full-screen hero</h1><p>I should fill the whole viewport height with 2rem of padding.</p></section><p style="padding: 8px;">Content below the fold - scroll to see me.</p>`,
    explanation: 'vh is 1% of the viewport height, so 100vh fills the visible screen exactly. rem scales with the root font-size, giving consistent spacing that respects a user\'s browser zoom/font preference, unlike a fixed px value.',
    hints: ['Viewport-height unit; root-relative unit'],
    tags: ['css', 'units', 'viewport', 'rem'],
    concepts: ['web-css-units'],
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
    previewHtml: `<div class="card" style="max-width: 280px; background: #eef2ff; border: 1px solid #6366f1;"><strong>Card</strong><p style="margin: 6px 0 0;">Watch my inner spacing and corners change.</p></div>`,
    explanation: 'padding is the space inside the box (between content and border); margin is the space outside it. border-radius rounds the corners.',
    hints: ['Inner spacing; then the corner-rounding property.'],
    tags: ['css', 'box-model'],
    concepts: ['web-css-box-model'],
  },

  {
    id: 'css-var-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_BASICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Fill in (1) the syntax that declares a custom property named --primary-color on :root, and (2) the function used to read it back in another rule.',
    template: `:root {
  ___: #2563eb;
}

.btn {
  background: ___(--primary-color);
}`,
    blanks: ['--primary-color', 'var'],
    solution: `:root {\n  --primary-color: #2563eb;\n}\n\n.btn {\n  background: var(--primary-color);\n}`,
    previewHtml: `<button class="btn" style="color: #ffffff; border: none; padding: 10px 22px; border-radius: 6px;">Primary button</button>`,
    explanation: 'A custom property is declared with a -- prefix and a value, typically on :root so it is available anywhere on the page. var(--name) reads it back. Changing the single :root declaration updates every rule that references it - the same win rem gives for spacing, extended to any value.',
    hints: ['Declare with a double-hyphen name; read with a function call'],
    tags: ['css', 'variables', 'custom-properties'],
    concepts: ['web-css-variables'],
  },

  {
    id: 'css-var-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_BASICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Define two CSS custom properties on :root: --spacing-md set to 16px and --color-border set to #e5e7eb. Then write a .card rule that uses both variables for its padding and border-color.',
    starterCode: `:root {\n`,
    testCases: [{ input: 'css variables', expectedOutput: ':root declares --spacing-md/--color-border, .card uses var() for both', description: 'Should declare and consume custom properties' }],
    solution: `:root {\n  --spacing-md: 16px;\n  --color-border: #e5e7eb;\n}\n\n.card {\n  padding: var(--spacing-md);\n  border-color: var(--color-border);\n}`,
    previewHtml: `<div class="card" style="max-width: 280px; border-width: 2px; border-style: solid; border-radius: 8px;"><strong>Token-driven card</strong><p style="margin: 6px 0 0;">My padding and border color come from :root variables.</p></div>`,
    previewChecks: [
      { selector: '.card', properties: ['padding-top', 'border-top-color'] },
    ],
    explanation: 'Custom properties declared on :root act like global CSS variables. var(--spacing-md) substitutes the current value of that property wherever it is used. This centralizes design tokens (spacing, color) so a single edit updates every consumer.',
    hints: ['Two -- declarations on :root', 'var(--name) in the rule that consumes them'],
    tags: ['css', 'variables', 'custom-properties', 'design-tokens'],
    concepts: ['web-css-variables'],
  },

  {
    id: 'css-typography-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_BASICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Fill in (1) the property for a fallback font stack ending in a generic family, (2) the property for text weight, and (3) the property that sets the space between lines.',
    template: `body {
  ___: "Helvetica Neue", Arial, sans-serif;
  ___: 400;
  ___: 1.5;
}`,
    blanks: ['font-family', 'font-weight', 'line-height'],
    solution: `body {\n  font-family: "Helvetica Neue", Arial, sans-serif;\n  font-weight: 400;\n  line-height: 1.5;\n}`,
    previewHtml: `<h2 style="margin: 0 0 8px;">Typography sample</h2><p>The quick brown fox jumps over the lazy dog. This paragraph inherits the body's font stack, weight, and line spacing - watch it reflow as you fill the blanks.</p>`,
    explanation: 'font-family takes a comma-separated fallback list, ending in a generic family (sans-serif/serif/monospace) in case none of the named fonts are available. font-weight controls boldness (400 = normal, 700 = bold). line-height (unitless, here 1.5x the font-size) controls vertical spacing between lines.',
    hints: ['Fallback list ending in a generic family; boldness; line spacing'],
    tags: ['css', 'typography', 'font-family', 'line-height'],
    concepts: ['web-css-typography'],
  },

  {
    id: 'css-typography-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_BASICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Write CSS for an .article-title class: font-family a stack of "Georgia", serif, font-weight 700, text-align center, and letter-spacing 0.5px.',
    starterCode: `.article-title {\n`,
    testCases: [{ input: 'typography rule', expectedOutput: 'font-family, font-weight, text-align, letter-spacing', description: 'Should style heading typography' }],
    solution: `.article-title {\n  font-family: "Georgia", serif;\n  font-weight: 700;\n  text-align: center;\n  letter-spacing: 0.5px;\n}`,
    previewHtml: `<h1 class="article-title" style="margin: 16px 0;">The Art of Readable Headlines</h1><p>Body copy below the title for contrast - the title above should become a centered, bold serif.</p>`,
    previewChecks: [
      { selector: '.article-title', properties: ['font-family', 'font-weight', 'text-align', 'letter-spacing'] },
    ],
    explanation: 'font-family lists the preferred font then a generic fallback. font-weight: 700 is bold. text-align: center centers inline content. letter-spacing adds space between characters - small positive values like 0.5px are common for headings.',
    hints: ['Quote font names with spaces', '700 for bold', 'letter-spacing takes a length'],
    tags: ['css', 'typography', 'styling'],
    concepts: ['web-css-typography'],
  },

  {
    id: 'css-color-formats-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_BASICS,
    course: Course.WEB_DEV,
    question: 'Which statement about CSS color formats is accurate?',
    options: [
      { id: 'a', text: 'hex codes like #3b82f6 can express partial transparency directly, the same way rgba() can', isCorrect: false },
      { id: 'b', text: 'rgba(59, 130, 246, 0.5) is the same blue as rgb(59, 130, 246), but at 50% opacity thanks to the fourth alpha channel', isCorrect: true },
      { id: 'c', text: 'hsl() cannot represent the same colors that rgb() can, since the two color spaces are mutually exclusive', isCorrect: false },
      { id: 'd', text: 'Alpha transparency can only ever be applied using the opacity property, never inside a color value itself', isCorrect: false },
    ],
    explanation: 'rgba(r, g, b, a) adds a fourth alpha channel (0 to 1) on top of rgb(), setting transparency for that one color value specifically - unlike the opacity property, which fades the whole element including its children. hsl()/hsla() describe the same sRGB color space using hue/saturation/lightness instead of red/green/blue, and modern CSS also supports 4/8-digit hex with alpha (#3b82f680). Hex, rgb, and hsl are just different notations for the same colors, and alpha can be set directly via rgba()/hsla()/8-digit hex.',
    hints: ['rgba adds a fourth value to plain rgb', 'opacity fades the WHOLE element; an alpha channel fades just that color'],
    tags: ['css', 'color', 'rgba', 'hsl'],
    concepts: ['web-css-colors'],
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
    previewHtml: `<button class="btn" style="background: #60a5fa; color: #ffffff; border: none; padding: 10px 22px; border-radius: 6px; cursor: pointer;">Hover me</button>`,
    explanation: 'transition (declared on the base rule, not on :hover) interpolates between the normal and hover states. :hover is the pseudo-class that matches while the pointer is over the element.',
    hints: ['Property that interpolates changes; pseudo-class for pointer-over.'],
    tags: ['css', 'transition', 'hover'],
    concepts: ['web-css-animation'],
  },

  {
    id: 'css-box-shadow-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_BASICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Fill in the property that adds a drop shadow around an element.',
    template: `.card {
  ___: 0 2px 4px rgba(0, 0, 0, 0.1);
}`,
    blanks: ['box-shadow'],
    solution: '.card {\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n}',
    previewHtml: `<div class="card" style="max-width: 280px; margin: 16px auto; background: #ffffff; border-radius: 8px; padding: 16px;"><strong>Floating card</strong><p style="margin: 6px 0 0;">Fill the blank and I lift off the page.</p></div>`,
    explanation: 'box-shadow takes offset-x, offset-y, blur-radius, then a color — here a low-alpha black for a subtle effect. Larger blur-radius softens the edge; larger offsets push the shadow further from the element.',
    hints: ['One property, four space-separated values.'],
    tags: ['css', 'box-shadow', 'styling', 'cloze'],
    concepts: ['web-css-box-model'],
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
    previewHtml: `<div style="background: #f1f5f9; padding: 24px;"><div class="card" style="max-width: 300px;"><strong>Product card</strong><p style="margin: 6px 0 0;">White surface, hairline border, rounded corners, soft shadow.</p></div></div>`,
    previewChecks: [
      { selector: '.card', properties: ['background-color', 'border-top-width', 'border-top-color', 'padding-top', 'border-top-left-radius', 'box-shadow'] },
    ],
    explanation: 'This is a common card pattern. border-radius rounds corners. box-shadow adds depth: offset-x, offset-y, blur-radius, color. rgba() with low alpha creates subtle shadows. These properties together create a modern card UI.',
    hints: ['box-shadow: x y blur color', 'rgba(0,0,0,0.1) for subtle shadow', 'border-radius for rounded corners'],
    tags: ['css', 'card', 'box-shadow', 'styling'],
    concepts: ['web-css-box-model'],
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
    previewHtml: `<div style="padding: 24px; text-align: center;"><button class="btn">Hover me</button></div>`,
    explanation: 'transition defines which properties animate and how long. List multiple properties with commas. The hover state defines the end values — CSS smoothly interpolates between normal and hover states. ease is the default timing function.',
    hints: ['transition on the base state, not :hover', 'Comma-separate multiple properties', 'transform: scale() for size change'],
    tags: ['css', 'transition', 'hover', 'animation'],
    concepts: ['web-css-animation'],
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
    id: 'css-cascade-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.CSS_BASICS,
    course: Course.WEB_DEV,
    question: 'Given p { color: black; } and .warning { color: red; } both applying to <p class="warning">, and a child <span> inside that <p> with no color rule of its own, what color is the span\'s text, and why?',
    options: [
      { id: 'a', text: 'Black, because inline elements never inherit color from a block-level ancestor', isCorrect: false },
      { id: 'b', text: 'Red, because color is an inherited property, so the span picks up the computed color from its closest ancestor with a value: the red .warning paragraph', isCorrect: true },
      { id: 'c', text: 'Transparent, since the span has no color rule at all and browsers default unstyled text to transparent', isCorrect: false },
      { id: 'd', text: 'Black, because .warning only styles the <p> element itself, and inheritance never carries computed values down to descendants', isCorrect: false },
    ],
    explanation: 'color is one of the properties CSS marks as "inherited" - a descendant that sets no value of its own for that property receives its ancestor\'s computed value, cascading down the tree until an element (or a more specific rule) overrides it. Here .warning (specificity 0,1,0) beats the bare p (0,0,1) for the paragraph itself, computing to red; the span inherits that red since it declares nothing. Not all properties inherit by default - margin, border, and padding do not - but color, font-family, and line-height do.',
    hints: ['color is an inherited property by default', 'Specificity first decides the paragraph itself; inheritance then carries that result down'],
    tags: ['css', 'cascade', 'inheritance', 'specificity'],
    concepts: ['web-css-cascade'],
  },

  {
    id: 'css-combinator-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.CSS_BASICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'The first rule already uses the descendant combinator (a space) to match any <a> nested anywhere inside .nav. Fill in the combinator that instead matches only <li> elements that are DIRECT children of .nav.',
    template: `.nav a {
  text-decoration: none;
}

.nav ___ li {
  display: inline-block;
}`,
    blanks: ['>'],
    solution: `.nav a {\n  text-decoration: none;\n}\n\n.nav > li {\n  display: inline-block;\n}`,
    previewHtml: `<ul class="nav" style="padding: 8px; background: #e2e8f0; list-style: none;"><li style="margin: 0 8px;"><a href="#">Home</a></li><li style="margin: 0 8px;"><a href="#">Docs</a><ul style="list-style: none; padding-left: 12px;"><li><a href="#">Nested item (not a direct child)</a></li></ul></li><li style="margin: 0 8px;"><a href="#">About</a></li></ul>`,
    explanation: 'A space between two selectors is the descendant combinator - it matches an element at ANY depth inside the ancestor (.nav a matches an <a> nested inside a <ul> inside .nav). The > combinator restricts the match to DIRECT children only, one level down, which avoids accidentally styling deeply nested elements that happen to share a selector.',
    hints: ['One character narrows "anywhere inside" down to "immediate child only"'],
    tags: ['css', 'selectors', 'combinators', 'descendant', 'child'],
    concepts: ['web-css-selectors'],
  },

  {
    id: 'css-attr-selector-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.CSS_BASICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Fill in the attribute selector that matches every <input> whose type attribute is exactly "checkbox".',
    template: `input___ {
  margin-right: 8px;
}`,
    blanks: ['[type="checkbox"]'],
    solution: `input[type="checkbox"] {\n  margin-right: 8px;\n}`,
    previewHtml: `<label style="display: block; margin-bottom: 8px;"><input type="checkbox">Email me updates</label><label style="display: block; margin-bottom: 8px;"><input type="checkbox">Accept terms</label><label style="display: block;"><input type="text" placeholder="Not a checkbox - unaffected"></label>`,
    explanation: 'Attribute selectors match elements by an attribute name/value pair: [attr="value"] requires an exact match, [attr] alone just requires the attribute to be present with any value, and variants like [attr^="value"]/[attr$="value"]/[attr*="value"] match prefix/suffix/substring. input[type="checkbox"] is the standard way to style checkboxes distinctly from other input types without adding an extra class.',
    hints: ['Square brackets, attribute name, exact value in quotes'],
    tags: ['css', 'selectors', 'attribute-selector'],
    concepts: ['web-css-selectors'],
  },

  {
    id: 'css-pseudo-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.CSS_BASICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Fill in (1) the pseudo-class for a keyboard-focused input, (2) the pseudo-class that selects every odd-positioned <tr> for zebra striping, and (3) the pseudo-class that excludes the element carrying class "disabled".',
    template: `input:___ {
  outline: 2px solid #2563eb;
}

tr:___(odd) {
  background: #f9fafb;
}

.btn:___(.disabled) {
  cursor: pointer;
}`,
    blanks: ['focus', 'nth-child', 'not'],
    solution: `input:focus {\n  outline: 2px solid #2563eb;\n}\n\ntr:nth-child(odd) {\n  background: #f9fafb;\n}\n\n.btn:not(.disabled) {\n  cursor: pointer;\n}`,
    previewHtml: `<input type="text" placeholder="Click me, then Tab away" style="margin-bottom: 10px; padding: 4px 8px;"><table style="border-collapse: collapse; width: 100%; margin-bottom: 10px;"><tbody><tr><td style="padding: 4px 8px;">Row one</td></tr><tr><td style="padding: 4px 8px;">Row two</td></tr><tr><td style="padding: 4px 8px;">Row three</td></tr></tbody></table><button class="btn" style="margin-right: 8px;">Active button</button><button class="btn disabled">Disabled button</button>`,
    explanation: ':focus matches an element while it holds keyboard focus (tab or click). :nth-child(odd) matches every other row for zebra striping without adding classes to each row. :not(selector) matches elements that do NOT match the given selector - here every .btn except the ones also carrying .disabled.',
    hints: ['Keyboard-focus state; every-other-row; exclude a class'],
    tags: ['css', 'pseudo-class', 'focus', 'nth-child', 'not'],
    concepts: ['web-css-pseudo-classes'],
  },

  {
    id: 'css-pseudo-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.CSS_BASICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Write CSS for a table: every <tr> that is even gets background #f3f4f6 (zebra striping), and every <button> EXCEPT those with class "icon-only" gets 8px of horizontal padding.',
    starterCode: `tr {\n`,
    testCases: [{ input: 'zebra + not selector', expectedOutput: 'tr:nth-child(even), button:not(.icon-only)', description: 'Should use nth-child and not selectors' }],
    solution: `tr:nth-child(even) {\n  background: #f3f4f6;\n}\n\nbutton:not(.icon-only) {\n  padding: 0 8px;\n}`,
    previewHtml: `<table style="border-collapse: collapse; width: 100%; margin-bottom: 12px;"><tbody><tr><td style="padding: 4px 8px;">Alpha</td><td style="padding: 4px 8px;">100</td></tr><tr><td style="padding: 4px 8px;">Beta</td><td style="padding: 4px 8px;">200</td></tr><tr><td style="padding: 4px 8px;">Gamma</td><td style="padding: 4px 8px;">300</td></tr><tr><td style="padding: 4px 8px;">Delta</td><td style="padding: 4px 8px;">400</td></tr></tbody></table><button>Save changes</button> <button class="icon-only">★</button>`,
    previewChecks: [
      { selector: 'tr:nth-child(2)', properties: ['background-color'] },
      { selector: 'tr:nth-child(3)', properties: ['background-color'] },
      { selector: 'button:not(.icon-only)', properties: ['padding-left', 'padding-right'] },
      { selector: 'button.icon-only', properties: ['padding-left'] },
    ],
    explanation: ':nth-child(even) targets every second row (equivalent to 2n). :not(.icon-only) matches every <button> that does NOT carry that class, letting one rule cover "all buttons except this exception" instead of writing a positive rule for every other button variant.',
    hints: ['nth-child(even) for alternating rows', 'not(.class) to exclude one variant'],
    tags: ['css', 'pseudo-class', 'nth-child', 'not', 'styling'],
    concepts: ['web-css-pseudo-classes'],
  },

  {
    id: 'css-bg-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.CSS_BASICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Fill in (1) the background-size value that scales an image to fully cover its box (cropping overflow) while preserving aspect ratio, and (2) the background-position value that keeps it centered.',
    template: `.hero {
  background-image: url("hero.jpg");
  background-size: ___;
  background-position: ___;
}`,
    blanks: ['cover', 'center'],
    solution: `.hero {\n  background-image: url("hero.jpg");\n  background-size: cover;\n  background-position: center;\n}`,
    explanation: 'background-size: cover scales the image up (cropping whichever dimension overflows) so it fills the entire box with no gaps, unlike contain which fits the whole image inside the box, possibly leaving empty space. background-position: center keeps the visually important middle of the image visible regardless of how much gets cropped.',
    hints: ['Fill the box completely, cropping overflow; keep the crop centered'],
    tags: ['css', 'backgrounds', 'background-size', 'background-position'],
    concepts: ['web-css-backgrounds'],
  },

  {
    id: 'css-bg-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.CSS_BASICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Write CSS for a .banner class with a linear-gradient background going from #2563eb at the top-left to #7c3aed at the bottom-right (135deg), white text color, and 48px of padding.',
    starterCode: `.banner {\n`,
    testCases: [{ input: 'gradient banner', expectedOutput: 'linear-gradient(135deg, #2563eb, #7c3aed), color white, padding 48px', description: 'Should create a gradient banner' }],
    solution: `.banner {\n  background: linear-gradient(135deg, #2563eb, #7c3aed);\n  color: white;\n  padding: 48px;\n}`,
    previewHtml: `<div class="banner"><h2 style="margin: 0;">Summer launch</h2><p style="margin: 8px 0 0;">A gradient banner from blue to violet.</p></div>`,
    previewChecks: [
      { selector: '.banner', properties: ['background-image', 'color', 'padding-top'] },
    ],
    explanation: 'linear-gradient(angle, color1, color2, ...) paints a smooth transition between colors along the given direction - 135deg runs roughly top-left to bottom-right. It can be used anywhere a background-image value is accepted, including as the sole value of the background shorthand.',
    hints: ['linear-gradient(angle, start, end)', '135deg for top-left to bottom-right'],
    tags: ['css', 'backgrounds', 'gradient', 'linear-gradient'],
    concepts: ['web-css-backgrounds'],
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
    previewHtml: `<div style="padding: 32px; display: flex; justify-content: center;"><div class="spinner"></div></div>`,
    previewChecks: [
      { selector: '.spinner', properties: ['width', 'height', 'border-top-color', 'border-top-left-radius', 'animation-iteration-count'] },
    ],
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
    previewHtml: `<nav class="navbar" style="border: 1px dashed #94a3b8; padding: 8px; min-height: 56px;"><strong>Logo</strong><a href="#">Docs</a><button>Sign in</button></nav>`,
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
    previewHtml: `<div class="grid" style="gap: 8px;"><div style="background: #c7d2fe; padding: 12px;">1</div><div style="background: #bae6fd; padding: 12px;">2</div><div style="background: #bbf7d0; padding: 12px;">3</div><div style="background: #fde68a; padding: 12px;">4</div><div style="background: #fecaca; padding: 12px;">5</div><div style="background: #e9d5ff; padding: 12px;">6</div></div>`,
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
    previewHtml: `<div class="overlay" style="height: 180px; background: #e0e7ff; border: 1px dashed #6366f1;"><div style="background: #ffffff; padding: 14px 22px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">Center me</div></div>`,
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
    previewHtml: `<nav class="navbar" style="border: 1px dashed #94a3b8; padding: 8px;"><strong>Logo</strong><a href="#">Docs</a><a href="#">Pricing</a><button>Sign in</button></nav>`,
    previewChecks: [
      { selector: '.navbar', properties: ['display', 'justify-content', 'align-items', 'gap'] },
    ],
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
    previewHtml: `<div class="grid-container"><div style="background: #c7d2fe; padding: 16px;">1</div><div style="background: #bae6fd; padding: 16px;">2</div><div style="background: #bbf7d0; padding: 16px;">3</div><div style="background: #fde68a; padding: 16px;">4</div><div style="background: #fecaca; padding: 16px;">5</div><div style="background: #e9d5ff; padding: 16px;">6</div></div>`,
    previewChecks: [
      { selector: '.grid-container', properties: ['display', 'grid-template-columns', 'gap'] },
    ],
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
    previewHtml: `<div class="overlay" style="background: rgba(15, 23, 42, 0.5);"><div class="modal" style="background: #ffffff; padding: 24px 32px; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">I should be centered</div></div>`,
    previewChecks: [
      { selector: '.overlay', properties: ['display', 'justify-content', 'align-items', 'position'] },
    ],
    explanation: 'The classic centering pattern: flex container with justify-content: center (horizontal) and align-items: center (vertical). position: fixed + full width/height covers the entire viewport. This is the modern replacement for old margin/transform hacks.',
    hints: ['justify-content: center for horizontal', 'align-items: center for vertical', 'Parent needs height for vertical centering to work'],
    tags: ['css', 'flexbox', 'centering', 'modal'],
    concepts: ['web-css-flexbox'],
  },

  // BEGINNER - Positioning

  {
    id: 'css-position-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_LAYOUT,
    course: Course.WEB_DEV,
    question: 'When you set `position: absolute` on an element, what determines where `top: 0` and `left: 0` will place it?',
    options: [
      { id: 'a', text: 'The nearest ancestor with `position: relative`, `absolute`, or `fixed`; if none exist, the document root', isCorrect: true },
      { id: 'b', text: 'Always the document root, regardless of parent elements', isCorrect: false },
      { id: 'c', text: 'The direct parent element, regardless of its position value', isCorrect: false },
      { id: 'd', text: 'The nearest ancestor with `display: block`', isCorrect: false },
    ],
    explanation: 'An absolutely positioned element is positioned relative to its nearest positioned ancestor (an ancestor with position: relative, absolute, or fixed). If no positioned ancestor exists, it positions relative to the initial containing block (document root). This is why the "relative parent + absolute child" pattern is so common.',
    tags: ['css', 'positioning', 'layout', 'containing-block'],
    concepts: ['web-css-positioning'],
  },

  {
    id: 'css-position-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_LAYOUT,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Complete the CSS to position the child absolutely in the top-right corner of its parent container.',
    template: `.parent {
  position: ___;
}

.child {
  position: ___;
  top: 0;
  right: 0;
}`,
    blanks: ['relative', 'absolute'],
    solution: `.parent {\n  position: relative;\n}\n\n.child {\n  position: absolute;\n  top: 0;\n  right: 0;\n}`,
    previewHtml: `<div class="parent" style="width: 220px; height: 120px; margin: 16px; background: #e0e7ff; border: 1px dashed #6366f1;"><span class="child" style="background: #ef4444; color: #ffffff; padding: 2px 8px; border-radius: 4px; font-size: 13px;">child</span></div>`,
    explanation: 'The parent gets position: relative to become the containing block (without moving from its normal position). The child gets position: absolute and is positioned relative to that parent using top/right.',
    hints: ['Parent establishes the positioning context', 'Child breaks out of normal flow'],
    tags: ['css', 'positioning', 'layout'],
    concepts: ['web-css-positioning'],
  },

  {
    id: 'css-position-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_LAYOUT,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Write CSS for `.tooltip-container` with `position: relative`, and `.tooltip` positioned absolutely 5px above the container (top: -30px) and horizontally centered (left: 50%, transform: translateX(-50%)).',
    starterCode: '',
    testCases: [
      {
        input: 'tooltip positioning',
        expectedOutput: 'position: relative; position: absolute; top: -30px; left: 50%; transform: translateX(-50%)',
        description: 'Should position tooltip above and centered',
      },
    ],
    solution: `.tooltip-container {\n  position: relative;\n}\n\n.tooltip {\n  position: absolute;\n  top: -30px;\n  left: 50%;\n  transform: translateX(-50%);\n}`,
    previewHtml: `<div style="padding-top: 56px; text-align: center;"><span class="tooltip-container" style="display: inline-block; border: 1px solid #94a3b8; border-radius: 6px; padding: 8px 20px;">Hover target<span class="tooltip" style="background: #111827; color: #ffffff; padding: 4px 10px; border-radius: 4px; white-space: nowrap; font-size: 13px;">Tooltip text</span></span></div>`,
    previewChecks: [
      { selector: '.tooltip-container', properties: ['position'] },
      { selector: '.tooltip', properties: ['position', 'top', 'left', 'transform'] },
    ],
    explanation: 'The container is positioned relative so it becomes the reference point. The tooltip is absolutely positioned above (negative top) and centered horizontally using the left: 50% + translateX(-50%) centering technique.',
    hints: ['Parent needs position: relative', 'Absolute positioning for tooltip', 'left: 50% + translateX(-50%) centers horizontally'],
    tags: ['css', 'positioning', 'layout', 'tooltip'],
    concepts: ['web-css-positioning'],
  },

  {
    id: 'css-position-fixed-sticky-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_LAYOUT,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Fill in position values: fixed stays in place relative to the viewport even when scrolling; sticky acts like relative until scrolling past a threshold, then becomes fixed.',
    template: `.modal-overlay {
  position: ___; /* Stays in viewport */
}

.table-header {
  position: ___;
  top: 0; /* Sticks after scroll */
}`,
    blanks: ['fixed', 'sticky'],
    solution: `.modal-overlay {\n  position: fixed;\n}\n\n.table-header {\n  position: sticky;\n  top: 0;\n}`,
    previewHtml: `<span class="modal-overlay" style="right: 12px; bottom: 12px; background: #111827; color: #ffffff; padding: 6px 12px; border-radius: 6px; font-size: 13px;">I stay put while you scroll</span><div class="table-header" style="background: #1e293b; color: #ffffff; padding: 8px 12px;">Sticky table header</div><p style="padding: 8px 12px;">Row one - scroll the preview.</p><p style="padding: 8px 12px;">Row two.</p><p style="padding: 8px 12px;">Row three.</p><p style="padding: 8px 12px;">Row four.</p><p style="padding: 8px 12px;">Row five.</p><p style="padding: 8px 12px;">Row six.</p><p style="padding: 8px 12px;">Row seven.</p><p style="padding: 8px 12px;">Row eight.</p>`,
    explanation: 'position: fixed removes the element from normal flow and positions it relative to the viewport - it stays put while scrolling. position: sticky is hybrid: it acts like position: relative until the user scrolls past a threshold (defined by top/bottom/left/right), then it acts like position: fixed.',
    hints: ['fixed = viewport-relative, always visible', 'sticky = relative until scroll threshold'],
    tags: ['css', 'positioning', 'layout'],
    concepts: ['web-css-positioning'],
  },

  // BEGINNER - Display and overflow

  {
    id: 'css-display-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_LAYOUT,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Fill in the display values: inline elements flow in text and ignore width/height; block elements take full width and stack vertically; inline-block combines both; none removes the element entirely.',
    template: `.inline-elem { display: ___; } /* Flows in text, ignores width */
.block-elem { display: ___; } /* Full width, stacks */
.inline-block-elem { display: ___; } /* Flows but respects width */
.hidden { display: ___; } /* Removed from layout */`,
    blanks: ['inline', 'block', 'inline-block', 'none'],
    solution: `.inline-elem { display: inline; }\n.block-elem { display: block; }\n.inline-block-elem { display: inline-block; }\n.hidden { display: none; }`,
    previewHtml: `<p>Text with <span class="inline-elem" style="background: #fde68a; width: 120px;">an inline span (width ignored)</span> flowing through it.</p><span class="block-elem" style="background: #bae6fd;">I become a full-width block.</span><p>More text with <span class="inline-block-elem" style="background: #bbf7d0; width: 140px;">an inline-block (width respected)</span> inside.</p><p class="hidden" style="background: #fecaca;">You should NOT see me once the last blank is right.</p>`,
    explanation: 'inline elements (like span, a) flow with text and ignore width/height. block elements (like div, p) stack vertically and take full width. inline-block flows like inline but respects width/height. none removes the element from the layout entirely (vs. visibility: hidden which keeps the space).',
    hints: ['inline = text flow', 'block = stacks', 'inline-block = hybrid', 'none = removed'],
    tags: ['css', 'display', 'layout'],
    concepts: ['web-css-display'],
  },

  {
    id: 'css-overflow-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CSS_LAYOUT,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Complete the overflow values: hidden clips content, scroll always shows scrollbars, auto shows scrollbars only when needed.',
    template: `.clip { overflow: ___; } /* Clips overflowing content */
.always-scroll { overflow: ___; } /* Always shows scrollbars */
.smart-scroll { overflow: ___; } /* Scrollbars only if needed */`,
    blanks: ['hidden', 'scroll', 'auto'],
    solution: `.clip { overflow: hidden; }\n.always-scroll { overflow: scroll; }\n.smart-scroll { overflow: auto; }`,
    previewHtml: `<div style="display: flex; gap: 10px;"><div class="clip" style="width: 130px; height: 90px; border: 1px solid #94a3b8; padding: 6px;">clip: long content that overflows the box gets cut off with no scrollbar at all</div><div class="always-scroll" style="width: 130px; height: 90px; border: 1px solid #94a3b8; padding: 6px;">scroll: short text</div><div class="smart-scroll" style="width: 130px; height: 90px; border: 1px solid #94a3b8; padding: 6px;">auto: enough content here to overflow the box and trigger a scrollbar on demand</div></div>`,
    explanation: 'overflow: hidden clips any content that exceeds the box. overflow: scroll always adds scrollbars even if content fits. overflow: auto only adds scrollbars when content overflows - the most common choice.',
    hints: ['hidden = clips', 'scroll = always shows bars', 'auto = smart'],
    tags: ['css', 'overflow', 'layout'],
    concepts: ['web-css-overflow'],
  },

  // INTERMEDIATE

  {
    id: 'css-z-index-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.CSS_LAYOUT,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Complete the CSS: z-index only works on positioned elements (relative, absolute, fixed, or sticky). Higher values appear in front.',
    template: `.card {
  position: ___;
  z-index: 1;
}

.modal {
  position: ___;
  z-index: 10; /* Appears in front of card */
}`,
    blanks: ['relative', 'fixed'],
    blankAlternates: [['relative', 'absolute', 'fixed', 'sticky'], ['fixed', 'absolute']],
    solution: `.card {\n  position: relative;\n  z-index: 1;\n}\n\n.modal {\n  position: fixed;\n  z-index: 10;\n}`,
    previewHtml: `<div class="card" style="width: 200px; height: 90px; background: #c7d2fe; border: 1px solid #6366f1; padding: 8px;">card (z-index: 1)</div><div class="modal" style="width: 200px; margin-top: -50px; margin-left: 60px; background: #ffffff; border: 1px solid #94a3b8; box-shadow: 0 6px 16px rgba(0,0,0,0.2); padding: 8px;">modal (z-index: 10) - I should sit on top</div>`,
    explanation: 'z-index only affects elements with position set to something other than static (the default). Higher z-index values stack in front. Both elements must be positioned for z-index to work. Common gotcha: forgetting to set position.',
    hints: ['z-index requires position: relative/absolute/fixed/sticky', 'Higher number = in front'],
    tags: ['css', 'z-index', 'layout', 'stacking'],
    concepts: ['web-css-z-index'],
  },

  {
    id: 'css-flex-item-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.CSS_LAYOUT,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Fill in flex item properties: flex-grow controls how much an item grows relative to siblings; flex-shrink controls shrinking; flex-basis sets initial size; align-self overrides the container alignment for one item.',
    template: `.sidebar {
  flex-basis: 200px;
  flex-shrink: 0; /* Fixed 200px */
}

.content {
  ___: 1; /* Grows to fill space */
}

.footer-logo {
  ___: flex-end; /* Override alignment */
}`,
    blanks: ['flex-grow', 'align-self'],
    solution: `.sidebar {\n  flex-basis: 200px;\n  flex-shrink: 0;\n}\n\n.content {\n  flex-grow: 1;\n}\n\n.footer-logo {\n  align-self: flex-end;\n}`,
    previewHtml: `<div style="display: flex; gap: 8px; height: 130px; border: 1px dashed #94a3b8; padding: 6px;"><div class="sidebar" style="background: #c7d2fe; padding: 8px;">sidebar</div><div class="content" style="background: #bae6fd; padding: 8px;">content - should grow to fill</div><div class="footer-logo" style="background: #fde68a; padding: 8px;">logo - should drop to the bottom</div></div>`,
    explanation: 'flex-grow: 1 means "take up available space". flex-shrink: 0 prevents shrinking below flex-basis. align-self overrides the parent flex container align-items for a single child. These properties go on flex items, not the container.',
    hints: ['flex-grow for expanding items', 'align-self for individual alignment'],
    tags: ['css', 'flexbox', 'layout', 'flex-item'],
    concepts: ['web-css-flexbox'],
  },

  {
    id: 'css-badge-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.CSS_LAYOUT,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Style `.avatar` with `position: relative`, and `.badge` positioned absolutely in the top-right corner (top: 0, right: 0). The badge should sit on top of the avatar.',
    starterCode: '',
    testCases: [
      {
        input: 'badge on avatar',
        expectedOutput: 'position: relative; position: absolute; top: 0; right: 0',
        description: 'Should position badge in corner of avatar',
      },
    ],
    solution: `.avatar {\n  position: relative;\n}\n\n.badge {\n  position: absolute;\n  top: 0;\n  right: 0;\n}`,
    previewHtml: `<div style="padding: 24px;"><span class="avatar" style="display: inline-block; width: 64px; height: 64px; border-radius: 50%; background: #c7d2fe;"><span class="badge" style="display: block; width: 16px; height: 16px; border-radius: 50%; background: #ef4444; border: 2px solid #ffffff;"></span></span></div>`,
    previewChecks: [
      { selector: '.avatar', properties: ['position'] },
      { selector: '.badge', properties: ['position', 'top', 'right'] },
    ],
    explanation: 'Classic badge-on-avatar pattern: the avatar is positioned relative to create a positioning context. The badge is absolutely positioned relative to the avatar, anchored to the top-right corner. This combines the relative-parent + absolute-child technique.',
    hints: ['Avatar establishes positioning context', 'Badge positioned absolutely within avatar', 'top: 0, right: 0 for top-right corner'],
    tags: ['css', 'positioning', 'layout', 'badge'],
    concepts: ['web-css-positioning'],
  },

  // ADVANCED

  {
    id: 'css-sticky-header-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.CSS_LAYOUT,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Create a layout where `.header` uses `position: sticky` with `top: 0` to stay visible while scrolling, and `.content` has a fixed height (400px) with `overflow-y: auto` to scroll independently.',
    starterCode: '',
    testCases: [
      {
        input: 'sticky header with scrollable content',
        expectedOutput: 'position: sticky; top: 0; height: 400px; overflow-y: auto',
        description: 'Should create sticky header with scrollable content',
      },
    ],
    solution: `.header {\n  position: sticky;\n  top: 0;\n}\n\n.content {\n  height: 400px;\n  overflow-y: auto;\n}`,
    previewHtml: `<div class="content" style="border: 1px solid #94a3b8;"><header class="header" style="background: #1e293b; color: #ffffff; padding: 10px 16px;">Sticky header</header><p style="padding: 8px 16px;">Scroll me. Section one of the article body.</p><p style="padding: 8px 16px;">Section two - keep scrolling and watch the header.</p><p style="padding: 8px 16px;">Section three with more filler prose to force overflow.</p><p style="padding: 8px 16px;">Section four. The header should still be visible.</p><p style="padding: 8px 16px;">Section five. Almost at the bottom now.</p><p style="padding: 8px 16px;">Section six. The end.</p></div>`,
    previewChecks: [
      { selector: '.header', properties: ['position', 'top'] },
      { selector: '.content', properties: ['height', 'overflow-y'] },
    ],
    explanation: 'position: sticky with top: 0 makes the header stick to the top of the viewport after scrolling past it. The content area gets a fixed height and overflow-y: auto to create an independent scroll container. This combines sticky positioning + overflow scrolling.',
    hints: ['Sticky header stays at top while scrolling', 'Content needs fixed height + overflow to scroll', 'overflow-y for vertical scroll only'],
    tags: ['css', 'positioning', 'layout', 'sticky', 'overflow'],
    concepts: ['web-css-positioning', 'web-css-overflow'],
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
      { id: 'b', text: '<meta name="mobile" content="true" viewport-fit="cover">', isCorrect: false },
      { id: 'c', text: '<meta name="responsive" content="yes" scale="auto">', isCorrect: false },
      { id: 'd', text: 'No meta tag is needed — modern CSS media queries handle responsiveness automatically without any HTML changes', isCorrect: false },
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
    previewHtml: `<div class="grid" style="display: grid; gap: 8px;"><div style="background: #c7d2fe; padding: 12px;">1</div><div style="background: #bae6fd; padding: 12px;">2</div><div style="background: #bbf7d0; padding: 12px;">3</div></div><p style="margin-top: 10px; font-size: 13px; color: #64748b;">Use the device presets: 1 column below 768px, 3 columns at Tablet and up.</p>`,
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
    previewHtml: `<div class="grid" style="display: grid; gap: 8px;"><div style="background: #c7d2fe; padding: 12px;">1</div><div style="background: #bae6fd; padding: 12px;">2</div><div style="background: #bbf7d0; padding: 12px;">3</div></div><p style="margin-top: 10px; font-size: 13px; color: #64748b;">Switch device presets to cross the 768px breakpoint.</p>`,
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
    previewHtml: `<div class="container" style="background: #e0e7ff; border: 1px dashed #6366f1; padding: 12px;">Capped and centered container - compare Fill vs the narrower presets.</div>`,
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
    previewHtml: `<div class="grid"><div style="background: #c7d2fe; padding: 12px;">1</div><div style="background: #bae6fd; padding: 12px;">2</div><div style="background: #bbf7d0; padding: 12px;">3</div></div><p style="margin-top: 10px; font-size: 13px; color: #64748b;">Check your breakpoint with the device presets.</p>`,
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
    previewHtml: `<div class="container" style="background: #e0e7ff; border: 1px dashed #6366f1;"><p style="background: #ffffff; margin: 0;">Inner content - the gap on each side is the container's padding. Compare SE vs Tablet presets.</p></div>`,
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
    previewHtml: `<nav class="nav" style="background: #f1f5f9; padding: 10px;"><strong>Brand</strong><input type="checkbox" class="nav-toggle" title="hamburger toggle stand-in"><div class="nav-links"><a href="#">Home</a><a href="#">Docs</a><a href="#">Pricing</a></div></nav><p style="margin-top: 10px; font-size: 13px; color: #64748b;">On SE/Phone presets: tick the checkbox to open the menu. On Tablet+: links always show in a row.</p>`,
    explanation: 'Mobile: nav-links hidden, checkbox toggle shows/hides them. Desktop: toggle hidden, nav-links always visible in a row. The ~ sibling combinator with :checked creates a CSS-only toggle without JavaScript.',
    hints: ['Hide nav-links on mobile by default', 'Show on checkbox :checked with ~ combinator', 'Media query shows everything on desktop'],
    tags: ['responsive', 'navigation', 'hamburger', 'css'],
    concepts: ['web-css-responsive'],
  },

  {
    id: 'css-resp-clamp-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.CSS_RESPONSIVE,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Fill in the function that picks a fluid value between a minimum and maximum, and put its three arguments in order: minimum size, preferred (viewport-based) size, maximum size.',
    template: `h1 {
  font-size: ___(1.5rem, 4vw, 3rem);
}`,
    blanks: ['clamp'],
    solution: `h1 {\n  font-size: clamp(1.5rem, 4vw, 3rem);\n}`,
    previewHtml: `<h1 style="margin: 0;">Fluid heading</h1><p style="margin-top: 10px; font-size: 13px; color: #64748b;">Drag between device presets - the heading scales smoothly instead of jumping at a breakpoint.</p>`,
    explanation: 'clamp(min, preferred, max) locks the value between min and max, but tracks the preferred value (here a viewport-relative 4vw) in between — no @media rule needed for the size to scale smoothly.',
    hints: ['clamp() takes exactly three arguments, in min/preferred/max order.'],
    tags: ['css', 'clamp', 'responsive', 'typography', 'cloze'],
    concepts: ['web-css-responsive'],
  },

  {
    id: 'css-resp-clamp-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.CSS_RESPONSIVE,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Give .hero-title a fluid font-size using clamp(): never smaller than 2rem, never larger than 4.5rem, scaling with 5vw in between.',
    starterCode: `.hero-title {\n`,
    testCases: [{ input: 'fluid heading', expectedOutput: 'clamp(2rem, 5vw, 4.5rem)', description: 'Should use clamp() for fluid font-size' }],
    solution: `.hero-title {\n  font-size: clamp(2rem, 5vw, 4.5rem);\n}`,
    previewHtml: `<h1 class="hero-title" style="margin: 0;">Build Faster</h1><p style="margin-top: 10px; font-size: 13px; color: #64748b;">Resize between device presets to watch the text scale without any @media rule.</p>`,
    explanation: 'clamp(2rem, 5vw, 4.5rem) removes the need for several @media breakpoints just to step the font-size up — the browser interpolates continuously between the min and max as the viewport changes.',
    hints: ['One clamp() call replaces a stack of @media font-size overrides.'],
    tags: ['css', 'clamp', 'responsive', 'typography'],
    concepts: ['web-css-responsive'],
  },

  {
    id: 'css-resp-units-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.CSS_RESPONSIVE,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Style .card so its padding scales with the root font size (2rem) and its min-height fills most of the viewport (60vh).',
    starterCode: `.card {\n`,
    testCases: [{ input: 'rem and vh units', expectedOutput: 'padding: 2rem; min-height: 60vh;', description: 'Should use rem for spacing and vh for viewport-relative sizing' }],
    solution: `.card {\n  padding: 2rem;\n  min-height: 60vh;\n}`,
    previewHtml: `<div class="card" style="background: #e0e7ff; border: 1px dashed #6366f1;">Card content</div><p style="margin-top: 10px; font-size: 13px; color: #64748b;">rem tracks the root font size (design-token driven); vh tracks the viewport height directly.</p>`,
    explanation: 'rem is relative to the root (<html>) font size, so a single font-size change rescales every rem-based value at once — that\'s why it\'s preferred over px for spacing in a design-token system. vh is relative to the viewport height, useful for "fill most of the screen" sizing that px or % of a parent can\'t express.',
    hints: ['rem for spacing tied to the type scale; vh for viewport-relative height.'],
    tags: ['css', 'units', 'rem', 'vh', 'responsive'],
    concepts: ['web-css-responsive'],
  },

  {
    id: 'css-resp-media-features-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.CSS_RESPONSIVE,
    course: Course.WEB_DEV,
    question: 'Besides screen width, which media features let CSS respond to the user\'s device orientation and system-level accessibility preferences?',
    options: [
      { id: 'a', text: '@media (orientation: landscape) for device rotation; @media (prefers-color-scheme: dark) for system theme; @media (prefers-reduced-motion: reduce) for motion sensitivity', isCorrect: true },
      { id: 'b', text: '@media (rotation: 90deg) for device rotation; @media (theme: dark) for system theme; @media (motion: off) for motion sensitivity', isCorrect: false },
      { id: 'c', text: 'These all require a JavaScript matchMedia() call - plain @media rules can only ever test viewport width or height, nothing else', isCorrect: false },
      { id: 'd', text: '@media (landscape: true) for device rotation; @media (dark-mode: on) for system theme; @media (reduce-motion: true) for motion sensitivity', isCorrect: false },
    ],
    explanation: 'orientation, prefers-color-scheme, and prefers-reduced-motion are real media features - all readable directly in CSS with no JavaScript. orientation reports landscape/portrait from the viewport aspect ratio; the prefers-* features read OS-level accessibility/theme settings so sites can honor them automatically.',
    tags: ['css', 'media-query', 'orientation', 'prefers-color-scheme', 'accessibility'],
    concepts: ['web-css-responsive'],
  },

  {
    id: 'css-resp-media-features-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.CSS_RESPONSIVE,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Fill in the media feature that detects when a user has requested less motion, and the value it matches.',
    template: `@media (___: ___) {
  .banner { animation: none; }
}`,
    blanks: ['prefers-reduced-motion', 'reduce'],
    solution: `@media (prefers-reduced-motion: reduce) {\n  .banner { animation: none; }\n}`,
    explanation: 'prefers-reduced-motion mirrors an OS accessibility setting for users sensitive to motion (vestibular disorders, distraction). The reduce value matches when that preference is on, letting you strip animations without removing them for everyone.',
    hints: ['The feature name describes what the user prefers less of; the value is the verb, not "true"/"on".'],
    tags: ['css', 'media-query', 'prefers-reduced-motion', 'accessibility', 'cloze'],
    concepts: ['web-css-responsive'],
  },

  {
    id: 'css-resp-container-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.CSS_RESPONSIVE,
    course: Course.WEB_DEV,
    question: 'A .card component is reused in a wide main column and a narrow sidebar. You want it to switch to a 2-column internal layout only when ITS OWN box is wide enough, regardless of the viewport size. Why does a container query (@container) fit this better than a media query (@media)?',
    options: [
      { id: 'a', text: '@media only ever measures the viewport, so a card in a narrow sidebar on a wide screen would wrongly get the "wide" layout; @container measures the card\'s own containing box, so each placement responds independently', isCorrect: true },
      { id: 'b', text: '@container is simply newer syntax for the exact same viewport-width check that @media performs internally - the two rules are behaviorally identical in every case', isCorrect: false },
      { id: 'c', text: '@container can only ever be used nested inside an existing @media block as a modifier, and has no meaning or effect at all when written on its own outside of one', isCorrect: false },
      { id: 'd', text: '@media cannot be used inside reusable components at all and only ever applies to the top-level <body> element, while @container works on any nested element', isCorrect: false },
    ],
    explanation: 'A media query only knows the viewport size, not the size of the element\'s actual container - so a reusable component can\'t make layout decisions based on the space it was actually given. A container query measures the nearest ancestor marked with container-type, so the same component gets the right layout in a wide column AND a narrow sidebar on the identical viewport.',
    tags: ['css', 'container-query', 'component-driven-design'],
    concepts: ['web-css-responsive'],
  },

  {
    id: 'css-resp-container-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.CSS_RESPONSIVE,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Fill in (1) the property that opts an element in as a query container, and (2) the at-rule that then styles its children based on that container\'s width.',
    template: `.card-wrapper {
  ___: inline-size;
}

___ (min-width: 400px) {
  .card { display: flex; }
}`,
    blanks: ['container-type', '@container'],
    solution: `.card-wrapper {\n  container-type: inline-size;\n}\n\n@container (min-width: 400px) {\n  .card { display: flex; }\n}`,
    previewHtml: `<div class="card-wrapper" style="border: 1px dashed #6366f1; resize: horizontal; overflow: auto; width: 300px; min-width: 150px; max-width: 100%;"><div class="card" style="background: #e0e7ff; padding: 12px;">Card</div></div><p style="margin-top: 10px; font-size: 13px; color: #64748b;">Drag the wrapper's bottom-right corner to change ITS width and watch @container react.</p>`,
    explanation: 'container-type: inline-size marks the wrapper as something children can query against (its inline/width axis). @container then works just like @media but measures that nearest marked ancestor instead of the viewport.',
    hints: ['Property on the parent opts it in; at-rule (parallel to @media) queries it.'],
    tags: ['css', 'container-query', 'cloze'],
    concepts: ['web-css-responsive'],
  },

  {
    id: 'css-resp-autofit-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.CSS_RESPONSIVE,
    course: Course.WEB_DEV,
    language: CodeLanguage.CSS,
    question: 'Make .gallery a grid where columns are at least 200px wide, automatically wrapping to fewer or more columns as the container resizes - with NO @media rule at all.',
    starterCode: `.gallery {\n  display: grid;\n`,
    testCases: [{ input: 'auto-fit grid', expectedOutput: 'grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))', description: 'Should create a responsive grid without media queries' }],
    solution: `.gallery {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 16px;\n}`,
    previewHtml: `<div class="gallery"><div style="background: #c7d2fe; padding: 12px;">1</div><div style="background: #bae6fd; padding: 12px;">2</div><div style="background: #bbf7d0; padding: 12px;">3</div><div style="background: #fde68a; padding: 12px;">4</div></div><p style="margin-top: 10px; font-size: 13px; color: #64748b;">Switch device presets - the column count changes with zero @media rules.</p>`,
    explanation: 'repeat(auto-fit, minmax(200px, 1fr)) tells the grid to fit as many 200px-minimum columns as will fit, then stretch them (1fr) to fill remaining space - the column count adjusts continuously as the container resizes, unlike a media query which only changes at fixed breakpoints.',
    hints: ['repeat(auto-fit, minmax(...)) - same minmax primitive from CSS_LAYOUT, no @media needed.'],
    tags: ['css', 'grid', 'auto-fit', 'minmax', 'responsive'],
    concepts: ['web-css-responsive', 'web-css-grid'],
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

  {
    id: 'tw-variant-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TAILWIND,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Fill in (1) the variant that styles a ring only when the input is keyboard-focused, and (2) the variant that fades a button when it carries the disabled attribute.',
    template: `<input class="border ___:ring-2">
<button class="bg-blue-500 ___:opacity-50" disabled>Save</button>`,
    blanks: ['focus', 'disabled'],
    solution: `<input class="border focus:ring-2">\n<button class="bg-blue-500 disabled:opacity-50" disabled>Save</button>`,
    explanation: 'focus: applies its classes only while the element has focus. disabled: applies only when the element carries the disabled attribute — Tailwind reads real DOM/attribute state, no JavaScript required for either.',
    hints: ['State variants read real element state: :focus and [disabled].'],
    tags: ['tailwind', 'focus', 'disabled', 'variant', 'cloze'],
    concepts: ['web-tailwind-utility'],
  },

  {
    id: 'tw-variant-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TAILWIND,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Build a card where hovering the outer <div class="group"> reveals a hidden "Edit" label inside it: the label starts with opacity-0, and group-hover:opacity-100 makes it visible only when the group (the whole card) is hovered - not just the label itself.',
    starterCode: `<div class="group border p-4">\n  <p>Card content</p>\n`,
    testCases: [{ input: 'group-hover reveal', expectedOutput: 'group on the wrapper, group-hover:opacity-100 on the child', description: 'Should reveal a child element when the parent group is hovered' }],
    solution: `<div class="group border p-4">\n  <p>Card content</p>\n  <span class="opacity-0 group-hover:opacity-100">Edit</span>\n</div>`,
    explanation: 'group on an ancestor lets any descendant react to that ancestor being hovered via group-hover: — here the label is invisible (opacity-0) until the mouse is anywhere over the card, not just over the label itself.',
    hints: ['group goes on the parent; group-hover: goes on the child that should react.'],
    tags: ['tailwind', 'group-hover', 'variant'],
    concepts: ['web-tailwind-utility'],
  },

  {
    id: 'tw-dark-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TAILWIND,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Fill in the variant that swaps these colors when dark mode is active.',
    template: `<div class="bg-white ___:bg-gray-900 text-gray-900 ___:text-white">Card</div>`,
    blanks: ['dark', 'dark'],
    solution: `<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Card</div>`,
    explanation: 'dark: is a variant like hover: or md: — it applies its classes only when dark mode is active (by default, when the OS/browser reports prefers-color-scheme: dark, or when a "dark" class strategy is configured).',
    hints: ['Same prefix pattern as hover:/md:, but for color scheme.'],
    tags: ['tailwind', 'dark-mode', 'variant', 'cloze'],
    concepts: ['web-tailwind-utility'],
  },

  {
    id: 'tw-arbitrary-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TAILWIND,
    course: Course.WEB_DEV,
    question: 'A design spec calls for an element exactly 137px wide - a value with no matching step in Tailwind\'s default spacing scale. What does class="w-[137px]" do?',
    options: [
      { id: 'a', text: 'It is an arbitrary value: square brackets let you drop in any raw CSS value for that utility, generating a one-off w: 137px rule without editing the config or writing custom CSS', isCorrect: true },
      { id: 'b', text: 'It is invalid syntax - Tailwind utility classes can only reference values already defined in the default scale, so this would silently do nothing', isCorrect: false },
      { id: 'c', text: 'It sets the width to 137% of the parent element\'s width, since square brackets always convert the enclosed number into a percentage', isCorrect: false },
      { id: 'd', text: 'It sets a minimum width of 137px that the element can still grow beyond, identical in effect to writing min-w-[137px] instead', isCorrect: false },
    ],
    explanation: 'Square-bracket syntax is Tailwind\'s escape hatch for one-off values outside the design scale - it compiles directly to that CSS value (width: 137px here), not a percentage and not a min-width. It is valid, generated syntax, not silently ignored.',
    tags: ['tailwind', 'arbitrary-values'],
    concepts: ['web-tailwind-utility'],
  },

  {
    id: 'tw-arbitrary-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TAILWIND,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Fill in the arbitrary-value class that sets top to exactly 117px (no default scale step matches it).',
    template: `<div class="absolute ___">Tooltip</div>`,
    blanks: ['top-[117px]'],
    solution: `<div class="absolute top-[117px]">Tooltip</div>`,
    explanation: 'top-[117px] follows the same pattern as w-[137px]: the utility name, then the exact CSS value in square brackets, for a spot value the default scale doesn\'t cover.',
    hints: ['utility-[value] - no spaces inside the brackets.'],
    tags: ['tailwind', 'arbitrary-values', 'cloze'],
    concepts: ['web-tailwind-utility'],
  },

  {
    id: 'tw-transition-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TAILWIND,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Style a button that smoothly animates its background color over 300ms on hover: base bg-blue-500, hover:bg-blue-700, with a transition on colors and a 300ms duration.',
    starterCode: `<!-- Animated button -->\n<button class="`,
    testCases: [{ input: 'transition button', expectedOutput: 'transition-colors duration-300 hover:bg-blue-700', description: 'Should smoothly animate the hover color change' }],
    solution: `<button class="bg-blue-500 hover:bg-blue-700 transition-colors duration-300">\n  Save\n</button>`,
    explanation: 'transition-colors scopes the animation to color-related properties (background, border, text color) instead of every property. duration-300 sets the animation length to 300ms. Without a transition-* utility, hover state changes snap instantly.',
    hints: ['transition-colors + duration-{ms} + the hover: color change.'],
    tags: ['tailwind', 'transition', 'duration', 'hover'],
    concepts: ['web-tailwind-utility'],
  },

  {
    id: 'tw-apply-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TAILWIND,
    course: Course.WEB_DEV,
    question: 'A teammate wants to define a `.btn` class with @apply bg-blue-500 text-white px-4 py-2 rounded; so every button in the app can just write class="btn" instead of repeating utilities. When is this a good idea, and when does it backfire?',
    options: [
      { id: 'a', text: 'Fine for a small, genuinely-repeated combo shared by many components; overusing @apply to rebuild a full BEM-style class system defeats utility-first CSS and brings back the "what does .btn actually do" lookup problem it was meant to solve', isCorrect: true },
      { id: 'b', text: '@apply should be used for every single class in the project without exception - writing utility classes directly in markup is only a beginner habit that every experienced Tailwind developer eventually grows out of', isCorrect: false },
      { id: 'c', text: '@apply has been fully deprecated and now produces a hard build error in any current version of Tailwind, so it should never be reached for regardless of the situation at hand', isCorrect: false },
      { id: 'd', text: '@apply only ever works when nested inside an @media block, so it is exclusively a tool for writing responsive breakpoint overrides and has no other legitimate use case', isCorrect: false },
    ],
    explanation: '@apply is a pressure-release valve for a handful of small, truly-repeated patterns - not a wholesale replacement for utility classes. Reach for it too often and you rebuild traditional semantic CSS (and its "what does this class do" indirection) inside a framework designed to avoid exactly that. It is not deprecated and is not restricted to @media blocks.',
    tags: ['tailwind', 'apply', 'best-practices'],
    concepts: ['web-tailwind-utility'],
  },

  {
    id: 'tw-theme-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TAILWIND,
    course: Course.WEB_DEV,
    question: 'A project needs a custom brand color, "brand-500", available as bg-brand-500, text-brand-500, etc. across the whole app. What is the correct way to add it?',
    options: [
      { id: 'a', text: 'Extend the design tokens in one place - the theme.extend.colors block in tailwind.config.js (or the @theme directive in a v4 CSS-based config) - so every utility that accepts a color picks up brand-500 automatically', isCorrect: true },
      { id: 'b', text: 'Write out a bg-brand-500 { background-color: #... } rule by hand in a separate, regular stylesheet, since Tailwind utility classes can never be extended with genuinely custom values', isCorrect: false },
      { id: 'c', text: 'Use an arbitrary value everywhere the color is needed, e.g. bg-[#3b82f6], and simply repeat that exact hex code by hand at every single usage site across the codebase', isCorrect: false },
      { id: 'd', text: 'Rename one of the existing default colors, like blue-500, to be the brand color instead, since Tailwind does not support adding brand-new color names to its palette', isCorrect: false },
    ],
    explanation: 'Theme customization is the single source of truth for design tokens - extend it once (config file or @theme in v4) and brand-500 becomes a first-class value for every color-accepting utility (bg-, text-, border-, ring-...). Repeating an arbitrary hex value everywhere or hijacking an existing color name both scatter the same decision across the codebase instead of centralizing it.',
    tags: ['tailwind', 'theme', 'config', 'customization'],
    concepts: ['web-tailwind-utility'],
  },

  {
    id: 'tw-space-divide-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TAILWIND,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Build a vertical settings list: 16px of vertical spacing between each row (without margin on the rows themselves), and a 1px gray divider line between rows (not above the first or below the last).',
    starterCode: `<div class="`,
    testCases: [{ input: 'space-y and divide', expectedOutput: 'space-y-4 divide-y divide-gray-200', description: 'Should space and divide list rows using the space-y/divide-y utilities' }],
    solution: `<div class="space-y-4 divide-y divide-gray-200">\n  <div class="pt-4">Notifications</div>\n  <div class="pt-4">Privacy</div>\n  <div class="pt-4">Billing</div>\n</div>`,
    explanation: 'space-y-{n} adds margin between adjacent children (skipping the first) without you managing margin on each row individually. divide-y + divide-{color} adds a border between children the same way — both utilities work by targeting the "> * + *" sibling selector internally.',
    hints: ['space-y-{n} for gaps between rows; divide-y divide-{color} for the line between them.'],
    tags: ['tailwind', 'space-y', 'divide'],
    concepts: ['web-tailwind-utility'],
  },

  {
    id: 'tw-accessible-btn-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TAILWIND,
    course: Course.WEB_DEV,
    language: CodeLanguage.HTML,
    question: 'Build an accessible button combining what you\'ve learned: bg-blue-500 base, dark:bg-blue-600 in dark mode, a visible 2px blue ring ONLY on keyboard focus (not on mouse click) using focus-visible:ring-2 focus-visible:ring-blue-500, and disabled:opacity-50 disabled:cursor-not-allowed for the disabled state.',
    starterCode: `<button class="`,
    testCases: [{ input: 'accessible button', expectedOutput: 'bg-blue-500 dark:bg-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed', description: 'Should combine dark mode, keyboard-only focus ring, and disabled variants' }],
    solution: `<button class="bg-blue-500 text-white px-4 py-2 rounded dark:bg-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">\n  Save\n</button>`,
    explanation: 'This combines three already-introduced variant primitives on one element: dark: for the color-scheme swap, focus-visible: (keyboard focus only - unlike focus:, it skips the ring on a mouse click) for the accessible ring, and disabled: for the faded, non-interactive state.',
    hints: ['focus-visible: only fires for keyboard focus, unlike plain focus:.', 'Each variant just prefixes its own classes - stack them independently.'],
    tags: ['tailwind', 'accessibility', 'focus-visible', 'dark-mode', 'disabled', 'button'],
    concepts: ['web-tailwind-utility', 'a11y-aria-roles'],
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
    id: 'js-var-destr-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_VARIABLES_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the brackets that destructure an object by key name, and the brackets that destructure an array by position.',
    template: `const person = { name: "Alice", age: 30 };
const ___ name, age ___ = person;

const colors = ["red", "green"];
const ___ first, second ___ = colors;`,
    blanks: ['{', '}', '[', ']'],
    solution: 'const person = { name: "Alice", age: 30 };\nconst { name, age } = person;\n\nconst colors = ["red", "green"];\nconst [first, second] = colors;',
    explanation: 'Object destructuring uses `{ }` and pulls variables out by matching key NAME, in any order. Array destructuring uses `[ ]` and matches by POSITION — the first bracket slot always gets index 0, regardless of variable name.',
    hints: ['One bracket pair matches by name; the other matches by position.'],
    tags: ['destructuring', 'objects', 'arrays', 'es6', 'cloze'],
    concepts: ['js-spread-destructuring'],
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
    id: 'js-var-spread-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_VARIABLES_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the operator that copies an object\'s properties into a new object literal.',
    template: `const defaults = { theme: "dark", lang: "en" };
const merged = { ___defaults, lang: "fr" };
console.log(merged);`,
    blanks: ['...'],
    solution: 'const defaults = { theme: "dark", lang: "en" };\nconst merged = { ...defaults, lang: "fr" };\nconsole.log(merged);',
    explanation: 'The spread operator (...) copies a source object\'s own properties into the new object literal. Properties listed after the spread override matching keys from the source, so lang: "fr" wins over the spread-in "en".',
    hints: ['Three dots before the object being spread.'],
    tags: ['spread', 'merge', 'objects', 'es6', 'cloze'],
    concepts: ['js-spread-destructuring'],
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

  {
    id: 'js-var-loop-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_VARIABLES_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Assemble a for loop that sums every element of the array numbers into total. Order: initialize total, start the loop header, accumulate inside the loop, close the loop.',
    correctOrder: [
      'let total = 0;',
      'for (let i = 0; i < numbers.length; i++) {',
      '  total += numbers[i];',
      '}',
    ],
    distractorLines: [
      'for (let i = 0; i <= numbers.length; i++) {',
      'total = numbers[i];',
    ],
    solution: 'let total = 0;\nfor (let i = 0; i < numbers.length; i++) {\n  total += numbers[i];\n}',
    explanation: 'i < numbers.length stops the loop at the last valid index — using <= would read one element past the end (undefined). total += numbers[i] accumulates; total = numbers[i] would overwrite instead of adding.',
    hints: ['Initialize the accumulator before the loop', '< not <= for the bound check', '+= to accumulate, not ='],
    tags: ['for-loop', 'loops', 'accumulator', 'parsons'],
    concepts: ['js-loops'],
  },

  {
    id: 'js-var-loop-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_VARIABLES_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the while loop\'s condition operator and the increment that advances count.',
    template: `let count = 0;
while (count ___ 3) {
  console.log(count);
  count___;
}`,
    blanks: ['<', '++'],
    solution: 'let count = 0;\nwhile (count < 3) {\n  console.log(count);\n  count++;\n}',
    explanation: 'A while loop re-checks its condition before every iteration and keeps running as long as it is truthy. Without count++ advancing the loop variable, the condition would never become false and the loop would run forever.',
    hints: ['The condition must eventually become false', 'The loop variable needs to change each pass'],
    tags: ['while-loop', 'loops', 'cloze'],
    concepts: ['js-loops'],
  },

  {
    id: 'js-var-loop-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_VARIABLES_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Write a for loop that builds an array called squares containing the square of each number from 1 to 5 (inclusive), using push.',
    starterCode: `const squares = [];\n\n// for loop here\n`,
    testCases: [
      {
        input: '1 to 5',
        expectedOutput: 'for (let i = 1; i <= 5; i++)',
        description: 'Should use a for loop from 1 to 5 inclusive',
      },
    ],
    solution: `const squares = [];\n\nfor (let i = 1; i <= 5; i++) {\n  squares.push(i * i);\n}`,
    explanation: 'A for loop bundles initialization, condition, and increment in one header. i <= 5 keeps the loop inclusive of 5, and push(i * i) appends each squared value. Result: [1, 4, 9, 16, 25].',
    hints: ['for (let i = 1; i <= 5; i++)', 'squares.push(i * i) inside the loop body'],
    tags: ['for-loop', 'loops', 'array'],
    concepts: ['js-loops', 'js-array-methods'],
  },

  {
    id: 'js-var-forof-forin-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_VARIABLES_TYPES,
    course: Course.WEB_DEV,
    question: 'What is the difference between for...of and for...in when iterating over an array?',
    options: [
      { id: 'a', text: 'for...of gives you each VALUE in the array on every iteration; for...in gives you each INDEX as a string key, which is rarely what you actually want when looping over arrays.', isCorrect: true },
      { id: 'b', text: 'for...of only works when iterating over plain objects and their properties, while for...in is reserved exclusively for arrays and other indexed collections.', isCorrect: false },
      { id: 'c', text: 'They are fully interchangeable in every situation and will always produce the exact same iteration output for any array or array-like collection you pass in.', isCorrect: false },
      { id: 'd', text: 'for...in yields each array value directly in iteration order, while for...of yields the string index of each element instead, which is a common mix-up.', isCorrect: false, misconceptionTag: 'js-for-of-in-swapped' },
    ],
    explanation: 'for...of iterates VALUES (works on any iterable: arrays, strings, Maps, Sets). for...in iterates enumerable KEYS, which for an array are its string indices ("0", "1", "2") — almost never what you want for value access.',
    tags: ['for-of', 'for-in', 'iteration', 'arrays'],
    concepts: ['js-for-of-in'],
  },

  {
    id: 'js-var-forof-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_VARIABLES_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the keyword that declares the loop variable and the keyword that iterates values (not keys).',
    template: `const fruits = ["apple", "banana", "cherry"];
for (___ fruit ___ fruits) {
  console.log(fruit);
}`,
    blanks: ['const', 'of'],
    solution: 'const fruits = ["apple", "banana", "cherry"];\nfor (const fruit of fruits) {\n  console.log(fruit);\n}',
    explanation: 'for...of iterates over the VALUES of an iterable. Each pass binds fruit directly to the next array element — no index lookup needed, unlike for...in or a classic for loop.',
    hints: ['const declares a fresh binding each iteration', 'of iterates values; in iterates keys'],
    tags: ['for-of', 'loops', 'cloze'],
    concepts: ['js-for-of-in'],
  },

  {
    id: 'js-var-forin-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_VARIABLES_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'What does this code log?',
    code: `const arr = ["a", "b", "c"];
for (const key in arr) {
  console.log(typeof key);
}`,
    expectedOutput: `string
string
string`,
    explanation: 'for...in enumerates an array\'s index KEYS, and those keys are always strings ("0", "1", "2") even though they look numeric. This is exactly why for...in is discouraged for arrays — use for...of when you want the values.',
    hints: ['for...in gives keys, not values', 'Array keys are string-typed'],
    tags: ['for-in', 'loops', 'predict'],
    concepts: ['js-for-of-in'],
  },

  {
    id: 'js-var-string-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_VARIABLES_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the method that strips outer whitespace, the method that uppercases, and the method that extracts a substring by index range.',
    template: `const raw = "  hello world  ";
const clean = raw.___();
const shout = clean.___();
const firstWord = shout.___(0, 5);`,
    blanks: ['trim', 'toUpperCase', 'slice'],
    solution: 'const raw = "  hello world  ";\nconst clean = raw.trim();\nconst shout = clean.toUpperCase();\nconst firstWord = shout.slice(0, 5);',
    explanation: 'trim() removes leading/trailing whitespace, toUpperCase() returns an uppercased copy, and slice(start, end) extracts a substring — all three return NEW strings, since strings are immutable in JavaScript.',
    hints: ['Strings are immutable — each method returns a new string'],
    tags: ['string-methods', 'trim', 'slice', 'cloze'],
    concepts: ['js-string-methods'],
  },

  {
    id: 'js-var-string-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_VARIABLES_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Write a function normalizeTag(str) that trims whitespace, lowercases the string, then replaces every space with a hyphen. normalizeTag(" Web Dev ") should return "web-dev".',
    starterCode: `function normalizeTag(str) {\n  // trim, lowercase, then replace spaces with hyphens\n}\n`,
    testCases: [
      {
        input: '" Web Dev "',
        expectedOutput: '"web-dev"',
        description: 'Should trim, lowercase, and hyphenate',
      },
    ],
    solution: `function normalizeTag(str) {\n  return str.trim().toLowerCase().split(" ").join("-");\n}`,
    explanation: 'Chaining string methods reads left to right: trim() strips outer whitespace, toLowerCase() normalizes case, then split(" ").join("-") swaps each space for a hyphen. Each call returns a new string, so no intermediate variables are needed.',
    hints: ['str.trim().toLowerCase()...', 'split(" ").join("-") swaps spaces for hyphens without regex'],
    tags: ['string-methods', 'chaining'],
    concepts: ['js-string-methods'],
  },

  {
    id: 'js-var-string-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_VARIABLES_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'What does this code log?',
    code: `const title = "  Hello World  ";
const result = title.trim().split(" ")[1].toUpperCase();
console.log(result);`,
    expectedOutput: 'WORLD',
    explanation: 'trim() strips the outer spaces to "Hello World", split(" ") breaks it into ["Hello", "World"], [1] picks "World", and toUpperCase() returns "WORLD". Each step runs on the return value of the previous one.',
    hints: ['Work through the chain one method at a time'],
    tags: ['string-methods', 'chaining', 'predict'],
    concepts: ['js-string-methods'],
  },

  {
    id: 'js-var-number-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_VARIABLES_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the function that parses a leading integer from a string, and the method that rounds a number to a fixed number of decimals.',
    template: `const raw = "42px";
const width = ___(raw, 10);
const price = 19.999;
const rounded = price.___(2);`,
    blanks: ['parseInt', 'toFixed'],
    solution: 'const raw = "42px";\nconst width = parseInt(raw, 10);\nconst price = 19.999;\nconst rounded = price.toFixed(2);',
    explanation: 'parseInt(str, 10) reads leading digits from a string and stops at the first non-digit, so "42px" becomes 42. toFixed(2) rounds to a fixed number of decimal places and returns a STRING, not a number.',
    hints: ['Always pass 10 as the radix to parseInt', 'toFixed returns a string'],
    tags: ['numbers', 'parseint', 'tofixed', 'cloze'],
    concepts: ['js-numbers'],
  },

  {
    id: 'js-var-number-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_VARIABLES_TYPES,
    course: Course.WEB_DEV,
    question: 'What is the key difference between parseInt("10px") and Number("10px")?',
    options: [
      { id: 'a', text: 'parseInt("10px") reads leading numeric characters and returns 10, stopping at the first non-digit; Number("10px") requires the ENTIRE string to be numeric and returns NaN because "px" makes it invalid.', isCorrect: true },
      { id: 'b', text: 'Both functions return NaN in this case, because "10px" is not considered a purely numeric string under either conversion rule, so neither one succeeds.', isCorrect: false },
      { id: 'c', text: 'Number("10px") returns 10 by silently stripping the trailing letters, while parseInt("10px") returns NaN because it cannot parse a string with mixed content.', isCorrect: false, misconceptionTag: 'js-parseint-number-swapped' },
      { id: 'd', text: 'parseInt and Number are simply two different names for the exact same underlying numeric conversion function, so they always behave identically in practice.', isCorrect: false },
    ],
    explanation: 'parseInt parses as far as it can and returns what it found ("10px" → 10). Number() coerces the WHOLE string and fails to NaN if any part is not numeric. Neither strips trailing letters the way option c describes.',
    tags: ['parseint', 'number', 'coercion'],
    concepts: ['js-numbers'],
  },

  {
    id: 'js-var-ternary-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_VARIABLES_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the two symbols that make up the ternary operator: one separates the condition from the true-branch, the other separates the true-branch from the false-branch.',
    template: `const age = 20;
const status = age >= 18 ___ "adult" ___ "minor";`,
    blanks: ['?', ':'],
    solution: 'const age = 20;\nconst status = age >= 18 ? "adult" : "minor";',
    explanation: 'The ternary operator (condition ? valueIfTrue : valueIfFalse) is a compact if/else expression that evaluates to a value directly, handy for simple conditional assignments without a multi-line if block.',
    hints: ['condition ? whenTrue : whenFalse'],
    tags: ['ternary', 'conditional', 'cloze'],
    concepts: ['js-ternary'],
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
    id: 'js-fn-closure-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_FUNCTIONS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the missing piece so makeAdder returns a function that remembers `base` across calls.',
    template: `function makeAdder(base) {
  return (n) ___ base + n;
}

const addTen = makeAdder(10);
console.log(addTen(5));`,
    blanks: ['=>'],
    solution: 'function makeAdder(base) {\n  return (n) => base + n;\n}\n\nconst addTen = makeAdder(10);\nconsole.log(addTen(5));',
    explanation: 'The returned arrow function "closes over" base — it keeps a reference to makeAdder\'s scope even after makeAdder has finished running. Every call to addTen still sees base = 10, even though makeAdder(10) already returned. This is a closure.',
    hints: ['The inner function is an arrow function.'],
    tags: ['closure', 'functions', 'cloze'],
    concepts: ['js-closures'],
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
    id: 'js-fn-hof-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_FUNCTIONS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in (1) the rest-parameter syntax that collects the wrapper\'s arguments into an array, and (2) the spread syntax that forwards them to fn.',
    template: `function withTiming(fn) {
  return function(___args) {
    const result = fn(___args);
    return result;
  };
}`,
    blanks: ['...', '...'],
    solution: 'function withTiming(fn) {\n  return function(...args) {\n    const result = fn(...args);\n    return result;\n  };\n}',
    explanation: 'withTiming is a higher-order function — it takes a function and returns a new, wrapped function. The wrapper does not know how many arguments fn expects, so `...args` (rest) collects whatever it is called with into an array, and `...args` (spread) unpacks that array back out when forwarding to fn.',
    hints: ['Same three-dot syntax appears in both places, but plays a different role: collecting vs. unpacking.'],
    tags: ['higher-order', 'rest', 'spread', 'functions', 'cloze'],
    concepts: ['js-spread-destructuring'],
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

  {
    id: 'js-fn-default-params-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_FUNCTIONS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the operator that gives "name" a default value when no argument is passed.',
    template: `function greet(name ___ "friend") {
  return \`Hello, \${name}!\`;
}
console.log(greet());
console.log(greet("Alice"));`,
    blanks: ['='],
    solution: 'function greet(name = "friend") {\n  return `Hello, ${name}!`;\n}\nconsole.log(greet());\nconsole.log(greet("Alice"));',
    explanation: 'A default parameter (name = "friend") supplies a fallback value used only when the argument is missing or explicitly undefined. Calling greet() uses "friend"; greet("Alice") overrides it.',
    hints: ['Same symbol used for regular variable assignment.'],
    tags: ['default-parameters', 'functions', 'cloze'],
    concepts: ['js-default-params'],
  },

  {
    id: 'js-fn-default-params-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_FUNCTIONS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'What does this code log?',
    code: `function multiply(a, b = 2) {
  return a * b;
}
console.log(multiply(5));
console.log(multiply(5, 3));
console.log(multiply(5, undefined));`,
    expectedOutput: `10
15
10`,
    explanation: 'Default parameters kick in whenever the argument is missing OR explicitly undefined. multiply(5) and multiply(5, undefined) both fall back to b = 2 (5 * 2 = 10); multiply(5, 3) uses the passed value (5 * 3 = 15).',
    hints: ['undefined triggers the default just like omitting the argument entirely'],
    tags: ['default-parameters', 'predict'],
    concepts: ['js-default-params'],
  },

  {
    id: 'js-fn-decl-expr-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_FUNCTIONS,
    course: Course.WEB_DEV,
    question: 'What is the key difference between a function declaration and a function expression regarding hoisting?',
    options: [
      { id: 'a', text: 'Function declarations (function foo() {}) are fully hoisted, so you can call them before their line in the code; function expressions (const foo = function() {}) are not callable until the assignment line runs, since only the variable declaration hoists, not the function value.', isCorrect: true },
      { id: 'b', text: 'Function expressions are actually the ones that get fully hoisted together with their entire body, while function declarations are never hoisted in any way and always throw a ReferenceError the moment they are called early.', isCorrect: false, misconceptionTag: 'js-hoisting-decl-expr-swapped' },
      { id: 'c', text: 'Both function declarations and function expressions are always fully hoisted together with their entire function body attached, so calling either one before its line in the source code works identically every single time.', isCorrect: false },
      { id: 'd', text: 'Hoisting only ever applies to variables that were declared using var specifically, and it has no relationship whatsoever to functions of either kind, whether declarations or expressions.', isCorrect: false },
    ],
    explanation: 'function foo() {} declarations are hoisted with their full body. const/let foo = function() {} or foo = () => {} only hoist the variable binding (as uninitialized, in the temporal dead zone for let/const) — the function value is not attached until that line executes.',
    tags: ['hoisting', 'function-declaration', 'function-expression'],
    concepts: ['js-var-let-const'],
  },

  {
    id: 'js-fn-decl-expr-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_FUNCTIONS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'What does this code log?',
    code: `console.log(typeof sayHi);
console.log(typeof sayBye);

function sayHi() {
  return "hi";
}
var sayBye = function () {
  return "bye";
};`,
    expectedOutput: `function
undefined`,
    explanation: 'sayHi is a function declaration — fully hoisted, so typeof sayHi is already "function" before its line runs. sayBye is a var assigned a function expression — only the var hoists (initialized to undefined); the assignment has not happened yet at this point.',
    hints: ['Only the declaration form carries its body up with it'],
    tags: ['hoisting', 'function-declaration', 'function-expression', 'predict'],
    concepts: ['js-var-let-const'],
  },

  {
    id: 'js-fn-callback-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_FUNCTIONS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Assemble a function processArray(arr, callback) that calls callback on each element of arr and collects the results into a new array.',
    correctOrder: [
      'function processArray(arr, callback) {',
      '  const results = [];',
      '  for (const item of arr) {',
      '    results.push(callback(item));',
      '  }',
      '  return results;',
      '}',
    ],
    distractorLines: [
      'results.push(callback);',
      'callback(arr);',
    ],
    solution: 'function processArray(arr, callback) {\n  const results = [];\n  for (const item of arr) {\n    results.push(callback(item));\n  }\n  return results;\n}',
    explanation: 'A callback is a function passed as an argument and invoked by the function that received it. callback(item) actually CALLS the function on each element; pushing callback itself (without calling it) would collect the function reference, not a result.',
    hints: ['callback must be invoked with an argument, not just referenced', 'callback(item) runs once per element via the for...of loop'],
    tags: ['callback', 'functions', 'parsons'],
    concepts: ['js-callbacks'],
  },

  {
    id: 'js-fn-callback-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_FUNCTIONS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Write a function repeatAction(times, callback) that calls callback(i) once for each i from 0 up to (but not including) times.',
    starterCode: `function repeatAction(times, callback) {\n\n}\n`,
    testCases: [
      {
        input: '3, i => console.log(i)',
        expectedOutput: '0\n1\n2',
        description: 'Should call the callback once per iteration with the index',
      },
    ],
    solution: `function repeatAction(times, callback) {\n  for (let i = 0; i < times; i++) {\n    callback(i);\n  }\n}`,
    explanation: 'A basic for loop drives the iteration count, and callback(i) hands control to whatever function the caller supplied, passing the current index. The callback decides what actually happens each time.',
    hints: ['for (let i = 0; i < times; i++)', 'callback(i) inside the loop body'],
    tags: ['callback', 'functions'],
    concepts: ['js-callbacks', 'js-loops'],
  },

  {
    id: 'js-fn-recursion-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_FUNCTIONS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Assemble a recursive countdown(n) function that logs n, then recurses toward 0, stopping once n reaches 0.',
    correctOrder: [
      'function countdown(n) {',
      '  if (n <= 0) {',
      '    return;',
      '  }',
      '  console.log(n);',
      '  countdown(n - 1);',
      '}',
    ],
    distractorLines: [
      'countdown(n + 1);',
      'if (n <= 0) return countdown(n);',
    ],
    solution: 'function countdown(n) {\n  if (n <= 0) {\n    return;\n  }\n  console.log(n);\n  countdown(n - 1);\n}',
    explanation: 'Every recursive function needs a base case that stops the recursion (n <= 0 here) and a recursive case that moves toward it (n - 1, not n + 1, which would never terminate).',
    hints: ['The base case must actually be reachable — check the direction of the recursive call'],
    tags: ['recursion', 'base-case', 'parsons'],
    concepts: ['js-recursion'],
  },

  {
    id: 'js-fn-recursion-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_FUNCTIONS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Write a recursive function sumRange(n) that returns the sum of all integers from 1 to n. sumRange(4) should return 10.',
    starterCode: `function sumRange(n) {\n  // base case + recursive case\n}\n`,
    testCases: [
      {
        input: '4',
        expectedOutput: '10',
        description: 'Should recursively sum 1 through n',
      },
    ],
    solution: `function sumRange(n) {\n  if (n <= 1) {\n    return n;\n  }\n  return n + sumRange(n - 1);\n}`,
    explanation: 'The base case (n <= 1) stops the recursion at the smallest valid input. The recursive case adds n to the result of solving the same problem for n - 1, until it unwinds back down to the base case.',
    hints: ['Base case: n <= 1 returns n', 'Recursive case: n + sumRange(n - 1)'],
    tags: ['recursion', 'base-case'],
    concepts: ['js-recursion'],
  },

  {
    id: 'js-fn-callapplybind-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.JS_FUNCTIONS,
    course: Course.WEB_DEV,
    question: 'What is the difference between call(), apply(), and bind() for controlling a function\'s "this"?',
    options: [
      { id: 'a', text: 'call() and apply() both invoke the function immediately with a given "this" — call() takes the remaining arguments individually (comma-separated), apply() takes them as a single array; bind() does NOT invoke the function, it returns a new function permanently bound to that "this" for later use.', isCorrect: true },
      { id: 'b', text: 'call(), apply(), and bind() all invoke the function immediately every time, and the only real difference between the three of them is purely stylistic — simply how you happen to format the arguments in the source code.', isCorrect: false },
      { id: 'c', text: 'bind() is actually the one that invokes the function immediately with the given "this", while call() and apply() are the two that instead return a new function for later use without invoking anything right away.', isCorrect: false, misconceptionTag: 'js-bind-call-apply-swapped' },
      { id: 'd', text: 'call(), apply(), and bind() only ever work on arrow functions specifically, since arrow functions are supposedly the only kind of function in JavaScript that even has a "this" value worth rebinding at all.', isCorrect: false },
    ],
    explanation: 'call(thisArg, a, b) and apply(thisArg, [a, b]) both invoke immediately, differing only in how extra arguments are passed. bind(thisArg) is the odd one out: it does not call the function, it returns a new function with this locked in for whenever it is eventually called.',
    tags: ['call', 'apply', 'bind', 'this'],
    concepts: ['js-this-binding'],
  },

  {
    id: 'js-fn-bind-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.JS_FUNCTIONS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the method that returns a new function with "this" permanently locked to user, fixing a detached method reference.',
    template: `const user = {
  name: "Alice",
  greet() {
    return \`Hi, I'm \${this.name}\`;
  }
};
const detached = user.greet;
const fixed = detached.___(user);
console.log(fixed());`,
    blanks: ['bind'],
    solution: 'const user = {\n  name: "Alice",\n  greet() {\n    return `Hi, I\'m ${this.name}`;\n  }\n};\nconst detached = user.greet;\nconst fixed = detached.bind(user);\nconsole.log(fixed());',
    explanation: 'Assigning user.greet to detached loses its connection to user — calling detached() alone would have this be undefined (or the global object in non-strict mode). detached.bind(user) returns a NEW function with this permanently locked to user, regardless of how it is later called.',
    hints: ['Returns a new function; does not call anything immediately.'],
    tags: ['bind', 'this', 'cloze'],
    concepts: ['js-this-binding'],
  },

  {
    id: 'js-fn-iife-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.JS_FUNCTIONS,
    course: Course.WEB_DEV,
    question: 'What problem does an IIFE (Immediately Invoked Function Expression) solve?',
    options: [
      { id: 'a', text: 'Wrapping code in a function and calling it immediately, (function() { ... })(), creates a private scope — variables declared inside never leak into the surrounding (or global) scope, which was especially important before ES modules and block-scoped let/const existed.', isCorrect: true },
      { id: 'b', text: 'An IIFE permanently prevents the JavaScript engine from ever garbage-collecting any variables that are declared anywhere inside of it, no matter how long the program keeps running afterward.', isCorrect: false },
      { id: 'c', text: 'An IIFE is required syntax for declaring an arrow function, since an arrow function cannot exist anywhere in the language without being wrapped in a set of invoking parentheses.', isCorrect: false },
      { id: 'd', text: 'An IIFE actually makes the function inside it run repeatedly forever, once per animation frame, in a manner quite similar to how requestAnimationFrame or setInterval already behave by default.', isCorrect: false },
    ],
    explanation: 'An IIFE runs once, immediately, and its own function scope keeps internal variables from polluting the surrounding scope. This scoping trick predates ES modules and block-scoped let/const, which now cover most of the same need.',
    tags: ['iife', 'scope', 'module-pattern'],
    concepts: ['js-closures'],
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
    id: 'js-arr-find-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ARRAYS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the array method that returns the first element passing the test (or undefined if none match).',
    template: `const nums = [3, 7, 12, 5, 20];
const firstBig = nums.___((n) => n > 10);
console.log(firstBig);`,
    blanks: ['find'],
    solution: 'const nums = [3, 7, 12, 5, 20];\nconst firstBig = nums.find((n) => n > 10);\nconsole.log(firstBig);',
    explanation: 'find() returns the FIRST element that passes the test, or undefined if none match. Unlike filter(), which returns every match as a new array, find() stops as soon as it hits one.',
    hints: ['Same test-callback shape as filter(), but returns a single element, not an array.'],
    tags: ['find', 'arrays', 'search', 'cloze'],
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

  {
    id: 'js-arr-pushpop-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ARRAYS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the four mutator methods: add to the front, add to the end, remove from the front, remove from the end.',
    template: `const arr = [2, 3];
arr.___(1);
arr.___(4);
arr.___();
arr.___();
console.log(arr);`,
    blanks: ['unshift', 'push', 'shift', 'pop'],
    solution: 'const arr = [2, 3];\narr.unshift(1);\narr.push(4);\narr.shift();\narr.pop();\nconsole.log(arr);',
    explanation: 'push/pop add and remove from the END of an array; unshift/shift add and remove from the FRONT. All four mutate the array in place — push/unshift return the new length, pop/shift return the removed element.',
    hints: ['Two pairs: front-facing and end-facing'],
    tags: ['push', 'pop', 'shift', 'unshift', 'cloze'],
    concepts: ['js-array-methods'],
  },

  {
    id: 'js-arr-pushpop-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ARRAYS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'What does this code log?',
    code: `const arr = [1, 2, 3];
arr.push(4);
arr.unshift(0);
console.log(arr);
console.log(arr.pop());
console.log(arr);`,
    expectedOutput: `[ 0, 1, 2, 3, 4 ]
4
[ 0, 1, 2, 3 ]`,
    acceptableOutputs: [
      '[0, 1, 2, 3, 4]\n4\n[0, 1, 2, 3]',
      '[0,1,2,3,4]\n4\n[0,1,2,3]',
    ],
    explanation: 'push(4) appends to the end: [1, 2, 3, 4]. unshift(0) prepends to the front: [0, 1, 2, 3, 4]. pop() removes and returns the LAST element (4), leaving [0, 1, 2, 3].',
    hints: ['Trace each mutation on arr one line at a time'],
    tags: ['push', 'pop', 'unshift', 'predict'],
    concepts: ['js-array-methods'],
  },

  {
    id: 'js-arr-slice-splice-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ARRAYS,
    course: Course.WEB_DEV,
    question: 'What is the key difference between arr.slice(1, 3) and arr.splice(1, 3)?',
    options: [
      { id: 'a', text: 'slice() returns a new array containing the selected elements and leaves the original array untouched; splice() removes those elements from the original array in place (and can also insert new ones), returning the removed elements.', isCorrect: true },
      { id: 'b', text: 'They are simply two different spellings of the exact same underlying method, and either name can always be used completely interchangeably in any codebase without any behavior change.', isCorrect: false },
      { id: 'c', text: 'slice() actually mutates the original array by permanently removing the selected elements from it, while splice() only ever reads elements out without changing anything at all.', isCorrect: false, misconceptionTag: 'js-slice-splice-swapped' },
      { id: 'd', text: 'splice() can only ever be called on string values, never on genuine arrays, whereas slice() only ever works on array values and can never be called on a string at all.', isCorrect: false },
    ],
    explanation: 'slice(start, end) is non-mutating — it reads out a copy of the selected range. splice(start, deleteCount, ...items) is mutating — it removes (and optionally inserts) elements directly in the original array, returning whatever it removed.',
    tags: ['slice', 'splice', 'arrays'],
    concepts: ['js-array-methods'],
  },

  {
    id: 'js-arr-slice-splice-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ARRAYS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'What does this code log?',
    code: `const arr = [10, 20, 30, 40, 50];
const removed = arr.splice(1, 2);
console.log(arr);
console.log(removed);`,
    expectedOutput: `[ 10, 40, 50 ]
[ 20, 30 ]`,
    acceptableOutputs: [
      '[10, 40, 50]\n[20, 30]',
      '[10,40,50]\n[20,30]',
    ],
    explanation: 'splice(start, deleteCount) mutates the original array, removing deleteCount elements starting at start, and returns the removed elements as a new array. arr becomes [10, 40, 50]; removed captures [20, 30].',
    hints: ['splice mutates arr AND returns what it removed'],
    tags: ['splice', 'arrays', 'predict'],
    concepts: ['js-array-methods'],
  },

  {
    id: 'js-arr-slice-splice-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ARRAYS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Write a function removeAt(arr, index) that removes the element at "index" from arr using splice(), and returns the removed value. removeAt([10, 20, 30], 1) should return 20.',
    starterCode: `function removeAt(arr, index) {\n  // use splice\n}\n`,
    testCases: [
      {
        input: '[10, 20, 30], 1',
        expectedOutput: '20',
        description: 'Should remove and return the element at index',
      },
    ],
    solution: `function removeAt(arr, index) {\n  return arr.splice(index, 1)[0];\n}`,
    explanation: 'splice(index, 1) removes exactly one element starting at index and returns it inside a one-element array, so [0] pulls out the removed value itself.',
    hints: ['arr.splice(index, 1) returns an array of removed elements'],
    tags: ['splice', 'arrays'],
    concepts: ['js-array-methods'],
  },

  {
    id: 'js-arr-includes-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ARRAYS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the method that returns a boolean for presence, and the method that returns a numeric position (or -1).',
    template: `const fruits = ["apple", "banana", "cherry"];
console.log(fruits.___("banana"));
console.log(fruits.___("banana"));`,
    blanks: ['includes', 'indexOf'],
    solution: 'const fruits = ["apple", "banana", "cherry"];\nconsole.log(fruits.includes("banana"));\nconsole.log(fruits.indexOf("banana"));',
    explanation: 'includes() returns a boolean — true if the value exists anywhere in the array. indexOf() returns the numeric position of the first match, or -1 if not found. Prefer includes() when you only care about presence.',
    hints: ['One returns true/false, the other returns a number.'],
    tags: ['includes', 'indexOf', 'cloze'],
    concepts: ['js-array-methods'],
  },

  {
    id: 'js-arr-someevery-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ARRAYS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the method that checks if AT LEAST ONE element passes the test, and the method that checks if ALL elements pass.',
    template: `const ages = [22, 17, 30, 15];
const anyMinor = ages.___((age) => age < 18);
const allAdults = ages.___((age) => age >= 18);
console.log(anyMinor, allAdults);`,
    blanks: ['some', 'every'],
    solution: 'const ages = [22, 17, 30, 15];\nconst anyMinor = ages.some((age) => age < 18);\nconst allAdults = ages.every((age) => age >= 18);\nconsole.log(anyMinor, allAdults);',
    explanation: 'some() returns true if at least one element passes the test. every() returns true only if all elements pass. Both stop early: some() as soon as it finds a match, every() as soon as it finds a failure.',
    hints: ['"any" maps to one method, "all" maps to the other.'],
    tags: ['some', 'every', 'cloze'],
    concepts: ['js-array-methods'],
  },

  {
    id: 'js-arr-someevery-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ARRAYS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'What does this code log?',
    code: `const nums = [2, 4, 6, 7];
console.log(nums.every((n) => n % 2 === 0));
console.log(nums.some((n) => n % 2 !== 0));`,
    expectedOutput: `false
true`,
    explanation: 'every() checks that ALL elements pass — 7 is odd, so it fails and returns false. some() checks if ANY element passes — 7 satisfies "is odd" for at least one element, so it returns true.',
    hints: ['7 is the odd one out in both checks'],
    tags: ['some', 'every', 'predict'],
    concepts: ['js-array-methods'],
  },

  {
    id: 'js-arr-sort-comparator-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_ARRAYS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the operator that makes this comparator sort numbers ascending.',
    template: `const nums = [40, 1, 5, 200];
nums.sort((a, b) => a ___ b);
console.log(nums);`,
    blanks: ['-'],
    solution: 'const nums = [40, 1, 5, 200];\nnums.sort((a, b) => a - b);\nconsole.log(nums);',
    explanation: 'Without a comparator, sort() converts elements to strings and sorts lexicographically ("200" comes before "40"). A comparator (a, b) => a - b sorts numerically ascending: a negative result means a comes first.',
    hints: ['A negative result means a comes first.'],
    tags: ['sort', 'comparator', 'cloze'],
    concepts: ['js-array-methods'],
  },

  {
    id: 'js-arr-sort-comparator-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_ARRAYS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Write a function sortByAge(people) that returns a NEW array of {name, age} objects sorted by age ascending, using sort() with a comparator. Do not mutate the input array.',
    starterCode: `function sortByAge(people) {\n  // sort a copy, ascending by age\n}\n`,
    testCases: [
      {
        input: '[{name:"B",age:30},{name:"A",age:20}]',
        expectedOutput: '[{name:"A",age:20},{name:"B",age:30}]',
        description: 'Should sort a copy ascending by age',
      },
    ],
    solution: `function sortByAge(people) {\n  return [...people].sort((a, b) => a.age - b.age);\n}`,
    explanation: 'sort() mutates in place, so spreading into a new array ([...people]) first protects the caller\'s original array. The comparator (a, b) => a.age - b.age sorts ascending: a negative result puts a before b.',
    hints: ['[...people] copies before sorting', '(a, b) => a.age - b.age for ascending'],
    tags: ['sort', 'comparator', 'immutable'],
    concepts: ['js-array-methods', 'js-object-mutation'],
  },

  {
    id: 'js-arr-flat-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_ARRAYS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the method (used twice) that flattens nested arrays — once with no argument, once flattening every level.',
    template: `const nested = [1, [2, 3], [4, [5, 6]]];
const oneLevel = nested.___();
const fullyFlat = nested.___(Infinity);
console.log(oneLevel, fullyFlat);`,
    blanks: ['flat', 'flat'],
    solution: 'const nested = [1, [2, 3], [4, [5, 6]]];\nconst oneLevel = nested.flat();\nconst fullyFlat = nested.flat(Infinity);\nconsole.log(oneLevel, fullyFlat);',
    explanation: 'flat() with no argument flattens one level deep by default: [1, 2, 3, 4, [5, 6]]. Passing Infinity flattens every level of nesting, no matter how deep: [1, 2, 3, 4, 5, 6].',
    hints: ['Same method both times — only the argument changes.'],
    tags: ['flat', 'nested-arrays', 'cloze'],
    concepts: ['js-array-methods'],
  },

  {
    id: 'js-arr-from-isarray-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_ARRAYS,
    course: Course.WEB_DEV,
    question: 'What do Array.from() and Array.isArray() each do?',
    options: [
      { id: 'a', text: 'Array.from() converts an array-like or iterable value (a NodeList, a string, a Set, arguments) into a real array; Array.isArray() checks whether a given value actually is an array, which is more reliable than typeof (typeof [] === "object", same as a plain object).', isCorrect: true },
      { id: 'b', text: 'Array.from() creates a brand-new empty array of a given specified length filled entirely with undefined values, and Array.isArray() checks whether every single element inside that array is itself also an array.', isCorrect: false },
      { id: 'c', text: 'Array.from() and Array.isArray() are simply two different names for exactly the same underlying operation under the hood, and either one can always be substituted for the other everywhere in any codebase.', isCorrect: false },
      { id: 'd', text: 'Array.isArray() actually converts a given string into an array containing each of its individual characters, while Array.from() is the one that checks whether a value is a string instead of an array.', isCorrect: false, misconceptionTag: 'js-array-from-isarray-swapped' },
    ],
    explanation: 'Array.from() is a conversion utility for array-likes and iterables (NodeList, string, Set, Map, arguments). Array.isArray() is the reliable way to test "is this really an array", since typeof cannot distinguish an array from a plain object.',
    tags: ['array-from', 'is-array', 'conversion'],
    concepts: ['js-array-methods'],
  },

  {
    id: 'js-arr-immutable-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_ARRAYS,
    course: Course.WEB_DEV,
    question: 'Why would you use toSorted() (ES2023) or [...arr].sort() instead of arr.sort() directly, when you want a sorted copy?',
    options: [
      { id: 'a', text: 'arr.sort() mutates the original array in place and returns the same reference; toSorted() (and spreading into a new array before sorting) leaves the original array completely untouched and returns a separate, independently sorted copy.', isCorrect: true },
      { id: 'b', text: 'arr.sort() is actually a purely read-only operation with absolutely no side effects at all, so there is never any practical difference between it and toSorted() in any situation whatsoever.', isCorrect: false, misconceptionTag: 'js-sort-mutation' },
      { id: 'c', text: 'toSorted() actually sorts in descending order by default, while arr.sort() always sorts in ascending order by default instead, so the two methods are not directly comparable at all.', isCorrect: false },
      { id: 'd', text: 'toSorted() can only ever be called on plain string values, never on genuine array data, so it is not actually a valid alternative to calling arr.sort() directly on an array at all.', isCorrect: false },
    ],
    explanation: 'arr.sort() is a mutating method: it reorders arr in place and returns that same reference. toSorted() (and the [...arr].sort() workaround before it existed) produces an independent sorted copy, leaving the caller\'s original array order untouched.',
    tags: ['sort', 'immutable', 'toSorted'],
    concepts: ['js-array-methods', 'js-object-mutation'],
  },

  {
    id: 'js-arr-immutable-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_ARRAYS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Write a function addItemImmutable(arr, item) that returns a NEW array with item appended, without mutating the original arr.',
    starterCode: `function addItemImmutable(arr, item) {\n  // return a new array, do not mutate arr\n}\n`,
    testCases: [
      {
        input: '[1, 2], 3',
        expectedOutput: '[1, 2, 3]',
        description: 'Should return a new array without mutating the original',
      },
    ],
    solution: `function addItemImmutable(arr, item) {\n  return [...arr, item];\n}`,
    explanation: 'Spreading the original array into a new array literal, followed by the new item, builds a fresh array without touching arr — the immutable-update pattern used constantly in React state updates.',
    hints: ['[...arr, item]'],
    tags: ['spread', 'immutable', 'arrays'],
    concepts: ['js-array-methods', 'js-object-mutation'],
  },

  {
    id: 'js-arr-6',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_ARRAYS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Given orders (an array of {item, price, qty} objects, provided below), compute the total cost of only the orders with qty > 1, where cost = price * qty. Chain filter, map, and reduce.',
    starterCode: `const orders = [\n  { item: "book", price: 12, qty: 2 },\n  { item: "pen", price: 3, qty: 5 },\n  { item: "desk", price: 150, qty: 1 },\n];\n\n// your code here\n`,
    testCases: [
      {
        input: 'orders array',
        expectedOutput: '39',
        description: 'Should filter qty > 1, map to cost, then sum',
      },
    ],
    solution: `const orders = [\n  { item: "book", price: 12, qty: 2 },\n  { item: "pen", price: 3, qty: 5 },\n  { item: "desk", price: 150, qty: 1 },\n];\n\nconst total = orders\n  .filter((o) => o.qty > 1)\n  .map((o) => o.price * o.qty)\n  .reduce((sum, cost) => sum + cost, 0);`,
    explanation: 'This combines the already-introduced filter/map/reduce chain (js-arr-5) with object property access: filter keeps orders with qty > 1, map converts each to its line-item cost, and reduce sums those costs into one total (24 + 15 = 39; the desk is excluded since its qty is 1).',
    hints: ['filter(o => o.qty > 1)', 'map(o => o.price * o.qty)', 'reduce((sum, cost) => sum + cost, 0)'],
    tags: ['filter', 'map', 'reduce', 'chaining', 'objects'],
    concepts: ['js-array-methods'],
  },

  // ===== JS_OBJECTS =====
  // Beginner Coding → Intermediate MC → Intermediate Coding → Advanced Coding

  {
    id: 'js-obj-method-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_OBJECTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the keyword used inside an object method to refer to the object it was called on.',
    template: `const car = {
  make: "Toyota",
  getInfo() {
    return ___.make;
  }
};
console.log(car.getInfo());`,
    blanks: ['this'],
    solution: 'const car = {\n  make: "Toyota",\n  getInfo() {\n    return this.make;\n  }\n};\nconsole.log(car.getInfo());',
    explanation: 'Inside a method (name() {} shorthand, or name: function() {}), `this` refers to the object the method was called on — car.getInfo() sets this to car, so this.make reads car.make.',
    hints: ['Same keyword you\'d use in a class method.'],
    tags: ['objects', 'this', 'javascript', 'cloze'],
    concepts: ['js-this-binding'],
  },

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
    id: 'js-obj-nested-destr-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_OBJECTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the nested destructuring pattern that pulls city straight out of address.',
    template: `const user = { name: "Alice", address: { city: "London", zip: "SW1" } };
const { address: { ___ } } = user;
console.log(city);`,
    blanks: ['city'],
    solution: 'const user = { name: "Alice", address: { city: "London", zip: "SW1" } };\nconst { address: { city } } = user;\nconsole.log(city);',
    explanation: '{ address: { city } } follows the object\'s shape: go into address, then pull out city. Note "address" itself is never bound as a variable here — only the innermost names are.',
    hints: ['The outer key names a path to descend into, not a variable to bind.'],
    tags: ['destructuring', 'nested', 'objects', 'javascript', 'cloze'],
    concepts: ['js-spread-destructuring'],
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
    id: 'js-obj-static-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_OBJECTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the Object static methods that return the property names, the property values, and the [key, value] pairs.',
    template: `const scores = { math: 90, science: 85 };
const names = Object.___(scores);
const values = Object.___(scores);
const pairs = Object.___(scores);`,
    blanks: ['keys', 'values', 'entries'],
    solution: 'const scores = { math: 90, science: 85 };\nconst names = Object.keys(scores);\nconst values = Object.values(scores);\nconst pairs = Object.entries(scores);',
    explanation: 'Object.keys() returns an array of property names, Object.values() an array of the corresponding values, and Object.entries() an array of [key, value] pairs — the form you feed to for...of when you need both.',
    hints: ['Three separate static methods, one per piece of the object you want back.'],
    tags: ['Object.keys', 'Object.values', 'Object.entries', 'javascript', 'cloze'],
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
    id: 'js-obj-deepclone-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_OBJECTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the two JSON methods that together deep-clone a plain object.',
    template: `const original = { a: 1, nested: { b: 2 } };
const copy = JSON.___(JSON.___(original));`,
    blanks: ['parse', 'stringify'],
    solution: 'const original = { a: 1, nested: { b: 2 } };\nconst copy = JSON.parse(JSON.stringify(original));',
    explanation: 'JSON.stringify() serializes the object to a string (losing shared references in the process), and JSON.parse() rebuilds a brand-new object tree from that string — every nested object is a fresh copy, not an alias of the original.',
    hints: ['Serialize first (inner call), then rebuild (outer call).'],
    tags: ['deep-clone', 'JSON', 'objects', 'javascript', 'cloze'],
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
    id: 'js-obj-computed-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_OBJECTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the syntax that lets a variable\'s VALUE become the object key, evaluated at runtime.',
    template: `const key = "color";
const value = "blue";
const obj = { ___key___: value };
console.log(obj);`,
    blanks: ['[', ']'],
    solution: 'const key = "color";\nconst value = "blue";\nconst obj = { [key]: value };\nconsole.log(obj);',
    explanation: 'Wrapping an expression in square brackets inside an object literal — a computed property name — evaluates that expression to produce the key. { [key]: value } becomes { color: "blue" }, not { key: "blue" }.',
    hints: ['Same bracket pair used for dynamic property access, but on the left side of a literal.'],
    tags: ['computed-property', 'dynamic-key', 'objects', 'javascript', 'cloze'],
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

  {
    id: 'js-obj-class-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_OBJECTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Assemble a class Person whose constructor stores the name argument on the instance, and whose greet() method returns a greeting string.',
    correctOrder: [
      'class Person {',
      '  constructor(name) {',
      '    this.name = name;',
      '  }',
      '  greet() {',
      '    return `Hi, I\'m ${this.name}`;',
      '  }',
      '}',
    ],
    distractorLines: [
      'function constructor(name) {',
      'this.name: name;',
    ],
    solution: 'class Person {\n  constructor(name) {\n    this.name = name;\n  }\n  greet() {\n    return `Hi, I\'m ${this.name}`;\n  }\n}',
    explanation: 'constructor is a special method inside a class body — not a standalone function — and instance fields are assigned with this.field = value, never with a colon (colons are for object literals, not assignment statements).',
    hints: ['constructor is declared inside the class, not as a top-level function', 'this.name = name uses = to assign, not :'],
    tags: ['classes', 'constructor', 'parsons'],
    concepts: ['js-classes-inheritance'],
  },

  {
    id: 'js-obj-class-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_OBJECTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the keyword that declares a class and the special method name that initializes new instances.',
    template: `___ Person {
  ___(name) {
    this.name = name;
  }
}
const p = new Person("Alice");
console.log(p.name);`,
    blanks: ['class', 'constructor'],
    solution: 'class Person {\n  constructor(name) {\n    this.name = name;\n  }\n}\nconst p = new Person("Alice");\nconsole.log(p.name);',
    explanation: 'class declares a class. constructor is the special method JavaScript calls automatically when you `new` an instance, used to initialize instance fields via this.',
    hints: ['The second blank is the method name that runs on `new`.'],
    tags: ['classes', 'constructor', 'cloze'],
    concepts: ['js-classes-inheritance'],
  },

  {
    id: 'js-obj-class-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_OBJECTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Write a class Counter with a constructor that initializes this.count to 0, and a method increment() that adds 1 to this.count.',
    starterCode: `class Counter {\n  // constructor + increment method\n}\n`,
    testCases: [
      {
        input: 'new Counter()',
        expectedOutput: 'constructor() { this.count = 0; } increment() { this.count++; }',
        description: 'Should initialize count and increment it',
      },
    ],
    solution: `class Counter {\n  constructor() {\n    this.count = 0;\n  }\n\n  increment() {\n    this.count++;\n  }\n}`,
    explanation: 'The constructor runs once when you `new Counter()`, setting up initial instance state. Methods defined in the class body live on the shared prototype but read/mutate instance state through this.',
    hints: ['constructor() { this.count = 0; }', 'increment() { this.count++; }'],
    tags: ['classes', 'constructor', 'methods'],
    concepts: ['js-classes-inheritance'],
  },

  {
    id: 'js-obj-extends-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_OBJECTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the keyword that sets up inheritance between two classes, and the call that runs the parent constructor.',
    template: `class Animal {
  constructor(name) {
    this.name = name;
  }
}
class Dog ___ Animal {
  constructor(name) {
    ___(name);
  }
}`,
    blanks: ['extends', 'super'],
    solution: 'class Animal {\n  constructor(name) {\n    this.name = name;\n  }\n}\nclass Dog extends Animal {\n  constructor(name) {\n    super(name);\n  }\n}',
    explanation: 'extends sets up inheritance so Dog gets Animal\'s prototype methods. super(name) calls the parent constructor, which must run before this can be used inside a subclass constructor.',
    hints: ['extends goes on the class header', 'super(...) calls the parent constructor'],
    tags: ['classes', 'extends', 'super', 'cloze'],
    concepts: ['js-classes-inheritance'],
  },

  {
    id: 'js-obj-extends-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_OBJECTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Given the Animal class below, write a class Dog that extends Animal. Its constructor should take name and breed, call super(name), and store this.breed. Add a speak() method that returns `${this.name} barks`.',
    starterCode: `class Animal {\n  constructor(name) {\n    this.name = name;\n  }\n}\n\n// Dog class here\n`,
    testCases: [
      {
        input: 'new Dog("Rex", "Lab")',
        expectedOutput: 'class Dog extends Animal with super(name) and speak()',
        description: 'Should extend Animal, call super, and add a method',
      },
    ],
    solution: `class Animal {\n  constructor(name) {\n    this.name = name;\n  }\n}\n\nclass Dog extends Animal {\n  constructor(name, breed) {\n    super(name);\n    this.breed = breed;\n  }\n\n  speak() {\n    return \`\${this.name} barks\`;\n  }\n}`,
    explanation: 'This combines two already-introduced primitives: class/constructor and extends/super. super(name) must run first to initialize the inherited name field before Dog can add its own breed field or define new methods.',
    hints: ['super(name) before touching this.breed', 'speak() is a new method Animal never defined'],
    tags: ['classes', 'extends', 'super', 'inheritance'],
    concepts: ['js-classes-inheritance'],
  },

  {
    id: 'js-obj-getset-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_OBJECTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the keyword that turns area() into an accessor property, read like a plain field instead of a called method.',
    template: `class Circle {
  constructor(radius) {
    this.radius = radius;
  }
  ___ area() {
    return Math.PI * this.radius ** 2;
  }
}
const c = new Circle(2);
console.log(c.area);`,
    blanks: ['get'],
    solution: 'class Circle {\n  constructor(radius) {\n    this.radius = radius;\n  }\n  get area() {\n    return Math.PI * this.radius ** 2;\n  }\n}\nconst c = new Circle(2);\nconsole.log(c.area);',
    explanation: 'get defines an accessor property that is read like a plain property (c.area, no parentheses) but computed on every access. Pair it with a matching `set` to intercept assignment.',
    hints: ['Notice c.area is read without calling it as a function.'],
    tags: ['classes', 'getter', 'setter', 'cloze'],
    concepts: ['js-classes-inheritance'],
  },

  {
    id: 'js-obj-static-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_OBJECTS,
    course: Course.WEB_DEV,
    question: 'What does the static keyword mean on a class method?',
    options: [
      { id: 'a', text: 'A static method belongs to the class itself, not to instances — you call it as ClassName.method() and it cannot access instance state via this.someInstanceField, since there is no instance involved.', isCorrect: true },
      { id: 'b', text: 'A static method automatically runs the moment its class is loaded by the JavaScript engine, before any instance of that class has been created anywhere in the program.', isCorrect: false },
      { id: 'c', text: 'A static method behaves exactly like a regular instance method in every respect, except that a subclass extending the class is never allowed to override it.', isCorrect: false },
      { id: 'd', text: 'A static method is a private method that only other methods defined on the very same instance are permitted to call directly, unlike public instance methods.', isCorrect: false },
    ],
    explanation: 'static methods live on the class, not on instances (Math.max is a familiar built-in example). They are useful for factory functions and utilities that do not need `this` to refer to a specific instance.',
    tags: ['classes', 'static', 'methods'],
    concepts: ['js-classes-inheritance'],
  },

  {
    id: 'js-obj-prototype-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.JS_OBJECTS,
    course: Course.WEB_DEV,
    question: 'What is the prototype chain in JavaScript?',
    options: [
      { id: 'a', text: 'Every object has a hidden link to another object, its prototype. When you access a property not found on the object itself, JavaScript walks up this chain of prototypes until it finds the property or reaches null.', isCorrect: true },
      { id: 'b', text: 'A separate copy of every method that gets duplicated onto each individual object instance when it is created, purely for faster direct property access.', isCorrect: false },
      { id: 'c', text: 'A list of every variable name that happened to be in lexical scope at the exact point where the object literal was originally written in the source file.', isCorrect: false },
      { id: 'd', text: 'A build-time-only feature that gets fully compiled away, meaning it has no effect whatsoever on how property lookups actually behave while the code is running.', isCorrect: false },
    ],
    explanation: 'class syntax is sugar over prototypes: methods defined in a class body end up on ClassName.prototype, shared by every instance rather than copied onto each one. extends links the subclass\'s prototype to the parent\'s.',
    tags: ['prototype', 'classes', 'mental-model'],
    concepts: ['js-classes-inheritance'],
  },

  {
    id: 'js-obj-prototype-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.JS_OBJECTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'What does this code log?',
    code: `class Animal {
  speak() {
    return "...";
  }
}
class Dog extends Animal {}

const d = new Dog();
console.log(d instanceof Dog);
console.log(d instanceof Animal);
console.log(typeof d.speak);`,
    expectedOutput: `true
true
function`,
    explanation: 'extends links Dog.prototype to Animal.prototype, so a Dog instance is instanceof both Dog and Animal, and it inherits speak via the prototype chain even though Dog never defines it itself.',
    hints: ['extends wires up the prototype chain, not a copy of the methods'],
    tags: ['prototype', 'instanceof', 'classes', 'predict'],
    concepts: ['js-classes-inheritance'],
  },

  {
    id: 'js-obj-map-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_OBJECTS,
    course: Course.WEB_DEV,
    question: 'When should you prefer a Map over a plain object for storing key-value pairs?',
    options: [
      { id: 'a', text: 'When keys are not simple strings (objects or numbers used as-is), when you need a reliable .size property, or when you need guaranteed insertion-order iteration — a Map handles all three cleanly.', isCorrect: true },
      { id: 'b', text: 'A Map should always be used instead of a plain object, because plain objects are considered a fully deprecated feature of the language going forward.', isCorrect: false },
      { id: 'c', text: 'A plain object already tracks its own size automatically and iterates in guaranteed insertion order, so a Map offers no real advantage in practice.', isCorrect: false, misconceptionTag: 'js-object-size-order' },
      { id: 'd', text: 'A Map can only ever store string values, whereas a plain object can store values of absolutely any type without any restriction at all.', isCorrect: false },
    ],
    explanation: 'Plain objects coerce non-string/symbol keys to strings and have no built-in .size (you would need Object.keys(obj).length). Map keys can be any value and .size is O(1), which matters for frequency counters and caches.',
    tags: ['map', 'objects', 'data-structures'],
    concepts: ['js-map-set'],
  },

  {
    id: 'js-obj-map-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_OBJECTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the constructor that creates an empty map, the method that adds an entry, and the method that reads a value back.',
    template: `const inventory = new ___();
inventory.___("apples", 10);
console.log(inventory.___("apples"));`,
    blanks: ['Map', 'set', 'get'],
    solution: 'const inventory = new Map();\ninventory.set("apples", 10);\nconsole.log(inventory.get("apples"));',
    explanation: 'new Map() creates an empty map. .set(key, value) adds or updates an entry and returns the map itself (chainable). .get(key) reads a value back, returning undefined if the key is absent.',
    hints: ['Map is a class, so it needs new'],
    tags: ['map', 'cloze'],
    concepts: ['js-map-set'],
  },

  {
    id: 'js-obj-map-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_OBJECTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Write a function countWords(words) that takes an array of strings and returns a Map where each key is a word and each value is how many times it appears. countWords(["a","b","a"]) should produce a Map with a → 2 and b → 1.',
    starterCode: `function countWords(words) {\n  // build and return a Map\n}\n`,
    testCases: [
      {
        input: '["a","b","a"]',
        expectedOutput: 'Map { a → 2, b → 1 }',
        description: 'Should count occurrences using a Map',
      },
    ],
    solution: `function countWords(words) {\n  const counts = new Map();\n  for (const word of words) {\n    counts.set(word, (counts.get(word) || 0) + 1);\n  }\n  return counts;\n}`,
    explanation: 'This combines two already-introduced primitives: the for...of loop and Map.set/get. counts.get(word) || 0 defaults a missing key to 0 before incrementing, then set() stores the updated count back.',
    hints: ['for (const word of words)', 'counts.get(word) || 0 handles the first-seen case'],
    tags: ['map', 'for-of', 'counting'],
    concepts: ['js-map-set', 'js-loops'],
  },

  {
    id: 'js-obj-set-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_OBJECTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the constructor that stores only unique values from the array.',
    template: `const nums = [1, 2, 2, 3, 3, 3];
const unique = [...new ___(nums)];
console.log(unique);`,
    blanks: ['Set'],
    solution: 'const nums = [1, 2, 2, 3, 3, 3];\nconst unique = [...new Set(nums)];\nconsole.log(unique);',
    explanation: 'A Set stores only unique values — constructing one from an array automatically drops duplicates. Spreading it back into [...] converts it to a plain array again.',
    hints: ['A data structure whose whole point is uniqueness.'],
    tags: ['set', 'dedupe', 'cloze'],
    concepts: ['js-map-set'],
  },

  {
    id: 'js-obj-set-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_OBJECTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Write a function uniqueValues(arr) that returns a new array with duplicate values removed, using a Set.',
    starterCode: `function uniqueValues(arr) {\n  // use a Set to dedupe\n}\n`,
    testCases: [
      {
        input: '[1, 2, 2, 3]',
        expectedOutput: '[1, 2, 3]',
        description: 'Should remove duplicates using a Set',
      },
    ],
    solution: `function uniqueValues(arr) {\n  return [...new Set(arr)];\n}`,
    explanation: 'new Set(arr) builds a set containing each distinct value from arr exactly once. Spreading it with [...] converts back to an array, preserving first-seen order.',
    hints: ['new Set(arr) then spread it back into an array'],
    tags: ['set', 'dedupe'],
    concepts: ['js-map-set'],
  },

  {
    id: 'js-obj-freeze-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.JS_OBJECTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'What does this code log?',
    code: `const config = Object.freeze({ theme: "dark" });
config.theme = "light";
console.log(config.theme);`,
    expectedOutput: 'dark',
    explanation: 'Object.freeze() makes an object\'s existing properties immutable. In non-strict script code like this, an assignment to a frozen property is silently ignored rather than throwing, so config.theme is still "dark".',
    hints: ['freeze does not throw here — it just silently no-ops the assignment'],
    tags: ['object-freeze', 'immutability', 'predict'],
    concepts: ['js-object-mutation'],
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
    id: 'js-async-new-promise-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ASYNC,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Assemble a function wait(ms) that returns a new Promise resolving to "done" after ms milliseconds, using setTimeout.',
    correctOrder: [
      'function wait(ms) {',
      '  return new Promise((resolve, reject) => {',
      '    setTimeout(() => resolve("done"), ms);',
      '  });',
      '}',
    ],
    distractorLines: [
      'return new Promise(resolve, reject) => {',
      'resolve("done");',
    ],
    solution: 'function wait(ms) {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => resolve("done"), ms);\n  });\n}',
    explanation: 'new Promise takes a single executor function, (resolve, reject) => {...} — not resolve, reject) => {} as two separate arguments. Calling resolve("done") directly, without wrapping it in setTimeout, would settle the promise immediately instead of after the delay.',
    hints: ['The executor is one arrow function taking two parameters', 'resolve() needs to happen inside setTimeout\'s callback'],
    tags: ['promise', 'new-promise', 'parsons'],
    concepts: ['js-promises-async'],
  },

  {
    id: 'js-async-new-promise-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ASYNC,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the constructor used to build a Promise from scratch.',
    template: `function delay(ms) {
  return new ___((resolve, reject) => {
    setTimeout(() => resolve("done"), ms);
  });
}`,
    blanks: ['Promise'],
    solution: 'function delay(ms) {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => resolve("done"), ms);\n  });\n}',
    explanation: 'new Promise(executor) constructs a promise from scratch. The executor function runs immediately and receives resolve/reject callbacks used to control how the promise eventually settles.',
    hints: ['The class you `new` to build a promise manually.'],
    tags: ['promise', 'new-promise', 'cloze'],
    concepts: ['js-promises-async'],
  },

  {
    id: 'js-async-then-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ASYNC,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the method that attaches a success handler (used twice) and the method that attaches an error handler.',
    template: `fetch(url)
  .___(response => response.json())
  .___(data => console.log(data))
  .___(error => console.error(error));`,
    blanks: ['then', 'then', 'catch'],
    solution: 'fetch(url)\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error(error));',
    explanation: '.then() attaches a success handler and returns a new Promise, so chaining multiple .then() calls processes a result step by step. .catch() attaches an error handler that fires if any earlier step in the chain rejects.',
    hints: ['Two success steps in a row, then one error handler at the end.'],
    tags: ['promise', 'then-catch', 'chaining', 'cloze'],
    concepts: ['js-promises-async'],
  },

  {
    id: 'js-async-then-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ASYNC,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'What does this code log?',
    code: `Promise.resolve(1)
  .then(n => n + 1)
  .then(n => n * 2)
  .then(n => console.log(n));`,
    expectedOutput: '4',
    explanation: 'Each .then() receives the return value of the previous one: 1 becomes 2 (n + 1), then 2 becomes 4 (n * 2). The chain passes values forward exactly like a pipeline.',
    hints: ['Trace the value through each .then() in order'],
    tags: ['promise', 'then-catch', 'chaining', 'predict'],
    concepts: ['js-promises-async'],
  },

  // Note: js-basics-parsons-10 (jsBasicsParsonsQuestions.ts) and js-basics-cloze-9
  // (jsBasicsClozeQuestions.ts) already fade in the fetch/await/response.json() primitive
  // for this topic — only try/catch needed its own faded rung before js-async-2.

  {
    id: 'js-async-try-catch-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ASYNC,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the two keywords that wrap risky async code and catch any error it throws.',
    template: `async function getUser() {
  ___ {
    const response = await fetch("https://api.example.com/user");
    return await response.json();
  } ___ (error) {
    console.error(error);
  }
}`,
    blanks: ['try', 'catch'],
    solution: `async function getUser() {\n  try {\n    const response = await fetch("https://api.example.com/user");\n    return await response.json();\n  } catch (error) {\n    console.error(error);\n  }\n}`,
    explanation: 'try/catch works the same around await as around synchronous code: if the awaited Promise rejects (network failure, thrown error), control jumps straight to the catch block instead of crashing the function.',
    hints: ['The block that wraps code which might throw', 'The block that handles the error'],
    tags: ['async', 'try-catch', 'error-handling', 'cloze'],
    concepts: ['js-promises-async', 'js-error-handling'],
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
    id: 'js-async-promise-all-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_ASYNC,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the Promise static method that waits for every Promise in the array to resolve before continuing.',
    template: `const urls = [url1, url2, url3];
const responses = await Promise.___(urls.map(u => fetch(u)));`,
    blanks: ['all'],
    solution: 'const urls = [url1, url2, url3];\nconst responses = await Promise.all(urls.map(u => fetch(u)));',
    explanation: 'Promise.all() takes an array of Promises and returns a single Promise that resolves once every one of them has resolved, running the underlying fetches concurrently rather than one after another.',
    hints: ['The method name describes waiting for ALL of them.'],
    tags: ['promise-all', 'concurrent', 'cloze'],
    concepts: ['js-promises-async'],
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

  {
    id: 'js-async-eventloop-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_ASYNC,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'What does this code log?',
    code: `console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4);`,
    expectedOutput: `1
4
3
2`,
    explanation: 'Synchronous code (1, 4) always runs first. Then the microtask queue (Promise .then callbacks) drains completely before the event loop moves on to the next macrotask (setTimeout), so 3 logs before 2 even though setTimeout was scheduled first.',
    hints: ['Sync code always wins, then microtasks, then macrotasks'],
    tags: ['event-loop', 'microtask', 'macrotask', 'predict'],
    concepts: ['js-event-loop'],
  },

  {
    id: 'js-async-eventloop-predict-2',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_ASYNC,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'What does this code log?',
    code: `console.log("start");
setTimeout(() => console.log("timeout"), 0);
Promise.resolve()
  .then(() => console.log("promise 1"))
  .then(() => console.log("promise 2"));
console.log("end");`,
    expectedOutput: `start
end
promise 1
promise 2
timeout`,
    explanation: 'All synchronous logs (start, end) run first. Both chained .then() callbacks are microtasks and fully drain before the event loop touches the setTimeout macrotask, so both promise logs beat the timeout even though it was scheduled with a 0ms delay.',
    hints: ['Chained .then() callbacks are still microtasks, run one after another'],
    tags: ['event-loop', 'microtask', 'macrotask', 'predict'],
    concepts: ['js-event-loop'],
  },

  {
    id: 'js-async-eventloop-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_ASYNC,
    course: Course.WEB_DEV,
    question: 'Why does a Promise .then() callback run before a setTimeout(fn, 0) callback, even though both were scheduled during the same synchronous block?',
    options: [
      { id: 'a', text: 'Promise callbacks are queued as microtasks, and the event loop fully drains the microtask queue after each synchronous block completes, before it processes the next macrotask (which is what setTimeout schedules) — regardless of the requested delay.', isCorrect: true },
      { id: 'b', text: 'setTimeout(fn, 0) is simply broken in most JavaScript environments, silently rounding the requested delay up to a much larger minimum value before the callback ever actually runs at all.', isCorrect: false },
      { id: 'c', text: 'Promise callbacks always execute completely synchronously the instant they are created, so there is never any queuing, delay, or interaction with the event loop involved whatsoever.', isCorrect: false },
      { id: 'd', text: 'The relative order between these two callbacks is not actually guaranteed anywhere in the language specification — it is essentially random and can differ unpredictably between separate runs of the same code.', isCorrect: false },
    ],
    explanation: 'The event loop always empties the microtask queue (Promises, queueMicrotask) completely between macrotasks (setTimeout, setInterval, I/O). This ordering is guaranteed by the spec, not a browser quirk or coincidence.',
    tags: ['event-loop', 'microtask', 'macrotask', 'mental-model'],
    concepts: ['js-event-loop'],
  },

  {
    id: 'js-async-sequential-concurrent-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_ASYNC,
    course: Course.WEB_DEV,
    question: 'What is the practical difference between three sequential "await fetch(...)" calls in a row versus wrapping the same three fetches in Promise.all()?',
    options: [
      { id: 'a', text: 'Sequential awaits wait for each request to fully finish before starting the next, so total time is roughly the sum of all three; Promise.all starts all three requests immediately and waits only as long as the slowest one, so total time is roughly the max.', isCorrect: true },
      { id: 'b', text: 'There is no real difference in total running time between the two approaches — both patterns always finish in exactly the same amount of time regardless of network conditions.', isCorrect: false },
      { id: 'c', text: 'Promise.all can only ever be used with exactly two Promises passed in at once, so any third independent request always has to be awaited separately in a sequential follow-up step.', isCorrect: false },
      { id: 'd', text: 'Sequential awaits actually run all three requests fully concurrently in the background already, while Promise.all is the one that forces them to run one at a time in strict sequence instead.', isCorrect: false, misconceptionTag: 'js-sequential-concurrent-swapped' },
    ],
    explanation: 'await pauses the async function at each line, so sequential awaits are additive in time. Promise.all starts every Promise-producing call before awaiting any of them, so the requests run in parallel and total time is bounded by the slowest one.',
    tags: ['sequential', 'concurrent', 'promise-all', 'performance'],
    concepts: ['js-promises-async'],
  },

  {
    id: 'js-async-sequential-concurrent-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_ASYNC,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Write an async function fetchAllConcurrent(urlA, urlB, urlC) that fetches all three URLs at the same time using Promise.all, parses each response as JSON, and returns the results as [a, b, c].',
    starterCode: `async function fetchAllConcurrent(urlA, urlB, urlC) {\n  // Promise.all here\n}\n`,
    testCases: [
      {
        input: 'urlA, urlB, urlC',
        expectedOutput: 'Promise.all([fetch(urlA).then(...), fetch(urlB).then(...), fetch(urlC).then(...)])',
        description: 'Should run all three fetches concurrently',
      },
    ],
    solution: `async function fetchAllConcurrent(urlA, urlB, urlC) {\n  const [a, b, c] = await Promise.all([\n    fetch(urlA).then(r => r.json()),\n    fetch(urlB).then(r => r.json()),\n    fetch(urlC).then(r => r.json()),\n  ]);\n  return [a, b, c];\n}`,
    explanation: 'This combines two already-introduced primitives: .then() chaining and Promise.all(). Wrapping all three fetch-and-parse chains in one Promise.all starts every request immediately, instead of the sum-of-all-three time you would get from three separate sequential awaits.',
    hints: ['Promise.all takes an array of the three .then() chains', 'Array destructuring unpacks the resolved results in order'],
    tags: ['sequential', 'concurrent', 'promise-all'],
    concepts: ['js-promises-async'],
  },

  {
    id: 'js-async-resok-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_ASYNC,
    course: Course.WEB_DEV,
    question: 'Why does response.ok need to be checked explicitly inside a try/catch when using fetch()?',
    options: [
      { id: 'a', text: 'fetch() only rejects (triggering the catch block) on network-level failures like a dropped connection; a 404 or 500 HTTP response is still a "successful" fetch, so you must check response.ok yourself and throw manually if you want error status codes treated as errors.', isCorrect: true },
      { id: 'b', text: 'fetch() automatically throws an exception and immediately jumps to the catch block whenever the server responds with any status code falling outside the 200-299 success range, with no manual checking required at all.', isCorrect: false, misconceptionTag: 'js-fetch-throws-on-http-error' },
      { id: 'c', text: 'response.ok only ever existed as a feature in a handful of very old, now fully unsupported browser versions, and every modern browser has already removed it in favor of raw response.status comparisons instead.', isCorrect: false },
      { id: 'd', text: 'Checking response.ok is purely a stylistic convention with absolutely no functional effect on runtime behavior — fetch() inside a try/catch block behaves completely identically whether or not it is ever checked.', isCorrect: false },
    ],
    explanation: 'fetch() resolves (not rejects) for any response the server actually sends back, including 404s and 500s. response.ok is the standard way to route HTTP error statuses into your own error handling, since fetch will not do it for you.',
    tags: ['fetch', 'response-ok', 'error-handling'],
    concepts: ['js-promises-async'],
  },

  {
    id: 'js-async-resok-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_ASYNC,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the Response property that is true only for 2xx status codes.',
    template: `const response = await fetch(url);
if (!response.___) {
  throw new Error("HTTP error: " + response.status);
}`,
    blanks: ['ok'],
    solution: 'const response = await fetch(url);\nif (!response.ok) {\n  throw new Error("HTTP error: " + response.status);\n}',
    explanation: 'response.ok is true only for 2xx status codes. fetch() itself does not reject on 404/500, so checking response.ok (and throwing manually) is the standard way to route HTTP error statuses into your catch block.',
    hints: ['A boolean property, not a method call.'],
    tags: ['fetch', 'response-ok', 'cloze'],
    concepts: ['js-promises-async'],
  },

  {
    id: 'js-async-finally-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_ASYNC,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the method that runs after the chain settles, whether it resolved or rejected.',
    template: `fetch(url)
  .then(response => response.json())
  .catch(error => console.error(error))
  .___(() => hideSpinner());`,
    blanks: ['finally'],
    solution: 'fetch(url)\n  .then(response => response.json())\n  .catch(error => console.error(error))\n  .finally(() => hideSpinner());',
    explanation: '.finally() runs after the chain settles, whether it resolved or rejected — ideal for cleanup like hiding a loading spinner, since its callback receives neither the resolved value nor the error.',
    hints: ['Runs no matter which branch (then or catch) fired.'],
    tags: ['promise', 'finally', 'cleanup', 'cloze'],
    concepts: ['js-promises-async'],
  },

  {
    id: 'js-async-allsettled-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.JS_ASYNC,
    course: Course.WEB_DEV,
    question: 'What is the difference between Promise.all, Promise.allSettled, and Promise.race?',
    options: [
      { id: 'a', text: 'Promise.all rejects immediately if any input Promise rejects; Promise.allSettled always waits for every Promise and reports each one\'s status (fulfilled or rejected) without short-circuiting; Promise.race settles as soon as the FIRST input Promise settles, whether it resolves or rejects.', isCorrect: true },
      { id: 'b', text: 'All three of these methods behave completely identically in every situation you could construct — they only differ in which particular array shape the final resolved value happens to end up in, never in when they settle.', isCorrect: false },
      { id: 'c', text: 'Promise.all waits patiently for the single slowest Promise while quietly ignoring any of the others that happen to reject along the way, Promise.allSettled behaves in every respect exactly like Promise.race, and Promise.race actually waits for every single Promise in the batch to finish before it ever settles.', isCorrect: false },
      { id: 'd', text: 'Promise.race can only ever be used with exactly two Promises passed in as separate positional arguments, unlike the other two methods, both of which freely accept an array containing any number of Promises.', isCorrect: false },
    ],
    explanation: 'Use Promise.all when every result is required and any failure should abort. Use Promise.allSettled when you want every outcome regardless of failures (e.g. batch operations where partial success is fine). Use Promise.race for timeouts or "first response wins" patterns.',
    tags: ['promise-all', 'allSettled', 'race', 'mental-model'],
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
    id: 'js-es6-optchain-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ES6_PLUS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the operator that safely reads a nested property, short-circuiting to undefined instead of throwing if an earlier part is null/undefined.',
    template: `const user = { name: "Alice", address: null };
console.log(user___address___city);`,
    blanks: ['?.', '?.'],
    solution: 'const user = { name: "Alice", address: null };\nconsole.log(user?.address?.city);',
    explanation: '?. (optional chaining) checks the value to its left before continuing — if it is null or undefined, the whole expression short-circuits to undefined instead of throwing "Cannot read property of null". Regular dot access (.) always throws on a null/undefined base.',
    hints: ['Question mark before each dot you want to make "safe".'],
    tags: ['optional-chaining', 'es2020', 'cloze'],
    concepts: ['js-equality-coercion'],
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

  {
    id: 'js-es6-modules-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ES6_PLUS,
    course: Course.WEB_DEV,
    question: 'What is the difference between a named export and a default export in an ES module?',
    options: [
      { id: 'a', text: 'A module can have many named exports, each imported with the exact same name (or renamed with `as`) using curly braces; a module can have at most ONE default export, imported into any local name of the importer\'s choosing without curly braces.', isCorrect: true },
      { id: 'b', text: 'Named exports can only ever be used to export standalone functions, while default exports can only be used to export objects or classes, never primitive values or plain functions.', isCorrect: false },
      { id: 'c', text: 'There is no real difference between the two at all — both syntaxes are simply two interchangeable ways of writing the exact same underlying export mechanism under the hood.', isCorrect: false },
      { id: 'd', text: 'A file can technically have as many default exports as it likes, but only ever a single named export per module — which is the exact opposite of how the feature actually works.', isCorrect: false, misconceptionTag: 'js-modules-swapped' },
    ],
    explanation: 'Named exports (export const/function x) are imported with import { x } from "..." and the name must match (or be renamed with `as`). Default exports (export default x) are imported with any local name, no braces: import whatever from "...".',
    tags: ['modules', 'import', 'export'],
    concepts: ['js-modules'],
  },

  {
    id: 'js-es6-modules-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ES6_PLUS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the keyword that makes a declaration available to other files, and the keyword that pulls a named export back in.',
    template: `// mathUtils.js
___ function add(a, b) {
  return a + b;
}

// app.js
___ { add } from "./mathUtils.js";`,
    blanks: ['export', 'import'],
    solution: '// mathUtils.js\nexport function add(a, b) {\n  return a + b;\n}\n\n// app.js\nimport { add } from "./mathUtils.js";',
    explanation: 'export in front of a declaration makes it available to other files as a named export. import { name } (curly braces) pulls in a named export by its exact exported name.',
    hints: ['One keyword on the exporting side, one on the importing side.'],
    tags: ['modules', 'import', 'export', 'cloze'],
    concepts: ['js-modules'],
  },

  {
    id: 'js-es6-modules-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ES6_PLUS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'In a single file, write a named export function add(a, b) that returns their sum, and a default export function multiply(a, b) that returns their product.',
    starterCode: `// named export add, default export multiply\n`,
    testCases: [
      {
        input: 'add(2, 3), multiply(2, 3)',
        expectedOutput: 'export function add ... export default function multiply ...',
        description: 'Should have one named export and one default export',
      },
    ],
    solution: `export function add(a, b) {\n  return a + b;\n}\n\nexport default function multiply(a, b) {\n  return a * b;\n}`,
    explanation: 'A module can have any number of named exports (export function add...) but only one default export (export default function...). Importers write import { add } from "./file" for the named one and import multiply from "./file" (any local name) for the default.',
    hints: ['export function add(...) {...}', 'export default function multiply(...) {...}'],
    tags: ['modules', 'import', 'export'],
    concepts: ['js-modules'],
  },

  {
    id: 'js-es6-export-patterns-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_ES6_PLUS,
    course: Course.WEB_DEV,
    question: 'What is the purpose of an "index barrel" file (an index.js that re-exports from several other files in a folder)?',
    options: [
      { id: 'a', text: 'It lets consumers import everything from one single entry point path (e.g. "./components") instead of remembering the exact file each individual piece lives in, by collecting and re-exporting them all from one place.', isCorrect: true },
      { id: 'b', text: 'It physically merges every one of the separate source files inside the folder into a single combined file directly on disk, deleting all of the originals afterward to save disk space.', isCorrect: false },
      { id: 'c', text: 'It is a hard requirement of the JavaScript language specification itself — a folder full of modules can never be imported at all unless it happens to contain an index.js file.', isCorrect: false },
      { id: 'd', text: 'It exists purely to make the bundler run faster at build time, and otherwise has absolutely no effect on what an application developer is able to import from that folder.', isCorrect: false },
    ],
    explanation: 'An index barrel just re-exports (export { X } from "./X") from sibling files. It is a convenience for consumers, not a language requirement, and it does not merge or delete any files on disk.',
    tags: ['modules', 'barrel-file', 're-export'],
    concepts: ['js-modules'],
  },

  {
    id: 'js-es6-logical-assign-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_ES6_PLUS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the assignment operator (used twice) that only assigns when the current value is null or undefined.',
    template: `const config = { theme: null, retries: 0 };
config.theme ___= "dark";
config.retries ___= 5;
console.log(config.theme, config.retries);`,
    blanks: ['??', '??'],
    solution: 'const config = { theme: null, retries: 0 };\nconfig.theme ??= "dark";\nconfig.retries ??= 5;\nconsole.log(config.theme, config.retries);',
    explanation: '??= only assigns if the current value is null or undefined. config.theme was null, so it becomes "dark". config.retries was already 0 — a valid, non-nullish value — so ??= leaves it untouched. Output: "dark 0", not "dark 5". (||= would have wrongly overwritten retries, since 0 is falsy.)',
    hints: ['Same operator both times — it only cares about null/undefined, not falsy-in-general'],
    tags: ['logical-assignment', 'nullish', 'cloze'],
    concepts: ['js-equality-coercion'],
  },

  {
    id: 'js-es6-modern-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_ES6_PLUS,
    course: Course.WEB_DEV,
    question: 'What does Array.prototype.at(-1) do that arr[arr.length - 1] also does, but more conveniently?',
    options: [
      { id: 'a', text: 'at(-1) lets you index from the end of an array using a negative number directly, returning the last element without having to compute arr.length - 1 yourself — at(-2) gives the second-to-last, and so on.', isCorrect: true },
      { id: 'b', text: 'at(-1) permanently removes the last element from the array and returns it, mutating the original array in exactly the same destructive way that the pop() method already does.', isCorrect: false, misconceptionTag: 'js-at-vs-pop' },
      { id: 'c', text: 'at(-1) is only ever available on strings, never on arrays at all, so calling arr.at(-1) always throws a TypeError whenever arr happens to be an actual array value.', isCorrect: false },
      { id: 'd', text: 'at(-1) actually returns the very first element of the array rather than the last one, which is the exact opposite of what its name and the negative index would otherwise suggest.', isCorrect: false },
    ],
    explanation: '.at(index) works on both arrays and strings and accepts negative indices to count from the end. It does not mutate anything — it just reads, same as bracket access, but with cleaner negative-index syntax.',
    tags: ['array-at', 'modern-js'],
    concepts: ['js-array-methods'],
  },

  {
    id: 'js-es6-modern-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_ES6_PLUS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the method that returns an element by index, counting from the end when given a negative number.',
    template: `const scores = [10, 20, 30, 40];
const last = scores.___(-1);
console.log(last);`,
    blanks: ['at'],
    solution: 'const scores = [10, 20, 30, 40];\nconst last = scores.at(-1);\nconsole.log(last);',
    explanation: '.at(index) accepts negative indices to count from the end, so scores.at(-1) returns the last element (40) without needing scores[scores.length - 1].',
    hints: ['A single method call, not bracket indexing.'],
    tags: ['array-at', 'cloze'],
    concepts: ['js-array-methods'],
  },

  {
    id: 'js-es6-regex-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ES6_PLUS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the RegExp method that returns true or false for whether a pattern matches anywhere in a string.',
    template: `const pattern = /\\d+/;
console.log(pattern.___("Order #4521"));`,
    blanks: ['test'],
    solution: 'const pattern = /\\d+/;\nconsole.log(pattern.test("Order #4521"));',
    explanation: '.test(str) runs a regex against a string and returns true/false depending on whether it finds a match anywhere in the string. /\\d+/ matches one or more digits, so this returns true.',
    hints: ['Returns a boolean, not the match itself.'],
    tags: ['regex', 'test', 'cloze'],
    concepts: ['js-regex'],
  },

  {
    id: 'js-es6-regex-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ES6_PLUS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Write a function hasDigit(str) that returns true if str contains at least one digit, using a regex.',
    starterCode: `function hasDigit(str) {\n  // use a regex\n}\n`,
    testCases: [
      {
        input: '"abc123"',
        expectedOutput: 'true',
        description: 'Should detect at least one digit',
      },
    ],
    solution: `function hasDigit(str) {\n  return /\\d/.test(str);\n}`,
    explanation: '/\\d/ matches any single digit character. .test() returns true the moment it finds one match anywhere in the string, no manual character-by-character checking needed.',
    hints: ['/\\d/.test(str)'],
    tags: ['regex', 'test'],
    concepts: ['js-regex'],
  },

  {
    id: 'js-es6-regex-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ES6_PLUS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Write a function countVowels(str) that returns how many vowels (a, e, i, o, u, case-insensitive) appear in str, using str.match() with a regex.',
    starterCode: `function countVowels(str) {\n  // use match with a global, case-insensitive regex\n}\n`,
    testCases: [
      {
        input: '"Hello World"',
        expectedOutput: '3',
        description: 'Should count vowels case-insensitively',
      },
    ],
    solution: `function countVowels(str) {\n  const matches = str.match(/[aeiou]/gi);\n  return matches ? matches.length : 0;\n}`,
    explanation: '[aeiou] is a character class matching any one of those letters. The g flag finds every match (not just the first), and i makes it case-insensitive. match() returns null (not an empty array) when nothing matches, so the ternary guards against that before reading .length.',
    hints: ['/[aeiou]/gi', 'match() returns null when there are zero matches'],
    tags: ['regex', 'match', 'character-class'],
    concepts: ['js-regex'],
  },

  {
    id: 'js-es6-regex-groups-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_ES6_PLUS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Write a function toUsDate(isoDate) that converts a "YYYY-MM-DD" string to "MM/DD/YYYY" using a regex with capture groups and replace().',
    starterCode: `function toUsDate(isoDate) {\n  // use replace with capture groups\n}\n`,
    testCases: [
      {
        input: '"2026-07-15"',
        expectedOutput: '"07/15/2026"',
        description: 'Should reorder into MM/DD/YYYY using capture groups',
      },
    ],
    solution: `function toUsDate(isoDate) {\n  return isoDate.replace(/(\\d{4})-(\\d{2})-(\\d{2})/, "$2/$3/$1");\n}`,
    explanation: 'Parentheses in a regex create numbered capture groups. replace() lets you reference them in the replacement string with $1, $2, $3, reordering year/month/day without manually slicing the string apart.',
    hints: ['(\\d{4})-(\\d{2})-(\\d{2})', '$2/$3/$1 reorders the captured groups'],
    tags: ['regex', 'capture-groups', 'replace'],
    concepts: ['js-regex'],
  },

  {
    id: 'js-es6-generators-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.JS_ES6_PLUS,
    course: Course.WEB_DEV,
    question: 'What does a generator function (function*) let you do that a regular function cannot?',
    options: [
      { id: 'a', text: 'A generator can pause its execution at each `yield` and resume later exactly where it left off, producing a sequence of values over time (one per resumption) instead of computing and returning everything at once.', isCorrect: true },
      { id: 'b', text: 'A generator function runs measurably faster than an equivalent regular function for every kind of computation, because the engine always compiles it straight down to native machine code ahead of time.', isCorrect: false },
      { id: 'c', text: 'A generator function can only ever be called a single solitary time during the entire lifetime of a running program, unlike a regular function, which can always be called as many times as needed.', isCorrect: false },
      { id: 'd', text: 'A generator function is simply an older, now fully deprecated way of writing a regular arrow function, kept around in the language purely for backward compatibility reasons.', isCorrect: false },
    ],
    explanation: 'Calling a generator function returns an iterator, not a result. Each .next() call resumes execution until the next yield (or return), which is what makes generators useful for lazy sequences and custom iteration.',
    tags: ['generators', 'iterators', 'breadth'],
    concepts: ['js-generators-iterators'],
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
    id: 'js-dom-create-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_DOM,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the method that creates a new element, the property that sets its text, the API that adds a CSS class, and the method that inserts it as the last child.',
    template: `const li = document.___("li");
li.___ = "New Item";
li.classList.___("highlight");
document.getElementById("list").___(li);`,
    blanks: ['createElement', 'textContent', 'add', 'appendChild'],
    solution: 'const li = document.createElement("li");\nli.textContent = "New Item";\nli.classList.add("highlight");\ndocument.getElementById("list").appendChild(li);',
    explanation: 'createElement() builds a detached element (not yet in the page). textContent sets its text. classList.add() adds a CSS class. appendChild() inserts it as the last child of a parent — nothing shows up until that final step.',
    hints: ['Four separate calls: make it, name it, class it, insert it.'],
    tags: ['dom', 'createElement', 'classList', 'appendChild', 'javascript', 'cloze'],
    concepts: ['js-dom-events'],
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
    id: 'js-dom-toggle-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_DOM,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the classList method that adds the class if missing and removes it if present.',
    template: `const panel = document.getElementById("panel");
panel.classList.___("active");`,
    blanks: ['toggle'],
    solution: 'const panel = document.getElementById("panel");\npanel.classList.toggle("active");',
    explanation: 'classList.toggle("x") flips the class on each call — adds it if the element does not have it, removes it if it does. Compare to classList.add() (always adds) and classList.remove() (always removes), which are not conditional.',
    hints: ['One method name; behaves like a switch.'],
    tags: ['dom', 'toggle', 'classList', 'javascript', 'cloze'],
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
    id: 'js-dom-preventdefault-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_DOM,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the event method that stops a form from reloading the page on submit.',
    template: `form.addEventListener("submit", (e) => {
  e.___();
});`,
    blanks: ['preventDefault'],
    solution: 'form.addEventListener("submit", (e) => {\n  e.preventDefault();\n});',
    explanation: 'Submitting a form triggers the browser\'s default action — a full page reload/navigation. e.preventDefault() cancels that default so your JavaScript handler can take over (e.g. submit via fetch instead).',
    hints: ['Called on the event object, not the form.'],
    tags: ['dom', 'preventDefault', 'events', 'javascript', 'cloze'],
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

  {
    id: 'js-dom-traversal-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_DOM,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the property that gives the direct parent, the method that walks up to the nearest matching ancestor, and the property that lists direct child elements.',
    template: `const item = document.querySelector(".item");
console.log(item.___);
console.log(item.___(".card"));
console.log(item.___.length);`,
    blanks: ['parentElement', 'closest', 'children'],
    solution: 'const item = document.querySelector(".item");\nconsole.log(item.parentElement);\nconsole.log(item.closest(".card"));\nconsole.log(item.children.length);',
    explanation: 'parentElement gives the direct parent. closest(selector) walks UP from the element (including itself) to find the nearest ancestor matching selector, or null if none exists. children gives the direct child ELEMENTS (skipping text nodes), so .length counts them.',
    hints: ['One property, one method call, one property with .length'],
    tags: ['dom', 'traversal', 'cloze'],
    concepts: ['js-dom-events'],
  },

  {
    id: 'js-dom-traversal-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_DOM,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Given a button clicked inside a card (e.g. a <div class="card"> containing a <button>), write a function deleteCard(button) that uses closest() to find the ancestor with class "card" and removes it from the DOM.',
    starterCode: `function deleteCard(button) {\n\n}\n`,
    testCases: [
      {
        input: 'button inside .card',
        expectedOutput: 'button.closest(".card") then .remove()',
        description: 'Should find the ancestor card and remove it',
      },
    ],
    solution: `function deleteCard(button) {\n  const card = button.closest(".card");\n  card.remove();\n}`,
    explanation: 'closest(".card") walks up from the button through its ancestors (including the button itself) until it finds one matching ".card". remove() then deletes that whole element from the DOM.',
    hints: ['button.closest(".card")', 'card.remove()'],
    tags: ['dom', 'traversal', 'closest'],
    concepts: ['js-dom-events'],
  },

  {
    id: 'js-dom-dataset-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_DOM,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the property that exposes an element\'s data-* attributes as camelCase keys. Assume the selected element has a data-id="42" attribute.',
    template: `const item = document.querySelector(".item");
console.log(item.___.id);`,
    blanks: ['dataset'],
    solution: 'const item = document.querySelector(".item");\nconsole.log(item.dataset.id);',
    explanation: 'Every data-* attribute is exposed on element.dataset using camelCase — data-id becomes dataset.id, data-user-name would become dataset.userName. It can both read and write the underlying HTML attribute.',
    hints: ['One property that bundles every data-* attribute together.'],
    tags: ['dom', 'dataset', 'cloze'],
    concepts: ['js-dom-events'],
  },

  {
    id: 'js-dom-bubbling-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_DOM,
    course: Course.WEB_DEV,
    question: 'What does event.stopPropagation() do, and why would you need it during bubbling?',
    options: [
      { id: 'a', text: 'By default, an event fired on an element bubbles up and also triggers any matching listeners on its ancestors; stopPropagation() stops that bubbling (or capturing) from continuing past the current handler, so ancestor listeners for the same event never run.', isCorrect: true },
      { id: 'b', text: 'stopPropagation() permanently disables every single event listener anywhere on the page for the rest of the entire session, not merely the ones attached to ancestor elements.', isCorrect: false },
      { id: 'c', text: 'stopPropagation() is actually the exact same method as preventDefault() just under a different name, and either one can always be substituted for the other with no behavior change at all.', isCorrect: false, misconceptionTag: 'js-stoppropagation-preventdefault-confused' },
      { id: 'd', text: 'stopPropagation() only ever works during the capturing phase of an event, and has absolutely no effect whatsoever on events that are actively bubbling upward through the DOM tree.', isCorrect: false },
    ],
    explanation: 'stopPropagation() and preventDefault() solve different problems: stopPropagation() stops the event from reaching ancestor listeners; preventDefault() stops the browser\'s default action (like a form submit reloading the page). They are often used together but are not interchangeable.',
    tags: ['dom', 'bubbling', 'stopPropagation', 'events'],
    concepts: ['js-dom-events'],
  },

  {
    id: 'js-dom-bubbling-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_DOM,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Given `<div id="outer"><button id="inner">Click</button></div>` and the listeners below, what logs when the user clicks the button?',
    code: `document.getElementById("outer").addEventListener("click", () => {
  console.log("outer");
});
document.getElementById("inner").addEventListener("click", () => {
  console.log("inner");
});`,
    expectedOutput: `inner
outer`,
    explanation: 'Clicking the inner button fires its own listener first, then the click event bubbles up through the DOM tree, triggering the outer div\'s listener next. Bubbling order runs from innermost to outermost.',
    hints: ['Bubbling travels from the clicked element outward'],
    tags: ['dom', 'bubbling', 'predict'],
    concepts: ['js-dom-events'],
  },

  {
    id: 'js-dom-inputchange-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_DOM,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the event name that fires on every keystroke as the user types (rather than only after the field loses focus).',
    template: `const search = document.getElementById("search");
search.addEventListener("___", (e) => {
  console.log(e.target.value);
});`,
    blanks: ['input'],
    solution: 'const search = document.getElementById("search");\nsearch.addEventListener("input", (e) => {\n  console.log(e.target.value);\n});',
    explanation: '"input" fires on every keystroke or value change, giving live updates. "change" only fires once the element loses focus after its value changed. e.target.value reads the current value either way.',
    hints: ['The live, fires-on-every-keystroke event, not the one that waits for blur.'],
    tags: ['dom', 'input-event', 'change-event', 'cloze'],
    concepts: ['js-dom-events'],
  },

  {
    id: 'js-dom-localstorage-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_DOM,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the method that writes a string under a key, the JSON method that serializes an object to a string, and the method that reads a string back by key.',
    template: `const prefs = { theme: "dark" };
localStorage.___("prefs", JSON.stringify(prefs));
const saved = JSON.___(localStorage.___("prefs"));`,
    blanks: ['setItem', 'parse', 'getItem'],
    solution: 'const prefs = { theme: "dark" };\nlocalStorage.setItem("prefs", JSON.stringify(prefs));\nconst saved = JSON.parse(localStorage.getItem("prefs"));',
    explanation: 'localStorage only stores strings, so JSON.stringify() serializes an object before setItem(), and JSON.parse() deserializes it back into an object after getItem() reads the raw string out.',
    hints: ['Write, then read-and-parse in reverse order'],
    tags: ['dom', 'localStorage', 'json', 'cloze'],
    concepts: ['js-dom-events'],
  },

  {
    id: 'js-dom-localstorage-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_DOM,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Write a function saveTheme(theme) that saves a theme string to localStorage under the key "theme", and a function loadTheme() that reads it back, defaulting to "light" if nothing has been saved.',
    starterCode: `function saveTheme(theme) {\n\n}\n\nfunction loadTheme() {\n\n}\n`,
    testCases: [
      {
        input: 'saveTheme("dark"); loadTheme()',
        expectedOutput: '"dark"',
        description: 'Should round-trip through localStorage, defaulting to "light"',
      },
    ],
    solution: `function saveTheme(theme) {\n  localStorage.setItem("theme", theme);\n}\n\nfunction loadTheme() {\n  return localStorage.getItem("theme") || "light";\n}`,
    explanation: 'setItem/getItem read and write raw strings under a key. getItem() returns null if the key was never set, so || "light" supplies a default whenever nothing has been saved yet.',
    hints: ['localStorage.setItem("theme", theme)', 'localStorage.getItem("theme") || "light"'],
    tags: ['dom', 'localStorage'],
    concepts: ['js-dom-events'],
  },

  {
    id: 'js-dom-timers-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_DOM,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fill in the function that stops a repeating timer, given the id that setInterval returned.',
    template: `const id = setInterval(() => console.log("tick"), 1000);

setTimeout(() => ___(id), 5000);`,
    blanks: ['clearInterval'],
    solution: 'const id = setInterval(() => console.log("tick"), 1000);\n\nsetTimeout(() => clearInterval(id), 5000);',
    explanation: 'setInterval returns an id you must save. clearInterval(id) is the only way to stop a repeating timer — letting the reference go out of scope does NOT stop it from firing. clearTimeout(id) is the equivalent for a one-off setTimeout.',
    hints: ['Matches the "Interval" half of the pair, not the "Timeout" half.'],
    tags: ['dom', 'setInterval', 'clearInterval', 'timers', 'cloze'],
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

  {
    id: 'ts-union-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_BASIC_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the union type for an id that can be a string or a number, and the operator used to narrow it inside the function.',
    template: 'function formatId(id: ___): string {\n  if (___ id === "number") {\n    return `#${id}`;\n  }\n  return id;\n}',
    blanks: ['string | number', 'typeof'],
    solution: 'function formatId(id: string | number): string {\n  if (typeof id === "number") {\n    return `#${id}`;\n  }\n  return id;\n}',
    explanation: 'string | number is a union type - id can be either. Before using a value in a way that only one branch of the union supports, TypeScript requires narrowing: a typeof check tells the compiler which branch it is inside that block.',
    hints: ['A | B for a union of two types', 'typeof narrows a union at runtime'],
    tags: ['union', 'narrowing', 'typescript'],
    concepts: ['ts-narrowing'],
  },

  {
    id: 'ts-union-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_BASIC_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Declare a function "double" that takes a value typed string | number. If it is a number, return it doubled (number). If it is a string, return it repeated twice (string).',
    starterCode: `// Union parameter with narrowing\n`,
    testCases: [{ input: 'number or string', expectedOutput: 'function double(value: string | number)', description: 'Should narrow the union before using it' }],
    solution: `function double(value: string | number): string | number {\n  if (typeof value === "number") {\n    return value * 2;\n  }\n  return value + value;\n}`,
    explanation: 'A union parameter (string | number) can only be used in ways valid for both types until narrowed. typeof value === "number" narrows the union inside that branch, so value * 2 is allowed there and value + value (string concatenation) is allowed in the other.',
    hints: ['param: string | number', 'typeof value === "number" narrows the union', 'The return type can also be a union'],
    tags: ['union', 'narrowing', 'typescript'],
    concepts: ['ts-narrowing'],
  },

  {
    id: 'ts-literal-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_BASIC_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the literal-type annotation restricting theme to exactly the two named strings.',
    template: 'function setTheme(theme: ___): void {\n  document.body.dataset.theme = theme;\n}',
    blanks: ['"light" | "dark"'],
    solution: 'function setTheme(theme: "light" | "dark"): void {\n  document.body.dataset.theme = theme;\n}',
    explanation: 'A literal type narrows string down to specific exact values. "light" | "dark" accepts only those two strings - passing "blue" is a compile error, unlike the wider string type which would accept anything.',
    hints: ['A union of the exact string values allowed', 'Quote each literal value'],
    tags: ['literal-types', 'typescript'],
    concepts: ['ts-narrowing'],
  },

  {
    id: 'ts-any-unknown-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_BASIC_TYPES,
    course: Course.WEB_DEV,
    question: 'What is the practical difference between a variable typed `any` and one typed `unknown`?',
    options: [
      { id: 'a', text: '`any` only accepts primitive values (string, number, boolean) coming in, while `unknown` widens that to also accept objects, arrays, and functions without any extra syntax', isCorrect: false },
      { id: 'b', text: 'Both let you assign any value, but `any` also lets you use that value however you like with no further checks, while `unknown` forces you to narrow the type (e.g. with `typeof`) before you can call methods on it or pass it somewhere specific', isCorrect: true },
      { id: 'c', text: '`unknown` is just an alias for `any` kept in the language for backwards compatibility with older codebases; the compiler treats every operation on either type identically today', isCorrect: false },
      { id: 'd', text: '`any` is checked at runtime by the generated JavaScript output, while `unknown` is a compile-time-only annotation that gets stripped out and is never enforced once the code actually runs', isCorrect: false },
    ],
    explanation: '`any` opts a value out of type checking entirely - you can call anything on it and TypeScript will not complain, defeating the point of the type system. `unknown` also accepts any value coming in, but the compiler refuses to let you operate on it until you narrow it (typeof, instanceof, a type guard), which is why `unknown` is the safer choice for values of uncertain shape (e.g. JSON.parse results, catch-block errors).',
    tags: ['any', 'unknown', 'typescript'],
    concepts: ['ts-any-vs-unknown'],
  },

  {
    id: 'ts-any-unknown-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_BASIC_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the type for a value of uncertain shape, and the check needed before calling .toUpperCase() on it.',
    template: 'function printLength(value: ___): void {\n  if (___ value === "string") {\n    console.log(value.toUpperCase());\n  }\n}',
    blanks: ['unknown', 'typeof'],
    solution: 'function printLength(value: unknown): void {\n  if (typeof value === "string") {\n    console.log(value.toUpperCase());\n  }\n}',
    explanation: 'unknown accepts any incoming value but blocks method calls until the type is narrowed. The typeof value === "string" check proves to the compiler that value is a string inside that block, so .toUpperCase() is then allowed.',
    hints: ['The type that forces a check before use', 'The operator used to narrow it'],
    tags: ['unknown', 'narrowing', 'typescript'],
    concepts: ['ts-any-vs-unknown'],
  },

  {
    id: 'ts-inference-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_BASIC_TYPES,
    course: Course.WEB_DEV,
    question: 'You write `let count = 0;` with no type annotation. What does TypeScript do, and when should you add an explicit annotation instead?',
    options: [
      { id: 'a', text: 'TypeScript infers `count: any` because no annotation was written, so an explicit `: number` has to be added on every single variable declaration to get real type checking anywhere in the file', isCorrect: false },
      { id: 'b', text: 'TypeScript leaves count completely untyped until its first reassignment, at which point it permanently locks to whatever type happens to be assigned at that later point in the code', isCorrect: false },
      { id: 'c', text: 'TypeScript infers `count: number` from the initializer, so no annotation is needed here; explicit annotations earn their keep on function parameters and other places with no initializer to infer from', isCorrect: true },
      { id: 'd', text: 'Inference only works for string and boolean initializers; numeric literals like `0` always need an explicit `: number` annotation before TypeScript will type-check them', isCorrect: false },
    ],
    explanation: 'TypeScript performs contextual inference from an initializer - `let count = 0` is already typed as `number`, and repeating `: number` adds nothing. Annotations pay off where there is no initializer to infer from: function parameters, variables declared before assignment, or widening a literal on purpose (e.g. `let count: number = 0` vs a `const` you want typed as a literal).',
    tags: ['inference', 'typescript'],
    concepts: ['ts-any-vs-unknown'],
  },

  {
    id: 'ts-void-never-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TS_BASIC_TYPES,
    course: Course.WEB_DEV,
    question: 'What is the difference between a function typed to return `void` and one typed to return `never`?',
    options: [
      { id: 'a', text: '`void` and `never` are interchangeable synonyms in modern TypeScript; the language keeps both spellings around only so older codebases do not need to migrate their existing annotations', isCorrect: false },
      { id: 'b', text: '`void` means the function is asynchronous and always returns a `Promise`; `never` means the function is synchronous and always returns immediately with no work done', isCorrect: false },
      { id: 'c', text: '`void` is used only for functions declared with zero parameters; `never` is used for any function whose body contains no explicit `return` statement at all', isCorrect: false },
      { id: 'd', text: '`void` means the function returns no meaningful value (it may return `undefined` or nothing at all, like an event handler); `never` means the function never returns normally at all - it always throws or loops forever', isCorrect: true },
    ],
    explanation: 'A `void` function completes normally and its return value is not meant to be used - most functions with side effects (logging, event handlers) are `void`. A `never` function never finishes normally: every path throws an exception or the function loops forever, so the type system knows no value ever comes back - useful for `assertUnreachable`-style helpers.',
    tags: ['void', 'never', 'typescript'],
    concepts: ['ts-void-never'],
  },

  {
    id: 'ts-void-never-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TS_BASIC_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the return type for a logger that returns nothing meaningful, and for a helper that always throws.',
    template: 'function logEvent(name: string): ___ {\n  console.log(name);\n}\n\nfunction fail(message: string): ___ {\n  throw new Error(message);\n}',
    blanks: ['void', 'never'],
    solution: 'function logEvent(name: string): void {\n  console.log(name);\n}\n\nfunction fail(message: string): never {\n  throw new Error(message);\n}',
    explanation: 'logEvent completes normally with no meaningful return value, so it is void. fail never returns at all - every path throws - so it is typed never, signaling to callers (and to exhaustiveness checks) that control flow stops there.',
    hints: ['Return type for "completes, nothing meaningful returned"', 'Return type for "never completes normally"'],
    tags: ['void', 'never', 'typescript'],
    concepts: ['ts-void-never'],
  },

  {
    id: 'ts-tuple-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TS_BASIC_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the tuple type for a function returning a fixed pair: a string value and a function that updates it.',
    template: 'function useToggle(initial: string): ___ {\n  let value = initial;\n  const setValue = (next: string) => { value = next; };\n  return [value, setValue];\n}',
    blanks: ['[string, (next: string) => void]'],
    solution: 'function useToggle(initial: string): [string, (next: string) => void] {\n  let value = initial;\n  const setValue = (next: string) => { value = next; };\n  return [value, setValue];\n}',
    explanation: 'A tuple type fixes both the length and the type at each position: [string, (next: string) => void] means exactly two elements, a string then a setter function - this is the same shape React\'s useState returns, which is why destructuring [value, setValue] works with the right type at each slot instead of a generic array.',
    hints: ['[Type1, Type2] fixes position and length', 'The second element is a function type'],
    tags: ['tuple', 'typescript'],
    concepts: ['ts-structural-typing'],
  },

  {
    id: 'ts-tuple-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TS_BASIC_TYPES,
    course: Course.WEB_DEV,
    question: 'Why does `useState` return a tuple (`[value, setValue]`) instead of a plain array type like `(string | Function)[]`?',
    options: [
      { id: 'a', text: 'Tuples are faster at runtime than arrays because the JavaScript engine allocates them with a fixed-size memory layout instead of a resizable one, so React chose a tuple purely for a performance win', isCorrect: false },
      { id: 'b', text: 'A tuple fixes both the length (exactly two) and the type at each position, so `value` is known to be the state type and `setValue` is known to be the setter function - a plain array type would let either position be either type, losing that precision', isCorrect: true },
      { id: 'c', text: 'Plain arrays cannot be destructured with `[value, setValue] =` syntax at all in TypeScript; only tuple-typed values are permitted to appear on the left side of an array-destructuring assignment', isCorrect: false },
      { id: 'd', text: 'A tuple is required specifically because `useState` returns exactly two values, and TypeScript array types are hard-capped at a maximum of two elements by the language', isCorrect: false },
    ],
    explanation: 'The precision is the entire point - `(string | Function)[]` would type both `value` and `setValue` as "string or Function", so the compiler could not tell which is which after destructuring. The tuple `[string, (next: string) => void]` pins position 0 to the state type and position 1 to the setter, which is why `value` and `setValue` each get their correct, narrow type.',
    tags: ['tuple', 'typescript'],
    concepts: ['ts-structural-typing'],
  },

  {
    id: 'ts-enum-vs-union-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TS_BASIC_TYPES,
    course: Course.WEB_DEV,
    question: 'Why do many modern TypeScript style guides prefer a union of string literals (`type Status = "active" | "paused"`) over a TypeScript `enum` for this kind of fixed set of values?',
    options: [
      { id: 'a', text: 'Unions are the only option that supports more than two possible values; a TypeScript `enum` is limited to exactly two named members and cannot be extended beyond that', isCorrect: false },
      { id: 'b', text: '`enum` was removed from the TypeScript language in recent versions and now throws a syntax error, so a literal union is the only remaining way left to express a fixed set of values', isCorrect: false },
      { id: 'c', text: 'A literal union compiles away completely (it is a compile-time-only construct, like other types), while a numeric `enum` generates real runtime JavaScript objects; the union is also easier to use with plain string values coming from JSON or an API', isCorrect: true },
      { id: 'd', text: 'Unions can be reassigned freely at runtime while `enum` members are frozen constants, so a union is preferred any time the underlying value needs to change after the object is created', isCorrect: false },
    ],
    explanation: 'A union of literals like "active" | "paused" is pure type-level information - it produces zero runtime code, and a plain string like "active" from an API already satisfies it with no conversion. A numeric enum, by contrast, compiles to an actual JavaScript object with a reverse mapping, adding runtime weight and requiring values to go through Status.Active instead of being passed as plain strings.',
    tags: ['enum', 'union', 'typescript'],
    concepts: ['ts-narrowing'],
  },

  {
    id: 'ts-callback-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TS_BASIC_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the type of the "onDone" callback parameter: it takes a number and returns nothing.',
    template: 'function runTask(onDone: ___): void {\n  onDone(42);\n}',
    blanks: ['(result: number) => void'],
    solution: 'function runTask(onDone: (result: number) => void): void {\n  onDone(42);\n}',
    explanation: 'A function-type parameter is written as (params) => ReturnType. onDone takes a number and returns nothing meaningful, so its type is (result: number) => void - matching the shape of the call onDone(42) inside runTask.',
    hints: ['(paramName: Type) => ReturnType', 'The callback takes a number and returns nothing'],
    tags: ['callback', 'function-types', 'typescript'],
    concepts: ['ts-structural-typing'],
  },

  {
    id: 'ts-callback-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TS_BASIC_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Declare a function "processItems" that takes an array of strings and a callback typed (item: string) => void, and calls the callback once per item.',
    starterCode: `// Function taking a typed callback\n`,
    testCases: [{ input: 'items and callback', expectedOutput: 'function processItems(items: string[], callback: (item: string) => void)', description: 'Should type the callback parameter' }],
    solution: `function processItems(items: string[], callback: (item: string) => void): void {\n  for (const item of items) {\n    callback(item);\n  }\n}`,
    explanation: 'A callback parameter is typed as a function signature: (item: string) => void means it accepts one string argument and returns nothing meaningful. This lets TypeScript check that whatever function is passed as callback actually matches - a callback expecting a number, for example, would be rejected.',
    hints: ['callback: (paramName: Type) => ReturnType', 'Iterate items and call callback(item) for each'],
    tags: ['callback', 'function-types', 'typescript'],
    concepts: ['ts-structural-typing'],
  },

  {
    id: 'ts-strictnull-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TS_BASIC_TYPES,
    course: Course.WEB_DEV,
    question: 'With `strictNullChecks` enabled, a variable typed `string` cannot be assigned `null` or `undefined`. How do you type a variable that legitimately might be missing, like a user\'s optional middle name?',
    options: [
      { id: 'a', text: 'Disable `strictNullChecks` for that one file with a `// @ts-nocheck` comment, since the flag is only meant to apply to files that have no optional data anywhere in them', isCorrect: false },
      { id: 'b', text: 'Use `any` instead of `string` for that field, since `any` is the only type in TypeScript that is allowed to also hold `null` or `undefined` values', isCorrect: false },
      { id: 'c', text: 'Wrap the value in an array type (`string[]`) so an empty array can represent the missing case, since TypeScript treats an empty array as equivalent to null once strict mode is turned on', isCorrect: false },
      { id: 'd', text: 'Include it in the type as a union: `string | null` (or `| undefined`), so every place that reads the value is forced by the compiler to handle the missing case before treating it as a string', isCorrect: true },
    ],
    explanation: 'strictNullChecks makes null and undefined explicit rather than silently assignable to every type - the fix is to say so in the type itself, string | null, which forces a check (an if, optional chaining, or a non-null assertion when you are certain) before the value is used as a plain string. Reaching for any or disabling the flag throws away the safety the flag exists to provide.',
    tags: ['strictNullChecks', 'null', 'typescript'],
    concepts: ['ts-null-safety'],
  },

  {
    id: 'ts-strictnull-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TS_BASIC_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the type allowing middleName to be missing, and the operator that safely reads .length without crashing when it is null.',
    template: 'function middleNameLength(middleName: string | ___): number {\n  return middleName___.length ?? 0;\n}',
    blanks: ['null', '?.'],
    solution: 'function middleNameLength(middleName: string | null): number {\n  return middleName?.length ?? 0;\n}',
    explanation: 'string | null states that middleName may legitimately be absent. Reading .length directly would error under strictNullChecks, so optional chaining (?.) short-circuits to undefined when middleName is null, and ?? 0 supplies the fallback.',
    hints: ['The type that represents "might be missing"', 'The operator that short-circuits on null/undefined before .length'],
    tags: ['strictNullChecks', 'optional-chaining', 'typescript'],
    concepts: ['ts-null-safety'],
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

  {
    id: 'ts-iface-vs-type-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_INTERFACES,
    course: Course.WEB_DEV,
    question: 'Both `interface User { id: number }` and `type User = { id: number }` describe the same object shape. What is one thing an `interface` can do that a `type` alias cannot?',
    options: [
      { id: 'a', text: 'An interface can describe a union of several entirely different possible shapes (like `string | number`), while a type alias is restricted to describing exactly one single object shape at a time', isCorrect: false },
      { id: 'b', text: 'An interface can be "reopened" later and merged with a second declaration of the same name (declaration merging), automatically combining both sets of members - a type alias with the same name in the same scope is a duplicate-identifier error instead', isCorrect: true },
      { id: 'c', text: 'An interface is allowed to hold an optional property marked with `?`, while a type alias can only ever declare properties that are permanently required on every instance', isCorrect: false },
      { id: 'd', text: 'An interface is checked by the compiler at compile time, while a type alias is instead only checked later, once the code actually runs in the browser or in Node', isCorrect: false },
    ],
    explanation: 'Declaration merging is the one capability unique to interfaces: writing `interface User { id: number }` twice in the same scope merges both into one interface with all the combined members - useful for extending third-party library types. type aliases cannot do this (a repeated type Name is a compile error). Unions, optional properties, and compile-time checking all work identically for both interface and type.',
    tags: ['interface', 'type-alias', 'typescript'],
    concepts: ['ts-type-vs-interface'],
  },

  {
    id: 'ts-iface-readonly-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_INTERFACES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the modifier that prevents id from ever being reassigned after a Point is created.',
    template: 'interface Point {\n  ___ id: number;\n  x: number;\n  y: number;\n}',
    blanks: ['readonly'],
    solution: 'interface Point {\n  readonly id: number;\n  x: number;\n  y: number;\n}',
    explanation: 'readonly marks a property so it can only be set once, when the object is first created - point.id = 2 afterward is a compile error, while x and y (without the modifier) can still be reassigned freely.',
    hints: ['The modifier goes before the property name'],
    tags: ['interface', 'readonly', 'typescript'],
    concepts: ['ts-type-vs-interface'],
  },

  {
    id: 'ts-iface-index-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TS_INTERFACES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the index signature that lets Scores hold any number of string-keyed number properties.',
    template: 'interface Scores {\n  [___: string]: number;\n}',
    blanks: ['key'],
    solution: 'interface Scores {\n  [key: string]: number;\n}',
    explanation: 'An index signature [key: string]: number says "any property name (a string) maps to a number value" - it lets an object have keys that are not known ahead of time, like scores.alice = 90 or scores.bob = 75, while still enforcing that every value must be a number.',
    hints: ['The name inside the brackets is just a label - any identifier works'],
    tags: ['interface', 'index-signature', 'typescript'],
    concepts: ['ts-type-vs-interface'],
  },

  {
    id: 'ts-iface-index-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TS_INTERFACES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Define an interface "Inventory" with an index signature mapping any string key to a number (item quantity). Write a function "totalItems" that takes an Inventory and returns the sum of all quantities.',
    starterCode: `// Index signature interface\n`,
    testCases: [{ input: 'inventory object', expectedOutput: 'interface Inventory { [key: string]: number }', description: 'Should use an index signature' }],
    solution: `interface Inventory {\n  [key: string]: number;\n}\n\nfunction totalItems(inventory: Inventory): number {\n  return Object.values(inventory).reduce((sum, qty) => sum + qty, 0);\n}`,
    explanation: 'The index signature [key: string]: number allows Inventory to hold any set of string-keyed quantities without listing each item name up front. Object.values(inventory) reads out all the number values regardless of which keys exist, so the sum works for any inventory shape.',
    hints: ['[key: string]: number as the index signature', 'Object.values() reads out all the values regardless of key names'],
    tags: ['interface', 'index-signature', 'typescript'],
    concepts: ['ts-type-vs-interface'],
  },

  {
    id: 'ts-iface-record-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TS_INTERFACES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the utility type that is shorthand for an index signature mapping string keys to number values.',
    template: 'type Scores = ___<string, number>;',
    blanks: ['Record'],
    solution: 'type Scores = Record<string, number>;',
    explanation: 'Record<K, V> is a built-in shorthand for exactly the index-signature pattern [key: K]: V - Record<string, number> means the same thing as { [key: string]: number }, just without writing the index-signature syntax out by hand.',
    hints: ['The utility type used earlier for ApiConfig\'s headers field'],
    tags: ['Record', 'utility-types', 'typescript'],
    concepts: ['ts-utility-types'],
  },

  {
    id: 'ts-iface-methodsig-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TS_INTERFACES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the method-signature form for greet (no colon-arrow needed), matching the property form already used for onSave.',
    template: 'interface Widget {\n  onSave: (data: string) => void;\n  ___: string;\n}',
    blanks: ['greet(name: string)'],
    solution: 'interface Widget {\n  onSave: (data: string) => void;\n  greet(name: string): string;\n}',
    explanation: 'Both forms describe a callable member, but they are written differently: onSave is a PROPERTY whose type happens to be a function ((data: string) => void), while greet(name: string): string is a METHOD SIGNATURE - the parameters and return type follow the name directly, no colon-and-arrow. They behave almost identically for callers; the method form additionally allows a wider (bivariant) parameter check that the property form does not.',
    hints: ['A method signature looks like a function declaration\'s header, not a colon-then-arrow-type'],
    tags: ['interface', 'method-signature', 'typescript'],
    concepts: ['ts-type-vs-interface'],
  },

  {
    id: 'ts-iface-merging-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TS_INTERFACES,
    course: Course.WEB_DEV,
    question: 'A project declares `interface Window { myGlobal: string; }` in one file. Elsewhere in the same project, the built-in `lib.dom.d.ts` also declares `interface Window { ... }` with the browser\'s standard properties. What happens?',
    options: [
      { id: 'a', text: 'The project\'s own declaration silently overrides and completely replaces the built-in one, so all of the browser\'s standard Window properties (like location and document) stop being recognized by the compiler afterward', isCorrect: false },
      { id: 'b', text: 'TypeScript throws a duplicate-identifier compile error, because no interface name is allowed to be declared more than once anywhere in a project, even across separate files', isCorrect: false },
      { id: 'c', text: 'TypeScript merges both declarations into a single Window interface containing all members from both - this is declaration merging, and it is exactly how projects safely add custom properties to well-known global interfaces like Window without editing the library\'s own type definitions', isCorrect: true },
      { id: 'd', text: 'Only the declaration that happens to be imported last in the entry file wins; whichever interface body was not imported last is discarded entirely and its members become permanently inaccessible', isCorrect: false },
    ],
    explanation: 'This is exactly what declaration merging is for: multiple interface declarations sharing a name in the same scope combine into one interface with every member from all of them. It is the standard, supported way to augment global types like Window (e.g. adding window.myGlobal) without touching the library\'s own .d.ts file - a capability unique to interfaces, not available with type aliases.',
    tags: ['interface', 'declaration-merging', 'typescript'],
    concepts: ['ts-type-vs-interface'],
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

  {
    id: 'ts-gen-constraint-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_GENERICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the constraint that limits T to objects with an id (number), so printId can safely read .id.',
    template: 'function printId<T ___ { id: number }>(item: T): void {\n  console.log(item.id);\n}',
    blanks: ['extends'],
    solution: 'function printId<T extends { id: number }>(item: T): void {\n  console.log(item.id);\n}',
    explanation: 'extends constrains a generic to shapes compatible with the given type - T extends { id: number } means T can be anything as long as it has at least an id: number property. Without the constraint, item.id would be a compile error since a bare T has no known properties.',
    hints: ['The keyword that constrains a generic type parameter', 'T must be assignable to { id: number }'],
    tags: ['generics', 'constraint', 'typescript'],
    concepts: ['ts-generics'],
  },

  {
    id: 'ts-gen-constraint-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_GENERICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Write a generic function "describe" constrained to objects with a name (string) property, that returns a string like "Item: Alice".',
    starterCode: `// Constrained generic\n`,
    testCases: [{ input: 'object with name', expectedOutput: 'function describe<T extends { name: string }>(item: T): string', description: 'Should constrain T to objects with a name property' }],
    solution: `function describe<T extends { name: string }>(item: T): string {\n  return \`Item: \${item.name}\`;\n}`,
    explanation: 'T extends { name: string } constrains the generic to any object shape that at least has a name property - describe({ name: "Alice", age: 30 }) is allowed (extra properties are fine), but describe({ age: 30 }) is a compile error since name is missing.',
    hints: ['T extends { name: string } constrains the generic', 'Extra properties beyond the constraint are still allowed'],
    tags: ['generics', 'constraint', 'typescript'],
    concepts: ['ts-generics'],
  },

  {
    id: 'ts-gen-keyof-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TS_GENERICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the operator that turns T\'s property names into a union of literal keys, and the constraint tying K to those keys.',
    template: 'function getProperty<T, K extends ___ T>(obj: T, key: K): T[K] {\n  return obj[key];\n}',
    blanks: ['keyof'],
    solution: 'function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}',
    explanation: 'keyof T produces a union of T\'s property names as string literal types. K extends keyof T constrains key to one of those actual keys, so getProperty(user, "age") is checked against user\'s real property names - passing "nonexistentField" is a compile error, and the return type T[K] is the exact type of that property.',
    hints: ['The operator that turns an object type into a union of its keys', 'K extends keyof T ties the key parameter to T\'s real property names'],
    tags: ['generics', 'keyof', 'typescript'],
    concepts: ['ts-generics'],
  },

  {
    id: 'ts-gen-keyof-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TS_GENERICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Write a generic function "getProperty" that takes an object of type T and a key of type K (constrained to keyof T), and returns the value at that key (type T[K]).',
    starterCode: `// keyof-constrained generic getter\n`,
    testCases: [{ input: 'object and key', expectedOutput: 'function getProperty<T, K extends keyof T>(obj: T, key: K): T[K]', description: 'Should constrain K to keyof T' }],
    solution: `function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}`,
    explanation: 'keyof T is the union of T\'s own property names; constraining K to keyof T means only real keys of the passed-in object are accepted, and the return type T[K] is inferred as the exact type stored at that key - getProperty({ age: 30 }, "age") returns a number, not any.',
    hints: ['keyof T gives the union of T\'s property names', 'K extends keyof T', 'Return type is T[K], the type at that key'],
    tags: ['generics', 'keyof', 'typescript'],
    concepts: ['ts-generics'],
  },

  {
    id: 'ts-gen-interface-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TS_GENERICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the generic parameter on the interface declaration and on its "data" field, for a reusable API response wrapper.',
    template: 'interface ApiResponse___ {\n  data: ___;\n  status: number;\n}',
    blanks: ['<T>', 'T'],
    solution: 'interface ApiResponse<T> {\n  data: T;\n  status: number;\n}',
    explanation: 'A generic interface declares its type parameter the same way a generic function does: <T> after the name. ApiResponse<User> then has data: User, and ApiResponse<User[]> has data: User[] - one interface reused for every endpoint\'s response shape instead of duplicating it per type.',
    hints: ['Declare the type parameter on the interface name', 'The data field is exactly type T'],
    tags: ['generics', 'interface', 'typescript'],
    concepts: ['ts-generics'],
  },

  {
    id: 'ts-gen-vs-union-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TS_GENERICS,
    course: Course.WEB_DEV,
    question: 'You need a function that returns the same type it receives, for any type. Why does a generic (`function identity<T>(value: T): T`) fit better here than a union (`function identity(value: string | number): string | number`)?',
    options: [
      { id: 'a', text: 'Unions are slower at runtime than generics because the compiler inserts a type check on every call to decide which branch of the union applies, while a generic function has zero runtime overhead of any kind since it is erased entirely', isCorrect: false },
      { id: 'b', text: 'The union version would only ever accept strings and numbers, and it would lose the connection between the input and output types - calling it with a string would still let the return type be treated as a number; a generic preserves that exact type both ways for any type, not just the two named in the union', isCorrect: true },
      { id: 'c', text: 'A union type can only ever be written using primitive types like string, number, and boolean; a generic becomes strictly required as soon as an object or array type needs to be involved anywhere in the signature', isCorrect: false },
      { id: 'd', text: 'There is no real difference for a function this simple; both versions produce identical compiled JavaScript output and behave identically under every possible type-checking scenario the compiler considers', isCorrect: false },
    ],
    explanation: 'The union version is both too narrow (only string | number, not any type) and too loose (it does not preserve WHICH branch you passed in - the return type is still the whole union, so identity("hi") could be treated as a number by the compiler). A generic ties the return type to the exact type of the argument for any T, which is precisely what a passthrough function needs.',
    tags: ['generics', 'union', 'mental-model', 'typescript'],
    concepts: ['ts-generics'],
  },

  {
    id: 'ts-gen-default-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TS_GENERICS,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the default type parameter so that Box<T> defaults to string when no type argument is given.',
    template: 'interface Box<T ___ string> {\n  value: T;\n}',
    blanks: ['= string'],
    solution: 'interface Box<T = string> {\n  value: T;\n}',
    explanation: 'T = string gives the generic a default, the same idea as a default function parameter. Box<number> still works and uses number, but a bare Box (no type argument) resolves to Box<string>, so value is typed string instead of an error or unknown.',
    hints: ['= followed by the default type', 'Same idea as a default value for a function parameter, but for a type'],
    tags: ['generics', 'default-type-parameter', 'typescript'],
    concepts: ['ts-generics'],
  },

  {
    id: 'ts-gen-default-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TS_GENERICS,
    course: Course.WEB_DEV,
    question: 'Given `interface Box<T = string> { value: T; }`, what is the type of `value` in a variable declared as `let b: Box;` with no type argument supplied?',
    options: [
      { id: 'a', text: 'A compile error - Box requires a type argument, and the `= string` default only applies inside generic functions, never inside interfaces', isCorrect: false },
      { id: 'b', text: '`value` is typed `unknown`, since TypeScript cannot resolve a concrete type without an explicit type argument being written at the use site', isCorrect: false },
      { id: 'c', text: '`value` is typed `string`, because the default type parameter `= string` is used whenever `Box` is referenced with no type argument supplied', isCorrect: true },
      { id: 'd', text: '`value` is typed `any`, because omitting the type argument always falls back to `any` regardless of whether a default was declared on the interface', isCorrect: false },
    ],
    explanation: 'A default type parameter behaves exactly like a default function parameter: it fills in only when the caller omits the argument. Box with no `<...>` resolves T to string, so value: T becomes value: string - Box<number> still overrides it to number when a type argument is explicitly given.',
    tags: ['generics', 'default-type-parameter', 'typescript'],
    concepts: ['ts-generics'],
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

  {
    id: 'ts-adv-narrow-in-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_ADVANCED_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'What does this code log?',
    code: `type Fish = { swim: () => string };
type Bird = { fly: () => string };

function move(animal: Fish | Bird): string {
  if ("swim" in animal) {
    return animal.swim();
  }
  return animal.fly();
}
console.log(move({ fly: () => "soaring" }));`,
    expectedOutput: `soaring`,
    explanation: 'The "swim" in animal check narrows the union at runtime by testing whether that property exists on the object - the object passed here only has fly, so the check is false, TypeScript narrows animal to Bird in the else path, and animal.fly() runs, logging "soaring".',
    hints: ['"prop" in obj is a runtime check for whether the property exists', 'The passed object only has a fly method'],
    tags: ['narrowing', 'in-operator', 'typescript'],
    concepts: ['ts-narrowing'],
  },

  {
    id: 'ts-adv-narrow-in-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_ADVANCED_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the operator that narrows a union by checking for a class instance at runtime.',
    template: 'function describe(error: Error | string): string {\n  if (error ___ Error) {\n    return error.message;\n  }\n  return error;\n}',
    blanks: ['instanceof'],
    solution: 'function describe(error: Error | string): string {\n  if (error instanceof Error) {\n    return error.message;\n  }\n  return error;\n}',
    explanation: 'instanceof checks at runtime whether a value was constructed by a given class, and TypeScript uses that check to narrow a union - inside the if, error is narrowed to Error and .message is available; in the else branch it is narrowed to string.',
    hints: ['The runtime operator that checks against a class/constructor'],
    tags: ['narrowing', 'instanceof', 'typescript'],
    concepts: ['ts-narrowing'],
  },

  {
    id: 'ts-adv-exhaustive-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TS_ADVANCED_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the argument passed to assertNever in the default case, so the compiler flags any Shape variant left unhandled.',
    template: 'type Shape = { kind: "circle" } | { kind: "square" };\n\nfunction assertNever(x: never): never {\n  throw new Error("Unhandled case");\n}\n\nfunction area(s: Shape): number {\n  switch (s.kind) {\n    case "circle": return 1;\n    case "square": return 2;\n    default: return assertNever(___);\n  }\n}',
    blanks: ['s'],
    solution: 'type Shape = { kind: "circle" } | { kind: "square" };\n\nfunction assertNever(x: never): never {\n  throw new Error("Unhandled case");\n}\n\nfunction area(s: Shape): number {\n  switch (s.kind) {\n    case "circle": return 1;\n    case "square": return 2;\n    default: return assertNever(s);\n  }\n}',
    explanation: 'Once every case is handled, TypeScript narrows s in the default branch down to never (there is nothing left it could be) - passing it to assertNever(x: never) type-checks fine. If a new Shape variant is added later but its case is forgotten, s would no longer be never in the default branch, and assertNever(s) becomes a compile error, catching the missing case before runtime.',
    hints: ['Pass the switched-on value itself', 'It is narrowed to never once every case is covered'],
    tags: ['exhaustiveness', 'never', 'discriminated-union', 'typescript'],
    concepts: ['ts-discriminated-unions', 'ts-narrowing'],
  },

  {
    id: 'ts-adv-exhaustive-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TS_ADVANCED_TYPES,
    course: Course.WEB_DEV,
    question: 'A switch over a discriminated union has a case for every current variant, plus a default that passes the switched value to a helper typed to take `never`. Why does this pattern catch a bug months from now when a teammate adds a new variant to the union?',
    options: [
      { id: 'a', text: 'It does not catch anything automatically - the helper only throws a runtime error if the new variant\'s case is actually reached during a test run', isCorrect: false },
      { id: 'b', text: 'Once a new variant is added, the value in the default branch is no longer narrowed all the way down to `never` (it could now be the new, unhandled variant) - passing it to a parameter typed `never` becomes a compile error, forcing the missing case to be added before the code can even build', isCorrect: true },
      { id: 'c', text: 'TypeScript automatically generates the missing switch case at compile time whenever it detects an exhaustiveness helper, so the new variant is handled without any code changes', isCorrect: false },
      { id: 'd', text: 'It only works if every variant of the union is a primitive type; once an object variant is added, the never-typed helper stops being checked entirely', isCorrect: false },
    ],
    explanation: 'This is the "exhaustiveness check via never" pattern: as long as every variant has its own case, the value remaining in default is narrowed to never, satisfying the never-typed helper. The moment a new variant is added without a matching case, that value could actually be the new variant, so it is no longer never, and the compiler rejects passing it to the helper - turning "forgot to handle a case" into a compile-time error instead of a silent runtime bug.',
    tags: ['exhaustiveness', 'never', 'typescript'],
    concepts: ['ts-discriminated-unions'],
  },

  {
    id: 'ts-adv-intersection-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TS_ADVANCED_TYPES,
    course: Course.WEB_DEV,
    question: 'Given `type Timestamped = { createdAt: Date }` and `type Named = { name: string }`, what does `type Entity = Timestamped & Named` produce, and how is it different from `type Entity = Timestamped | Named`?',
    options: [
      { id: 'a', text: '`&` and `|` behave identically for object types in TypeScript; the choice between the two operators is purely a stylistic preference with no effect on which properties end up required on Entity', isCorrect: false },
      { id: 'b', text: 'The intersection produces a type with EITHER createdAt or name present (whichever property happens to be assigned first at runtime), while the union instead requires both properties to always be present together', isCorrect: false },
      { id: 'c', text: 'The intersection (`&`) produces a type with ALL properties from both aliases (createdAt AND name are both required) - a mixin-style combination; the union (`|`) would instead mean a value could satisfy just one alias OR the other, not necessarily both at once', isCorrect: true },
      { id: 'd', text: '`&` merges the two aliases into a single runtime class definition that can be instantiated with `new Entity()`, while `|` only ever works with plain object literal types, never with named type aliases', isCorrect: false },
    ],
    explanation: 'Intersection (&) is TypeScript\'s way of composing type aliases like mixins - the result must satisfy every constituent type simultaneously, so Entity here needs both createdAt and name. A union (|) would instead describe "one shape or the other," which is a fundamentally different (and looser) requirement - a value could satisfy Named alone and still be a valid Timestamped | Named.',
    tags: ['intersection', 'union', 'type-alias', 'typescript'],
    concepts: ['ts-generics'],
  },

  {
    id: 'ts-adv-assertion-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_ADVANCED_TYPES,
    course: Course.WEB_DEV,
    question: 'What does `document.getElementById("app") as HTMLDivElement` actually do at runtime?',
    options: [
      { id: 'a', text: 'It queries the DOM a second time behind the scenes, this time filtering specifically for div elements, and throws immediately if the element that was originally found is not actually a div', isCorrect: false },
      { id: 'b', text: 'It converts the returned element into a brand-new HTMLDivElement instance by copying over its attributes, similar to how calling Number(x) converts a string value into an actual number value', isCorrect: false },
      { id: 'c', text: 'Nothing at all - `as` only tells the compiler to trust your claim about the type; it performs no runtime check or conversion, so if the element is not actually a div, the mistake surfaces later as a runtime error when a div-specific property is accessed, not at the assertion itself', isCorrect: true },
      { id: 'd', text: 'It registers a runtime type guard that TypeScript re-checks on every later access to the variable, throwing an error the moment the underlying element type ever changes', isCorrect: false },
    ],
    explanation: '`as` is a compile-time-only assertion - unlike a real cast in other languages, it does not verify or convert anything at runtime. It simply tells the compiler "treat this value as this type from here on," which is why an incorrect assertion produces no error at the assertion line itself; the failure shows up later, wherever code relies on a property that the actual value does not have.',
    tags: ['as-assertion', 'typescript'],
    concepts: ['ts-narrowing'],
  },

  {
    id: 'ts-adv-assertion-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_ADVANCED_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the keyword that asserts the DOM query result is an HTMLInputElement.',
    template: 'const input = document.getElementById("email") ___ HTMLInputElement;',
    blanks: ['as'],
    solution: 'const input = document.getElementById("email") as HTMLInputElement;',
    explanation: 'document.getElementById returns HTMLElement | null (TypeScript cannot know which specific element it is), so as HTMLInputElement asserts the narrower type. This is a compile-time-only claim - it does not check at runtime that the element really is an input.',
    hints: ['The assertion keyword goes between the expression and the target type'],
    tags: ['as-assertion', 'typescript'],
    concepts: ['ts-narrowing'],
  },

  {
    id: 'ts-adv-const-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TS_ADVANCED_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'What does this code log?',
    code: `const status = "active" as const;
console.log(typeof status);
console.log(status);`,
    expectedOutput: `string
active`,
    explanation: 'as const only changes how TypeScript TYPES the value (narrowing it to the literal "active" instead of the wider string) - it has zero effect at runtime. typeof status is still the runtime string "string" (JavaScript has no concept of a literal type), and status itself just logs its plain value, "active".',
    hints: ['as const affects compile-time types only, never runtime behavior', 'typeof at runtime only knows about JS types like "string", never TypeScript literal types'],
    tags: ['as-const', 'type-erasure', 'typescript'],
    concepts: ['ts-narrowing'],
  },

  {
    id: 'ts-adv-const-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TS_ADVANCED_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the suffix that freezes this object\'s property to the literal type "prod" and makes it readonly, instead of the wider string.',
    template: 'const config = { mode: "prod" } ___;',
    blanks: ['as const'],
    solution: 'const config = { mode: "prod" } as const;',
    explanation: 'as const narrows every property to its literal type ("prod" instead of string) and marks the whole object readonly, so config.mode = "dev" is a compile error afterward. Without it, mode would widen to the general string type and be reassignable.',
    hints: ['Two words after the object literal'],
    tags: ['as-const', 'typescript'],
    concepts: ['ts-narrowing'],
  },

  {
    id: 'ts-adv-satisfies-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TS_ADVANCED_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the operator that checks palette matches the Record type WITHOUT widening its inferred type.',
    template: 'const palette = {\n  red: [255, 0, 0],\n  green: "#00ff00",\n} ___ Record<string, string | number[]>;',
    blanks: ['satisfies'],
    solution: 'const palette = {\n  red: [255, 0, 0],\n  green: "#00ff00",\n} satisfies Record<string, string | number[]>;',
    explanation: 'satisfies checks the object is assignable to the given type as a validation step, but (unlike a : Type annotation) it does not widen palette\'s inferred type - palette.red keeps its specific number[] type instead of being widened to string | number[], so array methods on red still type-check correctly afterward.',
    hints: ['The keyword goes between the object literal and the type to check against'],
    tags: ['satisfies', 'typescript'],
    concepts: ['ts-generics'],
  },

  {
    id: 'ts-adv-satisfies-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TS_ADVANCED_TYPES,
    course: Course.WEB_DEV,
    question: 'How is `const palette = {...} satisfies Record<string, string | number[]>` different from `const palette: Record<string, string | number[]> = {...}`?',
    options: [
      { id: 'a', text: 'They behave identically in every respect - `satisfies` is purely a newer, more readable spelling of the same annotation-based type-checking that a `: Type` declaration already performs on the object', isCorrect: false },
      { id: 'b', text: '`satisfies` only ever works when the target type is specifically `Record`, while a `: Type` annotation works with any type - the two are not interchangeable syntaxes outside that one special case', isCorrect: false },
      { id: 'c', text: '`satisfies` validates the object against the type but keeps each property\'s own narrower inferred type afterward (e.g. `palette.red` stays `number[]`), while the `: Type` annotation widens every property to match the annotation exactly (e.g. `palette.red` becomes `string | number[]`), losing the more specific type', isCorrect: true },
      { id: 'd', text: 'A `: Type` annotation performs its check at compile time, while `satisfies` instead defers the identical check until the code actually runs in the browser or in Node', isCorrect: false },
    ],
    explanation: 'Both catch a shape mismatch at compile time - the difference is what happens to the variable\'s type afterward. A `: Type` annotation replaces the inferred type with the declared type across the board, widening specific properties. `satisfies` only checks compatibility and lets the original, narrower inference stand, which matters when later code depends on that narrower type (e.g. calling array methods that only number[] has).',
    tags: ['satisfies', 'typescript'],
    concepts: ['ts-generics'],
  },

  {
    id: 'ts-adv-mapped-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TS_ADVANCED_TYPES,
    course: Course.WEB_DEV,
    question: 'What does a mapped type like `type ReadonlyUser = { readonly [K in keyof User]: User[K] }` do?',
    options: [
      { id: 'a', text: 'It creates a runtime loop that copies each property of an actual User object one at a time into a brand-new frozen object the moment the code executes', isCorrect: false },
      { id: 'b', text: 'It only works on the single named type `User` and cannot be reused for any other object type without rewriting the entire mapped type again from scratch', isCorrect: false },
      { id: 'c', text: 'It replaces every property value with the literal string "readonly", turning all of User\'s data fields into descriptive labels instead of preserving their original underlying types', isCorrect: false },
      { id: 'd', text: 'It iterates over every key K in User (via keyof User) and builds a new type with the same keys and value types, but with readonly added to each - a generic, reusable way to transform an existing type\'s properties (this is how built-ins like Readonly<T> and Partial<T> are implemented)', isCorrect: true },
    ],
    explanation: 'A mapped type transforms an existing type by iterating over its keys (`[K in keyof T]`) and producing a new property for each, optionally changing modifiers like readonly or optionality, or the value type itself. It is purely compile-time type-level computation - no loop runs when the program executes - and it generalizes to any T, which is exactly how utility types like Readonly<T>, Partial<T>, and Record<K, V> are defined under the hood.',
    tags: ['mapped-types', 'typescript'],
    concepts: ['ts-utility-types'],
  },

  {
    id: 'ts-adv-conditional-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TS_ADVANCED_TYPES,
    course: Course.WEB_DEV,
    question: 'What does a conditional type like `type IsString<T> = T extends string ? true : false` compute?',
    options: [
      { id: 'a', text: 'A runtime function that receives a value, checks `typeof value === "string"`, and returns the boolean true or false accordingly when the code actually executes', isCorrect: false },
      { id: 'b', text: 'A type-level if/else: for a given T, it resolves to the literal type true if T is assignable to string, otherwise to the literal type false - the whole expression is evaluated by the compiler, never at runtime', isCorrect: true },
      { id: 'c', text: 'A type alias that can only ever equal the union `true | false` as a whole, regardless of what T actually is, since conditional types are not able to inspect their own type parameter', isCorrect: false },
      { id: 'd', text: 'A compiler error - the `extends ? :` syntax is reserved exclusively for generic constraints and cannot legally appear on the right-hand side of a type alias assignment', isCorrect: false },
    ],
    explanation: 'Conditional types are TypeScript\'s type-level ternary: `T extends U ? X : Y` picks X or Y depending on whether T is assignable to U, computed entirely by the compiler with no runtime code generated. IsString<"hi"> resolves to true, IsString<number> resolves to false - this is the foundation for advanced library types (e.g. how Awaited<T> and Exclude<T, U> are implemented), though writing them from scratch is rarely needed day to day.',
    tags: ['conditional-types', 'typescript'],
    concepts: ['ts-utility-types'],
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

  {
    id: 'ts-util-record-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_UTILITY_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the utility type that maps every Role to an array of permission strings.',
    template: 'type Role = "admin" | "editor" | "viewer";\ntype RolePermissions = ___<Role, string[]>;',
    blanks: ['Record'],
    solution: 'type Role = "admin" | "editor" | "viewer";\ntype RolePermissions = Record<Role, string[]>;',
    explanation: 'Record<K, V> builds an object type with exactly the keys in K, each mapped to a value of type V. Record<Role, string[]> requires an entry for every one of "admin" | "editor" | "viewer" (not just any string key), each holding an array of permission strings - missing a role is a compile error.',
    hints: ['The utility type that maps a set of keys to a value type'],
    tags: ['Record', 'utility-types', 'typescript'],
    concepts: ['ts-utility-types'],
  },

  {
    id: 'ts-util-record-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TS_UTILITY_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Given type Role = "admin" | "editor" | "viewer", declare a typed constant "rolePermissions" of type Record<Role, string[]> with a permissions array for each role.',
    starterCode: `type Role = "admin" | "editor" | "viewer";\n\n// Record mapping every role to its permissions\n`,
    testCases: [{ input: 'three roles', expectedOutput: 'const rolePermissions: Record<Role, string[]>', description: 'Should type the object as Record<Role, string[]>' }],
    solution: `type Role = "admin" | "editor" | "viewer";\n\nconst rolePermissions: Record<Role, string[]> = {\n  admin: ["read", "write", "delete"],\n  editor: ["read", "write"],\n  viewer: ["read"],\n};`,
    explanation: 'Record<Role, string[]> requires exactly one entry per Role value, each an array of strings - if a role is left out, or an unlisted key like "guest" is added, TypeScript flags it at compile time, unlike a plain { [key: string]: string[] } which would silently allow both.',
    hints: ['Record<Role, string[]> as the annotation', 'Every member of the Role union needs its own key'],
    tags: ['Record', 'utility-types', 'typescript'],
    concepts: ['ts-utility-types'],
  },

  {
    id: 'ts-util-returntype-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TS_UTILITY_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the utility types that extract createUser\'s return type, and its parameter tuple, without repeating them by hand.',
    template: 'function createUser(name: string, age: number) {\n  return { id: 1, name, age };\n}\ntype NewUser = ___<typeof createUser>;\ntype CreateUserArgs = ___<typeof createUser>;',
    blanks: ['ReturnType', 'Parameters'],
    solution: 'function createUser(name: string, age: number) {\n  return { id: 1, name, age };\n}\ntype NewUser = ReturnType<typeof createUser>;\ntype CreateUserArgs = Parameters<typeof createUser>;',
    explanation: 'ReturnType<typeof fn> reads off whatever a function actually returns, and Parameters<typeof fn> reads off its parameter types as a tuple - both stay in sync automatically if createUser\'s signature changes later, instead of a hand-written type alias silently going stale.',
    hints: ['One extracts what the function gives back', 'The other extracts what the function takes in'],
    tags: ['ReturnType', 'Parameters', 'utility-types', 'typescript'],
    concepts: ['ts-utility-types'],
  },

  {
    id: 'ts-util-returntype-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TS_UTILITY_TYPES,
    course: Course.WEB_DEV,
    question: 'Why write `type NewUser = ReturnType<typeof createUser>;` instead of manually writing out `type NewUser = { id: number; name: string; age: number };` to match what createUser returns?',
    options: [
      { id: 'a', text: 'ReturnType only works on arrow functions, not on functions declared with the `function` keyword, so createUser would have to be rewritten as an arrow function first', isCorrect: false },
      { id: 'b', text: 'ReturnType stays automatically in sync with the function - if createUser\'s return shape changes later (a field renamed, added, or removed), NewUser updates with it; a hand-written duplicate type would silently drift out of sync and nobody would be warned', isCorrect: true },
      { id: 'c', text: 'The hand-written version is actually preferred by TypeScript style guides; ReturnType exists only for cases where the source function is defined in a different file and cannot be imported directly', isCorrect: false },
      { id: 'd', text: 'ReturnType executes createUser once at compile time to observe its actual return value, so it only works for functions with no parameters and no side effects', isCorrect: false },
    ],
    explanation: 'Duplicating a return shape by hand creates two sources of truth that can drift apart the moment the function changes - ReturnType<typeof fn> derives the type mechanically from the function itself, so it can never go stale. This is a purely compile-time type-level operation; it does not execute the function.',
    tags: ['ReturnType', 'utility-types', 'typescript'],
    concepts: ['ts-utility-types'],
  },

  {
    id: 'ts-util-awaited-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TS_UTILITY_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the utility type that unwraps the value inside a Promise, so FetchedUser is User rather than Promise<User>.',
    template: 'async function fetchUser(): Promise<User> {\n  return { id: 1, name: "Alice" };\n}\ntype FetchedUser = ___<ReturnType<typeof fetchUser>>;',
    blanks: ['Awaited'],
    solution: 'async function fetchUser(): Promise<User> {\n  return { id: 1, name: "Alice" };\n}\ntype FetchedUser = Awaited<ReturnType<typeof fetchUser>>;',
    explanation: 'ReturnType<typeof fetchUser> gives Promise<User>, not User - the Promise wrapper is still there. Awaited<T> unwraps that layer (mirroring what an actual await does at runtime), so Awaited<Promise<User>> resolves to plain User.',
    hints: ['Named after the keyword that unwraps a Promise at runtime'],
    tags: ['Awaited', 'promise', 'utility-types', 'typescript'],
    concepts: ['ts-utility-types'],
  },

  {
    id: 'ts-util-nonnullable-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TS_UTILITY_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the utility type that strips null and undefined out of MaybeName, leaving just string.',
    template: 'type MaybeName = string | null | undefined;\ntype DefiniteName = ___<MaybeName>;',
    blanks: ['NonNullable'],
    solution: 'type MaybeName = string | null | undefined;\ntype DefiniteName = NonNullable<MaybeName>;',
    explanation: 'NonNullable<T> removes null and undefined from a union, leaving only the remaining members - NonNullable<string | null | undefined> resolves to plain string, useful after a check has already ruled out the missing cases.',
    hints: ['The utility named directly after what it removes'],
    tags: ['NonNullable', 'utility-types', 'typescript'],
    concepts: ['ts-utility-types'],
  },

  {
    id: 'ts-util-exclude-extract-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TS_UTILITY_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the utility type that removes "pending" from Status, and the one that keeps only "pending".',
    template: 'type Status = "pending" | "active" | "done";\ntype SettledStatus = ___<Status, "pending">;\ntype OnlyPending = ___<Status, "pending">;',
    blanks: ['Exclude', 'Extract'],
    solution: 'type Status = "pending" | "active" | "done";\ntype SettledStatus = Exclude<Status, "pending">;\ntype OnlyPending = Extract<Status, "pending">;',
    explanation: 'Exclude<T, U> removes from union T whichever members are assignable to U, so SettledStatus becomes "active" | "done". Extract<T, U> does the opposite - it keeps only the members of T assignable to U, so OnlyPending becomes just "pending". They are mirror-image filters over the same union.',
    hints: ['One removes matching members from the union', 'The other keeps only the matching members'],
    tags: ['Exclude', 'Extract', 'utility-types', 'typescript'],
    concepts: ['ts-utility-types'],
  },

  {
    id: 'ts-util-exclude-extract-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TS_UTILITY_TYPES,
    course: Course.WEB_DEV,
    question: 'Given `type Status = "pending" | "active" | "done"`, what is the difference between `Exclude<Status, "pending">` and `Extract<Status, "pending">`?',
    options: [
      { id: 'a', text: '`Exclude<Status, "pending">` resolves to `"active" | "done"` (everything except the matched member); `Extract<Status, "pending">` resolves to just `"pending"` (only the matched member) - they filter the same union in opposite directions', isCorrect: true },
      { id: 'b', text: 'Both utilities resolve to the exact same result, `"active" | "done"`; `Extract` is simply an older, deprecated name that TypeScript keeps only for backwards compatibility with `Exclude`', isCorrect: false },
      { id: 'c', text: '`Exclude` operates on union types, while `Extract` only operates on object types with named properties - they are not actually interchangeable operations over the same kind of type', isCorrect: false },
      { id: 'd', text: '`Exclude<Status, "pending">` removes the entire Status type declaration from the file at compile time, while `Extract` only narrows the type without ever removing anything', isCorrect: false },
    ],
    explanation: 'Exclude<T, U> and Extract<T, U> are complementary set operations over a union: Exclude keeps whatever does NOT match U, Extract keeps whatever DOES match U. Here Exclude<Status, "pending"> drops "pending" and keeps "active" | "done", while Extract<Status, "pending"> keeps only "pending" and drops the rest.',
    tags: ['Exclude', 'Extract', 'utility-types', 'typescript'],
    concepts: ['ts-utility-types'],
  },

  {
    id: 'ts-util-combine-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TS_UTILITY_TYPES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Given interface User { id: number; name: string; email: string }, define a type "CreateUserDto" that has all of User\'s fields except id, plus an optional id (string) for a client-generated UUID.',
    starterCode: `interface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\n// Combine Omit with an added optional field\n`,
    testCases: [{ input: 'User interface', expectedOutput: 'type CreateUserDto = Omit<User, "id"> & { id?: string }', description: 'Should combine Omit with an intersection' }],
    solution: `interface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\ntype CreateUserDto = Omit<User, "id"> & { id?: string };`,
    explanation: 'Omit<User, "id"> drops the numeric id entirely, and & { id?: string } adds back an optional string id via intersection - this combined-utility pattern (drop a field, then re-add a reshaped version of it) is common for DTOs where the client sends a different id representation than the server stores.',
    hints: ['Omit<User, "id"> removes the original id field', '& { id?: string } adds an optional replacement via intersection'],
    tags: ['Omit', 'intersection', 'utility-types', 'typescript'],
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

  {
    id: 'react-list-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_COMPONENTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Assemble a component "ItemList" that renders an li for each item in the "items" prop, using item.id as the React key.',
    correctOrder: [
      'function ItemList({ items }) {',
      '  return (',
      '    <ul>',
      '      {items.map(item => (',
      '        <li key={item.id}>{item.name}</li>',
      '      ))}',
      '    </ul>',
      '  );',
      '}',
    ],
    distractorLines: [
      '{items.map((item, index) => (',
      '        <li key={index}>{item.name}</li>',
    ],
    solution: 'function ItemList({ items }) {\n  return (\n    <ul>\n      {items.map(item => (\n        <li key={item.id}>{item.name}</li>\n      ))}\n    </ul>\n  );\n}',
    explanation: 'Array.map turns each data item into a JSX element; the key prop goes on the outermost element inside the map and should be a stable identifier from the data (item.id), not the array index.',
    hints: ['.map returns one <li> per item', 'key={item.id}, not the loop index'],
    tags: ['list', 'key', 'map', 'jsx', 'react'],
    concepts: ['react-conditional-rendering'],
  },

  {
    id: 'react-list-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_COMPONENTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the array method that renders one element per item, and the prop that gives React a stable identity for each one.',
    template: 'function ItemList({ items }) {\n  return (\n    <ul>\n      {items.___(item => <li ___={item.id}>{item.name}</li>)}\n    </ul>\n  );\n}',
    blanks: ['map', 'key'],
    solution: 'function ItemList({ items }) {\n  return (\n    <ul>\n      {items.map(item => <li key={item.id}>{item.name}</li>)}\n    </ul>\n  );\n}',
    explanation: '.map transforms the items array into an array of JSX elements; key tells React which rendered element corresponds to which data item across re-renders.',
    hints: ['Array method that transforms each item', 'React-only prop for list identity'],
    tags: ['list', 'key', 'map', 'jsx', 'react'],
    concepts: ['react-conditional-rendering'],
  },

  {
    id: 'react-list-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_COMPONENTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Write a component "ItemList" that takes a prop "items" (an array of objects, each with "id" and "name") and renders a ul containing one li per item, showing item.name and keyed by item.id.',
    starterCode: `function ItemList({ items }) {\n  // your code here\n}\n`,
    testCases: [
      {
        input: 'items array of {id, name}',
        expectedOutput: 'ul > li per item, keyed by item.id',
        description: 'Should render one keyed li per item',
      },
    ],
    solution: `function ItemList({ items }) {\n  return (\n    <ul>\n      {items.map(item => (\n        <li key={item.id}>{item.name}</li>\n      ))}\n    </ul>\n  );\n}`,
    explanation: 'Rendering a list is map + key together: map produces the elements, key gives React a stable way to track each one across renders (needed for correct reordering, insertion, and state preservation).',
    hints: ['items.map(item => ...)', 'key={item.id} on the <li>'],
    tags: ['list', 'key', 'map', 'jsx', 'react'],
    concepts: ['react-conditional-rendering'],
  },

  {
    id: 'react-list-key-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_COMPONENTS,
    course: Course.WEB_DEV,
    question: 'A list of todo items can be reordered or have items inserted in the middle. Why is using the array index as the React key a problem here, compared to using each item\'s stable id?',
    options: [
      { id: 'a', text: 'Using the index as a key causes React to skip rendering that list entirely, since indexes are not considered valid values for the key prop', isCorrect: false }, { id: 'b', text: 'React uses the key to match rendered elements to data across renders; if the index shifts after a reorder or insert, React can pair the wrong element instance with the wrong data, mismatching internal state like input values', isCorrect: true }, { id: 'c', text: 'Index keys make the initial render slower, because React has to convert each number to a string before it can use it as a key', isCorrect: false }, { id: 'd', text: 'Index keys only cause problems in class components; function components always re-derive keys correctly regardless of what value is passed', isCorrect: false },
    ],
    explanation: 'React diffs by key, not by position. When the index is the key, inserting or reordering items shifts which index maps to which data, so React can reuse the wrong DOM node/state for a given visual row (e.g. an input keeps its old value after items shift).',
    tags: ['list', 'key', 'reorder', 'react'],
    concepts: ['react-conditional-rendering'],
  },

  {
    id: 'react-children-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_COMPONENTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the prop that renders whatever JSX was nested between this component\'s opening and closing tags.',
    template: 'function Card({ children }) {\n  return <div className="card">{___}</div>;\n}',
    blanks: ['children'],
    solution: 'function Card({ children }) {\n  return <div className="card">{children}</div>;\n}',
    explanation: 'props.children automatically holds whatever was written between <Card>...</Card> in the parent, letting Card wrap arbitrary content without knowing what it is.',
    hints: ['A special prop React fills in automatically'],
    tags: ['children', 'composition', 'props', 'react'],
    concepts: ['react-conditional-rendering'],
  },

  {
    id: 'react-children-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_COMPONENTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Write a component "Card" that accepts props.children and renders it inside a div with className "card".',
    starterCode: `function Card({ children }) {\n  // your code here\n}\n`,
    testCases: [
      {
        input: 'children: <p>Hello</p>',
        expectedOutput: '<div class="card"><p>Hello</p></div>',
        description: 'Should wrap children in a card div',
      },
    ],
    solution: `function Card({ children }) {\n  return <div className="card">{children}</div>;\n}`,
    explanation: 'This is the composition pattern: Card does not need to know what content it wraps. Any JSX nested between <Card> and </Card> arrives as props.children.',
    hints: ['Destructure children from props', 'Render {children} inside the wrapper div'],
    tags: ['children', 'composition', 'react'],
    concepts: ['react-conditional-rendering'],
  },

  {
    id: 'react-fragment-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_COMPONENTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the shorthand fragment syntax so this component returns two sibling elements without adding an extra DOM node.',
    template: 'function Pair() {\n  return (\n    ___\n      <dt>Name</dt>\n      <dd>Ada</dd>\n    ___\n  );\n}',
    blanks: ['<>', '</>'],
    solution: 'function Pair() {\n  return (\n    <>\n      <dt>Name</dt>\n      <dd>Ada</dd>\n    </>\n  );\n}',
    explanation: 'A component must return a single root, but wrapping in a real element like <div> adds an unwanted node to the DOM. The <>...</> fragment groups siblings for JSX without rendering any element itself.',
    hints: ['Shorthand for React.Fragment'],
    tags: ['fragment', 'jsx', 'react'],
    concepts: ['react-conditional-rendering'],
  },

  {
    id: 'react-jsx-rules-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_COMPONENTS,
    course: Course.WEB_DEV,
    question: 'Which statement correctly describes two of JSX\'s syntax rules?',
    options: [
      { id: 'a', text: 'JSX requires every element to carry a unique id attribute, and expressions must be wrapped in double curly braces {{ like this }}', isCorrect: false }, { id: 'b', text: 'JSX attributes use class exactly like HTML, and JavaScript expressions are written directly with no special wrapping syntax at all', isCorrect: false }, { id: 'c', text: 'JSX attributes use className instead of class, and any embedded JavaScript expression must be wrapped in curly braces, e.g. {user.name}', isCorrect: true }, { id: 'd', text: 'JSX compiles straight into an HTML string, so class and for behave exactly as they do in a plain HTML form element', isCorrect: false },
    ],
    explanation: 'JSX is JavaScript, not HTML: class is a reserved word in JS, so JSX uses className (and htmlFor instead of for). Curly braces {} switch from JSX markup into a JavaScript expression, e.g. {user.name} or {2 + 2}.',
    tags: ['jsx', 'rules', 'react'],
    concepts: ['react-conditional-rendering'],
  },

  {
    id: 'react-jsx-rules-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_COMPONENTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the JSX attribute name for a CSS class, and the syntax that embeds the "label" variable as text.',
    template: 'function Badge({ label }) {\n  return <span ___="badge">___</span>;\n}',
    blanks: ['className', '{label}'],
    solution: 'function Badge({ label }) {\n  return <span className="badge">{label}</span>;\n}',
    explanation: 'className sets the CSS class in JSX (class is reserved in JavaScript); {label} embeds the JavaScript variable\'s value as text inside the element.',
    hints: ['Not "class" - JSX uses a different attribute name', 'Curly braces embed a JS expression'],
    tags: ['jsx', 'rules', 'className', 'react'],
    concepts: ['react-conditional-rendering'],
  },

  {
    id: 'react-default-props-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_COMPONENTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the destructuring default so "role" is "guest" whenever the caller does not pass a role prop.',
    template: 'function UserTag({ name, role ___ }) {\n  return <span>{name} ({role})</span>;\n}',
    blanks: ["= 'guest'"],
    solution: `function UserTag({ name, role = 'guest' }) {\n  return <span>{name} ({role})</span>;\n}`,
    explanation: 'Destructuring defaults (role = \'guest\') apply only when the prop is undefined - a caller who explicitly passes null or an empty string still overrides the default, since those values are not undefined.',
    hints: ['Same default-parameter syntax as a plain JS function'],
    tags: ['props', 'default-props', 'destructuring', 'react'],
    concepts: ['react-conditional-rendering', 'js-spread-destructuring'],
  },

  {
    id: 'react-rerender-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_COMPONENTS,
    course: Course.WEB_DEV,
    question: 'A parent component re-renders because its own state changed. The parent passes the exact same prop values to a child component as before. By default, what happens to that child?',
    options: [
      { id: 'a', text: 'The child unmounts and remounts from scratch, because passing an object or array prop always counts as a brand-new value on every render', isCorrect: false }, { id: 'b', text: 'The child is skipped automatically, because React always does a deep comparison of props before deciding whether any component should re-render', isCorrect: false }, { id: 'c', text: 'The child re-renders, but only its DOM attributes get updated - the child\'s own function body does not run again unless its state also changed', isCorrect: false }, { id: 'd', text: 'The child re-renders too - React re-renders a component\'s entire subtree by default, and only skips a child if it is explicitly wrapped in React.memo (or similar)', isCorrect: true },
    ],
    explanation: 'React\'s default behavior is to re-render a component whenever its parent re-renders, regardless of whether its own props actually changed - re-rendering means the function body runs again to compute new JSX. Skipping unnecessary re-renders requires an explicit opt-in like React.memo.',
    tags: ['rendering', 'mental-model', 'react'],
    concepts: ['react-conditional-rendering'],
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

  {
    id: 'react-state-updater-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_STATE,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the functional-updater form three times so each call adds 1 on top of the latest pending value, instead of reading the same stale count.',
    template: 'function handleTripleClick() {\n  setCount(___);\n  setCount(___);\n  setCount(___);\n}',
    blanks: ['c => c + 1', 'c => c + 1', 'c => c + 1'],
    solution: 'function handleTripleClick() {\n  setCount(c => c + 1);\n  setCount(c => c + 1);\n  setCount(c => c + 1);\n}',
    explanation: 'Passing a function to the setter receives the latest pending state, so three calls correctly queue +1, +1, +1. Passing count + 1 three times reads the same closed-over count value each time and only nets +1 overall.',
    hints: ['setCount(c => c + 1) reads the latest pending value'],
    tags: ['useState', 'functional-updater', 'closures', 'react'],
    concepts: ['react-state-immutability'],
  },

  {
    id: 'react-state-updater-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_STATE,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'This component starts with count = 0. After the button is clicked ONCE, what number does the button end up displaying?',
    code: `function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }

  return <button onClick={handleClick}>{count}</button>;
}`,
    expectedOutput: '1',
    explanation: 'Each setCount(count + 1) closes over the SAME count value from this render (0), so all three calls schedule the identical update count -> 1. The functional form setCount(c => c + 1) would correctly land on 3.',
    hints: ['count inside handleClick is fixed for the whole render', 'All three calls compute 0 + 1'],
    tags: ['useState', 'functional-updater', 'closures', 'react'],
    concepts: ['react-state-immutability'],
  },

  {
    id: 'react-state-object-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_STATE,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the spread that copies the previous user object before overwriting its email.',
    template: 'function updateEmail(newEmail) {\n  setUser(prevUser => ({ ___, email: newEmail }));\n}',
    blanks: ['...prevUser'],
    solution: 'function updateEmail(newEmail) {\n  setUser(prevUser => ({ ...prevUser, email: newEmail }));\n}',
    explanation: 'Object state must be replaced wholesale, not mutated in place. Spreading the previous object first, then overriding just the changed key, keeps every other field intact while still producing a new object reference for React to detect.',
    hints: ['Spread the previous object, then override one key'],
    tags: ['useState', 'object-state', 'spread', 'react'],
    concepts: ['react-state-immutability', 'js-object-mutation'],
  },

  {
    id: 'react-state-object-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_STATE,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Write a component "ProfileForm" that holds user state as an object { name, email } (both starting as empty strings), plus a function updateField(field, value) that updates just that one field via setUser while leaving the rest of the object unchanged.',
    starterCode: `import { useState } from "react";\n\nfunction ProfileForm() {\n  // your code here\n}\n`,
    testCases: [
      {
        input: 'updateField("email", "a@b.com")',
        expectedOutput: 'user.name preserved, user.email updated',
        description: 'Should update one field without dropping the others',
      },
    ],
    solution: `import { useState } from "react";\n\nfunction ProfileForm() {\n  const [user, setUser] = useState({ name: "", email: "" });\n\n  function updateField(field, value) {\n    setUser(prevUser => ({ ...prevUser, [field]: value }));\n  }\n\n  return (\n    <div>\n      <input value={user.name} onChange={e => updateField("name", e.target.value)} />\n      <input value={user.email} onChange={e => updateField("email", e.target.value)} />\n    </div>\n  );\n}`,
    explanation: 'Updating one field of object state means spreading the previous object and overriding only the changed key. [field]: value uses a computed property name so the same function handles every field without a switch statement.',
    hints: ['setUser(prev => ({ ...prev, [field]: value }))', 'Computed property name: [field]'],
    tags: ['useState', 'object-state', 'spread', 'react'],
    concepts: ['react-state-immutability', 'js-object-mutation'],
  },

  {
    id: 'react-state-batching-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_STATE,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'This component logs "render" on every render. What is the complete console output from mounting once, then clicking the button once (React 18+ automatic batching)?',
    code: `function Demo() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  console.log('render');

  function handleClick() {
    setA(a + 1);
    setB(b + 1);
  }

  return <button onClick={handleClick}>{a}-{b}</button>;
}`,
    expectedOutput: `render
render`,
    explanation: 'React 18+ batches every setState call made inside the same event handler into a single re-render. Even though handleClick calls two different setters, the component only re-renders (and logs) once more after the click, not twice.',
    hints: ['One log on mount', 'Both setA and setB batch into one extra render'],
    tags: ['batching', 'useState', 'react'],
    concepts: ['react-state-immutability'],
  },

  {
    id: 'react-state-batching-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_STATE,
    course: Course.WEB_DEV,
    question: 'A click handler calls setA(...) and then setB(...) on two different state variables in the same function. In React 18+, how many times does the component re-render because of that one click?',
    options: [
      { id: 'a', text: 'Once - React batches every state update made inside the same event handler into a single re-render, applying both changes together before repainting', isCorrect: true },
      { id: 'b', text: 'Twice - each setState call is applied immediately and independently, so the component re-renders once per call in the order they were written', isCorrect: false },
      { id: 'c', text: 'Zero - both updates are silently dropped unless the handler explicitly wraps them in a flushSync call to force a render', isCorrect: false },
      { id: 'd', text: 'It depends entirely on which of the two state variables happened to be declared first in the component with useState', isCorrect: false },
    ],
    explanation: 'Automatic batching (React 18+) groups all setState calls within the same event handler (or any React-managed event) into one re-render, regardless of how many different state variables are involved.',
    tags: ['batching', 'useState', 'react'],
    concepts: ['react-state-immutability'],
  },

  {
    id: 'react-state-snapshot-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_STATE,
    course: Course.WEB_DEV,
    question: 'A click handler reads the state variable "count" at the top, calls setCount(count + 1), then a few lines later - after an awaited fetch - logs count again in the SAME handler invocation. What does that second log show?',
    options: [
      { id: 'a', text: 'The updated value - once setCount runs, the local count variable itself is reassigned for the rest of the current function', isCorrect: false }, { id: 'b', text: 'The original value from when the render started - state variables are a fixed snapshot for the entire handler/render, unaffected by the setter call or by an intervening await', isCorrect: true }, { id: 'c', text: 'undefined - state variables lose their value once execution pauses at an await inside the same function', isCorrect: false }, { id: 'd', text: 'It varies between runs, since React does not guarantee state values stay stable across an async gap in the same handler', isCorrect: false },
    ],
    explanation: 'Every render captures its own count value in a closure; calling the setter schedules a future re-render but does not mutate that captured variable. The SAME handler invocation - even after an await - keeps reading the snapshot from the render that created it.',
    tags: ['snapshot', 'closures', 'state', 'react'],
    concepts: ['react-state-immutability'],
  },

  {
    id: 'react-state-derived-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_STATE,
    course: Course.WEB_DEV,
    question: 'A component stores "items" (an array) and a separate "itemCount" state, updated via a useEffect that calls setItemCount(items.length) whenever items changes. What is the recommended fix?',
    options: [
      { id: 'a', text: 'Merge items and itemCount into a single object passed to one useState call, since useState only tracks one independently changing value per call', isCorrect: false }, { id: 'b', text: 'Keep both states, but move the setItemCount call out of useEffect and into whichever handler updates items, so both update in one render', isCorrect: false }, { id: 'c', text: 'Delete itemCount entirely and compute const itemCount = items.length directly during render - a value that is fully derivable from existing state should not be its own state', isCorrect: true }, { id: 'd', text: 'Wrap the existing useEffect in useMemo so itemCount only recomputes when the items array reference actually changes', isCorrect: false },
    ],
    explanation: 'This is the "you might not need an effect" derived-state anti-pattern: itemCount adds an extra render (effect runs after commit) and a second source of truth that can drift. Computing it inline during render is simpler, always in sync, and needs no effect at all.',
    tags: ['derived-state', 'anti-pattern', 'useEffect', 'react'],
    concepts: ['react-state-immutability'],
  },

  {
    id: 'react-state-initializer-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.REACT_STATE,
    course: Course.WEB_DEV,
    question: 'Why is useState(() => expensiveCompute()) preferred over useState(expensiveCompute()) when computing the initial value is costly?',
    options: [
      { id: 'a', text: 'Passing a function makes the resulting state update asynchronously, while passing a value directly makes it update synchronously', isCorrect: false }, { id: 'b', text: 'Both forms behave identically at runtime; the function form exists only to satisfy TypeScript\'s type checker for generic state', isCorrect: false }, { id: 'c', text: 'useState\'s type signature requires a function argument and throws a runtime error if given a plain computed value directly', isCorrect: false }, { id: 'd', text: 'Passing a function defers the work - React calls it only once, on the very first render, whereas passing the call directly re-runs expensiveCompute() on EVERY render even though the result is thrown away', isCorrect: true },
    ],
    explanation: 'useState(expensiveCompute()) calls expensiveCompute() on every single render just to discard the result after the first one. Passing a function instead (a "lazy initializer") tells React to invoke it only once, during the initial render.',
    tags: ['useState', 'lazy-initializer', 'performance', 'react'],
    concepts: ['react-state-immutability'],
  },

  {
    id: 'react-state-initializer-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.REACT_STATE,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the lazy-initializer form so expensiveParse() only runs once, on the first render.',
    template: 'const [data, setData] = useState(___);',
    blanks: ['() => expensiveParse()'],
    solution: 'const [data, setData] = useState(() => expensiveParse());',
    explanation: 'Passing a function to useState makes it a lazy initializer - React calls it only on the very first render and ignores it on every subsequent render, unlike useState(expensiveParse()) which re-invokes the function every render even though the result is discarded.',
    hints: ['Wrap the expensive call in an arrow function'],
    tags: ['useState', 'lazy-initializer', 'performance', 'react'],
    concepts: ['react-state-immutability'],
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

  {
    id: 'react-effect-staleclosure-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_EFFECTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'This effect runs once (empty deps) and logs count every second. The button uses the functional updater to increment count. No matter how many times the button has been clicked, what number does EVERY log show, forever?',
    code: `function Ticker() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log(count);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}`,
    expectedOutput: '0',
    explanation: 'The effect (and the closure it creates) runs only once because of the empty dependency array, so the interval\'s callback keeps referencing the count value from that FIRST render - 0 - forever. The button still displays the current count correctly (each render reads the latest state directly), but the interval callback is stuck with its original stale closure.',
    hints: ['Empty [] means the effect - and its closure - runs only once', 'The displayed count and the logged count are read in different closures'],
    tags: ['stale-closure', 'useEffect', 'closures', 'react'],
    concepts: ['react-effect-deps'],
  },

  {
    id: 'react-effect-staleclosure-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_EFFECTS,
    course: Course.WEB_DEV,
    question: 'An effect with an empty dependency array starts a setInterval whose callback reads a state variable directly (not via a functional updater). Why does that callback keep seeing the value from the very first render, even after many re-renders?',
    options: [
      { id: 'a', text: 'The effect - and the closure it creates - only runs once when deps are [], so the interval callback keeps referencing whatever value that variable held at that single render; later renders create new closures, but the already-running interval keeps its old one', isCorrect: true },
      { id: 'b', text: 'React automatically refreshes closures inside any setInterval callback whenever state changes, so this problem only ever happens with setTimeout, never with setInterval', isCorrect: false },
      { id: 'c', text: 'State variables are passed into setInterval by reference, so any read inside the callback always resolves lazily to whatever the current state happens to be at call time', isCorrect: false },
      { id: 'd', text: 'The interval callback throws a silent error after the first tick, so the console only ever shows one successful log before it stops firing entirely', isCorrect: false },
    ],
    explanation: 'This is the classic stale closure bug: an effect with [] runs once, so any callback it schedules (interval, timeout, event listener) closes over the props/state values from that one render forever. Fixing it means adding the value to deps (restarting the interval each change) or switching to a functional updater that does not need to read the stale variable at all.',
    tags: ['stale-closure', 'useEffect', 'closures', 'react'],
    concepts: ['react-effect-deps'],
  },

  {
    id: 'react-effect-strictmode-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_EFFECTS,
    course: Course.WEB_DEV,
    question: 'In development, wrapped in <React.StrictMode>, a component mounts with useEffect(() => { console.log("effect"); return () => console.log("cleanup"); }, []). What appears in the console, and how does that differ from a production build?',
    options: [
      { id: 'a', text: 'StrictMode has no effect on useEffect timing at all - any double logging developers observe is caused purely by hot module reloading, never by StrictMode itself', isCorrect: false }, { id: 'b', text: 'Development logs effect, cleanup, effect - StrictMode intentionally mounts, unmounts, and remounts once to surface effects with missing or broken cleanup; production logs just effect once, with no extra invocation', isCorrect: true }, { id: 'c', text: 'StrictMode disables useEffect entirely while in development, so neither the effect body nor its cleanup runs until the app is built for production', isCorrect: false }, { id: 'd', text: 'StrictMode runs only the cleanup function twice in a row, without ever invoking the effect body a second time, purely to check that cleanup is idempotent', isCorrect: false },
    ],
    explanation: 'StrictMode (dev only) deliberately double-invokes mount effects - mount, cleanup, mount again - specifically to catch effects whose cleanup does not fully undo the setup (e.g. a missing unsubscribe). It never runs in production and never affects the effect\'s actual behavior beyond that dev-only extra pass.',
    tags: ['strict-mode', 'useEffect', 'development', 'react'],
    concepts: ['react-effect-cleanup'],
  },

  {
    id: 'react-effect-notaneffect-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_EFFECTS,
    course: Course.WEB_DEV,
    question: 'A component computes fullName from firstName and lastName, then uses a useEffect to call setFullName(fullName) whenever either changes, purely so it can render fullName. What is the problem with this approach?',
    options: [
      { id: 'a', text: 'The only bug is a missing dependency - setFullName itself must always be added to the array alongside firstName and lastName for the effect to run correctly', isCorrect: false }, { id: 'b', text: 'Nothing is wrong here - deriving any value from two separate pieces of state always requires an effect, since React does not allow plain arithmetic or string concatenation during render', isCorrect: false }, { id: 'c', text: 'fullName is fully derivable from existing props/state, so it should just be computed directly during render (const fullName = firstName + " " + lastName) - the effect adds an unnecessary extra render and a redundant piece of state that can drift out of sync', isCorrect: true }, { id: 'd', text: 'useEffect cannot read two state variables in the same callback, so firstName and lastName would first need to be merged into one combined state object', isCorrect: false },
    ],
    explanation: 'This is the textbook "derive during render, don\'t store it" case from react.dev\'s "You Might Not Need an Effect": if a value can be computed from props/state you already have, computing it inline is simpler, always correct, and needs no effect, no extra state, and no extra render pass.',
    tags: ['not-an-effect', 'derived-state', 'anti-pattern', 'react'],
    concepts: ['react-effect-deps'],
  },

  {
    id: 'react-effect-notaneffect-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_EFFECTS,
    course: Course.WEB_DEV,
    question: 'A component wants to log an analytics event exactly when the user clicks "Submit". It currently does this inside a useEffect that fires whenever a "submitted" state flag flips to true (set by the click handler). Why is that a poor fit, and what should replace it?',
    options: [
      { id: 'a', text: 'The fix is to move the analytics call into useLayoutEffect instead, since only layout effects are guaranteed to fire synchronously with a user click', isCorrect: false }, { id: 'b', text: 'It is correct as written - useEffect is the only mechanism React provides for running code in response to a user clicking a button', isCorrect: false }, { id: 'c', text: 'The fix is to add "submitted" to the effect\'s dependency array a second time, once for the state read and once for the analytics call itself', isCorrect: false }, { id: 'd', text: 'This is a response to a specific user interaction, not synchronization with a prop/state value - the analytics call belongs directly inside the button\'s onClick handler, with no effect, no extra state flag, and no extra render triggered at all', isCorrect: true },
    ],
    explanation: 'Effects synchronize a component with an external system as state/props change over time - they are not the right tool for "when this specific interaction happens, do X". Event handlers already know exactly which interaction occurred, so code that only needs to run in response to a click belongs in the handler itself.',
    tags: ['not-an-effect', 'event-handlers', 'react'],
    concepts: ['react-effect-deps', 'js-dom-events'],
  },

  {
    id: 'react-effect-race-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.REACT_EFFECTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the ignore flag (three blanks, same variable) that stops an out-of-date response from overwriting state when userId changes before the previous request resolves.',
    template: 'useEffect(() => {\n  let ___ = false;\n\n  fetch(`/api/users/${userId}`)\n    .then(res => res.json())\n    .then(data => {\n      if (!___) setUser(data);\n    });\n\n  return () => { ___ = true; };\n}, [userId]);',
    blanks: ['ignore', 'ignore', 'ignore'],
    solution: 'useEffect(() => {\n  let ignore = false;\n\n  fetch(`/api/users/${userId}`)\n    .then(res => res.json())\n    .then(data => {\n      if (!ignore) setUser(data);\n    });\n\n  return () => { ignore = true; };\n}, [userId]);',
    explanation: 'React runs an effect\'s cleanup before re-running it for a new userId (or on unmount). Flipping ignore to true there means a response for the OLD userId finds ignore already true and skips setUser, so state always reflects the request for the LATEST userId even if an older response happens to resolve later.',
    hints: ['A local flag, flipped in the cleanup function'],
    tags: ['race-condition', 'useEffect', 'fetch', 'react'],
    concepts: ['react-effect-cleanup', 'js-promises-async'],
  },

  {
    id: 'react-effect-race-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.REACT_EFFECTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Write a useEffect (dependency: userId) that fetches `/api/users/${userId}` and stores the result via setUser, but guards against a race condition: if userId changes again before a request resolves, that stale response must never be applied to state.',
    starterCode: `useEffect(() => {\n  // your code here\n}, [userId]);\n`,
    testCases: [
      {
        input: 'userId changes before the first fetch resolves',
        expectedOutput: 'setUser is never called with the stale response',
        description: 'Should ignore out-of-date responses',
      },
    ],
    solution: `useEffect(() => {\n  let ignore = false;\n\n  fetch(\`/api/users/\${userId}\`)\n    .then(res => res.json())\n    .then(data => {\n      if (!ignore) setUser(data);\n    });\n\n  return () => {\n    ignore = true;\n  };\n}, [userId]);`,
    explanation: 'The ignore flag is set to true in the cleanup, which React runs before the effect re-runs for a new userId. A response for the OLD userId then finds ignore already true and skips setUser, so state always reflects the LATEST userId\'s request even if an older response arrives after a newer one.',
    hints: ['Declare a local ignore flag inside the effect', 'Check !ignore before calling setUser', 'Flip ignore to true in the cleanup function'],
    tags: ['race-condition', 'useEffect', 'fetch', 'react'],
    concepts: ['react-effect-cleanup', 'js-promises-async'],
  },

  {
    id: 'react-effect-layouteffect-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.REACT_EFFECTS,
    course: Course.WEB_DEV,
    question: 'When should useLayoutEffect be used instead of useEffect?',
    options: [
      { id: 'a', text: 'When the effect measures or mutates the DOM (e.g. reading an element\'s layout, then adjusting a style) and that change must happen BEFORE the browser paints, to avoid a visible flicker - useLayoutEffect runs synchronously after DOM mutations but before paint, while useEffect runs asynchronously after paint', isCorrect: true },
      { id: 'b', text: 'Whenever the effect calls fetch, since useLayoutEffect is the only hook that guarantees the network request actually begins before the component finishes its current render pass, unlike useEffect which the browser can delay', isCorrect: false },
      { id: 'c', text: 'Whenever the dependency array is empty, since plain useEffect only supports a non-empty dependency array in production builds, and useLayoutEffect is the variant required specifically for effects meant to run once on mount', isCorrect: false },
      { id: 'd', text: 'Whenever the component is wrapped in React.memo, since memoized components silently ignore any effect scheduled with plain useEffect and only respond correctly to effects declared with useLayoutEffect instead', isCorrect: false },
    ],
    explanation: 'The only real difference is timing: useLayoutEffect fires synchronously after DOM mutations but before the browser paints (blocking paint until it finishes), while useEffect fires asynchronously after paint. Reach for useLayoutEffect only for DOM measurement/mutation that would otherwise cause a visible flicker; everything else should stay as useEffect.',
    tags: ['use-layout-effect', 'timing', 'react'],
    concepts: ['react-effect-deps'],
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

  {
    id: 'react-hooks-rules-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_HOOKS,
    course: Course.WEB_DEV,
    question: 'Which of these violates the Rules of Hooks?',
    options: [
      { id: 'a', text: 'Calling two separate useState hooks one after another at the top level of the same component, each one managing its own independent piece of state', isCorrect: false }, { id: 'b', text: 'Calling useState inside an if statement, so that hook call only happens when some condition is true - hooks must be called unconditionally, in the exact same order, on every single render', isCorrect: true }, { id: 'c', text: 'Calling a custom hook like useLocalStorage from inside another custom hook, as long as that call happens unconditionally at the top level', isCorrect: false }, { id: 'd', text: 'Calling useEffect at the top level of a component, passing a dependency array whose contents happen to change between renders', isCorrect: false },
    ],
    explanation: 'React tracks hooks by CALL ORDER, not by name - it relies on the same hooks running in the same sequence every render. Putting a hook call inside a condition means that order can change between renders, which corrupts every hook\'s state after that point.',
    tags: ['rules-of-hooks', 'react'],
    concepts: ['react-custom-hooks'],
  },

  {
    id: 'react-hooks-rules-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_HOOKS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'This component only calls useState for "extra" when showExtra is true. It mounts with showExtra=false, then re-renders with showExtra=true. What does React log to the console on that second render?',
    code: `function Panel({ showExtra }) {
  const [count, setCount] = useState(0);

  if (showExtra) {
    const [extra, setExtra] = useState(0);
  }

  return <div>{count}</div>;
}`,
    expectedOutput: 'Error: Rendered more hooks than during the previous render.',
    explanation: 'The first render calls one hook (useState for count). The second render, with showExtra now true, calls two hooks. React detects the hook count changed between renders and throws this exact error, since it can no longer safely match hook calls to their stored state.',
    hints: ['React counts hooks called per render', 'A conditional hook call changes that count'],
    tags: ['rules-of-hooks', 'react'],
    concepts: ['react-custom-hooks'],
  },

  {
    id: 'react-ref-instancevar-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_HOOKS,
    course: Course.WEB_DEV,
    question: 'A component stores a timer id in useRef instead of useState, specifically because it does not need a re-render when that value changes. What is true about reading and writing ref.current?',
    options: [
      { id: 'a', text: 'ref.current can only be read once per render; reading the same ref a second time inside that render throws a runtime error', isCorrect: false }, { id: 'b', text: 'Writing ref.current always schedules a re-render just like calling a state setter, but that re-render happens without producing any visible DOM change', isCorrect: false }, { id: 'c', text: 'Reading or writing ref.current never triggers a re-render, and the updated value is immediately visible on .current - unlike state, which only reflects its new value starting on the NEXT render after the setter runs', isCorrect: true }, { id: 'd', text: 'Refs are automatically reset back to their initial value on every re-render, so any value stored in ref.current has to be rewritten each render', isCorrect: false },
    ],
    explanation: 'Refs are a mutable box that persists across renders without participating in React\'s render cycle at all - writes take effect immediately and are visible on the very next line, unlike state updates which are only reflected starting the NEXT render.',
    tags: ['useRef', 'instance-variable', 'react'],
    concepts: ['react-ref-imperative'],
  },

  {
    id: 'react-ref-instancevar-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_HOOKS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the hook used to track the previous render\'s value WITHOUT causing an extra re-render when it updates, and the property that holds it.',
    template: 'function usePrevious(value) {\n  const ref = ___(value);\n  useEffect(() => {\n    ref.___ = value;\n  });\n  return ref.current;\n}',
    blanks: ['useRef', 'current'],
    solution: 'function usePrevious(value) {\n  const ref = useRef(value);\n  useEffect(() => {\n    ref.current = value;\n  });\n  return ref.current;\n}',
    explanation: 'A ref is the right tool here because updating it must NOT cause a re-render. The effect (which runs AFTER this render\'s JSX is produced) writes the current value into ref.current, so the NEXT render\'s call to usePrevious returns the PREVIOUS render\'s value.',
    hints: ['Same hook + property as reading a DOM node ref'],
    tags: ['useRef', 'instance-variable', 'react'],
    concepts: ['react-ref-imperative', 'react-effect-deps'],
  },

  {
    id: 'react-reducer-payload-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_HOOKS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the action property that carries the new todo\'s text.',
    template: 'function reducer(state, action) {\n  switch (action.type) {\n    case "add": return [...state, { id: Date.now(), text: action.___ }];\n    default: return state;\n  }\n}',
    blanks: ['payload'],
    solution: 'function reducer(state, action) {\n  switch (action.type) {\n    case "add": return [...state, { id: Date.now(), text: action.payload }];\n    default: return state;\n  }\n}',
    explanation: 'Actions commonly carry their data in a "payload" property alongside "type", e.g. dispatch({ type: "add", payload: text }). Keeping every action shaped as { type, payload } makes reducers predictable to read and test, even as more action kinds are added.',
    hints: ['The conventional field name for action data beyond "type"'],
    tags: ['useReducer', 'payload', 'react'],
    concepts: ['react-state-immutability'],
  },

  {
    id: 'react-reducer-payload-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_HOOKS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Write a reducer for a todo list that handles two actions, each carrying its data in action.payload: "add" (payload is the todo text; append a new { id, text, done: false } using Date.now() for id) and "toggle" (payload is a todo\'s id; flip that todo\'s done field, leaving all others unchanged).',
    starterCode: `function reducer(state, action) {\n  // your code here\n}\n`,
    testCases: [
      {
        input: '{ type: "add", payload: "Buy milk" } then { type: "toggle", payload: <that id> }',
        expectedOutput: 'todo appended, then its done flipped to true',
        description: 'Should handle add and toggle via action.payload',
      },
    ],
    solution: `function reducer(state, action) {\n  switch (action.type) {\n    case "add":\n      return [...state, { id: Date.now(), text: action.payload, done: false }];\n    case "toggle":\n      return state.map(todo =>\n        todo.id === action.payload ? { ...todo, done: !todo.done } : todo\n      );\n    default:\n      return state;\n  }\n}`,
    explanation: 'Both actions read their data from action.payload. "add" appends a new todo object immutably with spread; "toggle" maps over state, replacing only the matching todo with a new object (done flipped) while every other todo keeps its original reference.',
    hints: ['action.payload holds the text for "add", the id for "toggle"', 'map + ternary to replace only the matching todo'],
    tags: ['useReducer', 'payload', 'immutable', 'react'],
    concepts: ['react-state-immutability'],
  },

  {
    id: 'react-customhook-naming-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_HOOKS,
    course: Course.WEB_DEV,
    question: 'Why must a custom hook\'s name start with "use" (e.g. useLocalStorage), even though it is really just a regular JavaScript function?',
    options: [
      { id: 'a', text: 'Prefixing with "use" is only required for hooks published in an npm package; hooks defined locally in the same project file can be named anything at all', isCorrect: false }, { id: 'b', text: 'React\'s runtime inspects the function\'s name at call time and throws an error if a function calling useState or useEffect does not start with "use"', isCorrect: false }, { id: 'c', text: 'The "use" prefix changes how JavaScript hoists the function declaration, guaranteeing the hook is defined before any component that calls it', isCorrect: false }, { id: 'd', text: 'The "use" prefix is a convention that React\'s linter and other developers rely on to recognize a function calls hooks internally and must itself follow the Rules of Hooks - React does not enforce the name at runtime, but tooling does', isCorrect: true },
    ],
    explanation: 'There is no runtime check - "use" is purely a naming convention. It lets the ESLint hooks plugin (and other developers) identify which functions call hooks internally, so it can verify THOSE functions also follow the Rules of Hooks, and so callers know not to call them conditionally.',
    tags: ['custom-hooks', 'convention', 'react'],
    concepts: ['react-custom-hooks'],
  },

  {
    id: 'react-useid-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.REACT_HOOKS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the hook that generates a stable, unique id for accessibility attributes - one that stays consistent between server and client renders, unlike Math.random().',
    template: 'function LabeledInput({ label }) {\n  const id = ___();\n  return (\n    <>\n      <label htmlFor={id}>{label}</label>\n      <input id={id} />\n    </>\n  );\n}',
    blanks: ['useId'],
    solution: 'function LabeledInput({ label }) {\n  const id = useId();\n  return (\n    <>\n      <label htmlFor={id}>{label}</label>\n      <input id={id} />\n    </>\n  );\n}',
    explanation: 'useId generates a unique id per component instance that matches between server and client renders. Math.random() or a module-level counter would produce mismatched ids during hydration, since server and client generate different sequences.',
    hints: ['A hook specifically for accessibility ids, added in React 18'],
    tags: ['useId', 'accessibility', 'react'],
    concepts: ['react-custom-hooks'],
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
      { id: 'a', text: 'Context for absolutely everything, including state that changes on every keystroke, since it removes prop drilling regardless of how often the value updates or how many components consume it', isCorrect: false },
      { id: 'b', text: 'Props for 1-2 levels. Context for global state shared by many components (theme, auth, locale). A state library (Zustand/Redux) for complex state with many frequent updates.', isCorrect: true },
      { id: 'c', text: 'A state library (Redux/Zustand) for any shared state from the very first component that needs it, since Context always causes unnecessary re-renders no matter how infrequently its value actually changes', isCorrect: false },
      { id: 'd', text: 'Props all the way down through every level of the tree, since passing values explicitly is always clearer than Context, even for state like theme or auth used by dozens of far-apart components', isCorrect: false },
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

  {
    id: 'react-context-defaultvalue-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_CONTEXT,
    course: Course.WEB_DEV,
    question: 'A component calls useContext(ThemeContext), where ThemeContext = createContext("light"). Under what condition does that call actually return "light" - the default argument passed to createContext?',
    options: [
      { id: 'a', text: 'Only during the component\'s very first render, after which useContext permanently switches to reading whichever Provider value was set most recently, even once that provider is removed', isCorrect: false },
      { id: 'b', text: 'Only when the component is rendered with NO matching <ThemeContext.Provider> anywhere above it in the tree - if ANY provider exists above it, useContext reads that provider\'s value prop instead, never the default', isCorrect: true },
      { id: 'c', text: 'Whenever the nearest Provider\'s value prop happens to equal exactly the string "light", regardless of whether that Provider actually wraps the consuming component at all', isCorrect: false },
      { id: 'd', text: 'Never - createContext\'s default argument only exists to help React infer the context\'s TypeScript type, and has no effect on any value actually read at runtime', isCorrect: false },
    ],
    explanation: 'The default value passed to createContext is only used as a fallback when a component reads the context with no matching Provider above it in the tree. As soon as any Provider wraps the consumer, its value prop takes over completely.',
    tags: ['context', 'default-value', 'react'],
    concepts: ['react-context'],
  },

  {
    id: 'react-context-defaultvalue-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_CONTEXT,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'ThemeContext = createContext("light"). Label calls console.log(useContext(ThemeContext)) but is rendered with NO <ThemeContext.Provider> anywhere above it. What does it log?',
    code: `const ThemeContext = createContext("light");

function Label() {
  console.log(useContext(ThemeContext));
  return null;
}

// rendered directly, with no ThemeContext.Provider anywhere above it`,
    expectedOutput: 'light',
    explanation: 'With no matching Provider above it in the tree, useContext falls back to the value passed to createContext - here, "light". As soon as any ThemeContext.Provider wraps the component, that provider\'s value prop takes over completely, and the default is never consulted again.',
    hints: ['No provider above it means the default value from createContext is used'],
    tags: ['context', 'default-value', 'react'],
    concepts: ['react-context'],
  },

  {
    id: 'react-context-perf-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.REACT_CONTEXT,
    course: Course.WEB_DEV,
    question: 'A ThemeContext.Provider wraps the entire app. Its value prop changes once. Which components re-render as a result?',
    options: [
      { id: 'a', text: 'Only the single component physically closest to the Provider in the tree; more deeply nested consumers do not see the update until their own next unrelated re-render happens to occur', isCorrect: false },
      { id: 'b', text: 'No components re-render automatically; each consumer must manually call a refetch or subscribe function of its own to pick up the Provider\'s new value', isCorrect: false },
      { id: 'c', text: 'EVERY component that calls useContext(ThemeContext) anywhere in the tree re-renders, regardless of whether that component actually displays anything related to what changed - context has no built-in way to skip unaffected consumers', isCorrect: true },
      { id: 'd', text: 'Only components that were first rendered AFTER the value changed; components that already existed before the change keep showing the old value until they unmount and remount', isCorrect: false },
    ],
    explanation: 'Every consumer of a context re-renders whenever that context\'s value prop changes, with no automatic way to opt individual consumers out - this is exactly why an unmemoized value object (a new reference every Provider render) is such a common perf trap.',
    tags: ['context', 'performance', 're-render', 'react'],
    concepts: ['react-context', 'react-memoization'],
  },

  {
    id: 'react-context-memoize-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.REACT_CONTEXT,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the hook that memoizes the Provider\'s value object, so consumers don\'t re-render on every ThemeProvider render just because a fresh object literal was created.',
    template: 'function ThemeProvider({ children }) {\n  const [theme, setTheme] = useState("light");\n  const value = ___(() => ({ theme, setTheme }), [theme]);\n  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;\n}',
    blanks: ['useMemo'],
    solution: 'function ThemeProvider({ children }) {\n  const [theme, setTheme] = useState("light");\n  const value = useMemo(() => ({ theme, setTheme }), [theme]);\n  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;\n}',
    explanation: 'Without useMemo, { theme, setTheme } is a brand-new object every render, so every consumer sees a "changed" value prop and re-renders even when theme itself has not changed. useMemo keeps the SAME object reference across renders where theme is unchanged.',
    hints: ['Same hook used to memoize any expensive computed value'],
    tags: ['context', 'useMemo', 'performance', 'react'],
    concepts: ['react-context', 'react-memoization'],
  },

  {
    id: 'react-context-memoize-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.REACT_CONTEXT,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Write a "ThemeProvider" component with theme state (starting "light") and a toggleTheme function that flips between "light" and "dark", whose Provider value prop is memoized with useMemo so it only produces a new reference when theme itself changes.',
    starterCode: `function ThemeProvider({ children }) {\n  // your code here\n}\n`,
    testCases: [
      {
        input: 'ThemeProvider re-renders for an unrelated reason, theme unchanged',
        expectedOutput: 'the Provider value reference stays the same across that render',
        description: 'Should memoize the context value by theme',
      },
    ],
    solution: `function ThemeProvider({ children }) {\n  const [theme, setTheme] = useState("light");\n\n  const toggleTheme = () => setTheme(t => (t === "light" ? "dark" : "light"));\n\n  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);\n\n  return (\n    <ThemeContext.Provider value={value}>\n      {children}\n    </ThemeContext.Provider>\n  );\n}`,
    explanation: 'useMemo(() => ({ theme, toggleTheme }), [theme]) keeps the value object\'s reference stable across renders where theme has not changed, instead of creating a fresh object - and triggering every consumer to re-render - on every single ThemeProvider render.',
    hints: ['useMemo(() => ({ theme, toggleTheme }), [theme])', 'toggleTheme flips between the two string values'],
    tags: ['context', 'useMemo', 'performance', 'react'],
    concepts: ['react-context', 'react-memoization'],
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

  {
    id: 'react-forms-checkbox-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_FORMS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the boolean prop that controls a checkbox (not "value"), and the property that reads its on/off state.',
    template: '<input type="checkbox" ___={agreed} onChange={(e) => setAgreed(e.target.___)} />',
    blanks: ['checked', 'checked'],
    solution: '<input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />',
    explanation: 'A checkbox is controlled via the boolean "checked" prop, not "value" - and its onChange reads e.target.checked (true/false), not e.target.value (which would just be the checkbox\'s static "on" string).',
    hints: ['Checkboxes use a different controlling prop than text inputs'],
    tags: ['forms', 'checkbox', 'controlled', 'react'],
    concepts: ['react-controlled-forms'],
  },

  {
    id: 'react-forms-radio-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_FORMS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Write a component "PlanPicker" that renders three radio inputs (shared name "plan", values "free"/"pro"/"team") backed by one selected state, so only one radio can be checked at a time.',
    starterCode: `import { useState } from "react";\n\nfunction PlanPicker() {\n  // your code here\n}\n`,
    testCases: [
      {
        input: 'click the "pro" radio',
        expectedOutput: 'only the "pro" radio is checked afterward',
        description: 'Should keep the radios mutually exclusive via shared state',
      },
    ],
    solution: `import { useState } from "react";\n\nfunction PlanPicker() {\n  const [plan, setPlan] = useState("free");\n\n  return (\n    <div>\n      {["free", "pro", "team"].map(option => (\n        <label key={option}>\n          <input\n            type="radio"\n            name="plan"\n            value={option}\n            checked={plan === option}\n            onChange={(e) => setPlan(e.target.value)}\n          />\n          {option}\n        </label>\n      ))}\n    </div>\n  );\n}`,
    explanation: 'A shared "plan" state drives every radio\'s checked prop (checked={plan === option}), so React - not the browser - decides which one is selected; the shared name attribute is still needed for correct keyboard/accessibility grouping.',
    hints: ['One state variable shared by all three radios', 'checked={plan === option} per radio'],
    tags: ['forms', 'radio', 'controlled', 'react'],
    concepts: ['react-controlled-forms'],
  },

  {
    id: 'react-forms-computed-handler-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_FORMS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the computed property name so one handleChange updates whichever field fired the event.',
    template: 'function handleChange(e) {\n  setForm(prev => ({ ...prev, ___: e.target.value }));\n}',
    blanks: ['[e.target.name]'],
    solution: 'function handleChange(e) {\n  setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));\n}',
    explanation: '[e.target.name] is a computed property name - it reads whichever field name the changed input carries in its own "name" attribute and uses that as the object key to update, so one function serves every field instead of one handler per input.',
    hints: ['Computed key syntax: [expression]: value'],
    tags: ['forms', 'computed-property', 'controlled', 'react'],
    concepts: ['react-controlled-forms', 'js-spread-destructuring'],
  },

  {
    id: 'react-forms-computed-handler-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_FORMS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Write a component "ContactForm" with a single form-object state { firstName, lastName, email } (all starting as empty strings) and ONE handleChange function - using e.target.name and e.target.value - wired to all three inputs, each with a matching "name" attribute.',
    starterCode: `import { useState } from "react";\n\nfunction ContactForm() {\n  // your code here\n}\n`,
    testCases: [
      {
        input: 'typing in the "email" input',
        expectedOutput: 'form.email updates, firstName and lastName unchanged',
        description: 'Should route every field through one shared handler',
      },
    ],
    solution: `import { useState } from "react";\n\nfunction ContactForm() {\n  const [form, setForm] = useState({ firstName: "", lastName: "", email: "" });\n\n  function handleChange(e) {\n    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));\n  }\n\n  return (\n    <form>\n      <input name="firstName" value={form.firstName} onChange={handleChange} />\n      <input name="lastName" value={form.lastName} onChange={handleChange} />\n      <input name="email" value={form.email} onChange={handleChange} />\n    </form>\n  );\n}`,
    explanation: 'One handleChange serves every field because it reads which field changed from e.target.name and writes to that key via a computed property name, rather than needing a dedicated handler per input.',
    hints: ['setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))', 'Each input needs a matching "name" attribute'],
    tags: ['forms', 'computed-property', 'controlled', 'react'],
    concepts: ['react-controlled-forms', 'js-spread-destructuring'],
  },

  {
    id: 'react-forms-uncontrolled-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_FORMS,
    course: Course.WEB_DEV,
    question: 'When is an uncontrolled input (reading its value via a ref only at submission time, instead of tracking it in state on every keystroke) usually the better choice over a controlled input?',
    options: [
      { id: 'a', text: 'When you only need the value once, at submission (e.g. a simple one-off field or a file input), with no per-keystroke validation or formatting needed - this avoids a re-render on every keystroke for a value nobody reads until submit', isCorrect: true },
      { id: 'b', text: 'Always - uncontrolled inputs are strictly faster than controlled inputs in every scenario, including live validation and running character counters', isCorrect: false },
      { id: 'c', text: 'Only inside class components, since function components are architecturally unable to read a DOM input\'s value without storing it in state first', isCorrect: false },
      { id: 'd', text: 'Never - React officially deprecated uncontrolled inputs starting in version 18, requiring every form field to be fully controlled from then on', isCorrect: false },
    ],
    explanation: 'Uncontrolled inputs skip a state update (and re-render) on every keystroke, which is worth it exactly when nothing needs to react to those keystrokes - live validation, formatting, or a character count all require the value in state instead, i.e. a controlled input.',
    tags: ['forms', 'uncontrolled', 'ref', 'react'],
    concepts: ['react-controlled-forms', 'react-ref-imperative'],
  },

  {
    id: 'react-forms-textarea-select-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_FORMS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the prop that controls a textarea\'s text in React, even though plain HTML normally puts a textarea\'s content between its opening and closing tags.',
    template: '<textarea ___={bio} onChange={(e) => setBio(e.target.value)} />',
    blanks: ['value'],
    solution: '<textarea value={bio} onChange={(e) => setBio(e.target.value)} />',
    explanation: 'React normalizes textarea (and select) to use the same value/onChange pattern as a plain text input, so every form control is controlled the same consistent way, instead of textarea needing its own special children-based API.',
    hints: ['Same controlling prop as a text input'],
    tags: ['forms', 'textarea', 'controlled', 'react'],
    concepts: ['react-controlled-forms'],
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
      { id: 'b', text: 'Wrapping the risky JSX in a plain try/catch block inside the render function, since try/catch handles any JavaScript code including component rendering', isCorrect: false },
      { id: 'c', text: 'Registering a global window.onerror handler, which reports any uncaught error anywhere on the page, including ones thrown inside React\'s component tree', isCorrect: false },
      { id: 'd', text: 'Errors thrown during rendering can never be caught by React at all; the only real fix is preventing the error from being thrown in the first place', isCorrect: false },
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

  {
    id: 'react-navigate-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_PATTERNS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the hook that returns a function for redirecting programmatically, and the call that sends the user to "/dashboard".',
    template: 'const navigate = ___();\n\nfunction handleSuccess() {\n  ___("/dashboard");\n}',
    blanks: ['useNavigate', 'navigate'],
    solution: 'const navigate = useNavigate();\n\nfunction handleSuccess() {\n  navigate("/dashboard");\n}',
    explanation: 'useNavigate() returns a function for redirecting outside of a <Link> click - e.g. after a form submits successfully or an async action completes. Calling navigate(path) pushes a new entry onto the history stack, the same as clicking a Link to that path would.',
    hints: ['Hook name mirrors what it returns', 'Call the returned function with the target path'],
    tags: ['useNavigate', 'react-router', 'react'],
    concepts: ['next-app-router'],
  },

  {
    id: 'react-navigate-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.REACT_PATTERNS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Write a component "LoginForm" that, on successful submit (assume an async login(email, password) function that resolves on success), programmatically redirects to "/dashboard" using useNavigate.',
    starterCode: `import { useNavigate } from "react-router-dom";\n\nfunction LoginForm() {\n  // your code here\n}\n`,
    testCases: [
      {
        input: 'submit with valid credentials',
        expectedOutput: 'navigate("/dashboard") called after login resolves',
        description: 'Should redirect only after the async login succeeds',
      },
    ],
    solution: `import { useNavigate } from "react-router-dom";\n\nfunction LoginForm() {\n  const navigate = useNavigate();\n\n  async function handleSubmit(e) {\n    e.preventDefault();\n    await login(e.target.email.value, e.target.password.value);\n    navigate("/dashboard");\n  }\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input name="email" type="email" />\n      <input name="password" type="password" />\n      <button type="submit">Log in</button>\n    </form>\n  );\n}`,
    explanation: 'useNavigate() is the programmatic alternative to <Link> - exactly right here, since the redirect must only happen after the async login call succeeds, not immediately on render or on a plain click.',
    hints: ['const navigate = useNavigate()', 'await login(...) before calling navigate'],
    tags: ['useNavigate', 'react-router', 'async', 'react'],
    concepts: ['next-app-router', 'js-promises-async'],
  },

  {
    id: 'react-error-limits-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_PATTERNS,
    course: Course.WEB_DEV,
    question: 'An error boundary wraps a component tree. Which of these errors will it actually catch?',
    options: [
      { id: 'a', text: 'An error thrown inside a button\'s onClick handler, since event handlers still run as part of the same render cycle that the boundary wraps around', isCorrect: false }, { id: 'b', text: 'An error thrown while rendering a child component - e.g. inside its function body during a normal render pass - which is exactly the case error boundaries are designed to catch', isCorrect: true }, { id: 'c', text: 'An error thrown inside a .then() callback after an awaited fetch call resolves, since asynchronous code still executes within the boundary\'s subtree', isCorrect: false }, { id: 'd', text: 'An error thrown during server-side rendering on the server, since error boundaries behave identically across both server renders and client renders', isCorrect: false },
    ],
    explanation: 'Error boundaries only catch errors thrown during rendering, in lifecycle methods, and in constructors of their child tree. Event handlers, async code (promises, setTimeout), and server-side rendering are all outside that scope - those need their own try/catch or error handling.',
    tags: ['error-boundary', 'limits', 'react'],
    concepts: ['next-error-boundary', 'js-error-handling'],
  },

  {
    id: 'react-error-boundary-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_PATTERNS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the two lifecycle methods: one (static) that updates state to trigger the fallback render, and one that runs the side effect of logging the error.',
    template: 'class ErrorBoundary extends React.Component {\n  state = { hasError: false };\n\n  static ___(error) {\n    return { hasError: true };\n  }\n\n  ___(error, info) {\n    console.error(error, info);\n  }\n\n  render() {\n    if (this.state.hasError) return <h1>Something went wrong.</h1>;\n    return this.props.children;\n  }\n}',
    blanks: ['getDerivedStateFromError', 'componentDidCatch'],
    solution: 'class ErrorBoundary extends React.Component {\n  state = { hasError: false };\n\n  static getDerivedStateFromError(error) {\n    return { hasError: true };\n  }\n\n  componentDidCatch(error, info) {\n    console.error(error, info);\n  }\n\n  render() {\n    if (this.state.hasError) return <h1>Something went wrong.</h1>;\n    return this.props.children;\n  }\n}',
    explanation: 'getDerivedStateFromError (static) runs during rendering to update state and trigger the fallback UI; componentDidCatch runs afterward, as a commit-phase side effect, for logging. Only class components can currently be error boundaries - there is no hook equivalent.',
    hints: ['One is static and returns new state', 'The other is for logging, not rendering'],
    tags: ['error-boundary', 'class-component', 'react'],
    concepts: ['next-error-boundary'],
  },

  {
    id: 'react-outlet-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_PATTERNS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the component that renders whichever nested child route matched, inside this shared layout route.',
    template: '<Route path="/dashboard" element={<DashboardLayout />}>\n  <Route path="settings" element={<Settings />} />\n  <Route path="profile" element={<Profile />} />\n</Route>\n\nfunction DashboardLayout() {\n  return (\n    <div>\n      <nav>...</nav>\n      <___ />\n    </div>\n  );\n}',
    blanks: ['Outlet'],
    solution: '<Route path="/dashboard" element={<DashboardLayout />}>\n  <Route path="settings" element={<Settings />} />\n  <Route path="profile" element={<Profile />} />\n</Route>\n\nfunction DashboardLayout() {\n  return (\n    <div>\n      <nav>...</nav>\n      <Outlet />\n    </div>\n  );\n}',
    explanation: 'Nesting <Route> elements shares a parent layout (DashboardLayout) across child routes. <Outlet /> is the placeholder inside that layout where React Router renders whichever nested route currently matches - Settings or Profile.',
    hints: ['The nested-route placeholder component, imported from react-router-dom'],
    tags: ['react-router', 'outlet', 'nested-routes', 'react'],
    concepts: ['next-app-router'],
  },

  {
    id: 'react-memo-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_PATTERNS,
    course: Course.WEB_DEV,
    question: 'A child component re-renders every time its parent re-renders, even though the child always receives the exact same props. When does wrapping it in React.memo actually help?',
    options: [
      { id: 'a', text: 'Only for components that manage their own internal useState, since memo is architecturally unable to skip re-renders for components that are entirely prop-driven', isCorrect: false }, { id: 'b', text: 'Always - React.memo makes every component faster in every situation, so it should be applied to every single component in an application by default', isCorrect: false }, { id: 'c', text: 'When the child itself is expensive to render (heavy computation or a large subtree) AND its props are usually unchanged between parent re-renders - memo then skips re-rendering by shallow-comparing the new props against the last ones', isCorrect: true }, { id: 'd', text: 'Only when the child receives zero props at all, since memo\'s shallow comparison logic cannot handle components that accept any props whatsoever', isCorrect: false },
    ],
    explanation: 'React.memo only pays off when re-rendering the child is actually expensive AND its props are stable most of the time - for a cheap component, the shallow-comparison check itself can cost as much as just re-rendering, so memo is a targeted optimization, not a default.',
    tags: ['react-memo', 'performance', 'react'],
    concepts: ['react-memoization'],
  },

  {
    id: 'react-memo-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_PATTERNS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the function that wraps ExpensiveList so it skips re-rendering when its props are shallowly equal to last time.',
    template: 'const ExpensiveList = ___(function ExpensiveList({ items }) {\n  return <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>;\n});',
    blanks: ['React.memo'],
    solution: 'const ExpensiveList = React.memo(function ExpensiveList({ items }) {\n  return <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>;\n});',
    explanation: 'React.memo(Component) returns a memoized version that only re-renders when its props change (shallow comparison). Pair it with useCallback/useMemo on the parent for any function/object props - a new reference every render would otherwise defeat the memoization.',
    hints: ['Wraps the whole component definition'],
    tags: ['react-memo', 'performance', 'react'],
    concepts: ['react-memoization'],
  },

  {
    id: 'react-portal-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_PATTERNS,
    course: Course.WEB_DEV,
    question: 'A modal needs its DOM output rendered as a direct child of <body> (to escape a parent\'s overflow:hidden and z-index stacking), while remaining logically part of the React tree it was rendered from (context, event bubbling, etc. all still work normally). What is the tool for this?',
    options: [
      { id: 'a', text: 'Context.Provider - wrapping the modal in a provider automatically re-parents its rendered DOM output to <body> with no additional API needed', isCorrect: false }, { id: 'b', text: 'React.Fragment - it lets a component return multiple root elements, which also happens to let its JSX render outside its parent\'s DOM subtree entirely', isCorrect: false }, { id: 'c', text: 'useLayoutEffect, manually calling appendChild to move the already-rendered DOM node over to <body> after every render completes', isCorrect: false }, { id: 'd', text: 'createPortal(children, domNode) - it renders children into a DIFFERENT DOM node than the component\'s actual parent, while keeping it in the same position in the React tree for events, context, and lifecycle purposes', isCorrect: true },
    ],
    explanation: 'createPortal (from react-dom) is built exactly for this: rendering a subtree into a DOM node outside the component\'s normal parent, while that subtree stays a normal part of the React tree for context, event bubbling, and everything else.',
    tags: ['portal', 'modal', 'react'],
    concepts: ['react-controlled-forms'],
  },

  {
    id: 'react-portal-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.REACT_PATTERNS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the function (imported from react-dom) that renders this modal\'s content into #modal-root instead of its parent\'s normal DOM position.',
    template: 'import { ___ } from "react-dom";\n\nfunction Modal({ children }) {\n  return ___(\n    <div className="modal">{children}</div>,\n    document.getElementById("modal-root")\n  );\n}',
    blanks: ['createPortal', 'createPortal'],
    solution: 'import { createPortal } from "react-dom";\n\nfunction Modal({ children }) {\n  return createPortal(\n    <div className="modal">{children}</div>,\n    document.getElementById("modal-root")\n  );\n}',
    explanation: 'createPortal(children, targetDomNode) renders the JSX into targetDomNode in the actual DOM tree, while the component stays in its original place in the React tree - so events still bubble up through React\'s tree as normal, unaffected by the DOM relocation.',
    hints: ['Imported from react-dom, not react'],
    tags: ['portal', 'modal', 'react'],
    concepts: ['react-controlled-forms'],
  },

  {
    id: 'react-key-reset-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.REACT_PATTERNS,
    course: Course.WEB_DEV,
    question: 'A page renders <ProfileForm key={userId} /> and switches between different users. Why does changing key to a new userId reset the form\'s internal state (its input values) completely, instead of ProfileForm just receiving new props?',
    options: [
      { id: 'a', text: 'A changed key tells React this is a DIFFERENT component instance, not an update to the existing one - React unmounts the old ProfileForm (discarding all its state) and mounts a brand-new one, rather than reusing the same instance with new props', isCorrect: true },
      { id: 'b', text: 'Changing the key only affects list-rendering order; a single non-list element\'s key prop has no special effect on whether React reuses or replaces the component instance', isCorrect: false },
      { id: 'c', text: 'React detects the key change and calls a special resetState() lifecycle method on the existing instance, clearing its state while keeping that same instance alive', isCorrect: false },
      { id: 'd', text: 'The key change forces every OTHER component on the entire page to also remount, since React treats any key change anywhere as a full-tree remount signal', isCorrect: false },
    ],
    explanation: 'React matches elements to component instances by type + key. A different key at the same position means "this is not the same element" - so React tears down the old instance (and its state) entirely and creates a fresh one, rather than diffing props onto the existing instance.',
    tags: ['key-prop', 'reset', 'reconciliation', 'react'],
    concepts: ['react-conditional-rendering'],
  },

  {
    id: 'react-key-reset-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.REACT_PATTERNS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'A parent renders <Counter key={userId} />. The user clicks Counter\'s increment button twice while userId is 1 (count becomes 2), then userId changes to 2. What does Counter\'s count display immediately after that userId change?',
    code: `function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

// parent renders: <Counter key={userId} />`,
    expectedOutput: '0',
    explanation: 'Changing the key prop makes React treat <Counter key={2} /> as an entirely new component instance rather than an update to the existing one - the old Counter (and its count=2 state) unmounts and is discarded, and a fresh Counter mounts with count reinitialized to 0.',
    hints: ['A new key means a new component instance, not an update'],
    tags: ['key-prop', 'reset', 'reconciliation', 'react'],
    concepts: ['react-conditional-rendering'],
  },

  {
    id: 'react-hoc-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.REACT_PATTERNS,
    course: Course.WEB_DEV,
    question: 'A higher-order component (HOC) like withAuth(Component) is a function that takes a component and returns a new component with extra behavior. What replaced this pattern as the preferred way to share logic between components in modern React?',
    options: [
      { id: 'a', text: 'Nothing has replaced HOCs; they remain the single recommended way to share non-visual logic between components according to current React documentation', isCorrect: false }, { id: 'b', text: 'Custom hooks - a function like useAuth() extracts the same reusable logic without wrapping components in extra layers, avoiding the "wrapper hell" and prop-name collisions that HOCs are prone to', isCorrect: true }, { id: 'c', text: 'Redux - HOCs were only ever used for state management specifically, a concern a global store now handles instead of any component-level pattern', isCorrect: false }, { id: 'd', text: 'Server components - HOCs were purely a server-rendering concept, made obsolete once components could run entirely on the server instead', isCorrect: false },
    ],
    explanation: 'Hooks let you extract and reuse stateful logic (like auth status) as a plain function call, with no extra wrapper component, no altered component tree, and no risk of prop-name collisions between multiple HOCs - which is why they largely superseded the HOC pattern.',
    tags: ['hoc', 'legacy-pattern', 'react'],
    concepts: ['react-custom-hooks'],
  },

  {
    id: 'react-renderprops-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.REACT_PATTERNS,
    course: Course.WEB_DEV,
    question: 'A render-props component looks like <DataFetcher render={data => <List data={data} />} />, passing a function as a prop that returns JSX. Why is this pattern rarely written in new React code today?',
    options: [
      { id: 'a', text: 'Render props only ever worked with class components, so function components have never been able to use this pattern in any version of React', isCorrect: false }, { id: 'b', text: 'The render-props pattern was formally removed from React, and passing a function as a prop now throws a runtime PropTypes error in every supported version', isCorrect: false }, { id: 'c', text: 'Custom hooks provide the same code-reuse benefit (sharing fetching or subscription logic) without the nested-callback structure render props require, and without needing an extra wrapper component in the tree', isCorrect: true }, { id: 'd', text: 'Render props are exclusively a Next.js server-component feature, and were never actually part of core React itself at any point', isCorrect: false },
    ],
    explanation: 'Custom hooks solve the same code-sharing problem render props were used for (subscribing to data, tracking mouse position, etc.), but as a plain function call - no wrapping component, no nested-callback indentation, and props flow through normally instead of through a render function.',
    tags: ['render-props', 'legacy-pattern', 'react'],
    concepts: ['react-custom-hooks'],
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
