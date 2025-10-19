import React, { useState, useEffect, useContext } from 'react';
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
};

export default OrderTrackingPage;