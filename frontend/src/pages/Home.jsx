import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';
import MovieCard from '../components/MovieCard';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [genre, setGenre] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const genres = ['All', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Animation'];

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/api/movies?pageNumber=${page}&keyword=${keyword}&genre=${genre === 'All' ? '' : genre}`
      );
      setMovies(data.movies);
      setPages(data.pages);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies();
  }, [page, genre]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchMovies();
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* Hero Section */}
      <div className="relative rounded-[2rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 p-8 sm:p-16 text-white overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 tracking-tight leading-tight">Discover Your Next <br />Favorite Film.</h1>
          <p className="text-lg sm:text-xl opacity-90 mb-10 max-w-xl mx-auto font-light">Explore reviews, ratings, and recommendations from a passionate community of movie lovers.</p>
          
          <form onSubmit={handleSearch} className="flex relative items-center w-full max-w-lg mx-auto transform transition-all hover:scale-[1.02]">
            <input
              type="text"
              placeholder="Search by movie title..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-6 pr-14 py-4 rounded-full text-gray-900 bg-white/95 backdrop-blur-sm shadow-xl focus:outline-none focus:ring-4 ring-indigo-300/50 transition-all font-medium text-lg placeholder-gray-400"
            />
            <button type="submit" className="absolute right-2 p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-md">
              <Search className="w-6 h-6" />
            </button>
          </form>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      </div>

      {/* Filter Options */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide px-2">
        {genres.map(g => (
          <button
            key={g}
            onClick={() => { setGenre(g); setPage(1); }}
            className={`px-5 py-2.5 rounded-full whitespace-nowrap font-semibold text-sm transition-all duration-300 flex-shrink-0 ${
              genre === g || (g === 'All' && genre === '') 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 transform scale-105 ring-2 ring-indigo-600 ring-offset-2 dark:ring-offset-gray-900' 
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="flex justify-center py-32 space-x-2">
          <div className="w-4 h-4 rounded-full bg-indigo-600 animate-bounce"></div>
          <div className="w-4 h-4 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-4 h-4 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-32 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 mb-4">
             <Search className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold mb-2">No movies found</h3>
          <p className="text-gray-500 max-w-md mx-auto">We couldn't find any movies matching your search. Try adjusting your filters or keyword.</p>
        </div>
      ) : (
        <div className="space-y-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-8">
            {movies.map(movie => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-3 pt-8 border-t border-gray-100 dark:border-gray-800">
              {[...Array(pages).keys()].map((x) => (
                <button
                  key={x + 1}
                  onClick={() => setPage(x + 1)}
                  className={`w-12 h-12 rounded-xl font-bold text-lg transition-all duration-300 ${
                    page === x + 1 
                      ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/40 transform -translate-y-1' 
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {x + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
