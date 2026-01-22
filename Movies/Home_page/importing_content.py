import requests
import time

import os
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env'))
OMDB_API_KEY = os.getenv('OMDB_API_KEY')
OMDB_BASE_URL = 'http://www.omdbapi.com/'

# Popular search terms to find movies
movie_search_terms = [
    "batman", "superman", "spider-man", "avengers", "iron man",
    "captain america", "thor", "star wars", "star trek", "lord of the rings",
    "harry potter", "matrix", "godfather", "dark knight", "inception",
    "interstellar", "pulp fiction", "fight club", "forrest gump", "shawshank",
    "joker", "gladiator", "titanic", "avatar", "jurassic park",
    "terminator", "alien", "predator", "rocky", "rambo",
    "die hard", "mission impossible", "james bond", "fast and furious", "transformers",
    "toy story", "frozen", "lion king", "finding nemo", "shrek",
    "indiana jones", "pirates caribbean", "marvel", "dc", "wonder woman",
    "black panther", "deadpool", "x-men", "fantastic four", "hulk",
    "ant-man", "guardians galaxy", "doctor strange", "back to future", "ghostbusters"
]

# Search omdb for movies 
def search_and_collect_movies(limit=200):
    all_movie_ids = set()  
    
    print("Searching OMDB for movies...")
    print(f"Using {len(movie_search_terms)} search terms")
    print(f"Limit: {limit} movies\n")
    
    # for loop and also to check limit
    for i, term in enumerate(movie_search_terms, 1):
        if len(all_movie_ids) >= limit:
            print(f"\n Reached limit of {limit} movies. Stopping the search.")
            break
            
        print(f"[{i}/{len(movie_search_terms)}] Searching: {term} (Collected: {len(all_movie_ids)}/{limit})")
        
        try:
            response = requests.get(OMDB_BASE_URL, params={
                'apikey': OMDB_API_KEY,
                's': term,
                'type': 'movie'
            })
            data = response.json()
            
            if data.get('Response') == 'True':
                found_count = 0
                for movie in data.get('Search', []):
                    if len(all_movie_ids) >= limit:
                        break
                        
                    imdb_id = movie.get('imdbID')
                    if imdb_id and imdb_id not in all_movie_ids:
                        all_movie_ids.add(imdb_id)
                        found_count += 1
                        print(f"  [SUCCESS] Found: {movie.get('Title')} ({imdb_id})")
                
                if found_count == 0:
                    print(f" No new movies found ")
            else:
                print(f"No results: {data.get('Error', 'Unknown error')}")
        
        except Exception as e:
            print(f"Error: {e}")
            import traceback
            traceback.print_exc()
        
        time.sleep(0.3)  #This is for avoiding the api limits
    
    return list(all_movie_ids)

# Bulk import of 200 movies to Django
def bulk_import_to_django(movie_ids):
    print(f"\n Importing {len(movie_ids)} movies to Django...")
    
    try:
        response = requests.post(
            'http://127.0.0.1:8000/import/movies/bulk/',
            json={'imdb_ids': movie_ids},
            timeout=300  # 5 minutes timeout for large imports
        )
        
        result = response.json()
        print("=" * 50)
        print("IMPORT RESULTS")
        print("=" * 50)
        print(f"[SUCCESS] Created: {result['summary']['created']}")
        print(f"[INFO] Updated: {result['summary']['updated']}")
        print(f"[ERROR] Failed: {result['summary']['failed']}")
        print(f"[INFO] Total: {result['summary']['total']}")
        print("=" * 50)
        
        if result['summary']['failed'] > 0:
            print("\n[WARNING] Failed imports:")
            for failed in result['results']['failed'][:10]:  # Show first 10 failures
                print(f"  - {failed['imdb_id']}: {failed['error']}")
        
        return result
    
    except Exception as e:
        print(f" Error importing to Django: {e}")
        return None

if __name__ == "__main__":
    print("OMDB Movie Importer")
    print("=" * 50)
    
    # Search and collect movie IDs
    movie_ids = search_and_collect_movies()
    
    print(f"\n Total unique movies found: {len(movie_ids)}\n")
    
    # Import to Django
    if movie_ids:
        result = bulk_import_to_django(movie_ids)
        
        if result:
            print("\n Import complete!")
            print(f" View your movies at: http://127.0.0.1:8000/api/movies/")
        else:
            print("\n Import failed!")
    else:
        print("\n No movies found to import!")