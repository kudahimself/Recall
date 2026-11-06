# New books page

Topic: Templates & Template Tags (Backend, Django).
Time: about 20 minutes.

## Task

Write the noticeboard's new-books page in `noticeboard/templates/noticeboard/new_books.html`.
It is rendered with `books`, a list of books, each with `pk`, `title`, `blurb`, `on_loan` and `note`, and `branch`, the branch's name.
The layout it builds on, `base.html`, and the opening-hours snippet, `_hours.html`, sit next to it.

- Extend `noticeboard/base.html`, set its `title` block to `New books` and put everything else in its `content` block.
- Show the branch in capitals in an `<h1>`.
- Show each book as one `<li>` in a `<ul>`, holding, separated by ` - `:
  - a link to the book's page, built with `{% url 'book' book.pk %}`, whose text is its number in the list and its title, as in `1. Dune`;
  - the blurb, cut to 20 characters with `truncatechars`;
  - `on loan` or `on the shelf`;
  - the note, or `no note` when it is empty.
- When there are no books, show one `<li>Nothing new this week.</li>` instead.
- After the list, include `noticeboard/_hours.html`.

## Examples

With Dune (pk 3, on loan, no note) and Emma (pk 8, on the shelf, note `<b>signed</b>`), the list comes out as:

```html
<li><a href="/books/3/">1. Dune</a> - A desert planet and… - on loan - no note</li>
<li><a href="/books/8/">2. Emma</a> - Matchmaking - on the shelf - &lt;b&gt;signed&lt;/b&gt;</li>
```

The tests even out spaces and line breaks, so lay the template out however reads best.
The note comes out escaped: never mark it `|safe`.

Watch for the lesson's pitfall: `{% extends %}` must be the first tag, and anything a child template writes outside a `{% block %}` is thrown away.

## Run the tests

```bash
cd exercises/backend/dj_templates
pytest
```

`conftest.py` sets Django up for you; leave it as it is.
The tests render your template with `render_to_string`, so no server runs.
Every test fails until you write the template.
When they all pass, tick the exercise done in Recall under Progress, Topics.
