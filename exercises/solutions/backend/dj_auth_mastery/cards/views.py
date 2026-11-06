"""Auth Mastery: reference solution."""
from django.contrib.auth import authenticate, get_user_model, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import PermissionDenied
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST

from cards.models import LibraryCard, Loan


def issue_card(username, number, pin):
    User = get_user_model()
    validate_password(pin, User(username=username))
    reader = User.objects.create_user(username, password=pin)
    LibraryCard.objects.create(number=number, reader=reader)
    return reader


def card_login(request):
    reader = authenticate(request, card=request.POST.get("card"), pin=request.POST.get("pin"))
    if reader is None:
        return HttpResponse("Unknown card or wrong PIN.", status=401)
    login(request, reader)
    return JsonResponse({"reader": reader.username, "backend": reader.backend})


def can_renew(user, loan):
    if not user.is_active:
        return False
    return loan.reader_id == user.pk or user.has_perm("cards.change_loan")


@login_required
@require_POST
def renew(request, pk):
    loan = get_object_or_404(Loan, pk=pk)
    if not can_renew(request.user, loan):
        raise PermissionDenied
    loan.renewals += 1
    loan.save(update_fields=["renewals"])
    return JsonResponse({"title": loan.title, "renewals": loan.renewals})
