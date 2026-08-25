import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import ScrollToTop from './components/ScrollToTop';

// Layout Components (used on every route, kept in the main bundle)
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import LoadingSpinner from './components/UI/LoadingSpinner';

// Admin Components
import ProtectedAdminRoute from './components/Auth/ProtectedAdminRoute';
import AdminLayout from './components/Layout/AdminLayout';

// Public Pages — code-split so visiting "/" only downloads Home's chunk
const Home = lazy(() => import('./pages/public/Home'));
const About = lazy(() => import('./pages/public/About'));
const GetFinancialHelp = lazy(() => import('./pages/public/GetFinancialHelp'));
const BecomeTaxProfessional = lazy(() => import('./pages/public/BecomeTaxProfessional'));
const Contact = lazy(() => import('./pages/public/Contact'));
const BuyCourse = lazy(() => import('./pages/public/BuyCourse'));
const BuyService = lazy(() => import('./pages/public/BuyService'));
const PriorityTradelines = lazy(() => import('./pages/public/PriorityTradelines'));
const Chat = lazy(() => import('./pages/public/Chat'));

// Admin Pages — never needed by a public visitor, so keep entirely out of
// the main bundle
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminManagement = lazy(() => import('./pages/admin/AdminManagement'));
const ServicesManagement = lazy(() => import('./pages/admin/ServicesManagement'));
const AdminPackages = lazy(() => import('./pages/admin/AdminPackages'));
const PriorityTradelinesManagement = lazy(() => import('./pages/admin/PriorityTradelinesManagement'));
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile'));

// Error Pages
const NotFound = lazy(() => import('./pages/NotFound'));

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

function App() {
  useEffect(() => {
    // Gracefully handle dynamic chunk errors when deployment updates files
    const handleChunkError = (event) => {
      if (
        event?.message?.includes("Loading chunk") ||
        event?.message?.includes("ChunkLoadError")
      ) {
        window.location.reload();
      }
    };
    window.addEventListener("error", handleChunkError);
    return () => window.removeEventListener("error", handleChunkError);
  }, []);

  return (
    <HelmetProvider>
      <AdminAuthProvider>
        <Router>
          <ScrollToTop>
            <div className="min-h-screen bg-white transition-colors duration-200">
                <Suspense fallback={<PageFallback />}>
                <Routes>
              {/* Public Routes with Navbar and Footer */}
              <Route path="/" element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <Home />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/about" element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <About />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/financial-help" element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <GetFinancialHelp />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/tax-professional" element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <BecomeTaxProfessional />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/contact" element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <Contact />
                  </main>
                  <Footer />
                </>
              } />
              
              {/* Buy Pages */}
              <Route path="/buy-course/:id" element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <BuyCourse />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/buy-service/:id" element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <BuyService />
                  </main>
                  <Footer />
                </>
              } />
              
              {/* Priority Tradelines */}
              <Route path="/priority-tradelines" element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <PriorityTradelines />
                  </main>
                  <Footer />
                </>
              } />

              {/* Standalone Chat Booking Page */}
              <Route path="/chat" element={<Chat />} />

              {/* Redirect /login to /admin/login */}
              <Route path="/login" element={<Navigate to="/admin/login" replace />} />

              {/* Admin Login Route */}
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Protected Admin Routes - exclude login */}
              <Route path="/admin/dashboard" element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </ProtectedAdminRoute>
              } />
              <Route path="/admin/admin-management" element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <AdminManagement />
                  </AdminLayout>
                </ProtectedAdminRoute>
              } />
              <Route path="/admin/packages" element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <AdminPackages />
                  </AdminLayout>
                </ProtectedAdminRoute>
              } />
              <Route path="/admin/services" element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <ServicesManagement />
                  </AdminLayout>
                </ProtectedAdminRoute>
              } />
              <Route path="/admin/priority-tradelines" element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <PriorityTradelinesManagement />
                  </AdminLayout>
                </ProtectedAdminRoute>
              } />
              <Route path="/admin/profile" element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <AdminProfile />
                  </AdminLayout>
                </ProtectedAdminRoute>
              } />
              <Route path="/admin" element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </ProtectedAdminRoute>
              } />
              
              {/* 404 Route */}
              <Route path="*" element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <NotFound />
                  </main>
                  <Footer />
                </>
              } />
            </Routes>
                </Suspense>

            {/* Toast Notifications */}
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
            </div>
          </ScrollToTop>
        </Router>
      </AdminAuthProvider>
    </HelmetProvider>
  );
}

export default App;
