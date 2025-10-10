// user-service/src/routes/userRoutes.js

// Thay thế require bằng import
import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Thay thế module.exports bằng export default
export default router;