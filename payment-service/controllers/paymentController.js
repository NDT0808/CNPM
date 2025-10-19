// payment-service/controllers/paymentController.js
import axios from 'axios';

// @desc    Xử lý thanh toán (giả lập)
// @route   POST /api/payments
export const processPayment = async (req, res) => { // <-- Add async here
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ message: 'Cần có ID đơn hàng' });
        }

        // Gọi ngược lại Order Service để cập nhật trạng thái
        await axios.put(`http://localhost:3003/${orderId}/pay`); // URL corrected previously

        console.log(`Payment successful for order ${orderId}`);
        res.status(200).json({ message: 'Thanh toán thành công' });

    } catch (error) {
        console.error("Payment processing error:", error.response?.data?.message || error.message);
        // Forward the error from Order Service if available
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || 'Thanh toán thất bại';
        res.status(status).json({ message: message });
    }
};