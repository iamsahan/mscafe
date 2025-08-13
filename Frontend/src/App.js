import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { AdminAuthProvider } from './contexts/AdminAuthContext';

// Layout Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import GetFinancialHelp from './pages/public/GetFinancialHelp';
import BecomeTaxProfessional from './pages/public/BecomeTaxProfessional';
import Contact from './pages/public/Contact';
import BuyCourse from './pages/public/BuyCourse';
import BuyService from './pages/public/BuyService';
import PriorityTradelines from './pages/public/PriorityTradelines';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminManagement from './pages/admin/AdminManagement';
import ServicesManagement from './pages/admin/ServicesManagement';
import AdminPackages from './pages/admin/AdminPackages';
import PriorityTradelinesManagement from './pages/admin/PriorityTradelinesManagement';
import AdminProfile from './pages/admin/AdminProfile';

// Admin Components
import ProtectedAdminRoute from './components/Auth/ProtectedAdminRoute';
import AdminLayout from './components/Layout/AdminLayout';

// Error Pages
import NotFound from './pages/NotFound';

function App() {
  return (
    <AdminAuthProvider>
      <Router>
        <div className="min-h-screen bg-white transition-colors duration-200">
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
        </Router>
      </AdminAuthProvider>
  );
}

export default App;


