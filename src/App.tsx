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
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show a subtle loading state while restoring session
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50">
        <div className="flex flex-col items-center gap-3 animate-fade-in">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500">
            <span className="text-xl font-extrabold text-white">C</span>
          </div>
          <div className="h-1 w-24 overflow-hidden rounded-full bg-surface-200">
            <div className="h-full w-1/2 rounded-full bg-primary-500 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Pages that don't show the navbar
  const noNavPages = ['/login', '/register'];
  const showNav = isAuthenticated && !noNavPages.includes(location.pathname);

  return (
    <div className="flex min-h-screen flex-col bg-surface-50">
      {showNav && <Navbar />}

      <div className="flex flex-1">
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/marketplace" replace /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/marketplace" replace /> : <RegisterPage />}
          />

          {/* Protected routes — redirect to login if not authenticated */}
          <Route path="/marketplace" element={isAuthenticated ? <MarketplacePage /> : <Navigate to="/login" replace />} />
          <Route path="/auction/:id" element={isAuthenticated ? <AuctionDetailPage /> : <Navigate to="/login" replace />} />
          <Route path="/create-listing" element={isAuthenticated ? <CreateListingPage /> : <Navigate to="/login" replace />} />
          <Route path="/seller-dashboard" element={isAuthenticated ? <SellerDashboardPage /> : <Navigate to="/login" replace />} />
          <Route path="/notifications" element={isAuthenticated ? <NotificationsPage /> : <Navigate to="/login" replace />} />
          <Route path="/my-activity" element={isAuthenticated ? <MyActivityPage /> : <Navigate to="/login" replace />} />
          <Route path="/review/:id" element={isAuthenticated ? <ReviewWinningBidPage /> : <Navigate to="/login" replace />} />
          <Route path="/handover/:id" element={isAuthenticated ? <HandoverConfirmationPage /> : <Navigate to="/login" replace />} />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to={isAuthenticated ? '/marketplace' : '/login'} replace />} />
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
