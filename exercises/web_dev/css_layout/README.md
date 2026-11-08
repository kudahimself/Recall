# Shop layout

Topic: CSS Layout (flexbox, grid, positioning) (Web Dev, HTML, CSS & Tailwind).
Time: about 20 minutes.

## Task

`layout.html` is the shop's books page, unstyled.
Leave it as it is and lay it out in `layout.css`:

- The header (`.site-header`) is one row with the logo at the left end and the menu at the right, centred across the row.
  It stays at the top of the viewport while the page scrolls, in front of everything under it.
- The menu (`.menu`) is a row of links 16px apart.
- The page (`.page`) puts the filters (`.filters`) beside the results (`.results`).
  The filters keep 240px and never grow or shrink, and the results take all the width left over.
- The cards (`.grid`) fill three equal columns, 24px apart, wrapping to a new row after every third card.
- Each "New" badge (`.badge`) sits 8px from the top and 8px from the right of its own card.

## Examples

```
Corner Books                         Books  Events  Contact
Filter      | Books
Fiction...  | [New] The Night Circus | Piranesi  | [New] Emma
            | Dune                   | Middlemarch
```

Open `layout.html` in a browser and scroll: the header stays put.
Watch for the lesson's pitfall: an absolutely positioned element is placed against its nearest positioned ancestor, not its parent, so without a positioned card every badge lands in the corner of the page.

## Run the tests

Install the packages once, from the repository root: `cd exercises/web_dev && npm ci`.
Then:

```bash
cd exercises/web_dev/css_layout
npm test
```

Every test fails until you write the rules.
When they all pass, tick the exercise done in Recall under Progress, Topics.
