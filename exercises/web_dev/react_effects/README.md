# Reading page

Topic: Effects (useEffect, cleanup) (Web Dev, React).
Time: about 25 minutes.

## Task

Write two components in `ReadingPage.jsx` that keep in step with things outside React, each with `useEffect` and a cleanup that undoes what its setup did.

- `ReadingTimer({ book })` shows `Emma: 3s`, the seconds since it appeared on the page.
  A `setInterval` every 1000 ms counts them up; it is started once and cleared when the timer leaves the page.
  While the timer is on the page, the tab's title, `document.title`, reads `Reading Emma`, following `book` when it changes, and when the timer leaves the page the title goes back to what it was before.
- `BookBlurb({ id, fetchBlurb })` shows the blurb of book `id`, loaded with `fetchBlurb(id)`, which returns a Promise of the text, and calls it again only when `id` changes.
  It shows `<p>Loading...</p>` until the blurb of the current id arrives, then `<p>` with the text, or `<p>Could not load the blurb</p>` when the Promise rejects.
  A response for an id it no longer shows is ignored, however late it comes.

Give each effect the dependency array that says when it runs again, and think about which values its callback reads: an interval set up once must not keep counting from the first render's number.

## Examples

```jsx
<ReadingTimer book="Emma" />
// <p>Emma: 0s</p>, then Emma: 1s, Emma: 2s...; the tab reads "Reading Emma"

<BookBlurb id={7} fetchBlurb={fetchBlurb} />
// <p>Loading...</p>, then <p>A young matchmaker in Highbury.</p>
// switched to id 9 before 7's answer came: 9's blurb, never 7's
```

The timer's tests use Vitest's fake clock, so `vi.advanceTimersByTime(3000)` moves three seconds on at once, and `vi.getTimerCount()` tells whether an interval was left running.
One of them renders the timer inside `<StrictMode>`, which sets every effect up, cleans it up and sets it up again on mount, as React does in development, so a missing cleanup shows up as a clock that runs twice as fast.
The blurb's tests pass a fake `fetchBlurb` whose Promises they settle by hand, in whatever order they like.

## Run the tests

Install the packages once, from the repository root: `cd exercises/web_dev && npm ci`.
Then:

```bash
cd exercises/web_dev/react_effects
npm test
```

Every test fails until you fill in the components.
When they all pass, tick the exercise done in Recall under Progress, Topics.
