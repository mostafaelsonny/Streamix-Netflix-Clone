import { useCallback } from 'react';
import Row from '../components/Row';
import { getTrending, getTopRated, getNowPlaying, getUpcoming, getByGenre, GENRES } from '../services/api';

export default function Movies() {
  const fetchTrending = useCallback((p) => getTrending(p), []);
  const fetchTopRated = useCallback((p) => getTopRated(p), []);
  const fetchNowPlaying = useCallback((p) => getNowPlaying(p), []);
  const fetchUpcoming = useCallback((p) => getUpcoming(p), []);
  const fetchAction = useCallback((p) => getByGenre(GENRES.Action, p), []);
  const fetchComedy = useCallback((p) => getByGenre(GENRES.Comedy, p), []);
  const fetchHorror = useCallback((p) => getByGenre(GENRES.Horror, p), []);
  const fetchSciFi = useCallback((p) => getByGenre(GENRES.SciFi, p), []);
  const fetchThriller = useCallback((p) => getByGenre(GENRES.Thriller, p), []);
  const fetchDrama = useCallback((p) => getByGenre(GENRES.Drama, p), []);
  const fetchRomance = useCallback((p) => getByGenre(GENRES.Romance, p), []);
  const fetchAnimation = useCallback((p) => getByGenre(GENRES.Animation, p), []);

  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-20 pb-16">
      <div className="max-w-[1400px] mx-auto pt-8 px-0">
        <div className="px-6 md:px-16 mb-8">
          <h1 className="font-display text-4xl md:text-5xl text-white tracking-wider">
            Movies<span className="text-[#FF4C29]">.</span>
          </h1>
          <p className="text-gray-500 mt-1">Explore thousands of films across all genres</p>
        </div>
        <Row title="Trending This Week" fetchFn={fetchTrending} />
        <Row title="Now Playing" fetchFn={fetchNowPlaying} />
        <Row title="Top Rated" fetchFn={fetchTopRated} />
        <Row title="Coming Soon" fetchFn={fetchUpcoming} />
        <Row title="Action & Adventure" fetchFn={fetchAction} />
        <Row title="Comedy" fetchFn={fetchComedy} />
        <Row title="Thriller" fetchFn={fetchThriller} />
        <Row title="Horror" fetchFn={fetchHorror} />
        <Row title="Sci-Fi" fetchFn={fetchSciFi} />
        <Row title="Drama" fetchFn={fetchDrama} />
        <Row title="Romance" fetchFn={fetchRomance} />
        <Row title="Animation" fetchFn={fetchAnimation} />
      </div>
    </div>
  );
}
