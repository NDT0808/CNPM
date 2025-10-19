import React from 'react';
import { Routes, Route } from 'react-router-dom';

// --- Page Imports ---
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import CartPage from './pages/CartPage';
import ShippingPage from './pages/ShippingPage';
import OrderPage from './pages/OrderPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderTrackingPage from './pages/OrderTrackingPage'; // Tracking page

// --- Admin Page Imports ---
import ProductListAdminPage from './pages/admin/ProductListAdminPage';
import ProductEditPage from './pages/admin/ProductEditPage';

// --- Component Imports ---
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute only ONCE
import AdminRoute from './components/AdminRoute';

function App() {
    return (
        <div className="container">
            <Header />
            <main className="py-3"> {/* Added some padding */}
                <Routes>
                    {/* --- Public Routes --- */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/cart" element={<CartPage />} />

                    {/* --- Protected User Routes --- */}
                    <Route
                        path="/shipping"
                        element={
                            <ProtectedRoute>
                                <ShippingPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/order/:id"
                        element={
                            <ProtectedRoute>
                                <OrderPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/myorders"
                        element={
                            <ProtectedRoute>
                                <OrderHistoryPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/track/:id"
                        element={
                            <ProtectedRoute>
                                <OrderTrackingPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* --- Protected Admin Routes --- */}
                    <Route
                        path="/admin/productlist"
                        element={
                            <AdminRoute>
                                <ProductListAdminPage />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/product/:id/edit"
                        element={
                            <AdminRoute>
                                <ProductEditPage />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/product/create"
                        element={
                            <AdminRoute>
                                <ProductEditPage />
                            </AdminRoute>
                        }
                    />
                </Routes>
            </main>
            {/* Maybe add a Footer component later */}
        </div>
    );
}

export default App;