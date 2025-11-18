import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import axios from 'axios';

const ShippingPage = () => {
    const { userInfo } = useContext(AuthContext);
    const { cartItems, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    // Lấy địa chỉ đã lưu lần trước (nếu có)
    const savedAddress = JSON.parse(localStorage.getItem('shippingAddress') || '{}');

    const [address, setAddress] = useState(savedAddress.address || '');
    const [city, setCity] = useState(savedAddress.city || '');
    const [phone, setPhone] = useState(userInfo?.phone || savedAddress.phone || '');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Tính tổng tiền (để hiển thị hoặc kiểm tra)
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const placeOrderHandler = async (e) => {
        e.preventDefault();
        setError(null);

        if (!userInfo) {
            navigate('/login');
            return;
        }

        if (cartItems.length === 0) {
            setError('Giỏ hàng trống');
            return;
        }

        // 1. Lấy chi nhánh đang chọn (BẮT BUỘC)
        const savedBranch = localStorage.getItem('selectedBranch');
        if (!savedBranch) {
            alert('Vui lòng chọn chi nhánh trước khi đặt hàng!');
            return;
        }
        const branchId = JSON.parse(savedBranch)._id;

        try {
            setLoading(true);

            // 2. Lưu địa chỉ vào LocalStorage cho lần sau
            const shippingInfo = { address, city, phone };
            localStorage.setItem('shippingAddress', JSON.stringify(shippingInfo));

            // 3. Chuẩn bị dữ liệu gửi đi
            const orderData = {
                userId: userInfo._id,
                branchId: branchId, // Gửi branchId để backend phân loại đơn
                paymentMethod: 'COD', // Mặc định là COD (sẽ chọn lại thanh toán online ở bước sau nếu muốn)
                orderItems: cartItems.map(item => ({
                    productId: item._id,
                    quantity: item.quantity,
                    note: item.note || '',
                    selectedOptions: item.selectedOptions || []
                })),
                shippingAddress: shippingInfo,
                totalPrice: totalPrice
            };

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

            const { data: createdOrder } = await axios.post(
                `${API_URL}/api/orders`,
                orderData,
                config
            );

            // Thành công -> Xóa giỏ hàng và chuyển hướng
            clearCart();
            navigate(`/order/${createdOrder._id}`);

        } catch (err) {
            console.error("Place order error:", err);
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi tạo đơn hàng.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen flex justify-center">
            <div className="w-full max-w-lg">
                {/* Breadcrumb / Steps */}
                <div className="flex justify-center items-center mb-8 text-sm font-medium text-gray-500">
                    <span className="text-indigo-600">Giỏ hàng</span>
                    <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    <span className="text-indigo-800 font-bold border-b-2 border-indigo-600 pb-1">Giao hàng</span>
                    <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    <span>Thanh toán</span>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Thông Tin Giao Hàng</h1>

                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={placeOrderHandler} className="space-y-5">

                        {/* Số điện thoại */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại nhận hàng</label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                placeholder="VD: 0901234567"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        {/* Địa chỉ */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Địa chỉ chi tiết</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                                placeholder="VD: 123 Đường Nguyễn Huệ, Phường Bến Nghé"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        {/* Thành phố */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Quận / Thành phố</label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                                placeholder="VD: Quận 1, TP.HCM"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-4 font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all shadow-md hover:shadow-lg flex justify-center items-center"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                        </svg>
                                        Đang xử lý...
                                    </>
                                ) : (
                                    'Tiếp tục đến Thanh toán'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ShippingPage;