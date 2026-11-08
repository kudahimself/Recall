# Join form

Topic: Forms & Events (Web Dev, React).
Time: about 25 minutes.

## Task

Write the reading club's sign-up form as one component, `JoinForm({ onJoin })` in `JoinForm.jsx`, with every field controlled by state.

The form has four fields, each with a `<label htmlFor>` naming it, and a `<button>Join</button>` that submits it.
It checks the fields itself, so give the `<form>` the `noValidate` attribute: without it, the browser stops the submit at an email without an `@` and shows its own message instead of yours.

- `Name`: a text `<input name="reader">`
- `Email`: an `<input type="email" name="email">`
- `Favourite genre`: a `<select name="genre">` with an `<option>` per entry of `GENRES`, the first chosen at the start
- `Send me the newsletter`: an `<input type="checkbox" name="news">`

On submit, from the button or from Enter in a field, and without the page reloading:

- a blank name shows `<p role="alert">Enter your name</p>`;
- an email without an `@` shows `<p role="alert">Enter a valid email</p>`;
- otherwise it calls `onJoin({ reader, email, genre, news })` with the name and the email trimmed, empties the form back to how it started, and shows `<p role="status">Welcome, Ada</p>` with the name.

Keep the four fields in one object in state and update them with one `onChange` handler that picks the key from the input's `name`, reading `checked` from the checkbox and `value` from the rest.
Handle the submit on the `<form>`, not on the button, so Enter works too.

## Examples

```text
Name "  Ada ", Email "ada@example.com", genre history, box ticked, Join
  -> onJoin({ reader: "Ada", email: "ada@example.com", genre: "history", news: true })
  -> the fields are empty again, and "Welcome, Ada" shows
Name blank, Join
  -> "Enter your name", and onJoin is not called
```

The tests find each field by its label with `getByLabelText`, change it with `fireEvent.change` and `fireEvent.click`, and pass `vi.fn()` as `onJoin` to see what it was called with.
They submit the form both by clicking Join and with `fireEvent.submit` on the form, which is what Enter does, and that returns `false` only when your handler called `preventDefault()`.

## Run the tests

Install the packages once, from the repository root: `cd exercises/web_dev && npm ci`.
Then:

```bash
cd exercises/web_dev/react_forms
npm test
```

Every test fails until you fill in the component.
When they all pass, tick the exercise done in Recall under Progress, Topics.
