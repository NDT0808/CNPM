import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
    {
        // --- SỬA LẠI CHO GIỐNG ẢNH ---
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User' // Đổi tên field từ 'user' -> 'userId'
        },
        branchId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true, // Vẫn giữ để hỗ trợ tính năng đa chi nhánh
        },
        orderItems: [
            {
                name: { type: String, required: true },
                qty: { type: Number, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product',
                },
                // Lưu option nếu có
                selectedOptions: [
                    { name: String, price: Number }
                ],
                note: String
            },
        ],
        shippingAddress: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            phone: { type: String }, // Thêm sđt
            // Các trường này backend yêu cầu nhưng frontend có thể tự map
            postalCode: { type: String, default: '70000' },
            country: { type: String, default: 'Vietnam' },
        },
        paymentMethod: {
            type: String,
            required: true,
            default: 'PAID'
        },
        paymentResult: {
            id: { type: String },
            status: { type: String },
            update_time: { type: String },
            email_address: { type: String },
        },
        itemsPrice: { type: Number, default: 0.0 },
        taxPrice: { type: Number, default: 0.0 },
        shippingPrice: { type: Number, default: 0.0 },
        totalPrice: { type: Number, required: true, default: 0.0 },
        isPaid: { type: Boolean, required: true, default: false },
        paidAt: { type: Date },
        isDelivered: { type: Boolean, required: true, default: false },
        deliveredAt: { type: Date },
        status: { type: String, default: 'Pending' },

        // --- GIỐNG ẢNH ---
        droneId: { type: String, default: null }
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;