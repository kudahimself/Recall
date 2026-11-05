"""Shelf labels: reference solution."""


def clean_title(raw):
    return raw.strip().title()


def shelf_code(title, shelf):
    return f"{clean_title(title)[:3].upper()}-{shelf}"


def parse_pages(text):
    return int(text.replace("pages", ""))


def reading_time(pages, pages_per_hour):
    minutes = pages * 60 // pages_per_hour
    return f"{minutes // 60} h {minutes % 60} min"


def average_pages(total_pages, books):
    return total_pages / books
