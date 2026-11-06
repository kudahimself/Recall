"""DRF Mastery: reference solution."""
from rest_framework import serializers

from loan_api.models import Author, Book, Tag


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ["id", "name"]


class BookSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    author_id = serializers.PrimaryKeyRelatedField(source="author", queryset=Author.objects.all(), write_only=True)
    tags = serializers.SlugRelatedField(many=True, slug_field="name", queryset=Tag.objects.all(), required=False)

    class Meta:
        model = Book
        fields = ["id", "title", "copies", "author", "author_id", "tags"]
