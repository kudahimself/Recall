# Book card in Tailwind

Topic: Tailwind CSS (utility classes, responsive) (Web Dev, HTML, CSS & Tailwind).
Time: about 20 minutes.

## Task

`card.html` holds two book cards, unstyled.
Style them with Tailwind utility classes in their `class` attributes, and set Tailwind up in `theme.css`.
Do not change the elements or their text; `class="author"` and `class="price"` stay, with your utilities added after them.

In `theme.css`, bring in Tailwind 4 and declare the shop's brand colors as theme tokens, `--color-brand-500` as `#7c3aed` and `--color-brand-600` as `#6d28d9`, so `bg-brand-500` and `text-brand-500` exist.

Each card (`<article>`):

- is white, with 1rem of padding (`p-4`), large rounded corners and a medium shadow, which grows to a large shadow while the pointer is over the card;
- stacks the cover over the text on a phone and puts them side by side from 640px, 1rem apart;
- is a `group`, so its title can react to the pointer anywhere over the card.

Inside a card:

- the cover is full width on a phone and 8rem (`w-32`) wide from 640px, with rounded corners;
- the title is large (`text-lg`) and semibold, and turns `brand-500` while the pointer is over its card;
- the author is small (`text-sm`) and `gray-600`;
- the price is bold, 0.5rem below the author (`mt-2`), at exactly 15px, a size the scale does not have;
- the button is `brand-500` with white text, `px-4` and `py-2` of padding, rounded corners and 1rem above it (`mt-4`); it turns `brand-600` on hover, gets a 2px outline 2px away (`outline-2`, `outline-offset-2`) when focused from the keyboard, and fades to half opacity only when disabled, as the Sold out one is.

## Examples

```
phone (under 640px)        640px and up
+------------------+       +----------------------------+
| [  cover       ] |       | [cover] The Night Circus   |
| The Night Circus |       |         Erin Morgenstern   |
| Erin Morgenstern |       |         £9.99              |
| £9.99            |       |         [Add to basket]    |
| [Add to basket]  |       +----------------------------+
+------------------+
```

The tests read the classes, since showing them needs Tailwind's build step.
To see the card, run Tailwind's CLI on `theme.css` (`npx @tailwindcss/cli -i theme.css -o out.css`, which needs the internet once) and point the page's link at `out.css`; `out.css` is yours to delete afterwards.

Watch for the lesson's pitfall: `sm:` does not mean "on small screens", it means "from 640px up", so write the phone layout without a prefix.

## Run the tests

Install the packages once, from the repository root: `cd exercises/web_dev && npm ci`.
Then:

```bash
cd exercises/web_dev/tailwind
npm test
```

Every test fails until you add the classes.
When they all pass, tick the exercise done in Recall under Progress, Topics.
