# Mobile-first catalogue

Topic: Responsive Design (media queries, mobile-first) (Web Dev, HTML, CSS & Tailwind).
Time: about 25 minutes.

## Task

Make the shop's catalogue page work from a phone to a wide monitor.
Add one tag to the head of `catalogue.html` and leave the rest of it alone; the styles go in `catalogue.css`.

- Add the viewport meta tag, so a phone renders the page at its own width instead of shrinking a desktop one.
- The content (`.container`) is at most 1100px wide, centred, with 16px of padding at each side.
- The heading scales with the viewport: 4% of its width, but never under 1.5rem (24px) or over 2.5rem (40px), in one declaration.
- The books (`.books`) are a grid of equal columns: one column on a phone, two from 640px, four from 1024px.
- On a phone the menu button (`.menu-button`) shows and the menu (`.menu`) is hidden; from 768px the button is hidden and the menu is a row (`display: flex`).
- Each book (`.book`) lifts a little on hover, with a `transform` transition of 0.2s, and has no transition for a reader whose system asks for reduced motion.

Write it mobile-first: the phone layout is the base rules, with no media query, and each wider layout is a `min-width` query, from the smallest breakpoint to the largest.

## Examples

| Width | Book columns | Menu | Heading |
| --- | --- | --- | --- |
| 375px | 1 | the button | 24px |
| 800px | 2 | the links | 32px |
| 1440px | 4 | the links | 40px |

Open `catalogue.html` in a browser and drag the window narrower, or use the developer tools' device toolbar.
Watch for the lesson's pitfall: a media query adds no specificity, so when two match, the later one in the file wins; put the 1024px query after the 640px one.

## Run the tests

Install the packages once, from the repository root: `cd exercises/web_dev && npm ci`.
Then:

```bash
cd exercises/web_dev/css_responsive
npm test
```

The tests load the page at several widths, applying the media queries that match each.
Every test fails until you write the rules.
When they all pass, tick the exercise done in Recall under Progress, Topics.
