import type { Auction, Bid, Notification, Sale, User } from '../types';

// ── Current user (logged-in demo account) ──
export const currentUser: User = {
  id: 'u1',
  name: 'Arun S.',
  email: 'arun.s@campus.edu',
  campusId: 'PRN1001',
};

export const users: User[] = [
  currentUser,
  { id: 'u2', name: 'Rahul K.', email: 'rahul.k@campus.edu', campusId: 'PRN1010' },
  { id: 'u3', name: 'Priya M.', email: 'priya.m@campus.edu', campusId: 'PRN1023' },
  { id: 'u4', name: 'Karthik R.', email: 'karthik.r@campus.edu', campusId: 'PRN1045' },
  { id: 'u5', name: 'Sneha D.', email: 'sneha.d@campus.edu', campusId: 'PRN1052' },
];

// helper – date strings
const hoursFromNow = (h: number) =>
  new Date(Date.now() + h * 3600_000).toISOString();

// ── Auctions ──
export const auctions: Auction[] = [
  {
    id: 'a1',
    sellerId: 'u1',
    sellerName: 'Arun S.',
    title: 'Cycle (Single Speed)',
    category: 'Cycle',
    description:
      'Well-maintained campus cycle, smooth ride, perfect for daily use. No rust, recently oiled chain.',
    condition: 'Good',
    startingPrice: 800,
    minIncrement: 20,
    closesAt: hoursFromNow(2.24),
    status: 'LIVE',
    images: [
      { id: 'img1', auctionId: 'a1', imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&q=80' },
      { id: 'img1b', auctionId: 'a1', imageUrl: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600&q=80' },
      { id: 'img1c', auctionId: 'a1', imageUrl: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&q=80' },
    ],
    currentBid: 1200,
    totalBids: 12,
  },
  {
    id: 'a2',
    sellerId: 'u3',
    sellerName: 'Priya M.',
    title: 'Scientific Calculator',
    category: 'Calculator',
    description:
      'Casio fx-991ES, fully working, with cover. Perfect for engineering exams.',
    condition: 'Good',
    startingPrice: 200,
    minIncrement: 10,
    closesAt: hoursFromNow(4.33),
    status: 'LIVE',
    images: [
      { id: 'img2', auctionId: 'a2', imageUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80' },
    ],
    currentBid: 350,
    totalBids: 8,
  },
  {
    id: 'a3',
    sellerId: 'u2',
    sellerName: 'Rahul K.',
    title: 'Engineering Books Set',
    category: 'Books',
    description:
      'Complete set of 3rd year Computer Science textbooks. Includes Data Structures, OS, and DBMS.',
    condition: 'Fair',
    startingPrice: 400,
    minIncrement: 25,
    closesAt: hoursFromNow(6.08),
    status: 'LIVE',
    images: [
      { id: 'img3', auctionId: 'a3', imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&q=80' },
    ],
    currentBid: 600,
    totalBids: 5,
  },
  {
    id: 'a4',
    sellerId: 'u4',
    sellerName: 'Karthik R.',
    title: 'Wireless Bluetooth Earbuds',
    category: 'Electronics',
    description:
      'JBL Tune 230NC, noise cancelling, 40h battery life. Barely used for 2 months.',
    condition: 'Like New',
    startingPrice: 1500,
    minIncrement: 50,
    closesAt: hoursFromNow(12),
    status: 'LIVE',
    images: [
      { id: 'img4', auctionId: 'a4', imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600&q=80' },
    ],
    currentBid: 1800,
    totalBids: 6,
  },
  {
    id: 'a5',
    sellerId: 'u5',
    sellerName: 'Sneha D.',
    title: 'Study Table with Chair',
    category: 'Furniture',
    description:
      'Compact wooden study table with cushioned chair. Perfect for hostel rooms.',
    condition: 'Good',
    startingPrice: 1000,
    minIncrement: 50,
    closesAt: hoursFromNow(24),
    status: 'LIVE',
    images: [
      { id: 'img5', auctionId: 'a5', imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80' },
    ],
    currentBid: 1200,
    totalBids: 3,
  },
  {
    id: 'a6',
    sellerId: 'u1',
    sellerName: 'Arun S.',
    title: 'Badminton Racket (Yonex)',
    category: 'Sports',
    description: 'Yonex Nanoray Light, good string tension. Comes with cover.',
    condition: 'Good',
    startingPrice: 500,
    minIncrement: 25,
    closesAt: hoursFromNow(8),
    status: 'LIVE',
    images: [
      { id: 'img6', auctionId: 'a6', imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80' },
    ],
    currentBid: 650,
    totalBids: 4,
  },
  // Ended / awaiting decision auctions for seller dashboard
  {
    id: 'a7',
    sellerId: 'u1',
    sellerName: 'Arun S.',
    title: 'Data Structures Books',
    category: 'Books',
    description: 'Cormen CLRS + Narasimha Karumanchi. Both in decent condition.',
    condition: 'Fair',
    startingPrice: 200,
    minIncrement: 10,
    closesAt: new Date(Date.now() - 3600_000).toISOString(),
    status: 'AWAITING_SELLER_DECISION',
    images: [
      { id: 'img7', auctionId: 'a7', imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&q=80' },
    ],
    currentBid: 380,
    totalBids: 9,
  },
  {
    id: 'a8',
    sellerId: 'u1',
    sellerName: 'Arun S.',
    title: 'Engineering Books Set',
    category: 'Books',
    description: 'Full set for 2nd year ME students.',
    condition: 'Fair',
    startingPrice: 300,
    minIncrement: 15,
    closesAt: new Date(Date.now() - 7200_000).toISOString(),
    status: 'ENDED',
    images: [
      { id: 'img8', auctionId: 'a8', imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80' },
    ],
    currentBid: undefined,
    totalBids: 0,
  },
];

// ── Bids (for auction a1 — Cycle) ──
export const bids: Bid[] = [
  { id: 'b1', auctionId: 'a1', bidderId: 'u2', bidderName: 'rahul.k', amount: 1200, createdAt: new Date(Date.now() - 300_000).toISOString() },
  { id: 'b2', auctionId: 'a1', bidderId: 'u3', bidderName: 'priya.m', amount: 1180, createdAt: new Date(Date.now() - 600_000).toISOString() },
  { id: 'b3', auctionId: 'a1', bidderId: 'u4', bidderName: 'karthik.r', amount: 1160, createdAt: new Date(Date.now() - 900_000).toISOString() },
  { id: 'b4', auctionId: 'a1', bidderId: 'u2', bidderName: 'rahul.k', amount: 1140, createdAt: new Date(Date.now() - 1200_000).toISOString() },
  { id: 'b5', auctionId: 'a1', bidderId: 'u5', bidderName: 'sneha.d', amount: 1100, createdAt: new Date(Date.now() - 1500_000).toISOString() },
  { id: 'b6', auctionId: 'a1', bidderId: 'u3', bidderName: 'priya.m', amount: 1060, createdAt: new Date(Date.now() - 1800_000).toISOString() },
  { id: 'b7', auctionId: 'a1', bidderId: 'u4', bidderName: 'karthik.r', amount: 1020, createdAt: new Date(Date.now() - 2100_000).toISOString() },
  { id: 'b8', auctionId: 'a1', bidderId: 'u2', bidderName: 'rahul.k', amount: 980, createdAt: new Date(Date.now() - 2400_000).toISOString() },
  { id: 'b9', auctionId: 'a1', bidderId: 'u5', bidderName: 'sneha.d', amount: 940, createdAt: new Date(Date.now() - 2700_000).toISOString() },
  { id: 'b10', auctionId: 'a1', bidderId: 'u3', bidderName: 'priya.m', amount: 900, createdAt: new Date(Date.now() - 3000_000).toISOString() },
  { id: 'b11', auctionId: 'a1', bidderId: 'u4', bidderName: 'karthik.r', amount: 860, createdAt: new Date(Date.now() - 3300_000).toISOString() },
  { id: 'b12', auctionId: 'a1', bidderId: 'u2', bidderName: 'rahul.k', amount: 820, createdAt: new Date(Date.now() - 3600_000).toISOString() },

  // bids for a2 – Scientific Calculator
  { id: 'b13', auctionId: 'a2', bidderId: 'u1', bidderName: 'arun.s', amount: 350, createdAt: new Date(Date.now() - 500_000).toISOString() },
  { id: 'b14', auctionId: 'a2', bidderId: 'u4', bidderName: 'karthik.r', amount: 320, createdAt: new Date(Date.now() - 1000_000).toISOString() },
  { id: 'b15', auctionId: 'a2', bidderId: 'u1', bidderName: 'arun.s', amount: 290, createdAt: new Date(Date.now() - 1500_000).toISOString() },

  // bids for a3 – Engineering Books
  { id: 'b16', auctionId: 'a3', bidderId: 'u1', bidderName: 'arun.s', amount: 600, createdAt: new Date(Date.now() - 2000_000).toISOString() },

  // bids for a7 (awaiting decision)
  { id: 'b17', auctionId: 'a7', bidderId: 'u3', bidderName: 'priya.m', amount: 380, createdAt: new Date(Date.now() - 4000_000).toISOString() },
  { id: 'b18', auctionId: 'a7', bidderId: 'u2', bidderName: 'rahul.k', amount: 350, createdAt: new Date(Date.now() - 5000_000).toISOString() },
];

// ── Sales ──
export const sales: Sale[] = [
  {
    id: 's1',
    auctionId: 'a2',
    winnerId: 'u1',
    winnerName: 'Arun S.',
    winningAmount: 380,
    sellerDecision: 'APPROVED',
    handoverStatus: 'PENDING',
    outcome: 'RESERVED',
  },
  {
    id: 's2',
    auctionId: 'a7',
    winnerId: 'u3',
    winnerName: 'Priya M.',
    winningAmount: 380,
    sellerDecision: 'PENDING',
    handoverStatus: 'PENDING',
  },
  {
    id: 's3',
    auctionId: 'a3',
    winnerId: 'u1',
    winnerName: 'Arun S.',
    winningAmount: 600,
    sellerDecision: 'APPROVED',
    handoverStatus: 'COMPLETED',
    outcome: 'COMPLETED',
    handoverConfirmedBySellerAt: new Date(Date.now() - 86400_000).toISOString(),
    handoverConfirmedByBuyerAt: new Date(Date.now() - 82800_000).toISOString(),
  },
];

// ── Notifications ──
export const notifications: Notification[] = [
  {
    id: 'n1',
    userId: 'u1',
    auctionId: 'a1',
    type: 'OUTBID',
    title: "You've been outbid!",
    message: 'New highest bid ₹1,200 on Cycle (Single Speed).',
    createdAt: new Date(Date.now() - 300_000).toISOString(),
  },
  {
    id: 'n2',
    userId: 'u1',
    auctionId: 'a2',
    type: 'AUCTION_WON',
    title: 'You won the auction!',
    message: 'You are the highest bidder for Scientific Calculator.',
    createdAt: new Date(Date.now() - 86400_000).toISOString(),
  },
  {
    id: 'n3',
    userId: 'u1',
    auctionId: 'a2',
    type: 'HANDOVER_REMINDER',
    title: 'Handover reminder',
    message: 'Please confirm the handover for Scientific Calculator.',
    createdAt: new Date(Date.now() - 86400_000).toISOString(),
  },
  {
    id: 'n4',
    userId: 'u1',
    auctionId: 'a3',
    type: 'SALE_COMPLETED',
    title: 'Sale completed',
    message: 'The sale for Engineering Books Set is completed.',
    createdAt: new Date(Date.now() - 172800_000).toISOString(),
    readAt: new Date(Date.now() - 86400_000).toISOString(),
  },
];
