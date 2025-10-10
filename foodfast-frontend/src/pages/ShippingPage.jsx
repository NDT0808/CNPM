// src/pages/ShippingPage.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import axios from 'axios';

const ShippingPage = () => {
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [error, setError] = useState(null);

    const { userInfo } = useContext(AuthContext);
    const { cartItems, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    const placeOrderHandler = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const orderData = {
                userId: userInfo._id,
                orderItems: cartItems.map(item => ({
                    productId: item._id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                })),
                shippingAddress: { address, city },
            };

            const { data: createdOrder } = await axios.post(
                'http://localhost:3000/api/orders',
                orderData
            );

            alert('Đặt hàng thành công!');
            clearCart();
            navigate(`/order/${createdOrder._id}`);;

        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng.');
        }
    };

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