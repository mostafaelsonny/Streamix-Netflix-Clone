# 🎬 Sonny-Flex — Netflix Clone

A full-featured streaming discovery app built with React, Firebase, and the TMDB API. Styled with a bold orange-red theme — different from Netflix, equally cinematic.

![Sonny-Flex Preview](https://via.placeholder.com/1200x600/0D0D0D/FF4C29?text=Sonny-Flex+Streaming+App)

---

## ✨ Features

- 🎥 **Dynamic movie rows** — Trending, Top Rated, Now Playing, by Genre
- 🎞️ **Trailer popup** — YouTube trailers in a modal overlay
- 🔍 **Search** — Full-text search with sort & rating filters
- 📋 **Watchlist** — Persisted to Firebase (logged-in) or localStorage (guest)
- 🔐 **Authentication** — Email/password + Google login via Firebase
- 📱 **Fully responsive** — Desktop, tablet, mobile
- ⚡ **Infinite scroll** — Load more as you scroll each row
- 💀 **Skeleton loading** — Shimmer loaders during API fetches
- 🎬 **Movie Details** — Cast, genres, ratings, trailers, similar movies

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| Styling | TailwindCSS |
| API Calls | Axios |
| Movie Data | TMDB API (free) |
| Auth | Firebase Authentication |
| Database | Firebase Firestore (free tier) |
| Video | react-youtube |
| Icons | Heroicons |
| Hosting | Netlify (free) |

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/sonny-flex.git
cd sonny-flex
npm install
```

### 2. Get a TMDB API Key (Free)

1. Go to [https://www.themoviedb.org/](https://www.themoviedb.org/)
2. Create a free account
3. Go to **Settings → API → Request API Key**
4. Select "Developer" → fill the form → get your key

### 3. Set Up Firebase (Free Tier)

1. Go to [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Click **Add Project** → give it a name
3. **Authentication**: Enable Email/Password and Google sign-in
   - Go to **Authentication → Sign-in method**
4. **Firestore**: Create a database in test mode
   - Go to **Firestore Database → Create database → Start in test mode**
5. Get your config:
   - Go to **Project Settings → Your apps → Web app**
   - Copy the `firebaseConfig` object values

### 4. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your keys:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🔥 Firebase Firestore Rules

In Firestore → Rules, paste this for secure access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/watchlist/{movieId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Fixed navbar, search, profile dropdown
│   ├── Banner.jsx          # Hero with random trending movie
│   ├── Row.jsx             # Movie row with infinite scroll
│   ├── MovieCard.jsx       # Card with hover overlay
│   ├── TrailerPopup.jsx    # YouTube trailer modal
│   ├── SearchBar.jsx       # Search input component
│   └── Footer.jsx
├── pages/
│   ├── Home.jsx            # Landing page with all rows
│   ├── Movies.jsx          # Movies page
│   ├── TVShows.jsx         # TV Shows page
│   ├── MovieDetails.jsx    # Full movie detail + cast
│   ├── SearchResults.jsx   # Search with filters
│   ├── Watchlist.jsx       # User's saved movies
│   ├── Login.jsx           # Sign in
│   └── Signup.jsx          # Sign up
├── context/
│   ├── AuthContext.jsx     # Firebase auth state
│   └── WatchlistContext.jsx# Watchlist with Firestore sync
└── services/
    ├── api.js              # All TMDB API calls
    └── firebase.js         # Firebase initialization
```

---

## 🌐 Deploy to Netlify

### Option A: Netlify CLI

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

### Option B: GitHub + Netlify UI

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) → **Add new site → Import from Git**
3. Select your repo
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Add environment variables under **Site settings → Environment variables**
7. Deploy!

The `netlify.toml` file handles SPA routing automatically.

---

## 🎨 Color Palette

| Name | Hex | Usage |
|---|---|---|
| Background | `#0D0D0D` | Main background |
| Card | `#1F1F1F` | Cards, panels |
| Primary | `#FF4C29` | Buttons, accents, logo |
| Hover | `#FF7A50` | Button hover, secondary |
| Text | `#F5F5F5` | Main text |
| Muted | `#9CA3AF` | Subtitles, labels |

---

## 📌 API Endpoints Used

| Endpoint | Usage |
|---|---|
| `/trending/movie/week` | Hero banner, trending row |
| `/movie/top_rated` | Top rated row |
| `/movie/now_playing` | Now playing row |
| `/movie/upcoming` | Coming soon row |
| `/discover/movie?with_genres=X` | Genre-specific rows |
| `/movie/{id}` | Movie detail page |
| `/movie/{id}/videos` | Trailer popup |
| `/movie/{id}/similar` | Similar movies section |
| `/search/movie` | Search functionality |
| `/trending/tv/week` | TV trending |
| `/tv/top_rated` | Top rated TV |
| `/discover/tv?with_genres=X` | TV by genre |

---

## 💡 Tips

- **No Firebase?** The app works fully with localStorage for watchlist — no Firebase config required for demo
- **Rate limits**: TMDB free tier = 50 requests/second — more than enough
- **Images**: TMDB provides `w92`, `w185`, `w300`, `w500`, `original` sizes
- **Performance**: All images use `loading="lazy"` for fast page loads

---

## 📄 License

MIT License — free to use, modify, and deploy for personal or portfolio projects.

---

*Data provided by [The Movie Database (TMDB)](https://www.themoviedb.org/). This product uses the TMDB API but is not endorsed or certified by TMDB.*
