import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
// Corrected import path with .jsx extension
import { AuthContext } from '../../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

const OrderListAdminPage = () => {
    // State variables
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    // Get user info (including token) from context
    const { userInfo } = useContext(AuthContext);

    // Fetch orders when component mounts or userInfo changes
    useEffect(() => {
        const fetchAllOrders = async () => {
            // Check for user info and token
            if (!userInfo || !userInfo.token) {
                setError('Vui lòng đăng nhập với quyền admin.');
                setLoading(false);
                return;
            }
            try {
                setLoading(true); // Start loading
                // Configure request headers with Authorization token
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                // Fetch all orders from the backend via API Gateway
                const { data } = await axios.get('http://localhost:3000/api/orders/all', config);
                setOrders(data); // Store fetched orders
                setError(''); // Clear any previous errors
            } catch (err) {
                // Handle fetch errors (like 401 Unauthorized or 403 Forbidden)
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    setError('Bạn không có quyền truy cập trang này.');
                } else {
                    setError('Không thể tải danh sách đơn hàng.');
                }
                console.error("Fetch all orders error:", err.response?.data?.message || err.message);
            } finally {
                setLoading(false); // Stop loading regardless of success or failure
            }
        };
        fetchAllOrders();
    }, [userInfo]); // Re-run effect if userInfo changes

    // Display loading state
    if (loading) {
        return <p className="text-center mt-8">Đang tải danh sách đơn hàng...</p>;
    }

    // Display error state
    if (error) {
        return <p className="text-center mt-8 text-red-500">{error}</p>;
    }

    // Render the order list table
    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6">Quản lý Đơn Hàng</h1>

            {orders.length === 0 ? (
                // Display message if no orders exist
                <div className="text-center py-10 px-6 bg-white rounded-lg shadow-md">
                    <p className="text-gray-600">Không có đơn hàng nào để hiển thị.</p>
                    {/* Link back to homepage could be added here */}
                </div>
            ) : (
                // Display the table if orders exist
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500">
                        {/* Table Header */}
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">ID ĐƠN HÀNG</th>
                                <th scope="col" className="px-6 py-3">NGƯỜI DÙNG (ID)</th>
                                <th scope="col" className="px-6 py-3">NGÀY ĐẶT</th>
                                <th scope="col" className="px-6 py-3">TỔNG TIỀN</th>
                                <th scope="col" className="px-6 py-3">THANH TOÁN</th>
                                <th scope="col" className="px-6 py-3">TRẠNG THÁI GIAO</th>
                                <th scope="col" className="px-6 py-3">
                                    <span className="sr-only">Hành động</span>
                                </th>
                            </tr>
                        </thead>
                        {/* Table Body */}
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id} className="bg-white border-b hover:bg-gray-50">
                                    {/* Order ID */}
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{order._id}</td>
                                    {/* User ID (can be enhanced later to show name/email) */}
                                    <td className="px-6 py-4">{order.userId}</td>
                                    {/* Order Date */}
                                    <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                                    {/* Total Price */}
                                    <td className="px-6 py-4">{order.totalPrice.toLocaleString('vi-VN')} VNĐ</td>
                                    {/* Payment Status */}
                                    <td className="px-6 py-4">
                                        {order.isPaid ? (
                                            <span className="text-green-600 font-semibold">Rồi</span>
                                        ) : (
                                            <span className="text-red-600 font-semibold">Chưa</span>
                                        )}
                                    </td>
                                    {/* Delivery Status */}
                                    <td className="px-6 py-4">{order.status}</td>
                                    {/* Action Button (View Details) */}
                                    <td className="px-6 py-4 text-right">
                                        <Link to={`/order/${order._id}`} className="font-medium text-indigo-600 hover:underline">
                                            Xem Chi tiết
                                        </Link>
                                        {/* Placeholder for future "Mark Delivered" button */}
                                        {/* {!order.isDelivered && ( <button>Mark Delivered</button> )} */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrderListAdminPage;