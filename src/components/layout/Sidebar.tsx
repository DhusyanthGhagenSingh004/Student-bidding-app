import {
  Bell,
  ClipboardList,
  Gavel,
  LayoutDashboard,
  PlusCircle,
  ShoppingBag,
  Store,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/marketplace', label: 'Marketplace', icon: Store },
  { to: '/create-listing', label: 'Create Listing', icon: PlusCircle },
  { to: '/seller-dashboard', label: 'My Listings', icon: LayoutDashboard },
  { to: '/my-activity?tab=bids', label: 'My Bids', icon: Gavel },
  { to: '/my-activity?tab=sales', label: 'My Sales', icon: ShoppingBag },
  { to: '/notifications', label: 'Notifications', icon: Bell },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex w-56 flex-col border-r border-surface-200 bg-white py-6 px-3">
      <div className="flex items-center gap-2.5 px-3 mb-8">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500">
          <ClipboardList size={18} className="text-white" />
        </div>
        <span className="text-base font-bold text-primary-500">Campus Auction</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {links.map((l) => {
          const isActive =
            location.pathname === l.to ||
            (l.to.includes('?')
              ? location.pathname + location.search === l.to
              : location.pathname.startsWith(l.to));
          const Icon = l.icon;
          return (
            <Link
              key={l.to}
              to={l.to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all no-underline ${
                isActive
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/25'
                  : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
              }`}
            >
              <Icon size={18} />
              {l.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
