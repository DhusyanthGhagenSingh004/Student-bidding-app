// ── Auction statuses ──
export type AuctionStatus =
  | 'DRAFT'
  | 'LIVE'
  | 'ENDED'
  | 'AWAITING_SELLER_DECISION'
  | 'RESERVED'
  | 'COMPLETED'
  | 'UNSOLD'
  | 'REJECTED'
  | 'CANCELLED'
  | 'FAILED_PICKUP';

export type ItemCondition = 'Like New' | 'Good' | 'Fair' | 'Poor';

export type Category =
  | 'Cycle'
  | 'Calculator'
  | 'Books'
  | 'Electronics'
  | 'Furniture'
  | 'Sports'
  | 'Other';

export type SellerDecision = 'APPROVED' | 'REJECTED' | 'PENDING';

export type HandoverStatus =
  | 'PENDING'
  | 'SELLER_CONFIRMED'
  | 'BUYER_CONFIRMED'
  | 'COMPLETED'
  | 'FAILED';

export type NotificationType =
  | 'OUTBID'
  | 'AUCTION_WON'
  | 'AUCTION_ENDED'
  | 'SELLER_DECISION'
  | 'HANDOVER_REMINDER'
  | 'SALE_COMPLETED';

// ── Entities ──
export interface User {
  id: string;
  name: string;
  email: string;
  campusId: string;
  avatarUrl?: string;
}

export interface AuctionImage {
  id: string;
  auctionId: string;
  imageUrl: string;
}

export interface Auction {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  category: Category;
  description: string;
  condition: ItemCondition;
  startingPrice: number;
  minIncrement: number;
  closesAt: string; // ISO date
  status: AuctionStatus;
  images: AuctionImage[];
  currentBid?: number;
  totalBids: number;
  cancelReason?: string;
  cancelledAt?: string;
}

export interface Bid {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  createdAt: string; // ISO date
}

export interface Sale {
  id: string;
  auctionId: string;
  winnerId: string;
  winnerName: string;
  winningAmount: number;
  sellerDecision: SellerDecision;
  handoverStatus: HandoverStatus;
  outcome?: string;
  handoverConfirmedBySellerAt?: string;
  handoverConfirmedByBuyerAt?: string;
  failureReason?: string;
}

export interface Notification {
  id: string;
  userId: string;
  auctionId: string;
  type: NotificationType;
  message: string;
  title: string;
  readAt?: string;
  createdAt: string;
}

// ── Auth context ──
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
