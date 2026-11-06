# Book samples

Topic: File Uploads & Storage (Backend, Production Infrastructure).
Time: about 25 minutes.

## Task

The bookshop lets publishers upload a free sample chapter of each book as a PDF, and keeps a cover picture for each book.
The `Book` model has its ISBN and title; give it its files, then take samples in through the API.
The URLconf (`book_samples/urls.py`) is written for you.

In `book_samples/models.py`:

- `sample_path(book, filename)` returns where a book's sample is stored, inside `MEDIA_ROOT`: `samples/<the book's isbn>/<filename>`.
- `Book.sample` is an optional `FileField` stored at `sample_path`.
- `Book.cover` is an optional `FileField` stored in a folder per year and month, such as `covers/2026/11/`.
  A plain `FileField` is enough: `ImageField` would also check that the file is a picture, which needs Pillow installed.

In `book_samples/serializers.py`, `SampleSerializer` is a `ModelSerializer` of `Book` with the fields `isbn`, `title` and `sample`.
Its `validate_sample` refuses a file larger than `MAX_SAMPLE_BYTES` (2 MB), or one whose name does not end in `.pdf` in any case, with a `ValidationError`.

In `book_samples/views.py`, `SampleUpload` is an `APIView` that takes multipart form data only, so a JSON body gets 415.
Its `post()` validates the form with `SampleSerializer`, answers the errors with 400, or saves the book and answers 201 with the ISBN, the sample's stored name and its URL.

## Examples

```python
book.sample.save("chapter 1.pdf", ContentFile(b"%PDF-1.4"))
book.sample.name     # "samples/9780141439518/chapter_1.pdf", what the column stores
book.sample.url      # "/media/samples/9780141439518/chapter_1.pdf", MEDIA_URL + name
book.cover.save("front.jpg", ContentFile(b"..."))
book.cover.name      # "covers/2026/11/front.jpg", this year and month
```

```text
POST /samples/  multipart: isbn, title, sample=chapter 1.pdf
     201  {"isbn": "9780141439518", "name": "samples/9780141439518/chapter_1.pdf",
           "url": "/media/samples/9780141439518/chapter_1.pdf"}
POST /samples/  multipart: sample=big.pdf (3 MB)    400  {"sample": ["..."]}
POST /samples/  JSON body                           415
```

A second file saved under a name that is already taken gets a random suffix, such as `chapter_1_a1B2c3D.pdf`, instead of overwriting the first.

Watch for the lesson's pitfall: `static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)` in `urls.py` serves uploads only while `DEBUG` is on.
With `DEBUG = False` every uploaded file is a 404 until Nginx serves `MEDIA_ROOT`, as the `dj_nginx` exercise's `location /media/` does, or django-storages moves the files to S3.
None of the code you write here changes when that happens.

## Run the tests

```bash
cd exercises/backend/dj_file_uploads
pytest
```

`conftest.py` sets Django up for you, on a database that lives in memory for the test run; leave it as it is.
Each test points `MEDIA_ROOT` at a new temporary folder, so the files it saves land there and are gone afterwards, and the upload tests post their forms through DRF's `APIClient`, so no server runs.
When they all pass, tick the exercise done in Recall under Progress, Topics.
