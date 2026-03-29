import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Star, Calendar, MessageSquare, ThumbsUp, ThumbsDown, Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const MovieDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');

  const fetchMovieAndReviews = async () => {
    try {
      const [movieRes, reviewsRes] = await Promise.all([
        axios.get(`/api/movies/${id}`),
        axios.get(`/api/reviews/${id}`)
      ]);
      setMovie(movieRes.data);
      setReviews(reviewsRes.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMovieAndReviews();
    window.scrollTo(0, 0);
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/reviews', { movieId: id, rating, comment });
      setComment('');
      setRating(5);
      setReviewError('');
      fetchMovieAndReviews();
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Error submitting review');
    }
  };

  const deleteReview = async (reviewId) => {
    if(window.confirm('Delete your review?')) {
      try {
        await axios.delete(`/api/reviews/${reviewId}`);
        fetchMovieAndReviews();
      } catch (err) {
        console.error(err);
      }
    }
  }

  const handleLike = async (reviewId) => {
    if (!user) return;
    try {
      await axios.post(`/api/reviews/${reviewId}/like`);
      fetchMovieAndReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDislike = async (reviewId) => {
    if (!user) return;
    try {
      await axios.post(`/api/reviews/${reviewId}/dislike`);
      fetchMovieAndReviews();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-32">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  if (!movie) return <div className="text-center py-20 text-2xl font-bold">Movie not found</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      {/* Backdrop & Header */}
      <div className="relative rounded-[2.5rem] overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl">
        <div className="absolute inset-0 opacity-30 bg-cover bg-center filter blur-2xl scale-110" style={{ backgroundImage: `url(${movie.posterUrl})` }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
        
        <div className="relative z-10 p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row gap-10 items-center md:items-end">
          <img src={movie.posterUrl} alt={movie.title} className="w-64 md:w-80 rounded-2xl shadow-2xl border border-white/10 filter drop-shadow-2xl hover:scale-[1.02] transition-transform duration-500" />
          
          <div className="text-white space-y-5 flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight">{movie.title}</h1>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium text-gray-300">
              <span className="flex items-center text-gray-200 bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md"><Calendar className="w-4 h-4 mr-2"/> {movie.releaseYear}</span>
              <span className="flex items-center text-yellow-500 bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md"><Star className="w-4 h-4 mr-2 fill-current"/> {movie.averageRating.toFixed(1)} / 5</span>
              <span className="flex items-center bg-indigo-600 px-4 py-1.5 rounded-full shadow-lg shadow-indigo-500/20">{movie.ratingsCount} reviews</span>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
              {movie.genre.map(g => (
                <span key={g} className="px-4 py-1.5 bg-white/5 rounded-full text-sm font-medium backdrop-blur-md border border-white/10 hover:bg-white/10 transition">{g}</span>
              ))}
            </div>
            
            <p className="text-lg text-gray-300 pt-6 leading-relaxed max-w-3xl font-light">{movie.description}</p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-3xl font-bold flex items-center space-x-3 mb-6">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <span>User Reviews</span>
          </h2>
          
          {user ? (
            <form onSubmit={submitReview} className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-6">Write a Review</h3>
              {reviewError && <div className="text-red-500 text-sm mb-4 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg font-medium">{reviewError}</div>}
              <div className="mb-5">
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Rating</label>
                <div className="relative">
                  <select value={rating} onChange={e => setRating(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium appearance-none cursor-pointer">
                    <option value="5">⭐⭐⭐⭐⭐ 5 - Masterpiece</option>
                    <option value="4">⭐⭐⭐⭐ 4 - Excellent</option>
                    <option value="3">⭐⭐⭐ 3 - Good</option>
                    <option value="2">⭐⭐ 2 - Fair</option>
                    <option value="1">⭐ 1 - Poor</option>
                  </select>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Comment</label>
                <textarea 
                  value={comment} onChange={e => setComment(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none h-32 font-medium"
                  placeholder="Share your thoughts about this movie..."
                  required
                ></textarea>
              </div>
              <button type="submit" className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5 w-full sm:w-auto">Submit Review</button>
            </form>
          ) : (
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-[2rem] flex flex-col sm:flex-row items-center justify-between border border-indigo-100 dark:border-indigo-800/50 shadow-inner">
              <div className="mb-4 sm:mb-0 text-center sm:text-left">
                <h4 className="font-bold text-lg text-indigo-900 dark:text-indigo-100">Join the discussion!</h4>
                <p className="text-indigo-700 dark:text-indigo-300 transition-colors">You must be logged in to write a review.</p>
              </div>
              <Link to="/login" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition w-full sm:w-auto text-center">Log In</Link>
            </div>
          )}

          <div className="space-y-5 pt-6">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-12 p-8 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] border border-dashed border-gray-200 dark:border-gray-700">No reviews yet. Be the first to share your thoughts!</p>
            ) : (
              reviews.map(review => (
                <div key={review._id} className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {review.user?.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-bold text-lg">{review.user?.name}</span>
                        <div className="flex text-yellow-500 mt-1">
                          {[...Array(5)].map((_, i) => (
                             <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current text-yellow-400' : 'text-gray-200 dark:text-gray-700'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs font-medium text-gray-400 bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded-full">{new Date(review.createdAt).toLocaleDateString()}</span>
                      {user && (user._id === review.user?._id || user.role === 'admin') && (
                        <button onClick={() => deleteReview(review._id)} className="text-red-400 hover:text-red-600 text-xs flex items-center transition p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20">
                          <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed max-w-none text-[15px]">{review.comment}</p>
                  
                  <div className="flex items-center space-x-6 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 transition-colors">
                    <button onClick={() => handleLike(review._id)} className={`flex items-center space-x-2 transition p-2 rounded-lg ${review.likes.includes(user?._id) ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-indigo-500'}`}>
                      <ThumbsUp className="w-4 h-4" /> <span className="font-semibold text-sm">{review.likes.length}</span>
                    </button>
                    <button onClick={() => handleDislike(review._id)} className={`flex items-center space-x-2 transition p-2 rounded-lg ${review.dislikes.includes(user?._id) ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-red-500'}`}>
                      <ThumbsDown className="w-4 h-4" /> <span className="font-semibold text-sm">{review.dislikes.length}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
