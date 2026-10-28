import { Eye, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import StatusBadge from '../../components/auction/StatusBadge';
import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { auctions, bids, sales } from '../../data/mockData';
import type { AuctionStatus } from '../../types';
import { formatCurrency, getCountdown } from '../../utils/helpers';

type Tab = 'bids' | 'sales';

export default function MyActivityPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as Tab) || 'bids';
  const [tab, setTab] = useState<Tab>(initialTab);

  // My bids – group by auction, show the user's highest bid for each auction
  const myBids = bids.filter((b) => b.bidderId === user?.id);
  const myBidAuctionIds = [...new Set(myBids.map((b) => b.auctionId))];
  const myBidAuctions = myBidAuctionIds
    .map((aid) => {
      const auction = auctions.find((a) => a.id === aid);
      const userHighest = Math.max(...myBids.filter((b) => b.auctionId === aid).map((b) => b.amount));
      const isHighest = auction?.currentBid === userHighest;
      return { auction, userHighest, isHighest };
    })
    .filter((x) => x.auction);

  // My sales (where I'm the winner)
  const mySales = sales.filter((s) => s.winnerId === user?.id);
  const mySaleAuctions = mySales.map((s) => ({
    sale: s,
    auction: auctions.find((a) => a.id === s.auctionId),
  })).filter((x) => x.auction);

  const getStatusLabel = (isHighest: boolean, status: AuctionStatus) => {
    if (status === 'LIVE' && isHighest) return 'You are the highest bidder';
    if (status === 'LIVE' && !isHighest) return 'You have been outbid';
    if (status === 'RESERVED') return 'Reserved for you';
    if (status === 'COMPLETED') return 'Sale Completed';
    return '';
  };

  const getStatusColor = (isHighest: boolean, status: AuctionStatus) => {
    if (status === 'LIVE' && isHighest) return 'text-success-600';
    if (status === 'LIVE' && !isHighest) return 'text-danger-500';
    if (status === 'RESERVED') return 'text-primary-500';
    if (status === 'COMPLETED') return 'text-success-600';
    return 'text-surface-500';
  };

  return (
    <div className="flex flex-1">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
          <h1 className="text-2xl font-bold text-surface-900 mb-6">My Activity</h1>

          {/* Tabs */}
          <div className="flex border-b border-surface-200 mb-8">
            <button
              onClick={() => setTab('bids')}
              className={`relative px-5 py-3 text-sm font-medium transition ${
                tab === 'bids'
                  ? 'text-primary-600'
                  : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              My Bids ({myBidAuctions.length})
              {tab === 'bids' && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-500 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setTab('sales')}
              className={`relative px-5 py-3 text-sm font-medium transition ${
                tab === 'sales'
                  ? 'text-primary-600'
                  : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              My Sales ({mySaleAuctions.length})
              {tab === 'sales' && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-500 rounded-full" />
              )}
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-4 stagger-children">
            {tab === 'bids' && myBidAuctions.map(({ auction, userHighest, isHighest }) => (
              <div
                key={auction!.id}
                className="flex items-center gap-4 rounded-2xl border border-surface-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                {/* Thumbnail */}
                <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-surface-100">
                  {auction!.images[0] ? (
                    <img
                      src={auction!.images[0].imageUrl}
                      alt={auction!.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-surface-400">
                      N/A
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-surface-800 truncate">
                    {auction!.title}
                  </h3>
                  <p className={`text-xs font-medium mt-0.5 ${getStatusColor(isHighest, auction!.status)}`}>
                    {getStatusLabel(isHighest, auction!.status)}
                  </p>
                  {auction!.status === 'LIVE' && (
                    <p className="text-xs text-surface-400 mt-0.5 flex items-center gap-1">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-success-500" />
                      LIVE • Ends in {getCountdown(auction!.closesAt)}
                    </p>
                  )}
                </div>

                {/* Amount + action */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-base font-bold text-surface-800">
                    {formatCurrency(userHighest)}
                  </span>
                  <Link
                    to={`/auction/${auction!.id}`}
                    className="rounded-lg bg-surface-100 px-3 py-1.5 text-xs font-medium text-surface-600 transition hover:bg-surface-200 no-underline"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}

            {tab === 'sales' && mySaleAuctions.map(({ sale, auction }) => (
              <div
                key={sale.id}
                className="flex items-center gap-4 rounded-2xl border border-surface-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-surface-100">
                  {auction!.images[0] ? (
                    <img
                      src={auction!.images[0].imageUrl}
                      alt={auction!.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-surface-400">
                      N/A
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-surface-800 truncate">
                    {auction!.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {sale.handoverStatus === 'PENDING' && (
                      <span className="text-xs text-accent-600 font-medium">Handover Pending</span>
                    )}
                    {sale.handoverStatus === 'COMPLETED' && (
                      <span className="text-xs text-success-600 font-medium flex items-center gap-1">
                        <ShoppingBag size={12} /> Sale Completed
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-base font-bold text-surface-800">
                    {formatCurrency(sale.winningAmount)}
                  </span>
                  <Link
                    to={`/auction/${auction!.id}`}
                    className="rounded-lg bg-surface-100 px-3 py-1.5 text-xs font-medium text-surface-600 transition hover:bg-surface-200 no-underline"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}

            {tab === 'bids' && myBidAuctions.length === 0 && (
              <p className="text-center py-16 text-surface-400 text-sm">
                You haven't placed any bids yet
              </p>
            )}
            {tab === 'sales' && mySaleAuctions.length === 0 && (
              <p className="text-center py-16 text-surface-400 text-sm">
                No sales yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
