const express = require('express');
const router = express.Router();
const nghiaVuNopController = require('../controllers/nghiaVuNopController');
const { authenticate, authorize, authorizeMinRole } = require('../middleware/authMiddleware');

// Tất cả routes đều cần authenticate
router.use(authenticate);

// GET routes - cho phép ke_toan_vien và vien_truong xem
router.get('/', authorize('ke_toan_vien', 'vien_truong', 'cap_phong', 'hieu_truong'), nghiaVuNopController.getAllNghiaVuNop);
router.get('/statistics', authorize('ke_toan_vien', 'vien_truong', 'cap_phong', 'hieu_truong'), nghiaVuNopController.getCongNoStatistics);
router.get('/:id', authorize('ke_toan_vien', 'vien_truong', 'cap_phong', 'hieu_truong'), nghiaVuNopController.getNghiaVuNopById);

// POST routes - cho phép ke_toan_vien và vien_truong thanh toán công nợ
router.post('/thanh-toan', authorize('ke_toan_vien', 'vien_truong', 'cap_phong', 'hieu_truong'), nghiaVuNopController.thanhToanCongNo);

module.exports = router;

