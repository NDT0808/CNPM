<<<<<<< HEAD
﻿import express from 'express';
=======
import express from 'express';
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
<<<<<<< HEAD
import mongoose from 'mongoose';
import Drone from './src/models/droneModel.js';
=======
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

<<<<<<< HEAD
// Đọc URL từ biến môi trường (do docker-compose.yml cung cấp)
// Nếu không tìm thấy, nó sẽ dùng 'http://order-service:3003' làm mặc định
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://order-service:3003';

// Kết nối Mongoose (dùng biến môi trường)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB for Delivery Service'))
    .catch((err) => console.error('❌ Could not connect to MongoDB:', err));


const server = http.createServer(app);

// Cấu hình Socket.IO với CORS
const io = new Server(server, {
    cors: {
        // ❌ Dòng cũ gây lỗi:
        // origin: "http://localhost:5173",

        // ✅ Dòng mới (Cho phép mọi IP truy cập):
        origin: "*",
=======
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Cho ph�p frontend k?t n?i
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
        methods: ["GET", "POST"]
    }
});

<<<<<<< HEAD
// API Endpoint để bắt đầu quá trình giao hàng giả lập
app.post('/start-delivery', async (req, res) => {
    const { orderId } = req.body;
    if (!orderId) {
        return res.status(400).send({ message: 'Thiếu orderId' });
    }

    let assignedDrone;
    try {
        assignedDrone = await Drone.findOneAndUpdate(
            { status: 'available' }, // Tìm drone rảnh
            { status: 'busy', currentOrderId: orderId }, // Cập nhật nó thành bận
            { new: true }
        );
        if (!assignedDrone) {
            console.warn("⚠️ Không tìm thấy drone nào rảnh!");
            return res.status(503).send({ message: 'Tất cả drone đều đang bận.' });
        }
    } catch (err) {
        console.error("❌ Lỗi server khi tìm drone:", err.message);
        return res.status(500).send({ message: 'Lỗi server khi tìm drone.' });
    }

    console.log(`🤖 Bắt đầu giao hàng cho đơn ${orderId} bằng drone ${assignedDrone.name}`);
    res.status(200).send({ message: 'Đã bắt đầu quá trình giao hàng.' });

    // Tọa độ giả lập
=======
// API Endpoint ?? b?t ??u qu� tr�nh giao h�ng gi? l?p
app.post('/start-delivery', (req, res) => {
    const { orderId } = req.body;
    if (!orderId) {
        return res.status(400).send({ message: 'Thi?u orderId' });
    }

    console.log(`B?t ??u gi? l?p giao h�ng cho ??n: ${orderId}`);

    // B�o l?i cho client HTTP r?ng ?� nh?n y�u c?u
    res.status(200).send({ message: '?� b?t ??u qu� tr�nh giao h�ng.' });

    // --- B?T ??U GI? L?P GIAO H�NG ---
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
    const restaurantLocation = { lat: 10.7769, lng: 106.7009 };
    const midPoint = { lat: 10.770, lng: 106.685 };
    const customerLocation = { lat: 10.7626, lng: 106.6602 };

<<<<<<< HEAD
    // Gán Tên drone (dùng biến môi trường ORDER_SERVICE_URL)
    try {
        await axios.put(`${ORDER_SERVICE_URL}/${orderId}/assign-drone`, {
            droneId: assignedDrone.name
        });
        console.log(`✅ Đã gán ${assignedDrone.name} cho đơn hàng ${orderId}`);
    } catch (err) {
        console.error("❌ Lỗi khi gán mã drone:", err.message);
    }

    // Gửi WebSocket (Giai đoạn 1)
    io.to(orderId).emit('status_update', {
        status: 'Đang chuẩn bị hàng',
        location: restaurantLocation,
        droneId: assignedDrone.name
    });

    // Giai đoạn 2
    setTimeout(() => {
        io.to(orderId).emit('status_update', {
            status: 'Đang giao hàng',
            location: midPoint,
            droneId: assignedDrone.name
        });
    }, 5000);

    // Giai đoạn 3
    setTimeout(async () => {
        io.to(orderId).emit('status_update', {
            status: 'Đã giao hàng',
            location: customerLocation,
            droneId: assignedDrone.name
        });

        // Cập nhật trạng thái (dùng biến môi trường ORDER_SERVICE_URL)
        try {
            await axios.put(`${ORDER_SERVICE_URL}/${orderId}/status`, { status: 'Delivered' });
            await Drone.findByIdAndUpdate(assignedDrone._id, {
                status: 'available',
                currentOrderId: null
            });
            console.log(`✅ Đơn hàng ${orderId} hoàn tất, Drone ${assignedDrone.name} đã rảnh.`);
        } catch (err) {
            console.error("❌ Lỗi khi hoàn thành giao hàng:", err.message);
=======
    // G?i tr?ng th�i ??u ti�n
    io.to(orderId).emit('status_update', { status: '?ang chu?n b? h�ng', location: restaurantLocation });

    // Sau 5 gi�y: B?t ??u giao
    setTimeout(() => {
        io.to(orderId).emit('status_update', { status: '?ang giao h�ng', location: midPoint });
    }, 5000);

    // Sau 10 gi�y: Giao th�nh c�ng
    setTimeout(async () => {
        io.to(orderId).emit('status_update', { status: '?� giao h�ng', location: customerLocation });

        // G?i l?i Order Service ?? c?p nh?t tr?ng th�i cu?i c�ng trong DB
        try {
            await axios.put(`${process.env.ORDER_SERVICE_URL}/${orderId}/status`, { status: 'Delivered' });
            console.log(`?� c?p nh?t tr?ng th�i Delivered cho ??n h�ng ${orderId}`);
        } catch (err) {
            console.error("L?i khi g?i l?i Order Service:", err.message);
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
        }
    }, 10000);
});

<<<<<<< HEAD
// Xử lý kết nối Socket.IO
io.on('connection', (socket) => {
    console.log('🔌 Một client đã kết nối WebSocket:', socket.id);
    socket.on('join_order_room', (orderId) => {
        socket.join(orderId);
        console.log(`Client ${socket.id} đang theo dõi đơn hàng ${orderId}`);
    });
    socket.on('disconnect', () => console.log('🔌 Một client đã ngắt kết nối WebSocket'));
});

// Khởi động server
const PORT = process.env.PORT || 3005;
server.listen(PORT, () => {
    console.log(`🚀 Delivery Service đang chạy trên port ${PORT}`);
});
=======
io.on('connection', (socket) => {
    console.log('M?t client ?� k?t n?i:', socket.id);
    socket.on('join_order_room', (orderId) => {
        socket.join(orderId);
        console.log(`Client ${socket.id} ?� tham gia ph�ng c?a ??n h�ng ${orderId}`);
    });
    socket.on('disconnect', () => console.log('M?t client ?� ng?t k?t n?i'));
});

const PORT = process.env.PORT || 3005;
server.listen(PORT, () => console.log(`?? Delivery Service ?ang ch?y tr�n port ${PORT}`));
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
