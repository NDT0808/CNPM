import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Cho phép frontend k?t n?i
        methods: ["GET", "POST"]
    }
});

// API Endpoint ?? b?t ??u quá trình giao hàng gi? l?p
app.post('/start-delivery', (req, res) => {
    const { orderId } = req.body;
    if (!orderId) {
        return res.status(400).send({ message: 'Thi?u orderId' });
    }

    console.log(`B?t ??u gi? l?p giao hàng cho ??n: ${orderId}`);

    // Báo l?i cho client HTTP r?ng ?ã nh?n yêu c?u
    res.status(200).send({ message: '?ã b?t ??u quá trình giao hàng.' });

    // --- B?T ??U GI? L?P GIAO HÀNG ---
    const restaurantLocation = { lat: 10.7769, lng: 106.7009 };
    const midPoint = { lat: 10.770, lng: 106.685 };
    const customerLocation = { lat: 10.7626, lng: 106.6602 };

    // G?i tr?ng thái ??u tiên
    io.to(orderId).emit('status_update', { status: '?ang chu?n b? hàng', location: restaurantLocation });

    // Sau 5 giây: B?t ??u giao
    setTimeout(() => {
        io.to(orderId).emit('status_update', { status: '?ang giao hàng', location: midPoint });
    }, 5000);

    // Sau 10 giây: Giao thành công
    setTimeout(async () => {
        io.to(orderId).emit('status_update', { status: '?ã giao hàng', location: customerLocation });

        // G?i l?i Order Service ?? c?p nh?t tr?ng thái cu?i cùng trong DB
        try {
            await axios.put(`${process.env.ORDER_SERVICE_URL}/${orderId}/status`, { status: 'Delivered' });
            console.log(`?ã c?p nh?t tr?ng thái Delivered cho ??n hàng ${orderId}`);
        } catch (err) {
            console.error("L?i khi g?i l?i Order Service:", err.message);
        }
    }, 10000);
});

io.on('connection', (socket) => {
    console.log('M?t client ?ã k?t n?i:', socket.id);
    socket.on('join_order_room', (orderId) => {
        socket.join(orderId);
        console.log(`Client ${socket.id} ?ã tham gia phòng c?a ??n hàng ${orderId}`);
    });
    socket.on('disconnect', () => console.log('M?t client ?ã ng?t k?t n?i'));
});

const PORT = process.env.PORT || 3005;
server.listen(PORT, () => console.log(`?? Delivery Service ?ang ch?y trên port ${PORT}`));