const express = require('express');
const router = express.Router();
const baoHiemYTeController = require('../controllers/baoHiemYTeController');
const { authenticate, authorizeMinRole } = require('../middleware/authMiddleware');

// Tất cả routes đều cần authentication
router.use(authenticate);

// Lấy danh sách bảo hiểm y tế (tất cả roles đều có thể xem)
router.get('/', baoHiemYTeController.getAllBaoHiemYTe);

// Lấy bảo hiểm y tế theo ID (tất cả roles đều có thể xem)
router.get('/:id', baoHiemYTeController.getBaoHiemYTeById);

// Tạo bảo hiểm y tế mới (chỉ vien_truong trở lên)
router.post('/', authorizeMinRole('vien_truong'), baoHiemYTeController.createBaoHiemYTe);

// Cập nhật bảo hiểm y tế (chỉ vien_truong trở lên)
router.put('/:id', authorizeMinRole('vien_truong'), baoHiemYTeController.updateBaoHiemYTe);

// Xóa bảo hiểm y tế (chỉ vien_truong trở lên)
router.delete('/:id', authorizeMinRole('vien_truong'), baoHiemYTeController.deleteBaoHiemYTe);

module.exports = router;

