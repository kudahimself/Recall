/**
 * Web Dev lessons, one per topic, in course order.
 *
 * Section 1, HTML, CSS & Tailwind: every topic.
 * Section 2, JavaScript Fundamentals: every topic.
 * Section 3, React: every topic.
 * Section 4, TypeScript: every topic.
 *
 * Prose keeps one sentence per source line (`lines`). An HTML or CSS worked
 * example shows what a browser renders, which no runner here reproduces, so
 * it sets `runs: false` (the "HTML / CSS page" kind in utils/workedKinds.ts)
 * and its output is what the page shows: the text, one displayed line per
 * line, or the values its steps name. Every example was rendered in headless
 * Chromium at the viewport widths its first-line comment gives, the Tailwind
 * ones with Tailwind 4 and its default theme, and the output was read off
 * the rendered page.
 *
 * A JavaScript worked example runs on node under check-lessons.js and prints
 * its `output`; one that needs the DOM is an HTML page with a `<script>`,
 * rendered in headless Chromium like the HTML / CSS ones.
 *
 * A React worked example needs the React packages and a JSX compiler, so it
 * sets `runs: false` (the "React component" kind) and imports what it uses
 * from react, react-dom or react-router. Its first-line comment says what is
 * rendered and what the reader does, and its output is what the page shows
 * and logs after that, each state on its own line. Every example was rendered
 * with React 19 (React Router 7 for the router one) in jsdom, the interactions
 * driven with Testing Library's fireEvent, and the output read off the page.
 *
 * A TypeScript worked example is type-checked in strict mode under
 * check-lessons.js and then runs on node, printing its `output`.
 */
import { CodeLanguage, Topic, TopicLesson } from '../../types';

/** One paragraph from its sentences, one per source line. */
const lines = (...sentences: string[]) => sentences.join('\n');

