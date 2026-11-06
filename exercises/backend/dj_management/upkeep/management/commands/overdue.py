"""Management Commands: practise a custom command with arguments.

The file name is the command's name: python manage.py overdue 2026-03-20 --grace 2 --flag
Write the Command so the tests in test_upkeep.py pass.
Run them from the exercise folder with: pytest
"""
import datetime

from django.core.management.base import BaseCommand, CommandError

from upkeep.models import Loan


class Command(BaseCommand):
    help = "List the loans overdue on a given day, and optionally flag them."

    def add_arguments(self, parser):
        # TODO:
        # - today, a positional date written 2026-03-20 (turn it into a datetime.date);
        # - --grace, a whole number of days a loan may run past its due date, default 0;
        # - --flag, a switch that marks the overdue loans flagged.
        pass

    def handle(self, *args, **options):
        """Write one line per overdue loan, earliest due first, then by title:
        "<title> (<reader>), <n> days late", then "<count> overdue".

        A loan is overdue when its due date is more than grace days before today.
        With --flag, mark them flagged in one UPDATE and write "Flagged <count>".
        With none overdue, write only "Nothing overdue."
        A negative --grace stops with CommandError("--grace cannot be negative.").
        """
        # TODO
        raise NotImplementedError
