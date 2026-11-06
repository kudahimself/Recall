"""Forms Mastery: the view that takes a suggestion.

Write suggest() so the tests in test_suggestion_forms.py pass.
"""
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST

from suggestions.forms import SuggestionForm


# TODO: signed-in readers only (others go to the login page), and POST only (others: 405).
def suggest(request):
    """Bind SuggestionForm to the posted fields and the uploaded file.

    Invalid: answer {"errors": {field: [messages]}} with status 400.
    Valid: save the suggestion with suggested_by set to the signed-in reader, keep its
    tags, and answer {"id": ..., "title": ..., "tags": [names, alphabetical],
    "sample": <the file's name, or None>} with status 201.
    """
    # TODO
    raise NotImplementedError
