import { Bell, Search, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { notifications } from '../../data/mockData';

export default function Navbar() {
  const location = useLocation();
  const unreadCount = notifications.filter((n) => !n.readAt).length;

  const navLinks = [
    { to: '/marketplace', label: 'Marketplace' },
    { to: '/my-activity', label: 'My Activity' },
    { to: '/notifications', label: 'Notifications' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-surface-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link to="/marketplace" className="flex items-center gap-2.5 no-underline">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500">
            <span className="text-lg font-extrabold text-white">C</span>
          </div>
          <span className="text-lg font-bold text-primary-500 hidden sm:inline">
            Campus Auction
          </span>
        </Link>

        {/* Nav links (desktop) */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors no-underline ${
                location.pathname.startsWith(l.to)
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-3">
          <Link
            to="/notifications"
            className="relative rounded-full p-2 text-surface-500 transition hover:bg-surface-100 hover:text-surface-700"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-danger-500 text-[10px] font-bold text-white animate-pulse-badge">
                {unreadCount}
              </span>
            )}
          </Link>

          <Link
            to="/seller-dashboard"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-white transition hover:bg-primary-600"
          >
            <User size={16} />
          </Link>
        </div>
      </div>
    </header>
  );
}
