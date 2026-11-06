"""Forms Mastery: reference solution."""
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST

from suggestions.forms import SuggestionForm


@login_required
@require_POST
def suggest(request):
    form = SuggestionForm(request.POST, request.FILES)
    if not form.is_valid():
        errors = {field: [e["message"] for e in errs] for field, errs in form.errors.get_json_data().items()}
        return JsonResponse({"errors": errors}, status=400)
    suggestion = form.save(commit=False)
    suggestion.suggested_by = request.user
    suggestion.save()
    form.save_m2m()
    sample = form.cleaned_data["sample"]
    return JsonResponse({
        "id": suggestion.pk,
        "title": suggestion.title,
        "tags": sorted(tag.name for tag in suggestion.tags.all()),
        "sample": sample.name if sample else None,
    }, status=201)
