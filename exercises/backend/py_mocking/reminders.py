"""Overdue reminders: the code your tests check. Do not change this file."""
from clock import today
from mailer import send_email


def remind(loan, catalogue):
    """Email the member about `loan` if it is overdue; return True when a reminder went out.

    `loan` is a dict with "member" (an email address), "isbn" and "due" (a datetime.date).
    A loan is overdue once today is past its due date.
    The book's title comes from catalogue.lookup(isbn), which returns {"title": ...}.
    The lookup can raise TimeoutError: it is retried once, and a second TimeoutError is passed on.
    The email text reads like "Dune is 3 days overdue".
    """
    if today() <= loan["due"]:
        return False
    try:
        book = catalogue.lookup(loan["isbn"])
    except TimeoutError:
        book = catalogue.lookup(loan["isbn"])
    days = (today() - loan["due"]).days
    send_email(loan["member"], f"{book['title']} is {days} days overdue")
    return True
