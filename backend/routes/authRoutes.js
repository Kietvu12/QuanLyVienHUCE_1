const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Đăng nhập (public)
router.post('/login', authController.login);

// Đăng ký (chỉ dành cho admin/hiệu trưởng)
router.post('/register', authenticate, authorize('hieu_truong'), authController.register);

// Lấy thông tin profile (cần đăng nhập)
router.get('/profile', authenticate, authController.getProfile);

// Đổi mật khẩu (cần đăng nhập)
router.put('/change-password', authenticate, authController.changePassword);

module.exports = router;

