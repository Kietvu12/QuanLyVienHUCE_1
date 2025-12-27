const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const {
  getAllThongBao,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteThongBao
} = require('../controllers/thongBaoController');

// Tất cả routes đều cần xác thực
router.use(authenticate);

// Lấy danh sách thông báo
router.get('/', getAllThongBao);

// Đếm số thông báo chưa đọc
router.get('/unread-count', getUnreadCount);

// Đánh dấu thông báo đã đọc
router.put('/:id/read', markAsRead);

// Đánh dấu tất cả thông báo đã đọc
router.put('/mark-all-read', markAllAsRead);

// Xóa thông báo
router.delete('/:id', deleteThongBao);

module.exports = router;

