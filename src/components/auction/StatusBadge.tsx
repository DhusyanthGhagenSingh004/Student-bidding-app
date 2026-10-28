import type { AuctionStatus } from '../../types';

const styles: Record<string, string> = {
  LIVE: 'badge-live',
  ENDED: 'badge-ended',
  AWAITING_SELLER_DECISION: 'badge-awaiting',
  RESERVED: 'badge-reserved',
  COMPLETED: 'badge-completed',
  UNSOLD: 'badge-ended',
  REJECTED: 'inline-flex items-center gap-1 rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-semibold text-white',
  CANCELLED: 'badge-ended',
  FAILED_PICKUP: 'inline-flex items-center gap-1 rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-semibold text-white',
  DRAFT: 'inline-flex items-center gap-1 rounded-full bg-surface-300 px-2.5 py-0.5 text-xs font-semibold text-surface-700',
};

const labels: Record<string, string> = {
  LIVE: 'LIVE',
  ENDED: 'ENDED',
  AWAITING_SELLER_DECISION: 'AWAITING DECISION',
  RESERVED: 'RESERVED',
  COMPLETED: 'COMPLETED',
  UNSOLD: 'UNSOLD',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  FAILED_PICKUP: 'FAILED PICKUP',
  DRAFT: 'DRAFT',
};

export default function StatusBadge({ status }: { status: AuctionStatus }) {
  return (
    <span className={styles[status] ?? 'badge-ended'}>
      {status === 'LIVE' && (
        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
      )}
      {labels[status] ?? status}
    </span>
  );
}
