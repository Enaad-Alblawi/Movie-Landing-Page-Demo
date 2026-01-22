import { useState, useRef, useEffect } from 'react';
import movieLogo from './logo/movie_logo2.0.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchFormRef = useRef(null);

  // Movie backdrop images (high quality cinematic wallpapers for top IMDb movies)
  const movieBackdrops = {
    // Top 10 IMDb
    'tt0111161': 'https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_.jpg', // Shawshank Redemption (9.3) - behind the scenes
    'tt0068646': 'https://thefilmjunkies.com/wp-content/uploads/2022/03/godfather4k_3.jpg', // The Godfather (9.2)
    'tt0468569': 'https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg', // The Dark Knight (9.0)
    'tt0071562': 'https://thefilmjunkies.com/wp-content/uploads/2022/03/godfather4k_3.jpg', // The Godfather Part II (9.0)
    'tt0099674': 'https://thefilmjunkies.com/wp-content/uploads/2022/03/godfather4k_3.jpg', // The Godfather Part III (7.6)
    'tt0150742': 'https://thefilmjunkies.com/wp-content/uploads/2022/03/godfather4k_3.jpg', // The Godfather Trilogy (9.3)
    'tt0050083': 'https://image.tmdb.org/t/p/original/qqHQsStV6exghCM7zbObuYBiYxw.jpg', // 12 Angry Men (9.0)
    'tt0108052': 'https://image.tmdb.org/t/p/original/zb6fM1CX41D9rF9hdgclu0peUmy.jpg', // Schindler's List (9.0)
    'tt0167260': 'https://image.tmdb.org/t/p/original/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg', // LOTR: Return of the King (9.0)
    'tt0110912': 'https://image.tmdb.org/t/p/original/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg', // Pulp Fiction (8.9)
    'tt0120737': 'https://image.tmdb.org/t/p/original/vRQnzOn4HjIMX4LBq9nHhFXbsSu.jpg', // LOTR: Fellowship (8.9)
    'tt0109830': 'https://image.tmdb.org/t/p/original/7c9UVPPiTPltouxRVY6N9uugaVA.jpg', // Forrest Gump (8.8)
    // Top 11-25 IMDb
    'tt0137523': 'https://image.tmdb.org/t/p/original/hZkgoQYus5vegHoetLkCJzb17zJ.jpg', // Fight Club (8.8)
    'tt1375666': 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg', // Inception (8.8)
    'tt0167261': 'https://image.tmdb.org/t/p/original/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg', // LOTR: Two Towers (8.8)
    'tt0080684': 'https://image.tmdb.org/t/p/original/dMZxEdrWIzUmUoOz2zsWHpTBSOd.jpg', // Empire Strikes Back (8.7)
    'tt0133093': 'https://image.tmdb.org/t/p/original/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg', // The Matrix (8.7)
    'tt0099685': 'https://image.tmdb.org/t/p/original/sw7mordbZxgITU877yTpZCud90M.jpg', // Goodfellas (8.7)
    'tt0073486': 'https://image.tmdb.org/t/p/original/30YnfZdMNIV7noWLdvmcJS0cbnQ.jpg', // One Flew Over the Cuckoo's Nest (8.7)
    'tt0114369': 'https://image.tmdb.org/t/p/original/9PKZNOuMiV5uedGbIWkTe4vWEcR.jpg', // Se7en (8.6)
    'tt0102926': 'https://image.tmdb.org/t/p/original/rplLJ2hPcOQmkFhTqUte0MkEaO2.jpg', // Silence of the Lambs (8.6)
    'tt0038650': 'https://image.tmdb.org/t/p/original/mH0qqL0aL0wKRCPD9J9HhJdPDjG.jpg', // It's a Wonderful Life (8.6)
    'tt0120815': 'https://image.tmdb.org/t/p/original/vRVFiMhEjBRwFyIf7BKCsGhZBmy.jpg', // Saving Private Ryan (8.6)
    'tt0816692': 'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg', // Interstellar (8.7)
    'tt0245429': 'https://image.tmdb.org/t/p/original/jNyPLdzxeseL0qT0UoiNwjkI31X.jpg', // Spirited Away (8.6)
    // More popular movies
    'tt0120689': 'https://image.tmdb.org/t/p/original/sxkU8lSg9TvVPCgk7RJDOIIA9BX.jpg', // The Green Mile (8.6)
    'tt0317248': 'https://image.tmdb.org/t/p/original/90ez6ArvpO8bvpyIngBuwXOqJm5.jpg', // City of God (8.6)
    'tt0076759': 'https://image.tmdb.org/t/p/original/zVlSZYe9N0QGCgpJDUjvL5fhYQ.jpg', // Star Wars: A New Hope (8.6)
    'tt0253474': 'https://image.tmdb.org/t/p/original/ggFHVNu6YYI5L9pCfOacjizRGt.jpg', // The Pianist (8.5)
    'tt0407887': 'https://image.tmdb.org/t/p/original/6xKCYgH16UuwEGAyroLU6p8HLIn.jpg', // The Departed (8.5)
    'tt0172495': 'https://image.tmdb.org/t/p/original/hennyhuAC4aBK6AlNjVH5gl4Dzn.jpg', // Gladiator (8.5)
    'tt0482571': 'https://image.tmdb.org/t/p/original/nzxgCmG6JXdPFR0P8jtR3Obo5S1.jpg', // The Prestige (8.5)
    'tt0114814': 'https://image.tmdb.org/t/p/original/jgJoRWltoS2pRUBpyExat7PrASr.jpg', // The Usual Suspects (8.5)
    'tt0054215': 'https://image.tmdb.org/t/p/original/gg9LIkGaIvPmVaQi0Ew8JIDzPW4.jpg', // Psycho (8.5)
    'tt0110413': 'https://image.tmdb.org/t/p/original/4HWAQu28e2yaWrtupFPGFkdNU7V.jpg', // Leon: The Professional (8.5)
    'tt0021749': 'https://image.tmdb.org/t/p/original/gQMKOLRYdx8UGXKF8ZVPF8qy2JW.jpg', // City Lights (8.5)
    'tt0034583': 'https://image.tmdb.org/t/p/original/4sHeTAp65WrSSuc05nRBKddhBxO.jpg', // Casablanca (8.5)
    'tt0047478': 'https://image.tmdb.org/t/p/original/eJn2M4R8KLBsep0v0c5aYr9rMZx.jpg', // Seven Samurai (8.6)
    'tt0209144': 'https://image.tmdb.org/t/p/original/eIi3klFf7mp3oL5EEF4mLIDs26r.jpg', // Memento (8.4)
    'tt0082971': 'https://image.tmdb.org/t/p/original/ceG9VzoRAVGwivFU403Wc3AHRys.jpg', // Raiders of the Lost Ark (8.4)
    'tt0078788': 'https://image.tmdb.org/t/p/original/wK80xSjSghBK6p1x6HkSuK1qH6d.jpg', // Apocalypse Now (8.4)
    'tt0095765': 'https://image.tmdb.org/t/p/original/7qop80YfuO0BwJa1uXk1DXUUEwv.jpg', // Cinema Paradiso (8.5)
    'tt0064116': 'https://image.tmdb.org/t/p/original/bSFpdAi8VbqyJV6PwhEbSHsSSq.jpg', // Once Upon a Time in the West (8.5)
    'tt0090605': 'https://image.tmdb.org/t/p/original/8EjVwNsrD3gRc5F7lLMHD6KqJYk.jpg', // Aliens (8.4)
    'tt0057012': 'https://image.tmdb.org/t/p/original/2XhLRbqUvpn7CU7rS3IzpLnWqfK.jpg', // Dr. Strangelove (8.4)
    'tt12076962': 'https://www.indiewire.com/wp-content/uploads/2024/10/Screen-Shot-2024-10-09-at-8.21.10-PM.png?w=600&h=337&crop=1', // Stealing Pulp Fiction (9.0)
  };

  // Get backdrop URL for a movie
  const getBackdropUrl = (movie) => {
    if (movie.imdb_id && movieBackdrops[movie.imdb_id]) {
      return movieBackdrops[movie.imdb_id];
    }
    // Fallback to poster or a generic dark placeholder
    return movie.poster_url || 'https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg';
  };

  // Truncate plot to max 4 sentences or 300 characters
  const truncatePlot = (plot) => {
    if (!plot) return 'No description available.';
    const sentences = plot.match(/[^.!?]+[.!?]+/g) || [plot];
    let truncated = sentences.slice(0, 4).join(' ');
    // Also limit by character count
    if (truncated.length > 300) {
      truncated = truncated.substring(0, 300).trim() + '...';
    }
    return truncated;
  };

  // Check if plot was truncated
  const isPlotTruncated = (plot) => {
    if (!plot) return false;
    const sentences = plot.match(/[^.!?]+[.!?]+/g) || [plot];
    return sentences.length > 4 || plot.length > 300;
  };

  // Fetch movies and set both allMovies and featuredMovies (matching trending logic)
  useEffect(() => {
    const fetchFeaturedMovies = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/movies/');
        const data = await response.json();
        // Override poster_url for specific movies immediately after fetching
        data.forEach(m => {
          if (m.imdb_id === 'tt0111161') {
            m.poster_url = 'https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_.jpg';
          }
          if (m.imdb_id === 'tt0802967') {
            m.poster_url = 'https://images5.alphacoders.com/542/thumb-1920-542019.jpg';
          }
        });
        // Trending logic: sort by imdb_votes_num, then imdb_rating, then slice 0-8
        const trendingMovies = data
          .map(m => ({
            ...m,
            imdb_votes_num: m.imdb_votes ? parseInt(m.imdb_votes.replace(/,/g, '')) : 0
          }))
          .filter(m => m.imdb_votes_num > 0)
          .sort((a, b) => {
            if (b.imdb_votes_num !== a.imdb_votes_num) {
              return b.imdb_votes_num - a.imdb_votes_num;
            }
            return (b.imdb_rating || 0) - (a.imdb_rating || 0);
          })
          .slice(0, 8);
        setFeaturedMovies(trendingMovies);
        setAllMovies(data);
      } catch (error) {
        console.error('Failed to fetch featured movies:', error);
      }
    };
    fetchFeaturedMovies();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchFormRef.current && !searchFormRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/search/local/?q=${searchQuery}`);
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      setError('Search error. Please try again later.', error);
    } finally {
      setLoading(false);
    }
  };

  const trendingRef = useRef(null);
  const topRatedRef = useRef(null);
  const latestRef = useRef(null);

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="#">
            <img src={movieLogo} alt="Logo" width="40" height="40" className="me-2"/>
            <span className="d-none d-sm-inline">Movie Theater</span>
            <span className="d-inline d-sm-none">Movies</span>
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" href="#">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Movies</a>
              </li>
            </ul>
            <form ref={searchFormRef} className="d-flex position-relative search-form" role="search" onSubmit={handleSearch}>
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} />
              <button className="btn btn-outline-success" type="submit">Search</button>
              
              {searchResults.length > 0 && (
                <div className="search-dropdown position-absolute top-100 end-0 mt-1 bg-white border rounded-2 shadow">
                  <ul className="list-group list-group-flush">
                    {searchResults.slice(0, 5).map((movie) => (
                      <li key={movie.id} className="list-group-item">
                        <div className="d-flex align-items-center">
                          <img
                            src={movie.poster_url || 'https://via.placeholder.com/50x75'}
                            alt={movie.title}
                            style={{width: '50px', height: '75px', objectFit: 'cover'}}
                            className="me-3"
                          />
                          <div>
                            <h6 className="mb-0 text-dark">{movie.title}</h6>
                            <small className="text-muted">
                              {movie.year} | {movie.imdb_rating}/10 | {movie.genre}
                            </small>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </form>
          </div>
        </div>
      </nav>

      {/* Hero Carousel */}
      {featuredMovies.length > 0 && (
        <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            {featuredMovies.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#heroCarousel"
                data-bs-slide-to={index}
                className={index === 0 ? 'active' : ''}
                aria-current={index === 0 ? 'true' : undefined}
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}
          </div>
          <div className="carousel-inner">
            {featuredMovies.map((movie, index) => (
              <div key={movie.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                <div className="carousel-backdrop" style={{backgroundImage: `url(${getBackdropUrl(movie)})`}}>
                  <div className="carousel-overlay"></div>
                </div>
                <div className="carousel-caption-custom">
                  <h1>{movie.title}</h1>
                  <p className="lead">
                    {truncatePlot(movie.plot)}
                    {isPlotTruncated(movie.plot) && (
                      <a href="#" className="show-more-link ms-1" onClick={(e) => e.preventDefault()}>Show more</a>
                    )}
                  </p>
                  <div className="movie-meta">
                    <span className="badge bg-warning text-dark me-2">⭐ {movie.imdb_rating || 'N/A'}</span>
                    <span className="badge bg-secondary me-2">{movie.year || 'N/A'}</span>
                    <span className="badge bg-info">{movie.genre || 'N/A'}</span>
                  </div>
                  <button className="btn btn-primary mt-3 me-2">Watch Now</button>
                  <button className="btn btn-outline-light mt-3">More Info</button>
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      )}

      <div className="container-fluid px-4 mt-5">
        {loading && <p className="text-white">Loading...</p>}
        
        {/* Trending Movies Section */}
        <section className="mb-5">
          <h5 className="section-title">Trending Movies</h5>
          <div className="movie-carousel-container">
            <button 
              className="carousel-arrow carousel-arrow-left" 
              onClick={() => trendingRef.current.scrollBy({ left: -400, behavior: 'smooth' })}
            >
              &#8249;
            </button>
            <div className="movie-carousel" ref={trendingRef}>
              {allMovies
                .map(m => ({
                  ...m,
                  imdb_votes_num: m.imdb_votes ? parseInt(m.imdb_votes.replace(/,/g, '')) : 0
                }))
                .filter(m => m.imdb_votes_num > 0)
                .sort((a, b) => {
                  if (b.imdb_votes_num !== a.imdb_votes_num) {
                    return b.imdb_votes_num - a.imdb_votes_num;
                  }
                  return (b.imdb_rating || 0) - (a.imdb_rating || 0);
                })
                .slice(0, 8)
                .map((movie) => (
                  <div key={movie.id} className="movie-card-wrapper">
                    <div className="movie-card">
                      <img
                        src={movie.poster_url ? movie.poster_url : getBackdropUrl(movie)}
                        alt={movie.title}
                        className="movie-poster"
                      />
                      <div className="movie-card-overlay">
                        <h6 className="movie-card-title">{movie.title}</h6>
                        <div className="movie-card-info">
                          <span className="badge bg-warning text-dark">⭐ {movie.imdb_rating || 'N/A'}</span>
                          <span className="ms-2 text-light small">{movie.year}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              <div className="movie-card-wrapper">
                <a href="#" className="movie-card show-more-card d-flex align-items-center justify-content-center" style={{textDecoration: 'none'}}>
                  <span className="show-more-text">Show More</span>
                </a>
              </div>
            </div>
            <button 
              className="carousel-arrow carousel-arrow-right" 
              onClick={() => trendingRef.current.scrollBy({ left: 400, behavior: 'smooth' })}
            >
              &#8250;
            </button>
          </div>
        </section>

        {/* Top Rated Movies Section */}
        <section className="mb-5">
          <h5 className="section-title">Top Rated Movies</h5>
          <div className="movie-carousel-container">
            <button 
              className="carousel-arrow carousel-arrow-left" 
              onClick={() => topRatedRef.current.scrollBy({ left: -400, behavior: 'smooth' })}
            >
              &#8249;
            </button>
            <div className="movie-carousel" ref={topRatedRef}>
              {allMovies
                .filter(m => m.imdb_rating >= 8.0)
                .sort((a, b) => (b.imdb_rating || 0) - (a.imdb_rating || 0))
                .slice(0, 8)
                .map((movie) => (
                  <div key={movie.id} className="movie-card-wrapper">
                    <div className="movie-card">
                      <img
                        src={movie.poster_url ? movie.poster_url : getBackdropUrl(movie)}
                        alt={movie.title}
                        className="movie-poster"
                      />
                      <div className="movie-card-overlay">
                        <h6 className="movie-card-title">{movie.title}</h6>
                        <div className="movie-card-info">
                          <span className="badge bg-warning text-dark">⭐ {movie.imdb_rating || 'N/A'}</span>
                          <span className="ms-2 text-light small">{movie.year}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              <div className="movie-card-wrapper">
                <a href="#" className="movie-card show-more-card d-flex align-items-center justify-content-center" style={{textDecoration: 'none'}}>
                  <span className="show-more-text">Show More</span>
                </a>
              </div>
            </div>
            <button 
              className="carousel-arrow carousel-arrow-right" 
              onClick={() => topRatedRef.current.scrollBy({ left: 400, behavior: 'smooth' })}
            >
              &#8250;
            </button>
          </div>
        </section>

        {/* Latest Movies Section */}
        <section className="mb-5">
          <h5 className="section-title">Latest Movies</h5>
          <div className="movie-carousel-container">
            <button 
              className="carousel-arrow carousel-arrow-left" 
              onClick={() => latestRef.current.scrollBy({ left: -400, behavior: 'smooth' })}
            >
              &#8249;
            </button>
            <div className="movie-carousel" ref={latestRef}>
              {allMovies
                .sort((a, b) => (b.year || 0) - (a.year || 0))
                .slice(0, 8)
                .map((movie) => (
                  <div key={movie.id} className="movie-card-wrapper">
                    <div className="movie-card">
                      <img
                        src={movie.poster_url ? movie.poster_url : getBackdropUrl(movie)}
                        alt={movie.title}
                        className="movie-poster"
                      />
                      <div className="movie-card-overlay">
                        <h6 className="movie-card-title">{movie.title}</h6>
                        <div className="movie-card-info">
                          <span className="badge bg-warning text-dark">⭐ {movie.imdb_rating || 'N/A'}</span>
                          <span className="ms-2 text-light small">{movie.year}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              <div className="movie-card-wrapper">
                <a href="#" className="movie-card show-more-card d-flex align-items-center justify-content-center" style={{textDecoration: 'none'}}>
                  <span className="show-more-text">Show More</span>
                </a>
              </div>
            </div>
            <button 
              className="carousel-arrow carousel-arrow-right" 
              onClick={() => latestRef.current.scrollBy({ left: 400, behavior: 'smooth' })}
            >
              &#8250;
            </button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="footer-custom mt-5 py-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-2 mb-md-0">
              <span className="footer-title">Made by Enaad Alblawi</span>
              <div className="footer-contact mt-2">Email: <a href="mailto:enaad54@gmail.com" className="footer-link">enaad54@gmail.com</a></div>
              <div className="footer-contact">Phone: <a href="tel:+421905462144" className="footer-link">+421 905462144</a></div>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="footer-links mb-2">
                <a href="#" className="footer-link me-3">About</a>
                <a href="#" className="footer-link me-3">Privacy Policy</a>
                <a href="#" className="footer-link">Terms of Service</a>
              </div>
              <div className="footer-copyright small">&copy; {new Date().getFullYear()} Movie Theater. All rights reserved.</div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;