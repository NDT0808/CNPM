import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
<<<<<<< HEAD
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

const OrderListAdminPage = () => {
    const [orders, setOrders] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(''); // Branch đang được xem
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { userInfo } = useContext(AuthContext);

    // Kiểm tra quyền: Nếu không có branchId -> Super Admin
    const isSuperAdmin = !userInfo?.branchId;

    // Cấu hình URL
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const SOCKET_URL = import.meta.env.VITE_ORDER_SOCKET_URL || 'http://localhost:3003';

    // 1. Tải danh sách chi nhánh (Chỉ cho Super Admin)
    useEffect(() => {
        const fetchBranches = async () => {
            if (!isSuperAdmin) {
                // Nếu là Manager, set cứng branchId của họ
                setSelectedBranch(userInfo.branchId);
                return;
            }

            try {
                const { data } = await axios.get(`${API_URL}/api/branches`);
                setBranches(data);
                // Mặc định chọn chi nhánh đầu tiên
                if (data.length > 0) setSelectedBranch(data[0]._id);
            } catch (err) {
                console.error("Lỗi tải danh sách chi nhánh:", err);
            }
        };

        if (userInfo) fetchBranches();
    }, [userInfo, isSuperAdmin, API_URL]);

    // 2. Fetch Orders & Setup Socket (Chạy lại khi selectedBranch thay đổi)
    useEffect(() => {
        if (!selectedBranch || !userInfo) return;

        // A. Hàm fetch dữ liệu đơn hàng
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                // Gọi API có lọc theo branchId
                const { data } = await axios.get(
                    `${API_URL}/api/orders/all?branchId=${selectedBranch}`,
                    config
                );
                setOrders(data);
                setError('');
            } catch (err) {
                setError('Không thể tải danh sách đơn hàng.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();

        // B. Kết nối WebSocket
        const socket = io(SOCKET_URL);

        socket.on('connect', () => {
            console.log(`🟢 Socket connected. Joining room: ${selectedBranch}`);
            // Quan trọng: Join vào room của chi nhánh này để nghe tin
            socket.emit('join_branch', selectedBranch);
        });

        // Lắng nghe đơn mới
        socket.on('new_order', (newOrder) => {
            console.log('🔔 Có đơn hàng mới:', newOrder._id);
            // Thêm đơn mới vào đầu danh sách (cần reload hoặc merge thủ công)
            // Để đơn giản và đảm bảo dữ liệu (như tên user) đầy đủ, ta gọi lại fetchOrders
            fetchOrders();
            // Hoặc nếu muốn nhanh: setOrders((prev) => [newOrder, ...prev]); (nhưng newOrder chưa populate tên user)

            // Phát tiếng chuông (Optional)
            // const audio = new Audio('/notification.mp3'); audio.play();
        });

        // Lắng nghe cập nhật trạng thái (ví dụ: Bếp làm xong, Shipper nhận)
        socket.on('order_update', (updatedOrder) => {
            setOrders((prev) =>
                prev.map(order => order._id === updatedOrder._id ? { ...order, ...updatedOrder } : order)
            );
        });

        // Cleanup
        return () => {
            socket.disconnect();
        };

    }, [selectedBranch, userInfo, API_URL, SOCKET_URL]);

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">
                    Quản lý Đơn Hàng
                    {!isSuperAdmin && <span className="text-indigo-600 ml-2 text-xl">(Chi nhánh)</span>}
                </h1>

                {/* Dropdown chọn chi nhánh (Chỉ hiện cho Super Admin) */}
                {isSuperAdmin ? (
                    <div className="flex items-center bg-white p-2 rounded shadow border">
                        <span className="mr-2 font-semibold text-gray-600">Chi nhánh:</span>
                        <select
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                            className="border-none outline-none bg-transparent font-medium text-indigo-600 cursor-pointer"
                        >
                            {branches.map(branch => (
                                <option key={branch._id} value={branch._id}>
                                    {branch.name}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : (
                    // Hiển thị cho Branch Manager
                    <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold shadow-sm">
                        🔒 Đang quản lý chi nhánh của bạn
                    </div>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                </div>
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : (
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg border border-gray-200">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th className="px-6 py-3">Mã Đơn</th>
                                <th className="px-6 py-3">Thời Gian</th>
                                <th className="px-6 py-3">Khách Hàng</th>
                                <th className="px-6 py-3">Tổng Tiền</th>
                                <th className="px-6 py-3">Thanh Toán</th>
                                <th className="px-6 py-3">Trạng Thái</th>
                                <th className="px-6 py-3">Drone</th>
                                <th className="px-6 py-3">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-gray-900">
                                        #{order._id.substring(0, 8)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                        <br />
                                        <span className="text-xs text-gray-400">
                                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {/* SỬA LẠI: userId.name thay vì user.name */}
                                        {order.userId?.name || 'Khách vãng lai'}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-900">
                                        {order.totalPrice.toLocaleString('vi-VN')} ₫
                                    </td>
                                    <td className="px-6 py-4">
                                        {order.isPaid ? (
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                                Đã TT
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                                                Chưa TT
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold
                                            ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                                    order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                                                        order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'}`}>
                                            {order.status || 'Pending'}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 font-mono text-blue-600 text-xs">
                                        {order.droneId || '-'}
                                    </td>

                                    <td className="px-6 py-4">
                                        <Link
                                            to={`/order/${order._id}`}
                                            className="text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded text-xs font-medium transition-colors"
                                        >
                                            Chi tiết
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="text-center py-8 text-gray-500 italic">
                                        Chưa có đơn hàng nào tại chi nhánh này.
                                    </td>
                                </tr>
                            )}
=======
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
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrderListAdminPage;