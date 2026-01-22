from django.urls import path, include
from django.contrib import admin
from rest_framework.routers import DefaultRouter
from .views import (
    MovieViewSet,
    search_content,
    get_content_details,
    search_movies,
    search_local_movies,
    import_movie,
    bulk_import_movies,
)

router = DefaultRouter()
router.register(r'movies', MovieViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('search/', search_content, name='search_content'),
    path('search/movies/', search_movies, name='search_movies'),
    path('search/local/', search_local_movies, name='search_local_movies'),
    path('details/<str:imdb_id>/', get_content_details, name='get_content_details'),
    path('import/movie/<str:imdb_id>/', import_movie, name='import_movie'),
    path('import/movies/bulk/', bulk_import_movies, name='bulk_import_movies'),
]