import express from 'express';
import {
    createOrder,
    getMyOrders,
    updateOrderToPaid,
    getOrderById,
    updateOrderStatus // <-- Make sure this is imported
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route để tạo đơn hàng mới
router.route('/').post(protect, createOrder);

// Route để lấy tất cả đơn hàng của một user
router.route('/myorders/:userId').get(protect, getMyOrders);

// Route để lấy một đơn hàng cụ thể theo ID
router.route('/:id').get(protect, getOrderById);

// Route để cập nhật trạng thái thanh toán (gọi từ Payment Service)
router.route('/:id/pay').put(updateOrderToPaid);

// Route để cập nhật trạng thái giao hàng (gọi từ Delivery Service)
router.route('/:id/status').put(updateOrderStatus);

export default router;