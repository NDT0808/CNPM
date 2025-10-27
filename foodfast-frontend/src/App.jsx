import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext.jsx'; // Đảm bảo import đúng

// --- Page Imports ---
import HomePage from './pages/HomePage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import CartPage from './pages/CartPage.jsx';
import ShippingPage from './pages/ShippingPage.jsx';
import OrderPage from './pages/OrderPage.jsx';
import OrderHistoryPage from './pages/OrderHistoryPage.jsx';
import OrderTrackingPage from './pages/OrderTrackingPage.jsx';

// --- Admin Page Imports ---
import ProductListAdminPage from './pages/admin/ProductListAdminPage.jsx';
import ProductEditPage from './pages/admin/ProductEditPage.jsx';
import OrderListAdminPage from './pages/admin/OrderListAdminPage.jsx';

// --- Component Imports ---
import Header from './components/Header.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';

function App() {
    const { userInfo } = useContext(AuthContext); // Lấy thông tin user

    return (
        <div>
            <Header />
            <main className="py-3">
                <Routes>
                    {/* --- Home Route --- */}
                    {/* Logic để ẩn trang chủ cho admin */}
                    <Route
                        path="/"
                        element={
                            // Nếu đã đăng nhập VÀ là admin, chuyển hướng đến trang quản lý sản phẩm
                            userInfo && userInfo.isAdmin ? (
                                <Navigate to="/admin/productlist" replace />
                            ) : (
                                // Nếu không phải admin hoặc chưa đăng nhập, hiển thị trang chủ
                                <HomePage />
                            )
                        }
                    />

                    {/* --- Các Route còn lại giữ nguyên --- */}
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/shipping" element={<ProtectedRoute><ShippingPage /></ProtectedRoute>} />
                    <Route path="/order/:id" element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />
                    <Route path="/myorders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
                    <Route path="/track/:id" element={<ProtectedRoute><OrderTrackingPage /></ProtectedRoute>} />
                    <Route path="/admin/productlist" element={<AdminRoute><ProductListAdminPage /></AdminRoute>} />
                    <Route path="/admin/orderlist" element={<AdminRoute><OrderListAdminPage /></AdminRoute>} />
                    <Route path="/admin/product/:id/edit" element={<AdminRoute><ProductEditPage /></AdminRoute>} />
                    <Route path="/admin/product/create" element={<AdminRoute><ProductEditPage /></AdminRoute>} />
                </Routes>
            </main>
        </div>
    );
}

export default App;