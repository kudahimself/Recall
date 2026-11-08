# My shelf

Topic: DOM Manipulation (Web Dev, JavaScript Fundamentals).
Time: about 25 minutes.

## Task

`bookshelf.html` is a reading shelf: a form to add a title, a count, and a list holding one book.
Leave it as it is and write `setupShelf(doc)` in `bookshelf.js`, which the page calls once with its `document`:

- Show the number of books on the shelf in `#count`: `"1 book"`, `"2 books"`, `"0 books"`.
- Submitting `#add-form` adds the title typed into `#title`, trimmed, as a new `<li>` at the end of `#shelf`, built like the page's own: `data-title` set to the title, a `<span class="title">` holding it, a space, and a `<button type="button" class="remove">Remove</button>`.
  Then it empties the box and updates the count.
  An empty or blank title adds nothing, and the page never reloads.
- Clicking a book's title toggles the class `read` on its `<li>`.
- Clicking a book's Remove button removes its `<li>` and updates the count.

Handle both clicks with one listener on `#shelf`, so they work for every book, those added later included, even by other code.

## Examples

```
type "  Dune " and press Add   ->  Emma, Dune         "2 books", the box empty
click "Emma"                   ->  Emma gets class "read"; click again to undo
click Dune's Remove            ->  Emma               "1 book"
type "<b>Bold</b>" and Add     ->  the title shows as the text <b>Bold</b>
```

To try it in a browser, serve the folder (for example with VS Code's Live Preview), since browsers block a module script opened straight from a file.

Watch for the lesson's pitfall: `innerHTML` parses its string as HTML, so a title a visitor types could add elements and run script; put text in with `textContent`.

## Run the tests

Install the packages once, from the repository root: `cd exercises/web_dev && npm ci`.
Then:

```bash
cd exercises/web_dev/js_dom
npm test
```

The tests load the page in jsdom, call `setupShelf(document)`, and submit and click as a visitor would.
Every test fails until you write `setupShelf`.
When they all pass, tick the exercise done in Recall under Progress, Topics.
