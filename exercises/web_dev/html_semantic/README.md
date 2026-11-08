# Review page

Topic: Semantic HTML (header, nav, main, article) (Web Dev, HTML, CSS & Tailwind).
Time: about 20 minutes.

## Task

`review.html` is a book review page built from nothing but `<div>`s.
It looks fine, but a screen reader finds no landmarks on it and its heading outline starts at an `<h3>`.
Rewrite it with the elements that say what each part is, keeping every word of its text and every link.

- The site name and the three site links go in the page's header, the links in the site navigation.
- The primary content goes in the one main element: the review, a piece that makes sense on its own, and beside it the staff picks.
- The review's title is the page's one top-level heading, and its two parts, The story and Our verdict, are themed sections, each under a heading one level down.
- The cover and its caption are tied together as a figure.
- The spoilers stay hidden until the reader opens them, with `Spoilers` as the summary they click.
- The staff picks get a heading at the level that fits the outline, not the level that looked smaller.
- The address goes in the footer.

No `<div>` is left at the end: each one becomes the element that says what that part is (a site name with no element of its own is a `<p>`).

## Examples

The heading outline afterwards reads:

```
h1  The Night Circus, reviewed
h2    The story
h2    Our verdict
h2    More staff picks
```

Open `review.html` in a browser before and after: it reads the same, and the spoilers now open on a click.

Watch for the lesson's pitfall: choose each element by its meaning, never by its default look, so no heading skips a level to get smaller text.

## Run the tests

Install the packages once, from the repository root: `cd exercises/web_dev && npm ci`.
Then:

```bash
cd exercises/web_dev/html_semantic
npm test
```

Every test fails until you rewrite the page.
When they all pass, tick the exercise done in Recall under Progress, Topics.
