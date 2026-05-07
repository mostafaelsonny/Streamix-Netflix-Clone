import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrending, IMAGE_ORIGINAL } from '../services/api';
import { useWatchlist } from '../context/WatchlistContext';
import TrailerPopup from './TrailerPopup';
import {
  PlayIcon,
  InformationCircleIcon,
  StarIcon,
  BookmarkIcon,
} from '@heroicons/react/24/solid';

export default function Banner() {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const navigate = useNavigate();

  useEffect(() => {
    getTrending()
      .then((res) => {
        const results = res.results || res.data?.results || [];
        const random = results[Math.floor(Math.random() * Math.min(results.length, 8))];
        // ✅ أضفنا media_type: 'movie'
        setMovie({ ...random, media_type: 'movie' });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="relative h-[85vh] w-full shimmer flex items-end">
        <div className="px-8 md:px-16 pb-24 space-y-3">
          <div className="h-12 w-72 shimmer rounded" />
          <div className="h-4 w-96 shimmer rounded" />
          <div className="h-4 w-80 shimmer rounded" />
          <div className="flex gap-3 mt-4">
            <div className="h-10 w-28 shimmer rounded-md" />
            <div className="h-10 w-32 shimmer rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  const inWatchlist = isInWatchlist(movie.id);

  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{
          backgroundImage: movie.backdrop_path
            ? `url(${IMAGE_ORIGINAL}${movie.backdrop_path})`
            : 'none',
        }}
      />
      <div className="banner-gradient absolute inset-0" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-16 pb-20 md:pb-28 max-w-3xl">
        {/* Genre/type badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold bg-[#FF4C29] text-white px-2.5 py-1 rounded uppercase tracking-wider">
            {movie.media_type === 'tv' ? 'TV Show' : 'Movie'}
          </span>
          {movie.vote_average > 0 && (
            <span className="flex items-center gap-1 text-yellow-400 text-xs font-semibold bg-yellow-400/10 px-2.5 py-1 rounded-full">
              <StarIcon className="w-3 h-3" />
              {movie.vote_average?.toFixed(1)}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-display text-5xl md:text-7xl text-white mb-3 leading-none tracking-wider animate-fadeInUp">
          {movie.title || movie.name}
        </h1>

        {/* Overview */}
        <p
          className="text-gray-300 text-sm md:text-base leading-relaxed max-w-lg mb-6 line-clamp-3 animate-fadeInUp"
          style={{ animationDelay: '0.1s' }}
        >
          {movie.overview}
        </p>

        {/* Release date */}
        <p className="text-gray-400 text-xs mb-5">
          {movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0]}
        </p>

        {/* Buttons */}
        <div
          className="flex flex-wrap items-center gap-3 animate-fadeInUp"
          style={{ animationDelay: '0.2s' }}
        >
          <button
            onClick={() => setShowTrailer(true)}
            className="flex items-center gap-2 bg-[#FF4C29] hover:bg-[#FF7A50] text-white font-semibold px-6 py-2.5 rounded-md transition-all duration-200 text-sm"
          >
            <PlayIcon className="w-5 h-5" /> Play Trailer
          </button>
          <button
            onClick={() =>
              movie.media_type === 'tv'
                ? navigate(`/tv/${movie.id}`)
                : navigate(`/movie/${movie.id}`)
            }
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-2.5 rounded-md transition-all duration-200 backdrop-blur-sm text-sm"
          >
            <InformationCircleIcon className="w-5 h-5" /> More Info
          </button>
          <button
            onClick={() =>
              inWatchlist ? removeFromWatchlist(movie.id) : addToWatchlist(movie)
            }
            className={`flex items-center gap-2 font-semibold px-4 py-2.5 rounded-md transition-all duration-200 text-sm border ${
              inWatchlist
                ? 'border-[#FF4C29] text-[#FF4C29] bg-[#FF4C29]/10 hover:bg-[#FF4C29]/20'
                : 'border-white/30 text-white bg-white/10 hover:bg-white/20'
            }`}
          >
            <BookmarkIcon className="w-5 h-5" />
            {inWatchlist ? 'In List' : 'Add to List'}
          </button>
        </div>
      </div>

      {/* Trailer popup */}
      {showTrailer && (
        <TrailerPopup
          id={movie.id}
          type={movie.media_type} // ✅ النوع بيتبعت صح
          onClose={() => setShowTrailer(false)}
        />
      )}
    </div>
  );
}
