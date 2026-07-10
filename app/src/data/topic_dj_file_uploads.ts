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
      id: 'be-infra-uploads-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_FILE_UPLOADS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Create a Django model with an ImageField, configure MEDIA_ROOT and MEDIA_URL in settings, write a DRF serializer that handles file upload, and add the URL pattern for serving media files in development.',
      starterCode: `# models.py, settings.py, serializers.py, urls.py
# Show all four files
`,
      testCases: [
        {
          input: 'File upload setup',
          expectedOutput: 'Model with ImageField, MEDIA settings, serializer, URL config',
          description: 'Should set up complete file upload infrastructure',
        },
      ],
      solution: `# models.py
from django.db import models
from django.conf import settings


class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to="avatars/%Y/%m/", blank=True)
    bio = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.username}'s profile"


# settings.py (add to base settings)
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"


# serializers.py
from rest_framework import serializers
from .models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(required=False)

    class Meta:
        model = UserProfile
        fields = ["id", "user", "avatar", "bio"]
        read_only_fields = ["user"]

    def validate_avatar(self, value):
        if value.size > 5 * 1024 * 1024:  # 5MB limit
            raise serializers.ValidationError("Image must be under 5MB.")
        return value


# urls.py
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include

urlpatterns = [
    path("api/", include("myapp.urls")),
]

# Only serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)`,
      explanation: 'ImageField stores the file path in the database and saves the actual file to MEDIA_ROOT/upload_to/. The upload_to="avatars/%Y/%m/" organizes files by year and month, preventing a single directory from accumulating thousands of files. MEDIA_URL tells Django how to generate URLs for these files. The serializer validates file size to prevent abuse. The static() URL pattern serves media files in development only — in production, Nginx serves them directly from the media directory, which is far more efficient.',
      hints: [
        'upload_to supports strftime format strings for date-based directories',
        'ImageField requires Pillow: pip install Pillow',
        'static() in urls.py is only for development — Nginx serves media in production',
        'validate_avatar runs during serializer.is_valid()',
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
      explanation: 'Django\'s storage backend is an abstraction layer — your code calls model.file.save() and the backend decides where the file goes. FileSystemStorage writes to MEDIA_ROOT on the local disk. This works for single-server setups but breaks with multiple servers (each server has different files). S3 storage (django-storages) saves to AWS S3, which is accessible from any server, automatically replicated, and can be fronted by CloudFront CDN. Switching backends requires zero changes to your models or views — just change DEFAULT_FILE_STORAGE in settings.',
      tags: ['storage-backend', 's3', 'django-storages', 'infrastructure'],
      concepts: ['dj-storage-backends'],
    },
];
