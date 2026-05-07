import { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import { getMovieVideos, getTVVideos } from '../services/api';
import { XMarkIcon } from '@heroicons/react/24/solid';

export default function TrailerPopup({ id, type = 'movie', onClose }) {
  const [videoKey, setVideoKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchVideos = type === 'tv' ? getTVVideos : getMovieVideos;

    fetchVideos(id)
      .then((res) => {
        const data = res.data || res;
        const videos = data.results || [];

        // ✅ فلترة الفيديوهات: اختار Trailer من YouTube، ولو مش موجود خد Teaser
        const trailer =
          videos.find((v) => v.type === 'Trailer' && v.site === 'YouTube') ||
          videos.find((v) => v.type === 'Teaser' && v.site === 'YouTube');

        if (trailer) {
          setVideoKey(trailer.key);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });

    // ✅ إغلاق الـ Popup بالـ Escape
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);

    // ✅ منع الـ scroll في الخلفية
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [id, type, onClose]);

  return (
    <div className="trailer-overlay animate-fadeIn" onClick={onClose}>
      <div className="relative w-full max-w-4xl mx-4" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-[#FF4C29] transition-colors z-10"
        >
          <XMarkIcon className="w-8 h-8" />
        </button>
        <div
          className="relative bg-black rounded-xl overflow-hidden shadow-2xl"
          style={{ paddingTop: '56.25%' }}
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#1F1F1F]">
              <div className="w-10 h-10 border-4 border-[#FF4C29] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {error && !loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1F1F1F] text-gray-400">
              <p className="text-lg font-medium mb-2">No trailer available</p>
              <p className="text-sm">Check back later for this title</p>
            </div>
          )}
          {videoKey && !loading && (
            <YouTube
              videoId={videoKey}
              className="absolute inset-0 w-full h-full"
              opts={{
                width: '100%',
                height: '100%',
                playerVars: { autoplay: 1, rel: 0, modestbranding: 1 },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
