"""Auth Mastery: reference solution."""
from django.contrib.auth import get_user_model

from cards.models import LibraryCard


class CardBackend:
    def authenticate(self, request, card=None, pin=None):
        if card is None or pin is None:
            return None
        found = LibraryCard.objects.select_related("reader").filter(number=card).first()
        if found is None:
            return None
        reader = found.reader
        if reader.is_active and reader.check_password(pin):
            return reader
        return None

    def get_user(self, user_id):
        return get_user_model().objects.filter(pk=user_id).first()
