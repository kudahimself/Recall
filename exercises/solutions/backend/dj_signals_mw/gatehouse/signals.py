"""Signals & Middleware: reference solution."""
from django.db.models import F
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from gatehouse.models import AuditEntry, Book, Loan


@receiver(post_save, sender=Loan)
def count_loan(sender, instance, created, **kwargs):
    if created:
        Book.objects.filter(pk=instance.book_id).update(times_lent=F("times_lent") + 1)


@receiver(post_delete, sender=Loan)
def log_deleted_loan(sender, instance, **kwargs):
    AuditEntry.objects.create(message=f"Loan of {instance.book.title} to {instance.reader} deleted")
