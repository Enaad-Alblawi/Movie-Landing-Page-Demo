import requests
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import Movie
from ..serializers import MovieSerializer
from decimal import Decimal, InvalidOperation

# OMDB API Configuration
import os
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '../../../.env'))
OMDB_API_KEY = os.getenv('OMDB_API_KEY')
OMDB_BASE_URL = 'http://www.omdbapi.com/'


# Fetch data from OMDB API
def fetch_omdb_details(imdb_id):
    try:
        params = {
            'apikey': OMDB_API_KEY,
            'i': imdb_id,
            "plot": 'full'
        }
        response = requests.get(OMDB_BASE_URL, params=params)
        data = response.json()

        if data.get('Response') == 'False':
            return None, data.get('Error', 'Content not found.')
        return data, None
    except Exception as e:
        return None, str(e)


# Parse and save movie to database
def save_movie_from_omdb(omdb_data):
    try:
        # Parse year (handle ranges like "1994–2004" or "2010–present")
        year_str = omdb_data.get('Year', '').split('–')[0].split(' ')[0]
        year = int(year_str) if year_str.isdigit() else None

        # Parse IMDb rating
        imdb_rating = None
        rating_str = omdb_data.get('imdbRating', 'N/A')
        if rating_str != 'N/A':
            try:
                imdb_rating = Decimal(rating_str)
            except (InvalidOperation, ValueError):
                pass

        # Parse Metascore
        metascore = None
        metascore_str = omdb_data.get('Metascore', 'N/A')
        if metascore_str != 'N/A':
            try:
                metascore = int(metascore_str)
            except ValueError:
                pass

        # Create or update movie
        movie, created = Movie.objects.update_or_create(
            imdb_id=omdb_data.get('imdbID'),
            defaults={
                'title': omdb_data.get('Title'),
                'year': year,
                'rated': omdb_data.get('Rated') if omdb_data.get('Rated') != 'N/A' else None,
                'released': omdb_data.get('Released') if omdb_data.get('Released') != 'N/A' else None,
                'runtime': omdb_data.get('Runtime') if omdb_data.get('Runtime') != 'N/A' else None,
                'genre': omdb_data.get('Genre') if omdb_data.get('Genre') != 'N/A' else None,
                'director': omdb_data.get('Director') if omdb_data.get('Director') != 'N/A' else None,
                'writer': omdb_data.get('Writer') if omdb_data.get('Writer') != 'N/A' else None,
                'actors': omdb_data.get('Actors') if omdb_data.get('Actors') != 'N/A' else None,
                'plot': omdb_data.get('Plot') if omdb_data.get('Plot') != 'N/A' else None,
                'language': omdb_data.get('Language') if omdb_data.get('Language') != 'N/A' else None,
                'country': omdb_data.get('Country') if omdb_data.get('Country') != 'N/A' else None,
                'awards': omdb_data.get('Awards') if omdb_data.get('Awards') != 'N/A' else None,
                'poster_url': omdb_data.get('Poster') if omdb_data.get('Poster') != 'N/A' else None,
                'imdb_rating': imdb_rating,
                'imdb_votes': omdb_data.get('imdbVotes') if omdb_data.get('imdbVotes') != 'N/A' else None,
                'metascore': metascore,
            }
         )
        return movie, created, None
    except Exception as e:
        return None, False, str(e)


# Import movie by IMDb ID
@api_view(['POST'])
def import_movie(request, imdb_id):
    omdb_data, error = fetch_omdb_details(imdb_id)
    if error:
        return Response({"error": error}, status=status.HTTP_404_NOT_FOUND)
    if omdb_data.get('Type') != 'movie':
        return Response({"error": "The IMDB ID doesn't exist for a movie. Sorry come again!"},
                        status=status.HTTP_400_BAD_REQUEST)
    movie, created, error = save_movie_from_omdb(omdb_data)
    if error:
        return Response({"error": error}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    serializer = MovieSerializer(movie)
    return Response({
        "message": "Movie created successfully" if created else "Movie updated successfully",
        "movie": serializer.data
    }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


# Bulk import movies from a list of IMDb IDs
@api_view(['POST'])
def bulk_import_movies(request):
    imdb_ids = request.data.get('imdb_ids', [])

    if not imdb_ids or not isinstance(imdb_ids, list):
        return Response({"error": "A list of IMDb IDs is required."},
                        status=status.HTTP_400_BAD_REQUEST)
    results = {
        'created': [],
        'updated': [],
        'failed': []
    }

    for imdb_id in imdb_ids:
        omdb_data, error = fetch_omdb_details(imdb_id)
        if error:
            results['failed'].append({'imdb_id': imdb_id, 'error': error})
            continue
        if omdb_data.get('Type') != 'movie':
            results['failed'].append({'imdb_id': imdb_id, 'error': "Not a movie."})
            continue
        movie, created, error = save_movie_from_omdb(omdb_data)

        if error:
            results['failed'].append({'imdb_id': imdb_id, 'error': error})
        elif created:
            results['created'].append(MovieSerializer(movie).data)
        else:
            results['updated'].append(MovieSerializer(movie).data)

    return Response({
        'summary': {
            'total': len(imdb_ids),
            'created': len(results['created']),
            'updated': len(results['updated']),
            'failed': len(results['failed']),
        },
        'results': results
    })


# Get detailed information for a specific movie by IMDb ID
@api_view(['GET'])
def get_content_details(request, imdb_id):
    try:
        params = {
            'apikey': OMDB_API_KEY,
            'i': imdb_id,  # 'i' is for IMDb ID
            'plot': 'full'
        }
        response = requests.get(OMDB_BASE_URL, params=params)
        data = response.json()
        
        if data.get('Response') == 'False':
            return Response({"error": data.get('Error', 'Content not found.')},
                            status=status.HTTP_404_NOT_FOUND)
        
        content_details = {
            'imdb_id': data.get('imdbID'),
            'title': data.get('Title'),   
            'year': data.get('Year'),
            'rated': data.get('Rated'),
            'released': data.get('Released'),
            'runtime': data.get('Runtime'),
            'genre': data.get('Genre'),
            'director': data.get('Director'),
            'writer': data.get('Writer'),
            'actors': data.get('Actors'),
            'plot': data.get('Plot'),
            'language': data.get('Language'),
            'country': data.get('Country'),
            'awards': data.get('Awards'),
            'poster': data.get('Poster') if data.get('Poster') != 'N/A' else None,
            'ratings': data.get('Ratings'),
            'metascore': data.get('Metascore'),
            'imdb_rating': data.get('imdbRating'),
            'imdb_votes': data.get('imdbVotes'),
            'type': data.get('Type'),
        }
        return Response(content_details)
    
    except Exception as e:
        return Response({"error": str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)
