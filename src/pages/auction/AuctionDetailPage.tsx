import { ArrowLeft, ChevronLeft, ChevronRight, Clock, Gavel, Tag, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import StatusBadge from '../../components/auction/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { auctions, bids as allBids } from '../../data/mockData';
import { formatCurrency, getCountdown, relativeTime } from '../../utils/helpers';

export default function AuctionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const auction = auctions.find((a) => a.id === id);
  const auctionBids = allBids.filter((b) => b.auctionId === id).sort((a, b) => b.amount - a.amount);

  const [currentImg, setCurrentImg] = useState(0);
  const [bidAmount, setBidAmount] = useState('');
  const [countdown, setCountdown] = useState('');
  const [bidSuccess, setBidSuccess] = useState('');
  const [bidError, setBidError] = useState('');

  useEffect(() => {
    if (!auction || auction.status !== 'LIVE') return;
    const tick = () => setCountdown(getCountdown(auction.closesAt));
    tick();
    const timer = setInterval(tick, 1_000);
    return () => clearInterval(timer);
  }, [auction]);

  if (!auction) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <p className="text-surface-400 text-lg">Auction not found</p>
      </div>
    );
  }

  const currentBid = auction.currentBid ?? auction.startingPrice;
  const minNext = currentBid + auction.minIncrement;
  const isOwner = user?.id === auction.sellerId;
  const isLive = auction.status === 'LIVE';

  const handleBid = (e: React.FormEvent) => {
    e.preventDefault();
    setBidError('');
    setBidSuccess('');
    const amt = Number(bidAmount);
    if (isNaN(amt) || amt < minNext) {
      setBidError(`Minimum bid is ${formatCurrency(minNext)}`);
      return;
    }
    if (isOwner) {
      setBidError('You cannot bid on your own auction');
      return;
    }
    setBidSuccess(`Bid of ${formatCurrency(amt)} placed successfully!`);
    setBidAmount('');
  };

  const prevImg = () => setCurrentImg((i) => (i > 0 ? i - 1 : auction.images.length - 1));
  const nextImg = () => setCurrentImg((i) => (i < auction.images.length - 1 ? i + 1 : 0));

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-5xl px-4 py-6 lg:px-8">
        {/* Back + countdown header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/marketplace"
            className="flex items-center gap-1.5 text-sm font-medium text-surface-600 hover:text-primary-500 transition no-underline"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
          {isLive && (
            <div className="flex items-center gap-2 rounded-full bg-white border border-surface-200 px-4 py-2 shadow-sm">
              <Clock size={14} className="text-danger-500" />
              <span className="text-sm font-semibold text-surface-800">{countdown}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fade-in">
          {/* Left column — images */}
          <div className="lg:col-span-2">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface-100 border border-surface-200">
              {auction.images.length > 0 ? (
                <img
                  src={auction.images[currentImg]?.imageUrl}
                  alt={auction.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-surface-400">
                  No image
                </div>
              )}

              {auction.images.length > 1 && (
                <>
                  <button
                    onClick={prevImg}
                    className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={nextImg}
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {auction.images.length > 1 && (
              <div className="mt-3 flex gap-2">
                {auction.images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setCurrentImg(i)}
                    className={`h-16 w-16 overflow-hidden rounded-lg border-2 transition ${
                      i === currentImg
                        ? 'border-primary-500 shadow-md'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.imageUrl} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right column — info + bid */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* Title & meta */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-surface-900">{auction.title}</h1>
                <StatusBadge status={auction.status} />
              </div>
              <div className="flex items-center gap-4 text-sm text-surface-500">
                <span className="flex items-center gap-1">
                  <User size={14} />
                  By {auction.sellerName}
                </span>
                <span className="flex items-center gap-1">
                  <Tag size={14} />
                  {auction.condition}
                </span>
              </div>
            </div>

            {/* Category + Condition pills */}
            <div className="flex gap-2">
              <span className="rounded-full border border-surface-200 bg-surface-50 px-3 py-1 text-xs font-medium text-surface-600">
                {auction.category}
              </span>
              <span className="rounded-full border border-surface-200 bg-surface-50 px-3 py-1 text-xs font-medium text-surface-600">
                {auction.condition}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-surface-600">{auction.description}</p>

            {/* Bid info card */}
            <div className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm">
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <p className="text-xs text-surface-400 mb-1">Current Bid</p>
                  <p className="text-2xl font-bold text-primary-600">{formatCurrency(currentBid)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-surface-400 mb-1">{auction.totalBids} bids</p>
                  <p className="text-sm text-surface-500">
                    Minimum next bid:{' '}
                    <span className="font-semibold text-surface-700">{formatCurrency(minNext)}</span>
                  </p>
                </div>
              </div>

              {isLive && !isOwner && (
                <form onSubmit={handleBid} className="flex gap-3">
                  <input
                    id="bid-amount-input"
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter bid amount"
                    min={minNext}
                    className="flex-1 rounded-xl border border-surface-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-primary-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition hover:bg-primary-600 active:scale-[0.98]"
                  >
                    Place Bid
                  </button>
                </form>
              )}

              {bidError && (
                <p className="mt-3 text-sm text-danger-500">{bidError}</p>
              )}
              {bidSuccess && (
                <p className="mt-3 text-sm text-success-600">{bidSuccess}</p>
              )}
            </div>

            {/* Bid History */}
            <div>
              <h2 className="flex items-center gap-2 text-base font-semibold text-surface-800 mb-4">
                <Gavel size={16} />
                Bid History ({auctionBids.length})
              </h2>

              <div className="overflow-hidden rounded-xl border border-surface-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-200 bg-surface-50">
                      <th className="px-4 py-3 text-left font-medium text-surface-500">#</th>
                      <th className="px-4 py-3 text-left font-medium text-surface-500">Bidder</th>
                      <th className="px-4 py-3 text-left font-medium text-surface-500">Amount</th>
                      <th className="px-4 py-3 text-left font-medium text-surface-500">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auctionBids.slice(0, 10).map((b, i) => (
                      <tr
                        key={b.id}
                        className={`border-b border-surface-100 transition hover:bg-surface-50 ${
                          i === 0 ? 'bg-primary-50/50' : ''
                        }`}
                      >
                        <td className="px-4 py-3 text-surface-400">{auctionBids.length - i}</td>
                        <td className="px-4 py-3 font-medium text-surface-700">{b.bidderName}</td>
                        <td className={`px-4 py-3 font-semibold ${i === 0 ? 'text-primary-600' : 'text-surface-700'}`}>
                          {formatCurrency(b.amount)}
                        </td>
                        <td className="px-4 py-3 text-surface-400">{relativeTime(b.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
