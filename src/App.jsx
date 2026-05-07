import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WatchlistProvider } from './context/WatchlistContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Movies from './pages/Movies';
import TVShows from './pages/TVShows';
import MovieDetails from './pages/MovieDetails';
import SearchResults from './pages/SearchResults';
import Watchlist from './pages/Watchlist';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TVDetails from './pages/TVDetails';


function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

function AuthLayout({ children }) {
  return <main>{children}</main>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WatchlistProvider>
          <Routes>
            <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
            <Route path="/signup" element={<AuthLayout><Signup /></AuthLayout>} />
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/movies" element={<Layout><Movies /></Layout>} />
            <Route path="/tv" element={<Layout><TVShows /></Layout>} />
            <Route path="/movie/:id" element={<Layout><MovieDetails /></Layout>} />
            <Route path="/search" element={<Layout><SearchResults /></Layout>} />
            <Route path="/watchlist" element={<Layout><Watchlist /></Layout>} />
            <Route path="/tv/:id" element={<Layout><TVDetails /></Layout>} />
          </Routes>
        </WatchlistProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
