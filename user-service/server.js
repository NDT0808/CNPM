<<<<<<< HEAD
﻿import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './src/routes/userRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());

// Kết nối DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB for User Service'))
    .catch((err) => console.error('❌ Could not connect to MongoDB:', err));

// Routes
app.use('/', userRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 User Service is running on http://localhost:${PORT}`);
=======
﻿// user-service/server.js

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
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
});