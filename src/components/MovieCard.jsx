import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IMAGE_BASE } from '../services/api';
import { useWatchlist } from '../context/WatchlistContext';
import TrailerPopup from './TrailerPopup';
import {
  PlayIcon,
  StarIcon,
  BookmarkIcon,
} from '@heroicons/react/24/solid';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

const PLACEHOLDER = '/assets/no-image.png';

export default function MovieCard({ movie, size = 'md' }) {
  const [showTrailer, setShowTrailer] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const navigate = useNavigate();

  const inWatchlist = isInWatchlist(movie.id);
  const title = movie.title || movie.name;
  const year = (movie.release_date || movie.first_air_date)?.split('-')[0];
  const rating = movie.vote_average?.toFixed(1);

  // تحديد النوع بدقة: لو مفيش media_type، بنشوف لو فيه title يبقى movie، لو name يبقى tv
  const mediaType = movie.media_type || (movie.name ? 'tv' : 'movie');

  const widths = { sm: 'w-32', md: 'w-44', lg: 'w-52' };
  const heights = { sm: 'h-48', md: 'h-64', lg: 'h-72' };

  const goToDetails = () => {
    // التنقل باستخدام النوع اللي استنتجناه بدقة
    navigate(`/${mediaType}/${movie.id}`);
  };

  return (
    <>
      <div
        className={`movie-card group ${widths[size]} flex-shrink-0 relative cursor-pointer`}
        onClick={goToDetails}
      >
        {/* Poster */}
        <div className={`${heights[size]} ${widths[size]} bg-[#1F1F1F] overflow-hidden rounded-lg`}>
          <img
            src={movie.poster_path && !imgError ? `${IMAGE_BASE}${movie.poster_path}` : PLACEHOLDER}
            alt={title}
            onError={() => setImgError(true)}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Hover overlay */}
        <div className="card-overlay absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          <h3 className="text-white font-semibold text-xs leading-tight mb-1 line-clamp-2">{title}</h3>
          
          <div className="flex items-center justify-between mb-2">
            {year && <span className="text-gray-400 text-xs">{year}</span>}
            {rating && (
              <span className="flex items-center gap-0.5 text-yellow-400 text-xs font-semibold">
                <StarIcon className="w-3 h-3" /> {rating}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => { 
                e.stopPropagation(); 
                setShowTrailer(true); 
              }}
              className="flex-1 flex items-center justify-center gap-1 bg-[#FF4C29] hover:bg-[#FF7A50] text-white text-xs font-semibold py-1.5 rounded transition-colors"
            >
              <PlayIcon className="w-3.5 h-3.5" /> Play
            </button>
            
            <button
              onClick={(e) => { e.stopPropagation(); goToDetails(); }}
              className="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded transition-colors"
              title="More info"
            >
              <InformationCircleIcon className="w-4 h-4" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                inWatchlist ? removeFromWatchlist(movie.id) : addToWatchlist(movie);
              }}
              className={`p-1.5 rounded transition-colors ${
                inWatchlist ? 'bg-[#FF4C29] text-white' : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
              title={inWatchlist ? 'Remove from list' : 'Add to list'}
            >
              <BookmarkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {showTrailer && (
        <TrailerPopup
          key={`trailer-${movie.id}`} // إضافة Key هنا مهمة جداً لإعادة تشغيل الـ Popup بـ ID جديد
          id={movie.id}
          type={mediaType} // استخدام النوع المستنتج
          onClose={() => setShowTrailer(false)}
        />
      )}
    </>
  );
} 