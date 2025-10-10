// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header'; // Import Header
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import RegisterPage from './pages/RegisterPage'; // Import RegisterPage
import LoginPage from './pages/LoginPage';     // Import LoginPage
import CartPage from './pages/CartPage'; // Import CartPage
import ShippingPage from './pages/ShippingPage';
import OrderHistoryPage from './pages/OrderHistoryPage'; // Import trang lịch sử
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import ProductListAdminPage from './pages/admin/ProductListAdminPage';
import ProductEditPage from './pages/admin/ProductEditPage';
import OrderPage from './pages/OrderPage';

function App() {
    return (
        <div className="container">
            <Header />
            <main>
                <Routes>
                    {/* ... các route công khai */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/cart" element={<CartPage />} />

                    {/* --- CÁC ROUTE ĐƯỢC BẢO VỆ --- */}
                    <Route
                        path="/shipping"
                        element={
                            <ProtectedRoute>
                                <ShippingPage />
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
                        path="/admin/productlist"
                        element={
                            <AdminRoute>
                                <ProductListAdminPage />
                            </AdminRoute>
                        }
                    />
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
                    <Route
                        path="/order/:id"
                        element={
                            <ProtectedRoute>
                                <OrderPage />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
                
            </main>
        </div>
    );
}

export default App;