"""Admin Customization: practise ModelAdmin options, a computed column, an inline and an action.

Write ReviewInline and BookAdmin so the tests in test_backoffice_admin.py pass.
In a project, the admin app imports every admin.py at startup; the tests import this one themselves.
Run them from the exercise folder with: pytest
"""
from django.contrib import admin
from django.db.models import Count

from backoffice.models import Book, Review

# The library's staff site. The exercise settings leave Django's admin app out, and with it
# the default admin.site, so register on this site instead: @admin.register(Model, site=staff_site).
staff_site = admin.AdminSite(name="staff")


class ReviewInline(admin.TabularInline):
    """TODO: a book's reviews as a table on the book's edit page, showing stars and text,
    with one blank row for a new review."""


class BookAdmin(admin.ModelAdmin):
    """TODO: register it for Book on staff_site, then:

    - the changelist shows the columns title, author, stock, in_stock and review_count;
    - a sidebar filter by author, a search box over title and author, sorted by title;
    - the edit page groups title and author first (no heading), then stock and created
      under "Stock", with created shown as read-only text;
    - the reviews inline, and one action, sell_out.
    """

    # TODO: in_stock(obj), a tick or a cross: stock above 0. Column heading "In stock".

    # TODO: review_count(obj), how many reviews the book has, without a query per row.
    #   Column heading "Reviews", sortable by that count.

    # TODO: sell_out(request, queryset), labelled "Mark selected as sold out":
    #   every ticked book's stock to 0, in one UPDATE.
