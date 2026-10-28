import { Search } from 'lucide-react';
import { useState } from 'react';
import AuctionCard from '../../components/auction/AuctionCard';
import { auctions } from '../../data/mockData';
import type { Category } from '../../types';

const categories: (Category | 'All')[] = [
  'All',
  'Cycle',
  'Calculator',
  'Books',
  'Electronics',
  'Furniture',
  'Sports',
  'Other',
];

export default function MarketplacePage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');

  const liveAuctions = auctions.filter((a) => a.status === 'LIVE');

  const filtered = liveAuctions.filter((a) => {
    const matchesSearch =
      search === '' ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || a.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8 lg:py-8">
        {/* Search bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400"
            />
            <input
              id="marketplace-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search items (e.g., cycle, calculator, books...)"
              className="w-full rounded-xl border border-surface-300 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <select
            id="marketplace-category-select"
            className="rounded-xl border border-surface-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value as Category | 'All')}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'All Categories' : c}
              </option>
            ))}
          </select>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === c
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/25'
                  : 'bg-white text-surface-600 border border-surface-200 hover:border-primary-300 hover:text-primary-600'
              }`}
            >
              {c === 'All' ? 'All' : c}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
            {filtered.map((a) => (
              <AuctionCard key={a.id} auction={a} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-surface-400">
            <Search size={48} className="mb-4 opacity-40" />
            <p className="text-lg font-medium">No auctions found</p>
            <p className="text-sm">Try a different search term or category</p>
          </div>
        )}
      </div>
    </div>
  );
}
