import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, getSimilarMovies, IMAGE_BASE, IMAGE_ORIGINAL } from '../services/api';
import { useWatchlist } from '../context/WatchlistContext';
import TrailerPopup from '../components/TrailerPopup';
import Row from '../components/Row';
import {
  PlayIcon, StarIcon, ClockIcon, CalendarIcon,
  BookmarkIcon, ChevronLeftIcon,
} from '@heroicons/react/24/solid';

function Pill({ children }) {
  return (
    <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-gray-300 border border-white/10">
      {children}
    </span>
  );
}

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  useEffect(() => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    getMovieDetails(id)
      .then((res) => {
        const data = res.data || res; // يتعامل مع الحالتين
        setMovie(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const fetchSimilar = useCallback((p) => getSimilarMovies(id, p), [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] pt-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 pt-8 grid md:grid-cols-[300px_1fr] gap-10">
          <div className="w-full aspect-[2/3] shimmer rounded-xl" />
          <div className="space-y-4 pt-4">
            <div className="h-10 w-3/4 shimmer rounded" />
            <div className="h-4 w-1/3 shimmer rounded" />
            <div className="h-20 w-full shimmer rounded" />
            <div className="flex gap-2">
              <div className="h-10 w-32 shimmer rounded-md" />
              <div className="h-10 w-36 shimmer rounded-md" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center pt-20">
      <div className="text-center">
        <p className="text-gray-400 text-xl mb-4">Movie not found</p>
        <button onClick={() => navigate('/')} className="text-[#FF4C29] hover:text-[#FF7A50]">← Back to Home</button>
      </div>
    </div>
  );

  const inWatchlist = isInWatchlist(movie.id);
  const trailer = movie.videos?.results?.find((v) => v.type === 'Trailer' && v.site === 'YouTube');
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null;
  const cast = movie.credits?.cast?.slice(0, 8) || [];

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Backdrop */}
      {movie.backdrop_path && (
        <div
          className="fixed inset-0 bg-cover bg-center opacity-10 pointer-events-none"
          style={{ backgroundImage: `url(${IMAGE_ORIGINAL}${movie.backdrop_path})` }}
        />
      )}

      <div className="relative z-10 pt-20 pb-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16">
          {/* Back button */}
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-400 hover:text-[#FF4C29] mb-6 text-sm transition-colors">
            <ChevronLeftIcon className="w-4 h-4" /> Back
          </button>

          <div className="grid md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-10">
            {/* Poster */}
            <div className="animate-fadeInUp">
              <img
                src={movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : 'https://via.placeholder.com/300x450/1F1F1F/FF4C29?text=No+Image'}
                alt={movie.title}
                className="w-full rounded-xl shadow-2xl shadow-black/60"
              />
            </div>

            {/* Details */}
            <div className="space-y-5 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              {/* Title */}
              <div>
                <h1 className="font-display text-4xl md:text-5xl text-white tracking-wider leading-tight mb-1">
                  {movie.title}
                  <span className="text-[#FF4C29]">.</span>
                </h1>
                {movie.tagline && (
                  <p className="text-gray-500 text-sm italic">"{movie.tagline}"</p>
                )}
              </div>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                {movie.vote_average > 0 && (
                  <span className="flex items-center gap-1.5 text-yellow-400 font-semibold bg-yellow-400/10 px-3 py-1 rounded-full">
                    <StarIcon className="w-4 h-4" />
                    {movie.vote_average?.toFixed(1)}
                    <span className="text-gray-400 font-normal text-xs">/ 10</span>
                  </span>
                )}
                {movie.release_date && (
                  <span className="flex items-center gap-1.5 text-gray-400">
                    <CalendarIcon className="w-4 h-4" />
                    {new Date(movie.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                )}
                {runtime && (
                  <span className="flex items-center gap-1.5 text-gray-400">
                    <ClockIcon className="w-4 h-4" />
                    {runtime}
                  </span>
                )}
              </div>

              {/* Genres */}
              {movie.genres?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((g) => (
                    <Pill key={g.id}>{g.name}</Pill>
                  ))}
                </div>
              )}

              {/* Overview */}
              <p className="text-gray-300 leading-relaxed text-sm md:text-base max-w-2xl">
                {movie.overview}
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                {trailer && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="flex items-center gap-2 bg-[#FF4C29] hover:bg-[#FF7A50] text-white font-semibold px-6 py-2.5 rounded-md transition-all text-sm"
                  >
                    <PlayIcon className="w-5 h-5" /> Play Trailer
                  </button>
                )}
                <button
                  onClick={() => inWatchlist ? removeFromWatchlist(movie.id) : addToWatchlist(movie)}
                  className={`flex items-center gap-2 font-semibold px-5 py-2.5 rounded-md transition-all text-sm border ${
                    inWatchlist
                      ? 'border-[#FF4C29] text-[#FF4C29] bg-[#FF4C29]/10 hover:bg-[#FF4C29]/20'
                      : 'border-white/30 text-white bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {/* استخدمنا BookmarkIcon بدل BookmarkPlusIcon */}
                  <BookmarkIcon className="w-5 h-5" />
                  {inWatchlist ? 'Remove from List' : 'Add to List'}
                </button>
              </div>

              {/* Cast */}
              {cast.length > 0 && (
                <div>
                  <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Cast</h3>
                  <div className="flex flex-wrap gap-2">
                    {cast.map((actor) => (
                      <div key={actor.id} className="flex items-center gap-2 bg-[#1F1F1F] rounded-full px-3 py-1.5">
                        {actor.profile_path ? (
                          <img
                            src={`${IMAGE_BASE}${actor.profile_path}`}
                            alt={actor.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-[#FF4C29]/20 flex items-center justify-center text-[#FF4C29] text-xs font-bold">
                            {actor.name[0]}
                          </div>
                        )}
                        <span className="text-gray-300 text-xs">{actor.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Similar Movies */}
          <div className="mt-16">
            <Row title="Similar Movies" fetchFn={fetchSimilar} size="md" />
          </div>
        </div>
      </div>

      {showTrailer && <TrailerPopup id={movie.id} type="movie" onClose={() => setShowTrailer(false)} />}

    </div>
  );
}