<<<<<<< HEAD
﻿import express from 'express';
import {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    deleteUser
} from '../controllers/userController.js'; // <-- Đường dẫn tương đối
import { protect, admin } from '../middleware/authMiddleware.js'; // <-- Đường dẫn tương đối

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// User profile route (chỉ user đã đăng nhập)
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// Admin routes (chỉ admin)
router.route('/')
    .get(protect, admin, getAllUsers);

router.route('/:id')
    .delete(protect, admin, deleteUser);

=======
﻿// user-service/src/routes/userRoutes.js

// Thay thế require bằng import
import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Thay thế module.exports bằng export default
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
export default router;