// src/pages/CartPage.jsx
import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const CartPage = () => {
    const { cartItems, removeFromCart, addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

    const checkoutHandler = () => {
        navigate('/login?redirect=/shipping');
    };

    return (
        <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-[80vh]">
            <h1 className="text-3xl font-bold mb-6">Giỏ hàng của bạn</h1>
            {cartItems.length === 0 ? (
                <div className="text-center py-10 px-6 bg-white rounded-lg shadow-md">
                    <p className="text-gray-600">Giỏ hàng trống.</p>
                    <Link to="/" className="mt-4 inline-block bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700">
                        Quay lại mua sắm
                    </Link>
                </div>
            ) : (
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map(item => (
                            <div key={item._id} className="flex items-center bg-white p-4 rounded-lg shadow-md">
                                <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
                                <div className="flex-grow ml-4">
                                    <h2 className="font-bold text-lg">{item.name}</h2>
                                    <p className="text-sm text-gray-600">{item.price.toLocaleString('vi-VN')} VNĐ</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span>Số lượng: {item.quantity}</span>
                                    <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-700 font-semibold">
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold mb-4">Tổng kết đơn hàng</h2>
                            <div className="flex justify-between mb-4">
                                <span className="text-gray-600">Tổng cộng</span>
                                <span className="font-bold text-xl">{subtotal.toLocaleString('vi-VN')} VNĐ</span>
                            </div>
                            <button onClick={checkoutHandler} className="w-full py-3 px-4 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                                Tiến hành Thanh toán
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;