"""Loan log: reference solution."""


def save_loans(path, titles):
    with open(path, "w") as f:
        for title in titles:
            f.write(title + "\n")


def add_loan(path, title):
    with open(path, "a") as f:
        f.write(title + "\n")


def read_loans(path):
    titles = []
    with open(path) as f:
        for line in f:
            title = line.strip()
            if title:
                titles.append(title)
    return titles


def first_loan(path):
    with open(path) as f:
        return f.readline().strip()


def longest_title(path):
    longest = ""
    with open(path) as f:
        for line in f:
            title = line.strip()
            if len(title) > len(longest):
                longest = title
    return longest
