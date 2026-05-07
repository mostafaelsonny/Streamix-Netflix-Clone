import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies, searchTV, getGenres } from '../services/api';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

const SORT_OPTIONS = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'rating', label: 'Rating' },
  { value: 'date', label: 'Release Date' },
];

export default function SearchResults() {
  const [params] = useSearchParams();
  const query = params.get('q') || '';
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [tab, setTab] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [minRating, setMinRating] = useState(0);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    getGenres()
      .then((res) => {
        const data = res.data || res;
        setGenres(data.genres || []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setMovies([]); setTvShows([]); setPage(1);
    Promise.all([
      searchMovies(query, 1),
      searchTV(query, 1),
    ]).then(([movieRes, tvRes]) => {
      const movieData = movieRes.data || movieRes;
      const tvData = tvRes.data || tvRes;
      setMovies(movieData.results || []);
      setTvShows((tvData.results || []).map(t => ({ ...t, media_type: 'tv' })));
      setHasMore((movieData.page || 1) < (movieData.total_pages || 1));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [query]);

  const loadMore = () => {
    const nextPage = page + 1;
    searchMovies(query, nextPage).then((res) => {
      const data = res.data || res;
      setMovies((prev) => [...prev, ...(data.results || [])]);
      setHasMore((data.page || nextPage) < (data.total_pages || nextPage));
      setPage(nextPage);
    });
  };

  const allResults = [
    ...(tab === 'tv' ? [] : movies.map(m => ({ ...m, media_type: 'movie' }))),
    ...(tab === 'movies' ? [] : tvShows),
  ];

  const filtered = allResults
    .filter(m => minRating === 0 || (m.vote_average || 0) >= minRating)
    .filter(m => !selectedGenre || m.genre_ids?.includes(Number(selectedGenre)))
    .sort((a, b) => {
      if (sortBy === 'rating') return (b.vote_average || 0) - (a.vote_average || 0);
      if (sortBy === 'date') return new Date(b.release_date || b.first_air_date || 0) - new Date(a.release_date || a.first_air_date || 0);
      return (b.popularity || 0) - (a.popularity || 0);
    });
  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-20 px-6 md:px-16 pb-16">
      <div className="max-w-[1400px] mx-auto">
        <div className="pt-8 mb-8">
          <SearchBar className="max-w-2xl" />
        </div>

        {query && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-white font-display text-3xl tracking-wider">
                  Results for <span className="text-[#FF4C29]">"{query}"</span>
                </h1>
                <p className="text-gray-500 text-sm mt-1">{filtered.length} results found</p>
              </div>

              <div className="flex items-center gap-3">
                {/* Tab filter */}
                <div className="flex bg-[#1F1F1F] rounded-lg p-1">
                  {[['all', 'All'], ['movies', 'Movies'], ['tv', 'TV Shows']].map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => setTab(val)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        tab === val ? 'bg-[#FF4C29] text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Filters toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
                    showFilters ? 'border-[#FF4C29] text-[#FF4C29] bg-[#FF4C29]/10' : 'border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <AdjustmentsHorizontalIcon className="w-4 h-4" /> Filters
                </button>
              </div>
            </div>

            {/* Filter panel */}
            {showFilters && (
              <div className="bg-[#1F1F1F] border border-white/10 rounded-xl p-5 mb-6 flex flex-wrap gap-6 animate-fadeIn">
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Sort By</label>
                  <div className="flex gap-2">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setSortBy(opt.value)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                          sortBy === opt.value ? 'bg-[#FF4C29] text-white' : 'bg-[#0D0D0D] text-gray-400 hover:text-white border border-white/10'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">
                    Min Rating: <span className="text-white">{minRating > 0 ? minRating : 'Any'}</span>
                  </label>
                  <input
                    type="range" min="0" max="9" step="1" value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="w-32 accent-[#FF4C29]"
                  />
                </div>
              </div>
            )}

            {/* Results grid */}
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-[#FF4C29] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-xl mb-2">No results found</p>
                <p className="text-gray-600 text-sm">Try different keywords or adjust filters</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3">
                  {filtered.map((movie) => (
                    <MovieCard key={`${movie.media_type}-${movie.id}`} movie={movie} size="md" />
                  ))}
                </div>
                {hasMore && tab !== 'tv' && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={loadMore}
                      className="bg-[#FF4C29] hover:bg-[#FF7A50] text-white font-semibold px-8 py-3 rounded-md transition-colors"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {!query && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl mb-2">Search for movies and TV shows</p>
            <p className="text-gray-600 text-sm">Type something in the search bar above</p>
          </div>
        )}
      </div>
    </div>
  );
}
