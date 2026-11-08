/**
 * Web Dev lessons, one per topic, in course order.
 *
 * Section 1, HTML, CSS & Tailwind: every topic.
 * Section 2, JavaScript Fundamentals: every topic.
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
];
