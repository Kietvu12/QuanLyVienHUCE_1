const express = require('express');
const router = express.Router();
const phongBanController = require('../controllers/phongBanController');
const { authenticate, authorizeMinRole } = require('../middleware/authMiddleware');

// Tất cả routes đều cần authentication
router.use(authenticate);

// Lấy danh sách phòng ban (tất cả roles đều có thể xem)
router.get('/', phongBanController.getAllPhongBan);

// Lấy phòng ban theo ID (tất cả roles đều có thể xem)
router.get('/:id', phongBanController.getPhongBanById);

// Tạo phòng ban mới (chỉ vien_truong trở lên)
router.post('/', authorizeMinRole('vien_truong'), phongBanController.createPhongBan);

// Cập nhật phòng ban (chỉ vien_truong trở lên)
router.put('/:id', authorizeMinRole('vien_truong'), phongBanController.updatePhongBan);

// Xóa phòng ban (chỉ vien_truong trở lên)
router.delete('/:id', authorizeMinRole('vien_truong'), phongBanController.deletePhongBan);

module.exports = router;

