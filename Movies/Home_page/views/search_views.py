import requests
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import Movie
from ..serializers import MovieSerializer

# OMDB API Configuration
import os
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '../../../.env'))
OMDB_API_KEY = os.getenv('OMDB_API_KEY')
OMDB_BASE_URL = 'http://www.omdbapi.com/'


# Search content in OMDB API (movies and TV shows)
@api_view(["GET"])
def search_content(request):
    query = request.GET.get('q', '')
    content_type = request.GET.get('type', 'movie')
    if not query:
        return Response({"error": "Query parameter 'q' is required."},
                        status=status.HTTP_400_BAD_REQUEST)
    try:
        params = {
            'apikey': OMDB_API_KEY,
            's': query,  # 's' is for search
        }

        if content_type: 
            params['type'] = content_type
        
        response = requests.get(OMDB_BASE_URL, params=params)
        data = response.json()

        if data.get('Response') == 'False':
            return Response({"error": data.get('Error', 'No results found.')},
                            status=status.HTTP_404_NOT_FOUND)

        results = []
        for item in data.get('Search', []):
            results.append({
                'imdb_id': item.get('imdbID'),
                'title': item.get('Title'),
                'year': item.get('Year'),
                'type': item.get('Type'),
                'poster': item.get('Poster') if item.get('Poster') != 'N/A' else None,
            })

        return Response({"total_results": data.get('totalResults', 0),
                         "results": results})

    except Exception as e:
        return Response({"error": str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Search movies only in OMDB API
@api_view(['GET'])
def search_movies(request):
    query = request.GET.get('q', '')
    if not query:
        return Response({"error": "Query parameter 'q' is required."},
                        status=status.HTTP_400_BAD_REQUEST)
    try:
        params = {
            'apikey': OMDB_API_KEY,
            's': query,  # 's' is for search
            'type': 'movie'
        }
        response = requests.get(OMDB_BASE_URL, params=params)
        data = response.json()

        if data.get('Response') == 'False':
            return Response({"error": data.get('Error', 'No results found.')},
                            status=status.HTTP_404_NOT_FOUND)

        results = []
        for item in data.get('Search', []):
            results.append({
                'imdb_id': item.get('imdbID'),
                'title': item.get('Title'),
                'year': item.get('Year'),
                'type': item.get('Type'),
                'poster': item.get('Poster') if item.get('Poster') != 'N/A' else None,
            })

        return Response({"total_results": data.get('totalResults', 0),
                         "results": results})

    except Exception as e:
        return Response({"error": str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)
