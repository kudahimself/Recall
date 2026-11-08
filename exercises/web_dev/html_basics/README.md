# Shop front page

Topic: HTML Basics (elements, attributes, structure) (Web Dev, HTML, CSS & Tailwind).
Time: about 15 minutes.

## Task

Write the home page of Corner Books, a small bookshop, in `shopfront.html`.

- A whole document: the doctype, then an `<html>` element whose `lang` says the page is in English.
- A `<head>` with the UTF-8 character set and the title `Corner Books`.
- A `<body>` with, in this order:
  - one main heading, `Corner Books`;
  - the shop photo `shop.jpg`, with text that says what it shows for a screen reader or a photo that fails to load;
  - one paragraph of opening hours, `Open every day, 9 to 5.`, then a line break, then `Closed on 25 December.`, with `every day` in bold for importance;
  - a bulleted list of three items: `Paperbacks & comics`, `Maps & guides`, `Second-hand classics`;
  - the paragraph `Kids' corner: every book < £5.`;
  - the paragraph `See our events or find us on the map.`, where `our events` links to `events.html` in this folder and `find us on the map` links to `https://www.openstreetmap.org/` in a new tab.

The `&` and `<` in the text are characters HTML reserves, so write them as entities.
A link that opens in a new tab also needs the `rel` values that stop the new page reaching back to this one.

## What the page shows

```
Corner Books
[the shop photo]
Open every day, 9 to 5.
Closed on 25 December.
• Paperbacks & comics
• Maps & guides
• Second-hand classics
Kids' corner: every book < £5.
See our events or find us on the map.
```

Open `shopfront.html` in a browser to see it (the photo is not in the folder, so its text shows instead).
Watch for the lesson's pitfall: a newline in the source does not start a new line on the page.

## Run the tests

Install the packages once, from the repository root: `cd exercises/web_dev && npm ci`.
Then:

```bash
cd exercises/web_dev/html_basics
npm test
```

Every test fails until you write the page.
When they all pass, tick the exercise done in Recall under Progress, Topics.
