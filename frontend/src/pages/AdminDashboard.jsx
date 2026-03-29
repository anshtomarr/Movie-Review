import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  
  // Create state
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    } else {
      fetchMovies();
    }
  }, [user, navigate]);

  const fetchMovies = async () => {
    try {
      const { data } = await axios.get('/api/movies');
      setMovies(data.movies);
    } catch (error) {
      console.error(error);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return imageUrl;
    const formData = new FormData();
    formData.append('image', imageFile);
    const { data } = await axios.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data.url;
  };

  const handleCreateMovie = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalImageUrl = imageUrl;
      if (imageFile) {
        finalImageUrl = await uploadImage();
      }
      
      const genreArray = genre.split(',').map(g => g.trim());
      
      await axios.post('/api/movies', {
        title,
        genre: genreArray,
        releaseYear: Number(releaseYear),
        description,
        posterUrl: finalImageUrl || 'https://via.placeholder.com/300x450'
      });
      
      // Reset form
      setTitle(''); setGenre(''); setReleaseYear(''); setDescription(''); setImageFile(null); setImageUrl('');
      fetchMovies();
    } catch (error) {
      console.error(error);
      alert('Error creating movie');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if(window.confirm('Delete this movie?')) {
      try {
        await axios.delete(`/api/movies/${id}`);
        fetchMovies();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black tracking-tight">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Movie Form */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 flex items-center text-indigo-600 dark:text-indigo-400"><Plus className="w-6 h-6 mr-2" /> Add New Movie</h2>
          <form onSubmit={handleCreateMovie} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Title</label>
              <input type="text" value={title} onChange={e=>setTitle(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3.5 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium" required placeholder="Inception" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Genres (comma separated)</label>
              <input type="text" value={genre} onChange={e=>setGenre(e.target.value)} placeholder="Action, Sci-Fi" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3.5 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium" required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Release Year</label>
              <input type="number" value={releaseYear} onChange={e=>setReleaseYear(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3.5 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium" required placeholder="2010" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Description</label>
              <textarea value={description} onChange={e=>setDescription(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3.5 h-32 resize-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium" required placeholder="A thief who steals corporate secrets..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Poster Image (Upload OR URL)</label>
              <input type="file" onChange={e=>setImageFile(e.target.files[0])} className="w-full text-sm font-medium mb-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/30 dark:file:text-indigo-300 transition-colors" accept="image/*" />
              <input type="text" value={imageUrl} onChange={e=>setImageUrl(e.target.value)} placeholder="Or enter image URL instead..." className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3.5 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 hover:-translate-y-0.5 shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:hover:translate-y-0 mt-4">
              {loading ? 'Adding Movie...' : 'Add Movie'}
            </button>
          </form>
        </div>

        {/* Movies List Management */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden h-full flex flex-col">
            <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
              <h2 className="text-2xl font-bold">Manage Database</h2>
              <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-3 py-1 text-sm font-bold rounded-full">{movies.length} Movies</span>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                  <tr>
                    <th className="p-5 font-semibold text-sm text-gray-500 uppercase tracking-wider">Movie</th>
                    <th className="p-5 font-semibold text-sm text-gray-500 uppercase tracking-wider">Year</th>
                    <th className="p-5 font-semibold text-sm text-gray-500 uppercase tracking-wider">Avg Rating</th>
                    <th className="p-5 font-semibold text-sm text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {movies.map(m => (
                    <tr key={m._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="p-5 flex items-center space-x-4">
                        <img src={m.posterUrl} alt={m.title} className="w-12 h-16 object-cover rounded-lg shadow-sm border border-gray-200 dark:border-gray-700" />
                        <span className="font-bold text-lg truncate max-w-[200px]">{m.title}</span>
                      </td>
                      <td className="p-5 font-medium">{m.releaseYear}</td>
                      <td className="p-5">
                        <span className="flex items-center text-sm font-bold bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-500 px-3 py-1 rounded-full w-max">
                          <Star className="w-3 h-3 fill-current mr-1"/> {m.averageRating.toFixed(1)}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <button onClick={() => handleDelete(m._id)} className="text-red-500 hover:text-red-700 p-2.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {movies.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-12 text-center text-gray-500 font-medium text-lg">
                        No movies found in database. Add some using the form!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
