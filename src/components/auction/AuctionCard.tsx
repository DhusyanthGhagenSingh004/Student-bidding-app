import { Clock, Gavel } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Auction } from '../../types';
import { formatCurrency, getCountdown } from '../../utils/helpers';

interface Props {
  auction: Auction;
}

export default function AuctionCard({ auction }: Props) {
  const [countdown, setCountdown] = useState(getCountdown(auction.closesAt));

  useEffect(() => {
    if (auction.status !== 'LIVE') return;
    const id = setInterval(() => setCountdown(getCountdown(auction.closesAt)), 1_000);
    return () => clearInterval(id);
  }, [auction.closesAt, auction.status]);

  const isLive = auction.status === 'LIVE';
  const heroImg = auction.images[0]?.imageUrl;

  return (
    <Link
      to={`/auction/${auction.id}`}
      id={`auction-card-${auction.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-500/10 no-underline"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-100">
        {heroImg ? (
          <img
            src={heroImg}
            alt={auction.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-surface-400">
            No Image
          </div>
        )}

        {/* Status badge */}
        {isLive && (
          <span className="absolute right-3 top-3 badge-live">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            LIVE
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-sm font-semibold text-surface-800 line-clamp-1 group-hover:text-primary-600 transition-colors">
          {auction.title}
        </h3>

        <div className="flex items-baseline justify-between">
          <span className="text-lg font-bold text-primary-600">
            {formatCurrency(auction.currentBid ?? auction.startingPrice)}
          </span>
          <span className="flex items-center gap-1 text-xs text-surface-500">
            <Gavel size={12} />
            {auction.totalBids} bids
          </span>
        </div>

        {/* Countdown */}
        {isLive && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-surface-500">
            <Clock size={12} className="text-danger-500" />
            <span>{countdown}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
