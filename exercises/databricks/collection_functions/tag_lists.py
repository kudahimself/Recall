"""Tag lists: arrays, maps and explode on a small catalogue.

Fill in the functions.
Books have the columns book_id, title and tags (an array of strings, sometimes empty).
"""


def add_tag_count(books):
    """Add `n_tags`: how many tags each book has."""
    # TODO: use the function that counts the elements of an array
    raise NotImplementedError


def add_sorted_tags(books):
    """Add `tags_sorted`: each book's tags sorted A to Z."""
    # TODO: sort the array inside each row
    raise NotImplementedError


def titles_with_tag(books, tag):
    """The titles of books that have `tag`, sorted A to Z, as a Python list."""
    # TODO: filter on whether the array holds the value
    raise NotImplementedError


def tag_rows(books):
    """One row per tag with the columns title and tag.

    A book with no tags has no rows.
    """
    # TODO: turn each array element into a row of its own
    raise NotImplementedError


def tag_rows_keep_all(books):
    """Like tag_rows, but a book with an empty or null tag list still gets one row, with a null tag."""
    # TODO: pick the variant of the row-per-element function that keeps empty arrays
    raise NotImplementedError


def add_copies_map(stock):
    """For a stock DataFrame with columns title, leeds and york (copy counts), add `copies`.

    `copies` is a map from the branch name to its count, such as {"leeds": 2, "york": 0}.
    """
    # TODO: build a map from key and value columns in turn
    raise NotImplementedError
