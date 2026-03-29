import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const MovieCard = ({ movie }) => {
  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
      <Link to={`/movie/${movie._id}`}>
        <div className="relative aspect-[2/3] overflow-hidden bg-gray-200 dark:bg-gray-700">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full flex items-center space-x-1 border border-white/10">
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
            <span className="font-bold text-xs">{movie.averageRating > 0 ? movie.averageRating.toFixed(1) : 'New'}</span>
          </div>
        </div>
        <div className="p-4 sm:p-5">
          <h3 className="font-bold text-lg leading-tight line-clamp-1 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{movie.title}</h3>
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-auto">
            <span className="font-medium px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-md">{movie.releaseYear}</span>
            <div className="flex flex-wrap gap-1 justify-end">
              {movie.genre.slice(0, 1).map((g) => (
                <span key={g} className="truncate max-w-[80px]">
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
