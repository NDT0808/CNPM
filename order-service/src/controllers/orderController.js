// order-service/src/controllers/orderController.js

import Order from '../models/orderModel.js';
import axios from 'axios';

// @desc    Tạo đơn hàng mới
// @route   POST /
export const createOrder = async (req, res) => {
    try {
        const { userId, orderItems, shippingAddress } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'Không có sản phẩm nào trong đơn hàng' });
        }

        let calculatedTotalPrice = 0;
        const itemsWithPrice = [];

        for (const item of orderItems) {
            const response = await axios.get(`http://localhost:3002/${item.productId}`);
            const productFromDB = response.data;

            itemsWithPrice.push({
                productId: item.productId,
                name: productFromDB.name,
                quantity: item.quantity,
                price: productFromDB.price,
            });

            calculatedTotalPrice += productFromDB.price * item.quantity;
        }

        const order = new Order({
            userId,
            orderItems: itemsWithPrice,
            shippingAddress,
            totalPrice: calculatedTotalPrice,
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ message: 'Một trong các sản phẩm không được tìm thấy.' });
        }
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc    Lấy các đơn hàng của một người dùng
// @route   GET /myorders/:userId
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc    Cập nhật trạng thái đơn hàng thành đã thanh toán (gọi từ Payment Service)
// @route   PUT /:id/pay
export const updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.status = 'Processing';
            const updatedOrder = await order.save();

            // Gọi Delivery Service để bắt đầu giao hàng
            try {
                await axios.post('http://localhost:3004/start-delivery', { orderId: req.params.id });
            } catch (err) {
                console.error("Không thể gọi Delivery Service:", err.message);
            }

            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc    Lấy một đơn hàng theo ID
// @route   GET /:id
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Cập nhật trạng thái giao hàng (gọi từ Delivery Service)
// @route   PUT /:id/status
export const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = req.body.status || order.status;
            const updatedOrder = await order.save();

            // Gửi thông báo đến client (nếu có)
            if (req.io) {
                req.io.to(req.params.id).emit('status_update', {
                    status: updatedOrder.status
                });
            }

            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Get all orders (Admin only)
// @route   GET /all
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}); // Find all orders
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy tất cả đơn hàng' });
    }
};