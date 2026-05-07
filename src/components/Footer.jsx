import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] border-t border-white/5 py-12 px-6 md:px-16 mt-16">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="mb-4">
              <span className="font-display text-2xl text-[#FF4C29]">SONNY</span>
              <span className="font-display text-2xl text-white">FLEX</span>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed">
              Your go-to streaming companion. Discover movies and TV shows powered by TMDB.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Browse</h4>
            <ul className="space-y-2">
              {[['/', 'Home'], ['/movies', 'Movies'], ['/tv', 'TV Shows'], ['/watchlist', 'My List']].map(([path, label]) => (
                <li key={path}>
                  <Link to={path} className="text-gray-500 hover:text-[#FF4C29] text-xs transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Account</h4>
            <ul className="space-y-2">
              {[['/login', 'Sign In'], ['/signup', 'Sign Up'], ['/watchlist', 'Watchlist']].map(([path, label]) => (
                <li key={path}>
                  <Link to={path} className="text-gray-500 hover:text-[#FF4C29] text-xs transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">About</h4>
            <p className="text-gray-500 text-xs leading-relaxed mb-2">
              This product uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
            <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer"
              className="text-[#FF4C29] text-xs hover:text-[#FF7A50] transition-colors">
              TMDB.org →
            </a>
          </div>
        </div>
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-gray-600 text-xs">© 2024 Sonny-Flex. All rights reserved.</p>
          <p className="text-gray-600 text-xs">Built with React + Firebase + TMDB API</p>
        </div>
      </div>
    </footer>
  );
}
