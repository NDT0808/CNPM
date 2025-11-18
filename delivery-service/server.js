import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import mongoose from 'mongoose';
import Drone from './src/models/droneModel.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

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
        methods: ["GET", "POST"]
    }
});

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
    const restaurantLocation = { lat: 10.7769, lng: 106.7009 };
    const midPoint = { lat: 10.770, lng: 106.685 };
    const customerLocation = { lat: 10.7626, lng: 106.6602 };

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
        }
    }, 10000);
});

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