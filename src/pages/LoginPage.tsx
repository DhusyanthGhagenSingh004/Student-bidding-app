import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result.ok) navigate('/marketplace');
    else setError(result.error ?? 'Invalid credentials');
  };

  return (
    <div className="flex min-h-screen">
      {/* Left – branding panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 px-12 text-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white/5" />
        <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-white/5" />
        <div className="absolute bottom-40 left-20 h-32 w-32 rounded-full bg-white/10" />

        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm shadow-xl">
            <span className="text-4xl font-extrabold">C</span>
          </div>
          <h1 className="text-4xl font-extrabold leading-tight">
            Campus<br />Auction
          </h1>
          <p className="max-w-xs text-lg text-white/80 leading-relaxed">
            Buy &amp; Sell<br />Used Items<br />within Campus
          </p>
        </div>
      </div>

      {/* Right – form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500">
              <span className="text-2xl font-extrabold text-white">C</span>
            </div>
            <span className="text-xl font-bold text-primary-500">Campus Auction</span>
          </div>

          <h2 className="text-2xl font-bold text-surface-900 mb-1">Welcome Back</h2>
          <p className="text-surface-500 mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="mb-4 rounded-lg bg-danger-500/10 px-4 py-3 text-sm text-danger-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-surface-700">
                College Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@college.edu"
                className="w-full rounded-xl border border-surface-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-surface-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-surface-300 bg-white px-4 py-3 pr-11 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-surface-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-surface-300 text-primary-500 focus:ring-primary-500"
                />
                Remember me
              </label>
              <button type="button" className="text-sm font-medium text-primary-500 hover:text-primary-700 transition">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-primary-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition hover:bg-primary-600 hover:shadow-xl hover:shadow-primary-500/30 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {submitting ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-surface-500">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-primary-500 hover:text-primary-700 transition">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
