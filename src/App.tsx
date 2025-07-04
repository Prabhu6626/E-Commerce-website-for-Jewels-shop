import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useStore } from './store/useStore';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CartSidebar from './components/cart/CartSidebar';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import Collections from './pages/Collections';
import About from './pages/About';
import Contact from './pages/Contact';
import Wishlist from './pages/Wishlist';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';

// Admin Components
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { isAuthenticated, user } = useStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Customer Layout Component
const CustomerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Header />
    <main className="min-h-screen">
      {children}
    </main>
    <Footer />
    <CartSidebar />
  </>
);

function App() {
  const { fetchCategories, isAuthenticated, fetchWishlist } = useStore();

  useEffect(() => {
    fetchCategories();
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated]);

  return (
    <Router>
      <div className="App">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#1E293B',
              border: '1px solid #E2E8F0',
            },
            success: {
              iconTheme: {
                primary: '#D4AF37',
                secondary: '#fff',
              },
            },
          }}
        />
        
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={
            <CustomerLayout>
              <Home />
            </CustomerLayout>
          } />
          
          <Route path="/shop" element={
            <CustomerLayout>
              <Shop />
            </CustomerLayout>
          } />

          <Route path="/collections" element={
            <CustomerLayout>
              <Collections />
            </CustomerLayout>
          } />

          <Route path="/about" element={
            <CustomerLayout>
              <About />
            </CustomerLayout>
          } />

          <Route path="/contact" element={
            <CustomerLayout>
              <Contact />
            </CustomerLayout>
          } />

          <Route path="/wishlist" element={
            <CustomerLayout>
              <Wishlist />
            </CustomerLayout>
          } />
          
          <Route path="/product/:id" element={
            <CustomerLayout>
              <ProductDetail />
            </CustomerLayout>
          } />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="customers" element={<div>Customers Management</div>} />
            <Route path="analytics" element={<div>Analytics</div>} />
            <Route path="settings" element={<div>Settings</div>} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;