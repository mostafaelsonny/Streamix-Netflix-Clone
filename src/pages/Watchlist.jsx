import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { IMAGE_BASE } from '../services/api';
import { TrashIcon, StarIcon, PlayIcon } from '@heroicons/react/24/solid';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import TrailerPopup from '../components/TrailerPopup';

// ✅ Firestore imports
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";

export default function Watchlist() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trailerItem, setTrailerItem] = useState(null);
  const [sortBy, setSortBy] = useState('added');
  const [watchlist, setWatchlist] = useState([]); // ✅ state محلي

  // ✅ قراءة الـ watchlist أوتوماتيك من Firestore
  useEffect(() => {
    if (!user) return;

    const watchlistRef = collection(db, "users", user.uid, "watchlist");

    const unsubscribe = onSnapshot(watchlistRef, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWatchlist(items);
      console.log("Watchlist updated:", items);
    });

    return () => unsubscribe();
  }, [user]);

  // ✅ حذف فيلم من Firestore
  const removeFromWatchlist = async (id) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "watchlist", id.toString()));
      console.log("Movie removed:", id);
    } catch (error) {
      console.error("Error removing movie:", error);
    }
  };

  const sorted = [...watchlist].sort((a, b) => {
    if (sortBy === 'added') return new Date(b.addedAt) - new Date(a.addedAt);
    if (sortBy === 'rating') return (b.vote_average || 0) - (a.vote_average || 0);
    if (sortBy === 'title') return (a.title || a.name || '').localeCompare(b.title || b.name || '');
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-20 pb-16 px-6 md:px-16">
      <div className="max-w-[1400px] mx-auto pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-4xl md:text-5xl text-white tracking-wider">
              My List<span className="text-[#FF4C29]">.</span>
            </h1>
            {!user && (
              <p className="text-gray-500 text-sm mt-1">
                <Link to="/login" className="text-[#FF4C29] hover:text-[#FF7A50]">
                  Sign in
                </Link> to save your list to the cloud
              </p>
            )}
          </div>

          {watchlist.length > 0 && (
            <div className="flex bg-[#1F1F1F] rounded-lg p-1">
              {[['added', 'Recently Added'], ['rating', 'Rating'], ['title', 'Title']].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setSortBy(val)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    sortBy === val ? 'bg-[#FF4C29] text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {watchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <BookmarkIcon className="w-16 h-16 text-gray-700 mb-4" />
            <h2 className="text-gray-400 text-xl font-medium mb-2">Your list is empty</h2>
            <p className="text-gray-600 text-sm mb-6">Add movies and TV shows to watch later</p>
            <Link
              to="/"
              className="bg-[#FF4C29] hover:bg-[#FF7A50] text-white font-semibold px-6 py-2.5 rounded-md transition-colors text-sm"
            >
              Browse Content
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-6">
              {watchlist.length} title{watchlist.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {sorted.map((item) => {
                const title = item.title || item.name;
                return (
                  <div key={item.id} className="group relative cursor-pointer">
                    <div className="aspect-[2/3] bg-[#1F1F1F] rounded-lg overflow-hidden">
                      <img
                        src={
                          item.poster_path
                            ? `${IMAGE_BASE}${item.poster_path}`
                            : '/assets/no-image.png'
                        }
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex flex-col justify-end p-3">
                        <p className="text-white font-semibold text-xs mb-2 line-clamp-2">{title}</p>
                        {item.vote_average > 0 && (
                          <div className="flex items-center gap-1 text-yellow-400 text-xs mb-2">
                            <StarIcon className="w-3 h-3" /> {item.vote_average?.toFixed(1)}
                          </div>
                        )}
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => setTrailerItem(item)}
                            className="flex-1 flex items-center justify-center gap-1 bg-[#FF4C29] text-white text-xs py-1.5 rounded transition-colors hover:bg-[#FF7A50]"
                          >
                            <PlayIcon className="w-3 h-3" /> Trailer
                          </button>
                          <button
                            onClick={() =>
                              navigate(item.media_type === 'tv' || item.name ? `/tv/${item.id}` : `/movie/${item.id}`)
                            }
                            className="flex-1 bg-white/20 text-white text-xs py-1.5 rounded transition-colors hover:bg-white/30"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => removeFromWatchlist(item.id)}
                            className="p-1.5 bg-red-500/20 text-red-400 rounded transition-colors hover:bg-red-500/40"
                            title="Remove"
                          >
                            <TrashIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs mt-1.5 line-clamp-1">{title}</p>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {trailerItem && (
        <TrailerPopup
          id={trailerItem.id}
          type={trailerItem.media_type === 'tv' || trailerItem.name ? 'tv' : 'movie'}
          onClose={() => setTrailerItem(null)}
        />
      )}
    </div>
  );
}
