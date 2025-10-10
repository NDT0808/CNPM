// src/pages/OrderPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const OrderPage = () => {
    const { id: orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userInfo } = useContext(AuthContext);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get(`http://localhost:3000/api/orders/${orderId}`, config);
                setOrder(data);
            } catch (err) {
                setError('Không thể tải thông tin đơn hàng.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId, userInfo.token]);

    const paymentHandler = async () => {
        try {
            // Gọi đến Payment Service "giả lập"
            await axios.post('http://localhost:3000/api/payments', { orderId });
            alert('Thanh toán thành công!');
            navigate('/myorders');
        } catch (error) {
            alert('Thanh toán thất bại.');
        }
    };

    if (loading) return <p>Đang tải đơn hàng...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-4">Đơn hàng #{order._id}</h1>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <div className="bg-white p-6 rounded-lg shadow-md mb-4">
                        <h2 className="text-xl font-semibold mb-2">Địa chỉ giao hàng</h2>
                        <p>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-2">Các món đã đặt</h2>
                        {order.orderItems.map(item => (
                            <div key={item.productId} className="flex justify-between items-center border-b py-2">
                                <span>{item.name} (x{item.quantity})</span>
                                <span>{(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Tổng kết</h2>
                        <div className="flex justify-between mb-4">
                            <span>Tổng tiền</span>
                            <span className="font-bold">{order.totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                        </div>
                        {!order.isPaid && (
                            <button onClick={paymentHandler} className="w-full py-3 font-semibold text-white bg-green-500 rounded-md hover:bg-green-600">
                                Thanh toán ngay
                            </button>
                        )}
                        {order.isPaid && <p className="text-center text-green-600 font-bold">Đã thanh toán</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderPage;