from rest_framework import viewsets
from ..models import Movie
from ..serializers import MovieSerializer


# MovieViewSet for basic CRUD operations
class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
