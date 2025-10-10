// order-service/src/models/orderModel.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        orderItems: [
            {
                productId: { type: String, required: true },
                name: { type: String, required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
            },
        ],
        shippingAddress: {
            address: { type: String, required: true },
            city: { type: String, required: true },
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        status: {
            type: String,
            required: true,
            enum: ['Pending', 'Processing', 'Delivered', 'Cancelled'],
            default: 'Pending',
        },
        isPaid: {
            type: Boolean,
            required: true,
            default: false,
        },
        paidAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;