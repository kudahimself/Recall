"""URLs & Routing: the borrowing app's own routes.

TODO: namespace this file's names as "lending", then route, in this order:
- ""                    -> views.index,   named "index"
- "<pk>/"  (digits)     -> views.book,    named "book",   pk given to the view as an int
- "<genre>/" (a slug)   -> views.shelf,   named "shelf"
- "members/<card>/"     -> views.member,  named "member", card a UUID
- "archive/<year>/"     -> views.archive, named "archive", year exactly four digits:
                           no converter fits, so use re_path
"""
from django.urls import path, re_path

from borrowing import views

urlpatterns = []
