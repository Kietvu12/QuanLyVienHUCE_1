const express = require('express');
const router = express.Router();
const vienController = require('../controllers/vienController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Lấy tất cả viện
router.get('/', authenticate, vienController.getAllVien);

// Lấy viện theo ID
router.get('/:id', authenticate, vienController.getVienById);

// Tạo viện mới (chỉ hiệu trưởng)
router.post('/', authenticate, authorize('hieu_truong'), vienController.createVien);

// Cập nhật viện (chỉ hiệu trưởng)
router.put('/:id', authenticate, authorize('hieu_truong'), vienController.updateVien);

// Xóa viện (chỉ hiệu trưởng)
router.delete('/:id', authenticate, authorize('hieu_truong'), vienController.deleteVien);

module.exports = router;

