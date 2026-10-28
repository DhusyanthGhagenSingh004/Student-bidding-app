import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';
import MyActivityPage from './pages/activity/MyActivityPage';
import AuctionDetailPage from './pages/auction/AuctionDetailPage';
import SellerDashboardPage from './pages/dashboard/SellerDashboardPage';
import HandoverConfirmationPage from './pages/handover/HandoverConfirmationPage';
import ReviewWinningBidPage from './pages/handover/ReviewWinningBidPage';
import CreateListingPage from './pages/listing/CreateListingPage';
import LoginPage from './pages/LoginPage';
import MarketplacePage from './pages/marketplace/MarketplacePage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import RegisterPage from './pages/RegisterPage';

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Pages that don't show the navbar
  const noNavPages = ['/login', '/register'];
  const showNav = isAuthenticated && !noNavPages.includes(location.pathname);

  return (
    <div className="flex min-h-screen flex-col bg-surface-50">
      {showNav && <Navbar />}

      <div className="flex flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/auction/:id" element={<AuctionDetailPage />} />
          <Route path="/create-listing" element={<CreateListingPage />} />
          <Route path="/seller-dashboard" element={<SellerDashboardPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/my-activity" element={<MyActivityPage />} />
          <Route path="/review/:id" element={<ReviewWinningBidPage />} />
          <Route path="/handover/:id" element={<HandoverConfirmationPage />} />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/marketplace" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