export const webdevLessons: TopicLesson[] = [
  // ===== Section 1, HTML, CSS & Tailwind =====
  {
    id: 'html_basics/1',
    topicKeys: [Topic.HTML_BASICS],
    step: 1,
    title: 'HTML Basics (elements, attributes, structure)',
    idea: [
      lines(
        "HTML marks up content with elements: an opening tag, the content, and a closing tag, as in `<p>Hello</p>`.",
        "Attributes sit inside the opening tag and configure the element, as `href` gives a link its destination.",
        "A few elements are void and have no content or closing tag: `<br>`, `<img>`, `<meta>`, `<link>`.",
      ),
      lines(
        "A page is one `<html lang=\"en\">` element after `<!DOCTYPE html>`.",
        "Its `<head>` holds what the page is (charset, title, stylesheets) and its `<body>` holds what the reader sees.",
        "Elements nest: a block element such as `<p>` or `<div>` starts on a new line, an inline one such as `<a>` or `<strong>` flows inside the text.",
      ),
      lines(
        "Some attributes carry meaning beyond looks: `alt` on `<img>` is the text a screen reader reads and the browser shows when the image fails.",
        "A link opened in a new tab with `target=\"_blank\"` also gets `rel=\"noopener noreferrer\"`.",
        "Characters HTML reserves, `<` and `&`, are written as the entities `&lt;` and `&amp;`.",
      ),
    ],
    form: {
      language: CodeLanguage.HTML,
      code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- what the page is -->
    <meta charset="UTF-8">
    <title>Page title</title>
  </head>
  <body>
    <!-- what the reader sees -->
    <tag attribute="value">content</tag>
    <img src="file.jpg" alt="text">
  </body>
</html>`,
    },
    pitfall: lines(
      "Line breaks and extra spaces in the source do not show: the browser collapses any run of whitespace into one space.",
      "Use a new `<p>` for a new paragraph, `<br>` for a line break inside one, and CSS for spacing.",
    ),
    worked: {
      language: CodeLanguage.HTML,
      runs: false,
      code: `<!-- the body of a bookshop's home page -->
<h1>Corner Books</h1>
<p>Open <strong>every day</strong>,
   9 to 5.<br>Closed on 25 December.</p>
<ul>
  <li>Paperbacks &amp; comics</li>
  <li>Maps of the <em>whole</em> county</li>
</ul>
<p>See <a href="events.html">our events</a>.</p>`,
      steps: [
        "Line 2: `<h1>` is the page's main heading; its content is everything between the opening and the closing tag.",
        lines(
          "Lines 3-4: the newline and the spaces after the comma collapse into one space, so the opening hours stay on one line.",
          "Only `<br>` starts a new line, and `<strong>` is inline, so it stays inside the sentence.",
        ),
        "Lines 5-8: `<ul>` makes a bulleted list with one `<li>` per item, and `&amp;` shows as a plain `&`.",
        "Line 9: the `href` attribute gives the link its destination, a path relative to this page's folder.",
      ],
      output: `Corner Books
Open every day, 9 to 5.
Closed on 25 December.
• Paperbacks & comics
• Maps of the whole county
See our events.`,
    },
    exercises: ['html-1', 'html-linebreak-predict-1', 'html-parsons-1', 'html-cloze-2', 'html-3'],
  },
  {
    id: 'html_forms/1',
    topicKeys: [Topic.HTML_FORMS],
    step: 1,
    title: 'HTML Forms (inputs, validation, accessibility)',
    idea: [
      lines(
        "A `<form>` collects fields and sends them to its `action` URL when a submit button is pressed.",
        "With `method=\"get\"` the fields go in the URL after a `?`, for searches and filters; with `method=\"post\"` they go in the request body, for anything that changes data or holds a password.",
      ),
      lines(
        "Each field is sent as `name=value`, so a field without a `name` is never sent.",
        "The `type` of an `<input>` picks the control and its built-in check: `email`, `number`, `password`, `checkbox`, `radio`.",
        "Radio buttons that share one `name` form a group where only one can be picked, and `<select>` with `<option>` elements makes a dropdown.",
      ),
      lines(
        "Validation attributes stop the submit before it leaves the page: `required`, `minlength`, `min` and `max`, and the type's own format check.",
        "A `<label for=\"id\">` names its field for screen readers and makes the text clickable, and a `<fieldset>` with a `<legend>` names a group of fields.",
      ),
    ],
    form: {
      language: CodeLanguage.HTML,
      code: `<!-- get: fields in the URL; post: in the body -->
<form action="/url" method="post">
  <label for="id">Label</label>
  <input id="id" name="key" type="email" required>
  <fieldset>
    <legend>Group label</legend>
    <label>
      <input type="radio" name="g" value="a"> A
    </label>
    <label>
      <input type="radio" name="g" value="b"> B
    </label>
  </fieldset>
  <!-- type="submit" by default -->
  <button>Send</button>
</form>`,
    },
    pitfall: lines(
      "A label's `for` matches the input's `id`, not its `name`.",
      "The `name` is the key the server receives and the `id` is what the label points at, so give every field both.",
    ),
    worked: {
      language: CodeLanguage.HTML,
      runs: false,
      code: `<!-- filled in: Ada, 34, Child; Apply clicked -->
<form action="/card" method="post">
  <label for="reader">Full name</label>
  <input id="reader" name="reader" minlength="2">
  <label for="age">Age</label>
  <input id="age" name="age" type="number"
         min="5" max="120">
  <label for="kind">Card for</label>
  <select id="kind" name="kind">
    <option value="adult">Adult</option>
    <option value="child">Child</option>
  </select>
  <button>Apply</button>
</form>`,
      steps: [
        "Line 2: `method=\"post\"` sends the fields in the request body to `/card`, not in the URL.",
        lines(
          "Lines 3-7: each `for` matches an `id`, so clicking a label focuses its field.",
          "`minlength` and `min` / `max` would block the submit with the browser's own message if the name were one letter or the age were 200.",
        ),
        "Lines 8-12: the dropdown is sent under its own `name`, with the `value` of the option picked, not the option's text.",
        "Line 13: a `<button>` inside a form submits it, and the body is the `name=value` pairs in document order.",
      ],
      output: `POST /card
reader=Ada&age=34&kind=child`,
    },
    exercises: ['html-form-method-1', 'html-form-get-predict-1', 'html-form-parsons-1', 'html-radio-cloze-1', 'html-form-1'],
  },
  {
    id: 'html_semantic/1',
    topicKeys: [Topic.HTML_SEMANTIC],
    step: 1,
    title: 'Semantic HTML (header, nav, main, article)',
    idea: [
      lines(
        "Semantic elements say what a part of the page is, where a `<div>` says nothing.",
        "Screen readers list them as landmarks a user can jump between, search engines read them, and the next developer can see the page's shape.",
      ),
      lines(
        "A page usually has a `<header>` (often holding the `<nav>` of site links), one `<main>` for its primary content, and a `<footer>`.",
        "An `<article>` is a piece that would make sense on its own, such as a post or a product, a `<section>` is a themed part with its own heading, and an `<aside>` holds content beside the main flow.",
      ),
      lines(
        "Headings form the page's outline: one `<h1>`, then `<h2>` for its parts and `<h3>` inside those, never skipping a level for a smaller look.",
        "Some elements bring behaviour with their meaning: `<figure>` with `<figcaption>` ties a caption to an image, and `<details>` with `<summary>` is a disclosure that shows only its summary until opened.",
      ),
    ],
    form: {
      language: CodeLanguage.HTML,
      code: `<header>
  <nav><!-- site links --></nav>
</header>
<main>
  <!-- one main per page -->
  <article>
    <!-- a piece that stands on its own -->
    <h2>Heading</h2>
  </article>
  <aside><!-- beside the main flow --></aside>
</main>
<footer><!-- contact, copyright --></footer>`,
    },
    pitfall: lines(
      "Choose the element by meaning, never by its default look.",
      "A heading level that sets the outline must not skip from `<h1>` to `<h3>` to get smaller text, and a block of links that is not the site navigation does not need a `<nav>`: size and spacing are CSS's job.",
    ),
    worked: {
      language: CodeLanguage.HTML,
      runs: false,
      code: `<!-- a blog page, as a screen reader lists it -->
<header>
  <h1>Corner Books</h1>
  <nav>
    <a href="/">Home</a> <a href="/blog">Blog</a>
  </nav>
</header>
<main>
  <article>
    <h2>Staff picks for May</h2>
    <p>Three novels we could not put down.</p>
  </article>
  <aside><h2>Opening hours</h2></aside>
</main>
<footer><p>12 Mill Lane</p></footer>`,
      steps: [
        "Lines 2-7: a `<header>` at the top of the page is the banner landmark, and the `<nav>` inside it is the navigation landmark.",
        "Lines 8-14: `<main>` is the main landmark, the one a screen reader's skip link jumps to, and the `<aside>` on line 13 is a complementary landmark.",
        "Lines 9-12: the `<article>` is not a landmark, but its `<h2>` puts the post in the heading outline under the page's `<h1>`.",
        "Line 15: a `<footer>` at the page level is the contentinfo landmark.",
      ],
      output: `Landmarks: banner, navigation, main,
  complementary, contentinfo
Headings: h1 Corner Books,
  h2 Staff picks for May, h2 Opening hours`,
    },
    exercises: ['html-sem-1', 'html-details-predict-1', 'html-sem-parsons-1', 'html-sem-cloze-1', 'html-sem-aside-1'],
  },
  {
    id: 'css_basics/1',
    topicKeys: [Topic.CSS_BASICS],
    step: 1,
    title: 'CSS Basics (selectors, box model, colors)',
    idea: [
      lines(
        "A CSS rule is a selector and a block of `property: value;` declarations.",
        "The selector picks elements: `p` every paragraph, `.card` every element with that class, `#intro` the one element with that id.",
        "Custom properties hold values you reuse: declare `--accent: crimson;` on `:root` and read it with `var(--accent)`.",
      ),
      lines(
        "When several rules set the same property on one element, the cascade picks one.",
        "Specificity decides first: an inline `style` beats an id, an id beats a class, a class beats an element.",
        "Only when specificity ties does the later rule win, and a property such as `color` that no rule sets is inherited from the parent.",
      ),
      lines(
        "Every element is a box: content, then `padding`, then `border`, then `margin`, from the inside out.",
        "By default (`box-sizing: content-box`) `width` sizes the content alone, so padding and border are added to it; with `box-sizing: border-box` the width includes them.",
      ),
    ],
    form: {
      language: CodeLanguage.CSS,
      code: `/* a custom property */
:root { --name: value; }

/* selector: p, .class or #id */
selector {
  property: value;
  color: var(--name);
  /* content, then padding, border, margin */
  width: 200px;
  padding: 10px;
  border: 1px solid;
  margin: 10px;
}`,
    },
    pitfall: lines(
      "A later rule does not beat a more specific one.",
      "Specificity is compared first, `#id` over `.class` over element, and source order only breaks a tie, so `.note` written after `#intro` still loses to it.",
    ),
    worked: {
      language: CodeLanguage.HTML,
      runs: false,
      code: `<style>
  :root { --accent: crimson; }
  #intro { color: navy; }
  p { color: black; }
  .note {
    color: var(--accent);
    width: 300px;
    padding: 10px;
    border: 2px solid;
  }
</style>
<p id="intro" class="note">Welcome to the shop.</p>
<p class="note">Sale ends Sunday.</p>
<p>Open 9 to 5.</p>`,
      steps: [
        "Line 2: `--accent` is declared on `:root`, so every element can read it with `var(--accent)`.",
        lines(
          "Line 12: the first paragraph matches all three rules on lines 3-10.",
          "The id rule is the most specific, so it is navy even though `.note` comes later.",
        ),
        "Line 13: the second paragraph matches `p` and `.note`, and the class beats the element, so it is crimson.",
        "Lines 7-9: both `.note` boxes are 300 + 2 x 10 + 2 x 2 = 324px wide, because the default box-sizing adds padding and border to `width`.",
        "Line 14: the last paragraph matches only `p`, so it is black and as wide as the page.",
      ],
      output: `Welcome to the shop.  navy, box 324px wide
Sale ends Sunday.     crimson, box 324px wide
Open 9 to 5.          black, full width`,
    },
    exercises: ['css-basic-1', 'css-basic-3', 'css-box-width-predict-1', 'css-selector-cloze-1', 'css-selector-1'],
  },
  {
    id: 'css_layout/1',
    topicKeys: [Topic.CSS_LAYOUT],
    step: 1,
    title: 'CSS Layout (flexbox, grid, positioning)',
    idea: [
      lines(
        "`display: flex` lays a container's children out in one row (or a column with `flex-direction: column`).",
        "`justify-content` places them along that line, `align-items` across it, and `gap` spaces them.",
        "`flex-grow` shares out the space left over, in the ratio of the grow values, and `flex: 1` grows an item from a starting size of zero.",
      ),
      lines(
        "`display: grid` lays children out in rows and columns at once.",
        "`grid-template-columns: repeat(3, 1fr)` makes three equal columns, and items fill the cells in order, wrapping to a new row when a row is full.",
      ),
      lines(
        "`position` takes an element out of that flow.",
        "`relative` nudges it from where it would be, `absolute` places it against its nearest positioned ancestor, `fixed` against the viewport, and `sticky` keeps it in flow until it would scroll past its `top` offset.",
        "Among positioned elements, a higher `z-index` sits in front.",
      ),
    ],
    form: {
      language: CodeLanguage.CSS,
      code: `.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
/* a share of the leftover space */
.item { flex-grow: 1; }

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

/* placed against the nearest positioned ancestor */
.parent { position: relative; }
.child { position: absolute; top: 0; right: 0; }`,
    },
    pitfall: lines(
      "An absolutely positioned element is placed against its nearest positioned ancestor, not its parent.",
      "Without `position: relative` on the parent, a badge meant for a card's corner lands in the corner of the page, so set it on the box you mean.",
    ),
    worked: {
      language: CodeLanguage.HTML,
      runs: false,
      code: `<style>
  .bar { display: flex; align-items: center;
         gap: 20px; width: 600px; }
  .logo { width: 100px; }
  .search { flex: 1; }
  .basket { position: relative; width: 60px; }
  .count { position: absolute;
           top: -8px; right: -8px; }
</style>
<div class="bar">
  <div class="logo">Books</div>
  <div class="search">Search</div>
  <div class="basket">
    Basket<span class="count">3</span>
  </div>
</div>`,
      steps: [
        "Lines 2-3: the bar is a flex row, its three items centred vertically with 20px between them.",
        "Line 5: `flex: 1` starts the search box at zero and gives it all the leftover space, 600 - 100 - 60 - 2 x 20 = 400px.",
        lines(
          "Lines 6-8: the basket is positioned, so the count is placed against the basket's box, 8px beyond its top-right corner.",
          "Without `position: relative` on line 6 it would be placed against the page instead.",
        ),
        "Lines 10-16: the three children sit in source order in one row, and the count is out of the flow, so it takes no room in the bar.",
      ],
      output: `Books 100px | Search 400px | Basket 60px,
  one row, centred vertically
count "3": 8px above and 8px right of
  the basket's top-right corner`,
    },
    exercises: ['css-position-mcq-1', 'css-layout-cloze-1', 'css-layout-cloze-2', 'css-flex-grow-predict-1', 'css-badge-1'],
  },
  {
    id: 'css_responsive/1',
    topicKeys: [Topic.CSS_RESPONSIVE],
    step: 1,
    title: 'Responsive Design (media queries, mobile-first)',
    idea: [
      lines(
        "A responsive page adapts its layout to the screen.",
        "It starts with `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">`, without which a phone renders the page at desktop width and shrinks it.",
      ),
      lines(
        "Mobile-first CSS writes the phone layout as the base rules, then adds `@media (min-width: ...)` blocks that change it from each breakpoint up.",
        "Common breakpoints are about 640px, 768px and 1024px.",
        "Media queries also read the user's settings, such as `(prefers-reduced-motion: reduce)` and `(orientation: landscape)`.",
      ),
      lines(
        "Fluid values help between breakpoints: `max-width` with `margin: 0 auto` caps and centres a container, and `clamp(min, preferred, max)` scales a size with the viewport inside two limits.",
        "A container query (`container-type` and `@container`) adapts a component to its own box instead of the screen.",
      ),
    ],
    form: {
      language: CodeLanguage.CSS,
      code: `/* the phone layout: no media query */
.thing { }

/* from 768px up */
@media (min-width: 768px) {
  .thing { }
}

/* from 1024px up: the larger one last */
@media (min-width: 1024px) {
  .thing { }
}

.wrap { max-width: 1200px; margin: 0 auto; }
h1 { font-size: clamp(min, preferred, max); }`,
    },
    pitfall: lines(
      "A media query adds no specificity, so when two queries match, the one later in the file wins.",
      "In mobile-first CSS write the base rule first and the `min-width` queries from the smallest breakpoint to the largest, or the larger one is always overridden.",
    ),
    worked: {
      language: CodeLanguage.HTML,
      runs: false,
      code: `<meta name="viewport"
      content="width=device-width, initial-scale=1">
<style>
  .wrap { max-width: 960px; margin: 0 auto; }
  .title { font-size: 24px; }
  .books { display: flex; flex-direction: column; }
  @media (min-width: 640px) {
    .title { font-size: 32px; }
    .books { flex-direction: row; }
  }
  @media (min-width: 1024px) {
    .title { font-size: 40px; }
  }
</style>
<div class="wrap">
  <h1 class="title">New in</h1>
  <div class="books"><p>A</p><p>B</p><p>C</p></div>
</div>`,
      steps: [
        "Lines 1-2: the viewport tag makes a 375px phone lay the page out at 375px, not at a desktop width.",
        "Line 4: the wrapper never grows past 960px, and `margin: 0 auto` splits the rest of a 1280px screen into 160px on each side.",
        "Lines 5-6: the base rules are the phone layout, a 24px title over a column of books, and apply at every width.",
        lines(
          "Lines 7-10: from 640px up the title grows to 32px and the books line up in a row.",
          "From 1024px up both queries match, and the later one (lines 11-13) wins, so the title is 40px.",
        ),
      ],
      output: `375px:  title 24px, books in a column
800px:  title 32px, books in a row
1280px: title 40px, books in a row, the
        wrapper 960px with 160px each side`,
    },
    exercises: ['css-resp-2', 'css-resp-parsons-1', 'css-resp-cloze-1', 'css-resp-order-predict-1', 'css-resp-5'],
  },
  {
    id: 'tailwind/1',
    topicKeys: [Topic.TAILWIND],
    step: 1,
    title: 'Tailwind CSS (utility classes, responsive)',
    idea: [
      lines(
        "Tailwind styles an element with small utility classes in its `class` attribute, each setting about one property: `p-4` padding, `bg-white` background, `rounded-lg` corners, `shadow-md` a shadow.",
        "Sizes come from a scale (`p-4` is 1rem, `text-sm` is 0.875rem), and square brackets give a one-off value, as `w-[137px]` does.",
      ),
      lines(
        "A variant prefix applies a class only in some state: `hover:`, `focus-visible:`, `disabled:`, `dark:`, or `group-hover:` for a child of a hovered `group`.",
        "Breakpoint prefixes are mobile-first: an unprefixed class applies at every width, and `sm:` (640px), `md:` (768px) and `lg:` (1024px) apply from that width up.",
      ),
      lines(
        "Tailwind 4 is set up in CSS: `@import \"tailwindcss\";`, with your own tokens in an `@theme` block, such as `--color-brand-500`, which then works in `bg-brand-500` and `text-brand-500`.",
        "A `tailwind.config.js` file is the Tailwind 3 way, which you will still meet in older projects.",
      ),
    ],
    form: {
      language: CodeLanguage.HTML,
      code: `<!-- base classes apply at every width -->
<!-- md: applies from 768px up -->
<div class="flex flex-col gap-4 md:flex-row">
  <!-- hover: and focus-visible: in a state -->
  <button class="bg-color-600 px-4 py-2
                 hover:bg-color-700
                 focus-visible:outline-2">
    Label
  </button>
</div>`,
    },
    pitfall: lines(
      "`sm:` does not mean \"on small screens\"; it means \"from 640px up\".",
      "Write the phone style without a prefix and add `sm:`, `md:` or `lg:` for wider screens, and use a `max-sm:` variant only when a style must stop at a breakpoint.",
    ),
    worked: {
      language: CodeLanguage.HTML,
      runs: false,
      code: `<!-- Tailwind 4, default theme -->
<div class="flex flex-col gap-2
            sm:flex-row sm:items-center">
  <p class="text-sm text-stone-600 sm:text-base">
    Book club meets on Thursday.
  </p>
  <button class="rounded bg-emerald-600 px-4 py-2
                 text-white hover:bg-emerald-700">
    Join
  </button>
  <span class="hidden lg:inline">Free tea.</span>
</div>`,
      steps: [
        "Lines 2-3: `flex flex-col` stacks the children on a phone, and from 640px up `sm:flex-row` lines them up in a row, centred by `sm:items-center`.",
        "Lines 4-6: the text is 14px (`text-sm`) on a phone and 16px (`sm:text-base`) from 640px up.",
        "Lines 7-8: the button is emerald-600 with white text, and `hover:` darkens it to emerald-700 under the pointer.",
        "Line 11: `hidden` removes the span at every width until `lg:inline` shows it from 1024px up, so a 400px phone never shows it.",
      ],
      output: `400px:  14px text above Join; no "Free tea."
1024px: 16px text, Join, "Free tea." in one
        row, centred vertically
hover:  Join from emerald-600 to emerald-700`,
    },
    exercises: ['tw-1', 'tw-breakpoint-predict-1', 'tw-cloze-1', 'tw-cloze-2', 'tw-2'],
  },
  {
    id: 'html_css_project/1',
    topicKeys: [Topic.HTML_CSS_PROJECT],
    step: 1,
    title: 'HTML/CSS Project',
    idea: [
      lines(
        "A project puts this section together: semantic HTML for the structure, then Tailwind classes for the look and the layout.",
        "Start from the markup alone, a `<section>` or `<header>`, an `<article>` per card, headings in order and real `<a>` and `<button>` elements, and check it reads well unstyled.",
      ),
      lines(
        "Then style it mobile-first: lay it out for a phone with unprefixed classes, one column or a stacked flex, and add `md:` or `lg:` classes where the wider screen has room.",
        "A grid of cards is `grid grid-cols-1 md:grid-cols-3 gap-6`, and a navbar swaps menus with `hidden md:flex` on the desktop links and `md:hidden` on the menu button.",
      ),
      lines(
        "Cap the width of the content with `max-w-*` and `mx-auto` so lines stay readable on large monitors.",
        "Finish with states: `hover:` and `focus-visible:` styles, with `transition` so they change smoothly.",
      ),
    ],
    form: {
      language: CodeLanguage.HTML,
      code: `<!-- structure first, then classes -->
<section class="px-4 py-16">
  <!-- a readable width, centred -->
  <div class="mx-auto max-w-5xl">
    <!-- the phone layout, then md up -->
    <div class="grid grid-cols-1 md:grid-cols-3">
      <article class="... hover:... transition">
        <h3>Heading</h3>
      </article>
    </div>
  </div>
</section>`,
    },
    pitfall: lines(
      "Class order in the attribute never decides which class wins: the prefix does.",
      "`md:grid-cols-1 grid-cols-3` is still three columns on a phone and one from md up, so write the phone layout unprefixed and only the wider layouts with a breakpoint.",
    ),
    worked: {
      language: CodeLanguage.HTML,
      runs: false,
      code: `<!-- Tailwind 4, default theme -->
<section class="bg-stone-50 px-4 py-12">
  <div class="mx-auto max-w-4xl">
    <h2 class="text-2xl font-bold md:text-4xl">
      Book of the month
    </h2>
    <article class="mt-6 flex flex-col gap-6
                    md:flex-row">
      <img class="w-full md:w-48" src="cover.jpg"
           alt="Cover of The Long Way Home">
      <div>
        <h3>The Long Way Home</h3>
        <a class="rounded bg-stone-900 px-5 py-2
                  text-white hover:bg-stone-700"
           href="/reserve">Reserve a copy</a>
      </div>
    </article>
  </div>
</section>`,
      steps: [
        "Lines 2-3: the section pads its content, and the inner div caps it at 56rem (896px) and centres it with `mx-auto`.",
        "Lines 4-6: the `<h2>` is 24px on a phone and 36px from 768px up.",
        "Lines 7-10: the article stacks the cover above the text on a phone, with the cover full width, and from `md:` up puts a 12rem (192px) cover beside the text.",
        "Lines 13-15: the link is styled as a button, and `hover:` lightens its background.",
      ],
      output: `400px:  heading 24px; cover full width,
        title and Reserve link below it
1280px: heading 36px; content 896px wide,
        centred; 192px cover beside the text`,
    },
    exercises: ['htmlcss-project-mcq-1', 'htmlcss-project-predict-1', 'htmlcss-project-2'],
  },
  // ===== Section 2, JavaScript Fundamentals =====
  {
    id: 'js_variables_types/1',
    topicKeys: [Topic.JS_VARIABLES_TYPES],
    step: 1,
    title: 'Variables, Types & Destructuring',
    idea: [
      lines(
        "Declare a variable with `const` when it is never reassigned and with `let` when it is.",
        "Both are block-scoped: they exist only inside the `{ }` they are declared in.",
        "`var` is the older, function-scoped form, hoisted as `undefined` before its line runs; you will meet it in old code, but new code does not use it.",
      ),
      lines(
        "A value is a primitive (`string`, `number`, `boolean`, `null`, `undefined`, `bigint`, `symbol`) or an object, and arrays and functions are objects.",
        "`typeof` names the kind, with one historical quirk: `typeof null` is `\"object\"`.",
        "In a condition, `false`, `0`, `\"\"`, `null`, `undefined` and `NaN` are falsy, and every other value is truthy, `[]` and `\"0\"` included.",
      ),
      lines(
        "Destructuring unpacks values into variables in one statement.",
        "`{ }` takes an object's properties by name, in any order, and `[ ]` takes an array's items by position.",
        "A `= value` in the pattern is the default for a value that is missing.",
      ),
    ],
    form: {
      language: CodeLanguage.JAVASCRIPT,
      code: `const fixed = value;          // never reassigned: the default choice
let counter = 0;              // reassigned later
counter = counter + 1;

typeof value;                 // "string", "number", "boolean", "object", ...
a === b;                      // same type and same value, no conversion
cond ? ifTrue : ifFalse;      // one of two values

const { key, other = "default" } = obj;  // by property name
const [first, second] = arr;             // by position`,
    },
    pitfall: lines(
      "`==` converts both sides before it compares, so `0 == \"\"` and `\"1\" == 1` are both `true`.",
      "Compare with `===` and `!==`, which never convert, and convert on purpose with `Number(text)` when you need a number.",
    ),
    worked: {
      language: CodeLanguage.JAVASCRIPT,
      code: `const book = { title: "Emma", stock: 0, series: null };
const { title, stock, series, pages = 300 } = book;
const [shelf, section] = ["fiction", "classics"];

console.log(typeof stock, typeof series, typeof pages);
console.log(stock == "", stock === "");
console.log(stock ? "in stock" : "sold out");

let label = title + " / " + section;
label = label.toUpperCase();
console.log(label, shelf);`,
      steps: [
        lines(
          "Line 2: object destructuring takes `title`, `stock` and `series` by name.",
          "`book` has no `pages`, so the default 300 applies.",
        ),
        "Line 3: array destructuring goes by position, so `shelf` is `\"fiction\"` and `section` is `\"classics\"`.",
        "Line 5: `stock` is a number, and `series` holds `null`, which `typeof` reports as `\"object\"`.",
        lines(
          "Line 6: `==` converts `\"\"` to the number 0, so `0 == \"\"` is `true`, while `===` compares a number with a string and is `false`.",
          "Line 7: 0 is falsy, so the ternary picks `\"sold out\"`.",
        ),
        "Lines 9-10: `label` is declared with `let` because line 10 reassigns it; `const` there would throw a TypeError.",
      ],
      output: `number object number
true false
sold out
EMMA / CLASSICS fiction`,
    },
    exercises: ['js-var-1', 'js-basics-predict-1', 'js-basics-predict-5', 'js-var-destr-cloze-1', 'js-var-2'],
  },
  {
    id: 'js_functions/1',
    topicKeys: [Topic.JS_FUNCTIONS],
    step: 1,
    title: 'Functions (arrow, closures, higher-order)',
    idea: [
      lines(
        "Declare a function with `function name(params) { ... }`, or store one in a variable as a function expression or an arrow function, `const name = (params) => ...`.",
        "A declaration is hoisted with its body, so it can be called above its line; an expression or an arrow exists only once its line has run.",
        "A parameter written `param = value` takes that default when its argument is missing or `undefined`.",
      ),
      lines(
        "An arrow with an expression body returns that expression.",
        "An arrow with a `{ }` body, like every other function, returns only what a `return` statement gives it, and `undefined` otherwise.",
      ),
      lines(
        "Functions are values: a higher-order function takes a function as an argument, a callback, or returns one.",
        "A returned function is a closure: it keeps the variables of the scope it was made in, after that outer call has finished.",
        "`...args` in a parameter list collects the arguments into an array, and `fn(...args)` spreads them back out.",
      ),
    ],
    form: {
      language: CodeLanguage.JAVASCRIPT,
      code: `function name(param, withDefault = 1) {  // hoisted with its body
  return param * withDefault;
}
const arrow = (param) => param * 2;       // expression body: returned
const block = (param) => {                // block body: needs return
  return param * 2;
};

const outer = (saved) => (x) => saved + x;     // returns a closure over saved
const wrap = (fn) => (...args) => fn(...args); // takes and returns a function`,
    },
    pitfall: lines(
      "An arrow with braces has a block body, so `(n) => { n * 2 }` works out the product and returns `undefined`.",
      "Drop the braces for a single expression or write `return` inside them, and wrap an object literal in parentheses to return it: `() => ({ id: 1 })`.",
    ),
    worked: {
      language: CodeLanguage.JAVASCRIPT,
      code: `console.log(typeof early, early());
function early() {
  return "declarations hoist";
}
function discount(price, percent = 10) {
  return price - (price * percent) / 100;
}
const makeLabel = (shop) => (title) => shop + ": " + title;
const corner = makeLabel("Corner Books");
const twice = (fn) => (x) => fn(fn(x));

console.log(discount(200), discount(200, 25), discount(200, undefined));
console.log(corner("Emma"));
console.log(twice(discount)(200));`,
      steps: [
        "Lines 1-4: `early` is a declaration, hoisted with its body, so line 1 can already call it.",
        "Lines 5-7: `percent` defaults to 10 when it is missing or `undefined`, so line 12 prints 180, then 150 with 25 passed, then 180 again.",
        "Lines 8-9: `makeLabel` returns an arrow that closes over `shop`, so `corner` still knows `\"Corner Books\"` after `makeLabel` has returned.",
        lines(
          "Line 10: `twice` is higher-order: it takes `fn` and returns a function that calls it twice.",
          "Line 14 passes `discount` itself, not `discount()`, so 200 becomes 180, then 162.",
        ),
      ],
      output: `function declarations hoist
180 150 180
Corner Books: Emma
162`,
    },
    exercises: ['js-fn-decl-expr-mcq-1', 'js-fn-default-params-predict-1', 'js-fn-callback-parsons-1', 'js-fn-closure-cloze-1', 'js-fn-1'],
  },
  {
    id: 'js_arrays/1',
    topicKeys: [Topic.JS_ARRAYS],
    step: 1,
    title: 'Arrays (map, filter, reduce, find)',
    idea: [
      lines(
        "An array is an ordered list, read by index from 0, with `length` for its size.",
        "Some methods change the array in place: `push` and `pop` work at the end, `unshift` and `shift` at the front, `splice(start, count)` removes from the middle, and `sort` and `reverse` reorder it.",
        "Others leave it as it is and return something new: `slice`, `map`, `filter`, `concat` and `toSorted`.",
      ),
      lines(
        "The workhorses take a callback that receives one element at a time.",
        "`map` returns a new array of the callback's results, one per element, and `filter` a new array of the elements whose callback returned a truthy value.",
        "`find` returns the first matching element itself, or `undefined` when none matches.",
      ),
      lines(
        "`reduce((acc, item) => next, start)` folds the array into one value: the accumulator begins as `start`, and each callback's return becomes the next `acc`.",
        "Chained, they read like a pipeline: filter, then map, then reduce.",
      ),
    ],
    form: {
      language: CodeLanguage.JAVASCRIPT,
      code: `arr.push(x);                           // changes arr in place
const part = arr.slice(start, end);    // a new array, end not included

const results = arr.map((item) => f(item));          // one result per item
const kept = arr.filter((item) => test(item));       // the items that pass
const match = arr.find((item) => item.id === id);    // the item, or undefined
const total = arr.reduce((acc, item) => acc + item, 0); // one value`,
    },
    pitfall: lines(
      "`sort()` sorts the array in place and returns that same array, so `const sorted = arr.sort()` reorders `arr` too.",
      "Without a comparator it also compares the items as strings, putting 10 before 9.",
      "When the original must stay as it was, use `arr.toSorted((a, b) => a - b)`, or `[...arr].sort(...)` in older code.",
    ),
    worked: {
      language: CodeLanguage.JAVASCRIPT,
      code: `const books = [
  { title: "Emma", price: 8, stock: 3 },
  { title: "Dune", price: 12, stock: 0 },
  { title: "Ulysses", price: 15, stock: 2 },
];
const inStock = books.filter((b) => b.stock > 0);
const titles = inStock.map((b) => b.title);
const shelfValue = inStock.reduce((sum, b) => sum + b.price * b.stock, 0);
const dune = books.find((b) => b.title === "Dune");
const byPrice = books.toSorted((a, b) => b.price - a.price);

console.log(titles.join(", "), shelfValue);
console.log(dune.stock, books.find((b) => b.price > 20));
console.log(byPrice[0].title, books[0].title);`,
      steps: [
        "Lines 6-7: `filter` keeps Emma and Ulysses, the books with stock, and `map` turns those two objects into their titles.",
        "Line 8: `reduce` starts `sum` at 0 and adds each book's value: 8 * 3 = 24, then 15 * 2 = 30, so 54.",
        "Line 9: `find` returns the Dune object itself, so line 13 reads its `stock`, 0; no book costs over 20, so the second `find` is `undefined`.",
        "Line 10: `toSorted` returns a new array, dearest first, and `books` keeps its order, so line 14 prints Ulysses, then Emma.",
      ],
      output: `Emma, Ulysses 54
0 undefined
Ulysses Emma`,
    },
    exercises: ['js-misc-mcq-6', 'js-arr-slice-splice-predict-1', 'js-basics-parsons-5', 'js-basics-cloze-10', 'js-arr-2'],
  },
  {
    id: 'js_objects/1',
    topicKeys: [Topic.JS_OBJECTS],
    step: 1,
    title: 'Objects & Spread',
    idea: [
      lines(
        "An object groups values under keys: `{ title: \"Emma\", stock: 3 }`.",
        "Read a fixed key with a dot, `book.title`, and a key held in a variable with brackets, `book[key]`.",
        "A function stored on an object is a method, and inside it `this` is the object before the dot of the call.",
      ),
      lines(
        "Objects and arrays are held by reference.",
        "`const b = a` gives the same object a second name, so a change made through `b` shows through `a`, and `===` on two objects is `true` only when they are the same object.",
        "`const` stops the name being reassigned, not the object being changed.",
      ),
      lines(
        "Spread copies properties into a new object: `{ ...a, stock: 0 }` copies `a`, then the keys written after it override.",
        "Destructuring follows the shape, as in `const { address: { town } } = shop`.",
        "A `class` is a template for many objects of one shape: its `constructor` sets `this.field`, and every instance made with `new` shares its methods.",
      ),
    ],
    form: {
      language: CodeLanguage.JAVASCRIPT,
      code: `const obj = { key: value, method() { return this.key; } };
obj.key;                                // a fixed key
obj[variable];                          // the key held in a variable

const same = obj;                       // a second name, not a copy
const copy = { ...obj, key: newValue }; // a new object, later keys win
const { key, nested: { inner } } = obj; // unpack by shape

class Thing {
  constructor(value) { this.value = value; }
  describe() { return this.value; }
}
const one = new Thing(value);`,
    },
    pitfall: lines(
      "Spread makes a shallow copy: it copies the top-level properties, but a nested object comes across as a reference, so the copy and the original share it.",
      "To change a nested value, spread that level too, `{ ...obj, inner: { ...obj.inner, x: 1 } }`, or make a full deep copy with `structuredClone(obj)`.",
    ),
    worked: {
      language: CodeLanguage.JAVASCRIPT,
      code: `const book = { title: "Emma", stock: 3, details: { pages: 474 } };
const alias = book;
alias.stock = 2;
const copy = { ...book, stock: 10 };
copy.details.pages = 500;
const { details: { pages } } = book;
const key = "stock";
console.log(book.stock, book[key], copy.stock);
console.log(pages, copy.details === book.details);
class Shelf {
  constructor(label) { this.label = label; this.books = []; }
  add(item) { this.books.push(item); return this.books.length; }
}
const classics = new Shelf("Classics");
console.log(classics.add(book), classics.label);`,
      steps: [
        "Lines 2-3: `alias` is the same object as `book`, so setting `alias.stock` sets `book.stock` to 2.",
        "Line 4: the spread copies `book`, and `stock: 10`, written after it, overrides the copied 2 in the copy only.",
        lines(
          "Line 5: the copy is shallow, so `copy.details` is the very object `book.details` holds, and the change shows through both.",
          "Line 9 prints 500 and `true`.",
        ),
        "Lines 6-7: nested destructuring reads `book.details.pages`, and `book[key]` reads the key held in `key`.",
        "Lines 10-15: the constructor sets each instance's own `label` and `books`, and `add` uses `this` to reach them.",
      ],
      output: `2 2 10
500 true
1 Classics`,
    },
    exercises: ['js-basics-predict-4', 'js-obj-class-parsons-1', 'js-obj-method-cloze-1', 'js-obj-nested-destr-cloze-1', 'js-obj-7'],
  },
  {
    id: 'js_async/1',
    topicKeys: [Topic.JS_ASYNC],
    step: 1,
    title: 'Async/Await & Promises',
    idea: [
      lines(
        "A Promise stands for a value that arrives later: it is pending, then fulfilled with a value or rejected with an error.",
        "`fetch` returns one, every `async` function returns one, and `new Promise((resolve, reject) => ...)` wraps a callback API such as a timer in one.",
      ),
      lines(
        "`p.then(fn)` calls `fn` with the value once `p` is fulfilled and returns a new Promise of what `fn` returns, so `.then` calls chain, and `.catch(fn)` handles a rejection anywhere above it.",
        "`async` and `await` are the same machinery written top to bottom: `await p` pauses the `async` function until `p` settles, then gives its value or throws its error for `try` / `catch` to handle.",
        "An `async` function always returns a Promise, even when it returns a plain value.",
      ),
      lines(
        "Callbacks run only after the current code has finished: Promise callbacks first, as microtasks, then timers such as `setTimeout(fn, 0)`.",
        "Independent work runs at the same time with `await Promise.all([a, b])`, which rejects as soon as one fails, while `Promise.allSettled` waits for all and reports each.",
      ),
    ],
    form: {
      language: CodeLanguage.JAVASCRIPT,
      code: `const p = new Promise((resolve, reject) => {
  // later: resolve(value) on success, reject(error) on failure
});

p.then((value) => next(value))       // a new Promise of next's result
  .catch((error) => handle(error));  // any rejection above

async function name() {
  try {
    const value = await p;           // pauses here, then unwraps
    const [a, b] = await Promise.all([p1, p2]); // both at once
    return value;                    // the caller receives a Promise
  } catch (error) {
    // a rejected await lands here
  }
}`,
    },
    pitfall: lines(
      "A missing `await` does not fail where it is missing: the variable holds a pending Promise, and the code goes on with it.",
      "`const data = getJson(url)` makes `data.title` `undefined`, so await every Promise whose value you use, and remember that whoever calls an `async` function has to await it too.",
    ),
    worked: {
      language: CodeLanguage.JAVASCRIPT,
      code: `const stock = { Emma: 3, Dune: 0 };
function checkStock(title) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (title in stock) resolve(stock[title]);
      else reject(new Error("no such book: " + title));
    }, 10);
  });
}
async function report(title) {
  try {
    const count = await checkStock(title);
    console.log(title + ": " + count);
  } catch (err) {
    console.log("failed, " + err.message);
  }
}
console.log("start");
report("Emma").then(() => report("Hamlet"));
console.log("waiting");`,
      steps: [
        "Lines 2-9: `checkStock` wraps a timer in a Promise that, 10 ms later, resolves with the stock count or rejects with an error.",
        "Lines 18-20: the synchronous lines run first, so `start` and `waiting` print before any callback, even though `report` is called between them.",
        "Lines 12-13: `await` pauses `report` until the timer settles, then gives the count, 3, for Emma.",
        lines(
          "Line 19: `report` returns a Promise, so `.then` starts the Hamlet check only once Emma's report has finished.",
          "Hamlet is not in `stock`, so the await throws and line 15 prints the error's message.",
        ),
      ],
      output: `start
waiting
Emma: 3
failed, no such book: Hamlet`,
    },
    exercises: ['js-async-1', 'js-async-then-predict-1', 'js-async-new-promise-parsons-1', 'js-async-try-catch-cloze-1', 'js-async-eventloop-predict-1'],
  },
  {
    id: 'js_es6_plus/1',
    topicKeys: [Topic.JS_ES6_PLUS],
    step: 1,
    title: 'ES6+ Features',
    idea: [
      lines(
        "Modern JavaScript gives short forms for things you would otherwise write by hand.",
        `A template literal, in backticks, puts values into text with \`\${expression}\` and can span lines.`,
        "`...` spreads an array or object into a new one, `[...a, x]` or `{ ...o, key: v }`, and in a destructuring pattern it collects the rest, `const [head, ...tail] = arr`.",
      ),
      lines(
        "`a?.b` reads `b` only when `a` is not `null` or `undefined`, and is `undefined` instead of throwing otherwise.",
        "`x ?? fallback` gives the fallback only when `x` is `null` or `undefined`, and `arr.at(-1)` reads the last item.",
      ),
      lines(
        "Modules split code into files: `export` a function or value by name, and `import { name } from \"./file.js\"`, with braces, brings it in under that name.",
        "A file has at most one `export default`, imported without braces under any name you choose.",
        "You will still meet `require` and `module.exports` in older Node code; that is CommonJS, the system ES modules replaced.",
      ),
    ],
    form: {
      language: CodeLanguage.JAVASCRIPT,
      code: `const text = \`Total: \${count * price}\`;     // template literal
const merged = { ...base, key: newValue };  // spread: later keys win
const [head, ...rest] = list;               // rest: the remaining items

const value = obj?.nested?.key ?? "fallback"; // safe read, default for null/undefined
const last = list.at(-1);

// file.js
export function helper() {}                 // named export
export default function main() {}           // one default per file
// other.js
import main, { helper } from "./file.js";`,
    },
    pitfall: lines(
      "`||` replaces every falsy value, so `count || 10` turns a real 0 into 10 and `label || \"none\"` turns `\"\"` into `\"none\"`.",
      "When only a missing value should get the default, use `??`, which keeps 0, `\"\"` and `false`.",
    ),
    worked: {
      language: CodeLanguage.JAVASCRIPT,
      code: `const order = {
  id: 7,
  customer: { first: "Ada", address: null },
  items: ["Emma", "Dune", "Ulysses"],
  discount: 0,
};
const [firstItem, ...others] = order.items;
const town = order.customer.address?.town ?? "collect in shop";
const receipt = \`Order \${order.id} for \${order.customer.first}:
\${firstItem} and \${others.length} more\`;
const paid = { ...order, paid: true };

console.log(receipt);
console.log(town, order.discount ?? 10, order.discount || 10);
console.log(order.items.at(-1), "paid" in order, paid.paid);`,
      steps: [
        "Line 7: the rest element collects every item after the first, so `firstItem` is Emma and `others` holds the other two.",
        "Line 8: `address` is `null`, so `?.` stops there with `undefined` instead of throwing, and `??` supplies the fallback.",
        `Lines 9-10: the template literal fills in each \`\${...}\` and keeps its line break, so the receipt prints on two lines.`,
        "Line 14: `discount` is 0, which `??` keeps because it is not `null` or `undefined`, while `||` treats 0 as falsy and gives 10.",
        "Lines 11 and 15: the spread builds a new object, so `paid` exists on the copy and not on `order`.",
      ],
      output: `Order 7 for Ada:
Emma and 2 more
collect in shop 0 10
Ulysses false true`,
    },
    exercises: ['js-es6-modules-mcq-1', 'js-basics-predict-8', 'js-basics-parsons-2', 'js-es6-optchain-cloze-1', 'js-es6-3'],
  },
  {
    id: 'js_dom/1',
    topicKeys: [Topic.JS_DOM],
    step: 1,
    title: 'DOM Manipulation',
    idea: [
      lines(
        "The DOM is the page as a tree of element objects that JavaScript can read and change.",
        "`document.querySelector(selector)` returns the first element matching a CSS selector, or `null`, and `querySelectorAll` returns every match, while `getElementById(\"id\")` takes the bare id, without `#`.",
        "Load the script with `<script defer>` or at the end of `<body>`, so the elements exist when it runs.",
      ),
      lines(
        "Change an element through its properties: `textContent` for its text, `classList.add`, `remove` and `toggle` for its classes, and `dataset` for its `data-*` attributes.",
        "Build a new element with `document.createElement(\"li\")`; nothing shows until you insert it with `append` or `appendChild`.",
      ),
      lines(
        "`el.addEventListener(\"click\", handler)` calls the handler with an event object on each click, and `event.target` is the element actually clicked.",
        "Events bubble from that element up through its ancestors, so one listener on a list can handle clicks on every item, items added later included.",
        "`event.preventDefault()` stops the browser's own action, such as a form submit reloading the page.",
      ),
    ],
    form: {
      language: CodeLanguage.JAVASCRIPT,
      code: `const el = document.querySelector(".selector");  // first match, or null
const all = document.querySelectorAll("li");      // every match

el.textContent = "plain text";                    // never parsed as HTML
el.classList.toggle("class-name");
el.dataset.key;                                   // reads data-key="..."

const child = document.createElement("tag");
parent.append(child);                             // now it is on the page

parent.addEventListener("click", (event) => {
  event.target;                                   // the element clicked
});`,
    },
    pitfall: lines(
      "`innerHTML` parses its string as HTML, so `el.innerHTML = userInput` lets whatever a visitor types add elements and run script on your page.",
      "Put text from users or from an API in with `textContent`, and build markup with `createElement` and `append`.",
    ),
    worked: {
      language: CodeLanguage.HTML,
      runs: false,
      code: `<!-- a bookshop's reading list -->
<ul id="list"></ul>
<p id="count">0 read</p>
<script>
  const list = document.querySelector("#list");
  for (const title of ["Emma", "Dune"]) {
    const li = document.createElement("li");
    li.textContent = title;
    list.append(li);
  }
  list.addEventListener("click", (event) => {
    event.target.classList.toggle("done");
    const read = list.querySelectorAll(".done").length;
    document.querySelector("#count").textContent = read + " read";
  });
  list.children[1].click();
</script>`,
      steps: [
        "Lines 2-3: the page starts with an empty list and a paragraph reading `0 read`.",
        "Lines 6-10: the loop builds one `<li>` per title, sets its text with `textContent`, and `append` puts it on the page.",
        "Line 11: one listener on the `<ul>` handles clicks on every item, because a click on an `<li>` bubbles up to its list.",
        lines(
          "Line 16: `click()` fires a click on Dune, the second item, so `event.target` is Dune's `<li>` and it gains the class `done`.",
          "Lines 13-14 then count one `.done` item and rewrite the paragraph.",
        ),
      ],
      output: `Emma
Dune
1 read`,
    },
    exercises: ['js-basics-parsons-9', 'js-dom-create-cloze-1', 'js-dom-toggle-cloze-1', 'js-dom-7', 'js-dom-bubbling-predict-1'],
  },
  {
    id: 'js_project/1',
    topicKeys: [Topic.JS_PROJECT],
    step: 1,
    title: 'JS Project',
    idea: [
      lines(
        "A small vanilla JavaScript app keeps its data in one place, usually an array of plain objects, and treats that array as the truth.",
        "Small functions change it: add with `push` or `[...items, item]`, update by finding the object and changing its field, remove with `filter`.",
        "A render function then rebuilds the page from the array, and `JSON.stringify` saves it to `localStorage` so it survives a reload.",
      ),
      lines(
        "Logic kept in functions that take values and return values, apart from the DOM, is logic you can test.",
        "In Jest, `describe` groups tests, `test(name, fn)` declares one case, and `expect(actual)` starts an assertion that a matcher such as `toBe(expected)` finishes.",
        "Unit tests check one function, integration tests check parts working together, and end-to-end tests drive the real app in a browser.",
      ),
    ],
    form: {
      language: CodeLanguage.JAVASCRIPT,
      code: `let items = [];                                // the state: one array of objects
const add = (items, item) => [...items, item]; // change it with small functions
function render(items) {
  // rebuild the page from items
}

// add.test.js, run by Jest
describe("add", () => {
  test("appends the item", () => {
    const result = add([], { id: 1 });
    expect(result.length).toBe(1);             // a primitive: toBe
    expect(result).toEqual([{ id: 1 }]);       // an object or array: toEqual
  });
});`,
    },
    pitfall: lines(
      "`toBe` checks that two values are the same value, as `Object.is` does, so it fails on two separate objects or arrays even when their contents match.",
      "Use `toBe` for numbers, strings and booleans, and `toEqual` to compare objects and arrays by their contents.",
    ),
    worked: {
      language: CodeLanguage.JAVASCRIPT,
      code: `let basket = [];
let nextId = 1;
function add(title, price) {
  basket = [...basket, { id: nextId++, title, price, qty: 1 }];
}
function bump(id) {
  const item = basket.find((i) => i.id === id);
  if (item) item.qty += 1;
}
const total = () => basket.reduce((sum, i) => sum + i.price * i.qty, 0);

add("Emma", 8);
add("Dune", 12);
bump(1);
console.log(total(), nextId);
basket = basket.filter((i) => i.id !== 2);
const saved = JSON.parse(JSON.stringify(basket));
console.log(saved[0] === basket[0], saved[0].qty, total());`,
      steps: [
        "Lines 1-2: the basket array is the app's state, and `nextId` hands out ids.",
        "Lines 3-5: `add` builds a new array with the new item at the end; `nextId++` uses 1, then 2, and leaves `nextId` at 3.",
        "Lines 6-9: `find` returns the stored object itself, so `bump(1)` raises Emma's `qty` in the basket to 2, and line 15 prints 8 * 2 + 12 = 28.",
        "Line 16: `filter` returns a new array without Dune, so only Emma is left, worth 16.",
        "Lines 17-18: a round trip through JSON, as saving to `localStorage` does, makes a new object with the same contents, so `===` is `false`; a test would compare them with `toEqual`, not `toBe`.",
      ],
      output: `28 3
false 2 16`,
    },
    exercises: ['test-1', 'js-project-predict-1', 'js-project-parsons-1', 'js-project-cloze-1', 'test-2'],
  },

  // ===== Section 3, React =====
  {
    id: 'react_components/1',
    topicKeys: [Topic.REACT_COMPONENTS],
    step: 1,
    title: 'Components & JSX',
    idea: [
      lines(
        "A React component is a function with a capitalised name that returns JSX, the HTML-like markup React turns into elements on the page.",
        "It takes one argument, the props object, usually destructured in the parameter list: `function Book({ title })`.",
        "A parent passes props as attributes, `<Book title=\"Emma\" />`, and whatever it nests between the tags arrives as `children`.",
        "Older code writes components as classes (`class Book extends React.Component`); new code uses functions.",
      ),
      lines(
        "JSX is JavaScript, so the HTML attribute `class` is written `className` and `for` is written `htmlFor`.",
        "Curly braces switch back to JavaScript for one expression: `{title}`, `{price * 2}`, or a ternary `{inStock ? \"Buy\" : \"Sold out\"}`.",
        "Statements such as `if` and `for` do not fit inside braces, so choose with a ternary or `&&` and repeat with `map`.",
      ),
      lines(
        "A component returns one root; a fragment, `<>...</>`, groups siblings without adding an element.",
        "A list is `items.map(item => <li key={item.id}>...</li>)`, and `key` is a stable id from the data, not the array index, so React matches each row to the right item when the list changes.",
      ),
    ],
    form: {
      language: CodeLanguage.JSX,
      code: `// a capitalised function: props in, JSX out
function Component({ prop, items, children }) {
  return (
    <div className="box">
      {prop}                          {/* any expression in braces */}
      {cond ? <A /> : <B />}          {/* one or the other */}
      {count > 0 && <Badge />}        {/* something or nothing */}
      {items.map((item) => (
        <Row key={item.id} label={item.label} />
      ))}
      {children}                      {/* what the parent nested inside */}
    </div>
  );
}

// a parent uses it like a tag
<Component prop="value" items={rows}>nested JSX</Component>`,
    },
    pitfall: lines(
      "`{count && <Badge />}` shows the number `0` when `count` is 0, because `&&` returns its left side when that side is falsy, and React renders numbers.",
      "Make the left side a real boolean, `{count > 0 && <Badge />}`, or use a ternary that returns `null`.",
    ),
    worked: {
      language: CodeLanguage.JSX,
      runs: false,
      code: `import { createRoot } from "react-dom/client";

function Book({ title, stock }) {
  const note = stock > 0 ? <b>{stock} left</b> : <i>sold out</i>;
  return <li>{title} {note}</li>;
}

function Shelf({ books }) {
  return (
    <ul>
      {books.map((b) => (
        <Book key={b.id} title={b.title} stock={b.stock} />
      ))}
    </ul>
  );
}

const books = [
  { id: 7, title: "Emma", stock: 2 },
  { id: 9, title: "Dune", stock: 0 },
];
const root = createRoot(document.getElementById("root"));
root.render(<Shelf books={books} />);`,
      steps: [
        "Lines 3-6: `Book` is a component: it destructures `title` and `stock` from its props and returns one `<li>`, with braces embedding `title` and `note`.",
        "Line 4: JSX is a value, so a ternary picks `<b>` or `<i>` and keeps it in `note`; the test is `stock > 0`, so a stock of 0 never prints as text.",
        "Lines 11-13: `map` turns each book into a `<Book>` element, keyed by the book's own `id`.",
        "Lines 22-23: `createRoot` takes the page's `#root` element, and `render` puts `Shelf` in it, with the array as its `books` prop.",
      ],
      output: `Emma 2 left
Dune sold out`,
    },
    exercises: ['react-jsx-rules-mcq-1', 'react-comp-and-zero-predict-1', 'react-list-parsons-1', 'react-comp-cloze-1', 'react-comp-1'],
  },
  {
    id: 'react_state/1',
    topicKeys: [Topic.REACT_STATE],
    step: 1,
    title: 'State (useState)',
    idea: [
      lines(
        "`useState(initial)` gives a component a value that survives between renders, as a pair: `const [count, setCount] = useState(0)`.",
        "Calling the setter stores the new value and makes React render the component again, running the function from the top with the new value.",
        "A plain variable would reset on every render, and changing it would not update the page.",
      ),
      lines(
        "Each render sees its own snapshot: inside a handler, `count` keeps the value it had when that render ran, even right after `setCount`.",
        "When the next value depends on the current one, pass an updater, `setCount(c => c + 1)`, which React calls with the latest pending value.",
        "Updates made in one event are batched into a single re-render.",
      ),
      lines(
        "React compares the old and the new value with `Object.is`, so state is replaced, never changed in place.",
        "Add with `[...items, item]`, remove with `filter`, and change one field with `{ ...user, email }`.",
        "A value you can compute from state, such as a count or a total, is computed during render, not kept as a second state.",
      ),
    ],
    form: {
      language: CodeLanguage.JSX,
      code: `const [value, setValue] = useState(initial);  // the value and its setter
const [data, setData] = useState(() => load()); // load() on first render only

setValue(next);                    // replace it, then re-render
setValue((prev) => prev + 1);      // the next value from the latest one

setList([...list, item]);                   // add: a new array
setList(list.filter((x) => x.id !== id));   // remove: a new array
setObj({ ...obj, key: value });             // change one field: a new object`,
    },
    pitfall: lines(
      "`setCount(count + 1)` called twice in one handler adds 1, not 2, because both calls read the same `count` from this render.",
      "Use the updater form, `setCount(c => c + 1)`, whenever the new state is computed from the old.",
    ),
    worked: {
      language: CodeLanguage.JSX,
      runs: false,
      code: `// renders <Basket />, then the reader clicks "Add Dune", then "+2 copies"
import { useState } from "react";

function Basket() {
  const [titles, setTitles] = useState(["Emma"]);
  const [copies, setCopies] = useState(1);
  function addDune() {
    setTitles([...titles, "Dune"]);
  }
  function addTwoCopies() {
    setCopies((c) => c + 1);
    setCopies((c) => c + 1);
  }
  return (
    <>
      <p>{titles.join(", ")} (copies: {copies})</p>
      <button onClick={addDune}>Add Dune</button>
      <button onClick={addTwoCopies}>+2 copies</button>
    </>
  );
}`,
      steps: [
        "Lines 5-6: two pieces of state, a list of titles starting as `[\"Emma\"]` and a count of copies starting at 1.",
        "Line 8: Add Dune builds a new array with the spread, so React sees a new value and renders `Emma, Dune`; `titles.push(\"Dune\")` would change the old array and show nothing new.",
        "Lines 10-13: each `setCopies(c => c + 1)` receives the latest pending value, so one click goes from 1 to 3; two calls of `setCopies(copies + 1)` would stop at 2.",
        "Line 16: the paragraph is computed from state on every render, and both updates in `addTwoCopies` land in one re-render.",
      ],
      output: `at first:         Emma (copies: 1)
after Add Dune:   Emma, Dune (copies: 1)
after +2 copies:  Emma, Dune (copies: 3)`,
    },
    exercises: ['react-state-updater-predict-1', 'react-state-parsons-1', 'react-state-cloze-2', 'react-state-1', 'react-state-4'],
  },
  {
    id: 'react_effects/1',
    topicKeys: [Topic.REACT_EFFECTS],
    step: 1,
    title: 'Effects (useEffect, cleanup)',
    idea: [
      lines(
        "`useEffect(setup, deps)` runs code after React has put a render on the screen, to keep the component in step with something outside React: a timer, a subscription, `document.title`, a request.",
        "The dependency array says when it runs again: `[]` after the first render only, `[a, b]` after any render where `a` or `b` changed, and no array after every render.",
        "List every prop and state value the effect reads.",
      ),
      lines(
        "The function the setup returns is its cleanup.",
        "React calls it, with the old values, before running the effect again and when the component leaves the page, so every setup is undone: `clearInterval`, `removeEventListener`, abort the request.",
        "In development, `<StrictMode>` runs setup, cleanup and setup again on mount to expose a missing cleanup; production runs it once.",
      ),
      lines(
        "An effect is not for computing a value from state, which belongs in render, or for responding to a click, which belongs in the handler.",
        "For a request, set an `ignore` flag in the cleanup, or abort, so a late response for an old id is never stored.",
      ),
    ],
    form: {
      language: CodeLanguage.JSX,
      code: `useEffect(() => {
  const id = setInterval(tick, 1000);  // setup: after the render is on screen
  return () => clearInterval(id);      // cleanup: before a rerun, on unmount
}, [dep]);                             // runs again only when dep changes

useEffect(() => { /* ... */ }, []);    // after the first render only
useEffect(() => { /* ... */ });        // after every render`,
    },
    pitfall: lines(
      "An effect with `[]` that starts an interval or a listener keeps the values of the first render forever: its callback closed over them, and the effect never runs again.",
      "List what the callback reads in the dependency array, or read the latest value through an updater such as `setCount(c => c + 1)`.",
    ),
    worked: {
      language: CodeLanguage.JSX,
      runs: false,
      code: `// renders <Reading book="Emma" />, re-renders it with "Emma",
// then with "Dune", then removes it
import { useEffect } from "react";

function Reading({ book }) {
  useEffect(() => {
    document.title = \`Reading \${book}\`;
    console.log("open", book);
    return () => console.log("close", book);
  }, [book]);
  return <p>{book}</p>;
}`,
      steps: [
        "Lines 6-10: the effect sets the tab title and logs `open`; its return value is the cleanup, which logs `close` with the `book` of the render that created it.",
        "Line 10, first render with Emma: the effect runs once the paragraph is on the page, so `open Emma`.",
        "Line 10, re-render with Emma: `[book]` has not changed, so React skips the effect and logs nothing.",
        "Line 9, re-render with Dune: React first runs the old cleanup, `close Emma`, then the new effect, `open Dune`, and the title becomes `Reading Dune`.",
        lines(
          "Line 9 again: removing the component runs the last cleanup, `close Dune`.",
          "Under `<StrictMode>` in development, the first render would log an extra `close Emma` and `open Emma`.",
        ),
      ],
      output: `open Emma
close Emma
open Dune
close Dune`,
    },
    exercises: ['react-effect-parsons-1', 'react-effect-cloze-1', 'react-effect-staleclosure-mcq-1', 'react-effect-staleclosure-predict-1', 'react-fetch-1'],
  },
  {
    id: 'react_hooks/1',
    topicKeys: [Topic.REACT_HOOKS],
    step: 1,
    title: 'Hooks (useRef, useMemo, custom hooks)',
    idea: [
      lines(
        "Hooks are the `use` functions that give a component memory and access to React: `useState`, `useEffect`, `useRef`, `useMemo`, `useCallback`, `useReducer`, `useContext`, `useId`.",
        "React tells them apart by call order, so call them at the top level of a component or custom hook, the same ones in the same order every render: never inside a condition, a loop, or after an early return.",
      ),
      lines(
        "`useRef(initial)` returns a box, `{ current }`, that lasts across renders; changing `ref.current` does not re-render.",
        "Pass it as `ref={inputRef}` and React puts the DOM node in `inputRef.current`, ready for `focus()`; a ref also holds a timer id or a previous value.",
        "`useMemo(() => compute(a), [a])` caches a computed value until a dependency changes, and `useCallback(fn, [a])` caches a function the same way.",
      ),
      lines(
        "`useReducer(reducer, initial)` keeps state that changes in several named ways: `dispatch({ type: \"add\", payload })` calls `reducer(state, action)`, which returns the next state.",
        "A custom hook is a function named `useSomething` that calls other hooks, so components share stateful logic while each keeps its own state.",
      ),
    ],
    form: {
      language: CodeLanguage.JSX,
      code: `const ref = useRef(null);       // { current: null }, kept across renders
<input ref={ref} />             // React sets ref.current to the node
ref.current.focus();            // read or write it; no re-render

const result = useMemo(() => compute(a), [a]);  // recomputed when a changes
const onPick = useCallback((id) => pick(id), []);

const [state, dispatch] = useReducer(reducer, initial);
dispatch({ type: "add", payload: value });  // reducer returns the next state

function useThing(arg) {        // a custom hook: "use" plus other hooks
  const [value, setValue] = useState(arg);
  return [value, setValue];
}`,
    },
    pitfall: lines(
      "A hook called inside an `if` runs on some renders and not others, and React fails with `Rendered more hooks than during the previous render`.",
      "Call every hook unconditionally at the top, and put the condition inside it or in what you render.",
    ),
    worked: {
      language: CodeLanguage.JSX,
      runs: false,
      code: `// renders <Search />, then the reader types "du"
import { useEffect, useMemo, useRef, useState } from "react";

const titles = ["Emma", "Dune", "Dubliners"];

function useFilter(items, query) {
  return useMemo(() => {
    const q = query.toLowerCase();
    return items.filter((t) => t.toLowerCase().includes(q));
  }, [items, query]);
}

function Search() {
  const [query, setQuery] = useState("");
  const boxRef = useRef(null);
  const found = useFilter(titles, query);
  useEffect(() => {
    boxRef.current.focus();
  }, []);
  return (
    <>
      <input ref={boxRef} value={query}
        onChange={(e) => setQuery(e.target.value)} />
      <p>{found.length} found: {found.join(", ")}</p>
    </>
  );
}`,
      steps: [
        "Lines 6-11: `useFilter` is a custom hook, a `use` function that calls `useMemo`, so the filtered list is recomputed only when `items` or `query` changes.",
        "Lines 14-19: the four hooks run at the top of `Search`, in the same order on every render.",
        "Line 22: `ref={boxRef}` makes React store the input element in `boxRef.current`, and the effect on lines 17-19 calls `focus()` on it once, after the first render, so the reader can type straight away.",
        "Line 23: typing `du` calls `onChange`, which updates `query`; `useFilter` recomputes, and Dune and Dubliners match.",
      ],
      output: `on mount:           3 found: Emma, Dune, Dubliners;
                    the box focused
after typing "du":  2 found: Dune, Dubliners`,
    },
    exercises: ['react-hooks-rules-mcq-1', 'react-hooks-rules-predict-1', 'react-hooks-parsons-1', 'react-hooks-cloze-1', 'react-perf-1'],
  },
  {
    id: 'react_context/1',
    topicKeys: [Topic.REACT_CONTEXT],
    step: 1,
    title: 'Context (createContext, useContext)',
    idea: [
      lines(
        "Context hands a value to every component below a point in the tree, without passing it through each level as props, the chore called prop drilling.",
        "`createContext(defaultValue)` makes the context once, at module level, and a component reads it with `useContext(MyContext)`.",
      ),
      lines(
        "A provider supplies the value; in React 19 you render the context itself: `<ThemeContext value={theme}>...</ThemeContext>`.",
        "Older code, and the exercises, write `<ThemeContext.Provider value={theme}>`, which works the same way.",
        "`useContext` returns the value of the nearest provider above the component, and the default only when there is none.",
      ),
      lines(
        "Every component that reads a context re-renders when its provider's value changes, so context suits data many components need that changes rarely: the theme, the signed-in user, the language.",
        "Keep the context, its provider and a `useTheme()` hook in one file, so callers never touch the context object.",
        "State that changes often across many components belongs in a store such as Zustand or Redux.",
      ),
    ],
    form: {
      language: CodeLanguage.JSX,
      code: `const Ctx = createContext(defaultValue);  // made once, at module level

function CtxProvider({ children }) {
  const [value, setValue] = useState(initial);
  const shared = useMemo(() => ({ value, setValue }), [value]);
  // React 19; older code writes <Ctx.Provider value={shared}>
  return <Ctx value={shared}>{children}</Ctx>;
}

function useCtx() {
  return useContext(Ctx);  // the nearest provider's value, else the default
}`,
    },
    pitfall: lines(
      "Passing an object literal as the value, `value={{ theme, setTheme }}`, makes a new object on every provider render, so every consumer re-renders even when `theme` did not change.",
      "Memoize the object with `useMemo(() => ({ theme, setTheme }), [theme])`, or pass a plain value.",
    ),
    worked: {
      language: CodeLanguage.JSX,
      runs: false,
      code: `// renders <App />, then the reader clicks "Use USD"
import { createContext, useContext, useState } from "react";

const CurrencyContext = createContext("GBP");

function Price({ amount }) {
  const currency = useContext(CurrencyContext);
  return <p>{amount} {currency}</p>;
}

function App() {
  const [currency, setCurrency] = useState("EUR");
  return (
    <>
      <Price amount={8} />
      <CurrencyContext value={currency}>
        <Price amount={12} />
        <button onClick={() => setCurrency("USD")}>Use USD</button>
      </CurrencyContext>
    </>
  );
}`,
      steps: [
        "Line 4: the context is created once, with the default `GBP`.",
        "Line 7: `Price` reads the context with `useContext`; no currency prop reaches it.",
        "Line 15: the first `Price` has no provider above it, so it gets the default and shows `8 GBP`.",
        "Lines 16-19: the second `Price` sits inside the provider, so it shows the provider's value, `EUR`.",
        "Line 18: Use USD changes the state behind the provider's `value`, so React re-renders the `Price` inside it with `USD`, and the one outside keeps the default.",
      ],
      output: `at first:       8 GBP / 12 EUR
after Use USD:  8 GBP / 12 USD`,
    },
    exercises: ['react-context-parsons-1', 'react-context-cloze-2', 'react-context-defaultvalue-mcq-1', 'react-context-defaultvalue-predict-1', 'react-ctx-2'],
  },
  {
    id: 'react_forms/1',
    topicKeys: [Topic.REACT_FORMS],
    step: 1,
    title: 'Forms & Events',
    idea: [
      lines(
        "React handles events with camelCase props that take a function: `onClick`, `onChange`, `onSubmit`.",
        "Pass the function itself, `onClick={save}`, or an arrow that calls it, `onClick={() => remove(id)}`; `onClick={remove(id)}` would call it during render.",
        "The handler receives an event: `e.target` is the element, and `e.preventDefault()` stops the browser's own action.",
      ),
      lines(
        "A controlled input takes its text from state, `value={email}`, and writes every change back, `onChange={e => setEmail(e.target.value)}`, so the box always shows the state.",
        "A `<textarea>` and a `<select>` work the same way through `value`, while a checkbox uses `checked` and reads `e.target.checked`.",
      ),
      lines(
        "Handle submission on the form, `<form onSubmit={handleSubmit}>`, so Enter and the submit button both run it, and call `e.preventDefault()` first, or the browser reloads the page.",
        "For several fields, keep one object in state, give each input a `name`, and update it with a computed key, `[e.target.name]`.",
        "An uncontrolled input, read through a ref only on submit, suits a field nothing reacts to while typing.",
      ),
    ],
    form: {
      language: CodeLanguage.JSX,
      code: `const [obj, setObj] = useState({ field: "", flag: false });

function onFieldChange(e) {     // one handler for every text field
  setObj({ ...obj, [e.target.name]: e.target.value }); // key: input's name
}
function onFormSubmit(e) {
  e.preventDefault();           // no page reload
  save(obj);
}

<form onSubmit={onFormSubmit}>
  <input name="field" value={obj.field} onChange={onFieldChange} />
  <input type="checkbox" checked={obj.flag}
    onChange={(e) => setObj({ ...obj, flag: e.target.checked })} />
  <button>Save</button>         {/* a submit button by default */}
</form>`,
    },
    pitfall: lines(
      "An input with `value` and no `onChange` is read-only: on every keystroke React puts the state back in the box.",
      "Pair `value` with an `onChange` that stores the new text, or use `defaultValue` for an uncontrolled field.",
    ),
    worked: {
      language: CodeLanguage.JSX,
      runs: false,
      code: `// <JoinForm />: the reader types "Ada", ticks the box, then presses Join
import { useState } from "react";

function JoinForm() {
  const [entry, setEntry] = useState({ reader: "", news: false });
  function update(e) {
    const field = e.target;
    const value = field.type === "checkbox" ? field.checked : field.value;
    setEntry({ ...entry, [field.name]: value });
  }
  function join(e) {
    e.preventDefault();
    console.log(JSON.stringify(entry));
  }
  return (
    <form onSubmit={join}>
      <input name="reader" value={entry.reader} onChange={update} />
      <input name="news" type="checkbox"
        checked={entry.news} onChange={update} />
      <button>Join</button>
    </form>
  );
}`,
      steps: [
        "Line 5: one object in state holds every field, the reader's name as a string and the box as a boolean.",
        "Lines 6-10: one handler serves both inputs: it reads `checked` from a checkbox and `value` from a text box, and the computed key `[field.name]` picks the field to replace in a new object.",
        "Lines 17-19: each input is controlled, its `value` or `checked` read from state, so typing `Ada` and ticking the box both go through `update`.",
        "Lines 11-13 and 16: Join submits the form, and the handler calls `e.preventDefault()`, so the page does not reload, then logs the state.",
      ],
      output: `{"reader":"Ada","news":true}`,
    },
    exercises: ['react-forms-controlled-predict-1', 'react-forms-cloze-1', 'react-forms-cloze-2', 'react-forms-uncontrolled-mcq-1', 'react-forms-computed-handler-cloze-1'],
  },
  {
    id: 'react_patterns/1',
    topicKeys: [Topic.REACT_PATTERNS],
    step: 1,
    title: 'Patterns & Best Practices',
    idea: [
      lines(
        "React Router shows a component for each URL without reloading the page.",
        "Wrap the app in `<BrowserRouter>`, list `<Route path=\"...\" element={<Page />} />` inside `<Routes>`, and move with `<Link to=\"...\">`, or with `navigate(\"/path\")` from `useNavigate()` after an action.",
        "A `:id` segment is read with `useParams()`, and nested routes render at their parent's `<Outlet />`.",
        "React Router 7 is imported from `react-router`; version 6 code imports the same names from `react-router-dom`, and version 5 code with `<Switch>` and `component={Page}` no longer runs.",
      ),
      lines(
        "`lazy(() => import(\"./Page\"))` loads a component's code the first time it renders, inside a `<Suspense fallback={...}>` shown while it loads.",
        "`memo(Component)` skips a re-render when the props are shallowly equal, worth it only for an expensive child with stable props.",
        "`createPortal(jsx, node)` from `react-dom` renders a modal into another DOM node while it stays in the React tree.",
      ),
      lines(
        "An error boundary shows a fallback when a child throws while rendering; it is still a class component, or the `react-error-boundary` package, and it does not catch errors in event handlers or async code.",
        "A new `key` makes React discard a component with its state and mount a fresh one, which resets a form when the record it edits changes.",
        "Custom hooks have replaced most higher-order components and render props, which you will still meet in older code.",
      ),
    ],
    form: {
      language: CodeLanguage.JSX,
      code: `<BrowserRouter>
  <Routes>
    <Route path="/" element={<Layout />}>  {/* Layout renders <Outlet /> */}
      <Route index element={<Home />} />   {/* exactly "/" */}
      <Route path="items/:id" element={<Item />} />  {/* useParams().id */}
    </Route>
  </Routes>
</BrowserRouter>

<Link to="/items/1">One</Link>                  // no page reload
const navigate = useNavigate(); navigate("/");  // after an action

const Page = lazy(() => import("./Page"));      // loaded on first render
<Suspense fallback={<p>Loading...</p>}><Page /></Suspense>

const Row = memo(function Row(props) { /* ... */ });  // skips equal props
<Editor key={recordId} />                       // a new key: fresh state`,
    },
    pitfall: lines(
      "A plain `<a href=\"/books/2\">` inside a routed app makes the browser load the whole page again, which throws away all React state.",
      "Use `<Link to=\"/books/2\">` for links and `navigate()` for redirects, so React Router changes the URL and renders the matching route in place.",
    ),
    worked: {
      language: CodeLanguage.JSX,
      runs: false,
      code: `// the browser opens /books/2, then the reader clicks "Home"
import {
  BrowserRouter, Link, Outlet, Route, Routes, useParams,
} from "react-router";

const titles = { 1: "Emma", 2: "Dune" };

function Layout() {
  return (
    <>
      <nav><Link to="/">Home</Link></nav>
      <Outlet />
    </>
  );
}

function Book() {
  const { id } = useParams();
  return <h1>{titles[id]}</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<p>Pick a book</p>} />
          <Route path="books/:id" element={<Book />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}`,
      steps: [
        "Lines 24-31: `BrowserRouter` reads the address bar, and `Routes` picks the route whose `path` matches it.",
        "Lines 26-29: the child routes are nested in the `/` route, so `Layout` renders for both and shows the matching child at its `<Outlet />` on line 12.",
        "Lines 17-19: at `/books/2` the `books/:id` route matches, `useParams()` returns `{ id: \"2\" }`, and the heading reads `Dune`.",
        "Line 11: clicking Home changes the URL to `/` without a page load; the `index` route matches, and `Pick a book` replaces the heading while `Layout` stays on the page.",
      ],
      output: `at /books/2:       Home / Dune
after Home, at /:  Home / Pick a book,
                   with no page load`,
    },
    exercises: ['react-patterns-cloze-1', 'react-patterns-cloze-2', 'react-memo-mcq-1', 'react-key-reset-mcq-1', 'react-key-reset-predict-1'],
  },
  {
    id: 'react_project/1',
    topicKeys: [Topic.REACT_PROJECT],
    step: 1,
    title: 'React Project',
    idea: [
      lines(
        "A small React app is a tree of components that each own as little as they can.",
        "Start from the data: find the state the app needs, put each piece in the closest common parent of the components that use it, and pass it down as props, with callbacks that change it.",
        "Everything you can compute from that state, such as a filtered list, a count or a total, is computed during render.",
      ),
      lines(
        "When state changes in several named ways, a reducer keeps every change in one place: `useReducer(reducer, initial)` and `dispatch({ type, ... })`, each case returning a new array or object.",
        "Forms are controlled inputs that hand their value up through a callback; data many distant components need, such as the theme, goes in a context, and saving to `localStorage` is an effect.",
      ),
      lines(
        "Test the app the way a user uses it.",
        "React Testing Library's `render` mounts a component, `screen.getByText` or `getByRole` finds what is on the page, and `fireEvent.click` acts on it, so a test checks what is shown, not the state inside.",
      ),
    ],
    form: {
      language: CodeLanguage.JSX,
      code: `function reducer(state, action) {       // every change in one place
  switch (action.type) {
    case "added":   return [...state, action.item];
    case "removed": return state.filter((x) => x.id !== action.id);
    default:        return state;
  }
}

function App() {                        // owns the state its children share
  const [items, dispatch] = useReducer(reducer, []);
  const count = items.length;           // derived, not stored
  const add = (item) => dispatch({ type: "added", item });
  const remove = (id) => dispatch({ type: "removed", id });
  return (
    <>
      <AddForm onAdd={add} />
      <List items={items} onRemove={remove} />
    </>
  );
}

// App.test.jsx: render, find what is shown, act, check again
render(<App />);
fireEvent.click(screen.getByRole("button", { name: "Add" }));
expect(screen.getByText("1 item")).toBeInTheDocument();`,
    },
    pitfall: lines(
      "Copying state into a second state, such as a `filtered` list kept in step by an effect, gives two sources of truth that drift apart and an extra render on every change.",
      "Keep one state and compute the rest during render: `const visible = items.filter(...)`.",
    ),
    worked: {
      language: CodeLanguage.JSX,
      runs: false,
      code: `// <Shop />: add "Emma", "Dune", "Emma", then click "Remove Dune"
import { useReducer, useState } from "react";

function basket(items, action) {
  const found = items.find((i) => i.title === action.title);
  if (action.kind === "remove") return items.filter((i) => i !== found);
  if (!found) return [...items, { title: action.title, qty: 1 }];
  return items.map((i) => (i === found ? { ...i, qty: i.qty + 1 } : i));
}

function AddBook({ onAdd }) {
  const [title, setTitle] = useState("");
  function handleSubmit(e) {
    e.preventDefault();
    onAdd(title);
    setTitle("");
  }
  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
    </form>
  );
}

function Shop() {
  const [items, dispatch] = useReducer(basket, []);
  const copies = items.reduce((n, i) => n + i.qty, 0);
  const summary = items.map((i) => \`\${i.title} x\${i.qty}\`).join(", ");
  return (
    <>
      <AddBook onAdd={(title) => dispatch({ kind: "add", title })} />
      <p>{summary} (copies: {copies})</p>
      <button onClick={() => dispatch({ kind: "remove", title: "Dune" })}>
        Remove Dune
      </button>
    </>
  );
}`,
      steps: [
        "Lines 4-9: the reducer handles every change to the basket: `remove` filters the found title out, a new title is appended, and a title already there gets its `qty` raised in a new object.",
        "Lines 11-23: `AddBook` owns only its input text; on submit it calls `e.preventDefault()`, hands the title up through `onAdd`, and clears the box.",
        "Lines 26-28: `Shop` owns the basket and derives `copies` and the summary on every render, so no second state can drift.",
        "Line 31: adding Emma, Dune and Emma dispatches three `add` actions, which leave Emma x2 and Dune x1, 3 copies.",
        "Line 33: Remove Dune dispatches `remove`, and the paragraph re-renders from the new array.",
      ],
      output: `after the three adds:  Emma x2, Dune x1 (copies: 3)
after Remove Dune:     Emma x2 (copies: 2)`,
    },
    exercises: ['react-project-lift-state-mcq-1', 'react-project-reducer-predict-1', 'react-project-todo'],
  },
  // ===== Section 4, TypeScript =====
  {
    id: 'ts_basic_types/1',
    topicKeys: [Topic.TS_BASIC_TYPES],
    step: 1,
    title: 'Basic Types & Functions',
    idea: [
      lines(
        "TypeScript is JavaScript with types the compiler checks before the code runs.",
        "Write a type after a name with a colon: `let title: string`, `let tags: string[]`.",
        "Where a value is assigned at once, TypeScript infers the type, so `let count = 0` is already a `number` and needs no annotation.",
      ),
      lines(
        "A function types each parameter and its return: `function f(a: number, b: number): number`.",
        "`b?: number` makes a parameter optional, so it is `undefined` when left out, and `b = 1` gives it a default instead.",
        "A function that returns nothing useful returns `void`; one that always throws returns `never`.",
      ),
      lines(
        "A union `string | number` allows either type, and a literal union such as `\"light\" | \"dark\"` allows only those exact values.",
        "Before using a union in a way only one member supports, narrow it with a check such as `typeof x === \"number\"`.",
        "`any` switches checking off for a value; `unknown` accepts anything too, but forces that check before you use it.",
      ),
      lines(
        "Types are erased when TypeScript compiles to JavaScript.",
        "An annotation never converts or checks a value at runtime.",
      ),
    ],
    form: {
      language: CodeLanguage.TYPESCRIPT,
      code: `let n: number = 1;         // annotation: name: Type
let list = ["a", "b"];     // inferred: string[]
type Mode = "on" | "off";  // a named literal union

function f(a: number, b?: number, c = 1): number {
  return a + (b ?? 0) + c; // b is number | undefined
}
function log(msg: string): void {}

function use(x: unknown): string {
  if (typeof x === "string") return x; // narrowed
  return "not text";
}`,
    },
    pitfall: lines(
      "An annotation is not a conversion: `const qty: number = data.qty` compiles when `data` is `any`, but `qty` still holds whatever came in, such as the string `\"3\"`.",
      "Type outside data such as `JSON.parse` results as `unknown`, then narrow it with `typeof` or convert it with `Number()` before you rely on its type.",
    ),
    worked: {
      language: CodeLanguage.TYPESCRIPT,
      code: `type Format = "paperback" | "ebook";
let shelf = "fiction";

function price(base: number, fmt: Format, off?: number): number {
  const cost = fmt === "ebook" ? base - 3 : base;
  return cost - (off ?? 0);
}

function pages(raw: unknown): number {
  if (typeof raw === "number") return raw;
  if (typeof raw === "string") return Number(raw);
  return 0;
}

console.log(price(12, "paperback"), price(12, "ebook", 2));
console.log(pages(328), pages("320") + 1, pages(null));
console.log(typeof shelf, shelf.toUpperCase());`,
      steps: [
        "Lines 1-2: `Format` allows only two strings, and `shelf` is inferred as `string` from its value, with no annotation.",
        lines(
          "Lines 4-7: `off?` is optional, so inside `price` it is `number | undefined` and `?? 0` stands in when it is missing.",
          "Line 15 prints 12, then 12 - 3 - 2 = 7; `price(12, \"audio\")` would not compile.",
        ),
        lines(
          "Lines 9-13: `raw` is `unknown`, so it can be used only after a `typeof` check narrows it.",
          "Line 16: the string `\"320\"` goes through `Number()`, so adding 1 gives 321, and `null` falls through to 0.",
        ),
        "Line 17: at runtime `shelf` is a plain string, so `typeof` prints `string`, not anything TypeScript added.",
      ],
      output: `12 7
328 321 0
string FICTION`,
    },
    exercises: ['ts-any-unknown-mcq-1', 'ts-basic-any-predict-1', 'ts-basic-parsons-1', 'ts-union-cloze-1', 'ts-type-1'],
  },
  {
    id: 'ts_interfaces/1',
    topicKeys: [Topic.TS_INTERFACES],
    step: 1,
    title: 'Interfaces & Type Aliases',
    idea: [
      lines(
        "An interface names the shape of an object: its properties and the type of each.",
        "`email?: string` makes a property optional, and `readonly id: number` lets it be set only when the object is created.",
        "`interface Admin extends User { ... }` inherits every member of `User` and adds more.",
      ),
      lines(
        "A type alias, `type Name = ...`, names any type: an object shape, a union, a function type or a primitive.",
        "For object shapes the two are interchangeable; only an interface can be declared twice and merged, which is how libraries and globals such as `Window` are extended.",
      ),
      lines(
        "An index signature, `[key: string]: number`, types an object whose keys are not known ahead of time; `Record<string, number>` is the same type.",
        "TypeScript compares shapes, not names: any object with the required properties fits, extra properties included.",
        "Like every type, an interface is erased at runtime.",
      ),
    ],
    form: {
      language: CodeLanguage.TYPESCRIPT,
      code: `interface Shape {
  readonly id: number;    // set once, at creation
  label: string;
  note?: string;          // optional: may be missing
  describe(): string;     // a method signature
}
interface Special extends Shape {
  extra: boolean;         // plus every Shape member
}
interface Counts {
  [key: string]: number;  // any string key, number values
}
type Id = string | number; // an alias can name a union`,
    },
    pitfall: lines(
      "An interface describes an object; it does not filter or check it at runtime.",
      "Passing a variable with extra properties to a parameter typed as a smaller interface compiles, and the extra properties are still on the object, so `Object.keys` or a spread copies them.",
      "Pick out the fields you mean to keep when the extras must not travel on.",
    ),
    worked: {
      language: CodeLanguage.TYPESCRIPT,
      code: `type Isbn = string;
interface Book {
  readonly isbn: Isbn;
  title: string;
  pages?: number;
}
interface Ebook extends Book { sizeMb: number }
interface Stock { [isbn: string]: number }
function card(book: Book, stock: Stock): string {
  const n = stock[book.isbn] ?? 0;
  return \`\${book.title}: \${book.pages ?? "?"} pages, \${n} left\`;
}
const stock: Stock = { "111": 4 };
const emma: Book = { isbn: "111", title: "Emma", pages: 474 };
const dune: Ebook = { isbn: "222", title: "Dune", sizeMb: 2 };
console.log(card(emma, stock));
console.log(card(dune, stock), dune.sizeMb);`,
      steps: [
        "Lines 1-6: `Isbn` is an alias for `string`; `isbn` can never be reassigned, and `pages` may be missing.",
        "Line 7: `Ebook` extends `Book`, so `dune` on line 15 must have an isbn and a title as well as its size.",
        "Line 8: the index signature lets `Stock` hold any ISBN as a key, each mapped to a count.",
        lines(
          "Line 16: Emma has pages and 4 copies left.",
          "Line 17: an `Ebook` fits the `Book` parameter, since it has every `Book` property; it has no pages and no stock entry, so both fallbacks print, and `sizeMb` is still there afterwards.",
        ),
      ],
      output: `Emma: 474 pages, 4 left
Dune: ? pages, 0 left 2`,
    },
    exercises: ['ts-iface-vs-type-mcq-1', 'ts-iface-structural-predict-1', 'ts-iface-parsons-1', 'ts-iface-cloze-1', 'ts-iface-2'],
  },
  {
    id: 'ts_generics/1',
    topicKeys: [Topic.TS_GENERICS],
    step: 1,
    title: 'Generics',
    idea: [
      lines(
        "A generic is a type with a parameter: `function f<T>(x: T): T` works for any type `T` and keeps track of which one it was.",
        "TypeScript usually infers `T` from the arguments, so `f(42)` returns a `number`; you can also pass it, as `f<number>(42)`.",
        "Unlike a union or `any`, the same `T` ties the parameter to the result.",
      ),
      lines(
        "Interfaces and aliases take parameters too: `interface Box<T> { value: T }`, and `<T = string>` gives one a default.",
        "`T extends { id: number }` is a constraint: `T` can be any type that has at least those properties, so the body may read `x.id`.",
      ),
      lines(
        "`keyof T` is the union of `T`'s property names, so `K extends keyof T` accepts only real keys, and `T[K]` is the type stored at that key.",
        "Type arguments are erased at runtime, like every type.",
      ),
    ],
    form: {
      language: CodeLanguage.TYPESCRIPT,
      code: `function f<T>(x: T): T[] {     // T declared after the name
  return [x];
}
interface Box<T = string> {    // generic, with a default
  value: T;
}
function g<T extends { id: number }>(x: T): number {
  return x.id;                 // every T has an id
}
type Keys = keyof { a: string; b: number };  // "a" | "b"
type AtB = { a: string; b: number }["b"];    // number
function h<T, K extends keyof T>(rows: T[], k: K): T[K][] {
  // K can only be a real key of T
}`,
    },
    pitfall: lines(
      "A bare `T` has no known properties, so reading `x.id` or `x.length` inside the body does not compile.",
      "Do not fall back to `any`; add a constraint such as `T extends { length: number }` that names what the body needs.",
    ),
    worked: {
      language: CodeLanguage.TYPESCRIPT,
      code: `interface Page<T> { items: T[]; total: number }
function paginate<T>(all: T[], size: number): Page<T> {
  return { items: all.slice(0, size), total: all.length };
}
function longer<T extends { length: number }>(a: T, b: T): T {
  return b.length > a.length ? b : a;
}
function column<T, K extends keyof T>(rows: T[], key: K): T[K][] {
  return rows.map((row) => row[key]);
}
const books = [
  { title: "Emma", year: 1815 },
  { title: "Dune", year: 1965 },
];
const page = paginate(books, 1);
console.log(page.items[0].title, page.total);
console.log(longer("Emma", "Ulysses"), longer([1, 2], []).length);
console.log(column(books, "year").join(" "));`,
      steps: [
        "Lines 1-4: `Page<T>` is a generic interface, and `paginate` returns a `Page` of whatever it was given, so line 16 knows the items are books and can read `.title`.",
        "Lines 5-7: the constraint lets `longer` read `.length`, so it accepts two strings or two arrays, but not two numbers.",
        "Lines 8-10: `K extends keyof T` allows only `\"title\"` or `\"year\"` here, and `T[K][]` makes line 18's result a `number[]`.",
        "Line 16: one item on the page, out of a total of 2.",
      ],
      output: `Emma 2
Ulysses 2
1815 1965`,
    },
    exercises: ['ts-gen-predict-1', 'ts-gen-parsons-1', 'ts-gen-constraint-cloze-1', 'ts-gen-vs-union-mcq-1', 'ts-gen-keyof-1'],
  },
  {
    id: 'ts_advanced_types/1',
    topicKeys: [Topic.TS_ADVANCED_TYPES],
    step: 1,
    title: 'Advanced Types (unions, guards, narrowing)',
    idea: [
      lines(
        "Narrowing is how TypeScript works out which member of a union a value is, from the checks you write.",
        "`typeof x === \"string\"` narrows primitives, `x instanceof Date` narrows class instances, and `\"key\" in x` narrows objects by a property they have.",
      ),
      lines(
        "A discriminated union gives every variant the same literal field, such as `kind: \"post\"`, and a `switch` on that field narrows each case to its variant.",
        "Assigning the value to a `never` in the `default` case makes the compiler flag any variant you forgot.",
        "A type guard is a function whose return type is a predicate, `x is T`; when it returns true, the caller's value is narrowed to `T`.",
      ),
      lines(
        "`A & B` is an intersection: a value with every property of both.",
        "`as T` is an assertion, and `as const` freezes a value to its literal, readonly type; neither changes anything at runtime.",
        "`satisfies T` checks a value against `T` but keeps its own narrower inferred type.",
      ),
    ],
    form: {
      language: CodeLanguage.TYPESCRIPT,
      code: `type V =
  | { kind: "a"; x: number }   // the same literal field
  | { kind: "b"; y: string };  // in every variant

function use(v: V): string {
  switch (v.kind) {
    case "a": return String(v.x); // v is the "a" variant
    case "b": return v.y;
    default: {
      const missed: never = v; // a missing case fails
      return missed;
    }
  }
}
function isV(x: unknown): x is V { // a type guard
  return typeof x === "object" && x !== null
    && "kind" in x;
}`,
    },
    pitfall: lines(
      "`as` only tells the compiler what to believe: `el as HTMLInputElement` compiles even when `el` is a `div` or `null`, and the code then fails at runtime.",
      "Check the value instead, with `instanceof`, `in` or a type guard, so the narrowing is true at runtime too.",
    ),
    worked: {
      language: CodeLanguage.TYPESCRIPT,
      code: `type Delivery =
  | { kind: "pickup"; store: string }
  | { kind: "post"; days: number }
  | { kind: "courier"; fee: number };
function eta(d: Delivery): string {
  switch (d.kind) {
    case "pickup": return \`collect at \${d.store}\`;
    case "post": return \`\${d.days} days by post\`;
    case "courier": return \`next day, \${d.fee} extra\`;
    default: { const missed: never = d; return missed; }
  }
}
const post: Delivery = { kind: "post", days: 3 };
console.log(eta(post), "|", eta({ kind: "courier", fee: 5 }));
const errs = [new Error("declined"), "no stock"];
const text = errs.map((e) => e instanceof Error ? e.message : e);
console.log(text.join(", "));`,
      steps: [
        "Lines 1-4: every `Delivery` variant has a literal `kind`, the field the `switch` narrows on.",
        "Lines 7-9: inside each case, `d` is that one variant, so `d.store` is allowed only under `\"pickup\"`.",
        "Line 10: every variant is handled, so `d` is `never` here; adding a fourth variant without a case would stop this line compiling.",
        lines(
          "Line 15: `errs` is inferred as `(string | Error)[]`.",
          "Line 16: `instanceof` narrows each entry, so `.message` is read only from the `Error`, and the plain string passes through unchanged.",
        ),
      ],
      output: `3 days by post | next day, 5 extra
declined, no stock`,
    },
    exercises: ['ts-adv-assertion-mcq-1', 'ts-adv-predict-1', 'ts-adv-parsons-1', 'ts-adv-narrow-in-cloze-1', 'ts-type-4'],
  },
  {
    id: 'ts_utility_types/1',
    topicKeys: [Topic.TS_UTILITY_TYPES],
    step: 1,
    title: 'Utility Types (Partial, Pick, Omit, Record)',
    idea: [
      lines(
        "Utility types are built-in generics that make a new type from an existing one, so related shapes stay in step with the original.",
        "`Partial<T>` makes every property optional, `Required<T>` makes every one required, and `Readonly<T>` makes every one readonly.",
        "`Pick<T, \"a\" | \"b\">` keeps only the named keys, and `Omit<T, \"a\">` keeps every key but those.",
      ),
      lines(
        "`Record<K, V>` is an object type whose keys are `K` and values `V`; with a literal union as `K`, every key must be present.",
        "`ReturnType<typeof f>` and `Parameters<typeof f>` read a function's result and argument types, and `Awaited<T>` unwraps a promise.",
        "For unions, `Exclude<U, X>` drops members, `Extract<U, X>` keeps them, and `NonNullable<T>` drops `null` and `undefined`.",
      ),
      lines(
        "They nest, as in `Partial<Omit<T, \"id\">>`, and they combine with `&`.",
        "Like every type, they are erased at runtime: none of them adds or removes a property from an actual object.",
      ),
    ],
    form: {
      language: CodeLanguage.TYPESCRIPT,
      code: `interface T { id: number; a: string; b: number }

type Draft = Partial<T>;             // all optional
type Card = Pick<T, "a" | "b">;      // only a and b
type New = Omit<T, "id">;            // all but id
type Patch = Partial<Omit<T, "id">>; // nested
type Frozen = Readonly<T>;           // all readonly
type ByKey = Record<"x" | "y", T>;   // keys x and y

type Out = ReturnType<typeof make>;  // what make returns
type Some = Exclude<"p" | "q", "p">; // "q"`,
    },
    pitfall: lines(
      "`Partial<T>` lets a key be missing; it does not mean the key is there with the value `undefined`.",
      "So spreading a partial patch over a full object, `{ ...current, ...patch }`, keeps every field the patch leaves out, and you do not need to copy them by hand.",
      "An explicit `undefined` in the patch, such as `{ price: undefined }`, is still allowed by `Partial` and is copied over the field, while the result is still typed as the full type.",
    ),
    worked: {
      language: CodeLanguage.TYPESCRIPT,
      code: `interface Book {
  isbn: string; title: string; price: number; stock: number;
}
type NewBook = Omit<Book, "stock">;
type Card = Pick<Book, "title" | "price">;
const shelve = (b: NewBook): Book => ({ ...b, stock: 0 });
type Shelved = ReturnType<typeof shelve>;
const input: NewBook = { isbn: "1", title: "Emma", price: 8 };
const emma: Shelved = shelve(input);
const sale: Partial<Omit<Book, "isbn">> = { price: 6 };
const onSale = { ...emma, ...sale };
const cards: Readonly<Record<string, Card>> = {
  [onSale.isbn]: { title: onSale.title, price: onSale.price },
};
console.log(onSale.title, onSale.price, onSale.stock);
console.log(Object.keys(cards["1"]).join(","));`,
      steps: [
        "Lines 4-5: two types made from `Book`: one without `stock`, and one with only the two fields a card shows.",
        "Lines 6-7: `shelve` takes a book without stock and adds it, and `Shelved` is read off its return type, so it stays `Book` without being written out again.",
        "Lines 10-11: the sale patch may hold any field but `isbn`; it holds only `price`, so the spread changes the price and keeps the rest.",
        lines(
          "Lines 12-14: `cards` is a read-only record of cards keyed by ISBN.",
          "Lines 15-16: the book now costs 6 with a stock of 0, and its card holds just the two picked fields.",
        ),
      ],
      output: `Emma 6 0
title,price`,
    },
    exercises: ['ts-util-partial-predict-1', 'ts-util-parsons-1', 'ts-util-cloze-2', 'ts-util-returntype-mcq-1', 'ts-util-combine-1'],
  },
  {
    id: 'ts_project/1',
    topicKeys: [Topic.TS_PROJECT],
    step: 1,
    title: 'TS Project',
    idea: [
      lines(
        "A TypeScript project puts the section's types to work at the edges of an app, where data comes in and errors happen.",
        "A common shape is a result envelope: a discriminated union such as `{ ok: true; data: T } | { ok: false; error: string }`, generic in the data it carries.",
        "A function that can fail returns one instead of throwing, and callers must check `ok` before they can read `data`.",
      ),
      lines(
        "Data from outside, such as a `fetch` response body or `JSON.parse` output, arrives as `unknown` or `any`.",
        "Check it with a type guard before it becomes a `T`, so the envelope's type is true at runtime.",
        "`fetch` rejects only on a network failure, so an HTTP error such as 404 needs its own check of `response.ok`.",
      ),
      lines(
        "In React the same generics type components and hooks: a `DataTable<T>` whose columns are `keyof T`, or a `useLocalStorage<T>` that returns `[T, setter]` like `useState`.",
      ),
    ],
    form: {
      language: CodeLanguage.TYPESCRIPT,
      code: `type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
type Guard<T> = (x: unknown) => x is T;

function load<T>(raw: string, isT: Guard<T>): Result<T> {
  // parse, check with isT, return a variant; never throw
}

const r = load(raw, isThing);
if (r.ok) {
  r.data;      // only here: narrowed to the ok variant
} else {
  r.error;
}`,
    },
    pitfall: lines(
      "Casting outside data to the type you expect, as in `(await res.json()) as T`, makes the envelope claim a shape nobody checked.",
      "Run a type guard over the parsed value and return the error variant when it fails.",
    ),
    worked: {
      language: CodeLanguage.TYPESCRIPT,
      code: `type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
interface Order { id: number; copies: number }
type Guard<T> = (x: unknown) => x is T;
function isOrder(x: unknown): x is Order {
  return typeof x === "object" && x !== null
    && "id" in x && typeof x.id === "number"
    && "copies" in x && typeof x.copies === "number";
}
function parse<T>(text: string, isT: Guard<T>): Result<T> {
  try {
    const value: unknown = JSON.parse(text);
    if (isT(value)) return { ok: true, data: value };
    return { ok: false, error: "wrong shape" };
  } catch {
    return { ok: false, error: "not JSON" };
  }
}
for (const t of ['{"id":7,"copies":2}', '{"id":"7"}', "x=2"]) {
  const r = parse(t, isOrder);
  if (r.ok) console.log(\`#\${r.data.id} x\${r.data.copies}\`);
  else console.log(r.error);
}`,
      steps: [
        "Lines 6-10: the guard checks every field the code will read, so `x is Order` holds whenever it returns true.",
        "Lines 11-19: `parse` never throws: the parsed value starts as `unknown`, becomes `data` only after the guard passes, and a parse error becomes the error variant.",
        "Line 20: the first text is a valid order, the second has a string id, and the third is not JSON at all.",
        "Line 22: `r.ok` narrows `r`, so `r.data.id` can be read only in the success branch.",
      ],
      output: `#7 x2
wrong shape
not JSON`,
    },
    exercises: ['ts-project-guard-mcq-1', 'ts-project-result-predict-1', 'ts-project-1', 'proj-ts-1', 'proj-ts-2'],
  },
];
