import axios from 'axios';

// استخدم المفتاح من ملف .env
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

if (!API_KEY) {
  console.error('⚠️ TMDB API Key is missing! Please add VITE_TMDB_API_KEY to your .env file');
}

const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
export const IMAGE_ORIGINAL = 'https://image.tmdb.org/t/p/original';

const api = axios.create({
  baseURL: BASE_URL,
});

// Wrapper لكل request عشان نضمن الـ api_key والـ language يتبعتوا صح كل مرة
const request = async (url, extraParams = {}) => {
  try {
    const res = await api.get(url, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
        ...extraParams,
      },
    });
    return res.data;
  } catch (err) {
    console.error(`❌ API Error on ${url}:`, err.response?.data || err.message);
    throw err;
  }
};

// --- MOVIES ---
export const getTrending = (page = 1) => 
  request('/trending/movie/week', { page });

export const getTopRated = (page = 1) => 
  request('/movie/top_rated', { page });

export const getNowPlaying = (page = 1) => 
  request('/movie/now_playing', { page });

export const getUpcoming = (page = 1) => 
  request('/movie/upcoming', { page });

export const getByGenre = (genreId, page = 1) =>
  request('/discover/movie', { with_genres: genreId, page, sort_by: 'popularity.desc' });

export const getMovieDetails = (movieId) =>
  request(`/movie/${movieId}`, { append_to_response: 'credits,videos,similar' });

export const getSimilarMovies = (movieId, page = 1) =>
  request(`/movie/${movieId}/similar`, { page });

export const getMovieVideos = (movieId) =>
  request(`/movie/${movieId}/videos`);

export const searchMovies = (query, page = 1) =>
  request('/search/movie', { query, page });


// --- TV SHOWS ---
export const getTVTrending = (page = 1) => 
  request('/trending/tv/week', { page });

export const getTopRatedTV = (page = 1) => 
  request('/tv/top_rated', { page });

export const getTVByGenre = (genreId, page = 1) =>
  request('/discover/tv', { with_genres: genreId, page, sort_by: 'popularity.desc' });

export const searchTV = (query, page = 1) =>
  request('/search/tv', { query, page });

// تفاصيل مسلسل (تأكدنا إن الـ endpoint بتبدأ بـ /tv/)
export const getTVDetails = (tvId) =>
  request(`/tv/${tvId}`, { append_to_response: 'credits,videos,similar' });

// مسلسلات مشابهة
export const getSimilarTV = (tvId, page = 1) =>
  request(`/tv/${tvId}/similar`, { page });

// فيديوهات المسلسلات
export const getTVVideos = (tvId) =>
  request(`/tv/${tvId}/videos`);


// --- GENRES ---
export const getGenres = () => request('/genre/movie/list');
export const getTVGenres = () => request('/genre/tv/list');

// Genre IDs
export const GENRES = {
  Action: 28, Comedy: 35, Horror: 27, Romance: 10749,
  SciFi: 878, Drama: 18, Thriller: 53, Animation: 16,
  Documentary: 99, Fantasy: 14,
};

export const TV_GENRES = {
  Drama: 18, Comedy: 35, Crime: 80, SciFi: 10765,
  Animation: 16, Reality: 10764, Documentary: 99,
};