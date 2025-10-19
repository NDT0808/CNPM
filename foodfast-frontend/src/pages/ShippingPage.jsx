import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import axios from 'axios';

const ShippingPage = () => {
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [error, setError] = useState(null);

    const { userInfo } = useContext(AuthContext); // Lấy userInfo chứa token
    const { cartItems, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    const placeOrderHandler = async (e) => {
        e.preventDefault();
        setError(null);

        // Kiểm tra xem userInfo có tồn tại không
        if (!userInfo || !userInfo.token) {
            setError('Bạn cần đăng nhập để đặt hàng.');
            return;
        }

        try {
            const orderData = {
                userId: userInfo._id, // Lấy ID từ người dùng đã đăng nhập
                orderItems: cartItems.map(item => ({
                    productId: item._id,
                    // name: item.name, // Backend tự lấy tên từ productId
                    quantity: item.quantity,
                    // price: item.price, // Backend tự lấy giá từ productId
                })),
                shippingAddress: {
                    address,
                    city,
                },
            };

            // --- PHẦN QUAN TRỌNG: Thêm config với token ---
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`, // Gửi token đi
                },
            };

            // Gửi request POST kèm theo config
            const { data: createdOrder } = await axios.post(
                'http://localhost:3000/api/orders', // Gọi qua API Gateway
                orderData,
                config // <-- Thêm config vào đây
            );
            // --- KẾT THÚC PHẦN QUAN TRỌNG ---

            alert('Đặt hàng thành công!');
            clearCart(); // Xóa giỏ hàng
            navigate(`/order/${createdOrder._id}`); // Chuyển đến trang chi tiết đơn hàng

        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng.');
            console.error("Place order error:", err); // Log lỗi chi tiết
        }
    };

    // ... phần JSX của form giữ nguyên ...
    return (
        <div className="flex items-center justify-center min-h-[80vh] bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-900">Thông tin giao hàng</h1>
                <form onSubmit={placeOrderHandler} className="space-y-6">
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            Địa chỉ
                        </label>
                        <input
                            type="text"
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                            Thành phố
                        </label>
                        <input
                            type="text"
                            id="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Xác nhận Đặt hàng
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ShippingPage;