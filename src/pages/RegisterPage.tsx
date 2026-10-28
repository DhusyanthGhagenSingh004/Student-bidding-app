import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [campusId, setCampusId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !campusId || !password || !confirmPw) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPw) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setSubmitting(true);
    const result = await register(name, email, campusId, password);
    setSubmitting(false);
    if (result.ok) navigate('/marketplace');
    else setError(result.error ?? 'Registration failed');
  };

  return (
    <div className="flex min-h-screen">
      {/* Left – branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 px-12 text-white relative overflow-hidden">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white/5" />
        <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-white/5" />
        <div className="absolute top-1/3 right-1/4 h-24 w-24 rounded-full bg-white/10" />

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
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500">
              <span className="text-2xl font-extrabold text-white">C</span>
            </div>
            <span className="text-xl font-bold text-primary-500">Campus Auction</span>
          </div>

          <h2 className="text-2xl font-bold text-surface-900 mb-1">Create Account</h2>
          <p className="text-surface-500 mb-8">Join the campus marketplace today</p>

          {error && (
            <div className="mb-4 rounded-lg bg-danger-500/10 px-4 py-3 text-sm text-danger-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="reg-name" className="mb-1.5 block text-sm font-medium text-surface-700">
                Full Name
              </label>
              <input
                id="reg-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full rounded-xl border border-surface-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            <div>
              <label htmlFor="reg-email" className="mb-1.5 block text-sm font-medium text-surface-700">
                College Email
              </label>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@college.edu"
                className="w-full rounded-xl border border-surface-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            <div>
              <label htmlFor="reg-campus" className="mb-1.5 block text-sm font-medium text-surface-700">
                Campus ID
              </label>
              <input
                id="reg-campus"
                type="text"
                value={campusId}
                onChange={(e) => setCampusId(e.target.value)}
                placeholder="PRN1001"
                className="w-full rounded-xl border border-surface-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            <div>
              <label htmlFor="reg-password" className="mb-1.5 block text-sm font-medium text-surface-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
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

            <div>
              <label htmlFor="reg-confirm" className="mb-1.5 block text-sm font-medium text-surface-700">
                Confirm Password
              </label>
              <input
                id="reg-confirm"
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="Re-enter password"
                className="w-full rounded-xl border border-surface-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full rounded-xl bg-primary-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition hover:bg-primary-600 hover:shadow-xl hover:shadow-primary-500/30 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {submitting ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-surface-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-500 hover:text-primary-700 transition">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
