"""Comprehensions: reference solution."""


def shouted(titles):
    return [title.upper() for title in titles]


def published_after(books, year):
    return [book["title"] for book in books if book["year"] > year]


def size_labels(books):
    return ["long" if book["pages"] >= 300 else "short" for book in books]


def pages_by_title(books):
    return {book["title"]: book["pages"] for book in books}


def authors(books):
    return {book["author"] for book in books}


def shelf_slots(aisles, shelves):
    return [f"{aisle}{shelf}" for aisle in aisles for shelf in shelves]


def total_pages(books):
    return sum(book["pages"] for book in books)
