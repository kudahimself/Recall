"""Auth Mastery: a custom authentication backend.

Write CardBackend so the tests in test_card_auth.py pass.
Run them from the exercise folder with: pytest
"""
from django.contrib.auth import get_user_model

from cards.models import LibraryCard


class CardBackend:
    """Signs a reader in with a library card number and a PIN.

    The PIN is the reader's password, so it is stored hashed like any password.
    """

    def authenticate(self, request, card=None, pin=None):
        """The card's reader when the card exists, the reader is active and the PIN is right.

        Otherwise None, never an exception, so the next backend in the list can try.
        """
        # TODO
        raise NotImplementedError

    def get_user(self, user_id):
        """The user with this primary key, or None: Django calls it on every request
        to reload the signed-in user from the session."""
        # TODO
        raise NotImplementedError
