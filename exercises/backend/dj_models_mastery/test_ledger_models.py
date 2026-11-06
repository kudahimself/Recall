import datetime

import pytest
from django.core.exceptions import ValidationError
from django.db import IntegrityError, connection, transaction

from ledger.models import Item, Loan, OverdueLoan, Periodical, Stamped

pytestmark = pytest.mark.django_db



def mar(day):
    """A day in March 2026."""
    return datetime.date(2026, 3, day)


@pytest.fixture
def dune():
    return Item.objects.create(title="Dune", shelf_mark="SCI-042", copies=2)


def errors_of(obj):
    with pytest.raises(ValidationError) as caught:
        obj.full_clean()
    return caught.value.message_dict


def test_stamped_is_abstract_and_its_fields_are_copied_down(dune):
    assert Stamped._meta.abstract
    assert "ledger_stamped" not in connection.introspection.table_names()
    for model in (Item, Loan):
        assert model._meta.get_field("created").auto_now_add
        assert model._meta.get_field("updated").auto_now
    long_ago = datetime.datetime(2020, 1, 1, tzinfo=datetime.timezone.utc)
    Item.objects.filter(pk=dune.pk).update(created=long_ago, updated=long_ago)
    dune.refresh_from_db()
    dune.copies = 3
    dune.save()
    assert dune.created == long_ago
    assert dune.updated > long_ago


def test_field_validators_run_in_full_clean_but_not_in_save():
    bad = Item(title="Dune", shelf_mark="sci-42", copies=0)
    assert sorted(errors_of(bad)) == ["copies", "shelf_mark"]
    bad.save()
    assert Item.objects.get(pk=bad.pk).copies == 0
    Item(title="Emma", shelf_mark="CLA-001", copies=1).full_clean()
    assert str(bad) == "Dune"


def test_clean_limits_a_loan_to_28_days(dune):
    Loan(item=dune, reader="ann", lent=mar(1), due=mar(29)).full_clean()
    errors = errors_of(Loan(item=dune, reader="ann", lent=mar(1), due=mar(30)))
    assert errors == {"__all__": ["A loan runs at most 28 days."]}


def test_the_database_refuses_a_due_date_before_the_loan(dune):
    early = Loan(item=dune, reader="ann", lent=mar(9), due=mar(1))
    assert errors_of(early) == {"__all__": ["Due date is before the loan date."]}
    with pytest.raises(IntegrityError), transaction.atomic():
        early.save()
    assert Loan.objects.count() == 0


def test_one_open_loan_per_reader_and_item(dune):
    first = Loan.objects.create(item=dune, reader="ann", lent=mar(1), due=mar(15))
    again = Loan(item=dune, reader="ann", lent=mar(2), due=mar(16))
    assert errors_of(again) == {"__all__": ["This reader already has this item on loan."]}
    with pytest.raises(IntegrityError), transaction.atomic():
        again.save()
    Loan.objects.create(item=dune, reader="ben", lent=mar(2), due=mar(16))
    first.returned = True
    first.save()
    again.full_clean()
    again.save()
    assert sorted(dune.loans.values_list("reader", flat=True)) == ["ann", "ann", "ben"]
    dune.delete()
    assert Loan.objects.count() == 0


def test_a_periodical_has_its_own_table_joined_to_item():
    vogue = Periodical.objects.create(title="Vogue", shelf_mark="MAG-007", copies=1, issue=12)
    Item.objects.create(title="Emma", shelf_mark="CLA-001", copies=1)
    assert Periodical._meta.db_table != Item._meta.db_table
    assert Periodical._meta.get_field("item_ptr").one_to_one
    assert sorted(str(i) for i in Item.objects.all()) == ["Emma", "Vogue"]
    assert Item.objects.get(title="Vogue").periodical.issue == 12
    assert vogue.created is not None


def test_overdue_loan_is_a_proxy_of_loan(dune):
    assert OverdueLoan._meta.proxy
    assert OverdueLoan._meta.db_table == Loan._meta.db_table
    assert OverdueLoan._meta.local_fields == []
    Loan.objects.create(item=dune, reader="ann", lent=mar(1), due=mar(20))
    Loan.objects.create(item=dune, reader="ben", lent=mar(1), due=mar(10))
    overdue = list(OverdueLoan.objects.all())
    assert [loan.reader for loan in overdue] == ["ben", "ann"]
    assert [loan.days_late(mar(15)) for loan in overdue] == [5, 0]
    assert Loan.objects.count() == 2
