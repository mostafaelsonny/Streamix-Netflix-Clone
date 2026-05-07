import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { EmailAuthProvider, linkWithCredential } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleUser, setGoogleUser] = useState(null); // ✅ المستخدم بعد دخول جوجل
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function linkEmailPassword(user, email, password) {
    const credential = EmailAuthProvider.credential(email, password);
    try {
      await linkWithCredential(user, credential);
      console.log("Account linked with Email/Password");
      navigate('/'); // بعد الربط يدخل على الصفحة الرئيسية
    } catch (error) {
      console.error("Link error:", error.code, error.message);
      setError(error.message);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.code === 'auth/invalid-credential' ? 'Invalid email or password.' : err.message);
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setError(''); setLoading(true);
    try {
      const userCredential = await loginWithGoogle();
      setGoogleUser(userCredential.user); // ✅ خزّن المستخدم بعد دخول جوجل
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF4C29] opacity-5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <span className="font-display text-4xl text-[#FF4C29]">SONNY</span>
            <span className="font-display text-4xl text-white">FLEX</span>
          </Link>
          <p className="text-gray-400 mt-2 text-sm">Welcome back</p>
        </div>

        <div className="bg-[#1F1F1F] border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-white font-semibold text-xl mb-6">Sign In</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          {!googleUser && (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">Email</label>
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#FF4C29] text-white px-4 py-3 rounded-lg text-sm focus:outline-none transition-colors placeholder-gray-600"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">Password</label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                      className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#FF4C29] text-white px-4 py-3 pr-10 rounded-lg text-sm focus:outline-none transition-colors placeholder-gray-600"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                      {showPw ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit" disabled={loading}
                  className="w-full bg-[#FF4C29] hover:bg-[#FF7A50] disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors text-sm mt-2"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : 'Sign In'}
                </button>
              </form>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-gray-600 text-xs">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <button
                onClick={handleGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 rounded-lg transition-colors text-sm disabled:opacity-60"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                  <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                  <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                  <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                </svg>
                Continue with Google
              </button>
            </>
          )}

                  {googleUser && (
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">
                You signed in with Google. Set a password to link your account:
              </p>

              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#FF4C29] text-white px-4 py-3 rounded-lg text-sm focus:outline-none transition-colors placeholder-gray-600"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">New Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#FF4C29] text-white px-4 py-3 pr-10 rounded-lg text-sm focus:outline-none transition-colors placeholder-gray-600"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPw ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                onClick={() => linkEmailPassword(googleUser, email, password)}
                disabled={loading}
                className="w-full bg-[#FF4C29] hover:bg-[#FF7A50] disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors text-sm mt-2"
              >
                Link Account
              </button>
            </div>
          )}

          <p className="text-gray-500 text-sm text-center mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#FF4C29] hover:text-[#FF7A50] font-medium">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

