import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Added Link
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const OrderPage = () => {
    const { id: orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentProcessing, setPaymentProcessing] = useState(false); // State for payment button
    const { userInfo } = useContext(AuthContext);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!userInfo || !userInfo.token) {
                setError('Bạn cần đăng nhập để xem đơn hàng.');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get(`http://localhost:3000/api/orders/${orderId}`, config);
                setOrder(data);
                setError(null);
            } catch (err) {
                setError('Không thể tải thông tin đơn hàng.');
                console.error("Fetch order error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId, userInfo]); // Depend on userInfo as well

    const paymentHandler = async () => {
        setPaymentProcessing(true); // Disable button
        try {
            // Call Payment Service via API Gateway
            await axios.post('http://localhost:3000/api/payments', { orderId });
            alert('Thanh toán thành công! Đang chuyển đến trang theo dõi...');
            navigate(`/track/${orderId}`); // Navigate to tracking page
        } catch (error) {
            alert('Thanh toán thất bại. Vui lòng thử lại.');
            console.error("Payment error:", error);
            setPaymentProcessing(false); // Re-enable button on failure
        }
        // No need to setPaymentProcessing(false) on success because we navigate away
    };

    if (loading) return <p className="text-center mt-8">Đang tải đơn hàng...</p>;
    if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
    if (!order) return <p className="text-center mt-8">Không tìm thấy đơn hàng.</p>; // Handle case where order is null

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6">Chi tiết Đơn hàng #{order._id}</h1>
            <div className="grid md:grid-cols-3 gap-8">
                {/* Left Column: Shipping & Items */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-3 border-b pb-2">Thông tin giao hàng</h2>
                        <p><span className="font-medium">Người nhận:</span> {userInfo?.name}</p> {/* Assuming userInfo has name */}
                        <p><span className="font-medium">Email:</span> {userInfo?.email}</p> {/* Assuming userInfo has email */}
                        <p><span className="font-medium">Địa chỉ:</span> {order.shippingAddress.address}, {order.shippingAddress.city}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-3 border-b pb-2">Các món đã đặt</h2>
                        {order.orderItems.map(item => (
                            <div key={item.productId || item._id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                                <div className="flex items-center">
                                    {/* <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded mr-3" /> Optional Image */}
                                    <span>{item.name} <span className="text-gray-500">x{item.quantity}</span></span>
                                </div>
                                <span className="font-medium">{(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Order Summary & Payment */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md sticky top-4"> {/* Added sticky top */}
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Tóm tắt đơn hàng</h2>
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tổng tiền hàng</span>
                                <span>{order.totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Phí giao hàng</span>
                                <span>Miễn phí</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                                <span>Tổng cộng</span>
                                <span>{order.totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                            </div>
                        </div>

                        {/* Payment Status and Button */}
                        <div className="mt-6 text-center">
                            {order.isPaid ? (
                                <div className="p-3 bg-green-100 text-green-700 rounded-md">
                                    Đã thanh toán vào {new Date(order.paidAt).toLocaleTimeString('vi-VN')} {new Date(order.paidAt).toLocaleDateString('vi-VN')}
                                </div>
                            ) : (
                                <button
                                    onClick={paymentHandler}
                                    disabled={paymentProcessing}
                                    className={`w-full py-3 font-semibold text-white rounded-md transition duration-200 ${paymentProcessing
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-green-500 hover:bg-green-600'
                                        }`}
                                >
                                    {paymentProcessing ? 'Đang xử lý...' : 'Thanh toán ngay (Giả lập)'}
                                </button>
                            )}
                        </div>

                        {/* Link to Tracking Page */}
                        <div className="mt-4 text-center">
                            <Link to={`/track/${order._id}`} className="text-indigo-600 hover:text-indigo-800 font-medium">
                                Xem lộ trình giao hàng &rarr;
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderPage;