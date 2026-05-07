import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTVDetails, getSimilarTV, IMAGE_BASE, IMAGE_ORIGINAL } from '../services/api';
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

export default function TVDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tv, setTV] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  useEffect(() => {
    let isMounted = true;
    
    // تصفيح الـ State تماماً عند تغيير الـ ID
    setTV(null);
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    getTVDetails(id)
      .then((res) => {
        if (!isMounted) return;
        const data = res.data || res;
        setTV(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("TV Fetch Error:", err);
        setLoading(false);
      });

    return () => { isMounted = false; };
  }, [id]);

  // دالة المسلسلات المشابهة - لازم تكون tv
  const fetchSimilar = useCallback((p) => getSimilarTV(id, p), [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] pt-20 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#FF4C29] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!tv) return null;

  const inWatchlist = isInWatchlist(tv.id);
  const trailer = tv.videos?.results?.find((v) => v.type === 'Trailer' && v.site === 'YouTube');
  const year = tv.first_air_date?.split('-')[0];
  const rating = tv.vote_average?.toFixed(1);
  const cast = tv.credits?.cast?.slice(0, 8) || [];

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {tv.backdrop_path && (
        <div
          className="fixed inset-0 bg-cover bg-center opacity-10 pointer-events-none"
          style={{ backgroundImage: `url(${IMAGE_ORIGINAL}${tv.backdrop_path})` }}
        />
      )}

      <div className="relative z-10 pt-20 pb-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-400 hover:text-[#FF4C29] mb-6 text-sm transition-colors">
            <ChevronLeftIcon className="w-4 h-4" /> Back
          </button>

          <div className="grid md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-10">
            <div>
              <img
                src={tv.poster_path ? `${IMAGE_BASE}${tv.poster_path}` : 'https://via.placeholder.com/300x450/1F1F1F/FF4C29?text=No+Image'}
                alt={tv.name}
                className="w-full rounded-xl shadow-2xl shadow-black/60"
              />
            </div>

            <div className="space-y-5">
              <div>
                <h1 className="font-display text-4xl md:text-5xl text-white tracking-wider leading-tight mb-1">
                  {tv.name}<span className="text-[#FF4C29]">.</span>
                </h1>
                {tv.tagline && <p className="text-gray-500 text-sm italic">"{tv.tagline}"</p>}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-yellow-400 font-semibold bg-yellow-400/10 px-3 py-1 rounded-full">
                  <StarIcon className="w-4 h-4" /> {rating}
                </span>
                <span className="flex items-center gap-1.5 text-gray-400"><CalendarIcon className="w-4 h-4" /> {year}</span>
              </div>

              <p className="text-gray-300 leading-relaxed text-sm md:text-base max-w-2xl">{tv.overview}</p>

              <div className="flex flex-wrap gap-3">
                {trailer && (
                  <button onClick={() => setShowTrailer(true)} className="flex items-center gap-2 bg-[#FF4C29] hover:bg-[#FF7A50] text-white font-semibold px-6 py-2.5 rounded-md transition-all text-sm">
                    <PlayIcon className="w-5 h-5" /> Play Trailer
                  </button>
                )}
                <button
                  onClick={() => inWatchlist ? removeFromWatchlist(tv.id) : addToWatchlist(tv)}
                  className={`flex items-center gap-2 font-semibold px-5 py-2.5 rounded-md transition-all text-sm border ${inWatchlist ? 'border-[#FF4C29] text-[#FF4C29] bg-[#FF4C29]/10' : 'border-white/30 text-white bg-white/10'}`}
                >
                  <BookmarkIcon className="w-5 h-5" /> {inWatchlist ? 'Remove from List' : 'Add to List'}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <Row 
              key={`tv-similar-${id}`} // الـ key هنا هيجبر الـ Row يتحدث
              title="Similar Shows" 
              fetchFn={fetchSimilar} 
              size="md" 
            />
          </div>
        </div>
      </div>

      {showTrailer && <TrailerPopup id={id} type="tv" onClose={() => setShowTrailer(false)} />}
    </div>
  );
}