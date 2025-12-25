const express = require('express');
const router = express.Router();
const thongTinXeController = require('../controllers/thongTinXeController');
const xeStatisticsController = require('../controllers/xeStatisticsController');
const { authenticate, authorizeMinRole } = require('../middleware/authMiddleware');

// Tất cả routes đều cần authentication
router.use(authenticate);

// Thống kê xe
router.get('/statistics', xeStatisticsController.getXeStatistics);

// Lấy danh sách thông tin xe (tất cả roles đều có thể xem)
router.get('/', thongTinXeController.getAllThongTinXe);

// Lấy thông tin xe theo ID (tất cả roles đều có thể xem)
router.get('/:id', thongTinXeController.getThongTinXeById);

// Tạo thông tin xe mới (chỉ vien_truong trở lên)
router.post('/', authorizeMinRole('vien_truong'), thongTinXeController.createThongTinXe);

// Cập nhật thông tin xe (chỉ vien_truong trở lên)
router.put('/:id', authorizeMinRole('vien_truong'), thongTinXeController.updateThongTinXe);

// Xóa thông tin xe (chỉ vien_truong trở lên)
router.delete('/:id', authorizeMinRole('vien_truong'), thongTinXeController.deleteThongTinXe);

module.exports = router;
