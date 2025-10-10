// order-service/server.js
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import orderRoutes from './src/routes/orderRoutes.js';

dotenv.config();
const app = express();

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB for Order Service'))
    .catch((err) => console.error('Could not connect to MongoDB', err));

app.use(express.json());
app.use('/', orderRoutes);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`🚀 Order Service is running on http://localhost:${PORT}`);
});