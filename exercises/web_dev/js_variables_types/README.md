# Stock checks

Topic: Variables, Types & Destructuring (Web Dev, JavaScript Fundamentals).
Time: about 15 minutes.

## Task

Write the bookshop's stock-check helpers in `checks.js`:

- `kindOf(value)` names the kind of a value as `typeof` does, except that `null` is `"null"` and an array is `"array"`.
- `countFalsy(values)` counts the falsy values in an array.
- `parseCount(text)` turns the text typed into a stock box into a whole number of 0 or more, spaces around it allowed, and gives `null` for anything else, an empty box included.
- `matchesShelf(text, shelfCount)` says whether the typed count is the number on the shelf.
- `shelfLabel(book)` builds a label from a book object, with `"Unknown"` for a missing author and 300 for missing pages, using destructuring with defaults.
- `locate(code)` splits a location code such as `"B-4"` into `{ aisle: "B", shelf: 4 }`, using array destructuring.

Use `const` for every variable you never reassign and `let` only where you do.

## Examples

```js
kindOf(null)                         // "null"
kindOf([1, 2])                       // "array"
countFalsy([0, "", "0", [], null])   // 3: "0" and [] are truthy
parseCount(" 12 ")                   // 12
parseCount("")                       // null, though Number("") is 0
matchesShelf("", 0)                  // false
shelfLabel({ title: "Beowulf" })     // "Beowulf by Unknown, 300 pages"
locate("B-4")                        // { aisle: "B", shelf: 4 }
```

Watch for the lesson's pitfall: `==` converts both sides first, so `"" == 0` is `true`; compare with `===` and convert on purpose.

## Run the tests

Install the packages once, from the repository root: `cd exercises/web_dev && npm ci`.
Then:

```bash
cd exercises/web_dev/js_variables_types
npm test
```

Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
