import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Moon, Sun, Film, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800 transition-colors duration-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-2xl tracking-tighter">
          <Film className="w-8 h-8" />
          <span>FlickScore</span>
        </Link>
        <div className="flex items-center space-x-6">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-600 dark:text-gray-300">
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="font-medium hidden sm:block">Hi, {user.name.split(' ')[0]}</span>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className="flex items-center space-x-1 p-2 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition shadow-sm">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex space-x-3">
              <Link to="/login" className="px-4 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition">Login</Link>
              <Link to="/register" className="px-4 py-2 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
