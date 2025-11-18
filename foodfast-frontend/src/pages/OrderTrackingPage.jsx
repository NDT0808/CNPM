<<<<<<< HEAD
﻿// src/pages/OrderTrackingPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext.jsx';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; // Import thư viện Leaflet (L)

// --- ĐỊNH NGHĨA CÁC ICON TÙY CHỈNH ---

// Icon cho Drone (Tài xế)
const droneIcon = new L.Icon({
    iconUrl: 'https://th.bing.com/th/id/OIP.QaleUwWt00f9ndpuwJLgGQHaF7?w=198&h=180&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.1&pid=1.7&rm=3', // Link ảnh drone (PNG)
    iconSize: [40, 40], // Kích thước [rộng, cao]
    iconAnchor: [20, 20], // Neo ở tâm icon
    popupAnchor: [0, -20] // Popup mở ra bên trên
});

// Icon cho Nhà hàng
const restaurantIcon = new L.Icon({
    iconUrl: 'https://th.bing.com/th/id/OIP.yfzOcsBCl7743NUjTsAqRQHaHa?w=158&h=180&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.1&pid=1.7&rm=3', // Link ảnh nhà hàng
    iconSize: [35, 35],
    iconAnchor: [17, 35], // Neo ở giữa-dưới
    popupAnchor: [0, -35]
});

// Icon cho Nhà (Khách hàng)
const homeIcon = new L.Icon({
    iconUrl: 'https://th.bing.com/th/id/OIP.F_egOr6vo3ZHivDJW4nd3gHaHa?w=180&h=180&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.1&pid=1.7&rm=3', // Link ảnh nhà
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35]
});

