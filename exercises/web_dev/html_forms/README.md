# Newsletter sign-up

Topic: HTML Forms (inputs, validation, accessibility) (Web Dev, HTML, CSS & Tailwind).
Time: about 20 minutes.

## Task

Add the newsletter sign-up form to `signup.html`, under the heading.
It posts to `/subscribe`, since signing up changes data, and has these fields, in this order:

| Label | Sent as | Control | Rules |
| --- | --- | --- | --- |
| Email | `email` | an email input | required |
| First name | `first_name` | a text input | required, at least 2 characters |
| Age | `age` | a number input | optional, from 13 to 120 |
| Paperback, Ebook, Audiobook | `format`, with the values `paperback`, `ebook` and `audiobook` | three radio buttons, Paperback picked to start with | one choice |
| Favourite genre | `genre`, with the values `fiction`, `history` and `science` | a dropdown of Fiction, History and Science | |
| Tell me about events | `events`, with the value `yes` | a checkbox | |

Then a `Sign up` submit button.

- Give every field an `id` too, and a `<label>` whose `for` points at it.
- Put the three radio buttons in a group with the caption `Format`.
- Let the browser do the checking: the rules in the table are attributes, not script.

## Examples

Filled in with `ann@example.com`, `Ann`, `34`, Ebook and History, and the box left unticked, the form sends:

```
email=ann%40example.com&first_name=Ann&age=34&format=ebook&genre=history
```

An age of 12 or an email of `ann.example.com` stops the submit with the browser's own message.
Open `signup.html` in a browser to try it.

Watch for the lesson's pitfall: a label's `for` matches the field's `id`, not its `name`.

## Run the tests

Install the packages once, from the repository root: `cd exercises/web_dev && npm ci`.
Then:

```bash
cd exercises/web_dev/html_forms
npm test
```

Every test fails until you write the form.
When they all pass, tick the exercise done in Recall under Progress, Topics.
