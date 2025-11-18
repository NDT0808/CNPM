import mongoose from 'mongoose';

const droneSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        required: true,
        // 'available': rảnh, 'busy': đang giao, 'maintenance': đang bảo trì
        enum: ['available', 'busy', 'maintenance'],
        default: 'available',
    },
    currentOrderId: {
        type: String,
        default: null,
    },
}, { timestamps: true });

const Drone = mongoose.model('Drone', droneSchema);
export default Drone;