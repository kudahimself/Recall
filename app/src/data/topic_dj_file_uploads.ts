/**
 * Topic.DJ_FILE_UPLOADS — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   backendInfraQuestions.ts (3)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const dj_file_uploads_questions: Question[] = [
  {
      id: 'dj-uploads-basics-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_FILE_UPLOADS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the field type for image uploads, and the two settings that control where uploaded files are stored and served from.',
      template: `# models.py
from django.db import models

class UserProfile(models.Model):
    avatar = models.___(upload_to="avatars/%Y/%m/", blank=True)

# settings.py
___ = "/media/"
___ = BASE_DIR / "media"`,
      blanks: ['ImageField', 'MEDIA_URL', 'MEDIA_ROOT'],
      solution: '# models.py\nfrom django.db import models\n\nclass UserProfile(models.Model):\n    avatar = models.ImageField(upload_to="avatars/%Y/%m/", blank=True)\n\n# settings.py\nMEDIA_URL = "/media/"\nMEDIA_ROOT = BASE_DIR / "media"',
      explanation: '`ImageField` is a `FileField` that also checks the upload really is an image, which needs Pillow. It writes the file under `MEDIA_ROOT`, in the `upload_to` folder, and saves only the file\'s name, such as `avatars/2026/11/ana.png`, in the database. `MEDIA_ROOT` is the absolute filesystem directory files are written to; `MEDIA_URL` is the URL prefix they are served under.',
      hints: ['Field type for images specifically (not generic FileField)', 'ROOT = filesystem path; URL = the public prefix'],
      tags: ['django', 'file-upload', 'ImageField', 'MEDIA_ROOT', 'cloze'],
      concepts: ['dj-storage-backends'],
    },
  {
      id: 'be-infra-uploads-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_FILE_UPLOADS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: `Set up avatar uploads across four files.

- \`models.py\`: a \`UserProfile\` model with a one-to-one \`user\` link to \`settings.AUTH_USER_MODEL\`, deleted along with the user, and an optional image field \`avatar\` stored in a \`avatars/<year>/<month>/\` folder.
- \`settings.py\`: uploaded files are written to the \`media\` folder in \`BASE_DIR\` and served under the URL prefix \`/media/\`.
- \`serializers.py\`: a \`UserProfileSerializer\` model serializer with the fields \`id\`, \`user\` and \`avatar\`, where \`user\` is read-only, that refuses an avatar larger than 5 MB (5 * 1024 * 1024 bytes) with the message \`Image must be under 5 MB.\`
- \`urls.py\`: the project's \`urlpatterns\` list already exists; add the pattern that serves the uploaded files while \`DEBUG\` is on.`,
      starterCode: `# models.py


# settings.py


# serializers.py


# urls.py
`,
      testCases: [
        {
          input: 'File upload setup',
          expectedOutput: 'Model with ImageField, MEDIA settings, serializer, URL config',
          description: 'Should set up complete file upload infrastructure',
        },
      ],
      requires: [/ImageField/, /def\s+validate_avatar/],
      solution: `# models.py
from django.conf import settings
from django.db import models


class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to="avatars/%Y/%m/", blank=True)


# settings.py
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"


# serializers.py
from rest_framework import serializers
from .models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["id", "user", "avatar"]
        read_only_fields = ["user"]

    def validate_avatar(self, value):
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("Image must be under 5 MB.")
        return value


# urls.py
from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
# OR
# models.py
from django.conf import settings
from django.db import models


class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to="avatars/%Y/%m/", blank=True)


# settings.py
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"


# serializers.py
from rest_framework import serializers
from .models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["id", "user", "avatar"]
        read_only_fields = ["user"]

    def validate_avatar(self, value):
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("Image must be under 5 MB.")
        return value


# urls.py
from django.conf import settings
from django.conf.urls.static import static

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)`,
      explanation: '`ImageField` keeps only the file\'s name in its column and writes the file under `MEDIA_ROOT`, in the `upload_to` folder; `%Y/%m/` gives each month its own folder, so no single directory collects every avatar. `MEDIA_URL` is what `.url` puts in front of the stored name. The model serializer builds the `avatar` field from the model, and DRF calls `validate_avatar` during `is_valid()`, so an oversized file becomes a 400 response with the message instead of a saved row. `static()` adds its pattern only while `DEBUG` is on, so the `if settings.DEBUG:` guard is optional; in production Nginx serves `/media/` from `MEDIA_ROOT`, or the files live on S3.',
      tieredHints: {
        apiSignature: 'models.ImageField(upload_to=...); def validate_<field>(self, value); static(prefix, document_root=...)',
        skeleton: '# models.py\nfrom django.conf import settings\nfrom django.db import models\n\n\nclass UserProfile(models.Model):\n    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)\n    avatar = models.____(upload_to="avatars/%Y/%m/", blank=True)\n\n\n# settings.py\n____ = "/media/"\n____ = BASE_DIR / "media"\n\n\n# serializers.py\nfrom rest_framework import serializers\nfrom .models import UserProfile\n\n\nclass UserProfileSerializer(serializers.ModelSerializer):\n    class Meta:\n        model = UserProfile\n        fields = ["id", "user", "avatar"]\n        read_only_fields = ["user"]\n\n    def ____(self, value):\n        if value.size > 5 * 1024 * 1024:\n            raise serializers.____("Image must be under 5 MB.")\n        return value\n\n\n# urls.py\nfrom django.conf import settings\nfrom django.conf.urls.static import static\n\nif settings.DEBUG:\n    urlpatterns += ____(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)',
      },
      hints: [
        'upload_to accepts strftime codes such as %Y and %m for date folders.',
        'MEDIA_ROOT is the folder on disk; MEDIA_URL is the URL prefix.',
        'A serializer method named validate_<field> checks one field and raises serializers.ValidationError to refuse it.',
        'static() from django.conf.urls.static serves MEDIA_ROOT under MEDIA_URL in development.',
      ],
      tags: ['file-upload', 'imagefield', 'media', 'serializer', 'django'],
      concepts: ['dj-serializer-validation'],
    },
  {
      id: 'be-infra-uploads-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_FILE_UPLOADS,
      course: Course.BACKEND,
      question: 'Why should you NOT serve media files with Django in production?',
      options: [
        { id: 'a', text: 'Django cannot stream files larger than available RAM, so big downloads crash the worker process', isCorrect: false },
        { id: 'b', text: 'Performance only suffers past roughly 10,000 stored files, so smaller apps can serve media through Django safely', isCorrect: false },
        { id: 'c', text: 'Django\'s URL router rejects paths that point at media files, so uploads would 404 in production', isCorrect: false },
        { id: 'd', text: 'Serving files through Python blocks Gunicorn workers — let Nginx serve them from disk, or S3 + CloudFront for CDN delivery', isCorrect: true },
      ],
      explanation: 'Every file Django serves ties up a Gunicorn worker for the entire download duration. With 4 workers, just 4 users downloading large files simultaneously means no workers are available for other requests — your API becomes unresponsive. Nginx serves files from disk using efficient kernel-level I/O (sendfile) without blocking. For even better performance, S3 + CloudFront offloads file storage and delivery entirely, and the CDN caches files at edge locations worldwide.',
      tags: ['media', 'nginx', 'performance', 'production', 's3'],
      concepts: ['dj-storage-backends'],
    },
  {
      id: 'be-infra-uploads-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_FILE_UPLOADS,
      course: Course.BACKEND,
      question: 'What is a Django storage backend, and when should you use S3 instead of the default?',
      options: [
        { id: 'a', text: 'Storage backends only apply to uploads made through the Django admin — API uploads always write to local disk', isCorrect: false },
        { id: 'b', text: 'S3 only pays off past roughly a terabyte of files — below that, local disk is always the better choice', isCorrect: false },
        { id: 'c', text: 'FileSystemStorage saves to local disk; use S3 via django-storages when running multiple servers or needing CDN delivery and backups', isCorrect: true },
        { id: 'd', text: 'Every production Django project must use S3, because FileSystemStorage is deprecated for deployment', isCorrect: false },
      ],
      explanation: 'Django\'s storage backend is an abstraction layer: your code calls model.file.save() and the backend decides where the file goes. FileSystemStorage writes to MEDIA_ROOT on the local disk. This works for single-server setups but breaks with multiple servers (each server has different files). S3 storage (django-storages) saves to AWS S3, which is accessible from any server, automatically replicated, and can be fronted by CloudFront CDN. Switching backends requires zero changes to your models or views: just point STORAGES["default"] at the S3 backend in settings (the older DEFAULT_FILE_STORAGE setting was removed in Django 5.1).',
      tags: ['storage-backend', 's3', 'django-storages', 'infrastructure'],
      concepts: ['dj-storage-backends'],
    },
  {
      id: 'dj-uploads-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_FILE_UPLOADS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'The project uses the default file storage with `MEDIA_ROOT = "/srv/app/media"` and `MEDIA_URL = "/media/"`, and the media directory starts empty. These lines run in `python manage.py shell`. What do the three `print` calls output? The answer is three lines.',
      code: `# models.py: class Document(models.Model): scan = models.FileField(upload_to="scans/")
from django.core.files.base import ContentFile

doc = Document()
doc.scan.save("invoice-7.pdf", ContentFile(b"%PDF-1.4"), save=True)
print(Document.objects.values_list("scan", flat=True).get(pk=doc.pk))
print(doc.scan.url)
print(doc.scan.path)`,
      expectedOutput: `scans/invoice-7.pdf
/media/scans/invoice-7.pdf
/srv/app/media/scans/invoice-7.pdf`,
      explanation: 'A `FileField` stores only the file\'s name relative to the storage, `upload_to` plus the file name, in its database column, so the row holds `scans/invoice-7.pdf`. The file itself is written to disk under `MEDIA_ROOT`, which is where `.path` points, and `.url` puts `MEDIA_URL` in front of the same name to give the address a browser asks for. Moving the files to S3 changes the storage, not the stored names.',
      hints: ['The database column holds the path relative to MEDIA_ROOT, not the file.', 'MEDIA_ROOT is a directory on disk; MEDIA_URL is the public URL prefix.'],
      tags: ['django', 'file-uploads', 'FileField', 'MEDIA_ROOT', 'MEDIA_URL', 'predict'],
      concepts: ['dj-storage-backends'],
    },
];
