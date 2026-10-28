import { ArrowLeft, CheckCircle2, Trophy, XCircle } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { auctions, sales } from '../../data/mockData';
import { formatCurrency, formatDateTime } from '../../utils/helpers';

export default function ReviewWinningBidPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const auction = auctions.find((a) => a.id === id);
  const sale = sales.find((s) => s.auctionId === id);

  const [decision, setDecision] = useState<'pending' | 'approved' | 'rejected'>('pending');

  if (!auction || !sale) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <p className="text-surface-400 text-lg">Auction or sale not found</p>
      </div>
    );
  }

  const handleApprove = () => {
    setDecision('approved');
    setTimeout(() => navigate('/seller-dashboard'), 2000);
  };

  const handleReject = () => {
    setDecision('rejected');
    setTimeout(() => navigate('/seller-dashboard'), 2000);
  };

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        {/* Back */}
        <Link
          to="/seller-dashboard"
          className="flex items-center gap-1.5 text-sm font-medium text-surface-600 hover:text-primary-500 transition mb-6 no-underline"
        >
          <ArrowLeft size={16} />
          Back
        </Link>

        <h1 className="text-xl font-bold text-surface-900 mb-6">Review Winning Bid</h1>

        {/* Decision feedback */}
        {decision !== 'pending' && (
          <div
            className={`mb-6 flex items-center gap-3 rounded-2xl p-5 ${
              decision === 'approved'
                ? 'bg-success-500/10 border border-success-500/20'
                : 'bg-danger-500/10 border border-danger-500/20'
            }`}
          >
            {decision === 'approved' ? (
              <CheckCircle2 size={24} className="text-success-600" />
            ) : (
              <XCircle size={24} className="text-danger-600" />
            )}
            <div>
              <p className="text-sm font-semibold text-surface-800">
                {decision === 'approved' ? 'Bid Approved & Reserved' : 'Bid Rejected'}
              </p>
              <p className="text-xs text-surface-500 mt-0.5">Redirecting to dashboard...</p>
            </div>
          </div>
        )}

        {/* Auction card */}
        <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm mb-6">
          <div className="flex items-center gap-4 mb-5">
            <div className="h-16 w-16 overflow-hidden rounded-xl bg-surface-100 flex-shrink-0">
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
            <div>
              <h2 className="text-base font-semibold text-surface-800">{auction.title}</h2>
              <p className="text-xs text-surface-400 mt-0.5">
                Ended: {formatDateTime(auction.closesAt)}
              </p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-surface-500">Highest Bid</span>
              <span className="font-bold text-xl text-primary-600">
                {formatCurrency(sale.winningAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-500">Winner</span>
              <span className="font-medium text-surface-800">
                {sale.winnerName} ({auction.sellerId === 'u1' ? 'PRN1023' : 'PRN1001'})
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {decision === 'pending' && (
          <div className="flex flex-col gap-3">
            <button
              onClick={handleApprove}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-success-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-success-500/25 transition hover:bg-success-600 active:scale-[0.98]"
            >
              <CheckCircle2 size={18} />
              Approve & Reserve
            </button>
            <button
              onClick={handleReject}
              className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-danger-500 py-3.5 text-sm font-semibold text-danger-500 transition hover:bg-danger-50 active:scale-[0.98]"
            >
              <XCircle size={18} />
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
