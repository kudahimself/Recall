/**
 * Web Dev lessons, one per topic, in course order.
 *
 * Section 1, HTML, CSS & Tailwind: every topic.
 *
 * Prose keeps one sentence per source line (`lines`). An HTML or CSS worked
 * example shows what a browser renders, which no runner here reproduces, so
 * it sets `runs: false` (the "HTML / CSS page" kind in utils/workedKinds.ts)
 * and its output is what the page shows: the text, one displayed line per
 * line, or the values its steps name. Every example was rendered in headless
 * Chromium at the viewport widths its first-line comment gives, the Tailwind
 * ones with Tailwind 4 and its default theme, and the output was read off
 * the rendered page.
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
];
