import express from 'express';
import {
    createOrder,
    getMyOrders,
    updateOrderToPaid,
    getOrderById,
    updateOrderStatus,
    getAllOrders // Make sure getAllOrders is imported
} from '../controllers/orderController.js';

// Import protect and admin ONCE
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to create a new order (Protected for logged-in users)
router.route('/').post(protect, createOrder);

// Route to get all orders for the logged-in user (Protected)
router.route('/myorders/:userId').get(protect, getMyOrders);

// Route to get all orders (Admin only)
router.route('/all').get(protect, admin, getAllOrders);

// Route to get a specific order by ID (Protected)
router.route('/:id').get(protect, getOrderById);

// Route to update order to paid (Called by Payment Service - check if protect needed)
router.route('/:id/pay').put(updateOrderToPaid);

// Route to update order status (Called by Delivery Service - check if protect needed)
router.route('/:id/status').put(updateOrderStatus);

export default router;