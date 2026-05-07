import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import {
  MagnifyingGlassIcon, BellIcon, BookmarkIcon,
  Bars3Icon, XMarkIcon, ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { watchlist } = useWatchlist();
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setShowDropdown(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      // سيب قيمة البحث موجودة علشان المستخدم يعدلها بسهولة
      setShowSearch(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#0D0D0D]/98 shadow-lg shadow-black/50' : 'bg-gradient-to-b from-black/80 to-transparent'
    }`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex items-center">
            <span className="font-display text-3xl text-[#FF4C29] tracking-wider leading-none group-hover:text-[#FF7A50] transition-colors">
              SONNY
            </span>
            <span className="font-display text-3xl text-white tracking-wider leading-none ml-0.5">
              FLEX
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-[#FF4C29]' : 'text-gray-300 hover:text-white'}`}>
            Home
          </Link>
          <Link to="/movies" className={`text-sm font-medium transition-colors ${isActive('/movies') ? 'text-[#FF4C29]' : 'text-gray-300 hover:text-white'}`}>
            Movies
          </Link>
          <Link to="/tv" className={`text-sm font-medium transition-colors ${isActive('/tv') ? 'text-[#FF4C29]' : 'text-gray-300 hover:text-white'}`}>
            TV Shows
          </Link>
          <Link to="/watchlist" className={`text-sm font-medium transition-colors ${isActive('/watchlist') ? 'text-[#FF4C29]' : 'text-gray-300 hover:text-white'}`}>
            My List
          </Link>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex items-center">
            {showSearch ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  ref={searchRef}
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies, TV shows..."
                  className="bg-[#1F1F1F] border border-[#FF4C29] text-white text-sm px-4 py-1.5 rounded-full w-56 focus:outline-none focus:border-[#FF7A50] placeholder-gray-500"
                />
                <button type="button" onClick={() => setShowSearch(false)} className="ml-2 text-gray-400 hover:text-white">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </form>
            ) : (
              <button onClick={() => setShowSearch(true)} className="p-1.5 text-gray-300 hover:text-[#FF4C29] transition-colors">
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Watchlist icon */}
          <Link to="/watchlist" className="relative p-1.5 text-gray-300 hover:text-[#FF4C29] transition-colors">
            {watchlist.length > 0 ? (
              <BookmarkSolid className="w-5 h-5 text-[#FF4C29]" />
            ) : (
              <BookmarkIcon className="w-5 h-5" />
            )}
            {watchlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#FF4C29] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {watchlist.length > 9 ? '9+' : watchlist.length}
              </span>
            )}
          </Link>

          {/* Profile / Auth */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 group"
              >
                <div className="w-8 h-8 rounded-full bg-[#FF4C29] flex items-center justify-center text-white font-bold text-sm">
                  {(user.displayName || user.email)?.[0]?.toUpperCase()}
                </div>
                <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#1F1F1F] border border-white/10 rounded-lg shadow-xl animate-fadeIn overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-white font-medium text-sm truncate">{user.displayName || 'User'}</p>
                    <p className="text-gray-400 text-xs truncate">{user.email}</p>
                  </div>
                  <Link to="/watchlist" className="flex items-center gap-2 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 text-sm transition-colors" onClick={() => setShowDropdown(false)}>
                    <BookmarkIcon className="w-4 h-4" /> My Watchlist
                  </Link>
                  <button
                    onClick={() => { logout(); setShowDropdown(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-[#FF4C29] hover:bg-white/5 text-sm transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="bg-[#FF4C29] hover:bg-[#FF7A50] text-white text-sm font-semibold px-4 py-1.5 rounded-md transition-colors">
              Sign In
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button onClick={() => setShowMobile(!showMobile)} className="md:hidden p-1.5 text-gray-300 hover:text-white">
            {showMobile ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobile && (
        <div className="md:hidden bg-[#0D0D0D]/98 border-t border-white/10 px-4 py-4 flex flex-col gap-3 animate-fadeIn">
          {['/', '/movies', '/tv', '/watchlist'].map((path, i) => (
            <Link
              key={path}
              to={path}
              onClick={() => setShowMobile(false)}
              className={`text-md  font-extrabold py-2 transition-colors ${isActive(path) ? 'text-[#FF4C29]' : 'text-gray-300'}`}
            >
              {['Home', 'Movies', 'TV Shows', 'My List'][i]}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
