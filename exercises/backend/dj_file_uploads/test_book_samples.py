"""Check the bookshop's samples and covers, stored in a temporary MEDIA_ROOT.

Every test points MEDIA_ROOT at a fresh temporary folder, so the files the
tests save land there and are gone afterwards, and nothing is served: the
upload tests post multipart forms through DRF's APIClient.
"""
from datetime import datetime

import pytest
from django.core.files.base import ContentFile
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient

from book_samples.models import Book, sample_path
from book_samples.serializers import MAX_SAMPLE_BYTES, SampleSerializer

pytestmark = [pytest.mark.django_db, pytest.mark.urls("book_samples.urls")]

ISBN = "9780141439518"
PDF = b"%PDF-1.4 a sample chapter"


@pytest.fixture
def media(settings, tmp_path):
    """The MEDIA_ROOT for this test: an empty temporary folder, served under /media/."""
    settings.MEDIA_ROOT = tmp_path / "media"
    settings.MEDIA_URL = "/media/"
    return tmp_path / "media"


def stored_files(media):
    """Every file under MEDIA_ROOT, as paths relative to it."""
    if not media.exists():
        return []
    return sorted(str(p.relative_to(media)) for p in media.rglob("*") if p.is_file())


def pdf(name="chapter 1.pdf", content=PDF):
    return SimpleUploadedFile(name, content, content_type="application/pdf")


def test_each_book_has_its_own_samples_folder():
    assert sample_path(Book(isbn=ISBN), "chapter1.pdf") == f"samples/{ISBN}/chapter1.pdf"
    assert sample_path(Book(isbn="9780099549482"), "intro.pdf") == "samples/9780099549482/intro.pdf"


def test_a_saved_sample_is_a_file_under_media_root_and_a_name_in_the_row(media):
    book = Book.objects.create(isbn=ISBN, title="Pride and Prejudice")
    book.sample.save("chapter 1.pdf", ContentFile(PDF))
    name = f"samples/{ISBN}/chapter_1.pdf"
    assert book.sample.name == name, "Django cleans the name: the space becomes _"
    assert (media / name).read_bytes() == PDF
    assert book.sample.url == f"/media/{name}"
    assert book.sample.size == len(PDF)
    book.refresh_from_db()
    assert book.sample.name == name, "the column keeps the stored name"


def test_a_second_file_with_the_same_name_does_not_overwrite_the_first(media):
    first = Book.objects.create(isbn=ISBN, title="Pride and Prejudice")
    first.sample.save("chapter 1.pdf", ContentFile(PDF))
    again = Book.objects.create(isbn=ISBN, title="Pride and Prejudice, second copy")
    again.sample.save("chapter 1.pdf", ContentFile(b"%PDF-1.4 another"))
    assert again.sample.name != first.sample.name
    assert again.sample.name.startswith(f"samples/{ISBN}/chapter_1_")
    assert (media / first.sample.name).read_bytes() == PDF
    assert len(stored_files(media)) == 2


def test_a_book_needs_no_sample():
    book = Book.objects.create(isbn=ISBN, title="Pride and Prejudice")
    book.full_clean()
    assert not book.sample
    assert not book.cover


def test_covers_go_in_a_folder_per_year_and_month(media):
    book = Book.objects.create(isbn=ISBN, title="Pride and Prejudice")
    book.cover.save("front.jpg", ContentFile(b"not really a jpeg"))
    assert book.cover.name == datetime.now().strftime("covers/%Y/%m/front.jpg")
    assert stored_files(media) == [book.cover.name]


def test_the_serializer_takes_a_small_pdf(media):
    serializer = SampleSerializer(data={"isbn": ISBN, "title": "Pride and Prejudice", "sample": pdf()})
    assert serializer.is_valid(), serializer.errors
    book = serializer.save()
    assert book.sample.name == f"samples/{ISBN}/chapter_1.pdf"


@pytest.mark.parametrize("upload", [
    pdf("big.pdf", b"x" * (MAX_SAMPLE_BYTES + 1)),
    pdf("chapter1.exe"),
    pdf("chapter1.pdf.txt"),
], ids=["too large", "not a pdf", "pdf then txt"])
def test_the_serializer_refuses_a_large_or_non_pdf_file(media, upload):
    serializer = SampleSerializer(data={"isbn": ISBN, "title": "Pride and Prejudice", "sample": upload})
    assert not serializer.is_valid()
    assert list(serializer.errors) == ["sample"]


def test_the_serializer_takes_a_pdf_whatever_the_case_of_its_name(media):
    serializer = SampleSerializer(data={"isbn": ISBN, "title": "Emma", "sample": pdf("EMMA.PDF")})
    assert serializer.is_valid(), serializer.errors


def test_posting_a_sample_saves_it_and_answers_its_name_and_url(media):
    response = APIClient().post(
        "/samples/", {"isbn": ISBN, "title": "Pride and Prejudice", "sample": pdf()}, format="multipart",
    )
    assert response.status_code == 201, response.content
    name = f"samples/{ISBN}/chapter_1.pdf"
    assert response.json() == {"isbn": ISBN, "name": name, "url": f"/media/{name}"}
    assert Book.objects.get().sample.name == name
    assert stored_files(media) == [name]


def test_a_refused_upload_answers_400_and_saves_nothing(media):
    response = APIClient().post(
        "/samples/", {"isbn": ISBN, "title": "Pride and Prejudice", "sample": pdf("big.pdf", b"x" * (MAX_SAMPLE_BYTES + 1))},
        format="multipart",
    )
    assert response.status_code == 400
    assert "sample" in response.json()
    assert not Book.objects.exists()
    assert stored_files(media) == []


def test_a_json_body_is_refused_with_415(media):
    response = APIClient().post("/samples/", {"isbn": ISBN, "title": "Emma"}, format="json")
    assert response.status_code == 415
