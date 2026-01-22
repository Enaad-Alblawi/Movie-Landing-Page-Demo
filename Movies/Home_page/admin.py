from django.contrib import admin
from .models import Movie

# Register your models here.
@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ('title', 'year', 'imdb_rating', 'genre', 'director')
    search_fields = ('title', 'director', 'actors', 'genre')
    list_filter = ('year', 'rated', 'language')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-imdb_rating',)
