import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  doc, setDoc, deleteDoc, collection, onSnapshot,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';

const WatchlistContext = createContext();
export const useWatchlist = () => useContext(WatchlistContext);

const LS_KEY = 'sf_watchlist';

export function WatchlistProvider({ children }) {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);

  // Load from localStorage for guests
  useEffect(() => {
    if (!user) {
      try {
        const saved = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
        setWatchlist(saved);
      } catch { setWatchlist([]); }
    }
  }, [user]);

  // Real-time Firebase sync for logged-in users
  useEffect(() => {
    if (!user) return;
    const colRef = collection(db, 'users', user.uid, 'watchlist');
    const unsub = onSnapshot(colRef, (snap) => {
      const items = snap.docs.map((d) => d.data());
      setWatchlist(items);
    }, (err) => {
      console.error("Snapshot error:", err);
      try {
        const saved = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
        setWatchlist(saved);
      } catch { setWatchlist([]); }
    });
    return unsub;
  }, [user]);

  const saveToLS = (list) => {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  };

  const addToWatchlist = useCallback(async (movie) => {
    const item = {
      id: movie.id,
      title: movie.title || movie.name,
      poster_path: movie.poster_path || null,
      vote_average: movie.vote_average || 0,
      release_date: movie.release_date || movie.first_air_date || null,
      media_type: movie.media_type || (movie.name ? 'tv' : 'movie'),
      addedAt: new Date().toISOString(),
    };

    if (user) {
      try {
        // ✅ خزّن العنصر في document خاص بيه باستخدام id
        await setDoc(
          doc(db, 'users', user.uid, 'watchlist', String(item.id)),
          item,
          { merge: true } // مهم علشان يضمن التخزين الصحيح
        );
        // ✅ حدّث الـ state فورًا علشان يبان من غير انتظار الـ snapshot
        setWatchlist((prev) => [...prev.filter((m) => m.id !== item.id), item]);
      } catch (err) {
        console.error("Firebase error:", err);
      }
    } else {
      const updated = [...watchlist.filter((m) => m.id !== item.id), item];
      saveToLS(updated);
      setWatchlist(updated);
    }
  }, [user, watchlist]);

  const removeFromWatchlist = useCallback(async (movieId) => {
    if (user) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'watchlist', String(movieId)));
        // ✅ حدّث الـ state فورًا
        setWatchlist((prev) => prev.filter((m) => m.id !== movieId));
      } catch (err) {
        console.error("Firebase error:", err);
      }
    } else {
      const updated = watchlist.filter((m) => m.id !== movieId);
      saveToLS(updated);
      setWatchlist(updated);
    }
  }, [user, watchlist]);

  const isInWatchlist = useCallback((movieId) =>
    watchlist.some((m) => m.id === movieId), [watchlist]);

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
}
