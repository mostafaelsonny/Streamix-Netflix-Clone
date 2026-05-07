import { useState, useEffect, useRef, useCallback } from 'react';
import MovieCard from './MovieCard';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-44 h-64 shimmer rounded-lg" />
  );
}

export default function Row({ title, fetchFn, size = 'md', type }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const rowRef = useRef(null);

  // 1. Reset Logic: لما الـ fetchFn تتغير (يعني الـ ID بتاع المسلسل اتغير)
  useEffect(() => {
    let isMounted = true;
    
    // تصفيح البيانات تماماً عشان ميعرضش حاجة المسلسل القديم
    setMovies([]);
    setPage(1);
    setLoading(true);
    setHasMore(true);

    fetchFn(1)
      .then((res) => {
        if (!isMounted) return;
        const results = res.results || res.data?.results || [];
        
        const normalized = results.map((m) => ({
          ...m,
          media_type: m.media_type || type,
        }));

        setMovies(normalized);

        const currentPage = res.page || res.data?.page || 1;
        const totalPages = res.total_pages || res.data?.total_pages || 1;
        setHasMore(currentPage < totalPages);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Row Fetch Error:", err);
        setLoading(false);
      });

    return () => { isMounted = false; };
  }, [fetchFn, type]); // الـ fetchFn بتتغير لما الـ ID في الصفحة الأب يتغير

  // 2. Infinite scroll
  const handleScroll = useCallback(() => {
    if (!rowRef.current || loadingMore || !hasMore || loading) return;

    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    
    // لو قربنا من نهاية الـ Row (أقل من 200px)
    if (scrollWidth - scrollLeft - clientWidth < 200) {
      setLoadingMore(true);
      const nextPage = page + 1;

      fetchFn(nextPage)
        .then((res) => {
          const results = res.results || res.data?.results || [];
          const normalized = results.map((m) => ({
            ...m,
            media_type: m.media_type || type,
          }));

          setMovies((prev) => {
            const newIds = new Set(prev.map((m) => m.id));
            const fresh = normalized.filter((m) => !newIds.has(m.id));
            return [...prev, ...fresh];
          });

          const currentPage = res.page || res.data?.page || nextPage;
          const totalPages = res.total_pages || res.data?.total_pages || 1;
          
          setHasMore(currentPage < totalPages);
          setPage(nextPage);
          setLoadingMore(false);
        })
        .catch(() => setLoadingMore(false));
    }
  }, [fetchFn, page, hasMore, loadingMore, type, loading]);

  useEffect(() => {
    const row = rowRef.current;
    if (row) row.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      if (row) row.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const scroll = (dir) => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: dir * 800, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-8 group/row">
      <h2 className="text-white font-display text-2xl md:text-3xl tracking-wider px-6 md:px-16 mb-3">
        {title}<span className="text-[#FF4C29]">.</span>
      </h2>

      <div className="relative">
        <button
          onClick={() => scroll(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/80 hover:bg-[#FF4C29] text-white p-2 rounded-full opacity-0 group-hover/row:opacity-100 transition-all duration-200 shadow-lg"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>

        <div
          ref={rowRef}
          className="flex gap-3 overflow-x-auto pb-4 px-6 md:px-16 scroll-smooth"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#FF4C29 #1F1F1F' }}
        >
          {loading
            ? Array(8).fill(0).map((_, i) => <SkeletonCard key={`skeleton-${i}`} />)
            : movies.map((movie) => (
                <MovieCard
                  key={`${movie.id}-${type}`} // استخدام ID مركب لضمان عدم التكرار
                  movie={movie}
                  size={size}
                />
              ))
          }
          {loadingMore && <SkeletonCard />}
        </div>

        <button
          onClick={() => scroll(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/80 hover:bg-[#FF4C29] text-white p-2 rounded-full opacity-0 group-hover/row:opacity-100 transition-all duration-200 shadow-lg"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}