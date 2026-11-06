"""Admin Customization: reference solution."""
from django.contrib import admin
from django.db.models import Count

from backoffice.models import Book, Review

# The library's staff site. The exercise settings leave Django's admin app out, and with it
# the default admin.site, so register on this site instead: @admin.register(Model, site=staff_site).
staff_site = admin.AdminSite(name="staff")


class ReviewInline(admin.TabularInline):
    model = Review
    fields = ("stars", "text")
    extra = 1


@admin.register(Book, site=staff_site)
class BookAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "stock", "in_stock", "review_count")
    list_filter = ("author",)
    search_fields = ("title", "author")
    ordering = ("title",)
    fieldsets = (
        (None, {"fields": ("title", "author")}),
        ("Stock", {"fields": ("stock", "created")}),
    )
    readonly_fields = ("created",)
    inlines = [ReviewInline]
    actions = ["sell_out"]

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(review_count=Count("reviews"))

    @admin.display(boolean=True, description="In stock")
    def in_stock(self, obj):
        return obj.stock > 0

    @admin.display(description="Reviews", ordering="review_count")
    def review_count(self, obj):
        return obj.review_count

    @admin.action(description="Mark selected as sold out")
    def sell_out(self, request, queryset):
        queryset.update(stock=0)
