# Price tags

Topic: CSS Basics (selectors, box model, colors) (Web Dev, HTML, CSS & Tailwind).
Time: about 20 minutes.

## Task

`tags.html` shows three price tags, styled by the shop's own `shop.css`.
Leave both as they are and write your rules in `tags.css`, which the page loads after `shop.css`.

- Declare two custom properties on the root element: `--accent` is `crimson` and `--ink` is `#222`.
- Make the page's text the ink color, by setting it once on the body and reading it with `var()`.
  The headings have no color rule of their own, so they inherit it; the paragraphs keep the grey `shop.css` gives every `p`.
- Make each `.tag` box exactly 200px wide, padding and border included, with 12px of padding, a 2px solid border in the accent, no top margin and 16px below.
- Make every sale price (`.price.sale`) the accent color, the one in the featured tag too, while the featured tag's other price stays navy and the other prices stay grey.
  Do it with selectors: no `!important` and no `style` attributes.

## Examples

```
#featured   The Night Circus   £9.99 navy    £6.99 crimson
            Piranesi           £8.99 grey
            Emma               £3.50 crimson
```

Open `tags.html` in a browser to see it.
Watch for the lesson's pitfall: a later rule does not beat a more specific one, so `.sale` written after `#featured .price` still loses to it.

## Run the tests

Install the packages once, from the repository root: `cd exercises/web_dev && npm ci`.
Then:

```bash
cd exercises/web_dev/css_basics
npm test
```

Every test fails until you write the rules.
When they all pass, tick the exercise done in Recall under Progress, Topics.
