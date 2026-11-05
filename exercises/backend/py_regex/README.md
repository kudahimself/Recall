# Catalogue codes

Topic: Regex (Backend, Python Advanced).
Time: about 25 minutes.

## Task

Pull codes out of the catalogue's free text with the `re` module.
Fill in the six functions in `codes.py`, writing every pattern as a raw string:

- `find_isbns(text)` returns every 13-digit ISBN that starts with `978` or `979`, in order.
- `parse_call_number(text)` finds a call number such as `FIC-HER-1965` anywhere in the text and returns `{"section": "FIC", "author": "HER", "year": 1965}`, using named groups, or `None` when there is none.
- `is_member_id(text)` is `True` only when the whole text is a member id: `M-` and exactly five digits.
- `first_year(text)` returns the first four-digit number anywhere in the text as an `int`, or `None`.
- `tidy_spaces(text)` turns every run of whitespace into one space and trims the ends.
- `strip_tags(html)` removes every tag such as `<b>` or `</i>` and keeps the text between them.

## Examples

```python
find_isbns("Dune 9780441013593, Emma 9780141439587")   # ["9780441013593", "9780141439587"]
parse_call_number("shelf FIC-HER-1965, aisle 4")       # {"section": "FIC", "author": "HER", "year": 1965}
is_member_id("M-00421")                                # True
is_member_id("M-00421 (old card)")                     # False
first_year("printed in 1965, reprinted 1990")          # 1965
tidy_spaces("  Dune \n  by\tHerbert ")                 # "Dune by Herbert"
strip_tags("<b>Dune</b> by <i>Herbert</i>")            # "Dune by Herbert"
```

Watch for the lesson's pitfall: `re.match` looks only at the start of the string, so it misses a year in the middle and accepts a member id with junk after it.
Use `re.search` to look anywhere and `re.fullmatch` to validate a whole value.

## Run the tests

```bash
cd exercises/backend/py_regex
pytest
```

Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
