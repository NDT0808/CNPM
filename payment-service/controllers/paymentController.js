const axios = require('axios');

// @desc    Xử lý thanh toán (giả lập)
// @route   POST /api/payments
const processPayment = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ message: 'Cần có ID đơn hàng' });
        }

        // GIẢ LẬP: Gọi ngược lại Order Service để cập nhật trạng thái
        // Trong thực tế, bước này chỉ xảy ra sau khi nhận được xác nhận từ cổng thanh toán
        await axios.put(`http://localhost:3003/api/orders/${orderId}/pay`);

        console.log(`Payment successful for order ${orderId}`);
        res.status(200).json({ message: 'Thanh toán thành công' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Thanh toán thất bại', error: error.message });
    }
};

module.exports = { processPayment };