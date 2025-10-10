import express from 'express';
import {
    createOrder,
    getMyOrders,
    updateOrderToPaid,
    getOrderById
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route để tạo đơn hàng mới
router.route('/').post(protect, createOrder);

// Route để lấy tất cả đơn hàng của một user
router.route('/myorders/:userId').get(protect, getMyOrders);

// Route để lấy một đơn hàng cụ thể theo ID <-- DÒNG QUAN TRỌNG
router.route('/:id').get(protect, getOrderById);

// Route để cập nhật trạng thái thanh toán
router.route('/:id/pay').put(updateOrderToPaid); // Middleware `protect` có thể thêm ở đây nếu cần

export default router;