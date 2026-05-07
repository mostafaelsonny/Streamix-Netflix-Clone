import { useCallback } from 'react';
import Row from '../components/Row';
import { getTVTrending, getTopRatedTV, getTVByGenre, TV_GENRES } from '../services/api';

export default function TVShows() {
  const fetchTrending = useCallback((p) => getTVTrending(p), []);
  const fetchTopRated = useCallback((p) => getTopRatedTV(p), []);
  const fetchDrama = useCallback((p) => getTVByGenre(TV_GENRES.Drama, p), []);
  const fetchComedy = useCallback((p) => getTVByGenre(TV_GENRES.Comedy, p), []);
  const fetchCrime = useCallback((p) => getTVByGenre(TV_GENRES.Crime, p), []);
  const fetchSciFi = useCallback((p) => getTVByGenre(TV_GENRES.SciFi, p), []);
  const fetchAnimation = useCallback((p) => getTVByGenre(TV_GENRES.Animation, p), []);
  const fetchDocumentary = useCallback((p) => getTVByGenre(TV_GENRES.Documentary, p), []);

  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-20 pb-16">
      <div className="max-w-[1400px] mx-auto pt-8 px-0">
        <div className="px-6 md:px-16 mb-8">
          <h1 className="font-display text-4xl md:text-5xl text-white tracking-wider">
            TV Shows<span className="text-[#FF4C29]">.</span>
          </h1>
          <p className="text-gray-500 mt-1">Binge-worthy series from around the world</p>
        </div>
        <Row title="Trending Shows" fetchFn={fetchTrending} type="tv" />
        <Row title="Top Rated" fetchFn={fetchTopRated} type="tv" />
        <Row title="Drama" fetchFn={fetchDrama} type="tv" />
        <Row title="Comedy" fetchFn={fetchComedy} type="tv" />
        <Row title="Crime" fetchFn={fetchCrime} type="tv" />
        <Row title="Sci-Fi & Fantasy" fetchFn={fetchSciFi} type="tv" />
        <Row title="Animation" fetchFn={fetchAnimation} type="tv" />
        <Row title="Documentary" fetchFn={fetchDocumentary} type="tv" />
      </div>
    </div>
  );
}
