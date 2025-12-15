import './App.css';
import './index.css';
import Search from './componants/Search'; 
import { useState, useEffect } from 'react';
import Spinner from './componants/Spinner';
import MovieCard from './componants/MovieCard';
import { useDebounce } from 'react-use';
import { updateSearchCount, getTrendingMovies } from './appwrite';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [movies, setMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 800, [searchTerm]);

  const fetchMovies = async (query = '') => {
    setLoading(true);
    setMessage('');
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        setMovies([]);
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        setMessage('No movies found.');
        setMovies([]);
        return;
      }

      setMovies(data.results);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setMessage('Failed to fetch movies. Please try again later.');
    }
    setLoading(false);
  };

  const loadTrendingMovies = async () => {
    try {
      const trending = await getTrendingMovies();
      setTrendingMovies(trending);
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      setMessage('Failed to fetch trending movies. Please try again later.');
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" className="mx-auto" />
          <h1>
            Find <span className="text-gradient">Movies </span>
            you&#39;ll enjoy without the hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id} className="text-center">
                  <p className="font-bold">{index + 1}</p>
                  <img
                    src={movie.poster_url}
                    alt={movie.searchTerm}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2 className="text-center mt-6">All Movies</h2>
          {loading ? (
            <Spinner />
          ) : message ? (
            <p className="text-red-600 text-center">{message}</p>
          ) : (
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
