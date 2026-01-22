from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import Movie
from ..serializers import MovieSerializer


# Search movies in local PostgreSQL database
@api_view(['GET'])
def search_local_movies(request):
    query = request.GET.get('q', '')
    if not query:
        return Response({"error": "Query parameter 'q' is required."},
                        status=status.HTTP_400_BAD_REQUEST)
    
    # Search in title, director, actors, genre
    movies = Movie.objects.filter(
        title__icontains=query
    ) | Movie.objects.filter(
        director__icontains=query
    ) | Movie.objects.filter(
        actors__icontains=query
    ) | Movie.objects.filter(
        genre__icontains=query
    )
    
    movies = movies.distinct()[:20]  # Limit to 20 results
    serializer = MovieSerializer(movies, many=True)
    
    return Response({
        "total_results": movies.count(),
        "results": serializer.data
    })
