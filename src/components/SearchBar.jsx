import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function SearchBar({ className = '' }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative flex items-center ${className}`}>
      <MagnifyingGlassIcon className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies, TV shows..."
        className="w-full bg-[#1F1F1F] border border-white/10 focus:border-[#FF4C29] text-white pl-11 pr-10 py-3 rounded-xl text-sm focus:outline-none placeholder-gray-500 transition-colors"
      />
      {query && (
        <button type="button" onClick={() => setQuery('')} className="absolute right-3 text-gray-400 hover:text-white">
          <XMarkIcon className="w-5 h-5" />
        </button>
      )}
    </form>
  );
}
