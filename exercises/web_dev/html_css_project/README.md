# Shop landing page

Topic: HTML/CSS Project (Web Dev, HTML, CSS & Tailwind).
Time: about 30 minutes.

## Task

Build Corner Books' landing page in `landing.html`: semantic HTML for the structure first, then Tailwind classes for the look and the layout, mobile-first.

The markup, which should read well unstyled:

- A header holding the site navigation: a `Corner Books` link to `/`, the links `Books` (`/books`), `Events` (`/events`) and `Contact` (`/contact`) together in one box, and a `Menu` button (`type="button"`) for phones.
- One main holding two sections:
  - the hero: the page's one h1, `Books for every corner of your life`, a line of text of your own, and a `Browse the shelves` link to `/books`;
  - the picks: an h2, `This week's picks`, then one article per book, each with its title as an h3 and a `Read more` link (`/books/the-night-circus`, `/books/piranesi`, `/books/emma`): The Night Circus, Piranesi and Emma, with a line of text of your own each.
- A footer: `Corner Books, 12 Mill Street. Open every day, 9 to 5.`

Use real `<a>` and `<button>` elements for everything clickable.

The classes:

- The picks are one per row on a phone and three across from `md`, 1.5rem apart, in one grid.
- On a phone the nav links' box is hidden and the Menu button shows; from `md` the links show as a row and the button is hidden.
- The main is capped with a `max-w-*` width of your choice and centred.
- Every link in the main has a `hover:` style and a `focus-visible:` style, with `transition` so they change smoothly.
- The rest of the look (colors, sizes, spacing) is yours.

## Examples

```
phone                       md (768px) and up
Corner Books     [Menu]     Corner Books        Books Events Contact
Books for every corner...   Books for every corner of your life
[Browse the shelves]        [Browse the shelves]
This week's picks           This week's picks
[The Night Circus]          [The Night Circus] [Piranesi] [Emma]
[Piranesi]
[Emma]
```

The tests read the markup and the classes.
To see the page, build Tailwind's CSS for it from this folder: write `@import "tailwindcss";` in an `input.css` and run `npx @tailwindcss/cli -i input.css -o out.css` (the internet is needed the first time); `input.css` and `out.css` are yours to delete afterwards.

Watch for the lesson's pitfall: the order of classes in the attribute never decides which one wins, the prefix does, so `md:grid-cols-1 grid-cols-3` is three columns on a phone.

## Run the tests

Install the packages once, from the repository root: `cd exercises/web_dev && npm ci`.
Then:

```bash
cd exercises/web_dev/html_css_project
npm test
```

Every test fails until you build the page.
When they all pass, tick the exercise done in Recall under Progress, Topics.
