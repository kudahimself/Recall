"""Authentication & Permissions: reference solution, the views."""
from django.contrib.auth import authenticate, get_user_model, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import Group, Permission
from django.http import HttpResponse, HttpResponseForbidden, JsonResponse
from django.shortcuts import get_object_or_404, redirect

from members.models import Loan


def register(username, password):
    return get_user_model().objects.create_user(username, password=password)


def make_librarian(user):
    group = Group.objects.filter(name="Librarians").first()
    if group is None:
        group = Group.objects.create(name="Librarians")
        group.permissions.add(Permission.objects.get(codename="change_loan", content_type__app_label="members"))
    user.groups.add(group)


def sign_in(request):
    user = authenticate(
        request, username=request.POST.get("username"), password=request.POST.get("password"),
    )
    if user is None:
        return HttpResponse("Wrong username or password.", status=401)
    login(request, user)
    return redirect("my-loans")


def sign_out(request):
    logout(request)
    return redirect("sign-in")


@login_required
def my_loans(request):
    titles = [loan.title for loan in request.user.member_loans.order_by("title")]
    return JsonResponse({"user": request.user.username, "titles": titles})


@login_required
def renew_loan(request, pk):
    if not request.user.has_perm("members.change_loan"):
        return HttpResponseForbidden()
    loan = get_object_or_404(Loan, pk=pk)
    loan.renewals += 1
    loan.save()
    return JsonResponse({"title": loan.title, "renewals": loan.renewals})
