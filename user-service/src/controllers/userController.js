const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Hàm trợ giúp: tạo JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token hết hạn sau 30 ngày
    });
};

// @desc    Đăng ký người dùng mới
// @route   POST /api/users/register
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // 1. Kiểm tra email đã tồn tại chưa
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email đã được sử dụng' });
        }

        // 2. Tạo người dùng mới (mật khẩu sẽ tự động được mã hóa bởi middleware trong model)
        const user = await User.create({
            name,
            email,
            password,
        });

        // 3. Trả về thông tin người dùng và token
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc    Đăng nhập người dùng
// @route   POST /api/users/login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Tìm người dùng bằng email
        const user = await User.findOne({ email });

        // 2. Nếu tìm thấy, so sánh mật khẩu đã mã hóa
        if (user && (await bcrypt.compare(password, user.password))) {
            // 3. Nếu mật khẩu khớp, trả về thông tin và token
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Email hoặc mật khẩu không hợp lệ' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

module.exports = { registerUser, loginUser };