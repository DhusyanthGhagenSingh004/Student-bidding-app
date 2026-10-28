import { Clock, Edit, Eye, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/auction/StatusBadge';
import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { auctions, sales } from '../../data/mockData';
import { formatCurrency, getCountdown } from '../../utils/helpers';

type Tab = 'listings' | 'pending';

export default function SellerDashboardPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('listings');

  const myListings = auctions.filter((a) => a.sellerId === user?.id);
  const pendingDecisions = myListings.filter(
    (a) => a.status === 'AWAITING_SELLER_DECISION' || a.status === 'ENDED'
  );
  const activeListings = myListings.filter(
    (a) => a.status === 'LIVE' || a.status === 'RESERVED' || a.status === 'COMPLETED'
  );

  const displayList = tab === 'listings' ? activeListings : pendingDecisions;

  const handleApprove = (auctionId: string) => {
    alert(`Approved auction ${auctionId} — in a real app this calls the API`);
  };

  const handleReject = (auctionId: string) => {
    alert(`Rejected auction ${auctionId}`);
  };

  return (
    <div className="flex flex-1">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
          <h1 className="text-2xl font-bold text-surface-900 mb-6">Seller Dashboard</h1>

          {/* Tabs */}
          <div className="flex gap-1 rounded-xl bg-surface-100 p-1 mb-8 w-fit">
            <button
              onClick={() => setTab('listings')}
              className={`rounded-lg px-5 py-2.5 text-sm font-medium transition ${
                tab === 'listings'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              My Listings ({activeListings.length})
            </button>
            <button
              onClick={() => setTab('pending')}
              className={`rounded-lg px-5 py-2.5 text-sm font-medium transition ${
                tab === 'pending'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              Pending Decisions ({pendingDecisions.length})
            </button>
          </div>

          {/* Listing cards */}
          <div className="flex flex-col gap-4 stagger-children">
            {displayList.length === 0 && (
              <p className="text-center py-16 text-surface-400 text-sm">
                No items in this section
              </p>
            )}

            {displayList.map((auction) => {
              const sale = sales.find((s) => s.auctionId === auction.id);
              return (
                <div
                  key={auction.id}
                  className="flex items-center gap-4 rounded-2xl border border-surface-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  {/* Thumbnail */}
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-surface-100">
                    {auction.images[0] ? (
                      <img
                        src={auction.images[0].imageUrl}
                        alt={auction.title}
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
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-surface-800 truncate">
                        {auction.title}
                      </h3>
                      <StatusBadge status={auction.status} />
                    </div>

                    {auction.status === 'LIVE' && (
                      <div className="flex items-center gap-1 text-xs text-surface-500">
                        <Clock size={12} className="text-danger-500" />
                        Ends in {getCountdown(auction.closesAt)}
                      </div>
                    )}

                    {auction.status === 'AWAITING_SELLER_DECISION' && sale && (
                      <p className="text-xs text-surface-500">
                        Highest: <span className="font-semibold text-primary-600">{formatCurrency(sale.winningAmount)}</span>
                      </p>
                    )}

                    {auction.status === 'ENDED' && auction.totalBids === 0 && (
                      <p className="text-xs text-surface-400">Unsold</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {auction.status === 'AWAITING_SELLER_DECISION' && (
                      <>
                        <Link
                          to={`/review/${auction.id}`}
                          className="rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-600 transition hover:bg-primary-100 no-underline"
                        >
                          Review
                        </Link>
                      </>
                    )}
                    {auction.status === 'LIVE' && (
                      <Link
                        to={`/auction/${auction.id}`}
                        className="rounded-lg bg-surface-100 p-2 text-surface-500 transition hover:bg-surface-200 hover:text-surface-700 no-underline"
                      >
                        <Eye size={16} />
                      </Link>
                    )}
                    {auction.status === 'ENDED' && auction.totalBids === 0 && (
                      <button className="rounded-lg bg-surface-100 px-3 py-1.5 text-xs font-medium text-surface-600 transition hover:bg-surface-200 flex items-center gap-1">
                        <RotateCcw size={12} />
                        Relist
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
