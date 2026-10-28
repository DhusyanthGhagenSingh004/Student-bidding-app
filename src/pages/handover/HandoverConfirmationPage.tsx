import { ArrowLeft, CheckCircle2, Package, Truck } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { auctions, sales } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDateTime } from '../../utils/helpers';

export default function HandoverConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const auction = auctions.find((a) => a.id === id);
  const sale = sales.find((s) => s.auctionId === id);

  const [sellerConfirmed, setSellerConfirmed] = useState(!!sale?.handoverConfirmedBySellerAt);
  const [buyerConfirmed, setBuyerConfirmed] = useState(!!sale?.handoverConfirmedByBuyerAt);
  const [failureReason, setFailureReason] = useState('');
  const [showFailureInput, setShowFailureInput] = useState(false);

  if (!auction || !sale) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <p className="text-surface-400 text-lg">Sale not found</p>
      </div>
    );
  }

  const isSeller = user?.id === auction.sellerId;
  const isBuyer = user?.id === sale.winnerId;
  const bothConfirmed = sellerConfirmed && buyerConfirmed;

  const handleConfirm = () => {
    if (isSeller) setSellerConfirmed(true);
    if (isBuyer) setBuyerConfirmed(true);
  };

  const handleReportFailure = () => {
    if (!failureReason.trim()) return;
    alert(`Reported failed pickup: ${failureReason}`);
  };

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg animate-slide-up">
        <Link
          to="/my-activity"
          className="flex items-center gap-1.5 text-sm font-medium text-surface-600 hover:text-primary-500 transition mb-6 no-underline"
        >
          <ArrowLeft size={16} />
          Back to My Activity
        </Link>

        <h1 className="text-xl font-bold text-surface-900 mb-2">Handover Confirmation</h1>
        <p className="text-sm text-surface-500 mb-8">
          Both seller and buyer must confirm the handover to complete the sale.
        </p>

        {/* Item info */}
        <div className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm mb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-xl bg-surface-100 flex-shrink-0">
              {auction.images[0] ? (
                <img src={auction.images[0].imageUrl} alt={auction.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-surface-400">N/A</div>
              )}
            </div>
            <div>
              <h2 className="text-base font-semibold text-surface-800">{auction.title}</h2>
              <p className="text-sm text-primary-600 font-bold mt-0.5">{formatCurrency(sale.winningAmount)}</p>
            </div>
          </div>
        </div>

        {/* Confirmation status */}
        <div className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm mb-6">
          <h3 className="text-sm font-semibold text-surface-700 mb-4">Confirmation Status</h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${sellerConfirmed ? 'bg-success-500' : 'bg-surface-200'}`}>
                  {sellerConfirmed ? (
                    <CheckCircle2 size={16} className="text-white" />
                  ) : (
                    <Package size={16} className="text-surface-400" />
                  )}
                </div>
                <span className="text-sm text-surface-700">Seller Confirmation</span>
              </div>
              <span className={`text-xs font-medium ${sellerConfirmed ? 'text-success-600' : 'text-surface-400'}`}>
                {sellerConfirmed ? 'Confirmed' : 'Pending'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${buyerConfirmed ? 'bg-success-500' : 'bg-surface-200'}`}>
                  {buyerConfirmed ? (
                    <CheckCircle2 size={16} className="text-white" />
                  ) : (
                    <Truck size={16} className="text-surface-400" />
                  )}
                </div>
                <span className="text-sm text-surface-700">Buyer Confirmation</span>
              </div>
              <span className={`text-xs font-medium ${buyerConfirmed ? 'text-success-600' : 'text-surface-400'}`}>
                {buyerConfirmed ? 'Confirmed' : 'Pending'}
              </span>
            </div>
          </div>

          {bothConfirmed && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-success-500/10 p-3">
              <CheckCircle2 size={18} className="text-success-600" />
              <p className="text-sm font-medium text-success-600">
                Sale completed! Both parties have confirmed the handover.
              </p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        {!bothConfirmed && (
          <div className="flex flex-col gap-3">
            {((isSeller && !sellerConfirmed) || (isBuyer && !buyerConfirmed)) && (
              <button
                onClick={handleConfirm}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-success-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-success-500/25 transition hover:bg-success-600 active:scale-[0.98]"
              >
                <CheckCircle2 size={18} />
                Confirm Handover
              </button>
            )}

            {!showFailureInput ? (
              <button
                onClick={() => setShowFailureInput(true)}
                className="w-full rounded-xl border border-surface-300 py-3 text-sm font-medium text-surface-600 transition hover:bg-surface-50"
              >
                Report Failed Pickup
              </button>
            ) : (
              <div className="rounded-xl border border-surface-200 bg-surface-50 p-4">
                <textarea
                  value={failureReason}
                  onChange={(e) => setFailureReason(e.target.value)}
                  placeholder="Describe the issue..."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm outline-none mb-3 focus:border-primary-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleReportFailure}
                    className="rounded-lg bg-danger-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-danger-600"
                  >
                    Submit Report
                  </button>
                  <button
                    onClick={() => setShowFailureInput(false)}
                    className="rounded-lg px-4 py-2 text-xs font-medium text-surface-500 transition hover:bg-surface-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
