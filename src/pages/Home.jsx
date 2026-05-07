import Banner from '../components/Banner';
import Row from '../components/Row';
import {
  getTrending, getTopRated, getByGenre, getNowPlaying, getUpcoming, GENRES,
} from '../services/api';
import { useCallback } from 'react';

export default function Home() {
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

  return (
    <div className="bg-[#0D0D0D] min-h-screen">
      <Banner />
      <div className="py-6 -mt-16 relative z-10">
        <Row title="Trending Now" fetchFn={fetchTrending} type="movie" />
        <Row title="Now Playing" fetchFn={fetchNowPlaying} type="movie" />
        <Row title="Top Rated" fetchFn={fetchTopRated} type="movie" />
        <Row title="Upcoming" fetchFn={fetchUpcoming} type="movie" />
        <Row title="Action" fetchFn={fetchAction} type="movie" />
        <Row title="Comedy" fetchFn={fetchComedy} type="movie" />
        <Row title="Thriller" fetchFn={fetchThriller} type="movie" />
        <Row title="Horror" fetchFn={fetchHorror} type="movie" />
        <Row title="Sci-Fi" fetchFn={fetchSciFi} type="movie" />
        <Row title="Drama" fetchFn={fetchDrama} type="movie" />
      </div>
    </div>
  );
}