// --- COMPONENT CHÍNH ---
const OrderTrackingPage = () => {
    const { id: orderId } = useParams();
    const { userInfo } = useContext(AuthContext);

    const [order, setOrder] = useState(null); // Lưu chi tiết đơn hàng
    const [orderStatus, setOrderStatus] = useState('Đang tải...');
    const [driverLocation, setDriverLocation] = useState(null);
    const [droneId, setDroneId] = useState(null);
    const [error, setError] = useState('');

    // Tọa độ giả lập (Bạn có thể thay đổi)
    const restaurantLocation = [10.7769, 106.7009];
    const customerLocation = [10.7626, 106.6602];

    useEffect(() => {
        // Kết nối đến Delivery Service (port 3005)
        const socket = io(import.meta.env.VITE_DELIVERY_SOCKET_URL || 'http://localhost:3005');
        // Hàm tải dữ liệu ban đầu
        const fetchInitialData = async () => {
            if (!userInfo || !userInfo.token) {
                setError('Vui lòng đăng nhập.');
                return;
            }
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                // Tải chi tiết đơn hàng
                const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/orders/${orderId}`, config);
                setOrder(data); // Lưu toàn bộ đơn hàng
                setOrderStatus(data.status);
                if (data.droneId) {
                    setDroneId(data.droneId);
                }

                // Giả lập vị trí ban đầu (nhà hàng)
                setDriverLocation(restaurantLocation);

                // Tham gia phòng WebSocket
                socket.emit('join_order_room', orderId);

            } catch (err) {
                console.error("Error fetching initial order data:", err);
                setError('Không thể tải dữ liệu đơn hàng.');
            }
        };

        fetchInitialData();

        // Lắng nghe cập nhật từ server
        socket.on('status_update', (data) => {
            console.log('Nhận được cập nhật:', data);
            setOrderStatus(data.status); // Cập nhật trạng thái
            if (data.location) {
                setDriverLocation([data.location.lat, data.location.lng]); // Cập nhật vị trí
            }
            if (data.droneId) {
                setDroneId(data.droneId); // Cập nhật mã drone
            }
        });

        // Dọn dẹp
        return () => {
            console.log('Disconnecting socket...');
            socket.disconnect();
        };
    }, [orderId, userInfo]); // Chạy lại nếu orderId hoặc user thay đổi

    return (
        <div className="container mx-auto p-4 md:p-8">
            <Link to="/myorders" className="text-indigo-600 hover:text-indigo-800 font-medium mb-4 inline-block">
                &larr; Quay lại danh sách đơn hàng
            </Link>

            <h1 className="text-3xl font-bold mb-4 text-center">Theo dõi đơn hàng #{orderId}</h1>
            {error && <p className="text-center text-red-500 mb-4">{error}</p>}

            {/* Hiển thị Mã Drone */}
            {droneId && (
                <div className="text-center mb-4">
                    <span className="bg-blue-100 text-blue-800 text-lg font-semibold mr-2 px-3 py-1 rounded">
                        🚁 Phương tiện: {droneId}
                    </span>
                </div>
            )}

            {/* Hiển thị Trạng thái */}
            <div className="text-center mb-6">
                <p className="text-xl">
                    Trạng thái hiện tại:
                    <span className="font-semibold text-indigo-600 animate-pulse ml-2">{orderStatus}</span>
                </p>
            </div>

            {/* Hiển thị Bản đồ */}
            <div className="mb-8">
                {driverLocation ? (
                    <MapContainer
                        center={driverLocation}
                        zoom={14}
                        scrollWheelZoom={true}
                        style={{ height: "60vh", width: "100%", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 0 }}
                    >
                        <TileLayer
                            attribution='&copy; OpenStreetMap contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {/* Sử dụng icon tùy chỉnh */}
                        <Marker position={restaurantLocation} icon={restaurantIcon}>
                            <Popup>📍 Nhà hàng</Popup>
                        </Marker>
                        <Marker position={customerLocation} icon={homeIcon}>
                            <Popup>🏠 Vị trí của bạn</Popup>
                        </Marker>
                        <Marker position={driverLocation} icon={droneIcon}>
                            <Popup>🚁 {droneId || 'Tài xế'}</Popup>
                        </Marker>

                    </MapContainer>
                ) : (
                    !error && <p className="text-center py-10 bg-gray-100 rounded-lg">Đang tải bản đồ...</p>
                )}
            </div>

            {/* Hiển thị chi tiết đơn hàng */}
            {order && (
                <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto border border-gray-200">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Chi tiết đơn hàng</h2>

                    <div className="space-y-3 mb-6">
                        {order.orderItems.map((item, index) => (
                            <div key={index} className="flex justify-between items-center">
                                <div>
                                    <span className="font-medium">{item.name}</span>
                                    <span className="text-gray-500 text-sm ml-2">x{item.quantity}</span>
                                    {/* Hiển thị option */}
                                    {item.selectedOptions && item.selectedOptions.length > 0 && (
                                        <div className="text-xs text-gray-500 ml-2">
                                            {item.selectedOptions.map(opt => `+ ${opt.name}`).join(', ')}
                                        </div>
                                    )}
                                    {/* Hiển thị ghi chú */}
                                    {item.note && (
                                        <p className="text-sm text-gray-500 italic mt-1">Ghi chú: "{item.note}"</p>
                                    )}
                                </div>
                                <span className="font-medium text-gray-700">
                                    {(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <span className="text-xl font-bold text-gray-800">Tổng cộng</span>
                        <span className="text-xl font-bold text-indigo-600">
                            {order.totalPrice.toLocaleString('vi-VN')} VNĐ
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
=======
﻿import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client'; // WebSocket client
import { AuthContext } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'; // Map components

const OrderTrackingPage = () => {
  const { id: orderId } = useParams(); // Get order ID from URL
  const { userInfo } = useContext(AuthContext);

  const [orderStatus, setOrderStatus] = useState('Đang tải...');
  const [driverLocation, setDriverLocation] = useState(null); // Driver's position [lat, lng]
  const [error, setError] = useState('');

  // Example locations (replace with actual data if available)
  const restaurantLocation = [10.7769, 106.7009]; // Example: HCMC Center
  const customerLocation = [10.7626, 106.6602];   // Example: HCMC District 10

  useEffect(() => {
    // --- WebSocket Connection ---
    // Connect to the Delivery Service (adjust port if needed)
    const socket = io('http://localhost:3005');

    const fetchInitialData = async () => {
      // Fetch initial order details to get the starting status
      if (!userInfo || !userInfo.token) {
        setError('Vui lòng đăng nhập.');
        return;
      }
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        // Fetch order details via API Gateway
        const { data } = await axios.get(`http://localhost:3000/api/orders/${orderId}`, config);
        setOrderStatus(data.status);

        // Assume driver starts at the restaurant initially
        setDriverLocation(restaurantLocation);

        // Join the WebSocket room for this specific order
        socket.emit('join_order_room', orderId);

      } catch (err) {
        console.error("Error fetching initial order data:", err);
        setError('Không thể tải dữ liệu đơn hàng.');
      }
    };

    fetchInitialData();

    // Listen for 'status_update' events from the server
    socket.on('status_update', (data) => {
      console.log('Received status update:', data);
      setOrderStatus(data.status); // Update status text
      if (data.location) {
        setDriverLocation([data.location.lat, data.location.lng]); // Update driver marker position
      }
    });

    // Clean up the connection when the component unmounts
    return () => {
      console.log('Disconnecting socket...');
      socket.disconnect();
    };
  }, [orderId, userInfo]); // Re-run effect if orderId or userInfo changes

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Theo dõi đơn hàng #{orderId}</h1>
      {error && <p className="text-center text-red-500 mb-4">{error}</p>}
      <div className="text-center mb-6">
        <p className="text-xl">
          Trạng thái hiện tại:
          <span className="font-semibold text-indigo-600 animate-pulse ml-2">{orderStatus}</span>
        </p>
      </div>

      {/* Map Display */}
      {driverLocation ? (
        <MapContainer
          center={driverLocation}
          zoom={14} // Zoom closer
          scrollWheelZoom={true} // Enable scroll zoom
          style={{ height: "60vh", width: "100%", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 0 }} // Ensure map is visible
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Marker for the Restaurant */}
          <Marker position={restaurantLocation}>
            <Popup>📍 Nhà hàng</Popup>
          </Marker>
          {/* Marker for the Customer */}
          <Marker position={customerLocation}>
            <Popup>🏠 Vị trí của bạn</Popup>
          </Marker>
          {/* Marker for the Driver (this one moves) */}
          <Marker position={driverLocation}>
            <Popup>🛵 Tài xế</Popup>
          </Marker>
        </MapContainer>
      ) : (
        !error && <p className="text-center">Đang tải bản đồ...</p> // Show loading only if no error
      )}
    </div>
  );
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
};

export default OrderTrackingPage;