"""Management Commands: reference solution."""
import datetime

from django.core.management.base import BaseCommand, CommandError

from upkeep.models import Loan


class Command(BaseCommand):
    help = "List the loans overdue on a given day, and optionally flag them."

    def add_arguments(self, parser):
        parser.add_argument("today", type=datetime.date.fromisoformat)
        parser.add_argument("--grace", type=int, default=0)
        parser.add_argument("--flag", action="store_true")

    def handle(self, *args, **options):
        if options["grace"] < 0:
            raise CommandError("--grace cannot be negative.")
        today = options["today"]
        cutoff = today - datetime.timedelta(days=options["grace"])
        overdue = Loan.objects.filter(due__lt=cutoff).order_by("due", "title")
        if not overdue.exists():
            self.stdout.write("Nothing overdue.")
            return
        for loan in overdue:
            self.stdout.write(f"{loan.title} ({loan.reader}), {(today - loan.due).days} days late")
        self.stdout.write(f"{overdue.count()} overdue")
        if options["flag"]:
            self.stdout.write(f"Flagged {overdue.update(flagged=True)}")
