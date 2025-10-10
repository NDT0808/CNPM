// user-service/server.js

// Thay thế require bằng import
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './src/routes/userRoutes.js'; // Thêm .js ở cuối

dotenv.config();

const app = express();

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB for User Service'))
    .catch((err) => console.error('Could not connect to MongoDB', err));

app.use(express.json());

app.use('/', userRoutes); // Sửa từ '/api/users' thành '/' để nhất quán với các service khác

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 User Service is running on http://localhost:${PORT}`);
});